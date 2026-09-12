import numpy as np
from gnn.utils import compute_end_to_end_pdr


def test_compute_end_to_end_pdr():
    # Direct good link
    links = {
        "D1": {"D2": 0.95},
        "D2": {"D1": 0.95, "D3": 0.90},
        "D3": {"D2": 0.90}
    }
    pdr = compute_end_to_end_pdr(links, "D1", "D3", ["D1", "D2", "D3"])
    assert pdr > 0.80
    assert pdr <= 1.0


def test_gnn_layers_if_torch():
    try:
        import torch
        from gnn.utils import build_proximity_graph
        from gnn.equivariant_layer import EquivariantMessagePassingLayer
        from gnn.topology_net import TopologyGNN
        from gnn.relay_optimizer import RelayOptimizer
        
        positions = np.array([
            [0.0, 0.0, 10.0],
            [30.0, 0.0, 15.0],
            [60.0, 0.0, 20.0],
        ])
        edge_index, edge_dists = build_proximity_graph(positions, max_distance=50.0)
        assert edge_index.shape[0] == 2
        assert edge_index.shape[1] >= 2
        
        layer = EquivariantMessagePassingLayer(node_dim=4, edge_dim=1)
        x = torch.randn(3, 4)
        pos = torch.tensor(positions, dtype=torch.float32)
        v = torch.zeros(3, 3)
        edge_attr = edge_dists.unsqueeze(-1)
        
        dx, dv = layer(x, pos, v, edge_index, edge_attr)
        assert dx.shape == (3, 4)
        assert dv.shape == (3, 3)
    except ImportError:
        pass
