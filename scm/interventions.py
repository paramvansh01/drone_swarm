"""
Causal interventions for C-DAWN.

Implements the do(Delta z) altitude intervention and the causal-effect
estimate described in Section 2.3 of the proposal.

Lifecycle of one intervention
-----------------------------
    ARMED       link loss exceeded threshold; start collecting a baseline
    PRE         averaging L over the pre-window (and watching J)
    ACTUATING   do(dz) written to the aircraft; waiting for it to climb
    POST        averaging L at the new altitude
    COMPLETE    effect estimated, attributed, and either held or reverted

What makes this a real intervention
-----------------------------------
`do(dz)` writes to `drone.altitude_offset_cmd`, which the guidance layer adds
to every setpoint it produces. The aircraft physically climbs; the terrain
profile under the link genuinely changes; the RF model recomputes diffraction
loss from the new geometry. Nothing about the effect is simulated separately
from the flight — if the drone cannot climb, there is no effect to measure.

The honest limitation, implemented rather than just admitted
------------------------------------------------------------
A pre/post difference identifies the causal effect of altitude only if the
other parents of L hold still across the window. In an EW environment the
jammer is adversarial and J will not oblige. Rather than quietly reporting a
number that assumes otherwise, this engine *records J and D across the whole
window* and refuses to make a clean attribution when either moved
materially: the result is returned with `confounded=True` and a stated
reason. The proposal says this approximation is disclosed to the jury; here
it is detected per-intervention and surfaced on the dashboard.
"""

from __future__ import annotations

import logging
import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional

logger = logging.getLogger("cdawn.scm.interventions")


# Phases
ARMED = "armed"
PRE = "pre_observation"
ACTUATING = "actuating"
POST = "post_observation"
COMPLETE = "complete"


@dataclass
class InterventionRecord:
    """Record of a single do(Delta z) intervention."""
    intervention_id: str
    drone_id: str
    link_id: str
    start_time: float
    delta_z: float
    end_time: Optional[float] = None
    phase: str = ARMED

    # Samples collected across the window
    pre_loss_samples: List[float] = field(default_factory=list)
    post_loss_samples: List[float] = field(default_factory=list)
    j_samples: List[float] = field(default_factory=list)
    # Map-predicted terrain loss on the link (dB), from the elevation model
    obstruction_samples: List[float] = field(default_factory=list)
    d_samples: List[float] = field(default_factory=list)

    pre_altitude: float = 0.0
    post_altitude: float = 0.0
    achieved_dz: float = 0.0
    rung: int = 0                  # index into the probe ladder
    cumulative_dz: float = 0.0     # total commanded climb so far
    phase_deadline: float = 0.0

    pre_loss: float = 0.0
    post_loss: float = 0.0

    # Effect estimate
    causal_effect: float = 0.0          # pre_loss - post_loss (positive = better)
    effect_t_stat: float = 0.0          # |effect| / pooled standard error
    effect_std: float = 0.0
    attribution: str = ""
    confidence: float = 0.0
    confounded: bool = False
    confound_reason: str = ""
    recommendation: str = ""
    reverted: bool = False

    def to_dict(self) -> dict:
        return {
            "id": self.intervention_id,
            "drone_id": self.drone_id,
            "link_id": self.link_id,
            "phase": self.phase,
            "delta_z": self.delta_z,
            "achieved_dz": self.achieved_dz,
            "pre_loss": self.pre_loss,
            "post_loss": self.post_loss,
            "causal_effect": self.causal_effect,
            "effect_t_stat": self.effect_t_stat,
            "rung": self.rung + 1,
            "cumulative_dz": self.cumulative_dz,
            "attribution": self.attribution,
            "confidence": self.confidence,
            "confounded": self.confounded,
            "confound_reason": self.confound_reason,
            "recommendation": self.recommendation,
            "reverted": self.reverted,
            "start_time": self.start_time,
            "end_time": self.end_time,
        }


