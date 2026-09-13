"""
E(3)-Equivariant message passing layer for C-DAWN.

Implements SE(3)/E(3)-equivariant graph neural network layers
that operate on 3D drone positions while preserving rotational
and translational symmetry.

Key property: the layer's output transforms correctly under
arbitrary rotations and translations of the input coordinates,
so the learned relay positioning generalizes across different
canyon/terrain orientations without retraining.
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Tuple, Optional


class E3MessagePassingLayer(nn.Module):
    """
    E(3)-Equivariant Message Passing Layer.

    For each pair of nodes (i, j):
    1. Compute relative position: r_ij = x_j - x_i
    2. Compute distance: d_ij = ||r_ij||
    3. Message = φ_m(h_i, h_j, d_ij) — scalar message (invariant)
    4. Position update = r_ij * φ_x(m_ij) — equivariant coordinate update
    5. Feature update = φ_h(h_i, Σ m_ij) — invariant feature update

    This ensures position outputs transform equivariantly under
    rotations/translations while scalar features remain invariant.
    """

    def __init__(
        self,
        node_feat_dim: int,
        hidden_dim: int = 64,
        output_feat_dim: int = None,
        residual: bool = True,
        coord_scale: float = 1.0,
    ):
        """
        Args:
            node_feat_dim: Dimension of node scalar features.
            hidden_dim: Hidden dimension for MLPs.
            output_feat_dim: Output feature dimension (default = input dim).
            residual: Use residual connections.
        """
        super().__init__()
        self.node_feat_dim = node_feat_dim
        self.output_feat_dim = output_feat_dim or node_feat_dim
        self.residual = residual

        # Message function: φ_m(h_i, h_j, d_ij) → scalar message
        self.msg_mlp = nn.Sequential(
            nn.Linear(2 * node_feat_dim + 1, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
        )

        # Coordinate update weight: φ_x(m_ij) → scalar weight for r_ij
        self.coord_mlp = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, 1),
            nn.Tanh(),  # bounded update magnitude
        )

        # Node update: φ_h(h_i, aggregated_msg) → new features
        self.node_mlp = nn.Sequential(
            nn.Linear(node_feat_dim + hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, self.output_feat_dim),
        )

        # Scale applied to the aggregated coordinate update.
        #
        # This is the gain of the entire equivariant coordinate pathway, so it
        # governs how far a node can be moved per layer *in the normalised
        # frame*. It was previously 0.1, which — combined with the tanh-bounded
        # coordinate MLP and a 250 m length scale — capped a full forward pass
        # at a few metres of displacement. At kilometre-scale relay spacing
        # that is indistinguishable from not moving at all, and no amount of
        # training could overcome it. The per-step displacement is bounded
        # properly in TopologyNet.forward instead, which is where a limit
        # expressed in real metres belongs.
        self.coord_scale = coord_scale

    def forward(
        self,
        positions: torch.Tensor,       # [N, 3]
        node_features: torch.Tensor,    # [N, F]
        edge_index: torch.Tensor,       # [2, E] (source, target)
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass.

        Args:
            positions: Node 3D coordinates [N, 3].
            node_features: Node scalar features [N, F].
            edge_index: Edge indices [2, E] (src → tgt).

        Returns:
            (new_positions, new_features): Updated coordinates and features.
        """
        src, tgt = edge_index
        N = positions.shape[0]

        # Relative positions and distances
        rel_pos = positions[tgt] - positions[src]  # [E, 3]
        dist = torch.norm(rel_pos, dim=-1, keepdim=True).clamp(min=1e-6)  # [E, 1]

        # Compute messages (invariant)
        msg_input = torch.cat([
            node_features[src],
            node_features[tgt],
            dist,
        ], dim=-1)  # [E, 2F+1]

        messages = self.msg_mlp(msg_input)  # [E, hidden]

        # Coordinate updates (equivariant)
        coord_weights = self.coord_mlp(messages)  # [E, 1]
        weighted_rel = rel_pos * coord_weights  # [E, 3]

        # Aggregate coordinate updates per node
        coord_agg = torch.zeros(N, 3, device=positions.device)
        coord_agg.scatter_add_(0, src.unsqueeze(-1).expand(-1, 3), weighted_rel)

        # Aggregate messages per node
        msg_agg = torch.zeros(N, messages.shape[-1], device=positions.device)
        msg_agg.scatter_add_(0, src.unsqueeze(-1).expand(-1, messages.shape[-1]), messages)

        # Mean- rather than sum-aggregation of the coordinate update, so the
        # step size does not grow with the number of neighbours.
        degree = torch.zeros(N, 1, device=positions.device)
        degree.scatter_add_(0, src.unsqueeze(-1), torch.ones_like(dist))
        coord_agg = coord_agg / degree.clamp(min=1.0)

        # Update positions (equivariant)
        new_positions = positions + self.coord_scale * coord_agg

        # Update features (invariant)
        node_input = torch.cat([node_features, msg_agg], dim=-1)
        new_features = self.node_mlp(node_input)

        if self.residual and self.node_feat_dim == self.output_feat_dim:
            new_features = new_features + node_features

        return new_positions, new_features
