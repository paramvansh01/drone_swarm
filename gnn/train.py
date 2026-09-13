"""
Training the E(3)-equivariant relay topology network.

The network is trained *self-supervised* against the differentiable
terrain-aware link budget in `gnn.rf_differentiable` — there is no labelled
dataset of "correct" relay positions, and inventing one from a heuristic
would just teach the network to imitate the heuristic.

Instead, each training scenario randomises the valley geometry, the ground
station, the scouts and the initial relay placement; the network proposes
relay positions; the objective scores how well those positions actually
deliver packets through the real terrain; and the gradient flows back through
the diffraction model into the network weights.

Generalisation is checked the way the proposal claims it: evaluation
scenarios are drawn from *different terrain seeds* than training, and a
separate equivariance test confirms a rotated valley yields correspondingly
rotated relay positions with no retraining.

Usage:
    python -m gnn.train --epochs 220 --scenarios 24
"""

from __future__ import annotations

import argparse
import json
import logging
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import torch
import torch.optim as optim

from sim.terrain import build_terrain
from .rf_differentiable import DifferentiableRF
from .topology_net import (
    NODE_FEAT_DIM,
    TopologyNet,
    TopologyObjective,
)

logger = logging.getLogger("cdawn.gnn.train")


# --------------------------------------------------------------------------
# Scenario generation
# --------------------------------------------------------------------------

@dataclass
class Scenario:
    """One randomised relay-placement problem."""
    positions: torch.Tensor      # [N, 3] initial positions
    features: torch.Tensor       # [N, F]
    movable: torch.Tensor        # [N] bool
    gcs_index: int
    scout_indices: List[int]
    jamming_dbm: torch.Tensor | None


