"""
Drone agent model for the UAV-X simulation.

Each drone maintains its full state (position, velocity, orientation, battery,
sensors, role) and provides interfaces for controllers and the mesh network.
"""

import numpy as np
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Optional, Dict, List, Any
import time


class DroneRole(Enum):
    """Operational role in the swarm. Roles are dynamic: any UAV can fly any role."""
    SCOUT = auto()       # Surveys PoIs, collects imagery
    RELAY = auto()       # Holds a station in the multi-hop chain to the GCS
    GCS_RELAY = auto()   # Legacy: the fixed ground station is now `World.gcs`
    STANDBY = auto()     # No mission role: returning, on the pad, or in reserve


class DroneStatus(Enum):
    """Operational status."""
    ACTIVE = auto()
    LOW_BATTERY = auto()
    RETURNING = auto()   # RTH (Return to Home)
    KILLED = auto()      # Simulated failure / "KILL NODE"
    LANDED = auto()      # Down away from a pad (battery exhausted / forced landing)
    CHARGING = auto()    # On a GCS pad, battery being swapped / recharged
    READY = auto()       # On a GCS pad, charged, available for launch


# Statuses in which the aircraft is on the ground and out of the mesh
GROUND_STATUSES = (DroneStatus.KILLED, DroneStatus.LANDED,
                   DroneStatus.CHARGING, DroneStatus.READY)


@dataclass
class SensorReadings:
    """Simulated sensor data."""
    imu_accel: np.ndarray = field(default_factory=lambda: np.zeros(3))   # m/s^2
    imu_gyro: np.ndarray = field(default_factory=lambda: np.zeros(3))    # rad/s
    gps_position: np.ndarray = field(default_factory=lambda: np.zeros(3))  # m (with noise)
    barometer_alt: float = 0.0       # m (with noise)
    rssi: Dict[str, float] = field(default_factory=dict)  # drone_id -> dBm
    wind_estimate: np.ndarray = field(default_factory=lambda: np.zeros(3))  # m/s
    # Receiver noise floor with no packet in flight (what an RSSI register reads)
    noise_dbm: Optional[float] = None
    # Optical sensor: the camera has lost the ground (the aircraft is in cloud)
    in_cloud: bool = False
    # Direction-finding array: [(bearing_rad, rx_dbm, sigma_rad)] (sim/df_sensor.py)
    df_bearings: list = field(default_factory=list)
    # Two-way radio ranging to linked neighbours: drone_id -> metres (2 m error)
    ranges: Dict[str, float] = field(default_factory=dict)
    # Two-way ranging to the GCS antenna (a surveyed, fixed point), when linked
    gcs_range: Optional[float] = None


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
    # Drain = base + (max - base) * thrust fraction. Hover is ~44 % thrust, so
    # ~0.094 %/s (about 18 min); cruise ~0.11 %/s (about 15 min) — a typical
    # 2 kg survey quadrotor, and short enough that a 15-minute mission needs
    # battery swaps.
    battery_drain_rate: float = 0.05   # %/s at zero thrust (avionics, radio, payload)
    battery_drain_rate_max: float = 0.15   # %/s at full thrust
    rth_reserve_pct: float = 12.0      # absolute floor; the RTH trigger is energy-based

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
        self.gcs_link: float = 0.0             # direct link quality to the GCS
        # False while the aircraft's radio is out (a communication-outage
        # disturbance): it keeps flying but can neither send nor relay.
        self.radio_ok: bool = True
        self.killed_at: Optional[float] = None
        self.packets_sent = 0
        self.packets_received = 0
        self.packets_dropped = 0

        # Energy / recharge bookkeeping
        # Measured power draw relative to the nominal model for the thrust
        # being produced — battery current monitoring. A motor fault or a wet
        # airframe shows up here; the energy planner uses this, not the fault.
        self.drain_factor: float = 1.0
        self.pad_index: int = 0
        self.charge_started: Optional[float] = None
        self.sorties: int = 0
        self.min_battery_airborne: float = self.battery

        # End-to-end connectivity to the GCS, written by the traffic layer.
        # Starts True so that a simulation run without the traffic layer never
        # trips the lost-link failsafe.
        self.connected: bool = True
        self.path_quality: float = 0.0
        self.hops: int = 0
        self.lost_link_s: float = 0.0

    @property
    def is_alive(self) -> bool:
        """Airborne and part of the mesh."""
        return self.status not in GROUND_STATUSES

    @property
    def on_pad(self) -> bool:
        return self.status in (DroneStatus.CHARGING, DroneStatus.READY)

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
        # GNSS fix: the true position, minus whatever the navigation solution
        # has drifted by (GNSS degradation), plus receiver noise
        self.sensors.gps_position = (self.position - getattr(self, "nav_error", np.zeros(3))
                                     + rng.normal(0, self.config.gps_noise_std, 3))

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
        nominal = (self.config.battery_drain_rate
                   + (self.config.battery_drain_rate_max - self.config.battery_drain_rate) * thrust_fraction)
        # A damaged airframe and a wet one both cost power (physics)
        penalty = self.power_factor * (2.0 - self.health)
        drain = penalty * nominal
        self.battery -= drain * dt
        # What the aircraft can observe: its current draw against the draw the
        # nominal model predicts for this thrust (15 s moving average)
        if nominal > 1e-6:
            self.drain_factor += min(dt / 15.0, 1.0) * (drain / nominal - self.drain_factor)
        self.battery = max(0.0, self.battery)

        self.min_battery_airborne = min(self.min_battery_airborne, self.battery)

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
        self.gcs_link = 0.0
        self.connected = False

    def revive(self):
        """Revive a killed drone (for demo reset)."""
        self.status = DroneStatus.ACTIVE
        self.battery = max(self.battery, 80.0)
        self.altitude_offset_cmd = 0.0
        self.radio_ok = True

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
            "gcs_link": float(self.gcs_link),
            "noise_dbm": self.sensors.noise_dbm,
            "drain_factor": float(self.drain_factor),
            "radio_ok": bool(self.radio_ok),
            "connected": bool(self.connected),
            "path_quality": float(self.path_quality),
            "hops": int(self.hops),
            "data_backlog": int(getattr(self, "data_backlog", 0)),
            "sorties": int(self.sorties),
            "handover_to": getattr(self, "handover_to", None),
        }

    def __repr__(self):
        return (
            f"Drone({self.id}, role={self.role.name}, status={self.status.name}, "
            f"pos=[{self.position[0]:.1f},{self.position[1]:.1f},{self.position[2]:.1f}], "
            f"bat={self.battery:.1f}%)"
        )
