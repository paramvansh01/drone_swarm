"""
Operator (interactive-mode) tests.

Everything a judge can do from the dashboard goes through
DemoController.command(). These check the behaviours they would notice on
screen: the fleet waits on its pads until launch, things appear where clicked,
failed aircraft fall, the autonomy stops overriding a direct order, a newly
reported emergency is picked up, and terrain genuinely shields an aircraft
from an interference source.
"""

import numpy as np
import pytest

from gcs.backend.demo_controller import DemoController
from sim.drone import DroneRole, DroneStatus


@pytest.fixture
def demo():
    d = DemoController(phase_duration=45.0, shadow=False)      # interactive by default
    yield d
    d.stop()


def tick(demo, n):
    for _ in range(n):
        demo.step()


def corridor(demo, x):
    return float(demo.world.terrain.corridor_centerline_y(x))


def launched(demo, seconds=30.0):
    """Launch the mission and fly until the fleet is up."""
    demo.command("launch_mission")
    tick(demo, int(seconds / demo.dt))
    return [d for d in demo.sim.drones.values() if d.is_alive]


def first(demo, role):
    return next(d for d in sorted(demo.sim.drones.values(), key=lambda d: d.id)
                if d.is_alive and d.role == role)


def test_planning_keeps_the_fleet_on_its_pads(demo):
    assert demo.mode == "interactive"
    assert demo.mission_phase == "PLANNING"
    assert demo.sim.events == []
    tick(demo, 100)
    assert all(d.status == DroneStatus.READY for d in demo.sim.drones.values())
    assert not any(d.is_alive for d in demo.sim.drones.values())
    assert not demo.guidance.assignments


def test_launch_puts_the_fleet_up_in_sequence(demo):
    airborne = launched(demo, 30.0)
    assert demo.mission_phase == "LIVE"
    assert len(airborne) == len(demo.sim.drones)
    times = sorted(e["time"] for e in demo.sim.event_log if e["type"] == "LAUNCH")
    assert len(times) == len(demo.sim.drones)
    # Take-offs are spaced so aircraft never climb out of the pads together
    assert min(np.diff(times)) >= demo.roles.LAUNCH_SPACING_S - 1e-6
    assert any(d.role == DroneRole.SCOUT for d in airborne)
    assert demo.guidance.assignments


def test_add_drone_appears_where_clicked(demo):
    x, y = 1500.0, corridor(demo, 1500.0)
    result = demo.command("add_drone", {"role": "scout", "x": x, "y": y})
    assert result["ok"]
    drone = demo.sim.drones[result["drone_id"]]
    assert drone.role == DroneRole.SCOUT
    assert abs(drone.position[0] - x) < 1e-6 and abs(drone.position[1] - y) < 1e-6
    assert demo.world.agl(drone.position) > 30.0


def test_add_drone_without_a_position_joins_the_fleet_on_a_pad(demo):
    result = demo.command("add_drone", {})
    assert result["ok"]
    drone = demo.sim.drones[result["drone_id"]]
    assert drone.status == DroneStatus.READY and drone.on_pad


def test_add_drone_rejects_bad_input_and_respects_cap(demo):
    assert not demo.command("add_drone", {"role": "tank", "x": 1000, "y": 2000})["ok"]
    y = corridor(demo, 900)
    while len(demo.sim.drones) < demo.MAX_DRONES:
        assert demo.command("add_drone", {"role": "relay", "x": 900, "y": y})["ok"]
    capped = demo.command("add_drone", {"role": "relay", "x": 900, "y": y})
    assert not capped["ok"] and "limited" in capped["error"]


def test_points_outside_the_geofence_are_refused(demo):
    x = 1500.0
    outside = corridor(demo, x) + 1500.0
    assert not demo.world.geofence.contains(x, outside)
    assert not demo.command("add_poi", {"x": x, "y": outside})["ok"]
    assert not demo.command("add_drone", {"role": "scout", "x": x, "y": outside})["ok"]


def test_unknown_command_and_unknown_drone_fail_cleanly(demo):
    assert not demo.command("launch_missiles", {})["ok"]
    assert not demo.command("kill", {"drone_id": "NOPE"})["ok"]
    # The ground station is not an aircraft and cannot be "failed"
    assert not demo.command("kill", {"drone_id": "GCS"})["ok"]


def test_failed_drone_falls_to_the_ground(demo):
    launched(demo, 40.0)
    drone = first(demo, DroneRole.SCOUT)
    assert demo.command("kill", {"drone_id": drone.id})["ok"]
    start_agl = demo.world.agl(drone.position)
    tick(demo, 500)                                  # 10 s
    assert start_agl > 20.0
    assert demo.world.agl(drone.position) < 1.0
    assert drone.neighbors == {}
    assert drone.gcs_link == 0.0


