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

        # Candidates are the aircraft the swarm can still hear, not the ones
        # the simulator knows to be flying
        alive = {d_id: d for d_id, d in drones.items() if self._believed_up(drones, d)}
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

    # The awareness layer (heartbeats). Set by the mission controller; without
    # it the election falls back to "does anyone measure a link to it now".
    awareness = None

    def _heard_now(self, drones: dict, drone) -> bool:
        if float(getattr(drone, "gcs_link", 0.0)) > 0.05:
            return True
        return any(o is not drone and o.neighbors.get(drone.id, 0.0) > 0.05
                   for o in drones.values())

    def _believed_up(self, drones: dict, drone) -> bool:
        if getattr(drone, "on_pad", False):
            return False
        if self.awareness is not None:
            return self.awareness.believed_airborne(drone)
        return self._heard_now(drones, drone)

    def check_and_heal(
        self,
        drones: dict,
        sim_time: float,
    ) -> Optional[Dict]:
        """
        Run the election when a relay has gone silent since the last check.

        Failure is detected the way a mesh detects it: the relay's heartbeat
        stops — no other node, and not the GCS, measures a link to it for
        HEARTBEAT_S. The election cannot tell a crashed relay from one whose
        radio has died, and does not try: either way its slot is empty. A relay
        that is heard again becomes a candidate for failure detection again.
        Relays leaving to recharge are replaced by the role manager's
        make-before-break handover instead, before they go.
        """
        from sim.drone import DroneRole

        if not hasattr(self, "_handled_failures"):
            self._handled_failures = set()

        silent = []
        for d_id, d in drones.items():
            if d.role not in (DroneRole.RELAY, DroneRole.GCS_RELAY) or getattr(d, "on_pad", False):
                continue
            if self._believed_up(drones, d):
                self._handled_failures.discard(d_id)      # heard again: re-arm
            else:
                silent.append(d_id)

        # Only heal failures we have not already healed: a silent node stays
        # silent, and re-electing for it every check would bury the log
        new_failures = [d for d in silent if d not in self._handled_failures]
        if not new_failures:
            return None

        logger.warning("Self-healing triggered: relays silent=%s", new_failures)
        self._handled_failures.update(new_failures)
        self._last_failures = new_failures
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
        # Measurement only (for the metric, never for the decision): how long
        # after the relay actually went silent the swarm acted
        failed = [drones[d] for d in getattr(self, "_last_failures", []) if d in drones]
        failed_at = [d.killed_at for d in failed if getattr(d, "killed_at", None) is not None]  # eval-only
        if failed_at:
            detection_ms = (sim_time - max(failed_at)) * 1000.0
        elif self.awareness is not None and failed:
            detection_ms = max(self.awareness.heard_ago(d.id) for d in failed) * 1000.0
        else:
            detection_ms = 0.0

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
