"""
Packet-level traffic over the multi-hop mesh to the GCS.

Link quality from the RF model says how likely one packet is to cross one hop.
Whether the mission's information actually reaches the ground station depends
on routing, on relay placement, on what happens while routes converge after a
failure, and on where data waits when there is no route at all. This module
moves real packets through the routes the SCM-aware router has published and
measures what the challenge scores:

    packet delivery ratio   delivered / generated, per traffic class
    latency                 creation -> arrival at the GCS
    connectivity            share of airborne time each UAV had a usable path
    downtime                disconnected airborne time, outage count and length

Two traffic classes:

  telemetry   2 Hz status from every airborne UAV. Stale after 2 s: if it cannot
              be delivered by then it is dropped, as a real telemetry link does.
  survey      Imagery and situational data from each surveyed target, split
              into chunks. Delay-tolerant: a chunk that cannot move waits in
              custody at the node holding it and is forwarded when a route
              appears (store-and-forward). An aircraft landing at the GCS
              offloads its backlog over the wire. A target's data is
              *delivered* once all of its chunks have arrived; if the aircraft
              holding some of them is lost, the target is re-opened for survey.

Each hop is attempted up to 1 + MAX_RETRIES times (link-layer ARQ). Every
attempt costs airtime, so a marginal link shows up as latency before it shows
up as loss.
"""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from typing import Deque, Dict, List, Optional

import numpy as np


@dataclass
class Packet:
    id: int
    src: str
    kind: str                     # "telemetry" | "survey"
    created: float
    holder: str
    poi: Optional[str] = None
    priority: int = 3
    hops: int = 0
    retries: int = 0
    delivered_at: Optional[float] = None
    dropped: Optional[str] = None  # reason, when dropped


