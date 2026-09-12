"""
Causal interventions for C-DAWN.

Implements the do(Δz) altitude intervention and causal effect
estimation from the proposal.

Intervention procedure:
1. On L exceeding threshold, execute do(Δz = +15m)
2. Estimate causal effect via pre/post difference in L
3. Decision rule: effect > threshold → terrain occlusion; else → handover
"""

import numpy as np
import time
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field

logger = logging.getLogger("cdawn.scm.interventions")


@dataclass
class InterventionRecord:
    """Record of a causal intervention."""
    intervention_id: str
    drone_id: str
    link_id: str
    start_time: float
    end_time: Optional[float] = None

    # Pre-intervention state
    pre_altitude: float = 0.0
    pre_loss: float = 0.0
    pre_T: float = 0.0
    pre_D: float = 0.0

    # Post-intervention state
    post_altitude: float = 0.0
    post_loss: float = 0.0
    post_T: float = 0.0
    post_D: float = 0.0

    # Causal effect estimate
    delta_loss: float = 0.0
    causal_effect: float = 0.0
    attribution: str = ""  # "terrain_occlusion", "hardware_distance", "jamming"
    confidence: float = 0.0

    # Status
    phase: str = "pending"  # "pending", "pre_observation", "intervening", "post_observation", "complete"


