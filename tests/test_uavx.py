"""
UAV-X mission-layer tests: the behaviours the challenge statement asks for.

  - a fixed GCS outside the affected area, and a geofence nobody leaves
  - limited flight time: energy-aware return, landing, recharge, relaunch
  - relay requirement from the terrain, and make-before-break handover
  - packet delivery to the GCS, store-and-forward, data lost with a carrier
  - newly emerging high-priority tasks pre-empting lower-priority work
  - every disturbance type the Stage 2 brief names
  - scenario files, metrics in the challenge's categories, and logs
"""

import json

import numpy as np
import pytest

from gcs.backend.demo_controller import DemoController
from mesh.traffic import TrafficSimulator
from mission.metrics import MissionMetrics
from mission.scenario import build_world, load_scenario
from sim.deconfliction import Deconfliction
from sim.drone import Drone, DroneRole, DroneStatus
from sim.energy import EnergyModel
from sim.guidance import GuidanceLayer, MissionPhase
from sim.terrain import build_terrain
from sim.world import Geofence, World


def tick(demo, seconds):
    for _ in range(int(seconds / demo.dt)):
        demo.step()


@pytest.fixture
def demo():
    d = DemoController(shadow=False)
    yield d
    d.stop()


# --- ground station and geofence ----------------------------------------------

def test_gcs_sits_outside_the_affected_area_with_pads_on_the_ground():
    world = World(terrain=build_terrain())
    world.populate_mission(num_pois=6, rubble_count=0)
    gcs = world.gcs
    assert gcs.position[0] < world.mission_start_x
    assert abs(gcs.position[2] - world.terrain.height_at(*gcs.position[:2]) - gcs.mast_m) < 1e-6
    assert len(gcs.pads) >= 5
    for pad in gcs.pads:
        assert abs(pad[2] - world.terrain.height_at(pad[0], pad[1])) < 1e-6
    fence = world.geofence
    assert fence.contains(*gcs.position[:2])
    assert all(fence.contains(*p.position[:2]) for p in world.pois)


def test_geofence_projects_points_inside_with_a_margin():
    fence = Geofence([[0, 0], [1000, 0], [1000, 500], [0, 500]])
    assert fence.contains(500, 250) and not fence.contains(1200, 250)
    x, y = fence.project_inside(1200, 250, margin=40)
    assert fence.contains(x, y) and fence.distance_to_boundary(x, y) >= 39.0
    # Points already well inside are untouched
    assert fence.project_inside(500, 250, margin=40) == (500.0, 250.0)


def test_guidance_never_commands_a_setpoint_outside_the_fence():
    world = World(terrain=build_terrain())
    guidance = GuidanceLayer(world)
    x = world.mission_start_x + 800
    drone = Drone("UAV-1", np.array([x, world.terrain.corridor_centerline_y(x),
                                     world.terrain.height_at(x, world.terrain.corridor_centerline_y(x)) + 80]))
    drone.target_position = np.array([x, world.terrain.corridor_centerline_y(x) + 2000.0, 900.0])
    guidance._apply_geofence(drone)
    assert world.geofence.contains(*drone.target_position[:2])


# --- energy --------------------------------------------------------------------

def test_return_threshold_grows_with_distance_and_headwind():
    world = World(terrain=build_terrain())
    energy = EnergyModel(world)
    home = world.gcs.pad_for(0)
    near = Drone("A", home + np.array([300.0, 0, 100]))
    far = Drone("B", home + np.array([3000.0, 0, 100]))
    for d in (near, far):
        d.home_position = home.copy()
    assert energy.rth_threshold(far) > energy.rth_threshold(near) + 10.0

    class Wind:
        base_wind = np.array([6.0, 0.0, 0.0])      # blowing up the valley (+x)
    energy.wind = Wind()
    out = energy.travel_time(home, home + np.array([2000.0, 0, 0]))
    back = energy.travel_time(home + np.array([2000.0, 0, 0]), home)
    assert back > out * 1.3                         # the trip home is into the wind


def test_a_task_the_battery_cannot_cover_is_not_assigned():
    world = World(terrain=build_terrain())
    world.populate_mission(num_pois=0, rubble_count=0)
    x = world.mission_end_x
    poi = world.add_poi("FAR", [x, world.terrain.corridor_centerline_y(x)], priority=1)
    guidance = GuidanceLayer(world)
    pad = world.gcs.pad_for(0)
    scout = Drone("UAV-1", pad + np.array([60.0, 0, 60.0]), DroneRole.SCOUT)
    scout.home_position = pad.copy()
    scout.battery = 30.0
    guidance.assign_targets({"UAV-1": scout}, 0.0)
    assert "UAV-1" not in guidance.assignments
    # ...and since a full battery could do it, it goes home to recharge first
    assert guidance.phases["UAV-1"] == MissionPhase.RTH
    assert guidance.rth_reasons["UAV-1"].startswith("recharge")

    fresh = Drone("UAV-2", pad + np.array([60.0, 0, 60.0]), DroneRole.SCOUT)
    fresh.home_position = pad.copy()
    guidance.assign_targets({"UAV-2": fresh}, 0.0)
    assert guidance.assignments.get("UAV-2") == poi.id


