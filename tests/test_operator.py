"""
Operator (interactive-mode) tests.

Everything a judge can do from the dashboard goes through
DemoController.command(). These check the behaviours they would notice on
screen: things appear where clicked, downed aircraft fall, the autonomy stops
overriding a direct order, and terrain genuinely shields a drone from a jammer.
"""

import numpy as np
import pytest

from gcs.backend.demo_controller import DemoController
from sim.drone import DroneRole


@pytest.fixture
def demo():
    d = DemoController(phase_duration=45.0)      # interactive by default
    yield d
    d.stop()


def tick(demo, n):
    for _ in range(n):
        demo.sim.tick()
        demo._post_tick()


def corridor(demo, x):
    return float(demo.world.terrain.corridor_centerline_y(x))


def test_interactive_mode_schedules_nothing(demo):
    assert demo.mode == "interactive"
    assert demo.sim.events == []
    assert demo.get_state()["phase_name"] == "OPERATOR CONTROL"


def test_add_drone_appears_where_clicked(demo):
    x, y = 1500.0, corridor(demo, 1500.0)
    result = demo.command("add_drone", {"role": "scout", "x": x, "y": y})
    assert result["ok"]
    drone = demo.sim.drones[result["drone_id"]]
    assert drone.role == DroneRole.SCOUT
    assert abs(drone.position[0] - x) < 1e-6 and abs(drone.position[1] - y) < 1e-6
    assert demo.world.agl(drone.position) > 30.0


def test_add_drone_rejects_bad_input_and_respects_cap(demo):
    assert not demo.command("add_drone", {"role": "tank", "x": 1000, "y": 2000})["ok"]
    while len(demo.sim.drones) < demo.MAX_DRONES:
        assert demo.command("add_drone", {"role": "relay", "x": 900, "y": 2200})["ok"]
    capped = demo.command("add_drone", {"role": "relay", "x": 900, "y": 2200})
    assert not capped["ok"] and "limited" in capped["error"]


def test_unknown_command_and_unknown_drone_fail_cleanly(demo):
    assert not demo.command("launch_missiles", {})["ok"]
    assert not demo.command("kill", {"drone_id": "NOPE"})["ok"]


def test_taken_down_drone_falls_to_the_ground(demo):
    tick(demo, 20)
    assert demo.command("kill", {"drone_id": "RELAY-1"})["ok"]
    drone = demo.sim.drones["RELAY-1"]
    start_agl = demo.world.agl(drone.position)
    tick(demo, 400)                                  # 8 s
    assert start_agl > 50.0
    assert demo.world.agl(drone.position) < 1.0
    assert drone.neighbors == {}


def test_relaunch_restores_a_downed_drone(demo):
    demo.command("kill", {"drone_id": "SCOUT-1"})
    tick(demo, 300)
    assert demo.command("revive", {"drone_id": "SCOUT-1"})["ok"]
    drone = demo.sim.drones["SCOUT-1"]
    assert drone.is_alive
    assert demo.world.agl(drone.position) > 30.0


def test_goto_overrides_autonomy_until_released(demo):
    x, y = 1100.0, corridor(demo, 1100.0) + 100.0
    assert demo.command("goto", {"drone_id": "RELAY-1", "x": x, "y": y})["ok"]

    # The GNN must not move an aircraft the operator is flying
    demo.guidance.set_relay_station("RELAY-1", np.array([3000.0, 2000.0, 900.0]))
    assert "RELAY-1" in demo.guidance.manual_targets

    tick(demo, 2500)                                 # 50 s
    drone = demo.sim.drones["RELAY-1"]
    assert np.linalg.norm(drone.position[:2] - np.array([x, y])) < 60.0

    assert demo.command("release", {"drone_id": "RELAY-1"})["ok"]
    assert "RELAY-1" not in demo.guidance.manual_targets


def test_new_target_gets_a_scout(demo):
    tick(demo, 10)
    for poi in demo.world.pois:           # make every existing target done
        poi.surveyed = True
    demo.guidance.assignments.clear()
    result = demo.command("add_poi", {"x": 1300.0, "y": corridor(demo, 1300.0)})
    tick(demo, 5)
    assert result["poi_id"] in demo.guidance.assignments.values()


