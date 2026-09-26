"""
Guidance and mission planning for the UAV-X swarm.

This layer sits between the mission (survey these targets, keep the link to
the GCS, get everyone home) and the flight controller (hold this setpoint). It
is responsible for:

  - allocating survey tasks to scouts, highest value first, and only when the
    aircraft can afford the task AND the trip home, inside the mission clock;
  - pre-empting a scout on a lower-priority task when a new high-priority one
    appears that no idle scout can take;
  - routing aircraft through the valley with terrain-following clearance and
    handing the controller a *local* carrot setpoint, never a 3 km error;
  - the full energy cycle: an energy-aware return-to-home trigger, landing on
    a GCS pad, battery swap, and a READY state from which the role manager can
    relaunch the aircraft;
  - the lost-link failsafe, and the horizontal/vertical geofence.

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

from .deconfliction import Deconfliction
from .drone import Drone, DroneRole, DroneStatus
from .energy import EnergyModel


class MissionPhase(Enum):
    """What a single aircraft is currently doing."""
    IDLE = auto()
    CLIMB_OUT = auto()      # gaining transit altitude before departing
    TRANSIT = auto()        # cruising the corridor toward a target
    SURVEY = auto()         # descending onto / loitering over a PoI
    RELAY_HOLD = auto()     # station-keeping at a GNN-assigned relay position
    RELAY_TRANSIT = auto()  # flying out to a relay station
    RTH = auto()            # returning to home
    LANDING = auto()        # final descent onto a GCS pad
    CHARGING = auto()       # on a pad, battery swap in progress
    READY = auto()          # on a pad, charged, waiting to be launched
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

    # Landing: final approach height over the pad, touchdown test
    PAD_APPROACH_AGL = 35.0
    TOUCHDOWN_AGL = 5.5
    TOUCHDOWN_RADIUS = 12.0

    # Lost-link failsafe: an aircraft with no route to the GCS for this long
    # returns home. Standard BVLOS practice, and what a UAV whose radio has
    # failed must do on its own.
    LOST_LINK_RTH_S = 60.0

    # Geofence keep-in margin applied to every setpoint
    GEOFENCE_MARGIN_M = 40.0

    # Pre-emption: a busy scout is only pulled off its task for one at least
    # this many priority levels more urgent.
    PREEMPT_PRIORITY_GAP = 1

    # Returns that are a choice, not a necessity: an aircraft flying home for
    # one of these reasons can be turned round for a new task it can afford.
    SOFT_RTH = ("no open targets", "relay no longer needed", "standing by")

    def __init__(self, world, seed: int = 42, energy: Optional[EnergyModel] = None):
        self.world = world
        self.terrain = world.terrain
        self._rng = np.random.RandomState(seed)
        self.energy = energy or EnergyModel(world)

        self.routes: Dict[str, Route] = {}
        self.phases: Dict[str, MissionPhase] = {}
        self.assignments: Dict[str, str] = {}      # drone_id -> poi_id
        self._survey_timers: Dict[str, float] = {}

        # Relay stations commanded by the GNN topology optimiser
        self.relay_stations: Dict[str, np.ndarray] = {}
        self._relay_routes: Dict[str, tuple] = {}   # drone_id -> (station, Route)

        # Operator overrides: drone_id -> commanded hover point. While set,
        # the autonomy (tasking and the GNN) leaves that aircraft alone.
        self.manual_targets: Dict[str, np.ndarray] = {}
        # Cloud base (m AGL) in bad weather: aircraft must stay below it to
        # keep the ground in sight. None means clear skies.
        self.ceiling_agl = None
        # Targets held because an interference source overpowers them
        self.denied_pois: set = set()

        # Mission clock. Tasks and the time limit are measured from launch;
        # None means the mission has not been launched (no tasking).
        self.mission_started: Optional[float] = 0.0
        # Set once the mission is over: nothing is tasked or launched again.
        self.recalled = False
        self.rth_reasons: Dict[str, str] = {}

        # Separation assurance, applied to every setpoint after planning
        self.deconfliction: Optional[Deconfliction] = Deconfliction(world)

        self.events: List[dict] = []

    # -- mission clock -------------------------------------------------------

    def mission_time(self, sim_time: float) -> Optional[float]:
        if self.mission_started is None:
            return None
        return sim_time - self.mission_started

    def time_remaining(self, sim_time: float) -> Optional[float]:
        limit = getattr(self.world, "time_limit_s", None)
        t = self.mission_time(sim_time)
        if limit is None or t is None:
            return None
        return limit - t

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
        """Deterministic return-to-home: climb, backtrack the corridor, approach the pad."""
        start = drone.position.copy()
        home = np.asarray(drone.home_position, dtype=np.float64).copy()
        waypoints: List[np.ndarray] = []

        climb_z = self.world.safe_altitude_at(start[0], start[1], self.TRANSIT_CLEARANCE_M)
        waypoints.append(np.array([start[0], start[1], max(climb_z, start[2])]))
        waypoints.extend(self._corridor_waypoints(start[0], float(home[0])))
        waypoints.append(np.array([home[0], home[1],
                                   self.world.safe_altitude_at(home[0], home[1], 60.0)]))
        waypoints.append(np.array([home[0], home[1],
                                   self.terrain.height_at(home[0], home[1]) + self.PAD_APPROACH_AGL]))

        return Route(waypoints=waypoints)

    # -- assignment ---------------------------------------------------------

    def _feasible(self, drone: Drone, poi, sim_time: float) -> bool:
        """Can this aircraft survey `poi` and still get home, inside the clock?"""
        if not self.energy.can_afford(drone, poi.position):
            return False
        remaining = self.time_remaining(sim_time)
        if remaining is not None and self.energy.time_to_complete(drone, poi.position) > remaining:
            return False
        return True

    def _eta(self, drone: Drone, poi) -> float:
        return self.energy.travel_time(drone.position, poi.position)

    def _available_scouts(self, drones: Dict[str, Drone]) -> List[Drone]:
        return [d for d in drones.values()
                if d.is_alive and d.role == DroneRole.SCOUT
                and self.phases.get(d.id) not in (MissionPhase.RTH, MissionPhase.LANDING)
                and d.id not in self.manual_targets]

    def _divertible(self, drones: Dict[str, Drone]) -> List[Drone]:
        """Aircraft on a discretionary return that could be turned round."""
        return [d for d in drones.values()
                if d.is_alive and self.phases.get(d.id) == MissionPhase.RTH
                and self.rth_reasons.get(d.id, "").startswith(self.SOFT_RTH)]

    def _resume(self, drone: Drone, sim_time: float):
        """Turn a discretionary return round: back to work as a scout."""
        drone.role = DroneRole.SCOUT
        drone.status = DroneStatus.ACTIVE
        self.phases[drone.id] = MissionPhase.IDLE
        self.routes.pop(drone.id, None)
        self.rth_reasons.pop(drone.id, None)
        self.events.append({"time": sim_time, "type": "DIVERT", "drone": drone.id,
                            "message": f"{drone.id} turned round on its way home for new work"})

    def open_tasks(self, sim_time: float) -> list:
        """Released, unsurveyed, not-held targets (known to the swarm right now)."""
        t = self.mission_time(sim_time)
        if t is None:
            return []
        return [p for p in self.world.pois
                if not p.surveyed and p.released(t) and p.id not in self.denied_pois]

    def assign_targets(self, drones: Dict[str, Drone], sim_time: float):
        """
        Allocate released, unsurveyed targets to scouts.

        Greedy on value rate: each step takes the (scout, target) pair with
        the highest  priority-weight / (ETA + 60 s)  among the pairs the scout
        can afford — battery for the task AND the trip home, and time before
        the mission clock runs out. A newly released priority-1 target that no
        idle scout can take pre-empts the best-placed scout busy on a
        lower-priority target.
        """
        if self.recalled or self.mission_started is None:
            return
        scouts = self._available_scouts(drones)
        divertible = self._divertible(drones)
        if not scouts and not divertible:
            return
        idle = [d for d in scouts if not self.assignments.get(d.id)] + divertible
        taken = set(self.assignments.values())
        open_tasks = [p for p in self.open_tasks(sim_time) if p.id not in taken]
        if not open_tasks:
            return

        while idle and open_tasks:
            best, best_value = None, 0.0
            for d in idle:
                for p in open_tasks:
                    if not self._feasible(d, p, sim_time):
                        continue
                    value = p.weight / (self._eta(d, p) + 60.0)
                    if value > best_value:
                        best, best_value = (d, p), value
            if best is None:
                break
            d, p = best
            if d in divertible:
                self._resume(d, sim_time)
            self._assign(d, p, sim_time)
            idle.remove(d)
            open_tasks.remove(p)

        # Pre-emption for urgent targets still unassigned
        for p in sorted(open_tasks, key=lambda q: (q.priority, q.release_time)):
            if p.priority > 1:
                continue
            busy = []
            for d in scouts:
                current_id = self.assignments.get(d.id)
                if not current_id:
                    continue
                current = self._poi(current_id)
                if current is None or current.priority - p.priority < self.PREEMPT_PRIORITY_GAP:
                    continue
                if self.phases.get(d.id) == MissionPhase.SURVEY:
                    continue      # already over its target: let it finish
                if self._feasible(d, p, sim_time):
                    busy.append(d)
            if not busy:
                continue
            d = min(busy, key=lambda q: self._eta(q, p))
            dropped = self.assignments.pop(d.id)
            self.events.append({
                "time": sim_time, "type": "PREEMPT", "drone": d.id, "poi": p.id,
                "message": (f"{d.id} pre-empted from {dropped} to priority-{p.priority} "
                            f"{p.id} ({p.category.replace('_', ' ')})"),
            })
            self._assign(d, p, sim_time)

        # A scout that cannot afford any open task — but could on a fresh
        # battery — goes home to recharge instead of loitering until its
        # battery forces the issue.
        still_open = [p for p in self.open_tasks(sim_time)
                      if p.id not in set(self.assignments.values())]
        if still_open:
            for d in idle:
                if self.assignments.get(d.id) or d in divertible:
                    continue
                if any(self.energy.can_afford(d, p.position) for p in still_open):
                    continue
                if any(self.energy.can_afford(d, p.position, battery=100.0) for p in still_open):
                    self.send_home(d, sim_time, "recharge before next task")

    def _poi(self, poi_id: str):
        return next((p for p in self.world.pois if p.id == poi_id), None)

    def _assign(self, drone: Drone, poi, sim_time: float):
        self.assignments[drone.id] = poi.id
        self.routes[drone.id] = self._build_survey_route(drone, poi)
        self.phases[drone.id] = MissionPhase.TRANSIT
        drone.assigned_poi = poi.id
        self.events.append({
            "time": sim_time,
            "type": "TASKING",
            "drone": drone.id,
            "poi": poi.id,
            "message": (f"{drone.id} tasked to survey {poi.id} "
                        f"(P{poi.priority} {poi.category.replace('_', ' ')})"),
        })

    def set_relay_station(self, drone_id: str, position: np.ndarray):
        """Called by the GNN relay optimiser / role manager to command a relay position."""
        if drone_id in self.manual_targets:
            return      # the operator has this aircraft; the GNN does not
        position = np.asarray(position, dtype=np.float64).copy()
        fence = getattr(self.world, "geofence", None)
        if fence is not None:
            position[0], position[1] = fence.project_inside(
                position[0], position[1], self.GEOFENCE_MARGIN_M)
        self.relay_stations[drone_id] = position

    # -- energy cycle: return, land, recharge, relaunch ------------------------

    def send_home(self, drone: Drone, sim_time: float, reason: str):
        """Return-to-home for any reason; the aircraft gives up its mission role."""
        if self.phases.get(drone.id) in (MissionPhase.RTH, MissionPhase.LANDING):
            return
        if not drone.is_alive:
            return
        self.phases[drone.id] = MissionPhase.RTH
        self.routes[drone.id] = self._build_rth_route(drone)
        drone.status = DroneStatus.RETURNING
        previous = drone.role
        drone.role = DroneRole.STANDBY
        self.rth_reasons[drone.id] = reason
        self.relay_stations.pop(drone.id, None)
        self._relay_routes.pop(drone.id, None)
        self.manual_targets.pop(drone.id, None)
        drone.manual_target = None
        drone.ew_hold = False

        poi_id = self.assignments.pop(drone.id, None)
        drone.assigned_poi = None

        self.events.append({
            "time": sim_time,
            "type": "RTH",
            "drone": drone.id,
            "role": previous.name,
            "reason": reason,
            "message": f"{drone.id} ({previous.name.lower()}) returning to GCS — {reason}",
        })
        if poi_id:
            self.events.append({
                "time": sim_time, "type": "REASSIGN", "drone": drone.id, "poi": poi_id,
                "message": f"{poi_id} released for reassignment",
            })

    def stand_by(self, drone: Drone, point, sim_time: float):
        """Send an idle scout to loiter at a standby point, ready for new tasks."""
        point = np.asarray(point, dtype=float).copy()
        fence = getattr(self.world, "geofence", None)
        if fence is not None:
            point[0], point[1] = fence.project_inside(point[0], point[1], self.GEOFENCE_MARGIN_M)
        self.routes[drone.id] = self._build_direct_route(drone.position, point)
        self.phases[drone.id] = MissionPhase.TRANSIT
        self.events.append({"time": sim_time, "type": "STANDBY", "drone": drone.id,
                            "message": f"{drone.id} standing by mid-valley for new tasks "
                                       f"({drone.battery:.0f}% battery)"})

    def recall_all(self, drones: Dict[str, Drone], sim_time: float, reason: str):
        """Mission over: bring every airborne aircraft home and stop tasking."""
        self.recalled = True
        for drone in drones.values():
            if drone.is_alive:
                self.send_home(drone, sim_time, reason)

    def launch(self, drone: Drone, role: DroneRole, sim_time: float, reason: str = "") -> bool:
        """Take off from the pad in `role`. Only a READY aircraft can launch."""
        if drone.status != DroneStatus.READY or self.recalled:
            return False
        pad = np.asarray(drone.home_position, dtype=np.float64)
        drone.position = np.array([pad[0], pad[1],
                                   self.terrain.height_at(pad[0], pad[1]) + 4.0])
        drone.velocity = np.zeros(3)
        drone.status = DroneStatus.ACTIVE
        drone.role = role
        drone.charge_started = None
        drone.lost_link_s = 0.0
        self.routes.pop(drone.id, None)
        self.phases[drone.id] = (MissionPhase.IDLE if role == DroneRole.SCOUT
                                 else MissionPhase.RELAY_TRANSIT)
        self.events.append({
            "time": sim_time, "type": "LAUNCH", "drone": drone.id, "role": role.name,
            "message": f"{drone.id} launched as {role.name.lower()}"
                       + (f" — {reason}" if reason else ""),
        })
        return True

    def _touchdown(self, drone: Drone, sim_time: float):
        pad = np.asarray(drone.home_position, dtype=np.float64)
        drone.position = np.array([pad[0], pad[1], self.terrain.height_at(pad[0], pad[1]) + 0.3])
        drone.velocity = np.zeros(3)
        drone.thrust_command = np.zeros(3)
        drone.status = DroneStatus.CHARGING
        drone.role = DroneRole.STANDBY
        drone.charge_started = sim_time
        drone.sorties += 1
        drone.neighbors.clear()
        drone.gcs_link = 0.0
        self.phases[drone.id] = MissionPhase.CHARGING
        self.routes.pop(drone.id, None)
        self.events.append({
            "time": sim_time, "type": "LANDED", "drone": drone.id,
            "battery": float(drone.battery),
            "message": (f"{drone.id} landed on its pad with {drone.battery:.0f}% — "
                        "battery swap started"),
        })

    def _update_charging(self, drone: Drone, sim_time: float, dt: float):
        if drone.status == DroneStatus.CHARGING:
            self.phases[drone.id] = MissionPhase.CHARGING
            rate = 100.0 / max(self.energy.config.recharge_s, 1.0)
            drone.battery = min(100.0, drone.battery + rate * dt)
            if drone.battery >= 99.9:
                drone.battery = 100.0
                drone.status = DroneStatus.READY
                drone.min_battery_airborne = min(drone.min_battery_airborne, 100.0)
                self.phases[drone.id] = MissionPhase.READY
                self.events.append({
                    "time": sim_time, "type": "READY", "drone": drone.id,
                    "message": f"{drone.id} recharged and ready for launch",
                })
        elif drone.status == DroneStatus.READY:
            self.phases[drone.id] = MissionPhase.READY

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
        fence = getattr(self.world, "geofence", None)
        if fence is not None:
            x, y = fence.project_inside(x, y, self.GEOFENCE_MARGIN_M)
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

    # -- interference response orders -----------------------------------------

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
        self.events.append({"time": sim_time, "type": "INTERFERENCE", "drone": drone_id,
                            "message": f"{drone_id} re-tasked: {reason}"})

    def ew_withdraw(self, drone: Drone, point, sim_time: float = 0.0):
        """Pull a scout that has lost its link back to a point with signal."""
        point = np.asarray(point, dtype=float).copy()
        fence = getattr(self.world, "geofence", None)
        if fence is not None:
            point[0], point[1] = fence.project_inside(point[0], point[1], self.GEOFENCE_MARGIN_M)
        self.manual_targets[drone.id] = point
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

    def _fly_route(self, drone: Drone, route: Route, final_target: np.ndarray,
                   speed: float = None):
        """Carrot-follow `route`, then hold over `final_target`."""
        if route is not None and not route.finished:
            wp = route.current
            if float(np.linalg.norm(wp - drone.position)) < self.CAPTURE_RADIUS_M \
                    and route.cursor < len(route.waypoints) - 1:
                route.cursor += 1
                wp = route.current
            aim = wp
        else:
            aim = final_target

        to_aim = aim - drone.position
        dist = float(np.linalg.norm(to_aim))
        direction = to_aim / max(dist, 1e-6)

        carrot = drone.position + direction * min(self.LOOKAHEAD_M, dist)
        ground = self.terrain.height_at(carrot[0], carrot[1])
        carrot[2] = max(carrot[2], ground + self.world.min_agl + 8.0)
        carrot[2] += drone.altitude_offset_cmd

        drone.target_position = carrot
        drone.target_velocity = direction * min(speed or self.CRUISE_SPEED, max(dist * 0.6, 0.0))

    def _update_manual(self, drone: Drone):
        """Fly the operator's route, then hold over the commanded point."""
        self._fly_route(drone, self.routes.get(drone.id), self.manual_targets[drone.id])

    # -- per-tick update ----------------------------------------------------

    def update(self, drones: Dict[str, Drone], sim_time: float, dt: float):
        """Advance mission state and write a setpoint onto every live drone."""
        self._drones = drones
        self.assign_targets(drones, sim_time)

        for drone in drones.values():
            if drone.on_pad:
                self._update_charging(drone, sim_time, dt)
                continue
            if not drone.is_alive:
                self.phases[drone.id] = MissionPhase.LANDED
                # A lost aircraft's task goes back into the pool at once
                lost = self.assignments.pop(drone.id, None)
                if lost is not None:
                    drone.assigned_poi = None
                    self.events.append({
                        "time": sim_time, "type": "REASSIGN", "drone": drone.id, "poi": lost,
                        "message": f"{lost} released for reassignment — {drone.id} lost",
                    })
                self.relay_stations.pop(drone.id, None)
                continue

            self._check_battery(drone, sim_time)
            self._check_lost_link(drone, sim_time, dt)
            self._check_mission_clock(drone, sim_time)

            phase = self.phases.get(drone.id)
            if phase == MissionPhase.LANDING:
                self._update_landing(drone, sim_time)
            elif drone.id in self.manual_targets and phase != MissionPhase.RTH:
                self.phases[drone.id] = MissionPhase.MANUAL
                self._update_manual(drone)
            elif drone.role in (DroneRole.RELAY, DroneRole.GCS_RELAY) \
                    and phase != MissionPhase.RTH:
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

        # Separation assurance last, then the fence and floor again so that
        # avoidance can never push an aircraft out of the area or into terrain
        if self.deconfliction is not None:
            for drone in self.deconfliction.apply(drones):
                self._apply_geofence(drone)

    def _check_battery(self, drone: Drone, sim_time: float):
        """
        Energy-aware return-to-home — a hard rule, not a learned behaviour.

        The trigger is the battery needed to fly home from where the aircraft
        is right now (plus a landing reserve), not a fixed percentage: a relay
        3 km up the valley turns for home much earlier than one beside the GCS.
        """
        if self.phases.get(drone.id) in (MissionPhase.RTH, MissionPhase.LANDING):
            return
        threshold = self.energy.rth_threshold(drone)
        if drone.battery > threshold:
            return
        self.send_home(drone, sim_time,
                       f"battery {drone.battery:.0f}% at the {threshold:.0f}% needed to get home")

    def _check_lost_link(self, drone: Drone, sim_time: float, dt: float):
        if self.phases.get(drone.id) in (MissionPhase.RTH, MissionPhase.LANDING):
            drone.lost_link_s = 0.0
            return
        if getattr(drone, "connected", True):
            drone.lost_link_s = 0.0
            return
        drone.lost_link_s = getattr(drone, "lost_link_s", 0.0) + dt
        if drone.lost_link_s >= self.LOST_LINK_RTH_S:
            self.send_home(drone, sim_time,
                           f"lost-link failsafe: no route to GCS for {drone.lost_link_s:.0f} s")

    def _check_mission_clock(self, drone: Drone, sim_time: float):
        """Be on the pad by the end of the allotted time."""
        remaining = self.time_remaining(sim_time)
        if remaining is None:
            return
        if self.phases.get(drone.id) in (MissionPhase.RTH, MissionPhase.LANDING):
            return
        needed = self.energy.travel_time(drone.position, drone.home_position) + 20.0
        if remaining <= needed:
            self.send_home(drone, sim_time,
                           f"mission clock: {max(remaining, 0):.0f} s left, {needed:.0f} s needed to land")

    def _update_relay(self, drone: Drone, dt: float):
        """
        Relays fly out to, then hold, the station the GNN gave them.

        A station more than 200 m away is reached along a terrain-clearing
        route rather than a straight line, since a relay launched from the
        GCS pads is often a ridge away from where it is needed.
        """
        station = self.relay_stations.get(drone.id)
        if station is None:
            station = drone.position.copy()
            self.relay_stations[drone.id] = station

        setpoint = station.copy()
        setpoint[2] += drone.altitude_offset_cmd

        # Never let a commanded relay position fly into a ridge
        floor = self.terrain.height_at(setpoint[0], setpoint[1]) + self.world.min_agl + 20.0
        setpoint[2] = max(setpoint[2], floor)

        error = setpoint - drone.position
        dist = float(np.linalg.norm(error))

        if dist > 200.0:
            self.phases[drone.id] = MissionPhase.RELAY_TRANSIT
            cached = self._relay_routes.get(drone.id)
            if cached is None or float(np.linalg.norm(cached[0] - station)) > 120.0:
                route = self._build_direct_route(drone.position, setpoint, clearance=80.0)
                self._relay_routes[drone.id] = (station.copy(), route)
            self._fly_route(drone, self._relay_routes[drone.id][1], setpoint)
            return

        self._relay_routes.pop(drone.id, None)
        self.phases[drone.id] = MissionPhase.RELAY_HOLD
        speed = min(self.CRUISE_SPEED, max(dist * 0.6, 0.0))
        drone.target_position = setpoint
        drone.target_velocity = (error / dist * speed) if dist > 1e-3 else np.zeros(3)

    def _update_landing(self, drone: Drone, sim_time: float):
        """Final descent onto the pad at a controlled rate, then touchdown."""
        pad = np.asarray(drone.home_position, dtype=np.float64)
        ground = self.terrain.height_at(pad[0], pad[1])
        horizontal = float(np.linalg.norm(drone.position[:2] - pad[:2]))
        agl = drone.position[2] - ground

        if horizontal < self.TOUCHDOWN_RADIUS and agl < self.TOUCHDOWN_AGL:
            self._touchdown(drone, sim_time)
            return

        # Centre over the pad first, then descend at ~2 m/s
        if horizontal > 6.0:
            z = max(drone.position[2], ground + 20.0)
        else:
            z = max(drone.position[2] - 2.5, ground + 3.5)
        drone.target_position = np.array([pad[0], pad[1], z])
        to = drone.target_position - drone.position
        dist = float(np.linalg.norm(to))
        drone.target_velocity = (to / max(dist, 1e-6)) * min(4.0, dist * 0.6)

    def _update_routed(self, drone: Drone, sim_time: float, dt: float):
        """Advance a scout (or returning aircraft) along its route."""
        route = self.routes.get(drone.id)
        if route is None or route.finished:
            self._on_route_complete(drone, sim_time)
            if self.phases.get(drone.id) == MissionPhase.LANDING:
                self._update_landing(drone, sim_time)
                return
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
            poi = self._poi(poi_id)
        else:
            # Not tasked (e.g. flying an operator order): survey whatever
            # released, unsurveyed target it happens to be over.
            t = self.mission_time(sim_time)
            nearby = [p for p in self.world.get_unsurveyed_pois(t if t is not None else sim_time)
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
                "message": (f"{poi.id} (P{poi.priority} {poi.category.replace('_', ' ')}) "
                            f"surveyed by {drone.id}"),
            })

    def _on_route_complete(self, drone: Drone, sim_time: float):
        """Decide what to do when a route runs out."""
        phase = self.phases.get(drone.id)

        if phase == MissionPhase.RTH:
            self.phases[drone.id] = MissionPhase.LANDING
            self.routes.pop(drone.id, None)
            return

        # If the scout still owes a survey, hold over the target rather than
        # going idle. Previously the route ended at the waypoint capture
        # radius, which is wider than the survey radius, so the aircraft
        # stopped just short of its own target and neither re-tasked nor
        # completed — a deadlock that silently stalled the mission.
        poi_id = self.assignments.get(drone.id)
        if poi_id:
            poi = self._poi(poi_id)
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
        commanded back inside the envelope rather than teleported: the
        keep-in polygon (with a margin), the map edge, and the AGL band.
        """
        if drone.target_position is None:
            return

        sp = drone.target_position
        size = self.terrain.config.size_m
        sp[0] = float(np.clip(sp[0], 20.0, size - 20.0))
        sp[1] = float(np.clip(sp[1], 20.0, size - 20.0))

        fence = getattr(self.world, "geofence", None)
        if fence is not None:
            sp[0], sp[1] = fence.project_inside(sp[0], sp[1], self.GEOFENCE_MARGIN_M)

        ground = self.terrain.height_at(sp[0], sp[1])
        floor = ground + self.world.min_agl
        if self.phases.get(drone.id) == MissionPhase.LANDING:
            floor = ground + 3.0
        sp[2] = float(np.clip(sp[2], floor, ground + self.world.max_agl))

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
            "rth_reasons": dict(self.rth_reasons),
            "recalled": self.recalled,
        }

    def reset(self):
        self.manual_targets.clear()
        self.denied_pois = set()
        self.routes.clear()
        self.phases.clear()
        self.assignments.clear()
        self._survey_timers.clear()
        self.relay_stations.clear()
        self._relay_routes.clear()
        self.rth_reasons.clear()
        self.recalled = False
        self.events.clear()
