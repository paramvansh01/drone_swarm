"""
E(3)-Equivariant relay topology network for C-DAWN.

Given the current swarm state, the network proposes a position for every
relay aircraft such that the mesh keeps the scouts connected back to the
ground station, while respecting separation and terrain-clearance limits.

Equivariance
------------
The coordinate pathway is built from relative vectors weighted by invariant
scalars, so rotating or translating the whole formation rotates/translates the
proposed positions identically. Practically this means the network trained in
one valley orientation transfers to a valley running any other direction
without retraining — the property Section 6 of the proposal claims, and which
`tests/test_gnn.py` asserts numerically.

Numerical note
--------------
World coordinates here are in the thousands of metres. Feeding those straight
into an MLP saturates it immediately, so positions are centred on the swarm
centroid and divided by a length scale before message passing, then mapped
back afterwards. Centring is exactly the operation translation-equivariance
makes free, so this costs nothing in symmetry.
"""

from __future__ import annotations

import numpy as np
import torch
import torch.nn as nn
from typing import Dict, List, Optional, Tuple

from .equivariant_layer import E3MessagePassingLayer


# Node features:
#   [battery/100, is_scout, is_relay, is_gcs_relay, mean_pdr, min_pdr,
#    num_neighbours/8, agl/300, is_jammed]
NODE_FEAT_DIM = 9

# Length scale used to normalise coordinates before message passing (metres)
LENGTH_SCALE = 250.0


