"""
Direction-finding (DF) sensor model — simulation side.

Each aircraft carries a small DF array that reports the bearing to any RF
source strong enough to stand out of its noise floor, with an error that grows
as the signal weakens and a fixed per-array calibration bias. Two sources
closer together than the array can resolve are reported as one bearing between
them — the limitation a real array has.

This module is the only place that looks at where interference sources really
are. It writes each aircraft's readings to `drone.sensors.df_bearings`; the
autonomy (mesh/interference.py) sees nothing else.
"""

from __future__ import annotations

import numpy as np


class DirectionFinder:
    DETECT_DB = 6.0                    # SNR an emitter needs to register on the array
    SIGMA_DEG = 2.0                    # bearing accuracy at strong signal
    RESOLUTION = np.radians(9.0)       # emitters closer than this merge into one bearing

    def __init__(self, world, rf, seed: int = 7):
        self.world = world
        self.rf = rf
        self.rng = np.random.default_rng(seed)
        self.fspl_const = 20 * np.log10(world.frequency_mhz * 1e6) - 147.55
        self._bias = {}

    @staticmethod
    def _wrap(angle):
        return (angle + np.pi) % (2 * np.pi) - np.pi

    def read(self, drones: dict):
        floor = float(self.rf.base_noise_floor)
        for drone in drones.values():
            if not drone.is_alive or not getattr(drone, "radio_ok", True):
                drone.sensors.df_bearings = []
                continue
            seen = []
            for source in self.rf.jammers.values():
                pos = np.asarray(source["position"], dtype=float)
                rel = pos - drone.position
                d3 = max(float(np.linalg.norm(rel)), 5.0)
                rx = (source["power_dbm"] + 3.0 - (20 * np.log10(d3) + self.fspl_const)
                      - self.world.compute_rf_occlusion_db(pos, drone.position))
                if rx - floor >= self.DETECT_DB:
                    seen.append([float(np.arctan2(rel[1], rel[0])), rx])
            seen.sort(key=lambda b: b[0])
            merged = []
            for bearing, rx in seen:
                if merged and abs(self._wrap(bearing - merged[-1][0])) < self.RESOLUTION:
                    w0, w1 = 10 ** (merged[-1][1] / 10), 10 ** (rx / 10)
                    merged[-1][0] += self._wrap(bearing - merged[-1][0]) * w1 / (w0 + w1)
                    merged[-1][1] = 10 * np.log10(w0 + w1)
                else:
                    merged.append([bearing, rx])
            readings = []
            for bearing, rx in merged:
                snr = rx - floor
                sigma = np.radians(float(np.clip(self.SIGMA_DEG * 20.0 / max(snr, 4.0),
                                                 self.SIGMA_DEG, 12.0)))
                key = (drone.id, round(np.degrees(bearing) / 20))
                bias = self._bias.setdefault(key, self.rng.normal(0.0, np.radians(0.8)))
                readings.append((self._wrap(bearing + bias + self.rng.normal(0.0, sigma)), rx, sigma))
            drone.sensors.df_bearings = readings
