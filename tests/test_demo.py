"""Scenario, telemetry and demo-orchestration tests."""

import json
from pathlib import Path

import numpy as np

from gcs.backend.telemetry import TelemetryAggregator
from sim.world import World


SCENARIO_DIR = Path(__file__).parent.parent / "demo" / "scenarios"


def test_scenarios_load_into_a_valid_world():
    scenarios = sorted(SCENARIO_DIR.glob("*.json"))
    assert scenarios, "no scenario files found"

    for path in scenarios:
        with open(path) as f:
            data = json.load(f)

        assert "name" in data and "terrain" in data and "mission" in data

        world = World.from_scenario(str(path))
        meta = world.terrain.get_metadata()

        assert len(world.pois) == data["mission"]["num_pois"]
        assert meta["max_height_m"] > meta["min_height_m"] + 400
        assert world.mission_end_x > world.mission_start_x


def test_scenario_pois_sit_on_the_terrain_surface():
    world = World.from_scenario(str(SCENARIO_DIR / "alpine_valley.json"))
    for poi in world.pois:
        ground = world.terrain.height_at(poi.position[0], poi.position[1])
        assert abs(poi.position[2] - ground) < 5.0, (
            f"{poi.id} is floating {poi.position[2] - ground:.1f} m above ground"
        )


def test_scenarios_produce_different_terrain():
    a = World.from_scenario(str(SCENARIO_DIR / "alpine_valley.json"))
    b = World.from_scenario(str(SCENARIO_DIR / "high_pass.json"))
    assert a.terrain.checksum() != b.terrain.checksum()


# --- telemetry --------------------------------------------------------------

def _tick(index: int) -> dict:
    return {
        "sim_time": index * 0.02,
        "tick": index,
        "drones": {"SCOUT-1": {"id": "SCOUT-1", "position": [1.0, 2.0, 3.0]}},
        "metrics": {
            "swarm_pdr": 0.9,
            "backhaul_pdr": 0.8,
            "avg_battery": 75.0,
            "tracking_error_m": 1.5,
            "shadow_divergence_ms2": 2.5,
        },
        "rf": {}, "wind": {}, "pois": [], "events": [],
    }


def test_telemetry_snapshot_has_every_field_the_dashboard_reads():
    aggregator = TelemetryAggregator()
    aggregator.update(_tick(0))

    snapshot = aggregator.get_snapshot()
    for key in ("sim_time", "tick", "drones", "metrics", "rf", "wind",
                "pois", "events", "causal", "gnn", "mesh", "election",
                "sitrep", "cluster", "demo", "charts"):
        assert key in snapshot, f"missing telemetry key: {key}"

    for series in ("pdr", "backhaul", "battery", "control", "election"):
        assert series in snapshot["charts"]


def test_telemetry_history_is_decimated():
    """
    Charts are sampled at 5 Hz, not at the 50 Hz physics rate — otherwise the
    snapshot grows ten times faster than it carries information.
    """
    aggregator = TelemetryAggregator()
    for i in range(100):
        aggregator.update(_tick(i))

    assert len(aggregator._pdr_history) == 10


def test_telemetry_history_is_bounded():
    aggregator = TelemetryAggregator(history_length=20)
    for i in range(5000):
        aggregator.update(_tick(i))

    assert len(aggregator._pdr_history) <= 20
    assert len(aggregator._control_history) <= 20


def test_telemetry_survives_missing_subsystems():
    """A dashboard must still render before every subsystem has reported."""
    aggregator = TelemetryAggregator()
    snapshot = aggregator.get_snapshot()

    assert snapshot["drones"] == {}
    assert snapshot["causal"] is None
    assert snapshot["charts"]["pdr"] == []


# --- demo controller --------------------------------------------------------

def test_demo_controller_assembles_and_ticks():
    from gcs.backend.demo_controller import DemoController

    demo = DemoController(phase_duration=10.0)
    try:
        assert len(demo.sim.drones) == 5
        assert demo.active_controller
        assert demo.shadow_kind in ("PID", "LTC")

        for _ in range(200):
            demo.sim.tick()
            demo._post_tick()

        metrics = demo.sim.metrics
        assert metrics["active_nodes"] > 0
        assert 0.0 <= metrics["backhaul_pdr"] <= 1.0
        assert np.isfinite(metrics["avg_battery"])
    finally:
        demo.stop()


def test_fault_injection_changes_rf_state():
    from gcs.backend.demo_controller import DemoController

    demo = DemoController(phase_duration=10.0)
    try:
        assert demo.rf.jamming_active is False

        demo.inject_fault("jamming", {"power_dbm": -70.0})
        assert demo.rf.jamming_active is True

        demo.inject_fault("restore")
        assert demo.rf.jamming_active is False
    finally:
        demo.stop()


def test_kill_node_removes_it_from_the_mesh():
    from gcs.backend.demo_controller import DemoController

    demo = DemoController(phase_duration=10.0)
    try:
        for _ in range(60):
            demo.sim.tick()

        demo.inject_fault("kill_node", {"drone_id": "RELAY-1"})
        demo.sim.tick()

        assert demo.sim.drones["RELAY-1"].is_alive is False
        for drone in demo.sim.drones.values():
            assert "RELAY-1" not in drone.neighbors
    finally:
        demo.stop()


def test_reset_restores_initial_state():
    from gcs.backend.demo_controller import DemoController

    demo = DemoController(phase_duration=10.0)
    try:
        for _ in range(300):
            demo.sim.tick()
            demo._post_tick()

        demo.inject_fault("kill_node", {"drone_id": "RELAY-1"})
        demo.reset()

        assert demo.sim.sim_time == 0.0
        assert demo.sim.tick_count == 0
        assert all(d.is_alive for d in demo.sim.drones.values())
        assert all(not p.surveyed for p in demo.world.pois)
        assert demo.sim.metrics["collisions"] == 0
    finally:
        demo.stop()


def test_phase_briefs_exist_for_every_phase():
    """Each phase must carry a plain-language explanation for the operator."""
    from gcs.backend.demo_controller import DemoController

    for phase, name in DemoController.PHASE_NAMES.items():
        assert name
        assert DemoController.PHASE_BRIEF.get(phase), f"phase {phase} has no brief"
