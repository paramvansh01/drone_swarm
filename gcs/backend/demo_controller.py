"""
Mission controller for the UAV-X swarm.

Owns the simulation thread and every subsystem attached to it. It is
deliberately the only place where the stack is assembled, so there is exactly
one answer to "what is actually flying this thing" — for the live dashboard,
for the three-laptop cluster, and for headless benchmark runs alike.

Mission lifecycle

    PLANNING   the fleet sits on its pads at the GCS; the plan (targets,
               geofence, relay requirement) is visible; nothing flies
    LIVE       launched: the role manager puts aircraft up in sequence, the
               mission clock runs, the scenario's hidden disturbances fire
    COMPLETE   the clock ran out or the operator ended it: everyone recalled
    ABORTED    the operator aborted: everyone recalled

The swarm's autonomy is layered, fastest first:

    deconfliction   every tick     separation between aircraft
    guidance        every tick     tasking, routes, RTH, landing, geofence
    awareness       100 ms         beliefs from measurements (heartbeats, acks,
                                   noise, path loss, wind, cloud, GNSS check)
    election        100 ms         a relay silent for 200 ms -> promote a scout
    traffic         100 ms         packets over the mesh; connectivity
    causal layer    100 ms         why is this link failing, do(Δz) tests
    GNN placement   500 ms         where the relays should be
    role manager    1 s            how many relays, who flies them, handovers,
                                   launches from the pads
"""

from __future__ import annotations

import json
import logging
import threading
import time
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np

from sim.world import World
from sim.terrain import build_terrain
from sim.drone import DroneRole, DroneStatus
from sim.energy import EnergyModel
from sim.rf_channel import RFChannel
from sim.wind import WindField
from sim.guidance import GuidanceLayer, MissionPhase
from sim.runner import SimulationRunner, EventType
from sim.injects import MissionInjects, KINDS as INJECT_KINDS

from ltc.ltc_controller import load_or_default, make_ltc_controller_hook
from ltc.pid_baseline import CascadedPIDFlightController

from gnn.relay_optimizer import RelayOptimizer, make_topology_optimizer_hook

from scm.diagnostics import OnlineDiagnostics
from scm.interventions import InterventionEngine
from scm.causal_layer import CausalLayer

from mesh.mesh_network import MeshNetwork
from mesh.routing import SCMAwareRouter
from mesh.election import RelayElection
from mesh.awareness import SwarmAwareness
from mesh.interference import InterferenceResponse
from mesh.roles import RoleManager
from mesh.traffic import TrafficSimulator

from mission.disturbances import Disturbances, KINDS as DISTURBANCE_KINDS
from mission.metrics import MissionMetrics
from mission.scenario import Scenario, ScenarioDirector, build_world, load_scenario

from rag.detector import DisasterDetector
from rag.embedder import CLIPEmbedder
from rag.vector_store import VectorStore
from rag.sitrep_generator import SitrepGenerator

logger = logging.getLogger("uavx.mission")


def _is_uavx_scenario(path: str) -> bool:
    try:
        data = json.loads(Path(path).read_text())
    except Exception:
        return False
    return any(k in data for k in ("disturbances", "tasks", "fleet", "time_limit_s"))


