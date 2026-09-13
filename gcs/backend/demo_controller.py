"""
4-phase demo orchestrator for C-DAWN.

Implements the live demonstration protocol from the proposal:

    Phase 1  Swarm launch & PoI survey
    Phase 2  RF degradation + jamming -> causal diagnostics engage
    Phase 3  KILL NODE -> relay election & self-healing reroute
    Phase 4  SITREP synthesis

This class owns the simulation thread and every subsystem attached to it.
It is deliberately the only place where the stack is assembled, so there is
exactly one answer to "what is actually flying this thing".
"""

from __future__ import annotations

import logging
import threading
import time
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np

from sim.world import World
from sim.terrain import build_terrain
from sim.drone import DroneRole, DroneStatus
from sim.rf_channel import RFChannel
from sim.wind import WindField
from sim.guidance import GuidanceLayer
from sim.runner import SimulationRunner, EventType

from ltc.ltc_controller import load_or_default, make_ltc_controller_hook
from ltc.pid_baseline import CascadedPIDFlightController

from gnn.relay_optimizer import RelayOptimizer, make_topology_optimizer_hook

from scm.diagnostics import OnlineDiagnostics
from scm.interventions import InterventionEngine
from scm.causal_layer import CausalLayer

from mesh.mesh_network import MeshNetwork
from mesh.routing import SCMAwareRouter
from mesh.election import RelayElection
from mesh.electronic_warfare import EWResponse
from sim.interceptor import Interceptor
from sim.injects import MissionInjects, KINDS as INJECT_KINDS

from rag.detector import DisasterDetector
from rag.embedder import CLIPEmbedder
from rag.vector_store import VectorStore
from rag.sitrep_generator import SitrepGenerator

logger = logging.getLogger("cdawn.demo")