def test_low_battery_brings_an_aircraft_home_to_land_recharge_and_relaunch(demo):
    demo.energy.config.recharge_s = 10.0
    demo.command("launch_mission")
    tick(demo, 20)
    drone = next(d for d in demo.sim.drones.values() if d.is_alive and d.role == DroneRole.SCOUT)
    drone.battery = demo.energy.rth_threshold(drone) - 0.5
    tick(demo, 0.1)
    assert demo.guidance.phases[drone.id] in (MissionPhase.RTH, MissionPhase.LANDING)
    assert drone.role == DroneRole.STANDBY
    for _ in range(120):                             # up to 4 minutes home
        tick(demo, 2)
        if drone.on_pad:
            break
    assert drone.on_pad
    assert np.linalg.norm(drone.position[:2] - drone.home_position[:2]) < 1.0
    tick(demo, 20)                                   # 10 s swap, then back to work
    kinds = [e["type"] for e in demo.sim.event_log
             if (e.get("params") or {}).get("drone") == drone.id]
    assert kinds.index("LANDED") < kinds.index("READY") < len(kinds)
    assert "LAUNCH" in kinds[kinds.index("READY"):] or drone.status == DroneStatus.READY
    assert drone.battery > 90.0
    assert demo.mission_metrics.battery_depleted == 0


# --- roles: relay requirement and handover -----------------------------------

def test_relay_requirement_comes_from_the_terrain(demo):
    world = demo.world
    near = world.gcs.position[:2] + np.array([200.0, 0.0])
    x = world.mission_end_x
    far = np.array([x, world.terrain.corridor_centerline_y(x)])
    n_near, _ = demo.roles._chain_to(near)
    n_far, hops = demo.roles._chain_to(far)
    assert n_near == 0
    assert n_far >= 1 and len(hops) == n_far
    # Every planned hop is a working link to the next
    points = [world.gcs.position] + hops
    for a, b in zip(points, points[1:]):
        assert demo.roles.link_ok(a, b)


def test_a_relay_is_relieved_before_it_leaves(demo):
    demo.command("launch_mission")
    tick(demo, 60)
    relay = next(d for d in demo.sim.drones.values() if d.is_alive and d.role == DroneRole.RELAY)
    # One aircraft charged and waiting on a pad
    spare = next(d for d in demo.sim.drones.values() if d.is_alive and d.role == DroneRole.SCOUT
                 and d.id != relay.id)
    demo.guidance.send_home(spare, demo.sim.sim_time, "test")
    spare.position = spare.home_position.copy()
    spare.status, spare.battery = DroneStatus.READY, 100.0
    station = demo.guidance.relay_stations[relay.id].copy()
    relay.battery = demo.energy.handover_threshold(relay, station) - 0.1
    tick(demo, 1.5)
    assert relay.id in demo.roles.handovers
    replacement = demo.sim.drones[demo.roles.handovers[relay.id]["to"]]
    assert replacement.role == DroneRole.RELAY
    # The outgoing relay holds its station until the replacement arrives
    assert demo.guidance.phases[relay.id] != MissionPhase.RTH
    for _ in range(40):
        tick(demo, 5)
        if relay.id not in demo.roles.handovers:
            break
    assert relay.id not in demo.roles.handovers
    assert demo.guidance.phases[relay.id] in (MissionPhase.RTH, MissionPhase.LANDING, MissionPhase.CHARGING)
    assert replacement.role == DroneRole.RELAY and replacement.is_alive
    assert any(r["reason"].startswith("relieved by") for r in demo.roles.reallocations)


# --- traffic ---------------------------------------------------------------------

class _Router:
    def __init__(self, routes):
        self.routes = routes

    def get_route(self, src, dst):
        return self.routes.get(src)


def _two_hop_world():
    world = World(terrain=build_terrain())
    world.populate_mission(num_pois=0, rubble_count=0)
    a = Drone("A", world.gcs.position + np.array([400.0, 0, 100.0]), DroneRole.RELAY)
    b = Drone("B", world.gcs.position + np.array([900.0, 0, 100.0]), DroneRole.SCOUT)
    a.gcs_link, a.neighbors, b.neighbors = 1.0, {"B": 1.0}, {"A": 1.0}
    return world, {"A": a, "B": b}


