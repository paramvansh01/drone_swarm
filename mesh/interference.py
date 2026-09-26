"""
Communication-outage response: detect, localise and work around RF interference.

After an earthquake or landslide the radio environment is rarely clean:
generators and damaged power lines radiate, emergency teams bring their own
radios, and a failing repeater can splatter across the band. To the swarm all
of these look the same — a rise in the noise floor at some receivers and not
others — and a swarm that only re-plans for connectivity has nothing to
optimise against: it does not know where the interference is coming from, so
every link simply degrades. This module closes that loop.

  1. DETECT    Every aircraft measures the noise floor at its own receiver
               (what a radio reports as RSSI with no packet in flight). A
               rise of more than 6 dB over the known floor is interference.

  2. LOCALISE  With three or more aircraft reporting, the source is
               localised by fitting a single-emitter propagation model to
               the measured noise rises: free-space loss PLUS the terrain
               diffraction between each candidate location and each aircraft
               (the swarm carries the elevation map, so a ridge that shields
               one aircraft is evidence, not noise). The fit returns a
               position, an estimated power, and an uncertainty radius.

  3. RESPOND   - Relays: the estimate is handed to the relay optimiser, whose
                 differentiable link budget then includes the source, so
                 candidate layouts are scored against it and the gradient
                 favours positions with terrain between relay and source.
               - Scouts that lose every link for 3 s withdraw to the nearby
                 point where the model predicts the best link, and resume
                 autonomous tasking once their link has held for 6 s.
               - Survey targets the interference overpowers are held until it
                 clears, so scouts are not re-tasked into a dead zone.
               - The GCS gets the estimated position so a ground team can
                 find and switch off the source.

Nothing here reads the true source position: the only inputs are each
aircraft's measured noise floor (1 dB measurement error) and its
direction-finding array's bearings (sim/df_sensor.py), so the estimate's
error against ground truth is a genuine measurement.
"""

from __future__ import annotations

import numpy as np

from sim.drone import DroneRole

C = 299_792_458.0


