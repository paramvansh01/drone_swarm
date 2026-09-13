"""
Multi-node cluster tests.

The behaviour worth testing is the failure path, not the happy one. Three
laptops on venue Wi-Fi will lose each other at some point during a
demonstration, and what matters is that the work quietly moves back to the
node that still has it rather than stopping.
"""

import time

from cluster.node import (
    ClusterState, NodeRole, DELEGATION_TIMEOUT,
    SUBSYSTEM_CAUSAL, SUBSYSTEM_TOPOLOGY,
)
from cluster.discovery import get_lan_ip


def _state() -> ClusterState:
    return ClusterState(node_id="ALPHA-test", role=NodeRole.SIM,
                        ip="10.0.0.1", port=8080)


def test_node_roles_have_callsigns_and_descriptions():
    for role in NodeRole:
        assert role.callsign
        assert role.description


def test_a_lone_node_owns_everything():
    cluster = _state()
    for subsystem in (SUBSYSTEM_TOPOLOGY, SUBSYSTEM_CAUSAL):
        assert cluster.owns_locally(subsystem) is True


def test_registering_an_edge_node_delegates_its_subsystems():
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY])
    cluster.touch_subsystem(SUBSYSTEM_TOPOLOGY, "BRAVO-1")

    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is False
    # Anything it did not claim stays local
    assert cluster.owns_locally(SUBSYSTEM_CAUSAL) is True


def test_delegation_reverts_when_the_owner_goes_quiet():
    """
    The whole point: unplugging the edge node must not stop relay
    optimisation, it must move it back to the simulation host.
    """
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY])
    cluster.touch_subsystem(SUBSYSTEM_TOPOLOGY, "BRAVO-1")
    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is False

    # Backdate the last result past the staleness timeout
    cluster._owner_seen[SUBSYSTEM_TOPOLOGY] = time.time() - (DELEGATION_TIMEOUT + 1.0)

    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is True


def test_delegation_resumes_when_the_owner_comes_back():
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY])
    cluster._owner_seen[SUBSYSTEM_TOPOLOGY] = time.time() - 99.0
    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is True

    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY])
    cluster.touch_subsystem(SUBSYSTEM_TOPOLOGY, "BRAVO-1")
    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is False


def test_dropping_a_peer_releases_its_subsystems():
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY, SUBSYSTEM_CAUSAL])
    cluster.touch_subsystem(SUBSYSTEM_TOPOLOGY, "BRAVO-1")

    cluster.drop_peer("BRAVO-1")

    assert cluster.owns_locally(SUBSYSTEM_TOPOLOGY) is True
    assert cluster.owns_locally(SUBSYSTEM_CAUSAL) is True


def test_cluster_state_reports_addresses_for_every_node():
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080)
    cluster.register_peer("CHARLIE-1", "gcs", "10.0.0.3", 8080)

    state = cluster.get_state()

    assert state["node_count"] == 3
    assert state["self"]["address"] == "10.0.0.1:8080"

    addresses = {p["address"] for p in state["peers"]}
    assert addresses == {"10.0.0.2:8080", "10.0.0.3:8080"}

    for peer in state["peers"]:
        assert peer["url"].startswith("http://")


def test_ownership_reported_with_callsigns():
    cluster = _state()
    cluster.register_peer("BRAVO-1", "edge", "10.0.0.2", 8080,
                          subsystems=[SUBSYSTEM_TOPOLOGY])
    cluster.touch_subsystem(SUBSYSTEM_TOPOLOGY, "BRAVO-1")

    ownership = cluster.get_state()["ownership"]

    assert ownership[SUBSYSTEM_TOPOLOGY]["callsign"] == "BRAVO"
    assert ownership[SUBSYSTEM_TOPOLOGY]["local"] is False
    assert ownership[SUBSYSTEM_CAUSAL]["local"] is True


def test_lan_ip_is_resolvable():
    ip = get_lan_ip()
    assert ip
    parts = ip.split(".")
    assert len(parts) == 4
    assert all(p.isdigit() for p in parts)


def test_edge_client_reports_status_before_connecting():
    from cluster.edge_client import EdgeClient

    client = EdgeClient(node_id="BRAVO-1", role="edge",
                        local_ip="10.0.0.2", local_port=8080,
                        subsystems=[SUBSYSTEM_TOPOLOGY])
    status = client.get_status()

    assert status["connected"] is False
    assert status["sim_host"] is None
    assert SUBSYSTEM_TOPOLOGY in status["subsystems"]
