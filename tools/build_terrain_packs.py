"""
Build real-world terrain packs for the UAV-X simulator.

For each theatre, downloads:
  - elevation from the AWS Open Data terrain tiles (Terrarium encoding;
    SRTM / Copernicus-derived, public, no API key), and
  - surface imagery from the Sentinel-2 cloudless 2016 mosaic by EOX
    (CC BY 4.0: "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services
    GmbH (Contains modified Copernicus Sentinel data 2016)"),

crops both to the same square around the theatre centre, resamples the
elevation to the simulator's 513x513 grid, and writes a self-contained pack to
terrain_packs/<id>/. Packs are committed to the repository so the demonstration
never needs the internet: the venue network is not something to depend on.

Orientation: the simulator's mission corridor runs west -> east. If a theatre's
main valley runs north-south, the pack is rotated 90 degrees and the rotation is
recorded, so the dashboard can still show true north.

Usage:
    python tools/build_terrain_packs.py            # all theatres
    python tools/build_terrain_packs.py uttarkashi # one
"""

from __future__ import annotations

import io
import json
import math
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PACK_DIR = ROOT / "terrain_packs"

DEM_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
IMG_URL = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"
# High-resolution imagery. Esri World Imagery may be *viewed* with attribution,
# but its terms do not permit redistributing cached tiles, so these files are
# written with an _hr suffix that .gitignore excludes: each laptop builds its
# own copy with this script (one command, needs internet once).
ESRI_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

GRID = 1025           # simulator heightmap resolution (5 m cells over 5.1 km)
CONTEXT_GRID = 513    # surrounding terrain, rendered only (≈ 70 m cells)
CONTEXT_SCALE = 7     # surrounding area = 7 x 7 theatre widths (≈ 36 km)
IMAGERY_PX = 1024     # committed Sentinel-2 texture resolution
HR_MAX_PX = 4096      # cap for the Esri texture (GPU texture limit headroom)

THEATRES = [
    {
        "id": "kedarnath",
        "name": "Kedarnath",
        "region": "Rudraprayag, Uttarakhand",
        "lat": 30.720, "lon": 79.068,
        "size_m": 5120.0, "dem_zoom": 13, "img_zoom": 14,
        "snow_line_m": 4400.0,
        "description": "Mandakini valley below Kedarnath — site of the 2013 flash "
                       "flood and debris flow. Narrow gorge, no ground access after "
                       "the road washes out.",
        "use_case": "Landslide / debris-flow response, survivor search",
    },
    {
        "id": "uttarkashi",
        "name": "Uttarkashi",
        "region": "Uttarkashi, Uttarakhand",
        "lat": 30.730, "lon": 78.445,
        "size_m": 5120.0, "dem_zoom": 13, "img_zoom": 14,
        "snow_line_m": 4500.0,
        "description": "Bhagirathi valley at Uttarkashi — epicentral area of the 1991 "
                       "M6.8 earthquake, which destroyed villages along the valley "
                       "walls and cut the road for days.",
        "use_case": "Earthquake response: collapsed buildings, blocked roads",
    },
    {
        "id": "joshimath",
        "name": "Joshimath",
        "region": "Chamoli, Uttarakhand",
        "lat": 30.555, "lon": 79.565,
        "size_m": 5120.0, "dem_zoom": 13, "img_zoom": 14,
        "snow_line_m": 4300.0,
        "description": "Alaknanda valley at Joshimath — the 2023 land-subsidence zone, "
                       "upstream of the 2021 Chamoli rock-ice avalanche and flash flood.",
        "use_case": "Landslide / subsidence damage survey",
    },
    {
        "id": "chungthang",
        "name": "Chungthang",
        "region": "Mangan, Sikkim",
        "lat": 27.603, "lon": 88.645,
        "size_m": 5120.0, "dem_zoom": 13, "img_zoom": 14,
        "snow_line_m": 4800.0,
        "description": "Teesta valley at Chungthang — hit by the October 2023 South "
                       "Lhonak glacial-lake outburst flood, which took out the dam, "
                       "bridges and the highway.",
        "use_case": "Flood / landslide response in a steep gorge",
    },
]


