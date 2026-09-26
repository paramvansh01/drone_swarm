"""
Online causal diagnostics for C-DAWN.

Implements Recursive Least Squares (RLS) for online coefficient
updating as telemetry streams in, plus anomaly detection and
root-cause ranking.
"""

import numpy as np
import logging
from typing import Dict, List, Optional, Tuple

from .causal_dag import CausalDAG

logger = logging.getLogger("cdawn.scm.diagnostics")


class OnlineDiagnostics:
    """
    Online causal diagnostics engine.

    Uses Recursive Least Squares (RLS) to continuously update
    the SCM coefficients as new telemetry arrives, then uses
    the updated model for:
    1. Anomaly detection (L exceeds threshold)
    2. Root-cause ranking (largest |β_i * X_i|)
    3. Intervention recommendations
    """

    def __init__(
        self,
        dag: Optional[CausalDAG] = None,
        forgetting_factor: float = 0.98,
        loss_threshold: float = 0.15,
        min_observations: int = 10,
    ):
        """
        Args:
            dag: CausalDAG instance (created if None).
            forgetting_factor: RLS forgetting factor λ ∈ (0, 1].
                Lower = faster adaptation, less memory.
            loss_threshold: Packet loss threshold for anomaly trigger.
            min_observations: Minimum observations before RLS updates.
        """
        self.dag = dag or CausalDAG()
        self.lambda_ = forgetting_factor
        self.loss_threshold = loss_threshold
        self.min_observations = min_observations

        # RLS state
        n_params = 6  # [β₀, β_T, β_D, β_J, β_θ, β_W]

        # Covariance initialised at 10, not 100. The structural coefficients
        # have physics-informed priors that are already roughly right, so
        # declaring near-total ignorance just invites the first few noisy
        # observations to throw them a long way.
        self.P = np.eye(n_params) * 10.0
        self.theta_rls = self.dag.get_beta_vector()

        # Admissible range for each coefficient. The signs are known from
        # physics — more terrain obstruction, more range and more jamming can
        # only ever increase packet loss, and better antenna alignment can
        # only decrease it — and the magnitudes are bounded by what a logistic
        # link can mean over inputs normalised to [0, 1].
        #
        # Without this the estimator wanders: the regressors are strongly
        # collinear in normal flight (distance and terrain obstruction rise
        # together as a drone flies up the valley), so the likelihood surface
        # has a long flat valley and RLS slides along it to values like
        # beta_theta = -27, which fit equally well and mean nothing. Bounding
        # the parameters keeps the fitted model interpretable, which is the
        # entire reason for having a structural model rather than a regressor.
        self.beta_bounds = np.array([
            [-6.0,  2.0],    # beta_0   intercept
            [ 0.0,  8.0],    # beta_T   terrain occlusion
            [ 0.0,  8.0],    # beta_D   distance
            [ 0.0, 10.0],    # beta_J   jamming
            [-6.0,  0.0],    # beta_theta  antenna alignment
            [ 0.0,  8.0],    # beta_W   weather (rain, turbulence)
        ])

        # Observation buffer
        self._obs_buffer: List[dict] = []
        self._anomaly_log: List[dict] = []
        self._diagnosis_log: List[dict] = []

    def _build_feature_vector(self, T: float, D: float, J: float, theta: float,
                              W: float = 0.0) -> np.ndarray:
        """Build the feature vector [1, T, D, J, θ, W] for RLS."""
        return np.array([1.0, T, D, J, theta, W])

    def update(
        self,
        occlusion_db: float,
        distance_m: float,
        noise_floor_dbm: float,
        antenna_factor: float,
        observed_loss: float,
        sim_time: float,
        link_id: str = "",
        weather: float = 0.0,
    ) -> Dict:
        """
        Process a new observation and update the SCM.

        Args:
            occlusion_db: Measured RF occlusion (dB).
            distance_m: Distance between nodes (m).
            noise_floor_dbm: Effective noise floor (dBm).
            antenna_factor: Antenna alignment factor [0, 1].
            observed_loss: Observed packet loss rate [0, 1].
            sim_time: Current simulation time.
            link_id: Identifier for this link.

        Returns:
            Diagnosis result dict.
        """
        # Normalize observations
        T, D, J, theta = self.dag.normalize_observations(
            occlusion_db, distance_m, noise_floor_dbm, antenna_factor
        )

        W = float(np.clip(weather, 0.0, 1.0))

        # Store observation
        obs = {
            "time": sim_time,
            "link_id": link_id,
            "T": T, "D": D, "J": J, "theta": theta, "W": W,
            "observed_loss": observed_loss,
        }
        self._obs_buffer.append(obs)
        if len(self._obs_buffer) > 1000:
            self._obs_buffer = self._obs_buffer[-500:]

        # RLS update
        if len(self._obs_buffer) >= self.min_observations:
            self._rls_update(T, D, J, theta, observed_loss, W)

        # Update DAG variable values
        self.dag.variables["T"].value = T
        self.dag.variables["D"].value = D
        self.dag.variables["J"].value = J
        self.dag.variables["θ"].value = theta
        self.dag.variables["W"].value = W
        self.dag.variables["L"].value = observed_loss

        # Predict loss with current model
        predicted_loss = self.dag.predict_loss(T, D, J, theta, W)

        # Anomaly detection
        is_anomaly = observed_loss > self.loss_threshold
        prediction_error = abs(observed_loss - predicted_loss)

        # Root cause analysis
        root_cause, contribution = self.dag.identify_root_cause(T, D, J, theta, W)
        contributions = self.dag.compute_causal_contributions(T, D, J, theta, W)

        diagnosis = {
            "time": sim_time,
            "link_id": link_id,
            "observed_loss": observed_loss,
            "predicted_loss": predicted_loss,
            "prediction_error": prediction_error,
            "is_anomaly": is_anomaly,
            "root_cause": root_cause,
            "root_cause_contribution": contribution,
            "contributions": contributions,
            "coefficients": dict(self.dag.beta),
            "variables": {"T": T, "D": D, "J": J, "θ": theta, "W": W},
        }

        if is_anomaly:
            self._anomaly_log.append(diagnosis)
            if len(self._anomaly_log) > 200:
                self._anomaly_log = self._anomaly_log[-100:]

        self._diagnosis_log.append(diagnosis)
        if len(self._diagnosis_log) > 500:
            self._diagnosis_log = self._diagnosis_log[-300:]

        self.dag.record_beta()

        return diagnosis

    def _rls_update(self, T: float, D: float, J: float, theta: float, y: float,
                    W: float = 0.0):
        """
        Recursive Least Squares update.

        Updates the parameter estimate θ_rls using the new observation (x, y)
        where x is the feature vector and y is observed packet loss.

        Uses the logistic model linearization for compatibility with the
        sigmoid structural equation.
        """
        x = self._build_feature_vector(T, D, J, theta, W)

        # Predicted output (linear part before sigmoid)
        y_hat_linear = np.dot(self.theta_rls, x)
        y_hat = 1.0 / (1.0 + np.exp(-np.clip(y_hat_linear, -20, 20)))

        # For RLS with nonlinear model, we use the gradient of the sigmoid
        # as a weighting factor (Gauss-Newton approximation)
        sigmoid_grad = y_hat * (1 - y_hat) + 1e-6

        # Innovation
        innovation = y - y_hat

        # RLS gain
        Px = self.P @ x
        denominator = self.lambda_ + x @ Px
        K = Px / denominator

        # Update parameter estimate, then project back into the admissible set
        self.theta_rls = self.theta_rls + K * innovation * sigmoid_grad
        self.theta_rls = np.clip(
            self.theta_rls, self.beta_bounds[:, 0], self.beta_bounds[:, 1])

        # Update covariance
        self.P = (self.P - np.outer(K, Px)) / self.lambda_

        # Symmetrise: the update above is algebraically symmetric but not
        # numerically, and asymmetry accumulates into indefiniteness.
        self.P = 0.5 * (self.P + self.P.T)

        # Keep the covariance positive definite and bounded. With a
        # forgetting factor below 1 the covariance grows without bound in
        # directions the data does not excite ("covariance wind-up"), and a
        # single observation in such a direction then produces an enormous
        # correction.
        eigenvalues = np.linalg.eigvalsh(self.P)
        if np.min(eigenvalues) < 1e-6:
            self.P += np.eye(len(self.theta_rls)) * 1e-4
        max_eig = float(np.max(eigenvalues))
        if max_eig > 1e4:
            self.P *= 1e4 / max_eig

        # Update DAG coefficients
        self.dag.set_beta_vector(self.theta_rls)

    def get_latest_diagnosis(self) -> Optional[Dict]:
        """Get the most recent diagnosis."""
        return self._diagnosis_log[-1] if self._diagnosis_log else None

    def get_anomaly_count(self) -> int:
        """Get total anomaly count."""
        return len(self._anomaly_log)

    def get_recent_anomalies(self, n: int = 10) -> List[Dict]:
        """Get the N most recent anomalies."""
        return self._anomaly_log[-n:]

    def get_state(self) -> dict:
        """Serialize diagnostics state for dashboard."""
        latest = self.get_latest_diagnosis()
        return {
            "dag": self.dag.get_state(),
            "latest_diagnosis": latest,
            "anomaly_count": self.get_anomaly_count(),
            "total_observations": len(self._obs_buffer),
            "rls_parameters": self.theta_rls.tolist(),
        }


