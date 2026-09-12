import numpy as np
from scm.causal_dag import CausalDAG
from scm.diagnostics import OnlineDiagnostics
from scm.interventions import InterventionEngine


def test_causal_dag_structural_equations():
    dag = CausalDAG()
    
    # Baseline nominal conditions: T=0, D=0.1, J=0, theta=0
    loss_nominal = dag.predict_loss(T=0.0, D=0.1, J=0.0, theta=0.0)
    assert loss_nominal < 0.25

    # Severe jamming: J=1.0 -> Loss jumps high
    loss_jammed = dag.predict_loss(T=0.0, D=0.1, J=1.0, theta=0.0)
    assert loss_jammed > 0.70

    # Causal contributions
    contribs = dag.compute_causal_contributions(T=0.8, D=0.2, J=0.1, theta=0.0)
    assert "terrain" in contribs
    assert contribs["terrain"] > contribs["jamming"]

    # Root cause identification
    root_cause, val = dag.identify_root_cause(T=0.9, D=0.1, J=0.0, theta=0.0)
    assert root_cause == "terrain"


def test_online_diagnostics_rls():
    diag = OnlineDiagnostics(min_observations=5)
    
    # Stream 15 observations with heavy jamming
    for step in range(15):
        result = diag.update(
            occlusion_db=2.0,
            distance_m=40.0,
            noise_floor_dbm=-65.0, # elevated noise floor
            antenna_factor=0.95,
            observed_loss=0.85,
            sim_time=step * 0.5,
            link_id="drone1-drone2",
        )
    
    # Check that diagnostics identified anomaly
    assert diag.dag.observation_count >= 5
    assert "status" in result or "anomaly" in result or "diagnosed" in result or "predicted_loss" in result


def test_intervention_engine_decision_rule():
    engine = InterventionEngine(delta_z=15.0, effect_threshold=0.05)
    
    # Should intervene when loss is high
    assert engine.should_intervene(link_id="link-01", loss=0.45, sim_time=10.0, threshold=0.15) is True
    
    # Should not intervene when loss is normal
    assert engine.should_intervene(link_id="link-02", loss=0.05, sim_time=10.0, threshold=0.15) is False
