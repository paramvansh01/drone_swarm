"""
E(3)-GNN relay topology tests.

The equivariance tests here are the load-bearing ones: Section 6 of the
proposal claims the learned relay placement "generalises across geometries
without retraining" *because* the network is equivariant. That is a
mathematical property, so it can be checked exactly rather than argued.
"""

import numpy as np
import torch

from gnn.equivariant_layer import E3MessagePassingLayer
from gnn.topology_net import (
    NODE_FEAT_DIM, TopologyNet, TopologyObjective, build_node_features,
)
from gnn.rf_differentiable import DifferentiableRF
from sim.terrain import build_terrain
from sim.world import World


def _random_scene(n=6, seed=0):
    rng = np.random.RandomState(seed)
    positions = torch.tensor(rng.uniform(-200, 200, (n, 3)), dtype=torch.float32)
    features = torch.tensor(rng.uniform(0, 1, (n, NODE_FEAT_DIM)), dtype=torch.float32)
    return positions, features


def _rotation_z(angle: float) -> torch.Tensor:
    c, s = np.cos(angle), np.sin(angle)
    return torch.tensor([[c, -s, 0.0], [s, c, 0.0], [0.0, 0.0, 1.0]],
                        dtype=torch.float32)


# --- equivariance ----------------------------------------------------------

def test_message_passing_layer_is_rotation_equivariant():
    """Rotating the input must rotate the output identically."""
    torch.manual_seed(0)
    layer = E3MessagePassingLayer(node_feat_dim=8, hidden_dim=16)
    layer.eval()

    positions, _ = _random_scene(n=5, seed=1)
    features = torch.randn(5, 8)
    edges = TopologyNet.build_fully_connected_edges(5)

    with torch.no_grad():
        pos_a, feat_a = layer(positions, features, edges)

        R = _rotation_z(0.7)
        pos_b, feat_b = layer(positions @ R.T, features, edges)

    # Coordinates rotate with the input
    assert torch.allclose(pos_b, pos_a @ R.T, atol=1e-4)
    # Scalar features are invariant
    assert torch.allclose(feat_b, feat_a, atol=1e-5)


def test_message_passing_layer_is_translation_equivariant():
    torch.manual_seed(0)
    layer = E3MessagePassingLayer(node_feat_dim=8, hidden_dim=16)
    layer.eval()

    positions, _ = _random_scene(n=5, seed=2)
    features = torch.randn(5, 8)
    edges = TopologyNet.build_fully_connected_edges(5)
    shift = torch.tensor([120.0, -45.0, 17.0])

    with torch.no_grad():
        pos_a, feat_a = layer(positions, features, edges)
        pos_b, feat_b = layer(positions + shift, features, edges)

    assert torch.allclose(pos_b, pos_a + shift, atol=1e-3)
    assert torch.allclose(feat_b, feat_a, atol=1e-5)


def test_topology_net_is_equivariant_end_to_end():
    """
    The whole network, not just one layer.

    This is the property that lets a network trained in one valley be used in
    a valley running a different direction without retraining — the claim the
    proposal makes about generalisation.
    """
    torch.manual_seed(3)
    model = TopologyNet(num_layers=3, hidden_dim=32)
    model.eval()

    positions, features = _random_scene(n=6, seed=3)
    movable = torch.tensor([False, True, True, True, False, False])

    R = _rotation_z(1.1)
    shift = torch.tensor([2000.0, 1500.0, 700.0])

    with torch.no_grad():
        out_a, gate_a = model(positions, features, movable_mask=movable)
        out_b, gate_b = model(positions @ R.T + shift, features, movable_mask=movable)

    expected = out_a @ R.T + shift
    assert torch.allclose(out_b, expected, atol=1e-2), (
        f"max deviation {float((out_b - expected).abs().max()):.4f}"
    )
    assert torch.allclose(gate_b, gate_a, atol=1e-5)


def test_topology_net_only_moves_movable_nodes():
    torch.manual_seed(4)
    model = TopologyNet(num_layers=3, hidden_dim=32)
    model.eval()

    positions, features = _random_scene(n=5, seed=5)
    movable = torch.tensor([False, True, False, True, False])

    with torch.no_grad():
        proposed, _ = model(positions, features, movable_mask=movable)

    for i, can_move in enumerate(movable):
        delta = float(torch.norm(proposed[i] - positions[i]))
        if can_move:
            continue
        assert delta < 1e-5, f"node {i} is fixed but moved {delta:.4f} m"


def test_displacement_is_bounded():
    """One forward pass must not teleport a relay across the map."""
    torch.manual_seed(6)
    model = TopologyNet(num_layers=4, hidden_dim=64, max_displacement=200.0)
    model.eval()

    positions, features = _random_scene(n=6, seed=7)
    movable = torch.ones(6, dtype=torch.bool)

    with torch.no_grad():
        proposed, _ = model(positions, features, movable_mask=movable)

    displacement = torch.norm(proposed - positions, dim=-1)
    assert float(displacement.max()) <= 200.0 + 1e-3


# --- differentiable RF -----------------------------------------------------

