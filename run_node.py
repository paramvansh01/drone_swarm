#!/usr/bin/env python3
"""
C-DAWN node launcher — UAV-X resilient BVLOS swarm (PUSHPAK Grand Challenge 2026).

Single entry point for every laptop in the demonstration.

    # One laptop: dashboard + simulation
    python run_node.py
    python run_node.py --scenario scenarios/kedarnath_landslide.json --autostart

    # Laptop 1 — ALPHA: authoritative simulation
    python run_node.py --role sim

    # Laptop 2 — BRAVO: GNN + SCM edge compute
    python run_node.py --role edge --peer 192.168.1.21

    # Laptop 3 — CHARLIE: ground control station
    python run_node.py --role gcs --peer 192.168.1.21

`--peer` is optional: nodes find each other by UDP broadcast on the same
Wi-Fi. Give it explicitly if the venue network isolates wireless clients.

    # Rehearsal / fallback — everything on one machine
    python run_node.py --role all

Each node prints its own LAN URL on startup. Open any of them in a browser;
they all serve the same dashboard against the same authoritative state.
"""

from __future__ import annotations

import argparse
import logging
import socket
import sys
import threading
import time
import webbrowser
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
sys.path.insert(0, str(PROJECT_ROOT))

from cluster import (                                      # noqa: E402
    ClusterState, DiscoveryService, EdgeClient, NodeRole,
    ROLE_SUBSYSTEMS, SUBSYSTEM_CAUSAL, SUBSYSTEM_SITREP,
    SUBSYSTEM_TOPOLOGY, get_lan_ip,
)

logger = logging.getLogger("cdawn.node")


BANNER = r"""
   ____      ____    _    __        ___   _
  / ___|    |  _ \  / \   \ \      / / \ | |
 | |   _____| | | |/ _ \   \ \ /\ / /|  \| |
 | |__|_____| |_| / ___ \   \ V  V / | |\  |
  \____|    |____/_/   \_\   \_/\_/  |_| \_|

  Causal Dynamic Aerial Wireless Network
  UAV-X Resilient BVLOS Swarm — disaster response
  PUSHPAK Grand Challenge 2026 · Grand Challenge 1
"""


def setup_logging(verbose: bool = False):
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s [%(name)-24s] %(levelname)-7s %(message)s",
        datefmt="%H:%M:%S",
    )
    # uvicorn's access log is noise during a demo
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def find_available_port(preferred: int, host: str = "0.0.0.0") -> int:
    for port in range(preferred, preferred + 60):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((host, port))
                return port
            except OSError:
                continue
    return preferred


# --------------------------------------------------------------------------
# Edge computation
# --------------------------------------------------------------------------

