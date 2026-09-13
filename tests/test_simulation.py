"""Simulation engine tests: terrain, world, physics, RF, wind, guidance."""

import numpy as np

from sim.terrain import Terrain, TerrainConfig, build_terrain
from sim.world import World
from sim.drone import Drone, DroneRole, DroneStatus
from sim.physics import FlightDynamics
from sim.rf_channel import RFChannel
from sim.wind import WindField
from sim.guidance import GuidanceLayer, MissionPhase
from sim.runner import SimulationRunner, EventType


# --- terrain ---------------------------------------------------------------

def test_terrain_is_deterministic():
    """Same seed must give a bit-identical surface on every node."""
    a = build_terrain(seed=1234)
    b = build_terrain(seed=1234)
    assert a.checksum() == b.checksum()
    assert np.array_equal(a.heightmap, b.heightmap)

    different = build_terrain(seed=5678)
    assert different.checksum() != a.checksum()


def test_terrain_has_real_relief():
    """The valley must actually be enclosed by high ground."""
    terrain = build_terrain()
    meta = terrain.get_metadata()

    relief = meta["max_height_m"] - meta["min_height_m"]
    assert relief > 600, f"expected mountain-scale relief, got {relief:.0f} m"

    # The corridor floor must sit well below the ground 500 m to either side
    x = 1500.0
    cy = float(terrain.corridor_centerline_y(x))
    floor = terrain.height_at(x, cy)
    left = terrain.height_at(x, cy - 500)
    right = terrain.height_at(x, cy + 500)

    assert max(left, right) - floor > 200, "corridor is not enclosed by terrain"


def test_terrain_encode_roundtrip():
    """The quantised payload the renderer receives must match the source."""
    import base64

    terrain = build_terrain(seed=99)
    payload = terrain.encode()

    raw = base64.b64decode(payload["data"])
    quantised = np.frombuffer(raw, dtype="<u2")
    assert quantised.size == payload["resolution"] ** 2

    lo, hi = payload["quantise_min_m"], payload["quantise_max_m"]
    decoded = lo + quantised.astype(np.float64) * (hi - lo) / 65535.0
    decoded = decoded.reshape(terrain.heightmap.shape)

    # uint16 over ~940 m of relief is ~1.4 cm per step
    assert np.max(np.abs(decoded - terrain.heightmap)) < 0.05


def test_terrain_bilinear_matches_grid():
    terrain = build_terrain()
    cell = terrain.cell_size
    for iy in (10, 100, 400):
        for ix in (10, 100, 400):
            expected = terrain.heightmap[iy, ix]
            got = terrain.height_at(ix * cell, iy * cell)
            assert abs(got - expected) < 0.01


# --- world / RF ------------------------------------------------------------

def test_line_of_sight_follows_terrain():
    world = World()
    terrain = world.terrain
    cy = terrain.corridor_centerline_y

    # Along the corridor at altitude: clear
    x1, x2 = 600.0, 1400.0
    p1 = np.array([x1, float(cy(x1)), terrain.height_at(x1, float(cy(x1))) + 150])
    p2 = np.array([x2, float(cy(x2)), terrain.height_at(x2, float(cy(x2))) + 150])
    assert world.compute_rf_occlusion_db(p1, p2) < 5.0

    # Across a ridge at low altitude: obstructed
    p3 = np.array([x1, float(cy(x1)) + 800, terrain.height_at(x1, float(cy(x1)) + 800) + 20])
    assert world.compute_rf_occlusion_db(p1, p3) > 15.0


def test_knife_edge_loss_is_monotonic():
    """Deeper obstruction must never produce less loss."""
    losses = [World._knife_edge_loss_db(v) for v in (-2.0, -0.5, 0.0, 1.0, 3.0, 6.0)]
    assert losses[0] == 0.0
    for earlier, later in zip(losses, losses[1:]):
        assert later >= earlier - 1e-9


def test_pdr_falls_with_obstruction():
    rf = RFChannel(frequency_mhz=900.0)
    clear = rf.compute_link_quality(27.0, 3.0, 3.0, 800.0, occlusion_db=0.0)
    blocked = rf.compute_link_quality(27.0, 3.0, 3.0, 800.0, occlusion_db=60.0)
    assert clear["link_quality"] > 0.9
    assert blocked["link_quality"] < 0.1


def test_pdr_measurement_is_stable_on_a_steady_link():
    """
    A stationary link must not swing wildly between measurements.

    PDR is averaged over a packet burst; a single fading draw made the
    reported value jump enough to swamp real causal effects.
    """
    rf = RFChannel(frequency_mhz=900.0)
    samples = [
        rf.compute_link_quality(27.0, 3.0, 3.0, 900.0, occlusion_db=18.0)["link_quality"]
        for _ in range(40)
    ]
    assert np.std(samples) < 0.12, f"PDR too noisy: std={np.std(samples):.3f}"


