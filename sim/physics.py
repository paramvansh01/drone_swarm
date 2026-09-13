"""
Flight dynamics for C-DAWN.

Models a multirotor as an underactuated rigid body: the airframe can only
push along its own body-z axis, so to accelerate sideways it must first
*tilt*, and tilting takes time. That attitude lag is the whole reason wind
rejection is hard, and it is the dynamic the LTC controller is claimed to
handle better than a fixed-gain cascaded PID — so it has to be modelled
honestly rather than assumed away.

Controller convention
---------------------
Controllers output a **desired force vector in the world frame**. This module
converts that into (thrust magnitude, desired attitude), applies a first-order
attitude response with a slew-rate limit, and integrates the resulting
*actual* force. A controller that commands an aggressive lateral correction
therefore does not get it instantly.
"""

import numpy as np



class FlightDynamics:
    """6-DOF multirotor dynamics with attitude lag and aerodynamic drag."""

    GRAVITY = np.array([0.0, 0.0, -9.81])

    def __init__(
        self,
        mass: float = 1.9,
        max_thrust: float = 42.0,
        max_speed: float = 22.0,
        drag_coeff: float = 0.040,       # 0.5 * rho * Cd * A  (N per (m/s)^2)
                                         # rho=1.12 kg/m^3 @ ~700 m, Cd~1.1, A~0.065 m^2
        attitude_tau: float = 0.14,      # first-order attitude time constant (s)
        max_tilt_rad: float = 0.62,      # ~35 deg maximum commanded bank
        max_tilt_rate: float = 4.5,      # rad/s slew limit on the body-z axis
    ):
        self.mass = mass
        self.max_thrust = max_thrust
        self.max_speed = max_speed
        self.drag_coeff = drag_coeff
        self.attitude_tau = attitude_tau
        self.max_tilt_rad = max_tilt_rad
        self.max_tilt_rate = max_tilt_rate

    # -- quaternion helpers -------------------------------------------------

    @staticmethod
    def quaternion_to_rotation_matrix(q: np.ndarray) -> np.ndarray:
        """Rotation matrix for quaternion [w, x, y, z]."""
        w, x, y, z = q
        return np.array([
            [1 - 2 * (y * y + z * z), 2 * (x * y - w * z),     2 * (x * z + w * y)],
            [2 * (x * y + w * z),     1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
            [2 * (x * z - w * y),     2 * (y * z + w * x),     1 - 2 * (x * x + y * y)],
        ])

    @staticmethod
    def quaternion_multiply(q1: np.ndarray, q2: np.ndarray) -> np.ndarray:
        w1, x1, y1, z1 = q1
        w2, x2, y2, z2 = q2
        return np.array([
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
            w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
        ])

    def integrate_orientation(self, q: np.ndarray, omega: np.ndarray, dt: float) -> np.ndarray:
        """Integrate a body-rate vector into the orientation quaternion."""
        omega_q = np.array([0.0, omega[0], omega[1], omega[2]])
        q_new = q + 0.5 * self.quaternion_multiply(q, omega_q) * dt
        return q_new / (np.linalg.norm(q_new) + 1e-12)

    @staticmethod
    def _quaternion_from_axes(b3: np.ndarray, yaw: float) -> np.ndarray:
        """
        Build a quaternion whose body-z is `b3` and whose heading is `yaw`.

        Uses the standard multirotor construction: pick the body-x axis to lie
        in the plane containing the desired heading, then complete the frame.
        """
        b3 = b3 / (np.linalg.norm(b3) + 1e-12)

        # Desired heading direction projected perpendicular to b3
        c1 = np.array([np.cos(yaw), np.sin(yaw), 0.0])
        b2 = np.cross(b3, c1)
        n2 = np.linalg.norm(b2)
        if n2 < 1e-6:
            # Degenerate: b3 is (anti)parallel to the heading vector
            c1 = np.array([-np.sin(yaw), np.cos(yaw), 0.0])
            b2 = np.cross(b3, c1)
            n2 = np.linalg.norm(b2)
        b2 = b2 / (n2 + 1e-12)
        b1 = np.cross(b2, b3)

        R = np.column_stack([b1, b2, b3])

        # Rotation matrix -> quaternion (Shepperd's method, trace branch)
        trace = R[0, 0] + R[1, 1] + R[2, 2]
        if trace > 0.0:
            s = np.sqrt(trace + 1.0) * 2.0
            w = 0.25 * s
            x = (R[2, 1] - R[1, 2]) / s
            y = (R[0, 2] - R[2, 0]) / s
            z = (R[1, 0] - R[0, 1]) / s
        elif R[0, 0] > R[1, 1] and R[0, 0] > R[2, 2]:
            s = np.sqrt(1.0 + R[0, 0] - R[1, 1] - R[2, 2]) * 2.0
            w = (R[2, 1] - R[1, 2]) / s
            x = 0.25 * s
            y = (R[0, 1] + R[1, 0]) / s
            z = (R[0, 2] + R[2, 0]) / s
        elif R[1, 1] > R[2, 2]:
            s = np.sqrt(1.0 + R[1, 1] - R[0, 0] - R[2, 2]) * 2.0
            w = (R[0, 2] - R[2, 0]) / s
            x = (R[0, 1] + R[1, 0]) / s
            y = 0.25 * s
            z = (R[1, 2] + R[2, 1]) / s
        else:
            s = np.sqrt(1.0 + R[2, 2] - R[0, 0] - R[1, 1]) * 2.0
            w = (R[1, 0] - R[0, 1]) / s
            x = (R[0, 2] + R[2, 0]) / s
            y = (R[1, 2] + R[2, 1]) / s
            z = 0.25 * s

        q = np.array([w, x, y, z])
        return q / (np.linalg.norm(q) + 1e-12)

    # -- forces -------------------------------------------------------------

    def compute_drag(self, velocity: np.ndarray, wind_velocity: np.ndarray) -> np.ndarray:
        """
        Quadratic aerodynamic drag acting on the airspeed vector.

        Because drag depends on airspeed (velocity *relative to the air*), a
        gust produces a force even on a stationary hovering aircraft — which
        is what makes gust rejection a control problem at all.
        """
        airspeed = velocity - wind_velocity
        speed = float(np.linalg.norm(airspeed))
        if speed < 1e-3:
            return np.zeros(3)
        return -(airspeed / speed) * self.drag_coeff * speed * speed

    def _limit_tilt(self, f_des: np.ndarray) -> np.ndarray:
        """
        Clamp a desired force vector so the implied bank angle is flyable.

        Keeps the vertical component and shrinks the lateral component until
        the tilt is within `max_tilt_rad`.
        """
        f_z = max(float(f_des[2]), 0.25 * self.mass * 9.81)
        f_lat = f_des[:2].copy()
        lat_mag = float(np.linalg.norm(f_lat))

        max_lat = f_z * np.tan(self.max_tilt_rad)
        if lat_mag > max_lat and lat_mag > 1e-9:
            f_lat *= max_lat / lat_mag

        return np.array([f_lat[0], f_lat[1], f_z])

    # -- integration --------------------------------------------------------

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
        ground_height: float = 0.0,
    ) -> dict:
        """
        Advance one timestep.

        Args:
            thrust_command: desired force vector in the **world** frame (N).
            yaw_rate_command: desired yaw rate (rad/s).
            wind_velocity: wind at the aircraft (world frame, m/s).
            ground_height: terrain elevation beneath the aircraft (m).
        """
        # --- desired attitude from the commanded force ---------------------
        f_des = self._limit_tilt(np.asarray(thrust_command, dtype=np.float64))

        thrust_mag = float(np.linalg.norm(f_des))
        thrust_mag = float(np.clip(thrust_mag, 0.0, self.max_thrust))

        b3_des = f_des / (np.linalg.norm(f_des) + 1e-9)

        # --- attitude response (first order, slew limited) -----------------
        R = self.quaternion_to_rotation_matrix(orientation)
        b3 = R[:, 2]

        # Rotate b3 toward b3_des by at most (dt / tau), capped by the slew rate
        cos_angle = float(np.clip(np.dot(b3, b3_des), -1.0, 1.0))
        angle = float(np.arccos(cos_angle))

        if angle > 1e-6:
            alpha = min(dt / self.attitude_tau, 1.0)
            step_angle = min(angle * alpha, self.max_tilt_rate * dt)

            axis = np.cross(b3, b3_des)
            axis_norm = float(np.linalg.norm(axis))
            if axis_norm > 1e-9:
                axis /= axis_norm
                # Rodrigues rotation of b3 about `axis` by step_angle
                b3_new = (b3 * np.cos(step_angle)
                          + np.cross(axis, b3) * np.sin(step_angle)
                          + axis * np.dot(axis, b3) * (1.0 - np.cos(step_angle)))
            else:
                b3_new = b3_des
        else:
            step_angle = 0.0
            b3_new = b3_des

        b3_new /= (np.linalg.norm(b3_new) + 1e-12)

        # Heading integrates the commanded yaw rate
        w, x, y, z = orientation
        yaw = float(np.arctan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)))
        yaw_new = yaw + float(yaw_rate_command) * dt

        new_orientation = self._quaternion_from_axes(b3_new, yaw_new)

        # Body rates, reported for telemetry / IMU simulation
        new_angular_velocity = np.array([
            (b3_new[1] - b3[1]) / max(dt, 1e-6),
            -(b3_new[0] - b3[0]) / max(dt, 1e-6),
            float(yaw_rate_command),
        ])

        # --- forces --------------------------------------------------------
        # The aircraft can only push along its ACTUAL body-z, not the one it
        # wished it had. This is where attitude lag becomes a real penalty.
        thrust_world = b3_new * thrust_mag

        drag_force = self.compute_drag(velocity, wind_velocity)
        total_force = thrust_world + self.GRAVITY * self.mass + drag_force

        acceleration = total_force / self.mass
        new_velocity = velocity + acceleration * dt

        speed = float(np.linalg.norm(new_velocity))
        if speed > self.max_speed:
            new_velocity *= self.max_speed / speed

        new_position = position + new_velocity * dt

        # --- ground contact -------------------------------------------------
        if new_position[2] < ground_height:
            new_position[2] = ground_height
            if new_velocity[2] < 0.0:
                new_velocity[2] = 0.0
            # Friction on contact
            new_velocity[:2] *= 0.5

        return {
            "position": new_position,
            "velocity": new_velocity,
            "orientation": new_orientation,
            "angular_velocity": new_angular_velocity,
            "acceleration": acceleration,
            "thrust_magnitude": thrust_mag,
            "tilt_rad": float(np.arccos(np.clip(b3_new[2], -1.0, 1.0))),
            "attitude_error_rad": angle,
        }

    def compute_hover_thrust(self) -> np.ndarray:
        """World-frame force required to hover."""
        return np.array([0.0, 0.0, self.mass * 9.81])