class DemoController:
    """Owns the simulation and drives the 4-phase demonstration."""

    PHASE_NAMES = {
        0: "STANDBY",
        1: "LAUNCH & SURVEY",
        2: "CONTESTED RF — CAUSAL DIAGNOSTICS",
        3: "NODE LOSS — SELF-HEALING",
        4: "SITREP SYNTHESIS",
        5: "MISSION COMPLETE",
    }

    # Plain-language explanation of each phase, shown to the operator.
    PHASE_BRIEF = {
        0: "System armed. Awaiting launch authority.",
        1: "Swarm is climbing out and flying the valley to survey tasked "
           "points of interest. Relays are self-positioning to keep the link home.",
        2: "The radio environment is being degraded and then jammed. The causal "
           "engine is working out WHY each link is failing — terrain or hostile "
           "action — rather than just reacting to the symptom.",
        3: "A relay node has been lost. The mesh is electing a replacement and "
           "rerouting traffic around the gap.",
        4: "On-board detections are being fused into a grounded situation report, "
           "with every statement traced to the image and timestamp it came from.",
        5: "Mission complete. All logged metrics are available for review.",
    }

    def __init__(
        self,
        scenario_path: Optional[str] = None,
        phase_duration: float = 45.0,
        dt: float = 0.02,
        terrain_seed: int = 4207,
        realtime_factor: float = 1.0,
        controller: str = "pid",
        mode: str = "interactive",
        theatre: str = "synthetic",
    ):
        # "interactive": nothing is scripted; the operator places aircraft,
        # targets and jammers and decides what fails. "scripted": the 4-phase
        # demonstration runs by itself. An interactive session can start the
        # scripted run at any time with the `run_scenario` command.
        self.mode = mode
        self.phase_duration = phase_duration
        self.dt = dt
        self.realtime_factor = realtime_factor
        self.current_phase = 0
        self._phase_start_time = 0.0
        self._running = False
        self._sim_thread: Optional[threading.Thread] = None
        # Re-entrant: operator commands hold it, and `reset_mission` calls
        # reset(), which takes it again.
        self._lock = threading.RLock()

        # -- world ---------------------------------------------------------
        self.theatre_id = theatre or "synthetic"
        if scenario_path and Path(scenario_path).exists():
            self.world = World.from_scenario(scenario_path)
        elif self.theatre_id != "synthetic":
            self.world = World.from_theatre(self.theatre_id)
        else:
            self.world = World(terrain=build_terrain(seed=terrain_seed))
            self.world.populate_mission(num_pois=6, rubble_count=10, seed=42)

        # -- environment ---------------------------------------------------
        # Mountain valleys channel and accelerate wind; a steady 7 m/s down
        # the corridor with strong turbulence is a realistic working case.
        self.wind = WindField(
            base_wind=np.array([6.5, 1.5, 0.0]),
            turbulence_intensity=1.6,
            terrain=self.world.terrain,
        )
        self.rf = RFChannel(frequency_mhz=self.world.frequency_mhz,
                            fading_model="rician")

        self.sim = SimulationRunner(
            world=self.world, wind=self.wind, rf_channel=self.rf,
            dt=dt, realtime=False,
        )

        self._spawn_swarm()

        # -- guidance ------------------------------------------------------
        self.guidance = GuidanceLayer(self.world)
        self.sim.guidance = self.guidance

        # -- electronic-warfare response ---------------------------------------
        # Detects, geolocates and counters operator-placed jammers (5 Hz).
        self.ew = EWResponse(self.world, self.rf, self.guidance, self.sim.log_event)

        # -- live-mission injects ----------------------------------------------
        # Rehearsal is the trained baseline; the mission phase is where the
        # exercise controller throws rain, terrain weather, GNSS denial,
        # equipment failure and hostile UAVs at the trained swarm.
        self.injects = MissionInjects(self.world, self.wind, self.rf, self.guidance,
                                      self.sim.log_event)
        self.mission_phase = "REHEARSAL"     # REHEARSAL | LIVE | COMPLETE | ABORTED
        self.mission_id = None
        self.mission_started = None
        self.rehearsal_score = {}
        self.requests = []                  # backup requests raised to the ground base
        self._request_counter = 0
        self._auto_requested = set()
        self.sim.mission_state = self._mission_state()

        # -- home-on-jam interceptors (operator-authorised only) ----------------
        self.interceptors: Dict[str, Interceptor] = {}
        self.magazine = self.MAGAZINE
        self._interceptor_counter = 0
        self.sim.interceptor_state = []

        # -- flight control ------------------------------------------------
        #
        # The default is the cascaded PID, not the LTC, and that is a
        # deliberate, measured choice rather than a fallback.
        #
        # `bench/ltc_vs_pid.py` runs both controllers over identical gust
        # profiles. The PID held track closer in 16/16 in-distribution trials
        # (0.18 m vs 0.62 m cross-track RMS) AND in 14/16 trials with gusts
        # well beyond the LTC's training envelope (1.55 m vs 1.99 m), while
        # spending less than half the control effort. The proposal's premise
        # that the liquid time-constant network would out-reject a fixed-gain
        # baseline under shocks did not survive contact with the benchmark.
        #
        # Flying the LTC by default anyway would be exactly the failure mode
        # the proposal sets out to avoid: a narrated claim rather than a
        # logged one. The LTC remains fully implemented, trained and
        # selectable (`--controller ltc`), and the dashboard shows the live
        # comparison either way.
        self.ltc, self.ltc_trained = load_or_default("models/ltc_controller.pt")
        self.controller_choice = controller

        if controller == "ltc":
            if not self.ltc_trained:
                logger.warning("LTC requested but no trained weights found at "
                               "models/ltc_controller.pt — run: python -m ltc.train")
            logger.info("Flying LTC controller (%d params)",
                        self.ltc.count_parameters())
            self.sim.controller = self._make_per_drone_ltc_hook()
            self.active_controller = (
                "LTC" if self.ltc_trained else "LTC (UNTRAINED)")
            self.shadow_kind = "PID"
        else:
            self.sim.controller = self._make_per_drone_pid_hook()
            self.active_controller = "Cascaded PID"
            self.shadow_kind = "LTC"
            logger.info("Flying cascaded PID baseline (benchmark-selected)")

        # Shadow controller: whichever one is NOT flying, one stateful
        # instance per aircraft, evaluated every tick on the identical state,
        # setpoint and gust but never applied. This is what makes the
        # comparison on the dashboard a live measurement rather than a recall
        # of an offline benchmark.
        if self.shadow_kind == "LTC":
            from ltc.ltc_controller import load_or_default as _load_ltc
            shadow = {}
            for d_id in self.sim.drones:
                ctrl, _ = _load_ltc("models/ltc_controller.pt")
                ctrl.reset_hidden(1)
                shadow[d_id] = ctrl
            self.sim.shadow_controller = shadow
        else:
            self.sim.shadow_controller = {
                d_id: CascadedPIDFlightController() for d_id in self.sim.drones
            }
        self.sim.shadow_kind = self.shadow_kind

        # -- relay topology (GNN) -------------------------------------------
        self.relay_optimizer = RelayOptimizer(self.world)
        base_topology_hook = make_topology_optimizer_hook(
            self.relay_optimizer, guidance=self.guidance)

        def topology_hook(drones, world, rf_channel):
            if not self._owns("gnn_topology"):
                return None      # BRAVO is flying the relays right now
            return base_topology_hook(drones, world, rf_channel)

        self.sim.topology_optimizer = topology_hook

        # -- causal layer ----------------------------------------------------
        self.scm_diagnostics = OnlineDiagnostics(loss_threshold=0.20)
        self.intervention_engine = InterventionEngine(delta_z=15.0)
        self.causal_layer = CausalLayer(
            self.world,
            diagnostics=self.scm_diagnostics,
            interventions=self.intervention_engine,
        )
        class _GatedCausal:
            """Runs the causal layer locally only while this node owns it."""

            def __init__(self, inner, owner):
                self._inner = inner
                self._owner = owner

            def update(self, drones, rf_channel, sim_time):
                if not self._owner("scm_causal"):
                    # Handing the subsystem to BRAVO mid-intervention would
                    # otherwise strand a climb this engine commanded and will
                    # now never evaluate or revert.
                    self._inner.interventions.abandon_active(drones, sim_time)
                    return None
                return self._inner.update(drones, rf_channel, sim_time)

            def __getattr__(self, name):
                return getattr(self._inner, name)

        self.sim.causal_layer = _GatedCausal(self.causal_layer, self._owns)

        # -- mesh ------------------------------------------------------------
        self.mesh = MeshNetwork()
        self.router = SCMAwareRouter()
        self.election = RelayElection()
        self.sim.mesh = self.mesh

        # -- RAG -------------------------------------------------------------
        self.detector = DisasterDetector(use_simulation=True)
        self.embedder = CLIPEmbedder(use_simulation=True)
        self.vector_store = VectorStore()
        self.sitrep_gen = SitrepGenerator(use_template=True)

        # Scripted mode: gusts through the whole run and the timed 4-phase
        # event sequence. Interactive mode starts calm and waits for orders.
        if self.mode == "scripted":
            self.wind.inject_random_gusts(start_time=6.0, num_gusts=10, interval=11.0)
            self._schedule_demo_events()

        # Snapshot of the initial layout, so Reset can remove whatever the
        # operator added and restore what was there at the start.
        self._initial_drone_ids = set(self.sim.drones)
        self._initial_roles = {d_id: d.role for d_id, d in self.sim.drones.items()}
        self._initial_pois = [
            (poi.id, poi.position.copy(), poi.category, poi.priority)
            for poi in self.world.pois
        ]
        self._jammer_counter = 0
        self._poi_counter = len(self.world.pois)
        self._telemetry_callback = None
        self._last_sitrep_time = -1e9

        # Cluster delegation. When an edge node (BRAVO) claims a subsystem,
        # this node stops computing it and applies the streamed result
        # instead. `cluster` is injected by run_node.py; when it is None the
        # node simply owns everything, which is the single-laptop case.
        self.cluster = None
        self.remote_gnn_metrics = None
        self.remote_causal_state = None
        self.remote_sitrep = None

    # ----------------------------------------------------------------------

    def _owns(self, subsystem: str) -> bool:
        """True if this node should compute `subsystem` itself."""
        if self.cluster is None:
            return True
        return self.cluster.owns_locally(subsystem)

    def _spawn_swarm(self):
        """
        Place the swarm at the valley mouth.

        Roles: 2 scouts to survey, 2 relays for the mesh backbone, 1 GCS relay
        holding the link to the ground station.
        """
        cy = self.world.terrain.corridor_centerline_y
        base_x = self.world.terrain.config.size_m * 0.075
        base_y = float(cy(base_x))
        ground = self.world.terrain.height_at(base_x, base_y)

        layout = [
            ("SCOUT-1",   base_x + 40, base_y - 30, ground + 70,  DroneRole.SCOUT),
            ("SCOUT-2",   base_x + 40, base_y + 30, ground + 85,  DroneRole.SCOUT),
            ("RELAY-1",   base_x + 20, base_y - 15, ground + 120, DroneRole.RELAY),
            ("RELAY-2",   base_x + 20, base_y + 15, ground + 135, DroneRole.RELAY),
            ("GCS-RELAY", base_x,      base_y,      ground + 100, DroneRole.GCS_RELAY),
        ]

        for drone_id, x, y, z, role in layout:
            self.sim.add_drone(drone_id, [x, y, z], role)

    def _make_per_drone_ltc_hook(self):
        """
        One LTC instance per aircraft.

        The controller is stateful — its liquid hidden state *is* its memory
        of the disturbance it has been fighting. Sharing a single instance
        across five aircraft would blend five unrelated histories into one
        hidden state and destroy exactly the property the architecture is
        chosen for.
        """
        from ltc.ltc_controller import LTCFlightController

        controllers: Dict[str, LTCFlightController] = {}
        for d_id in self.sim.drones:
            ctrl, _ = load_or_default("models/ltc_controller.pt")
            ctrl.reset_hidden(1)
            controllers[d_id] = ctrl

        hooks = {d_id: make_ltc_controller_hook(c) for d_id, c in controllers.items()}
        self.ltc_controllers = controllers

        def hook(drone, wind_vel, sim_time, dt):
            fn = hooks.get(drone.id)
            if fn is None:      # an aircraft the operator added mid-run
                ctrl, _ = load_or_default("models/ltc_controller.pt")
                ctrl.reset_hidden(1)
                controllers[drone.id] = ctrl
                fn = hooks[drone.id] = make_ltc_controller_hook(ctrl)
            fn(drone, wind_vel, sim_time, dt)
            drone.controller_mode = "LTC"

        return hook

    def _make_per_drone_pid_hook(self):
        """
        One cascaded PID per aircraft.

        A single shared instance (as before) meant every aircraft wound up the
        same integrators — five unrelated tracking errors summed into one
        controller's memory.
        """
        from ltc.pid_baseline import make_pid_controller_hook
        self._pid_hooks = {}

        def hook(drone, wind_vel, sim_time, dt):
            fn = self._pid_hooks.get(drone.id)
            if fn is None:
                fn = self._pid_hooks[drone.id] = make_pid_controller_hook(
                    CascadedPIDFlightController())
            fn(drone, wind_vel, sim_time, dt)
            drone.controller_mode = "PID"

        return hook

    def _schedule_demo_events(self, start: float = 0.0):
        """Schedule the scripted 4-phase event sequence, starting at `start`."""
        t = self.phase_duration
        s0 = start
        if s0 > 0.0:
            self.sim.schedule_event(s0, EventType.PHASE_CHANGE, phase=1)

        # Phase 2 — contested RF
        self.sim.schedule_event(s0 + t, EventType.PHASE_CHANGE, phase=2)
        self.sim.schedule_event(s0 + t + 6, EventType.RF_DEGRADE, noise_db=14.0)
        self.sim.schedule_event(s0 + t + 16, EventType.JAMMING_START, power_dbm=-74.0)
        self.sim.schedule_event(s0 + t + 34, EventType.JAMMING_STOP)
        self.sim.schedule_event(s0 + t + 38, EventType.RF_RESTORE)

        # Phase 3 — node loss (the first live relay, whichever the operator left)
        victim = next((d.id for d in self.sim.drones.values()
                       if d.is_alive and d.role == DroneRole.RELAY), "RELAY-1")
        self.sim.schedule_event(s0 + 2 * t, EventType.PHASE_CHANGE, phase=3)
        self.sim.schedule_event(s0 + 2 * t + 6, EventType.KILL_NODE, drone_id=victim)

        # Phase 4 — SITREP
        self.sim.schedule_event(s0 + 3 * t, EventType.PHASE_CHANGE, phase=4)

    # ----------------------------------------------------------------------

    def set_telemetry_callback(self, callback):
        self._telemetry_callback = callback
        self.sim.on_telemetry(callback)

    def start(self):
        if self._running:
            return
        self._running = True
        self.current_phase = 1 if self.mode == "scripted" else 0
        self._phase_start_time = time.time()
        self.sim.metrics["current_phase"] = self.current_phase

        logger.info("=" * 60)
        logger.info("  C-DAWN DEMO STARTED — controller: %s", self.active_controller)
        logger.info("=" * 60)

        self._sim_thread = threading.Thread(target=self._run_loop, daemon=True)
        self._sim_thread.start()

    def _run_loop(self):
        """Simulation thread: fixed-step, paced to wall clock."""
        next_tick = time.perf_counter()
        step = self.dt / max(self.realtime_factor, 1e-3)

        while self._running:
            try:
                with self._lock:
                    self.sim.tick()
                    self._post_tick()
            except Exception as exc:
                logger.error("Simulation error: %s", exc, exc_info=True)

            # Fixed-rate pacing that does not drift, and does not spin if the
            # host stalls: catch up by skipping sleep, never by double-ticking.
            next_tick += step
            sleep_for = next_tick - time.perf_counter()
            if sleep_for > 0:
                time.sleep(sleep_for)
            else:
                next_tick = time.perf_counter()

    def _post_tick(self):
        """Subsystems that run slower than the physics loop."""
        tick = self.sim.tick_count

        # Live-mission injects act on the physics every tick
        for kind, message, extra in self.injects.update(self.dt, self.sim.drones,
                                                        self.sim.sim_time):
            self.sim.log_event(kind, message, extra)
            if extra.get("request") == "INTERCEPTOR":
                self.raise_request("INTERCEPTOR", message, urgency="IMMEDIATE",
                                   params={"enemy_id": extra.get("enemy_id")})
        if tick % 5 == 0:
            self._apply_environment()
        if tick % 25 == 0:
            self._check_backup_needs()
        self.sim.inject_state = self.injects.get_state()
        self.sim.mission_state = self._mission_state()

        if self.interceptors:
            self._update_interceptors()

        if tick % 10 == 0:
            self.ew.update(self.sim.drones, self.sim.sim_time)

        # Mesh self-healing / relay election.
        #
        # Checked every 5 ticks (100 ms). This interval IS the dominant term
        # in self-healing latency — the election itself takes microseconds —
        # so it has to sit comfortably inside the 300 ms target. It was
        # previously every 25 ticks (500 ms), which on its own guaranteed a
        # worst case outside the target regardless of how fast the election
        # ran.
        healed = False
        if tick % 5 == 0:
            heal = self.election.check_and_heal(self.sim.drones, self.sim.sim_time)
            if heal and heal.get("status") == "ok":
                healed = True
                # A scout promoted to relay gives up its survey tasking
                for drone_id, role in heal.get("promoted", []):
                    if role == "RELAY":
                        self.guidance.assignments.pop(drone_id, None)
                        self.guidance.routes.pop(drone_id, None)
                # Reroute immediately rather than waiting for the next
                # periodic refresh; the reroute is part of healing.
                t0 = time.perf_counter()
                routes = self.router.compute_routes(self.sim.drones, self.sim.sim_time)
                for node_id, next_hops in routes.items():
                    self.mesh.update_routing_table(node_id, next_hops)
                reroute_ms = (time.perf_counter() - t0) * 1000.0

                latency = self.election.record_heal_latency(
                    self.sim.drones, self.sim.sim_time, extra_ms=reroute_ms)
                self.sim.metrics["election_time_ms"] = latency

                self.sim.log_event(
                    "ELECTION",
                    f"Self-healed in {latency:.0f} ms end-to-end "
                    f"(detect + elect + reroute) — relays now "
                    f"{', '.join(heal.get('relays') or []) or 'none'}, "
                    f"GCS link via {heal.get('gcs_relay')}"
                    + ("; promoted " + ", ".join(f"{d} to {r}" for d, r in heal["promoted"])
                       if heal.get("promoted") else ""),
                    {"latency_ms": latency},
                )

        # Routing table refresh
        if tick % 50 == 0 and not healed:
            routes = self.router.compute_routes(self.sim.drones, self.sim.sim_time)
            for node_id, next_hops in routes.items():
                self.mesh.update_routing_table(node_id, next_hops)

        # PoI detections + SITREP synthesis — skipped while CHARLIE owns them
        if not self._owns("rag_sitrep"):
            return

        if tick % 50 == 0:
            self._process_poi_detections()

        phase = self.sim.metrics.get("current_phase", 0)
        if phase >= 4 and (self.sim.sim_time - self._last_sitrep_time) > 12.0:
            self._generate_sitrep()
            self._last_sitrep_time = self.sim.sim_time

    # ----------------------------------------------------------------------

    def _process_poi_detections(self):
        """Run detection/embedding on scouts that are over a PoI."""
        for drone in self.sim.drones.values():
            if not drone.is_alive or drone.role != DroneRole.SCOUT:
                continue

            for poi in self.world.pois:
                dist = float(np.linalg.norm(drone.position - poi.position))
                if dist > 45.0:
                    continue
                if poi.id in getattr(self, "_detected_pois", set()):
                    continue

                detections = self.detector.detect(
                    drone_id=drone.id,
                    timestamp=self.sim.sim_time,
                    gps_coords=drone.position,
                    poi_category=poi.category,
                )
                for det in detections:
                    emb = self.embedder.embed_detection(det)
                    self.vector_store.add(
                        embedding=emb["embedding"],
                        metadata={
                            "class": det.class_name,
                            "confidence": det.confidence,
                            "drone_id": det.drone_id,
                            "timestamp": det.timestamp,
                            "poi_id": poi.id,
                            "position": [float(v) for v in drone.position],
                        },
                    )

                if not hasattr(self, "_detected_pois"):
                    self._detected_pois = set()
                self._detected_pois.add(poi.id)

    def _generate_sitrep(self):
        try:
            query = self.embedder.embed_text("disaster situation overview survivors")
            evidence = self.vector_store.query(query, top_k=6)
            sitrep = self.sitrep_gen.generate(
                evidence=evidence,
                metrics=self.sim.metrics,
                causal_state=self.scm_diagnostics.get_state(),
                ew_state=self.rf.ew_state,
            )
            self.sim.log_event(
                "SITREP",
                f"{sitrep['sitrep_id']} generated in "
                f"{sitrep.get('generation_time_ms', 0):.0f} ms from "
                f"{len(evidence)} cited detections",
                {"sitrep_id": sitrep["sitrep_id"]},
            )
        except Exception as exc:
            logger.error("SITREP generation failed: %s", exc, exc_info=True)

    # -- live mission ---------------------------------------------------------

    def _apply_environment(self):
        """Push the weather state into the radio, the airframes and the SCM."""
        self.rf.extra_loss_db = 2.0 * self.injects.antenna_loss_db()   # both ends wet
        power = self.injects.power_factor()
        for drone in self.sim.drones.values():
            drone.power_factor = power
        # The causal engine gets weather as a regressor of its own, so it can
        # separate rain-driven loss from terrain and jamming instead of
        # blaming whichever one moved last.
        self.causal_layer.weather_index = self.injects.weather_index()

    def _mission_state(self) -> dict:
        return {
            "phase": self.mission_phase,
            "mission_id": self.mission_id,
            "started": self.mission_started,
            "elapsed": (self.sim.sim_time - self.mission_started
                        if self.mission_started is not None else 0.0),
            "theatre": self.theatre_id,
            "rehearsal": self.rehearsal_score,
            "requests": list(self.requests),
            "inject_kinds": list(INJECT_KINDS),
        }

    def _readiness(self) -> dict:
        """What the rehearsal proved the swarm can do, carried into the mission."""
        metrics = self.sim.metrics
        return {
            "flight_time_s": round(self.sim.sim_time, 1),
            "backhaul_pdr": round(float(metrics.get("backhaul_pdr", 0.0)), 3),
            "targets_surveyed": int(metrics.get("pois_surveyed", 0) or 0),
            "self_heal_ms": round(float(metrics.get("election_time_ms", 0.0)), 1),
            "causal_tests": int(self.intervention_engine.get_state().get("completed", 0)
                                if hasattr(self.intervention_engine, "get_state") else 0),
            "relay_solves": int(self.relay_optimizer.optimization_count),
            "collisions": int(metrics.get("collisions", 0) or 0),
        }

    def raise_request(self, kind: str, reason: str, urgency: str = "ROUTINE",
                      params: dict = None):
        """
        Ask the ground base for support. Nothing is actioned until a human at
        the base approves it — the field node cannot release a weapon or spend
        an airframe on its own.
        """
        for existing in self.requests:
            if existing["kind"] == kind and existing["status"] == "PENDING":
                return existing
        self._request_counter += 1
        request = {
            "id": f"REQ-{self._request_counter}",
            "kind": kind,
            "reason": reason,
            "urgency": urgency,
            "status": "PENDING",
            "time": self.sim.sim_time,
            "params": params or {},
        }
        self.requests.append(request)
        self.sim.log_event("REQUEST", f"{request['id']} to GROUND BASE — {kind} "
                                      f"[{urgency}]: {reason}", {"request_id": request["id"]})
        return request

    def _check_backup_needs(self):
        """Raise support requests the mission situation justifies."""
        if self.mission_phase != "LIVE":
            return
        alive = [d for d in self.sim.drones.values() if d.is_alive]
        relays = [d for d in alive if d.role in (DroneRole.RELAY, DroneRole.GCS_RELAY)]
        scouts = [d for d in alive if d.role == DroneRole.SCOUT]
        if len(relays) < 2 and "RELAY" not in self._auto_requested:
            self._auto_requested.add("RELAY")
            self.raise_request("REPLACEMENT_UAV",
                               f"Relay strength down to {len(relays)} — backhaul at risk",
                               urgency="PRIORITY", params={"role": "RELAY"})
        if not scouts and "SCOUT" not in self._auto_requested:
            self._auto_requested.add("SCOUT")
            self.raise_request("REPLACEMENT_UAV", "No scouts airborne — survey stalled",
                               urgency="PRIORITY", params={"role": "SCOUT"})
        if (self.rf.ew_state or {}).get("estimates") and self.magazine > 0 \
                and "EW" not in self._auto_requested:
            self._auto_requested.add("EW")
            estimate = self.rf.ew_state["estimates"][0]
            self.raise_request("INTERCEPTOR",
                               f"Hostile emitter {estimate['id']} located at "
                               f"({estimate['x']:.0f}, {estimate['y']:.0f}) ± "
                               f"{estimate['radius_m']:.0f} m",
                               urgency="PRIORITY", params={"emitter_id": estimate["id"]})

    def _cmd_launch_mission(self):
        """Commit the rehearsed swarm to the live mission."""
        if self.mission_phase == "LIVE":
            raise ValueError("mission is already running")
        self.rehearsal_score = self._readiness()
        self.mission_phase = "LIVE"
        self.mission_started = self.sim.sim_time
        self.mission_id = f"OP-{int(time.time()) % 100000:05d}"
        self._auto_requested.clear()
        self.sim.log_event(
            "MISSION",
            f"{self.mission_id} — MISSION COMMENCED over {self.theatre_id.upper()}. "
            f"Rehearsal complete: backhaul {self.rehearsal_score['backhaul_pdr'] * 100:.0f}%, "
            f"{self.rehearsal_score['targets_surveyed']} targets surveyed, "
            f"{self.rehearsal_score['relay_solves']} relay solves, self-heal "
            f"{self.rehearsal_score['self_heal_ms']:.0f} ms. Swarm is committed.",
            {"mission_id": self.mission_id})
        self.sim.mission_state = self._mission_state()
        return self._mission_state()

    def _cmd_end_mission(self, outcome: str = "COMPLETE"):
        self.mission_phase = "COMPLETE" if outcome.upper() != "ABORTED" else "ABORTED"
        self.sim.log_event("MISSION", f"{self.mission_id or 'Mission'} {self.mission_phase}.",
                           {"mission_id": self.mission_id})
        return self._mission_state()

    def _cmd_inject(self, kind: str, **params):
        """Exercise-controller inject, applied to the live physics."""
        if kind not in INJECT_KINDS:
            # Keep the older fault injections working
            return self.inject_fault(kind, params)
        result = self.injects.inject(kind, params, self.sim.drones, self.sim.sim_time)
        self.sim.inject_state = self.injects.get_state()
        return result

    def _cmd_clear_injects(self):
        self.injects.reset()
        self.rf.extra_loss_db = 0.0
        for drone in self.sim.drones.values():
            drone.power_factor = 1.0
            drone.health = 1.0
            drone.nav_error = np.zeros(3)
        self.sim.log_event("WEATHER", "All injects cleared — conditions back to nominal", {})
        self.sim.inject_state = self.injects.get_state()
        return {}

    def _cmd_approve_request(self, request_id: str):
        """Ground base authorises a support request and it is actioned now."""
        request = next((r for r in self.requests if r["id"] == request_id), None)
        if request is None:
            raise KeyError(f"no such request: {request_id}")
        if request["status"] != "PENDING":
            raise ValueError(f"{request_id} is already {request['status']}")

        if request["kind"] == "INTERCEPTOR":
            result = self._cmd_launch_interceptor(
                emitter_id=request["params"].get("emitter_id"),
                enemy_id=request["params"].get("enemy_id"))
        elif request["kind"] == "REPLACEMENT_UAV":
            result = self._cmd_add_drone(role=request["params"].get("role", "RELAY"))
        else:
            result = {}
        request["status"] = "APPROVED"
        request["actioned"] = result
        self.sim.log_event("REQUEST", f"{request_id} APPROVED by ground base — "
                                      f"{request['kind']} released", {"request_id": request_id})
        return {"request": request, "result": result}

    def _cmd_deny_request(self, request_id: str, reason: str = ""):
        request = next((r for r in self.requests if r["id"] == request_id), None)
        if request is None:
            raise KeyError(f"no such request: {request_id}")
        request["status"] = "DENIED"
        request["note"] = reason
        self.sim.log_event("REQUEST", f"{request_id} DENIED by ground base"
                                      + (f" — {reason}" if reason else ""),
                           {"request_id": request_id})
        return {"request": request}

    # -- operator commands --------------------------------------------------

    def advance_phase(self) -> dict:
        with self._lock:
            self.current_phase = min(self.current_phase + 1, 5)
            self.sim.metrics["current_phase"] = self.current_phase
            self._phase_start_time = time.time()

            if self.current_phase == 2:
                self.rf.degrade_rf(14.0)
            elif self.current_phase == 3:
                if "RELAY-1" in self.sim.drones:
                    self.sim.drones["RELAY-1"].kill(self.sim.sim_time)
            elif self.current_phase == 4:
                self._generate_sitrep()

            self.sim.log_event(
                "PHASE",
                f"Phase {self.current_phase}: "
                f"{self.PHASE_NAMES.get(self.current_phase, '')}",
                {"phase": self.current_phase},
            )

        return {
            "phase": self.current_phase,
            "name": self.PHASE_NAMES.get(self.current_phase, "UNKNOWN"),
        }

    def inject_fault(self, fault_type: str, params: dict = None) -> dict:
        params = params or {}
        with self._lock:
            if fault_type == "rf_degrade":
                self.rf.degrade_rf(params.get("noise_db", 14.0))
                msg = f"RF degraded by {params.get('noise_db', 14.0):.0f} dB"
            elif fault_type == "jamming":
                self.rf.enable_jamming(params.get("power_dbm", -74.0))
                msg = "Hostile jamming enabled"
            elif fault_type == "kill_node":
                drone_id = params.get("drone_id", "RELAY-1")
                if drone_id in self.sim.drones:
                    self.sim.drones[drone_id].kill(self.sim.sim_time)
                msg = f"Node {drone_id} killed"
            elif fault_type == "wind_gust":
                mag = params.get("magnitude", 13.0)
                self.wind.add_gust(start_time=self.sim.sim_time,
                                   magnitude=mag,
                                   duration=params.get("duration", 3.0))
                msg = f"Wind gust {mag:.0f} m/s injected"
            elif fault_type == "restore":
                self.rf.restore_rf()
                self.rf.disable_jamming()
                msg = "RF environment restored"
            else:
                return {"error": f"unknown fault type: {fault_type}"}

            self.sim.log_event("FAULT", msg, params)

        logger.info("Fault injected: %s | %s", fault_type, params)
        return {"status": "injected", "fault_type": fault_type, "message": msg}

    # -- operator command API --------------------------------------------------
    #
    # Everything the operator can do from the dashboard arrives here as
    # (name, params). Each command is applied to the live simulation under the
    # lock, and logged to the mission log so the audience can see that the
    # action came from a person, not a script.

    MAX_DRONES = 12
    MAGAZINE = 2          # home-on-jam interceptors per mission
    ROLE_AGL = {"SCOUT": 60.0, "RELAY": 140.0}

    def command(self, name: str, params: dict = None) -> dict:
        params = params or {}
        handler = getattr(self, f"_cmd_{name}", None)
        if handler is None:
            return {"ok": False, "error": f"unknown command: {name}"}
        try:
            with self._lock:
                result = handler(**params) or {}
            return {"ok": True, **result}
        except (KeyError, ValueError, TypeError) as exc:
            return {"ok": False, "error": str(exc)}

    def _drone(self, drone_id: str):
        if drone_id not in self.sim.drones:
            raise KeyError(f"no such aircraft: {drone_id}")
        return self.sim.drones[drone_id]

    def _log(self, message: str, **extra):
        self.sim.log_event("OPERATOR", message, extra)

    def _cmd_add_drone(self, role: str = "SCOUT", x: float = None, y: float = None,
                       agl: float = None):
        role = role.upper()
        if role not in ("SCOUT", "RELAY"):
            raise ValueError("role must be SCOUT or RELAY")
        if len(self.sim.drones) >= self.MAX_DRONES:
            raise ValueError(f"swarm is limited to {self.MAX_DRONES} aircraft")

        n = 1
        while f"{role}-{n}" in self.sim.drones:
            n += 1
        drone_id = f"{role}-{n}"

        size = self.world.terrain.config.size_m
        x = float(np.clip(x, 30.0, size - 30.0))
        y = float(np.clip(y, 30.0, size - 30.0))
        z = self.world.terrain.height_at(x, y) + (agl or self.ROLE_AGL[role])

        drone = self.sim.add_drone(drone_id, [x, y, z], DroneRole[role])

        # Shadow controller for the new aircraft, so the live controller
        # comparison covers it too
        if self.sim.shadow_controller is not None:
            if self.shadow_kind == "LTC":
                ctrl, _ = load_or_default("models/ltc_controller.pt")
                ctrl.reset_hidden(1)
                self.sim.shadow_controller[drone_id] = ctrl
            else:
                self.sim.shadow_controller[drone_id] = CascadedPIDFlightController()

        self._log(f"Operator deployed {drone_id} at ({x:.0f}, {y:.0f})",
                  drone_id=drone_id)
        return {"drone_id": drone_id, "position": drone.position.tolist()}

    def _cmd_kill(self, drone_id: str):
        drone = self._drone(drone_id)
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is already down")
        drone.kill(self.sim.sim_time)
        self.guidance.manual_targets.pop(drone_id, None)
        self.sim.log_event("KILL_NODE", f"NODE LOSS: operator took down {drone_id}",
                           {"drone_id": drone_id})
        return {"drone_id": drone_id}

    def _cmd_revive(self, drone_id: str):
        from sim.drone import DroneStatus
        drone = self._drone(drone_id)
        if drone.is_alive:
            raise ValueError(f"{drone_id} is already flying")
        ground = self.world.terrain.height_at(drone.position[0], drone.position[1])
        drone.position = np.array([drone.position[0], drone.position[1],
                                   ground + self.ROLE_AGL.get(drone.role.name, 100.0)])
        drone.velocity = np.zeros(3)
        drone.revive()
        drone.killed_at = None
        drone.status = DroneStatus.ACTIVE
        # A revived node is a new failure candidate for the election
        if hasattr(self.election, "_handled_failures"):
            self.election._handled_failures.discard(drone_id)
        self._log(f"Operator relaunched {drone_id}", drone_id=drone_id)
        return {"drone_id": drone_id}

    def _cmd_goto(self, drone_id: str, x: float, y: float):
        drone = self._drone(drone_id)
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is down")
        self.guidance.command_goto(drone, (x, y), sim_time=self.sim.sim_time)
        return {"drone_id": drone_id}

    def _cmd_release(self, drone_id: str):
        drone = self._drone(drone_id)
        self.guidance.release(drone, sim_time=self.sim.sim_time)
        return {"drone_id": drone_id}

    def _cmd_set_role(self, drone_id: str, role: str):
        drone = self._drone(drone_id)
        role = role.upper()
        if role not in ("SCOUT", "RELAY"):
            raise ValueError("role must be SCOUT or RELAY")
        drone.role = DroneRole[role]
        self.guidance.assignments.pop(drone_id, None)
        self.guidance.routes.pop(drone_id, None)
        self.guidance.relay_stations.pop(drone_id, None)
        drone.assigned_poi = None
        self._log(f"Operator reassigned {drone_id} as {role}", drone_id=drone_id)
        return {"drone_id": drone_id, "role": role}

    def _cmd_add_poi(self, x: float, y: float, category: str = "survivor",
                     priority: int = 1):
        self._poi_counter += 1
        poi_id = f"POI-{self._poi_counter:03d}"
        z = self.world.terrain.height_at(x, y) + 1.5
        self.world.add_poi(poi_id, [x, y, z], category=category, priority=int(priority))
        self._log(f"Operator marked {poi_id} ({category}) for survey", poi_id=poi_id)
        return {"poi_id": poi_id}

    def _cmd_remove_poi(self, poi_id: str):
        self.world.pois = [p for p in self.world.pois if p.id != poi_id]
        for drone_id, assigned in list(self.guidance.assignments.items()):
            if assigned == poi_id:
                self.guidance.assignments.pop(drone_id, None)
                self.guidance.routes.pop(drone_id, None)
                self.sim.drones[drone_id].assigned_poi = None
        self._log(f"Operator cancelled {poi_id}", poi_id=poi_id)
        return {"poi_id": poi_id}

    def _cmd_add_jammer(self, x: float, y: float, power_dbm: float = 5.0,
                        height_agl: float = 15.0):
        self._jammer_counter += 1
        jammer_id = f"JAM-{self._jammer_counter}"
        z = self.world.terrain.height_at(x, y) + height_agl
        self.rf.add_jammer(jammer_id, [x, y, z], power_dbm)
        self.sim.log_event("JAMMING_START",
                           f"HOSTILE JAMMER {jammer_id} emplaced at ({x:.0f}, {y:.0f}), "
                           f"{power_dbm:.0f} dBm", {"jammer_id": jammer_id})
        return {"jammer_id": jammer_id}

    # -- interceptors -----------------------------------------------------------

    def _cmd_launch_interceptor(self, emitter_id: str = None, enemy_id: str = None):
        """
        Operator-authorised launch of a home-on-jam interceptor against the
        jammer the swarm has geolocated. Refused without a fix: the weapon is
        only ever sent at what the swarm actually measured.
        """
        # Air-to-air tasking against a detected hostile UAV
        if enemy_id:
            enemy = self.injects.enemies.get(enemy_id)
            if enemy is None or enemy.destroyed:
                raise ValueError(f"no such hostile UAV: {enemy_id}")
            if not enemy.detected:
                raise ValueError("hostile UAV is not being tracked yet")
            estimate = {"x": float(enemy.position[0]), "y": float(enemy.position[1]),
                        "z": float(enemy.position[2]), "radius_m": 60.0,
                        "air_target": enemy_id}
            return self._release_interceptor(estimate, f"hostile UAV {enemy_id}")

        located = (self.rf.ew_state or {}).get("estimates") or []
        estimate = next((e for e in located if e["id"] == emitter_id), None) if emitter_id \
            else (located[0] if located else None)
        if not estimate:
            raise ValueError("no jammer fix yet — the swarm must locate the emitter first")
        return self._release_interceptor(
            estimate, f"the estimated jammer position ({estimate['x']:.0f}, "
                      f"{estimate['y']:.0f}) ± {estimate['radius_m']:.0f} m")

    def _release_interceptor(self, estimate: dict, description: str):
        if self.magazine <= 0:
            raise ValueError("no interceptors remaining")
        self.magazine -= 1
        self._interceptor_counter += 1
        interceptor_id = f"INT-{self._interceptor_counter}"

        # Launched from the ground station
        gcs = next((d for d in self.sim.drones.values()
                    if d.role == DroneRole.GCS_RELAY), None)
        if gcs is not None:
            x, y = float(gcs.position[0]), float(gcs.position[1])
        else:
            x = self.world.terrain.config.size_m * 0.075
            y = float(self.world.terrain.corridor_centerline_y(x))
        launch = [x, y, self.world.terrain.height_at(x, y) + 12.0]
        self.interceptors[interceptor_id] = Interceptor(
            interceptor_id, launch, estimate, self.sim.sim_time)
        self.sim.log_event(
            "INTERCEPTOR",
            f"{interceptor_id} launched by operator authority against {description}. "
            f"{self.magazine} remaining.",
            {"interceptor_id": interceptor_id, "drone_id": interceptor_id})
        self._publish_interceptors()
        return {"interceptor_id": interceptor_id, "remaining": self.magazine}

    def _cmd_abort_interceptor(self, interceptor_id: str):
        unit = self.interceptors.get(interceptor_id)
        if unit is None or unit.done:
            raise KeyError(f"no active interceptor {interceptor_id}")
        unit._finish("ABORTED", None)
        unit._finished_at = self.sim.sim_time
        self.sim.log_event("INTERCEPTOR", f"{interceptor_id} aborted by operator — self-neutralised",
                           {"interceptor_id": interceptor_id})
        self._publish_interceptors()
        return {"interceptor_id": interceptor_id}

    def _update_interceptors(self):
        wind_xy = np.asarray(self.wind.base_wind, dtype=float)[:2]

        def route(start, target):
            return self.guidance._build_direct_route(
                np.asarray(start), np.asarray(target), spacing=250.0, clearance=90.0).waypoints

        for unit in list(self.interceptors.values()):
            if unit.done:
                # Keep the finished unit briefly so the dashboard can show the outcome
                if self.sim.sim_time - getattr(unit, "_finished_at", self.sim.sim_time) > 3.0:
                    self.interceptors.pop(unit.id, None)
                continue
            air_targets = {e.id: e.position for e in self.injects.enemies.values()
                           if not e.destroyed}
            for kind, message, extra in unit.update(self.dt, self.world, self.rf, wind_xy,
                                                    self.sim.sim_time, route, air_targets):
                if kind == "ENEMY_DESTROYED":
                    enemy = self.injects.enemies.get(extra.get("enemy_id"))
                    if enemy is not None:
                        enemy.destroyed = True
                self.sim.log_event(kind, message, extra)
            if unit.done:
                unit._finished_at = self.sim.sim_time
        self._publish_interceptors()

    def _publish_interceptors(self):
        self.sim.interceptor_state = [u.get_state() for u in self.interceptors.values()]

    def _cmd_set_jammer_power(self, jammer_id: str, power_dbm: float):
        if jammer_id not in self.rf.jammers:
            raise KeyError(f"no such jammer: {jammer_id}")
        self.rf.jammers[jammer_id]["power_dbm"] = float(power_dbm)
        return {"jammer_id": jammer_id}

    def _cmd_remove_jammer(self, jammer_id: str):
        self.rf.remove_jammer(jammer_id)
        self.sim.log_event("JAMMING_STOP", f"Jammer {jammer_id} neutralised",
                           {"jammer_id": jammer_id})
        return {"jammer_id": jammer_id}

    def _cmd_clear_jammers(self):
        self.rf.jammers.clear()
        self.rf.disable_jamming()
        self.sim.log_event("JAMMING_STOP", "All jammers neutralised", {})
        return {}

    def _cmd_set_wind(self, speed: float, heading_deg: float = 0.0):
        heading = np.radians(float(heading_deg))
        self.wind.set_base_wind(np.array([np.cos(heading), np.sin(heading), 0.0])
                                * float(speed))
        self._log(f"Operator set wind to {float(speed):.0f} m/s from "
                  f"{(float(heading_deg) + 180) % 360:.0f}°")
        return {}

    def _cmd_gust(self, magnitude: float = 12.0, heading_deg: float = None):
        direction = None
        if heading_deg is not None:
            h = np.radians(float(heading_deg))
            direction = np.array([np.cos(h), np.sin(h), 0.0])
        self.wind.add_gust(start_time=self.sim.sim_time, magnitude=float(magnitude),
                           duration=3.0, direction=direction)
        self.sim.log_event("WIND_GUST", f"Operator triggered a {float(magnitude):.0f} m/s gust", {})
        return {}

    def _cmd_sitrep(self):
        self._generate_sitrep()
        return {}

    def _cmd_reset_mission(self):
        self.reset()
        return {}

    def _cmd_advance_phase(self):
        return self.advance_phase()

    def _cmd_run_scenario(self):
        """Start the scripted 4-phase demonstration from the current moment."""
        self.mode = "scripted"
        # Drop anything left over from a previous scripted run
        self.sim.events = [e for e in self.sim.events if e.executed]
        self._schedule_demo_events(start=self.sim.sim_time + 0.01)
        self._log("Operator started the scripted 4-phase scenario")
        return {}

    def _cmd_stop_scenario(self):
        self.mode = "interactive"
        self.sim.events = [e for e in self.sim.events if e.executed]
        self.sim.metrics["current_phase"] = 0
        self._log("Scripted scenario cancelled — operator in control")
        return {}

    def reset(self):
        with self._lock:
            self.sim.reset()
            self.guidance.reset()
            self.ew.reset()
            self.injects.reset()
            self.rf.extra_loss_db = 0.0
            self.requests = []
            self._auto_requested = set()
            self.mission_phase = 'REHEARSAL'
            self.mission_id = None
            self.mission_started = None
            self.interceptors.clear()
            self.magazine = self.MAGAZINE
            self.sim.interceptor_state = []
            self.causal_layer.reset()
            self.vector_store.clear()
            self._detected_pois = set()
            self._last_sitrep_time = -1e9
            self.current_phase = 1
            self.sim.metrics["current_phase"] = 1

            for ctrl in getattr(self, "ltc_controllers", {}).values():
                ctrl.reset_hidden(1)

            # The shadow controller is whichever one is not flying, so it may
            # be either a PID (stateful integrators) or an LTC (stateful
            # liquid hidden state). They clear differently, and assuming PID
            # here raised AttributeError the moment the default controller
            # changed.
            for shadow in (self.sim.shadow_controller or {}).values():
                if hasattr(shadow, "reset"):
                    shadow.reset()
                elif hasattr(shadow, "reset_hidden"):
                    shadow.reset_hidden(1)

            # Remove everything the operator added; restore the original layout
            for drone_id in list(self.sim.drones):
                if drone_id not in self._initial_drone_ids:
                    del self.sim.drones[drone_id]
                    (self.sim.shadow_controller or {}).pop(drone_id, None)
            for drone in self.sim.drones.values():
                drone.manual_target = None
                drone.ew_hold = False
            self._initial_roles = getattr(self, "_initial_roles", None)
            if self._initial_roles:
                for drone_id, role in self._initial_roles.items():
                    self.sim.drones[drone_id].role = role

            from sim.world import PointOfInterest
            self.world.pois = [
                PointOfInterest(id=pid, position=pos.copy(), category=cat, priority=pri)
                for pid, pos, cat, pri in self._initial_pois
            ]
            self._poi_counter = len(self.world.pois)
            self.rf.jammers.clear()
            self.rf.node_noise = {}
            self.wind.gusts.clear()
            if hasattr(self, "_pid_hooks"):
                self._pid_hooks.clear()      # fresh integrators
            if hasattr(self.election, "_handled_failures"):
                self.election._handled_failures.clear()

            self.sim.events = []
            if self.mode == "scripted":
                self.wind.inject_random_gusts(start_time=6.0, num_gusts=10, interval=11.0)
                self._schedule_demo_events()
            else:
                self.current_phase = 0
                self.sim.metrics["current_phase"] = 0

        logger.info("Demo reset")
        return {"status": "reset"}

    def stop(self):
        self._running = False
        if self._sim_thread:
            self._sim_thread.join(timeout=2.0)

    # -- state --------------------------------------------------------------

    OPERATOR_BRIEF = (
        "You are in command. Deploy scouts and relays, mark survey targets, "
        "emplace jammers and take aircraft down — the swarm re-plans around "
        "every change you make. Nothing here is scripted."
    )

    def get_state(self) -> dict:
        phase = self.sim.metrics.get("current_phase", 0)
        operator = self.mode == "interactive" and phase == 0
        return {
            "running": self._running,
            "mode": self.mode,
            "phase": phase,
            "phase_name": ("OPERATOR CONTROL" if operator
                           else self.PHASE_NAMES.get(phase, "UNKNOWN")),
            "phase_brief": (self.OPERATOR_BRIEF if operator
                            else self.PHASE_BRIEF.get(phase, "")),
            "phase_duration": self.phase_duration,
            "sim_time": self.sim.sim_time,
            "tick": self.sim.tick_count,
            "controller": self.active_controller,
            "shadow": self.shadow_kind,
            "theatre": self.world.terrain.theatre_info(),
            "terrain_checksum": self.world.terrain.checksum(),
            "ltc_trained": self.ltc_trained,
            "gnn_trained": self.relay_optimizer.model_trained,
            "mission": self._mission_state(),
            "magazine": self.magazine,
            "magazine_size": self.MAGAZINE,
            "delegated": {
                "gnn_topology": not self._owns("gnn_topology"),
                "scm_causal": not self._owns("scm_causal"),
                "rag_sitrep": not self._owns("rag_sitrep"),
            },
        }