def build_edge_computer(role: NodeRole):
    """
    Build the callback an edge node runs on each telemetry frame.

    The node keeps a *persistent* local mirror of the swarm, updated in place
    from each frame. Persistence matters: an intervention in progress lives
    across dozens of frames, and the altitude offset it commands is state this
    node owns. Rebuilding the mirror from scratch every frame (as an earlier
    version did) silently discarded both.

    Terrain is deterministic from its seed, so the mirror's world is
    bit-identical to ALPHA's without transferring the heightmap.
    """
    from types import SimpleNamespace
    from sim.terrain import build_terrain
    from sim.world import World

    world = World(terrain=build_terrain())
    world_theatre = {"id": "synthetic"}
    mirror: dict = {}
    state = {"last_topology": 0.0, "last_causal_push": 0.0, "last_sitrep_push": 0.0,
             "last_sitrep_time": -1e9, "detected": set()}

    subsystems = ROLE_SUBSYSTEMS.get(role, ())
    optimizer = causal = None
    rag = None

    if SUBSYSTEM_TOPOLOGY in subsystems:
        from gnn.relay_optimizer import RelayOptimizer
        optimizer = RelayOptimizer(world)
        logger.info("Edge: GNN relay optimiser ready (trained=%s)",
                    optimizer.model_trained)

    if SUBSYSTEM_CAUSAL in subsystems:
        from scm.causal_layer import CausalLayer
        causal = CausalLayer(world)
        logger.info("Edge: SCM causal layer ready")

    if SUBSYSTEM_SITREP in subsystems:
        from rag.detector import DisasterDetector
        from rag.embedder import CLIPEmbedder
        from rag.vector_store import VectorStore
        from rag.sitrep_generator import SitrepGenerator
        rag = SimpleNamespace(
            detector=DisasterDetector(use_simulation=True),
            embedder=CLIPEmbedder(use_simulation=True),
            store=VectorStore(),
            generator=SitrepGenerator(use_template=True),
        )
        logger.info("Edge: RAG / SITREP pipeline ready")

    def compute(telemetry: dict):
        nonlocal world, optimizer, causal
        drones_raw = telemetry.get("drones", {})
        if not drones_raw:
            return None
        import numpy as np

        # Follow ALPHA onto a new theatre: rebuild the local world (packs ship
        # with the repo, so every laptop has the same terrain) and the
        # subsystems that depend on it.
        theatre_id = ((telemetry.get("demo") or {}).get("theatre") or {}).get("id", "synthetic")
        if theatre_id != world_theatre["id"]:
            logger.info("Edge: switching local world to theatre %s", theatre_id)
            world = World.from_theatre(theatre_id)
            world_theatre["id"] = theatre_id
            mirror.clear()
            if optimizer is not None:
                from gnn.relay_optimizer import RelayOptimizer
                optimizer = RelayOptimizer(world)
            if causal is not None:
                from scm.causal_layer import CausalLayer
                causal = CausalLayer(world)

        # The GCS may sit where a scenario put it, not at the default
        gcs = telemetry.get("gcs") or {}
        if gcs.get("position") is not None:
            world.gcs.position = np.asarray(gcs["position"], dtype=float)

        _sync_mirror(mirror, drones_raw)
        sim_time = float(telemetry.get("sim_time", 0.0))
        mission = telemetry.get("mission") or {}
        results = {}
        now = time.perf_counter()

        # --- relay topology (BRAVO) -------------------------------------
        # The expensive one: rate-limited rather than run on all 20 frames/s.
        if optimizer is not None and now - state["last_topology"] > 0.5:
            state["last_topology"] = now
            optimizer.chain_hint = [np.asarray(p, dtype=float) for p in
                                    ((mission.get("roles") or {}).get("chain_points") or [])]
            # The interference source ALPHA's response has localised, if any
            ew = ((telemetry.get("rf") or {}).get("ew") or {})
            outcome = optimizer.optimize(
                mirror, guidance=None,
                rf_channel=SimpleNamespace(jamming_active=False,
                                           ew_estimate=ew.get("estimate"),
                                           ew_emitters=ew.get("estimates") or []))
            if outcome.get("status") == "ok":
                results["relay_stations"] = outcome["stations"]
                results["gnn_metrics"] = optimizer.get_metrics()

        # --- causal diagnostics + interventions (BRAVO) ------------------
        # Run on every frame: intervention windows are timed in sim seconds
        # and need a steady stream of loss samples.
        if causal is not None:
            rf = telemetry.get("rf", {}) or {}
            rf_proxy = SimpleNamespace(
                jamming_active=bool(rf.get("jamming_active")),
                jamming_power_dbm=rf.get("jamming_power_dbm") or -200.0,
                noise_floor_dbm=rf.get("noise_floor_dbm", -100.0),
            )
            causal.update(mirror, rf_proxy, sim_time)

            # Interventions are commands, not observations: the climb has to
            # be executed on ALPHA, which owns the aircraft.
            events = causal.drain_events()
            if events or now - state["last_causal_push"] > 0.25:
                state["last_causal_push"] = now
                results["causal_state"] = causal.get_state()
                results["altitude_offsets"] = {
                    d_id: d.altitude_offset_cmd for d_id, d in mirror.items()
                }
                if events:
                    results["events"] = events

        # --- SITREP synthesis (CHARLIE) ----------------------------------
        if rag is not None:
            _edge_detect(rag, mirror, telemetry.get("pois", []), sim_time,
                         state["detected"])
            if mission.get("phase") == "LIVE" and state["detected"] \
                    and sim_time - state["last_sitrep_time"] > 45.0:
                state["last_sitrep_time"] = sim_time
                query = rag.embedder.embed_text("disaster situation overview survivors")
                evidence = rag.store.query(query, top_k=6)
                sitrep = rag.generator.generate(
                    evidence=evidence,
                    metrics=telemetry.get("metrics") or {},
                    causal_state=(telemetry.get("causal") or {}).get("scm") or {},
                    ew_state=(telemetry.get("rf") or {}).get("ew"),
                )
                results["events"] = [{
                    "type": "SITREP",
                    "message": (f"{sitrep['sitrep_id']} synthesised on CHARLIE in "
                                f"{sitrep.get('generation_time_ms', 0):.1f} ms from "
                                f"{len(evidence)} cited detections"),
                }]
            # Pushed every second even when idle, so ownership stays fresh and
            # the dashboard always shows CHARLIE's own report history.
            if results.get("events") or now - state["last_sitrep_push"] > 1.0:
                state["last_sitrep_push"] = now
                results["sitrep"] = rag.generator.get_state()

        return results or None

    return compute


