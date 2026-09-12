import numpy as np
from sim.world import World
from sim.drone import Drone, DroneRole, DroneStatus
from sim.physics import FlightDynamics
from sim.rf_channel import RFChannel
from sim.wind import WindField
from sim.runner import SimulationRunner


def test_world_elevation_and_los():
    world = World(bounds=(200.0, 200.0, 100.0), ground_level=0.0)
    world.add_obstacle(center=[100.0, 100.0, 25.0], size=[20.0, 20.0, 25.0], material="concrete")
    
    # Elevation lookup
    elev = world.get_terrain_height(100.0, 100.0)
    assert elev >= 0.0

    # Line of sight clear above obstacle
    p1 = np.array([80.0, 80.0, 60.0])
    p2 = np.array([120.0, 120.0, 60.0])
    has_los, _ = world.check_line_of_sight(p1, p2)
    assert has_los is True

    # Line of sight occluded through tall obstacle
    p3 = np.array([70.0, 100.0, 15.0])
    p4 = np.array([130.0, 100.0, 15.0])
    has_los_occluded, occluding = world.check_line_of_sight(p3, p4)
    assert has_los_occluded is False
    assert len(occluding) > 0


def test_drone_state_and_battery():
    drone = Drone(
        drone_id="drone-alpha",
        position=np.array([100.0, 100.0, 50.0]),
        role=DroneRole.SCOUT,
    )
    assert drone.status == DroneStatus.ACTIVE
    init_bat = drone.battery
    drone.thrust_command = np.array([0.0, 0.0, 15.0])
    drone.update_battery(dt=10.0)
    assert drone.battery < init_bat


def test_flight_dynamics():
    dynamics = FlightDynamics(mass=1.5)
    pos = np.array([0.0, 0.0, 50.0])
    vel = np.array([5.0, 0.0, 0.0])
    q = np.array([1.0, 0.0, 0.0, 0.0])
    omega = np.zeros(3)
    thrust_cmd = np.array([0.0, 0.0, 1.5 * 9.81 + 1.0])
    wind = np.zeros(3)
    
    res = dynamics.step(
        position=pos,
        velocity=vel,
        orientation=q,
        angular_velocity=omega,
        thrust_command=thrust_cmd,
        yaw_rate_command=0.0,
        wind_velocity=wind,
        dt=0.1
    )
    assert res["position"][2] > pos[2] # climbs
    assert np.isfinite(res["position"]).all()
    assert np.isfinite(res["velocity"]).all()


def test_rf_channel_link_budget():
    rf = RFChannel(frequency_mhz=900.0, noise_floor_dbm=-100.0)
    
    # Close distance -> high RSSI & PDR
    link_close = rf.compute_link_quality(
        tx_power_dbm=20.0,
        tx_gain_dbi=2.0,
        rx_gain_dbi=2.0,
        distance_m=10.0,
        occlusion_db=0.0
    )
    assert link_close["rssi_dbm"] > -60.0
    assert link_close["pdr"] > 0.90

    # Large distance + heavy occlusion + active jamming -> degraded PDR & SNR
    rf.jamming_active = True
    rf.jamming_power_dbm = -50.0
    link_jammed = rf.compute_link_quality(
        tx_power_dbm=20.0,
        tx_gain_dbi=2.0,
        rx_gain_dbi=2.0,
        distance_m=400.0,
        occlusion_db=50.0
    )
    assert link_jammed["rssi_dbm"] < link_close["rssi_dbm"]
    assert link_jammed["snr_db"] < link_close["snr_db"]
    assert link_jammed["pdr"] < link_close["pdr"]


def test_wind_field():
    wind = WindField(base_wind=np.array([5.0, 0.0, 0.0]), turbulence_intensity=0.2)
    sample1 = wind.get_wind_at(np.array([100.0, 50.0, 30.0]), sim_time=0.0)
    sample2 = wind.get_wind_at(np.array([100.0, 50.0, 30.0]), sim_time=1.0)
    assert sample1.shape == (3,)
    assert sample2.shape == (3,)


def test_simulation_runner():
    world = World()
    wind = WindField()
    rf = RFChannel()
    runner = SimulationRunner(world=world, wind=wind, rf_channel=rf, dt=0.05)
    
    drone = runner.add_drone(
        drone_id="drone-01",
        position=[10.0, 10.0, 20.0],
        role=DroneRole.SCOUT,
    )
    drone.velocity = np.array([1.0, 0.0, 0.0])
    
    runner.step()
    assert runner.tick_count == 1
    assert abs(runner.sim_time - 0.05) < 1e-4
