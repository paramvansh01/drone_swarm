"""
Liquid Time-Constant (LTC) neural ODE cell for C-DAWN.

Implements the LTC differential equation from Hasani et al. (2021):
  dx/dt = -(1/τ(x,I)) * x + (1/τ(x,I)) * f(x, I; θ)

where τ(x,I) is the input-dependent effective time constant,
enabling continuous-time adaptive behavior under varying inputs
(e.g., wind gusts, attitude perturbations).

Target: < 20k parameters for edge deployment.
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Optional, Tuple


class LTCCell(nn.Module):
    """
    Liquid Time-Constant ODE Cell.

    A single-step ODE cell that computes state updates with
    input-dependent time constants. Can be integrated with
    forward Euler or RK4.
    """

    def __init__(
        self,
        input_size: int,
        hidden_size: int,
        num_ode_steps: int = 6,
    ):
        """
        Args:
            input_size: Dimension of input vector.
            hidden_size: Dimension of hidden state.
            num_ode_steps: Number of ODE sub-steps per cell call (higher = more accurate).
        """
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_ode_steps = num_ode_steps

        # f(x, I; θ) — nonlinear activation mapping
        self.f_net = nn.Sequential(
            nn.Linear(input_size + hidden_size, hidden_size),
            nn.Tanh(),
            nn.Linear(hidden_size, hidden_size),
            nn.Tanh(),
        )

        # τ(x, I) — input-dependent time constant (must be > 0)
        self.tau_net = nn.Sequential(
            nn.Linear(input_size + hidden_size, hidden_size),
            nn.Sigmoid(),  # output in (0, 1), scaled to tau range
        )

        # Time constant range [tau_min, tau_max]
        self.tau_min = 0.01
        self.tau_max = 2.0

        # Gating (optional — adds expressivity)
        self.gate = nn.Sequential(
            nn.Linear(input_size + hidden_size, hidden_size),
            nn.Sigmoid(),
        )

    def _compute_tau(self, x: torch.Tensor, inp: torch.Tensor) -> torch.Tensor:
        """Compute input-dependent time constant τ(x, I)."""
        combined = torch.cat([x, inp], dim=-1)
        tau_raw = self.tau_net(combined)
        # Scale to [tau_min, tau_max]
        tau = self.tau_min + (self.tau_max - self.tau_min) * tau_raw
        return tau

    def _compute_f(self, x: torch.Tensor, inp: torch.Tensor) -> torch.Tensor:
        """Compute the target activation f(x, I; θ)."""
        combined = torch.cat([x, inp], dim=-1)
        return self.f_net(combined)

    def _ode_step(
        self,
        x: torch.Tensor,
        inp: torch.Tensor,
        dt: float,
    ) -> torch.Tensor:
        """
        Single ODE integration step (forward Euler).

        dx/dt = -(1/τ) * x + (1/τ) * f(x, I)
        x_new = x + dx/dt * dt
        """
        tau = self._compute_tau(x, inp)
        f_val = self._compute_f(x, inp)

        # LTC dynamics
        dx_dt = (-x + f_val) / tau

        # Gate
        combined = torch.cat([x, inp], dim=-1)
        g = self.gate(combined)

        x_new = x + g * dx_dt * dt
        return x_new

    def forward(
        self,
        inp: torch.Tensor,
        h_prev: Optional[torch.Tensor] = None,
        dt: float = 0.02,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass: integrate ODE for one external timestep.

        Args:
            inp: Input tensor [batch, input_size]
            h_prev: Previous hidden state [batch, hidden_size] (or None for zeros)
            dt: External timestep (seconds)

        Returns:
            (output, h_new): Output and new hidden state, both [batch, hidden_size]
        """
        if h_prev is None:
            h_prev = torch.zeros(inp.shape[0], self.hidden_size, device=inp.device)

        # Sub-stepping for numerical stability
        sub_dt = dt / self.num_ode_steps
        h = h_prev

        for _ in range(self.num_ode_steps):
            h = self._ode_step(h, inp, sub_dt)

        return h, h

    def count_parameters(self) -> int:
        """Count total trainable parameters."""
        return sum(p.numel() for p in self.parameters() if p.requires_grad)


class LTCSequence(nn.Module):
    """
    LTC applied over a sequence of inputs.

    Processes a time series by unrolling the LTC cell,
    maintaining hidden state across timesteps.
    """

    def __init__(
        self,
        input_size: int,
        hidden_size: int,
        output_size: int,
        num_ode_steps: int = 6,
    ):
        super().__init__()
        self.cell = LTCCell(input_size, hidden_size, num_ode_steps)
        self.output_layer = nn.Linear(hidden_size, output_size)

    def forward(
        self,
        inputs: torch.Tensor,
        dt: float = 0.02,
        h0: Optional[torch.Tensor] = None,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Process a sequence.

        Args:
            inputs: [batch, seq_len, input_size]
            dt: Timestep
            h0: Initial hidden state [batch, hidden_size]

        Returns:
            (outputs, h_final): outputs [batch, seq_len, output_size], final hidden state
        """
        batch_size, seq_len, _ = inputs.shape
        h = h0

        outputs = []
        for t in range(seq_len):
            h, _ = self.cell(inputs[:, t, :], h, dt)
            out = self.output_layer(h)
            outputs.append(out)

        outputs = torch.stack(outputs, dim=1)
        return outputs, h

    def count_parameters(self) -> int:
        return sum(p.numel() for p in self.parameters() if p.requires_grad)