def make_scm_diagnostics_hook(diagnostics: OnlineDiagnostics):
    """
    Create an SCM diagnostics hook for the simulation runner.

    Returns a callable: hook(drones, world, rf_channel, sim_time)
    """
    def hook(drones, world, rf_channel, sim_time):
        # Diagnose each active link
        alive = [d for d in drones.values() if d.is_alive]

        for i, d1 in enumerate(alive):
            for j, d2 in enumerate(alive):
                if i >= j:
                    continue

                distance = float(np.linalg.norm(d1.position - d2.position))
                occlusion = world.compute_rf_occlusion_db(d1.position, d2.position)
                antenna = d1.get_antenna_pose_factor(d2.position)
                # Measured at the receivers, not read from the channel model
                readings = [x for x in (getattr(d1.sensors, "noise_dbm", None),
                                        getattr(d2.sensors, "noise_dbm", None)) if x is not None]
                noise = max(readings) if readings else rf_channel.base_noise_floor

                # Observed loss = 1 - link_quality
                link_quality = d1.neighbors.get(d2.id, 0.5)
                observed_loss = 1.0 - link_quality

                diagnostics.update(
                    occlusion_db=occlusion,
                    distance_m=distance,
                    noise_floor_dbm=noise,
                    antenna_factor=antenna,
                    observed_loss=observed_loss,
                    sim_time=sim_time,
                    link_id=f"{d1.id}<->{d2.id}",
                )

    return hook