def _sync_mirror(mirror: dict, drones_raw: dict):
    """
    Update the persistent drone mirror in place from a telemetry frame.

    Everything is overwritten from ALPHA's authoritative state EXCEPT
    `altitude_offset_cmd`, which this node owns while it runs the causal layer.
    """
    import numpy as np
    from sim.drone import Drone, DroneRole, DroneStatus

    for drone_id, st in drones_raw.items():
        try:
            drone = mirror.get(drone_id)
            if drone is None:
                drone = Drone(drone_id=drone_id,
                              position=np.array(st["position"], dtype=np.float64),
                              role=DroneRole[st.get("role", "SCOUT")])
                drone.altitude_offset_cmd = float(st.get("altitude_offset_cmd", 0.0))
                mirror[drone_id] = drone

            drone.position = np.array(st["position"], dtype=np.float64)
            drone.velocity = np.array(st.get("velocity", [0, 0, 0]), dtype=np.float64)
            drone.role = DroneRole[st.get("role", "SCOUT")]
            drone.status = DroneStatus[st.get("status", "ACTIVE")]
            drone.battery = float(st.get("battery", 100.0))
            drone.neighbors = dict(st.get("neighbors", {}))
            drone.gcs_link = float(st.get("gcs_link", 0.0))
            drone.sensors.rssi = dict(st.get("rssi", {}))
        except (KeyError, ValueError) as exc:
            logger.debug("Skipping drone %s in mirror: %s", drone_id, exc)


def _edge_detect(rag, mirror: dict, pois: list, sim_time: float, detected: set):
    """Run on-board detection for scouts over a survey target."""
    import numpy as np
    from sim.drone import DroneRole

    for drone in mirror.values():
        if not drone.is_alive or drone.role != DroneRole.SCOUT:
            continue
        for poi in pois:
            if poi["id"] in detected:
                continue
            if np.linalg.norm(drone.position - np.array(poi["position"])) > 45.0:
                continue
            for det in rag.detector.detect(drone_id=drone.id, timestamp=sim_time,
                                           gps_coords=drone.position,
                                           poi_category=poi["category"]):
                rag.store.add(embedding=rag.embedder.embed_detection(det)["embedding"],
                              metadata={"class": det.class_name,
                                        "confidence": det.confidence,
                                        "drone_id": det.drone_id,
                                        "timestamp": det.timestamp,
                                        "poi_id": poi["id"],
                                        "position": [float(v) for v in drone.position]})
            detected.add(poi["id"])


