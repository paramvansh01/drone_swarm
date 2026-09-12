"""
SITREP (Situation Report) generator for C-DAWN.

Uses Phi-3-Mini (quantized) for text generation, with template
fallback for guaranteed demo output.
"""

import numpy as np
import time
import logging
from typing import List, Dict, Optional
from datetime import datetime

logger = logging.getLogger("cdawn.rag.sitrep")


class SitrepGenerator:
    """
    Tactical SITREP generator.

    Synthesizes grounded situation reports from:
    - Retrieved detection evidence (from vector store)
    - Current swarm telemetry
    - Causal diagnostics state

    Uses Phi-3-Mini (GGUF via llama-cpp-python) when available,
    falls back to template-based generation for guaranteed output.
    """

    def __init__(self, model_path: Optional[str] = None, use_template: bool = True):
        self.model = None
        self.use_template = use_template
        self._sitrep_counter = 0
        self._sitrep_log: List[Dict] = []

        if model_path and not use_template:
            try:
                from llama_cpp import Llama
                self.model = Llama(
                    model_path=model_path,
                    n_ctx=2048,
                    n_threads=4,
                    verbose=False,
                )
                self.use_template = False
                logger.info(f"Loaded SLM from {model_path}")
            except Exception as e:
                logger.warning(f"Failed to load SLM: {e}. Using template mode.")
                self.use_template = True

    def generate(
        self,
        evidence: List[Dict],
        metrics: Dict,
        causal_state: Optional[Dict] = None,
        mission_id: str = "CDAWN-001",
    ) -> Dict:
        """
        Generate a SITREP.

        Args:
            evidence: List of retrieved evidence docs from vector store.
            metrics: Current swarm metrics dict.
            causal_state: SCM diagnostics state.
            mission_id: Mission identifier.

        Returns:
            SITREP dict with text, evidence citations, and metadata.
        """
        start = time.time()
        self._sitrep_counter += 1
        sitrep_id = f"SITREP-{self._sitrep_counter:04d}"

        if self.use_template:
            sitrep = self._template_generate(evidence, metrics, causal_state, mission_id, sitrep_id)
        else:
            sitrep = self._slm_generate(evidence, metrics, causal_state, mission_id, sitrep_id)

        sitrep["generation_time_ms"] = (time.time() - start) * 1000
        self._sitrep_log.append(sitrep)
        if len(self._sitrep_log) > 50:
            self._sitrep_log = self._sitrep_log[-30:]

        return sitrep

    def _template_generate(
        self,
        evidence: List[Dict],
        metrics: Dict,
        causal_state: Optional[Dict],
        mission_id: str,
        sitrep_id: str,
    ) -> Dict:
        """Generate SITREP using structured template."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

        # Extract key info from evidence
        detections_summary = []
        citations = []
        for i, ev in enumerate(evidence[:5]):
            meta = ev.get("metadata", {})
            det_class = meta.get("class", "unknown")
            confidence = meta.get("confidence", 0.0)
            drone = meta.get("drone_id", "unknown")
            det_time = meta.get("timestamp", 0.0)

            detections_summary.append(
                f"  [{i+1}] {det_class.upper()} — {confidence:.0%} confidence, "
                f"observed by {drone} at T+{det_time:.1f}s"
            )
            citations.append({
                "index": i + 1,
                "class": det_class,
                "confidence": confidence,
                "drone_id": drone,
                "timestamp": det_time,
            })

        if not detections_summary:
            detections_summary = ["  No detections reported."]

        # Metrics
        pdr = metrics.get("swarm_pdr", 0)
        battery = metrics.get("avg_battery", 0)
        pois_surveyed = metrics.get("pois_surveyed", 0)
        total_pois = metrics.get("total_pois", 0)
        phase = metrics.get("current_phase", 0)

        # Causal diagnosis
        causal_summary = "No anomalies detected."
        if causal_state:
            latest = causal_state.get("latest_diagnosis", {})
            if latest and latest.get("is_anomaly"):
                root = latest.get("root_cause", "unknown")
                contrib = latest.get("root_cause_contribution", 0)
                causal_summary = (
                    f"ANOMALY DETECTED — Root cause: {root.upper()} "
                    f"(contribution: {contrib:.2f}). "
                    f"Intervention recommended."
                )

        # Build SITREP
        text = f"""
