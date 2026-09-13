"""
Edge-node client for C-DAWN.

Runs on BRAVO (and CHARLIE). Maintains a WebSocket to ALPHA, consumes the
authoritative telemetry stream, runs its assigned subsystem on that state,
and pushes results back over HTTP.

The subsystems run here are exactly the ones whose cost is independent of the
physics loop — the GNN relay optimiser (~21 ms) and the SCM causal layer.
Moving them off the simulation host is what makes this a distributed tactical
edge rather than three views of one process, and it is also just good
engineering: ALPHA's 50 Hz physics loop should not be sharing a core with a
torch optimisation.

Everything here is best-effort. A dropped connection, a slow reply or a
malformed frame results in a retry, never an exception that stops the node —
ALPHA independently reverts to local computation if our results stop
arriving, so the worst case of an edge failure is that the work happens
somewhere else.
"""

from __future__ import annotations

import json
import logging
import threading
import time
from typing import Callable, Dict, Optional

import urllib.error
import urllib.request

logger = logging.getLogger("cdawn.cluster.edge")

try:
    from websockets.sync.client import connect as ws_connect
    HAVE_WS = True
except ImportError:      # pragma: no cover - depends on installed extras
    HAVE_WS = False


class EdgeClient:
    """Streams telemetry from ALPHA and pushes computed results back."""

    def __init__(
        self,
        node_id: str,
        role: str,
        local_ip: str,
        local_port: int,
        subsystems: list,
        reconnect_delay: float = 2.0,
    ):
        self.node_id = node_id
        self.role = role
        self.local_ip = local_ip
        self.local_port = local_port
        self.subsystems = subsystems
        self.reconnect_delay = reconnect_delay

        self.sim_host: Optional[str] = None      # "ip:port" of ALPHA
        self.connected = False
        self.last_telemetry: Optional[dict] = None
        self.frames_received = 0
        self.results_pushed = 0
        self.last_error: str = ""
        self.last_rtt_ms = 0.0

        # Set by the runner: fn(telemetry) -> dict of results to push
        self.on_telemetry: Optional[Callable[[dict], Optional[dict]]] = None

        self._running = False
        self._thread: Optional[threading.Thread] = None

    # ----------------------------------------------------------------------

    def set_sim_host(self, host: str):
        if host != self.sim_host:
            logger.info("Simulation host set to %s", host)
        self.sim_host = host

    def start(self):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()
        threading.Thread(target=self._heartbeat_loop, daemon=True).start()

    def _heartbeat_loop(self):
        """
        Re-register every couple of seconds.

        Membership must not depend on having a computed result to push: a node
        whose subsystem is idle (CHARLIE has no SITREP to send until phase 4)
        would otherwise age out of ALPHA's peer table and vanish from the
        dashboard while perfectly healthy. It also means a restarted ALPHA
        re-learns the cluster within one interval without restarting peers.
        """
        while self._running:
            time.sleep(2.0)
            if not self.sim_host:
                continue
            try:
                self._register(quiet=True)
            except Exception:
                pass     # the stream loop owns reconnection and its logging

    def stop(self):
        self._running = False

    # ----------------------------------------------------------------------

    def _run_loop(self):
        while self._running:
            if not self.sim_host:
                time.sleep(1.0)
                continue

            try:
                self._register()
                self._stream()
            except Exception as exc:
                self.connected = False
                self.last_error = str(exc)
                logger.warning("Edge link to %s failed: %s — retrying in %.0fs",
                               self.sim_host, exc, self.reconnect_delay)

            time.sleep(self.reconnect_delay)

    def _register(self, quiet: bool = False):
        """Announce this node and claim its subsystems on ALPHA."""
        payload = json.dumps({
            "node_id": self.node_id,
            "role": self.role,
            "ip": self.local_ip,
            "port": self.local_port,
            "subsystems": self.subsystems,
        }).encode("utf-8")

        self._post("/api/cluster/register", payload)
        if not quiet:
            logger.info("Registered with %s claiming %s",
                        self.sim_host, ", ".join(self.subsystems) or "nothing (view only)")

    def _stream(self):
        """Consume the telemetry WebSocket and push results back."""
        if not HAVE_WS:
            # Fall back to HTTP polling. Slower, but it means a missing
            # optional dependency degrades the edge node rather than
            # disabling it.
            self._poll_loop()
            return

        url = f"ws://{self.sim_host}/ws/telemetry"
        with ws_connect(url, open_timeout=5, close_timeout=2) as socket:
            self.connected = True
            self.last_error = ""
            logger.info("Edge stream established to %s", url)

            while self._running:
                raw = socket.recv(timeout=5)
                self._handle_frame(raw)

        self.connected = False

    def _poll_loop(self):
        self.connected = True
        while self._running:
            try:
                raw = self._get("/api/snapshot")
                self._handle_frame(raw)
            except Exception as exc:
                self.connected = False
                raise exc
            time.sleep(0.1)

    def _handle_frame(self, raw):
        try:
            telemetry = json.loads(raw)
        except (ValueError, TypeError):
            return

        self.last_telemetry = telemetry
        self.frames_received += 1

        if self.on_telemetry is None:
            return

        started = time.perf_counter()
        try:
            results = self.on_telemetry(telemetry)
        except Exception as exc:
            logger.error("Edge computation error: %s", exc, exc_info=True)
            return

        if not results:
            return

        results.update({
            "node_id": self.node_id,
            "compute_ms": (time.perf_counter() - started) * 1000.0,
        })

        try:
            self._post("/api/cluster/result",
                       json.dumps(results, default=float).encode("utf-8"))
            self.results_pushed += 1
            self.last_rtt_ms = (time.perf_counter() - started) * 1000.0
        except Exception as exc:
            logger.warning("Result push failed: %s", exc)

    # -- HTTP helpers ------------------------------------------------------

    def _post(self, path: str, payload: bytes) -> str:
        request = urllib.request.Request(
            f"http://{self.sim_host}{path}",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=4) as response:
            return response.read().decode("utf-8")

    def _get(self, path: str) -> str:
        with urllib.request.urlopen(
                f"http://{self.sim_host}{path}", timeout=4) as response:
            return response.read().decode("utf-8")

    # ----------------------------------------------------------------------

    def get_status(self) -> dict:
        return {
            "node_id": self.node_id,
            "role": self.role,
            "sim_host": self.sim_host,
            "connected": self.connected,
            "frames_received": self.frames_received,
            "results_pushed": self.results_pushed,
            "last_rtt_ms": self.last_rtt_ms,
            "last_error": self.last_error,
            "subsystems": list(self.subsystems),
            "transport": "websocket" if HAVE_WS else "http-poll",
        }
