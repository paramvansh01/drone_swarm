"""
The autonomy is never told about a disturbance; it has to notice.

Each test injects something through the same path a scenario uses, then
checks that the swarm's belief changes only once the evidence a real swarm
would have (missing heartbeats, noise readings, battery current, the cloud
sensor, radio ranging, missing data) supports it — and that the autonomy's
source code never reads the simulator's truth.
"""

import re
from pathlib import Path

import numpy as np
import pytest

from gcs.backend.demo_controller import DemoController
from sim.drone import DroneRole, DroneStatus
from sim.guidance import MissionPhase

ROOT = Path(__file__).resolve().parent.parent


def tick(demo, seconds):
    for _ in range(int(round(seconds / demo.dt))):
        demo.step()


@pytest.fixture
def demo():
    d = DemoController(shadow=False)
    d.command("launch_mission")
    tick(d, 40)
    yield d
    d.stop()


def first(demo, role):
    return next(d for d in sorted(demo.sim.drones.values(), key=lambda d: d.id)
                if d.is_alive and d.role == role)


# --- source audit ---------------------------------------------------------------

AUTONOMY = ["mesh/awareness.py", "mesh/roles.py", "mesh/election.py", "mesh/routing.py",
            "mesh/interference.py", "sim/guidance.py", "sim/energy.py", "sim/deconfliction.py",
            "gnn/relay_optimizer.py", "gnn/topology_net.py", "scm/causal_layer.py"]
# Simulator truth the autonomy must never read: fault severity, true
# interference sources, the global noise switch, true cloud base, true
# navigation error, true failure status/time, the injects themselves.
FORBIDDEN = [r"\.jammers\b", r"jamming_active", r"jamming_power_dbm", r"\.health\b",
             r"power_factor", r"DroneStatus\.KILLED", r"\.killed_at", r"nav_error",
             r"world\.ceiling_agl", r"node_noise", r"\brf\.noise_at\(", r"\binjects\b",
             r"\.noise_floor_dbm", r"rf_channel\.extra_loss_db",
             r"self\.rf\.extra_loss_db(?!\s*=)",
             # every task in the world includes ones not yet reported
             # (a lookup by id of an already-assigned task is fine)
             r"for \w+ in (self\.)?(world|w)\.pois(?!.*(released|\.id ==))"]


@pytest.mark.parametrize("path", AUTONOMY)
def test_autonomy_source_never_reads_simulator_truth(path):
    offending = []
    for number, line in enumerate((ROOT / path).read_text().splitlines(), 1):
        code = line.split("#", 1)[0] if "eval-only" not in line else ""
        if code.strip().startswith(('"', "'")):
            continue
        for pattern in FORBIDDEN:
            if re.search(pattern, code):
                offending.append(f"{path}:{number}: {line.strip()}")
    assert not offending, "autonomy reads simulator truth:\n" + "\n".join(offending)


# --- failures are detected by missing heartbeats ------------------------------------

def test_a_failed_relay_is_detected_by_its_silence_not_its_status(demo):
    relay = first(demo, DroneRole.RELAY)
    assert not demo.awareness.suspected(relay.id)
    demo.disturbances.apply("uav_failure", {"target": relay.id})
    tick(demo, 0.1)
    # Not yet: one missed heartbeat is not a failure
    assert not any(e["type"] == "ELECTION" for e in demo.sim.event_log)
    tick(demo, 0.4)
    assert demo.awareness.suspected(relay.id)
    heals = [e for e in demo.sim.event_log if e["type"] == "ELECTION"]
    assert heals, "failover never ran"
    assert heals[-1]["params"]["latency_ms"] < 400.0


def test_a_radio_outage_looks_like_a_failure_and_the_node_rejoins(demo):
    relay = first(demo, DroneRole.RELAY)
    demo.disturbances.apply("comm_outage", {"uav": relay.id, "duration": 3})
    tick(demo, 1.0)
    assert relay.is_alive                               # physically still flying
    assert demo.awareness.suspected(relay.id)           # but the swarm cannot hear it
    tick(demo, 4.0)
    assert relay.radio_ok and not demo.awareness.suspected(relay.id)


