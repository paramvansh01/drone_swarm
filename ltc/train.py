"""
Training pipeline for the LTC flight controller.

Method: DAgger (Ross et al., 2011) against the privileged expert.

Naive behavioural cloning on expert trajectories fails here for the usual
reason — the student only ever sees states the *expert* visits, so the first
time its own small error takes it somewhere unfamiliar the error compounds.
DAgger fixes this by rolling out the student and labelling the states it
actually reaches with what the expert would have done there.

Critically, rollouts run in the **real** `sim.physics.FlightDynamics`, with
the same attitude lag, drag model and lagged/noisy wind estimator used at
deployment. Training on a simplified surrogate and deploying on the real
plant is the classic way to get a controller that benchmarks well and flies
badly.

Usage:
    python -m ltc.train --iterations 6 --episodes 60 --epochs 12
"""

from __future__ import annotations

import argparse
import json
import logging
import time
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

from sim.physics import FlightDynamics
from .expert import PrivilegedExpert
from .ltc_controller import LTCFlightController, build_observation

logger = logging.getLogger("cdawn.ltc.train")

# Weight on the action-rate penalty (see train_epoch). Tuned so the penalty
# is a correction to the imitation objective rather than a competitor to it.
SMOOTHNESS_WEIGHT = 2.5


# --------------------------------------------------------------------------
# Episode environment
# --------------------------------------------------------------------------

@dataclass
class EpisodeConfig:
    """Domain randomisation ranges for a single training episode."""
    length: int = 300               # ticks (300 * 0.02s = 6s)
    dt: float = 0.02
    base_wind_max: float = 9.0      # m/s
    gust_magnitude_max: float = 14.0
    gust_probability: float = 0.55
    setpoint_speed_max: float = 16.0


