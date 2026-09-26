"""
Mission scenarios: the JSON format, the loader, and the director that plays
a scenario's hidden disturbances against the swarm.

A scenario fixes everything needed to reproduce a run: terrain, seed, fleet,
ground station, geofence, survey tasks, mission clock, weather, and the
timeline of disturbances. The organisers will publish their own mission
specification and log format; this module is the single adapter point for
them (`load_scenario` in, `mission.recorder` out).

    {
      "name": "...",                    "description": "...",
      "theatre": "kedarnath",           # terrain pack, or "synthetic"
      "seed": 7,
      "time_limit_s": 900,              # allotted mission time
      "fleet": {"size": 5, "recharge_s": 120},
      "gcs": {"along": -0.04},          # or {"x": .., "y": ..}; default: valley mouth
      "geofence": {"half_width_m": 700, "max_agl_m": 400},   # or {"polygon": [[x, y], ...]}
      "tasks": {
        "auto": {"count": 8, "seed": 3},                  # generated along the valley
        "list": [{"id": "POI-001", "along": 0.4, "offset_m": 60,
                  "priority": 1, "category": "collapsed_building", "release_s": 0}]
      },
      "environment": {"wind_mps": 6.5, "wind_heading_deg": 15, "turbulence": 1.6},
      "disturbances": [
        {"t": 150, "type": "uav_failure", "target": "relay"},
        {"t": 240, "type": "comm_outage", "duration": 45, "along": 0.5, "radius_m": 900},
        {"t": 300, "type": "packet_loss", "duration": 60, "rate": 0.3},
        {"t": 360, "type": "new_task", "task": {"along": 0.8, "priority": 1}}
      ]
    }

Positions are local metres ({"x", "y"}) or corridor-relative
({"along": 0..1, "offset_m": m}). Disturbance times are mission time: seconds
after launch.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import numpy as np

from sim.world import World
from .disturbances import resolve_xy, KINDS


@dataclass
class Scenario:
    name: str = "Unnamed scenario"
    description: str = ""
    theatre: str = "synthetic"
    seed: int = 42
    time_limit_s: Optional[float] = 900.0
    fleet_size: int = 5
    recharge_s: float = 120.0
    gcs: Optional[dict] = None
    geofence: Optional[dict] = None
    tasks_auto: Optional[dict] = None
    tasks_list: List[dict] = field(default_factory=list)
    environment: dict = field(default_factory=dict)
    disturbances: List[dict] = field(default_factory=list)
    path: Optional[str] = None
    raw: dict = field(default_factory=dict)


def load_scenario(source) -> Scenario:
    """Load and validate a scenario from a path or a dict."""
    if isinstance(source, (str, Path)):
        path = Path(source)
        data = json.loads(path.read_text())
    else:
        path, data = None, dict(source)

    fleet = data.get("fleet", {}) or {}
    tasks = data.get("tasks", {}) or {}
    disturbances = sorted(data.get("disturbances", []) or [], key=lambda d: float(d.get("t", 0)))
    for d in disturbances:
        if d.get("type") not in KINDS:
            raise ValueError(f"unknown disturbance type {d.get('type')!r} "
                             f"(one of {', '.join(KINDS)})")
        if "t" not in d:
            raise ValueError(f"disturbance {d} has no time 't'")
    size = int(fleet.get("size", 5))
    if not 1 <= size <= 12:
        raise ValueError("fleet size must be between 1 and 12")

    return Scenario(
        name=data.get("name", "Unnamed scenario"),
        description=data.get("description", ""),
        theatre=data.get("theatre", "synthetic"),
        seed=int(data.get("seed", 42)),
        time_limit_s=data.get("time_limit_s", 900.0),
        fleet_size=size,
        recharge_s=float(fleet.get("recharge_s", 120.0)),
        gcs=data.get("gcs"),
        geofence=data.get("geofence"),
        tasks_auto=tasks.get("auto"),
        tasks_list=list(tasks.get("list", []) or []),
        environment=data.get("environment", {}) or {},
        disturbances=disturbances,
        path=str(path) if path else None,
        raw=data,
    )


def build_world(scenario: Scenario) -> World:
    """The world a scenario describes: terrain, GCS, geofence, tasks, clock."""
    if scenario.theatre in (None, "", "synthetic"):
        from sim.terrain import build_terrain
        world = World(terrain=build_terrain(seed=4207))
        world.populate_mission(num_pois=0, rubble_count=10, seed=scenario.seed)
    else:
        world = World.from_theatre(scenario.theatre, num_pois=0, seed=scenario.seed)

    if scenario.gcs:
        spec = dict(scenario.gcs)
        if "along" in spec and float(spec["along"]) < 0:
            # Behind the start of the affected area
            x = world.mission_start_x + float(spec["along"]) * (world.mission_end_x - world.mission_start_x)
            x = float(np.clip(x, 60.0, world.terrain.config.size_m - 60.0))
            y = float(world.terrain.corridor_centerline_y(x)) + float(spec.get("offset_m", 0.0))
            world.set_ground_station(x, y)
        else:
            xy = resolve_xy(world, spec)
            if xy is not None:
                world.set_ground_station(*xy)

    fence = scenario.geofence or {}
    if fence.get("max_agl_m") is not None:
        world.max_agl = float(fence["max_agl_m"])
    if fence.get("polygon"):
        world.set_geofence(fence["polygon"], world.max_agl)
    else:
        world.geofence = world.default_geofence(half_width=float(fence.get("half_width_m", 700.0)))
        world.geofence.max_agl = world.max_agl

    auto = scenario.tasks_auto
    if auto and int(auto.get("count", 0)) > 0:
        before = len(world.pois)
        world.populate_mission(num_pois=int(auto["count"]), rubble_count=0,
                               seed=int(auto.get("seed", scenario.seed)))
        # populate_mission numbers from 1; keep ids unique if a list follows
        for i, poi in enumerate(world.pois[before:]):
            poi.id = f"POI-{before + i + 1:03d}"
    for i, t in enumerate(scenario.tasks_list):
        xy = resolve_xy(world, t)
        if xy is None:
            raise ValueError(f"task {t} needs x/y or along")
        world.add_poi(t.get("id") or f"POI-{len(world.pois) + 1:03d}", [xy[0], xy[1]],
                      category=t.get("category", "collapsed_building"),
                      priority=int(t.get("priority", 2)),
                      release_time=float(t.get("release_s", 0.0)),
                      emergent=float(t.get("release_s", 0.0)) > 0.0,
                      data_chunks=int(t.get("data_chunks", 12)))

    outside = [p.id for p in world.pois if not world.geofence.contains(p.position[0], p.position[1])]
    if outside:
        raise ValueError(f"tasks outside the geofence: {', '.join(outside)}")

    world.time_limit_s = (float(scenario.time_limit_s)
                          if scenario.time_limit_s is not None else None)
    return world


class ScenarioDirector:
    """Plays a scenario's disturbance timeline in mission time."""

    def __init__(self, disturbances, timeline: List[dict]):
        self.disturbances = disturbances
        self.timeline = [dict(d) for d in timeline]
        self._next = 0

    def reset(self):
        self._next = 0

    @property
    def pending(self) -> int:
        return len(self.timeline) - self._next

    def update(self, mission_time: Optional[float]):
        if mission_time is None:
            return
        while self._next < len(self.timeline) and \
                float(self.timeline[self._next]["t"]) <= mission_time + 1e-9:
            entry = self.timeline[self._next]
            self._next += 1
            params = {k: v for k, v in entry.items() if k not in ("t", "type")}
            try:
                self.disturbances.apply(entry["type"], params)
            except (ValueError, KeyError) as exc:
                self.disturbances.sim.log_event(
                    "SCENARIO", f"Disturbance {entry['type']} at t={entry['t']} skipped: {exc}", {})
