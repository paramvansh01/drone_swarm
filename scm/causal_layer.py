"""
Causal diagnostics layer for C-DAWN.

Ties the structural causal model (`scm.diagnostics`) and the intervention
engine (`scm.interventions`) to the live swarm.

Responsibilities each tick:

  1. Measure the covariates (T, D, J, theta) and observed loss L for every
     link that matters.
  2. Feed them to the online SCM so the coefficients keep tracking.
  3. Decide which single degraded link is worth intervening on.
  4. Advance whatever intervention is running.

Which links "matter"
--------------------
Diagnosing every pair is O(n^2) of mostly irrelevant work — the link between
two scouts 3 km apart is expected to be dead and says nothing. This layer
scores links by how much the mission depends on them (anything carrying
traffic toward the ground station) and diagnoses those.
"""

from __future__ import annotations

import logging
import numpy as np
from typing import Dict, List, Optional, Tuple

from .diagnostics import OnlineDiagnostics
from .interventions import InterventionEngine

logger = logging.getLogger("cdawn.scm.layer")


class CausalLayer:
    """Online SCM + intervention orchestration for the live swarm."""

    def __init__(
        self,
        world,
        diagnostics: Optional[OnlineDiagnostics] = None,
        interventions: Optional[InterventionEngine] = None,
        max_links_per_tick: int = 8,
    ):
        self.world = world
        self.diagnostics = diagnostics or OnlineDiagnostics(loss_threshold=0.20)
        self.interventions = interventions or InterventionEngine()
        self.max_links_per_tick = max_links_per_tick

        self.link_state: Dict[str, dict] = {}
        self.last_results: List[dict] = []

    # ----------------------------------------------------------------------

    @staticmethod
    def _link_id(a: str, b: str) -> str:
        return f"{a}<->{b}" if a < b else f"{b}<->{a}"

    def _relevant_links(self, drones: dict) -> List[Tuple]:
        """
        Rank links by mission relevance.

        A link is relevant if it is part of the path home: scout-to-relay,
        relay-to-relay, or relay-to-GCS. Scout-to-scout links carry no
        backhaul traffic, so their loss is not a fault to be diagnosed.
        """
        from sim.drone import DroneRole

        alive = [d for d in drones.values() if d.is_alive]
        links = []

        for i, d1 in enumerate(alive):
            for d2 in alive[i + 1:]:
                roles = {d1.role, d2.role}
                if roles == {DroneRole.SCOUT}:
                    continue

                quality = d1.neighbors.get(d2.id)
                if quality is None:
                    continue

                distance = float(np.linalg.norm(d1.position - d2.position))

                # Prefer diagnosing links that are both degraded and close
                # enough that they *should* be working.
                priority = (1.0 - quality) / (1.0 + distance / 1500.0)
                links.append((priority, d1, d2, quality, distance))

        links.sort(key=lambda t: -t[0])
        return links[:self.max_links_per_tick]

    # ----------------------------------------------------------------------

    def update(self, drones: dict, rf_channel, sim_time: float) -> dict:
        """Run one diagnostics + intervention tick."""
        results = []

        noise_dbm = (rf_channel.jamming_power_dbm
                     if rf_channel.jamming_active
                     else rf_channel.noise_floor_dbm)

        candidates = self._relevant_links(drones)

        # Evict links whose endpoints are no longer both alive. Without this a
        # killed relay's last (healthy) links stayed in the table indefinitely
        # and kept being shown to the operator as live links.
        alive_ids = {d.id for d in drones.values() if d.is_alive}
        for link_id in list(self.link_state):
            a, b = self.link_state[link_id]["nodes"]
            if a not in alive_ids or b not in alive_ids:
                del self.link_state[link_id]

        node_noise = getattr(rf_channel, "node_noise", None) or {}

        for _, d1, d2, quality, distance in candidates:
            link_id = self._link_id(d1.id, d2.id)

            # With positional jammers the noise floor differs per aircraft;
            # the link's J is the worse of its two receivers.
            if d1.id in node_noise or d2.id in node_noise:
                noise_dbm = max(node_noise.get(d1.id, -200.0), node_noise.get(d2.id, -200.0))

            occlusion = self.world.compute_rf_occlusion_db(d1.position, d2.position)
            antenna = d1.get_antenna_pose_factor(d2.position)
            observed_loss = float(np.clip(1.0 - quality, 0.0, 1.0))

            diagnosis = self.diagnostics.update(
                weather=float(getattr(self, "weather_index", 0.0)),
                occlusion_db=occlusion,
                distance_m=distance,
                noise_floor_dbm=noise_dbm,
                antenna_factor=antenna,
                observed_loss=observed_loss,
                sim_time=sim_time,
                link_id=link_id,
            )

            self.link_state[link_id] = {
                "link_id": link_id,
                "nodes": [d1.id, d2.id],
                "quality": quality,
                "loss": observed_loss,
                "distance_m": distance,
                "occlusion_db": occlusion,
                "noise_dbm": noise_dbm,
                "root_cause": diagnosis["root_cause"],
                "predicted_loss": diagnosis["predicted_loss"],
                "time": sim_time,
            }

            # Advance an intervention already running on this link
            result = self.interventions.update(
                link_id=link_id,
                drone=self._intervention_drone(d1, d2),
                loss=observed_loss,
                noise_dbm=noise_dbm,
                distance_m=distance,
                sim_time=sim_time,
            )
            if result:
                results.append(result)

        # Arm at most one new intervention per tick, on the worst link
        self._maybe_arm(candidates, sim_time)

        self.last_results = results
        return {
            "diagnosed_links": len(candidates),
            "results": results,
        }

    @staticmethod
    def _intervention_drone(d1, d2):
        """
        Choose which endpoint climbs.

        Prefer a relay: relays exist to hold the link, and moving a scout off
        its survey target to fix a radio problem trades mission progress for
        connectivity. If both or neither are relays, move the lower aircraft,
        since it has the most to gain from altitude.
        """
        from sim.drone import DroneRole

        d1_relay = d1.role in (DroneRole.RELAY, DroneRole.GCS_RELAY)
        d2_relay = d2.role in (DroneRole.RELAY, DroneRole.GCS_RELAY)

        if d1_relay and not d2_relay:
            return d1
        if d2_relay and not d1_relay:
            return d2
        return d1 if d1.position[2] <= d2.position[2] else d2

    def _maybe_arm(self, candidates, sim_time: float):
        # Strictly one intervention in flight across the whole swarm. Limiting
        # arming to one *per tick* is not enough: a new one was armed every
        # few ticks while earlier ones were still measuring, and in a live
        # cluster run four ran at once — two on the same relay, whose climbs
        # stacked. Each test's "after" window then contained the other tests'
        # altitude changes, so none of them measured what it claimed to.
        if self.interventions.get_state()["active_count"] > 0:
            return

        for _, d1, d2, quality, distance in candidates:
            link_id = self._link_id(d1.id, d2.id)
            loss = float(np.clip(1.0 - quality, 0.0, 1.0))

            if self.interventions.should_intervene(link_id, loss, sim_time):
                drone = self._intervention_drone(d1, d2)
                self.interventions.arm(
                    drone_id=drone.id,
                    link_id=link_id,
                    altitude=float(drone.position[2]),
                    sim_time=sim_time,
                )
                return      # one at a time — concurrent interventions on
                            # overlapping links would confound each other

    # ----------------------------------------------------------------------

    def drain_events(self) -> List[dict]:
        return self.interventions.drain_events()

    def get_state(self) -> dict:
        links = sorted(self.link_state.values(),
                       key=lambda l: -l["loss"])[:10]
        return {
            "scm": self.diagnostics.get_state(),
            "interventions": self.interventions.get_state(),
            "links": links,
        }

    def reset(self):
        self.link_state.clear()
        self.last_results.clear()
        self.interventions.reset()
