"""
Head-to-head comparison of relay-placement strategies over full missions.

Each strategy flies the complete scripted demo (including the RELAY-1 kill)
on the same five terrain seeds, and is scored on how long backhaul to the
ground station spent below 50 %. Used to choose the deployed strategy on
evidence rather than by intuition — several plausible-sounding variants made
things worse.

    python -m bench.relay_strategies
"""

import json
import logging
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np

STRATEGIES = {
    # name: (RelayOptimizer switches, RelayElection.PROMOTE_SCOUTS)
    "chain":                         (dict(USE_MULTISTART=False, USE_HYSTERESIS=False, ANTICIPATE_S=0.0), False),
    "chain+promote":                 (dict(USE_MULTISTART=False, USE_HYSTERESIS=False, ANTICIPATE_S=0.0), True),
    "chain+anticipate+promote":      (dict(USE_MULTISTART=False, USE_HYSTERESIS=False, ANTICIPATE_S=25.0), True),
    "multistart+promote":            (dict(USE_MULTISTART=True,  USE_HYSTERESIS=False, ANTICIPATE_S=0.0), True),
    "multistart+anticipate+promote": (dict(USE_MULTISTART=True,  USE_HYSTERESIS=False, ANTICIPATE_S=25.0), True),
    "multistart+hyst+ant+promote":   (dict(USE_MULTISTART=True,  USE_HYSTERESIS=True,  ANTICIPATE_S=25.0), True),
}
SEEDS = (4207, 5220, 6233, 7246, 8259)


def run(args):
    name, seed = args
    logging.basicConfig(level=logging.ERROR)
    from gnn.relay_optimizer import RelayOptimizer
    from mesh.election import RelayElection
    switches, promote = STRATEGIES[name]
    for key, value in switches.items():
        setattr(RelayOptimizer, key, value)
    RelayElection.PROMOTE_SCOUTS = promote

    from gcs.backend.demo_controller import DemoController
    demo = DemoController(phase_duration=45.0, terrain_seed=seed, mode="scripted")
    demo.current_phase = 1
    demo.sim.metrics["current_phase"] = 1

    backhaul = []
    for _ in range(int(180 / demo.dt)):
        demo.sim.tick()
        demo._post_tick()
        backhaul.append(demo.sim.metrics["backhaul_pdr"])

    b = np.array(backhaul)
    m = demo.sim.metrics
    return name, seed, {
        "outage_s": float((b < 0.5).sum() * demo.dt),
        "mean_backhaul": float(b.mean()),
        "pois": int(m["pois_surveyed"]),
        "collisions": int(m["collisions"]),
        "closest_m": float(m["min_separation_ever_m"]),
    }


if __name__ == "__main__":
    jobs = [(n, s) for n in STRATEGIES for s in SEEDS]
    results = {n: {} for n in STRATEGIES}
    with ProcessPoolExecutor(max_workers=int(sys.argv[1]) if len(sys.argv) > 1 else 5) as pool:
        for name, seed, r in pool.map(run, jobs):
            results[name][seed] = r

    print(f"{'strategy':<31} {'outage s (mean)':>16} {'per terrain':>34} {'backhaul':>9} {'PoIs':>5} {'coll':>5}")
    summary = {}
    for name, per in results.items():
        outs = [per[s]["outage_s"] for s in SEEDS]
        summary[name] = {
            "outage_s_mean": float(np.mean(outs)), "outage_s_std": float(np.std(outs)),
            "mean_backhaul": float(np.mean([per[s]["mean_backhaul"] for s in SEEDS])),
            "collisions": int(sum(per[s]["collisions"] for s in SEEDS)),
            "pois_mean": float(np.mean([per[s]["pois"] for s in SEEDS])),
            "per_seed": per,
        }
        print(f"{name:<31} {np.mean(outs):8.1f} ± {np.std(outs):5.1f} "
              f"{' '.join(f'{o:5.1f}' for o in outs):>34} {summary[name]['mean_backhaul']:9.3f} "
              f"{summary[name]['pois_mean']:5.1f} {summary[name]['collisions']:5d}")

    Path("models").mkdir(exist_ok=True)
    with open("models/relay_strategies.json", "w") as f:
        json.dump({"seeds": SEEDS,
                   "strategies": {k: {"optimizer": v[0], "promote_scouts": v[1]}
                                  for k, v in STRATEGIES.items()},
                   "results": summary}, f, indent=2)