class DemoController:
    """Owns the simulation and runs the mission."""

    PHASE_NAMES = {
        0: "PLANNING",
        1: "LAUNCH & SURVEY",
        2: "COMMS DEGRADATION",
        3: "UAV FAILURE",
        4: "EMERGENCY TASK",
        5: "RECHARGE & HANDOVER",
        6: "MISSION COMPLETE",
    }

    # Plain-language explanation of each phase, shown to the operator.
    PHASE_BRIEF = {
        0: "Fleet on its pads at the GCS. Targets, geofence and the relay "
           "requirement are planned; launch when ready.",
        1: "Aircraft launch in sequence. Scouts fly the valley to survey the "
           "disaster sites; relays take up stations so every UAV keeps a "
           "multi-hop path back to the GCS.",
        2: "Radio conditions are degrading — an interference source and packet "
           "loss. The causal engine works out WHY each link is failing, scouts "
           "withdraw to regain the link, and survey data waits in custody "
           "until a route is back.",
        3: "A relay UAV has failed. Nobody hears its heartbeat, so within about "
           "300 ms a scout is promoted into its slot, the mesh reroutes, and the role manager then settles the "
           "chain, launching a charged aircraft from the GCS if one is waiting.",
        4: "A new high-priority region has been reported. The swarm re-plans: "
           "the best-placed scout is pre-empted from lower-priority work, and "
           "the relay chain extends to cover it.",
        5: "Aircraft are cycling through the GCS to recharge. A relay calls up "
           "its replacement before it leaves, so the chain never opens.",
        6: "Mission complete. All logged metrics are available for review.",
    }

    MAX_DRONES = 12
    DEFAULT_FLEET = 5
    ROLE_AGL = {"SCOUT": 60.0, "RELAY": 140.0}

    def __init__(
        self,
        scenario_path: Optional[str] = None,
        phase_duration: float = 60.0,
        dt: float = 0.02,
        terrain_seed: int = 4207,
        realtime_factor: float = 1.0,
        controller: str = "pid",
        mode: str = "interactive",
        theatre: str = "synthetic",
        fleet_size: Optional[int] = None,
        shadow: bool = True,
        autostart: bool = False,
        scenario: Optional[Scenario] = None,
    ):
        # "interactive": the operator launches the mission and throws
        # disturbances at it. "scripted": the built-in demonstration timeline
        # (or the scenario's own) runs by itself from launch.
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
        self.scenario: Optional[Scenario] = scenario
        if self.scenario is None and scenario_path and Path(scenario_path).exists() \
                and _is_uavx_scenario(scenario_path):
            self.scenario = load_scenario(scenario_path)

        if self.scenario is not None:
            self.world = build_world(self.scenario)
            self.theatre_id = self.scenario.theatre or "synthetic"
        elif scenario_path and Path(scenario_path).exists():
            self.world = World.from_scenario(scenario_path)
            self.theatre_id = "synthetic"
        else:
            self.theatre_id = theatre or "synthetic"
            if self.theatre_id != "synthetic":
                self.world = World.from_theatre(self.theatre_id, num_pois=8)
            else:
                self.world = World(terrain=build_terrain(seed=terrain_seed))
                self.world.populate_mission(num_pois=8, rubble_count=10, seed=42)
            self.world.time_limit_s = 900.0

        env = (self.scenario.environment if self.scenario else {}) or {}
        heading = np.radians(float(env.get("wind_heading_deg", 13.0)))
        speed = float(env.get("wind_mps", 6.7))

        # -- environment ---------------------------------------------------
        # Mountain valleys channel and accelerate wind; a steady 7 m/s down
        # the corridor with strong turbulence is a realistic working case.
        self.wind = WindField(
            base_wind=np.array([np.cos(heading), np.sin(heading), 0.0]) * speed,
            turbulence_intensity=float(env.get("turbulence", 1.6)),
            terrain=self.world.terrain,
        )
        self.rf = RFChannel(frequency_mhz=self.world.frequency_mhz,
                            fading_model="rician")

        self.sim = SimulationRunner(
            world=self.world, wind=self.wind, rf_channel=self.rf,
            dt=dt, realtime=False,
        )

        # -- what the swarm knows ----------------------------------------------
        # Everything the autonomy decides from comes through here, built from
        # measurements only. It is never told about a disturbance.
        self.awareness = SwarmAwareness(self.world, self.rf, log=self.sim.log_event)
        self._read_anemometer()

        # -- energy, guidance ---------------------------------------------
        # Return times use the swarm's wind ESTIMATE, not the true field
        self.energy = EnergyModel(self.world, wind=self.awareness)
        if self.scenario is not None:
            self.energy.config.recharge_s = self.scenario.recharge_s
        self.guidance = GuidanceLayer(self.world, energy=self.energy)
        self.guidance.mission_started = None          # PLANNING: nothing is tasked
        self.guidance.awareness = self.awareness
        self.sim.guidance = self.guidance

        self.fleet_size = int(fleet_size or (self.scenario.fleet_size if self.scenario
                                             else self.DEFAULT_FLEET))
        self._spawn_fleet(self.fleet_size)

        # -- interference response --------------------------------------------
        # Detects, localises and works around RF interference (5 Hz).
        self.ew = InterferenceResponse(self.world, self.rf, self.guidance, self.sim.log_event)

        # -- environmental injects ----------------------------------------------
        self.injects = MissionInjects(self.world, self.wind, self.rf, self.guidance,
                                      self.sim.log_event)
        # The swarm's own GNSS check switches it to terrain-relative navigation
        self.awareness.on_nav_fallback = lambda: setattr(self.injects, "nav_fallback", True)
        self.mission_phase = "PLANNING"      # PLANNING | LIVE | COMPLETE | ABORTED
        self.mission_id = None
        self.mission_started = None
        self.final_summary = None
        self.sim.mission_state = {}

        # -- flight control ------------------------------------------------
        #
        # The default is the cascaded PID, not the LTC, and that is a
        # deliberate, measured choice rather than a fallback.
        #
        # `bench/ltc_vs_pid.py` runs both controllers over identical gust
        # profiles. The PID held track closer in 16/16 in-distribution trials
        # (0.18 m vs 0.62 m cross-track RMS) AND in 14/16 trials with gusts
        # well beyond the LTC's training envelope (1.55 m vs 1.99 m), while
        # spending less than half the control effort. The LTC remains fully
        # implemented, trained and selectable (`--controller ltc`), and the
        # dashboard shows the live comparison either way.
        self.ltc, self.ltc_trained = load_or_default("models/ltc_controller.pt")
        self.controller_choice = controller

        if controller == "ltc":
            if not self.ltc_trained:
                logger.warning("LTC requested but no trained weights found at "
                               "models/ltc_controller.pt — run: python -m ltc.train")
            self.sim.controller = self._make_per_drone_ltc_hook()
            self.active_controller = (
                "LTC" if self.ltc_trained else "LTC (UNTRAINED)")
            self.shadow_kind = "PID"
        else:
            self.sim.controller = self._make_per_drone_pid_hook()
            self.active_controller = "Cascaded PID"
            self.shadow_kind = "LTC"

        # Shadow controller: whichever one is NOT flying, one stateful
        # instance per aircraft, evaluated every tick on the identical state,
        # setpoint and gust but never applied. Display only, so headless
        # benchmark runs switch it off.
        self.shadow_enabled = shadow
        if not shadow:
            self.sim.shadow_controller = None
        elif self.shadow_kind == "LTC":
            shadow_map = {}
            for d_id in self.sim.drones:
                ctrl, _ = load_or_default("models/ltc_controller.pt")
                ctrl.reset_hidden(1)
                shadow_map[d_id] = ctrl
            self.sim.shadow_controller = shadow_map
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
                return None      # BRAVO is placing the relays right now
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

        # -- mesh: routing, failover, roles, traffic ----------------------------
        self.mesh = MeshNetwork()
        self.router = SCMAwareRouter(route_update_interval=0.5)
        self.election = RelayElection()
        self.election.awareness = self.awareness
        self.sim.mesh = self.mesh
        self.roles = RoleManager(self.world, self.guidance, self.rf, self.energy,
                                 log=self.sim.log_event, awareness=self.awareness)
        self.traffic = TrafficSimulator(self.world, gcs_id=self.world.gcs.id,
                                        on_ack=self.awareness.on_ack)

        # -- mission: disturbances, scenario timeline, metrics -------------------
        self.disturbances = Disturbances(self)
        self.mission_metrics = MissionMetrics(self)
        self.sim.log_listeners.append(self.mission_metrics.on_event)
        self.director: Optional[ScenarioDirector] = None
        self.recorder = None
        self.finalize_recorder_on_end = False
        self._summary_cache = None
        self._summary_time = -1e9

        # -- RAG -------------------------------------------------------------
        self.detector = DisasterDetector(use_simulation=True)
        self.embedder = CLIPEmbedder(use_simulation=True)
        self.vector_store = VectorStore()
        self.sitrep_gen = SitrepGenerator(use_template=True)

        # Snapshot of the initial layout, so Reset can remove whatever the
        # operator added and restore what was there at the start.
        self._initial_drone_ids = set(self.sim.drones)
        self._initial_pois = [
            (poi.id, poi.position.copy(), poi.category, poi.priority, poi.release_time,
             poi.emergent, poi.region, poi.data_chunks)
            for poi in self.world.pois
        ]
        self._jammer_counter = 0
        self._poi_counter = len(self.world.pois)
        self._telemetry_callback = None
        self._last_sitrep_time = -1e9
        self._detected_pois = set()

        # Cluster delegation. When an edge node (BRAVO) claims a subsystem,
        # this node stops computing it and applies the streamed result
        # instead. `cluster` is injected by run_node.py; when it is None the
        # node simply owns everything, which is the single-laptop case.
        self.cluster = None
        self.remote_gnn_metrics = None
        self.remote_causal_state = None
        self.remote_sitrep = None

        self.sim.mission_state = self._mission_state()
        if autostart or mode == "scripted":
            self._cmd_launch_mission()

    # ----------------------------------------------------------------------

    def _owns(self, subsystem: str) -> bool:
        """True if this node should compute `subsystem` itself."""
        if self.cluster is None:
            return True
        return self.cluster.owns_locally(subsystem)

    def _spawn_fleet(self, count: int):
        """The fleet starts on its pads at the GCS, charged and ready."""
        for i in range(count):
            self._add_pad_drone(f"UAV-{i + 1}", i)

    def _add_pad_drone(self, drone_id: str, pad_index: int):
        pad = self.world.gcs.pad_for(pad_index)
        position = np.array([pad[0], pad[1], pad[2] + 0.3])
        drone = self.sim.add_drone(drone_id, position, DroneRole.STANDBY)
        drone.home_position = position.copy()
        drone.pad_index = pad_index
        drone.status = DroneStatus.READY
        drone.starts_on_pad = True
        self.guidance.phases[drone_id] = MissionPhase.READY
        return drone

    def _make_per_drone_ltc_hook(self):
        """
        One LTC instance per aircraft.

        The controller is stateful — its liquid hidden state *is* its memory
        of the disturbance it has been fighting. Sharing a single instance
        across aircraft would blend unrelated histories into one hidden state
        and destroy exactly the property the architecture is chosen for.
        """
        from ltc.ltc_controller import LTCFlightController

        controllers: Dict[str, LTCFlightController] = {}
        hooks = {}
        self.ltc_controllers = controllers

        def hook(drone, wind_vel, sim_time, dt):
            fn = hooks.get(drone.id)
            if fn is None:
                ctrl, _ = load_or_default("models/ltc_controller.pt")
                ctrl.reset_hidden(1)
                controllers[drone.id] = ctrl
                fn = hooks[drone.id] = make_ltc_controller_hook(ctrl)
            fn(drone, wind_vel, sim_time, dt)
            drone.controller_mode = "LTC"

        return hook

    def _make_per_drone_pid_hook(self):
        """One cascaded PID per aircraft, so integrators never mix."""
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

    # -- scripted demonstration ------------------------------------------------

    def demo_timeline(self) -> List[dict]:
        """
        The built-in demonstration: every challenge requirement exercised in
        order, positioned along the valley so it works on any theatre.
        """
        T = self.phase_duration
        return [
            {"t": 0.0, "type": "phase", "phase": 1},
            {"t": T, "type": "phase", "phase": 2},
            {"t": T + 4, "type": "comm_outage", "along": 0.42, "offset_m": 250,
             "radius_m": 1100, "duration": 40},
            {"t": T + 14, "type": "packet_loss", "rate": 0.2, "duration": 30},
            {"t": 2 * T, "type": "phase", "phase": 3},
            {"t": 2 * T + 5, "type": "uav_failure", "target": "relay"},
            {"t": 3 * T, "type": "phase", "phase": 4},
            {"t": 3 * T + 3, "type": "new_task",
             "region": {"along": 0.9, "offset_m": 40, "radius_m": 140, "priority": 1,
                        "category": "trapped_survivors"}},
            {"t": 4 * T, "type": "phase", "phase": 5},
            {"t": 4 * T + 2, "type": "battery_fault", "target": "relay", "severity": 0.35},
        ]

    # ----------------------------------------------------------------------

    def set_telemetry_callback(self, callback):
        self._telemetry_callback = callback
        self.sim.on_telemetry(callback)

    def start(self):
        if self._running:
            return
        self._running = True
        self._phase_start_time = time.time()
        logger.info("UAV-X mission controller started — controller: %s", self.active_controller)
        self._sim_thread = threading.Thread(target=self._run_loop, daemon=True)
        self._sim_thread.start()

    def _run_loop(self):
        """Simulation thread: fixed-step, paced to wall clock."""
        next_tick = time.perf_counter()
        step = self.dt / max(self.realtime_factor, 1e-3)

        while self._running:
            try:
                with self._lock:
                    self.step()
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

    def step(self):
        """One simulation tick plus everything that runs alongside it."""
        self.sim.tick()
        self._post_tick()

    def _post_tick(self):
        """Subsystems that run slower than the physics loop."""
        tick = self.sim.tick_count
        now = self.sim.sim_time
        live = self.mission_phase == "LIVE"

        # Environmental injects act on the physics every tick
        for kind, message, extra in self.injects.update(self.dt, self.sim.drones, now):
            self.sim.log_event(kind, message, extra)

        # Scenario timeline and timed disturbance expiry
        self.disturbances.update()
        if live and self.director is not None:
            self.director.update(self.guidance.mission_time(now) + getattr(self, "_skip", 0.0))

        if tick % 5 == 0:
            self._apply_environment()
            # The swarm's beliefs, from this tick's measurements
            self._read_anemometer()
            self.awareness.update(self.sim.drones, now, self.dt * 5)
            self.relay_optimizer.measured_noise_dbm = self.awareness.global_noise_dbm
            self.relay_optimizer.link_offset_db = self.awareness.link_offset_db
            self.relay_optimizer.ceiling_agl = self.awareness.ceiling_agl
            self.causal_layer.weather_index = self.awareness.weather_index
        if tick % 50 == 0:
            self._reopen_lost_data(now)

        if tick % 10 == 0:
            self.ew.update(self.sim.drones, now)

        # Relay failover — the fast path, every 100 ms, on heartbeats (a relay
        # nobody has heard for 200 ms). Detection is the dominant term in
        # self-healing latency; the election itself takes microseconds.
        healed = False
        if tick % 5 == 0:
            self.election.relay_count = self.roles.relays_needed
            heal = self.election.check_and_heal(self.sim.drones, now)
            if heal and heal.get("status") == "ok":
                healed = True
                for drone_id, role in heal.get("promoted", []):
                    if role == "RELAY":
                        self.guidance.assignments.pop(drone_id, None)
                        self.guidance.routes.pop(drone_id, None)
                        self.roles._record(drone_id, "SCOUT", "RELAY",
                                           "failover: promoted into a failed relay's slot", now)
                # Reroute immediately rather than waiting for the next
                # periodic refresh; the reroute is part of healing.
                t0 = time.perf_counter()
                routes = self.router.compute_routes(self.sim.drones, now,
                                                    ground_id=self.world.gcs.id, force=True)
                for node_id, next_hops in routes.items():
                    self.mesh.update_routing_table(node_id, next_hops)
                reroute_ms = (time.perf_counter() - t0) * 1000.0
                latency = self.election.record_heal_latency(
                    self.sim.drones, now, extra_ms=reroute_ms)
                self.sim.metrics["election_time_ms"] = latency
                self.sim.log_event(
                    "ELECTION",
                    f"Failover in {latency:.0f} ms end-to-end (detect + elect + reroute)"
                    + ("; promoted " + ", ".join(f"{d} to {r.lower()}" for d, r in heal["promoted"])
                       if heal.get("promoted") else "; no scout could be spared"),
                    {"latency_ms": latency},
                )

        # Role management: how many relays, who flies them, launches, handovers
        self.roles.update(self.sim.drones, now, mission_live=live)
        self.relay_optimizer.chain_hint = list(self.roles.chain_points)

        # Routing table refresh (500 ms)
        if tick % 25 == 0 and not healed:
            routes = self.router.compute_routes(self.sim.drones, now, ground_id=self.world.gcs.id)
            for node_id, next_hops in routes.items():
                self.mesh.update_routing_table(node_id, next_hops)

        # Packet-level traffic and connectivity (100 ms)
        if tick % 5 == 0:
            self.traffic.update(self.sim.drones, self.router, now, self.dt * 5,
                                self.sim.path_qualities())
            for d in self.sim.drones.values():
                d.data_backlog = self.traffic.backlog(d.id)
            for ev in self.traffic.drain_events():
                self.sim.log_event(ev["type"], ev["message"], ev)
            self.mission_metrics.update(now, self.dt * 5, self.sim.drones)
            self.sim.metrics["connected_fraction"] = (
                self.traffic.summary()["connectivity_availability"] or 0.0) if tick % 50 == 0 \
                else self.sim.metrics.get("connected_fraction", 1.0)

        if self.recorder is not None:
            self.recorder.sample(now)

        # Mission clock
        if live:
            limit = self.world.time_limit_s
            mt = self.guidance.mission_time(now)
            if limit is not None and mt is not None and mt >= limit:
                self._cmd_end_mission("COMPLETE", reason="allotted time reached")
            elif tick % 25 == 0 and mt is not None:
                # Every task that will ever appear has been delivered and the
                # whole fleet is back on its pads: the mission is done.
                pois = self.world.pois
                pending = self.director.pending if self.director is not None else 0
                if pois and pending == 0 and all(p.released(mt) and p.delivered for p in pois) \
                        and all(d.on_pad or d.status == DroneStatus.KILLED
                                for d in self.sim.drones.values()):
                    self._cmd_end_mission("COMPLETE", reason="every task delivered, fleet recovered")

        if tick % 10 == 0:
            self.sim.mission_state = self._mission_state()
            self.sim.comms_state = self._comms_state()

        # PoI detections + SITREP synthesis — skipped while CHARLIE owns them
        if not self._owns("rag_sitrep"):
            return

        if tick % 50 == 0:
            self._process_poi_detections()

        if live and (now - self._last_sitrep_time) > 45.0 and self._detected_pois:
            self._generate_sitrep()
            self._last_sitrep_time = now

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
                if poi.id in self._detected_pois:
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

    # -- mission state ----------------------------------------------------------

    def _apply_environment(self):
        """Push the weather state into the radio, the airframes and the SCM."""
        self.rf.extra_loss_db = 2.0 * self.injects.antenna_loss_db()   # both ends wet
        power = self.injects.power_factor()
        for drone in self.sim.drones.values():
            drone.power_factor = power
        # (The causal engine's weather regressor comes from the swarm's own
        # evidence — unexplained path loss and turbulence — in awareness.)

    def _read_anemometer(self):
        """
        The GCS mast anemometer — a sensor: the wind at mast height (the wind
        model's reference height) with 0.3 m/s of noise.
        """
        reading = np.asarray(self.wind.base_wind, dtype=float)[:2] + np.random.normal(0.0, 0.3, 2)
        self.awareness.observe_anemometer(reading, height_m=float(self.world.gcs.mast_m))

    def _reopen_lost_data(self, now: float):
        """
        GCS logic: a target was reported surveyed, its data has not all
        arrived, and the aircraft carrying it has not been heard for
        DATA_LOST_S — write the data off and fly the survey again.
        """
        for poi in self.world.pois:
            if not poi.surveyed or poi.delivered or not poi.surveyed_by:
                continue
            carrier = poi.surveyed_by
            if self.awareness.suspected(carrier, self.awareness.DATA_LOST_S):
                self.traffic.reopen(poi.id, now, carrier,
                                    f"{carrier} not heard for {self.awareness.heard_ago(carrier):.0f} s "
                                    f"with {poi.data_chunks - self.traffic.delivered_chunks(poi.id)} "
                                    "chunks outstanding")

    def summary(self, force: bool = False) -> dict:
        """The full metrics summary (cached for 2 s on the live path)."""
        now = self.sim.sim_time
        if force or self._summary_cache is None or now - self._summary_time > 2.0:
            self._summary_cache = self.mission_metrics.summary(now)
            self._summary_time = now
        return self._summary_cache

    def _mission_state(self) -> dict:
        now = self.sim.sim_time
        mt = self.guidance.mission_time(now)
        limit = self.world.time_limit_s
        released = [p for p in self.world.pois if mt is not None and p.released(mt)]
        weight = sum(p.weight for p in released)
        done = sum(p.weight for p in released if p.delivered)
        return {
            "phase": self.mission_phase,
            "mission_id": self.mission_id,
            "started": self.mission_started,
            "elapsed": mt or 0.0,
            "time_limit_s": limit,
            "remaining_s": (limit - mt) if (limit is not None and mt is not None) else None,
            "theatre": self.theatre_id,
            "scenario": None if self.scenario is None else {
                "name": self.scenario.name, "description": self.scenario.description},
            "pending_disturbances": None if self.director is None else self.director.pending,
            "tasks": {"released": len(released),
                      "surveyed": sum(1 for p in released if p.surveyed),
                      "delivered": sum(1 for p in released if p.delivered),
                      "hidden": len(self.world.pois) - len(released)},
            "priority_score": (done / weight) if weight else None,
            "roles": self.roles.get_state(),
            "awareness": self.awareness.get_state(),
            "disturbances": self.disturbances.get_state(),
            "inject_kinds": list(INJECT_KINDS),
            "disturbance_kinds": list(DISTURBANCE_KINDS),
            "summary": self.final_summary,
        }

    def _comms_state(self) -> dict:
        state = self.traffic.get_state(self.sim.sim_time)
        state["relay_reallocations"] = len(self.roles.reallocations)
        disruptions = self.mission_metrics.disruptions
        recoveries = [d["recovery_s"] for d in disruptions if d["recovery_s"] is not None]
        state["recovery_time_s_mean"] = float(np.mean(recoveries)) if recoveries else None
        state["disruptions"] = len(disruptions)
        state["geofence_violations"] = self.mission_metrics.geofence_violations
        state["battery_depleted"] = self.mission_metrics.battery_depleted
        state["conflicts_resolved"] = (self.guidance.deconfliction.conflicts
                                       if self.guidance.deconfliction else 0)
        return state

    def _cmd_launch_mission(self):
        """Start the mission clock; the role manager launches the fleet."""
        if self.mission_phase == "LIVE":
            raise ValueError("mission is already running")
        now = self.sim.sim_time
        self.mission_phase = "LIVE"
        self.mission_started = now
        self.guidance.mission_started = now
        self.guidance.recalled = False
        self.mission_id = f"UAVX-{int(time.time()) % 100000:05d}"
        self.final_summary = None
        self._skip = 0.0
        timeline = None
        if self.scenario is not None and self.scenario.disturbances:
            timeline = self.scenario.disturbances
        elif self.mode == "scripted":
            timeline = self.demo_timeline()
        self.director = ScenarioDirector(self.disturbances, timeline) if timeline else None
        self.current_phase = 1
        self.sim.metrics["current_phase"] = 1
        released = [p for p in self.world.pois if p.released(0.0)]
        self.sim.log_event(
            "MISSION",
            f"{self.mission_id} LAUNCHED over {self.world.terrain.theatre_info().get('name', self.theatre_id)} — "
            f"{len(released)} targets, {len(self.sim.drones)} UAVs, "
            + (f"{self.world.time_limit_s:.0f} s allotted" if self.world.time_limit_s else "no time limit"),
            {"mission_id": self.mission_id})
        self.sim.mission_state = self._mission_state()
        return self._mission_state()

    def _cmd_end_mission(self, outcome: str = "COMPLETE", reason: str = "operator"):
        if self.mission_phase != "LIVE":
            raise ValueError("no mission running")
        self.mission_phase = "COMPLETE" if outcome.upper() != "ABORTED" else "ABORTED"
        self.guidance.recall_all(self.sim.drones, self.sim.sim_time,
                                 f"mission {self.mission_phase.lower()} ({reason})")
        self.current_phase = 6
        self.sim.metrics["current_phase"] = 6
        self.final_summary = self.summary(force=True)
        self.sim.log_event("MISSION", f"{self.mission_id or 'Mission'} {self.mission_phase} — {reason}. "
                                      "All aircraft recalled.", {"mission_id": self.mission_id})
        if self.finalize_recorder_on_end:
            self.finalize_recording()
        return self._mission_state()

    def finalize_recording(self):
        """Write the metrics and close the log files (live runs)."""
        if self.recorder is None:
            return
        summary = self.summary(force=True)
        self.recorder.finalize(summary, MissionMetrics.indicative_scores(summary))
        try:
            self.sim.log_listeners.remove(self.recorder.on_event)
        except ValueError:
            pass
        logger.info("Mission logs written to %s", self.recorder.dir)
        self.recorder = None

    def _cmd_inject(self, kind: str, **params):
        """Live inject: an environmental condition or a scenario disturbance."""
        if kind in DISTURBANCE_KINDS:
            return self.disturbances.apply(kind, params)
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

    # -- operator commands --------------------------------------------------

    def advance_phase(self) -> dict:
        """Skip the scripted timeline forward to its next phase marker."""
        with self._lock:
            if self.mission_phase != "LIVE":
                self._cmd_launch_mission()
            if self.director is None:
                self.director = ScenarioDirector(self.disturbances, self.demo_timeline())
            mt = self.guidance.mission_time(self.sim.sim_time) + self._skip
            nxt = next((e["t"] for e in self.director.timeline[self.director._next:]
                        if e["type"] == "phase" and e["t"] > mt), None)
            if nxt is not None:
                self._skip += nxt - mt
        return {"phase": self.current_phase,
                "name": self.PHASE_NAMES.get(self.current_phase, "UNKNOWN")}

    def inject_fault(self, fault_type: str, params: dict = None) -> dict:
        params = params or {}
        with self._lock:
            if fault_type == "rf_degrade":
                self.rf.degrade_rf(params.get("noise_db", 14.0))
                msg = f"RF degraded by {params.get('noise_db', 14.0):.0f} dB"
            elif fault_type in ("jamming", "interference"):
                self.rf.enable_jamming(params.get("power_dbm", -74.0))
                msg = "Area-wide RF interference"
            elif fault_type == "kill_node":
                drone_id = params.get("drone_id", "UAV-1")
                if drone_id in self.sim.drones:
                    self.sim.drones[drone_id].kill(self.sim.sim_time)
                msg = f"Node {drone_id} failed"
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

    def _new_drone_id(self) -> str:
        n = 1
        while f"UAV-{n}" in self.sim.drones:
            n += 1
        return f"UAV-{n}"

    def _cmd_add_drone(self, role: str = None, x: float = None, y: float = None,
                       agl: float = None):
        """
        Add an aircraft. Without a position it joins the fleet on the next
        free pad, charged and ready; with one it is deployed airborne there
        (useful for testing a particular geometry).
        """
        if len(self.sim.drones) >= self.MAX_DRONES:
            raise ValueError(f"fleet is limited to {self.MAX_DRONES} aircraft")
        role = (role or "SCOUT").upper()
        if role not in ("SCOUT", "RELAY"):
            raise ValueError("role must be SCOUT or RELAY")
        drone_id = self._new_drone_id()
        pad_index = len(self.sim.drones)

        if x is None or y is None:
            drone = self._add_pad_drone(drone_id, pad_index)
            self._add_shadow(drone_id)
            self._log(f"{drone_id} added to the fleet on pad {pad_index + 1}", drone_id=drone_id)
            return {"drone_id": drone_id, "position": drone.position.tolist()}

        size = self.world.terrain.config.size_m
        x = float(np.clip(x, 30.0, size - 30.0))
        y = float(np.clip(y, 30.0, size - 30.0))
        if not self.world.geofence.contains(x, y):
            raise ValueError("that point is outside the geofence")
        z = self.world.terrain.height_at(x, y) + (agl or self.ROLE_AGL[role])
        drone = self.sim.add_drone(drone_id, [x, y, z], DroneRole[role])
        pad = self.world.gcs.pad_for(pad_index)
        drone.home_position = np.array([pad[0], pad[1], pad[2] + 0.3])
        drone.pad_index = pad_index
        drone.starts_on_pad = True
        self._add_shadow(drone_id)
        self._log(f"Operator deployed {drone_id} ({role.lower()}) at ({x:.0f}, {y:.0f})",
                  drone_id=drone_id)
        return {"drone_id": drone_id, "position": drone.position.tolist()}

    def _add_shadow(self, drone_id: str):
        if self.sim.shadow_controller is None:
            return
        if self.shadow_kind == "LTC":
            ctrl, _ = load_or_default("models/ltc_controller.pt")
            ctrl.reset_hidden(1)
            self.sim.shadow_controller[drone_id] = ctrl
        else:
            self.sim.shadow_controller[drone_id] = CascadedPIDFlightController()

    def _cmd_kill(self, drone_id: str):
        drone = self._drone(drone_id)
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is not airborne")
        return self.disturbances.apply("uav_failure", {"target": drone_id})

    def _cmd_revive(self, drone_id: str):
        """Return a failed aircraft to service: a spare airframe on its pad."""
        drone = self._drone(drone_id)
        if drone.is_alive or drone.on_pad:
            raise ValueError(f"{drone_id} is not down")
        pad = np.asarray(drone.home_position, dtype=float)
        drone.position = pad.copy()
        drone.velocity = np.zeros(3)
        drone.revive()
        drone.killed_at = None
        drone.battery = 100.0
        drone.status = DroneStatus.READY
        drone.role = DroneRole.STANDBY
        self.guidance.phases[drone_id] = MissionPhase.READY
        # A returned node is a new failure candidate for the election
        if hasattr(self.election, "_handled_failures"):
            self.election._handled_failures.discard(drone_id)
        self._log(f"{drone_id} returned to service on its pad", drone_id=drone_id)
        return {"drone_id": drone_id}

    def _cmd_launch(self, drone_id: str, role: str = "SCOUT"):
        drone = self._drone(drone_id)
        if drone.status != DroneStatus.READY:
            raise ValueError(f"{drone_id} is not ready on a pad")
        if not self.guidance.launch(drone, DroneRole[role.upper()], self.sim.sim_time, "operator"):
            raise ValueError(f"{drone_id} could not launch")
        self.awareness.mark_launched(drone, self.sim.sim_time)
        return {"drone_id": drone_id}

    def _cmd_goto(self, drone_id: str, x: float, y: float):
        drone = self._drone(drone_id)
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is not airborne")
        self.guidance.command_goto(drone, (x, y), sim_time=self.sim.sim_time)
        return {"drone_id": drone_id}

    def _cmd_release(self, drone_id: str):
        drone = self._drone(drone_id)
        self.guidance.release(drone, sim_time=self.sim.sim_time)
        return {"drone_id": drone_id}

    def _cmd_rth(self, drone_id: str):
        drone = self._drone(drone_id)
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is not airborne")
        self.guidance.send_home(drone, self.sim.sim_time, "operator order")
        return {"drone_id": drone_id}

    def _cmd_set_role(self, drone_id: str, role: str):
        drone = self._drone(drone_id)
        role = role.upper()
        if role not in ("SCOUT", "RELAY"):
            raise ValueError("role must be SCOUT or RELAY")
        if not drone.is_alive:
            raise ValueError(f"{drone_id} is not airborne")
        self.roles._set_role(drone, DroneRole[role], "operator order", self.sim.sim_time)
        self._log(f"Operator reassigned {drone_id} as {role}", drone_id=drone_id)
        return {"drone_id": drone_id, "role": role}

    def add_task(self, x: float, y: float, category: str = "trapped_survivors",
                 priority: int = 1, release_time: float = None, emergent: bool = True,
                 region: str = None, poi_id: str = None) -> str:
        """A new survey task, released now unless a release time is given."""
        if not self.world.geofence.contains(x, y):
            raise ValueError("that point is outside the geofence")
        self._poi_counter += 1
        poi_id = poi_id or f"POI-{self._poi_counter:03d}"
        while any(p.id == poi_id for p in self.world.pois):
            self._poi_counter += 1
            poi_id = f"POI-{self._poi_counter:03d}"
        if release_time is None:
            release_time = self.guidance.mission_time(self.sim.sim_time) or 0.0
        z = self.world.terrain.height_at(x, y) + 1.5
        self.world.add_poi(poi_id, [x, y, z], category=category, priority=int(priority),
                           release_time=release_time, emergent=emergent, region=region)
        return poi_id

    def _cmd_add_poi(self, x: float, y: float, category: str = "trapped_survivors",
                     priority: int = 1):
        poi_id = self.add_task(float(x), float(y), category=category, priority=int(priority))
        self._log(f"Operator reported {poi_id} (P{int(priority)} {category.replace('_', ' ')})",
                  poi_id=poi_id)
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

    def add_interference(self, x: float, y: float, power_dbm: float,
                         height_agl: float = 15.0, label: str = "RF INTERFERENCE") -> str:
        self._jammer_counter += 1
        source_id = f"RFI-{self._jammer_counter}"
        z = self.world.terrain.height_at(x, y) + height_agl
        self.rf.add_jammer(source_id, [x, y, z], power_dbm)
        self.sim.log_event("JAMMING_START",
                           f"{label}: source {source_id} at ({x:.0f}, {y:.0f}), "
                           f"{power_dbm:.0f} dBm", {"jammer_id": source_id})
        return source_id

    def _cmd_add_interference(self, x: float, y: float, power_dbm: float = 5.0,
                              height_agl: float = 15.0):
        return {"jammer_id": self.add_interference(float(x), float(y), float(power_dbm), height_agl)}

    # Older name, kept for API compatibility
    _cmd_add_jammer = _cmd_add_interference

    def _cmd_set_jammer_power(self, jammer_id: str, power_dbm: float):
        if jammer_id not in self.rf.jammers:
            raise KeyError(f"no such interference source: {jammer_id}")
        self.rf.jammers[jammer_id]["power_dbm"] = float(power_dbm)
        return {"jammer_id": jammer_id}

    def _cmd_remove_jammer(self, jammer_id: str):
        self.rf.remove_jammer(jammer_id)
        self.sim.log_event("JAMMING_STOP", f"Interference source {jammer_id} switched off",
                           {"jammer_id": jammer_id})
        return {"jammer_id": jammer_id}

    def _cmd_clear_jammers(self):
        self.rf.jammers.clear()
        self.rf.disable_jamming()
        self.sim.log_event("JAMMING_STOP", "All interference sources cleared", {})
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
        """Run the scripted demonstration timeline from now."""
        self.mode = "scripted"
        if self.mission_phase == "LIVE":
            mt = self.guidance.mission_time(self.sim.sim_time)
            timeline = [dict(e, t=e["t"] + mt) for e in self.demo_timeline()]
            self.director = ScenarioDirector(self.disturbances, timeline)
            self._skip = 0.0
        else:
            if self.mission_phase != "PLANNING":
                self.reset()
                self.mode = "scripted"
            self._cmd_launch_mission()
        self._log("Operator started the scripted demonstration")
        return {}

    def _cmd_stop_scenario(self):
        self.mode = "interactive"
        self.director = None
        self._log("Scripted demonstration cancelled — operator in control")
        return {}

    def reset(self):
        with self._lock:
            self.sim.reset()
            self.guidance.reset()
            self.guidance.mission_started = None
            self.ew.reset()
            self.injects.reset()
            self.disturbances.reset()
            self.roles.reset()
            self.traffic.reset()
            self.awareness.reset()
            self._read_anemometer()
            self.mission_metrics.reset()
            self.rf.extra_loss_db = 0.0
            self.mission_phase = "PLANNING"
            self.mission_id = None
            self.mission_started = None
            self.final_summary = None
            self._summary_cache = None
            self.director = None
            self._skip = 0.0
            self.causal_layer.reset()
            self.vector_store.clear()
            self._detected_pois = set()
            self._last_sitrep_time = -1e9
            self.current_phase = 0
            self.sim.metrics["current_phase"] = 0

            for ctrl in getattr(self, "ltc_controllers", {}).values():
                ctrl.reset_hidden(1)
            for shadow in (self.sim.shadow_controller or {}).values():
                if hasattr(shadow, "reset"):
                    shadow.reset()
                elif hasattr(shadow, "reset_hidden"):
                    shadow.reset_hidden(1)

            # Remove everything the operator added; the fleet back on its pads
            for drone_id in list(self.sim.drones):
                if drone_id not in self._initial_drone_ids:
                    del self.sim.drones[drone_id]
                    (self.sim.shadow_controller or {}).pop(drone_id, None)
            for drone in self.sim.drones.values():
                drone.manual_target = None
                drone.ew_hold = False
                drone.handover_to = None
                drone.role = DroneRole.STANDBY
                drone.status = DroneStatus.READY
                drone.health = 1.0
                drone.power_factor = 1.0
                drone.nav_error = np.zeros(3)
                drone.killed_at = None
                self.guidance.phases[drone.id] = MissionPhase.READY

            from sim.world import PointOfInterest
            self.world.pois = [
                PointOfInterest(id=pid, position=pos.copy(), category=cat, priority=pri,
                                release_time=rel, emergent=em, region=reg, data_chunks=chunks)
                for pid, pos, cat, pri, rel, em, reg, chunks in self._initial_pois
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
            self.sim.mission_state = self._mission_state()

        logger.info("Mission reset")
        return {"status": "reset"}

    def stop(self):
        self._running = False
        if self._sim_thread:
            self._sim_thread.join(timeout=2.0)

    # -- state --------------------------------------------------------------

    OPERATOR_BRIEF = (
        "You are in command. Launch the mission, report new emergencies, fail "
        "aircraft, cut links and add interference — the swarm re-plans around "
        "every change. Nothing here is scripted unless you start the demo."
    )

    def get_state(self) -> dict:
        phase = self.sim.metrics.get("current_phase", 0)
        operator = self.mode == "interactive" and self.mission_phase == "LIVE"
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
            "delegated": {
                "gnn_topology": not self._owns("gnn_topology"),
                "scm_causal": not self._owns("scm_causal"),
                "rag_sitrep": not self._owns("rag_sitrep"),
            },
        }
