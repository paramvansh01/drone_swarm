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
    """Drone hardware configuration."""
    mass: float = 1.5             # kg
    max_thrust: float = 30.0      # N (total, ~2g for 1.5kg)
    max_speed: float = 15.0       # m/s
    max_yaw_rate: float = 2.0     # rad/s
    battery_capacity: float = 100.0   # percentage (abstract)
    battery_drain_rate: float = 0.05  # %/s at hover
    battery_drain_rate_max: float = 0.15  # %/s at max thrust
    gps_noise_std: float = 0.5    # m
    baro_noise_std: float = 0.2   # m
    imu_noise_std: float = 0.01   # m/s^2 and rad/s
    antenna_gain_dbi: float = 2.0  # dBi
    tx_power_dbm: float = 20.0    # dBm (100mW)
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

        # Home position (for RTH)
        self.home_position = self.position.copy()

        # Sensor readings
        self.sensors = SensorReadings()

        # Control commands (set by controller)
        self.thrust_command = np.zeros(3, dtype=np.float64)  # desired force vector (body frame)
        self.yaw_rate_command = 0.0

        # Waypoint / target
        self.target_position: Optional[np.ndarray] = None
        self.assigned_poi: Optional[str] = None

        # Telemetry log
        self._telemetry_buffer: List[Dict[str, Any]] = []
        self._creation_time = time.time()

        # Mesh network state
        self.neighbors: Dict[str, float] = {}  # drone_id -> link quality [0,1]
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

    def update_sensors(self, wind_velocity: np.ndarray, rng: np.random.RandomState):
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

        # Wind estimate (delayed / noisy version of actual wind)
        self.sensors.wind_estimate = wind_velocity + rng.normal(0, 0.5, 3)

    def update_battery(self, dt: float):
        """Drain battery based on thrust output."""
        if not self.is_alive:
            return

        thrust_fraction = np.linalg.norm(self.thrust_command) / self.config.max_thrust
        drain = (
            self.config.battery_drain_rate
            + (self.config.battery_drain_rate_max - self.config.battery_drain_rate) * thrust_fraction
        )
        self.battery -= drain * dt
        self.battery = max(0.0, self.battery)

        if self.battery <= 0:
            self.status = DroneStatus.LANDED
        elif self.battery < 15.0 and self.status == DroneStatus.ACTIVE:
            self.status = DroneStatus.LOW_BATTERY

    def kill(self):
        """Simulate node failure (KILL NODE event)."""
        self.status = DroneStatus.KILLED
        self.velocity = np.zeros(3)
        self.thrust_command = np.zeros(3)

    def revive(self):
        """Revive a killed drone (for demo reset)."""
        self.status = DroneStatus.ACTIVE
        self.battery = 80.0

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
        }

    def __repr__(self):
        return (
            f"Drone({self.id}, role={self.role.name}, status={self.status.name}, "
            f"pos=[{self.position[0]:.1f},{self.position[1]:.1f},{self.position[2]:.1f}], "
            f"bat={self.battery:.1f}%)"
        )