class TrafficSimulator:
    TELEMETRY_HZ = 2.0
    TELEMETRY_TTL_S = 2.0
    SURVEY_PPS = 20.0             # survey chunks a node can push per second
    HOP_AIRTIME_MS = 4.1          # 256-byte frame at ~500 kbit/s
    HOP_PROCESSING_MS = 1.5
    BACKOFF_MS = 2.0
    MAX_RETRIES = 3
    CONNECTED_Q = 0.5             # end-to-end path reliability counted as "connected"
    MAX_LOG = 200_000

    def __init__(self, world, gcs_id: str = "GCS", seed: int = 5):
        self.world = world
        self.gcs_id = gcs_id
        self._rng = np.random.default_rng(seed)
        self.reset()

    def reset(self):
        self._next_id = 0
        self._tele_accum: Dict[str, float] = {}
        self.queues: Dict[str, Deque[Packet]] = {}
        self.log: List[Packet] = []
        self._packetised: set = set()
        self._chunks_left: Dict[str, int] = {}
        self._chunks_lost: Dict[str, int] = {}
        self.reopened: List[dict] = []

        self.generated = {"telemetry": 0, "survey": 0}
        self.delivered = {"telemetry": 0, "survey": 0}
        self.dropped = {"telemetry": 0, "survey": 0}
        self.latency_ms = {"telemetry": [], "survey": []}

        self.airborne_s: Dict[str, float] = {}
        self.connected_s: Dict[str, float] = {}
        self.outages: List[dict] = []
        self._open_outage: Dict[str, float] = {}
        self.swarm_time_s = 0.0
        self.swarm_connected_s = 0.0
        self.events: List[dict] = []

    # -- helpers --------------------------------------------------------------

    def _new_packet(self, src: str, kind: str, t: float, poi=None, priority=3) -> Packet:
        self._next_id += 1
        pkt = Packet(self._next_id, src, kind, t, src, poi=poi, priority=priority)
        self.generated[kind] += 1
        self.queues.setdefault(src, deque()).append(pkt)
        return pkt

    def _finish(self, pkt: Packet, t: float, delivered: bool, reason: str = ""):
        if delivered:
            pkt.delivered_at = t
            self.delivered[pkt.kind] += 1
            self.latency_ms[pkt.kind].append((t - pkt.created) * 1000.0)
            if pkt.kind == "survey" and pkt.poi:
                left = self._chunks_left.get(pkt.poi, 0) - 1
                self._chunks_left[pkt.poi] = left
                if left <= 0 and not self._chunks_lost.get(pkt.poi):
                    if self.world.mark_poi_delivered(pkt.poi, t):
                        self.events.append({
                            "time": t, "type": "DATA_DELIVERED", "poi": pkt.poi,
                            "message": f"{pkt.poi} survey data complete at GCS "
                                       f"({(t - pkt.created):.1f} s after capture)",
                        })
        else:
            pkt.dropped = reason
            self.dropped[pkt.kind] += 1
        if len(self.log) < self.MAX_LOG:
            self.log.append(pkt)

    def _link_q(self, drones, a: str, b: str) -> float:
        if a == self.gcs_id:
            a, b = b, a
        da = drones.get(a)
        if da is None or not da.is_alive or not getattr(da, "radio_ok", True):
            return 0.0
        if b == self.gcs_id:
            return float(getattr(da, "gcs_link", 0.0))
        return float(da.neighbors.get(b, 0.0))

    def _hop(self, q: float):
        """One hop with ARQ. Returns (success, milliseconds, attempts)."""
        ms = 0.0
        for attempt in range(1 + self.MAX_RETRIES):
            ms += self.HOP_AIRTIME_MS + (self.BACKOFF_MS * attempt)
            if self._rng.random() < q:
                return True, ms + self.HOP_PROCESSING_MS, attempt + 1
        return False, ms, 1 + self.MAX_RETRIES

    # -- per-update -----------------------------------------------------------

    def update(self, drones: dict, router, sim_time: float, dt: float,
               path_quality: Dict[str, tuple]):
        """
        Advance traffic by `dt` seconds.

        `path_quality` is the runner's best end-to-end reliability per UAV
        (used for the connectivity/downtime measure); forwarding follows the
        router's published routes, so stale routes after a failure cost real
        packets.
        """
        self._account_connectivity(drones, sim_time, dt, path_quality)
        self._generate(drones, sim_time, dt)
        self._handle_ground(drones, sim_time)
        self._forward(drones, router, sim_time, dt)

    def _account_connectivity(self, drones, t, dt, path_quality):
        airborne = [d for d in drones.values() if d.is_alive]
        all_up = True
        for d in airborne:
            q, hops = path_quality.get(d.id, (0.0, 0))
            up = q >= self.CONNECTED_Q and getattr(d, "radio_ok", True)
            d.connected = bool(up)
            d.path_quality = float(q)
            d.hops = int(hops) if up else 0
            self.airborne_s[d.id] = self.airborne_s.get(d.id, 0.0) + dt
            if up:
                self.connected_s[d.id] = self.connected_s.get(d.id, 0.0) + dt
                start = self._open_outage.pop(d.id, None)
                if start is not None:
                    self.outages.append({"uav": d.id, "start": start, "end": t,
                                         "duration": t - start})
            else:
                all_up = False
                self._open_outage.setdefault(d.id, t)
        # Aircraft that left the air close any open outage
        for d_id in list(self._open_outage):
            d = drones.get(d_id)
            if d is None or not d.is_alive:
                start = self._open_outage.pop(d_id)
                self.outages.append({"uav": d_id, "start": start, "end": t,
                                     "duration": t - start, "ended_by": "landed/lost"})
        if airborne:
            self.swarm_time_s += dt
            if all_up:
                self.swarm_connected_s += dt

    def _generate(self, drones, t, dt):
        for d in drones.values():
            if not d.is_alive:
                continue
            acc = self._tele_accum.get(d.id, self._rng.random()) + dt * self.TELEMETRY_HZ
            while acc >= 1.0:
                acc -= 1.0
                self._new_packet(d.id, "telemetry", t)
            self._tele_accum[d.id] = acc

        # A surveyed target becomes a batch of survey chunks on the aircraft that surveyed it
        for poi in self.world.pois:
            if not poi.surveyed or poi.id in self._packetised or not poi.surveyed_by:
                continue
            holder = poi.surveyed_by
            self._packetised.add(poi.id)
            n = max(int(getattr(poi, "data_chunks", 12)), 1)
            self._chunks_left[poi.id] = n
            self._chunks_lost[poi.id] = 0
            for _ in range(n):
                self._new_packet(holder, "survey", t, poi=poi.id, priority=int(poi.priority))

    def _handle_ground(self, drones, t):
        """Landed aircraft offload over the wire; lost aircraft lose what they carry."""
        for d_id, queue in list(self.queues.items()):
            if not queue:
                continue
            d = drones.get(d_id)
            if d is not None and d.is_alive:
                continue
            on_pad = d is not None and getattr(d, "on_pad", False)
            while queue:
                pkt = queue.popleft()
                if pkt.kind == "telemetry":
                    self._finish(pkt, t, False, "sender landed" if on_pad else "sender lost")
                elif on_pad:
                    pkt.hops += 1
                    self._finish(pkt, t, True)
                else:
                    self._finish(pkt, t, False, "carrier lost")
                    self._lose_chunk(pkt, t, d_id)

    def _lose_chunk(self, pkt: Packet, t: float, carrier: str):
        poi_id = pkt.poi
        if not poi_id:
            return
        self._chunks_lost[poi_id] = self._chunks_lost.get(poi_id, 0) + 1
        if self._chunks_lost[poi_id] > 1:
            return      # already re-opened for this loss
        poi = next((p for p in self.world.pois if p.id == poi_id), None)
        if poi is None or poi.delivered:
            return
        # The survey has to be flown again: its data went down with the aircraft
        poi.surveyed = False
        poi.surveyed_by = None
        poi.surveyed_at = None
        self._packetised.discard(poi_id)
        self.reopened.append({"time": t, "poi": poi_id, "carrier": carrier})
        self.events.append({
            "time": t, "type": "DATA_LOST", "poi": poi_id, "drone": carrier,
            "message": f"{poi_id} survey data lost with {carrier} — target re-opened",
        })
        # Chunks of the old batch already in custody elsewhere are now moot
        for q in self.queues.values():
            for other in list(q):
                if other.kind == "survey" and other.poi == poi_id:
                    q.remove(other)
                    self._finish(other, t, False, "superseded by re-survey")

    def _forward(self, drones, router, t, dt):
        budget_survey = self.SURVEY_PPS * dt
        for d_id in list(self.queues):
            queue = self.queues[d_id]
            d = drones.get(d_id)
            if not queue or d is None or not d.is_alive:
                continue
            # Telemetry is time-critical: send it first; survey data by priority
            pending = sorted(queue, key=lambda p: (p.kind != "telemetry", p.priority, p.created))
            queue.clear()
            survey_sent = 0.0
            for pkt in pending:
                if pkt.kind == "telemetry" and t - pkt.created > self.TELEMETRY_TTL_S:
                    self._finish(pkt, t, False, "stale")
                    continue
                if pkt.kind == "survey" and survey_sent >= budget_survey:
                    queue.append(pkt)
                    continue
                if pkt.kind == "survey":
                    survey_sent += 1.0
                self._send(pkt, drones, router, t)
                if pkt.delivered_at is None and pkt.dropped is None:
                    self.queues.setdefault(pkt.holder, deque()).append(pkt)

    def _send(self, pkt: Packet, drones, router, t):
        """Walk the packet along the published route until it arrives or a hop fails."""
        if not getattr(drones.get(pkt.holder), "radio_ok", True):
            return
        route = router.get_route(pkt.holder, self.gcs_id) if router is not None else None
        if not route or len(route) < 2:
            return                          # no route: wait (or go stale)
        elapsed_ms = 0.0
        for a, b in zip(route[:-1], route[1:]):
            q = self._link_q(drones, a, b)
            ok, ms, attempts = self._hop(q)
            elapsed_ms += ms
            pkt.retries += attempts - 1
            if not ok:
                if pkt.kind == "telemetry":
                    self._finish(pkt, t + elapsed_ms / 1000.0, False, f"hop {a}->{b} failed")
                return                      # survey chunk stays in custody at `a`
            pkt.hops += 1
            if b == self.gcs_id:
                self._finish(pkt, t + elapsed_ms / 1000.0, True)
                return
            pkt.holder = b

    # -- reporting ------------------------------------------------------------

    def backlog(self, drone_id: str) -> int:
        return sum(1 for p in self.queues.get(drone_id, ()) if p.kind == "survey")

    def drain_events(self) -> List[dict]:
        events, self.events = self.events, []
        return events

    def summary(self, now: float = None) -> dict:
        def pct(values, q):
            return float(np.percentile(values, q)) if values else None

        gen = sum(self.generated.values())
        dlv = sum(self.delivered.values())
        airborne = sum(self.airborne_s.values())
        connected = sum(self.connected_s.values())
        outages = list(self.outages)
        if now is not None:
            outages += [{"uav": k, "start": v, "end": now, "duration": now - v, "open": True}
                        for k, v in self._open_outage.items()]
        durations = [o["duration"] for o in outages]
        tele = self.latency_ms["telemetry"]
        survey = self.latency_ms["survey"]
        return {
            "pdr": dlv / gen if gen else None,
            "pdr_telemetry": (self.delivered["telemetry"] / self.generated["telemetry"]
                              if self.generated["telemetry"] else None),
            "pdr_survey": (self.delivered["survey"] / self.generated["survey"]
                           if self.generated["survey"] else None),
            "packets_generated": dict(self.generated),
            "packets_delivered": dict(self.delivered),
            "packets_dropped": dict(self.dropped),
            "latency_ms_mean": float(np.mean(tele)) if tele else None,
            "latency_ms_p50": pct(tele, 50),
            "latency_ms_p95": pct(tele, 95),
            "survey_latency_s_mean": float(np.mean(survey)) / 1000.0 if survey else None,
            "survey_latency_s_p95": (pct(survey, 95) / 1000.0) if survey else None,
            "connectivity_availability": connected / airborne if airborne else None,
            "swarm_all_connected": (self.swarm_connected_s / self.swarm_time_s
                                    if self.swarm_time_s else None),
            "downtime_s_total": float(sum(durations)),
            "downtime_s_longest": float(max(durations)) if durations else 0.0,
            "outage_count": len(durations),
            "per_uav_availability": {k: (self.connected_s.get(k, 0.0) / v if v else None)
                                     for k, v in self.airborne_s.items()},
            "data_reopened": len(self.reopened),
            "backlog_chunks": sum(self.backlog(k) for k in self.queues),
        }

    def get_state(self, now: float = None) -> dict:
        s = self.summary(now)
        s.pop("per_uav_availability", None)
        return s
