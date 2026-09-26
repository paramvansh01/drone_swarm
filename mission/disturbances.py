"""
Disturbances: everything the organisers' hidden scenarios can throw at the swarm.

One implementation serves both the scenario director (timed, from a JSON
file) and the operator's live injects on the dashboard, so a disturbance
rehearsed by hand is exactly the one a benchmark run applies.

Every disturbance acts on the physics or the radio, never on the autonomy's
knowledge: the swarm is not told a UAV has failed or a link is down, it has
to notice.

    uav_failure     an aircraft drops out of the sky
    comm_outage     regional RF interference, one aircraft's radio failing,
                    the GCS receiver going deaf, or a global noise rise
    packet_loss     extra loss on every link touching a node (or all links)
    link_failure    one specific link carries nothing
    new_task        a new survey target, or a region of them, appears now
    battery_fault   an aircraft's power draw jumps (degraded cell / motor)
    weather         heavy rain, a downdraught cell, or GNSS degradation
    wind_gust       a gust of the given magnitude
    phase           a label for the dashboard's phase indicator
"""

from __future__ import annotations

from typing import Dict, List, Optional

import numpy as np

from sim.drone import DroneRole

KINDS = ("uav_failure", "comm_outage", "packet_loss", "link_failure", "new_task",
         "battery_fault", "weather", "wind_gust", "phase")


def resolve_xy(world, spec: dict, default=None):
    """
    A position from a scenario entry: absolute {"x", "y"} in local metres, or
    {"along": 0..1, "offset_m": m} measured along the mission corridor, which
    keeps a scenario meaningful on any theatre.
    """
    if spec is None:
        return default
    if "x" in spec and "y" in spec:
        return float(spec["x"]), float(spec["y"])
    if "along" in spec:
        x = world.mission_start_x + float(spec["along"]) * (world.mission_end_x - world.mission_start_x)
        y = float(world.terrain.corridor_centerline_y(x)) + float(spec.get("offset_m", 0.0))
        return float(x), float(y)
    return default


def power_for_radius(radius_m: float) -> float:
    """Interference power (dBm) that lifts the noise floor to -82 dBm at `radius_m`."""
    return 20.0 * np.log10(max(radius_m, 10.0)) - 53.47


