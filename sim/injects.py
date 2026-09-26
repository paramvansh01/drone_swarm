"""
Environmental injects — the conditions that make a disaster zone hard to fly.

The mission scenario's disturbances (UAV failures, communication outages,
packet loss, new tasks — see `mission.disturbances`) test the swarm's
autonomy. These injects add the environment around them, and can be thrown in
live from the dashboard or from a scenario's `weather` / `battery_fault`
entries:

    heavy_rain        Monsoon rainfall: turbulence, a lower cloud base the swarm
                      must fly under, wet-antenna loss, higher power draw.
    storm_cell        A drifting mountain-wave / downdraught cell that will
                      push an aircraft into the ground if it flies through.
    gps_denial        GNSS degradation in a deep valley (multipath, blocked
                      sky): navigation drifts until the swarm notices and falls
                      back to terrain-relative navigation.
    equipment_fault   A motor / battery-cell fault on one aircraft: reduced
                      thrust and double the power draw.

Every inject acts on the physics, not on the display: rain changes the wind
field and the link budget, the storm cell changes the vertical wind an
aircraft actually feels, GNSS degradation changes the position the guidance
layer believes. The swarm's response is therefore a real response, and the
causal layer has to work out which of several simultaneous stressors is
responsible for what it is seeing.
"""

from __future__ import annotations

import numpy as np

from sim.drone import DroneRole, DroneStatus

KINDS = ("heavy_rain", "storm_cell", "gps_denial", "equipment_fault")


