"""
Leader/relay election protocol for C-DAWN.

Battery-weighted election protocol for relay role assignment
with self-healing: on node failure, remaining drones re-elect
within <300ms target.
"""

import numpy as np
import time
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger("cdawn.mesh.election")


class RelayElection:
    """
    Battery-weighted relay election protocol.

    Election score = battery_level × mean_link_quality × role_weight

    On "KILL NODE" event, remaining drones re-elect relay within
    <300ms target. The election is distributed — each node computes
    scores locally and the highest score wins.
    """

    def __init__(
        self,
        election_timeout_ms: float = 300.0,
        min_battery_for_relay: float = 20.0,
        relay_count: int = 2,
    ):
        self.election_timeout_ms = election_timeout_ms
        self.min_battery_for_relay = min_battery_for_relay
        self.relay_count = relay_count

        # Election history
        self._election_log: List[Dict] = []
        self._last_election_time = -float('inf')
        self._last_election_duration_ms = 0.0

    def compute_election_score(
        self,
        battery: float,
        mean_link_quality: float,
        is_scout: bool,
    ) -> float:
        """
        Compute election score for a drone.

        Higher score = better relay candidate.
        Scouts get a penalty to prefer keeping them in scouting role.
        """
        if battery < self.min_battery_for_relay:
            return 0.0

        role_weight = 0.7 if is_scout else 1.0  # prefer non-scouts for relay
        score = (battery / 100.0) * mean_link_quality * role_weight

        return score

    def run_election(
        self,
        drones: dict,
        sim_time: float,
        force: bool = False,
    ) -> Dict:
        """
        Run a relay election across the swarm.

        Args:
            drones: Dict of drone_id -> Drone objects.
            sim_time: Current simulation time.
            force: Force re-election even without trigger.

        Returns:
            Election result dict with timing and role assignments.
        """
        start = time.time()

        from sim.drone import DroneRole

        alive = {d_id: d for d_id, d in drones.items() if d.is_alive}
        if len(alive) < 2:
            return {"status": "insufficient_nodes", "elapsed_ms": 0}

        # Compute scores
        scores = {}
        for d_id, drone in alive.items():
            link_qualities = list(drone.neighbors.values())
            mean_quality = np.mean(link_qualities) if link_qualities else 0.0
            is_scout = drone.role == DroneRole.SCOUT

            score = self.compute_election_score(drone.battery, mean_quality, is_scout)
            scores[d_id] = score

        # Sort by score (descending)
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        # Assign relay roles to top candidates
        new_relays = []
        new_gcs_relay = None

        for i, (d_id, score) in enumerate(ranked):
            if i == 0 and score > 0:
                # Best candidate becomes GCS relay
                alive[d_id].role = DroneRole.GCS_RELAY
                new_gcs_relay = d_id
            elif i < self.relay_count and score > 0:
                alive[d_id].role = DroneRole.RELAY
                new_relays.append(d_id)
            else:
                # Keep as scout if not already a scout with active assignment
                if alive[d_id].role in (DroneRole.RELAY, DroneRole.GCS_RELAY):
                    alive[d_id].role = DroneRole.SCOUT

        elapsed_ms = (time.time() - start) * 1000
        self._last_election_duration_ms = elapsed_ms
        self._last_election_time = sim_time

        result = {
            "status": "ok",
            "elapsed_ms": elapsed_ms,
            "within_target": elapsed_ms < self.election_timeout_ms,
            "gcs_relay": new_gcs_relay,
            "relays": new_relays,
            "scores": scores,
            "ranked": [(d_id, score) for d_id, score in ranked],
        }

        self._election_log.append({
            "time": sim_time,
            "elapsed_ms": elapsed_ms,
            "gcs_relay": new_gcs_relay,
            "relays": new_relays,
        })
        if len(self._election_log) > 100:
            self._election_log = self._election_log[-50:]

        logger.info(
            f"Election complete in {elapsed_ms:.1f}ms | "
            f"GCS_RELAY={new_gcs_relay} RELAYS={new_relays} "
            f"{'✓ within target' if elapsed_ms < self.election_timeout_ms else '✗ EXCEEDED TARGET'}"
        )

        return result

    def check_and_heal(
        self,
        drones: dict,
        sim_time: float,
    ) -> Optional[Dict]:
        """
        Check if self-healing is needed and run election if so.

        Triggers if:
        1. A relay/GCS_relay node is dead
        2. No relay exists in the swarm
        """
        from sim.drone import DroneRole, DroneStatus

        alive = {d_id: d for d_id, d in drones.items() if d.is_alive}
        has_gcs_relay = any(d.role == DroneRole.GCS_RELAY for d in alive.values())
        has_relay = any(d.role == DroneRole.RELAY for d in alive.values())

        # Check for killed relay/GCS nodes
        killed_relays = [
            d_id for d_id, d in drones.items()
            if d.status == DroneStatus.KILLED and d.role in (DroneRole.RELAY, DroneRole.GCS_RELAY)
        ]

        if not has_gcs_relay or not has_relay or killed_relays:
            logger.warning(
                f"Self-healing triggered! killed_relays={killed_relays} "
                f"has_gcs={has_gcs_relay} has_relay={has_relay}"
            )
            return self.run_election(drones, sim_time, force=True)

        return None

    def get_last_election_time_ms(self) -> float:
        """Get the duration of the last election in ms."""
        return self._last_election_duration_ms

    def get_state(self) -> dict:
        """Serialize election state."""
        return {
            "last_election_ms": self._last_election_duration_ms,
            "election_count": len(self._election_log),
            "recent_elections": self._election_log[-3:],
        }
