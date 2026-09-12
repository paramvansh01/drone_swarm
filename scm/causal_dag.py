"""
Structural Causal Model (SCM) DAG definition for C-DAWN.

Implements the causal DAG from the proposal:

    Terrain Occlusion (T) ──┐
                             ├──> Packet Loss (L) <── Jamming/Noise (J)
    Distance (D) ───────────┤
                             │
    Antenna Pose (θ) ────────┘

Structural equation:
    L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_θ·θ + ε)
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger("cdawn.scm")


@dataclass
class CausalVariable:
    """A variable in the causal DAG."""
    name: str
    symbol: str
    description: str
    unit: str = ""
    value: float = 0.0
    min_val: float = 0.0
    max_val: float = 1.0


class CausalDAG:
    """
    Structural Causal Model for RF link diagnostics.

    Variables:
        T: Terrain Occlusion — normalized RF attenuation from obstacles [0, 1]
        D: Distance — normalized distance between drones [0, 1]
        J: Jamming/Noise — normalized noise floor elevation [0, 1]
        θ: Antenna Pose — antenna alignment factor [0, 1]
        L: Packet Loss — observed packet loss rate [0, 1]

    Structural Equation:
        L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_θ·θ + ε)

    where σ is the sigmoid function.

    Coefficients are initialized from physics priors and updated
    online via Recursive Least Squares (RLS).
    """

    def __init__(self):
        # Causal variables
        self.variables = {
            "T": CausalVariable("terrain_occlusion", "T", "RF attenuation from terrain", "dB_norm"),
            "D": CausalVariable("distance", "D", "Normalized inter-drone distance", "m_norm"),
            "J": CausalVariable("jamming_noise", "J", "Noise floor elevation", "dB_norm"),
            "θ": CausalVariable("antenna_pose", "θ", "Antenna alignment factor", ""),
            "L": CausalVariable("packet_loss", "L", "Observed packet loss rate", ""),
        }

        # Structural equation coefficients (physics-informed priors)
        self.beta = {
            "β₀": -2.0,   # intercept (bias toward low loss in nominal conditions)
            "β_T": 3.0,    # terrain occlusion has strong effect
            "β_D": 2.5,    # distance has moderate-strong effect
            "β_J": 4.0,    # jamming has the strongest direct effect
            "β_θ": 1.5,    # antenna misalignment has moderate effect
        }

        # DAG edges (parent → child)
        self.edges = [
            ("T", "L"),
            ("D", "L"),
            ("J", "L"),
            ("θ", "L"),
        ]

        # History for coefficient tracking
        self.beta_history: List[Dict[str, float]] = []
        self.observation_count = 0

    def sigmoid(self, x: float) -> float:
        """Numerically stable sigmoid."""
        if x >= 0:
            return 1.0 / (1.0 + np.exp(-x))
        else:
            ex = np.exp(x)
            return ex / (1.0 + ex)

    def predict_loss(self, T: float, D: float, J: float, theta: float) -> float:
        """
        Predict packet loss using the structural equation.

        L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_θ·θ)
        """
        linear = (
            self.beta["β₀"]
            + self.beta["β_T"] * T
            + self.beta["β_D"] * D
            + self.beta["β_J"] * J
            + self.beta["β_θ"] * theta
        )
        return self.sigmoid(linear)

    def compute_causal_contributions(
        self, T: float, D: float, J: float, theta: float
    ) -> Dict[str, float]:
        """
        Compute the causal contribution of each variable to packet loss.

        Returns each β_i * X_i term, showing which factor contributes
        most to the current loss level.
        """
        contributions = {
            "terrain": self.beta["β_T"] * T,
            "distance": self.beta["β_D"] * D,
            "jamming": self.beta["β_J"] * J,
            "antenna": self.beta["β_θ"] * theta,
            "bias": self.beta["β₀"],
        }
        return contributions

    def identify_root_cause(
        self, T: float, D: float, J: float, theta: float
    ) -> Tuple[str, float]:
        """
        Identify the dominant root cause of packet loss.

        Returns the variable with the largest |β_i * X_i| contribution.
        """
        contributions = self.compute_causal_contributions(T, D, J, theta)
        # Exclude bias
        variable_contributions = {
            k: abs(v) for k, v in contributions.items() if k != "bias"
        }
        root_cause = max(variable_contributions, key=variable_contributions.get)
        return root_cause, variable_contributions[root_cause]

    def normalize_observations(
        self,
        occlusion_db: float,
        distance_m: float,
        noise_floor_dbm: float,
        antenna_factor: float,
        max_occlusion_db: float = 30.0,
        max_distance_m: float = 200.0,
        nominal_noise_dbm: float = -100.0,
        max_noise_elevation_db: float = 40.0,
    ) -> Tuple[float, float, float, float]:
        """
        Normalize raw observations to [0, 1] for the SCM.

        Returns:
            (T, D, J, θ): normalized values.
        """
        T = min(occlusion_db / max_occlusion_db, 1.0)
        D = min(distance_m / max_distance_m, 1.0)
        J = max(0, min((noise_floor_dbm - nominal_noise_dbm) / max_noise_elevation_db, 1.0))
        theta = 1.0 - antenna_factor  # invert: 1 = worst alignment
        return T, D, J, theta

    def get_beta_vector(self) -> np.ndarray:
        """Get coefficient vector [β₀, β_T, β_D, β_J, β_θ]."""
        return np.array([
            self.beta["β₀"],
            self.beta["β_T"],
            self.beta["β_D"],
            self.beta["β_J"],
            self.beta["β_θ"],
        ])

    def set_beta_vector(self, beta: np.ndarray):
        """Set coefficient vector."""
        keys = ["β₀", "β_T", "β_D", "β_J", "β_θ"]
        for i, key in enumerate(keys):
            self.beta[key] = float(beta[i])

    def record_beta(self):
        """Record current coefficients to history."""
        self.beta_history.append(dict(self.beta))
        self.observation_count += 1

    def get_state(self) -> dict:
        """Serialize DAG state for dashboard."""
        return {
            "variables": {
                k: {"value": v.value, "symbol": v.symbol, "description": v.description}
                for k, v in self.variables.items()
            },
            "coefficients": dict(self.beta),
            "edges": self.edges,
            "observation_count": self.observation_count,
        }