# -- Web Mercator helpers ------------------------------------------------------

def global_pixel(lat: float, lon: float, zoom: int):
    scale = 256 * (2 ** zoom)
    x = (lon + 180.0) / 360.0 * scale
    lat_r = math.radians(lat)
    y = (1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi) / 2.0 * scale
    return x, y


def lat_lon_of_pixel(x: float, y: float, zoom: int):
    scale = 256 * (2 ** zoom)
    lon = x / scale * 360.0 - 180.0
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / scale))))
    return lat, lon


def box_bounds(lat: float, lon: float, size_m: float):
    """[south, north, west, east] of the square box, for the globe."""
    z = 20
    cx, cy = global_pixel(lat, lon, z)
    half = size_m / 2.0 / metres_per_pixel(lat, z)
    north, west = lat_lon_of_pixel(cx - half, cy - half, z)
    south, east = lat_lon_of_pixel(cx + half, cy + half, z)
    return [south, north, west, east]


def metres_per_pixel(lat: float, zoom: int) -> float:
    return 156543.03392 * math.cos(math.radians(lat)) / (2 ** zoom)


def _ssl_context():
    """
    python.org builds of Python on macOS ship without a CA bundle until
    'Install Certificates.command' is run, so HTTPS fails with
    CERTIFICATE_VERIFY_FAILED. Use certifi's bundle when it is available.
    """
    import ssl
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


_CTX = _ssl_context()


def fetch(url: str, retries: int = 4) -> bytes:
    import subprocess
    for attempt in range(retries):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "C-DAWN-terrain-pack/1.0"})
            try:
                with urllib.request.urlopen(request, timeout=30, context=_CTX) as response:
                    return response.read()
            except urllib.error.URLError as exc:
                if "CERTIFICATE_VERIFY_FAILED" not in str(exc):
                    raise
                # Fall back to the system curl, which uses the OS trust store
                return subprocess.run(["curl", "-sfL", "--max-time", "30", url],
                                      check=True, capture_output=True).stdout
        except Exception as exc:  # network hiccup — back off and retry
            if attempt == retries - 1:
                raise RuntimeError(f"failed to fetch {url}: {exc}")
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("unreachable")


