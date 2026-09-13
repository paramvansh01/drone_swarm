"""
Structural causal model and intervention tests.

The interesting assertions here are about the engine's *restraint*: that it
declines to claim a causal effect when its identifying assumptions fail, and
that it does not mistake channel noise for a result. A diagnostic engine that
always produces a confident answer is worse than useless in an EW
environment, where the answer determines whether you climb or reroute.
"""

import numpy as np

from scm.causal_dag import CausalDAG
from scm.diagnostics import OnlineDiagnostics
from scm.interventions import InterventionEngine, COMPLETE


class FakeDrone:
    """Minimal stand-in that climbs toward its commanded altitude offset."""

    def __init__(self, altitude=800.0, climb_rate=0.35, can_climb=True):
        self.id = "RELAY-1"
        self.position = np.array([1000.0, 2000.0, altitude])
        self.altitude_offset_cmd = 0.0
        self._base = altitude
        self._climb_rate = climb_rate
        self._can_climb = can_climb

    def step(self):
        if not self._can_climb:
            return
        target = self._base + self.altitude_offset_cmd
        delta = target - self.position[2]
        self.position[2] += float(np.clip(delta, -self._climb_rate, self._climb_rate))


# --- structural model -------------------------------------------------------

def test_dag_predicts_higher_loss_for_worse_conditions():
    dag = CausalDAG()
    clean = dag.predict_loss(T=0.0, D=0.1, J=0.0, theta=0.0)
    obstructed = dag.predict_loss(T=0.9, D=0.1, J=0.0, theta=0.0)
    jammed = dag.predict_loss(T=0.0, D=0.1, J=0.9, theta=0.0)

    assert obstructed > clean
    assert jammed > clean


def test_root_cause_identifies_dominant_term():
    dag = CausalDAG()
    cause, _ = dag.identify_root_cause(T=0.95, D=0.05, J=0.0, theta=0.0)
    assert "terrain" in cause.lower()

    cause, _ = dag.identify_root_cause(T=0.0, D=0.05, J=0.95, theta=0.0)
    assert "jam" in cause.lower() or "noise" in cause.lower()


def test_rls_coefficients_stay_in_physical_bounds():
    """
    The fitted coefficients must remain interpretable.

    The regressors are strongly collinear in normal flight, so an
    unconstrained estimator slides along a flat likelihood ridge to values
    like beta_theta = -27, which fit the data but destroy the point of having
    a *structural* model.
    """
    diagnostics = OnlineDiagnostics()
    rng = np.random.RandomState(0)

    for i in range(600):
        terrain = rng.uniform(0, 1)
        distance = terrain * 0.8 + rng.uniform(0, 0.2)     # deliberately collinear
        jamming = rng.uniform(0, 1) if i % 7 == 0 else 0.0
        theta = rng.uniform(0.6, 1.0)

        true_loss = 1.0 / (1.0 + np.exp(-(-2.0 + 3.0 * terrain + 2.5 * distance
                                          + 4.0 * jamming - 1.0 * theta)))
        observed = float(np.clip(true_loss + rng.normal(0, 0.05), 0.0, 1.0))

        diagnostics.update(
            occlusion_db=terrain * 60.0,
            distance_m=distance * 2000.0,
            noise_floor_dbm=-100.0 + jamming * 30.0,
            antenna_factor=theta,
            observed_loss=observed,
            sim_time=i * 0.1,
            link_id="A<->B",
        )

    beta = diagnostics.dag.get_beta_vector()
    lower = diagnostics.beta_bounds[:, 0]
    upper = diagnostics.beta_bounds[:, 1]

    assert np.all(beta >= lower - 1e-6), f"coefficient below bound: {beta}"
    assert np.all(beta <= upper + 1e-6), f"coefficient above bound: {beta}"
    assert np.all(np.isfinite(beta))


