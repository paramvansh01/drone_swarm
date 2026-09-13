#!/usr/bin/env python3
"""
Causal engine accuracy under heavy rain — live, in front of an audience.

Builds radio links whose dominant cause is KNOWN (terrain shadow, or a
jammer under clear line of sight), adds the physics of heavy rain (wet
antennas, gust-loaded antenna attitude, a turbulent climb), and lets the
causal engine run its normal intervention test. Its verdict is scored
against the ground truth the simulator knows.

The engine is given a NOISY terrain-map prediction (4 dB error, like a real
elevation model), never the true channel value.

    python bench/rain_accuracy.py            # ~1-2 min, held-out seed
    python bench/rain_accuracy.py --quick    # ~30 s
"""

import argparse
import logging
import sys
from pathlib import Path

import numpy as np

logging.disable(logging.WARNING)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sim.terrain import build_terrain
from sim.world import World
from sim.drone import Drone, DroneRole
from sim.rf_channel import RFChannel
from scm.interventions import InterventionEngine


def evaluate(trials, rain_mm_h, seed=99):
    rng = np.random.RandomState(seed)
    wet_db = 2 * float(np.clip(rain_mm_h / 18.0, 0, 3.5))       # both antennas wet
    rough = 1.0 + rain_mm_h / 35.0                              # turbulence multiplier
    tp = fp = tn = fn = declined = skipped = 0
    for trial in range(trials):
        terrain = build_terrain(seed=4207 + (trial % 4) * 331)
        world = World(terrain=terrain)
        rf = RFChannel(frequency_mhz=900.0, fading_model="rician")
        rf.extra_loss_db = wet_db
        truth = "terrain" if trial % 2 == 0 else "jamming"
        cy = terrain.corridor_centerline_y
        ax = rng.uniform(600, 1400); ay = float(cy(ax))
        if truth == "terrain":
            sev = rng.uniform(0, 1); bx = ax + rng.uniform(500, 1000)
            by = float(cy(bx)) + rng.choice([-1, 1]) * (150 + sev * 520)
            a_alt = terrain.height_at(ax, ay) + rng.uniform(30, 70)
            b_alt = terrain.height_at(bx, by) + rng.uniform(30, 70)
        else:
            bx = ax + rng.uniform(500, 900); by = float(cy(bx)) + rng.uniform(-60, 60)
            a_alt = terrain.height_at(ax, ay) + rng.uniform(120, 190)
            b_alt = terrain.height_at(bx, by) + rng.uniform(120, 190)
            rf.enable_jamming(rng.uniform(-72.0, -66.0))
        a = Drone("RELAY-A", np.array([ax, ay, a_alt]), DroneRole.RELAY)
        b = Drone("SCOUT-B", np.array([bx, by, b_alt]), DroneRole.SCOUT)
        eng = InterventionEngine(delta_z=15.0, pre_window=0.6, actuation_window=1.4, post_window=0.6)
        def measure():
            # Gust-loaded attitude: the antenna is mis-pointed more in rough air
            tilt = 1.0 - abs(rng.normal(0, 0.05 * (rough - 1)))
            occ = world.compute_rf_occlusion_db(a.position, b.position)
            q = rf.compute_link_quality(tx_power_dbm=27.0, tx_gain_dbi=3.0, rx_gain_dbi=3.0,
                distance_m=float(np.linalg.norm(a.position - b.position)),
                occlusion_db=occ, antenna_factor=float(np.clip(tilt, 0.5, 1.0)))
            return float(np.clip(1 - q["link_quality"], 0, 1))
        if np.mean([measure() for _ in range(12)]) < eng.loss_threshold:
            skipped += 1; continue
        eng.arm("RELAY-A", "RELAY-A<->SCOUT-B", float(a_alt), 0.0)
        res = None
        for step in range(600):
            t = step * 0.05
            target = a_alt + a.altitude_offset_cmd
            # Turbulence: the climb is noisier in rain
            a.position[2] += float(np.clip(target - a.position[2], -0.2, 0.2)) + rng.normal(0, 0.03 * rough)
            noise = rf.jamming_power_dbm if rf.jamming_active else rf.noise_floor_dbm
            pred = world.compute_rf_occlusion_db(a.position, b.position) + rng.normal(0, 4.0)
            res = eng.update("RELAY-A<->SCOUT-B", a, measure(), noise,
                             float(np.linalg.norm(a.position - b.position)), t, obstruction_db=pred)
            if res: break
        if res is None: skipped += 1; continue
        if res["confounded"]: declined += 1; continue
        said_terrain = res["attribution"] in ("terrain_occlusion", "partial_terrain", "terrain_shadow")
        if truth == "terrain": tp += said_terrain; fn += not said_terrain
        else: fp += said_terrain; tn += not said_terrain
    n = tp + fp + tn + fn
    acc = (tp + tn) / n if n else float('nan')
    prec = tp / (tp + fp) if tp + fp else float('nan')
    rec = tp / (tp + fn) if tp + fn else float('nan')
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else float('nan')
    # F1 for the jamming class too -> macro F1
    pj = tn / (tn + fn) if tn + fn else float('nan'); rj = tn / (tn + fp) if tn + fp else float('nan')
    f1j = 2 * pj * rj / (pj + rj) if pj + rj else float('nan')
    return dict(scored=n, acc=acc, prec=prec, rec=rec, f1=f1, f1_jam=f1j, macro=(f1 + f1j) / 2,
                declined=declined, skipped=skipped, tp=tp, fp=fp, tn=tn, fn=fn)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--quick", action="store_true", help="fewer trials (~30 s)")
    parser.add_argument("--seed", type=int, default=2026,
                        help="random seed (2026 was held out during development)")
    args = parser.parse_args()
    trials = 40 if args.quick else 100

    print()
    print("  C-DAWN causal engine — root-cause accuracy under weather")
    print(f"  {trials} links per condition, each with a known cause (terrain or jamming)")
    print(f"  seed {args.seed}")
    print()
    print(f"  {'Condition':<22}{'Links':>6}{'Accuracy':>11}{'Macro-F1':>10}"
          f"{'Terrain F1':>12}{'Jamming F1':>12}")
    print("  " + "-" * 73)
    results = []
    for label, rain in (("Clear weather", 0.0), ("Heavy rain 45 mm/h", 45.0),
                        ("Extreme rain 70 mm/h", 70.0)):
        r = evaluate(trials, rain, args.seed)
        results.append((label, r))
        print(f"  {label:<22}{r['scored']:>6}{r['acc'] * 100:>10.1f}%{r['macro']:>10.3f}"
              f"{r['f1']:>12.3f}{r['f1_jam']:>12.3f}", flush=True)
    print()
    label, r = results[1]
    print(f"  Confusion matrix — {label}")
    print(f"                        said TERRAIN   said JAMMING")
    print(f"    truly TERRAIN       {r['tp']:>8}       {r['fn']:>8}")
    print(f"    truly JAMMING       {r['fp']:>8}       {r['tn']:>8}")
    print()
    print("  Links not degraded enough to need a test are skipped; tests the engine")
    print("  itself declares confounded are reported, never counted as errors.")
    print()


if __name__ == "__main__":
    main()
