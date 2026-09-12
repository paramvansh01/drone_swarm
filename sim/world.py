"""
3D World model for C-DAWN simulation.

Provides terrain heightmap, obstacle geometry, Points of Interest (PoIs),
and line-of-sight / RF environment queries used by drones and the RF channel model.
"""

import numpy as np
from dataclasses import dataclass, field
from typing import List, Optional, Tuple
import json


@dataclass
class PointOfInterest:
    """A survey target in the mission area."""
    id: str
    position: np.ndarray  # [x, y, z] in meters
    category: str = "unknown"  # survivor, vehicle, debris, water, structure
    surveyed: bool = False
    surveyed_by: Optional[str] = None
    surveyed_at: Optional[float] = None  # simulation time


@dataclass
class Obstacle:
    """A terrain obstacle (wall, cliff, building rubble)."""
    center: np.ndarray  # [x, y, z]
    size: np.ndarray    # [wx, wy, wz] half-extents (axis-aligned bounding box)
    material: str = "concrete"  # affects RF attenuation

    def contains(self, point: np.ndarray) -> bool:
        """Check if a point is inside this obstacle's AABB."""
        diff = np.abs(point - self.center)
        return np.all(diff <= self.size)

    def intersects_segment(self, p1: np.ndarray, p2: np.ndarray, n_samples: int = 20) -> bool:
        """Check if a line segment intersects this obstacle (sampling-based)."""
        for t in np.linspace(0, 1, n_samples):
            point = p1 + t * (p2 - p1)
            if self.contains(point):
                return True
        return False

    @property
    def rf_attenuation_db(self) -> float:
        """RF attenuation in dB when signal passes through this obstacle."""
        attenuation_map = {
            "concrete": 15.0,
            "rock": 20.0,
            "rubble": 8.0,
            "metal": 30.0,
            "vegetation": 3.0,
        }
        return attenuation_map.get(self.material, 10.0)