def test_rls_covariance_stays_bounded():
    diagnostics = OnlineDiagnostics()
    rng = np.random.RandomState(1)

    # Feed a signal that excites only one direction — the classic setup for
    # covariance wind-up with a forgetting factor below 1.
    for i in range(800):
        diagnostics.update(
            occlusion_db=20.0, distance_m=900.0, noise_floor_dbm=-100.0,
            antenna_factor=0.9,
            observed_loss=0.3 + rng.normal(0, 0.01),
            sim_time=i * 0.1, link_id="A<->B",
        )

    eigenvalues = np.linalg.eigvalsh(diagnostics.P)
    assert np.max(eigenvalues) < 1e5
    assert np.min(eigenvalues) > 0.0


# --- interventions ----------------------------------------------------------

def _run_intervention(engine, drone, loss_fn, noise_fn=None,
                      distance_fn=None, steps=900, dt=0.05):
    """Drive an intervention to completion and return its result."""
    engine.arm(drone.id, "RELAY-1<->SCOUT-1", float(drone.position[2]), 0.0)

    for step in range(steps):
        t = step * dt
        drone.step()
        noise = noise_fn(t) if noise_fn else -100.0
        distance = distance_fn(t) if distance_fn else 900.0
        result = engine.update("RELAY-1<->SCOUT-1", drone, loss_fn(drone, t),
                               noise, distance, t)
        if result:
            return result
    return None


def test_intervention_actually_commands_a_climb():
    """do(dz) must move the aircraft, not just record an intention."""
    engine = InterventionEngine(probe_ladder=(15.0,), pre_window=0.4,
                                actuation_window=1.2, post_window=0.4)
    drone = FakeDrone()
    start = float(drone.position[2])

    # Loss improves once the aircraft has climbed
    def loss(d, t):
        return 0.7 if d.position[2] - start < 10.0 else 0.2

    result = _run_intervention(engine, drone, loss)

    assert result is not None
    assert drone.position[2] > start + 10.0
    assert result["attribution"] == "terrain_occlusion"
    assert result["causal_effect"] > 0.05


def test_intervention_detects_moving_jammer_as_confounded():
    """
    If the noise floor shifts during the measurement window, the pre/post
    difference does not identify the effect of altitude, and the engine must
    say so rather than reporting a number.
    """
    engine = InterventionEngine(probe_ladder=(15.0,), pre_window=0.4,
                                actuation_window=1.2, post_window=0.4,
                                j_stability_db=2.5)
    drone = FakeDrone()

    result = _run_intervention(
        engine, drone,
        loss_fn=lambda d, t: 0.7 - 0.4 * min(t / 2.0, 1.0),
        noise_fn=lambda t: -100.0 + 20.0 * min(t / 2.0, 1.0),   # jammer ramps
    )

    assert result is not None
    assert result["confounded"] is True
    assert "noise floor" in result["confound_reason"]
    assert result["attribution"] == "indeterminate"


def test_intervention_flags_failure_to_climb():
    """An aircraft that cannot climb has not been intervened upon."""
    engine = InterventionEngine(probe_ladder=(15.0,), pre_window=0.4,
                                actuation_window=1.2, post_window=0.4)
    drone = FakeDrone(can_climb=False)

    result = _run_intervention(engine, drone, loss_fn=lambda d, t: 0.6)

    assert result is not None
    assert result["confounded"] is True
    assert "achieved only" in result["confound_reason"]


def test_noise_is_not_mistaken_for_an_effect():
    """
    A link whose loss merely fluctuates must not be attributed to terrain.

    This is the failure that made the first benchmark attribute every jammed
    link to terrain: random fading over a short window cleared a fixed
    threshold.
    """
    engine = InterventionEngine(probe_ladder=(15.0, 30.0), pre_window=0.5,
                                actuation_window=1.2, post_window=0.5)
    drone = FakeDrone()
    rng = np.random.RandomState(3)

    result = _run_intervention(
        engine, drone,
        loss_fn=lambda d, t: float(np.clip(0.6 + rng.normal(0, 0.12), 0, 1)),
    )

    assert result is not None
    assert result["attribution"] != "terrain_occlusion"


