"""
4-Phase demo script orchestrator for C-DAWN.

Implements the live demonstration protocol from the proposal:
  Phase 1: Swarm launch & PoI survey initiation
  Phase 2: Fault injection (RF degradation / jamming) → causal diagnostics engage
  Phase 3: "KILL NODE" event → relay election & self-healing reroute
  Phase 4: SITREP synthesis & dashboard readout
"""

import asyncio
import time
import logging
import threading
import numpy as np
from pathlib import Path
from typing import Optional, Dict

import sys
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sim.world import World
from sim.drone import DroneRole, DroneConfig
from sim.rf_channel import RFChannel
from sim.wind import WindField
from sim.runner import SimulationRunner, EventType

from scm.diagnostics import OnlineDiagnostics, make_scm_diagnostics_hook
from scm.interventions import InterventionEngine
from gnn.relay_optimizer import RelayOptimizer, make_topology_optimizer_hook
from mesh.mesh_network import MeshNetwork
from mesh.routing import SCMAwareRouter
from mesh.election import RelayElection
from rag.detector import DisasterDetector
from rag.embedder import CLIPEmbedder
from rag.vector_store import VectorStore
from rag.sitrep_generator import SitrepGenerator

logger = logging.getLogger("cdawn.demo")


class DemoController:
    """
    Orchestrates the 4-phase C-DAWN demonstration.

    Manages the simulation runner, all subsystems, and phase transitions
    with timed fault injections.
    """

    PHASE_NAMES = {
        0: "STANDBY",
        1: "LAUNCH & SURVEY",
        2: "FAULT INJECTION — CAUSAL DIAGNOSTICS",
        3: "KILL NODE — SELF-HEALING",
        4: "SITREP SYNTHESIS",
        5: "COMPLETE",
    }

    def __init__(
        self,
        scenario_path: Optional[str] = None,
        phase_duration: float = 45.0,  # seconds per phase
        dt: float = 0.02,
    ):
        self.phase_duration = phase_duration
        self.dt = dt
        self.current_phase = 0
        self._phase_start_time = 0.0
        self._running = False
        self._sim_thread: Optional[threading.Thread] = None

        # Build world
        if scenario_path:
            self.world = World.from_scenario(scenario_path)
        else:
            self.world = World(bounds=(200.0, 100.0, 80.0))
            self.world.generate_canyon(
                length=180.0, width=40.0, wall_height=35.0,
                num_pois=5, rubble_count=4, seed=42,
            )

        # Build subsystems
        self.wind = WindField(
            base_wind=np.array([2.0, 0.5, 0.0]),
            turbulence_intensity=1.0,
        )
        self.rf = RFChannel(frequency_mhz=900.0, fading_model="rician")

        # Simulation runner
        self.sim = SimulationRunner(
            world=self.world,
            wind=self.wind,
            rf_channel=self.rf,
            dt=dt,
            realtime=True,
        )

        # Add drones (5-drone swarm: 2 scouts, 2 relays, 1 GCS relay)
        self.sim.add_drone("SCOUT-1", [10, 0, 20], DroneRole.SCOUT)
        self.sim.add_drone("SCOUT-2", [10, 5, 20], DroneRole.SCOUT)
        self.sim.add_drone("RELAY-1", [50, 0, 30], DroneRole.RELAY)
        self.sim.add_drone("RELAY-2", [90, 0, 35], DroneRole.RELAY)
        self.sim.add_drone("GCS-RELAY", [5, 0, 25], DroneRole.GCS_RELAY)

        # Assign initial PoI targets to scouts
        if self.world.pois:
            self.sim.drones["SCOUT-1"].set_target(
                self.world.pois[0].position, self.world.pois[0].id
            )
            if len(self.world.pois) > 1:
                self.sim.drones["SCOUT-2"].set_target(
                    self.world.pois[1].position, self.world.pois[1].id
                )

        # SCM Diagnostics
        self.scm_diagnostics = OnlineDiagnostics(loss_threshold=0.15)
        self.intervention_engine = InterventionEngine()
        self.sim.scm_diagnostics = make_scm_diagnostics_hook(self.scm_diagnostics)

        # GNN Topology
        self.relay_optimizer = RelayOptimizer()
        self.sim.topology_optimizer = make_topology_optimizer_hook(self.relay_optimizer)

        # Mesh Network
        self.mesh = MeshNetwork()
        self.router = SCMAwareRouter()
        self.election = RelayElection()

        # RAG Pipeline
        self.detector = DisasterDetector(use_simulation=True)
        self.embedder = CLIPEmbedder(use_simulation=True)
        self.vector_store = VectorStore()
        self.sitrep_gen = SitrepGenerator(use_template=True)

        # Inject wind gusts for Phase 1
        self.wind.inject_random_gusts(start_time=5.0, num_gusts=3, interval=15.0)

        # Schedule demo events
        self._schedule_demo_events()

        # Telemetry callback
        self._telemetry_callback = None

    def _schedule_demo_events(self):
        """Schedule the 4-phase demo event sequence."""
        t = self.phase_duration

        # Phase 2: Fault injection
        self.sim.schedule_event(t, EventType.PHASE_CHANGE, phase=2)
        self.sim.schedule_event(t + 5, EventType.RF_DEGRADE, noise_db=15.0)
        self.sim.schedule_event(t + 15, EventType.JAMMING_START, power_dbm=-75.0)
        self.sim.schedule_event(t + 30, EventType.JAMMING_STOP)
        self.sim.schedule_event(t + 35, EventType.RF_RESTORE)

        # Phase 3: Kill node
        self.sim.schedule_event(2 * t, EventType.PHASE_CHANGE, phase=3)
        self.sim.schedule_event(2 * t + 5, EventType.KILL_NODE, drone_id="RELAY-1")

        # Phase 4: SITREP
        self.sim.schedule_event(3 * t, EventType.PHASE_CHANGE, phase=4)

    def set_telemetry_callback(self, callback):
        """Set callback for telemetry updates."""
        self._telemetry_callback = callback
        self.sim.on_telemetry(callback)

    def start(self):
        """Start the demo simulation in a background thread."""
        if self._running:
            return

        self._running = True
        self.current_phase = 1
        self._phase_start_time = time.time()
        self.sim.metrics["current_phase"] = 1

        logger.info("=" * 60)
        logger.info("  C-DAWN DEMO STARTED")
        logger.info(f"  Phase 1: {self.PHASE_NAMES[1]}")
        logger.info("=" * 60)

        self._sim_thread = threading.Thread(target=self._run_loop, daemon=True)
        self._sim_thread.start()

    def _run_loop(self):
        """Main simulation loop (runs in background thread)."""
        while self._running:
            try:
                self.sim.tick()

                # Run mesh election check
                if self.sim.tick_count % 25 == 0:
                    heal_result = self.election.check_and_heal(
                        self.sim.drones, self.sim.sim_time
                    )
                    if heal_result:
                        logger.info(f"Self-healing: {heal_result}")

                # Run router update
                if self.sim.tick_count % 50 == 0:
                    routes = self.router.compute_routes(
                        self.sim.drones, self.sim.sim_time
                    )
                    for node_id, next_hops in routes.items():
                        self.mesh.update_routing_table(node_id, next_hops)

                # Generate SITREP periodically in Phase 4
                if (self.sim.metrics.get("current_phase") == 4 and
                        self.sim.tick_count % 500 == 0):
                    self._generate_sitrep()

                # PoI detection on survey
                if self.sim.tick_count % 100 == 0:
                    self._process_poi_detections()

                # Realtime pacing
                time.sleep(self.dt)

            except Exception as e:
                logger.error(f"Simulation error: {e}", exc_info=True)

    def _process_poi_detections(self):
        """Process PoI detections for the RAG pipeline."""
        for drone in self.sim.drones.values():
            if not drone.is_alive or drone.role != DroneRole.SCOUT:
                continue

            # Check if drone is near a PoI
            for poi in self.world.pois:
                if poi.surveyed:
                    continue
                dist = np.linalg.norm(drone.position - poi.position)
                if dist < 10.0:
                    # Run detection
                    detections = self.detector.detect(
                        drone_id=drone.id,
                        timestamp=self.sim.sim_time,
                        gps_coords=drone.position,
                        poi_category=poi.category,
                    )

                    # Embed and store
                    for det in detections:
                        emb_result = self.embedder.embed_detection(det)
                        self.vector_store.add(
                            embedding=emb_result["embedding"],
                            metadata={
                                "class": det.class_name,
                                "confidence": det.confidence,
                                "drone_id": det.drone_id,
                                "timestamp": det.timestamp,
                                "poi_id": poi.id,
                            },
                        )

    def _generate_sitrep(self):
        """Generate a SITREP from accumulated evidence."""
        # Query vector store for recent evidence
        query_emb = self.embedder.embed_text("disaster situation overview")
        evidence = self.vector_store.query(query_emb, top_k=5)

        sitrep = self.sitrep_gen.generate(
            evidence=evidence,
            metrics=self.sim.metrics,
            causal_state=self.scm_diagnostics.get_state(),
        )

        logger.info(f"Generated {sitrep['sitrep_id']} in {sitrep.get('generation_time_ms', 0):.1f}ms")

    def advance_phase(self) -> dict:
        """Manually advance to the next phase."""
        self.current_phase = min(self.current_phase + 1, 5)
        self.sim.metrics["current_phase"] = self.current_phase
        self._phase_start_time = time.time()

        if self.current_phase == 4:
            self._generate_sitrep()

        logger.info(f"Phase advanced to {self.current_phase}: {self.PHASE_NAMES.get(self.current_phase, 'UNKNOWN')}")

        return {
            "phase": self.current_phase,
            "name": self.PHASE_NAMES.get(self.current_phase, "UNKNOWN"),
        }

    def inject_fault(self, fault_type: str, params: dict = None):
        """Manually inject a fault."""
        params = params or {}

        if fault_type == "rf_degrade":
            self.rf.degrade_rf(params.get("noise_db", 15.0))
        elif fault_type == "jamming":
            self.rf.enable_jamming(params.get("power_dbm", -70.0))
        elif fault_type == "kill_node":
            drone_id = params.get("drone_id", "RELAY-1")
            if drone_id in self.sim.drones:
                self.sim.drones[drone_id].kill()
                self.election.check_and_heal(self.sim.drones, self.sim.sim_time)
        elif fault_type == "wind_gust":
            self.wind.add_gust(
                start_time=self.sim.sim_time,
                magnitude=params.get("magnitude", 10.0),
                duration=params.get("duration", 3.0),
            )
        elif fault_type == "restore":
            self.rf.restore_rf()

        logger.info(f"Fault injected: {fault_type} | {params}")

    def reset(self):
        """Reset the demo."""
        self._running = False
        if self._sim_thread:
            self._sim_thread.join(timeout=2)

        self.sim.reset()
        self.current_phase = 0
        self.vector_store.clear()

        logger.info("Demo reset")

    def stop(self):
        """Stop the demo."""
        self._running = False
        if self._sim_thread:
            self._sim_thread.join(timeout=2)

    def get_state(self) -> dict:
        """Get demo state."""
        return {
            "running": self._running,
            "phase": self.current_phase,
            "phase_name": self.PHASE_NAMES.get(self.current_phase, "UNKNOWN"),
            "sim_time": self.sim.sim_time,
            "tick": self.sim.tick_count,
        }
