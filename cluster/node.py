"""
Cluster membership and subsystem delegation for C-DAWN.

The demonstration runs across three laptops on one Wi-Fi network. The split
is a real division of compute, not three copies of the same screen:

    ALPHA   (role: sim)    Authoritative world. Flight dynamics, the flight
                           controllers, the RF channel, mission guidance.
                           Owns truth; everything else is downstream.

    BRAVO   (role: edge)   Tactical edge compute. Runs the E(3)-GNN relay
                           optimiser and the SCM causal diagnostics against
                           telemetry streamed from ALPHA, and pushes relay
                           stations and intervention commands back.

    CHARLIE (role: gcs)    Ground control. Serves the operator dashboard and
                           synthesises SITREPs from the RAG pipeline.

Every node serves the full dashboard on its own LAN address, so any laptop
can be put on the projector.

Degradation
-----------
ALPHA runs every subsystem locally by default. When BRAVO registers and
claims a subsystem, ALPHA stops computing it locally and applies BRAVO's
pushed results instead. If BRAVO then goes quiet for longer than
`DELEGATION_TIMEOUT`, ALPHA silently resumes local computation.

This matters more than it looks: a demo that hard-depends on three laptops
staying associated to a venue Wi-Fi is a demo that fails in front of the
jury. Here, unplugging BRAVO mid-run degrades nothing an observer can see
except the node indicator going amber.
"""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional

logger = logging.getLogger("cdawn.cluster")


# A delegated subsystem whose owner has not reported in this long reverts to
# local computation. Three missed 0.5 s update cycles.
DELEGATION_TIMEOUT = 1.5


class NodeRole(str, Enum):
    SIM = "sim"        # ALPHA — authoritative simulation
    EDGE = "edge"      # BRAVO — GNN + SCM edge compute
    GCS = "gcs"        # CHARLIE — dashboard + SITREP synthesis
    ALL = "all"        # single-laptop fallback: everything here

    @property
    def callsign(self) -> str:
        return {
            NodeRole.SIM: "ALPHA",
            NodeRole.EDGE: "BRAVO",
            NodeRole.GCS: "CHARLIE",
            NodeRole.ALL: "STANDALONE",
        }[self]

    @property
    def description(self) -> str:
        return {
            NodeRole.SIM: "Flight dynamics & control, RF channel, guidance",
            NodeRole.EDGE: "E(3)-GNN relay optimisation, SCM causal diagnostics",
            NodeRole.GCS: "Operator dashboard, SITREP synthesis",
            NodeRole.ALL: "All subsystems on one machine",
        }[self]


# Subsystems that may be delegated to an edge node
SUBSYSTEM_TOPOLOGY = "gnn_topology"
SUBSYSTEM_CAUSAL = "scm_causal"
SUBSYSTEM_SITREP = "rag_sitrep"

DELEGATABLE = (SUBSYSTEM_TOPOLOGY, SUBSYSTEM_CAUSAL, SUBSYSTEM_SITREP)

ROLE_SUBSYSTEMS = {
    NodeRole.EDGE: (SUBSYSTEM_TOPOLOGY, SUBSYSTEM_CAUSAL),
    NodeRole.GCS: (SUBSYSTEM_SITREP,),
}


@dataclass
class PeerRecord:
    """A cluster member as seen from this node."""
    node_id: str
    role: str
    ip: str
    port: int
    last_seen: float = 0.0
    subsystems: List[str] = field(default_factory=list)
    latency_ms: float = 0.0
    updates: int = 0

    @property
    def address(self) -> str:
        return f"{self.ip}:{self.port}"

    @property
    def online(self) -> bool:
        return (time.time() - self.last_seen) < DELEGATION_TIMEOUT * 3

    def to_dict(self) -> dict:
        return {
            "node_id": self.node_id,
            "role": self.role,
            "callsign": NodeRole(self.role).callsign if self.role in
            {r.value for r in NodeRole} else self.role.upper(),
            "ip": self.ip,
            "port": self.port,
            "address": self.address,
            "url": f"http://{self.address}",
            "online": self.online,
            "age_s": max(0.0, time.time() - self.last_seen),
            "subsystems": list(self.subsystems),
            "latency_ms": self.latency_ms,
            "updates": self.updates,
        }


