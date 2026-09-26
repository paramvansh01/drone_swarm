"""
C-DAWN Ground Control Station (UAV-X) — FastAPI backend.

Serves the operator dashboard, streams telemetry over WebSocket, accepts
operator commands, and coordinates the three-laptop cluster.

Bind address is 0.0.0.0 so every endpoint is reachable from the other
laptops by LAN IP; the runner prints that address on startup.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Optional, Set

import numpy as np
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger("cdawn.gcs")

app = FastAPI(title="C-DAWN GCS — UAV-X", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- global state -----------------------------------------------------------

demo_controller = None
telemetry_agg = None
cluster_state = None
edge_client = None
connected_clients: Set[WebSocket] = set()

# The terrain payload is large (~700 KB) and never changes during a run, so
# it is encoded once on first request and served from cache thereafter.
_terrain_cache: Optional[dict] = None


def init_gcs(controller, telemetry, cluster=None, edge=None):
    """Wire the server to its subsystems."""
    global demo_controller, telemetry_agg, cluster_state, edge_client, _terrain_cache
    demo_controller = controller
    telemetry_agg = telemetry
    cluster_state = cluster
    edge_client = edge
    _terrain_cache = None


# --- JSON encoding ----------------------------------------------------------

def _to_jsonable(obj):
    """
    Convert numpy scalars/arrays to plain Python for JSON serialisation.

    The previous version referenced `np` inside the WebSocket handler without
    importing numpy at all, so the very first telemetry frame raised NameError
    and silently killed the socket.
    """
    if isinstance(obj, (np.floating, np.integer)):
        return obj.item()
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    if isinstance(obj, float) and (obj != obj or obj in (float("inf"), float("-inf"))):
        # NaN/Inf are not valid JSON; emit null rather than corrupt the frame
        return None
    return str(obj)


def dumps(payload: dict) -> str:
    return json.dumps(payload, default=_to_jsonable, allow_nan=False)


# --- relay for edge nodes --------------------------------------------------
#
# BRAVO and CHARLIE do not simulate, but each must still serve a working
# dashboard on its own LAN address — that is what lets any of the three
# laptops go on the projector. They already receive ALPHA's full telemetry
# stream over their edge link, so they relay it rather than asking the browser
# to discover and connect to ALPHA itself.

def _current_snapshot() -> Optional[dict]:
    if telemetry_agg is not None:
        snapshot = telemetry_agg.get_snapshot()
    elif edge_client is not None and edge_client.last_telemetry:
        snapshot = dict(edge_client.last_telemetry)
    else:
        return None

    # Which machine the operator is looking at. The relayed cluster block
    # describes ALPHA's view, so without this BRAVO's screen would claim to
    # be ALPHA.
    if cluster_state is not None:
        snapshot["served_by"] = cluster_state.self_record()
        if edge_client is not None:
            snapshot["served_by"]["upstream"] = edge_client.sim_host
            snapshot["served_by"]["upstream_connected"] = edge_client.connected
    return snapshot


def _upstream(path: str, payload: Optional[bytes] = None, timeout: float = 6.0):
    """Blocking HTTP call to the simulation node (run in a worker thread)."""
    import urllib.request
    if edge_client is None or not edge_client.sim_host:
        raise RuntimeError("no upstream simulation node known yet")
    request = urllib.request.Request(
        f"http://{edge_client.sim_host}{path}",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST" if payload is not None else "GET",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


# --- WebSocket --------------------------------------------------------------

@app.websocket("/ws/telemetry")
async def telemetry_ws(websocket: WebSocket):
    """Telemetry stream at 20 Hz, plus inbound operator commands."""
    await websocket.accept()
    connected_clients.add(websocket)
    logger.info("Client connected (%d total)", len(connected_clients))

    async def receive_commands():
        """Handle inbound commands on a separate task."""
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    await _handle_ws_command(json.loads(raw), websocket)
                except Exception as exc:
                    logger.error("Command error: %s", exc)
        except (WebSocketDisconnect, RuntimeError):
            pass

    reader = asyncio.create_task(receive_commands())

    try:
        while True:
            snapshot = _current_snapshot()
            if snapshot is not None:
                await websocket.send_text(dumps(snapshot))
            await asyncio.sleep(0.05)      # 20 Hz
    except (WebSocketDisconnect, RuntimeError):
        pass
    except Exception as exc:
        logger.error("WebSocket error: %s", exc)
    finally:
        reader.cancel()
        connected_clients.discard(websocket)
        logger.info("Client disconnected (%d remaining)", len(connected_clients))


async def _handle_ws_command(cmd: dict, ws: WebSocket):
    action = cmd.get("action")

    # Operator commands: {"action": "cmd", "name": "...", "params": {...}}
    if action == "cmd":
        name = cmd.get("name", "")
        params = cmd.get("params", {}) or {}
        if demo_controller is not None:
            result = await asyncio.to_thread(demo_controller.command, name, params)
        else:
            try:
                result = await asyncio.to_thread(
                    _upstream, f"/api/cmd/{name}", json.dumps(params).encode("utf-8"))
            except Exception as exc:
                result = {"ok": False, "error": f"simulation node unreachable: {exc}"}
        await ws.send_text(dumps({"type": "cmd_result", "name": name, "result": result,
                                  "request_id": cmd.get("request_id")}))
        return

    if demo_controller is None:
        # Operator on BRAVO/CHARLIE: execute the command on ALPHA, which owns
        # the simulation.
        routes = {
            "start_demo": "/api/demo/start",
            "advance_phase": "/api/demo/advance",
            "reset": "/api/demo/reset",
        }
        path = routes.get(action)
        body = b"{}"
        if action == "inject_fault":
            path = f"/api/demo/inject/{cmd.get('fault_type', 'rf_degrade')}"
            body = json.dumps(cmd.get("params", {})).encode("utf-8")
        if path:
            try:
                result = await asyncio.to_thread(_upstream, path, body)
                await ws.send_text(dumps({"type": "ack", "action": action,
                                          "result": result, "forwarded": True}))
            except Exception as exc:
                logger.warning("Could not forward %s upstream: %s", action, exc)
        return

    if action == "start_demo":
        demo_controller.start()
        await ws.send_text(dumps({"type": "ack", "action": action}))

    elif action == "advance_phase":
        result = demo_controller.advance_phase()
        await ws.send_text(dumps({"type": "ack", "action": action, "result": result}))

    elif action == "inject_fault":
        result = demo_controller.inject_fault(
            cmd.get("fault_type", "rf_degrade"), cmd.get("params", {}))
        await ws.send_text(dumps({"type": "ack", "action": action, "result": result}))

    elif action == "reset":
        demo_controller.reset()
        await ws.send_text(dumps({"type": "ack", "action": action}))


# --- terrain ----------------------------------------------------------------

@app.get("/api/terrain")
async def get_terrain():
    """
    Heightmap for the 3D view.

    The renderer builds its mesh from this exact array, so what the operator
    sees is the surface the RF model is computing diffraction against — not a
    decorative approximation of it. Served once per client and cached.
    """
    global _terrain_cache
    # On an edge node the cache mirrors ALPHA's terrain; drop it when ALPHA
    # has switched theatre, so this laptop does not keep drawing the old one.
    if (_terrain_cache is not None and demo_controller is None
            and edge_client is not None and edge_client.last_telemetry):
        live = (edge_client.last_telemetry.get("demo") or {}).get("terrain_checksum")
        if live and live != _terrain_cache.get("checksum"):
            _terrain_cache = None
    if _terrain_cache is None:
        if demo_controller is not None:
            _terrain_cache = demo_controller.world.terrain.encode()
        else:
            try:
                _terrain_cache = await asyncio.to_thread(_upstream, "/api/terrain", None, 20.0)
            except Exception as exc:
                return JSONResponse({"error": f"simulation node unreachable: {exc}"},
                                    status_code=503)

    # no-store: the terrain changes whenever the theatre does. A long browser
    # cache here (as before) made the dashboard keep receiving the previous
    # theatre after a switch and loop on "Loading terrain" indefinitely.
    return JSONResponse(_terrain_cache, headers={"Cache-Control": "no-store"})


@app.get("/api/world")
async def get_world():
    """Static world geometry: obstacles, PoIs, mission corridor."""
    if demo_controller is None:
        return JSONResponse({"error": "no simulation"}, status_code=503)
    return JSONResponse(json.loads(dumps(demo_controller.world.get_state())))


# --- status / metrics -------------------------------------------------------

@app.get("/api/status")
async def get_status():
    return JSONResponse(json.loads(dumps({
        "status": "ok",
        "connected_clients": len(connected_clients),
        "demo": demo_controller.get_state() if demo_controller else None,
        "cluster": cluster_state.get_state() if cluster_state else None,
        "edge": edge_client.get_status() if edge_client else None,
    })))


@app.get("/api/snapshot")
async def get_snapshot():
    snapshot = _current_snapshot()
    if snapshot is None:
        return JSONResponse({"error": "no telemetry"}, status_code=503)
    return Response(content=dumps(snapshot), media_type="application/json")


@app.get("/api/metrics")
async def get_metrics():
    return JSONResponse(json.loads(dumps(
        telemetry_agg.get_metrics() if telemetry_agg else {})))


@app.get("/api/benchmarks")
async def get_benchmarks():
    """Pre-computed benchmark results, if `bench/run_benchmarks.py` has run."""
    path = Path("models/benchmarks.json")
    if not path.exists():
        return JSONResponse({
            "available": False,
            "hint": "Run: python -m bench.run_benchmarks",
        })
    with open(path) as f:
        return JSONResponse({"available": True, **json.load(f)})


@app.get("/api/uavx_benchmarks")
async def get_uavx_benchmarks():
    """Mission-level results from `python -m bench.uavx_suite`, if it has run."""
    path = Path("results/uavx_benchmarks.json")
    if not path.exists():
        return JSONResponse({"available": False, "hint": "Run: python -m bench.uavx_suite"})
    with open(path) as f:
        return JSONResponse({"available": True, **json.load(f)})


@app.get("/api/link_profile")
async def get_link_profile(a: str, b: str):
    """
    Terrain profile beneath a specific link.

    This is what turns "PDR is 0.4" into something an operator can act on:
    they can see the ridge that is in the way and how far below the line of
    sight the Fresnel zone is being clipped.
    """
    if demo_controller is None:
        return JSONResponse({"error": "no simulation"}, status_code=503)

    drones = demo_controller.sim.drones
    if a not in drones or b not in drones:
        return JSONResponse({"error": "unknown node"}, status_code=404)

    profile = demo_controller.world.path_obstruction_profile(
        drones[a].position, drones[b].position, samples=48)
    profile.update({"from": a, "to": b})
    return JSONResponse(json.loads(dumps(profile)))


# --- demo control -----------------------------------------------------------

@app.post("/api/demo/start")
async def start_demo():
    if demo_controller is None:
        return JSONResponse({"error": "not initialised"}, status_code=503)
    demo_controller.start()
    return {"status": "started"}


@app.post("/api/demo/advance")
async def advance_phase():
    if demo_controller is None:
        return JSONResponse({"error": "not initialised"}, status_code=503)
    return demo_controller.advance_phase()


@app.post("/api/demo/inject/{fault_type}")
async def inject_fault(fault_type: str, request: Request):
    if demo_controller is None:
        return JSONResponse({"error": "not initialised"}, status_code=503)
    try:
        params = await request.json()
    except Exception:
        params = {}
    return demo_controller.inject_fault(fault_type, params)


@app.post("/api/demo/reset")
async def reset_demo():
    if demo_controller is None:
        return JSONResponse({"error": "not initialised"}, status_code=503)
    demo_controller.reset()
    return {"status": "reset"}


@app.post("/api/cmd/{name}")
async def operator_command(name: str, request: Request):
    """Operator command over REST (used by edge nodes forwarding their UI)."""
    if demo_controller is None:
        return JSONResponse({"ok": False, "error": "not the simulation node"}, status_code=503)
    try:
        params = await request.json()
    except Exception:
        params = {}
    return JSONResponse(json.loads(dumps(
        await asyncio.to_thread(demo_controller.command, name, params or {}))))


# --- theatres (real-world terrain) --------------------------------------------

_theatre_loader = None


def set_theatre_loader(fn):
    """Registered by run_node: fn(theatre_id) rebuilds the simulation."""
    global _theatre_loader
    _theatre_loader = fn


@app.get("/api/theatres")
async def list_theatres_endpoint():
    if demo_controller is None:
        try:
            return JSONResponse(await asyncio.to_thread(_upstream, "/api/theatres"))
        except Exception as exc:
            return JSONResponse({"error": str(exc)}, status_code=503)
    from sim.terrain import list_theatres
    return JSONResponse({
        "current": demo_controller.theatre_id,
        "theatres": list_theatres(),
    })


@app.get("/api/theatre/{theatre_id}/patch.jpg")
async def theatre_patch(theatre_id: str, level: str = "context"):
    """
    Satellite imagery of a theatre and its surroundings, draped on the globe
    when the operator zooms in. Served from the local terrain packs (every
    laptop has them), so this works on edge nodes too.
    """
    import re
    if not re.fullmatch(r"[a-z0-9_-]+", theatre_id):
        return JSONResponse({"error": "bad id"}, status_code=400)
    packs = Path(__file__).resolve().parent.parent.parent / "terrain_packs"
    folder = packs / ("_synthetic_globe" if theatre_id == "synthetic" else theatre_id)
    names = ("globe_mid.jpg",) if level == "mid" else ("globe_patch_hr.jpg", "globe_patch.jpg")
    for name in names:
        if (folder / name).exists():
            return FileResponse(str(folder / name), media_type="image/jpeg",
                                headers={"Cache-Control": "public, max-age=86400"})
    return JSONResponse({"error": "no imagery"}, status_code=404)


_TILE_URL = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"
_TILE_DIR = Path(__file__).resolve().parent.parent.parent / "terrain_packs" / "_tiles"
_tile_misses: dict = {}


def _download_tile(url: str) -> bytes:
    import subprocess
    import urllib.request
    try:
        import ssl
        import certifi
        context = ssl.create_default_context(cafile=certifi.where())
    except Exception:
        context = None
    request = urllib.request.Request(url, headers={"User-Agent": "C-DAWN-gcs/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=8, context=context) as response:
            return response.read()
    except Exception as exc:
        if "CERTIFICATE_VERIFY_FAILED" not in str(exc):
            raise
        return subprocess.run(["curl", "-sfL", "--max-time", "8", url],
                              check=True, capture_output=True).stdout


@app.get("/api/tiles/{z}/{x}/{y}.jpg")
def satellite_tile(z: int, x: int, y: int):
    """
    Sentinel-2 cloudless map tiles for the zoomable globe (EOX, CC BY 4.0).

    Tiles are cached on disk under terrain_packs/_tiles, so a venue with no
    internet still gets every tile that was viewed or pre-fetched
    (`python tools/build_terrain_packs.py tiles`). Uncached tiles are fetched
    once when the node is online.
    """
    if not (0 <= z <= 15 and 0 <= x < 2 ** z and 0 <= y < 2 ** z):
        return JSONResponse({"error": "bad tile"}, status_code=400)
    path = _TILE_DIR / str(z) / str(x) / f"{y}.jpg"
    headers = {"Cache-Control": "public, max-age=604800"}
    if path.exists():
        return FileResponse(str(path), media_type="image/jpeg", headers=headers)
    key = (z, x, y)
    if time.time() - _tile_misses.get(key, 0) < 60:   # offline: do not hammer
        return JSONResponse({"error": "tile unavailable"}, status_code=404)
    try:
        data = _download_tile(_TILE_URL.format(z=z, x=x, y=y))
    except Exception:
        _tile_misses[key] = time.time()
        return JSONResponse({"error": "tile unavailable"}, status_code=404)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".part")
    tmp.write_bytes(data)
    tmp.replace(path)
    return Response(content=data, media_type="image/jpeg", headers=headers)


@app.post("/api/theatre/{theatre_id}")
async def select_theatre(theatre_id: str):
    if demo_controller is None:
        try:
            return JSONResponse(await asyncio.to_thread(
                _upstream, f"/api/theatre/{theatre_id}", b"{}", 60.0))
        except Exception as exc:
            return JSONResponse({"ok": False, "error": str(exc)}, status_code=503)

    from sim.terrain import list_theatres
    if theatre_id not in {t["id"] for t in list_theatres()}:
        return JSONResponse({"ok": False, "error": f"unknown theatre {theatre_id}"},
                            status_code=404)
    if _theatre_loader is None:
        return JSONResponse({"ok": False, "error": "theatre switching unavailable"},
                            status_code=503)
    state = await asyncio.to_thread(_theatre_loader, theatre_id)
    return JSONResponse(json.loads(dumps({"ok": True, "demo": state})))


# --- cluster ----------------------------------------------------------------

@app.get("/api/cluster")
async def get_cluster():
    if cluster_state is None:
        return JSONResponse({"enabled": False})
    return JSONResponse(json.loads(dumps({
        "enabled": True,
        **cluster_state.get_state(),
        "edge": edge_client.get_status() if edge_client else None,
    })))


@app.post("/api/cluster/register")
async def register_node(request: Request):
    """An edge node announcing itself and claiming subsystems."""
    if cluster_state is None:
        return JSONResponse({"error": "clustering disabled"}, status_code=503)

    body = await request.json()
    record = cluster_state.register_peer(
        node_id=body["node_id"],
        role=body.get("role", "edge"),
        ip=body.get("ip", request.client.host),
        port=int(body.get("port", 8080)),
        subsystems=body.get("subsystems", []),
    )
    return {"status": "registered", "peer": record,
            "cluster": cluster_state.get_state()}


@app.post("/api/cluster/result")
async def receive_result(request: Request):
    """
    Apply a computed result pushed by an edge node.

    Results are applied to the authoritative simulation here; the edge node
    never mutates simulation state directly.
    """
    if cluster_state is None or demo_controller is None:
        return JSONResponse({"error": "clustering disabled"}, status_code=503)

    body = await request.json()
    node_id = body.get("node_id", "unknown")
    applied = []

    stations = body.get("relay_stations")
    if stations:
        for drone_id, position in stations.items():
            if drone_id in demo_controller.sim.drones:
                demo_controller.guidance.set_relay_station(
                    drone_id, np.array(position, dtype=np.float64))
        cluster_state.touch_subsystem(
            "gnn_topology", node_id, body.get("compute_ms", 0.0))
        demo_controller.remote_gnn_metrics = body.get("gnn_metrics")
        applied.append("gnn_topology")

    causal = body.get("causal_state")
    if causal:
        cluster_state.touch_subsystem(
            "scm_causal", node_id, body.get("compute_ms", 0.0))
        demo_controller.remote_causal_state = causal

        # do(dz) commands computed on BRAVO are executed here, on the node
        # that actually owns the aircraft. Applied only while BRAVO holds the
        # subsystem, so a late packet from a node that has just lost
        # ownership cannot fight ALPHA's own intervention engine.
        offsets = body.get("altitude_offsets") or {}
        if not cluster_state.owns_locally("scm_causal"):
            for drone_id, offset in offsets.items():
                drone = demo_controller.sim.drones.get(drone_id)
                if drone is not None:
                    drone.altitude_offset_cmd = float(offset)
        applied.append("scm_causal")

    for event in body.get("events") or []:
        demo_controller.sim.log_event(
            event.get("type", "EDGE"),
            f"[{node_id.split('-')[0]}] {event.get('message', '')}",
            event,
        )

    sitrep = body.get("sitrep")
    if sitrep:
        cluster_state.touch_subsystem(
            "rag_sitrep", node_id, body.get("compute_ms", 0.0))
        demo_controller.remote_sitrep = sitrep
        applied.append("rag_sitrep")

    return {"status": "applied", "subsystems": applied}


# --- subsystem detail -------------------------------------------------------

@app.get("/api/summary")
async def get_summary():
    """The full mission metrics (challenge categories) and indicative scores."""
    if demo_controller is None:
        return JSONResponse(await asyncio.to_thread(_upstream, "/api/summary"))
    from mission.metrics import MissionMetrics
    with demo_controller._lock:
        summary = demo_controller.summary(force=True)
    return Response(content=dumps({"summary": summary,
                                   "indicative_scores": MissionMetrics.indicative_scores(summary)}),
                    media_type="application/json")


@app.get("/api/causal")
async def get_causal_state():
    if demo_controller is None:
        return JSONResponse({})
    return Response(content=dumps(demo_controller.causal_layer.get_state()),
                    media_type="application/json")


@app.get("/api/gnn")
async def get_gnn_state():
    if demo_controller is None:
        return JSONResponse({})
    return Response(content=dumps(demo_controller.relay_optimizer.get_metrics()),
                    media_type="application/json")


@app.get("/api/mesh")
async def get_mesh_state():
    if demo_controller is None:
        return JSONResponse({})
    return Response(content=dumps(demo_controller.mesh.get_state()),
                    media_type="application/json")


@app.get("/api/election")
async def get_election_state():
    if demo_controller is None:
        return JSONResponse({})
    return Response(content=dumps(demo_controller.election.get_state()),
                    media_type="application/json")


@app.get("/api/sitrep")
async def get_sitrep():
    if demo_controller is None:
        return JSONResponse({"text": "Not initialised."})
    latest = demo_controller.sitrep_gen.get_latest_sitrep()
    return Response(content=dumps(latest or {"text": "No SITREP generated yet."}),
                    media_type="application/json")


@app.get("/api/health")
async def health():
    return {"ok": True, "t": time.time()}


# --- static frontend --------------------------------------------------------

frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"


@app.get("/")
async def root():
    index = frontend_dist / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return JSONResponse({
        "message": "C-DAWN GCS API is running, but the dashboard is not built.",
        "fix": "cd gcs/frontend && npm install && npm run build",
    })


if frontend_dist.exists():
    # Mounted last so it cannot shadow the /api and /ws routes above.
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True),
              name="frontend")
