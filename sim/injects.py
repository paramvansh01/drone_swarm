"""
Live mission injects — the things that go wrong once the swarm is committed.

The rehearsal phase trains the swarm against terrain, wind and a contested
radio environment. This module is what the exercise controller (or a judge)
throws at it *during* the live mission, on the spot:

    heavy_rain        Convective rainfall: turbulence, downdraughts, wet-
                      antenna loss, higher power draw, degraded optics.
    storm_cell        A drifting mountain-wave / downdraught cell that will
                      push an aircraft into the ground if it flies through.
    gps_denial        A spoofing/denial bubble: navigation drifts until the
                      swarm notices and falls back to terrain-relative nav.
    equipment_fault   A motor/battery fault on one aircraft: reduced thrust
                      and double the power draw.
    enemy_uav         A hostile interceptor drone hunting the swarm.

Every inject acts on the physics, not on the display: rain changes the wind
field and the link budget, the storm cell changes the vertical wind an
aircraft actually feels, GPS denial changes the position the guidance layer
believes. The swarm's response is therefore a real response, and the causal
layer has to work out which of several simultaneous stressors is responsible
for what it is seeing.
"""

from __future__ import annotations

import numpy as np

from sim.drone import DroneRole, DroneStatus

KINDS = ("heavy_rain", "storm_cell", "gps_denial", "equipment_fault", "enemy_uav")


class EnemyUAV:
    """
    Hostile interceptor drone.

    Flies to the swarm and rams the aircraft it is chasing. It is detected by
    the swarm's radio-frequency and optical sensors at a range that depends on
    weather, which is why heavy rain and an enemy UAV together are harder than
    either alone.
    """

    SPEED = 34.0
    TURN_RATE = np.radians(45)
    CLIMB = 12.0
    KILL_RADIUS = 16.0
    LETHAL_RADIUS = 18.0        # our interceptor's warhead against it

    def __init__(self, uav_id, position, sim_time):
        self.id = uav_id
        self.position = np.asarray(position, dtype=float)
        self.velocity = np.zeros(3)
        self.heading = 0.0
        self.target_id = None
        self.spawned = sim_time
        self.detected = False
        self.detected_at = None
        self.destroyed = False
        self.kills = 0
        self.trail = []
        self._tick = 0

    def update(self, dt, world, drones, sim_time):
        """Chase the nearest live aircraft. Returns events."""
        events = []
        if self.destroyed:
            return events
        self._tick += 1

        # Prefer scouts: they are the mission, and they are furthest forward
        live = [d for d in drones.values() if d.is_alive]
        if not live:
            return events
        def cost(d):
            return (float(np.linalg.norm(d.position - self.position))
                    * (0.7 if d.role == DroneRole.SCOUT else 1.0))
        target = min(live, key=cost)
        self.target_id = target.id

        rel = target.position - self.position
        distance = float(np.linalg.norm(rel))
        desired = np.arctan2(rel[1], rel[0])
        err = (desired - self.heading + np.pi) % (2 * np.pi) - np.pi
        self.heading += float(np.clip(err, -self.TURN_RATE * dt, self.TURN_RATE * dt))

        vz = float(np.clip(rel[2], -self.CLIMB, self.CLIMB))
        ground = world.terrain.height_at(float(self.position[0]), float(self.position[1]))
        if self.position[2] < ground + 45.0:
            vz = max(vz, self.CLIMB)
        self.velocity = np.array([np.cos(self.heading) * self.SPEED,
                                  np.sin(self.heading) * self.SPEED, vz])
        self.position = self.position + self.velocity * dt
        if self._tick % 5 == 0:
            self.trail.append(self.position.tolist())
            self.trail = self.trail[-120:]

        if distance <= self.KILL_RADIUS:
            target.kill(sim_time)
            self.kills += 1
            events.append(("ENEMY", f"{target.id} destroyed by hostile UAV {self.id} — "
                                    "collision intercept", {"drone_id": target.id}))
        return events

    def get_state(self):
        return {
            "id": self.id,
            "position": self.position.tolist(),
            "velocity": self.velocity.tolist(),
            "heading": self.heading,
            "target": self.target_id,
            "detected": self.detected,
            "destroyed": self.destroyed,
            "trail": self.trail,
        }


