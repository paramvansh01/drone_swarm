"""
Simulation runner for the UAV-X swarm.

Tick-based orchestration advancing, in order:

    scheduled events -> guidance -> flight control -> physics
    -> sensors/battery -> RF links -> mesh -> telemetry

The controller stack is the part worth reading carefully. Every aircraft is
flown by the trained LTC controller, and *simultaneously* a cascaded PID
baseline is run in shadow on the same state, same setpoint and same wind. The
shadow controller's output is never applied — it exists so the dashboard can
show, live, how far the two commands differ under the gust that is happening
right now. That is what makes "more stable under shocks" a plot rather than a
claim.
"""

from __future__ import annotations

import json
import logging
import time
import numpy as np
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, Callable, Dict, List, Optional

from .drone import Drone, DroneConfig, DroneRole, DroneStatus
from .physics import FlightDynamics
from .rf_channel import RFChannel
from .wind import WindField
from .world import World

logger = logging.getLogger("cdawn.sim")


class EventType(Enum):
    """Simulation events for fault injection and demo scripting."""
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
    """Main simulation orchestrator."""

    def __init__(
        self,
        world: World,
        wind: WindField,
        rf_channel: RFChannel,
        dt: float = 0.02,            # 50 Hz
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

        self.events: List[SimEvent] = []
        self.event_log: List[dict] = []

        self._telemetry_callbacks: List[Callable] = []
        self._event_callbacks: List[Callable] = []
        # Called with every logged mission event (recorder, metrics)
        self.log_listeners: List[Callable] = []

        # Pluggable subsystems, set by the demo controller
        self.guidance = None
        self.controller: Optional[Callable] = None
        self.shadow_controller = None    # the controller NOT flying, run for comparison
        self.shadow_kind = "PID"
        self.topology_optimizer: Optional[Callable] = None
        self.causal_layer = None
        self.mesh = None

        self.telemetry_log: List[dict] = []

        # Radio disturbances. Blocked links carry nothing until their expiry
        # (sim time); packet loss multiplies the delivery ratio of every link
        # touching the affected node ("*" = every node).
        self.link_blocks: Dict[frozenset, float] = {}
        self.packet_loss: Dict[str, float] = {}

        # Safety accounting is per incident, not per tick: two aircraft that
        # spend a second inside 3 m of each other are one collision, not 50.
        self._pair_contact: set = set()
        self._pair_near: set = set()
        self._terrain_contact: set = set()

        self.metrics = {
            "mission_start": 0.0,
            "pois_surveyed": 0,
            "total_pois": 0,
            "swarm_pdr": 1.0,
            "backhaul_pdr": 1.0,
            "avg_battery": 100.0,
            "election_time_ms": 0.0,
            "current_phase": 0,
            "collisions": 0,
            "near_misses": 0,
            "min_separation_m": 999.0,
            # Closest approach over the whole mission — the safety figure.
            # min_separation_m is only the current spacing.
            "min_separation_ever_m": 999.0,
            "terrain_contacts": 0,
            "tracking_error_m": 0.0,
            "shadow_divergence_ms2": 0.0,
            "active_nodes": 0,
            "on_pad": 0,
            "pois_delivered": 0,
            "connected_fraction": 1.0,
        }

        self._rng = np.random.RandomState(42)

        # Rolling controller-comparison accumulators
        self._track_err_acc: List[float] = []
        self._shadow_div_acc: List[float] = []

    # -- setup --------------------------------------------------------------

    def add_drone(self, drone_id: str, position: List[float],
                  role: DroneRole = DroneRole.SCOUT,
                  config: Optional[DroneConfig] = None) -> Drone:
        drone = Drone(
            drone_id=drone_id,
            position=np.array(position, dtype=np.float64),
            role=role,
            config=config,
        )
        self.drones[drone_id] = drone
        logger.info("Added drone: %s", drone)
        return drone

    def schedule_event(self, time_s: float, event_type: EventType, **params):
        self.events.append(SimEvent(time=time_s, event_type=event_type, params=params))
        self.events.sort(key=lambda e: e.time)

    def on_telemetry(self, callback: Callable):
        self._telemetry_callbacks.append(callback)

    def on_event(self, callback: Callable):
        self._event_callbacks.append(callback)

    # -- events -------------------------------------------------------------

    def _process_events(self):
        for event in self.events:
            if not event.executed and event.time <= self.sim_time:
                self._execute_event(event)
                event.executed = True

    def _execute_event(self, event: SimEvent):
        logger.info("[t=%.2f] Event: %s | %s", self.sim_time,
                    event.event_type.name, event.params)

        message = ""
        et = event.event_type

        if et == EventType.RF_DEGRADE:
            db = event.params.get("noise_db", 10.0)
            self.rf.degrade_rf(db)
            message = f"RF environment degraded by {db:.0f} dB"

        elif et == EventType.RF_RESTORE:
            self.rf.restore_rf()
            message = "RF environment restored to nominal"

        elif et == EventType.JAMMING_START:
            power = event.params.get("power_dbm", -70.0)
            self.rf.enable_jamming(power)
            message = f"RF interference detected at {power:.0f} dBm"

        elif et == EventType.JAMMING_STOP:
            self.rf.disable_jamming()
            message = "Interference ceased"

        elif et == EventType.KILL_NODE:
            drone_id = event.params.get("drone_id")
            if drone_id in self.drones:
                self.drones[drone_id].kill(self.sim_time)
                message = f"NODE LOSS: {drone_id} is down"
                logger.warning("KILLED drone %s", drone_id)

        elif et == EventType.REVIVE_NODE:
            drone_id = event.params.get("drone_id")
            if drone_id in self.drones:
                self.drones[drone_id].revive()
                message = f"{drone_id} restored"

        elif et == EventType.WIND_GUST:
            self.wind.add_gust(
                start_time=self.sim_time,
                duration=event.params.get("duration", 3.0),
                magnitude=event.params.get("magnitude", 8.0),
                profile=event.params.get("profile", "sine"),
            )
            message = f"Wind gust {event.params.get('magnitude', 8.0):.0f} m/s"

        elif et == EventType.PHASE_CHANGE:
            self.metrics["current_phase"] = event.params.get("phase", 0)
            message = f"Phase {event.params.get('phase', 0)}"

        self.log_event(et.name, message, event.params)

        for cb in self._event_callbacks:
            try:
                cb(event)
            except Exception as exc:
                logger.error("Event callback error: %s", exc)

    def log_event(self, event_type: str, message: str, params: dict = None):
        """Append to the operator-visible event log."""
        entry = {
            "time": self.sim_time,
            "type": event_type,
            "message": message,
            "params": params or {},
        }
        self.event_log.append(entry)
        if len(self.event_log) > 400:
            self.event_log = self.event_log[-250:]
        for listener in self.log_listeners:
            try:
                listener(entry)
            except Exception as exc:
                logger.error("Event listener error: %s", exc)

    # -- RF -----------------------------------------------------------------

    def _link_factor(self, a: str, b: str) -> float:
        """Multiplier on a link's delivery ratio from injected disturbances."""
        until = self.link_blocks.get(frozenset((a, b)))
        if until is not None:
            if self.sim_time < until:
                return 0.0
            self.link_blocks.pop(frozenset((a, b)), None)
        if not self.packet_loss:
            return 1.0
        loss = max(self.packet_loss.get("*", 0.0),
                   self.packet_loss.get(a, 0.0), self.packet_loss.get(b, 0.0))
        return float(np.clip(1.0 - loss, 0.0, 1.0))

    def _update_rf_links(self):
        """Recompute link quality between every pair of live aircraft, and to the GCS."""
        alive = [d for d in self.drones.values() if d.is_alive]
        radios = [d for d in alive if getattr(d, "radio_ok", True)]

        # Clear EVERY drone, not just the live ones. A node that is killed or
        # has landed stops being included in the link computation, so if its
        # neighbour table is not cleared it keeps reporting whatever link
        # qualities it had at the moment it went down — a dead relay showing
        # four healthy 1.0 links forever, which is exactly the wrong thing to
        # put in front of an operator.
        for d in self.drones.values():
            d.neighbors.clear()
            d.sensors.rssi.clear()
            d.gcs_link = 0.0

        # Noise floor at each receiver. Constant unless positional
        # interference sources exist, in which case it depends on where each
        # aircraft is and what terrain lies between it and each source.
        noise = {}
        for d in radios:
            noise[d.id] = (self.rf.noise_at(d.position, self.world)
                           if self.rf.jammers else None)
        self.rf.node_noise = {k: v for k, v in noise.items() if v is not None}

        # Each unordered pair once — the channel is reciprocal, and computing
        # it twice would also draw two independent fading samples for what is
        # physically one link.
        for i, d1 in enumerate(radios):
            for d2 in radios[i + 1:]:
                distance = float(np.linalg.norm(d1.position - d2.position))
                occlusion = self.world.compute_rf_occlusion_db(d1.position, d2.position)
                antenna = min(d1.get_antenna_pose_factor(d2.position),
                              d2.get_antenna_pose_factor(d1.position))

                # A link is only as good as its worse end
                link_noise = None
                if noise[d1.id] is not None:
                    link_noise = max(noise[d1.id], noise[d2.id])

                link = self.rf.compute_link_quality(
                    tx_power_dbm=d2.config.tx_power_dbm,
                    tx_gain_dbi=d2.config.antenna_gain_dbi,
                    rx_gain_dbi=d1.config.antenna_gain_dbi,
                    distance_m=distance,
                    occlusion_db=occlusion,
                    antenna_factor=antenna,
                    noise_dbm=link_noise,
                )

                quality = link["link_quality"] * self._link_factor(d1.id, d2.id)
                rssi = link["rssi_dbm"]

                d1.neighbors[d2.id] = quality
                d2.neighbors[d1.id] = quality
                d1.sensors.rssi[d2.id] = rssi
                d2.sensors.rssi[d1.id] = rssi

        # Links to the ground station. Same radio as the aircraft, on a mast.
        gcs = getattr(self.world, "gcs", None)
        if gcs is None:
            return
        gcs_noise = (self.rf.noise_at(gcs.position, self.world)
                     if self.rf.jammers else None)
        for d in radios:
            distance = float(np.linalg.norm(d.position - gcs.position))
            occlusion = self.world.compute_rf_occlusion_db(d.position, gcs.position)
            link_noise = None
            if noise[d.id] is not None:
                link_noise = max(noise[d.id], gcs_noise)
            link = self.rf.compute_link_quality(
                tx_power_dbm=d.config.tx_power_dbm,
                tx_gain_dbi=d.config.antenna_gain_dbi,
                rx_gain_dbi=d.config.antenna_gain_dbi,
                distance_m=distance,
                occlusion_db=occlusion,
                antenna_factor=d.get_antenna_pose_factor(gcs.position),
                noise_dbm=link_noise,
            )
            d.gcs_link = link["link_quality"] * self._link_factor(d.id, gcs.id)
            d.sensors.rssi[gcs.id] = link["rssi_dbm"]

    # -- metrics ------------------------------------------------------------

    def _compute_swarm_metrics(self):
        alive = [d for d in self.drones.values() if d.is_alive]
        self.metrics["active_nodes"] = len(alive)
        self.metrics["on_pad"] = sum(1 for d in self.drones.values()
                                     if getattr(d, "on_pad", False))

        total = len(self.world.pois)
        self.metrics["total_pois"] = total
        self.metrics["pois_surveyed"] = sum(1 for p in self.world.pois if p.surveyed)
        self.metrics["pois_delivered"] = sum(1 for p in self.world.pois
                                             if getattr(p, "delivered", False))

        if not alive:
            # Returning early here left the last computed values in place, so
            # a swarm that had entirely landed still advertised a healthy PDR.
            self.metrics["swarm_pdr"] = 0.0
            self.metrics["backhaul_pdr"] = 0.0
            self.metrics["avg_battery"] = 0.0
            self.metrics["min_separation_m"] = 0.0
            self._pair_contact.clear()
            self._pair_near.clear()
            return

        self.metrics["avg_battery"] = float(np.mean([d.battery for d in alive]))

        qualities = []
        for d in alive:
            qualities.extend(d.neighbors.values())
        if qualities:
            self.metrics["swarm_pdr"] = float(np.mean(qualities))

        # Backhaul PDR is the number that actually matters operationally:
        # can each scout's data reach the ground station? A high mean over all
        # pairs can hide a scout that is completely cut off.
        self.metrics["backhaul_pdr"] = self._compute_backhaul_pdr(alive)

        # Separation / collision accounting, per incident
        min_sep = 999.0
        contact, near = set(), set()
        for i, d1 in enumerate(alive):
            for d2 in alive[i + 1:]:
                dist = float(np.linalg.norm(d1.position - d2.position))
                min_sep = min(min_sep, dist)
                pair = (d1.id, d2.id)
                if dist < self.COLLISION_RADIUS_M:
                    contact.add(pair)
                elif dist < self.NEAR_MISS_RADIUS_M:
                    near.add(pair)
        self.metrics["collisions"] += len(contact - self._pair_contact)
        self.metrics["near_misses"] += len(near - self._pair_near)
        self._pair_contact, self._pair_near = contact, near
        self.metrics["min_separation_m"] = min_sep
        if min_sep < 999.0:
            self.metrics["min_separation_ever_m"] = min(
                self.metrics["min_separation_ever_m"], min_sep)

        if self._track_err_acc:
            self.metrics["tracking_error_m"] = float(np.mean(self._track_err_acc[-150:]))
        if self._shadow_div_acc:
            self.metrics["shadow_divergence_ms2"] = float(np.mean(self._shadow_div_acc[-150:]))

    COLLISION_RADIUS_M = 3.0
    NEAR_MISS_RADIUS_M = 10.0

    def path_qualities(self, alive: List[Drone] = None) -> Dict[str, tuple]:
        """
        Best end-to-end delivery ratio from every live aircraft to the GCS
        (max-product over multi-hop paths), with the hop count of that path.
        """
        alive = alive if alive is not None else [d for d in self.drones.values() if d.is_alive]
        best = {d.id: (float(getattr(d, "gcs_link", 0.0)), 1) for d in alive}
        for _ in range(len(alive)):
            updated = False
            for d in alive:
                q_d, h_d = best[d.id]
                for nb_id, q in d.neighbors.items():
                    if nb_id not in best:
                        continue
                    cand = best[nb_id][0] * q
                    if cand > q_d + 1e-9:
                        q_d, h_d = cand, best[nb_id][1] + 1
                        updated = True
                best[d.id] = (q_d, h_d)
            if not updated:
                break
        return best

    def _compute_backhaul_pdr(self, alive: List[Drone]) -> float:
        """
        Mean end-to-end delivery ratio from each scout to the ground station,
        over the best multi-hop path (max-product reliability).
        """
        scouts = [d for d in alive if d.role == DroneRole.SCOUT]
        if not scouts:
            scouts = alive
        if not scouts or getattr(self.world, "gcs", None) is None:
            return 0.0
        best = self.path_qualities(alive)
        return float(np.mean([best[s.id][0] for s in scouts]))

    # -- control ------------------------------------------------------------

    def _default_controller(self, drone: Drone, wind_vel: np.ndarray, dt: float):
        """Fallback P/D controller if no LTC or PID hook is installed."""
        if drone.target_position is None:
            drone.thrust_command = np.array([0.0, 0.0, drone.config.mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        error = drone.target_position - drone.position
        desired_accel = 1.4 * error + 3.0 * (drone.target_velocity - drone.velocity)
        desired_accel = np.clip(desired_accel, -12.0, 12.0)

        force = drone.config.mass * (desired_accel + np.array([0.0, 0.0, 9.81]))
        mag = float(np.linalg.norm(force))
        if mag > drone.config.max_thrust:
            force *= drone.config.max_thrust / mag

        drone.thrust_command = force
        drone.yaw_rate_command = 0.0

    # -- main loop ----------------------------------------------------------

    def tick(self):
        """Advance the simulation by one timestep."""
        self._process_events()

        # 1. Guidance: mission -> setpoints
        if self.guidance is not None:
            self.guidance.update(self.drones, self.sim_time, self.dt)

            # GNSS denial: guidance plans on where the aircraft BELIEVES it
            # is, so a drifting navigation solution steers it off the track
            # it thinks it is flying.
            for drone in self.drones.values():
                error = getattr(drone, "nav_error", None)
                if error is not None and drone.target_position is not None \
                        and float(np.linalg.norm(error)) > 0.5:
                    drone.target_position = drone.target_position + error

        # 2. Control + physics, per aircraft
        for drone in self.drones.values():
            if not drone.is_alive:
                if drone.status == DroneStatus.KILLED:
                    self._fall(drone)
                continue

            wind_vel = self.wind.get_wind_at(drone.position, self.sim_time, self.dt)

            if self.controller:
                self.controller(drone, wind_vel, self.sim_time, self.dt)
            else:
                self._default_controller(drone, wind_vel, self.dt)

            # Shadow baseline on the identical state/setpoint/wind
            self._run_shadow(drone, wind_vel)

            ground = self.world.get_terrain_height(drone.position[0], drone.position[1])

            # A damaged airframe cannot command full thrust
            health = float(getattr(drone, "health", 1.0))
            if health < 1.0:
                limit = self.physics.max_thrust * health
                magnitude = float(np.linalg.norm(drone.thrust_command))
                if magnitude > limit:
                    drone.thrust_command = drone.thrust_command * (limit / magnitude)

            result = self.physics.step(
                position=drone.position,
                velocity=drone.velocity,
                orientation=drone.orientation,
                angular_velocity=drone.angular_velocity,
                thrust_command=drone.thrust_command,
                yaw_rate_command=drone.yaw_rate_command,
                wind_velocity=wind_vel,
                dt=self.dt,
                ground_height=ground,
            )

            drone.position = result["position"]
            drone.velocity = result["velocity"]
            drone.orientation = result["orientation"]
            drone.angular_velocity = result["angular_velocity"]
            drone.acceleration = result["acceleration"]

            # Terrain-aware safety net. Guidance should already have kept the
            # setpoint clear; this catches the case where wind overwhelmed the
            # controller before it could respond. A controlled descent onto a
            # GCS pad is a landing, not a terrain strike.
            agl = drone.position[2] - ground
            landing = (self.guidance is not None and
                       getattr(self.guidance.phases.get(drone.id), "name", "") == "LANDING")
            if agl < 3.0:
                drone.position[2] = ground + 3.0
                drone.velocity[2] = max(drone.velocity[2], 0.0)
                if not landing and drone.id not in self._terrain_contact:
                    self._terrain_contact.add(drone.id)
                    self.metrics["terrain_contacts"] += 1
            elif agl > 6.0:
                self._terrain_contact.discard(drone.id)

            size = self.world.terrain.config.size_m
            drone.position[0] = float(np.clip(drone.position[0], 5.0, size - 5.0))
            drone.position[1] = float(np.clip(drone.position[1], 5.0, size - 5.0))

            if drone.target_position is not None:
                drone.tracking_error = float(
                    np.linalg.norm(drone.target_position - drone.position))
                self._track_err_acc.append(drone.tracking_error)

            drone.update_sensors(wind_vel, self._rng, self.dt)
            drone.update_battery(self.dt)

        if len(self._track_err_acc) > 600:
            self._track_err_acc = self._track_err_acc[-300:]
        if len(self._shadow_div_acc) > 600:
            self._shadow_div_acc = self._shadow_div_acc[-300:]

        # 3. RF links
        self._update_rf_links()

        # 4. Relay topology optimisation (expensive — not every tick)
        if self.topology_optimizer and self.tick_count % 25 == 0:
            try:
                self.topology_optimizer(self.drones, self.world, self.rf)
            except Exception as exc:
                logger.error("Topology optimizer error: %s", exc, exc_info=True)

        # 5. Causal diagnostics + interventions
        if self.causal_layer and self.tick_count % 5 == 0:
            try:
                self.causal_layer.update(self.drones, self.rf, self.sim_time)
            except Exception as exc:
                logger.error("Causal layer error: %s", exc, exc_info=True)

        # 6. Metrics + telemetry
        self._compute_swarm_metrics()

        telemetry = self._build_telemetry()
        for cb in self._telemetry_callbacks:
            try:
                cb(telemetry)
            except Exception as exc:
                logger.error("Telemetry callback error: %s", exc)

        self.sim_time += self.dt
        self.tick_count += 1

    step = tick

    def _fall(self, drone: Drone):
        """A killed aircraft drops to the terrain under gravity and drag."""
        ground = self.world.get_terrain_height(drone.position[0], drone.position[1])
        if drone.position[2] <= ground + 0.3:
            drone.velocity = np.zeros(3)
            return
        drone.velocity = drone.velocity * 0.995 + np.array([0.0, 0.0, -9.81]) * self.dt
        drone.velocity[2] = max(drone.velocity[2], -35.0)      # terminal velocity
        drone.position = drone.position + drone.velocity * self.dt
        if drone.position[2] < ground + 0.3:
            drone.position[2] = ground + 0.3
            drone.velocity = np.zeros(3)

    def _run_shadow(self, drone: Drone, wind_vel: np.ndarray):
        """
        Evaluate the PID baseline on this aircraft's current state without
        applying it, and record how far its command would have diverged.

        The shadow controller carries its own integrator state per aircraft,
        so it is a fair representation of what that baseline would be doing
        had it been flying — not a one-shot evaluation from a cold start.
        """
        if self.shadow_controller is None or drone.target_position is None:
            return

        shadow = self.shadow_controller.get(drone.id)
        if shadow is None:
            return

        kwargs = dict(
            position_error=drone.target_position - drone.position,
            velocity=drone.velocity,
            wind_estimate=drone.sensors.wind_estimate,
            yaw_error=0.0,
            dt=self.dt,
            velocity_setpoint=drone.target_velocity,
        )
        # The LTC additionally consumes the current attitude; the PID does not.
        if getattr(self, "shadow_kind", "PID") == "LTC":
            kwargs["body_z"] = self.physics.quaternion_to_rotation_matrix(
                drone.orientation)[:, 2]

        try:
            force, _ = shadow.compute_control(**kwargs)
        except TypeError:
            kwargs.pop("body_z", None)
            force, _ = shadow.compute_control(**kwargs)

        # Difference between the applied command and what PID would command,
        # expressed as an acceleration discrepancy (m/s^2).
        drone.shadow_tracking_error = float(
            np.linalg.norm(force - drone.thrust_command) / drone.config.mass)
        self._shadow_div_acc.append(drone.shadow_tracking_error)

    # -- telemetry ----------------------------------------------------------

    def _build_telemetry(self) -> dict:
        mission_events = []
        if self.guidance is not None:
            mission_events.extend(self.guidance.drain_events())
        if self.causal_layer is not None:
            mission_events.extend(self.causal_layer.drain_events())

        for ev in mission_events:
            self.log_event(ev.get("type", "INFO"), ev.get("message", ""), ev)

        return {
            "sim_time": self.sim_time,
            "tick": self.tick_count,
            "drones": {d_id: d.get_state() for d_id, d in self.drones.items()},
            "metrics": dict(self.metrics),
            "rf": self.rf.get_state(),
            "wind": self.wind.get_state(),
            "injects": getattr(self, "inject_state", {}),
            "mission": getattr(self, "mission_state", {}),
            "comms": getattr(self, "comms_state", {}),
            "events": self.event_log[-30:],
            "gcs": self.world.gcs.get_state() if getattr(self.world, "gcs", None) else None,
            "geofence": (self.world.geofence.get_state()
                         if getattr(self.world, "geofence", None) else None),
            # Tasks a scenario will release later are hidden until they are
            "pois": [p.get_state() for p in self.world.pois if self._poi_visible(p)],
        }

    def _poi_visible(self, poi) -> bool:
        mt = self.guidance.mission_time(self.sim_time) if self.guidance is not None else None
        return poi.release_time <= 0.0 if mt is None else poi.released(mt)

    # -- batch running ------------------------------------------------------

    def run(self, duration: float, progress_interval: float = 10.0):
        """Run headless for a fixed duration (used by the benchmarks)."""
        end_time = self.sim_time + duration
        last_progress = self.sim_time

        logger.info("Simulation: %.0fs, dt=%.3f, drones=%d",
                    duration, self.dt, len(self.drones))

        while self.sim_time < end_time:
            tick_start = time.time()
            self.tick()

            if self.realtime:
                sleep_time = self.dt - (time.time() - tick_start)
                if sleep_time > 0:
                    time.sleep(sleep_time)

            if self.sim_time - last_progress >= progress_interval:
                logger.info(
                    "[t=%.0fs] backhaul PDR=%.3f batt=%.0f%% PoIs=%d/%d phase=%d",
                    self.sim_time, self.metrics["backhaul_pdr"],
                    self.metrics["avg_battery"], self.metrics["pois_surveyed"],
                    self.metrics["total_pois"], self.metrics["current_phase"],
                )
                last_progress = self.sim_time

        logger.info("Complete: %d ticks", self.tick_count)

    def reset(self):
        self.sim_time = 0.0
        self.tick_count = 0
        self.telemetry_log.clear()
        self.event_log.clear()
        self._track_err_acc.clear()
        self._shadow_div_acc.clear()

        for event in self.events:
            event.executed = False

        for drone in self.drones.values():
            drone.position = drone.home_position.copy()
            drone.velocity = np.zeros(3)
            drone.acceleration = np.zeros(3)
            drone.orientation = np.array([1.0, 0.0, 0.0, 0.0])
            drone.angular_velocity = np.zeros(3)
            drone.battery = drone.config.battery_capacity
            drone.min_battery_airborne = drone.battery
            # Aircraft whose home is a GCS pad start the next run on it
            drone.status = (DroneStatus.READY if getattr(drone, "starts_on_pad", False)
                            else DroneStatus.ACTIVE)
            drone.radio_ok = True
            drone.connected = True
            drone.lost_link_s = 0.0
            drone.sorties = 0
            drone.altitude_offset_cmd = 0.0
            drone.target_position = None
            drone.assigned_poi = None

        self.world.reset_pois()
        self.rf.restore_rf()
        self.rf.disable_jamming()
        self.link_blocks.clear()
        self.packet_loss.clear()
        self._pair_contact.clear()
        self._pair_near.clear()
        self._terrain_contact.clear()

        for key, value in (("pois_surveyed", 0), ("collisions", 0),
                           ("near_misses", 0), ("current_phase", 0),
                           ("terrain_contacts", 0), ("pois_delivered", 0),
                           ("min_separation_ever_m", 999.0)):
            self.metrics[key] = value

    def get_snapshot(self) -> dict:
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
        with open(filepath, "w") as f:
            json.dump(self.telemetry_log, f, indent=2)
        logger.info("Exported %d telemetry entries to %s",
                    len(self.telemetry_log), filepath)