# --------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="C-DAWN node launcher (UAV-X)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--role", type=str, default="all",
                        choices=[r.value for r in NodeRole],
                        help="Node role (default: all — everything locally)")
    parser.add_argument("--peer", type=str, default=None,
                        help="Address of the sim node, e.g. 192.168.1.21 "
                             "or 192.168.1.21:8080 (default: auto-discover)")
    parser.add_argument("--host", type=str, default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--scenario", type=str, default=None,
                        help="Mission scenario: a JSON path, or a name in scenarios/ "
                             "(e.g. kedarnath_landslide)")
    parser.add_argument("--autostart", action="store_true",
                        help="Launch the mission immediately instead of waiting on the pads")
    parser.add_argument("--fleet", type=int, default=None,
                        help="Number of UAVs (default: the scenario's, or 5)")
    parser.add_argument("--log-dir", type=str, default=None,
                        help="Write the mission logs (events, UAV state, packets, metrics) here")
    parser.add_argument("--phase-duration", type=float, default=60.0,
                        help="Seconds per phase of the scripted demonstration (default: 60)")
    parser.add_argument("--theatre", type=str, default="synthetic",
                        help="Starting theatre: synthetic, kedarnath, uttarkashi, joshimath, "
                             "chungthang (terrain_packs/). Switchable from the globe.")
    parser.add_argument("--mode", type=str, default="interactive",
                        choices=["interactive", "scripted"],
                        help="interactive (default): the operator launches the mission and "
                             "throws disturbances at it. scripted: the built-in demonstration "
                             "(or the scenario's timeline) runs from launch.")
    parser.add_argument("--no-scout-promotion", action="store_true",
                        help="Never turn a scout into a relay after a relay loss. Faster "
                             "survey, but scouts can lose contact with base (see README §5).")
    parser.add_argument("--controller", type=str, default="pid",
                        choices=["pid", "ltc"],
                        help="Flight controller to fly with. Default is the "
                             "cascaded PID, which outperformed the LTC on the "
                             "paired gust benchmark (see bench/ltc_vs_pid.py). "
                             "The other one always runs in shadow for comparison.")
    parser.add_argument("--no-discovery", action="store_true",
                        help="Disable UDP broadcast discovery")
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    setup_logging(args.verbose)
    role = NodeRole(args.role)

    if args.no_scout_promotion:
        from mesh.election import RelayElection
        RelayElection.PROMOTE_SCOUTS = False

    port = find_available_port(args.port, args.host)
    if port != args.port:
        logger.warning("Port %d busy — using %d", args.port, port)

    lan_ip = get_lan_ip()
    node_id = f"{role.callsign}-{socket.gethostname().split('.')[0]}-{port}"

    cluster = ClusterState(node_id=node_id, role=role, ip=lan_ip, port=port)

    # -- role-specific setup ----------------------------------------------
    demo = None
    telemetry = None
    edge = None

    runs_simulation = role in (NodeRole.SIM, NodeRole.ALL)

    if runs_simulation:
        from gcs.backend.demo_controller import DemoController
        from gcs.backend.telemetry import TelemetryAggregator

        scenario_path = None
        scenario_theatre = None
        if args.scenario:
            for candidate in (Path(args.scenario),
                              PROJECT_ROOT / "scenarios" / f"{args.scenario}.json",
                              PROJECT_ROOT / "demo" / "scenarios" / f"{args.scenario}.json"):
                if candidate.exists():
                    scenario_path = str(candidate)
                    break
            if scenario_path is None:
                logger.warning("Scenario %s not found — using default", args.scenario)
            else:
                import json as _json
                scenario_theatre = _json.loads(Path(scenario_path).read_text()).get("theatre")

        telemetry = TelemetryAggregator()

        def make_on_telemetry(d):
            """Telemetry callback bound to one controller instance."""
            def on_telemetry(data):
                # While a subsystem is delegated, ALPHA's local copy of it is
                # idle and stale; the dashboard must show the edge node's result.
                def pick(subsystem, local, remote):
                    if not cluster.owns_locally(subsystem) and remote:
                        return remote
                    return local()

                telemetry.update(data)
                telemetry.update_causal(pick("scm_causal", d.causal_layer.get_state,
                                             d.remote_causal_state))
                telemetry.update_gnn(pick("gnn_topology", d.relay_optimizer.get_metrics,
                                          d.remote_gnn_metrics))
                telemetry.update_mesh(d.mesh.get_state())
                telemetry.update_election(d.election.get_state())
                telemetry.update_sitrep(pick("rag_sitrep", d.sitrep_gen.get_state,
                                             d.remote_sitrep))
                telemetry.update_cluster(cluster.get_state())
                telemetry.update_demo(d.get_state())
            return on_telemetry

        def build_demo(theatre_id, first=False):
            # A scenario is tied to its theatre: switching theatre on the
            # globe drops it and flies the default mission there instead.
            use_scenario = scenario_path if (first or theatre_id == scenario_theatre) else None
            d = DemoController(scenario_path=use_scenario,
                               phase_duration=args.phase_duration,
                               controller=args.controller,
                               mode=args.mode,
                               theatre=theatre_id,
                               fleet_size=args.fleet,
                               autostart=args.autostart and first)
            d.cluster = cluster
            d.set_telemetry_callback(make_on_telemetry(d))
            if args.log_dir:
                from mission.recorder import MissionRecorder
                stamp = time.strftime("%Y%m%d-%H%M%S")
                d.recorder = MissionRecorder(Path(args.log_dir) / f"{theatre_id}-{stamp}", d, d.scenario)
                d.sim.log_listeners.append(d.recorder.on_event)
                d.finalize_recorder_on_end = True
            return d

        demo = build_demo(scenario_theatre or args.theatre, first=True)
        current = {"demo": demo}

        def load_theatre(theatre_id):
            """
            Swap the whole simulation onto another theatre while the server
            keeps running. The old controller is stopped only after the new
            one is fully built, so a bad pack cannot leave the node empty.
            """
            from gcs.backend import app as gcs_app
            new = build_demo(theatre_id)
            old = current["demo"]
            old.stop()
            telemetry.reset()
            current["demo"] = new
            gcs_app.init_gcs(new, telemetry, cluster, edge)
            new.start()
            logger.info("Theatre switched to %s", theatre_id)
            return new.get_state()

    else:
        # Edge / GCS node: stream from ALPHA rather than simulating
        subsystems = list(ROLE_SUBSYSTEMS.get(role, ()))
        edge = EdgeClient(
            node_id=node_id, role=role.value,
            local_ip=lan_ip, local_port=port,
            subsystems=subsystems,
        )
        if subsystems:
            edge.on_telemetry = build_edge_computer(role)

        if args.peer:
            peer = args.peer if ":" in args.peer else f"{args.peer}:8080"
            edge.set_sim_host(peer)

        edge.start()

    # -- discovery ---------------------------------------------------------
    discovery = None
    if not args.no_discovery:
        def on_peer(msg):
            cluster.register_peer(
                node_id=msg["node_id"], role=msg.get("role", "unknown"),
                ip=msg.get("ip", msg.get("address")), port=int(msg.get("port", 8080)),
            )
            # An edge node with no explicit peer adopts the first sim node it hears
            if edge is not None and not edge.sim_host and msg.get("role") in ("sim", "all"):
                edge.set_sim_host(f"{msg['ip']}:{msg['port']}")

        discovery = DiscoveryService(node_id=node_id, role=role.value,
                                     port=port, on_peer=on_peer)
        discovery.start()

    # -- banner ------------------------------------------------------------
    print(BANNER)
    print(f"  Node          {node_id}")
    print(f"  Role          {role.callsign} — {role.description}")
    print(f"  Dashboard     http://{lan_ip}:{port}")
    print(f"  Local         http://localhost:{port}")
    if demo:
        print(f"  Controller    {demo.active_controller}")
        print(f"  GNN weights   {'trained' if demo.relay_optimizer.model_trained else 'UNTRAINED'}")
        print(f"  Terrain       {demo.world.terrain.config.size_m:.0f} m, "
              f"peaks to {demo.world.terrain.get_metadata()['max_height_m']:.0f} m")
        print(f"  Survey points {len(demo.world.pois)}")
    if edge:
        print(f"  Sim host      {edge.sim_host or 'discovering...'}")
        print(f"  Subsystems    {', '.join(edge.subsystems) or 'view only'}")
    print(f"  Discovery     {'UDP broadcast :45454' if discovery else 'disabled'}")
    print()
    print("  Open the dashboard URL above on any laptop on this network.")
    print()

    # -- serve -------------------------------------------------------------
    import uvicorn
    from gcs.backend.app import app, init_gcs

    init_gcs(demo, telemetry, cluster, edge)
    if demo:
        from gcs.backend.app import set_theatre_loader
        set_theatre_loader(load_theatre)

    if demo:
        demo.start()

    if not args.no_browser:
        def open_browser():
            time.sleep(1.5)
            webbrowser.open(f"http://localhost:{port}")
        threading.Thread(target=open_browser, daemon=True).start()

    try:
        uvicorn.run(app, host=args.host, port=port, log_level="warning")
    except KeyboardInterrupt:
        pass
    finally:
        logger.info("Shutting down %s", node_id)
        if demo:
            current["demo"].stop()
            current["demo"].finalize_recording()
        if edge:
            edge.stop()
        if discovery:
            discovery.stop()


if __name__ == "__main__":
    main()
