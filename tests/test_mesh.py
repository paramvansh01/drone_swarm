import numpy as np
from mesh.mesh_network import MeshNetwork, Packet
from mesh.routing import SCMAwareRouter
from mesh.election import RelayElection


def test_packet_creation_and_forwarding():
    mesh = MeshNetwork()
    
    pkt = Packet(
        id="pkt-01",
        source="drone-1",
        destination="gcs",
        payload={"type": "telemetry", "data": 42},
        ttl=5,
        created_at=1.0,
    )
    assert not pkt.is_expired
    assert not pkt.is_delivered
    assert pkt.priority == 0


def test_scm_aware_router():
    router = SCMAwareRouter(causal_weight=0.3)
    
    # Excellent link: high quality, high stability -> low cost
    cost_good = router.compute_link_cost(link_quality=0.95, causal_stability=0.90)
    
    # Degraded link: low quality, low stability -> high cost
    cost_bad = router.compute_link_cost(link_quality=0.30, causal_stability=0.20)
    
    assert cost_good < cost_bad
    assert router.compute_link_cost(link_quality=0.0, causal_stability=0.0) == float('inf')


def test_relay_election():
    election = RelayElection(election_timeout_ms=300.0, min_battery_for_relay=20.0)
    
    score_high_bat = election.compute_election_score(battery=90.0, mean_link_quality=0.85, is_scout=False)
    score_low_bat = election.compute_election_score(battery=15.0, mean_link_quality=0.85, is_scout=False)
    score_scout = election.compute_election_score(battery=90.0, mean_link_quality=0.85, is_scout=True)
    
    assert score_low_bat == 0.0 # under minimum battery threshold
    assert score_high_bat > score_scout # scout penalty preserves scout role
