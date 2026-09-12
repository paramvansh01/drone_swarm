"""
Simplified 6-DOF flight dynamics for C-DAWN simulation.

Models thrust, drag, gravity, and wind forces on a quadrotor UAV.
Not a full CFD simulation — designed for controller validation and
realistic-enough behavior for the demo.
"""

import numpy as np
from typing import Optional


class FlightDynamics:
    """
    Simplified flight dynamics model for a quadrotor.

    Operates in world frame (NED-ish, but Z-up for simplicity).
    - Gravity: -Z
    - Thrust: applied in body frame, converted to world frame via orientation
    """

    GRAVITY = np.array([0.0, 0.0, -9.81])  # m/s^2 (Z-up)

    def __init__(
        self,
        mass: float = 1.5,
        drag_coefficient: float = 0.1,
        moment_of_inertia: np.ndarray = None,
        max_thrust: float = 30.0,
        max_speed: float = 15.0,
    ):
        self.mass = mass
        self.drag_coeff = drag_coefficient
        self.J = moment_of_inertia if moment_of_inertia is not None else np.diag([0.01, 0.01, 0.02])
        self.max_thrust = max_thrust
        self.max_speed = max_speed

    def quaternion_to_rotation_matrix(self, q: np.ndarray) -> np.ndarray:
        """Convert quaternion [w, x, y, z] to 3x3 rotation matrix."""
        w, x, y, z = q
        return np.array([
            [1 - 2*(y*y + z*z),     2*(x*y - w*z),     2*(x*z + w*y)],
            [    2*(x*y + w*z), 1 - 2*(x*x + z*z),     2*(y*z - w*x)],
            [    2*(x*z - w*y),     2*(y*z + w*x), 1 - 2*(x*x + y*y)],
        ])

    def quaternion_multiply(self, q1: np.ndarray, q2: np.ndarray) -> np.ndarray:
        """Multiply two quaternions."""
        w1, x1, y1, z1 = q1
        w2, x2, y2, z2 = q2
        return np.array([
            w1*w2 - x1*x2 - y1*y2 - z1*z2,
            w1*x2 + x1*w2 + y1*z2 - z1*y2,
            w1*y2 - x1*z2 + y1*w2 + z1*x2,
            w1*z2 + x1*y2 - y1*x2 + z1*w2,
        ])

    def integrate_orientation(self, q: np.ndarray, omega: np.ndarray, dt: float) -> np.ndarray:
        """Integrate orientation quaternion with angular velocity."""
        omega_q = np.array([0.0, omega[0], omega[1], omega[2]])
        q_dot = 0.5 * self.quaternion_multiply(q, omega_q)
        q_new = q + q_dot * dt
        # Normalize
        q_new /= np.linalg.norm(q_new)
        return q_new

    def compute_drag(self, velocity: np.ndarray, wind_velocity: np.ndarray) -> np.ndarray:
        """Compute aerodynamic drag force in world frame."""
        airspeed = velocity - wind_velocity
        speed = np.linalg.norm(airspeed)
        if speed < 0.01:
            return np.zeros(3)
        drag_direction = -airspeed / speed
        drag_magnitude = self.drag_coeff * speed**2
        return drag_direction * drag_magnitude

    def step(
        self,
        position: np.ndarray,
        velocity: np.ndarray,
        orientation: np.ndarray,
        angular_velocity: np.ndarray,
        thrust_command: np.ndarray,
        yaw_rate_command: float,
        wind_velocity: np.ndarray,
        dt: float,
    ) -> dict:
        """
        Advance the drone state by one timestep.

        Args:
            position: Current position [x, y, z] (world frame)
            velocity: Current velocity [vx, vy, vz] (world frame)
            orientation: Current orientation quaternion [w, x, y, z]
            angular_velocity: Current angular velocity [wx, wy, wz] (body frame)
            thrust_command: Desired force vector [fx, fy, fz] (body frame)
            yaw_rate_command: Desired yaw rate (rad/s)
            wind_velocity: Wind velocity at drone position (world frame)
            dt: Timestep (seconds)

        Returns:
            Dict with updated state: position, velocity, orientation,
            angular_velocity, acceleration.
        """
        # Clamp thrust
        thrust_mag = np.linalg.norm(thrust_command)
        if thrust_mag > self.max_thrust:
            thrust_command = thrust_command * (self.max_thrust / thrust_mag)

        # Transform thrust from body to world frame
        R = self.quaternion_to_rotation_matrix(orientation)
        thrust_world = R @ thrust_command

        # Forces in world frame
        gravity_force = self.GRAVITY * self.mass
        drag_force = self.compute_drag(velocity, wind_velocity)
        total_force = thrust_world + gravity_force + drag_force

        # Linear dynamics (semi-implicit Euler)
        acceleration = total_force / self.mass
        new_velocity = velocity + acceleration * dt

        # Speed clamping
        speed = np.linalg.norm(new_velocity)
        if speed > self.max_speed:
            new_velocity = new_velocity * (self.max_speed / speed)

        new_position = position + new_velocity * dt

        # Ground constraint
        if new_position[2] < 0.0:
            new_position[2] = 0.0
            new_velocity[2] = max(0.0, new_velocity[2])

        # Angular dynamics (simplified — direct yaw rate control + damping)
        # For pitch/roll, we use a simplified approach: the body frame Z
        # aligns toward thrust direction via a virtual spring
        target_omega = np.array([0.0, 0.0, yaw_rate_command])

        # Pitch/roll angular velocity from thrust direction mismatch
        thrust_dir_body = thrust_command / (thrust_mag + 1e-6)
        # Error from vertical (body Z should point in thrust direction)
        roll_error = thrust_dir_body[1] * 2.0    # simplified
        pitch_error = -thrust_dir_body[0] * 2.0  # simplified
        target_omega[0] = roll_error * 5.0   # spring constant
        target_omega[1] = pitch_error * 5.0

        # Damped angular velocity
        angular_damping = 0.8
        new_angular_velocity = (
            angular_velocity * (1 - angular_damping)
            + target_omega * angular_damping
        )

        # Integrate orientation
        new_orientation = self.integrate_orientation(orientation, new_angular_velocity, dt)

        return {
            "position": new_position,
            "velocity": new_velocity,
            "orientation": new_orientation,
            "angular_velocity": new_angular_velocity,
            "acceleration": acceleration,
        }

    def compute_hover_thrust(self) -> np.ndarray:
        """Compute the thrust vector needed to hover (body frame, Z-up)."""
        return np.array([0.0, 0.0, self.mass * 9.81])