def test_packets_cross_the_mesh_to_the_gcs_and_survey_data_is_delivered():
    world, drones = _two_hop_world()
    poi = world.add_poi("P", drones["B"].position[:2], priority=1)
    poi.surveyed, poi.surveyed_by = True, "B"
    traffic = TrafficSimulator(world)
    router = _Router({"A": ["A", "GCS"], "B": ["B", "A", "GCS"]})
    for k in range(20):
        traffic.update(drones, router, k * 0.1, 0.1, {"A": (1.0, 1), "B": (1.0, 2)})
    s = traffic.summary()
    assert s["pdr"] == 1.0 and s["connectivity_availability"] == 1.0
    assert poi.delivered
    assert s["latency_ms_mean"] > 0.0


def test_survey_data_waits_in_custody_and_is_offloaded_on_landing():
    world, drones = _two_hop_world()
    poi = world.add_poi("P", drones["B"].position[:2], priority=1)
    poi.surveyed, poi.surveyed_by = True, "B"
    traffic = TrafficSimulator(world)
    no_route = _Router({})
    for k in range(10):
        traffic.update(drones, no_route, k * 0.1, 0.1, {"A": (0.0, 0), "B": (0.0, 0)})
    assert not poi.delivered and traffic.backlog("B") == poi.data_chunks
    assert not drones["B"].connected
    drones["B"].status = DroneStatus.CHARGING       # landed at the GCS
    traffic.update(drones, no_route, 1.1, 0.1, {"A": (0.0, 0)})
    assert poi.delivered and traffic.backlog("B") == 0


def test_data_lost_with_its_carrier_reopens_the_target():
    world, drones = _two_hop_world()
    poi = world.add_poi("P", drones["B"].position[:2], priority=1)
    poi.surveyed, poi.surveyed_by = True, "B"
    traffic = TrafficSimulator(world)
    traffic.update(drones, _Router({}), 0.0, 0.1, {"A": (0.0, 0), "B": (0.0, 0)})
    drones["B"].kill(0.1)
    traffic.update(drones, _Router({}), 0.2, 0.1, {"A": (0.0, 0)})
    assert not poi.surveyed and not poi.delivered
    assert traffic.summary()["data_reopened"] == 1


# --- priorities -----------------------------------------------------------------

def test_a_new_priority_one_task_preempts_lower_priority_work():
    world = World(terrain=build_terrain())
    world.populate_mission(num_pois=0, rubble_count=0)
    x = world.mission_start_x + 900
    low = world.add_poi("LOW", [x, world.terrain.corridor_centerline_y(x)], priority=3)
    guidance = GuidanceLayer(world)
    pad = world.gcs.pad_for(0)
    scout = Drone("UAV-1", pad + np.array([200.0, 0, 80.0]), DroneRole.SCOUT)
    scout.home_position = pad.copy()
    drones = {"UAV-1": scout}
    guidance.assign_targets(drones, 0.0)
    assert guidance.assignments["UAV-1"] == "LOW"
    urgent = world.add_poi("URGENT", [x - 300, world.terrain.corridor_centerline_y(x - 300)],
                           priority=1, release_time=5.0, emergent=True)
    guidance.assign_targets(drones, 1.0)
    assert guidance.assignments["UAV-1"] == "LOW"      # not released yet: the swarm cannot know
    guidance.assign_targets(drones, 6.0)
    assert guidance.assignments["UAV-1"] == "URGENT"
    assert any(e["type"] == "PREEMPT" for e in guidance.events)
    assert not low.surveyed


def test_hidden_tasks_are_not_shown_before_release(demo):
    demo.command("launch_mission")
    demo.world.add_poi("LATER", demo.world.pois[0].position, release_time=500.0, emergent=True)
    tick(demo, 0.1)
    assert "LATER" not in [p["id"] for p in demo.sim._build_telemetry()["pois"]]


# --- disturbances -------------------------------------------------------------

