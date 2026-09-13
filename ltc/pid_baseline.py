"""
Cascaded PID flight controller baseline for C-DAWN.

This is the control-engineering reference the LTC controller is measured
against. It is deliberately a *strong* baseline, structured the way a real
autopilot does it (PX4 / ArduPilot style):

    position error --P--> velocity setpoint --PID--> acceleration --> force

Gains are tuned for the 1.9 kg airframe in `sim.physics`, not left at
textbook defaults, because beating a badly-tuned baseline would prove
nothing. What it does *not* have is a wind-feedforward term — production
multirotor autopilots do not estimate and cancel wind either; they reject it
reactively through the integrator. That is exactly the gap the LTC
controller is claimed to close, and it is stated openly rather than
engineered into the baseline's disadvantage.
"""

import numpy as np
from typing import Tuple


class PIDController:
    """Single-axis PID with derivative filtering and proper anti-windup."""

    def __init__(self, kp: float, ki: float, kd: float,
                 output_limit: float = float("inf"),
                 integral_limit: float = float("inf"),
                 derivative_tau: float = 0.04):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.output_limit = output_limit
        self.integral_limit = integral_limit
        self.derivative_tau = derivative_tau

        self._integral = 0.0
        self._prev_error = 0.0
        self._deriv_filtered = 0.0
        self._initialized = False

    def compute(self, error: float, dt: float) -> float:
        if not self._initialized:
            self._prev_error = error
            self._initialized = True

        p = self.kp * error

        # Low-pass filtered derivative — raw differencing of a noisy error
        # signal at 50 Hz would inject far more noise than useful damping.
        raw_deriv = (error - self._prev_error) / max(dt, 1e-6)
        alpha = dt / (self.derivative_tau + dt)
        self._deriv_filtered += alpha * (raw_deriv - self._deriv_filtered)
        d = self.kd * self._deriv_filtered
        self._prev_error = error

        # Conditional integration: stop winding up once saturated
        unsaturated = p + d + self.ki * self._integral
        if abs(unsaturated) < self.output_limit:
            self._integral += error * dt
            self._integral = float(np.clip(self._integral,
                                           -self.integral_limit,
                                           self.integral_limit))
        i = self.ki * self._integral

        return float(np.clip(p + i + d, -self.output_limit, self.output_limit))

    def reset(self):
        self._integral = 0.0
        self._prev_error = 0.0
        self._deriv_filtered = 0.0
        self._initialized = False


class CascadedPIDFlightController:
    """
    Cascaded position/velocity controller producing a world-frame force.

    Interface is identical to :class:`ltc.ltc_controller.LTCFlightController`
    so the two can be swapped on the same airframe under the same wind.
    """

    def __init__(
        self,
        mass: float = 1.9,
        max_thrust: float = 42.0,
        max_yaw_rate: float = 2.0,
        max_speed: float = 22.0,
    ):
        self.mass = mass
        self.max_thrust = max_thrust
        self.max_yaw_rate = max_yaw_rate
        self.max_speed = max_speed

        # Outer loop: position error -> velocity setpoint (pure P, as in PX4)
        self.kp_pos = np.array([1.35, 1.35, 1.6])

        # Inner loop: velocity error -> acceleration command
        self.vel_pid_x = PIDController(kp=3.4, ki=1.1, kd=0.28,
                                       output_limit=12.0, integral_limit=5.0)
        self.vel_pid_y = PIDController(kp=3.4, ki=1.1, kd=0.28,
                                       output_limit=12.0, integral_limit=5.0)
        self.vel_pid_z = PIDController(kp=4.6, ki=1.8, kd=0.35,
                                       output_limit=14.0, integral_limit=6.0)

        self.yaw_pid = PIDController(kp=2.2, ki=0.0, kd=0.25,
                                     output_limit=max_yaw_rate)

    def compute_control(
        self,
        position_error: np.ndarray,
        velocity: np.ndarray,
        wind_estimate: np.ndarray,
        yaw_error: float = 0.0,
        dt: float = 0.02,
        velocity_setpoint: np.ndarray = None,
    ) -> Tuple[np.ndarray, float]:
        """
        Compute the commanded world-frame force.

        Args:
            position_error: target_pos - current_pos  [3]
            velocity: current world-frame velocity    [3]
            wind_estimate: accepted for interface parity; **unused**
            yaw_error: heading error (rad)
            velocity_setpoint: optional feedforward velocity from guidance

        Returns:
            (force_world_N [3], yaw_rate)
        """
        position_error = np.asarray(position_error, dtype=np.float64)
        velocity = np.asarray(velocity, dtype=np.float64)

        # Outer loop -> velocity setpoint, saturated to the speed envelope
        vel_sp = self.kp_pos * position_error
        if velocity_setpoint is not None:
            vel_sp = vel_sp + np.asarray(velocity_setpoint, dtype=np.float64)

        sp_mag = float(np.linalg.norm(vel_sp))
        if sp_mag > self.max_speed:
            vel_sp *= self.max_speed / sp_mag

        vel_error = vel_sp - velocity

        accel = np.array([
            self.vel_pid_x.compute(vel_error[0], dt),
            self.vel_pid_y.compute(vel_error[1], dt),
            self.vel_pid_z.compute(vel_error[2], dt),
        ])

        # Force = m * (a_cmd + g_compensation)
        force = self.mass * (accel + np.array([0.0, 0.0, 9.81]))

        mag = float(np.linalg.norm(force))
        if mag > self.max_thrust:
            force *= self.max_thrust / mag

        yaw_rate = self.yaw_pid.compute(yaw_error, dt)
        return force, yaw_rate

    def reset(self):
        for pid in (self.vel_pid_x, self.vel_pid_y, self.vel_pid_z, self.yaw_pid):
            pid.reset()


def make_pid_controller_hook(controller: CascadedPIDFlightController):
    """
    Wrap a PID controller as a simulation-runner controller hook:

        hook(drone, wind_vel, sim_time, dt)
    """
    def controller_hook(drone, wind_vel, sim_time, dt):
        if drone.target_position is None:
            drone.thrust_command = np.array([0.0, 0.0, controller.mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        pos_error = drone.target_position - drone.position
        force, yaw_rate = controller.compute_control(
            position_error=pos_error,
            velocity=drone.velocity,
            wind_estimate=drone.sensors.wind_estimate,
            yaw_error=0.0,
            dt=dt,
            velocity_setpoint=drone.target_velocity,
        )
        drone.thrust_command = force
        drone.yaw_rate_command = yaw_rate

    return controller_hook
