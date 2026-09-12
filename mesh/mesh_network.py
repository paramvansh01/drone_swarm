"""
Multi-hop mesh network abstraction for C-DAWN.

Manages packet routing, delivery tracking, and network statistics
across the drone swarm.
"""

import numpy as np
import time
import logging
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, field
from collections import defaultdict
import hashlib
import json

logger = logging.getLogger("cdawn.mesh")


@dataclass
class Packet:
    """A network packet in the mesh."""
    id: str
    source: str
    destination: str
    payload: dict
    ttl: int = 10
    hop_count: int = 0
    created_at: float = 0.0
    delivered_at: Optional[float] = None
    route: List[str] = field(default_factory=list)
    packet_type: str = "data"  # "data", "control", "sitrep", "telemetry"
    priority: int = 0  # higher = more important

    @property
    def is_expired(self) -> bool:
        return self.ttl <= 0

    @property
    def is_delivered(self) -> bool:
        return self.delivered_at is not None


class MeshNetwork:
    """
    Multi-hop mesh network for UAV swarm communication.

    Handles:
    - Packet creation and routing
    - Multi-hop forwarding
    - PDR tracking per link and end-to-end
    - Duplicate detection
    - Network statistics
    """

    def __init__(self, max_packet_buffer: int = 100):
        self.max_packet_buffer = max_packet_buffer

        # Routing tables (populated by routing module)
        self.routing_table: Dict[str, Dict[str, str]] = {}  # node -> {dest: next_hop}

        # Packet buffers per node
        self.tx_buffers: Dict[str, List[Packet]] = defaultdict(list)
        self.rx_buffers: Dict[str, List[Packet]] = defaultdict(list)

        # Deduplication
        self._seen_packets: Set[str] = set()

        # Statistics
        self.stats = {
            "packets_sent": 0,
            "packets_delivered": 0,
            "packets_dropped": 0,
            "total_hops": 0,
            "total_latency": 0.0,
        }

        # Per-link statistics
        self.link_stats: Dict[str, Dict[str, int]] = defaultdict(
            lambda: {"sent": 0, "delivered": 0, "dropped": 0}
        )

        # Delivered packets log
        self._delivered_log: List[Dict] = []

    def create_packet(
        self,
        source: str,
        destination: str,
        payload: dict,
        sim_time: float,
        packet_type: str = "data",
        priority: int = 0,
    ) -> Packet:
        """Create a new packet."""
        packet_id = hashlib.md5(
            f"{source}-{destination}-{sim_time}-{np.random.randint(1e6)}".encode()
        ).hexdigest()[:12]

        packet = Packet(
            id=packet_id,
            source=source,
            destination=destination,
            payload=payload,
            created_at=sim_time,
            route=[source],
            packet_type=packet_type,
            priority=priority,
        )

        self.tx_buffers[source].append(packet)
        self.stats["packets_sent"] += 1

        return packet

    def forward_packets(
        self,
        node_id: str,
        neighbors: Dict[str, float],
        sim_time: float,
    ) -> List[Packet]:
        """
        Forward packets from a node's TX buffer to neighbors.

        Uses the routing table + link quality to decide forwarding.

        Args:
            node_id: Current node ID.
            neighbors: Dict of neighbor_id -> link_quality [0,1].
            sim_time: Current simulation time.

        Returns:
            List of packets successfully forwarded.
        """
        forwarded = []
        remaining = []

        for packet in self.tx_buffers[node_id]:
            if packet.is_expired:
                self.stats["packets_dropped"] += 1
                continue

            if packet.id in self._seen_packets:
                continue
            self._seen_packets.add(packet.id)

            # Check if destination is a direct neighbor
            if packet.destination in neighbors:
                link_quality = neighbors[packet.destination]
                # Probabilistic delivery based on link quality
                if np.random.random() < link_quality:
                    self._deliver_packet(packet, sim_time)
                    forwarded.append(packet)
                else:
                    # Delivery failed — keep in buffer for retry
                    packet.ttl -= 1
                    remaining.append(packet)
                    self.link_stats[f"{node_id}->{packet.destination}"]["dropped"] += 1
                continue

            # Multi-hop: find next hop from routing table
            next_hop = self._get_next_hop(node_id, packet.destination, neighbors)

            if next_hop and next_hop in neighbors:
                link_quality = neighbors[next_hop]
                if np.random.random() < link_quality:
                    # Forward to next hop
                    packet.hop_count += 1
                    packet.ttl -= 1
                    packet.route.append(next_hop)
                    self.tx_buffers[next_hop].append(packet)
                    forwarded.append(packet)
                    self.link_stats[f"{node_id}->{next_hop}"]["sent"] += 1
                else:
                    packet.ttl -= 1
                    remaining.append(packet)
            else:
                # No route — keep in buffer
                packet.ttl -= 1
                remaining.append(packet)

        self.tx_buffers[node_id] = remaining[:self.max_packet_buffer]

        # Trim dedup set
        if len(self._seen_packets) > 10000:
            self._seen_packets = set(list(self._seen_packets)[-5000:])

        return forwarded

    def _deliver_packet(self, packet: Packet, sim_time: float):
        """Mark a packet as delivered."""
        packet.delivered_at = sim_time
        self.stats["packets_delivered"] += 1
        self.stats["total_hops"] += packet.hop_count
        self.stats["total_latency"] += sim_time - packet.created_at

        self.rx_buffers[packet.destination].append(packet)
        if len(self.rx_buffers[packet.destination]) > self.max_packet_buffer:
            self.rx_buffers[packet.destination] = self.rx_buffers[packet.destination][-self.max_packet_buffer:]

        self._delivered_log.append({
            "packet_id": packet.id,
            "source": packet.source,
            "destination": packet.destination,
            "hops": packet.hop_count,
            "latency": sim_time - packet.created_at,
            "route": packet.route,
            "type": packet.packet_type,
        })
        if len(self._delivered_log) > 500:
            self._delivered_log = self._delivered_log[-300:]

    def _get_next_hop(
        self, current: str, destination: str, neighbors: Dict[str, float]
    ) -> Optional[str]:
        """Get next hop from routing table, with fallback to best-quality neighbor."""
        # Check routing table
        if current in self.routing_table:
            if destination in self.routing_table[current]:
                return self.routing_table[current][destination]

        # Fallback: forward to highest-quality neighbor
        if neighbors:
            return max(neighbors, key=neighbors.get)
        return None

    def update_routing_table(self, node_id: str, routes: Dict[str, str]):
        """Update routing table for a node."""
        self.routing_table[node_id] = routes

    def get_pdr(self) -> float:
        """Get overall packet delivery ratio."""
        total = self.stats["packets_sent"]
        if total == 0:
            return 1.0
        return self.stats["packets_delivered"] / total

    def get_avg_latency(self) -> float:
        """Get average packet latency (seconds)."""
        if self.stats["packets_delivered"] == 0:
            return 0.0
        return self.stats["total_latency"] / self.stats["packets_delivered"]

    def get_avg_hops(self) -> float:
        """Get average hop count for delivered packets."""
        if self.stats["packets_delivered"] == 0:
            return 0.0
        return self.stats["total_hops"] / self.stats["packets_delivered"]

    def get_state(self) -> dict:
        """Serialize mesh network state."""
        return {
            "pdr": self.get_pdr(),
            "avg_latency": self.get_avg_latency(),
            "avg_hops": self.get_avg_hops(),
            "stats": dict(self.stats),
            "buffer_sizes": {
                node: len(buf) for node, buf in self.tx_buffers.items()
            },
            "recent_deliveries": self._delivered_log[-5:],
        }