class InterventionEngine:
    """Runs and evaluates do(Delta z) interventions on degraded links."""

    def __init__(
        self,
        delta_z: float = 15.0,
        # Escalating probe ladder.
        #
        # The proposal specifies do(dz = +15 m), and +15 m remains the first
        # rung. But benchmarking showed that at this terrain scale — ridges
        # 400-700 m above the valley floor — a 15 m climb changes the
        # diffraction geometry measurably only near grazing incidence. For a
        # link in deep terrain shadow the measured effect was under 0.02 and
        # statistically indistinguishable from zero, so the engine correctly
        # but uselessly concluded "not terrain" for links that were obstructed
        # by nothing else.
        #
        # The ladder keeps the specified first probe and escalates only when
        # that probe returns no detectable effect, so the cheap test is always
        # tried first and the expensive climb is spent only where it is needed.
        probe_ladder: tuple = (15.0, 30.0, 60.0),
        pre_window: float = 1.2,
        actuation_window: float = 2.2,
        post_window: float = 1.2,
        loss_threshold: float = 0.20,
        effect_threshold: float = 0.05,
        cooldown: float = 12.0,
        max_interventions_per_link: int = 4,
        # A jammer that shifts the noise floor by more than this across the
        # window invalidates the "J held constant" assumption.
        # An effect must be at least this many standard errors before it is
        # called real rather than fading.
        min_effect_t: float = 2.0,
        j_stability_db: float = 2.5,
        # Thermal noise floor of the receivers (dBm). A measured floor this
        # far above it is direct evidence of interference.
        thermal_floor_dbm: float = -100.0,
        # Map-predicted terrain loss above which a link is in deep shadow.
        deep_shadow_db: float = 12.0,
        # Noise-floor rise that counts as evidence of interference.
        jam_rise_db: float = 6.0,
        # Likewise for range: the aircraft must not have closed significantly.
        d_stability_frac: float = 0.08,
        max_accumulated_offset: float = 90.0,
    ):
        self.delta_z = delta_z
        self.probe_ladder = tuple(probe_ladder) or (delta_z,)
        self.pre_window = pre_window
        self.actuation_window = actuation_window
        self.post_window = post_window
        self.loss_threshold = loss_threshold
        self.effect_threshold = effect_threshold
        self.min_effect_t = min_effect_t
        self.cooldown = cooldown
        self.max_interventions_per_link = max_interventions_per_link
        self.j_stability_db = j_stability_db
        self.thermal_floor_dbm = thermal_floor_dbm
        self.deep_shadow_db = deep_shadow_db
        self.jam_rise_db = jam_rise_db
        self.d_stability_frac = d_stability_frac
        self.max_accumulated_offset = max_accumulated_offset

        self._active: Dict[str, InterventionRecord] = {}
        self._completed: List[InterventionRecord] = []
        self._cooldowns: Dict[str, float] = {}
        self._counter = 0
        self.events: List[dict] = []

    # -- triggering --------------------------------------------------------

    def should_intervene(self, link_id: str, loss: float, sim_time: float) -> bool:
        if loss < self.loss_threshold:
            return False
        if link_id in self._active:
            return False
        if sim_time - self._cooldowns.get(link_id, -1e9) < self.cooldown:
            return False
        if sum(1 for r in self._completed if r.link_id == link_id) \
                >= self.max_interventions_per_link:
            return False
        return True

    def arm(self, drone_id: str, link_id: str, altitude: float,
            sim_time: float) -> InterventionRecord:
        """Begin an intervention by opening the pre-observation window."""
        self._counter += 1
        record = InterventionRecord(
            intervention_id=f"INT-{self._counter:04d}",
            drone_id=drone_id,
            link_id=link_id,
            start_time=sim_time,
            delta_z=self.delta_z,
            pre_altitude=altitude,
            phase=PRE,
        )
        self._active[link_id] = record

        logger.info("[%s] pre-observation on %s (drone %s, alt %.0f m)",
                    record.intervention_id, link_id, drone_id, altitude)
        self.events.append({
            "time": sim_time,
            "type": "INTERVENTION_ARMED",
            "id": record.intervention_id,
            "link": link_id,
            "message": (f"{record.intervention_id}: link {link_id} degraded — "
                        f"baselining before do(dz=+{self.delta_z:.0f}m)"),
        })
        return record

    def _attribute_null_result(self, record) -> None:
        """
        What does it mean when climbing made no difference?

        Only that terrain is excluded IF the climb could have helped. A null
        result from an experiment that was never capable of detecting the
        effect is not evidence of absence — and against deep terrain shadow a
        single aircraft climbing 60 m buys back a few dB of a 30 dB ridge loss,
        so the test is underpowered exactly where terrain matters most.

        So before concluding, weigh the two pieces of evidence the swarm has
        without any experiment at all:
          - the terrain loss its elevation map predicts on this link, and
          - how far its receivers' measured noise floor sits above thermal.
        Interference raises the noise floor; terrain does not. Terrain costs
        signal on the path; interference does not.
        """
        shadow = (float(np.median(record.obstruction_samples))
                  if record.obstruction_samples else None)
        rise = (float(np.median(record.j_samples)) - self.thermal_floor_dbm
                if record.j_samples else 0.0)
        interfered = rise >= self.jam_rise_db
        shadowed = shadow is not None and shadow >= self.deep_shadow_db

        if shadowed and not interfered:
            record.attribution = "terrain_shadow"
            record.confidence = float(min(0.95, 0.55 + shadow / 60.0))
            record.recommendation = (
                f"Terrain shadow: the map predicts {shadow:.0f} dB of ridge loss on this "
                f"link and the receivers show no interference ({rise:+.0f} dB over thermal). "
                "The climb was too small to clear it, so altitude is not the fix — "
                "requesting relay repositioning from the GNN."
            )
        elif shadowed and interfered:
            record.attribution = "partial_terrain"
            record.confidence = 0.5
            record.recommendation = (
                f"Two causes: {shadow:.0f} dB of predicted ridge loss AND the noise floor "
                f"{rise:.0f} dB above thermal. Repositioning relays and flagging interference."
            )
        elif interfered:
            record.attribution = "not_terrain"
            record.confidence = float(min(0.95, 0.6 + rise / 80.0))
            record.recommendation = (
                f"Not terrain: climbing had no effect, the map predicts only "
                f"{0.0 if shadow is None else shadow:.0f} dB of ridge loss, and the noise floor "
                f"is {rise:.0f} dB above thermal. RF interference — rerouting rather than climbing."
            )
        else:
            record.attribution = "not_terrain"
            record.confidence = 0.6
            record.recommendation = (
                "Altitude change produced no effect separable from channel noise "
                f"(t = {record.effect_t_stat:.1f}), the map predicts little ridge loss and "
                "there is no interference — consistent with a range limit."
            )

    # -- per-tick driver ---------------------------------------------------

    def update(self, link_id: str, drone, loss: float, noise_dbm: float,
               distance_m: float, sim_time: float,
               obstruction_db: Optional[float] = None) -> Optional[dict]:
        """
        Advance the intervention on `link_id` by one tick.

        Returns a result dict when the intervention completes, else None.
        """
        record = self._active.get(link_id)
        if record is None:
            return None

        if record.phase_deadline == 0.0:
            record.phase_deadline = record.start_time + self.pre_window

        # Sample the covariates on every tick, in every phase — we need their
        # behaviour across the *whole* window to judge confounding.
        record.j_samples.append(noise_dbm)
        record.d_samples.append(distance_m)
        if obstruction_db is not None:
            record.obstruction_samples.append(float(obstruction_db))

        if record.phase == PRE:
            record.pre_loss_samples.append(loss)
            if sim_time >= record.phase_deadline:
                self._actuate(record, drone, sim_time)

        elif record.phase == ACTUATING:
            if sim_time >= record.phase_deadline:
                record.phase = POST
                record.phase_deadline = sim_time + self.post_window

        elif record.phase == POST:
            record.post_loss_samples.append(loss)
            if sim_time >= record.phase_deadline:
                return self._evaluate(record, drone, sim_time)

        return None

    def _actuate(self, record: InterventionRecord, drone, sim_time: float):
        """Execute do(Delta z) at the current ladder rung."""
        rung_dz = self.probe_ladder[min(record.rung, len(self.probe_ladder) - 1)]
        step = rung_dz - record.cumulative_dz     # incremental climb this rung

        if abs(drone.altitude_offset_cmd) + step > self.max_accumulated_offset:
            logger.info("[%s] aborted — accumulated altitude offset at limit",
                        record.intervention_id)
            record.phase = COMPLETE
            record.attribution = "aborted_offset_limit"
            drone.altitude_offset_cmd -= record.cumulative_dz
            self._retire(record, sim_time)
            return

        drone.altitude_offset_cmd += step
        record.cumulative_dz = rung_dz
        record.delta_z = rung_dz
        record.phase = ACTUATING
        record.phase_deadline = sim_time + self.actuation_window
        record.post_loss_samples.clear()

        logger.info("[%s] do(dz=+%.0fm) on %s (rung %d)", record.intervention_id,
                    rung_dz, drone.id, record.rung + 1)
        self.events.append({
            "time": sim_time,
            "type": "INTERVENTION_EXECUTED",
            "id": record.intervention_id,
            "link": record.link_id,
            "message": (f"{record.intervention_id}: executing do(dz=+{rung_dz:.0f}m) "
                        f"on {drone.id} — measuring causal effect on packet loss"),
        })

    def _evaluate(self, record: InterventionRecord, drone,
                  sim_time: float) -> dict:
        """Estimate the causal effect, check confounding, decide, and act."""
        record.pre_loss = float(np.mean(record.pre_loss_samples)) \
            if record.pre_loss_samples else 0.0
        record.post_loss = float(np.mean(record.post_loss_samples)) \
            if record.post_loss_samples else 0.0

        # Is the pre/post difference distinguishable from measurement noise?
        #
        # Packet loss is measured over a Rician-fading channel, so successive
        # samples of an unchanged link vary substantially on their own. A bare
        # "difference exceeds 0.05" rule therefore fires on fading as readily
        # as on a real effect — in the benchmark it attributed every jammed
        # link to terrain, because random fluctuation over a short window was
        # enough to clear the threshold.
        #
        # Welch's t statistic on the two windows gives the effect a scale: the
        # difference is only called real if it is large compared with how much
        # the measurement was moving anyway.
        pre = np.asarray(record.pre_loss_samples, dtype=float)
        post = np.asarray(record.post_loss_samples, dtype=float)

        record.effect_t_stat = 0.0
        if pre.size >= 3 and post.size >= 3:
            se = np.sqrt(pre.var(ddof=1) / pre.size + post.var(ddof=1) / post.size)
            record.effect_t_stat = float(abs(record.pre_loss - record.post_loss)
                                         / max(se, 1e-6))
            record.effect_std = float(se)
        record.post_altitude = float(drone.position[2])
        record.achieved_dz = record.post_altitude - record.pre_altitude
        record.causal_effect = record.pre_loss - record.post_loss
        record.end_time = sim_time

        # --- confounding checks -------------------------------------------
        reasons = []

        if record.j_samples:
            j_span = float(np.max(record.j_samples) - np.min(record.j_samples))
            if j_span > self.j_stability_db:
                reasons.append(
                    f"noise floor moved {j_span:.1f} dB during the window "
                    f"(limit {self.j_stability_db:.1f} dB)")

        if record.d_samples:
            d0 = float(record.d_samples[0])
            d_span = float(np.max(record.d_samples) - np.min(record.d_samples))
            if d0 > 1.0 and (d_span / d0) > self.d_stability_frac:
                reasons.append(
                    f"range changed {100 * d_span / d0:.0f}% during the window "
                    f"(limit {100 * self.d_stability_frac:.0f}%)")

        # If the aircraft never actually climbed, there was no intervention
        if abs(record.achieved_dz) < self.delta_z * 0.4:
            reasons.append(
                f"aircraft achieved only {record.achieved_dz:+.1f} m of the "
                f"commanded {record.delta_z:+.0f} m")

        record.confounded = bool(reasons)
        record.confound_reason = "; ".join(reasons)

        # --- escalate before concluding "not terrain" -----------------------
        # A null result at a small probe is only evidence of "no terrain
        # effect" if the probe was big enough to have produced one. Rather
        # than concluding from an underpowered test, climb to the next rung
        # and measure again. Only a null at the top of the ladder is treated
        # as evidence that terrain is not the cause.
        effect_detected = (record.causal_effect > self.effect_threshold
                           and record.effect_t_stat >= self.min_effect_t)

        if (not record.confounded and not effect_detected
                and record.rung + 1 < len(self.probe_ladder)):
            record.rung += 1
            logger.info(
                "[%s] no effect at +%.0f m (delta %+.3f, t=%.1f) — escalating to +%.0f m",
                record.intervention_id, record.cumulative_dz,
                record.causal_effect, record.effect_t_stat,
                self.probe_ladder[record.rung],
            )
            record.phase = PRE
            # Re-baseline at the altitude we are now at, so the next rung
            # measures the effect of the *additional* climb rather than
            # re-measuring the one we already made.
            record.pre_loss_samples = list(record.post_loss_samples)
            record.post_loss_samples.clear()
            record.pre_altitude = float(drone.position[2])
            record.phase_deadline = sim_time + self.pre_window
            return None

        # --- attribution ---------------------------------------------------
        if record.confounded:
            record.attribution = "indeterminate"
            record.confidence = 0.0
            record.recommendation = (
                "Causal effect NOT identified — the no-confounding assumption "
                "failed this window. Treat the number as descriptive only. "
                f"Reason: {record.confound_reason}"
            )
        elif (record.causal_effect > self.effect_threshold
              and record.effect_t_stat >= self.min_effect_t):
            record.attribution = "terrain_occlusion"
            record.confidence = float(min(1.0, record.causal_effect / 0.30))
            record.recommendation = (
                f"Terrain occlusion confirmed: +{record.achieved_dz:.0f} m reduced "
                f"packet loss by {record.causal_effect:.1%}. Holding the altitude gain."
            )
        elif (record.causal_effect > self.effect_threshold * 0.5
              and record.effect_t_stat >= self.min_effect_t):
            record.attribution = "partial_terrain"
            record.confidence = float(0.3 + 0.4 * record.causal_effect / self.effect_threshold)
            record.recommendation = (
                "Altitude helped marginally. Terrain is a contributing but not "
                "dominant cause — requesting relay repositioning from the GNN."
            )
        else:
            self._attribute_null_result(record)

        # --- act on the finding -------------------------------------------
        # Only a confirmed terrain effect justifies *keeping* the altitude.
        # Anything else gives the altitude back rather than leaving the swarm
        # permanently high on the strength of an inconclusive test.
        if record.attribution != "terrain_occlusion":
            drone.altitude_offset_cmd -= record.cumulative_dz
            record.reverted = True

        logger.info(
            "[%s] effect %+.3f | %s | confounded=%s%s",
            record.intervention_id, record.causal_effect, record.attribution,
            record.confounded,
            f" ({record.confound_reason})" if record.confounded else "",
        )
        self.events.append({
            "time": sim_time,
            "type": "INTERVENTION_RESULT",
            "id": record.intervention_id,
            "link": record.link_id,
            "attribution": record.attribution,
            "confounded": record.confounded,
            "message": f"{record.intervention_id}: {record.recommendation}",
        })

        record.phase = COMPLETE
        self._retire(record, sim_time)
        return record.to_dict()

    def _retire(self, record: InterventionRecord, sim_time: float):
        self._active.pop(record.link_id, None)
        self._completed.append(record)
        self._cooldowns[record.link_id] = sim_time
        if len(self._completed) > 200:
            self._completed = self._completed[-120:]

    def abandon_active(self, drones: dict, sim_time: float):
        """
        Cancel every in-flight intervention and give back its altitude.

        Used when the causal subsystem is handed to another node: an
        intervention cannot be completed by an engine that is no longer
        receiving the loss samples, and its climb must not be left in place.
        """
        for record in list(self._active.values()):
            drone = drones.get(record.drone_id)
            if drone is not None and record.cumulative_dz:
                drone.altitude_offset_cmd -= record.cumulative_dz
            record.phase = COMPLETE
            record.attribution = "handed_off"
            record.reverted = True
            record.end_time = sim_time
            self._retire(record, sim_time)

    # -- reporting ---------------------------------------------------------

    def drain_events(self) -> List[dict]:
        events, self.events = self.events, []
        return events

    def get_state(self) -> dict:
        completed = [r.to_dict() for r in self._completed[-6:]]
        identified = [r for r in self._completed
                      if not r.confounded and r.phase == COMPLETE]
        return {
            "delta_z": self.delta_z,
            "active_count": len(self._active),
            "completed_count": len(self._completed),
            "identified_count": len(identified),
            "confounded_count": sum(1 for r in self._completed if r.confounded),
            "active": [r.to_dict() for r in self._active.values()],
            "recent_completed": completed,
            "latest": completed[-1] if completed else None,
        }

    def reset(self):
        self._active.clear()
        self._completed.clear()
        self._cooldowns.clear()
        self.events.clear()
        self._counter = 0