class ClusterState:
    """Tracks peers and which node currently owns each delegatable subsystem."""

    def __init__(self, node_id: str, role: NodeRole, ip: str, port: int):
        self.node_id = node_id
        self.role = role
        self.ip = ip
        self.port = port
        self.started_at = time.time()

        self._peers: Dict[str, PeerRecord] = {}
        self._owners: Dict[str, str] = {}        # subsystem -> node_id
        self._owner_seen: Dict[str, float] = {}  # subsystem -> last result time
        self._lock = threading.RLock()

    # -- membership --------------------------------------------------------

    def register_peer(self, node_id: str, role: str, ip: str, port: int,
                      subsystems: Optional[List[str]] = None) -> dict:
        """Record (or refresh) a peer and any subsystems it claims."""
        with self._lock:
            peer = self._peers.get(node_id)
            if peer is None:
                peer = PeerRecord(node_id=node_id, role=role, ip=ip, port=port)
                self._peers[node_id] = peer
                logger.info("Peer joined: %s (%s) at %s:%d", node_id, role, ip, port)

            peer.role = role
            peer.ip = ip
            peer.port = port
            peer.last_seen = time.time()

            # Registration records what a peer is *willing* to compute. It
            # does not hand the work over — that happens in touch_subsystem,
            # when a result actually arrives. Granting ownership on
            # registration meant a node that heartbeats but produces nothing
            # would be given the subsystem, time out 1.5 s later, re-register,
            # and be given it again: the subsystem would run for less than
            # half of every cycle with nobody noticing.
            if subsystems:
                peer.subsystems = [s for s in subsystems if s in DELEGATABLE]

            return peer.to_dict()

    def touch_subsystem(self, subsystem: str, node_id: str, latency_ms: float = 0.0):
        """
        Called when a computed result arrives from a peer.

        The first result from a peer that claimed the subsystem is what
        actually delegates it; every later one keeps the delegation fresh.
        """
        with self._lock:
            peer = self._peers.get(node_id)
            if peer is None or subsystem not in DELEGATABLE:
                return
            if peer.subsystems and subsystem not in peer.subsystems:
                return      # results for work it never claimed are ignored

            if self._owners.get(subsystem) != node_id:
                logger.info("Delegating %s to %s (first result received)",
                            subsystem, node_id)
            self._owners[subsystem] = node_id
            self._owner_seen[subsystem] = time.time()

            peer.last_seen = time.time()
            peer.latency_ms = latency_ms
            peer.updates += 1

    def owns_locally(self, subsystem: str) -> bool:
        """
        True if THIS node should compute `subsystem` right now.

        Delegation is revoked automatically the moment the owner's results go
        stale, so a disconnected edge node degrades to local computation
        without any operator action.
        """
        with self._lock:
            owner = self._owners.get(subsystem)
            if owner is None or owner == self.node_id:
                return True

            last = self._owner_seen.get(subsystem, 0.0)
            if time.time() - last > DELEGATION_TIMEOUT:
                logger.warning(
                    "Delegated subsystem %s went stale (owner %s, %.1fs) — "
                    "resuming local computation",
                    subsystem, owner, time.time() - last,
                )
                self._owners.pop(subsystem, None)
                self._owner_seen.pop(subsystem, None)
                return True

            return False

    def drop_peer(self, node_id: str):
        with self._lock:
            self._peers.pop(node_id, None)
            for subsystem, owner in list(self._owners.items()):
                if owner == node_id:
                    self._owners.pop(subsystem, None)
                    self._owner_seen.pop(subsystem, None)

    # -- reporting ---------------------------------------------------------

    def self_record(self) -> dict:
        return {
            "node_id": self.node_id,
            "role": self.role.value,
            "callsign": self.role.callsign,
            "description": self.role.description,
            "ip": self.ip,
            "port": self.port,
            "address": f"{self.ip}:{self.port}",
            "url": f"http://{self.ip}:{self.port}",
            "online": True,
            "uptime_s": time.time() - self.started_at,
            "is_self": True,
        }

    def get_state(self) -> dict:
        with self._lock:
            # Expire peers we have not heard from at all
            now = time.time()
            for node_id, peer in list(self._peers.items()):
                if now - peer.last_seen > 15.0:
                    logger.warning("Peer %s timed out", node_id)
                    self.drop_peer(node_id)

            ownership = {}
            for subsystem in DELEGATABLE:
                owner = self._owners.get(subsystem, self.node_id)
                ownership[subsystem] = {
                    "owner": owner,
                    "local": self.owns_locally(subsystem),
                    "callsign": (self.role.callsign if owner == self.node_id
                                 else self._callsign_of(owner)),
                }

            return {
                "self": self.self_record(),
                "peers": [p.to_dict() for p in self._peers.values()],
                "ownership": ownership,
                "node_count": 1 + len(self._peers),
            }

    def _callsign_of(self, node_id: str) -> str:
        peer = self._peers.get(node_id)
        if peer is None:
            return node_id
        try:
            return NodeRole(peer.role).callsign
        except ValueError:
            return peer.role.upper()