def make_scenario(terrain, rng: np.random.RandomState,
                  num_relays: int = 3, num_scouts: int = 2,
                  jamming_probability: float = 0.35,
                  rf: "DifferentiableRF | None" = None) -> Scenario:
    """
    Build a randomised mesh-placement problem in a given valley.

    The relays start at a deliberately naive placement — evenly spaced along
    the straight line from the ground station to the scout centroid, at a
    fixed height above the valley floor. That is roughly what a human would
    do with a map and no terrain analysis, so it is the configuration the
    network has to improve on.
    """
    cy = lambda x: float(terrain.corridor_centerline_y(x))

    gcs_x = rng.uniform(250.0, 500.0)
    gcs_y = cy(gcs_x) + rng.uniform(-60.0, 60.0)
    gcs_z = terrain.height_at(gcs_x, gcs_y) + rng.uniform(60.0, 120.0)
    gcs = [gcs_x, gcs_y, gcs_z]

    # Scouts are placed where the survey actually takes them: deep up-valley
    # and frequently pushed into side-draws off the main corridor, i.e. behind
    # intervening terrain. Keeping every scout in clear line-of-sight down the
    # middle of the valley would make the naive relay placement near-optimal
    # and leave the network nothing to learn.
    scouts = []
    for _ in range(num_scouts):
        sx = rng.uniform(1800.0, 3600.0)
        lateral = rng.uniform(-260.0, 260.0)
        if rng.random() < 0.6:
            # Off-corridor tasking: into a side valley, behind a ridge
            lateral = rng.choice([-1.0, 1.0]) * rng.uniform(320.0, 750.0)
        sy = cy(sx) + lateral
        sz = terrain.height_at(sx, sy) + rng.uniform(30.0, 110.0)
        scouts.append([sx, sy, sz])

    scout_centroid = np.mean(scouts, axis=0)

    relays = []
    for i in range(num_relays):
        frac = (i + 1) / (num_relays + 1)
        rx = gcs[0] + (scout_centroid[0] - gcs[0]) * frac
        ry = gcs[1] + (scout_centroid[1] - gcs[1]) * frac
        # Start low — in terrain shadow more often than not. Gaining the
        # altitude needed to clear a ridgeline is the behaviour we want the
        # network to discover, so it must not be handed that for free.
        rz = terrain.height_at(rx, ry) + rng.uniform(45.0, 95.0)
        # A little jitter so the network cannot memorise a fixed answer
        relays.append([rx + rng.uniform(-40, 40),
                       ry + rng.uniform(-40, 40),
                       rz + rng.uniform(-20, 20)])

    positions = np.array([gcs] + relays + scouts, dtype=np.float32)
    n = len(positions)

    gcs_index = 0
    relay_indices = list(range(1, 1 + num_relays))
    scout_indices = list(range(1 + num_relays, n))

    features = np.zeros((n, NODE_FEAT_DIM), dtype=np.float32)
    movable = np.zeros(n, dtype=bool)

    jamming = None
    jam_active = rng.random() < jamming_probability
    if jam_active:
        jam_level = rng.uniform(-88.0, -70.0)
        jamming = np.full((n, n), -200.0, dtype=np.float32)

    for i in range(n):
        ground = terrain.height_at(float(positions[i, 0]), float(positions[i, 1]))
        agl = float(positions[i, 2]) - ground

        features[i, 0] = rng.uniform(0.35, 1.0)            # battery
        features[i, 1] = 1.0 if i in scout_indices else 0.0
        features[i, 2] = 1.0 if i in relay_indices else 0.0
        features[i, 3] = 1.0 if i == gcs_index else 0.0
        features[i, 4] = 0.0    # mean link PDR — filled in below
        features[i, 5] = 0.0    # min  link PDR — filled in below
        features[i, 6] = (n - 1) / 8.0
        features[i, 7] = agl / 300.0
        features[i, 8] = 1.0 if jam_active else 0.0

        movable[i] = i in relay_indices

    jam_tensor = None
    if jamming is not None:
        jam_tensor = torch.tensor(
            np.full((n, n), jam_level, dtype=np.float32))

    # Populate the observed link-quality features from the *current* mesh
    # state. Without these the network is blind to which links are failing —
    # it would see only geometry and role, and could not tell a healthy
    # formation from one with a scout in a terrain shadow. It also matches
    # what `build_node_features` supplies at deployment from live telemetry;
    # leaving them zero here would train the network on a feature
    # distribution it never sees in flight.
    if rf is not None:
        pos_t = torch.tensor(positions)
        with torch.no_grad():
            pdr = rf.pairwise_pdr(pos_t, jam_tensor)
            eye = torch.eye(n, dtype=torch.bool)
            for i in range(n):
                row = pdr[i][~eye[i]]
                features[i, 4] = float(row.mean())
                features[i, 5] = float(row.min())

    return Scenario(
        positions=torch.tensor(positions),
        features=torch.tensor(features),
        movable=torch.tensor(movable),
        gcs_index=gcs_index,
        scout_indices=scout_indices,
        jamming_dbm=jam_tensor,
    )


# --------------------------------------------------------------------------
# Train / evaluate
# --------------------------------------------------------------------------

REFINEMENT_PASSES = 3


def run_network(model: TopologyNet, scenario: Scenario,
                passes: int = REFINEMENT_PASSES) -> torch.Tensor:
    """
    Apply the network iteratively.

    A single message-passing pass can only move a relay a bounded distance;
    running the same weights several times lets the configuration settle,
    which is also exactly how it is used online.
    """
    positions = scenario.positions
    for _ in range(passes):
        positions, _ = model(positions, scenario.features,
                             movable_mask=scenario.movable)
    return positions


