"""
Inter-UAV separation assurance.

Guidance plans each aircraft on its own; nothing in a route stops two of them
converging on the same piece of sky — a relay climbing out through a scout's
transit altitude, two scouts crossing in a narrow valley, aircraft queuing to
land at the GCS. This layer runs after guidance every tick and before the
flight controller sees the setpoint:

  1. For every pair of airborne aircraft it predicts the closest point of
     approach over the next LOOKAHEAD_S seconds from current positions and
     velocities.
  2. If the predicted miss distance is inside the protection radius, both
     setpoints are pushed apart along the miss vector, and the pair is split
     vertically (the aircraft already higher goes up, the other down). The
     push is proportional to the intrusion, so a marginal conflict gets a
     gentle nudge and an imminent one a firm one.

Near the GCS pads the protection radius shrinks, because the pads themselves
already separate aircraft that are launching or landing.

The geofence and terrain floor are re-applied afterwards by guidance, so
avoidance can never push an aircraft out of the operating area or into the
ground.
"""

from __future__ import annotations

from typing import Dict, List

import numpy as np


class Deconfliction:
    PROTECT_M = 30.0          # predicted miss distance that triggers a manoeuvre
    PAD_PROTECT_M = 8.0       # ...near the GCS pads
    PAD_ZONE_M = 90.0
    LOOKAHEAD_S = 4.0
    VERTICAL_WEIGHT = 1.6     # vertical separation counts for more (rotor wash, sensor FOV)
    GAIN = 0.9

    def __init__(self, world):
        self.world = world
        self.conflicts = 0
        self._active: set = set()

    def _protect(self, a, b) -> float:
        gcs = getattr(self.world, "gcs", None)
        if gcs is None:
            return self.PROTECT_M
        g = np.asarray(gcs.position[:2])
        near = (np.linalg.norm(a.position[:2] - g) < self.PAD_ZONE_M
                and np.linalg.norm(b.position[:2] - g) < self.PAD_ZONE_M)
        return self.PAD_PROTECT_M if near else self.PROTECT_M

    def apply(self, drones: Dict) -> List:
        """Adjust setpoints in place; returns the aircraft whose setpoint changed."""
        air = [d for d in drones.values() if d.is_alive and d.target_position is not None]
        changed = {}
        active = set()
        w = np.array([1.0, 1.0, self.VERTICAL_WEIGHT])
        for i, a in enumerate(air):
            for b in air[i + 1:]:
                rel = (a.position - b.position) * w
                vrel = (a.velocity - b.velocity) * w
                speed2 = float(vrel @ vrel)
                t = 0.0 if speed2 < 1e-6 else float(np.clip(-(rel @ vrel) / speed2,
                                                            0.0, self.LOOKAHEAD_S))
                miss = rel + vrel * t
                d = float(np.linalg.norm(miss))
                protect = self._protect(a, b)
                if d >= protect:
                    continue
                pair = (a.id, b.id)
                active.add(pair)
                if pair not in self._active:
                    self.conflicts += 1

                intrusion = (protect - d) / protect
                if d > 1e-3:
                    away = miss / d
                else:
                    away = np.array([1.0, 0.0, 0.0]) if a.id < b.id else np.array([-1.0, 0.0, 0.0])
                push = away * protect * intrusion * self.GAIN
                # Vertical split: whoever is higher goes up
                up = 1.0 if (a.position[2], a.id) > (b.position[2], b.id) else -1.0
                vsplit = np.array([0.0, 0.0, up * protect * 0.5 * intrusion])

                a.target_position = a.target_position + push * 0.5 + vsplit
                b.target_position = b.target_position - push * 0.5 - vsplit
                changed[a.id] = a
                changed[b.id] = b
        self._active = active
        return list(changed.values())
