"""
LTC-based flight controller for C-DAWN.

A Liquid Time-Constant network (Hasani et al., 2021) used as the position /
velocity control law for the multirotor. The input-dependent time constant
tau(x, I) lets the network run "fast" when it is being hit by a gust and
"slow" when it is holding station, without any per-regime gain scheduling.

Why this can beat a fixed-gain cascaded PID
-------------------------------------------
The controller is trained against a *privileged* expert that has access to
the true instantaneous wind vector and can cancel the drag force exactly
(see `ltc.expert`). The LTC student never sees the true wind — only the
aircraft's noisy, lagged onboard estimate. Its continuous-time hidden state
gives it somewhere to accumulate that noisy evidence over time, which is how
it recovers a usable disturbance estimate the memoryless PID baseline cannot
form. The claim is therefore a specific, testable one, and `bench/ltc_vs_pid.py`
tests it on identical gust profiles.

Input (15D, all normalised)
    position error       (3)   target - current, /20 m
    velocity error       (3)   setpoint - current, /10 m/s
    velocity             (3)   /20 m/s
    onboard wind estimate(3)   /15 m/s
    body-z axis          (3)   current attitude

Output (4D)
    acceleration command (3)   scaled to +/- max_accel
    yaw rate             (1)

Gravity compensation is added analytically rather than learned — every real
autopilot has a mass estimate, and making the network rediscover 9.81 would
waste capacity without proving anything.
"""

import numpy as np
import torch
import torch.nn as nn
from pathlib import Path
from typing import Optional, Tuple

from .ltc_cell import LTCCell


# Normalisation scales — must match between training and inference
POS_SCALE = 20.0
VEL_SCALE = 10.0
SPEED_SCALE = 20.0
WIND_SCALE = 15.0


def build_observation(
    position_error: np.ndarray,
    velocity_error: np.ndarray,
    velocity: np.ndarray,
    wind_estimate: np.ndarray,
    body_z: np.ndarray,
) -> np.ndarray:
    """Assemble and normalise the 15D controller observation."""
    return np.concatenate([
        np.clip(np.asarray(position_error) / POS_SCALE, -4.0, 4.0),
        np.clip(np.asarray(velocity_error) / VEL_SCALE, -4.0, 4.0),
        np.clip(np.asarray(velocity) / SPEED_SCALE, -4.0, 4.0),
        np.clip(np.asarray(wind_estimate) / WIND_SCALE, -4.0, 4.0),
        np.asarray(body_z),
    ]).astype(np.float32)