def evaluate(model: TopologyNet, terrain, rf: DifferentiableRF,
             objective: TopologyObjective, seeds: List[int],
             num_relays: int = 0) -> Dict[str, float]:
    """
    Score the network against the naive baseline placement on held-out
    scenarios. Reports mean and standard deviation, as the proposal requires.
    """
    model.eval()
    gains, baselines, optimised, min_pdrs, times = [], [], [], [], []

    with torch.no_grad():
        for seed in seeds:
            rng = np.random.RandomState(seed)
            # Draw relay/scout counts from the same distribution as training,
            # otherwise held-out "difficulty" silently differs from training
            # difficulty and the two numbers are not comparable.
            sc = make_scenario(
                terrain, rng,
                num_relays=num_relays or int(rng.randint(2, 5)),
                num_scouts=int(rng.randint(1, 4)),
                rf=rf,
            )

            # Baseline: the naive placement the scenario started from
            _, base_metrics = objective(
                sc.positions, sc.positions, sc.gcs_index,
                sc.scout_indices, sc.jamming_dbm)

            t0 = time.perf_counter()
            proposed = run_network(model, sc)
            times.append((time.perf_counter() - t0) * 1000.0)

            _, opt_metrics = objective(
                proposed, sc.positions, sc.gcs_index,
                sc.scout_indices, sc.jamming_dbm)

            baselines.append(base_metrics["connectivity"])
            optimised.append(opt_metrics["connectivity"])
            gains.append(opt_metrics["connectivity"] - base_metrics["connectivity"])
            min_pdrs.append(opt_metrics["min_scout_pdr"])

    return {
        "baseline_connectivity_mean": float(np.mean(baselines)),
        "baseline_connectivity_std": float(np.std(baselines)),
        "optimised_connectivity_mean": float(np.mean(optimised)),
        "optimised_connectivity_std": float(np.std(optimised)),
        "connectivity_gain_mean": float(np.mean(gains)),
        "connectivity_gain_std": float(np.std(gains)),
        "min_scout_pdr_mean": float(np.mean(min_pdrs)),
        "inference_ms_mean": float(np.mean(times)),
        "scenarios": len(seeds),
    }