def test_probe_escalates_when_first_rung_shows_nothing():
    """A null result at +15 m should trigger a larger probe, not a verdict."""
    engine = InterventionEngine(probe_ladder=(15.0, 30.0, 60.0),
                                pre_window=0.3, actuation_window=1.0,
                                post_window=0.3)
    drone = FakeDrone(climb_rate=1.0)
    start = float(drone.position[2])

    # Only a climb of more than 40 m clears the ridge
    def loss(d, t):
        return 0.2 if (d.position[2] - start) > 40.0 else 0.75

    result = _run_intervention(engine, drone, loss)

    assert result is not None
    assert result["rung"] >= 2, "engine did not escalate the probe"
    assert result["attribution"] == "terrain_occlusion"


def test_altitude_is_returned_when_terrain_is_ruled_out():
    """
    An inconclusive or negative test must give the altitude back — the swarm
    should not drift permanently upward on the strength of failed probes.
    """
    engine = InterventionEngine(probe_ladder=(15.0, 30.0), pre_window=0.3,
                                actuation_window=1.0, post_window=0.3)
    drone = FakeDrone()

    result = _run_intervention(engine, drone, loss_fn=lambda d, t: 0.65)

    assert result is not None
    assert result["reverted"] is True
    assert abs(drone.altitude_offset_cmd) < 1e-6


def test_cooldown_prevents_immediate_retest():
    engine = InterventionEngine(cooldown=10.0)
    assert engine.should_intervene("A<->B", 0.5, 0.0) is True

    engine.arm("R", "A<->B", 800.0, 0.0)
    engine._retire(engine._active["A<->B"], 1.0)

    assert engine.should_intervene("A<->B", 0.5, 3.0) is False
    assert engine.should_intervene("A<->B", 0.5, 20.0) is True


def test_state_reports_identified_and_confounded_counts():
    engine = InterventionEngine(probe_ladder=(15.0,), pre_window=0.3,
                                actuation_window=1.0, post_window=0.3)
    drone = FakeDrone()
    start = float(drone.position[2])

    _run_intervention(engine, drone,
                      loss_fn=lambda d, t: 0.7 if d.position[2] - start < 10 else 0.2)

    state = engine.get_state()
    assert state["completed_count"] == 1
    assert state["identified_count"] + state["confounded_count"] == 1
    assert state["latest"]["phase"] == COMPLETE


def test_only_one_intervention_runs_at_a_time():
    """
    Concurrent interventions contaminate each other's after-window. A live
    three-node run showed four in flight at once, two stacked on one relay.
    """
    from types import SimpleNamespace
    from sim.world import World
    from sim.drone import Drone, DroneRole
    from scm.causal_layer import CausalLayer

    world = World()
    layer = CausalLayer(world)
    drones = {
        "GCS-RELAY": Drone("GCS-RELAY", np.array([400.0, 2200.0, 800.0]), DroneRole.GCS_RELAY),
        "RELAY-1": Drone("RELAY-1", np.array([900.0, 2200.0, 820.0]), DroneRole.RELAY),
        "SCOUT-1": Drone("SCOUT-1", np.array([1400.0, 2200.0, 800.0]), DroneRole.SCOUT),
        "SCOUT-2": Drone("SCOUT-2", np.array([1500.0, 2250.0, 800.0]), DroneRole.SCOUT),
    }
    # Every backhaul link badly degraded
    for a in drones.values():
        a.neighbors = {b.id: 0.3 for b in drones.values() if b.id != a.id}

    rf = SimpleNamespace(jamming_active=False, jamming_power_dbm=-200.0,
                         noise_floor_dbm=-100.0)
    for step in range(60):
        layer.update(drones, rf, step * 0.1)
        assert layer.interventions.get_state()["active_count"] <= 1
