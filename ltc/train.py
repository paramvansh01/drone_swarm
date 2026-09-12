"""
Training loop for LTC flight controller.

Trains the LTC controller on expert PID trajectories + wind gust
rejection. Generates comparison plots: LTC vs PID tracking error.
"""

import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import json
import logging
from typing import List, Dict, Tuple
from pathlib import Path

from .ltc_controller import LTCFlightController
from .pid_baseline import CascadedPIDFlightController

logger = logging.getLogger("cdawn.ltc.train")


def generate_training_data(
    num_episodes: int = 100,
    episode_length: int = 200,
    dt: float = 0.02,
    seed: int = 42,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generate training data from expert PID controller.

    Runs the PID controller on random waypoint tasks with wind gusts,
    recording (state_error, control_output) pairs.

    Returns:
        (inputs, targets): arrays of shape [num_samples, seq_len, dim]
    """
    rng = np.random.RandomState(seed)
    pid = CascadedPIDFlightController()

    all_inputs = []
    all_targets = []

    for ep in range(num_episodes):
        pid.reset()

        # Random initial state
        pos = rng.uniform(-5, 5, 3).astype(np.float64)
        pos[2] = rng.uniform(10, 30)
        vel = rng.uniform(-2, 2, 3).astype(np.float64)
        target = rng.uniform(-10, 10, 3).astype(np.float64)
        target[2] = rng.uniform(10, 40)

        inputs_ep = []
        targets_ep = []

        for step in range(episode_length):
            # Wind with gusts
            base_wind = np.array([2.0, 0.5, 0.0])
            gust = np.zeros(3)
            if step % 50 < 15:  # periodic gust
                gust_mag = rng.uniform(3.0, 10.0)
                gust_dir = rng.normal(0, 1, 3)
                gust_dir /= np.linalg.norm(gust_dir) + 1e-8
                phase = (step % 50) / 15.0
                gust = gust_dir * gust_mag * 0.5 * (1 - np.cos(2 * np.pi * phase))
            wind = base_wind + gust + rng.normal(0, 0.5, 3)

            # State error
            pos_error = target - pos
            orient_error = np.zeros(3)

            # Expert PID control
            thrust, yaw_rate = pid.compute_control(pos_error, vel, wind, 0.0, dt)

            # Build input vector (same as LTC controller input)
            state_error = np.concatenate([
                pos_error,
                -vel,  # velocity error (target vel = 0)
                wind,
                orient_error,
            ])

            # Normalize expert output to [-1, 1]
            thrust_normalized = thrust / pid.max_thrust
            yaw_normalized = yaw_rate / pid.max_yaw_rate

            target_action = np.concatenate([thrust_normalized, [yaw_normalized]])

            inputs_ep.append(state_error)
            targets_ep.append(target_action)

            # Simulate (simplified physics for data generation)
            accel = thrust / pid.mass + np.array([0, 0, -9.81]) - 0.1 * vel + rng.normal(0, 0.1, 3)
            vel += accel * dt
            pos += vel * dt

        all_inputs.append(np.array(inputs_ep, dtype=np.float32))
        all_targets.append(np.array(targets_ep, dtype=np.float32))

    return np.array(all_inputs), np.array(all_targets)


def train_ltc_controller(
    num_episodes: int = 200,
    episode_length: int = 200,
    num_epochs: int = 50,
    batch_size: int = 16,
    learning_rate: float = 1e-3,
    hidden_size: int = 32,
    save_path: str = "ltc_controller.pt",
    seed: int = 42,
) -> Dict:
    """
    Train the LTC controller via behavioral cloning from PID expert.

    Returns:
        Training metrics dict.
    """
    logger.info("Generating training data from PID expert...")
    inputs, targets = generate_training_data(num_episodes, episode_length, seed=seed)

    # Convert to tensors
    inputs_t = torch.from_numpy(inputs)
    targets_t = torch.from_numpy(targets)

    # Create model
    controller = LTCFlightController(hidden_size=hidden_size)
    param_count = controller.count_parameters()
    logger.info(f"LTC controller parameters: {param_count}")

    # Training setup
    optimizer = optim.Adam(controller.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)
    criterion = nn.MSELoss()

    # Training loop
    n_train = int(0.85 * len(inputs_t))
    train_inputs, val_inputs = inputs_t[:n_train], inputs_t[n_train:]
    train_targets, val_targets = targets_t[:n_train], targets_t[n_train:]

    best_val_loss = float('inf')
    metrics = {"train_loss": [], "val_loss": [], "param_count": param_count}

    for epoch in range(num_epochs):
        controller.train()
        epoch_loss = 0.0
        n_batches = 0

        # Shuffle
        perm = torch.randperm(n_train)
        train_inputs = train_inputs[perm]
        train_targets = train_targets[perm]

        for i in range(0, n_train, batch_size):
            batch_in = train_inputs[i:i+batch_size]
            batch_tgt = train_targets[i:i+batch_size]

            # Forward pass through sequence
            batch_size_actual, seq_len, input_dim = batch_in.shape
            h = None
            all_outputs = []

            for t in range(seq_len):
                action, h = controller(batch_in[:, t, :], h, dt=0.02)
                # Normalize action back for loss
                action_norm = action.clone()
                action_norm[:, :3] /= controller.max_thrust
                action_norm[:, 3:] /= controller.max_yaw_rate
                all_outputs.append(action_norm)

            outputs = torch.stack(all_outputs, dim=1)
            loss = criterion(outputs, batch_tgt)

            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(controller.parameters(), 1.0)
            optimizer.step()

            epoch_loss += loss.item()
            n_batches += 1

        avg_train_loss = epoch_loss / max(n_batches, 1)

        # Validation
        controller.eval()
        with torch.no_grad():
            h = None
            val_outputs = []
            for t in range(val_inputs.shape[1]):
                action, h = controller(val_inputs[:, t, :], h, dt=0.02)
                action_norm = action.clone()
                action_norm[:, :3] /= controller.max_thrust
                action_norm[:, 3:] /= controller.max_yaw_rate
                val_outputs.append(action_norm)
            val_out = torch.stack(val_outputs, dim=1)
            val_loss = criterion(val_out, val_targets).item()

        metrics["train_loss"].append(avg_train_loss)
        metrics["val_loss"].append(val_loss)

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(controller.state_dict(), save_path)

        scheduler.step()

        if (epoch + 1) % 10 == 0:
            logger.info(
                f"Epoch {epoch+1}/{num_epochs} | "
                f"Train: {avg_train_loss:.6f} | Val: {val_loss:.6f} | "
                f"Best: {best_val_loss:.6f}"
            )

    logger.info(f"Training complete. Best val loss: {best_val_loss:.6f}")
    logger.info(f"Model saved to {save_path}")

    return metrics


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    metrics = train_ltc_controller(
        num_episodes=100,
        num_epochs=30,
        save_path="models/ltc_controller.pt",
    )
    print(f"Final train loss: {metrics['train_loss'][-1]:.6f}")
    print(f"Final val loss: {metrics['val_loss'][-1]:.6f}")
    print(f"Parameter count: {metrics['param_count']}")
