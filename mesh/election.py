"""
Relay election for the UAV-X mesh: the fast path of fault recovery.

When a relay fails, the gap is filled immediately by promoting the
best-scoring airborne scout — within one 100 ms check, well inside the
<300 ms target. The steady-state question of how many relays the mission
needs, and whether a charged aircraft should be launched from the GCS instead,
belongs to `mesh.roles.RoleManager`, which sets `relay_count` every second.
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
        self._last_heal_latency_ms = 0.0
        self._heal_log: List[Dict] = []

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

    # When relays fall below `relay_count`, promote a scout to relay duty.
    # Trades survey capacity for backhaul: a scout whose data cannot reach the
    # ground station has surveyed nothing useful. Compared head-to-head in
    # bench/relay_strategies.py.
    PROMOTE_SCOUTS = True
    MIN_SCOUTS = 1

    def run_election(
        self,
        drones: dict,
        sim_time: float,
        force: bool = False,
    ) -> Dict:
        """
        Minimal-change election: fill only the roles that are now vacant.

        The previous election re-ranked the whole swarm on every failure and
        reassigned every role from the ranking — so losing one relay could
        demote the other relay to scout, or hand the ground-station link to a
        scout three kilometres up the valley. Operators placing their own
        relays saw their assignments silently overwritten. Here nothing that
        still works is ever demoted; only the missing role is filled, by the
        best-scoring eligible aircraft.
        """
        start = time.perf_counter()
        from sim.drone import DroneRole

        alive = {d_id: d for d_id, d in drones.items() if d.is_alive}
        if len(alive) < 2:
            return {"status": "insufficient_nodes", "elapsed_ms": 0}

        def score(drone):
            quality = list(drone.neighbors.values())
            mean_quality = float(np.mean(quality)) if quality else 0.0
            return self.compute_election_score(
                drone.battery, mean_quality, drone.role == DroneRole.SCOUT)

        scores = {d_id: score(d) for d_id, d in alive.items()}
        promoted = []

        # Relay count: promote the best scout into the vacant slot(s)
        relays = [d for d in alive.values() if d.role == DroneRole.RELAY]
        scouts = [d for d in alive.values() if d.role == DroneRole.SCOUT]
        if self.PROMOTE_SCOUTS:
            while len(relays) < self.relay_count and len(scouts) > self.MIN_SCOUTS:
                best = max(scouts, key=lambda d: scores[d.id])
                if scores[best.id] <= 0.0:
                    break
                best.role = DroneRole.RELAY
                best.assigned_poi = None
                scouts.remove(best)
                relays.append(best)
                promoted.append((best.id, "RELAY"))

        elapsed_ms = (time.perf_counter() - start) * 1000
        self._last_election_duration_ms = elapsed_ms
        self._last_election_time = sim_time

        gcs_now = "GCS"
        result = {
            "status": "ok",
            "elapsed_ms": elapsed_ms,
            "within_target": elapsed_ms < self.election_timeout_ms,
            "gcs_relay": gcs_now,
            "relays": [d.id for d in relays],
            "promoted": promoted,
            "scores": scores,
        }
        self._election_log.append({
            "time": sim_time, "elapsed_ms": elapsed_ms,
            "gcs_relay": gcs_now, "relays": result["relays"], "promoted": promoted,
        })
        if len(self._election_log) > 100:
            self._election_log = self._election_log[-50:]

        logger.info("Election in %.2f ms | GCS=%s relays=%s promoted=%s",
                    elapsed_ms, gcs_now, result["relays"], promoted or "none")
        return result

    def check_and_heal(
        self,
        drones: dict,
        sim_time: float,
    ) -> Optional[Dict]:
        """
        Run the election when a relay has failed since the last check.

        Only genuine failures trigger it. Relays leaving to recharge are
        replaced by the role manager's make-before-break handover instead,
        before they go.
        """
        from sim.drone import DroneRole, DroneStatus

        killed_relays = [
            d_id for d_id, d in drones.items()
            if d.status == DroneStatus.KILLED and d.role in (DroneRole.RELAY, DroneRole.GCS_RELAY)
        ]

        # Only heal failures we have not already healed. `killed_relays` is a
        # standing condition — a dead node stays dead — so re-running the
        # election on it every check re-elected the same replacement several
        # times a second and buried the operator's event log.
        if not hasattr(self, "_handled_failures"):
            self._handled_failures = set()

        new_failures = [d for d in killed_relays if d not in self._handled_failures]
        if not new_failures:
            return None

        logger.warning("Self-healing triggered: new relay failures=%s", new_failures)
        self._handled_failures.update(new_failures)
        return self.run_election(drones, sim_time, force=True)

    def record_heal_latency(self, drones: dict, sim_time: float,
                            extra_ms: float = 0.0) -> float:
        """
        End-to-end self-healing latency for the most recent failure.

            (time noticed - time failed)  +  election compute  +  reroute

        This is the number the <300 ms target is actually about. Election
        compute alone is microseconds and would make any system look
        instant; the detection delay is where the time goes.
        """
        failed_at = [d.killed_at for d in drones.values()
                     if getattr(d, "killed_at", None) is not None]
        detection_ms = (sim_time - max(failed_at)) * 1000.0 if failed_at else 0.0

        latency = max(detection_ms, 0.0) + self._last_election_duration_ms + extra_ms
        self._last_heal_latency_ms = latency
        self._heal_log.append({
            "time": sim_time,
            "detection_ms": detection_ms,
            "election_ms": self._last_election_duration_ms,
            "reroute_ms": extra_ms,
            "total_ms": latency,
            "within_target": latency < self.election_timeout_ms,
        })
        return latency

    def get_last_election_time_ms(self) -> float:
        """Get the duration of the last election in ms."""
        return self._last_election_duration_ms

    def get_state(self) -> dict:
        """Serialize election state."""
        return {
            # End-to-end heal latency is what the dashboard reports; the raw
            # election compute time is kept alongside it for transparency.
            "last_election_ms": getattr(self, "_last_heal_latency_ms", 0.0),
            "last_election_compute_ms": self._last_election_duration_ms,
            "heals": list(getattr(self, "_heal_log", []))[-5:],
            "election_count": len(self._election_log),
            "recent_elections": self._election_log[-3:],
        }