def test_return_to_service_puts_a_failed_drone_back_on_its_pad(demo):
    launched(demo, 30.0)
    drone = first(demo, DroneRole.SCOUT)
    demo.command("kill", {"drone_id": drone.id})
    tick(demo, 300)
    assert demo.command("revive", {"drone_id": drone.id})["ok"]
    assert drone.status == DroneStatus.READY
    assert np.allclose(drone.position, drone.home_position)


def test_goto_overrides_autonomy_until_released(demo):
    launched(demo, 20.0)
    drone = first(demo, DroneRole.SCOUT)
    x, y = 1100.0, corridor(demo, 1100.0) + 100.0
    assert demo.command("goto", {"drone_id": drone.id, "x": x, "y": y})["ok"]

    # The GNN must not move an aircraft the operator is flying
    demo.guidance.set_relay_station(drone.id, np.array([3000.0, 2000.0, 900.0]))
    assert drone.id in demo.guidance.manual_targets
    assert drone.id not in demo.guidance.relay_stations

    tick(demo, 3000)                                 # 60 s
    assert np.linalg.norm(drone.position[:2] - np.array([x, y])) < 60.0

    assert demo.command("release", {"drone_id": drone.id})["ok"]
    assert drone.id not in demo.guidance.manual_targets


def test_a_new_emergency_is_picked_up_at_once(demo):
    launched(demo, 30.0)
    result = demo.command("add_poi", {"x": 1300.0, "y": corridor(demo, 1300.0), "priority": 1})
    assert result["ok"]
    poi = next(p for p in demo.world.pois if p.id == result["poi_id"])
    assert poi.emergent and poi.priority == 1
    tick(demo, 5)
    assert result["poi_id"] in demo.guidance.assignments.values()


def test_terrain_shields_a_drone_from_interference(demo):
    """
    An interference source is a transmitter at a place. Two receivers at the
    same distance from it — one with clear line of sight, one behind a ridge —
    must see very different interference.
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


def test_interference_degrades_nearby_links(demo):
    launched(demo, 30.0)
    before = demo.sim.metrics["swarm_pdr"]
    base = demo.world.gcs.position
    demo.command("add_interference", {"x": float(base[0]) + 250, "y": float(base[1]), "power_dbm": 20})
    tick(demo, 30)
    assert demo.sim.metrics["swarm_pdr"] < before


def test_reset_returns_the_fleet_to_planning(demo):
    launched(demo, 20.0)
    demo.command("add_drone", {"role": "scout", "x": 1200, "y": corridor(demo, 1200)})
    demo.command("add_poi", {"x": 1300, "y": corridor(demo, 1300)})
    demo.command("add_interference", {"x": 900, "y": corridor(demo, 900)})
    demo.command("kill", {"drone_id": first(demo, DroneRole.SCOUT).id})
    demo.command("reset_mission")

    assert demo.mission_phase == "PLANNING"
    assert sorted(demo.sim.drones) == sorted(demo._initial_drone_ids)
    assert len(demo.world.pois) == len(demo._initial_pois)
    assert demo.rf.jammers == {}
    assert all(d.status == DroneStatus.READY for d in demo.sim.drones.values())
    assert demo.roles.reallocations == []


def test_scripted_demo_can_be_started_from_planning(demo):
    tick(demo, 50)
    assert demo.command("run_scenario")["ok"]
    assert demo.mode == "scripted"
    assert demo.mission_phase == "LIVE"
    assert demo.director is not None and demo.director.pending > 0


# --- failover ---------------------------------------------------------------

def test_losing_a_relay_does_not_demote_other_relays(demo):
    """
    The old election re-ranked the whole swarm on every failure, so losing one
    relay could demote another. Failover only fills the vacant slot.
    """
    from mesh.election import RelayElection
    launched(demo, 40.0)
    relay = first(demo, DroneRole.RELAY)
    roles_before = {k: d.role for k, d in demo.sim.drones.items()}

    demo.command("kill", {"drone_id": relay.id})
    tick(demo, 10)

    for drone_id, role in roles_before.items():
        if drone_id == relay.id:
            continue
        if role == DroneRole.RELAY:
            assert demo.sim.drones[drone_id].role == DroneRole.RELAY
    scouts = [d for d in demo.sim.drones.values() if d.is_alive and d.role == DroneRole.SCOUT]
    assert len(scouts) >= RelayElection.MIN_SCOUTS
    assert any(e["type"] == "ELECTION" for e in demo.sim.event_log)