def mosaic(url_tpl: str, lat: float, lon: float, size_m: float, zoom: int,
           decode) -> np.ndarray:
    """Download the tiles covering the square and return the cropped mosaic."""
    cx, cy = global_pixel(lat, lon, zoom)
    half = size_m / 2.0 / metres_per_pixel(lat, zoom)
    x0, x1 = cx - half, cx + half
    y0, y1 = cy - half, cy + half

    tx0, tx1 = int(x0 // 256), int(x1 // 256)
    ty0, ty1 = int(y0 // 256), int(y1 // 256)

    from concurrent.futures import ThreadPoolExecutor
    coords = [(tx, ty) for ty in range(ty0, ty1 + 1) for tx in range(tx0, tx1 + 1)]
    with ThreadPoolExecutor(max_workers=8) as pool:
        tiles = list(pool.map(lambda c: decode(fetch(url_tpl.format(z=zoom, x=c[0], y=c[1]))), coords))
    width = tx1 - tx0 + 1
    rows = [np.concatenate(tiles[r * width:(r + 1) * width], axis=1)
            for r in range(ty1 - ty0 + 1)]
    full = np.concatenate(rows, axis=0)

    ox, oy = x0 - tx0 * 256, y0 - ty0 * 256
    side = int(round(2 * half))
    return full[int(oy):int(oy) + side, int(ox):int(ox) + side]


def decode_terrarium(data: bytes) -> np.ndarray:
    rgb = np.asarray(Image.open(io.BytesIO(data)).convert("RGB")).astype(np.float64)
    return rgb[..., 0] * 256.0 + rgb[..., 1] + rgb[..., 2] / 256.0 - 32768.0


def decode_rgb(data: bytes) -> np.ndarray:
    return np.asarray(Image.open(io.BytesIO(data)).convert("RGB"))


def resample(array: np.ndarray, size: int) -> np.ndarray:
    image = Image.fromarray(array.astype(np.float32), mode="F")
    return np.asarray(image.resize((size, size), Image.BICUBIC), dtype=np.float32)


# -- orientation: which way does the valley run? -----------------------------

def valley_cost(heights: np.ndarray) -> float:
    """
    Cost of the cheapest west->east path along the valley floor (Viterbi over
    columns, penalising lateral movement). Lower is a better corridor.
    """
    h = heights[::8, ::8]
    h = (h - h.min()) / max(float(np.ptp(h)), 1.0)
    rows, cols = h.shape
    cost = h[:, 0].copy()
    for c in range(1, cols):
        best = np.full(rows, np.inf)
        for shift in range(-2, 3):
            shifted = np.roll(cost, shift) + 0.03 * abs(shift)
            if shift > 0:
                shifted[:shift] = np.inf
            elif shift < 0:
                shifted[shift:] = np.inf
            best = np.minimum(best, shifted)
        cost = best + h[:, c]
    return float(cost.min() / cols)


# -- build ----------------------------------------------------------------------

def _save_jpeg(array: np.ndarray, path: Path, size: int = None, quality: int = 86):
    image = Image.fromarray(np.ascontiguousarray(array))
    if size and max(image.size) != size:
        image = image.resize((size, size), Image.LANCZOS)
    image.save(path, quality=quality)


def build(theatre: dict, hires: bool = True):
    out = PACK_DIR / theatre["id"]
    out.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    lat, lon, size = theatre["lat"], theatre["lon"], theatre["size_m"]
    context_size = size * CONTEXT_SCALE
    tag = theatre["id"]

    # -- elevation ---------------------------------------------------------
    print(f"[{tag}] elevation: theatre z14, surroundings z11 ...", flush=True)
    heights = resample(mosaic(DEM_URL, lat, lon, size, 14, decode_terrarium), GRID)[::-1]
    context = resample(mosaic(DEM_URL, lat, lon, context_size, 11, decode_terrarium),
                       CONTEXT_GRID)[::-1]

    # -- imagery (south-up to match the heightmaps) ------------------------------
    print(f"[{tag}] Sentinel-2 imagery ...", flush=True)
    s2_inner = mosaic(IMG_URL, lat, lon, size, 14, decode_rgb)
    s2_context = mosaic(IMG_URL, lat, lon, context_size, 12, decode_rgb)
    images = {"imagery.jpg": (s2_inner, IMAGERY_PX),
              "context_imagery.jpg": (s2_context, IMAGERY_PX)}
    globe_patch = {"globe_patch.jpg": (s2_context, 1024)}

    if hires:
        print(f"[{tag}] Esri high-resolution imagery (local only) ...", flush=True)
        try:
            hr_inner = mosaic(ESRI_URL, lat, lon, size, 16, decode_rgb)
            hr_context = mosaic(ESRI_URL, lat, lon, context_size, 13, decode_rgb)
            images["imagery_hr.jpg"] = (hr_inner, min(HR_MAX_PX, hr_inner.shape[0]))
            images["context_imagery_hr.jpg"] = (hr_context, 2048)
            globe_patch["globe_patch_hr.jpg"] = (hr_context, 2048)
        except RuntimeError as exc:
            print(f"[{tag}] high-resolution imagery unavailable ({exc}); Sentinel only")

    # Globe patches stay north-up and unrotated: they are draped on the globe
    for name, (img, px) in globe_patch.items():
        _save_jpeg(img, out / name, px)

    # -- orientation --------------------------------------------------------
    rotation_k = 1 if valley_cost(np.rot90(heights, 1)) < valley_cost(heights) * 0.9 else 0

    def orient(array):
        return np.rot90(array, rotation_k).copy() if rotation_k else array

    heights = orient(heights)
    context = orient(context)
    np.save(out / "heightmap.npy", heights.astype(np.float32))
    np.save(out / "context_heightmap.npy", context.astype(np.float32))

    for name, (img, px) in images.items():
        south_up = orient(img[::-1])
        # stored north-up for the browser (three.js flips on upload)
        _save_jpeg(south_up[::-1], out / name, px)

    meta = {
        **{k: v for k, v in theatre.items() if k not in ("dem_zoom", "img_zoom")},
        "resolution": GRID,
        "context_size_m": context_size,
        "context_resolution": CONTEXT_GRID,
        "min_height_m": float(heights.min()),
        "max_height_m": float(heights.max()),
        "rotation_k": rotation_k,
        "north_bearing_deg": 90.0 if rotation_k == 0 else 180.0,
        "inner_bounds": box_bounds(lat, lon, size),
        "context_bounds": box_bounds(lat, lon, context_size),
        "sources": {
            "elevation": "AWS Open Data Terrain Tiles (Terrarium; SRTM/Copernicus-derived)",
            "imagery": ("Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH "
                        "(Contains modified Copernicus Sentinel data 2016), CC BY 4.0"),
            "imagery_hr": ("Esri World Imagery — Esri, Maxar, Earthstar Geographics, and the "
                           "GIS User Community (local cache, not redistributed)"),
        },
        "built": time.strftime("%Y-%m-%d"),
    }
    (out / "meta.json").write_text(json.dumps(meta, indent=2))
    print(f"[{tag}] done in {time.time() - t0:.1f}s — "
          f"{meta['min_height_m']:.0f}–{meta['max_height_m']:.0f} m, "
          f"rotated={bool(rotation_k)}, hr={'imagery_hr.jpg' in images}", flush=True)


def build_globe_assets():
    """Regional Himalaya mosaic for the globe (Sentinel-2, committable)."""
    public = ROOT / "gcs" / "frontend" / "public"
    public.mkdir(parents=True, exist_ok=True)
    z = 7
    west, east, south, north = 70.0, 98.0, 24.0, 38.5
    x0, y0 = global_pixel(north, west, z)
    x1, y1 = global_pixel(south, east, z)
    tx0, tx1, ty0, ty1 = int(x0 // 256), int(x1 // 256), int(y0 // 256), int(y1 // 256)
    from concurrent.futures import ThreadPoolExecutor
    coords = [(tx, ty) for ty in range(ty0, ty1 + 1) for tx in range(tx0, tx1 + 1)]
    with ThreadPoolExecutor(max_workers=8) as pool:
        tiles = list(pool.map(lambda c: decode_rgb(fetch(IMG_URL.format(z=z, x=c[0], y=c[1]))), coords))
    width = tx1 - tx0 + 1
    rows = [np.concatenate(tiles[r * width:(r + 1) * width], axis=1) for r in range(ty1 - ty0 + 1)]
    full = np.concatenate(rows, axis=0)
    Image.fromarray(full).save(public / "himalaya.jpg", quality=88)
    n_lat, w_lon = lat_lon_of_pixel(tx0 * 256, ty0 * 256, z)
    s_lat, e_lon = lat_lon_of_pixel((tx1 + 1) * 256, (ty1 + 1) * 256, z)
    (public / "himalaya.json").write_text(json.dumps(
        {"south": s_lat, "north": n_lat, "west": w_lon, "east": e_lon, "projection": "mercator"}))
    print(f"[globe] regional mosaic {full.shape[1]}x{full.shape[0]}")


MID_SIZE_M = 160_000.0   # mid-level globe ring around each theatre


def build_globe_patches(theatre: dict, folder: Path, hires: bool = True,
                        include_context: bool = False):
    """
    Globe-only imagery around a location: a 160 km mid-level ring (Sentinel-2,
    committable), and optionally the ~36 km close-in patch. Used for the
    synthetic training model, which has no terrain pack but does sit at a real
    place on the globe.
    """
    folder.mkdir(parents=True, exist_ok=True)
    lat, lon = theatre["lat"], theatre["lon"]
    mid = mosaic(IMG_URL, lat, lon, MID_SIZE_M, 10, decode_rgb)
    _save_jpeg(mid, folder / "globe_mid.jpg", 1536)
    bounds = {"mid_bounds": box_bounds(lat, lon, MID_SIZE_M)}
    if include_context:
        size = theatre.get("size_m", 4096.0) * CONTEXT_SCALE
        _save_jpeg(mosaic(IMG_URL, lat, lon, size, 12, decode_rgb), folder / "globe_patch.jpg", 1024)
        if hires:
            try:
                _save_jpeg(mosaic(ESRI_URL, lat, lon, size, 13, decode_rgb),
                           folder / "globe_patch_hr.jpg", 2048)
            except RuntimeError:
                pass
        bounds["context_bounds"] = box_bounds(lat, lon, size)
    return bounds


NANDA_DEVI = {"id": "synthetic", "lat": 30.376, "lon": 79.971, "size_m": 4096.0}


def tile_range(south, north, west, east, zoom):
    n = 2 ** zoom
    def ty(lat):
        r = math.radians(lat)
        return int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n)
    x0, x1 = int((west + 180) / 360 * n), int((east + 180) / 360 * n)
    return [(x, y) for x in range(max(x0, 0), min(x1, n - 1) + 1)
            for y in range(max(ty(north), 0), min(ty(south), n - 1) + 1)]


def prefetch_globe_tiles():
    """
    Warm the globe's satellite tile cache (terrain_packs/_tiles) so the
    zoomable globe stays sharp at an offline venue: the Himalayan arc down to
    ~500 m/px, and each theatre's surroundings down to ~30 m/px.
    """
    from concurrent.futures import ThreadPoolExecutor
    region = json.loads((ROOT / "gcs" / "frontend" / "public" / "himalaya.json").read_text())
    jobs = set()
    for z in range(3, 9):
        for x, y in tile_range(region["south"], region["north"], region["west"], region["east"], z):
            jobs.add((z, x, y))
    for t in THEATRES + [NANDA_DEVI]:
        for z, half_deg in ((9, 1.6), (10, 1.0), (11, 0.45), (12, 0.2), (13, 0.08)):
            dlon = half_deg / math.cos(math.radians(t["lat"]))
            for x, y in tile_range(t["lat"] - half_deg, t["lat"] + half_deg,
                                   t["lon"] - dlon, t["lon"] + dlon, z):
                jobs.add((z, x, y))
    cache = PACK_DIR / "_tiles"
    todo = [j for j in sorted(jobs) if not (cache / str(j[0]) / str(j[1]) / f"{j[2]}.jpg").exists()]
    print(f"globe tiles: {len(jobs)} total, {len(todo)} to fetch", flush=True)

    def get(job):
        z, x, y = job
        try:
            data = fetch(IMG_URL.format(z=z, x=x, y=y), retries=3)
        except RuntimeError:
            return False
        path = cache / str(z) / str(x) / f"{y}.jpg"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return True

    done = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        for ok in pool.map(get, todo):
            done += ok
            if done and done % 200 == 0:
                print(f"  {done}/{len(todo)}", flush=True)
    print(f"globe tiles: fetched {done}/{len(todo)}", flush=True)


if __name__ == "__main__":
    if "tiles" in sys.argv:
        prefetch_globe_tiles()
        sys.exit(0)
    if "mids" in sys.argv:
        # Globe imagery only: mid rings for every pack + Nanda Devi patches
        for theatre in THEATRES:
            folder = PACK_DIR / theatre["id"]
            meta_path = folder / "meta.json"
            meta = json.loads(meta_path.read_text())
            meta.update(build_globe_patches(theatre, folder))
            meta_path.write_text(json.dumps(meta, indent=2))
            print(f"[{theatre['id']}] globe mid ring done", flush=True)
        folder = PACK_DIR / "_synthetic_globe"
        bounds = build_globe_patches(NANDA_DEVI, folder, include_context=True)
        (folder / "meta.json").write_text(json.dumps(bounds, indent=2))
        print("[synthetic] Nanda Devi globe imagery done", flush=True)
        sys.exit(0)

    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    hires = "--no-hires" not in sys.argv
    wanted = set(args)
    if not wanted or "globe" in wanted:
        build_globe_assets()
    for theatre in THEATRES:
        if not wanted or theatre["id"] in wanted:
            build(theatre, hires=hires)
