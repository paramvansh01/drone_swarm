"""
Swarm awareness: everything the autonomy believes, built only from what it
can measure.

The simulator knows the truth — which aircraft has failed, where an
interference source is, how hard it is raining, how far a GNSS solution has
drifted, what the wind is. The autonomy must never read any of that. It is
told nothing when a disturbance is injected; it has to notice, from the same
evidence a real swarm would have:

    evidence                               belief it produces
    -------------------------------------  --------------------------------------
    link measurements (who hears whom)     heartbeat: which aircraft are alive;
                                           an aircraft nobody has heard for
                                           HEARTBEAT_S is suspected failed —
                                           a dead drone and a drone whose radio
                                           died look the same, as they would
    packet acknowledgements from the GCS   each aircraft's own "I have a link
                                           home" (the lost-link failsafe)
    receiver noise-floor readings          area-wide noise level; interference
                                           (sources are localised separately by
                                           mesh/interference.py from these and
                                           DF bearings)
    measured RSSI vs the terrain map's     extra path loss the model does not
    prediction for the same link           explain (wet antennas, degradation)
    onboard wind estimators                the valley wind, for return times
    optical cloud sensor on each aircraft  the cloud base the swarm must fly under
    two-way ranging between aircraft       GNSS disagreement -> terrain-relative
                                           navigation fallback
    battery current vs thrust (per drone,  each aircraft's own power-draw factor
    in Drone.update_battery)               (motor/battery faults, rain)

GCS-side facts need no inference: which aircraft are on its pads, which it
launched, and which tasks have been reported to it.
"""

from __future__ import annotations

from typing import Callable, Dict, List, Optional

import numpy as np


def _fspl_db(distance_m: float, frequency_mhz: float) -> float:
    """Free-space path loss (the swarm's own link-budget model)."""
    return float(20 * np.log10(max(distance_m, 0.1)) + 20 * np.log10(frequency_mhz * 1e6) - 147.55)


