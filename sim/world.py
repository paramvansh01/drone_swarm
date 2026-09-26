"""
3D World model for the UAV-X disaster-response simulation.

The world is backed by a high-relief mountain heightmap (see `sim.terrain`)
rather than a handful of axis-aligned boxes. Every spatial query the swarm
depends on — ground clearance, line-of-sight, RF obstruction — is resolved
against that terrain, so the RF degradation the operator sees on the GCS is
caused by the same ridgeline they can watch the drone flying past.
"""

import json
import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional, Sequence, Tuple

from .terrain import Terrain, TerrainConfig, build_terrain


# Speed of light (m/s) — used for Fresnel geometry
C_LIGHT = 299_792_458.0


# Score weight of a survey task by priority (1 = highest). The same weights
# drive tasking and the priority-weighted mission score, so the swarm is
# optimising the number it is judged on.
PRIORITY_WEIGHT = {1: 3.0, 2: 2.0, 3: 1.0}

# Disaster categories used when targets are generated automatically.
DISASTER_CATEGORIES = [
    "collapsed_building", "trapped_survivors", "landslide_debris",
    "blocked_road", "flooded_area", "damaged_bridge",
]


@dataclass
class PointOfInterest:
    """A survey task in the affected area."""
    id: str
    position: np.ndarray            # [x, y, z] in metres
    category: str = "unknown"       # collapsed_building, trapped_survivors, ...
    priority: int = 2               # 1 = highest
    surveyed: bool = False
    surveyed_by: Optional[str] = None
    surveyed_at: Optional[float] = None
    # Mission time at which the task becomes known. Tasks with a release time
    # after launch are the "newly emerging" ones the swarm must reprioritise for.
    release_time: float = 0.0
    emergent: bool = False
    region: Optional[str] = None    # group id when the task is part of a region
    # Survey data is only useful once it reaches the GCS. `delivered` flips when
    # every chunk of this target's imagery/situational data has arrived there.
    data_chunks: int = 12
    delivered: bool = False
    delivered_at: Optional[float] = None

    @property
    def weight(self) -> float:
        return PRIORITY_WEIGHT.get(int(self.priority), 1.0)

    def released(self, sim_time: float) -> bool:
        return sim_time + 1e-9 >= self.release_time

    def get_state(self) -> dict:
        return {
            "id": self.id,
            "position": self.position.tolist(),
            "category": self.category,
            "priority": self.priority,
            "surveyed": self.surveyed,
            "surveyed_by": self.surveyed_by,
            "surveyed_at": self.surveyed_at,
            "release_time": self.release_time,
            "emergent": self.emergent,
            "region": self.region,
            "delivered": self.delivered,
            "delivered_at": self.delivered_at,
        }


@dataclass
class GroundStation:
    """
    The Ground Control Station, set up outside the affected area.

    It is a fixed ground node, not an aircraft: it cannot be shot down or run
    out of battery, it is where every packet is going, and it is where the
    aircraft land to swap batteries. `position` is the antenna on its mast.
    """
    id: str
    position: np.ndarray
    mast_m: float = 10.0
    pads: List[np.ndarray] = field(default_factory=list)

    def pad_for(self, index: int) -> np.ndarray:
        if not self.pads:
            return self.position.copy()
        return self.pads[index % len(self.pads)].copy()

    def get_state(self) -> dict:
        return {
            "id": self.id,
            "position": self.position.tolist(),
            "mast_m": self.mast_m,
            "pads": [p.tolist() for p in self.pads],
        }


