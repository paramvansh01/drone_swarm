"""
C-DAWN Demo Runner.

Single entry point to launch the simulation + GCS dashboard.

Usage:
    python demo/run_demo.py
    python demo/run_demo.py --scenario canyon_01
    python demo/run_demo.py --headless
"""

import sys
import argparse
import logging
import asyncio
import threading
import webbrowser
import socket
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from gcs.backend.demo_controller import DemoController
from gcs.backend.telemetry import TelemetryAggregator


def find_available_port(preferred_port: int = 8080, host: str = "0.0.0.0") -> int:
    """Find an available port starting from preferred_port."""
    for port in range(preferred_port, preferred_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind((host, port))
                return port
            except OSError:
                continue
    return preferred_port


def setup_logging(verbose: bool = False):
    """Configure logging."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(name)-20s] %(levelname)-7s %(message)s",
        datefmt="%H:%M:%S",
    )


def run_server(host: str, port: int, demo: DemoController, telemetry: TelemetryAggregator):
    """Run the FastAPI server."""
    import uvicorn
    from gcs.backend.app import app, init_gcs

    init_gcs(demo, telemetry)

    # Register telemetry callback
    def on_telemetry(data):
        telemetry.update(data)

        # Update component states
        if demo.scm_diagnostics:
            telemetry.update_causal(demo.scm_diagnostics.get_state())
        if demo.relay_optimizer:
            telemetry.update_gnn(demo.relay_optimizer.get_metrics())
        if demo.mesh:
            telemetry.update_mesh(demo.mesh.get_state())
        if demo.election:
            telemetry.update_election(demo.election.get_state())
        if demo.sitrep_gen:
            telemetry.update_sitrep(demo.sitrep_gen.get_state())
        if demo.intervention_engine:
            telemetry.update_interventions(demo.intervention_engine.get_state())

    demo.set_telemetry_callback(on_telemetry)

    uvicorn.run(app, host=host, port=port, log_level="warning")


def main():
    parser = argparse.ArgumentParser(description="C-DAWN Demo Runner")
    parser.add_argument(
        "--scenario",
        type=str,
        default=None,
        help="Scenario name (e.g., canyon_01, urban_rubble). Default: built-in canyon.",
    )
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Server host")
    parser.add_argument("--port", type=int, default=8080, help="Server port (default: 8080)")
    parser.add_argument("--headless", action="store_true", help="Run without opening browser")
    parser.add_argument("--verbose", action="store_true", help="Verbose logging")
    parser.add_argument(
        "--phase-duration",
        type=float,
        default=45.0,
        help="Duration of each demo phase (seconds)",
    )

    args = parser.parse_args()
    setup_logging(args.verbose)

    logger = logging.getLogger("cdawn.demo")

    # Detect and resolve port collisions
    actual_port = find_available_port(args.port, args.host)
    if actual_port != args.port:
        logger.warning(f"Port {args.port} is already in use. Switched to available port {actual_port}.")
        args.port = actual_port

    # Resolve scenario
    scenario_path = None
    if args.scenario:
        scenario_file = project_root / "demo" / "scenarios" / f"{args.scenario}.json"
        if scenario_file.exists():
            scenario_path = str(scenario_file)
            logger.info(f"Loading scenario: {scenario_path}")
        else:
            logger.warning(f"Scenario not found: {scenario_file}. Using default.")

    # Create demo controller
    demo = DemoController(
        scenario_path=scenario_path,
        phase_duration=args.phase_duration,
    )

    # Create telemetry aggregator
    telemetry = TelemetryAggregator()

    print()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║                                                        ║")
    print("║     ██████╗      ██████╗   █████╗  ██╗    ██╗███╗   ██╗║")
    print("║    ██╔════╝      ██╔══██╗ ██╔══██╗ ██║    ██║████╗  ██║║")
    print("║    ██║      █████╗██║  ██║███████║ ██║ █╗ ██║██╔██╗ ██║║")
    print("║    ██║      ╚════╝██║  ██║██╔══██║ ██║███╗██║██║╚██╗██║║")
    print("║    ╚██████╗      ██████╔╝██║  ██║ ╚███╔███╔╝██║ ╚████║║")
    print("║     ╚═════╝      ╚═════╝ ╚═╝  ╚═╝  ╚══╝╚══╝ ╚═╝  ╚═══╝║")
    print("║                                                        ║")
    print("║  Causal Dynamic Aerial Wireless Network                ║")
    print("║  Resilient BVLOS Swarm Autonomy                        ║")
    print("║                                                        ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()
    print(f"  Dashboard:  http://localhost:{args.port}")
    print(f"  API Docs:   http://localhost:{args.port}/docs")
    print(f"  Scenario:   {args.scenario or 'default canyon'}")
    print(f"  Drones:     {len(demo.sim.drones)}")
    print(f"  PoIs:       {len(demo.world.pois)}")
    print()

    if not args.headless:
        # Open browser after a short delay
        def open_browser():
            import time
            time.sleep(2)
            webbrowser.open(f"http://localhost:{args.port}")
        threading.Thread(target=open_browser, daemon=True).start()

    # Auto-start the simulation
    demo.start()

    # Run server (blocking)
    try:
        run_server(args.host, args.port, demo, telemetry)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        demo.stop()


if __name__ == "__main__":
    main()
