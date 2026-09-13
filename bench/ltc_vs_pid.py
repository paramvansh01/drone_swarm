"""
LTC vs cascaded PID, on identical wind.

Section 2.1 of the proposal promises that "more stable under shocks" is shown
as a plot rather than asserted. This is the experiment behind that plot.

Protocol
--------
For each trial, one gust profile and one reference trajectory are generated
and then replayed twice — once with the trained LTC flying, once with the
cascaded PID flying. Both start from the same state and see the same
disturbance sequence, because the wind is generated from a seeded RNG that is
reset between runs rather than sampled live. Any difference in the result is
therefore attributable to the controller and not to a lucky draw of weather.

Reported statistics
-------------------
    cross-track RMS      steady-state deviation from the intended path
    peak excursion       worst displacement during a gust (the "shock" number)
    settling time        time to return within 2 m after the gust ends
    control effort       mean commanded acceleration, so a controller cannot
                         win simply by spending unlimited thrust

Both mean and standard deviation over all trials are reported, and the
per-trial trajectories are saved so the overlay plot can be redrawn.
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path
from typing import Dict, List

import numpy as np

from ltc.ltc_controller import load_or_default
from ltc.pid_baseline import CascadedPIDFlightController
from sim.physics import FlightDynamics

logger = logging.getLogger("cdawn.bench.control")


DT = 0.02
EPISODE_LEN = 700          # 14 s
GUST_START = 4.0
GUST_DURATION = 2.5


# The LTC was trained on gusts of 5-14 m/s. "In distribution" stays inside
# that envelope; "out of distribution" deliberately exceeds it, because the
# proposal's claim is specifically about *out-of-distribution aerodynamic
# shocks*, and a fixed-gain controller has no mechanism to adapt to a regime
# it was not tuned for.
GUST_RANGES = {
    "in_distribution": (9.0, 14.0),
    "out_of_distribution": (18.0, 26.0),
}


def make_gust_profile(rng: np.random.RandomState,
                      regime: str = "in_distribution") -> dict:
    """One randomised but reproducible wind scenario."""
    direction = rng.normal(0, 1, 3)
    direction[2] *= 0.3
    direction /= np.linalg.norm(direction) + 1e-9

    base = rng.uniform(-1, 1, 3) * 6.0
    base[2] *= 0.3

    low, high = GUST_RANGES[regime]

    return {
        "base": base,
        "gust_direction": direction,
        "gust_magnitude": rng.uniform(low, high),
        "regime": regime,
        "noise_seed": int(rng.randint(0, 1_000_000)),
    }


def wind_at(profile: dict, t: float, rng: np.random.RandomState) -> np.ndarray:
    wind = profile["base"].copy()
    rel = t - GUST_START
    if 0.0 <= rel <= GUST_DURATION:
        phase = rel / GUST_DURATION
        envelope = 0.5 * (1.0 - np.cos(2.0 * np.pi * phase))
        wind = wind + profile["gust_direction"] * profile["gust_magnitude"] * envelope
    return wind + rng.normal(0, 0.45, 3)


def run_trial(controller_kind: str, controller, profile: dict) -> dict:
    """
    Fly one episode. `controller` is reset by the caller between runs.

    The reference is a straight track flown at constant speed — deliberately
    simple, so the only thing being measured is disturbance rejection.
    """
    physics = FlightDynamics()

    # Identical noise stream for both controllers
    rng = np.random.RandomState(profile["noise_seed"])
    est_rng = np.random.RandomState(profile["noise_seed"] + 1)

    position = np.array([0.0, 0.0, 150.0])
    velocity = np.array([12.0, 0.0, 0.0])
    orientation = np.array([1.0, 0.0, 0.0, 0.0])
    omega = np.zeros(3)

    path_point = position.copy()
    path_vel = np.array([12.0, 0.0, 0.0])
    lookahead = 45.0

    wind_estimate = profile["base"].copy()
    est_tau = 0.65

    cross_track: List[float] = []
    trajectory: List[List[float]] = []
    efforts: List[float] = []
    times: List[float] = []

    for step in range(EPISODE_LEN):
        t = step * DT
        wind = wind_at(profile, t, rng)

        # Onboard estimator — identical model to sim.drone.Drone
        alpha = DT / (est_tau + DT)
        wind_estimate = wind_estimate + alpha * (
            (wind + est_rng.normal(0, 1.1, 3)) - wind_estimate)

        # Carrot setpoint from the reference path
        path_point = path_point + path_vel * DT
        to_path = path_point - position
        dist = float(np.linalg.norm(to_path))
        direction = to_path / max(dist, 1e-6)
        setpoint = position + direction * min(lookahead, dist)
        setpoint_vel = direction * min(12.0, max(dist * 0.8, 1.0))

        body_z = physics.quaternion_to_rotation_matrix(orientation)[:, 2]

        if controller_kind == "LTC":
            force, yaw_rate = controller.compute_control(
                position_error=setpoint - position,
                velocity=velocity,
                wind_estimate=wind_estimate,
                yaw_error=0.0,
                dt=DT,
                velocity_setpoint=setpoint_vel,
                body_z=body_z,
            )
        else:
            force, yaw_rate = controller.compute_control(
                position_error=setpoint - position,
                velocity=velocity,
                wind_estimate=wind_estimate,
                yaw_error=0.0,
                dt=DT,
                velocity_setpoint=setpoint_vel,
            )

        result = physics.step(
            position=position, velocity=velocity, orientation=orientation,
            angular_velocity=omega, thrust_command=force,
            yaw_rate_command=yaw_rate, wind_velocity=wind, dt=DT,
            ground_height=-1e6,
        )
        position = result["position"]
        velocity = result["velocity"]
        orientation = result["orientation"]
        omega = result["angular_velocity"]

        # Cross-track error against the reference line
        offset = position - path_point
        along = float(np.dot(offset, path_vel / np.linalg.norm(path_vel)))
        perpendicular = offset - along * (path_vel / np.linalg.norm(path_vel))
        cross_track.append(float(np.linalg.norm(perpendicular)))

        efforts.append(float(np.linalg.norm(force / 1.9 - np.array([0, 0, 9.81]))))
        trajectory.append([round(float(v), 2) for v in position])
        times.append(round(t, 3))

    cross_track = np.array(cross_track)
    settle_index = int(GUST_START / DT)
    gust_end_index = int((GUST_START + GUST_DURATION) / DT)

    # Steady-state RMS: after the initial capture, excluding the gust itself
    steady_mask = np.ones(len(cross_track), dtype=bool)
    steady_mask[:int(2.0 / DT)] = False
    steady_mask[settle_index:gust_end_index] = False

    # Settling time after the gust
    settling = None
    for i in range(gust_end_index, len(cross_track)):
        if cross_track[i] < 2.0:
            settling = (i - gust_end_index) * DT
            break

    return {
        "controller": controller_kind,
        "cross_track_rms_m": float(np.sqrt(np.mean(cross_track[steady_mask] ** 2))),
        "peak_excursion_m": float(np.max(cross_track[settle_index:gust_end_index + 120])),
        "settling_time_s": settling,
        "control_effort_ms2": float(np.mean(efforts)),
        "trajectory": trajectory[::5],
        "cross_track": [round(float(v), 3) for v in cross_track[::5]],
        "times": times[::5],
    }


def run_benchmark(trials: int = 20, seed: int = 1234,
                  model_path: str = "models/ltc_controller.pt",
                  regime: str = "in_distribution") -> dict:
    """Run the paired comparison and summarise."""
    ltc, trained = load_or_default(model_path)
    if not trained:
        logger.warning("No trained LTC weights at %s — the comparison is "
                       "meaningless against a randomly initialised network.",
                       model_path)

    rng = np.random.RandomState(seed)
    results = {"LTC": [], "PID": []}
    samples = []

    for trial in range(trials):
        profile = make_gust_profile(rng, regime)

        ltc.reset_hidden(1)
        ltc_result = run_trial("LTC", ltc, profile)

        pid = CascadedPIDFlightController()
        pid_result = run_trial("PID", pid, profile)

        results["LTC"].append(ltc_result)
        results["PID"].append(pid_result)

        if trial < 3:
            # Keep a few full traces for the overlay plot
            samples.append({
                "trial": trial,
                "gust_magnitude": profile["gust_magnitude"],
                "ltc": {k: ltc_result[k] for k in ("times", "cross_track")},
                "pid": {k: pid_result[k] for k in ("times", "cross_track")},
            })

        logger.info(
            "trial %2d/%d  gust %.1f m/s | LTC rms %.2f peak %.2f | PID rms %.2f peak %.2f",
            trial + 1, trials, profile["gust_magnitude"],
            ltc_result["cross_track_rms_m"], ltc_result["peak_excursion_m"],
            pid_result["cross_track_rms_m"], pid_result["peak_excursion_m"],
        )

    def summarise(kind: str) -> Dict[str, float]:
        entries = results[kind]
        settling = [e["settling_time_s"] for e in entries if e["settling_time_s"] is not None]
        return {
            "cross_track_rms_m_mean": float(np.mean([e["cross_track_rms_m"] for e in entries])),
            "cross_track_rms_m_std": float(np.std([e["cross_track_rms_m"] for e in entries])),
            "peak_excursion_m_mean": float(np.mean([e["peak_excursion_m"] for e in entries])),
            "peak_excursion_m_std": float(np.std([e["peak_excursion_m"] for e in entries])),
            "settling_time_s_mean": float(np.mean(settling)) if settling else None,
            "settled_fraction": len(settling) / len(entries),
            "control_effort_ms2_mean": float(np.mean([e["control_effort_ms2"] for e in entries])),
        }

    ltc_summary = summarise("LTC")
    pid_summary = summarise("PID")

    # Paired comparison: the same gust hit both controllers, so differences
    # are paired and the per-trial difference is the meaningful quantity.
    paired_rms = np.array([
        p["cross_track_rms_m"] - l["cross_track_rms_m"]
        for l, p in zip(results["LTC"], results["PID"])
    ])
    paired_peak = np.array([
        p["peak_excursion_m"] - l["peak_excursion_m"]
        for l, p in zip(results["LTC"], results["PID"])
    ])

    return {
        "trials": trials,
        "regime": regime,
        "gust_range_ms": GUST_RANGES[regime],
        "ltc_trained": trained,
        "LTC": ltc_summary,
        "PID": pid_summary,
        "paired_improvement": {
            "rms_m_mean": float(np.mean(paired_rms)),
            "rms_m_std": float(np.std(paired_rms)),
            "rms_ltc_better_in": int(np.sum(paired_rms > 0)),
            "peak_m_mean": float(np.mean(paired_peak)),
            "peak_ltc_better_in": int(np.sum(paired_peak > 0)),
            "note": ("Positive means the LTC held the track closer than the PID "
                     "on that trial. Paired over identical gust profiles."),
        },
        "sample_traces": samples,
    }


def main():
    parser = argparse.ArgumentParser(description="LTC vs PID benchmark")
    parser.add_argument("--trials", type=int, default=20)
    parser.add_argument("--seed", type=int, default=1234)
    parser.add_argument("--out", type=str, default="models/ltc_vs_pid.json")
    parser.add_argument("--regime", type=str, default="in_distribution",
                        choices=list(GUST_RANGES))
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    results = run_benchmark(trials=args.trials, seed=args.seed, regime=args.regime)

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "w") as f:
        json.dump(results, f, indent=2)

    print()
    print(f"{'metric':<28} {'LTC':>12} {'PID':>12}")
    print("-" * 54)
    for label, key in (
        ("cross-track RMS (m)", "cross_track_rms_m_mean"),
        ("peak gust excursion (m)", "peak_excursion_m_mean"),
        ("settling time (s)", "settling_time_s_mean"),
        ("control effort (m/s^2)", "control_effort_ms2_mean"),
    ):
        ltc_v = results["LTC"][key]
        pid_v = results["PID"][key]
        fmt = lambda v: f"{v:12.3f}" if isinstance(v, (int, float)) else f"{'n/a':>12}"
        print(f"{label:<28} {fmt(ltc_v)} {fmt(pid_v)}")

    imp = results["paired_improvement"]
    print()
    print(f"LTC held track closer in {imp['rms_ltc_better_in']}/{results['trials']} trials "
          f"(mean {imp['rms_m_mean']:+.3f} m)")
    print(f"LTC lower gust peak in   {imp['peak_ltc_better_in']}/{results['trials']} trials "
          f"(mean {imp['peak_m_mean']:+.3f} m)")
    print(f"\nSaved to {args.out}")


if __name__ == "__main__":
    main()