class Disturbances:
    def __init__(self, controller, seed: int = 17):
        self.ctl = controller
        self.rng = np.random.default_rng(seed)
        self.reset()

    def reset(self):
        self.active: List[dict] = []       # timed effects awaiting expiry
        self.history: List[dict] = []
        self._counter = 0
        self._task_counter = 0

    # -- helpers ----------------------------------------------------------------

    @property
    def sim(self):
        return self.ctl.sim

    def _log(self, kind: str, message: str, extra: dict = None):
        self.sim.log_event(kind, message, extra or {})

    def _target(self, spec: Optional[str]):
        """An aircraft by id, or the first airborne one flying a role."""
        drones = self.sim.drones
        airborne = sorted((d for d in drones.values() if d.is_alive), key=lambda d: d.id)
        if not airborne:
            raise ValueError("no aircraft airborne")
        if spec in (None, "", "random"):
            return airborne[int(self.rng.integers(len(airborne)))]
        if spec in drones:
            return drones[spec]
        wanted = str(spec).upper()
        for d in airborne:
            if d.role.name == wanted:
                return d
        raise ValueError(f"no airborne aircraft matching {spec!r}")

    def _until(self, params: dict, default: float) -> float:
        return self.sim.sim_time + float(params.get("duration", default))

    # -- application ----------------------------------------------------------

    def apply(self, kind: str, params: dict = None) -> dict:
        params = dict(params or {})
        if kind not in KINDS:
            raise ValueError(f"unknown disturbance: {kind} (one of {', '.join(KINDS)})")
        result = getattr(self, f"_{kind}")(params) or {}
        entry = {"time": self.sim.sim_time, "kind": kind, "params": params, "result": result}
        self.history.append(entry)
        metrics = getattr(self.ctl, "mission_metrics", None)
        if metrics is not None and kind in ("uav_failure", "comm_outage", "packet_loss",
                                            "link_failure", "battery_fault"):
            metrics.open_disruption(kind, self.sim.sim_time, result)
        return result

    def _uav_failure(self, p):
        drone = self._target(p.get("target") or p.get("uav") or p.get("drone_id"))
        role = drone.role.name
        drone.kill(self.sim.sim_time)
        self.ctl.guidance.manual_targets.pop(drone.id, None)
        self._log("KILL_NODE", f"UAV FAILURE: {drone.id} ({role.lower()}) is down", {"drone_id": drone.id})
        return {"uav": drone.id, "role": role}

    def _comm_outage(self, p):
        until = self._until(p, 30.0)
        rf = self.ctl.rf
        if p.get("uav") or p.get("target"):
            drone = self._target(p.get("uav") or p.get("target"))
            drone.radio_ok = False
            self.active.append({"until": until, "undo": ("radio", drone.id)})
            self._log("COMM_OUTAGE", f"{drone.id} radio failure — no transmit or receive "
                                     f"for {until - self.sim.sim_time:.0f} s", {"uav": drone.id})
            return {"uav": drone.id, "until": until}
        if p.get("gcs"):
            self.sim.packet_loss["GCS"] = 1.0
            self.active.append({"until": until, "undo": ("loss", "GCS")})
            self._log("COMM_OUTAGE", f"GCS receiver outage for {until - self.sim.sim_time:.0f} s — "
                                     "survey data must wait in the air", {})
            return {"gcs": True, "until": until}
        if p.get("scope") == "global":
            db = float(p.get("noise_db", 14.0))
            rf.degrade_rf(db)
            self.active.append({"until": until, "undo": ("global", db)})
            self._log("COMM_OUTAGE", f"Area-wide RF degradation +{db:.0f} dB for "
                                     f"{until - self.sim.sim_time:.0f} s", {})
            return {"scope": "global", "until": until}
        # Regional interference source
        xy = resolve_xy(self.ctl.world, p)
        if xy is None:
            live = [d for d in self.sim.drones.values() if d.is_alive]
            if not live:
                raise ValueError("no position given and no aircraft airborne")
            relay = [d for d in live if d.role == DroneRole.RELAY] or live
            xy = tuple(relay[0].position[:2])
        power = float(p["power_dbm"]) if "power_dbm" in p else power_for_radius(
            float(p.get("radius_m", 900.0)))
        jid = self.ctl.add_interference(xy[0], xy[1], power, label="COMM OUTAGE")
        self.active.append({"until": until, "undo": ("jammer", jid)})
        return {"source": jid, "x": xy[0], "y": xy[1], "power_dbm": power, "until": until}

    def _packet_loss(self, p):
        until = self._until(p, 60.0)
        node = p.get("uav") or p.get("target") or "*"
        rate = float(np.clip(float(p.get("rate", 0.3)), 0.0, 1.0))
        self.sim.packet_loss[node] = rate
        self.active.append({"until": until, "undo": ("loss", node)})
        where = "every link" if node == "*" else f"links of {node}"
        self._log("PACKET_LOSS", f"{rate * 100:.0f}% packet loss on {where} for "
                                 f"{until - self.sim.sim_time:.0f} s", {"node": node})
        return {"node": node, "rate": rate, "until": until}

    def _link_failure(self, p):
        until = self._until(p, 30.0)
        a, b = str(p["a"]), str(p["b"])
        self.sim.link_blocks[frozenset((a, b))] = until
        self._log("LINK_FAILURE", f"Link {a}↔{b} down for {until - self.sim.sim_time:.0f} s", {})
        return {"a": a, "b": b, "until": until}

    def _new_task(self, p):
        world = self.ctl.world
        guidance = self.ctl.guidance
        t = guidance.mission_time(self.sim.sim_time) or 0.0
        region = p.get("region")
        task = p.get("task") or ({} if region else p)
        created = []
        if region:
            cx, cy = resolve_xy(world, region)
            radius = float(region.get("radius_m", 150.0))
            self._task_counter += 1
            group = f"REGION-{self._task_counter}"
            points = [(cx, cy)]
            if radius > 60.0:
                for k in range(4):
                    ang = 2 * np.pi * k / 4 + np.pi / 4
                    points.append((cx + 0.6 * radius * np.cos(ang), cy + 0.6 * radius * np.sin(ang)))
            for x, y in points:
                created.append(self.ctl.add_task(x, y, category=region.get("category", "trapped_survivors"),
                                                 priority=int(region.get("priority", 1)),
                                                 release_time=t, emergent=True, region=group))
            self._log("NEW_TASK", f"NEW PRIORITY-{int(region.get('priority', 1))} REGION {group}: "
                                  f"{len(created)} survey cells around ({cx:.0f}, {cy:.0f})",
                      {"region": group})
            return {"region": group, "tasks": created}
        xy = resolve_xy(world, task)
        if xy is None:
            raise ValueError("new_task needs x/y or along")
        poi_id = self.ctl.add_task(xy[0], xy[1], category=task.get("category", "trapped_survivors"),
                                   priority=int(task.get("priority", 1)), release_time=t,
                                   emergent=True, poi_id=task.get("id"))
        self._log("NEW_TASK", f"NEW PRIORITY-{int(task.get('priority', 1))} TASK {poi_id} "
                              f"({task.get('category', 'trapped_survivors').replace('_', ' ')}) "
                              f"at ({xy[0]:.0f}, {xy[1]:.0f})", {"poi": poi_id})
        return {"tasks": [poi_id]}

    def _battery_fault(self, p):
        drone = self._target(p.get("uav") or p.get("target"))
        return self.ctl.injects.inject("equipment_fault",
                                       {"drone_id": drone.id, "severity": p.get("severity", 0.45)},
                                       self.sim.drones, self.sim.sim_time)

    def _weather(self, p):
        kind = p.get("kind", "heavy_rain")
        if kind not in ("heavy_rain", "storm_cell", "gps_denial"):
            raise ValueError(f"unknown weather kind: {kind}")
        params = {k: v for k, v in p.items() if k != "kind"}
        xy = resolve_xy(self.ctl.world, p)
        if xy is not None:
            params["x"], params["y"] = xy
        return self.ctl.injects.inject(kind, params, self.sim.drones, self.sim.sim_time)

    def _wind_gust(self, p):
        mag = float(p.get("magnitude", 12.0))
        self.ctl.wind.add_gust(start_time=self.sim.sim_time, magnitude=mag,
                               duration=float(p.get("duration", 3.0)))
        self._log("WIND_GUST", f"Wind gust {mag:.0f} m/s", {})
        return {"magnitude": mag}

    def _phase(self, p):
        phase = int(p.get("phase", 0))
        self.sim.metrics["current_phase"] = phase
        self.ctl.current_phase = phase
        label = p.get("label") or self.ctl.PHASE_NAMES.get(phase, "")
        self._log("PHASE", f"Phase {phase}: {label}", {"phase": phase})
        return {"phase": phase}

    # -- expiry ---------------------------------------------------------------

    def update(self):
        now = self.sim.sim_time
        for effect in list(self.active):
            if now < effect["until"]:
                continue
            self.active.remove(effect)
            kind, arg = effect["undo"]
            if kind == "radio":
                d = self.sim.drones.get(arg)
                if d is not None:
                    d.radio_ok = True
                    self._log("COMM_RESTORED", f"{arg} radio back", {"uav": arg})
            elif kind == "loss":
                self.sim.packet_loss.pop(arg, None)
                self._log("COMM_RESTORED", f"Packet loss on {'every link' if arg == '*' else arg} cleared", {})
            elif kind == "global":
                self.ctl.rf.restore_rf()
                self._log("COMM_RESTORED", "Area-wide RF degradation over", {})
            elif kind == "jammer":
                self.ctl.rf.remove_jammer(arg)
                self._log("COMM_RESTORED", f"Interference source {arg} gone", {"source": arg})

    def get_state(self) -> dict:
        return {
            "active": [{"until": e["until"], "effect": e["undo"][0], "on": str(e["undo"][1])}
                       for e in self.active],
            "applied": len(self.history),
        }
