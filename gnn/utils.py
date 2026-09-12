from __future__ import annotations
"""
Graph construction and PDR computation utilities for C-DAWN GNN.
"""

import numpy as np
try:
    import torch
except ImportError:
    torch = None
from typing import Dict, List, Tuple


def build_proximity_graph(
    positions: np.ndarray,
    max_distance: float = 100.0,
) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    Build a proximity-based graph.

    Args:
        positions: [N, 3] drone positions.
        max_distance: Maximum edge distance (m).

    Returns:
        (edge_index, edge_distances): [2, E] indices, [E] distances.
    """
    N = len(positions)
    src, tgt, dists = [], [], []

    for i in range(N):
        for j in range(N):
            if i == j:
                continue
            d = np.linalg.norm(positions[i] - positions[j])
            if d <= max_distance:
                src.append(i)
                tgt.append(j)
                dists.append(d)

    edge_index = torch.tensor([src, tgt], dtype=torch.long)
    edge_dists = torch.tensor(dists, dtype=torch.float32)
    return edge_index, edge_dists


def compute_end_to_end_pdr(
    link_qualities: Dict[str, Dict[str, float]],
    source: str,
    destination: str,
    drone_ids: List[str],
) -> float:
    """
    Compute end-to-end PDR between source and destination
    using the best multi-hop path (Dijkstra on -log(PDR)).

    Args:
        link_qualities: {drone_id: {neighbor_id: link_quality [0,1]}}
        source: Source drone ID.
        destination: Destination drone ID.
        drone_ids: List of all drone IDs.

    Returns:
        End-to-end PDR [0, 1].
    """
    import heapq

    # Dijkstra on -log(pdr) (minimizing this = maximizing PDR product)
    dist = {d: float('inf') for d in drone_ids}
    dist[source] = 0.0
    visited = set()
    heap = [(0.0, source)]

    while heap:
        d, u = heapq.heappop(heap)
        if u in visited:
            continue
        visited.add(u)

        if u == destination:
            return np.exp(-d)

        neighbors = link_qualities.get(u, {})
        for v, pdr in neighbors.items():
            if v in visited or pdr <= 0:
                continue
            new_dist = d + (-np.log(max(pdr, 1e-10)))
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))

    return 0.0  # unreachable


def compute_swarm_connectivity(
    link_qualities: Dict[str, Dict[str, float]],
    drone_ids: List[str],
) -> dict:
    """
    Compute swarm connectivity metrics.

    Returns:
        Dict with:
        - mean_pdr: Average pairwise PDR
        - min_pdr: Minimum pairwise PDR
        - connected_fraction: Fraction of pairs with PDR > 0.5
        - algebraic_connectivity: Fiedler value estimate
    """
    n = len(drone_ids)
    if n < 2:
        return {"mean_pdr": 0.0, "min_pdr": 0.0, "connected_fraction": 0.0}

    pdrs = []
    connected = 0
    total_pairs = 0

    for i in range(n):
        for j in range(i + 1, n):
            pdr = compute_end_to_end_pdr(
                link_qualities, drone_ids[i], drone_ids[j], drone_ids
            )
            pdrs.append(pdr)
            if pdr > 0.5:
                connected += 1
            total_pairs += 1

    return {
        "mean_pdr": float(np.mean(pdrs)) if pdrs else 0.0,
        "min_pdr": float(np.min(pdrs)) if pdrs else 0.0,
        "connected_fraction": connected / max(total_pairs, 1),
        "num_pairs": total_pairs,
    }
