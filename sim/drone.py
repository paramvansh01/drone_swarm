"""
Drone agent model for C-DAWN simulation.

Each drone maintains its full state (position, velocity, orientation, battery,
sensors, role) and provides interfaces for controllers and the mesh network.
"""

import numpy as np
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Optional, Dict, List, Any
import time


class DroneRole(Enum):
    """Operational role in the swarm."""
    SCOUT = auto()       # Surveys PoIs, collects imagery
    RELAY = auto()       # Maintains mesh connectivity
    GCS_RELAY = auto()   # Primary relay back to Ground Control Station
    STANDBY = auto()     # Idle / reserve


class DroneStatus(Enum):
    """Operational status."""
    ACTIVE = auto()
    LOW_BATTERY = auto()
    RETURNING = auto()   # RTH (Return to Home)
    KILLED = auto()      # Simulated failure / "KILL NODE"
    LANDED = auto()


@dataclass
class SensorReadings:
    """Simulated sensor data."""
    imu_accel: np.ndarray = field(default_factory=lambda: np.zeros(3))   # m/s^2
    imu_gyro: np.ndarray = field(default_factory=lambda: np.zeros(3))    # rad/s
    gps_position: np.ndarray = field(default_factory=lambda: np.zeros(3))  # m (with noise)
    barometer_alt: float = 0.0       # m (with noise)
    rssi: Dict[str, float] = field(default_factory=dict)  # drone_id -> dBm
    wind_estimate: np.ndarray = field(default_factory=lambda: np.zeros(3))  # m/s


@dataclass
class DroneConfig:
    """
    Drone hardware configuration.

    Modelled on a ~2 kg class fixed-pitch quadrotor with a 900 MHz mesh
    radio — the airframe you would realistically field for a multi-kilometre
    mountain BVLOS survey.
    """
    mass: float = 1.9             # kg
    max_thrust: float = 42.0      # N total (~2.25 g thrust-to-weight)
    max_speed: float = 22.0       # m/s
    max_yaw_rate: float = 2.0     # rad/s

    battery_capacity: float = 100.0    # state of charge (%)
    battery_drain_rate: float = 0.115  # %/s at hover  (~14.5 min hover)
    battery_drain_rate_max: float = 0.30  # %/s at full thrust
    rth_reserve_pct: float = 22.0      # SoC below which RTH is mandatory

    gps_noise_std: float = 0.6    # m (GNSS in terrain-shadowed valley)
    baro_noise_std: float = 0.35  # m
    imu_noise_std: float = 0.02   # m/s^2 and rad/s

    antenna_gain_dbi: float = 3.0   # dBi (dipole)
    tx_power_dbm: float = 27.0      # dBm (500 mW ISM)
    radio_frequency_mhz: float = 900.0  # MHz


