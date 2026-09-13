"""
High-relief mountain terrain generation for C-DAWN.

Generates a deterministic heightmap using ridged multifractal noise with
domain warping, then carves a navigable valley corridor through it. The
same heightmap is used by:

  - the RF channel (terrain occlusion / knife-edge diffraction),
  - the flight dynamics (ground collision, terrain-following),
  - the Three.js visualisation (streamed as a quantised uint16 grid).

Because the frontend renders the *exact* array the physics uses, what the
operator sees on the GCS is what the swarm actually flies through.
"""

from __future__ import annotations

import base64
import hashlib
import numpy as np
from dataclasses import dataclass
from typing import Tuple


# --------------------------------------------------------------------------
# Deterministic gradient noise
# --------------------------------------------------------------------------

class PerlinNoise2D:
    """
    Classic 2D gradient (Perlin) noise with a seeded permutation table.

    Vectorised over numpy arrays so a 1025x1025 heightmap with 8 octaves
    builds in well under a second.
    """

    def __init__(self, seed: int = 42):
        rng = np.random.RandomState(seed)
        perm = rng.permutation(256)
        self.perm = np.concatenate([perm, perm]).astype(np.int32)

        # 8 unit gradient directions — cheap and artefact-free at this scale
        angles = np.arange(8) * (np.pi / 4.0)
        self.gradients = np.stack([np.cos(angles), np.sin(angles)], axis=1)

    @staticmethod
    def _fade(t: np.ndarray) -> np.ndarray:
        """Quintic interpolant 6t^5 - 15t^4 + 10t^3 (C2 continuous)."""
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)

    def _grad_dot(self, ix: np.ndarray, iy: np.ndarray,
                  dx: np.ndarray, dy: np.ndarray) -> np.ndarray:
        idx = self.perm[(self.perm[ix & 255] + (iy & 255)) & 255] & 7
        g = self.gradients[idx]
        return g[..., 0] * dx + g[..., 1] * dy

    def sample(self, x: np.ndarray, y: np.ndarray) -> np.ndarray:
        """Sample noise in [-1, 1] at float coordinates."""
        x0 = np.floor(x).astype(np.int32)
        y0 = np.floor(y).astype(np.int32)
        x1, y1 = x0 + 1, y0 + 1

        fx, fy = x - x0, y - y0
        u, v = self._fade(fx), self._fade(fy)

        n00 = self._grad_dot(x0, y0, fx, fy)
        n10 = self._grad_dot(x1, y0, fx - 1.0, fy)
        n01 = self._grad_dot(x0, y1, fx, fy - 1.0)
        n11 = self._grad_dot(x1, y1, fx - 1.0, fy - 1.0)

        nx0 = n00 + u * (n10 - n00)
        nx1 = n01 + u * (n11 - n01)
        return nx0 + v * (nx1 - nx0)


def fbm(noise: PerlinNoise2D, x: np.ndarray, y: np.ndarray,
        octaves: int = 8, lacunarity: float = 2.0,
        gain: float = 0.5) -> np.ndarray:
    """Standard fractional Brownian motion sum."""
    total = np.zeros_like(x)
    amplitude, frequency, norm = 1.0, 1.0, 0.0
    for _ in range(octaves):
        total += amplitude * noise.sample(x * frequency, y * frequency)
        norm += amplitude
        amplitude *= gain
        frequency *= lacunarity
    return total / max(norm, 1e-9)


def ridged_multifractal(noise: PerlinNoise2D, x: np.ndarray, y: np.ndarray,
                        octaves: int = 8, lacunarity: float = 2.0,
                        gain: float = 0.5, sharpness: float = 0.92) -> np.ndarray:
    """
    Ridged multifractal noise in [0, 1].

    Each octave is folded (1 - |n|) to produce sharp crests, and weighted by
    the previous octave so ridgelines stay coherent instead of dissolving
    into uniform bumpiness. This is what gives the terrain genuine alpine
    arêtes rather than rolling hills.
    """
    total = np.zeros_like(x)
    amplitude, frequency, norm = 1.0, 1.0, 0.0
    weight = np.ones_like(x)

    for _ in range(octaves):
        n = noise.sample(x * frequency, y * frequency)
        n = 1.0 - np.abs(n)
        n = n ** 2.0                      # sharpen the crest
        n = n * weight                    # couple to the previous octave
        weight = np.clip(n * sharpness, 0.0, 1.0)

        total += amplitude * n
        norm += amplitude
        amplitude *= gain
        frequency *= lacunarity

    return np.clip(total / max(norm, 1e-9), 0.0, 1.0)


