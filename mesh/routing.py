"""
SCM-aware adaptive routing for C-DAWN mesh network.

Uses causal diagnostics to proactively avoid degraded links
instead of reactively flooding route requests.
"""

import numpy as np
import logging
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
import heapq

logger = logging.getLogger("cdawn.mesh.routing")


class SCMAwareRouter:
    """
    SCM-aware adaptive router.

    Instead of standard AODV-like reactive flooding on link loss,
    uses the SCM diagnostics to:
    1. Predict which links are likely to degrade
    2. Proactively reroute before failure
    3. Weight routes by causal stability (not just current quality)
    """

    def __init__(
        self,
        causal_weight: float = 0.3,      # weight for causal stability vs current quality
        prediction_horizon: float = 5.0,   # seconds to look ahead
        route_update_interval: float = 1.0, # seconds between route recalculations
    ):
        self.causal_weight = causal_weight
        self.prediction_horizon = prediction_horizon
        self.route_update_interval = route_update_interval

        self._last_update_time = -float('inf')
        self._link_stability: Dict[str, float] = {}  # link_id -> stability score [0,1]
        self._route_cache: Dict[str, Dict[str, List[str]]] = {}  # node -> {dest: route}

    def compute_link_cost(
        self,
        link_quality: float,
        causal_stability: float,
    ) -> float:
        """
        Compute link cost for routing.

        Combines current link quality with causal stability.
        Lower cost = better link.

        Args:
            link_quality: Current link quality [0, 1].
            causal_stability: SCM-predicted stability [0, 1].
        """
        if link_quality <= 0:
            return float('inf')

        # Quality component: -log(quality) → lower is better
        quality_cost = -np.log(max(link_quality, 1e-6))

        # Stability component: penalize unstable links
        stability_cost = -np.log(max(causal_stability, 1e-6))

        return (1 - self.causal_weight) * quality_cost + self.causal_weight * stability_cost

    def update_link_stability(self, link_id: str, diagnosis: dict):
        """
        Update link stability estimate from SCM diagnosis.

        Args:
            link_id: Link identifier.
            diagnosis: Diagnosis dict from SCM diagnostics.
        """
        if diagnosis is None:
            return

        # Stability = 1 - predicted_loss (higher = more stable)
        predicted_loss = diagnosis.get("predicted_loss", 0.0)
        is_anomaly = diagnosis.get("is_anomaly", False)

        stability = 1.0 - predicted_loss
        if is_anomaly:
            stability *= 0.5  # penalize anomalous links

        # Exponential moving average
        alpha = 0.3
        prev = self._link_stability.get(link_id, stability)
        self._link_stability[link_id] = alpha * stability + (1 - alpha) * prev

    def compute_routes(
        self,
        drones: dict,
        sim_time: float,
    ) -> Dict[str, Dict[str, str]]:
        """
        Compute optimal routes for all drone pairs.

        Uses Dijkstra with SCM-aware link costs.

        Returns:
            Routing table: {node_id: {destination: next_hop}}
        """
        if sim_time - self._last_update_time < self.route_update_interval:
            # Return cached routes
            return {
                node: {dest: route[1] if len(route) > 1 else dest for dest, route in routes.items()}
                for node, routes in self._route_cache.items()
            }

        self._last_update_time = sim_time

        alive_ids = [d_id for d_id, d in drones.items() if d.is_alive]
        n = len(alive_ids)

        if n < 2:
            return {}

        # Build adjacency with SCM-aware costs
        adjacency: Dict[str, Dict[str, float]] = defaultdict(dict)

        for d_id, drone in drones.items():
            if not drone.is_alive:
                continue
            for neighbor_id, quality in drone.neighbors.items():
                link_id = f"{d_id}<->{neighbor_id}"
                stability = self._link_stability.get(link_id, 0.8)
                cost = self.compute_link_cost(quality, stability)
                adjacency[d_id][neighbor_id] = cost

        # Compute shortest paths for all pairs
        routing_table = {}
        self._route_cache = {}

        for source in alive_ids:
            # Dijkstra from source
            dist = {d: float('inf') for d in alive_ids}
            prev = {d: None for d in alive_ids}
            dist[source] = 0.0
            visited = set()
            heap = [(0.0, source)]

            while heap:
                d, u = heapq.heappop(heap)
                if u in visited:
                    continue
                visited.add(u)

                for v, cost in adjacency.get(u, {}).items():
                    if v in visited:
                        continue
                    new_dist = d + cost
                    if new_dist < dist[v]:
                        dist[v] = new_dist
                        prev[v] = u
                        heapq.heappush(heap, (new_dist, v))

            # Build routing table entry and route cache
            next_hops = {}
            routes = {}

            for dest in alive_ids:
                if dest == source:
                    continue

                # Reconstruct path
                path = []
                node = dest
                while node is not None:
                    path.append(node)
                    node = prev[node]
                path.reverse()

                if len(path) > 1 and path[0] == source:
                    next_hops[dest] = path[1]
                    routes[dest] = path

            routing_table[source] = next_hops
            self._route_cache[source] = routes

        return routing_table

    def get_route(self, source: str, destination: str) -> Optional[List[str]]:
        """Get the cached route between source and destination."""
        if source in self._route_cache:
            return self._route_cache[source].get(destination)
        return None

    def get_state(self) -> dict:
        """Serialize router state."""
        return {
            "link_stability": dict(self._link_stability),
            "route_count": sum(len(r) for r in self._route_cache.values()),
            "last_update": self._last_update_time,
        }
