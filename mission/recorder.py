"""
Simulation logs.

The organisers will publish a standardised log format; until then every run
writes this set, and `mission/recorder.py` is the one place to change when
theirs arrives:

    run_meta.json          scenario, seed, code version, wall-clock start/end
    scenario_resolved.json the exact world flown: GCS, geofence, every task
    events.jsonl           one JSON object per mission event, in sim time
    uav_state.csv          1 Hz: pose, role, status, phase, battery, link state
    links.csv              1 Hz: every live link and its delivery ratio
    packets.csv            every packet: class, source, times, hops, outcome
    metrics.json           the final metrics (mission / communication /
                           autonomy / robustness / safety) and indicative scores
"""

from __future__ import annotations

import csv
import json
import platform
import subprocess
import time
from pathlib import Path
from typing import Optional


def _git_rev() -> Optional[str]:
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True,
                              text=True, timeout=2, cwd=Path(__file__).resolve().parent.parent
                              ).stdout.strip() or None
    except Exception:
        return None


def _jsonable(obj):
    import numpy as np
    if isinstance(obj, dict):
        return {str(k): _jsonable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple, set)):
        return [_jsonable(v) for v in obj]
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    return obj


class MissionRecorder:
    SAMPLE_S = 1.0

    def __init__(self, out_dir, controller, scenario=None):
        self.dir = Path(out_dir)
        self.dir.mkdir(parents=True, exist_ok=True)
        self.ctl = controller
        self.scenario = scenario
        self._last_sample = -1e9
        self._wall_start = time.time()

        self._events = open(self.dir / "events.jsonl", "w")
        self._uav_f = open(self.dir / "uav_state.csv", "w", newline="")
        self._uav = csv.writer(self._uav_f)
        self._uav.writerow(["t", "mission_t", "uav", "role", "status", "phase", "x", "y", "z",
                            "agl", "speed", "battery", "connected", "path_pdr", "hops",
                            "gcs_link", "radio_ok", "assigned_task", "survey_backlog"])
        self._link_f = open(self.dir / "links.csv", "w", newline="")
        self._link = csv.writer(self._link_f)
        self._link.writerow(["t", "a", "b", "pdr"])

    def mission_t(self, t: float) -> Optional[float]:
        return self.ctl.guidance.mission_time(t)

    def on_event(self, entry: dict):
        t = entry.get("time", 0.0)
        mt = self.mission_t(t)
        record = {"t": round(t, 3), "mission_t": None if mt is None else round(mt, 3),
                  "type": entry.get("type"), "message": entry.get("message"),
                  "data": {k: v for k, v in (entry.get("params") or {}).items()
                           if k not in ("message", "time", "type")}}
        self._events.write(json.dumps(_jsonable(record)) + "\n")

    def sample(self, sim_time: float):
        if sim_time - self._last_sample < self.SAMPLE_S:
            return
        self._last_sample = sim_time
        mt = self.mission_t(sim_time)
        g = self.ctl.guidance
        traffic = self.ctl.traffic
        for d in self.ctl.sim.drones.values():
            phase = g.phases.get(d.id)
            self._uav.writerow([
                f"{sim_time:.2f}", "" if mt is None else f"{mt:.2f}", d.id, d.role.name,
                d.status.name, phase.name if phase else "", f"{d.position[0]:.1f}",
                f"{d.position[1]:.1f}", f"{d.position[2]:.1f}", f"{self.ctl.world.agl(d.position):.1f}",
                f"{d.speed:.2f}", f"{d.battery:.2f}", int(bool(getattr(d, "connected", False))),
                f"{getattr(d, 'path_quality', 0.0):.3f}", getattr(d, "hops", 0),
                f"{getattr(d, 'gcs_link', 0.0):.3f}", int(bool(getattr(d, "radio_ok", True))),
                g.assignments.get(d.id, ""), traffic.backlog(d.id),
            ])
            if not d.is_alive:
                continue
            if getattr(d, "gcs_link", 0.0) > 0.0:
                self._link.writerow([f"{sim_time:.2f}", d.id, "GCS", f"{d.gcs_link:.3f}"])
            for nb, q in d.neighbors.items():
                if d.id < nb:
                    self._link.writerow([f"{sim_time:.2f}", d.id, nb, f"{q:.3f}"])

    def finalize(self, summary: dict, scores: dict = None):
        self._events.close()
        self._uav_f.close()
        self._link_f.close()

        with open(self.dir / "packets.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["id", "class", "source", "task", "priority", "created", "delivered",
                        "latency_ms", "hops", "retries", "outcome"])
            for p in self.ctl.traffic.log:
                w.writerow([p.id, p.kind, p.src, p.poi or "", p.priority, f"{p.created:.3f}",
                            "" if p.delivered_at is None else f"{p.delivered_at:.3f}",
                            "" if p.delivered_at is None else f"{(p.delivered_at - p.created) * 1000:.1f}",
                            p.hops, p.retries, "delivered" if p.delivered_at is not None
                            else (p.dropped or "in_flight")])

        world = self.ctl.world
        (self.dir / "scenario_resolved.json").write_text(json.dumps(_jsonable({
            "theatre": world.terrain.theatre_info(),
            "gcs": world.gcs.get_state(),
            "geofence": world.geofence.get_state(),
            "time_limit_s": world.time_limit_s,
            "tasks": [p.get_state() for p in world.pois],
            "fleet": sorted(self.ctl.sim.drones),
        }), indent=2))

        (self.dir / "metrics.json").write_text(json.dumps(_jsonable({
            "summary": summary, "indicative_scores": scores or {},
        }), indent=2))

        meta = {
            "scenario": None if self.scenario is None else {
                "name": self.scenario.name, "path": self.scenario.path, "seed": self.scenario.seed,
                "theatre": self.scenario.theatre,
            },
            "scenario_source": None if self.scenario is None else self.scenario.raw,
            "code_version": _git_rev(),
            "python": platform.python_version(),
            "platform": platform.platform(),
            "wall_clock_s": round(time.time() - self._wall_start, 1),
            "sim_dt_s": self.ctl.sim.dt,
            "controller": self.ctl.active_controller,
        }
        (self.dir / "run_meta.json").write_text(json.dumps(_jsonable(meta), indent=2))
