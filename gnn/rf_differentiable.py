"""
Differentiable RF link-budget model for training the relay topology GNN.

The production RF path (`sim.rf_channel` + `sim.world.compute_rf_occlusion_db`)
does a numpy raycast against the terrain heightmap. That is correct but opaque
to autograd, which means a network cannot learn from it.

This module reimplements the same physics in torch:

    terrain sampling  -> bilinear `grid_sample` on the heightmap
    obstruction       -> ITU-R P.526 single knife-edge diffraction
    link budget       -> Friis + obstruction + noise
    packet delivery   -> smooth sigmoid on link margin

Every operation is differentiable with respect to node positions, so the
gradient of "end-to-end packet delivery to this scout" flows all the way back
to "where should the relay sit" — including *through the terrain*. That is
what lets the GNN discover for itself that gaining altitude over a ridgeline
restores a link, rather than being told so by a hand-written rule.

The numerical constants are kept in sync with `sim.rf_channel.RFChannel`;
`bench/verify_rf_parity.py` checks the two implementations agree.
"""

from __future__ import annotations

import numpy as np
import torch
import torch.nn.functional as F
from typing import Optional


C_LIGHT = 299_792_458.0


class DifferentiableRF:
    """Torch implementation of the C-DAWN link budget."""

    def __init__(
        self,
        heightmap: np.ndarray,
        terrain_size_m: float,
        frequency_mhz: float = 900.0,
        tx_power_dbm: float = 27.0,
        antenna_gain_dbi: float = 3.0,
        noise_floor_dbm: float = -100.0,
        snr_threshold_db: float = 8.0,
        snr_softness_db: float = 3.0,
        path_samples: int = 32,
        device: str = "cpu",
    ):
        self.device = torch.device(device)
        self.terrain_size_m = float(terrain_size_m)
        self.frequency_hz = frequency_mhz * 1e6
        self.wavelength_m = C_LIGHT / self.frequency_hz

        self.tx_power_dbm = tx_power_dbm
        self.antenna_gain_dbi = antenna_gain_dbi
        self.noise_floor_dbm = noise_floor_dbm
        self.snr_threshold_db = snr_threshold_db
        self.snr_softness_db = snr_softness_db
        self.path_samples = path_samples
        # Weather loss on the link budget (wet antennas/radome in rain), set
        # by the optimiser from the live channel state.
        self.extra_loss_db = 0.0
        # Located hostile emitters: [(position [3] tensor, power_dbm)]. Set by
        # the relay optimiser from the EW geolocation; empty otherwise.
        self.emitters = []

        # [1, 1, H, W] for grid_sample
        self.heightmap = torch.tensor(
            np.asarray(heightmap, dtype=np.float32), device=self.device
        ).unsqueeze(0).unsqueeze(0)

        # Constant part of the Friis equation
        self.fspl_const = (20.0 * np.log10(self.frequency_hz)
                           + 20.0 * np.log10(4.0 * np.pi / C_LIGHT))

    # -- terrain ------------------------------------------------------------

    def sample_terrain(self, xy: torch.Tensor) -> torch.Tensor:
        """
        Bilinearly sample terrain elevation at world XY coordinates.

        Args:
            xy: [..., 2] world coordinates in metres.

        Returns:
            [...] elevations in metres, differentiable w.r.t. `xy`.
        """
        shape = xy.shape[:-1]
        flat = xy.reshape(-1, 2)

        # World metres -> normalised [-1, 1] grid coordinates
        norm = flat / self.terrain_size_m * 2.0 - 1.0
        norm = norm.clamp(-1.0, 1.0)

        # grid_sample expects [N, H_out, W_out, 2] with (x, y) ordering
        grid = norm.unsqueeze(0).unsqueeze(0)          # [1, 1, K, 2]

        sampled = F.grid_sample(
            self.heightmap, grid,
            mode="bilinear", padding_mode="border", align_corners=True,
        )                                              # [1, 1, 1, K]

        return sampled.reshape(shape)

    # -- link budget --------------------------------------------------------

    def obstruction_db(self, p1: torch.Tensor, p2: torch.Tensor) -> torch.Tensor:
        """
        Terrain diffraction loss (dB) for a batch of links.

        Args:
            p1, p2: [B, 3] endpoint positions.

        Returns:
            [B] obstruction loss in dB.
        """
        B = p1.shape[0]
        S = self.path_samples

        t = torch.linspace(0.0, 1.0, S, device=p1.device).view(1, S, 1)

        # [B, S, 3] points along each path
        pts = p1.unsqueeze(1) + t * (p2 - p1).unsqueeze(1)

        ground = self.sample_terrain(pts[..., :2])     # [B, S]
        line_z = pts[..., 2]                           # [B, S]

        total_d = torch.norm(p2[:, :2] - p1[:, :2], dim=-1).clamp(min=1.0)  # [B]

        d1 = (t.view(1, S) * total_d.view(B, 1)).clamp(min=1.0)
        d2 = (total_d.view(B, 1) - d1).clamp(min=1.0)

        # First Fresnel zone radius at each sample
        r1 = torch.sqrt(self.wavelength_m * d1 * d2 / total_d.view(B, 1)).clamp(min=1e-3)

        # Diffraction parameter v = h * sqrt(2) / r1
        h = ground - line_z
        v = h * np.sqrt(2.0) / r1                      # [B, S]

        # Ignore the two samples at each antenna
        v = v[:, 2:-2] if S > 6 else v

        # Smooth maximum over the profile. A hard max would give a gradient
        # to exactly one sample point and make the loss surface jagged; the
        # log-sum-exp keeps every near-grazing ridge contributing.
        v_max = torch.logsumexp(v * 4.0, dim=-1) / 4.0

        return self.knife_edge_loss_db(v_max)

    @staticmethod
    def knife_edge_loss_db(v: torch.Tensor) -> torch.Tensor:
        """
        ITU-R P.526 knife-edge diffraction loss J(v), smoothly gated.

        The published formula is only valid for v > -0.78 and is defined as 0
        below that. A hard cutoff would put a discontinuity in the gradient
        exactly where the optimiser spends its time (right at the edge of
        Fresnel clearance), so the gate is a sigmoid instead.
        """
        shifted = v - 0.1
        raw = 6.9 + 20.0 * torch.log10(
            torch.sqrt(shifted * shifted + 1.0) + shifted + 1e-9
        )
        gate = torch.sigmoid((v + 0.78) * 6.0)
        return F.relu(raw) * gate

    def link_pdr(self, p1: torch.Tensor, p2: torch.Tensor,
                 jamming_dbm: Optional[torch.Tensor] = None) -> torch.Tensor:
        """
        Packet delivery ratio in [0, 1] for a batch of links.

        Args:
            p1, p2: [B, 3] endpoints.
            jamming_dbm: optional [B] elevated noise floor.

        Returns:
            [B] differentiable PDR estimates.
        """
        distance = torch.norm(p2 - p1, dim=-1).clamp(min=1.0)

        fspl = 20.0 * torch.log10(distance) + self.fspl_const
        obstruction = self.obstruction_db(p1, p2)

        rssi = (self.tx_power_dbm + 2.0 * self.antenna_gain_dbi
                - fspl - obstruction - self.extra_loss_db)

        noise = self.noise_floor_dbm
        if jamming_dbm is not None:
            # Noise powers add in the linear domain
            noise = 10.0 * torch.log10(
                10.0 ** (self.noise_floor_dbm / 10.0)
                + 10.0 ** (jamming_dbm / 10.0)
            )

        snr = rssi - noise

        # Smooth stand-in for the BER waterfall: a hard threshold has zero
        # gradient everywhere, which would give the optimiser nothing to
        # descend until a link happens to flip state.
        return torch.sigmoid((snr - self.snr_threshold_db) / self.snr_softness_db)

    # -- network-level objective -------------------------------------------

    def pairwise_pdr(self, positions: torch.Tensor,
                     jamming_dbm: Optional[torch.Tensor] = None) -> torch.Tensor:
        """
        Full [N, N] PDR matrix for a set of nodes.

        Args:
            positions: [N, 3]

        Returns:
            [N, N] symmetric PDR matrix with a zero diagonal.
        """
        n = positions.shape[0]
        idx_i, idx_j = torch.meshgrid(
            torch.arange(n, device=positions.device),
            torch.arange(n, device=positions.device),
            indexing="ij",
        )
        flat_i, flat_j = idx_i.reshape(-1), idx_j.reshape(-1)

        jam = None
        if jamming_dbm is not None:
            jam = jamming_dbm.reshape(-1)

        # Located jammers: interference at each node depends on where the
        # node is — distance AND the terrain between it and the emitter — so
        # it is computed from the positions being optimised. The gradient then
        # moves relays out of the jammer's line of sight (terrain masking).
        if self.emitters:
            node_jam = None
            for pos, power in self.emitters:
                src = pos.to(positions).view(1, 3).expand(n, 3)
                d = torch.norm(positions - src, dim=-1).clamp(min=5.0)
                rx = (power + 3.0 - (20.0 * torch.log10(d) + self.fspl_const)
                      - self.obstruction_db(src, positions))
                lin = 10.0 ** (rx / 10.0)
                node_jam = lin if node_jam is None else node_jam + lin
            node_jam = 10.0 * torch.log10(node_jam + 1e-20)
            # A link is only as good as its worse end
            link_jam = torch.maximum(node_jam.view(n, 1), node_jam.view(1, n)).reshape(-1)
            jam = link_jam if jam is None else 10.0 * torch.log10(
                10.0 ** (jam / 10.0) + 10.0 ** (link_jam / 10.0))

        pdr = self.link_pdr(positions[flat_i], positions[flat_j], jam)
        pdr = pdr.reshape(n, n)

        # Zero the diagonal and symmetrise
        eye = torch.eye(n, device=positions.device, dtype=pdr.dtype)
        pdr = pdr * (1.0 - eye)
        return 0.5 * (pdr + pdr.t())

    @staticmethod
    def best_path_reliability(pdr_matrix: torch.Tensor, source: int,
                              target: int, max_hops: int = 4,
                              temperature: float = 12.0) -> torch.Tensor:
        """
        Soft best-path reliability from `source` to `target`.

        Uses a differentiable relaxation of Dijkstra on -log(PDR): the
        recursion is the usual "best reliability reachable in <= k hops", but
        the max over predecessors is replaced by a temperature-controlled
        softmax so the gradient reaches every candidate route rather than only
        the currently-best one. As temperature grows this converges to the
        true maximum-reliability path.
        """
        n = pdr_matrix.shape[0]
        eps = 1e-6

        # reliability[k] = best reliability from source to each node in <= k hops
        reliability = torch.full((n,), eps, device=pdr_matrix.device,
                                dtype=pdr_matrix.dtype)
        reliability = reliability.clone()
        reliability[source] = 1.0

        for _ in range(max_hops):
            # candidate[i, j] = reliability of reaching j via i
            candidates = reliability.unsqueeze(1) * pdr_matrix     # [N, N]
            # Include staying put (already-achieved reliability)
            candidates = torch.cat([candidates, reliability.unsqueeze(0)], dim=0)

            weights = torch.softmax(candidates * temperature, dim=0)
            reliability = (weights * candidates).sum(dim=0)

        return reliability[target]
