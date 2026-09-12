"""
Online relay position optimizer for C-DAWN.

Runs the E(3)-GNN topology network in an online optimization loop:
1. Build graph from current drone positions + link quality
2. Forward pass through topology_net
3. Apply position updates to relay drones
4. Log convergence time + PDR
"""

import torch
import numpy as np
import time
import logging
from typing import Dict, Optional

from .topology_net import TopologyNet, build_node_features

logger = logging.getLogger("cdawn.gnn.optimizer")


class RelayOptimizer:
    """
    Online relay position optimizer.

    Runs the TopologyNet to compute optimal relay positions
    and applies corrections to relay drones in the simulation.
    """

    def __init__(
        self,
        model: Optional[TopologyNet] = None,
        update_rate: float = 0.3,    # blend factor for position updates
        min_improvement: float = 0.01,  # minimum PDR improvement to accept move
        max_displacement: float = 5.0,   # max meters per update step
    ):
        self.model = model or TopologyNet()
        self.model.eval()
        self.update_rate = update_rate
        self.min_improvement = min_improvement
        self.max_displacement = max_displacement

        # Metrics
        self.last_convergence_time_ms = 0.0
        self.optimization_count = 0
        self.total_pdr_improvement = 0.0
        self._last_pdr = None

    @torch.no_grad()
    def optimize(self, drones: dict, world, rf_channel) -> dict:
        """
        Run one optimization step.

        Called by the simulation runner every N ticks.

        Args:
            drones: Dict of drone_id -> Drone objects.
            world: World object for LOS checks.
            rf_channel: RFChannel object.

        Returns:
            Metrics dict with convergence time, PDR change, etc.
        """
        start_time = time.time()

        # Build node features
        positions, features, drone_ids = build_node_features(drones)

        if len(drone_ids) < 2:
            return {"status": "insufficient_nodes"}

        # Forward pass
        new_positions, weights = self.model(positions, features)

        # Apply updates only to relay drones
        from sim.drone import DroneRole
        updates_applied = 0

        for i, d_id in enumerate(drone_ids):
            drone = drones[d_id]

            # Only move relay drones
            if drone.role not in (DroneRole.RELAY, DroneRole.GCS_RELAY):
                continue

            # Compute displacement
            delta = new_positions[i].numpy() - drone.position
            displacement = np.linalg.norm(delta)

            # Clamp displacement
            if displacement > self.max_displacement:
                delta = delta * (self.max_displacement / displacement)

            # Apply with blending
            new_pos = drone.position + self.update_rate * delta

            # Ensure new position is valid
            if world.is_in_bounds(new_pos) and not world.check_collision(new_pos):
                # Update drone target (the controller will fly to it)
                drone.set_target(new_pos)
                updates_applied += 1

        # Compute metrics
        elapsed_ms = (time.time() - start_time) * 1000
        self.last_convergence_time_ms = elapsed_ms
        self.optimization_count += 1

        # Compute current swarm PDR
        all_qualities = []
        for d in drones.values():
            if d.is_alive:
                all_qualities.extend(d.neighbors.values())
        current_pdr = np.mean(all_qualities) if all_qualities else 0.0

        pdr_improvement = 0.0
        if self._last_pdr is not None:
            pdr_improvement = current_pdr - self._last_pdr
            self.total_pdr_improvement += max(0, pdr_improvement)
        self._last_pdr = current_pdr

        result = {
            "status": "ok",
            "convergence_time_ms": elapsed_ms,
            "updates_applied": updates_applied,
            "current_pdr": current_pdr,
            "pdr_improvement": pdr_improvement,
            "optimization_count": self.optimization_count,
        }

        if self.optimization_count % 10 == 0:
            logger.info(
                f"GNN Opt #{self.optimization_count}: "
                f"PDR={current_pdr:.3f} Δ={pdr_improvement:+.4f} "
                f"time={elapsed_ms:.1f}ms updates={updates_applied}"
            )

        return result

    def get_metrics(self) -> dict:
        """Get optimizer metrics for dashboard."""
        return {
            "convergence_time_ms": self.last_convergence_time_ms,
            "optimization_count": self.optimization_count,
            "total_pdr_improvement": self.total_pdr_improvement,
            "last_pdr": self._last_pdr,
        }


def make_topology_optimizer_hook(optimizer: RelayOptimizer):
    """
    Create a topology optimizer hook for the simulation runner.

    Returns a callable: hook(drones, world, rf_channel)
    """
    def hook(drones, world, rf_channel):
        return optimizer.optimize(drones, world, rf_channel)
    return hook