class SwarmAwareness:
    HEARTBEAT_S = 0.2         # nobody has heard it for this long: suspected failed
    LOST_S = 5.0              # ...for this long: its tasks go back into the pool
    DATA_LOST_S = 20.0        # ...for this long: survey data it carried is written off
    ACK_TIMEOUT_S = 3.0       # no acknowledgement from the GCS: "I have no link home"
    HEARD_Q = 0.05            # a link this good means the node was heard
    NAV_RESIDUAL_M = 30.0     # ranging vs GNSS disagreement that means GNSS is bad
    NAV_CONFIRM_S = 2.0
    CLOUD_MARGIN_M = 15.0
    CLOUD_CLEAR_S = 60.0      # no aircraft in cloud for this long: ceiling relaxes

    def __init__(self, world, rf=None, log: Callable = None, seed: int = 29):
        self.world = world
        self.rf = rf
        self.log = log or (lambda *a, **k: None)
        self._rng = np.random.default_rng(seed)
        self.on_nav_fallback: Optional[Callable] = None
        self.reset()

    def reset(self):
        self.last_heard: Dict[str, float] = {}
        self.last_ack: Dict[str, float] = {}
        self.now = 0.0
        self._wind = None                       # estimated steady wind (x, y)
        self._airborne_count = 0
        self._turbulence = 0.0
        # The radio's datasheet thermal floor, before anything is measured
        self.global_noise_dbm = float(getattr(self.rf, "base_noise_floor", -100.0))
        self.link_offset_db = 0.0
        self._last_offset_update = -1e9
        self.ceiling_agl: Optional[float] = None
        self._last_in_cloud = -1e9
        self.nav_fallback = False
        self._nav_bad_since: Optional[float] = None
        self.nav_residual_m = 0.0

    # -- beliefs other modules ask for -------------------------------------------

    def heard_ago(self, drone_id: str) -> float:
        return self.now - self.last_heard.get(drone_id, -1e9)

    def suspected(self, drone_id: str, timeout: float = None) -> bool:
        """Has nobody heard this aircraft for `timeout` seconds?"""
        return self.heard_ago(drone_id) > (self.HEARTBEAT_S if timeout is None else timeout)

    def believed_airborne(self, drone, timeout: float = None) -> bool:
        """Launched, not back on a pad, and still being heard."""
        if getattr(drone, "on_pad", False):
            return False
        return not self.suspected(drone.id, timeout)

    def believed_operational(self, drone, timeout: float = None) -> bool:
        """On a pad (the GCS can see it) or airborne and still being heard."""
        return getattr(drone, "on_pad", False) or self.believed_airborne(drone, timeout)

    def has_gcs_link(self, drone_id: str) -> bool:
        """Does this aircraft believe it has a link home (recent acknowledgements)?"""
        return self.now - self.last_ack.get(drone_id, -1e9) <= self.ACK_TIMEOUT_S

    def on_ack(self, drone_id: str, sim_time: float):
        """The GCS acknowledged a packet from this aircraft."""
        self.last_ack[drone_id] = sim_time

    def mark_launched(self, drone, sim_time: float):
        """The GCS launched it: heard on the pad right up to take-off, link timer fresh."""
        self.last_heard[drone.id] = sim_time
        self.last_ack[drone.id] = sim_time

    CRUISE_AGL_M = 110.0
    SHEAR_EXPONENT = 0.16     # standard power-law wind profile

    def observe_anemometer(self, wind_xy, height_m: float = 10.0):
        """
        The GCS mast anemometer. Used until aircraft are up to measure the wind
        where they fly; extrapolated to cruise height with the standard power law.
        """
        if self._airborne_count > 0:
            return
        scaled = np.asarray(wind_xy, dtype=float)[:2] * (self.CRUISE_AGL_M / max(height_m, 1.0)) ** self.SHEAR_EXPONENT
        self._wind = scaled if self._wind is None else self._wind + 0.05 * (scaled - self._wind)

    @property
    def base_wind(self) -> np.ndarray:
        """The estimated steady wind, in the shape EnergyModel expects."""
        w = self._wind if self._wind is not None else np.zeros(2)
        return np.array([w[0], w[1], 0.0])

    @property
    def weather_index(self) -> float:
        """Weather severity in [0, 1] from unexplained path loss and turbulence."""
        return float(np.clip(self.link_offset_db / 7.0 * 0.75
                             + max(self._turbulence - 1.0, 0.0) / 3.0 * 0.25, 0.0, 1.0))

    def interference_at(self, point) -> float:
        """
        Noise (dBm) the swarm expects at `point`: the measured area-wide floor
        plus every interference source the swarm has localised (never the true
        ones), attenuated over the terrain map.
        """
        point = np.asarray(point, dtype=float)
        total = 10.0 ** (self.global_noise_dbm / 10.0)
        for e in (getattr(self.rf, "ew_emitters", None) or []):
            src = np.array([e["x"], e["y"], e["z"]], dtype=float)
            d = max(float(np.linalg.norm(point - src)), 5.0)
            rx = (float(e["power_dbm"]) + 3.0 - _fspl_db(d, self.world.frequency_mhz)
                  - self.world.compute_rf_occlusion_db(src, point))
            total += 10.0 ** (rx / 10.0)
        return float(10.0 * np.log10(total))

    # -- evidence ---------------------------------------------------------------

    def update(self, drones: dict, sim_time: float, dt: float):
        self.now = sim_time
        self._heartbeats(drones, sim_time)
        airborne = [d for d in drones.values() if self.believed_airborne(d, self.LOST_S)]
        self._airborne_count = len(airborne)
        self._wind_and_turbulence(airborne, dt)
        self._noise(airborne)
        if sim_time - self._last_offset_update >= 1.0:
            self._last_offset_update = sim_time
            self._path_loss_offset(airborne)
        self._cloud(airborne, sim_time)
        self._ranging(airborne, sim_time)

    def _heartbeats(self, drones, t):
        for d in drones.values():
            if getattr(d, "on_pad", False):
                self.last_heard[d.id] = t          # wired to the GCS on its pad
                continue
            heard = float(getattr(d, "gcs_link", 0.0)) > self.HEARD_Q     # measured at the GCS
            if not heard:
                for other in drones.values():
                    if other is not d and other.neighbors.get(d.id, 0.0) > self.HEARD_Q:
                        heard = True                # another aircraft measured its link
                        break
            if heard:
                self.last_heard[d.id] = t

    def _wind_and_turbulence(self, airborne, dt):
        if not airborne:
            return                  # the GCS anemometer carries the estimate
        readings = np.array([d.sensors.wind_estimate[:2] for d in airborne], dtype=float)
        mean = readings.mean(axis=0)
        alpha = min(dt / 20.0, 1.0)
        self._wind = mean if self._wind is None else self._wind + alpha * (mean - self._wind)
        spread = float(np.mean(np.linalg.norm(readings - self._wind, axis=1)))
        self._turbulence += min(dt / 10.0, 1.0) * (spread - self._turbulence)

    def _noise(self, airborne):
        readings = [d.sensors.noise_dbm for d in airborne
                    if getattr(d.sensors, "noise_dbm", None) is not None and getattr(d, "radio_ok", True)]
        if readings:
            # The lower quartile: aircraft next to a local source do not make
            # the whole area noisy — localising sources is the localiser's job.
            self.global_noise_dbm = float(np.percentile(readings, 25))

    def _path_loss_offset(self, airborne):
        """Median (map-predicted RSSI - measured RSSI) over current links."""
        gaps = []
        for i, a in enumerate(airborne):
            for b in airborne[i + 1:]:
                measured = a.sensors.rssi.get(b.id)
                if measured is None:
                    continue
                d = float(np.linalg.norm(a.position - b.position))
                predicted = (b.config.tx_power_dbm + b.config.antenna_gain_dbi
                             + a.config.antenna_gain_dbi - _fspl_db(d, self.world.frequency_mhz)
                             - self.world.compute_rf_occlusion_db(a.position, b.position))
                gaps.append(predicted - measured)
                if len(gaps) >= 10:
                    break
            if len(gaps) >= 10:
                break
        if gaps:
            target = max(float(np.median(gaps)) - 1.0, 0.0)   # ~1 dB is fading/antenna
            self.link_offset_db += 0.3 * (target - self.link_offset_db)

    def _cloud(self, airborne, t):
        in_cloud = [d.agl for d in airborne if getattr(d.sensors, "in_cloud", False)]
        if in_cloud:
            self._last_in_cloud = t
            ceiling = max(min(in_cloud) - self.CLOUD_MARGIN_M, 40.0)
            if self.ceiling_agl is None or ceiling < self.ceiling_agl:
                if self.ceiling_agl is None:
                    self.log("CLOUD", f"Aircraft entering cloud at {min(in_cloud):.0f} m AGL — "
                                      f"swarm ceiling set to {ceiling:.0f} m AGL", {})
                self.ceiling_agl = ceiling
        elif self.ceiling_agl is not None and t - self._last_in_cloud > self.CLOUD_CLEAR_S:
            # Probe upward again slowly; lifting past the working ceiling clears it
            self.ceiling_agl += 0.1
            if self.ceiling_agl > self.world.max_agl:
                self.ceiling_agl = None
                self.log("CLOUD", "No cloud reported for a minute — ceiling lifted", {})

    def _ranging(self, airborne, t):
        """
        Two-way radio ranging between linked aircraft, and to the GCS antenna,
        vs the distances their GNSS positions imply. A spoofed or multipath-corrupted solution shows
        up as a disagreement; the swarm then drops GNSS for terrain-relative
        navigation.
        """
        if self.nav_fallback:
            return
        residuals = []
        for i, a in enumerate(airborne):
            for b in airborne[i + 1:]:
                ranged = a.sensors.ranges.get(b.id)
                if ranged is None:
                    continue
                gnss_range = float(np.linalg.norm(a.sensors.gps_position - b.sensors.gps_position))
                residuals.append(abs(gnss_range - ranged))
        # Ranging to the GCS antenna, a surveyed fixed point, also catches a
        # drift that moves every aircraft's fix the same way (inter-aircraft
        # ranges cannot see a common-mode error)
        gcs = np.asarray(self.world.gcs.position, dtype=float)
        for a in airborne:
            ranged = getattr(a.sensors, "gcs_range", None)
            if ranged is not None:
                residuals.append(abs(float(np.linalg.norm(a.sensors.gps_position - gcs)) - ranged))
        self.nav_residual_m = max(residuals) if residuals else 0.0
        if self.nav_residual_m > self.NAV_RESIDUAL_M:
            if self._nav_bad_since is None:
                self._nav_bad_since = t
            elif t - self._nav_bad_since >= self.NAV_CONFIRM_S:
                self.nav_fallback = True
                self.log("GNSS", f"Radio ranging disagrees with GNSS by {self.nav_residual_m:.0f} m — "
                                 "switching the swarm to terrain-relative navigation", {})
                if self.on_nav_fallback is not None:
                    self.on_nav_fallback()
        else:
            self._nav_bad_since = None

    def get_state(self) -> dict:
        return {
            "wind_estimate": self.base_wind[:2].tolist(),
            "global_noise_dbm": self.global_noise_dbm,
            "link_offset_db": self.link_offset_db,
            "weather_index": self.weather_index,
            "ceiling_agl": self.ceiling_agl,
            "nav_fallback": self.nav_fallback,
            "nav_residual_m": self.nav_residual_m,
            "suspected": sorted(k for k in self.last_heard if self.suspected(k)),
        }