class TrainingEpisode:
    """
    A single randomised tracking task with wind.

    The reference is a smoothly moving setpoint (not a step), because that is
    what the guidance layer actually feeds the controller in flight — a
    carrot point travelling along a route.
    """

    def __init__(self, rng: np.random.RandomState, config: EpisodeConfig):
        self.rng = rng
        self.cfg = config
        self.physics = FlightDynamics()

        # Randomised initial state
        self.position = np.array([0.0, 0.0, 120.0]) + rng.uniform(-8, 8, 3)
        self.velocity = rng.uniform(-3, 3, 3)
        self.orientation = np.array([1.0, 0.0, 0.0, 0.0])
        self.angular_velocity = np.zeros(3)

        # Reference: a path point travelling at constant velocity, from which
        # a *carrot* setpoint is derived exactly as `sim.guidance` does — the
        # carrot is clamped to a bounded lookahead distance ahead of the
        # aircraft. Without that clamp the reference simply outruns the
        # airframe and the tracking error grows without bound, which is not a
        # regime the deployed controller ever encounters.
        self.path_point = self.position + rng.uniform(-20, 20, 3)
        sp_dir = rng.normal(0, 1, 3)
        sp_dir /= np.linalg.norm(sp_dir) + 1e-9
        self.path_speed = rng.uniform(0.0, config.setpoint_speed_max)
        self.path_vel = sp_dir * self.path_speed
        self.lookahead = rng.uniform(25.0, 60.0)

        self.setpoint = self.path_point.copy()
        self.setpoint_vel = self.path_vel.copy()

        # Wind: steady component + optional gust train
        self.base_wind = rng.uniform(-1, 1, 3) * config.base_wind_max
        self.base_wind[2] *= 0.35
        self.gusts = self._make_gusts()

        # Onboard wind estimator state (mirrors sim.drone.Drone exactly)
        self.wind_estimate = self.base_wind.copy()
        self.est_tau = 0.65
        self.est_noise = 1.1

        self.t = 0.0

    def _make_gusts(self) -> List[dict]:
        gusts = []
        if self.rng.random() > self.cfg.gust_probability:
            return gusts
        n = self.rng.randint(1, 4)
        for _ in range(n):
            direction = self.rng.normal(0, 1, 3)
            direction /= np.linalg.norm(direction) + 1e-9
            gusts.append({
                "start": self.rng.uniform(0.5, self.cfg.length * self.cfg.dt - 1.0),
                "duration": self.rng.uniform(0.8, 3.0),
                "magnitude": self.rng.uniform(5.0, self.cfg.gust_magnitude_max),
                "direction": direction,
            })
        return gusts

    def true_wind(self) -> np.ndarray:
        """Instantaneous wind vector, including any active gust."""
        wind = self.base_wind.copy()
        for g in self.gusts:
            rel = self.t - g["start"]
            if 0.0 <= rel <= g["duration"]:
                # 1-cosine gust profile (the standard discrete gust shape)
                phase = rel / g["duration"]
                envelope = 0.5 * (1.0 - np.cos(2.0 * np.pi * phase))
                wind = wind + g["direction"] * g["magnitude"] * envelope
        # Continuous low-level turbulence
        wind = wind + self.rng.normal(0, 0.45, 3)
        return wind

    def update_wind_estimate(self, wind: np.ndarray):
        alpha = self.cfg.dt / (self.est_tau + self.cfg.dt)
        noisy = wind + self.rng.normal(0, self.est_noise, 3)
        self.wind_estimate += alpha * (noisy - self.wind_estimate)

    def advance_setpoint(self):
        """Advance the path point, then re-derive the carrot from it."""
        self.path_point = self.path_point + self.path_vel * self.cfg.dt

        # Occasional manoeuvre, so the student sees reference changes
        if self.rng.random() < 0.004:
            d = self.rng.normal(0, 1, 3)
            d /= np.linalg.norm(d) + 1e-9
            self.path_speed = self.rng.uniform(0.0, self.cfg.setpoint_speed_max)
            self.path_vel = d * self.path_speed

        # Carrot rule, identical to GuidanceLayer._update_routed
        to_path = self.path_point - self.position
        dist = float(np.linalg.norm(to_path))
        if dist > 1e-6:
            direction = to_path / dist
            self.setpoint = self.position + direction * min(self.lookahead, dist)
            self.setpoint_vel = direction * min(self.path_speed, max(dist * 0.8, 1.0))
        else:
            self.setpoint = self.path_point.copy()
            self.setpoint_vel = np.zeros(3)

    def cross_track_error(self) -> float:
        """
        Perpendicular distance from the aircraft to the reference path.

        This, not distance-to-carrot, is the meaningful tracking metric: the
        carrot deliberately sits a lookahead ahead of the aircraft, so
        distance to it is dominated by that design offset. Cross-track error
        isolates how far wind has pushed the aircraft *off* its intended
        track, which is exactly the quantity the LTC-vs-PID claim is about.
        """
        offset = self.position - self.path_point
        speed = float(np.linalg.norm(self.path_vel))
        if speed < 1e-3:
            return float(np.linalg.norm(offset))
        direction = self.path_vel / speed
        along = float(np.dot(offset, direction))
        return float(np.linalg.norm(offset - along * direction))

    def body_z(self) -> np.ndarray:
        return self.physics.quaternion_to_rotation_matrix(self.orientation)[:, 2]

    def observation(self) -> np.ndarray:
        return build_observation(
            position_error=self.setpoint - self.position,
            velocity_error=self.setpoint_vel - self.velocity,
            velocity=self.velocity,
            wind_estimate=self.wind_estimate,
            body_z=self.body_z(),
        )

    def step(self, force: np.ndarray, yaw_rate: float, wind: np.ndarray):
        result = self.physics.step(
            position=self.position,
            velocity=self.velocity,
            orientation=self.orientation,
            angular_velocity=self.angular_velocity,
            thrust_command=force,
            yaw_rate_command=yaw_rate,
            wind_velocity=wind,
            dt=self.cfg.dt,
            ground_height=-1e6,      # no ground during controller training
        )
        self.position = result["position"]
        self.velocity = result["velocity"]
        self.orientation = result["orientation"]
        self.angular_velocity = result["angular_velocity"]
        self.t += self.cfg.dt


# --------------------------------------------------------------------------
# Rollout / data collection
# --------------------------------------------------------------------------