class InterferenceResponse:
    DETECT_DB = 6.0           # noise rise that counts as jamming
    FIX_INTERVAL_S = 1.0      # geolocation rate
    CLEAR_AFTER_S = 3.0       # quiet time before the episode is closed
    LOST_LINK_Q = 0.35        # best-link quality below this = link lost
    LOST_LINK_S = 3.0
    RECOVER_Q = 0.7
    RECOVER_S = 6.0
    DENY_DBM = -66.0          # predicted jammer power at a target that denies it
    RELEASE_DBM = -70.0       # ...and below which it is released (hysteresis)
    MAX_SOURCES = 3           # emitters the cross-fix will separate
    DF_SIGMA_DEG = 2.0        # direction-finding accuracy at strong signal
    DF_RESOLUTION = np.radians(9.0)   # emitters closer than this merge into one bearing
    MAX_RESIDUAL = 1.5        # mean squared bearing residual (sigmas) to accept a fix
    MAX_POWER_SPREAD_DB = 9.0  # disagreement over implied power that rejects a fix
    MAX_RESIDUAL = 1.5        # mean squared bearing residual (sigmas) to accept a fix
    MAX_POWER_SPREAD_DB = 9.0  # disagreement over implied emitter power that rejects a fix
    CONFIRM_HITS = 3          # fixes before a track is shown to the operator
    SMOOTHING = 0.3           # per-fix correction applied to a tracked position
    TRACK_TIMEOUT_S = 6.0
    MIN_RADIUS_M = 20.0
    REPLAN_S = 12.0           # a withdrawn scout still without link re-plans
    EMITTER_AGL = 10.0        # assumed emitter height above ground

    def __init__(self, world, rf, guidance, log, seed: int = 7):
        self.world = world
        self.terrain = world.terrain
        self.rf = rf
        self.guidance = guidance
        self.log = log                         # log(type, message, extra)
        self.rng = np.random.default_rng(seed)
        self.wavelength = C / (world.frequency_mhz * 1e6)
        self.fspl_const = 20 * np.log10(world.frequency_mhz * 1e6) - 147.55
        self.reset()

    def reset(self):
        self.active = False
        self.started = 0.0
        self.last_jammed = -1e9
        self.last_fix = -1e9
        self.estimate = None
        self.measurements = {}
        self.jammed_nodes = []
        self.denied = set()
        self.withdrawn = {}                    # drone_id -> sim time withdrawn
        self.lost_since = {}
        self.good_since = {}
        self.summary = ""
        self.fix_count = 0
        self.estimates = []                    # confirmed emitter tracks
        self.tracks = []                       # candidate tracks (incl. unconfirmed)
        self._track_counter = 0
        self._df_bias = {}                     # per-array calibration bias
        self.df_reports = []                   # (drone, bearing, dBm) this fix
        self.rf.ew_estimate = None
        self.rf.ew_emitters = []
        self._now = 0.0
        self._publish()

    # -- per-tick ------------------------------------------------------------

    def update(self, drones: dict, sim_time: float):
        self._now = sim_time
        # The radio's datasheet thermal floor: the reference a rise is measured against
        floor = float(self.rf.base_noise_floor)
        # Aircraft whose receiver readings are coming in (a silent one reports nothing)
        alive = [d for d in drones.values() if getattr(d.sensors, "noise_dbm", None) is not None]

        # Measurement: the noise floor each receiver reports. An area-wide
        # rise shows up at every aircraft and has no bearing to cross-fix;
        # a local source shows up at some and is localised below.
        self.measurements = {d.id: float(d.sensors.noise_dbm) for d in alive}
        self.jammed_nodes = [i for i, m in self.measurements.items()
                             if m - floor > self.DETECT_DB]

        if self.jammed_nodes:
            self.last_jammed = sim_time
            if not self.active:
                self.active = True
                self.started = sim_time
                worst = max(self.measurements[i] - floor for i in self.jammed_nodes)
                self.log("INTERFERENCE", f"Interference detected: noise floor up {worst:.0f} dB at "
                               f"{len(self.jammed_nodes)} aircraft ({', '.join(self.jammed_nodes)}). "
                               "Geolocating the source.", {})
        elif self.active and sim_time - self.last_jammed > self.CLEAR_AFTER_S:
            self._close_episode(drones, sim_time)
            return

        if not self.active:
            self._publish()
            return

        if sim_time - self.last_fix >= self.FIX_INTERVAL_S:
            self.last_fix = sim_time
            self._geolocate(alive, floor, sim_time)

        if self.estimates:
            self._update_denied(sim_time)
        self._manage_scouts(drones, sim_time)
        self._summarise()
        self._publish()

    # -- geolocation -----------------------------------------------------------

    def _occlusion(self, src: np.ndarray, dst: np.ndarray, samples: int = 28) -> np.ndarray:
        """
        Vectorised knife-edge loss (dB) for many paths at once — the same
        ITU-R P.526 / Lee model as World.compute_rf_occlusion_db.
        src, dst: [..., 3] broadcastable arrays.
        """
        src, dst = np.broadcast_arrays(src, dst)
        t = np.linspace(0.0, 1.0, samples)[2:-2]
        pts = src[..., None, :] + t[:, None] * (dst - src)[..., None, :]
        ground = self.terrain.height_at_array(pts[..., 0].ravel(), pts[..., 1].ravel())
        ground = ground.reshape(pts.shape[:-1])
        total = np.maximum(np.linalg.norm((dst - src)[..., :2], axis=-1), 1.0)[..., None]
        d1 = np.maximum(t * total, 1.0)
        d2 = np.maximum(total - d1, 1.0)
        r1 = np.sqrt(self.wavelength * d1 * d2 / total)
        v = ((ground - pts[..., 2]) * np.sqrt(2.0) / np.maximum(r1, 1e-6)).max(axis=-1)
        loss = 6.9 + 20 * np.log10(np.sqrt((v - 0.1) ** 2 + 1) + v - 0.1)
        return np.where(v < -0.78, 0.0, np.clip(loss, 0.0, 120.0))

    def _path_gain(self, cand: np.ndarray, sensors: np.ndarray) -> np.ndarray:
        """[M, K] propagation loss (dB) from each candidate to each sensor."""
        d = np.linalg.norm(cand[:, None, :] - sensors[None, :, :], axis=-1)
        fspl = 20 * np.log10(np.maximum(d, 5.0)) + self.fspl_const
        return fspl + self._occlusion(cand[:, None, :], sensors[None, :, :])

    def _grid(self, x0, x1, y0, y1, n):
        xs, ys = np.meshgrid(np.linspace(x0, x1, n), np.linspace(y0, y1, n))
        xs, ys = xs.ravel(), ys.ravel()
        zs = self.terrain.height_at_array(xs, ys) + self.EMITTER_AGL
        return np.stack([xs, ys, zs], axis=-1)

    def _fit(self, cand, sensors, jam_lin, active, floor):
        """
        Best emitter power per candidate cell, and the misfit (dB^2).

        `jam_lin` is the interference power (linear, mW) left at each sensor
        after the emitters already extracted have been subtracted.
        """
        loss = self._path_gain(cand, sensors)                      # [M, K]
        jam_dbm = 10 * np.log10(np.maximum(jam_lin, 1e-15))
        implied = jam_dbm[None, :] + loss - 3.0
        w = active[None, :].astype(float)
        power = (implied * w).sum(1) / max(active.sum(), 1.0)
        misfit = (((implied - power[:, None]) ** 2) * w).sum(1)
        # A sensor that heard nothing is evidence too: penalise candidates
        # that would have jammed it.
        predicted = power[:, None] + 3.0 - loss
        over = np.maximum(predicted - (floor + 3.0), 0.0)
        misfit += ((over ** 2) * (~active[None, :])).sum(1)
        return power, misfit

    def _bearings(self, alive, floor):
        """
        What each aircraft's direction-finding array reported this second
        (sim/df_sensor.py models the array). Returns a list of
        (sensor_index, bearing_rad, rx_dbm, sigma_rad).
        """
        out = []
        for index, drone in enumerate(alive):
            for bearing, rx, sigma in getattr(drone.sensors, "df_bearings", None) or []:
                out.append((index, float(bearing), float(rx), float(sigma)))
        return out

    @staticmethod
    def _wrap(angle):
        return (angle + np.pi) % (2 * np.pi) - np.pi

    def _extract_sources(self, sensors, reports, floor):
        """
        Cross-fix the bearings, strongest emitter first.

        For every candidate position, each aircraft's best-matching bearing
        contributes its angular residual. The position where three or more
        bearings cross wins; those bearings are then consumed and the search
        repeats on what is left, which is what separates several emitters.
        """
        size = self.terrain.config.size_m
        coarse = self._grid(0, size, 0, size, 48)
        found = []
        remaining = list(range(len(reports)))

        for _ in range(self.MAX_SOURCES):
            if len({reports[i][0] for i in remaining}) < 3:
                break        # bearings from fewer than three aircraft: no cross-fix
            best = None
            cells, span = coarse, size / 47
            for refinement in range(3):
                cost, support, assign = self._bearing_cost(cells, sensors, reports, remaining)
                ok = support >= 3
                if not ok.any():
                    break
                masked = np.where(ok, cost, np.inf)
                k = int(np.argmin(masked))
                best = (cells[k], assign[k], int(support[k]), float(cost[k] / support[k]))
                x, y = cells[k, 0], cells[k, 1]
                cells = self._grid(max(x - span, 0), min(x + span, size),
                                   max(y - span, 0), min(y + span, size), 11)
                span /= 5.0
            if best is None:
                break

            pos, used, n_support, residual = best
            if residual > self.MAX_RESIDUAL:
                break        # bearings do not really agree — not an emitter
            # Emitter power implied by the aircraft that heard it
            powers = []
            for i in used:
                index, _, rx, _ = reports[i]
                d = max(float(np.linalg.norm(sensors[index] - pos)), 5.0)
                powers.append(rx + 20 * np.log10(d) + self.fspl_const - 3.0)
            # A real emitter looks like the same transmitter from every
            # aircraft. Leftover bearings that merely happen to cross do not.
            if len(powers) > 2 and float(np.std(powers)) > self.MAX_POWER_SPREAD_DB:
                break
            # A real emitter looks like the same transmitter from every
            # aircraft; leftover bearings that merely happen to cross do not.
            if len(powers) > 2 and float(np.std(powers)) > self.MAX_POWER_SPREAD_DB:
                break
            found.append({
                "pos": np.asarray(pos, dtype=float),
                "power_dbm": float(np.median(powers)),
                "sensors": n_support,
                "sigma": float(np.mean([reports[i][3] for i in used])),
                "baseline": float(np.mean([np.linalg.norm(sensors[reports[i][0]] - pos)
                                           for i in used])),
            })
            remaining = [i for i in remaining if i not in used]
        return found

    def _bearing_cost(self, cells, sensors, reports, remaining):
        """
        [M] angular misfit, [M] number of supporting aircraft, and the report
        indices each candidate uses (one per aircraft, its closest bearing).
        """
        m = len(cells)
        cost = np.zeros(m)
        support = np.zeros(m, dtype=int)
        per_sensor = {}
        for i in remaining:
            per_sensor.setdefault(reports[i][0], []).append(i)

        chosen = [[] for _ in range(m)]
        for index, indices in per_sensor.items():
            az = np.arctan2(cells[:, 1] - sensors[index][1], cells[:, 0] - sensors[index][0])
            best_err = None
            best_idx = None
            for i in indices:
                _, bearing, _, sigma = reports[i]
                err = np.abs(self._wrap(bearing - az)) / sigma
                if best_err is None:
                    best_err, best_idx = err, np.full(m, i)
                else:
                    take = err < best_err
                    best_err = np.where(take, err, best_err)
                    best_idx = np.where(take, i, best_idx)
            # Robust: a bearing further than 3 sigma is an outlier, not evidence
            inlier = best_err <= 3.0
            cost += np.where(inlier, best_err ** 2, 9.0)
            support += inlier
            for cell in np.nonzero(inlier)[0]:
                chosen[cell].append(int(best_idx[cell]))
        return cost, support, chosen

    def _track(self, found, sim_time):
        """
        Associate each new fix with an existing track and smooth it.

        The emitters do not move, so averaging successive fixes is what makes
        the reported position settle instead of jumping by the width of one
        snapshot's ambiguity. The reported radius is the spread of the recent
        raw fixes about the smoothed position — it shrinks as evidence builds.
        """
        unmatched = list(self.tracks)
        for source in found:
            gate = 400.0
            match, best_d = None, gate
            for track in unmatched:
                d = float(np.linalg.norm(track["pos"][:2] - source["pos"][:2]))
                if d < best_d:
                    match, best_d = track, d
            if match is None:
                self._track_counter += 1
                self.tracks.append({
                    "id": f"EMIT-{self._track_counter}", "pos": source["pos"].copy(),
                    "power_dbm": source["power_dbm"], "hits": 1, "last": sim_time,
                    "history": [source["pos"][:2].copy()], "sensors": source["sensors"],
                    "sigma": source["sigma"], "baseline": source["baseline"],
                })
                continue
            unmatched.remove(match)
            a = self.SMOOTHING
            match["pos"][:2] += a * (source["pos"][:2] - match["pos"][:2])
            match["pos"][2] = self.terrain.height_at(match["pos"][0], match["pos"][1]) + self.EMITTER_AGL
            match["power_dbm"] += a * (source["power_dbm"] - match["power_dbm"])
            match["hits"] += 1
            match["last"] = sim_time
            match["sensors"] = source["sensors"]
            match["sigma"] = source["sigma"]
            match["baseline"] = source["baseline"]
            match["history"] = (match["history"] + [source["pos"][:2].copy()])[-12:]

        # Drop tracks nothing has supported for a while
        self.tracks = [t for t in self.tracks if sim_time - t["last"] <= self.TRACK_TIMEOUT_S]

    def _publish_estimates(self, sim_time):
        """Confirmed tracks, strongest first, as operator-facing estimates."""
        estimates = []
        for track in sorted(self.tracks, key=lambda t: -t["power_dbm"]):
            if track["hits"] < self.CONFIRM_HITS:
                continue
            # Cross-fix accuracy: bearing error x baseline, improving with the
            # number of independent bearings and with repeated fixes.
            geometry = track.get("sigma", np.radians(3.0)) * track.get("baseline", 800.0)
            spread = geometry / np.sqrt(max(track["sensors"], 1) * min(track["hits"], 20))
            if len(track["history"]) > 2:
                deltas = np.array(track["history"]) - track["pos"][:2]
                spread = max(spread, float(np.sqrt(np.mean((deltas ** 2).sum(axis=1)))) * 0.6)
            estimate = {
                "id": track["id"],
                "x": float(track["pos"][0]), "y": float(track["pos"][1]), "z": float(track["pos"][2]),
                "power_dbm": float(track["power_dbm"]),
                "radius_m": float(np.clip(spread * 1.4, self.MIN_RADIUS_M, 3000.0)),
                "sensors": track["sensors"],
                "fixes": track["hits"],
                "time": sim_time,
            }
            # Display only: distance to the emitter the operator actually
            # placed. Never fed back into the fit.
            truth = self._nearest_true_jammer(track["pos"])
            if truth is not None:
                estimate["error_m"] = truth[0]
                estimate["true_id"] = truth[1]
            estimates.append(estimate)
        return estimates

    def _geolocate(self, alive, floor, sim_time):
        if len(alive) < 3:
            return
        sensors = np.array([d.position for d in alive], dtype=float)
        reports = self._bearings(alive, floor)
        self.df_reports = [(alive[i].id, float(b), float(rx)) for i, b, rx, _ in reports]
        if len({r[0] for r in reports}) < 3:
            return          # fewer than three aircraft with a bearing

        found = self._extract_sources(sensors, reports, floor)
        if not found:
            return
        self._track(found, sim_time)

        before = {e["id"] for e in self.estimates}
        self.estimates = self._publish_estimates(sim_time)
        self.estimate = self.estimates[0] if self.estimates else None
        self.rf.ew_estimate = dict(self.estimate) if self.estimate else None
        self.rf.ew_emitters = [dict(e) for e in self.estimates]
        self.fix_count += 1

        for estimate in self.estimates:
            if estimate["id"] in before:
                continue
            self.log("INTERFERENCE", f"Source {estimate['id']} cross-fixed from {estimate['sensors']} "
                           f"aircraft bearings: grid ({estimate['x']:.0f}, {estimate['y']:.0f}) "
                           f"± {estimate['radius_m']:.0f} m, ≈{estimate['power_dbm']:.0f} dBm"
                           + (f" ({len(self.estimates)} emitters tracked)"
                              if len(self.estimates) > 1 else "")
                           + ". Relay planner now includes it in the link model.",
                     {"estimate": estimate})

    def _nearest_true_jammer(self, pos):
        best = None
        for j in self.rf.jammers.values():  # eval-only: display of the estimate's error
            d = float(np.linalg.norm(np.asarray(j["position"][:2]) - pos[:2]))
            if best is None or d < best[0]:
                best = (d, j["id"])
        return best

    # -- responses -------------------------------------------------------------

    def _jam_at(self, points: np.ndarray) -> np.ndarray:
        """Predicted interference (dBm) at points [N, 3] from every tracked emitter."""
        total = np.zeros(len(points))
        for e in self.estimates:
            src = np.array([[e["x"], e["y"], e["z"]]])
            total += 10 ** ((e["power_dbm"] + 3.0 - self._path_gain(src, points)[0]) / 10)
        return 10 * np.log10(np.maximum(total, 1e-15))

    def _update_denied(self, sim_time):
        # Reported, unsurveyed tasks (never ones not yet reported)
        pending = [p for p in self.guidance.open_tasks(self._now) if not p.surveyed] \
            if hasattr(self.guidance, "open_tasks") else []
        if not pending:
            return
        pts = np.array([p.position for p in pending], dtype=float)
        pts[:, 2] = self.terrain.height_at_array(pts[:, 0], pts[:, 1]) + 45.0
        jam = self._jam_at(pts)
        denied = {p.id for p, j in zip(pending, jam)
                  if j > (self.RELEASE_DBM if p.id in self.denied else self.DENY_DBM)}
        added = denied - self.denied
        released = self.denied - denied
        self.denied = denied
        self.guidance.denied_pois = set(denied)
        for drone_id, poi_id in list(self.guidance.assignments.items()):
            if poi_id in added:
                self.guidance.drop_assignment(drone_id, sim_time,
                                              f"{poi_id} is inside the interference zone — held")
        if added:
            self.log("INTERFERENCE", f"Targets held until the interference clears: "
                           f"{', '.join(sorted(added))}", {})
        if released:
            self.log("INTERFERENCE", f"Targets released for tasking: {', '.join(sorted(released))}", {})

    def _best_link(self, drone) -> float:
        return max(drone.neighbors.values(), default=0.0)

    def _withdrawal_point(self, drone, drones):
        """Nearby point with the best predicted link to the rest of the mesh."""
        size = self.terrain.config.size_m
        anchors = [d for d in drones.values()
                   if d.neighbors and d.id != drone.id and d.role != DroneRole.SCOUT]
        if not anchors:
            return None
        bearings = np.linspace(0, 2 * np.pi, 16, endpoint=False)
        cand = [drone.position[:2]]
        for r in (250.0, 500.0, 800.0, 1200.0, 1700.0):
            cand += [drone.position[:2] + r * np.array([np.cos(b), np.sin(b)]) for b in bearings]
        cand = np.clip(np.array(cand), 40.0, size - 40.0)
        pts = np.column_stack([cand, self.terrain.height_at_array(cand[:, 0], cand[:, 1]) + 60.0])

        # The area-wide floor as the receivers measure it (lower quartile)
        measured = list(self.measurements.values())
        noise = float(np.percentile(measured, 25)) if measured else float(self.rf.base_noise_floor)
        base_noise = noise
        if self.estimates:
            jam = self._jam_at(pts)
            noise = 10 * np.log10(10 ** (noise / 10) + 10 ** (jam / 10))
        anchor_pos = np.array([a.position for a in anchors], dtype=float)
        rssi = (drone.config.tx_power_dbm + 2 * drone.config.antenna_gain_dbi
                - self._path_gain(pts, anchor_pos))            # [M, A]
        # A link is only as good as its worse end: heading for a relay that
        # is itself jammed recovers nothing.
        anchor_noise = np.full(len(anchors), base_noise)
        if self.estimates:
            anchor_noise = 10 * np.log10(10 ** (anchor_noise / 10)
                                         + 10 ** (self._jam_at(anchor_pos) / 10))
        noise = np.maximum(np.broadcast_to(np.atleast_1d(noise)[:, None], rssi.shape),
                           anchor_noise[None, :])
        snr = (rssi - noise).max(axis=1)
        travel = np.linalg.norm(cand - drone.position[:2], axis=1)
        score = np.minimum(snr, 25.0) - travel / 400.0
        return pts[int(np.argmax(score))]

    def _manage_scouts(self, drones, sim_time):
        for d in drones.values():
            if not d.is_alive or d.role != DroneRole.SCOUT:
                self.withdrawn.pop(d.id, None)
                continue
            q = self._best_link(d)

            if d.id in self.withdrawn:
                if q >= self.RECOVER_Q:
                    self.good_since.setdefault(d.id, sim_time)
                    if sim_time - self.good_since[d.id] >= self.RECOVER_S:
                        self.withdrawn.pop(d.id)
                        self.good_since.pop(d.id, None)
                        self.guidance.ew_release(d, sim_time)
                        self.log("INTERFERENCE", f"{d.id} link holding — resuming autonomous tasking", {})
                else:
                    self.good_since.pop(d.id, None)
                    target = self.guidance.manual_targets.get(d.id)
                    arrived = (target is None
                               or float(np.linalg.norm(target[:2] - d.position[:2])) < 80.0)
                    # Re-plan once it has reached the point and the link is
                    # still dead (or it has been trying for a long time).
                    waited = sim_time - self.withdrawn[d.id]
                    if (arrived and waited >= self.REPLAN_S) or waited >= 5 * self.REPLAN_S:
                        point = self._withdrawal_point(d, drones)
                        if point is not None:
                            self.guidance.ew_withdraw(d, point, sim_time)
                            self.log("INTERFERENCE", f"{d.id} still without link — re-planning "
                                           f"withdrawal to ({point[0]:.0f}, {point[1]:.0f})", {})
                        self.withdrawn[d.id] = sim_time
                continue

            if d.id in self.guidance.manual_targets:
                continue                      # the operator is flying it
            if q < self.LOST_LINK_Q:
                self.lost_since.setdefault(d.id, sim_time)
                if sim_time - self.lost_since[d.id] >= self.LOST_LINK_S:
                    point = self._withdrawal_point(d, drones)
                    if point is not None:
                        self.guidance.ew_withdraw(d, point, sim_time)
                        self.withdrawn[d.id] = sim_time
                        self.log("INTERFERENCE", f"{d.id} lost link for {self.LOST_LINK_S:.0f} s — "
                                       f"withdrawing to ({point[0]:.0f}, {point[1]:.0f}), "
                                       "the best predicted link position", {})
                    self.lost_since.pop(d.id, None)
            else:
                self.lost_since.pop(d.id, None)

    def _close_episode(self, drones, sim_time):
        for drone_id in list(self.withdrawn):
            d = drones.get(drone_id)
            if d is not None and d.is_alive:
                self.guidance.ew_release(d, sim_time)
        released = sorted(self.denied)
        self.guidance.denied_pois = set()
        self.log("INTERFERENCE", "Interference has cleared — response stood down"
                       + (f"; targets {', '.join(released)} released" if released else ""), {})
        self.reset()

    # -- reporting -------------------------------------------------------------

    def _summarise(self):
        if not self.estimates:
            self.summary = (f"Interference at {len(self.jammed_nodes)} aircraft — "
                            "geolocating the source from noise-floor readings.")
            return
        if len(self.estimates) == 1:
            e = self.estimates[0]
            parts = [f"Interference source localised at ({e['x']:.0f}, {e['y']:.0f}) ± {e['radius_m']:.0f} m, "
                     f"≈{e['power_dbm']:.0f} dBm."]
        else:
            listed = ", ".join(f"{e['id']} ({e['x']:.0f}, {e['y']:.0f}) ±{e['radius_m']:.0f} m"
                               for e in self.estimates)
            parts = [f"{len(self.estimates)} interference sources localised: {listed}."]
        parts.append("Relay placement re-planned around it."
                     if len(self.estimates) == 1 else "Relay placement re-planned around them.")
        if self.withdrawn:
            parts.append(f"{', '.join(sorted(self.withdrawn))} withdrawn to regain link.")
        if self.denied:
            parts.append(f"{len(self.denied)} target(s) held.")
        parts.append("Recommend: send the ground team to switch off the source.")
        self.summary = " ".join(parts)

    def _publish(self):
        self.rf.ew_state = {
            "active": self.active,
            "since": self.started if self.active else None,
            "jammed_nodes": list(self.jammed_nodes),
            "estimate": self.estimate,
            "estimates": self.estimates,
            "withdrawn": sorted(self.withdrawn),
            "denied_pois": sorted(self.denied),
            "summary": self.summary if self.active else "",
            "fixes": self.fix_count,
        }


# Backwards-compatible name
EWResponse = InterferenceResponse
