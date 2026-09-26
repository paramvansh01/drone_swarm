"""
Mission metrics, grouped exactly as the challenge's performance metrics are:

  mission         completion rate, completion time, priority-weighted score
  communication   packet delivery ratio, latency, connectivity availability,
                  communication downtime
  autonomy        relay reallocations, recovery time, reconfiguration efficiency
  robustness      performance after UAV / link failures
  safety          collisions, minimum inter-UAV separation, battery never
                  exhausted, geofence never left

Definitions (also in the README):

  completion rate         delivered released tasks / released tasks. A task
                          counts only once its survey data has reached the GCS.
  completion time         mission time at which the last released task was
                          delivered (None if some never were).
  priority-weighted score sum(weight * delivered) / sum(weight), weights
                          P1 = 3, P2 = 2, P3 = 1, delivered inside the clock.
  availability            airborne time with an end-to-end path of
                          reliability >= 0.5 to the GCS / airborne time.
  downtime                airborne time without such a path, summed over UAVs;
                          plus outage count and the longest single outage.
  recovery time           per disruption: from the disruption until every
                          airborne UAV has had a path for 1 s continuously.
                          0 when connectivity was never lost ("hitless").
  reconfiguration eff.    1 - (role changes undone within 30 s) / (role changes).
  robustness              PDR and availability in the 60 s after each
                          disruption, against the 60 s before it.
"""

from __future__ import annotations

from typing import Dict, List, Optional

import numpy as np

from sim.drone import DroneStatus
from sim.world import PRIORITY_WEIGHT