class InterventionEngine:
    """
    Executes and evaluates causal interventions.

    When the SCM detects anomalous packet loss, this engine:
    1. Records pre-intervention baseline over ~1 second
    2. Executes do(Δz = +15m) — commands the drone to increase altitude
    3. Records post-intervention metrics over ~1 second
    4. Estimates the causal effect of altitude change on packet loss
    5. Attributes root cause and triggers appropriate response
    """

    def __init__(
        self,
        delta_z: float = 15.0,          # meters altitude increase
        observation_window: float = 2.0,  # seconds for pre/post observation
        effect_threshold: float = 0.05,   # minimum ΔL to attribute to terrain
        cooldown: float = 10.0,           # seconds between interventions on same link
        max_interventions_per_link: int = 5,
    ):
        self.delta_z = delta_z
        self.observation_window = observation_window
        self.effect_threshold = effect_threshold
        self.cooldown = cooldown
        self.max_interventions_per_link = max_interventions_per_link

        # Active interventions
        self._active: Dict[str, InterventionRecord] = {}
        self._completed: List[InterventionRecord] = []
        self._link_cooldowns: Dict[str, float] = {}
        self._intervention_counter = 0

    def should_intervene(self, link_id: str, loss: float, sim_time: float, threshold: float = 0.15) -> bool:
        """
        Check if an intervention should be triggered.

        Returns True if:
        1. Loss exceeds threshold
        2. Link is not in cooldown
        3. No active intervention on this link
        4. Haven't exceeded max interventions
        """
        if loss < threshold:
            return False

        if link_id in self._active:
            return False

        last_intervention = self._link_cooldowns.get(link_id, -float('inf'))
        if sim_time - last_intervention < self.cooldown:
            return False

        link_count = sum(1 for r in self._completed if r.link_id == link_id)
        if link_count >= self.max_interventions_per_link:
            return False

        return True

    def start_intervention(
        self,
        drone_id: str,
        link_id: str,
        current_altitude: float,
        current_loss: float,
        current_T: float,
        current_D: float,
        sim_time: float,
    ) -> InterventionRecord:
        """
        Start a new causal intervention.

        Phase 1: Record pre-intervention baseline.
        """
        self._intervention_counter += 1
        intervention_id = f"INT-{self._intervention_counter:04d}"

        record = InterventionRecord(
            intervention_id=intervention_id,
            drone_id=drone_id,
            link_id=link_id,
            start_time=sim_time,
            pre_altitude=current_altitude,
            pre_loss=current_loss,
            pre_T=current_T,
            pre_D=current_D,
            phase="pre_observation",
        )

        self._active[link_id] = record
        logger.info(
            f"[{intervention_id}] Starting intervention on {link_id} | "
            f"drone={drone_id} alt={current_altitude:.1f}m loss={current_loss:.3f}"
        )

        return record

    def execute_intervention(
        self,
        link_id: str,
        drone,
        sim_time: float,
    ) -> Optional[Dict]:
        """
        Execute the altitude change do(Δz = +15m).

        Called after pre-observation window.
        """
        if link_id not in self._active:
            return None

        record = self._active[link_id]

        if record.phase != "pre_observation":
            return None

        # Check if pre-observation window has elapsed
        if sim_time - record.start_time < self.observation_window / 2:
            return None

        # Execute do(Δz = +15m) — set drone target altitude higher
        current_target = drone.target_position.copy() if drone.target_position is not None else drone.position.copy()
        current_target[2] += self.delta_z
        drone.set_target(current_target)

        record.phase = "intervening"
        logger.info(
            f"[{record.intervention_id}] Executing do(Δz=+{self.delta_z}m) on {drone.id} | "
            f"new_target_alt={current_target[2]:.1f}m"
        )

        return {"action": "altitude_change", "delta_z": self.delta_z}

    def evaluate_intervention(
        self,
        link_id: str,
        current_loss: float,
        current_altitude: float,
        current_T: float,
        current_D: float,
        sim_time: float,
    ) -> Optional[Dict]:
        """
        Evaluate the causal effect of the intervention.

        Called after post-observation window.
        """
        if link_id not in self._active:
            return None

        record = self._active[link_id]

        if record.phase != "intervening":
            return None

        # Check if enough time has passed for the drone to reach new altitude
        if sim_time - record.start_time < self.observation_window:
            return None

        # Record post-intervention state
        record.post_altitude = current_altitude
        record.post_loss = current_loss
        record.post_T = current_T
        record.post_D = current_D
        record.end_time = sim_time

        # Estimate causal effect
        record.delta_loss = record.pre_loss - record.post_loss  # positive = improvement
        record.causal_effect = record.delta_loss

        # Attribution decision rule
        if record.delta_loss > self.effect_threshold:
            record.attribution = "terrain_occlusion"
            record.confidence = min(1.0, record.delta_loss / 0.3)
            logger.info(
                f"[{record.intervention_id}] TERRAIN OCCLUSION detected | "
                f"ΔL={record.delta_loss:+.3f} conf={record.confidence:.2f}"
            )
        elif record.delta_loss > 0:
            record.attribution = "partial_terrain"
            record.confidence = 0.3 + 0.5 * (record.delta_loss / self.effect_threshold)
            logger.info(
                f"[{record.intervention_id}] Partial terrain effect | "
                f"ΔL={record.delta_loss:+.3f}"
            )
        else:
            record.attribution = "hardware_distance_or_jamming"
            record.confidence = 0.7
            logger.info(
                f"[{record.intervention_id}] NOT terrain — likely jamming/distance | "
                f"ΔL={record.delta_loss:+.3f} → triggering handover"
            )

        record.phase = "complete"

        # Move to completed
        del self._active[link_id]
        self._completed.append(record)
        self._link_cooldowns[link_id] = sim_time

        return {
            "intervention_id": record.intervention_id,
            "attribution": record.attribution,
            "causal_effect": record.causal_effect,
            "confidence": record.confidence,
            "delta_loss": record.delta_loss,
            "pre_loss": record.pre_loss,
            "post_loss": record.post_loss,
            "recommendation": self._get_recommendation(record),
        }

    def _get_recommendation(self, record: InterventionRecord) -> str:
        """Generate a recommendation based on intervention outcome."""
        if record.attribution == "terrain_occlusion":
            return (
                f"Maintain higher altitude (+{self.delta_z}m). "
                f"Terrain occlusion reduced packet loss by {record.delta_loss:.1%}."
            )
        elif record.attribution == "partial_terrain":
            return (
                f"Altitude change partially effective. "
                f"Consider relay repositioning via GNN for further improvement."
            )
        else:
            return (
                f"Altitude change ineffective — root cause is likely "
                f"jamming or distance limits. Trigger relay handover/reroute."
            )

    def get_active_interventions(self) -> List[Dict]:
        """Get currently active interventions."""
        return [
            {
                "id": r.intervention_id,
                "drone_id": r.drone_id,
                "link_id": r.link_id,
                "phase": r.phase,
                "elapsed": 0.0,
            }
            for r in self._active.values()
        ]

    def get_completed_interventions(self, n: int = 20) -> List[Dict]:
        """Get N most recent completed interventions."""
        return [
            {
                "id": r.intervention_id,
                "drone_id": r.drone_id,
                "link_id": r.link_id,
                "attribution": r.attribution,
                "causal_effect": r.causal_effect,
                "confidence": r.confidence,
                "delta_loss": r.delta_loss,
            }
            for r in self._completed[-n:]
        ]

    def get_state(self) -> dict:
        """Serialize intervention engine state."""
        return {
            "active_count": len(self._active),
            "completed_count": len(self._completed),
            "active": self.get_active_interventions(),
            "recent_completed": self.get_completed_interventions(5),
        }
