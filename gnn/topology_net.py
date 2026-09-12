"""
E(3)-GNN Topology Network for C-DAWN.

Full GNN that jointly optimizes relay drone positions to:
1. Maximize link-budget (attractive term — keep signal quality high)
2. Enforce >5m separation (repulsive term — collision avoidance)
3. Account for battery levels (penalize solutions where low-battery drones are relays)

Output: Δposition for each relay drone.
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Dict, List, Optional, Tuple

from .equivariant_layer import E3MessagePassingLayer


class TopologyNet(nn.Module):
    """
    E(3)-GNN for dynamic relay topology optimization.

    Takes current drone positions and scalar features (RSSI, battery,
    role flags) and outputs position corrections for relay drones
    that improve overall mesh connectivity while avoiding collisions.
    """

    # Node feature dimensions
    # [battery, is_scout, is_relay, is_gcs_relay, mean_rssi, min_rssi, num_neighbors]
    NODE_FEAT_DIM = 7

    def __init__(
        self,
        num_layers: int = 3,
        hidden_dim: int = 64,
        min_separation: float = 5.0,
        repulsive_weight: float = 10.0,
        attractive_weight: float = 1.0,
        battery_weight: float = 2.0,
    ):
        super().__init__()
        self.min_separation = min_separation
        self.repulsive_weight = repulsive_weight
        self.attractive_weight = attractive_weight
        self.battery_weight = battery_weight

        # Input embedding
        self.input_embed = nn.Sequential(
            nn.Linear(self.NODE_FEAT_DIM, hidden_dim),
            nn.SiLU(),
        )

        # E(3)-equivariant message passing layers
        self.layers = nn.ModuleList([
            E3MessagePassingLayer(
                node_feat_dim=hidden_dim,
                hidden_dim=hidden_dim,
                residual=True,
            )
            for _ in range(num_layers)
        ])

        # Output: per-node scalar weight for position update
        self.output_mlp = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.SiLU(),
            nn.Linear(hidden_dim // 2, 1),
            nn.Sigmoid(),  # [0, 1] — how much to apply the GNN's suggested position
        )

    def build_fully_connected_edges(self, n: int) -> torch.Tensor:
        """Build fully connected edge index for n nodes."""
        src = []
        tgt = []
        for i in range(n):
            for j in range(n):
                if i != j:
                    src.append(i)
                    tgt.append(j)
        return torch.tensor([src, tgt], dtype=torch.long)

    def compute_loss(
        self,
        positions: torch.Tensor,          # [N, 3]
        new_positions: torch.Tensor,      # [N, 3]
        node_features: torch.Tensor,      # [N, F]
        link_quality_matrix: torch.Tensor, # [N, N] — target link quality
        relay_mask: torch.Tensor,          # [N] — True for relay drones
    ) -> torch.Tensor:
        """
        Compute the combined loss:
        L = L_attractive + λ_rep * L_repulsive + λ_bat * L_battery

        Args:
            positions: Original positions.
            new_positions: Proposed new positions.
            node_features: Node features (includes battery).
            link_quality_matrix: Target link quality between pairs.
            relay_mask: Boolean mask for relay drones.
        """
        N = positions.shape[0]

        # Distance matrix for new positions
        diff = new_positions.unsqueeze(0) - new_positions.unsqueeze(1)  # [N, N, 3]
        dists = torch.norm(diff, dim=-1)  # [N, N]

        # --- Attractive loss: maximize link quality ---
        # Proxy: minimize distance to connected nodes (weighted by desired link quality)
        attractive_loss = (dists * link_quality_matrix).sum() / max(N * (N - 1), 1)

        # --- Repulsive loss: enforce minimum separation ---
        separation_violation = torch.relu(self.min_separation - dists)
        # Exclude self-distances (diagonal)
        mask = ~torch.eye(N, dtype=torch.bool, device=positions.device)
        repulsive_loss = (separation_violation[mask] ** 2).sum() / max(mask.sum().item(), 1)

        # --- Battery penalty: discourage moving low-battery drones ---
        battery = node_features[:, 0]  # first feature is battery
        displacement = torch.norm(new_positions - positions, dim=-1)  # [N]
        # Penalize displacement inversely proportional to battery
        battery_penalty = (displacement * (1.0 - battery / 100.0)).sum() / max(N, 1)

        total_loss = (
            self.attractive_weight * attractive_loss
            + self.repulsive_weight * repulsive_loss
            + self.battery_weight * battery_penalty
        )

        return total_loss

    def forward(
        self,
        positions: torch.Tensor,
        node_features: torch.Tensor,
        edge_index: Optional[torch.Tensor] = None,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass: compute position updates.

        Args:
            positions: [N, 3] drone positions.
            node_features: [N, NODE_FEAT_DIM] scalar features.
            edge_index: [2, E] edge indices (default: fully connected).

        Returns:
            (new_positions, update_weights): updated positions and per-node update confidence.
        """
        N = positions.shape[0]

        if edge_index is None:
            edge_index = self.build_fully_connected_edges(N).to(positions.device)

        # Embed features
        h = self.input_embed(node_features)

        # Message passing (positions get updated equivariantly)
        pos = positions.clone()
        for layer in self.layers:
            pos, h = layer(pos, h, edge_index)

        # Output: how much to trust the GNN's position update
        weights = self.output_mlp(h).squeeze(-1)  # [N]

        # Weighted position update
        delta_pos = pos - positions
        new_positions = positions + weights.unsqueeze(-1) * delta_pos

        return new_positions, weights


def build_node_features(drones: dict) -> Tuple[torch.Tensor, torch.Tensor, List[str]]:
    """
    Build node feature matrix from drone states.

    Returns:
        (positions, features, drone_ids): tensors and ordering.
    """
    drone_ids = []
    positions = []
    features = []

    for d_id, drone in drones.items():
        if not drone.is_alive:
            continue
        drone_ids.append(d_id)
        positions.append(drone.position.tolist())

        # Feature vector
        from sim.drone import DroneRole
        rssi_values = list(drone.sensors.rssi.values()) if drone.sensors.rssi else [0.0]
        feat = [
            drone.battery,
            1.0 if drone.role == DroneRole.SCOUT else 0.0,
            1.0 if drone.role == DroneRole.RELAY else 0.0,
            1.0 if drone.role == DroneRole.GCS_RELAY else 0.0,
            np.mean(rssi_values),
            min(rssi_values) if rssi_values else 0.0,
            len(drone.neighbors),
        ]
        features.append(feat)

    return (
        torch.tensor(positions, dtype=torch.float32),
        torch.tensor(features, dtype=torch.float32),
        drone_ids,
    )