# --------------------------------------------------------------------------
# Terrain
# --------------------------------------------------------------------------

@dataclass
class TerrainConfig:
    """Parameters describing a mountain massif and the valley cut through it."""
    size_m: float = 4096.0          # square extent of the terrain (metres)
    resolution: int = 513           # grid samples per side (2^n + 1)
    seed: int = 4207

    valley_floor_m: float = 620.0   # elevation of the navigable valley floor
    peak_height_m: float = 1850.0   # maximum ridge elevation
    snow_line_m: float = 1350.0     # informational: used by the renderer

    # Valley corridor: a curved channel carved along +X that the swarm flies
    corridor_half_width_m: float = 190.0
    corridor_wall_falloff_m: float = 340.0
    corridor_amplitude_m: float = 380.0   # lateral meander of the corridor
    corridor_wavelength_m: float = 2600.0

    warp_strength: float = 0.34     # domain warping — breaks up noise grid alignment
    base_frequency: float = 2.6     # ridges per terrain width
    octaves: int = 9

    # Real-world terrain: when set, the heightmap is loaded from
    # terrain_packs/<pack>/ instead of being generated.
    pack: str = ""


class Terrain:
    """
    A heightmap-backed mountain environment.

    Coordinate convention (right-handed, Z up):
        x -> east   [0, size_m]
        y -> north  [0, size_m]
        z -> elevation above mean sea level (metres)

    The mission corridor runs broadly west -> east near y = size_m / 2.
    """

    def __init__(self, config: TerrainConfig | None = None):
        self.config = config or TerrainConfig()
        self.pack_meta: dict = {}
        self._corridor_x = None
        self._corridor_y = None

        if self.config.pack:
            self.heightmap = self._load_pack(self.config.pack)
        else:
            self.heightmap = self._generate()

        self._min_h = float(self.heightmap.min())
        self._max_h = float(self.heightmap.max())

        # Metres per grid cell
        self.cell_size = self.config.size_m / (self.config.resolution - 1)

        if self.config.pack:
            self._derive_corridor()

    # -- generation --------------------------------------------------------

    def corridor_centerline_y(self, x: np.ndarray | float) -> np.ndarray | float:
        """
        Lateral position of the valley centreline at a given easting.

        The corridor meanders so the swarm must actually negotiate the
        terrain rather than fly a straight line down a trench.
        """
        if self._corridor_x is not None:
            return np.interp(np.asarray(x, dtype=np.float64),
                             self._corridor_x, self._corridor_y)

        c = self.config
        t = np.asarray(x, dtype=np.float64) / c.corridor_wavelength_m
        meander = (np.sin(t * 2.0 * np.pi) * 0.7
                   + np.sin(t * 2.0 * np.pi * 2.3 + 1.1) * 0.3)
        return c.size_m * 0.5 + meander * c.corridor_amplitude_m

    def _generate(self) -> np.ndarray:
        c = self.config
        axis = np.linspace(0.0, c.size_m, c.resolution)
        gx, gy = np.meshgrid(axis, axis)   # gx[row, col] = easting, gy = northing
        return self._procedural(gx, gy)

    def procedural_context(self, scale: int = 7, resolution: int = 513):
        """
        Surroundings for the synthetic valley: the same noise field evaluated
        over a square `scale` times larger, centred on the playable map, so the
        range continues to the horizon instead of ending at a cliff edge.
        Render-only — the simulation never leaves the inner map.
        """
        c = self.config
        extent = c.size_m * scale
        origin = -(extent - c.size_m) / 2.0
        axis = np.linspace(origin, origin + extent, resolution)
        gx, gy = np.meshgrid(axis, axis)
        return self._procedural(gx, gy), extent, origin

    def _procedural(self, gx: np.ndarray, gy: np.ndarray) -> np.ndarray:
        c = self.config

        # Normalised noise coordinates
        nx = gx / c.size_m * c.base_frequency
        ny = gy / c.size_m * c.base_frequency

        warp_noise = PerlinNoise2D(c.seed + 977)
        ridge_noise = PerlinNoise2D(c.seed)
        detail_noise = PerlinNoise2D(c.seed + 5501)

        # Domain warp: offset the sample position by a low-frequency field so
        # ridgelines curve organically instead of following the noise lattice.
        wx = fbm(warp_noise, nx * 0.5, ny * 0.5, octaves=4)
        wy = fbm(warp_noise, nx * 0.5 + 31.7, ny * 0.5 - 12.3, octaves=4)
        nx_w = nx + wx * c.warp_strength
        ny_w = ny + wy * c.warp_strength

        # Primary massif
        ridges = ridged_multifractal(ridge_noise, nx_w, ny_w, octaves=c.octaves)

        # A broad continental tilt so the massif has an overall shape
        massif = fbm(ridge_noise, nx_w * 0.35, ny_w * 0.35, octaves=3)
        massif = (massif + 1.0) * 0.5

        combined = np.clip(ridges * 0.74 + massif * 0.26, 0.0, 1.0)
        combined = combined ** 1.35      # deepen the valleys

        relief = c.peak_height_m - c.valley_floor_m
        height = c.valley_floor_m + combined * relief

        # Fine detail: scree and rock texture, scaled by slope so flat valley
        # floors stay flat and high faces get broken up.
        detail = fbm(detail_noise, nx * 14.0, ny * 14.0, octaves=4)
        height += detail * 22.0 * combined

        # -- carve the mission corridor ------------------------------------
        center_y = self.corridor_centerline_y(gx)
        lateral = np.abs(gy - center_y)

        # 1.0 inside the corridor, smoothly -> 0.0 by the falloff distance
        t = np.clip(
            (lateral - c.corridor_half_width_m) / c.corridor_wall_falloff_m,
            0.0, 1.0,
        )
        carve = 1.0 - (t * t * (3.0 - 2.0 * t))    # smoothstep

        # Floor rises gently eastward so the swarm climbs as it advances
        floor = c.valley_floor_m + (gx / c.size_m) * 130.0
        # Keep a little roughness on the valley bed — it is rubble, not tarmac
        floor = floor + fbm(detail_noise, nx * 7.0, ny * 7.0, octaves=3) * 12.0

        height = height * (1.0 - carve) + floor * carve

        return height.astype(np.float32)

    # -- real-world terrain ---------------------------------------------------

    def _load_pack(self, pack_id: str) -> np.ndarray:
        """Load a heightmap built by tools/build_terrain_packs.py."""
        import json
        from pathlib import Path

        folder = Path(__file__).resolve().parent.parent / "terrain_packs" / pack_id
        heights = np.load(folder / "heightmap.npy").astype(np.float32)
        self.pack_meta = json.loads((folder / "meta.json").read_text())

        c = self.config
        c.size_m = float(self.pack_meta.get("size_m", c.size_m))
        c.resolution = int(heights.shape[0])
        c.snow_line_m = float(self.pack_meta.get("snow_line_m", c.snow_line_m))
        c.valley_floor_m = float(heights.min())
        c.peak_height_m = float(heights.max())
        # Prefer the locally built high-resolution imagery when present
        hr = folder / "imagery_hr.jpg"
        self.imagery_path = hr if hr.exists() else folder / "imagery.jpg"
        context_hr = folder / "context_imagery_hr.jpg"
        self.context_imagery_path = (context_hr if context_hr.exists()
                                     else folder / "context_imagery.jpg")
        context_file = folder / "context_heightmap.npy"
        self.context_heights = (np.load(context_file).astype(np.float32)
                                if context_file.exists() else None)
        self.context_extent = float(self.pack_meta.get("context_size_m", 0.0))
        return heights

    def _derive_corridor(self, margin_frac: float = 0.03):
        """
        Find the mission corridor in real terrain: the cheapest west->east path
        along low ground, by dynamic programming over heightmap columns.

        Synthetic terrain has its valley carved in on purpose; a real valley
        has to be found. Each step east may drift a few cells north or south at
        a small cost, so the path follows the valley floor instead of
        zig-zagging between local dips. The result is smoothed and becomes the
        centreline that routing, survey tasking and relay placement all use.
        """
        step = 4
        h = self.heightmap[::step, ::step].astype(np.float64)
        h = (h - h.min()) / max(float(np.ptp(h)), 1.0)
        rows, cols = h.shape

        # Keep the path off the very edge of the map
        edge = max(int(rows * margin_frac), 1)
        h[:edge, :] += 5.0
        h[-edge:, :] += 5.0

        cost = h[:, 0].copy()
        back = np.zeros((rows, cols), dtype=np.int64)
        shifts = range(-2, 3)
        for col in range(1, cols):
            best = np.full(rows, np.inf)
            arg = np.zeros(rows, dtype=np.int64)
            for shift in shifts:
                src = np.arange(rows) - shift
                valid = (src >= 0) & (src < rows)
                cand = np.full(rows, np.inf)
                cand[valid] = cost[src[valid]] + 0.035 * abs(shift)
                better = cand < best
                best[better] = cand[better]
                arg[better] = src[better]
            cost = best + h[:, col]
            back[:, col] = arg

        path = np.zeros(cols, dtype=np.int64)
        path[-1] = int(np.argmin(cost))
        for col in range(cols - 1, 0, -1):
            path[col - 1] = back[path[col], col]

        # Smooth, then convert to world metres
        kernel = np.ones(7) / 7.0
        padded = np.pad(path.astype(np.float64), 3, mode="edge")
        smooth = np.convolve(padded, kernel, mode="valid")

        self._corridor_x = np.arange(cols) * step * self.cell_size
        self._corridor_y = smooth * step * self.cell_size

    def get_pack_imagery_b64(self):
        """Base64 JPEG of the draped satellite imagery, or None for synthetic."""
        import base64
        path = getattr(self, "imagery_path", None)
        if not path or not path.exists():
            return None
        return base64.b64encode(path.read_bytes()).decode("ascii")

    # -- queries -----------------------------------------------------------

    def height_at(self, x: float, y: float) -> float:
        """Bilinearly interpolated terrain elevation at a world position."""
        c = self.config
        n = c.resolution

        fx = np.clip(x / self.cell_size, 0.0, n - 1.001)
        fy = np.clip(y / self.cell_size, 0.0, n - 1.001)

        x0, y0 = int(fx), int(fy)
        tx, ty = fx - x0, fy - y0

        h00 = self.heightmap[y0, x0]
        h10 = self.heightmap[y0, x0 + 1]
        h01 = self.heightmap[y0 + 1, x0]
        h11 = self.heightmap[y0 + 1, x0 + 1]

        return float((h00 * (1 - tx) + h10 * tx) * (1 - ty)
                     + (h01 * (1 - tx) + h11 * tx) * ty)

    def height_at_array(self, x: np.ndarray, y: np.ndarray) -> np.ndarray:
        """Vectorised variant of :meth:`height_at` for batched queries."""
        c = self.config
        n = c.resolution

        fx = np.clip(x / self.cell_size, 0.0, n - 1.001)
        fy = np.clip(y / self.cell_size, 0.0, n - 1.001)

        x0 = fx.astype(np.int32)
        y0 = fy.astype(np.int32)
        tx, ty = fx - x0, fy - y0

        h00 = self.heightmap[y0, x0]
        h10 = self.heightmap[y0, x0 + 1]
        h01 = self.heightmap[y0 + 1, x0]
        h11 = self.heightmap[y0 + 1, x0 + 1]

        return ((h00 * (1 - tx) + h10 * tx) * (1 - ty)
                + (h01 * (1 - tx) + h11 * tx) * ty)

    def normal_at(self, x: float, y: float) -> np.ndarray:
        """Surface normal via central differences — used for slope queries."""
        d = self.cell_size
        hl = self.height_at(x - d, y)
        hr = self.height_at(x + d, y)
        hd = self.height_at(x, y - d)
        hu = self.height_at(x, y + d)

        normal = np.array([(hl - hr) / (2 * d), (hd - hu) / (2 * d), 1.0])
        return normal / (np.linalg.norm(normal) + 1e-9)

    def clearance(self, position: np.ndarray) -> float:
        """Vertical clearance of a position above ground (negative = buried)."""
        return float(position[2]) - self.height_at(float(position[0]), float(position[1]))

    # -- RF / line of sight -------------------------------------------------

    def terrain_profile(self, p1: np.ndarray, p2: np.ndarray,
                        samples: int = 48) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Sample the terrain profile along the great-circle path p1 -> p2.

        Returns:
            (distances_m, terrain_height, line_height) — each length `samples`.
            `line_height` is the straight-line elevation of the radio path.
        """
        t = np.linspace(0.0, 1.0, samples)
        xs = p1[0] + t * (p2[0] - p1[0])
        ys = p1[1] + t * (p2[1] - p1[1])
        line_z = p1[2] + t * (p2[2] - p1[2])

        ground = self.height_at_array(xs, ys)
        total = float(np.linalg.norm(np.asarray(p2[:2]) - np.asarray(p1[:2])))
        return t * total, ground, line_z

    def has_line_of_sight(self, p1: np.ndarray, p2: np.ndarray,
                          samples: int = 48, margin_m: float = 2.0) -> bool:
        """True if no terrain rises above the straight radio path."""
        _, ground, line_z = self.terrain_profile(p1, p2, samples)
        return bool(np.all(ground <= line_z - margin_m))

    def get_metadata(self) -> dict:
        """Terrain description for the renderer (without the bulk array)."""
        c = self.config
        return {
            "size_m": c.size_m,
            "resolution": c.resolution,
            "seed": c.seed,
            "min_height_m": self._min_h,
            "max_height_m": self._max_h,
            "valley_floor_m": c.valley_floor_m,
            "snow_line_m": c.snow_line_m,
            "cell_size_m": self.cell_size,
            "checksum": self.checksum(),
            "theatre": self.theatre_info(),
        }

    def theatre_info(self) -> dict:
        m = self.pack_meta
        if not m:
            info = {"id": "synthetic", "name": "Nanda Devi Sanctuary",
                    "region": "Garhwal Himalaya · procedural training model",
                    "lat": 30.376, "lon": 79.971, "north_bearing_deg": 90.0, "rotation_k": 0,
                    "description": "Our original procedurally generated glaciated valley, "
                                   "placed at the Nanda Devi Sanctuary. The terrain is synthetic "
                                   "— built for training and repeatable benchmarks — not a survey "
                                   "of the real sanctuary.",
                    "use_case": "Training, repeatable benchmarks",
                    "synthetic": True,
                    "sources": {"elevation": "procedural (ridged multifractal)"}}
            info["inner_bounds"] = _box_bounds(30.376, 79.971, self.config.size_m)
            return info
        return {k: m.get(k) for k in ("id", "name", "region", "lat", "lon", "description",
                                      "use_case", "north_bearing_deg", "rotation_k",
                                      "sources", "snow_line_m", "size_m",
                                      "inner_bounds", "context_bounds")}

    def checksum(self) -> str:
        """Short digest so every node can verify it rendered the same terrain."""
        if getattr(self, "_checksum", None) is None:
            self._checksum = hashlib.sha256(self.heightmap.tobytes()).hexdigest()[:16]
        return self._checksum

    def encode(self) -> dict:
        """
        Quantise the heightmap to uint16 and base64-encode it for transport.

        At 513x513 this is ~526 KB raw / ~700 KB base64 — a one-time fetch per
        dashboard, negligible on a LAN, and it guarantees every laptop renders
        a bit-identical surface.
        """
        lo, hi = self._min_h, self._max_h
        span = max(hi - lo, 1e-6)
        quantised = np.round((self.heightmap - lo) / span * 65535.0)
        quantised = quantised.astype("<u2")

        meta = self.get_metadata()
        meta.update({
            "encoding": "uint16-le-base64",
            "quantise_min_m": lo,
            "quantise_max_m": hi,
            "data": base64.b64encode(quantised.tobytes()).decode("ascii"),
            "imagery_jpeg_b64": self.get_pack_imagery_b64(),
            "context": self._encode_context(),
        })
        return meta

    def _encode_context(self):
        """Surrounding terrain (and imagery) out to the horizon, render-only."""
        if self.pack_meta:
            heights = getattr(self, "context_heights", None)
            if heights is None:
                return None
            extent = self.context_extent
            origin = -(extent - self.config.size_m) / 2.0
            image_path = getattr(self, "context_imagery_path", None)
        else:
            heights, extent, origin = self.procedural_context()
            image_path = None

        lo, hi = float(heights.min()), float(heights.max())
        q = np.round((heights - lo) / max(hi - lo, 1e-6) * 65535.0).astype("<u2")
        imagery = None
        if image_path is not None and image_path.exists():
            imagery = base64.b64encode(image_path.read_bytes()).decode("ascii")
        return {
            "size_m": extent,
            "origin_m": origin,
            "resolution": int(heights.shape[0]),
            "quantise_min_m": lo,
            "quantise_max_m": hi,
            "data": base64.b64encode(q.tobytes()).decode("ascii"),
            "imagery_jpeg_b64": imagery,
        }


def _box_bounds(lat: float, lon: float, size_m: float) -> list:
    """[south, north, west, east] of a size_m square centred on lat/lon."""
    import math
    dlat = size_m / 2.0 / 111_320.0
    dlon = size_m / 2.0 / (111_320.0 * math.cos(math.radians(lat)))
    return [lat - dlat, lat + dlat, lon - dlon, lon + dlon]


def list_theatres() -> list:
    """Every terrain pack on disk, plus the synthetic training valley."""
    import json
    from pathlib import Path
    root = Path(__file__).resolve().parent.parent / "terrain_packs"
    synthetic = Terrain.__new__(Terrain)
    synthetic.pack_meta = {}
    synthetic.config = TerrainConfig()
    info = synthetic.theatre_info()
    info.update({"min_height_m": 617.0, "max_height_m": 1553.0, "size_m": 4096.0,
                 "has_patch": False, "has_mid": False})
    synthetic_globe = root / "_synthetic_globe"
    if (synthetic_globe / "meta.json").exists():
        extra = json.loads((synthetic_globe / "meta.json").read_text())
        info.update(extra)
        info["has_patch"] = (synthetic_globe / "globe_patch.jpg").exists()
        info["has_mid"] = (synthetic_globe / "globe_mid.jpg").exists()
    theatres = [info]
    if root.exists():
        for meta_path in sorted(root.glob("*/meta.json")):
            if meta_path.parent.name.startswith("_"):
                continue        # globe-only imagery, not a terrain pack
            m = json.loads(meta_path.read_text())
            entry = {k: m.get(k) for k in (
                "id", "name", "region", "lat", "lon", "description", "use_case",
                "min_height_m", "max_height_m", "size_m", "inner_bounds", "context_bounds",
                "mid_bounds")}
            folder = meta_path.parent
            entry["has_patch"] = (folder / "globe_patch.jpg").exists()
            entry["patch_hr"] = (folder / "globe_patch_hr.jpg").exists()
            entry["has_mid"] = (folder / "globe_mid.jpg").exists()
            theatres.append(entry)
    return theatres


def build_terrain(seed: int = 4207, **overrides) -> Terrain:
    """Convenience constructor used by scenarios and tests."""
    config = TerrainConfig(seed=seed, **overrides)
    return Terrain(config)