def test_jamming_raises_noise_floor():
    rf = RFChannel()
    before = rf.compute_link_quality(27.0, 3.0, 3.0, 1000.0)["link_quality"]
    rf.enable_jamming(-70.0)
    after = rf.compute_link_quality(27.0, 3.0, 3.0, 1000.0)["link_quality"]
    assert after < before


# --- wind ------------------------------------------------------------------

def test_wind_shear_uses_height_above_ground():
    """
    Wind must scale with AGL, not with elevation above sea level.

    Using absolute altitude produced 120 m/s at a 900 m valley floor.
    """
    terrain = build_terrain()
    wind = WindField(base_wind=np.array([7.0, 0.0, 0.0]),
                     turbulence_intensity=1.0, terrain=terrain)

    x, y = 1500.0, float(terrain.corridor_centerline_y(1500.0))
    ground = terrain.height_at(x, y)

    speeds = [
        np.linalg.norm(wind.get_wind_at(np.array([x, y, ground + 100]), t * 0.02, 0.02))
        for t in range(400)
    ]
    assert np.mean(speeds) < 25.0, f"wind unrealistically strong: {np.mean(speeds):.1f} m/s"
    assert np.mean(speeds) > 2.0


def test_wind_increases_with_altitude():
    terrain = build_terrain()
    wind = WindField(base_wind=np.array([6.0, 0.0, 0.0]),
                     turbulence_intensity=0.0, terrain=terrain)
    x, y = 1500.0, float(terrain.corridor_centerline_y(1500.0))
    ground = terrain.height_at(x, y)

    low = np.linalg.norm(wind.get_wind_at(np.array([x, y, ground + 10]), 0.0, 0.02))
    high = np.linalg.norm(wind.get_wind_at(np.array([x, y, ground + 300]), 0.0, 0.02))
    assert high > low


# --- physics ---------------------------------------------------------------

def test_hover_equilibrium():
    """Commanding exactly weight must hold altitude."""
    physics = FlightDynamics()
    position = np.array([0.0, 0.0, 100.0])
    velocity = np.zeros(3)
    orientation = np.array([1.0, 0.0, 0.0, 0.0])
    omega = np.zeros(3)

    for _ in range(200):
        result = physics.step(
            position, velocity, orientation, omega,
            thrust_command=physics.compute_hover_thrust(),
            yaw_rate_command=0.0, wind_velocity=np.zeros(3),
            dt=0.02, ground_height=0.0,
        )
        position, velocity = result["position"], result["velocity"]
        orientation, omega = result["orientation"], result["angular_velocity"]

    assert abs(position[2] - 100.0) < 0.5
    assert np.linalg.norm(velocity) < 0.2


def test_attitude_lags_command():
    """
    A sudden lateral force command must not produce instant lateral thrust —
    the airframe has to tilt first, and that takes time.
    """
    physics = FlightDynamics()
    orientation = np.array([1.0, 0.0, 0.0, 0.0])
    force = np.array([12.0, 0.0, 1.9 * 9.81])

    result = physics.step(
        np.array([0.0, 0.0, 100.0]), np.zeros(3), orientation, np.zeros(3),
        thrust_command=force, yaw_rate_command=0.0,
        wind_velocity=np.zeros(3), dt=0.02, ground_height=0.0,
    )

    # After one 20 ms step the achieved tilt is a fraction of the commanded one
    commanded_tilt = np.arctan2(12.0, 1.9 * 9.81)
    assert 0.0 < result["tilt_rad"] < commanded_tilt


def test_drag_responds_to_airspeed_not_groundspeed():
    """A hovering aircraft in wind still experiences drag."""
    physics = FlightDynamics()
    still = physics.compute_drag(np.zeros(3), np.zeros(3))
    in_wind = physics.compute_drag(np.zeros(3), np.array([10.0, 0.0, 0.0]))
    assert np.linalg.norm(still) < 1e-6
    assert np.linalg.norm(in_wind) > 1.0


def test_ground_contact_stops_descent():
    physics = FlightDynamics()
    result = physics.step(
        np.array([0.0, 0.0, 5.0]), np.array([0.0, 0.0, -20.0]),
        np.array([1.0, 0.0, 0.0, 0.0]), np.zeros(3),
        thrust_command=np.zeros(3), yaw_rate_command=0.0,
        wind_velocity=np.zeros(3), dt=0.02, ground_height=4.9,
    )
    assert result["position"][2] >= 4.9
    assert result["velocity"][2] >= 0.0


# --- guidance --------------------------------------------------------------