class Drone:
    """
    Simulated UAV agent.

    Maintains full 6-DOF state, sensor readings, battery, role assignments,
    and provides interfaces for external controllers (LTC/PID) and
    mesh networking.
    """

    def __init__(
        self,
        drone_id: str,
        position: np.ndarray,
        role: DroneRole = DroneRole.SCOUT,
        config: Optional[DroneConfig] = None,
    ):
        self.id = drone_id
        self.config = config or DroneConfig()
        self.role = role
        self.status = DroneStatus.ACTIVE

        # 6-DOF State
        self.position = np.array(position, dtype=np.float64)
        self.velocity = np.zeros(3, dtype=np.float64)
        self.acceleration = np.zeros(3, dtype=np.float64)
        self.orientation = np.array([1.0, 0.0, 0.0, 0.0])  # quaternion [w, x, y, z]
        self.angular_velocity = np.zeros(3, dtype=np.float64)

        # Battery
        self.battery = self.config.battery_capacity
        # Airframe health in [0, 1]: an equipment fault cuts thrust authority
        # and doubles the power draw.
        self.health = 1.0
        self.power_factor = 1.0
        # Error between where the aircraft IS and where it believes it is
        # (GNSS denial / spoofing). Guidance flies on the believed position.
        self.nav_error = np.zeros(3)

        # Home position (for RTH)
        self.home_position = self.position.copy()

        # Sensor readings
        self.sensors = SensorReadings()

        # Control commands (set by controller)
        self.thrust_command = np.zeros(3, dtype=np.float64)  # desired force vector (body frame)
        self.yaw_rate_command = 0.0

        # Waypoint / target
        self.target_position: Optional[np.ndarray] = None
        self.target_velocity: np.ndarray = np.zeros(3, dtype=np.float64)
        self.assigned_poi: Optional[str] = None

        # Commanded altitude bias applied by the SCM intervention engine.
        # do(dz) writes here; the guidance layer adds it to every setpoint,
        # which is what makes the intervention a *real* actuation rather
        # than a bookkeeping entry.
        self.altitude_offset_cmd: float = 0.0

        # Which flight controller is flying this airframe ("LTC" or "PID")
        self.controller_mode: str = "LTC"

        # Rolling tracking error, and what the shadow PID baseline would
        # have achieved on the identical disturbance this tick.
        self.tracking_error: float = 0.0
        self.shadow_tracking_error: float = 0.0
        self.agl: float = 0.0

        # Telemetry log
        self._telemetry_buffer: List[Dict[str, Any]] = []
        self._creation_time = time.time()

        # Mesh network state
        self.neighbors: Dict[str, float] = {}  # drone_id -> link quality [0,1]
        self.killed_at: Optional[float] = None
        self.packets_sent = 0
        self.packets_received = 0
        self.packets_dropped = 0

    @property
    def is_alive(self) -> bool:
        return self.status not in (DroneStatus.KILLED, DroneStatus.LANDED)

    @property
    def speed(self) -> float:
        return float(np.linalg.norm(self.velocity))

    @property
    def altitude(self) -> float:
        return float(self.position[2])

    @property
    def battery_critical(self) -> bool:
        return self.battery < 15.0

    @property
    def heading(self) -> float:
        """Yaw angle in radians from quaternion."""
        w, x, y, z = self.orientation
        return float(np.arctan2(2 * (w * z + x * y), 1 - 2 * (y**2 + z**2)))

    # Onboard wind estimation is not instantaneous: a real airframe infers
    # wind from the mismatch between commanded and achieved acceleration,
    # which is a lagged and noisy observer. This lag is what the LTC's liquid
    # hidden state has to compensate for, so it must be modelled here AND
    # reproduced identically during training.
    WIND_ESTIMATOR_TAU = 0.65   # seconds
    WIND_ESTIMATOR_NOISE = 1.1  # m/s std

    def update_sensors(self, wind_velocity: np.ndarray, rng: np.random.RandomState,
                       dt: float = 0.02):
        """Update simulated sensor readings with noise."""
        if not self.is_alive:
            return

        # GPS with noise
        self.sensors.gps_position = self.position + rng.normal(0, self.config.gps_noise_std, 3)

        # Barometer with noise
        self.sensors.barometer_alt = self.position[2] + rng.normal(0, self.config.baro_noise_std)

        # IMU
        self.sensors.imu_accel = self.acceleration + rng.normal(0, self.config.imu_noise_std, 3)
        self.sensors.imu_gyro = self.angular_velocity + rng.normal(0, self.config.imu_noise_std, 3)

        # Wind estimate: first-order lag toward the true wind, plus noise
        alpha = dt / (self.WIND_ESTIMATOR_TAU + dt)
        noisy = wind_velocity + rng.normal(0, self.WIND_ESTIMATOR_NOISE, 3)
        self.sensors.wind_estimate = (
            self.sensors.wind_estimate + alpha * (noisy - self.sensors.wind_estimate)
        )

    def update_battery(self, dt: float):
        """Drain battery based on thrust output."""
        if not self.is_alive:
            return

        thrust_fraction = np.linalg.norm(self.thrust_command) / self.config.max_thrust
        # A damaged airframe and a wet one both cost power
        penalty = self.power_factor * (2.0 - self.health)
        drain = penalty * (
            self.config.battery_drain_rate
            + (self.config.battery_drain_rate_max - self.config.battery_drain_rate) * thrust_fraction
        )
        self.battery -= drain * dt
        self.battery = max(0.0, self.battery)

        if self.battery <= 0:
            self.status = DroneStatus.LANDED
        elif self.battery < 15.0 and self.status == DroneStatus.ACTIVE:
            self.status = DroneStatus.LOW_BATTERY

    def kill(self, sim_time: Optional[float] = None):
        """Simulate node failure (KILL NODE event)."""
        self.status = DroneStatus.KILLED
        # When the failure happened, so self-healing can be timed from the
        # failure itself rather than from whenever it was noticed.
        self.killed_at = sim_time
        # Keep horizontal momentum so the aircraft tumbles out of the sky
        # rather than stopping dead in mid-air.
        self.velocity = np.array([self.velocity[0], self.velocity[1], 0.0])
        self.thrust_command = np.zeros(3)
        # A downed node carries no traffic; leaving its last link qualities in
        # place would misreport the mesh as still reaching through it.
        self.neighbors.clear()
        self.sensors.rssi.clear()

    def revive(self):
        """Revive a killed drone (for demo reset)."""
        self.status = DroneStatus.ACTIVE
        self.battery = max(self.battery, 80.0)
        self.altitude_offset_cmd = 0.0

    def set_target(self, position: np.ndarray, poi_id: Optional[str] = None):
        """Set waypoint target."""
        self.target_position = np.array(position, dtype=np.float64)
        self.assigned_poi = poi_id

    def get_antenna_pose_factor(self, other_position: np.ndarray) -> float:
        """
        Compute antenna directivity factor based on relative position.
        Returns a value in [0, 1] where 1 = optimal alignment.
        Simple model: assumes omni antenna with slight vertical bias.
        """
        direction = other_position - self.position
        dist = np.linalg.norm(direction)
        if dist < 0.01:
            return 1.0
        direction /= dist

        # Slight penalty for extreme vertical angles
        vertical_angle = np.abs(np.arcsin(direction[2]))
        return float(np.cos(vertical_angle * 0.3))  # mild directivity

    def record_telemetry(self, sim_time: float):
        """Record current state to telemetry buffer."""
        entry = {
            "time": sim_time,
            "drone_id": self.id,
            "position": self.position.tolist(),
            "velocity": self.velocity.tolist(),
            "speed": self.speed,
            "altitude": self.altitude,
            "heading": self.heading,
            "battery": self.battery,
            "role": self.role.name,
            "status": self.status.name,
            "thrust": np.linalg.norm(self.thrust_command),
            "neighbors": dict(self.neighbors),
            "packets_sent": self.packets_sent,
            "packets_received": self.packets_received,
            "packets_dropped": self.packets_dropped,
        }
        self._telemetry_buffer.append(entry)
        # Keep buffer bounded
        if len(self._telemetry_buffer) > 5000:
            self._telemetry_buffer = self._telemetry_buffer[-3000:]
        return entry

    def get_state(self) -> dict:
        """Serialize full drone state for dashboard/telemetry."""
        return {
            "id": self.id,
            "position": self.position.tolist(),
            "velocity": self.velocity.tolist(),
            "speed": self.speed,
            "altitude": self.altitude,
            "heading": self.heading,
            "battery": self.battery,
            "role": self.role.name,
            "status": self.status.name,
            "target": self.target_position.tolist() if self.target_position is not None else None,
            "assigned_poi": self.assigned_poi,
            "neighbors": dict(self.neighbors),
            "rssi": dict(self.sensors.rssi),
            "agl": self.agl,
            "orientation": self.orientation.tolist(),
            "controller": self.controller_mode,
            "tracking_error": self.tracking_error,
            "shadow_tracking_error": self.shadow_tracking_error,
            "altitude_offset_cmd": self.altitude_offset_cmd,
            "thrust": float(np.linalg.norm(self.thrust_command)),
            "health": float(getattr(self, "health", 1.0)),
            "nav_error_m": float(np.linalg.norm(getattr(self, "nav_error", np.zeros(3)))),
            "ew_hold": bool(getattr(self, "ew_hold", False)),
            "manual_target": (self.manual_target.tolist()
                              if getattr(self, "manual_target", None) is not None else None),
        }

    def __repr__(self):
        return (
            f"Drone({self.id}, role={self.role.name}, status={self.status.name}, "
            f"pos=[{self.position[0]:.1f},{self.position[1]:.1f},{self.position[2]:.1f}], "
            f"bat={self.battery:.1f}%)"
        )
