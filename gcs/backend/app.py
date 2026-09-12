"""
C-DAWN Ground Control Station — FastAPI Backend.

WebSocket + REST server for real-time telemetry, demo control,
and serving the frontend dashboard.
"""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Dict, Set

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import sys
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from .telemetry import TelemetryAggregator
from .demo_controller import DemoController

logger = logging.getLogger("cdawn.gcs")

app = FastAPI(title="C-DAWN GCS", version="1.0.0")

# CORS for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
demo_controller: DemoController = None
telemetry_agg: TelemetryAggregator = None
connected_clients: Set[WebSocket] = set()


def init_gcs(controller: DemoController, telemetry: TelemetryAggregator):
    """Initialize GCS with demo controller and telemetry."""
    global demo_controller, telemetry_agg
    demo_controller = controller
    telemetry_agg = telemetry


# --- WebSocket ---

@app.websocket("/ws/telemetry")
async def telemetry_ws(websocket: WebSocket):
    """Real-time telemetry WebSocket endpoint (10Hz broadcast)."""
    await websocket.accept()
    connected_clients.add(websocket)
    logger.info(f"Client connected. Total: {len(connected_clients)}")

    try:
        while True:
            # Send telemetry snapshot
            if telemetry_agg:
                snapshot = telemetry_agg.get_snapshot()
                payload_str = json.dumps(
                    snapshot,
                    default=lambda o: float(o) if isinstance(o, (np.floating, np.integer)) else (o.tolist() if isinstance(o, np.ndarray) else str(o))
                )
                await websocket.send_text(payload_str)

            # Receive commands (non-blocking)
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                cmd = json.loads(data)
                await _handle_ws_command(cmd, websocket)
            except asyncio.TimeoutError:
                pass

            await asyncio.sleep(0.1)  # 10Hz

    except WebSocketDisconnect:
        connected_clients.discard(websocket)
        logger.info(f"Client disconnected. Total: {len(connected_clients)}")
    except Exception as e:
        connected_clients.discard(websocket)
        logger.error(f"WebSocket error: {e}")


async def _handle_ws_command(cmd: dict, ws: WebSocket):
    """Handle WebSocket commands from the dashboard."""
    action = cmd.get("action")

    if action == "start_demo":
        if demo_controller:
            demo_controller.start()
            await ws.send_json({"type": "ack", "action": "start_demo"})

    elif action == "advance_phase":
        if demo_controller:
            demo_controller.advance_phase()
            await ws.send_json({"type": "ack", "action": "advance_phase"})

    elif action == "inject_fault":
        fault_type = cmd.get("fault_type", "rf_degrade")
        if demo_controller:
            demo_controller.inject_fault(fault_type, cmd.get("params", {}))
            await ws.send_json({"type": "ack", "action": "inject_fault", "fault": fault_type})

    elif action == "reset":
        if demo_controller:
            demo_controller.reset()
            await ws.send_json({"type": "ack", "action": "reset"})


async def broadcast_telemetry(data: dict):
    """Broadcast telemetry to all connected WebSocket clients."""
    disconnected = set()
    for ws in connected_clients:
        try:
            await ws.send_json(data)
        except Exception:
            disconnected.add(ws)
    connected_clients.difference_update(disconnected)


# --- REST Endpoints ---

@app.get("/api/status")
async def get_status():
    """Get current system status."""
    return {
        "status": "ok",
        "connected_clients": len(connected_clients),
        "demo": demo_controller.get_state() if demo_controller else None,
        "telemetry": telemetry_agg.get_summary() if telemetry_agg else None,
    }


@app.get("/api/snapshot")
async def get_snapshot():
    """Get full simulation snapshot."""
    if telemetry_agg:
        return telemetry_agg.get_snapshot()
    return {"error": "No telemetry available"}


@app.get("/api/metrics")
async def get_metrics():
    """Get current swarm metrics."""
    if telemetry_agg:
        return telemetry_agg.get_metrics()
    return {}


@app.get("/api/sitrep")
async def get_sitrep():
    """Get the latest SITREP."""
    if demo_controller and demo_controller.sitrep_gen:
        return demo_controller.sitrep_gen.get_latest_sitrep() or {"text": "No SITREP generated yet."}
    return {"text": "SITREP generator not initialized."}


@app.post("/api/demo/start")
async def start_demo():
    """Start the demo."""
    if demo_controller:
        demo_controller.start()
        return {"status": "started"}
    return {"error": "Demo controller not initialized"}


@app.post("/api/demo/advance")
async def advance_phase():
    """Advance to next demo phase."""
    if demo_controller:
        result = demo_controller.advance_phase()
        return result
    return {"error": "Demo controller not initialized"}


@app.post("/api/demo/inject/{fault_type}")
async def inject_fault(fault_type: str):
    """Inject a fault."""
    if demo_controller:
        demo_controller.inject_fault(fault_type)
        return {"status": "injected", "fault_type": fault_type}
    return {"error": "Demo controller not initialized"}


@app.post("/api/demo/reset")
async def reset_demo():
    """Reset the demo."""
    if demo_controller:
        demo_controller.reset()
        return {"status": "reset"}
    return {"error": "Demo controller not initialized"}


@app.get("/api/causal")
async def get_causal_state():
    """Get SCM diagnostics state."""
    if demo_controller and demo_controller.scm_diagnostics:
        return demo_controller.scm_diagnostics.get_state()
    return {}


@app.get("/api/gnn")
async def get_gnn_state():
    """Get GNN topology optimizer state."""
    if demo_controller and demo_controller.relay_optimizer:
        return demo_controller.relay_optimizer.get_metrics()
    return {}


@app.get("/api/mesh")
async def get_mesh_state():
    """Get mesh network state."""
    if demo_controller and demo_controller.mesh:
        return demo_controller.mesh.get_state()
    return {}


@app.get("/api/election")
async def get_election_state():
    """Get election protocol state."""
    if demo_controller and demo_controller.election:
        return demo_controller.election.get_state()
    return {}


# Serve frontend
frontend_path = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="frontend")


@app.get("/")
async def root():
    """Serve the dashboard."""
    index = frontend_path / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": "C-DAWN GCS API. Frontend not built — run 'npm run build' in gcs/frontend/"}