class MissionMetrics:
    RECOVERED_HOLD_S = 1.0
    WINDOW_S = 60.0

    def __init__(self, controller):
        self.ctl = controller
        self.reset()

    def reset(self):
        self.disruptions: List[dict] = []
        self.geofence_violations = 0
        self.geofence_violation_s = 0.0
        self._outside: set = set()
        self.altitude_violations = 0
        self._too_high: set = set()
        self.battery_depleted = 0
        self._depleted: set = set()
        self.landings: List[dict] = []
        self._conn_trace: List[tuple] = []     # (t, all_connected, n_airborne, n_connected)
        self.mission_end: Optional[float] = None

    # -- disruptions --------------------------------------------------------------

    def open_disruption(self, kind: str, t: float, detail: dict = None):
        self.disruptions.append({"kind": kind, "t0": t, "detail": detail or {},
                                 "lost": False, "stable": 0.0, "recovered_at": None,
                                 "recovery_s": None})

    def on_event(self, entry: dict):
        """Hook for mission events that are disruptions in their own right."""
        kind = entry.get("type")
        params = entry.get("params") or {}
        if kind == "RTH" and params.get("role") == "RELAY":
            self.open_disruption("relay_rth", entry.get("time", 0.0), {"uav": params.get("drone")})
        elif kind == "KILL_NODE" and not any(
                d["kind"] == "uav_failure" and abs(d["t0"] - entry.get("time", 0.0)) < 1e-6
                for d in self.disruptions):
            self.open_disruption("uav_failure", entry.get("time", 0.0), params)
        elif kind == "LANDED":
            self.landings.append({"time": entry.get("time"), "uav": params.get("drone"),
                                  "battery": params.get("battery")})

    # -- per-update -----------------------------------------------------------

    def update(self, sim_time: float, dt: float, drones: Dict):
        world = self.ctl.world
        fence = getattr(world, "geofence", None)
        airborne = [d for d in drones.values() if d.is_alive]

        outside_now, high_now = set(), set()
        for d in airborne:
            if fence is not None and not fence.contains(d.position[0], d.position[1]):
                outside_now.add(d.id)
            if world.agl(d.position) > world.max_agl + 5.0:
                high_now.add(d.id)
        self.geofence_violations += len(outside_now - self._outside)
        self.geofence_violation_s += len(outside_now) * dt
        self._outside = outside_now
        self.altitude_violations += len(high_now - self._too_high)
        self._too_high = high_now

        for d in drones.values():
            if d.status == DroneStatus.LANDED and d.battery <= 0.0 and d.id not in self._depleted:
                self._depleted.add(d.id)
                self.battery_depleted += 1

        connected = [d for d in airborne if getattr(d, "connected", False)]
        all_up = len(connected) == len(airborne)
        self._conn_trace.append((sim_time, all_up, len(airborne), len(connected)))
        if len(self._conn_trace) > 40_000:
            self._conn_trace = self._conn_trace[-30_000:]

        for dis in self.disruptions:
            if dis["recovered_at"] is not None:
                continue
            if not all_up:
                dis["lost"] = True
                dis["stable"] = 0.0
                continue
            dis["stable"] += dt
            if dis["stable"] >= self.RECOVERED_HOLD_S:
                restored = sim_time - dis["stable"]
                dis["recovered_at"] = restored
                dis["recovery_s"] = max(0.0, restored - dis["t0"]) if dis["lost"] else 0.0

    # -- summary --------------------------------------------------------------

    def _window(self, t0: float, t1: float):
        """(availability, PDR) of packets and airborne time between t0 and t1."""
        traffic = self.ctl.traffic
        pkts = [p for p in traffic.log if t0 <= p.created < t1]
        pdr = (sum(1 for p in pkts if p.delivered_at is not None) / len(pkts)) if pkts else None
        trace = [x for x in self._conn_trace if t0 <= x[0] < t1 and x[2] > 0]
        avail = (sum(x[3] for x in trace) / sum(x[2] for x in trace)) if trace else None
        return avail, pdr

    def summary(self, now: float) -> dict:
        ctl = self.ctl
        world = ctl.world
        g = ctl.guidance
        start = g.mission_started if g.mission_started is not None else 0.0
        mission_t = now - start
        limit = getattr(world, "time_limit_s", None)

        released = [p for p in world.pois if p.released(mission_t)]
        delivered = [p for p in released if p.delivered
                     and (limit is None or (p.delivered_at - start) <= limit + 1e-6)]
        surveyed = [p for p in released if p.surveyed]
        w_total = sum(p.weight for p in released)
        w_done = sum(p.weight for p in delivered)
        all_done = bool(released) and len(delivered) == len(released)
        completion_time = (max(p.delivered_at for p in delivered) - start) if all_done else None

        emergent = []
        for p in world.pois:
            if not p.emergent or not p.released(mission_t):
                continue
            emergent.append({
                "id": p.id, "priority": p.priority, "released_s": p.release_time,
                "surveyed_after_s": (p.surveyed_at - start - p.release_time) if p.surveyed_at else None,
                "delivered_after_s": (p.delivered_at - start - p.release_time) if p.delivered_at else None,
            })
        responses = [e["delivered_after_s"] for e in emergent if e["delivered_after_s"] is not None]

        traffic = ctl.traffic.summary(now)
        roles = ctl.roles
        realloc = len(roles.reallocations)
        heals = ctl.election.get_state().get("heals", []) if hasattr(ctl.election, "get_state") else []

        recoveries = [d["recovery_s"] for d in self.disruptions if d["recovery_s"] is not None]
        unrecovered = [d for d in self.disruptions if d["recovered_at"] is None]

        robustness = []
        for d in self.disruptions:
            before = self._window(d["t0"] - self.WINDOW_S, d["t0"])
            after = self._window(d["t0"], d["t0"] + self.WINDOW_S)
            robustness.append({
                "kind": d["kind"], "t": round(d["t0"] - start, 1),
                "detail": {k: v for k, v in d["detail"].items() if k != "tasks"},
                "hitless": d["recovery_s"] == 0.0,
                "recovery_s": None if d["recovery_s"] is None else round(d["recovery_s"], 2),
                "availability_before": before[0], "availability_after": after[0],
                "pdr_before": before[1], "pdr_after": after[1],
            })
        first = min((d["t0"] for d in self.disruptions), default=None)
        post = self._window(first, now + 1.0) if first is not None else (None, None)

        drones = ctl.sim.drones
        sep = ctl.sim.metrics.get("min_separation_ever_m", 999.0)
        home = [d.id for d in drones.values() if d.on_pad]
        lost = [d.id for d in drones.values() if d.status == DroneStatus.KILLED]
        min_batt = min((d.min_battery_airborne for d in drones.values()
                        if d.sorties > 0 or d.is_alive), default=None)
        landing_batt = [x["battery"] for x in self.landings if x.get("battery") is not None]

        return {
            "mission": {
                "mission_time_s": round(mission_t, 1),
                "time_limit_s": limit,
                "tasks_total": len(world.pois),
                "tasks_released": len(released),
                "tasks_surveyed": len(surveyed),
                "tasks_delivered": len(delivered),
                "completion_rate": (len(delivered) / len(released)) if released else None,
                "completion_time_s": None if completion_time is None else round(completion_time, 1),
                "priority_weighted_score": (w_done / w_total) if w_total else None,
                "within_time_limit": all_done and (limit is None or completion_time <= limit),
                "emergent_tasks": emergent,
                "emergent_response_s_mean": float(np.mean(responses)) if responses else None,
                "uavs_on_pads": home,
                "uavs_lost": lost,
            },
            "communication": {
                "packet_delivery_ratio": traffic["pdr"],
                "pdr_telemetry": traffic["pdr_telemetry"],
                "pdr_survey_data": traffic["pdr_survey"],
                "latency_ms_mean": traffic["latency_ms_mean"],
                "latency_ms_p95": traffic["latency_ms_p95"],
                "survey_data_latency_s_mean": traffic["survey_latency_s_mean"],
                "connectivity_availability": traffic["connectivity_availability"],
                "all_uavs_connected_fraction": traffic["swarm_all_connected"],
                "downtime_s_total": round(traffic["downtime_s_total"], 2),
                "downtime_s_longest": round(traffic["downtime_s_longest"], 2),
                "outage_count": traffic["outage_count"],
                "packets": {"generated": traffic["packets_generated"],
                            "delivered": traffic["packets_delivered"],
                            "dropped": traffic["packets_dropped"]},
                "survey_data_reopened": traffic["data_reopened"],
            },
            "autonomy": {
                "relay_reallocations": realloc,
                "handovers": sum(1 for r in roles.reallocations if "relieving" in r["reason"]),
                "role_flaps": roles.flaps,
                "reconfiguration_efficiency": (1.0 - roles.flaps / realloc) if realloc else None,
                "recovery_time_s_mean": float(np.mean(recoveries)) if recoveries else None,
                "recovery_time_s_max": float(np.max(recoveries)) if recoveries else None,
                "disruptions": len(self.disruptions),
                "disruptions_hitless": sum(1 for r in recoveries if r == 0.0),
                "disruptions_unrecovered": len(unrecovered),
                "failover_ms_last": heals[-1]["total_ms"] if heals else None,
                "relay_solves": ctl.relay_optimizer.optimization_count,
            },
            "robustness": {
                "after_first_disruption": {"availability": post[0], "pdr": post[1]},
                "per_disruption": robustness,
            },
            "safety": {
                "collisions": int(ctl.sim.metrics.get("collisions", 0)),
                "near_misses": int(ctl.sim.metrics.get("near_misses", 0)),
                "min_separation_m": None if sep >= 999.0 else round(sep, 2),
                "terrain_contacts": int(ctl.sim.metrics.get("terrain_contacts", 0)),
                "conflicts_resolved": getattr(g.deconfliction, "conflicts", 0) if g.deconfliction else 0,
                "geofence_violations": self.geofence_violations,
                "geofence_violation_s": round(self.geofence_violation_s, 2),
                "altitude_violations": self.altitude_violations,
                "battery_depleted": self.battery_depleted,
                "min_battery_pct": None if min_batt is None else round(min_batt, 1),
                "min_landing_battery_pct": round(min(landing_batt), 1) if landing_batt else None,
                "landings": len(self.landings),
            },
        }

    @staticmethod
    def indicative_scores(summary: dict) -> dict:
        """
        Our own 0-100 reading of each rubric category, for comparing runs and
        strategies. It is NOT the jury's scoring — just a transparent formula.
        """
        m, c, a, s = (summary["mission"], summary["communication"],
                      summary["autonomy"], summary["safety"])
        mission = 100.0 * (m["priority_weighted_score"] or 0.0) * (1.0 if m["within_time_limit"] else 0.85)
        comms = 100.0 * 0.5 * ((c["packet_delivery_ratio"] or 0.0) + (c["connectivity_availability"] or 0.0))
        eff = a["reconfiguration_efficiency"]
        rec = a["recovery_time_s_mean"]
        autonomy = 100.0 * (eff if eff is not None else 1.0) * (1.0 if not rec or rec <= 10 else 10.0 / rec)
        n = a["disruptions"]
        fast = sum(1 for r in summary["robustness"]["per_disruption"]
                   if r["recovery_s"] is not None and r["recovery_s"] <= 30.0)
        recovery = 100.0 * (fast / n) if n else 100.0
        penalties = (s["collisions"] * 50 + s["geofence_violations"] * 20
                     + s["battery_depleted"] * 50 + s["terrain_contacts"] * 10)
        safety = max(0.0, 100.0 - penalties)
        weights = {"mission_completion": 25, "communication_resilience": 25,
                   "relay_role_management": 20, "fault_recovery": 15, "safety": 10}
        parts = {"mission_completion": mission, "communication_resilience": comms,
                 "relay_role_management": autonomy, "fault_recovery": recovery, "safety": safety}
        weighted = sum(parts[k] * w for k, w in weights.items()) / sum(weights.values())
        return {k: round(v, 1) for k, v in parts.items()} | {"weighted_95pct_of_rubric": round(weighted, 1)}