def rollout_episode(
    student: LTCFlightController | None,
    beta: float,
    rng: np.random.RandomState,
    config: EpisodeConfig,
) -> Tuple[np.ndarray, np.ndarray, float]:
    """
    Run one episode, mixing student and expert actions with probability beta
    (beta = 1.0 -> pure expert).

    Returns (observations [T, 15], expert_actions [T, 4], rms_error).
    """
    env = TrainingEpisode(rng, config)
    expert = PrivilegedExpert()

    if student is not None:
        student.reset_hidden(1)
        hidden = torch.zeros(1, student.hidden_size)
    else:
        hidden = None

    observations, actions = [], []
    sq_errors = []

    use_expert_this_episode = student is None or rng.random() < beta

    for _ in range(config.length):
        wind = env.true_wind()
        env.update_wind_estimate(wind)

        obs = env.observation()

        # Expert label at THIS state — the core of DAgger
        expert_force, expert_yaw = expert.compute_control(
            position_error=env.setpoint - env.position,
            velocity=env.velocity,
            true_wind=wind,
            yaw_error=0.0,
            dt=config.dt,
            velocity_setpoint=env.setpoint_vel,
        )
        expert_accel_norm = expert.action_from_force(expert_force)
        label = np.concatenate([expert_accel_norm,
                                [expert_yaw / expert.max_yaw_rate]]).astype(np.float32)

        observations.append(obs)
        actions.append(label)

        # Choose the action that is actually executed
        if use_expert_this_episode:
            force, yaw_rate = expert_force, expert_yaw
        else:
            with torch.no_grad():
                obs_t = torch.from_numpy(obs).unsqueeze(0)
                action, hidden = student(obs_t, hidden, config.dt)
            a = action.squeeze(0).numpy()
            accel = a[:3] * student.max_accel
            yaw_rate = float(a[3]) * student.max_yaw_rate
            force = student.mass * (accel + np.array([0.0, 0.0, 9.81]))
            fmag = float(np.linalg.norm(force))
            if fmag > student.max_thrust:
                force *= student.max_thrust / fmag

        env.step(force, yaw_rate, wind)
        env.advance_setpoint()

        sq_errors.append(env.cross_track_error() ** 2)

        # Abort a diverged rollout rather than poisoning the dataset with
        # thousands of samples from a state no sane controller reaches
        if np.linalg.norm(env.path_point - env.position) > 400.0:
            break

    # Score only the steady-state portion. The first part of every episode is
    # the aircraft capturing a randomly offset setpoint; including it would
    # let the initial-condition draw dominate the metric and mask the actual
    # difference in disturbance rejection, which is what we care about.
    settle = int(len(sq_errors) * 0.4)
    steady = sq_errors[settle:] or sq_errors
    rms = float(np.sqrt(np.mean(steady))) if steady else float("inf")
    return np.array(observations), np.array(actions), rms


def collect_dataset(
    student: LTCFlightController | None,
    beta: float,
    episodes: int,
    rng: np.random.RandomState,
    config: EpisodeConfig,
) -> Tuple[np.ndarray, np.ndarray, float]:
    """Collect a batch of equal-length episodes for BPTT training."""
    obs_list, act_list, rms_list = [], [], []

    for _ in range(episodes):
        obs, act, rms = rollout_episode(student, beta, rng, config)
        if len(obs) < config.length:
            continue                      # skip truncated/diverged rollouts
        obs_list.append(obs)
        act_list.append(act)
        rms_list.append(rms)

    if not obs_list:
        raise RuntimeError("All rollouts diverged — cannot build a dataset.")

    return (np.stack(obs_list), np.stack(act_list),
            float(np.mean(rms_list)))


# --------------------------------------------------------------------------
# Training
# --------------------------------------------------------------------------

def train_epoch(
    student: LTCFlightController,
    obs: torch.Tensor,
    act: torch.Tensor,
    optimizer: optim.Optimizer,
    criterion: nn.Module,
    batch_size: int,
    dt: float,
    grad_clip: float = 1.0,
) -> float:
    """One pass of truncated BPTT over the whole episode length."""
    student.train()
    n = obs.shape[0]
    perm = torch.randperm(n)
    total, batches = 0.0, 0

    for i in range(0, n, batch_size):
        idx = perm[i:i + batch_size]
        batch_obs, batch_act = obs[idx], act[idx]

        hidden = None
        outputs = []
        for t in range(batch_obs.shape[1]):
            action, hidden = student(batch_obs[:, t, :], hidden, dt)
            outputs.append(action)

        pred = torch.stack(outputs, dim=1)
        imitation = criterion(pred, batch_act)

        # Action-rate penalty.
        #
        # Pure imitation leaves residual error that shows up as high-frequency
        # jitter on the command, and on a real airframe jitter is not free:
        # the first benchmark of this controller matched the expert's tracking
        # reasonably but burned 2.7x the control effort of the PID baseline,
        # which on hardware is wasted battery, hot motors and excited
        # structural modes. Penalising the step-to-step change in the command
        # buys smoothness for a small amount of tracking accuracy.
        action_rate = pred[:, 1:, :] - pred[:, :-1, :]
        smoothness = (action_rate ** 2).mean()

        loss = imitation + SMOOTHNESS_WEIGHT * smoothness

        optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(student.parameters(), grad_clip)
        optimizer.step()

        total += loss.item()
        batches += 1

    return total / max(batches, 1)


