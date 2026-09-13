"""
Wind field model for C-DAWN simulation.

Provides base wind, turbulence (Dryden model approximation),
and discrete gust injection for LTC controller benchmarking.
"""

import numpy as np
from typing import Optional, List
from dataclasses import dataclass, field


@dataclass
class GustEvent:
    """A discrete wind gust event."""
    start_time: float       # seconds
    duration: float         # seconds
    direction: np.ndarray   # unit vector
    magnitude: float        # m/s (peak)
    profile: str = "sine"   # "sine", "step", "ramp"

    def get_velocity(self, t: float) -> np.ndarray:
        """Get gust velocity at time t."""
        if t < self.start_time or t > self.start_time + self.duration:
            return np.zeros(3)

        elapsed = t - self.start_time
        fraction = elapsed / self.duration

        if self.profile == "step":
            amplitude = self.magnitude
        elif self.profile == "ramp":
            amplitude = self.magnitude * min(fraction * 2, 1.0) * (1 - max(0, (fraction - 0.5) * 2))
        else:  # sine (1 - cos)
            amplitude = self.magnitude * 0.5 * (1 - np.cos(2 * np.pi * fraction))

        return self.direction * amplitude


class WindField:
    """
    Wind field model.

    Combines:
    1. Constant base wind (steady-state)
    2. Dryden turbulence model (continuous random)
    3. Discrete gust events (injectable for testing)
    """

    def __init__(
        self,
        base_wind: np.ndarray = None,
        turbulence_intensity: float = 1.0,
        turbulence_scale: float = 50.0,  # meters (spatial correlation length)
        seed: int = 42,
        terrain=None,
    ):
        """
        Args:
            base_wind: Steady-state wind velocity [vx, vy, vz] (m/s).
            turbulence_intensity: Turbulence gain factor (0 = calm, 3 = severe).
            turbulence_scale: Spatial scale of turbulence eddies (m).
            seed: Random seed.
        """
        self.base_wind = base_wind if base_wind is not None else np.array([2.0, 0.5, 0.0])
        self.turbulence_intensity = turbulence_intensity
        self.turbulence_scale = turbulence_scale
        self._rng = np.random.RandomState(seed)

        # Terrain is needed to compute height *above ground*, which is what
        # the boundary-layer profile actually depends on.
        self.terrain = terrain

        # Reference height for the power-law profile (m AGL) and the shear
        # exponent. 0.16 sits between open country (0.14) and rough/broken
        # terrain (0.20), which is right for a rocky mountain valley.
        self.reference_height_m = 10.0
        self.shear_exponent = 0.16
        self.max_shear_factor = 2.2

        # Dryden filter state (discrete-time approximation)
        self._turb_state = np.zeros(3)
        self._dt_prev = 0.02

        # Gust events
        self.gusts: List[GustEvent] = []

        # Wind history for visualization
        self._history: List[dict] = []

    def _dryden_turbulence(self, dt: float, airspeed: float = 10.0) -> np.ndarray:
        """
        Simplified Dryden turbulence model.

        Approximates the MIL-F-8785C standard with a first-order
        discrete-time filter driven by white noise.
        """
        if airspeed < 0.1:
            airspeed = 0.1

        # Time constants for each axis
        tau = self.turbulence_scale / airspeed
        alpha = dt / (tau + dt)  # first-order filter coefficient

        # Turbulence standard deviations (proportional to intensity)
        sigma = self.turbulence_intensity * np.array([1.5, 1.5, 0.8])  # m/s

        # White noise input
        noise = self._rng.normal(0, 1, 3) * sigma

        # First-order filter
        self._turb_state = (1 - alpha) * self._turb_state + alpha * noise

        return self._turb_state.copy()

    def add_gust(
        self,
        start_time: float,
        duration: float = 3.0,
        direction: np.ndarray = None,
        magnitude: float = 8.0,
        profile: str = "sine",
    ):
        """Schedule a discrete gust event."""
        if direction is None:
            # Random horizontal gust
            angle = self._rng.uniform(0, 2 * np.pi)
            direction = np.array([np.cos(angle), np.sin(angle), 0.0])
        else:
            direction = np.array(direction, dtype=np.float64)
            norm = np.linalg.norm(direction)
            if norm > 0:
                direction /= norm

        self.gusts.append(GustEvent(
            start_time=start_time,
            duration=duration,
            direction=direction,
            magnitude=magnitude,
            profile=profile,
        ))

    def get_wind_at(
        self,
        position: np.ndarray,
        sim_time: float,
        dt: float = 0.02,
    ) -> np.ndarray:
        """
        Get wind velocity at a given position and time.

        Args:
            position: World position [x, y, z] (m).
            sim_time: Current simulation time (s).
            dt: Timestep for turbulence filter update.

        Returns:
            Wind velocity vector [vx, vy, vz] (m/s) in world frame.
        """
        # Base wind, scaled by the atmospheric boundary-layer profile.
        #
        # Wind shear is a function of height ABOVE GROUND, not altitude above
        # sea level. Using absolute altitude here (as an earlier version did)
        # multiplied the wind by the terrain elevation: at a 900 m valley
        # floor it produced 120 m/s, roughly twice the strongest tornado ever
        # recorded, which no controller can or should hold station in.
        #
        # The power law v(h) = v_ref * (h / h_ref)^alpha is the standard
        # engineering profile, and it is capped because it is only valid
        # within the surface layer.
        ground = (self.terrain.height_at(float(position[0]), float(position[1]))
                  if self.terrain is not None else 0.0)
        agl = max(float(position[2]) - ground, 0.5)

        shear = (agl / self.reference_height_m) ** self.shear_exponent
        shear = float(np.clip(shear, 0.25, self.max_shear_factor))

        wind = self.base_wind * shear

        # Turbulence, roughened by convective rainfall
        rough = getattr(self, "rain_turbulence", 1.0)
        wind += self._dryden_turbulence(dt, airspeed=np.linalg.norm(self.base_wind) + 5.0) * rough

        # Mountain-wave / downdraught cells: a strong sink inside the cell,
        # tapering to nothing at its edge. This is what pushes an aircraft
        # into the ground if it flies through one.
        for cell in getattr(self, "cells", ()):
            offset = np.asarray(position[:2], dtype=float) - cell["centre"]
            reach = float(np.linalg.norm(offset))
            if reach < cell["radius"]:
                falloff = 0.5 * (1.0 + np.cos(np.pi * reach / cell["radius"]))
                wind = wind + np.array([cell["drift"][0] * 0.25 * falloff,
                                        cell["drift"][1] * 0.25 * falloff,
                                        cell["w_z"] * falloff])

        # Discrete gusts
        for gust in self.gusts:
            wind += gust.get_velocity(sim_time)

        return wind

    def inject_random_gusts(self, start_time: float, num_gusts: int = 5, interval: float = 10.0):
        """
        Schedule multiple random gust events for benchmarking.

        Used to generate the wind-gust profile for LTC vs PID comparison.
        """
        for i in range(num_gusts):
            t = start_time + i * interval + self._rng.uniform(-2, 2)
            magnitude = self._rng.uniform(5.0, 12.0)
            duration = self._rng.uniform(1.5, 5.0)
            profiles = ["sine", "step", "ramp"]
            self.add_gust(
                start_time=t,
                duration=duration,
                magnitude=magnitude,
                profile=self._rng.choice(profiles),
            )

    def set_base_wind(self, wind: np.ndarray):
        """Update the base wind vector."""
        self.base_wind = np.array(wind, dtype=np.float64)

    def set_turbulence_intensity(self, intensity: float):
        """Set turbulence intensity (0=calm, 3=severe)."""
        self.turbulence_intensity = max(0.0, intensity)

    def get_state(self) -> dict:
        """Serialize wind field state for telemetry."""
        return {
            "base_wind": self.base_wind.tolist(),
            "turbulence_intensity": self.turbulence_intensity,
            "active_gusts": sum(1 for g in self.gusts if True),  # simplified
            "total_gusts": len(self.gusts),
        }

    @classmethod
    def from_config(cls, config: dict) -> "WindField":
        """Create WindField from scenario configuration."""
        return cls(
            base_wind=np.array(config.get("base_wind", [2.0, 0.5, 0.0])),
            turbulence_intensity=config.get("turbulence_intensity", 1.0),
            turbulence_scale=config.get("turbulence_scale", 50.0),
            seed=config.get("seed", 42),
        )
