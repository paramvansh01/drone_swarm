"""
Home-on-jam interceptor — a one-way loitering munition that finishes what
the swarm's EW response starts.

Kill chain
----------
  FIND / FIX   The swarm detects the jammer and geolocates it from noise-floor
               readings (mesh/electronic_warfare.py). That estimate is all the
               interceptor is launched against.
  AUTHORISE    Launch requires an explicit operator command. Nothing in the
               autonomy can release an interceptor on its own.
  MIDCOURSE    Flies a terrain-clearing route to the estimated position at
               ~42 m/s, climbing over ridges with a limited climb rate.
  TERMINAL     Once its passive seeker hears the jammer's own emission (and
               terrain is not blocking it), it stops trusting the estimate and
               homes on the signal's direction of arrival, with a few degrees
               of bearing noise. A jammer behind a ridge breaks lock; the
               interceptor climbs to regain line of sight.
  LOITER       If the signal disappears (jammer switched off or already
               neutralised) it orbits the estimated position waiting for it to
               come back, and self-neutralises when its endurance runs out.

A detonation within the lethal radius of a jammer destroys it. Hitting the
terrain first is a miss. The operator can abort at any time.

It is deliberately NOT a swarm member: it carries no relay traffic and does
not take part in the mesh, the relay optimiser or the causal model.
"""

from __future__ import annotations

import numpy as np

C = 299_792_458.0


