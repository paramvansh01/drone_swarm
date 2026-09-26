"""Real-terrain theatre tests: packs load, the corridor is found, missions fly."""

import numpy as np
import pytest

from sim.terrain import Terrain, TerrainConfig, list_theatres
from sim.world import World

REAL = [t["id"] for t in list_theatres() if not t.get("synthetic")]


def test_packs_are_present():
    assert len(REAL) >= 3, "terrain packs missing — run tools/build_terrain_packs.py"


@pytest.mark.parametrize("theatre_id", REAL)
def test_pack_loads_with_plausible_elevations(theatre_id):
    terrain = Terrain(TerrainConfig(pack=theatre_id))
    meta = terrain.pack_meta
    assert terrain.heightmap.shape in ((513, 513), (1025, 1025))
    assert np.all(np.isfinite(terrain.heightmap))
    # Himalayan disaster sites: valley floors from ~1,000 m, relief of hundreds of metres or more
    assert 500 < terrain.heightmap.min() < 5000
    assert terrain.heightmap.max() - terrain.heightmap.min() > 800
    assert meta["lat"] and meta["lon"] and meta["sources"]["imagery"]
    assert terrain.imagery_path.exists()


@pytest.mark.parametrize("theatre_id", REAL)
def test_corridor_follows_low_ground(theatre_id):
    """The derived mission corridor must run along the valley, not over ridges."""
    terrain = Terrain(TerrainConfig(pack=theatre_id))
    size = terrain.config.size_m
    xs = np.linspace(size * 0.1, size * 0.9, 12)
    on_axis = np.array([terrain.height_at(x, float(terrain.corridor_centerline_y(x))) for x in xs])

    rng = np.random.RandomState(0)
    random_ys = rng.uniform(size * 0.05, size * 0.95, (40, len(xs)))
    random = np.array([[terrain.height_at(x, y) for x, y in zip(xs, row)] for row in random_ys])

    # The corridor should be lower than the typical point in the theatre
    assert on_axis.mean() < np.median(random.mean(axis=1))


def test_payload_carries_imagery_and_theatre():
    terrain = Terrain(TerrainConfig(pack=REAL[0]))
    payload = terrain.encode()
    assert payload["imagery_jpeg_b64"]
    assert payload["theatre"]["id"] == REAL[0]
    assert payload["size_m"] == terrain.config.size_m


def test_synthetic_theatre_has_no_imagery():
    assert Terrain(TerrainConfig()).encode()["imagery_jpeg_b64"] is None


@pytest.mark.parametrize("theatre_id", REAL[:2])
def test_mission_flies_on_real_terrain(theatre_id):
    import logging
    logging.disable(logging.WARNING)
    from gcs.backend.demo_controller import DemoController

    demo = DemoController(theatre=theatre_id, autostart=True, shadow=False)
    try:
        for _ in range(1500):                      # 30 s
            demo.step()
        assert demo.get_state()["theatre"]["id"] == theatre_id
        assert demo.sim.metrics["collisions"] == 0
        assert demo.sim.metrics["terrain_contacts"] == 0
        airborne = [d for d in demo.sim.drones.values() if d.is_alive]
        assert len(airborne) >= 4
        for drone in airborne:
            assert demo.world.agl(drone.position) > 5.0
        # The GCS and the default geofence are set up on real terrain too
        assert demo.world.geofence.contains(*demo.world.gcs.position[:2])
    finally:
        demo.stop()
        logging.disable(logging.NOTSET)
