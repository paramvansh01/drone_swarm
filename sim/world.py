"""
3D World model for C-DAWN simulation.

The world is backed by a high-relief mountain heightmap (see `sim.terrain`)
rather than a handful of axis-aligned boxes. Every spatial query the swarm
depends on — ground clearance, line-of-sight, RF obstruction — is resolved
against that terrain, so the RF degradation the operator sees on the GCS is
caused by the same ridgeline they can watch the drone flying past.
"""

import json
import numpy as np
from dataclasses import dataclass
from typing import List, Optional, Tuple

from .terrain import Terrain, TerrainConfig, build_terrain


# Speed of light (m/s) — used for Fresnel geometry
C_LIGHT = 299_792_458.0


@dataclass
class PointOfInterest:
    """A survey target in the mission area."""
    id: str
    position: np.ndarray            # [x, y, z] in metres
    category: str = "unknown"       # survivor, vehicle, debris, water, structure
    priority: int = 2               # 1 = highest
    surveyed: bool = False
    surveyed_by: Optional[str] = None
    surveyed_at: Optional[float] = None


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

    def intersects_segment(self, p1: np.ndarray, p2: np.ndarray,
                           n_samples: int = 16) -> bool:
        for t in np.linspace(0.0, 1.0, n_samples):
            if self.contains(p1 + t * (p2 - p1)):
                return True
        return False

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
    3D simulation world: mountain terrain + obstacles + survey targets.

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

    # -- construction -------------------------------------------------------

    def add_obstacle(self, center, size, material="rubble") -> Obstacle:
        obs = Obstacle(
            center=np.array(center, dtype=np.float64),
            size=np.array(size, dtype=np.float64),
            material=material,
        )
        self.obstacles.append(obs)
        return obs

    def add_poi(self, id: str, position, category="unknown", priority=2) -> PointOfInterest:
        poi = PointOfInterest(
            id=id,
            position=np.array(position, dtype=np.float64),
            category=category,
            priority=priority,
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
        categories = ["survivor", "vehicle", "debris", "structure", "water"]

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

    def get_unsurveyed_pois(self) -> List[PointOfInterest]:
        return [p for p in self.pois if not p.surveyed]

    def mark_poi_surveyed(self, poi_id: str, drone_id: str, sim_time: float) -> bool:
        for poi in self.pois:
            if poi.id == poi_id:
                poi.surveyed = True
                poi.surveyed_by = drone_id
                poi.surveyed_at = sim_time
                return True
        return False

    def reset_pois(self):
        for poi in self.pois:
            poi.surveyed = False
            poi.surveyed_by = None
            poi.surveyed_at = None

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
            "pois": [
                {
                    "id": p.id,
                    "position": p.position.tolist(),
                    "category": p.category,
                    "priority": p.priority,
                    "surveyed": p.surveyed,
                    "surveyed_by": p.surveyed_by,
                    "surveyed_at": p.surveyed_at,
                }
                for p in self.pois
            ],
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

        for obs_data in data.get("obstacles", []):
            world.add_obstacle(**obs_data)
        for poi_data in data.get("pois", []):
            world.add_poi(**poi_data)

        return world
