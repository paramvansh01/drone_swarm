"""
Autonomous relay and role management.

Every aircraft in the fleet can fly any role. Once a second this module decides

  1. HOW MANY relays the mission needs right now. It walks a terrain-aware
     relay chain from the GCS antenna, along the valley, to every point where
     work is happening (a scout on task, an open target it could reach, an
     aircraft holding undelivered data or still flying home), placing a hop at the farthest point the previous hop
     can still reach with a reliable deterministic link budget (free-space
     loss + knife-edge diffraction over the real terrain + any interference
     the swarm is experiencing). The number of intermediate hops is the relay
     requirement, and the hop points seed the GNN's station optimisation.

  2. WHO flies them, preferring, in order: a charged aircraft waiting on a
     GCS pad, then an idle scout, then the scout doing the least valuable
     work. Scouts are never all taken (MIN_SCOUTS). A relay no longer needed
     for DEMOTE_HOLD_S goes back to surveying (or home, if there is nothing
     left to survey).

  3. WHEN a relay must be relieved. A relay whose battery reaches the
     handover threshold (what it needs to hold on while a replacement flies
     out, and then get home) calls up a replacement to its exact station and
     leaves only once the replacement is on station — make-before-break, so
     recharging does not open a hole in the chain. If no replacement can be
     found in time the energy-aware RTH still brings it home; safety wins.

Failures are handled faster than this loop: `mesh.election` promotes a scout
within 100 ms of a relay going down. This loop then settles the steady state,
for example by launching a charged aircraft and returning the promoted scout
to its survey.

Every role change is logged as a relay reallocation with its reason, and a
role that flips back within FLAP_WINDOW_S is counted against reconfiguration
efficiency.
"""

from __future__ import annotations

from typing import Dict, List, Optional

import numpy as np

from sim.drone import DroneRole, DroneStatus
from sim.guidance import MissionPhase