class World:
    """
    3D simulation world.

    Manages terrain, obstacles, PoIs, and provides spatial queries
    for line-of-sight, RF propagation environment, and collision detection.
    """

    def __init__(
        self,
        bounds: Tuple[float, float, float] = (200.0, 200.0, 100.0),
        ground_level: float = 0.0,
    ):
        """
        Args:
            bounds: World dimensions [x_max, y_max, z_max] in meters.
            ground_level: Default ground elevation (m).
        """
        self.bounds = np.array(bounds, dtype=np.float64)
        self.ground_level = ground_level
        self.obstacles: List[Obstacle] = []
        self.pois: List[PointOfInterest] = []
        self.heightmap: Optional[np.ndarray] = None
        self.heightmap_resolution: float = 1.0  # meters per pixel

    def add_obstacle(self, center, size, material="concrete"):
        """Add an obstacle to the world."""
        obs = Obstacle(
            center=np.array(center, dtype=np.float64),
            size=np.array(size, dtype=np.float64),
            material=material,
        )
        self.obstacles.append(obs)
        return obs

    def add_poi(self, id: str, position, category="unknown"):
        """Add a Point of Interest to the world."""
        poi = PointOfInterest(
            id=id,
            position=np.array(position, dtype=np.float64),
            category=category,
        )
        self.pois.append(poi)
        return poi

    def generate_canyon(
        self,
        length: float = 150.0,
        width: float = 30.0,
        wall_height: float = 40.0,
        wall_thickness: float = 10.0,
        num_pois: int = 5,
        rubble_count: int = 3,
        seed: int = 42,
    ):
        """Generate a canyon-type terrain with walls, rubble, and PoIs."""
        rng = np.random.RandomState(seed)

        # Canyon walls (left and right)
        self.add_obstacle(
            center=[length / 2, -width / 2 - wall_thickness / 2, wall_height / 2],
            size=[length / 2, wall_thickness / 2, wall_height / 2],
            material="rock",
        )
        self.add_obstacle(
            center=[length / 2, width / 2 + wall_thickness / 2, wall_height / 2],
            size=[length / 2, wall_thickness / 2, wall_height / 2],
            material="rock",
        )

        # Random rubble inside canyon
        for i in range(rubble_count):
            rx = rng.uniform(20, length - 20)
            ry = rng.uniform(-width / 3, width / 3)
            rw = rng.uniform(2, 6)
            rh = rng.uniform(3, 12)
            self.add_obstacle(
                center=[rx, ry, rh / 2],
                size=[rw, rw, rh / 2],
                material="rubble",
            )

        # PoIs scattered along the canyon floor
        for i in range(num_pois):
            px = rng.uniform(15, length - 15)
            py = rng.uniform(-width / 3, width / 3)
            pz = rng.uniform(0, 2)
            categories = ["survivor", "vehicle", "debris", "structure", "water"]
            self.add_poi(
                id=f"POI-{i+1:03d}",
                position=[px, py, pz],
                category=rng.choice(categories),
            )

    def generate_urban_rubble(
        self,
        area_size: float = 100.0,
        num_buildings: int = 8,
        num_pois: int = 6,
        seed: int = 123,
    ):
        """Generate an urban rubble disaster scene."""
        rng = np.random.RandomState(seed)

        for i in range(num_buildings):
            bx = rng.uniform(10, area_size - 10)
            by = rng.uniform(10, area_size - 10)
            bw = rng.uniform(5, 15)
            bd = rng.uniform(5, 15)
            bh = rng.uniform(5, 25)
            # Some buildings are collapsed (shorter, wider rubble)
            if rng.random() > 0.5:
                bh *= 0.3
                bw *= 1.5
                bd *= 1.5
                material = "rubble"
            else:
                material = "concrete"
            self.add_obstacle(
                center=[bx, by, bh / 2],
                size=[bw / 2, bd / 2, bh / 2],
                material=material,
            )

        for i in range(num_pois):
            px = rng.uniform(5, area_size - 5)
            py = rng.uniform(5, area_size - 5)
            categories = ["survivor", "vehicle", "debris", "structure"]
            self.add_poi(
                id=f"POI-{i+1:03d}",
                position=[px, py, 0],
                category=rng.choice(categories),
            )

    def get_terrain_height(self, x: float, y: float) -> float:
        """Get terrain height at (x, y) from heightmap or default ground level."""
        if self.heightmap is not None:
            ix = int(x / self.heightmap_resolution)
            iy = int(y / self.heightmap_resolution)
            h, w = self.heightmap.shape
            ix = np.clip(ix, 0, w - 1)
            iy = np.clip(iy, 0, h - 1)
            return float(self.heightmap[iy, ix])
        return self.ground_level

    def check_line_of_sight(self, p1: np.ndarray, p2: np.ndarray) -> Tuple[bool, List[Obstacle]]:
        """
        Check line-of-sight between two points.

        Returns:
            (has_los, occluding_obstacles): True if clear LOS, plus list of
            obstacles that block the path.
        """
        occluding = []
        for obs in self.obstacles:
            if obs.intersects_segment(p1, p2):
                occluding.append(obs)
        return len(occluding) == 0, occluding

    def compute_rf_occlusion_db(self, p1: np.ndarray, p2: np.ndarray) -> float:
        """Compute total RF attenuation (dB) from obstacles between two points."""
        _, occluding = self.check_line_of_sight(p1, p2)
        return sum(obs.rf_attenuation_db for obs in occluding)

    def check_collision(self, position: np.ndarray, radius: float = 0.3) -> bool:
        """Check if a sphere at `position` with `radius` collides with any obstacle or ground."""
        if position[2] - radius < self.get_terrain_height(position[0], position[1]):
            return True
        for obs in self.obstacles:
            # Expanded AABB check
            diff = np.abs(position - obs.center)
            if np.all(diff <= obs.size + radius):
                return True
        return False

    def is_in_bounds(self, position: np.ndarray) -> bool:
        """Check if a position is within world bounds."""
        return (
            0 <= position[0] <= self.bounds[0]
            and 0 <= position[1] <= self.bounds[1]
            and 0 <= position[2] <= self.bounds[2]
        )

    def get_unsurveyed_pois(self) -> List[PointOfInterest]:
        """Return list of PoIs not yet surveyed."""
        return [p for p in self.pois if not p.surveyed]

    def mark_poi_surveyed(self, poi_id: str, drone_id: str, sim_time: float):
        """Mark a PoI as surveyed."""
        for poi in self.pois:
            if poi.id == poi_id:
                poi.surveyed = True
                poi.surveyed_by = drone_id
                poi.surveyed_at = sim_time
                return True
        return False

    def get_state(self) -> dict:
        """Serialize world state for telemetry/dashboard."""
        return {
            "bounds": self.bounds.tolist(),
            "obstacles": [
                {
                    "center": obs.center.tolist(),
                    "size": obs.size.tolist(),
                    "material": obs.material,
                }
                for obs in self.obstacles
            ],
            "pois": [
                {
                    "id": poi.id,
                    "position": poi.position.tolist(),
                    "category": poi.category,
                    "surveyed": poi.surveyed,
                    "surveyed_by": poi.surveyed_by,
                }
                for poi in self.pois
            ],
        }

    @classmethod
    def from_scenario(cls, scenario_path: str) -> "World":
        """Load a world from a JSON scenario file."""
        with open(scenario_path, "r") as f:
            data = json.load(f)

        world = cls(
            bounds=tuple(data.get("bounds", [200, 200, 100])),
            ground_level=data.get("ground_level", 0.0),
        )

        # Load terrain type
        terrain = data.get("terrain", {})
        terrain_type = terrain.get("type", "canyon")
        if terrain_type == "canyon":
            world.generate_canyon(**terrain.get("params", {}))
        elif terrain_type == "urban_rubble":
            world.generate_urban_rubble(**terrain.get("params", {}))

        # Override/add custom obstacles
        for obs_data in data.get("obstacles", []):
            world.add_obstacle(**obs_data)

        # Override/add custom PoIs
        for poi_data in data.get("pois", []):
            world.add_poi(**poi_data)

        return world
