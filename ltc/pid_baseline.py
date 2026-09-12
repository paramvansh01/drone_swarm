"""
Cascaded PID flight controller baseline for C-DAWN.

Standard PID controller with identical interface to the LTC controller,
enabling direct A/B comparison under the same wind-gust profiles.
"""

import numpy as np
from typing import Tuple, Optional


class PIDController:
    """Single-axis PID controller with anti-windup."""

    def __init__(self, kp: float, ki: float, kd: float, output_limit: float = float('inf')):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.output_limit = output_limit

        self._integral = 0.0
        self._prev_error = 0.0
        self._initialized = False

    def compute(self, error: float, dt: float) -> float:
        if not self._initialized:
            self._prev_error = error
            self._initialized = True

        # Proportional
        p = self.kp * error

        # Integral with anti-windup
        self._integral += error * dt
        self._integral = np.clip(
            self._integral,
            -self.output_limit / (self.ki + 1e-8),
            self.output_limit / (self.ki + 1e-8),
        )
        i = self.ki * self._integral

        # Derivative
        d = self.kd * (error - self._prev_error) / (dt + 1e-8)
        self._prev_error = error

        # Total output
        output = p + i + d
        return float(np.clip(output, -self.output_limit, self.output_limit))

    def reset(self):
        self._integral = 0.0
        self._prev_error = 0.0
        self._initialized = False


class CascadedPIDFlightController:
    """
    Cascaded PID flight controller.

    Structure:
        Position PID → Velocity PID → Thrust output

    Tuned for nominal conditions. Provides baseline comparison
    for the LTC controller under wind gusts.
    """

    def __init__(
        self,
        mass: float = 1.5,
        max_thrust: float = 30.0,
        max_yaw_rate: float = 2.0,
    ):
        self.mass = mass
        self.max_thrust = max_thrust
        self.max_yaw_rate = max_yaw_rate

        # Outer loop: position → desired velocity
        self.pos_pid_x = PIDController(kp=2.0, ki=0.1, kd=0.5, output_limit=10.0)
        self.pos_pid_y = PIDController(kp=2.0, ki=0.1, kd=0.5, output_limit=10.0)
        self.pos_pid_z = PIDController(kp=3.0, ki=0.2, kd=1.0, output_limit=10.0)

        # Inner loop: velocity error → desired acceleration
        self.vel_pid_x = PIDController(kp=4.0, ki=0.3, kd=0.8, output_limit=15.0)
        self.vel_pid_y = PIDController(kp=4.0, ki=0.3, kd=0.8, output_limit=15.0)
        self.vel_pid_z = PIDController(kp=5.0, ki=0.5, kd=1.5, output_limit=20.0)

        # Yaw controller
        self.yaw_pid = PIDController(kp=2.0, ki=0.0, kd=0.5, output_limit=max_yaw_rate)

    def compute_control(
        self,
        position_error: np.ndarray,
        velocity: np.ndarray,
        wind_estimate: np.ndarray,
        yaw_error: float,
        dt: float = 0.02,
    ) -> Tuple[np.ndarray, float]:
        """
        Compute control output.

        Args:
            position_error: [3] target_pos - current_pos
            velocity: [3] current velocity
            wind_estimate: [3] estimated wind (for feedforward, not used by PID baseline)
            yaw_error: Yaw angle error (rad)
            dt: Timestep

        Returns:
            (thrust_command, yaw_rate): thrust [3] body frame, yaw rate scalar
        """
        # Outer loop: position → desired velocity
        desired_vx = self.pos_pid_x.compute(position_error[0], dt)
        desired_vy = self.pos_pid_y.compute(position_error[1], dt)
        desired_vz = self.pos_pid_z.compute(position_error[2], dt)

        # Velocity error
        vel_error = np.array([desired_vx, desired_vy, desired_vz]) - velocity

        # Inner loop: velocity error → desired acceleration
        ax = self.vel_pid_x.compute(vel_error[0], dt)
        ay = self.vel_pid_y.compute(vel_error[1], dt)
        az = self.vel_pid_z.compute(vel_error[2], dt)

        # Convert acceleration to thrust (F = ma) + gravity compensation
        thrust = np.array([ax, ay, az + 9.81]) * self.mass

        # Clamp thrust magnitude
        thrust_mag = np.linalg.norm(thrust)
        if thrust_mag > self.max_thrust:
            thrust = thrust * (self.max_thrust / thrust_mag)

        # Yaw rate
        yaw_rate = self.yaw_pid.compute(yaw_error, dt)

        return thrust, yaw_rate

    def reset(self):
        """Reset all PID states."""
        for pid in [
            self.pos_pid_x, self.pos_pid_y, self.pos_pid_z,
            self.vel_pid_x, self.vel_pid_y, self.vel_pid_z,
            self.yaw_pid,
        ]:
            pid.reset()


def make_pid_controller_hook(controller: CascadedPIDFlightController):
    """
    Create a controller hook function for the simulation runner.

    Returns a callable with signature:
        controller_hook(drone, wind_vel, sim_time, dt)
    """
    def controller_hook(drone, wind_vel, sim_time, dt):
        if drone.target_position is None:
            drone.thrust_command = np.array([0.0, 0.0, controller.mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        pos_error = drone.target_position - drone.position
        velocity = drone.velocity
        wind_est = drone.sensors.wind_estimate

        thrust, yaw_rate = controller.compute_control(
            pos_error, velocity, wind_est, 0.0, dt
        )

        drone.thrust_command = thrust
        drone.yaw_rate_command = yaw_rate

    return controller_hook