class TopologyNet(nn.Module):
    """E(3)-equivariant network proposing relay positions."""

    NODE_FEAT_DIM = NODE_FEAT_DIM

    def __init__(
        self,
        num_layers: int = 4,
        hidden_dim: int = 64,
        max_displacement: float = 220.0,
    ):
        super().__init__()
        self.max_displacement = max_displacement

        self.input_embed = nn.Sequential(
            nn.Linear(NODE_FEAT_DIM, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
        )

        self.layers = nn.ModuleList([
            E3MessagePassingLayer(
                node_feat_dim=hidden_dim,
                hidden_dim=hidden_dim,
                residual=True,
            )
            for _ in range(num_layers)
        ])

        # Per-node gate: how strongly to apply the proposed displacement.
        self.output_mlp = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.SiLU(),
            nn.Linear(hidden_dim // 2, 1),
            nn.Sigmoid(),
        )

    @staticmethod
    def build_fully_connected_edges(n: int, device=None) -> torch.Tensor:
        """Fully connected edge index (the swarm is small — under 10 nodes)."""
        idx = torch.arange(n, device=device)
        src = idx.repeat_interleave(n)
        tgt = idx.repeat(n)
        mask = src != tgt
        return torch.stack([src[mask], tgt[mask]], dim=0)

    def forward(
        self,
        positions: torch.Tensor,          # [N, 3] world metres
        node_features: torch.Tensor,      # [N, NODE_FEAT_DIM]
        edge_index: Optional[torch.Tensor] = None,
        movable_mask: Optional[torch.Tensor] = None,   # [N] bool
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Returns:
            (proposed_positions [N, 3], gate [N])
        """
        n = positions.shape[0]
        if edge_index is None:
            edge_index = self.build_fully_connected_edges(n, positions.device)

        # --- normalise coordinates (translation-equivariant) ---------------
        centroid = positions.mean(dim=0, keepdim=True)
        pos_local = (positions - centroid) / LENGTH_SCALE

        h = self.input_embed(node_features)

        p = pos_local
        for layer in self.layers:
            p, h = layer(p, h, edge_index)

        gate = self.output_mlp(h).squeeze(-1)                    # [N]

        delta_local = p - pos_local
        delta = delta_local * LENGTH_SCALE * gate.unsqueeze(-1)

        # Bound the per-step displacement so a single forward pass cannot
        # command a relay across the map.
        norm = torch.norm(delta, dim=-1, keepdim=True).clamp(min=1e-6)
        scale = torch.clamp(self.max_displacement / norm, max=1.0)
        delta = delta * scale

        if movable_mask is not None:
            delta = delta * movable_mask.unsqueeze(-1).to(delta.dtype)

        return positions + delta, gate


# --------------------------------------------------------------------------
# Objective
# --------------------------------------------------------------------------

class TopologyObjective:
    """
    Differentiable objective scoring a proposed relay configuration.

    L = -w_conn * mean_scout_connectivity
        + w_sep  * separation_violation
        + w_geo  * terrain_clearance_violation
        + w_move * displacement_effort

    The connectivity term is the real one: soft best-path reliability from the
    ground station to each scout through the proposed mesh, computed with the
    terrain-aware differentiable link budget. The rest are safety and energy
    constraints.
    """

    def __init__(
        self,
        rf,                                   # gnn.rf_differentiable.DifferentiableRF
        min_separation: float = 25.0,
        min_agl: float = 40.0,
        max_agl: float = 480.0,
        w_connectivity: float = 1.0,
        w_separation: float = 2.0,
        w_geofence: float = 1.5,
        w_effort: float = 0.02,
    ):
        self.rf = rf
        self.min_separation = min_separation
        self.min_agl = min_agl
        self.max_agl = max_agl
        self.w_connectivity = w_connectivity
        self.w_separation = w_separation
        self.w_geofence = w_geofence
        self.w_effort = w_effort

    def __call__(
        self,
        positions: torch.Tensor,           # [N, 3] proposed
        original: torch.Tensor,            # [N, 3] current
        gcs_index: int,
        scout_indices: List[int],
        jamming_dbm: Optional[torch.Tensor] = None,
    ) -> Tuple[torch.Tensor, Dict[str, float]]:
        n = positions.shape[0]

        # --- connectivity --------------------------------------------------
        pdr = self.rf.pairwise_pdr(positions, jamming_dbm)

        reliabilities = [
            self.rf.best_path_reliability(pdr, gcs_index, s)
            for s in scout_indices
        ]
        if reliabilities:
            stacked = torch.stack(reliabilities)
            # Penalise the *worst-connected* scout hardest: a mesh that serves
            # two scouts perfectly and abandons a third has not done its job.
            connectivity = stacked.mean() - 0.5 * (stacked.mean() - stacked.min())
        else:
            connectivity = torch.tensor(0.0, device=positions.device)

        # --- separation ----------------------------------------------------
        diff = positions.unsqueeze(0) - positions.unsqueeze(1)
        dists = torch.norm(diff, dim=-1) + torch.eye(
            n, device=positions.device) * 1e6
        violation = torch.relu(self.min_separation - dists)
        separation = (violation ** 2).sum() / max(n * (n - 1), 1)

        # --- terrain clearance ---------------------------------------------
        ground = self.rf.sample_terrain(positions[:, :2])
        agl = positions[:, 2] - ground
        geofence = (torch.relu(self.min_agl - agl) ** 2
                    + torch.relu(agl - self.max_agl) ** 2).mean()

        # --- effort ---------------------------------------------------------
        effort = (torch.norm(positions - original, dim=-1) ** 2).mean()

        loss = (-self.w_connectivity * connectivity
                + self.w_separation * separation / 100.0
                + self.w_geofence * geofence / 100.0
                + self.w_effort * effort / 1000.0)

        metrics = {
            "connectivity": float(connectivity.detach()),
            "min_scout_pdr": float(stacked.min().detach()) if reliabilities else 0.0,
            "separation_violation_m": float(violation.max().detach()),
            "min_agl_m": float(agl.min().detach()),
            "mean_displacement_m": float(
                torch.norm(positions - original, dim=-1).mean().detach()),
        }
        return loss, metrics


# --------------------------------------------------------------------------
# Feature construction
# --------------------------------------------------------------------------

def build_node_features(
    drones: dict,
    world=None,
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor, List[str]]:
    """
    Build (positions, features, movable_mask, ids) from live drone state.

    Only aircraft with measured links are included — a node nobody can hear
    is not part of the mesh, and including it would let the optimiser plan
    routes through a drone that has fallen out of the sky.

    When `world` carries a ground station, it is appended as a fixed node with
    the ground-station flag set: the anchor every relay chain must reach.
    """
    from sim.drone import DroneRole

    ids, positions, features, movable = [], [], [], []

    def heard(d):
        # Planned from measurements: an aircraft nobody can hear (crashed, or
        # radio out) has no links and is not part of the mesh being planned
        return bool(d.neighbors) or float(getattr(d, "gcs_link", 0.0)) > 0.0

    for d_id, drone in drones.items():
        if not heard(drone):
            continue

        ids.append(d_id)
        positions.append(drone.position.tolist())

        qualities = list(drone.neighbors.values()) or [0.0]
        agl = world.agl(drone.position) if world is not None else drone.position[2]

        features.append([
            drone.battery / 100.0,
            1.0 if drone.role == DroneRole.SCOUT else 0.0,
            1.0 if drone.role == DroneRole.RELAY else 0.0,
            1.0 if drone.role == DroneRole.GCS_RELAY else 0.0,
            float(np.mean(qualities)),
            float(np.min(qualities)),
            len(drone.neighbors) / 8.0,
            float(agl) / 300.0,
            0.0,      # jamming flag, set by the caller when known
        ])

        # Only relays are repositionable; scouts are flying the survey and
        # aircraft on their way home are not part of the plan. A relay being
        # relieved holds its station while the plan moves on without it.
        movable.append(drone.role == DroneRole.RELAY
                       and not getattr(drone, "handover_to", None))

    gcs = getattr(world, "gcs", None) if world is not None else None
    if gcs is not None:
        links = [float(getattr(d, "gcs_link", 0.0)) for d in drones.values() if heard(d)] or [0.0]
        ids.append(gcs.id)
        positions.append(np.asarray(gcs.position, dtype=float).tolist())
        features.append([
            1.0, 0.0, 0.0, 1.0,
            float(np.mean(links)), float(np.min(links)),
            sum(1 for q in links if q > 0.0) / 8.0,
            float(gcs.mast_m) / 300.0,
            0.0,
        ])
        movable.append(False)

    return (
        torch.tensor(positions, dtype=torch.float32),
        torch.tensor(features, dtype=torch.float32),
        torch.tensor(movable, dtype=torch.bool),
        ids,
    )