def train_topology_net(
    epochs: int = 220,
    scenarios_per_epoch: int = 24,
    learning_rate: float = 8e-4,
    num_layers: int = 4,
    hidden_dim: int = 64,
    train_terrain_seed: int = 4207,
    eval_terrain_seed: int = 90210,
    save_path: str = "models/topology_net.pt",
    metrics_path: str = "models/gnn_training_metrics.json",
    seed: int = 7,
) -> dict:
    """Train the relay topology network and save the best checkpoint."""
    torch.manual_seed(seed)
    rng = np.random.RandomState(seed)

    logger.info("Building terrains (train seed %d, eval seed %d)...",
                train_terrain_seed, eval_terrain_seed)
    train_terrain = build_terrain(seed=train_terrain_seed)
    eval_terrain = build_terrain(seed=eval_terrain_seed)

    # Two link models over the same physics, differing only in how sharply
    # the PDR sigmoid turns on:
    #
    #   TRAINING uses a deliberately soft threshold. With the deployed 3 dB
    #   softness a link sitting 40 dB below threshold has a sigmoid gradient
    #   of essentially zero, so "this scout is unreachable" carries no signal
    #   and the network can only learn to leave already-good links alone.
    #   Widening the transition keeps a usable gradient across the whole SNR
    #   range, so the optimiser can still feel which way to move a relay that
    #   is deep in a terrain shadow.
    #
    #   EVALUATION uses the real 3 dB threshold, so every number reported is
    #   against the deployed link model, not the training surrogate.
    TRAIN_SOFTNESS_DB = 20.0

    train_rf = DifferentiableRF(train_terrain.heightmap,
                                train_terrain.config.size_m,
                                snr_softness_db=TRAIN_SOFTNESS_DB)
    eval_rf = DifferentiableRF(eval_terrain.heightmap,
                               eval_terrain.config.size_m)
    eval_rf_train_terrain = DifferentiableRF(train_terrain.heightmap,
                                             train_terrain.config.size_m)

    train_obj = TopologyObjective(train_rf, w_effort=0.004)
    eval_obj = TopologyObjective(eval_rf)

    model = TopologyNet(num_layers=num_layers, hidden_dim=hidden_dim)
    param_count = sum(p.numel() for p in model.parameters() if p.requires_grad)
    logger.info("TopologyNet parameters: %d", param_count)

    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    eval_seeds = list(range(50_000, 50_012))
    history: List[dict] = []
    best_gain = -float("inf")
    t_start = time.time()

    for epoch in range(epochs):
        model.train()
        epoch_loss, epoch_conn = 0.0, 0.0

        # Step every MICROBATCH scenarios rather than once per epoch. A single
        # step per epoch gave the optimiser only `epochs` updates in total,
        # and averaging over a batch of scenarios drawn from wildly different
        # difficulty levels mostly averaged the signal away.
        MICROBATCH = 4
        accumulated = 0
        optimizer.zero_grad()

        for k in range(scenarios_per_epoch):
            sc = make_scenario(train_terrain, rng,
                               num_relays=int(rng.randint(2, 5)),
                               num_scouts=int(rng.randint(1, 4)),
                               rf=train_rf)

            proposed = run_network(model, sc)
            loss, metrics = train_obj(proposed, sc.positions, sc.gcs_index,
                                      sc.scout_indices, sc.jamming_dbm)
            (loss / MICROBATCH).backward()
            accumulated += 1

            epoch_loss += float(loss.detach()) / scenarios_per_epoch
            epoch_conn += metrics["connectivity"] / scenarios_per_epoch

            if accumulated == MICROBATCH or k == scenarios_per_epoch - 1:
                torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                optimizer.step()
                optimizer.zero_grad()
                accumulated = 0

        scheduler.step()

        if (epoch + 1) % 20 == 0 or epoch == 0:
            stats = evaluate(model, eval_terrain, eval_rf, eval_obj, eval_seeds)
            history.append({"epoch": epoch + 1, "loss": epoch_loss,
                            "train_connectivity": epoch_conn, **stats})
            logger.info(
                "epoch %3d/%d | loss %.4f | train conn %.3f | "
                "held-out gain %+.3f (base %.3f -> %.3f)",
                epoch + 1, epochs, epoch_loss, epoch_conn,
                stats["connectivity_gain_mean"],
                stats["baseline_connectivity_mean"],
                stats["optimised_connectivity_mean"],
            )

            if stats["connectivity_gain_mean"] > best_gain:
                best_gain = stats["connectivity_gain_mean"]
                Path(save_path).parent.mkdir(parents=True, exist_ok=True)
                torch.save({
                    "state_dict": model.state_dict(),
                    "num_layers": num_layers,
                    "hidden_dim": hidden_dim,
                    "eval": stats,
                }, save_path)
                logger.info("    -> new best, saved to %s", save_path)

    final = evaluate(model, eval_terrain, eval_rf, eval_obj,
                     list(range(60_000, 60_020)))

    metrics = {
        "param_count": param_count,
        "best_held_out_gain": best_gain,
        "final_eval": final,
        "history": history,
        "train_time_s": time.time() - t_start,
        "config": {
            "epochs": epochs,
            "scenarios_per_epoch": scenarios_per_epoch,
            "num_layers": num_layers,
            "hidden_dim": hidden_dim,
            "train_terrain_seed": train_terrain_seed,
            "eval_terrain_seed": eval_terrain_seed,
        },
    }
    Path(metrics_path).parent.mkdir(parents=True, exist_ok=True)
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    logger.info("Done in %.1fs | best held-out connectivity gain %+.3f",
                metrics["train_time_s"], best_gain)
    return metrics


def main():
    parser = argparse.ArgumentParser(description="Train the C-DAWN relay topology GNN")
    parser.add_argument("--epochs", type=int, default=220)
    parser.add_argument("--scenarios", type=int, default=24)
    parser.add_argument("--lr", type=float, default=8e-4)
    parser.add_argument("--layers", type=int, default=4)
    parser.add_argument("--hidden", type=int, default=64)
    parser.add_argument("--out", type=str, default="models/topology_net.pt")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s %(message)s",
        datefmt="%H:%M:%S",
    )

    metrics = train_topology_net(
        epochs=args.epochs,
        scenarios_per_epoch=args.scenarios,
        learning_rate=args.lr,
        num_layers=args.layers,
        hidden_dim=args.hidden,
        save_path=args.out,
    )
    print(json.dumps(metrics["final_eval"], indent=2))


if __name__ == "__main__":
    main()