═══════════════════════════════════════════════════
  SITUATION REPORT — {sitrep_id}
  Mission: {mission_id} | Phase: {phase}
  Generated: {timestamp}
═══════════════════════════════════════════════════

1. MISSION STATUS
   Survey Progress: {pois_surveyed}/{total_pois} Points of Interest
   Swarm PDR: {pdr:.1%}
   Average Battery: {battery:.1f}%
   Current Phase: {phase}

2. OBSERVATIONS
{chr(10).join(detections_summary)}

3. COMMUNICATIONS ASSESSMENT
   {causal_summary}

4. RECOMMENDATIONS
   {"Continue survey operations." if pdr > 0.9 else "ALERT: Degraded communications. Consider relay repositioning."}
   {"Battery levels nominal." if battery > 30 else "WARNING: Low battery across swarm. Initiate RTH protocol."}

═══════════════════════════════════════════════════
  Evidence Citations: {len(citations)} sources
  Confidence: {'HIGH' if pdr > 0.9 and len(citations) > 2 else 'MODERATE'}
═══════════════════════════════════════════════════
""".strip()

        return {
            "sitrep_id": sitrep_id,
            "mission_id": mission_id,
            "timestamp": timestamp,
            "text": text,
            "citations": citations,
            "metrics_snapshot": {
                "pdr": pdr,
                "battery": battery,
                "survey_progress": f"{pois_surveyed}/{total_pois}",
            },
            "mode": "template",
        }

    def _slm_generate(
        self,
        evidence: List[Dict],
        metrics: Dict,
        causal_state: Optional[Dict],
        mission_id: str,
        sitrep_id: str,
    ) -> Dict:
        """Generate SITREP using Phi-3-Mini SLM."""
        # Build context
        evidence_text = ""
        citations = []
        for i, ev in enumerate(evidence[:5]):
            meta = ev.get("metadata", {})
            evidence_text += (
                f"[{i+1}] {meta.get('class', 'unknown')} detected with "
                f"{meta.get('confidence', 0):.0%} confidence by {meta.get('drone_id', '?')} "
                f"at T+{meta.get('timestamp', 0):.1f}s\n"
            )
            citations.append({
                "index": i + 1,
                "class": meta.get("class"),
                "confidence": meta.get("confidence"),
            })

        prompt = f"""<|system|>
You are a tactical AI generating a concise SITREP (situation report) for a UAV swarm disaster response mission.
Cite evidence using [N] notation. Be factual and concise.
<|end|>
<|user|>
Generate SITREP {sitrep_id} for mission {mission_id}.

Swarm Status: PDR={metrics.get('swarm_pdr', 0):.1%}, Battery={metrics.get('avg_battery', 0):.1f}%, Survey={metrics.get('pois_surveyed', 0)}/{metrics.get('total_pois', 0)} PoIs

Evidence:
{evidence_text}

Generate a structured SITREP with: 1) Mission Status, 2) Key Observations (cite evidence), 3) Communications Assessment, 4) Recommendations
<|end|>
<|assistant|>"""

        try:
            response = self.model(prompt, max_tokens=512, temperature=0.3, stop=["<|end|>"])
            text = response["choices"][0]["text"].strip()
        except Exception as e:
            logger.error(f"SLM generation failed: {e}")
            return self._template_generate(evidence, metrics, causal_state, mission_id, sitrep_id)

        return {
            "sitrep_id": sitrep_id,
            "mission_id": mission_id,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "text": text,
            "citations": citations,
            "mode": "slm",
        }

    def get_latest_sitrep(self) -> Optional[Dict]:
        return self._sitrep_log[-1] if self._sitrep_log else None

    def get_state(self) -> dict:
        return {
            "total_generated": self._sitrep_counter,
            "mode": "template" if self.use_template else "slm",
            "latest": self.get_latest_sitrep(),
        }