class MissionInjects:
    """Owns every live-mission stressor and applies it to the physics."""

    RADAR_RANGE_M = 1400.0        # clear-air detection range for a small UAV
    EVADE_RANGE_M = 900.0         # threat range at which an aircraft breaks away
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
        self.guidance.ceiling_agl = None
        self.world.ceiling_agl = None
        self.cells = []           # storm / downdraught cells
        self.denial = []          # GPS denial bubbles
        self.enemies = {}
        self.faults = {}
        self.nav_fallback = False
        self._counter = 0
        self._evading = {}
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
        self.guidance.ceiling_agl = self.cloud_base_agl
        self.world.ceiling_agl = self.cloud_base_agl
        # Convective rain is turbulent: the wind field gets rougher with it
        self.wind.rain_turbulence = 1.0 + rate / 35.0
        self.log("WEATHER", f"Heavy rainfall inbound — {rate:.0f} mm/h, cloud base down to "
                            f"{self.cloud_base_agl:.0f} m AGL: the swarm must descend below it "
                            "and fly under the ridge line. Turbulence up, "
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
            # A spoofer pulls the solution steadily one way; plain jamming
            # would only make it noisy.
            "bias": np.array([np.cos(self.rng.uniform(0, 2 * np.pi)),
                              np.sin(self.rng.uniform(0, 2 * np.pi))]),
        }
        self.denial.append(bubble)
        self.nav_fallback = False
        self.log("EW", f"GNSS denial detected — {bubble['id']} centred "
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
        self.log("FAULT", f"{drone_id} motor/ESC fault — {severity * 100:.0f}% thrust "
                          f"authority lost, power draw doubled. Aircraft cannot hold "
                          "station in gusts.", {"drone_id": drone_id})
        return {"drone_id": drone_id}

    def _inject_enemy_uav(self, params, drones, sim_time):
        size = self.world.terrain.config.size_m
        live = [d for d in drones.values() if d.is_alive]
        if not live:
            raise ValueError("no aircraft airborne")
        # Comes in from the far end of the valley, above the ridge line
        lead = max(live, key=lambda d: d.position[0])
        x = float(np.clip(lead.position[0] + float(params.get("standoff_m", 2600.0)),
                          200.0, size - 200.0))
        y = float(np.clip(lead.position[1] + self.rng.uniform(-400, 400), 200.0, size - 200.0))
        z = self.world.terrain.height_at(x, y) + float(params.get("agl_m", 260.0))
        self._counter += 1
        enemy = EnemyUAV(f"HOSTILE-{self._counter}", [x, y, z], sim_time)
        self.enemies[enemy.id] = enemy
        self.log("ENEMY", f"Hostile UAV {enemy.id} inbound from "
                          f"({x:.0f}, {y:.0f}) — closing on the swarm.",
                 {"enemy_id": enemy.id})
        return {"enemy_id": enemy.id}

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
        events += self._update_enemies(dt, drones, sim_time)
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
        """GPS denial: the believed position drifts until the swarm notices."""
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

        # Detection: the mesh knows the ranges between aircraft from the radio
        # link, and those stop agreeing with the GNSS solution.
        if not self.nav_fallback and worst > 45.0:
            self.nav_fallback = True
            events.append(("EW", "GNSS solution disagrees with mesh ranging by "
                                 f"{worst:.0f} m — switching the swarm to terrain-relative "
                                 "navigation and disregarding GNSS.", {}))
        return events

    def _update_enemies(self, dt, drones, sim_time):
        events = []
        for enemy in list(self.enemies.values()):
            if enemy.destroyed:
                continue
            events += enemy.update(dt, self.world, drones, sim_time)

            # Detection: RF/optical, degraded by rain
            if not enemy.detected:
                reach = self.RADAR_RANGE_M * (0.55 + 0.45 * self.optical_range_factor())
                closest = min((float(np.linalg.norm(d.position - enemy.position))
                               for d in drones.values() if d.is_alive), default=1e9)
                if closest < reach:
                    enemy.detected = True
                    enemy.detected_at = sim_time
                    events.append(("ENEMY", f"Hostile UAV {enemy.id} detected at "
                                            f"{closest:.0f} m, closing on {enemy.target_id}. "
                                            "Threat response engaged.",
                                   {"enemy_id": enemy.id, "request": "INTERCEPTOR"}))

            if enemy.detected:
                events += self._evade(enemy, drones, sim_time)
        return events

    def _evade(self, enemy, drones, sim_time):
        """
        Break the threatened aircraft away from the hostile UAV and put
        terrain between them where possible. The relay optimiser then re-plans
        the mesh around wherever the aircraft ends up.
        """
        events = []
        target = drones.get(enemy.target_id)
        if target is None or not target.is_alive:
            return events
        distance = float(np.linalg.norm(target.position - enemy.position))
        if distance > self.EVADE_RANGE_M or target.id in self._evading:
            return events

        away = target.position[:2] - enemy.position[:2]
        norm = float(np.linalg.norm(away)) or 1.0
        size = self.world.terrain.config.size_m
        best, best_score = None, -1e9
        for bearing in np.linspace(-1.2, 1.2, 7):
            rot = np.array([[np.cos(bearing), -np.sin(bearing)],
                            [np.sin(bearing), np.cos(bearing)]])
            point = target.position[:2] + rot @ (away / norm) * 700.0
            point = np.clip(point, 60.0, size - 60.0)
            ground = self.world.terrain.height_at(point[0], point[1])
            # Prefer low ground away from the threat: terrain masking
            score = -ground * 0.02 + float(np.linalg.norm(point - enemy.position[:2])) * 0.01
            if score > best_score:
                best, best_score = point, score
        hide = np.array([best[0], best[1],
                         self.world.terrain.height_at(best[0], best[1]) + 45.0])
        self.guidance.ew_withdraw(target, hide, sim_time)
        self._evading[target.id] = sim_time
        events.append(("ENEMY", f"{target.id} breaking away from {enemy.id} — descending to "
                                f"({hide[0]:.0f}, {hide[1]:.0f}) to mask behind terrain. "
                                "Relay mesh re-planning around the manoeuvre.",
                       {"drone_id": target.id, "enemy_id": enemy.id}))
        return events

    def _apply_faults(self, drones):
        for drone_id, severity in list(self.faults.items()):
            drone = drones.get(drone_id)
            if drone is None or not drone.is_alive:
                self.faults.pop(drone_id, None)
                continue
            drone.health = 1.0 - severity

    def clear_evasion(self, drone_id):
        self._evading.pop(drone_id, None)

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
            "enemies": [e.get_state() for e in self.enemies.values() if not e.destroyed],
        }
