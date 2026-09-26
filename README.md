# C-DAWN — Resilient BVLOS swarm for disaster response

**PUSHPAK Grand Challenge 2026 · Grand Challenge 1: UAV-X Resilient BVLOS Swarm Challenge · Simulation track**

An earthquake or landslide has taken out the roads and the mobile network in a Himalayan valley. A Ground Control Station (GCS) is set up outside the affected area with a fleet of battery-limited UAVs. C-DAWN flies them autonomously. It surveys every reported damage site, keeps every aircraft connected to the GCS through a self-organising multi-hop relay chain, and brings the survey data home. The fleet cycles through battery swaps without breaking the chain, re-plans when a UAV fails or a link degrades, and drops lower-priority work when a new high-priority emergency is reported. All of this runs within the allotted time, inside a geofence, with no collisions and no aircraft run flat.

It runs on real terrain at four Indian disaster sites and on a synthetic training valley. Every run writes the challenge's metrics and a full log set. Everything is simulated; nothing here has flown.

---

## 1. How the problem statement maps to the system

| The swarm must… | How C-DAWN does it | Where | Measured as |
|---|---|---|---|
| **Survey all assigned disaster locations** | A task is assigned only if the scout can reach it, survey it and get home within its battery and the mission clock. Assignment is greedy on priority-weight ÷ time. A task counts only when its data reaches the GCS. | `sim/guidance.py`, `sim/energy.py` | completion rate, completion time, priority-weighted score |
| **Maintain end-to-end communication with the GCS** | The GCS is a fixed ground node. A terrain-aware relay chain is sized from the link budget over the real heightmap. A GNN places the relays. SCM-aware routing and packet-level store-and-forward carry the traffic. | `mesh/roles.py`, `gnn/`, `mesh/routing.py`, `mesh/traffic.py` | PDR, latency, connectivity availability, downtime |
| **Dynamically assign relay UAVs** | Any UAV can fly any role. The role manager decides how many relays are needed each second and who flies them: a charged aircraft from the pads first, otherwise the scout doing the least valuable work. | `mesh/roles.py` | relay reallocations, reconfiguration efficiency |
| **Reconfigure when comms degrade, UAVs fail or return to recharge** | A relay that goes silent is replaced within about 300 ms (heartbeat detection plus failover). A causal model diagnoses *why* a link degrades. Scouts withdraw from interference. A relay going home to recharge hands its station to a replacement *before* it leaves (make-before-break). There is a lost-link failsafe. | `mesh/election.py`, `scm/`, `mesh/interference.py`, `mesh/roles.py` | recovery time, performance after failures |
| **Prioritise newly emerging high-priority regions** | New tasks and regions are unknown until released. A P1 task pre-empts the best-placed scout on lower-priority work. Idle scouts wait mid-valley on standby. Scouts on a discretionary return are turned round. | `sim/guidance.py`, `mesh/roles.py` | emergent-task response time, priority-weighted score |
| **Complete the mission safely and within the allotted time** | Energy-aware RTH (not a fixed %), wind-aware return times, landing reserve, polygon geofence on every setpoint, predictive separation assurance, sequenced take-offs, home before the deadline. | `sim/energy.py`, `sim/world.py`, `sim/deconfliction.py` | collisions, minimum separation, battery depleted, geofence violations |

**The swarm is never told about a disturbance.** An injected failure, outage, fault or weather change alters only the physics and the radio. The autonomy finds out the way a real swarm would. A relay nobody has heard for 200 ms is treated as failed; a drone whose radio dies looks exactly the same. A drone whose packets stop being acknowledged knows it has lost its link home. Interference is localised from measured noise floors and direction-finding bearings, and only that estimate is planned against. A battery fault shows up as extra current draw, the cloud base is found by flying into it, and GNSS drift is caught because radio ranging disagrees with it. `mesh/awareness.py` holds these beliefs, and `tests/test_awareness.py` audits the autonomy's source code for any read of simulator truth.

The architecture, including a table of every disturbance and how it is detected, is in **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## 2. Install

Python 3.10 or newer. No GPU needed.