class LTCFlightController(nn.Module):
    """Liquid Time-Constant position/velocity controller."""

    INPUT_DIM = 15
    OUTPUT_DIM = 4

    def __init__(
        self,
        hidden_size: int = 40,
        num_ode_steps: int = 4,
        mass: float = 1.9,
        max_thrust: float = 42.0,
        # 18 m/s^2, not 12: the expert's label is (tracking accel, clipped to
        # 12) plus its drag-cancellation term, which at a 14 m/s gust adds
        # ~4 m/s^2. A tighter output range would clip the very supervision
        # signal the student is meant to learn.
        max_accel: float = 18.0,
        max_yaw_rate: float = 2.0,
    ):
        super().__init__()
        self.hidden_size = hidden_size
        self.mass = mass
        self.max_thrust = max_thrust
        self.max_accel = max_accel
        self.max_yaw_rate = max_yaw_rate

        self.ltc = LTCCell(
            input_size=self.INPUT_DIM,
            hidden_size=hidden_size,
            num_ode_steps=num_ode_steps,
        )

        self.output_net = nn.Sequential(
            nn.Linear(hidden_size, 24),
            nn.Tanh(),
            nn.Linear(24, self.OUTPUT_DIM),
            nn.Tanh(),
        )

        self._hidden: Optional[torch.Tensor] = None

    # -- torch interface ----------------------------------------------------

    def forward(
        self,
        observation: torch.Tensor,
        h_prev: Optional[torch.Tensor] = None,
        dt: float = 0.02,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Args:
            observation: [batch, 15] normalised observation
            h_prev: [batch, hidden] previous liquid state
            dt: integration step (seconds)

        Returns:
            (action, h_new) where action is [batch, 4] in normalised [-1, 1].
        """
        h_new, _ = self.ltc(observation, h_prev, dt)
        return self.output_net(h_new), h_new

    def reset_hidden(self, batch_size: int = 1):
        self._hidden = torch.zeros(batch_size, self.hidden_size)

    # -- numpy inference interface -----------------------------------------

    @torch.no_grad()
    def compute_control(
        self,
        position_error: np.ndarray,
        velocity: np.ndarray,
        wind_estimate: np.ndarray,
        yaw_error: float = 0.0,
        dt: float = 0.02,
        velocity_setpoint: Optional[np.ndarray] = None,
        body_z: Optional[np.ndarray] = None,
    ) -> Tuple[np.ndarray, float]:
        """
        Single-step inference. Returns (world-frame force N [3], yaw rate).

        Mirrors :meth:`ltc.pid_baseline.CascadedPIDFlightController.compute_control`
        exactly so the two controllers are drop-in interchangeable.
        """
        velocity = np.asarray(velocity, dtype=np.float64)
        vel_sp = (np.zeros(3) if velocity_setpoint is None
                  else np.asarray(velocity_setpoint, dtype=np.float64))
        body_z = np.array([0.0, 0.0, 1.0]) if body_z is None else np.asarray(body_z)

        obs = build_observation(
            position_error=position_error,
            velocity_error=vel_sp - velocity,
            velocity=velocity,
            wind_estimate=wind_estimate,
            body_z=body_z,
        )

        obs_t = torch.from_numpy(obs).unsqueeze(0)
        if self._hidden is None:
            self._hidden = torch.zeros(1, self.hidden_size)

        action, self._hidden = self.forward(obs_t, self._hidden, dt)
        action_np = action.squeeze(0).numpy()

        accel = action_np[:3] * self.max_accel
        yaw_rate = float(action_np[3]) * self.max_yaw_rate

        # Analytic gravity compensation
        force = self.mass * (accel + np.array([0.0, 0.0, 9.81]))

        mag = float(np.linalg.norm(force))
        if mag > self.max_thrust:
            force *= self.max_thrust / mag

        return force, yaw_rate

    # -- persistence --------------------------------------------------------

    def count_parameters(self) -> int:
        return sum(p.numel() for p in self.parameters() if p.requires_grad)

    def save(self, path: str):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        torch.save({
            "state_dict": self.state_dict(),
            "hidden_size": self.hidden_size,
            "mass": self.mass,
            "max_accel": self.max_accel,
            "max_thrust": self.max_thrust,
        }, path)

    @classmethod
    def load(cls, path: str, **overrides) -> "LTCFlightController":
        ckpt = torch.load(path, map_location="cpu", weights_only=False)
        model = cls(
            hidden_size=ckpt.get("hidden_size", 40),
            mass=overrides.get("mass", ckpt.get("mass", 1.9)),
            max_thrust=overrides.get("max_thrust", ckpt.get("max_thrust", 42.0)),
            max_accel=ckpt.get("max_accel", 18.0),
        )
        model.load_state_dict(ckpt["state_dict"])
        model.eval()
        return model


def load_or_default(path: str = "models/ltc_controller.pt",
                    **kwargs) -> Tuple[LTCFlightController, bool]:
    """
    Load trained weights if present.

    Returns (controller, is_trained). An untrained LTC must never be allowed
    to fly the demo silently — the caller is expected to fall back to PID and
    say so on the dashboard.
    """
    p = Path(path)
    if p.exists():
        try:
            return LTCFlightController.load(str(p), **kwargs), True
        except Exception:
            pass
    return LTCFlightController(**kwargs), False


def make_ltc_controller_hook(controller: LTCFlightController):
    """Wrap an LTC controller as a simulation-runner hook."""
    def controller_hook(drone, wind_vel, sim_time, dt):
        if drone.target_position is None:
            drone.thrust_command = np.array([0.0, 0.0, controller.mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        from sim.physics import FlightDynamics
        body_z = FlightDynamics.quaternion_to_rotation_matrix(drone.orientation)[:, 2]

        force, yaw_rate = controller.compute_control(
            position_error=drone.target_position - drone.position,
            velocity=drone.velocity,
            wind_estimate=drone.sensors.wind_estimate,
            yaw_error=0.0,
            dt=dt,
            velocity_setpoint=drone.target_velocity,
            body_z=body_z,
        )
        drone.thrust_command = force
        drone.yaw_rate_command = yaw_rate

    return controller_hook