def test_differentiable_rf_matches_numpy_model():
    """
    The torch link model the GNN trains against must agree with the numpy one
    the simulation actually uses, or the network is optimising a fiction.
    """
    world = World()
    rf = DifferentiableRF(world.terrain.heightmap, world.terrain.config.size_m)
    cy = world.terrain.corridor_centerline_y

    rng = np.random.RandomState(0)
    deviations = []

    for _ in range(15):
        x1 = rng.uniform(400, 3200)
        y1 = float(cy(x1)) + rng.uniform(-400, 400)
        x2 = rng.uniform(400, 3200)
        y2 = float(cy(x2)) + rng.uniform(-400, 400)
        z1 = world.terrain.height_at(x1, y1) + rng.uniform(30, 300)
        z2 = world.terrain.height_at(x2, y2) + rng.uniform(30, 300)

        p1 = np.array([x1, y1, z1])
        p2 = np.array([x2, y2, z2])

        reference = world.compute_rf_occlusion_db(p1, p2)
        torch_value = float(rf.obstruction_db(
            torch.tensor(np.array([p1]), dtype=torch.float32),
            torch.tensor(np.array([p2]), dtype=torch.float32),
        )[0])
        deviations.append(abs(reference - torch_value))

    assert max(deviations) < 3.0, f"worst parity gap {max(deviations):.2f} dB"
    assert float(np.mean(deviations)) < 0.6


def test_rf_gradient_flows_to_position():
    """Gradients must reach node positions, or nothing can be optimised."""
    world = World()
    rf = DifferentiableRF(world.terrain.heightmap, world.terrain.config.size_m,
                          snr_softness_db=20.0)
    cy = world.terrain.corridor_centerline_y

    a = torch.tensor([[600.0, float(cy(600)), 760.0]])
    b = torch.tensor([[1700.0, float(cy(1700)) + 500.0, 780.0]], requires_grad=True)

    pdr = rf.link_pdr(a, b)
    pdr.sum().backward()

    assert b.grad is not None
    assert float(torch.abs(b.grad).sum()) > 0.0


def test_terrain_sampling_is_differentiable_and_correct():
    world = World()
    rf = DifferentiableRF(world.terrain.heightmap, world.terrain.config.size_m)

    points = torch.tensor([[1000.0, 2000.0], [1500.0, 2100.0]], requires_grad=True)
    heights = rf.sample_terrain(points)

    for i, (x, y) in enumerate([(1000.0, 2000.0), (1500.0, 2100.0)]):
        expected = world.terrain.height_at(x, y)
        assert abs(float(heights[i].detach()) - expected) < 2.0

    heights.sum().backward()
    assert points.grad is not None


def test_objective_penalises_separation_violation():
    world = World()
    rf = DifferentiableRF(world.terrain.heightmap, world.terrain.config.size_m)
    objective = TopologyObjective(rf, min_separation=50.0)

    cy = world.terrain.corridor_centerline_y
    base_z = world.terrain.height_at(800.0, float(cy(800))) + 150

    spread = torch.tensor([
        [500.0, float(cy(500)), base_z],
        [900.0, float(cy(900)), base_z],
        [1400.0, float(cy(1400)), base_z],
    ])
    stacked = torch.tensor([
        [500.0, float(cy(500)), base_z],
        [505.0, float(cy(500)), base_z],
        [1400.0, float(cy(1400)), base_z],
    ])

    _, spread_metrics = objective(spread, spread, 0, [2])
    _, stacked_metrics = objective(stacked, stacked, 0, [2])

    assert stacked_metrics["separation_violation_m"] > spread_metrics["separation_violation_m"]


# --- feature construction --------------------------------------------------

def test_build_node_features_excludes_dead_nodes():
    from sim.drone import Drone, DroneRole

    world = World()
    drones = {
        "GCS-RELAY": Drone("GCS-RELAY", np.array([400.0, 2200.0, 800.0]),
                           DroneRole.GCS_RELAY),
        "RELAY-1": Drone("RELAY-1", np.array([900.0, 2200.0, 850.0]), DroneRole.RELAY),
        "SCOUT-1": Drone("SCOUT-1", np.array([1400.0, 2200.0, 820.0]), DroneRole.SCOUT),
    }
    # Live aircraft are the ones with measured links; the failed one has none
    drones["GCS-RELAY"].neighbors = {"SCOUT-1": 0.9, "RELAY-1": 0.9}
    drones["SCOUT-1"].neighbors = {"GCS-RELAY": 0.9, "RELAY-1": 0.9}
    drones["RELAY-1"].neighbors = {"GCS-RELAY": 0.9, "SCOUT-1": 0.9}
    drones["RELAY-1"].kill()
    for d in drones.values():
        d.neighbors.pop("RELAY-1", None)

    positions, features, movable, ids = build_node_features(drones, world)

    # Two live aircraft plus the fixed ground station
    assert "RELAY-1" not in ids
    assert world.gcs.id in ids
    assert positions.shape[0] == 3
    assert features.shape == (3, NODE_FEAT_DIM)
    assert movable.shape[0] == 3


def test_build_node_features_marks_only_relays_movable():
    from sim.drone import Drone, DroneRole

    world = World()
    drones = {
        "GCS-RELAY": Drone("GCS-RELAY", np.array([400.0, 2200.0, 800.0]),
                           DroneRole.GCS_RELAY),
        "RELAY-1": Drone("RELAY-1", np.array([900.0, 2200.0, 850.0]), DroneRole.RELAY),
        "SCOUT-1": Drone("SCOUT-1", np.array([1400.0, 2200.0, 820.0]), DroneRole.SCOUT),
    }
    for d in drones.values():
        d.neighbors = {o: 0.9 for o in drones if o != d.id}
    _, _, movable, ids = build_node_features(drones, world)

    mapping = dict(zip(ids, movable.tolist()))
    assert mapping["RELAY-1"] is True
    assert mapping["SCOUT-1"] is False
    assert mapping["GCS-RELAY"] is False
    # The ground station is an immovable anchor carrying the GCS flag
    assert mapping[world.gcs.id] is False
