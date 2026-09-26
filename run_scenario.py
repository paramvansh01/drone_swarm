#!/usr/bin/env python3
"""
Run a UAV-X mission scenario headless, as fast as the machine allows, and
write the full log set.

    python run_scenario.py scenarios/synthetic_quickstart.json
    python run_scenario.py scenarios/kedarnath_landslide.json --out logs/run1
    python run_scenario.py scenarios/stress_hidden_disturbances.json --seed 3

The run is deterministic for a given scenario, seed and code version. Output
(see mission/recorder.py): run_meta.json, scenario_resolved.json,
events.jsonl, uav_state.csv, links.csv, packets.csv, metrics.json.

To watch a scenario live on the dashboard instead:

    python run_node.py --scenario scenarios/kedarnath_landslide.json --autostart
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def run(scenario_path: str, out_dir: str = None, seed: int = None, controller: str = "pid",
        max_extra_s: float = 240.0, quiet: bool = False, record: bool = True,
        overrides: dict = None, strategy: str = "adaptive") -> dict:
    """Fly one scenario to the end and return its metrics summary."""
    import numpy as np
    from gcs.backend.demo_controller import DemoController
    from mission.metrics import MissionMetrics
    from mission.recorder import MissionRecorder
    from mission.scenario import load_scenario

    scenario = load_scenario(scenario_path)
    if seed is not None:
        scenario.seed = int(seed)
        if scenario.tasks_auto:
            scenario.tasks_auto = dict(scenario.tasks_auto, seed=int(seed))
    np.random.seed(scenario.seed)

    ctl = DemoController(scenario=scenario, controller=controller, shadow=False)
    for key, value in (overrides or {}).items():
        obj, _, attr = key.rpartition(".")
        target = ctl
        for part in obj.split(".") if obj else []:
            target = getattr(target, part)
        setattr(target, attr, value)

    if strategy == "static":
        # The conventional baseline: fixed roles, no failover promotion,
        # no pre-emption for new priorities, no standby
        ctl.roles.mode = "static"
        ctl.election.PROMOTE_SCOUTS = False
        ctl.guidance.PREEMPT_PRIORITY_GAP = 99
        ctl.guidance.SOFT_RTH = ()
    elif strategy != "adaptive":
        raise ValueError(f"unknown strategy {strategy!r}")

    # Seed every stochastic subsystem from the scenario seed
    ctl.rf._rng = np.random.RandomState(scenario.seed)
    ctl.sim._rng = np.random.RandomState(scenario.seed + 1)
    ctl.traffic._rng = np.random.default_rng(scenario.seed + 2)
    ctl.disturbances.rng = np.random.default_rng(scenario.seed + 3)

    if out_dir is None:
        stamp = time.strftime("%Y%m%d-%H%M%S")
        out_dir = ROOT / "logs" / f"{Path(scenario_path).stem}-s{scenario.seed}-{stamp}"
    recorder = MissionRecorder(out_dir, ctl, scenario) if record else None
    if recorder is not None:
        ctl.recorder = recorder
        ctl.sim.log_listeners.append(recorder.on_event)

    ctl._cmd_launch_mission()
    limit = ctl.world.time_limit_s or 900.0
    wall0 = time.time()
    last_print = -1e9

    while True:
        ctl.step()
        mt = ctl.guidance.mission_time(ctl.sim.sim_time)
        if not quiet and ctl.sim.sim_time - last_print >= 60.0:
            last_print = ctl.sim.sim_time
            s = ctl.mission_metrics
            m = ctl._mission_state()
            print(f"  T+{mt:6.0f}s  tasks {m['tasks']['delivered']}/{m['tasks']['released']} delivered"
                  f"  airborne {sum(d.is_alive for d in ctl.sim.drones.values())}"
                  f"  relays needed {ctl.roles.relays_needed}"
                  f"  backhaul {ctl.sim.metrics['backhaul_pdr'] * 100:5.1f}%"
                  f"  disruptions {len(s.disruptions)}", flush=True)
        done = ctl.mission_phase != "LIVE" and all(
            d.on_pad or not (d.is_alive or d.status.name == "RETURNING") for d in ctl.sim.drones.values())
        if done or mt > limit + max_extra_s:
            break

    summary = ctl.summary(force=True)
    scores = MissionMetrics.indicative_scores(summary)
    if recorder is not None:
        recorder.finalize(summary, scores)
    summary["_wall_clock_s"] = round(time.time() - wall0, 1)
    summary["_out_dir"] = str(out_dir) if record else None
    summary["_scores"] = scores
    return summary


def print_summary(name: str, s: dict):
    m, c, a, r, sf = s["mission"], s["communication"], s["autonomy"], s["robustness"], s["safety"]

    def pct(v):
        return "—" if v is None else f"{v * 100:.1f}%"

    def num(v, unit="", d=1):
        return "—" if v is None else f"{v:.{d}f}{unit}"

    print(f"\n=== {name} ===")
    print(f"Mission       completion {pct(m['completion_rate'])} ({m['tasks_delivered']}/{m['tasks_released']} delivered)"
          f" · priority-weighted {pct(m['priority_weighted_score'])}"
          f" · completion time {num(m['completion_time_s'], ' s', 0)} of {num(m['time_limit_s'], ' s', 0)}"
          f" · emergent response {num(m['emergent_response_s_mean'], ' s', 0)}")
    print(f"Comms         PDR {pct(c['packet_delivery_ratio'])} (telemetry {pct(c['pdr_telemetry'])}, survey {pct(c['pdr_survey_data'])})"
          f" · latency mean {num(c['latency_ms_mean'], ' ms')} p95 {num(c['latency_ms_p95'], ' ms')}"
          f" · availability {pct(c['connectivity_availability'])}"
          f" · downtime {num(c['downtime_s_total'], ' s')} (longest {num(c['downtime_s_longest'], ' s')}, {c['outage_count']} outages)")
    print(f"Autonomy      {a['relay_reallocations']} relay reallocations ({a['handovers']} handovers, {a['role_flaps']} flaps)"
          f" · reconfiguration efficiency {pct(a['reconfiguration_efficiency'])}"
          f" · recovery mean {num(a['recovery_time_s_mean'], ' s')} max {num(a['recovery_time_s_max'], ' s')}"
          f" · {a['disruptions_hitless']}/{a['disruptions']} disruptions hitless")
    post = r["after_first_disruption"]
    print(f"Robustness    after first disruption: availability {pct(post['availability'])}, PDR {pct(post['pdr'])}")
    print(f"Safety        collisions {sf['collisions']} · min separation {num(sf['min_separation_m'], ' m')}"
          f" · geofence violations {sf['geofence_violations']} · battery depleted {sf['battery_depleted']}"
          f" · min battery {num(sf['min_battery_pct'], '%')} · terrain contacts {sf['terrain_contacts']}")
    sc = s.get("_scores") or {}
    if sc:
        print("Indicative    " + " · ".join(f"{k.replace('_', ' ')} {v}" for k, v in sc.items()))
    if s.get("_out_dir"):
        print(f"Logs          {s['_out_dir']}   ({s['_wall_clock_s']} s wall clock)")


def main():
    ap = argparse.ArgumentParser(description="Run a UAV-X scenario headless and write logs")
    ap.add_argument("scenario", help="scenario JSON (see scenarios/)")
    ap.add_argument("--out", help="log directory (default logs/<scenario>-s<seed>-<time>)")
    ap.add_argument("--seed", type=int, help="override the scenario seed")
    ap.add_argument("--controller", choices=["pid", "ltc"], default="pid")
    ap.add_argument("--strategy", choices=["adaptive", "static"], default="adaptive",
                    help="adaptive: the system; static: the fixed-role baseline it is compared with")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--json", action="store_true", help="print the summary as JSON")
    args = ap.parse_args()

    logging.basicConfig(level=logging.WARNING, format="%(levelname)s %(name)s: %(message)s")
    summary = run(args.scenario, args.out, args.seed, args.controller, quiet=args.quiet,
                  strategy=args.strategy)
    if args.json:
        print(json.dumps(summary, indent=2, default=str))
    else:
        print_summary(Path(args.scenario).stem, summary)


if __name__ == "__main__":
    main()
