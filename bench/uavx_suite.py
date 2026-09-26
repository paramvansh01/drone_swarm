"""
UAV-X benchmark suite: every shipped scenario, several seeds, the adaptive
system against a conventional fixed-role baseline.

    python -m bench.uavx_suite                 # 4 scenarios x 3 seeds x 2 strategies
    python -m bench.uavx_suite --seeds 1 --quick

The baseline keeps everything that is not autonomy — the same flight
control, energy-aware return-to-home, geofence, packet model, relay
placement network — and removes the adaptive role layer: roles are fixed at
launch (one relay, the rest scouts), aircraft relaunch in their original role
after recharging, a failed relay is not replaced, a new priority-1 task waits
for a free scout, and nothing hands over. The difference between the two is
what the role manager, failover, pre-emption and handover are worth.

Writes results/uavx_benchmarks.json (served to the dashboard) and
results/uavx_benchmarks.md, and keeps one full log set per scenario in
results/sample_logs/.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

SCENARIOS = ["synthetic_quickstart", "kedarnath_landslide", "uttarkashi_earthquake",
             "stress_hidden_disturbances"]
STRATEGIES = ["adaptive", "static"]

# (label, path into the summary, scale, unit, higher-is-better)
METRICS = [
    ("completion_rate", ("mission", "completion_rate"), 100, "%", True),
    ("priority_weighted_score", ("mission", "priority_weighted_score"), 100, "%", True),
    ("emergent_response_s", ("mission", "emergent_response_s_mean"), 1, " s", False),
    ("packet_delivery_ratio", ("communication", "packet_delivery_ratio"), 100, "%", True),
    ("latency_ms_mean", ("communication", "latency_ms_mean"), 1, " ms", False),
    ("connectivity_availability", ("communication", "connectivity_availability"), 100, "%", True),
    ("downtime_s_total", ("communication", "downtime_s_total"), 1, " s", False),
    ("relay_reallocations", ("autonomy", "relay_reallocations"), 1, "", None),
    ("reconfiguration_efficiency", ("autonomy", "reconfiguration_efficiency"), 100, "%", True),
    ("recovery_time_s_mean", ("autonomy", "recovery_time_s_mean"), 1, " s", False),
    ("post_disruption_availability", ("robustness", "after_first_disruption", "availability"), 100, "%", True),
    ("post_disruption_pdr", ("robustness", "after_first_disruption", "pdr"), 100, "%", True),
    ("collisions", ("safety", "collisions"), 1, "", False),
    ("min_separation_m", ("safety", "min_separation_m"), 1, " m", True),
    ("geofence_violations", ("safety", "geofence_violations"), 1, "", False),
    ("battery_depleted", ("safety", "battery_depleted"), 1, "", False),
    ("min_battery_pct", ("safety", "min_battery_pct"), 1, "%", True),
]


def _get(summary, path):
    value = summary
    for key in path:
        value = (value or {}).get(key)
    return value


def _one(job):
    scenario, seed, strategy, log_dir = job
    os.environ.setdefault("OMP_NUM_THREADS", "1")
    import logging
    import torch
    torch.set_num_threads(1)
    logging.basicConfig(level=logging.ERROR)
    from run_scenario import run
    t0 = time.time()
    summary = run(str(ROOT / "scenarios" / f"{scenario}.json"), out_dir=log_dir, seed=seed,
                  quiet=True, record=log_dir is not None, strategy=strategy)
    row = {"scenario": scenario, "seed": seed, "strategy": strategy,
           "wall_s": round(time.time() - t0, 1),
           "scores": summary.get("_scores")}
    for name, path, *_ in METRICS:
        row[name] = _get(summary, path)
    return row


def _stats(values):
    vals = [v for v in values if v is not None]
    if not vals:
        return {"n": 0, "mean": None, "std": None}
    return {"n": len(vals), "mean": float(np.mean(vals)), "std": float(np.std(vals))}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seeds", type=int, default=3)
    ap.add_argument("--workers", type=int, default=max(1, min(6, (os.cpu_count() or 2) - 2)))
    ap.add_argument("--scenarios", nargs="*", default=SCENARIOS)
    ap.add_argument("--no-baseline", action="store_true")
    args = ap.parse_args()

    out = ROOT / "results"
    samples = out / "sample_logs"
    out.mkdir(exist_ok=True)
    strategies = ["adaptive"] if args.no_baseline else STRATEGIES

    jobs = []
    for scenario in args.scenarios:
        for k in range(args.seeds):
            seed = 1 + k
            for strategy in strategies:
                log_dir = None
                if k == 0 and strategy == "adaptive":
                    log_dir = samples / scenario
                    shutil.rmtree(log_dir, ignore_errors=True)
                jobs.append((scenario, seed, strategy, str(log_dir) if log_dir else None))

    print(f"{len(jobs)} runs on {args.workers} workers ...", flush=True)
    t0 = time.time()
    rows = []
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        for row in pool.map(_one, jobs):
            rows.append(row)
            print(f"  {row['scenario']:28s} seed {row['seed']} {row['strategy']:8s} "
                  f"completion {100 * (row['completion_rate'] or 0):5.1f}%  "
                  f"PDR {100 * (row['packet_delivery_ratio'] or 0):5.1f}%  "
                  f"linked {100 * (row['connectivity_availability'] or 0):5.1f}%  "
                  f"({row['wall_s']} s)", flush=True)

    result = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M"),
        "runs": sum(1 for r in rows if r["strategy"] == "adaptive"),
        "seeds": args.seeds,
        "scenarios": args.scenarios,
        "wall_clock_s": round(time.time() - t0, 1),
        "aggregate": {},
        "baseline_aggregate": {},
        "per_scenario": {},
        "rows": rows,
    }
    for strategy, key in (("adaptive", "aggregate"), ("static", "baseline_aggregate")):
        sel = [r for r in rows if r["strategy"] == strategy]
        result[key] = {name: _stats([r[name] for r in sel]) for name, *_ in METRICS}
    for scenario in args.scenarios:
        result["per_scenario"][scenario] = {
            strategy: {name: _stats([r[name] for r in rows
                                     if r["scenario"] == scenario and r["strategy"] == strategy])
                       for name, *_ in METRICS}
            for strategy in strategies
        }
    (out / "uavx_benchmarks.json").write_text(json.dumps(result, indent=2))

    def cell(s, scale, unit):
        if not s or s["n"] == 0 or s["mean"] is None:
            return "—"
        return f"{s['mean'] * scale:.1f} ± {s['std'] * scale:.1f}{unit}"

    lines = [f"# UAV-X benchmark results",
             "",
             f"Generated {result['generated_at']} by `python -m bench.uavx_suite` — "
             f"{len(args.scenarios)} scenarios × {args.seeds} seeds, mean ± s.d.",
             "",
             "| Metric | Adaptive (this system) | Fixed-role baseline |",
             "|---|---|---|"]
    for name, _, scale, unit, _better in METRICS:
        lines.append(f"| {name.replace('_', ' ')} | {cell(result['aggregate'][name], scale, unit)} | "
                     f"{cell(result['baseline_aggregate'].get(name), scale, unit)} |")
    lines += ["", "## Per scenario (adaptive)", "",
              "| Scenario | Completion | Priority-weighted | PDR | Availability | Recovery | Collisions | Min battery |",
              "|---|---|---|---|---|---|---|---|"]
    for scenario in args.scenarios:
        s = result["per_scenario"][scenario]["adaptive"]
        lines.append(f"| {scenario} | {cell(s['completion_rate'], 100, '%')} | "
                     f"{cell(s['priority_weighted_score'], 100, '%')} | "
                     f"{cell(s['packet_delivery_ratio'], 100, '%')} | "
                     f"{cell(s['connectivity_availability'], 100, '%')} | "
                     f"{cell(s['recovery_time_s_mean'], 1, ' s')} | "
                     f"{cell(s['collisions'], 1, '')} | {cell(s['min_battery_pct'], 1, '%')} |")
    (out / "uavx_benchmarks.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))
    print(f"\nWrote results/uavx_benchmarks.json and .md in {time.time() - t0:.0f} s")


if __name__ == "__main__":
    main()