def test_terrain_shields_a_drone_from_a_jammer(demo):
    """
    A jammer is a transmitter at a place. Two receivers at the same distance
    from it — one with clear line of sight, one behind a ridge — must see very
    different interference.
    """
    rf, world = demo.rf, demo.world
    jx = 1500.0
    jy = corridor(demo, jx)
    rf.add_jammer("J", [jx, jy, world.terrain.height_at(jx, jy) + 15.0], 10.0)

    distance = 700.0
    clear = np.array([jx + distance, corridor(demo, jx + distance),
                      world.terrain.height_at(jx + distance, corridor(demo, jx + distance)) + 150.0])
    # Same distance, but across the valley wall at low altitude
    by = jy + distance
    shadowed = np.array([jx, by, world.terrain.height_at(jx, by) + 20.0])

    assert world.compute_rf_occlusion_db(rf.jammers["J"]["position"], shadowed) > 10.0
    assert rf.jammer_power_at(shadowed, world) < rf.jammer_power_at(clear, world) - 10.0


def test_jammer_degrades_nearby_links(demo):
    tick(demo, 30)
    before = demo.sim.metrics["swarm_pdr"]
    base = demo.sim.drones["GCS-RELAY"].position
    demo.command("add_jammer", {"x": float(base[0]) + 60, "y": float(base[1]), "power_dbm": 20})
    tick(demo, 30)
    assert demo.sim.metrics["swarm_pdr"] < before


def test_reset_removes_everything_the_operator_added(demo):
    demo.command("add_drone", {"role": "scout", "x": 1200, "y": corridor(demo, 1200)})
    demo.command("add_poi", {"x": 1300, "y": corridor(demo, 1300)})
    demo.command("add_jammer", {"x": 900, "y": corridor(demo, 900)})
    demo.command("kill", {"drone_id": "RELAY-1"})
    demo.command("reset_mission")

    assert sorted(demo.sim.drones) == sorted(demo._initial_drone_ids)
    assert len(demo.world.pois) == len(demo._initial_pois)
    assert demo.rf.jammers == {}
    assert all(d.is_alive for d in demo.sim.drones.values())


def test_scripted_run_can_be_started_from_interactive(demo):
    tick(demo, 50)
    assert demo.command("run_scenario")["ok"]
    assert demo.mode == "scripted"
    assert any(not e.executed for e in demo.sim.events)


# --- election ---------------------------------------------------------------

def test_losing_a_relay_does_not_reshuffle_other_roles(demo):
    """
    The old election re-ranked the whole swarm on every failure, so killing
    one relay could demote the other or move the ground-station link.
    """
    from mesh.election import RelayElection
    tick(demo, 50)
    roles_before = {k: d.role for k, d in demo.sim.drones.items()}

    demo.command("kill", {"drone_id": "RELAY-1"})
    tick(demo, 10)

    for drone_id, role in roles_before.items():
        if drone_id == "RELAY-1":
            continue
        now = demo.sim.drones[drone_id].role
        # Nothing is ever demoted; a scout may be promoted to relay
        if role in (DroneRole.RELAY, DroneRole.GCS_RELAY):
            assert now == role, f"{drone_id} changed from {role} to {now}"
    assert demo.sim.drones["GCS-RELAY"].role == DroneRole.GCS_RELAY

    scouts = [d for d in demo.sim.drones.values()
              if d.is_alive and d.role == DroneRole.SCOUT]
    assert len(scouts) >= RelayElection.MIN_SCOUTS


def test_losing_the_ground_relay_promotes_a_replacement(demo):
    tick(demo, 50)
    demo.command("kill", {"drone_id": "GCS-RELAY"})
    tick(demo, 10)
    gcs = [d for d in demo.sim.drones.values()
           if d.is_alive and d.role == DroneRole.GCS_RELAY]
    assert len(gcs) == 1