def test_every_disturbance_type_applies_and_expires(demo):
    demo.command("launch_mission")
    tick(demo, 40)
    d = demo.disturbances
    scout = next(x for x in demo.sim.drones.values() if x.is_alive and x.role == DroneRole.SCOUT)

    d.apply("comm_outage", {"uav": scout.id, "duration": 2})
    assert not scout.radio_ok
    d.apply("comm_outage", {"gcs": True, "duration": 2})
    assert demo.sim.packet_loss["GCS"] == 1.0
    d.apply("packet_loss", {"rate": 0.4, "duration": 2})
    assert demo.sim.packet_loss["*"] == 0.4
    d.apply("link_failure", {"a": scout.id, "b": "GCS", "duration": 2})
    assert demo.sim._link_factor(scout.id, "GCS") == 0.0
    d.apply("comm_outage", {"along": 0.5, "radius_m": 600, "duration": 2})
    assert demo.rf.jammers
    tick(demo, 0.2)
    assert scout.gcs_link == 0.0 and not scout.neighbors

    tick(demo, 3)
    assert scout.radio_ok and not demo.sim.packet_loss and not demo.rf.jammers

    n = len(demo.world.pois)
    result = d.apply("new_task", {"region": {"along": 0.5, "radius_m": 120, "priority": 1}})
    added = demo.world.pois[n:]
    assert len(added) == len(result["tasks"]) == 5
    assert all(p.emergent and p.priority == 1 for p in added)

    victim = next(x for x in demo.sim.drones.values() if x.is_alive)
    d.apply("uav_failure", {"target": victim.id})
    assert victim.status == DroneStatus.KILLED
    d.apply("battery_fault", {"target": next(x.id for x in demo.sim.drones.values() if x.is_alive)})
    assert demo.injects.faults
    assert len(demo.mission_metrics.disruptions) >= 6


# --- deconfliction -------------------------------------------------------------

def test_aircraft_on_a_collision_course_are_pushed_apart():
    world = World(terrain=build_terrain())
    x = world.mission_start_x + 600
    y = world.terrain.corridor_centerline_y(x)
    z = world.terrain.height_at(x, y) + 100
    a = Drone("A", np.array([x - 20, y, z]))
    b = Drone("B", np.array([x + 20, y, z]))
    a.velocity, b.velocity = np.array([10.0, 0, 0]), np.array([-10.0, 0, 0])
    a.target_position, b.target_position = b.position.copy(), a.position.copy()
    before = np.linalg.norm(a.target_position - b.target_position)
    changed = Deconfliction(world).apply({"A": a, "B": b})
    assert {d.id for d in changed} == {"A", "B"}
    assert abs(a.target_position[2] - b.target_position[2]) > 5.0
    assert np.linalg.norm(a.target_position - b.target_position) > before


# --- scenarios, metrics and logs -----------------------------------------------

SCENARIOS = ["synthetic_quickstart", "kedarnath_landslide", "uttarkashi_earthquake",
             "stress_hidden_disturbances"]


@pytest.mark.parametrize("name", SCENARIOS)
def test_shipped_scenarios_load_into_a_valid_world(name):
    scenario = load_scenario(f"scenarios/{name}.json")
    world = build_world(scenario)
    assert world.pois and world.time_limit_s
    assert world.gcs.position[0] < world.mission_start_x
    assert all(world.geofence.contains(*p.position[:2]) for p in world.pois)
    assert scenario.disturbances == sorted(scenario.disturbances, key=lambda d: d["t"])


def test_scenario_validation_rejects_unknown_disturbances():
    with pytest.raises(ValueError):
        load_scenario({"disturbances": [{"t": 1, "type": "meteor"}]})


def test_headless_run_writes_the_log_set_and_metrics(tmp_path):
    from run_scenario import run
    scenario = {
        "name": "tiny", "theatre": "synthetic", "seed": 3, "time_limit_s": 300,
        "fleet": {"size": 3, "recharge_s": 30},
        "tasks": {"list": [
            {"id": "POI-001", "along": 0.06, "priority": 2, "category": "blocked_road"},
            {"id": "POI-002", "along": 0.14, "offset_m": 60, "priority": 1, "category": "collapsed_building"},
        ]},
        "disturbances": [
            {"t": 20, "type": "packet_loss", "rate": 0.3, "duration": 10},
            {"t": 30, "type": "new_task", "task": {"along": 0.1, "priority": 1}},
        ],
    }
    path = tmp_path / "tiny.json"
    path.write_text(json.dumps(scenario))
    out = tmp_path / "logs"
    summary = run(str(path), str(out), quiet=True)

    for name in ("run_meta.json", "scenario_resolved.json", "events.jsonl", "uav_state.csv",
                 "links.csv", "packets.csv", "metrics.json"):
        assert (out / name).exists(), name
    for category in ("mission", "communication", "autonomy", "robustness", "safety"):
        assert category in summary
    assert summary["mission"]["tasks_released"] == 3
    assert summary["mission"]["tasks_delivered"] >= 2
    assert summary["communication"]["packet_delivery_ratio"] > 0.5
    assert summary["safety"]["collisions"] == 0
    assert summary["safety"]["geofence_violations"] == 0
    assert summary["safety"]["battery_depleted"] == 0
    scores = MissionMetrics.indicative_scores(summary)
    assert 0 <= scores["weighted_95pct_of_rubric"] <= 100
    meta = json.loads((out / "run_meta.json").read_text())
    assert meta["scenario"]["name"] == "tiny"