def test_guidance_keeps_setpoint_inside_geofence():
    world = World()
    world.populate_mission(num_pois=3, rubble_count=2)
    guidance = GuidanceLayer(world)

    cy = world.terrain.corridor_centerline_y
    x = 500.0
    y = float(cy(x))
    drone = Drone("SCOUT-1", np.array([x, y, world.terrain.height_at(x, y) + 80]),
                  DroneRole.SCOUT)

    drones = {"SCOUT-1": drone}
    for _ in range(50):
        guidance.update(drones, 0.0, 0.02)

    setpoint = drone.target_position
    assert setpoint is not None
    agl = setpoint[2] - world.terrain.height_at(setpoint[0], setpoint[1])
    assert world.min_agl - 1e-6 <= agl <= world.max_agl + 1e-6


def test_guidance_carrot_stays_bounded():
    """
    The controller must never be handed a kilometre-scale position error —
    it is trained on bounded errors.
    """
    world = World()
    world.populate_mission(num_pois=4, rubble_count=2)
    guidance = GuidanceLayer(world)

    x = 400.0
    y = float(world.terrain.corridor_centerline_y(x))
    drone = Drone("SCOUT-1", np.array([x, y, world.terrain.height_at(x, y) + 90]),
                  DroneRole.SCOUT)
    drones = {"SCOUT-1": drone}

    guidance.update(drones, 0.0, 0.02)
    error = np.linalg.norm(drone.target_position - drone.position)
    assert error <= GuidanceLayer.LOOKAHEAD_M + 60.0


def test_low_battery_triggers_deterministic_rth():
    world = World()
    world.populate_mission(num_pois=2, rubble_count=1)
    guidance = GuidanceLayer(world)

    x = 1800.0
    y = float(world.terrain.corridor_centerline_y(x))
    drone = Drone("SCOUT-1", np.array([x, y, world.terrain.height_at(x, y) + 120]),
                  DroneRole.SCOUT)
    drone.battery = 10.0        # below the 22% reserve

    guidance.update({"SCOUT-1": drone}, 5.0, 0.02)

    assert guidance.phases["SCOUT-1"] == MissionPhase.RTH
    assert drone.status == DroneStatus.RETURNING


# --- runner ----------------------------------------------------------------

def _build_runner():
    world = World()
    world.populate_mission(num_pois=3, rubble_count=2)
    wind = WindField(base_wind=np.array([5.0, 1.0, 0.0]),
                     turbulence_intensity=1.0, terrain=world.terrain)
    rf = RFChannel(frequency_mhz=900.0)
    runner = SimulationRunner(world=world, wind=wind, rf_channel=rf, dt=0.02)

    cy = world.terrain.corridor_centerline_y
    base_x = 350.0
    base_y = float(cy(base_x))
    ground = world.terrain.height_at(base_x, base_y)

    runner.add_drone("GCS-RELAY", [base_x, base_y, ground + 100], DroneRole.GCS_RELAY)
    runner.add_drone("RELAY-1", [base_x + 30, base_y, ground + 120], DroneRole.RELAY)
    runner.add_drone("SCOUT-1", [base_x + 60, base_y, ground + 90], DroneRole.SCOUT)
    runner.guidance = GuidanceLayer(world)
    return runner


def test_runner_ticks_without_losing_aircraft():
    runner = _build_runner()
    for _ in range(500):
        runner.tick()

    assert runner.tick_count == 500
    for drone in runner.drones.values():
        assert np.all(np.isfinite(drone.position)), "aircraft state diverged"
        agl = runner.world.agl(drone.position)
        assert agl > -1.0, "aircraft flew into terrain"


def test_rf_links_are_symmetric():
    runner = _build_runner()
    for _ in range(20):
        runner.tick()

    for drone in runner.drones.values():
        for neighbour_id, quality in drone.neighbors.items():
            reciprocal = runner.drones[neighbour_id].neighbors.get(drone.id)
            assert reciprocal is not None
            assert abs(reciprocal - quality) < 1e-9


def test_killed_node_clears_its_links():
    runner = _build_runner()
    for _ in range(20):
        runner.tick()

    runner.drones["RELAY-1"].kill()
    runner.tick()

    assert runner.drones["RELAY-1"].neighbors == {}
    for drone in runner.drones.values():
        assert "RELAY-1" not in drone.neighbors


def test_scheduled_events_fire_once():
    runner = _build_runner()
    runner.schedule_event(0.5, EventType.JAMMING_START, power_dbm=-70.0)
    runner.schedule_event(1.0, EventType.JAMMING_STOP)

    for _ in range(30):
        runner.tick()
    assert runner.rf.jamming_active

    for _ in range(40):
        runner.tick()
    assert not runner.rf.jamming_active


def test_backhaul_pdr_reflects_connectivity():
    runner = _build_runner()
    for _ in range(30):
        runner.tick()
    healthy = runner.metrics["backhaul_pdr"]

    # Move the scout far away and re-evaluate
    runner.drones["SCOUT-1"].position = np.array([3800.0, 400.0, 1500.0])
    for _ in range(5):
        runner.tick()

    assert runner.metrics["backhaul_pdr"] < healthy