```bash
git clone https://github.com/paramvansh01/drone_swarm.git
cd drone_swarm
python3 -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

The dashboard ships pre-built in `gcs/frontend/dist/`, so Node.js is only needed if you change the UI. Trained model weights ship in `models/` and terrain packs in `terrain_packs/`, so everything runs offline.

## 3. Run it

**Watch a mission live** (opens the dashboard at http://localhost:8080):

```bash
python run_node.py --scenario kedarnath_landslide --autostart
```

Without `--autostart`, the fleet waits on its pads until you press **Launch mission**. Without `--scenario`, you get a default mission on the synthetic valley. Pick any disaster site from the globe, or add `?globe=0` to the URL to skip the globe.

**Run a scenario headless** and write the log set (5–9× faster than real time):

```bash
python run_scenario.py scenarios/synthetic_quickstart.json          # ~1.5 min
python run_scenario.py scenarios/kedarnath_landslide.json --out logs/ked
python run_scenario.py scenarios/stress_hidden_disturbances.json --strategy static   # the baseline
```

**Run the benchmark suite** (every scenario × 3 seeds × {adaptive, baseline}, in parallel):

```bash
python -m bench.uavx_suite       # writes results/uavx_benchmarks.{json,md} and results/sample_logs/
```

**Run the tests** (158 tests, about 4 minutes):

```bash
python -m pytest
```

---

## 4. Scenarios and disturbances

A scenario fixes everything needed to reproduce a run: terrain, seed, fleet, GCS, geofence, tasks, time limit, weather and a timeline of hidden disturbances. Times are mission seconds after launch. Positions are local metres (`x`, `y`) or corridor-relative (`along` 0–1, `offset_m`), so a scenario works on any terrain. The full format is documented at the top of `mission/scenario.py`.

| Scenario | Site | Fleet | Tasks | Time | What happens |
|---|---|---|---|---|---|
| `synthetic_quickstart` | training valley | 5 | 8 + 1 new | 12 min | relay failure, interference zone, 25% packet loss, new P1 report |
| `kedarnath_landslide` | Kedarnath (2013 debris flow) | 6 | 10 + 6 new | 15 min | relay failure, GCS receiver outage, packet loss, P1 region, interference, relay battery fault, scout radio failure, late P1 report |
| `uttarkashi_earthquake` | Uttarkashi (1991 M6.8 area) | 5 | 9 + 6 new | 15 min | aftershock collapse report, scout lost, relay↔GCS link failure, monsoon rain, packet loss, P1 region, a second aircraft lost |
| `stress_hidden_disturbances` | training valley | 5 | 8 + 7 new | 15 min | everything the Stage 2 brief lists, twice: two UAV failures, radio failure, GCS outage, severed link, area RF degradation, 40% loss, battery fault, three new emergencies |

These are the disturbance types (`mission/disturbances.py`). The same code serves the scenario director and the dashboard's live injects:

| Type | Effect on the simulation (never on the swarm's knowledge) |
|---|---|
| `uav_failure` | An aircraft (by id, or the first `relay` / `scout`, or `random`) falls out of the sky |
| `comm_outage` | Regional RF interference (`along`/`x,y` + `radius_m`), one aircraft's radio (`uav`), the GCS receiver (`gcs: true`), or an area-wide noise rise (`scope: global`) |
| `packet_loss` | Extra loss on every link (`*`) or on one aircraft's links |
| `link_failure` | One named link (for example `UAV-1` ↔ `GCS`) carries nothing |
| `new_task` | A point task, or a `region` expanded into survey cells, released now |
| `battery_fault` | An aircraft's power draw jumps and its thrust authority drops |
| `weather` | Heavy rain (lower cloud base, wet antennas, turbulence), a downdraught cell, or GNSS degradation |
| `wind_gust`, `phase` | A gust, or a label for the dashboard's phase bar |

## 5. Metrics and logs

Metrics are computed by `mission/metrics.py` in the challenge's own categories.

| Category | Metric | Definition |
|---|---|---|
| Mission | completion rate | Released tasks whose survey data reached the GCS before the deadline ÷ released tasks |
| | completion time | Mission time when the last released task was delivered |
| | priority-weighted score | Σ weight × delivered ÷ Σ weight, with P1 = 3, P2 = 2, P3 = 1 |
| | emergent response | Time from a new task's release to its data arriving at the GCS |
| Communication | packet delivery ratio | Delivered ÷ generated packets. Telemetry is 2 Hz per UAV and dropped after 2 s. Survey data is 12 chunks per task, delay-tolerant. |
| | latency | Creation → arrival at the GCS, per telemetry packet (mean, p95) |
| | connectivity availability | Airborne time with an end-to-end path of reliability ≥ 0.5 to the GCS ÷ airborne time |
| | downtime | Airborne time without such a path, summed over UAVs; outage count and longest outage |
| Autonomy | relay reallocations | Every role change, logged with its reason (launch, promotion, demotion, handover) |
| | recovery time | Per disruption: until every airborne UAV has had a path for 1 s. 0 if it never lost one. |
| | reconfiguration efficiency | 1 − (role changes undone within 30 s ÷ role changes) |
| Robustness | after failures | Availability and PDR over the 60 s after each disruption vs the 60 s before, and over the whole post-disruption mission |
| Safety | collisions / separation | Pairs closer than 3 m (per incident); minimum distance between any two airborne UAVs over the mission |
| | charge / geofence | Aircraft that ran flat; excursions outside the keep-in polygon or above the AGL ceiling; minimum battery |

Every run writes the following log set. The organisers will publish a standard log format; `mission/recorder.py` is the single place to adapt to it.

| File | Contents |
|---|---|
| `run_meta.json` | Scenario source, seed, code version (git hash), platform, wall-clock time |
| `scenario_resolved.json` | The exact world flown: GCS, pads, geofence, every task with its release time and outcome |
| `events.jsonl` | Every mission event in sim time: launches, tasking, pre-emption, surveys, deliveries, disturbances, failover, handovers, RTH and landings |
| `uav_state.csv` | 1 Hz per UAV: position, AGL, speed, role, status, phase, battery, connected, path PDR, hops, GCS link, radio state, task, data backlog |
| `links.csv` | 1 Hz: every live link and its PDR, including to the GCS |
| `packets.csv` | Every packet: class, source, task, created, delivered, latency, hops, retries, outcome |
| `metrics.json` | The summary above plus indicative rubric scores |

Sample logs from one run of each scenario are in `results/sample_logs/`. A live run can record the same set with `run_node.py --log-dir logs/`. The dashboard serves the current metrics at `/api/summary`.

---

## 6. Results

Measured, not narrated: `python -m bench.uavx_suite` flies every shipped scenario with 3 seeds. It flies each one twice: once with the adaptive system, and once with a **fixed-role baseline**. The baseline keeps the same flight control, energy-aware RTH, geofence, relay placement network and packet model, but its roles are fixed at launch (one relay, the rest scouts). It has no failover promotion, no pre-emption, no handover, no standby, and no change in relay count. The difference between the two columns is what the adaptive autonomy is worth. Values are mean ± s.d. over all runs (12 per column), so the spread mostly reflects differences *between* scenarios. Seeds vary radio fading, packet outcomes and, in the stress scenario, task placement. Per-run values are in `results/uavx_benchmarks.json`, and full logs of one run per scenario are in `results/sample_logs/`.

| Metric | Adaptive (this system) | Fixed-role baseline |
|---|---|---|
| completion rate | 97.3 ± 3.2% | 87.8 ± 15.3% |
| priority weighted score | 96.7 ± 3.9% | 84.0 ± 19.3% |
| emergent response s | 42.0 ± 13.0 s | 179.7 ± 29.9 s |
| packet delivery ratio | 96.7 ± 2.1% | 91.6 ± 5.5% |
| latency ms mean | 9.1 ± 2.1 ms | 9.3 ± 2.1 ms |
| connectivity availability | 95.3 ± 3.1% | 88.6 ± 7.2% |
| downtime s total | 123.6 ± 79.3 s | 273.2 ± 182.9 s |
| relay reallocations | 8.0 ± 1.9 | 6.9 ± 1.6 |
| reconfiguration efficiency | 100.0 ± 0.0% | 100.0 ± 0.0% |
| recovery time s mean | 6.7 ± 5.1 s | 13.4 ± 9.4 s |
| post disruption availability | 93.9 ± 4.0% | 84.5 ± 9.4% |
| post disruption pdr | 95.7 ± 2.7% | 88.6 ± 7.2% |
| collisions | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min separation m | 17.1 ± 5.4 m | 19.0 ± 7.4 m |
| geofence violations | 0.0 ± 0.0 | 0.0 ± 0.0 |
| battery depleted | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min battery pct | 21.3 ± 7.0% | 33.6 ± 11.6% |

| Scenario |Completion | Priority-weighted | PDR | Availability | Recovery | Collisions | Min battery |
|---|---|---|---|---|---|---|---|
| synthetic_quickstart | 100.0 ± 0.0% | 100.0 ± 0.0% | 95.4 ± 0.1% | 93.9 ± 0.0% | 4.6 ± 0.1 s | 0.0 ± 0.0 | 24.1 ± 0.4% |
| kedarnath_landslide | 93.8 ± 0.0% | 92.1 ± 0.0% | 97.2 ± 0.0% | 95.8 ± 0.0% | 8.9 ± 0.0 s | 0.0 ± 0.0 | 10.5 ± 0.2% |
| uttarkashi_earthquake | 100.0 ± 0.0% | 100.0 ± 0.0% | 100.0 ± 0.0% | 100.0 ± 0.0% | 0.0 ± 0.0 s | 0.0 ± 0.0 | 29.4 ± 0.8% |
| stress_hidden_disturbances | 95.6 ± 3.1% | 94.6 ± 3.8% | 94.3 ± 0.2% | 91.5 ± 0.7% | 13.3 ± 2.9 s | 0.0 ± 0.0 | 21.3 ± 2.1% |

What the numbers say:

- **These are measured with the swarm learning about every disturbance itself.** Failures come from missing heartbeats, faults from battery current, interference from noise readings and DF bearings, wind from its own estimators. None of it is told to the swarm.
- **Priority handling is where adaptation pays most.** New emergencies reach the GCS in about 42 s, against about 180 s when they have to wait for a free scout.
- **Completion and priority-weighted score** are about 97% against 84–88%. The misses are Kedarnath's P1 report at T+600 s, whose round trip does not fit the 300 s left (the planner holds every aircraft to being on its pad by the deadline), and one task in two of the three stress-scenario seeds.
- **Communication** is better throughout: higher PDR and availability, less than half the downtime, and recovery twice as fast after disruptions, because the chain is re-sized and re-staffed instead of left as it was launched.
- **Uttarkashi is a draw.** The valley there is straight and open, one relay covers everything, and there is little for adaptation to win.
- **Safety:** no collisions, geofence violations or flat batteries in any run. The adaptive system flies its batteries harder (minimum 21% against 34%, and 10.5% in Kedarnath) because it keeps aircraft working longer, but always above the 8% landing reserve.

---

## 7. The dashboard

The operations view shows the real terrain, the GCS with its pads, the geofence, the survey tasks, the aircraft and their radio links. Tasks are coloured by priority (P1 red, P2 amber, P3 yellow), then blue once surveyed and green once their data is at the GCS. A new emergency pulses.

| To… | Do this |
|---|---|
| Start the mission | **Launch mission** (Operator Control, or the ground-base console) |
| Report a new emergency | **+ Emergency**, then click the valley. It is a P1 task; watch a scout get pre-empted. |
| Open a communication-outage zone | **+ Interference**, then click. The slider sets its power. Ridges shield aircraft from it. |
| Throw a Stage 2 disturbance | **Inject a disturbance** (fail relay/scout, radio out, GCS outage, packet loss, battery fault, weather), or the **Disturbances** panel |
| Fail / restore an aircraft | **Fail UAV** on its card, then **Return to service** (it goes back on its pad) |
| Fly an aircraft yourself | Select it → **Send to…** → click. **Release to autonomy** hands it back. |
| Watch the scripted demonstration | **Weather & reports → Run scripted demo**: launch, degraded comms, UAV failure, emergency region, recharge and handover (5 phases, 60 s each) |
| Get the metrics | **Mission metrics (JSON)**, or `GET /api/summary` |

The **Communication & Roles** panel shows the relay requirement and how many relays are flying, PDR, latency, availability, downtime, reallocations, recovery time and the data waiting in the air. The **ground base** view (`?view=base`) is the GCS mission-control screen.

**Three laptops.** `python run_node.py --role sim` on one laptop, `--role edge --peer <ip>` on a second (relay placement and causal diagnosis), and `--role gcs --peer <ip>` on a third (SITREP synthesis). Every laptop serves the full dashboard. If an edge node goes quiet for 1.5 s, the sim node takes its work back.

---

## 8. What is inside

```
sim/       world.py        terrain + GCS + geofence + tasks; knife-edge RF obstruction
           energy.py       battery/time planning: RTH threshold, task affordability, handover threshold
           guidance.py     tasking, pre-emption, routes, RTH, landing, recharge, lost-link, geofence
           deconfliction.py predictive separation assurance
           physics.py, wind.py, rf_channel.py, terrain.py, injects.py, runner.py (50 Hz loop)
