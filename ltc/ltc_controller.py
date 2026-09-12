"""
LTC-based flight controller for C-DAWN.

Wraps the LTC cell into a closed-loop attitude/velocity correction
controller that takes state error + wind estimate as input and
outputs corrective thrust/torque commands.
"""

import torch
import torch.nn as nn
import numpy as np
from typing import Optional, Tuple

from .ltc_cell import LTCCell


class LTCFlightController(nn.Module):
    """
    LTC-based flight controller.

    Input (12D):
        - Position error (3D): target_pos - current_pos
        - Velocity error (3D): target_vel - current_vel
        - Wind estimate (3D): estimated wind velocity
        - Orientation error (3D): roll/pitch/yaw errors

    Output (4D):
        - Thrust corrections (3D): [fx, fy, fz] in body frame
        - Yaw rate command (1D)

    Total parameters target: < 20k
    """

    # Controller dimensions
    INPUT_DIM = 12
    HIDDEN_DIM = 32
    OUTPUT_DIM = 4

    def __init__(
        self,
        hidden_size: int = 32,
        num_ode_steps: int = 6,
        max_thrust: float = 30.0,
        max_yaw_rate: float = 2.0,
    ):
        super().__init__()
        self.max_thrust = max_thrust
        self.max_yaw_rate = max_yaw_rate
        self.hidden_size = hidden_size

        # Input normalization
        self.input_norm = nn.LayerNorm(self.INPUT_DIM)

        # LTC cell
        self.ltc = LTCCell(
            input_size=self.INPUT_DIM,
            hidden_size=hidden_size,
            num_ode_steps=num_ode_steps,
        )

        # Output mapping
        self.output_net = nn.Sequential(
            nn.Linear(hidden_size, 16),
            nn.Tanh(),
            nn.Linear(16, self.OUTPUT_DIM),
            nn.Tanh(),  # output in [-1, 1], scaled to action space
        )

        # Hidden state (maintained across calls for temporal continuity)
        self._hidden = None

    def reset_hidden(self, batch_size: int = 1):
        """Reset the hidden state."""
        self._hidden = torch.zeros(batch_size, self.hidden_size)

    def forward(
        self,
        state_error: torch.Tensor,
        h_prev: Optional[torch.Tensor] = None,
        dt: float = 0.02,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass.

        Args:
            state_error: [batch, 12] state error vector
            h_prev: Previous hidden state
            dt: Timestep

        Returns:
            (action, h_new): action [batch, 4], new hidden state
        """
        # Normalize input
        x = self.input_norm(state_error)

        # LTC step
        h_new, _ = self.ltc(x, h_prev, dt)

        # Map to actions
        raw_action = self.output_net(h_new)

        # Scale to physical ranges
        thrust = raw_action[:, :3] * self.max_thrust
        yaw_rate = raw_action[:, 3:4] * self.max_yaw_rate

        action = torch.cat([thrust, yaw_rate], dim=-1)
        return action, h_new

    @torch.no_grad()
    def compute_control(
        self,
        position_error: np.ndarray,
        velocity_error: np.ndarray,
        wind_estimate: np.ndarray,
        orientation_error: np.ndarray,
        dt: float = 0.02,
    ) -> Tuple[np.ndarray, float]:
        """
        Compute control output from numpy arrays (inference mode).

        This is the main interface called by the simulation runner.

        Args:
            position_error: [3] target_pos - current_pos
            velocity_error: [3] target_vel - current_vel
            wind_estimate: [3] estimated wind velocity
            orientation_error: [3] roll/pitch/yaw errors

        Returns:
            (thrust_command, yaw_rate): thrust [3] in body frame, yaw rate scalar
        """
        # Build input vector
        state_error = np.concatenate([
            position_error,
            velocity_error,
            wind_estimate,
            orientation_error,
        ]).astype(np.float32)

        state_tensor = torch.from_numpy(state_error).unsqueeze(0)

        # Initialize hidden if needed
        if self._hidden is None:
            self._hidden = torch.zeros(1, self.hidden_size)

        # Forward
        action, self._hidden = self.forward(state_tensor, self._hidden, dt)

        # Extract
        action_np = action.squeeze(0).numpy()
        thrust = action_np[:3]
        yaw_rate = float(action_np[3])

        return thrust, yaw_rate

    def count_parameters(self) -> int:
        return sum(p.numel() for p in self.parameters() if p.requires_grad)


def make_ltc_controller_hook(controller: LTCFlightController, mass: float = 1.5):
    """
    Create a controller hook function for the simulation runner.

    Returns a callable with signature:
        controller_hook(drone, wind_vel, sim_time, dt)
    """
    def controller_hook(drone, wind_vel, sim_time, dt):
        if drone.target_position is None:
            # Hover
            drone.thrust_command = np.array([0.0, 0.0, mass * 9.81])
            drone.yaw_rate_command = 0.0
            return

        # Compute errors
        pos_error = drone.target_position - drone.position
        vel_error = -drone.velocity  # target velocity is 0 (hover at target)
        wind_est = drone.sensors.wind_estimate
        orient_error = np.zeros(3)  # simplified

        # LTC inference
        thrust, yaw_rate = controller.compute_control(
            pos_error, vel_error, wind_est, orient_error, dt
        )

        # Add gravity compensation
        thrust[2] += mass * 9.81

        drone.thrust_command = thrust
        drone.yaw_rate_command = yaw_rate

    return controller_hook
