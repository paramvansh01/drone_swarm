"""
Guidance and mission planning for C-DAWN.

This layer sits between the mission (survey these PoIs) and the flight
controller (hold this setpoint). It is responsible for:

  - assigning survey targets to scouts,
  - routing them through the valley with terrain-following clearance,
  - producing a *local* carrot setpoint a short distance ahead of the
    aircraft rather than handing the controller a 3 km position error,
  - enforcing the geofence and the deterministic return-to-home rule.

The carrot formulation matters for more than elegance: the LTC controller is
trained on bounded tracking errors, so feeding it a raw kilometre-scale error
would push it far outside its training distribution. Guidance keeps every
controller input inside the envelope the network actually learned.
"""

from __future__ import annotations

import numpy as np
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, List, Optional

from .drone import Drone, DroneRole, DroneStatus


class MissionPhase(Enum):
    """What a single aircraft is currently doing."""
    IDLE = auto()
    CLIMB_OUT = auto()      # gaining transit altitude before departing
    TRANSIT = auto()        # cruising the corridor toward a target
    SURVEY = auto()         # descending onto / loitering over a PoI
    RELAY_HOLD = auto()     # station-keeping at a GNN-assigned relay position
    RTH = auto()            # returning to home
    MANUAL = auto()         # flying to an operator-commanded point
    LANDED = auto()


@dataclass
class Route:
    """An ordered list of 3D waypoints with a progress cursor."""
    waypoints: List[np.ndarray] = field(default_factory=list)
    cursor: int = 0

    @property
    def finished(self) -> bool:
        return self.cursor >= len(self.waypoints)

    @property
    def current(self) -> Optional[np.ndarray]:
        if self.finished:
            return None
        return self.waypoints[self.cursor]

    def remaining_length(self, position: np.ndarray) -> float:
        """Path distance still to fly from `position`."""
        if self.finished:
            return 0.0
        total = float(np.linalg.norm(self.waypoints[self.cursor] - position))
        for a, b in zip(self.waypoints[self.cursor:], self.waypoints[self.cursor + 1:]):
            total += float(np.linalg.norm(b - a))
        return total


