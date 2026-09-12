"""
Simulation runner for C-DAWN.

Tick-based orchestration loop that advances physics, controllers,
mesh networking, diagnostics, and telemetry each step.
Supports fault injection events and logging.
"""

import numpy as np
import time
import json
import logging
from typing import List, Dict, Optional, Callable, Any
from dataclasses import dataclass, field
from enum import Enum, auto

from .world import World
from .drone import Drone, DroneRole, DroneStatus, DroneConfig
from .physics import FlightDynamics
from .rf_channel import RFChannel
from .wind import WindField

logger = logging.getLogger("cdawn.sim")


class EventType(Enum):
    """Simulation event types for fault injection and demo scripting."""
    RF_DEGRADE = auto()
    RF_RESTORE = auto()
    JAMMING_START = auto()
    JAMMING_STOP = auto()
    KILL_NODE = auto()
    REVIVE_NODE = auto()
    WIND_GUST = auto()
    PHASE_CHANGE = auto()


@dataclass
class SimEvent:
    """A scheduled simulation event."""
    time: float
    event_type: EventType
    params: dict = field(default_factory=dict)
    executed: bool = False


class SimulationRunner:
    """
    Main simulation orchestrator.

    Runs a tick-based loop advancing all drone states, physics,
    RF links, wind, and controller outputs. Supports:
    - Scheduled event injection
    - Real-time telemetry callbacks
    - Configurable tick rate
    - Logging / export
    """

    def __init__(
        self,
        world: World,
        wind: WindField,
        rf_channel: RFChannel,
        dt: float = 0.02,  # 50 Hz
        realtime: bool = False,
    ):
        self.world = world
        self.wind = wind
        self.rf = rf_channel
        self.dt = dt
        self.realtime = realtime

        self.physics = FlightDynamics()
        self.drones: Dict[str, Drone] = {}
        self.sim_time = 0.0
        self.tick_count = 0

        # Event queue
        self.events: List[SimEvent] = []

        # Callbacks
        self._telemetry_callbacks: List[Callable] = []
        self._event_callbacks: List[Callable] = []

        # Controller hook (set externally by LTC/PID controller)
        self.controller: Optional[Callable] = None

        # GNN topology hook (set externally)
        self.topology_optimizer: Optional[Callable] = None

        # SCM diagnostics hook (set externally)
        self.scm_diagnostics: Optional[Callable] = None

        # Telemetry log
        self.telemetry_log: List[dict] = []

        # Metrics
        self.metrics = {
            "mission_start": 0.0,
            "pois_surveyed": 0,
            "total_pois": 0,
            "swarm_pdr": 1.0,
            "avg_battery": 100.0,
            "election_time_ms": 0.0,
            "current_phase": 0,
            "collisions": 0,
        }

        # RNG
        self._rng = np.random.RandomState(42)

    def add_drone(
        self,
        drone_id: str,
        position: List[float],
        role: DroneRole = DroneRole.SCOUT,
        config: Optional[DroneConfig] = None,
    ) -> Drone:
        """Add a drone to the simulation."""
        drone = Drone(
            drone_id=drone_id,
            position=np.array(position, dtype=np.float64),
            role=role,
            config=config,
        )
        self.drones[drone_id] = drone
        logger.info(f"Added drone: {drone}")
        return drone

    def schedule_event(self, time: float, event_type: EventType, **params):
        """Schedule a simulation event."""
        self.events.append(SimEvent(time=time, event_type=event_type, params=params))
        self.events.sort(key=lambda e: e.time)

    def on_telemetry(self, callback: Callable):
        """Register a telemetry callback (called each tick)."""
        self._telemetry_callbacks.append(callback)

    def on_event(self, callback: Callable):
        """Register an event callback (called when events fire)."""
        self._event_callbacks.append(callback)

    def _process_events(self):
        """Execute any events scheduled for the current time."""
        for event in self.events:
            if event.executed:
                continue
            if event.time <= self.sim_time:
                self._execute_event(event)
                event.executed = True

    def _execute_event(self, event: SimEvent):
        """Execute a single simulation event."""
        logger.info(f"[t={self.sim_time:.2f}] Event: {event.event_type.name} | {event.params}")

        if event.event_type == EventType.RF_DEGRADE:
            self.rf.degrade_rf(event.params.get("noise_db", 10.0))

        elif event.event_type == EventType.RF_RESTORE:
            self.rf.restore_rf()

        elif event.event_type == EventType.JAMMING_START:
            self.rf.enable_jamming(event.params.get("power_dbm", -70.0))

        elif event.event_type == EventType.JAMMING_STOP:
            self.rf.disable_jamming()

        elif event.event_type == EventType.KILL_NODE:
            drone_id = event.params.get("drone_id")
            if drone_id and drone_id in self.drones:
                self.drones[drone_id].kill()
                logger.warning(f"KILLED drone {drone_id}")

        elif event.event_type == EventType.REVIVE_NODE:
            drone_id = event.params.get("drone_id")
            if drone_id and drone_id in self.drones:
                self.drones[drone_id].revive()

        elif event.event_type == EventType.WIND_GUST:
            self.wind.add_gust(
                start_time=self.sim_time,
                duration=event.params.get("duration", 3.0),
                magnitude=event.params.get("magnitude", 8.0),
                profile=event.params.get("profile", "sine"),
            )

        elif event.event_type == EventType.PHASE_CHANGE:
            self.metrics["current_phase"] = event.params.get("phase", 0)

        # Notify callbacks
        for cb in self._event_callbacks:
            try:
                cb(event)
            except Exception as e:
                logger.error(f"Event callback error: {e}")

    def _update_rf_links(self):
        """Compute RF link quality between all drone pairs."""
        alive_drones = [d for d in self.drones.values() if d.is_alive]

        for i, d1 in enumerate(alive_drones):
            d1.neighbors.clear()
            d1.sensors.rssi.clear()

            for j, d2 in enumerate(alive_drones):
                if i == j:
                    continue

                distance = float(np.linalg.norm(d1.position - d2.position))
                occlusion_db = self.world.compute_rf_occlusion_db(d1.position, d2.position)
                antenna_factor = d1.get_antenna_pose_factor(d2.position)

                link = self.rf.compute_link_quality(
                    tx_power_dbm=d2.config.tx_power_dbm,
                    tx_gain_dbi=d2.config.antenna_gain_dbi,
                    rx_gain_dbi=d1.config.antenna_gain_dbi,
                    distance_m=distance,
                    occlusion_db=occlusion_db,
                    antenna_factor=antenna_factor,
                )

                d1.neighbors[d2.id] = link["link_quality"]
                d1.sensors.rssi[d2.id] = link["rssi_dbm"]

    def _compute_swarm_metrics(self):
        """Compute aggregate swarm metrics."""
        alive = [d for d in self.drones.values() if d.is_alive]
        if not alive:
            return

        # Average battery
        self.metrics["avg_battery"] = np.mean([d.battery for d in alive])

        # Swarm PDR (average of all link PDRs)
        all_link_qualities = []
        for d in alive:
            all_link_qualities.extend(d.neighbors.values())
        if all_link_qualities:
            self.metrics["swarm_pdr"] = float(np.mean(all_link_qualities))

        # Mission progress
        total = len(self.world.pois)
        surveyed = sum(1 for p in self.world.pois if p.surveyed)
        self.metrics["total_pois"] = total
        self.metrics["pois_surveyed"] = surveyed

        # Collision check
        for i, d1 in enumerate(alive):
            for j, d2 in enumerate(alive):
                if i >= j:
                    continue
                dist = np.linalg.norm(d1.position - d2.position)
                if dist < 1.0:  # near-miss threshold
                    self.metrics["collisions"] += 1

    def _default_controller(self, drone: Drone, wind_vel: np.ndarray):
        """
        Default waypoint-following controller (simple P controller).

        This is the fallback if no LTC/PID controller is plugged in.
        """
        if drone.target_position is None:
            # Hover in place
            drone.thrust_command = np.array([0.0, 0.0, drone.config.mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        # Position error
        error = drone.target_position - drone.position
        dist = np.linalg.norm(error)

        # P controller with feedforward gravity compensation
        Kp = 3.0
        Kd = 2.0
        desired_accel = Kp * error - Kd * drone.velocity

        # Gravity compensation
        thrust = drone.config.mass * (desired_accel + np.array([0, 0, 9.81]))

        # Clamp
        thrust_mag = np.linalg.norm(thrust)
        if thrust_mag > drone.config.max_thrust:
            thrust = thrust * (drone.config.max_thrust / thrust_mag)

        drone.thrust_command = thrust
        drone.yaw_rate_command = 0.0

        # Check if PoI is reached (within 3m)
        if drone.assigned_poi and dist < 3.0:
            self.world.mark_poi_surveyed(drone.assigned_poi, drone.id, self.sim_time)
            drone.assigned_poi = None
            # Assign next PoI
            unsurveyed = self.world.get_unsurveyed_pois()
            if unsurveyed:
                next_poi = unsurveyed[0]
                drone.set_target(next_poi.position, next_poi.id)
            else:
                drone.target_position = None

    def tick(self):
        """Advance simulation by one timestep."""
        # Process scheduled events
        self._process_events()

        # Update each drone
        for drone in self.drones.values():
            if not drone.is_alive:
                continue

            # Get wind at drone position
            wind_vel = self.wind.get_wind_at(drone.position, self.sim_time, self.dt)

            # Run controller
            if self.controller:
                self.controller(drone, wind_vel, self.sim_time, self.dt)
            else:
                self._default_controller(drone, wind_vel)

            # Physics step
            result = self.physics.step(
                position=drone.position,
                velocity=drone.velocity,
                orientation=drone.orientation,
                angular_velocity=drone.angular_velocity,
                thrust_command=drone.thrust_command,
                yaw_rate_command=drone.yaw_rate_command,
                wind_velocity=wind_vel,
                dt=self.dt,
            )

            # Update drone state
            drone.position = result["position"]
            drone.velocity = result["velocity"]
            drone.orientation = result["orientation"]
            drone.angular_velocity = result["angular_velocity"]
            drone.acceleration = result["acceleration"]

            # Collision check
            if self.world.check_collision(drone.position):
                # Push drone back above obstacle
                drone.position[2] = max(drone.position[2], 5.0)
                drone.velocity[2] = max(drone.velocity[2], 0.0)

            # Bounds check / geofencing
            if not self.world.is_in_bounds(drone.position):
                # Clamp to bounds
                drone.position = np.clip(
                    drone.position,
                    [0, -self.world.bounds[1]/2, 0],
                    self.world.bounds,
                )

            # Update sensors
            drone.update_sensors(wind_vel, self._rng)

            # Update battery
            drone.update_battery(self.dt)

        # Update RF links between all drones
        self._update_rf_links()

        # Run GNN topology optimizer if available
        if self.topology_optimizer and self.tick_count % 10 == 0:  # every 10 ticks
            try:
                self.topology_optimizer(self.drones, self.world, self.rf)
            except Exception as e:
                logger.error(f"Topology optimizer error: {e}")

        # Run SCM diagnostics if available
        if self.scm_diagnostics and self.tick_count % 5 == 0:  # every 5 ticks
            try:
                self.scm_diagnostics(self.drones, self.world, self.rf, self.sim_time)
            except Exception as e:
                logger.error(f"SCM diagnostics error: {e}")

        # Compute metrics
        self._compute_swarm_metrics()

        # Record telemetry
        telemetry = self._build_telemetry()
        self.telemetry_log.append(telemetry)

        # Keep log bounded
        if len(self.telemetry_log) > 10000:
            self.telemetry_log = self.telemetry_log[-7000:]

        # Notify telemetry callbacks
        for cb in self._telemetry_callbacks:
            try:
                cb(telemetry)
            except Exception as e:
                logger.error(f"Telemetry callback error: {e}")

        # Advance time
        self.sim_time += self.dt
        self.tick_count += 1

    step = tick

    def _build_telemetry(self) -> dict:
        """Build a telemetry snapshot for the current tick."""
        return {
            "sim_time": self.sim_time,
            "tick": self.tick_count,
            "drones": {d_id: d.get_state() for d_id, d in self.drones.items()},
            "metrics": dict(self.metrics),
            "rf": self.rf.get_state(),
            "wind": self.wind.get_state(),
            "world": {
                "pois": [
                    {
                        "id": p.id,
                        "position": p.position.tolist(),
                        "category": p.category,
                        "surveyed": p.surveyed,
                    }
                    for p in self.world.pois
                ],
            },
        }

    def run(self, duration: float, progress_interval: float = 5.0):
        """
        Run the simulation for a given duration.

        Args:
            duration: Total simulation time (seconds).
            progress_interval: Log progress every N seconds of sim time.
        """
        end_time = self.sim_time + duration
        last_progress = self.sim_time

        logger.info(f"Starting simulation: {duration}s, dt={self.dt}s, drones={len(self.drones)}")

        while self.sim_time < end_time:
            tick_start = time.time()

            self.tick()

            # Realtime pacing
            if self.realtime:
                elapsed = time.time() - tick_start
                sleep_time = self.dt - elapsed
                if sleep_time > 0:
                    time.sleep(sleep_time)

            # Progress logging
            if self.sim_time - last_progress >= progress_interval:
                logger.info(
                    f"[t={self.sim_time:.1f}s] "
                    f"PDR={self.metrics['swarm_pdr']:.3f} "
                    f"Battery={self.metrics['avg_battery']:.1f}% "
                    f"PoIs={self.metrics['pois_surveyed']}/{self.metrics['total_pois']} "
                    f"Phase={self.metrics['current_phase']}"
                )
                last_progress = self.sim_time

        logger.info(f"Simulation complete: {self.tick_count} ticks")

    def reset(self):
        """Reset simulation state."""
        self.sim_time = 0.0
        self.tick_count = 0
        self.telemetry_log.clear()
        for event in self.events:
            event.executed = False
        for drone in self.drones.values():
            drone.position = drone.home_position.copy()
            drone.velocity = np.zeros(3)
            drone.battery = drone.config.battery_capacity
            drone.status = DroneStatus.ACTIVE

    def get_snapshot(self) -> dict:
        """Get complete simulation state snapshot."""
        return {
            "sim_time": self.sim_time,
            "tick": self.tick_count,
            "drones": {d_id: d.get_state() for d_id, d in self.drones.items()},
            "world": self.world.get_state(),
            "rf": self.rf.get_state(),
            "wind": self.wind.get_state(),
            "metrics": dict(self.metrics),
        }

    def export_telemetry(self, filepath: str):
        """Export telemetry log to JSON file."""
        with open(filepath, "w") as f:
            json.dump(self.telemetry_log, f, indent=2)
        logger.info(f"Exported {len(self.telemetry_log)} telemetry entries to {filepath}")
