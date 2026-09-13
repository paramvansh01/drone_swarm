"""
Home-on-jam interceptor: engagement, safe-arming and failure modes.

Runs the munition directly against a world + RF channel (no simulation
thread), so each case is a few hundred milliseconds.
"""

import numpy as np
import pytest

from sim.world import World
from sim.rf_channel import RFChannel
from sim.terrain import build_terrain
from sim.interceptor import Interceptor


DT = 0.02


@pytest.fixture(scope="module")
def world():
    return World(terrain=build_terrain(seed=4207))


def _route(start, target):
    """Straight two-leg route, as the guidance layer would supply."""
    start, target = np.asarray(start), np.asarray(target)
    return [start + (target - start) * f for f in (0.5, 1.0)]


def _fly(unit, world, rf, seconds=200.0, wind=(0.0, 0.0)):
    events = []
    t = 0.0
    while t < seconds and not unit.done:
        events += unit.update(DT, world, rf, np.array(wind), t, _route)
        t += DT
    return events, t


def _launch_site(world):
    size = world.terrain.config.size_m
    x = size * 0.075
    y = float(world.terrain.corridor_centerline_y(x))
    return [x, y, world.terrain.height_at(x, y) + 12.0]


def _place(world, rf, x, y, power_dbm=18.0):
    z = world.terrain.height_at(x, y) + 15.0
    rf.add_jammer("JAM-1", [x, y, z], power_dbm)
    return np.array([x, y, z])


def test_interceptor_destroys_an_emitting_jammer(world):
    rf = RFChannel(frequency_mhz=world.frequency_mhz)
    launch = _launch_site(world)
    target = _place(world, rf, launch[0] + 1400.0, launch[1] + 250.0)

    # Launched against a deliberately poor fix: the seeker, not the estimate,
    # is what puts it on the target.
    estimate = {"x": target[0] + 400.0, "y": target[1] - 300.0, "z": target[2],
                "radius_m": 500.0}
    unit = Interceptor("INT-1", launch, estimate, 0.0)
    events, _ = _fly(unit, world, rf)

    assert unit.outcome == "HIT", f"outcome {unit.outcome}, phase {unit.phase}"
    assert unit.miss_distance <= Interceptor.LETHAL_RADIUS
    assert "JAM-1" not in rf.jammers
    assert any(kind == "JAMMER_DESTROYED" for kind, _, _ in events)


def test_fuze_is_safe_until_the_munition_is_clear_of_the_launcher(world):
    """A jammer beside the launch site must not detonate the round on it."""
    rf = RFChannel(frequency_mhz=world.frequency_mhz)
    launch = _launch_site(world)
    target = _place(world, rf, launch[0] + 12.0, launch[1] + 8.0, power_dbm=10.0)
    estimate = {"x": target[0], "y": target[1], "z": target[2], "radius_m": 60.0}

    unit = Interceptor("INT-1", launch, estimate, 0.0)
    # Nothing may detonate inside the arming window
    t = 0.0
    while t < Interceptor.ARM_TIME_S:
        unit.update(DT, world, rf, np.zeros(2), t, _route)
        t += DT
    assert not unit.done
    assert "JAM-1" in rf.jammers

    _fly(unit, world, rf)
    assert unit.outcome == "HIT"
    assert unit.path_flown >= Interceptor.ARM_DISTANCE_M


def test_a_silent_emitter_is_not_attacked(world):
    """No emission, no lock: the round loiters over the fix and expires."""
    rf = RFChannel(frequency_mhz=world.frequency_mhz)
    launch = _launch_site(world)
    estimate = {"x": launch[0] + 1200.0, "y": launch[1] + 100.0,
                "z": world.terrain.height_at(launch[0] + 1200.0, launch[1] + 100.0),
                "radius_m": 150.0}

    unit = Interceptor("INT-1", launch, estimate, 0.0)
    events, _ = _fly(unit, world, rf, seconds=Interceptor.ENDURANCE_S + 10.0)

    assert unit.outcome in ("ENDURANCE", "TERRAIN")
    assert any("LOITER" in kind or "loiter" in message
               for kind, message, _ in events) or unit.phase == "ENDURANCE"


def test_launch_requires_a_geolocation_fix():
    """The weapon is only ever released at something the swarm has measured."""
    from gcs.backend.demo_controller import DemoController
    demo = DemoController(theatre="synthetic")
    result = demo.command("launch_interceptor", {})
    assert result["ok"] is False
    assert "fix" in result["error"]
    assert demo.magazine == demo.MAGAZINE