def train_ltc_controller(
    iterations: int = 6,
    episodes_per_iter: int = 60,
    epochs_per_iter: int = 12,
    batch_size: int = 16,
    learning_rate: float = 2e-3,
    hidden_size: int = 40,
    episode_length: int = 300,
    save_path: str = "models/ltc_controller.pt",
    metrics_path: str = "models/ltc_training_metrics.json",
    seed: int = 42,
) -> dict:
    """Run the full DAgger training loop and save the best checkpoint."""
    rng = np.random.RandomState(seed)
    torch.manual_seed(seed)

    config = EpisodeConfig(length=episode_length)
    student = LTCFlightController(hidden_size=hidden_size)
    param_count = student.count_parameters()
    logger.info("LTC controller parameters: %d (budget 20,000)", param_count)
    if param_count > 20_000:
        logger.warning("Parameter count exceeds the 20k edge budget!")

    optimizer = optim.Adam(student.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=iterations)
    criterion = nn.SmoothL1Loss(beta=0.1)

    agg_obs: List[np.ndarray] = []
    agg_act: List[np.ndarray] = []

    metrics = {
        "param_count": param_count,
        "iterations": [],
        "config": {
            "episodes_per_iter": episodes_per_iter,
            "epochs_per_iter": epochs_per_iter,
            "episode_length": episode_length,
            "hidden_size": hidden_size,
            "learning_rate": learning_rate,
            "seed": seed,
        },
    }

    best_rms = float("inf")
    t_start = time.time()

    for it in range(iterations):
        # beta: 1.0 on the first pass (pure expert), decaying afterwards so
        # the dataset progressively covers the student's own state
        # distribution rather than the expert's.
        beta = 1.0 if it == 0 else max(0.0, 0.5 ** it)

        obs_np, act_np, rollout_rms = collect_dataset(
            None if it == 0 else student, beta, episodes_per_iter, rng, config
        )
        agg_obs.append(obs_np)
        agg_act.append(act_np)

        obs = torch.from_numpy(np.concatenate(agg_obs)).float()
        act = torch.from_numpy(np.concatenate(agg_act)).float()

        logger.info(
            "DAgger iter %d/%d | beta=%.2f | rollout RMS=%.3f m | dataset=%d episodes",
            it + 1, iterations, beta, rollout_rms, obs.shape[0],
        )

        last_loss = 0.0
        for epoch in range(epochs_per_iter):
            last_loss = train_epoch(student, obs, act, optimizer,
                                    criterion, batch_size, config.dt)
            if (epoch + 1) % 4 == 0:
                logger.info("    epoch %2d/%d  loss=%.6f",
                            epoch + 1, epochs_per_iter, last_loss)

        # Evaluate the student on its own (beta = 0) to get an honest number
        eval_rng = np.random.RandomState(seed + 10_000 + it)
        eval_rms = []
        for _ in range(12):
            _, _, rms = rollout_episode(student, 0.0, eval_rng, config)
            eval_rms.append(rms)
        mean_eval = float(np.mean(eval_rms))

        metrics["iterations"].append({
            "iteration": it + 1,
            "beta": beta,
            "train_loss": last_loss,
            "rollout_rms_m": rollout_rms,
            "student_eval_rms_m": mean_eval,
            "dataset_episodes": int(obs.shape[0]),
        })
        logger.info("    student closed-loop RMS: %.3f m", mean_eval)

        if mean_eval < best_rms:
            best_rms = mean_eval
            student.save(save_path)
            logger.info("    -> new best, saved to %s", save_path)

        scheduler.step()

    metrics["best_student_rms_m"] = best_rms
    metrics["train_time_s"] = time.time() - t_start

    Path(metrics_path).parent.mkdir(parents=True, exist_ok=True)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    logger.info("Training complete in %.1fs | best closed-loop RMS %.3f m",
                metrics["train_time_s"], best_rms)
    return metrics


def main():
    parser = argparse.ArgumentParser(description="Train the C-DAWN LTC flight controller")
    parser.add_argument("--iterations", type=int, default=6)
    parser.add_argument("--episodes", type=int, default=60)
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--hidden", type=int, default=40)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--lr", type=float, default=2e-3)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--out", type=str, default="models/ltc_controller.pt")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s %(message)s",
        datefmt="%H:%M:%S",
    )

    metrics = train_ltc_controller(
        iterations=args.iterations,
        episodes_per_iter=args.episodes,
        epochs_per_iter=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr,
        hidden_size=args.hidden,
        save_path=args.out,
        seed=args.seed,
    )
    print(json.dumps({
        "param_count": metrics["param_count"],
        "best_student_rms_m": metrics["best_student_rms_m"],
        "train_time_s": round(metrics["train_time_s"], 1),
    }, indent=2))


if __name__ == "__main__":
    main()