mesh/      roles.py        relay requirement from terrain, who flies what, handover, launches, standby
           traffic.py      packet-level telemetry/survey traffic, store-and-forward, comms metrics
           awareness.py    what the swarm believes, from measurements only (heartbeats, acks, noise, ...)
           election.py     heartbeat-based relay failover    routing.py  SCM-aware routing incl. GCS
           interference.py detect/localise interference, withdraw scouts, hold dead-zone targets
gnn/       E(3)-equivariant relay placement + differentiable terrain link budget
scm/       structural causal model of link loss + do(Δz) altitude interventions
ltc/       cascaded PID (flies) and Liquid Time-Constant controller (shadow / selectable)
mission/   scenario.py (format, loader, director)  disturbances.py  metrics.py  recorder.py (logs)
rag/       on-board detection → embeddings → cited SITREPs
gcs/       backend (FastAPI + WebSocket) and frontend (React + Three.js)
cluster/   three-laptop discovery and delegation
bench/     uavx_suite.py (mission benchmark) and component benchmarks
scenarios/ the shipped mission scenarios      terrain_packs/ real-terrain sites
run_node.py   live node / dashboard            run_scenario.py   headless run + logs
```

### Real terrain

| Site | Region | Elevation | Event |
|---|---|---|---|
| Kedarnath | Rudraprayag, Uttarakhand | 2,803–4,806 m | 2013 flash flood and debris flow |
| Uttarkashi | Uttarkashi, Uttarakhand | 1,084–2,167 m | 1991 M6.8 earthquake area |
| Joshimath | Chamoli, Uttarakhand | 1,350–3,048 m | 2023 land subsidence; 2021 Chamoli flood upstream |
| Chungthang | Mangan, Sikkim | 1,441–3,550 m | 2023 South Lhonak glacial-lake outburst flood |
| Nanda Devi Sanctuary | training model | 617–1,553 m | procedural valley for repeatable benchmarks |

Each site is a 5.1 × 5.1 km pack with a 5 m elevation grid (AWS Open Data terrain tiles, SRTM/Copernicus-derived) and Sentinel-2 cloudless imagery (EOX, CC BY 4.0). The mission corridor follows the valley floor, found by dynamic programming over the heightmap. To add a site, add it to `THEATRES` in `tools/build_terrain_packs.py` and run `python tools/build_terrain_packs.py <id>` once, with internet.

### Component evidence

These are logged results from `python -m bench.run_benchmarks`, in `models/benchmarks.json`. They test the components in isolation, so the move to the ground-station model does not change them. That script's older mission section is superseded by `bench.uavx_suite` above.

- **Relay placement:** on held-out terrain, the GNN proposal plus 20 refinement steps gains +18.5 ± 36.3 connectivity points over naive placement (48 layouts, 6 terrains), in about 1.4 ms for the proposal and 21 ms for the refinement. The GNN alone is a modest optimiser; most of the gain comes from the refinement it initialises.
- **Causal diagnosis:** it never blamed terrain for an interference-caused loss (100%). It confirms genuine terrain shadow only about 20% of the time, because a single-node altitude probe has little leverage when the ridge is near the far node. Inconclusive tests are reported as *confounded*, never as a cause.
- **Flight control:** the Liquid Time-Constant controller did **not** beat the cascaded PID on paired gust trials (PID was better in 16/16 in-distribution and 14/16 out-of-distribution trials, with half the control effort). So the PID flies, and the LTC runs in shadow or with `--controller ltc`.

---

## 9. Known limitations

- **Simulation only.** C-DAWN is its own Python simulator ("equivalent" under the challenge rules): one model for terrain, RF and flight. A PX4 SITL / ROS 2 bridge is planned for Stage 2. The autonomy talks to vehicles only through setpoints, so it would replace the physics and controller hooks, not the autonomy. It is not implemented yet.
- **Physics simplifications.** Air density is not adjusted for altitude. Batteries are a linear state-of-charge model: about 18 minutes in hover, and a "swap" is a 90–120 s recharge on the pad.
- **Radio model.** A single 900 MHz band. There is no MAC contention or bandwidth limit beyond a per-node survey rate, and interference sources are omnidirectional.
- **Deterministic scenarios.** Seeds vary radio fading, packet outcomes and (in the stress scenario) task placement. Disturbance timelines are fixed per scenario, so the spread across seeds is small. Hidden Stage 2 scenarios are the real test.
- **Standby costs energy.** Idle scouts loitering for new emergencies arrive faster but burn hover power. The policy stands them by only while they could still reach the far end of the area.
- **Simulated detections.** Detections and SITREPs are generated from task categories, not from imagery (no YOLO or LLM in the loop). SITREPs come from a template that cannot hallucinate.
- **The planner is conservative.** It uses a 1.2 safety factor, an 8% landing reserve, and every aircraft home by the deadline. A task at the edge of the energy or time envelope is declined rather than risked. In the shipped scenarios this costs a late emergency report in Kedarnath and an occasional task in the stress scenario, and never an aircraft.

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| Port already in use | The launcher moves to the next free port and prints it |
| Blank dashboard | `cd gcs/frontend && npm install && npm run build` |
| Peers never appear (3 laptops) | Venue Wi-Fi isolates clients: use `--peer <sim-IP>`; allow Python through the firewall |
| 3D view is slow | Enable hardware acceleration in Chrome; detail drops automatically on software rendering |

MIT licence.