class Geofence:
    """
    Horizontal keep-in polygon plus an above-ground-level ceiling.

    Guidance projects every setpoint inside it with a margin, and the metrics
    layer counts any excursion of the true position as a violation.
    """

    def __init__(self, polygon: Sequence[Sequence[float]], max_agl: float = 400.0):
        poly = np.asarray(polygon, dtype=np.float64)
        if poly.ndim != 2 or poly.shape[0] < 3 or poly.shape[1] != 2:
            raise ValueError("geofence polygon needs at least three [x, y] vertices")
        # Store counter-clockwise so the left normal of every edge points inward
        area = 0.5 * float(np.sum(poly[:, 0] * np.roll(poly[:, 1], -1)
                                  - np.roll(poly[:, 0], -1) * poly[:, 1]))
        if area < 0:
            poly = poly[::-1].copy()
        self.polygon = poly
        self.max_agl = float(max_agl)
        self.centroid = poly.mean(axis=0)

    def contains(self, x: float, y: float) -> bool:
        """Even-odd ray casting."""
        px, py = self.polygon[:, 0], self.polygon[:, 1]
        qx, qy = np.roll(px, -1), np.roll(py, -1)
        crosses = ((py > y) != (qy > y))
        with np.errstate(divide="ignore", invalid="ignore"):
            x_at = px + (y - py) * (qx - px) / (qy - py)
        return bool(np.count_nonzero(crosses & (x < x_at)) % 2 == 1)

    def _nearest_edge(self, x: float, y: float):
        a = self.polygon
        b = np.roll(a, -1, axis=0)
        ab = b - a
        t = np.clip(((x - a[:, 0]) * ab[:, 0] + (y - a[:, 1]) * ab[:, 1])
                    / np.maximum((ab ** 2).sum(axis=1), 1e-9), 0.0, 1.0)
        q = a + ab * t[:, None]
        d = np.hypot(q[:, 0] - x, q[:, 1] - y)
        i = int(np.argmin(d))
        return float(d[i]), q[i], ab[i]

    def distance_to_boundary(self, x: float, y: float) -> float:
        return self._nearest_edge(x, y)[0]

    def project_inside(self, x: float, y: float, margin: float = 30.0) -> Tuple[float, float]:
        """Nearest point at least `margin` inside the fence (identity if already so)."""
        dist, q, edge = self._nearest_edge(x, y)
        if self.contains(x, y) and dist >= margin:
            return float(x), float(y)
        length = float(np.hypot(edge[0], edge[1])) or 1.0
        inward = np.array([-edge[1], edge[0]]) / length
        p = q + inward * margin
        # Concave corners: step toward the centroid until the point is inside
        for _ in range(12):
            if self.contains(p[0], p[1]) and self.distance_to_boundary(p[0], p[1]) >= margin * 0.5:
                break
            p = p + (self.centroid - p) * 0.25
        return float(p[0]), float(p[1])

    def get_state(self) -> dict:
        return {"polygon": self.polygon.tolist(), "max_agl": self.max_agl}


@dataclass
class Obstacle:
    """
    A discrete obstacle sitting on the terrain (rubble field, wreckage,
    structure). Terrain itself is handled by the heightmap, not by these.
    """
    center: np.ndarray              # [x, y, z]
    size: np.ndarray                # half-extents [wx, wy, wz]
    material: str = "rubble"

    def contains(self, point: np.ndarray) -> bool:
        return bool(np.all(np.abs(point - self.center) <= self.size))

    def intersects_segment(self, p1: np.ndarray, p2: np.ndarray) -> bool:
        """Exact segment/box test (slab method)."""
        p1 = np.asarray(p1, dtype=np.float64)
        d = np.asarray(p2, dtype=np.float64) - p1
        lo = self.center - self.size - p1
        hi = self.center + self.size - p1
        t0, t1 = 0.0, 1.0
        for axis in range(3):
            if abs(d[axis]) < 1e-12:
                if lo[axis] > 0.0 or hi[axis] < 0.0:
                    return False
                continue
            a, b = lo[axis] / d[axis], hi[axis] / d[axis]
            if a > b:
                a, b = b, a
            t0, t1 = max(t0, a), min(t1, b)
            if t0 > t1:
                return False
        return True

    @property
    def rf_attenuation_db(self) -> float:
        return {
            "concrete": 15.0,
            "rock": 20.0,
            "rubble": 8.0,
            "metal": 30.0,
            "vegetation": 3.0,
        }.get(self.material, 10.0)


