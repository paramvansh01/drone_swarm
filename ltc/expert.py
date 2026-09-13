"""
Privileged expert controller used to supervise the LTC student.

The expert is allowed information the deployed controller never gets: the
exact instantaneous wind vector at the aircraft. With it, the expert can
cancel the aerodynamic drag force analytically instead of waiting for an
integrator to wind up against it.

This is a standard privileged-teacher / partially-observed-student setup.
The point is not that the expert is deployable — it is not, because nothing
on a real airframe measures true instantaneous wind. The point is that it
defines the control law a wind-aware policy *should* converge to, giving the
LTC student a target that a memoryless PID on noisy estimates cannot reach.

What the student must learn on its own is the hard part: recovering a usable
wind estimate from a noisy, lagged onboard signal, which is precisely what
the liquid hidden state is for.
"""

import numpy as np
from typing import Tuple

from .pid_baseline import PIDController


class PrivilegedExpert:
    """Cascaded position/velocity controller with exact drag feedforward."""

    def __init__(
        self,
        mass: float = 1.9,
        max_thrust: float = 42.0,
        max_speed: float = 22.0,
        max_accel: float = 12.0,
        max_yaw_rate: float = 2.0,
        drag_coeff: float = 0.040,
    ):
        self.mass = mass
        self.max_thrust = max_thrust
        self.max_speed = max_speed
        self.max_accel = max_accel
        self.max_yaw_rate = max_yaw_rate
        self.drag_coeff = drag_coeff

        # Tighter than the deployable baseline: with drag cancelled, the
        # remaining plant is close to a double integrator, so the expert can
        # run higher gain without exciting the disturbance it just removed.
        self.kp_pos = np.array([1.9, 1.9, 2.2])
        self.vel_pid = [
            PIDController(kp=4.6, ki=0.7, kd=0.22, output_limit=12.0, integral_limit=4.0)
            for _ in range(3)
        ]
        self.yaw_pid = PIDController(kp=2.2, ki=0.0, kd=0.25, output_limit=max_yaw_rate)

    def compute_control(
        self,
        position_error: np.ndarray,
        velocity: np.ndarray,
        true_wind: np.ndarray,
        yaw_error: float = 0.0,
        dt: float = 0.02,
        velocity_setpoint: np.ndarray = None,
    ) -> Tuple[np.ndarray, float]:
        """Returns (world-frame force N [3], yaw rate) — same contract as the student."""
        position_error = np.asarray(position_error, dtype=np.float64)
        velocity = np.asarray(velocity, dtype=np.float64)
        true_wind = np.asarray(true_wind, dtype=np.float64)

        vel_sp = self.kp_pos * position_error
        if velocity_setpoint is not None:
            vel_sp = vel_sp + np.asarray(velocity_setpoint, dtype=np.float64)

        mag = float(np.linalg.norm(vel_sp))
        if mag > self.max_speed:
            vel_sp *= self.max_speed / mag

        vel_error = vel_sp - velocity
        accel = np.array([
            self.vel_pid[i].compute(vel_error[i], dt) for i in range(3)
        ])
        accel = np.clip(accel, -self.max_accel, self.max_accel)

        # --- exact drag cancellation (the privileged part) -----------------
        airspeed = velocity - true_wind
        speed = float(np.linalg.norm(airspeed))
        drag = np.zeros(3)
        if speed > 1e-3:
            drag = -(airspeed / speed) * self.drag_coeff * speed * speed

        # Add the force that exactly opposes drag, on top of the tracking term
        force = self.mass * (accel + np.array([0.0, 0.0, 9.81])) - drag

        fmag = float(np.linalg.norm(force))
        if fmag > self.max_thrust:
            force *= self.max_thrust / fmag

        yaw_rate = self.yaw_pid.compute(yaw_error, dt)
        return force, yaw_rate

    def action_from_force(self, force: np.ndarray) -> np.ndarray:
        """
        Invert the student's output parameterisation.

        The LTC emits a normalised acceleration in [-1, 1]; to imitate the
        expert we need the expert's force expressed in that same space.
        """
        accel = force / self.mass - np.array([0.0, 0.0, 9.81])
        return np.clip(accel / self.max_accel, -1.0, 1.0)

    def reset(self):
        for pid in self.vel_pid:
            pid.reset()
        self.yaw_pid.reset()
