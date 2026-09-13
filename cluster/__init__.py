"""C-DAWN multi-node cluster support (LAN discovery, delegation, edge compute)."""

from .discovery import DiscoveryService, get_lan_ip, DISCOVERY_PORT
from .node import (
    ClusterState,
    NodeRole,
    DELEGATABLE,
    ROLE_SUBSYSTEMS,
    SUBSYSTEM_CAUSAL,
    SUBSYSTEM_SITREP,
    SUBSYSTEM_TOPOLOGY,
)
from .edge_client import EdgeClient

__all__ = [
    "DiscoveryService", "get_lan_ip", "DISCOVERY_PORT",
    "ClusterState", "NodeRole", "DELEGATABLE", "ROLE_SUBSYSTEMS",
    "SUBSYSTEM_TOPOLOGY", "SUBSYSTEM_CAUSAL", "SUBSYSTEM_SITREP",
    "EdgeClient",
]
