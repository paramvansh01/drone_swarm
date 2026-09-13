"""
Telemetry aggregation for the C-DAWN GCS.

Collects the simulation tick stream plus each subsystem's state into a single
snapshot for the dashboard, and keeps bounded time-series histories for the
live charts.

Sampling note
-------------
The simulation runs at 50 Hz but the dashboard streams at 20 Hz and the charts
plot minutes of history. Appending every tick to every series would grow the
snapshot without adding information the operator can see, so the histories are
decimated to 5 Hz. The metrics themselves are still computed every tick — only
the plotted series is thinned.
"""

from __future__ import annotations

import logging
import time
from collections import deque
from typing import Deque, Optional

logger = logging.getLogger("cdawn.gcs.telemetry")

# Decimation: keep one history sample every N simulation ticks (50 Hz -> 5 Hz)
HISTORY_STRIDE = 10


class TelemetryAggregator:
    """Builds dashboard snapshots from simulation + subsystem state."""

    def __init__(self, history_length: int = 900):   # 900 @ 5 Hz = 3 minutes
        self.history_length = history_length

        self._latest: Optional[dict] = None
        self._update_count = 0

        self._pdr_history: Deque[dict] = deque(maxlen=history_length)
        self._backhaul_history: Deque[dict] = deque(maxlen=history_length)
        self._battery_history: Deque[dict] = deque(maxlen=history_length)
        self._control_history: Deque[dict] = deque(maxlen=history_length)
        self._election_history: Deque[dict] = deque(maxlen=60)

        self._causal: Optional[dict] = None
        self._gnn: Optional[dict] = None
        self._mesh: Optional[dict] = None
        self._election: Optional[dict] = None
        self._sitrep: Optional[dict] = None
        self._cluster: Optional[dict] = None
        self._demo: Optional[dict] = None

    # -- ingestion ---------------------------------------------------------

    def update(self, telemetry: dict):
        """Ingest one simulation tick."""
        self._latest = telemetry
        self._update_count += 1

        tick = telemetry.get("tick", 0)
        if tick % HISTORY_STRIDE:
            return

        metrics = telemetry.get("metrics", {})
        sim_time = telemetry.get("sim_time", 0.0)

        self._pdr_history.append({
            "t": sim_time, "value": metrics.get("swarm_pdr", 0.0)})
        self._backhaul_history.append({
            "t": sim_time, "value": metrics.get("backhaul_pdr", 0.0)})
        self._battery_history.append({
            "t": sim_time, "value": metrics.get("avg_battery", 100.0)})
        self._control_history.append({
            "t": sim_time,
            "active": metrics.get("tracking_error_m", 0.0),
            "shadow": metrics.get("shadow_divergence_ms2", 0.0),
        })

    def update_causal(self, state: dict):
        self._causal = state

    def update_gnn(self, state: dict):
        self._gnn = state

    def update_mesh(self, state: dict):
        self._mesh = state

    def update_election(self, state: dict):
        self._election = state
        last = state.get("last_election_ms")
        if last is not None:
            if not self._election_history or \
                    self._election_history[-1].get("value") != last:
                self._election_history.append({"t": time.time(), "value": last})

    def update_sitrep(self, state: dict):
        self._sitrep = state

    def update_cluster(self, state: dict):
        self._cluster = state

    def update_demo(self, state: dict):
        self._demo = state

    # -- output ------------------------------------------------------------

    def get_snapshot(self) -> dict:
        """Full snapshot broadcast to every connected dashboard."""
        latest = self._latest or {}

        return {
            "type": "telemetry",
            "sim_time": latest.get("sim_time", 0.0),
            "tick": latest.get("tick", 0),
            "drones": latest.get("drones", {}),
            "metrics": latest.get("metrics", {}),
            "rf": latest.get("rf", {}),
            "wind": latest.get("wind", {}),
            "pois": latest.get("pois", []),
            "interceptors": latest.get("interceptors", []),
            "injects": latest.get("injects", {}),
            "mission": latest.get("mission", {}),
            "events": latest.get("events", []),
            "causal": self._causal,
            "gnn": self._gnn,
            "mesh": self._mesh,
            "election": self._election,
            "sitrep": self._sitrep,
            "cluster": self._cluster,
            "demo": self._demo,
            "charts": {
                "pdr": list(self._pdr_history)[-240:],
                "backhaul": list(self._backhaul_history)[-240:],
                "battery": list(self._battery_history)[-240:],
                "control": list(self._control_history)[-240:],
                "election": list(self._election_history)[-20:],
            },
        }

    def get_metrics(self) -> dict:
        return (self._latest or {}).get("metrics", {})

    def get_summary(self) -> dict:
        return {
            "update_count": self._update_count,
            "has_data": self._latest is not None,
            "latest_time": (self._latest or {}).get("sim_time", 0.0),
        }

    def reset(self):
        for history in (self._pdr_history, self._backhaul_history,
                        self._battery_history, self._control_history,
                        self._election_history):
            history.clear()
        self._latest = None
        self._update_count = 0