class Interceptor:
    CRUISE = 42.0              # m/s airspeed, midcourse
    TERMINAL = 55.0            # m/s in the terminal dive
    TURN_RATE = np.radians(30)
    TERMINAL_TURN_RATE = np.radians(110)
    CLIMB = 14.0               # m/s
    SINK = 22.0
    DIVE = 40.0
    CLEARANCE = 60.0           # m above terrain ahead, midcourse
    LETHAL_RADIUS = 18.0
    SEEKER_SENSITIVITY = -95.0  # dBm
    SEEKER_FOV = np.radians(70)  # half-angle of the seeker cone
    BEARING_NOISE = np.radians(1.5)
    ENDURANCE_S = 240.0
    LOITER_RADIUS = 220.0
    ARM_TIME_S = 2.5
    ARM_DISTANCE_M = 300.0     # path flown before the fuze arms

    def __init__(self, interceptor_id, launch_pos, target_estimate, sim_time):
        self.id = interceptor_id
        self.position = np.asarray(launch_pos, dtype=float).copy()
        self.launch_point = self.position.copy()
        self.path_flown = 0.0
        self.heading = 0.0
        self.speed = 18.0
        self.vz = 0.0
        self.velocity = np.zeros(3)
        self.aim = np.array([target_estimate["x"], target_estimate["y"], target_estimate["z"]], dtype=float)
        self.aim_radius = float(target_estimate.get("radius_m", 200.0))
        # Air-to-air tasking: chase a hostile UAV instead of an emitter. The
        # seeker is radar/optical rather than home-on-jam, so the target does
        # not have to be transmitting.
        self.air_target_id = target_estimate.get("air_target")
        self.launched = sim_time
        self.phase = "LAUNCH"
        self.locked_on = None
        self.lock_lost_at = None
        self.loiter_since = None
        self.route = []
        self.done = False
        self.outcome = None
        self.miss_distance = None
        self.trail = []
        self._tick = 0
        self._bearing_err = np.zeros(2)
        self._seeker_power = None

    # -- helpers ---------------------------------------------------------------

    def _terrain_ahead(self, terrain, lookahead):
        """Highest ground along the current track over the next `lookahead` m."""
        d = np.linspace(40.0, lookahead, 10)
        xs = self.position[0] + np.cos(self.heading) * d
        ys = self.position[1] + np.sin(self.heading) * d
        size = terrain.config.size_m
        xs, ys = np.clip(xs, 0, size), np.clip(ys, 0, size)
        return float(np.max(terrain.height_at_array(xs, ys)))

    def _steer_to(self, point, max_rate, dt):
        desired = np.arctan2(point[1] - self.position[1], point[0] - self.position[0])
        err = (desired - self.heading + np.pi) % (2 * np.pi) - np.pi
        self.heading += float(np.clip(err, -max_rate * dt, max_rate * dt))
        return abs(err)

    def _seek(self, world, rf):
        """
        Passive seeker: the strongest jammer inside the seeker cone, with its
        received power. Terrain between seeker and emitter attenuates it — a
        masked jammer can drop below sensitivity and break lock.

        Returns ((jammer_id, dBm) or None, reason) where reason explains a
        miss: 'silent' (nothing emitting), 'fov' (outside the seeker cone,
        e.g. overshot) or 'masked' (terrain has cut the signal).
        """
        best, reason = None, "silent"
        speed = float(np.linalg.norm(self.velocity))
        fwd = (self.velocity / speed if speed > 1.0
               else np.array([np.cos(self.heading), np.sin(self.heading), 0.0]))
        for jammer in rf.jammers.values():
            j = np.asarray(jammer["position"], dtype=float)
            rel = j - self.position
            d3 = max(float(np.linalg.norm(rel)), 5.0)
            fspl = 20 * np.log10(d3) + 20 * np.log10(world.frequency_mhz * 1e6) - 147.55
            received = jammer["power_dbm"] + 3.0 - fspl - world.compute_rf_occlusion_db(j, self.position)
            if received < self.SEEKER_SENSITIVITY:
                reason = "masked" if reason == "silent" else reason
                continue
            # The seeker looks along the velocity vector (3D cone). While
            # loitering it scans all round.
            if self.phase != "LOITER" and d3 > 25.0 \
                    and np.arccos(np.clip(rel @ fwd / d3, -1, 1)) > self.SEEKER_FOV:
                reason = "fov"
                continue
            if best is None or received > best[1]:
                best = (jammer["id"], received)
        return best, reason

    # -- per tick ----------------------------------------------------------------

    def update(self, dt, world, rf, wind_xy, sim_time, route_builder, air_targets=None):
        """Advance one tick. Returns a list of (event_type, message, extra)."""
        events = []
        if self.done:
            return events
        terrain = world.terrain
        self._tick += 1

        # --- air-to-air engagement -------------------------------------------
        if self.air_target_id:
            target = (air_targets or {}).get(self.air_target_id)
            if target is None:
                if self.phase not in ("LOITER",):
                    self.phase = "LOITER"
                    self.loiter_since = sim_time
                    events.append(("INTERCEPTOR", f"{self.id} target {self.air_target_id} "
                                                  "no longer tracked — loitering",
                                   {"interceptor_id": self.id}))
            else:
                aim = np.asarray(target, dtype=float)
                self.aim = aim.copy()
                if self.phase in ("LAUNCH",) and self.position[2] - terrain.height_at(
                        *self.position[:2]) < 60.0:
                    self.speed = min(self.speed + 12.0 * dt, self.CRUISE)
                    self.vz = self.CLIMB * 1.4
                    self._steer_to(aim, self.TURN_RATE, dt)
                    self.velocity = np.array([np.cos(self.heading) * self.speed + wind_xy[0],
                                              np.sin(self.heading) * self.speed + wind_xy[1],
                                              self.vz])
                    self.position = self.position + self.velocity * dt
                    self._record(dt, terrain)
                    return events
                self.phase = "TERMINAL"
                self.locked_on = self.air_target_id
                if self._tick % 5 == 0:
                    self._bearing_err = (0.9 * self._bearing_err
                                         + self.BEARING_NOISE * 0.45 * np.random.randn(2))
                self._pn_step(aim, terrain, dt)
                self._record(dt, terrain)
                armed = (sim_time - self.launched >= self.ARM_TIME_S
                         and self.path_flown >= self.ARM_DISTANCE_M)
                miss = float(np.linalg.norm(aim - self.position))
                if armed and miss <= self.LETHAL_RADIUS:
                    self._finish("HIT", miss)
                    events.append(("ENEMY_DESTROYED",
                                   f"Hostile UAV {self.air_target_id} destroyed by {self.id} — "
                                   f"proximity fuze at {miss:.0f} m, "
                                   f"{sim_time - self.launched:.0f} s after launch",
                                   {"interceptor_id": self.id, "enemy_id": self.air_target_id,
                                    "position": self.position.tolist()}))
                    return events
                ground = terrain.height_at(*self.position[:2])
                if self.position[2] <= ground + 1.0:
                    self._finish("TERRAIN", miss)
                    events.append(("INTERCEPTOR", f"{self.id} impacted terrain — miss",
                                   {"interceptor_id": self.id,
                                    "position": self.position.tolist()}))
                if sim_time - self.launched > self.ENDURANCE_S:
                    self._finish("ENDURANCE", None)
                    events.append(("INTERCEPTOR", f"{self.id} endurance exhausted — "
                                                  "self-neutralised", {"interceptor_id": self.id}))
                return events

        # Seeker at 10 Hz
        if self._tick % 5 == 0:
            seen, why = self._seek(world, rf)
            self._seeker_power = seen[1] if seen else None
            to_aim = float(np.linalg.norm(self.aim[:2] - self.position[:2]))
            if seen and self.phase in ("MIDCOURSE", "LOITER", "REACQUIRE") \
                    and to_aim < max(900.0, 2.5 * self.aim_radius):
                self.locked_on = seen[0]
                self.phase = "TERMINAL"
                self.lock_lost_at = None
                events.append(("INTERCEPTOR", f"{self.id} seeker locked on {seen[0]} emission "
                                              f"({seen[1]:.0f} dBm) — terminal homing",
                               {"interceptor_id": self.id}))
            elif self.phase == "TERMINAL" and (not seen or seen[0] != self.locked_on):
                if self.lock_lost_at is None:
                    self.lock_lost_at = sim_time
                    if self.locked_on not in rf.jammers or why == "silent":
                        text = "emitter has gone silent"
                    elif why == "fov":
                        text = "target left the seeker's field of view, turning to re-attack"
                    else:
                        text = "terrain is masking the emitter, climbing for line of sight"
                    events.append(("INTERCEPTOR", f"{self.id} lost seeker lock — {text}",
                                   {"interceptor_id": self.id}))
                    self.phase = "REACQUIRE"
            # random-walk bearing error of the direction-of-arrival estimate
            self._bearing_err = 0.9 * self._bearing_err + self.BEARING_NOISE * 0.45 * np.random.randn(2)

        if self.phase == "LAUNCH":
            # Near-vertical climb-out: in a gorge the walls are steeper than
            # any cruise climb angle, so gain height before committing forward
            self._steer_to(self.aim, self.TURN_RATE, dt)
            clear = self.position[2] > self._terrain_ahead(terrain, 450.0) + 40.0
            self.speed = min(self.speed + 12.0 * dt, self.CRUISE) if clear else 6.0
            self.vz = self.CLIMB * 1.4
            if clear and self.position[2] - terrain.height_at(*self.position[:2]) > 70.0:
                self.phase = "MIDCOURSE"
                self.route = list(route_builder(self.position, self.aim))

        elif self.phase == "MIDCOURSE":
            self.speed = min(self.speed + 8.0 * dt, self.CRUISE)
            while self.route and np.linalg.norm(self.route[0][:2] - self.position[:2]) < 120.0:
                self.route.pop(0)
            wp = self.route[0] if self.route else self.aim
            self._steer_to(wp, self.TURN_RATE, dt)
            floor = self._terrain_ahead(terrain, 500.0) + self.CLEARANCE
            want = max(floor, float(wp[2]) if self.route else floor + 60.0)
            self.vz = float(np.clip((want - self.position[2]) * 0.5, -self.SINK, self.CLIMB))
            # Trade speed for climb angle when a wall is coming up faster
            # than the cruise climb can clear it
            deficit = floor - self.position[2]
            if deficit > 0:
                self.speed = max(10.0, self.CRUISE * float(np.clip(1.0 - deficit / 160.0, 0.25, 1.0)))
                self.vz = self.CLIMB * 1.4
            if not self.route and np.linalg.norm(self.aim[:2] - self.position[:2]) < 150.0:
                self.phase = "LOITER"
                self.loiter_since = sim_time
                events.append(("INTERCEPTOR", f"{self.id} over the estimated position with no "
                                              "emission heard — loitering", {"interceptor_id": self.id}))

        elif self.phase == "TERMINAL":
            jammer = rf.jammers.get(self.locked_on)
            if jammer is not None:
                self._pn_step(np.asarray(jammer["position"], dtype=float), terrain, dt)
                self._record(dt, terrain)
                return events + self._check_detonation(rf, terrain, sim_time)

        elif self.phase == "REACQUIRE":
            self.speed = max(self.speed - 4.0 * dt, self.CRUISE)
            self._steer_to(self.aim, self.TURN_RATE, dt)
            self.vz = self.CLIMB * 0.8
            if sim_time - (self.lock_lost_at or sim_time) > 10.0:
                self.phase = "LOITER"
                self.loiter_since = sim_time

        elif self.phase == "LOITER":
            self.speed = self.CRUISE * 0.8
            rel = self.position[:2] - self.aim[:2]
            angle = np.arctan2(rel[1], rel[0]) + 0.35
            orbit = self.aim[:2] + self.LOITER_RADIUS * np.array([np.cos(angle), np.sin(angle)])
            self._steer_to(np.array([orbit[0], orbit[1], 0.0]), self.TURN_RATE, dt)
            want = terrain.height_at(*self.position[:2]) + 220.0
            want = max(want, self._terrain_ahead(terrain, 300.0) + self.CLEARANCE)
            self.vz = float(np.clip((want - self.position[2]) * 0.4, -self.SINK, self.CLIMB))

        # Kinematics: airspeed along heading plus the steady wind
        self.velocity = np.array([np.cos(self.heading) * self.speed + wind_xy[0],
                                  np.sin(self.heading) * self.speed + wind_xy[1],
                                  self.vz])
        self.position = self.position + self.velocity * dt
        self._record(dt, terrain)
        return events + self._check_detonation(rf, terrain, sim_time)

    # -- terminal guidance ---------------------------------------------------------

    PN_GAIN = 4.0
    MAX_ACCEL = 8.0 * 9.81

    def _pn_step(self, target, terrain, dt):
        """
        3D proportional navigation on the seeker's line of sight.

        Commanded acceleration a = N * (w x v), where w is the line-of-sight
        rotation rate. Unlike pure pursuit (which ends in an orbit around the
        target when the turn rate runs out), PN nulls the LOS rotation early
        and flies a converging path. Acceleration is capped at 8 g.
        """
        v = self.velocity if np.linalg.norm(self.velocity) > 1.0 else np.array(
            [np.cos(self.heading), np.sin(self.heading), 0.0]) * self.speed
        r = target - self.position
        # Seeker bearing noise rotates the measured LOS slightly
        az = np.arctan2(r[1], r[0]) + self._bearing_err[0]
        horiz = float(np.linalg.norm(r[:2]))
        el = np.arctan2(r[2], horiz) + self._bearing_err[1]
        rng = float(np.linalg.norm(r))
        los = np.array([np.cos(el) * np.cos(az), np.cos(el) * np.sin(az), np.sin(el)])
        r_meas = los * rng
        omega = np.cross(r_meas, -v) / max(rng * rng, 1.0)
        accel = self.PN_GAIN * np.cross(omega, v)
        # Large heading errors (e.g. just after lock-on): PN alone is slow to
        # swing round, so add a pursuit term toward the LOS
        speed = max(np.linalg.norm(v), 1.0)
        off = np.arccos(np.clip(v @ los / speed, -1.0, 1.0))
        if off > np.radians(35):
            accel += (los * speed - v) * 2.0

        # Terrain pull-up while the target is still distant
        if rng > 150.0:
            ahead = self.position + v / speed * np.array([[60.0], [120.0], [180.0]])
            ground = terrain.height_at_array(ahead[:, 0], ahead[:, 1]).max()
            if self.position[2] < ground + 25.0:
                accel[2] += (ground + 25.0 - self.position[2]) * 2.5

        norm = np.linalg.norm(accel)
        if norm > self.MAX_ACCEL:
            accel *= self.MAX_ACCEL / norm
        self.speed = min(self.speed + 6.0 * dt, self.TERMINAL)
        v = v + accel * dt
        v = v / max(np.linalg.norm(v), 1e-6) * self.speed
        self.velocity = v
        self.heading = float(np.arctan2(v[1], v[0]))
        self.vz = float(v[2])
        self.position = self.position + v * dt

    def _record(self, dt, terrain):
        self.path_flown += float(np.linalg.norm(self.velocity)) * dt
        # The munition may leave the playable square; keep it within the
        # modelled surroundings
        size = terrain.config.size_m
        self.position[:2] = np.clip(self.position[:2], -2500.0, size + 2500.0)
        if self._tick % 5 == 0:
            self.trail.append(self.position.tolist())
            self.trail = self.trail[-160:]

    def _check_detonation(self, rf, terrain, sim_time):
        """Proximity to any jammer destroys it; ground contact first is a miss."""
        # Safe-arming: the fuze is inert until the munition is clear of the
        # launch site (arms on distance flown), so a jammer next to the ground station is attacked
        # with a loft-and-dive rather than detonating on the launcher.
        armed = (sim_time - self.launched >= self.ARM_TIME_S
                 and self.path_flown >= self.ARM_DISTANCE_M)
        for jammer in (list(rf.jammers.values()) if armed else []):
            miss = float(np.linalg.norm(np.asarray(jammer["position"]) - self.position))
            if miss <= self.LETHAL_RADIUS:
                self._finish("HIT", miss)
                rf.remove_jammer(jammer["id"])
                return [("JAMMER_DESTROYED",
                         f"{jammer['id']} destroyed by {self.id} — proximity fuze at {miss:.0f} m, "
                         f"{sim_time - self.launched:.0f} s after launch",
                         {"interceptor_id": self.id, "jammer_id": jammer["id"],
                          "position": self.position.tolist()})]

        ground = terrain.height_at(*self.position[:2])
        if self.position[2] <= ground + 1.0:
            # Ground burst: an armed warhead striking the ground inside the
            # lethal radius still destroys the emitter
            if armed:
                for jammer in list(rf.jammers.values()):
                    miss = float(np.linalg.norm(np.asarray(jammer["position"]) - self.position))
                    if miss <= self.LETHAL_RADIUS:
                        self._finish("HIT", miss)
                        rf.remove_jammer(jammer["id"])
                        return [("JAMMER_DESTROYED",
                                 f"{jammer['id']} destroyed by {self.id} — ground burst {miss:.0f} m "
                                 f"from the emitter, {sim_time - self.launched:.0f} s after launch",
                                 {"interceptor_id": self.id, "jammer_id": jammer["id"],
                                  "position": self.position.tolist()})]
            nearest = min((float(np.linalg.norm(np.asarray(j["position"]) - self.position))
                           for j in rf.jammers.values()), default=None)
            self._finish("TERRAIN", nearest)
            return [("INTERCEPTOR",
                     f"{self.id} impacted terrain — miss"
                     + (f" ({nearest:.0f} m from nearest jammer)" if nearest is not None else ""),
                     {"interceptor_id": self.id, "position": self.position.tolist()})]

        if sim_time - self.launched > self.ENDURANCE_S:
            self._finish("ENDURANCE", None)
            return [("INTERCEPTOR", f"{self.id} endurance exhausted with no target — "
                                    "self-neutralised", {"interceptor_id": self.id})]
        return []

    def _finish(self, outcome, miss):
        self.done = True
        self.outcome = outcome
        self.miss_distance = miss
        self.phase = outcome

    def get_state(self) -> dict:
        return {
            "id": self.id,
            "position": self.position.tolist(),
            "velocity": self.velocity.tolist(),
            "heading": self.heading,
            "speed": float(np.linalg.norm(self.velocity)),
            "phase": self.phase,
            "locked_on": self.locked_on,
            "seeker_dbm": self._seeker_power,
            "aim": self.aim.tolist(),
            "range_m": float(np.linalg.norm(self.aim[:2] - self.position[:2])),
            "trail": self.trail,
            "done": self.done,
            "outcome": self.outcome,
        }