class GuidanceLayer:
    """
    Produces per-drone setpoints from mission intent.

    One instance serves the whole swarm; call :meth:`update` once per tick.
    """

    # Carrot distance ahead of the aircraft along its route
    LOOKAHEAD_M = 55.0

    # Waypoint capture radius
    CAPTURE_RADIUS_M = 28.0

    # A PoI counts as surveyed when the scout is within this HORIZONTAL
    # radius of it and low enough for its sensor to resolve the scene.
    # Slant range is the wrong test: the target is on the ground and the
    # aircraft deliberately orbits ~35 m above it, so a 3D distance check
    # can never be satisfied no matter how well the scout flies.
    SURVEY_RADIUS_M = 30.0
    SURVEY_CEILING_AGL_M = 70.0
    SURVEY_DWELL_S = 2.0

    # Terrain clearance for transit legs
    TRANSIT_CLEARANCE_M = 110.0
    SURVEY_CLEARANCE_M = 35.0

    CRUISE_SPEED = 18.0
    SURVEY_SPEED = 5.0
    CLIMB_SPEED = 6.0

    def __init__(self, world, seed: int = 42):
        self.world = world
        self.terrain = world.terrain
        self._rng = np.random.RandomState(seed)

        self.routes: Dict[str, Route] = {}
        self.phases: Dict[str, MissionPhase] = {}
        self.assignments: Dict[str, str] = {}      # drone_id -> poi_id
        self._survey_timers: Dict[str, float] = {}

        # Relay stations commanded by the GNN topology optimiser
        self.relay_stations: Dict[str, np.ndarray] = {}

        # Operator overrides: drone_id -> commanded hover point. While set,
        # the autonomy (tasking and the GNN) leaves that aircraft alone.
        self.manual_targets: Dict[str, np.ndarray] = {}
        # Cloud base (m AGL) in bad weather: aircraft must stay below it to
        # keep the ground in sight. None means clear skies.
        self.ceiling_agl = None
        # Targets the EW response has held because a jammer overpowers them
        self.denied_pois: set = set()

        self.events: List[dict] = []

    # -- route construction -------------------------------------------------

    def _corridor_waypoints(self, x_from: float, x_to: float,
                            step: float = 220.0) -> List[np.ndarray]:
        """
        Waypoints following the valley centreline between two eastings, at
        terrain-following transit altitude.
        """
        if abs(x_to - x_from) < step:
            return []

        direction = 1.0 if x_to > x_from else -1.0
        n = max(int(abs(x_to - x_from) / step), 1)
        pts = []
        for i in range(1, n + 1):
            x = x_from + direction * step * i
            if (direction > 0 and x > x_to) or (direction < 0 and x < x_to):
                break
            y = float(self.terrain.corridor_centerline_y(x))
            z = self.world.safe_altitude_at(x, y, self.TRANSIT_CLEARANCE_M)
            pts.append(np.array([x, y, z]))
        return pts

    def _build_survey_route(self, drone: Drone, poi) -> Route:
        """Climb-out, corridor transit, then a descending approach to the PoI."""
        start = drone.position.copy()
        waypoints: List[np.ndarray] = []

        # 1. Climb out to transit altitude over the current position
        climb_z = self.world.safe_altitude_at(start[0], start[1], self.TRANSIT_CLEARANCE_M)
        if climb_z - start[2] > 15.0:
            waypoints.append(np.array([start[0], start[1], climb_z]))

        # 2. Follow the corridor toward the target's easting
        waypoints.extend(self._corridor_waypoints(start[0], float(poi.position[0])))

        # 3. Standoff point above the PoI, then descend onto it
        px, py = float(poi.position[0]), float(poi.position[1])
        standoff_z = self.world.safe_altitude_at(px, py, self.TRANSIT_CLEARANCE_M)
        waypoints.append(np.array([px, py, standoff_z]))

        survey_z = self.terrain.height_at(px, py) + self.SURVEY_CLEARANCE_M
        waypoints.append(np.array([px, py, survey_z]))

        return Route(waypoints=waypoints)

    def _build_rth_route(self, drone: Drone) -> Route:
        """Deterministic return-to-home: climb, backtrack the corridor, descend."""
        start = drone.position.copy()
        home = drone.home_position.copy()
        waypoints: List[np.ndarray] = []

        climb_z = self.world.safe_altitude_at(start[0], start[1], self.TRANSIT_CLEARANCE_M)
        waypoints.append(np.array([start[0], start[1], max(climb_z, start[2])]))
        waypoints.extend(self._corridor_waypoints(start[0], float(home[0])))
        waypoints.append(np.array([home[0], home[1],
                                   self.world.safe_altitude_at(home[0], home[1], 60.0)]))
        waypoints.append(home)

        return Route(waypoints=waypoints)

    # -- assignment ---------------------------------------------------------

    def assign_targets(self, drones: Dict[str, Drone], sim_time: float):
        """
        Assign unsurveyed PoIs to idle scouts.

        Selection is nearest-first weighted by PoI priority, so high-priority
        targets are not starved just because they are further up the valley.
        """
        taken = set(self.assignments.values())
        unsurveyed = [p for p in self.world.get_unsurveyed_pois()
                      if p.id not in taken and p.id not in self.denied_pois]
        if not unsurveyed:
            return

        for drone in drones.values():
            if not drone.is_alive or drone.role != DroneRole.SCOUT:
                continue
            if self.assignments.get(drone.id):
                continue
            if self.phases.get(drone.id) == MissionPhase.RTH:
                continue
            if drone.id in self.manual_targets:
                continue
            if not unsurveyed:
                break

            def cost(poi):
                dist = float(np.linalg.norm(poi.position[:2] - drone.position[:2]))
                return dist * (0.6 + 0.25 * poi.priority)

            poi = min(unsurveyed, key=cost)
            unsurveyed.remove(poi)

            self.assignments[drone.id] = poi.id
            self.routes[drone.id] = self._build_survey_route(drone, poi)
            self.phases[drone.id] = MissionPhase.TRANSIT
            drone.assigned_poi = poi.id

            self.events.append({
                "time": sim_time,
                "type": "TASKING",
                "drone": drone.id,
                "poi": poi.id,
                "message": f"{drone.id} tasked to survey {poi.id} ({poi.category})",
            })

    def set_relay_station(self, drone_id: str, position: np.ndarray):
        """Called by the GNN relay optimiser to command a relay position."""
        if drone_id in self.manual_targets:
            return      # the operator has this aircraft; the GNN does not
        self.relay_stations[drone_id] = np.asarray(position, dtype=np.float64)

    # -- operator commands --------------------------------------------------

    def command_goto(self, drone: Drone, ground_point, hover_agl: float = None,
                     sim_time: float = 0.0):
        """
        Send an aircraft to hover over a point the operator clicked.

        The route climbs, crosses intervening terrain with clearance, and
        holds over the point. Scouts give up their survey tasking (and will
        survey any target they end up over); relays stop taking GNN stations.
        """
        x, y = float(ground_point[0]), float(ground_point[1])
        size = self.terrain.config.size_m
        x = float(np.clip(x, 30.0, size - 30.0))
        y = float(np.clip(y, 30.0, size - 30.0))
        if hover_agl is None:
            hover_agl = 45.0 if drone.role == DroneRole.SCOUT else 140.0
        target = np.array([x, y, self.terrain.height_at(x, y) + hover_agl])

        self.manual_targets[drone.id] = target
        drone.manual_target = target
        drone.ew_hold = False
        self.routes[drone.id] = self._build_direct_route(drone.position, target)
        self.phases[drone.id] = MissionPhase.MANUAL

        poi_id = self.assignments.pop(drone.id, None)
        drone.assigned_poi = None

        self.events.append({
            "time": sim_time, "type": "OPERATOR",
            "drone": drone.id,
            "message": (f"Operator ordered {drone.id} to ({x:.0f}, {y:.0f})"
                        + (f"; {poi_id} released for re-tasking" if poi_id else "")),
        })

    # -- electronic-warfare orders -------------------------------------------

    def drop_assignment(self, drone_id: str, sim_time: float, reason: str):
        """Cancel a scout's survey tasking (the target has been denied)."""
        poi_id = self.assignments.pop(drone_id, None)
        if poi_id is None:
            return
        self.routes.pop(drone_id, None)
        self.phases[drone_id] = MissionPhase.IDLE
        drone = getattr(self, "_drones", {}).get(drone_id)
        if drone is not None:
            drone.assigned_poi = None
        self.events.append({"time": sim_time, "type": "EW", "drone": drone_id,
                            "message": f"{drone_id} re-tasked: {reason}"})

    def ew_withdraw(self, drone: Drone, point, sim_time: float = 0.0):
        """Pull a scout that has lost its link back to a point with signal."""
        self.manual_targets[drone.id] = np.asarray(point, dtype=float)
        drone.manual_target = self.manual_targets[drone.id]
        drone.ew_hold = True
        self.routes[drone.id] = self._build_direct_route(drone.position, drone.manual_target)
        self.phases[drone.id] = MissionPhase.MANUAL
        self.assignments.pop(drone.id, None)
        drone.assigned_poi = None

    def ew_release(self, drone: Drone, sim_time: float = 0.0):
        """Return a withdrawn scout to autonomous tasking."""
        if not getattr(drone, "ew_hold", False):
            return
        drone.ew_hold = False
        self.manual_targets.pop(drone.id, None)
        drone.manual_target = None
        self.routes.pop(drone.id, None)
        self.phases[drone.id] = MissionPhase.IDLE

    def release(self, drone: Drone, sim_time: float = 0.0):
        """Hand an aircraft back to the autonomy."""
        drone.ew_hold = False
        self.manual_targets.pop(drone.id, None)
        drone.manual_target = None
        self.routes.pop(drone.id, None)
        self.phases[drone.id] = MissionPhase.IDLE
        self.events.append({
            "time": sim_time, "type": "OPERATOR", "drone": drone.id,
            "message": f"{drone.id} returned to autonomous control",
        })

    def _build_direct_route(self, start: np.ndarray, target: np.ndarray,
                            spacing: float = 140.0, clearance: float = 70.0) -> Route:
        """
        Straight-line route with terrain clearance.

        Each waypoint is raised above the highest ground within half a spacing
        of it, so the leg between waypoints cannot clip a ridge the waypoints
        themselves happen to miss.
        """
        start = np.asarray(start, dtype=np.float64)
        horizontal = float(np.linalg.norm(target[:2] - start[:2]))
        n = max(int(horizontal / spacing), 1)

        waypoints: List[np.ndarray] = []
        for k in range(1, n + 1):
            t = k / n
            x = start[0] + (target[0] - start[0]) * t
            y = start[1] + (target[1] - start[1]) * t
            ts = np.linspace(max(t - 0.5 / n, 0.0), min(t + 0.5 / n, 1.0), 7)
            xs = start[0] + (target[0] - start[0]) * ts
            ys = start[1] + (target[1] - start[1]) * ts
            ground_max = float(np.max(self.terrain.height_at_array(xs, ys)))
            z = ground_max + clearance
            if k == n:
                z = max(target[2], self.terrain.height_at(x, y) + self.world.min_agl)
            waypoints.append(np.array([x, y, z]))
        return Route(waypoints=waypoints)

    def _update_manual(self, drone: Drone):
        """Fly the operator's route, then hold over the commanded point."""
        target = self.manual_targets[drone.id]
        route = self.routes.get(drone.id)

        if route is not None and not route.finished:
            wp = route.current
            if float(np.linalg.norm(wp - drone.position)) < self.CAPTURE_RADIUS_M \
                    and route.cursor < len(route.waypoints) - 1:
                route.cursor += 1
                wp = route.current
            aim = wp
        else:
            aim = target

        to_aim = aim - drone.position
        dist = float(np.linalg.norm(to_aim))
        direction = to_aim / max(dist, 1e-6)

        carrot = drone.position + direction * min(self.LOOKAHEAD_M, dist)
        ground = self.terrain.height_at(carrot[0], carrot[1])
        carrot[2] = max(carrot[2], ground + self.world.min_agl + 8.0)
        carrot[2] += drone.altitude_offset_cmd

        drone.target_position = carrot
        drone.target_velocity = direction * min(self.CRUISE_SPEED, max(dist * 0.6, 0.0))

    # -- per-tick update ----------------------------------------------------

    def update(self, drones: Dict[str, Drone], sim_time: float, dt: float):
        """Advance mission state and write a setpoint onto every live drone."""
        self._drones = drones
        self.assign_targets(drones, sim_time)

        for drone in drones.values():
            if not drone.is_alive:
                self.phases[drone.id] = MissionPhase.LANDED
                continue

            self._check_battery(drone, sim_time)

            if drone.id in self.manual_targets \
                    and self.phases.get(drone.id) != MissionPhase.RTH:
                self.phases[drone.id] = MissionPhase.MANUAL
                self._update_manual(drone)
            elif drone.role in (DroneRole.RELAY, DroneRole.GCS_RELAY) \
                    and self.phases.get(drone.id) != MissionPhase.RTH:
                self._update_relay(drone, dt)
            else:
                self._update_routed(drone, sim_time, dt)

            # Survey capture is evaluated here, per tick, rather than inside
            # the routing branch. It used to live in _update_routed after the
            # waypoint-capture logic, which returned early whenever the route
            # was rebuilt — and the loiter route sits inside the capture
            # radius by construction, so the check was never reached and the
            # mission could never complete.
            if (drone.role == DroneRole.SCOUT
                    and self.phases.get(drone.id) != MissionPhase.RTH):
                self._check_survey(drone, sim_time, dt)

            # Weather ceiling: in heavy rain the cloud base comes down and the
            # swarm has to fly under it. In a valley that means dropping below
            # the ridge line, which is what actually breaks mountain links.
            if self.ceiling_agl is not None and drone.target_position is not None:
                ground = self.terrain.height_at(float(drone.target_position[0]),
                                                float(drone.target_position[1]))
                drone.target_position[2] = min(drone.target_position[2],
                                               ground + self.ceiling_agl)

            self._apply_geofence(drone)
            drone.agl = self.world.agl(drone.position)

    def _check_battery(self, drone: Drone, sim_time: float):
        """Deterministic RTH trigger — a hard rule, not a learned behaviour."""
        if self.phases.get(drone.id) == MissionPhase.RTH:
            return
        if drone.battery > drone.config.rth_reserve_pct:
            return

        self.phases[drone.id] = MissionPhase.RTH
        self.routes[drone.id] = self._build_rth_route(drone)
        drone.status = DroneStatus.RETURNING

        # Release its survey target so another scout can pick it up
        poi_id = self.assignments.pop(drone.id, None)
        drone.assigned_poi = None

        self.events.append({
            "time": sim_time,
            "type": "RTH",
            "drone": drone.id,
            "message": (f"{drone.id} below {drone.config.rth_reserve_pct:.0f}% reserve "
                        f"— deterministic RTH engaged"),
        })
        if poi_id:
            self.events.append({
                "time": sim_time,
                "type": "REASSIGN",
                "drone": drone.id,
                "poi": poi_id,
                "message": f"{poi_id} released for reassignment",
            })

    def _update_relay(self, drone: Drone, dt: float):
        """Relays hold the station the GNN gave them."""
        station = self.relay_stations.get(drone.id)
        if station is None:
            station = drone.position.copy()
            self.relay_stations[drone.id] = station

        self.phases[drone.id] = MissionPhase.RELAY_HOLD

        setpoint = station.copy()
        setpoint[2] += drone.altitude_offset_cmd

        # Never let a commanded relay position fly into a ridge
        floor = self.terrain.height_at(setpoint[0], setpoint[1]) + self.world.min_agl + 20.0
        setpoint[2] = max(setpoint[2], floor)

        error = setpoint - drone.position
        dist = float(np.linalg.norm(error))
        speed = min(self.CRUISE_SPEED, max(dist * 0.6, 0.0))

        drone.target_position = setpoint
        drone.target_velocity = (error / dist * speed) if dist > 1e-3 else np.zeros(3)

    def _update_routed(self, drone: Drone, sim_time: float, dt: float):
        """Advance a scout (or returning aircraft) along its route."""
        route = self.routes.get(drone.id)
        if route is None or route.finished:
            self._on_route_complete(drone, sim_time)
            route = self.routes.get(drone.id)
            if route is None or route.finished:
                # Nothing to do — hold position
                drone.target_position = drone.position.copy()
                drone.target_velocity = np.zeros(3)
                return

        wp = route.current
        to_wp = wp - drone.position
        dist = float(np.linalg.norm(to_wp))

        if dist < self.CAPTURE_RADIUS_M:
            route.cursor += 1
            if route.finished:
                self._on_route_complete(drone, sim_time)
                return
            wp = route.current
            to_wp = wp - drone.position
            dist = float(np.linalg.norm(to_wp))

        direction = to_wp / max(dist, 1e-6)

        # Carrot: a point LOOKAHEAD_M along the bearing to the waypoint,
        # clamped so we never aim past the waypoint itself.
        carrot = drone.position + direction * min(self.LOOKAHEAD_M, dist)

        # Terrain following — never let the carrot cut into a ridge
        ground = self.terrain.height_at(carrot[0], carrot[1])
        carrot[2] = max(carrot[2], ground + self.world.min_agl + 8.0)
        carrot[2] += drone.altitude_offset_cmd

        # Speed profile: slow down on the final approach
        on_final = route.cursor >= len(route.waypoints) - 1
        target_speed = self.SURVEY_SPEED if (on_final and dist < 80.0) else self.CRUISE_SPEED
        if self.phases.get(drone.id) == MissionPhase.CLIMB_OUT:
            target_speed = self.CLIMB_SPEED
        target_speed = min(target_speed, max(dist * 0.8, 1.0))

        drone.target_position = carrot
        drone.target_velocity = direction * target_speed

    def _check_survey(self, drone: Drone, sim_time: float, dt: float):
        """Mark a PoI surveyed once the scout has dwelled over it."""
        poi_id = self.assignments.get(drone.id)
        if poi_id:
            poi = next((p for p in self.world.pois if p.id == poi_id), None)
        else:
            # Not tasked (e.g. flying an operator order): survey whatever
            # unsurveyed target it happens to be over.
            nearby = [p for p in self.world.get_unsurveyed_pois()
                      if float(np.linalg.norm(drone.position[:2] - p.position[:2]))
                      < self.SURVEY_RADIUS_M]
            poi = nearby[0] if nearby else None
        if poi is None or poi.surveyed:
            return

        horizontal = float(np.linalg.norm(drone.position[:2] - poi.position[:2]))
        agl = self.world.agl(drone.position)
        if horizontal > self.SURVEY_RADIUS_M or agl > self.SURVEY_CEILING_AGL_M:
            self._survey_timers[drone.id] = 0.0
            return

        self.phases[drone.id] = MissionPhase.SURVEY
        elapsed = self._survey_timers.get(drone.id, 0.0) + dt
        self._survey_timers[drone.id] = elapsed

        if elapsed >= self.SURVEY_DWELL_S:
            self.world.mark_poi_surveyed(poi.id, drone.id, sim_time)
            self._survey_timers[drone.id] = 0.0
            self.assignments.pop(drone.id, None)
            drone.assigned_poi = None
            if drone.id not in self.manual_targets:
                self.routes[drone.id] = Route()   # force re-tasking next tick
            # Another scout may have been tasked to this same target
            for other, assigned in list(self.assignments.items()):
                if assigned == poi.id:
                    self.assignments.pop(other, None)

            self.events.append({
                "time": sim_time,
                "type": "SURVEY_COMPLETE",
                "drone": drone.id,
                "poi": poi.id,
                "message": f"{poi.id} ({poi.category}) surveyed by {drone.id}",
            })

    def _on_route_complete(self, drone: Drone, sim_time: float):
        """Decide what to do when a route runs out."""
        phase = self.phases.get(drone.id)

        if phase == MissionPhase.RTH:
            if self.world.agl(drone.position) < 3.0 or drone.battery <= 0.5:
                drone.status = DroneStatus.LANDED
                self.phases[drone.id] = MissionPhase.LANDED
                self.events.append({
                    "time": sim_time,
                    "type": "LANDED",
                    "drone": drone.id,
                    "message": f"{drone.id} recovered at home point",
                })
            return

        # If the scout still owes a survey, hold over the target rather than
        # going idle. Previously the route ended at the waypoint capture
        # radius, which is wider than the survey radius, so the aircraft
        # stopped just short of its own target and neither re-tasked nor
        # completed — a deadlock that silently stalled the mission.
        poi_id = self.assignments.get(drone.id)
        if poi_id:
            poi = next((p for p in self.world.pois if p.id == poi_id), None)
            if poi is not None and not poi.surveyed:
                survey_z = self.terrain.height_at(
                    float(poi.position[0]), float(poi.position[1])
                ) + self.SURVEY_CLEARANCE_M
                self.routes[drone.id] = Route(waypoints=[
                    np.array([poi.position[0], poi.position[1], survey_z])
                ])
                self.phases[drone.id] = MissionPhase.SURVEY
                return

        # Nothing outstanding — become idle so assign_targets re-tasks it
        self.phases[drone.id] = MissionPhase.IDLE
        self.routes.pop(drone.id, None)

    def _apply_geofence(self, drone: Drone):
        """
        Hard geofence on the setpoint.

        Applied to the *setpoint*, not the state, so the aircraft is
        commanded back inside the envelope rather than teleported.
        """
        if drone.target_position is None:
            return

        sp = drone.target_position
        size = self.terrain.config.size_m
        sp[0] = float(np.clip(sp[0], 20.0, size - 20.0))
        sp[1] = float(np.clip(sp[1], 20.0, size - 20.0))

        ground = self.terrain.height_at(sp[0], sp[1])
        sp[2] = float(np.clip(sp[2],
                              ground + self.world.min_agl,
                              ground + self.world.max_agl))

    # -- reporting ----------------------------------------------------------

    def drain_events(self) -> List[dict]:
        """Pop accumulated mission events for the telemetry stream."""
        events, self.events = self.events, []
        return events

    def get_state(self) -> dict:
        return {
            "phases": {k: v.name for k, v in self.phases.items()},
            "assignments": dict(self.assignments),
            "relay_stations": {k: v.tolist() for k, v in self.relay_stations.items()},
            "manual_targets": {k: v.tolist() for k, v in self.manual_targets.items()},
        }

    def reset(self):
        self.manual_targets.clear()
        self.denied_pois = set()
        self.routes.clear()
        self.phases.clear()
        self.assignments.clear()
        self._survey_timers.clear()
        self.relay_stations.clear()
        self.events.clear()
