"""
Telemetry aggregation and broadcast for C-DAWN GCS.

Aggregates telemetry from all simulation components into unified
snapshots for the dashboard.
"""

import numpy as np
import time
import logging
from typing import Dict, Optional, List
from collections import deque

logger = logging.getLogger("cdawn.gcs.telemetry")


class TelemetryAggregator:
    """
    Aggregates telemetry from the simulation runner and all
    subsystems into a unified snapshot for the dashboard.
    """

    def __init__(self, history_length: int = 300):
        self.history_length = history_length

        # Latest snapshot from simulation
        self._latest_snapshot: Optional[dict] = None

        # Time-series data for charts
        self._pdr_history = deque(maxlen=history_length)
        self._battery_history = deque(maxlen=history_length)
        self._election_history = deque(maxlen=history_length)

        # Component states
        self._causal_state: Optional[dict] = None
        self._gnn_state: Optional[dict] = None
        self._mesh_state: Optional[dict] = None
        self._election_state: Optional[dict] = None
        self._sitrep_state: Optional[dict] = None
        self._intervention_state: Optional[dict] = None

        self._update_count = 0

    def update(self, telemetry: dict):
        """Ingest a telemetry tick from the simulation runner."""
        self._latest_snapshot = telemetry
        self._update_count += 1

        metrics = telemetry.get("metrics", {})
        sim_time = telemetry.get("sim_time", 0)

        # Append to time series
        self._pdr_history.append({
            "time": sim_time,
            "value": metrics.get("swarm_pdr", 0),
        })
        self._battery_history.append({
            "time": sim_time,
            "value": metrics.get("avg_battery", 100),
        })

    def update_causal(self, state: dict):
        self._causal_state = state

    def update_gnn(self, state: dict):
        self._gnn_state = state

    def update_mesh(self, state: dict):
        self._mesh_state = state

    def update_election(self, state: dict):
        self._election_state = state
        if "last_election_ms" in state:
            self._election_history.append({
                "time": time.time(),
                "value": state["last_election_ms"],
            })

    def update_sitrep(self, state: dict):
        self._sitrep_state = state

    def update_interventions(self, state: dict):
        self._intervention_state = state

    def get_snapshot(self) -> dict:
        """Get the full telemetry snapshot for WebSocket broadcast."""
        snapshot = self._latest_snapshot or {}

        return {
            "type": "telemetry",
            "sim_time": snapshot.get("sim_time", 0),
            "tick": snapshot.get("tick", 0),
            "drones": snapshot.get("drones", {}),
            "metrics": snapshot.get("metrics", {}),
            "rf": snapshot.get("rf", {}),
            "wind": snapshot.get("wind", {}),
            "world": snapshot.get("world", {}),
            "causal": self._causal_state,
            "gnn": self._gnn_state,
            "mesh": self._mesh_state,
            "election": self._election_state,
            "sitrep": self._sitrep_state,
            "interventions": self._intervention_state,
            "charts": {
                "pdr": list(self._pdr_history)[-60:],
                "battery": list(self._battery_history)[-60:],
                "election": list(self._election_history)[-20:],
            },
        }

    def get_metrics(self) -> dict:
        """Get current metrics only."""
        if self._latest_snapshot:
            return self._latest_snapshot.get("metrics", {})
        return {}

    def get_summary(self) -> dict:
        """Get a compact summary."""
        return {
            "update_count": self._update_count,
            "has_data": self._latest_snapshot is not None,
            "latest_time": self._latest_snapshot.get("sim_time", 0) if self._latest_snapshot else 0,
        }