class RoleManager:
    UPDATE_S = 1.0
    MIN_SCOUTS = 1
    DEMOTE_HOLD_S = 25.0
    IDLE_HOME_S = 12.0
    # Idle scouts with at least this much battery loiter mid-valley (inside
    # the relay chain's coverage) so a newly reported emergency is minutes
    # closer; below it they go home and recharge instead.
    STANDBY_MIN_BATTERY = 45.0
    STANDBY_ALONG = 0.45
    LAUNCH_SPACING_S = 4.0
    HANDOVER_ON_STATION_M = 90.0
    FLAP_WINDOW_S = 30.0
    RELAY_AGL = 160.0
    SCOUT_AGL = 40.0
    CHAIN_STEP_M = 60.0
    # Required mean SNR for a planned hop. PDR >= 0.95 needs ~9 dB for a
    # 256-byte frame; the rest is fading margin.
    HOP_SNR_DB = 15.0
    CHAIN_CACHE_S = 8.0

    def __init__(self, world, guidance, rf, energy, log=None, awareness=None):
        self.world = world
        self.guidance = guidance
        self.rf = rf
        self.energy = energy
        # What the swarm believes (mesh/awareness.py). Every count below — who
        # is flying, who has failed, how noisy the radio is — comes from it,
        # never from the simulator's truth. Standalone use gets its own.
        self._owns_awareness = awareness is None
        if awareness is None:
            from mesh.awareness import SwarmAwareness
            awareness = SwarmAwareness(world, rf, log)
        self.awareness = awareness
        self.log = log or (lambda *a, **k: None)
        self.enabled = True
        # "adaptive" is the system. "static" is the conventional baseline it
        # is benchmarked against (bench/uavx_suite.py): roles fixed at launch
        # (STATIC_RELAYS relays, the rest scouts), each aircraft relaunched in
        # its original role after recharging, no relay count changes, no
        # handover. Safety rules (energy-aware RTH, geofence) stay on.
        self.mode = "adaptive"
        self.reset()

    STATIC_RELAYS = 1

    def reset(self):
        self.relays_needed = 0
        self.chain_points: List[np.ndarray] = []
        self.handovers: Dict[str, dict] = {}       # outgoing relay -> {"to", "since", "station"}
        self.reallocations: List[dict] = []
        self._last_update = -1e9
        self._last_launch = -1e9
        self._surplus_since: Optional[float] = None
        self._idle_since: Dict[str, float] = {}
        self._chain_cache: Dict[tuple, tuple] = {}
        self._last_role_change: Dict[str, tuple] = {}
        self.flaps = 0
        self._now = 0.0

    # -- link budget ----------------------------------------------------------

    def _noise_at(self, p) -> float:
        """Expected noise at `p`: measured floor + interference sources the swarm has localised."""
        return self.awareness.interference_at(p)

    def _extra_loss_db(self) -> float:
        """Path loss the terrain model does not explain, as measured on live links."""
        return float(self.awareness.link_offset_db)

    def link_ok(self, a, b) -> bool:
        a = np.asarray(a, dtype=float)
        b = np.asarray(b, dtype=float)
        d = float(np.linalg.norm(a - b))
        rssi = (27.0 + 3.0 + 3.0 - self._extra_loss_db()
                - self.rf.friis_path_loss_db(max(d, 1.0))
                - self.world.compute_rf_occlusion_db(a, b))
        noise = max(self._noise_at(a), self._noise_at(b))
        return rssi - noise >= self.HOP_SNR_DB

    def _up(self, d, timeout=None) -> bool:
        """Believed airborne (being heard), per the awareness layer."""
        return self.awareness.believed_airborne(d, timeout)

    def _operational(self, d) -> bool:
        """On a pad, or airborne and heard recently enough not to be written off."""
        return self.awareness.believed_operational(d, self.awareness.LOST_S)

    def _chain_to(self, target_xy) -> tuple:
        """(relay count, hop points) for a chain from the GCS to `target_xy`."""
        tx, ty = float(target_xy[0]), float(target_xy[1])
        known = tuple(sorted(e.get("id", "") for e in (getattr(self.rf, "ew_emitters", None) or [])))
        key = (round(tx / 100.0), round(ty / 100.0), known,
               round(self._extra_loss_db()), round(self._noise_at(self.world.gcs.position)))
        cached = self._chain_cache.get(key)
        now = self._now
        if cached is not None and now - cached[0] < self.CHAIN_CACHE_S:
            return cached[1], cached[2]

        terrain = self.world.terrain
        gcs = np.asarray(self.world.gcs.position, dtype=float)
        target = np.array([tx, ty, terrain.height_at(tx, ty) + self.SCOUT_AGL])

        x0 = float(gcs[0])
        step = self.CHAIN_STEP_M if tx >= x0 else -self.CHAIN_STEP_M
        xs = list(np.arange(x0 + step, tx, step))
        path = []
        for x in xs:
            y = float(terrain.corridor_centerline_y(x))
            path.append(np.array([x, y, terrain.height_at(x, y) + self.RELAY_AGL]))
        # Final approach: from the corridor out to the target, at relay height
        path.append(np.array([tx, ty, terrain.height_at(tx, ty) + self.RELAY_AGL]))

        hops: List[np.ndarray] = []
        cur, i = gcs, -1
        for _ in range(12):
            if self.link_ok(cur, target):
                break
            nxt = None
            for j in range(len(path) - 1, i, -1):
                if self.link_ok(cur, path[j]):
                    nxt = j
                    break
            if nxt is None:
                break           # nothing further is reachable: the chain stops here
            hops.append(path[nxt])
            cur, i = path[nxt], nxt
        self._chain_cache[key] = (now, len(hops), hops)
        return len(hops), hops

    # -- work model -----------------------------------------------------------

    def _work_points(self, drones, sim_time) -> List[np.ndarray]:
        points = []
        for d in drones.values():
            if not self._up(d, 1.0):
                continue
            if d.role == DroneRole.SCOUT:
                points.append(d.position)
                poi_id = self.guidance.assignments.get(d.id)
                poi = self.guidance._poi(poi_id) if poi_id else None
                if poi is not None:
                    points.append(poi.position)
            elif getattr(d, "data_backlog", 0) > 0:
                points.append(d.position)
            elif self.guidance.phases.get(d.id) in (MissionPhase.RTH, MissionPhase.LANDING):
                # Aircraft flying home still need their link to the GCS
                points.append(d.position)
        taken = set(self.guidance.assignments.values())
        for p in self.reachable_open_tasks(drones, sim_time):
            if p.id not in taken:
                points.append(p.position)
        return points

    def reachable_open_tasks(self, drones, sim_time) -> list:
        """Open tasks some aircraft in the fleet could still do (energy and clock)."""
        fleet = [d for d in drones.values() if self._operational(d)]
        if not fleet:
            return []
        probe = fleet[0]
        remaining = self.guidance.time_remaining(sim_time)
        out = []
        for p in self.guidance.open_tasks(sim_time):
            if not self.energy.reachable(probe, p.position):
                continue
            if remaining is not None:
                home = self.energy.home_of(probe)
                need = (self.energy.travel_time(home, p.position) + self.energy.config.survey_overhead_s
                        + self.energy.travel_time(p.position, home))
                if need > remaining:
                    continue
            out.append(p)
        return out

    def estimate_relays(self, drones, sim_time) -> int:
        points = self._work_points(drones, sim_time)
        if not points:
            self.chain_points = []
            return 0
        best_n, best_hops = 0, []
        gcs_x = float(self.world.gcs.position[0])
        # Farthest work first; ties broken by relay count
        for p in sorted(points, key=lambda q: -abs(float(q[0]) - gcs_x)):
            n, hops = self._chain_to(p)
            if n > best_n:
                best_n, best_hops = n, hops
        self.chain_points = best_hops
        return best_n

    # -- bookkeeping ----------------------------------------------------------

    def _record(self, drone_id: str, old: str, new: str, reason: str, sim_time: float):
        # A flap is a change that undoes the previous one within the window
        prev = self._last_role_change.get(drone_id)          # (time, from, to)
        flapped = bool(prev and sim_time - prev[0] < self.FLAP_WINDOW_S and new == prev[1])
        if flapped:
            self.flaps += 1
        self._last_role_change[drone_id] = (sim_time, old, new)
        entry = {"time": sim_time, "uav": drone_id, "from": old, "to": new,
                 "reason": reason, "flap": flapped}
        self.reallocations.append(entry)
        self.log("REALLOCATION", f"{drone_id}: {old.lower()} → {new.lower()} — {reason}", entry)

    def _set_role(self, drone, role: DroneRole, reason: str, sim_time: float,
                  station=None):
        old = drone.role.name
        drone.role = role
        g = self.guidance
        g.assignments.pop(drone.id, None)
        g.routes.pop(drone.id, None)
        drone.assigned_poi = None
        if role == DroneRole.RELAY:
            g.phases[drone.id] = MissionPhase.RELAY_TRANSIT
            if station is not None:
                g.set_relay_station(drone.id, station)
        else:
            g.relay_stations.pop(drone.id, None)
            g.phases[drone.id] = MissionPhase.IDLE
        self._record(drone.id, old, role.name, reason, sim_time)

    def _launch(self, drone, role: DroneRole, reason: str, sim_time: float, station=None) -> bool:
        if sim_time - self._last_launch < self.LAUNCH_SPACING_S:
            return False
        remaining = self.guidance.time_remaining(sim_time)
        if remaining is not None and role == DroneRole.RELAY:
            target = station if station is not None else self.world.gcs.position
            home = self.energy.home_of(drone)
            if remaining < (self.energy.travel_time(home, target)
                            + self.energy.travel_time(target, home) + 90.0):
                return False    # it would have to turn back before doing any good
        if not self.guidance.launch(drone, role, sim_time, reason):
            return False
        self.awareness.mark_launched(drone, sim_time)
        self._last_launch = sim_time
        if role == DroneRole.RELAY and station is not None:
            self.guidance.set_relay_station(drone.id, station)
        self._record(drone.id, "STANDBY", role.name, f"launched: {reason}", sim_time)
        return True

    def _far_point(self):
        """The farthest point of the affected area any task has been reported at."""
        w = self.world
        gcs_x = float(w.gcs.position[0])
        # Only tasks the GCS has been told about — never ones still to come
        t = self.guidance.mission_time(self._now)
        known = [p.position for p in w.pois if t is not None and p.released(t)]
        pois = known or [np.array([w.mission_end_x, 0.0, 0.0])]
        far = max(pois, key=lambda q: abs(float(q[0]) - gcs_x))
        x = float(far[0])
        y = float(w.terrain.corridor_centerline_y(x))
        return np.array([x, y, w.terrain.height_at(x, y)])

    def _launch_feasible(self, drone, poi, sim_time) -> bool:
        """Could this aircraft, launched from its pad now, do this task?"""
        saved = drone.position
        drone.position = np.asarray(drone.home_position, dtype=float)
        try:
            return self.guidance._feasible(drone, poi, sim_time)
        finally:
            drone.position = saved

    def _next_station(self, relays) -> Optional[np.ndarray]:
        """The chain hop point furthest from any relay already flying."""
        if not self.chain_points:
            return None
        taken = [np.asarray(self.guidance.relay_stations.get(r.id, r.position)) for r in relays]
        best, best_d = None, -1.0
        for p in self.chain_points:
            d = min((float(np.linalg.norm(p[:2] - t[:2])) for t in taken), default=1e9)
            if d > best_d:
                best, best_d = p, d
        return best

    # -- main loop ------------------------------------------------------------

    def update(self, drones: dict, sim_time: float, mission_live: bool = True):
        self._now = sim_time
        if self._owns_awareness:
            self.awareness.update(drones, sim_time, max(sim_time - self.awareness.now, 0.0))
        if not self.enabled or not mission_live or self.guidance.recalled:
            return
        if sim_time - self._last_update < self.UPDATE_S:
            return
        self._last_update = sim_time

        g = self.guidance
        self.relays_needed = self.estimate_relays(drones, sim_time)
        if self.mode == "static":
            self._update_static(drones, sim_time)
            return

        fleet = [d for d in drones.values() if self._operational(d)]
        cap = max(len(fleet) - self.MIN_SCOUTS, 0)
        needed = min(self.relays_needed, cap)

        # Heard within the last second (a relay that has gone quiet leaves a
        # gap the chain has to fill, whatever the reason it went quiet)
        airborne = [d for d in drones.values() if self._up(d, 1.0)
                    and g.phases.get(d.id) not in (MissionPhase.RTH, MissionPhase.LANDING)]
        # On the pads: the GCS can see these directly
        ready = [d for d in drones.values() if d.status == DroneStatus.READY]
        ready.sort(key=lambda d: d.id)

        self._update_handovers(drones, airborne, ready, sim_time)

        outgoing = set(self.handovers)
        relays = [d for d in airborne if d.role == DroneRole.RELAY and d.id not in outgoing
                  and d.id not in g.manual_targets]
        scouts = [d for d in airborne if d.role == DroneRole.SCOUT and d.id not in g.manual_targets]
        open_tasks = self.reachable_open_tasks(drones, sim_time)
        unassigned = [p for p in open_tasks if p.id not in set(g.assignments.values())]

        # 1. Deficit: fill from the pads first, then from the scouts
        relay_blocked = False
        if len(relays) < needed:
            self._surplus_since = None
            station = self._next_station(relays)
            launched = False
            if ready:
                launched = self._launch(ready[0], DroneRole.RELAY,
                                        f"chain needs {needed} relay(s), {len(relays)} flying",
                                        sim_time, station)
                if launched:
                    ready.pop(0)
                else:
                    # No time for a relay to do any good: a scout can still
                    # fly the task and bring its data home (store-and-forward)
                    relay_blocked = sim_time - self._last_launch >= self.LAUNCH_SPACING_S
            elif len(scouts) > self.MIN_SCOUTS:
                def promote_cost(d):
                    poi_id = g.assignments.get(d.id)
                    poi = g._poi(poi_id) if poi_id else None
                    busy = 0.0 if poi is None else poi.weight * 1000.0
                    far = (float(np.linalg.norm(d.position[:2] - station[:2]))
                           if station is not None else 0.0)
                    return busy + far - d.battery * 5.0
                eligible = [d for d in scouts
                            if d.battery > self.energy.handover_threshold(d) + 10.0]
                if eligible:
                    best = min(eligible, key=promote_cost)
                    self._set_role(best, DroneRole.RELAY,
                                   f"chain needs {needed} relay(s), {len(relays)} flying",
                                   sim_time, station)
        # 2. Surplus: hand a relay back to the survey (or send it home)
        elif len(relays) > needed:
            if self._surplus_since is None:
                self._surplus_since = sim_time
            elif sim_time - self._surplus_since >= self.DEMOTE_HOLD_S:
                self._surplus_since = None
                if unassigned:
                    spare = max(relays, key=lambda d: d.battery)
                    self._set_role(spare, DroneRole.SCOUT,
                                   f"chain needs only {needed} relay(s)", sim_time)
                else:
                    spare = min(relays, key=lambda d: d.battery)
                    self._record(spare.id, "RELAY", "STANDBY",
                                 f"chain needs only {needed} relay(s)", sim_time)
                    g.send_home(spare, sim_time, "relay no longer needed")
        else:
            self._surplus_since = None

        # 3. Scouts: launch charged aircraft for work they can actually do
        idle_scouts = [d for d in scouts if not g.assignments.get(d.id)]
        if unassigned and not idle_scouts and ready and (len(relays) >= needed or relay_blocked):
            doable = [p for p in unassigned if self._launch_feasible(ready[0], p, sim_time)]
            if doable:
                self._launch(ready[0], DroneRole.SCOUT,
                             f"{len(unassigned)} target(s) waiting", sim_time)

        # 4. Idle scouts with nothing left to do: stand by mid-valley while
        #    the battery is healthy, otherwise go home and recharge
        standing = sum(1 for d in scouts if getattr(d, "standing_by", False))
        for d in scouts:
            if g.assignments.get(d.id) or unassigned or getattr(d, "data_backlog", 0) > 0:
                self._idle_since.pop(d.id, None)
                d.standing_by = False
                continue
            if getattr(d, "standing_by", False):
                # Standing by is only worth its hover power while the scout
                # could still reach the far end of the affected area.
                if not self.energy.can_afford(d, self._far_point()):
                    d.standing_by = False
                    g.send_home(d, sim_time, "standing by: recharging for the next task")
                continue
            since = self._idle_since.setdefault(d.id, sim_time)
            if sim_time - since < self.IDLE_HOME_S:
                continue
            self._idle_since.pop(d.id, None)
            remaining = g.time_remaining(sim_time)
            if (d.battery >= self.STANDBY_MIN_BATTERY and standing < 2
                    and self.energy.can_afford(d, self._far_point())
                    and (remaining is None or remaining > 240.0)):
                w = self.world
                x = w.mission_start_x + self.STANDBY_ALONG * (w.mission_end_x - w.mission_start_x)
                y = float(w.terrain.corridor_centerline_y(x)) + 45.0 * (standing * 2 - 1)
                point = np.array([x, y, w.terrain.height_at(x, y) + 120.0])
                d.standing_by = True
                standing += 1
                g.stand_by(d, point, sim_time)
            else:
                g.send_home(d, sim_time, "no open targets")

    def _update_static(self, drones, sim_time):
        """Baseline: fixed roles, relaunch in the same role, nothing adaptive."""
        g = self.guidance
        if not hasattr(self, "_static_roles"):
            ids = sorted(drones)
            self._static_roles = {d: (DroneRole.RELAY if i < self.STATIC_RELAYS else DroneRole.SCOUT)
                                  for i, d in enumerate(ids)}
        for d in sorted(drones.values(), key=lambda q: q.id):
            if d.status != DroneStatus.READY:
                continue
            role = self._static_roles.get(d.id, DroneRole.SCOUT)
            if role == DroneRole.SCOUT and not self.reachable_open_tasks(drones, sim_time):
                continue
            station = self.chain_points[0] if (role == DroneRole.RELAY and self.chain_points) else None
            self._launch(d, role, "fixed role (baseline)", sim_time, station)
            break
        # Scouts with nothing to do go home
        unassigned = [p for p in self.reachable_open_tasks(drones, sim_time)
                      if p.id not in set(g.assignments.values())]
        for d in drones.values():
            if self._up(d, 1.0) and d.role == DroneRole.SCOUT and not g.assignments.get(d.id) \
                    and not unassigned and g.phases.get(d.id) not in (MissionPhase.RTH, MissionPhase.LANDING):
                since = self._idle_since.setdefault(d.id, sim_time)
                if sim_time - since >= self.IDLE_HOME_S:
                    self._idle_since.pop(d.id, None)
                    g.send_home(d, sim_time, "no open targets")

    def _update_handovers(self, drones, airborne, ready, sim_time):
        g = self.guidance
        # Start handovers for relays reaching their threshold
        for d in airborne:
            if d.role != DroneRole.RELAY or d.id in self.handovers or d.id in g.manual_targets:
                continue
            station = g.relay_stations.get(d.id, d.position)
            if d.battery > self.energy.handover_threshold(d, station):
                continue
            replacement = None
            if ready:
                cand = ready[0]
                if self._launch(cand, DroneRole.RELAY, f"relieving {d.id}", sim_time, station):
                    ready.pop(0)
                    replacement = cand
            if replacement is None:
                scouts = [s for s in airborne if s.role == DroneRole.SCOUT
                          and s.id not in g.manual_targets
                          and s.battery > self.energy.handover_threshold(s, station) + 15.0]
                n_scouts = sum(1 for s in airborne if s.role == DroneRole.SCOUT)
                if scouts and n_scouts > self.MIN_SCOUTS:
                    replacement = min(scouts, key=lambda s: (
                        bool(g.assignments.get(s.id)),
                        float(np.linalg.norm(s.position[:2] - np.asarray(station)[:2]))))
                    self._set_role(replacement, DroneRole.RELAY, f"relieving {d.id}",
                                   sim_time, station)
            if replacement is not None:
                self.handovers[d.id] = {"to": replacement.id, "since": sim_time,
                                        "station": np.asarray(station, dtype=float).tolist()}
                d.handover_to = replacement.id
                self.log("HANDOVER", f"{d.id} at {d.battery:.0f}% — {replacement.id} "
                                     f"flying out to take its station", {"uav": d.id})

        # Complete handovers whose replacement is on station
        for old_id, h in list(self.handovers.items()):
            old = drones.get(old_id)
            new = drones.get(h["to"])
            station = np.asarray(h["station"])
            done = False
            if old is None or not self._up(old, self.awareness.LOST_S) or \
                    g.phases.get(old_id) in (MissionPhase.RTH, MissionPhase.LANDING):
                done = True             # it had to leave anyway (RTH threshold) or was lost
            elif new is None or not self._up(new, 1.0) or new.role != DroneRole.RELAY:
                # Replacement lost: cancel, the relay keeps its station for now
                self.handovers.pop(old_id, None)
                old.handover_to = None
                continue
            elif (float(np.linalg.norm(new.position - station)) < self.HANDOVER_ON_STATION_M
                  or g.phases.get(new.id) == MissionPhase.RELAY_HOLD):
                # On station: at the old relay's post, or at whatever station
                # the placement optimiser has since given it
                g.send_home(old, sim_time, f"handover to {new.id} complete")
                self._record(old_id, "RELAY", "STANDBY", f"relieved by {new.id}", sim_time)
                self.log("HANDOVER", f"{new.id} on station — {old_id} released to recharge "
                                     f"after {sim_time - h['since']:.0f} s overlap", {"uav": old_id})
                done = True
            if done:
                self.handovers.pop(old_id, None)
                if old is not None:
                    old.handover_to = None

    # -- reporting ------------------------------------------------------------

    def get_state(self) -> dict:
        return {
            "relays_needed": self.relays_needed,
            "chain_points": [p.tolist() for p in self.chain_points],
            "handovers": {k: {"to": v["to"], "since": v["since"]} for k, v in self.handovers.items()},
            "reallocations": len(self.reallocations),
            "recent": self.reallocations[-6:],
            "flaps": self.flaps,
        }
