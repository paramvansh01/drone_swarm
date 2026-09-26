"""
Energy model for mission planning.

The aircraft have limited flight time, so every decision that sends one away
from the GCS has to be affordable: it must be able to do the job AND get back
to a pad with a reserve. This module answers three questions, conservatively:

  - How much battery does this aircraft need to get home from here?
    (drives the return-to-home trigger — no fixed percentage)
  - Can it survey this target and still get home?   (drives tasking)
  - When must a relay start handing over its station so that a replacement
    arrives before it has to leave?                 (drives make-before-break)

The estimates use the same drain law as `Drone.update_battery`, evaluated at a
cruise thrust fraction, with a safety factor on top. They are deliberately
pessimistic: arriving home with spare charge costs a little survey time;
arriving with none loses the aircraft.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np


@dataclass
class EnergyConfig:
    # Ground speed = clip(airspeed + tailwind, min, max), with the wind the
    # swarm estimates at cruise height. Calibrated against logged flights:
    # ~19 m/s downwind, ~10 m/s into a valley wind of ~8.7 m/s at 110 m AGL
    # (airspeed ~18.7 m/s; 18.5 keeps a margin).
    airspeed: float = 18.5
    max_ground_speed: float = 19.0
    min_ground_speed: float = 5.0
    path_factor: float = 1.15          # valley paths are longer than the straight line
    climb_descend_s: float = 25.0      # climb-out, descent and landing overhead per leg
    cruise_thrust_fraction: float = 0.65   # measured: ~0.11 %/s in transit
    safety_factor: float = 1.2
    landing_reserve_pct: float = 8.0   # must still be in the battery on touchdown
    floor_pct: float = 12.0            # never fly below this, whatever the estimate says
    survey_overhead_s: float = 35.0    # descent onto a target, dwell, climb back out
    handover_launch_s: float = 25.0    # launch + climb of a replacement relay
    recharge_s: float = 120.0          # battery swap / recharge at the pad


class EnergyModel:
    """Conservative time and battery estimates for planning decisions."""

    def __init__(self, world, config: Optional[EnergyConfig] = None, wind=None):
        self.world = world
        self.config = config or EnergyConfig()
        # The swarm's wind ESTIMATE (anything with a `base_wind`), never the
        # true field: return legs are usually into the valley wind, and that
        # is where aircraft run out of battery.
        self.wind = wind

    # -- primitives ---------------------------------------------------------

    def drain_rate(self, drone, thrust_fraction: Optional[float] = None) -> float:
        """
        Battery %/s at a representative thrust, scaled by the aircraft's own
        measured draw factor — so a fault or a wet airframe is planned for
        once the battery monitor has seen it, without anyone announcing it.
        """
        cfg = drone.config
        f = self.config.cruise_thrust_fraction if thrust_fraction is None else thrust_fraction
        penalty = max(float(getattr(drone, "drain_factor", 1.0)), 1.0)
        return penalty * (cfg.battery_drain_rate
                          + (cfg.battery_drain_rate_max - cfg.battery_drain_rate) * f)

    def ground_speed(self, a, b) -> float:
        """Planning ground speed from `a` to `b`, with the steady wind along the leg."""
        c = self.config
        d = np.asarray(b, dtype=float)[:2] - np.asarray(a, dtype=float)[:2]
        n = float(np.linalg.norm(d))
        tail = 0.0
        if self.wind is not None and n > 1e-6:
            tail = float(np.asarray(self.wind.base_wind, dtype=float)[:2] @ (d / n))
        return float(np.clip(c.airspeed + tail, c.min_ground_speed, c.max_ground_speed))

    def travel_time(self, a, b) -> float:
        """Planning estimate of the flight time between two points (s)."""
        a = np.asarray(a, dtype=float)
        b = np.asarray(b, dtype=float)
        horizontal = float(np.linalg.norm(a[:2] - b[:2])) * self.config.path_factor
        return horizontal / self.ground_speed(a, b) + self.config.climb_descend_s

    def home_of(self, drone) -> np.ndarray:
        return np.asarray(drone.home_position, dtype=float)

    # -- the three planning questions ----------------------------------------

    def energy_to_return(self, drone, from_position=None) -> float:
        """Battery % needed to fly home from `from_position` (default: where it is)."""
        start = drone.position if from_position is None else from_position
        t = self.travel_time(start, self.home_of(drone))
        return t * self.drain_rate(drone) * self.config.safety_factor

    def rth_threshold(self, drone) -> float:
        """Battery % at which this aircraft must turn for home now."""
        need = self.energy_to_return(drone) + self.config.landing_reserve_pct
        return max(self.config.floor_pct, need)

    def task_cost(self, drone, target) -> float:
        """Battery % to reach `target`, survey it, and fly home afterwards."""
        target = np.asarray(target, dtype=float)
        rate = self.drain_rate(drone)
        out = self.travel_time(drone.position, target) - self.config.climb_descend_s * 0.5
        back = self.travel_time(target, self.home_of(drone))
        t = max(out, 0.0) + self.config.survey_overhead_s + back
        return t * rate * self.config.safety_factor

    def can_afford(self, drone, target, battery: Optional[float] = None) -> bool:
        """Enough charge (now, or with `battery` %) to do the task and get home."""
        needed = self.task_cost(drone, target) + self.config.landing_reserve_pct
        charge = drone.battery if battery is None else battery
        return charge >= max(needed, self.config.floor_pct)

    def reachable(self, drone, target) -> bool:
        """Could a fully charged aircraft launched from its pad do this task at all?"""
        home = self.home_of(drone)
        rate = self.drain_rate(drone)
        t = (self.travel_time(home, target) + self.config.survey_overhead_s
             + self.travel_time(target, home))
        return 100.0 >= t * rate * self.config.safety_factor + self.config.landing_reserve_pct

    def time_to_complete(self, drone, target) -> float:
        """Seconds to reach and survey `target` and be home again."""
        target = np.asarray(target, dtype=float)
        return (self.travel_time(drone.position, target)
                + self.config.survey_overhead_s
                + self.travel_time(target, self.home_of(drone)))

    def handover_threshold(self, drone, station=None) -> float:
        """
        Battery % at which a relay asks for its replacement.

        A replacement needs to launch and fly out to the station; the relay
        must be able to hold on that long and then still get home.
        """
        station = drone.position if station is None else station
        gcs = self.world.gcs.position
        replace_s = self.travel_time(gcs, station) + self.config.handover_launch_s
        hold = replace_s * self.drain_rate(drone, thrust_fraction=0.45) * self.config.safety_factor
        return self.rth_threshold(drone) + hold

    def endurance_s(self, drone) -> float:
        """Seconds of flight left before this aircraft must turn home."""
        margin = drone.battery - self.rth_threshold(drone)
        return max(margin, 0.0) / max(self.drain_rate(drone), 1e-6)