class MissionInjects:
    """Owns every environmental stressor and applies it to the physics."""

    NAV_DRIFT_MS = 1.6            # GPS-denied position drift, m/s
    NAV_DRIFT_CAP = 140.0

    def __init__(self, world, wind, rf, guidance, log, seed: int = 11):
        self.world = world
        self.wind = wind
        self.rf = rf
        self.guidance = guidance
        self.log = log
        self.rng = np.random.default_rng(seed)
        self.reset()

    CLEAR_CEILING_AGL = 300.0     # working ceiling in clear weather

    # Cloud base vs rain rate, fitted to the monsoon weather dataset
    # (data/weather/, tools/make_weather_dataset.py). Falls back to the
    # fitted values below if the file is missing.
    _CLOUD_FIT = {"a": -359.0, "b": 1428.0, "r2": 0.80}
    try:
        import json as _json
        from pathlib import Path as _Path
        _CLOUD_FIT = _json.loads(
            (_Path(__file__).resolve().parent.parent / "data" / "weather"
             / "fitted_model.json").read_text())["cloud_base_agl_m"]
    except Exception:
        pass

    @classmethod
    def _cloud_base(cls, rate: float) -> float:
        """
        Cloud base (m AGL) for a rain rate, from the fitted weather model.

        Heavier rain means a lower cloud base: the air is closer to saturation,
        so it is lifted less before it condenses (Espy's dew-point rule). The
        aircraft have to fly under it, which in a valley means dropping below
        the ridge line.
        """
        fit = cls._CLOUD_FIT
        base = fit["a"] * np.log1p(max(rate, 0.0)) + fit["b"]
        return float(np.clip(base, 70.0, cls.CLEAR_CEILING_AGL))

    def reset(self):
        self.rain_mm_h = 0.0
        self.cloud_base_agl = None
        self.world.ceiling_agl = None
        self.cells = []           # storm / downdraught cells
        self.denial = []          # GNSS degradation zones
        self.faults = {}
        self.nav_fallback = False
        self._counter = 0
        self.wind.rain_turbulence = 1.0
        self.wind.cells = []

    # -- injects --------------------------------------------------------------

    def inject(self, kind: str, params: dict, drones: dict, sim_time: float):
        params = params or {}
        if kind not in KINDS:
            raise ValueError(f"unknown inject: {kind} (one of {', '.join(KINDS)})")
        return getattr(self, f"_inject_{kind}")(params, drones, sim_time)

    def _inject_heavy_rain(self, params, drones, sim_time):
        rate = float(params.get("rate_mm_h", 45.0))
        self.rain_mm_h = rate
        self.cloud_base_agl = self._cloud_base(rate)
        # The true cloud base lives in the world; the swarm finds it with its
        # optical sensors (mesh/awareness.py), it is not told
        self.world.ceiling_agl = self.cloud_base_agl
        # Convective rain is turbulent: the wind field gets rougher with it
        self.wind.rain_turbulence = 1.0 + rate / 35.0
        self.log("WEATHER", f"Heavy monsoon rainfall inbound — {rate:.0f} mm/h, cloud base down to "
                            f"{self.cloud_base_agl:.0f} m AGL. Turbulence up, "
                            f"optical detection range down, wet-antenna loss "
                            f"{self.antenna_loss_db():.1f} dB per aircraft, power draw up "
                            f"{(self.power_factor() - 1) * 100:.0f}%.", {"rate_mm_h": rate})
        return {"rate_mm_h": rate}

    def _inject_storm_cell(self, params, drones, sim_time):
        size = self.world.terrain.config.size_m
        live = [d for d in drones.values() if d.is_alive]
        if "x" in params and "y" in params:
            centre = np.array([float(params["x"]), float(params["y"])])
        elif live:
            # Drop it in front of the swarm, where it matters
            lead = max(live, key=lambda d: d.position[0])
            centre = lead.position[:2] + np.array([600.0, self.rng.uniform(-250, 250)])
        else:
            centre = np.array([size * 0.5, size * 0.5])
        cell = {
            "id": f"CELL-{len(self.cells) + 1}",
            "centre": np.clip(centre, 200.0, size - 200.0),
            "radius": float(params.get("radius_m", 520.0)),
            "w_z": -float(params.get("downdraught_ms", 9.0)),
            "drift": np.array([float(params.get("drift_x", -7.0)),
                               float(params.get("drift_y", 2.0))]),
        }
        self.cells.append(cell)
        self.wind.cells = self.cells
        self.log("WEATHER", f"Mountain-wave cell {cell['id']} at "
                            f"({cell['centre'][0]:.0f}, {cell['centre'][1]:.0f}), "
                            f"{cell['radius']:.0f} m across, {-cell['w_z']:.0f} m/s "
                            "downdraught, drifting down-valley.", {"cell": cell["id"]})
        return {"cell": cell["id"]}

    def _inject_gps_denial(self, params, drones, sim_time):
        size = self.world.terrain.config.size_m
        live = [d for d in drones.values() if d.is_alive]
        centre = (np.mean([d.position[:2] for d in live], axis=0) if live
                  else np.array([size * 0.5, size * 0.5]))
        bubble = {
            "id": f"GPSD-{len(self.denial) + 1}",
            "centre": np.array([float(params.get("x", centre[0])),
                                float(params.get("y", centre[1]))]),
            "radius": float(params.get("radius_m", 1600.0)),
            # Multipath off valley walls biases the solution one way rather
            # than just making it noisy.
            "bias": np.array([np.cos(self.rng.uniform(0, 2 * np.pi)),
                              np.sin(self.rng.uniform(0, 2 * np.pi))]),
        }
        self.denial.append(bubble)
        self.nav_fallback = False
        self.log("GNSS", f"GNSS degradation — {bubble['id']} centred "
                       f"({bubble['centre'][0]:.0f}, {bubble['centre'][1]:.0f}), "
                       f"{bubble['radius']:.0f} m. Navigation solution drifting.",
                 {"zone": bubble["id"]})
        return {"zone": bubble["id"]}

    def _inject_equipment_fault(self, params, drones, sim_time):
        candidates = [d for d in drones.values() if d.is_alive
                      and d.role != DroneRole.GCS_RELAY and d.id not in self.faults]
        if not candidates:
            raise ValueError("no healthy aircraft to fault")
        drone_id = params.get("drone_id") or str(self.rng.choice([d.id for d in candidates]))
        drone = drones.get(drone_id)
        if drone is None or not drone.is_alive:
            raise ValueError(f"no such aircraft: {drone_id}")
        severity = float(params.get("severity", 0.45))
        self.faults[drone_id] = severity
        drone.health = 1.0 - severity
        self.log("FAULT", f"{drone_id} motor/battery fault — {severity * 100:.0f}% thrust "
                          f"authority lost, power draw doubled. Aircraft cannot hold "
                          "station in gusts.", {"drone_id": drone_id})
        return {"drone_id": drone_id}

    # -- physics couplings -----------------------------------------------------

    def antenna_loss_db(self) -> float:
        """Wet-antenna/radome loss. Rain attenuation itself is negligible at
        900 MHz; the wet radome is what actually costs signal."""
        return float(np.clip(self.rain_mm_h / 18.0, 0.0, 3.5))

    def power_factor(self) -> float:
        """Extra power for a wet airframe fighting a rougher wind field."""
        return 1.0 + 0.4 * min(self.rain_mm_h / 50.0, 1.2)

    def optical_range_factor(self) -> float:
        """How far the scouts can still see through the rain."""
        return float(np.clip(1.0 - self.rain_mm_h / 70.0, 0.25, 1.0))

    def weather_index(self) -> float:
        """Weather severity in [0, 1] — the SCM's W regressor."""
        turbulence = getattr(self.wind, "rain_turbulence", 1.0) - 1.0
        return float(np.clip(self.rain_mm_h / 60.0 * 0.75 + turbulence * 0.25, 0.0, 1.0))

    def nav_error_of(self, drone) -> np.ndarray:
        return getattr(drone, "nav_error", np.zeros(3))

    # -- per tick ---------------------------------------------------------------

    def update(self, dt, drones, sim_time):
        events = []
        self._update_cells(dt)
        events += self._update_navigation(dt, drones, sim_time)
        self._apply_faults(drones)
        return events

    def _update_cells(self, dt):
        size = self.world.terrain.config.size_m
        for cell in self.cells:
            cell["centre"] = cell["centre"] + cell["drift"] * dt
        self.cells = [c for c in self.cells
                      if -400.0 < c["centre"][0] < size + 400.0
                      and -400.0 < c["centre"][1] < size + 400.0]
        self.wind.cells = self.cells

    def _update_navigation(self, dt, drones, sim_time):
        """
        GNSS degradation (physics): inside a zone the navigation solution
        drifts, until the swarm has switched to terrain-relative navigation
        (`nav_fallback`, set by the swarm's own detection), after which the
        error is pulled back in.
        """
        events = []
        if not self.denial:
            return events
        worst = 0.0
        for drone in drones.values():
            if not drone.is_alive:
                continue
            inside = any(np.linalg.norm(drone.position[:2] - z["centre"]) < z["radius"]
                         for z in self.denial)
            error = getattr(drone, "nav_error", np.zeros(3))
            if inside and not self.nav_fallback:
                zone = next(z for z in self.denial
                            if np.linalg.norm(drone.position[:2] - z["centre"]) < z["radius"])
                pull = np.array([zone["bias"][0], zone["bias"][1], 0.0])
                noise = self.rng.normal(0.0, 1.0, 3) * np.array([1.0, 1.0, 0.3])
                error = error + (pull + 0.3 * noise) * self.NAV_DRIFT_MS * dt
                norm = float(np.linalg.norm(error))
                if norm > self.NAV_DRIFT_CAP:
                    error *= self.NAV_DRIFT_CAP / norm
            else:
                # Terrain-relative navigation pulls the solution back in
                error = error * max(0.0, 1.0 - dt * 0.25)
            drone.nav_error = error
            worst = max(worst, float(np.linalg.norm(error)))

        # No detection here: the swarm notices the drift itself, from radio
        # ranging (mesh/awareness.py), and sets `nav_fallback`
        return events

    def _apply_faults(self, drones):
        for drone_id, severity in list(self.faults.items()):
            drone = drones.get(drone_id)
            if drone is None or not drone.is_alive:
                self.faults.pop(drone_id, None)
                continue
            drone.health = 1.0 - severity

    # -- reporting ---------------------------------------------------------------

    def get_state(self) -> dict:
        return {
            "rain_mm_h": self.rain_mm_h,
            "cloud_base_agl": self.cloud_base_agl,
            "antenna_loss_db": self.antenna_loss_db(),
            "power_factor": self.power_factor(),
            "optical_factor": self.optical_range_factor(),
            "weather_index": self.weather_index(),
            "cells": [{"id": c["id"], "x": float(c["centre"][0]), "y": float(c["centre"][1]),
                       "radius_m": c["radius"], "downdraught_ms": -c["w_z"]}
                      for c in self.cells],
            "gps_denial": [{"id": z["id"], "x": float(z["centre"][0]),
                            "y": float(z["centre"][1]), "radius_m": z["radius"]}
                           for z in self.denial],
            "nav_fallback": self.nav_fallback,
            "faults": dict(self.faults),
        }