class World:
    """
    3D simulation world: mountain terrain + obstacles + survey targets, the
    ground station outside the affected area, and the geofence.

    Provides the spatial queries used by the flight controllers, the RF
    channel model and the causal diagnostics layer.
    """

    def __init__(
        self,
        terrain: Optional[Terrain] = None,
        frequency_mhz: float = 900.0,
    ):
        self.terrain = terrain or build_terrain()
        self.frequency_mhz = frequency_mhz
        self.wavelength_m = C_LIGHT / (frequency_mhz * 1e6)

        self.obstacles: List[Obstacle] = []
        self.pois: List[PointOfInterest] = []

        # Mission corridor extent along +x, relative to the terrain size so it
        # works for real theatres of any extent as well as the synthetic valley
        size = self.terrain.config.size_m
        self.mission_start_x = size * 0.065
        self.mission_end_x = size * 0.88

        self.bounds = np.array([size, size, float(self.terrain.heightmap.max()) + 1_000.0],
                               dtype=np.float64)

        # Geofence ceiling/floor relative to ground (metres AGL)
        self.min_agl = 12.0
        self.max_agl = 520.0

        self.gcs: GroundStation = self.default_ground_station()
        self.geofence: Geofence = self.default_geofence()
        # Mission clock limit (s); None = no limit
        self.time_limit_s: Optional[float] = None

    # -- ground station and geofence ------------------------------------------

    GCS_MAST_M = 10.0

    def default_ground_station(self, x: float = None, y: float = None,
                               pads: int = 12) -> GroundStation:
        """
        GCS at the valley mouth, short of the affected area, with a row of
        landing/charging pads beside it.
        """
        size = self.terrain.config.size_m
        if x is None:
            x = size * 0.035
        if y is None:
            y = float(self.terrain.corridor_centerline_y(x))
        ground = self.terrain.height_at(x, y)
        pad_list = []
        for i in range(pads):
            px = x + 25.0 + 16.0 * (i // 2)
            py = y + (-10.0 if i % 2 == 0 else 10.0)
            pad_list.append(np.array([px, py, self.terrain.height_at(px, py)]))
        return GroundStation(id="GCS", position=np.array([x, y, ground + self.GCS_MAST_M]),
                             mast_m=self.GCS_MAST_M, pads=pad_list)

    def default_geofence(self, half_width: float = 700.0) -> Geofence:
        """
        A corridor-shaped operating area: the valley from just behind the GCS
        to beyond the last target, a fixed half-width either side of the
        centreline, kept inside the map.
        """
        size = self.terrain.config.size_m
        inset = 40.0
        x0 = max(inset, float(self.gcs.position[0]) - 150.0)
        x1 = min(size - inset, self.mission_end_x + 350.0)
        xs = np.linspace(x0, x1, 24)
        ys = np.array([float(self.terrain.corridor_centerline_y(x)) for x in xs])
        upper = np.column_stack([xs, np.clip(ys + half_width, inset, size - inset)])
        lower = np.column_stack([xs, np.clip(ys - half_width, inset, size - inset)])
        return Geofence(np.vstack([lower, upper[::-1]]), max_agl=self.max_agl)

    def set_ground_station(self, x: float, y: float):
        self.gcs = self.default_ground_station(x, y, pads=len(self.gcs.pads) or 12)

    def set_geofence(self, polygon, max_agl: float = None):
        self.geofence = Geofence(polygon, max_agl if max_agl is not None else self.max_agl)
        self.max_agl = self.geofence.max_agl

    # -- construction -------------------------------------------------------

    def add_obstacle(self, center, size, material="rubble") -> Obstacle:
        obs = Obstacle(
            center=np.array(center, dtype=np.float64),
            size=np.array(size, dtype=np.float64),
            material=material,
        )
        self.obstacles.append(obs)
        return obs

    def add_poi(self, id: str, position, category="unknown", priority=2,
                release_time: float = 0.0, emergent: bool = False,
                region: Optional[str] = None, data_chunks: int = 12) -> PointOfInterest:
        position = np.array(position, dtype=np.float64)
        if position.shape[0] == 2:
            position = np.array([position[0], position[1],
                                 self.terrain.height_at(position[0], position[1]) + 1.5])
        poi = PointOfInterest(
            id=id,
            position=position,
            category=category,
            priority=int(priority),
            release_time=float(release_time),
            emergent=bool(emergent),
            region=region,
            data_chunks=int(data_chunks),
        )
        self.pois.append(poi)
        return poi

    def populate_mission(
        self,
        num_pois: int = 6,
        rubble_count: int = 10,
        seed: int = 42,
    ):
        """
        Scatter survey targets along the valley corridor and drop rubble
        fields on the valley floor.

        PoIs are placed on the terrain surface inside the corridor, spaced
        along the mission axis so the swarm must actually traverse the valley
        to complete the survey.
        """
        rng = np.random.RandomState(seed)
        categories = DISASTER_CATEGORIES

        span = self.mission_end_x - self.mission_start_x
        for i in range(num_pois):
            # Even spacing along the axis with a little jitter
            frac = (i + 0.5) / num_pois
            px = self.mission_start_x + span * frac + rng.uniform(-90, 90)
            cy = float(self.terrain.corridor_centerline_y(px))
            py = cy + rng.uniform(-120, 120)
            pz = self.terrain.height_at(px, py) + 1.5

            self.add_poi(
                id=f"POI-{i + 1:03d}",
                position=[px, py, pz],
                category=str(rng.choice(categories)),
                priority=int(rng.randint(1, 4)),
            )

        for _ in range(rubble_count):
            rx = rng.uniform(self.mission_start_x, self.mission_end_x)
            cy = float(self.terrain.corridor_centerline_y(rx))
            ry = cy + rng.uniform(-150, 150)
            rw = rng.uniform(6, 18)
            rh = rng.uniform(4, 16)
            rz = self.terrain.height_at(rx, ry)
            self.add_obstacle(
                center=[rx, ry, rz + rh / 2],
                size=[rw, rw, rh / 2],
                material="rubble" if rng.random() > 0.3 else "concrete",
            )

    # -- terrain queries ----------------------------------------------------

    def get_terrain_height(self, x: float, y: float) -> float:
        return self.terrain.height_at(x, y)

    def agl(self, position: np.ndarray) -> float:
        """Height above ground level."""
        return self.terrain.clearance(position)

    def check_collision(self, position: np.ndarray, radius: float = 0.6) -> bool:
        """True if the drone would strike terrain or an obstacle."""
        if self.agl(position) <= radius:
            return True
        for obs in self.obstacles:
            if np.all(np.abs(position - obs.center) <= obs.size + radius):
                return True
        return False

    def is_in_bounds(self, position: np.ndarray) -> bool:
        x, y, z = position
        size = self.terrain.config.size_m
        if not (0 <= x <= size and 0 <= y <= size):
            return False
        agl = self.agl(position)
        return self.min_agl * 0.5 <= agl <= self.max_agl * 1.5

    def safe_altitude_at(self, x: float, y: float, clearance: float = 90.0) -> float:
        """A conservative transit altitude above the local terrain."""
        return self.terrain.height_at(x, y) + clearance

    # -- RF propagation environment ----------------------------------------

    def check_line_of_sight(self, p1: np.ndarray, p2: np.ndarray) -> Tuple[bool, List[Obstacle]]:
        """
        Line-of-sight test against both terrain and discrete obstacles.

        Returns (has_los, blocking_obstacles).
        """
        occluding = [o for o in self.obstacles if o.intersects_segment(p1, p2)]
        terrain_clear = self.terrain.has_line_of_sight(p1, p2)
        return (terrain_clear and not occluding), occluding

    def fresnel_radius(self, d1: float, d2: float) -> float:
        """
        First Fresnel zone radius at a point d1 from the transmitter and
        d2 from the receiver.

            r = sqrt(lambda * d1 * d2 / (d1 + d2))
        """
        total = d1 + d2
        if total <= 1e-6:
            return 0.0
        return float(np.sqrt(self.wavelength_m * d1 * d2 / total))

    def compute_rf_occlusion_db(self, p1: np.ndarray, p2: np.ndarray) -> float:
        """
        Terrain obstruction loss in dB.

        Uses the single knife-edge diffraction model (ITU-R P.526): the
        dominant terrain obstruction along the path is treated as a knife
        edge, and the diffraction parameter

            v = h * sqrt(2 (d1 + d2) / (lambda * d1 * d2))

        is mapped to a loss via the standard Lee approximation. `h` is the
        obstruction height *above* the straight radio path, so a ridge that
        merely intrudes into the Fresnel zone (negative h, but small) still
        costs signal — which is the realistic behaviour that makes altitude
        interventions meaningful.
        """
        p1 = np.asarray(p1, dtype=np.float64)
        p2 = np.asarray(p2, dtype=np.float64)

        dists, ground, line_z = self.terrain.terrain_profile(p1, p2, samples=48)
        total_d = float(dists[-1])
        if total_d < 1.0:
            return 0.0

        # Obstruction height above the radio path at each sample
        h = ground - line_z

        # Fresnel-normalised clearance: find the worst intrusion
        d1 = np.maximum(dists, 1.0)
        d2 = np.maximum(total_d - dists, 1.0)
        r1 = np.sqrt(self.wavelength_m * d1 * d2 / total_d)

        # v = h * sqrt(2/(lambda) * (d1+d2)/(d1*d2)) == h * sqrt(2) / r1
        v = h * np.sqrt(2.0) / np.maximum(r1, 1e-6)

        # Interior samples only — endpoints are the antennas themselves
        v_interior = v[2:-2] if len(v) > 4 else v
        v_max = float(np.max(v_interior)) if len(v_interior) else -10.0

        loss_db = self._knife_edge_loss_db(v_max)

        # Discrete obstacles add their own attenuation on top
        for obs in self.obstacles:
            if obs.intersects_segment(p1, p2):
                loss_db += obs.rf_attenuation_db

        return float(np.clip(loss_db, 0.0, 120.0))

    @staticmethod
    def _knife_edge_loss_db(v: float) -> float:
        """
        ITU-R P.526 single knife-edge diffraction loss J(v), Lee's
        piecewise approximation.

        v < -0.78 means the Fresnel zone is essentially clear -> no loss.
        """
        if v < -0.78:
            return 0.0
        return float(6.9 + 20.0 * np.log10(np.sqrt((v - 0.1) ** 2 + 1.0) + v - 0.1))

    def path_obstruction_profile(self, p1: np.ndarray, p2: np.ndarray,
                                 samples: int = 32) -> dict:
        """
        Full terrain profile for a link, for display on the GCS.

        This is what lets an operator *see* why a link is failing rather than
        being told a number.
        """
        dists, ground, line_z = self.terrain.terrain_profile(p1, p2, samples)
        total_d = float(dists[-1]) if len(dists) else 0.0
        d1 = np.maximum(dists, 1.0)
        d2 = np.maximum(total_d - dists, 1.0)
        fresnel = np.sqrt(self.wavelength_m * d1 * d2 / max(total_d, 1.0))

        return {
            "distance_m": dists.tolist(),
            "terrain_m": ground.tolist(),
            "path_m": line_z.tolist(),
            "fresnel_lower_m": (line_z - fresnel).tolist(),
            "total_distance_m": total_d,
            "obstruction_db": self.compute_rf_occlusion_db(p1, p2),
        }

    # -- mission state ------------------------------------------------------

    def get_unsurveyed_pois(self, sim_time: Optional[float] = None) -> List[PointOfInterest]:
        """Unsurveyed tasks; with `sim_time`, only those already released."""
        return [p for p in self.pois if not p.surveyed
                and (sim_time is None or p.released(sim_time))]

    def released_pois(self, sim_time: float) -> List[PointOfInterest]:
        return [p for p in self.pois if p.released(sim_time)]

    def mark_poi_surveyed(self, poi_id: str, drone_id: str, sim_time: float) -> bool:
        for poi in self.pois:
            if poi.id == poi_id:
                poi.surveyed = True
                poi.surveyed_by = drone_id
                poi.surveyed_at = sim_time
                return True
        return False

    def mark_poi_delivered(self, poi_id: str, sim_time: float) -> bool:
        for poi in self.pois:
            if poi.id == poi_id and not poi.delivered:
                poi.delivered = True
                poi.delivered_at = sim_time
                return True
        return False

    def reset_pois(self):
        for poi in self.pois:
            poi.surveyed = False
            poi.surveyed_by = None
            poi.surveyed_at = None
            poi.delivered = False
            poi.delivered_at = None

    # -- serialisation ------------------------------------------------------

    def get_state(self) -> dict:
        """World geometry for the dashboard (terrain sent separately, once)."""
        return {
            "bounds": self.bounds.tolist(),
            "terrain": self.terrain.get_metadata(),
            "mission_axis": {
                "start_x": self.mission_start_x,
                "end_x": self.mission_end_x,
                "centerline": [
                    [float(x), float(self.terrain.corridor_centerline_y(x))]
                    for x in np.linspace(0.0, self.terrain.config.size_m, 64)
                ],
            },
            "obstacles": [
                {
                    "center": o.center.tolist(),
                    "size": o.size.tolist(),
                    "material": o.material,
                }
                for o in self.obstacles
            ],
            "pois": [p.get_state() for p in self.pois if p.release_time <= 0.0],
            "gcs": self.gcs.get_state(),
            "geofence": self.geofence.get_state(),
            "time_limit_s": self.time_limit_s,
        }

    @classmethod
    def from_theatre(cls, theatre_id: str, num_pois: int = 6,
                     rubble_count: int = 6, seed: int = 42) -> "World":
        """A world built on a real-terrain pack (or the synthetic valley)."""
        from .terrain import build_terrain
        if not theatre_id or theatre_id == "synthetic":
            terrain = build_terrain()
        else:
            terrain = Terrain(TerrainConfig(pack=theatre_id))
        world = cls(terrain=terrain)
        world.populate_mission(num_pois=num_pois, rubble_count=rubble_count, seed=seed)
        world.geofence = world.default_geofence()
        return world

    @classmethod
    def from_scenario(cls, scenario_path: str) -> "World":
        """Load a world from a JSON scenario file."""
        with open(scenario_path, "r") as f:
            data = json.load(f)

        terrain_cfg = data.get("terrain", {})
        config = TerrainConfig(**{
            k: v for k, v in terrain_cfg.items()
            if k in TerrainConfig.__dataclass_fields__
        })

        world = cls(
            terrain=Terrain(config),
            frequency_mhz=data.get("frequency_mhz", 900.0),
        )

        mission = data.get("mission", {})
        world.mission_start_x = mission.get("start_x", world.mission_start_x)
        world.mission_end_x = mission.get("end_x", world.mission_end_x)

        world.populate_mission(
            num_pois=mission.get("num_pois", 6),
            rubble_count=mission.get("rubble_count", 10),
            seed=mission.get("seed", 42),
        )
        world.geofence = world.default_geofence()

        for obs_data in data.get("obstacles", []):
            world.add_obstacle(**obs_data)
        for poi_data in data.get("pois", []):
            world.add_poi(**poi_data)

        return world