def test_the_gcs_writes_off_data_only_after_the_carrier_stays_silent(demo):
    scout = first(demo, DroneRole.SCOUT)
    poi = next(p for p in demo.world.pois if not p.surveyed)
    demo.guidance.assignments.pop(scout.id, None)
    poi.surveyed, poi.surveyed_by, poi.surveyed_at = True, scout.id, demo.sim.sim_time
    demo.disturbances.apply("uav_failure", {"target": scout.id})
    tick(demo, 10)
    assert poi.surveyed and not poi.delivered           # silence is not yet proof
    tick(demo, 15)
    assert not poi.surveyed                             # written off and re-opened
    assert any(e["type"] == "DATA_LOST" for e in demo.sim.event_log)


# --- faults are seen through the battery monitor -------------------------------------

def test_a_battery_fault_is_learned_from_current_draw(demo):
    drone = first(demo, DroneRole.SCOUT)
    before = demo.energy.rth_threshold(drone)
    demo.disturbances.apply("battery_fault", {"target": drone.id, "severity": 0.45})
    assert demo.energy.rth_threshold(drone) == pytest.approx(before, rel=0.05)  # not told
    tick(demo, 30)
    assert drone.drain_factor > 1.3
    assert demo.energy.rth_threshold(drone) > before * 1.2


# --- interference: only what the swarm has measured and localised -------------------

def test_interference_is_planned_from_estimates_not_from_the_true_source(demo):
    x = demo.world.mission_start_x + 900
    y = float(demo.world.terrain.corridor_centerline_y(x))
    demo.add_interference(x, y, 15.0)
    point = np.array([x + 50, y, demo.world.terrain.height_at(x + 50, y) + 100])
    # Right after it switches on the swarm knows nothing about it
    assert demo.awareness.interference_at(point) < -95.0
    tick(demo, 8)
    # ...after receivers and DF arrays have reported, it is in the plan
    assert demo.rf.ew_emitters, "the swarm never localised the source"
    assert demo.awareness.interference_at(point) > -90.0


def test_an_area_wide_noise_rise_is_measured(demo):
    assert demo.awareness.global_noise_dbm < -97.0
    demo.disturbances.apply("comm_outage", {"scope": "global", "noise_db": 15, "duration": 20})
    tick(demo, 1)
    assert demo.awareness.global_noise_dbm > -90.0
    assert demo.relay_optimizer.measured_noise_dbm > -90.0


# --- weather and navigation ------------------------------------------------------

def test_the_cloud_base_is_found_by_the_optical_sensors(demo):
    demo.disturbances.apply("weather", {"kind": "heavy_rain", "rate_mm_h": 60})
    assert demo.world.ceiling_agl is not None
    assert demo.guidance.ceiling_agl is None            # not told
    tick(demo, 20)
    assert demo.awareness.ceiling_agl is not None       # found by flying into it
    assert demo.guidance.ceiling_agl == demo.awareness.ceiling_agl
    assert demo.awareness.ceiling_agl <= demo.world.ceiling_agl


def test_gnss_degradation_is_caught_by_radio_ranging(demo):
    demo.disturbances.apply("weather", {"kind": "gps_denial", "radius_m": 5000})
    tick(demo, 1)
    assert not demo.injects.nav_fallback                # not told
    for _ in range(60):
        tick(demo, 1)
        if demo.injects.nav_fallback:
            break
    assert demo.injects.nav_fallback
    assert demo.awareness.nav_residual_m > demo.awareness.NAV_RESIDUAL_M
    assert any(e["type"] == "GNSS" for e in demo.sim.event_log)


def test_lost_link_failsafe_runs_on_acknowledgements(demo):
    scout = first(demo, DroneRole.SCOUT)
    demo.disturbances.apply("comm_outage", {"uav": scout.id, "duration": 200})
    tick(demo, 2)
    assert demo.awareness.has_gcs_link(scout.id)        # acks still recent
    tick(demo, 4)
    assert not demo.awareness.has_gcs_link(scout.id)
    tick(demo, demo.guidance.LOST_LINK_RTH_S)
    assert demo.guidance.phases[scout.id] in (MissionPhase.RTH, MissionPhase.LANDING)
    assert "lost-link" in demo.guidance.rth_reasons[scout.id]
