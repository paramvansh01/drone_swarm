# C-DAWN — Causal Dynamic Aerial Wireless Network

**Resilient BVLOS swarm autonomy for disaster response and contested RF environments.**
PUSHPAK Grand Challenge 2026 · Grand Challenge 1 (UAV-X) · Simulation track

A five-aircraft swarm surveys **real Himalayan terrain** (Galwan, Dras, Siachen, Kedarnath, Tawang),
chosen from a globe, or a synthetic training valley. Relays position themselves with an E(3)-equivariant GNN, a
structural causal model tests *why* each link fails before acting on it, and the
whole mission runs across three laptops on one Wi-Fi network, each showing a
cinematic Three.js view of the same live state.

Everything on screen is labelled **simulation**. Nothing here has flown.

---

## 1. Three-laptop demonstration

| Laptop | Callsign | Role | What it computes |
|---|---|---|---|
| 1 | **ALPHA** | `sim` | Authoritative world: flight dynamics, flight control, RF channel, guidance |
| 2 | **BRAVO** | `edge` | E(3)-GNN relay optimisation and SCM causal diagnostics/interventions |
| 3 | **CHARLIE** | `gcs` | RAG pipeline and SITREP synthesis; operator dashboard |

These roles split real work between machines; they aren't three copies of one screen. BRAVO computes relay stations and
`do(Δz)` altitude commands and sends them to ALPHA, which executes them on the aircraft. CHARLIE runs
detection, retrieval and report generation. **Every laptop serves the full dashboard on its own IP**,
so any of them can go on the projector.

### Setup (once per laptop)

```bash
git clone https://github.com/paramvansh01/hackbattle_drone.git
cd hackbattle_drone
python3 -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

The dashboard is pre-built in `gcs/frontend/dist/`, so the laptops **do not need Node.js**.
Trained model weights ship in `models/`. Everything runs offline once installed.

### Launch

Put all three laptops on the same Wi-Fi network, then launch **ALPHA first**:

```bash
# Laptop 1 — ALPHA
python run_node.py --role sim
```

ALPHA prints its address, for example `Dashboard  http://192.168.1.21:8080`. Then:

```bash
# Laptop 2 — BRAVO
python run_node.py --role edge --peer 192.168.1.21

# Laptop 3 — CHARLIE
python run_node.py --role gcs  --peer 192.168.1.21
```

Open any laptop's printed URL in Chrome. Within a few seconds the **Cluster** panel shows all three
nodes with their IPs, and the ownership rows show *Relay optimisation → BRAVO*,
*Causal diagnostics → BRAVO*, *SITREP synthesis → CHARLIE*.

`--peer` is optional because nodes also find each other by UDP broadcast on port 45454. Give it
anyway at a venue: many conference networks block traffic between wireless clients.

### If a laptop drops out

Nothing stops. Delegation is granted only while results keep arriving. If BRAVO goes quiet for
1.5 s, ALPHA takes relay optimisation and causal diagnostics back and runs them locally. This was
tested by killing BRAVO mid-mission; its work was back on ALPHA within 5 s. Restart BRAVO and it takes the
work over again on its first result.

### Single laptop (rehearsal / fallback)

```bash
python run_node.py            # --role all is the default; same as: python demo/run_demo.py
```

### Useful flags

| Flag | Meaning |
|---|---|
| `--port 8080` | HTTP port (moves to the next free port if busy) |
| `--theatre kedarnath` | Starting theatre (`synthetic`, `galwan`, `kargil`, `siachen`, `kedarnath`, `tawang`) |
| `--mode interactive\|scripted` | Default `interactive`: nothing happens until the operator acts. `scripted`: the timed 4-phase run |
| `--phase-duration 45` | Seconds per phase in the scripted run (4 phases ≈ 3 minutes) |
| `--no-scout-promotion` | Keep every scout surveying after a relay loss (more targets, possible comms gaps) |
| `--controller pid\|ltc` | Flight controller to fly. Default `pid`; see §6.1 for why |
| `--scenario high_pass` | Harder terrain (`demo/scenarios/`) |
| `--no-browser` | Don't auto-open a browser |

---

## 2. Theatres — real terrain

The dashboard opens on a **globe**. Pick a theatre and the simulation rebuilds on that real terrain;
the swarm, the RF model and the 3D view all use the same elevation data. **Theatre ▾** in the header
reopens the globe at any time.

| Theatre | Region | Elevation | Use case |
|---|---|---|---|
| Galwan Valley | Eastern Ladakh | 4,122–6,070 m | Border surveillance, casualty evacuation relay |
| Dras – Tololing | Kargil, Ladakh | 3,042–4,490 m | Ridge-line observation, highway corridor security |
| Siachen Base | Nubra, Ladakh | 3,527–5,327 m | Logistics relay, avalanche search and rescue |
| Kedarnath | Rudraprayag, Uttarakhand | 2,802–4,806 m | Flood / landslide response (2013 disaster site) |
| Tawang | Arunachal Pradesh | 1,964–3,530 m | Sector surveillance, landslide response |
| Nanda Devi Sanctuary | Garhwal (procedural training model) | 617–1,553 m | Training and repeatable benchmarks |

Each theatre is a 5.1 × 5.1 km **terrain pack** in `terrain_packs/`, with a 10 m elevation grid and
the matching satellite image draped on it. Packs ship in the repo, **so nothing is downloaded at the
venue**.

- **Elevation:** AWS Open Data Terrain Tiles (SRTM / Copernicus DEM derived). Public, no API key.
- **Imagery:** Sentinel-2 cloudless 2016 by EOX IT Services (contains modified Copernicus Sentinel
  data 2016), CC BY 4.0.
- **Globe:** NASA Blue Marble (public domain) for the whole Earth. As you zoom in, Sentinel-2
  cloudless map tiles stream in at the resolution the camera needs. The node caches them in
  `terrain_packs/_tiles/`.
- **Close-up imagery (local only):** `build_terrain_packs.py` also saves Esri World Imagery
  (~2 m/px) as `*_hr.jpg`, for the sharp theatre view. These files are **gitignored** because Esri
  imagery may not be redistributed. Without them, the committed Sentinel-2 imagery is used.
- **Nanda Devi Sanctuary** is our original procedurally generated valley. It is placed at a real
  Himalayan peak on the globe, but its terrain is synthetic.
- **Mission corridor:** in real terrain the valley isn't carved in, so it is *found*. A dynamic-
  programming search picks the cheapest west→east path along low ground. For Kedarnath it traces
  the Mandakini valley up to the temple (≈ 3,600 m).
- **Orientation:** a theatre whose main valley runs north-south is rotated so the mission axis runs
  across the map. The on-screen **compass** always shows true north.

**Before an offline venue**, run these once on each laptop while it has internet. They add the
high-resolution close-ups and fill the globe's tile cache (~1,600 tiles, a few minutes):

```bash
python tools/build_terrain_packs.py          # terrain packs + Esri close-ups
python tools/build_terrain_packs.py mids     # globe imagery around each theatre
python tools/build_terrain_packs.py tiles    # globe satellite tile cache
```

**Adding a theatre:** add an entry (name, lat/lon, snow line) to `THEATRES` in
`tools/build_terrain_packs.py` and run `python tools/build_terrain_packs.py <id>` once, on a
connected machine. It appears on the globe after a server restart. MapmyIndia / Mappls could later
provide place search and official basemaps with an API key. Mappls does not supply raw elevation,
so the terrain itself still comes from open DEM data.

---

## 3. Mission phases — rehearsal, then the live operation

The demonstration runs in two phases across two laptops.

**Phase 1 — pre-mission rehearsal (ground base).** The swarm trains against the
selected theatre: real terrain, valley wind, terrain-masked links, operator-placed
jammers. Nothing here is scripted, and the rehearsal is what the swarm carries into the
mission: its backhaul PDR, self-heal time, relay solve count and surveyed targets are
recorded as the readiness baseline.

**Phase 2 — live mission (forward node).** `Launch mission` commits the swarm. The
mission node flies it; every parameter streams back to the ground base, which is where a
human approves anything the field cannot authorise itself.

```bash
# Laptop 1 — GROUND BASE (mission control, approvals)
python run_node.py --role gcs --peer 192.168.1.21

# Laptop 2 — FORWARD NODE (authoritative simulation of the operation)
python run_node.py --role sim --theatre galwan      # this is 192.168.1.21

# Laptop 3 (optional) — tactical edge compute: GNN + causal layer
python run_node.py --role edge --peer 192.168.1.21
```

Both dashboards show the same authoritative state. Operator commands issued at the base
are forwarded to the mission node, so the base can act as well as watch.

### Injects — what the exercise controller throws at it

Once the mission is live, five stressors can be injected on the spot. Each acts on the
physics, not on the display:

| Inject | What it actually does |
|---|---|
| **Heavy rain** | Roughens the wind field, wets the antennas (up to 3.5 dB per aircraft), raises power draw ~40%, cuts optical detection range. Feeds the causal model's weather term. |
| **Downdraught cell** | A drifting mountain-wave cell with a 9 m/s sink that will fly an aircraft into the ground. |
| **GNSS denial** | A spoofing bubble: the believed position drifts steadily, so aircraft fly to the wrong place until the mesh ranging disagrees enough for the swarm to notice and fall back to terrain-relative navigation. |
| **Equipment fault** | Motor/ESC failure: thrust authority cut ~45%, power draw doubled. The aircraft cannot hold station in gusts and RTHs. |
| **Hostile UAV** | An enemy interceptor drone that hunts the swarm and rams the aircraft it is chasing. |

### How the swarm survives them

- **Causal layer.** With rain, terrain and jamming acting at once, the SCM now carries a
  weather regressor of its own (`L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_W·W + β_θ·θ)`), so
  loss caused by wet antennas and gust-loaded attitude is not blamed on the mountain. The
  intervention engine still proves terrain by experiment rather than inference (§3).
- **GNN relay layer.** Every evasion, withdrawal and aircraft loss changes the topology;
  the relay optimiser re-solves against the live link budget (including located jammers)
  and repositions the mesh to hold the backhaul.
- **Threat response.** A detected hostile UAV makes the threatened aircraft break away and
  descend behind terrain, and raises an IMMEDIATE support request to the ground base.
- **Support requests.** The field node can ask, but not act: `INTERCEPTOR` release and
  `REPLACEMENT_UAV` both require a human at the base to approve. Approving an interceptor
  against a hostile UAV switches its seeker to radar/optical tracking of a moving target.

---

## 3. Operator guide — everything is under your control

The simulation starts with five aircraft holding station and **nothing scripted**. Whoever has the
mouse decides what happens. The **Operator Control** panel sits in the top-right of the 3D view.

| To… | Do this |
|---|---|
| Deploy a drone | **+ Scout** or **+ Relay**, then click the terrain. Scouts task themselves to targets; the GNN positions relays |
| Mark a survey target | **+ Target**, then click the terrain. The nearest free scout is tasked to it |
| Emplace a jammer | **+ Jammer**, then click the terrain. The slider sets its power. Its signal is blocked by terrain like any other radio, so a drone can hide behind a ridge |
| Take a drone down | **Take down** on any aircraft in the Swarm list (or select it in 3D). It falls, and the mesh self-heals |
| Bring it back | **Relaunch** |
| Fly a drone yourself | Select it → **Send to…** → click the destination. **Release to autonomy** hands it back |
| Change a drone's job | **Make relay / Make scout** |
| Weather | **▸ Weather & mission** → wind speed/direction sliders, **Trigger gust** |
| Situation report | **▸ Weather & mission** → **Generate SITREP**, then **Download** in the Situation Report panel |
| Strike a jammer | Once the swarm has located it, **Authorise interceptor** (alert card, or select the jammer). Two per mission; **Abort** while in flight |
| Remove a jammer / target | **Select** tool → click it → Neutralise (ground team) / Cancel |
| Start over | **Reset mission to start** (sidebar) |
| The hands-off 3-minute demo | **Run scripted 4-phase demo** |

**Esc** always returns to the Select tool. A drag orbits the camera and a click places things. Every
operator action is written to the Mission Log. Commands also work over REST:
`curl -X POST localhost:8080/api/cmd/add_drone -d '{"role":"SCOUT","x":1500,"y":2050}'`.

**Jamming — find, fix, finish.** A placed jammer is handled end to end by the autonomy, with a
human deciding on the strike:

1. **Detect** — every aircraft reports the noise floor at its receiver; a rise of more than 6 dB is jamming.
2. **Locate** — the swarm fits a one-emitter propagation model (free-space loss plus terrain diffraction)
   to those readings. It never reads the true position; the amber dashed ring is its estimate and
   uncertainty, and the jammer card shows how far off it was.
3. **Respond** — scouts that lose every link withdraw to the best predicted link position, targets the
   jammer overpowers are held, and the relay planner includes the jammer in its link model.
4. **Finish** — the operator authorises a home-on-jam interceptor (`mesh/electronic_warfare.py`,
   `sim/interceptor.py`). It flies a terrain-clearing route to the estimate, then its passive seeker
   locks the jammer's own emission and it homes with 3-D proportional navigation (8 g limit). A ridge
   between them breaks lock; an overshoot triggers a re-attack; the fuze arms only after 300 m flown.
   Launch is refused until the swarm has a fix.

**Failure handling.** When a relay goes down, the election fills only the vacant role and never
demotes a working aircraft. If relays fall below two, it promotes the best-placed scout to relay
duty, but always keeps at least one scout surveying (§6).

---

## 4. Reading the dashboard

The layout is built for a lit briefing room and a projector: a light background, and colour used only for state
(**green** nominal, **amber** caution, **red** alert).

- **Situation banner (top-left):** the phase, a plain-language description of what's happening, and
  **System action**, one sentence on what the autonomy is doing and why. For example: *"Ruled OUT
  terrain on RELAY-2↔SCOUT-1: altitude made no difference, so the loss is hostile or range-limited.
  Rerouting instead of climbing."*
- **3D view:** the real terrain mesh (the same heightmap the RF model uses), the five aircraft, radio
  links coloured by delivery ratio, survey beacons (amber → green when surveyed), and a red envelope
  while jamming is active. An automatic director cuts between establishing cranes, chase, close orbit,
  ridge and overhead shots, and cuts to events such as node loss or jamming. **Drag to orbit, scroll to
  zoom**; press **AUTO** to hand the camera back. Click an aircraft in the Swarm panel to frame it.
- **Causal Diagnostics:** the fitted structural equation, the verdict of the latest altitude test,
  and, when the test could not identify a cause, *why not*.
- **Relay Topology:** connectivity before, after the GNN's proposal, and after refinement, each shown separately.
- **Flight Control:** live tracking error, plus the divergence of the other controller running
  in shadow on the same gust.
- **Logged Evidence:** the offline benchmark results (§6) next to the live figures.
- **Metrics strip (bottom):** backhaul PDR, survey progress, battery, end-to-end self-heal time,
  relay solve time, closest approach, collisions.

### Scripted 3-minute run (optional)

Press **Run scripted 4-phase demo** (or launch with `--mode scripted`) for a hands-off run:

| Phase | Default window | What to point at |
|---|---|---|
| 1 · Launch & Survey | 0–45 s | Scouts climb out and follow the valley; relays take GNN stations; the director's establishing shots |
| 2 · Contested RF | 45–90 s | RF degrades at +6 s and jamming starts at +16 s. Watch the red envelope, the causal tests, and the confounded verdicts when the jammer moves mid-test |
| 3 · Node Loss | 90–135 s | RELAY-1 is killed at +6 s. The camera cuts to it, the election runs, and **Self-Heal** reads end-to-end latency (≈80 ms) |
| 4 · SITREP | 135–180 s | CHARLIE synthesises cited reports; every observation line traces to a drone and timestamp |

**Advance Phase** in *Demonstration Control* skips ahead. The fault buttons inject events on
demand from any laptop; BRAVO and CHARLIE forward them to ALPHA.

---

## 5. Architecture

```
sim/        terrain.py    ridged-multifractal heightmap, carved valley corridor (4 km, 513²)
            world.py      terrain + knife-edge diffraction (ITU-R P.526) RF obstruction
            physics.py    underactuated multirotor: attitude lag, slew limit, airspeed drag
            wind.py       power-law shear on height above ground + Dryden turbulence + gusts
            rf_channel.py Friis + obstruction + Rician fading, PDR averaged over a packet burst
            guidance.py   tasking, terrain-following routes, carrot setpoints, geofence, RTH
            runner.py     50 Hz loop; flies one controller, shadows the other
ltc/        ltc_cell.py, ltc_controller.py   Liquid Time-Constant controller (12.8k params)
            expert.py     privileged teacher (sees true wind)      train.py   DAgger
            pid_baseline.py   cascaded PID, tuned for this airframe
gnn/        equivariant_layer.py, topology_net.py   E(3)-equivariant relay placement
            rf_differentiable.py  torch link budget: terrain grid_sample + knife-edge
            relay_optimizer.py    GNN proposal + 20-step gradient refinement   train.py
scm/        causal_dag.py, diagnostics.py   L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_θ·θ), bounded RLS
            interventions.py  do(Δz) with probe ladder, Welch test, confound detection
            causal_layer.py   per-link orchestration, one intervention in flight at a time
mesh/       election.py, routing.py, mesh_network.py
rag/        detector.py, embedder.py, vector_store.py, sitrep_generator.py
cluster/    discovery.py (UDP), node.py (delegation), edge_client.py (WebSocket stream)
gcs/        backend/ FastAPI + WebSocket (20 Hz)   frontend/ React + Three.js
bench/      run_benchmarks.py, ltc_vs_pid.py
run_node.py single launcher for every role
```

---

## 6. Results

These are logged, not narrated. All figures are mean ± s.d. over repeated randomised runs, regenerated by
`python -m bench.run_benchmarks` and stored with protocols and per-trial values in
`models/benchmarks.json`.

| Rubric metric | Target | Measured | Notes |
|---|---|---|---|
| Mission completion | all PoIs in battery margin | **66.7 ± 0.0 %** (5 valleys) | 4 of 6 targets per 200 s run, with 54 % battery left. After the relay kill a scout becomes a relay, which costs one target per run but keeps comms at 100 % (§6). `--no-scout-promotion` gets 5 of 6 back, at the price of a comms blackout of up to 17 s |
| Communication resilience | PDR > 92 % in degradation | **99.9 %** backhaul under jamming | Links in this valley are short (< 1.5 km), so the scripted −74 dBm jammer barely bites. Operator-placed jammers (+ Jammer) are much more aggressive |
| Autonomous relay management | no manual relay planning | **+18.5 ± 36.3 pts** connectivity over naive placement | 48 layouts on 6 terrains never seen in training; gain in 46 %, the rest were already optimal or infeasible. 1.4 ms proposal + 21 ms refinement |
| Fault recovery | self-heal < 300 ms | **80 ms** end-to-end; **0 s** of backhaul outage after the relay kill (5 terrains) | Failure → detection → election → reroute. Dominated by the 100 ms check interval, so the worst case is ≈100 ms. Election compute alone is < 0.1 ms |
| Safety & geofence | zero collisions, deterministic RTH | **0 collisions**, closest approach **25.1 m** | Spec is > 5 m. RTH is a hard rule at 22 % battery, not learned |

### 4.1 LTC flight controller vs cascaded PID: the claim did not hold

`bench/ltc_vs_pid.py` flies both controllers through **identical** seeded gust profiles:

| Regime | Controller | Cross-track RMS | Peak gust excursion | Control effort | Better on trial |
|---|---|---|---|---|---|
| In distribution (9–14 m/s) | LTC | 0.62 m | 1.25 m | 16.4 m/s² | 0 / 16 |
| | **PID** | **0.18 m** | **0.74 m** | **6.6 m/s²** | 16 / 16 |
| Out of distribution (18–26 m/s) | LTC | 1.99 m | 4.24 m | 17.1 m/s² | 2 / 16 |
| | **PID** | **1.55 m** | **3.72 m** | **8.2 m/s²** | 14 / 16 |

The LTC is fully implemented and trained: 12.8k parameters, DAgger against a privileged expert that
sees the true wind, run in the real physics, with an action-smoothness penalty. The baseline still
beats it in both regimes, including the out-of-distribution shocks the proposal names, and uses less than half the control effort.
**The system therefore flies the PID by default.** `--controller ltc` flies the LTC instead; whichever controller
isn't flying always runs in shadow on the same state and gust, and the dashboard shows both.

### 4.2 Causal do(Δz) test: specific, not sensitive

Scored against links with a known cause (`causal` in `benchmarks.json`):

- **Jamming correctly ruled out as terrain: 100 %.** It never blamed terrain for a jammed link,
  which is the costly error (climbing into the threat while the real cause goes unaddressed).
- **Terrain confirmed: ~20 %.** There's a geometric reason. Raising one endpoint by Δz lifts the path
  over an obstruction by only Δz · d₂/D, so a ridge near the *far* node is barely cleared. The
  engine therefore keeps the proposal's +15 m as its first probe, escalates to +30 m and +60 m only
  if nothing is detected, and hands unfixable obstructions to lateral relay repositioning.
- An effect counts only if it clears **both** a 0.05 loss threshold and a Welch t-test (t ≥ 2) against
  channel noise. If the jammer's noise floor or the link range moves during the window, or the
  aircraft fails to climb, the result is reported as **confounded, not identified**. The proposal's
  stated limitation is detected and shown per test instead of being disclosed once.

### 4.3 Verified properties (`pytest`, 88 tests)

- E(3) equivariance of each message-passing layer and of the whole relay network (rotation and
  translation), checked numerically. This is the basis of the "generalises across geometries" claim.
- The differentiable link budget matches the simulator's within 0.6 dB on average.
- The terrain is bit-identical on every node (checksum), and the quantised payload round-trips to < 5 cm.
- The engine refuses to claim an effect under a moving jammer, a failed climb or pure noise, runs one
  intervention at a time, and gives back altitude after an inconclusive test.
- Cluster delegation reverts on timeout and resumes on reconnect.

```bash
python -m pytest            # or: python run_tests.py
```

---

## 7. Retraining and regenerating

```bash
python -m ltc.train --iterations 8 --episodes 80 --epochs 16 --hidden 48   # ~14 min
python -m gnn.train --epochs 1200 --scenarios 24                           # ~55 min
python -m bench.run_benchmarks          # full suite, ~7 min (--quick for a smoke test)
python -m bench.ltc_vs_pid --regime out_of_distribution --trials 16

cd gcs/frontend && npm install && npm run build   # only if you change the UI
```

---

## 8. Known limitations

- **Simulation only.** The hardware-in-the-loop track in the proposal is not implemented.
- **Real terrain, simulated physics.** Theatre elevation and imagery are real. Air density is not
  adjusted for altitude, so a drone at 5,000 m over Galwan flies as if at sea level. Imagery is a
  2016 mosaic and doesn't show current conditions.
- **The LTC does not beat PID** on this airframe and benchmark (§6.1).
- **Single-node altitude probes have limited power** against deep terrain shadow (§6.2).
- **The RAG pipeline runs in simulation mode.** Detections are sampled from each PoI's category rather than
  produced by YOLOv11 on imagery, embeddings are deterministic stand-ins for CLIP, and SITREPs come
  from a template that can't hallucinate by construction. The 100 % grounding result applies to that
  template only; a Phi-3 backend would need the same harness re-run first.
- **The GNN on its own is a modest optimiser** (+10 pts on held-out terrain). Most of the gain comes
  from the 20-step refinement it initialises; the dashboard shows both figures.
- **Relay coverage costs survey pace.** After a relay loss, a scout is promoted to relay, so fewer
  targets are surveyed in the same time (§6).
- **Jammer-aware relay placement helps less than the withdrawal does.** With the jammer in line of
  sight down the valley there is little terrain shadow to exploit: backhaul 0.21 with the jammer in
  the relay planner's link model vs 0.18 with it blind (Galwan, 25 dBm among the aircraft). Most of
  the measured recovery comes from withdrawing the scouts, not from moving relays.
- **The interceptor is a model, not a validated weapon simulation.** Point-mass flight, a fixed 18 m
  lethal radius, 1.5° of seeker bearing noise, no countermeasures or air defence against it, and a
  magazine of two. It shows the find-fix-finish loop closing; it is not a lethality estimate.
- **Jammers are omnidirectional.** Operator-placed jammers have a real position, and terrain blocks
  them, but they have no directional beam. The "Jam everywhere" quick fault is a global noise-floor rise.

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| Peers never appear | Venue Wi-Fi isolates clients: use `--peer <ALPHA-IP>`. On macOS, allow Python in *System Settings → Network → Firewall* |
| BRAVO/CHARLIE dashboard shows "Terrain unavailable" | That node can't reach ALPHA. Check that `curl http://<ALPHA-IP>:8080/api/health` works from it |
| 3D view is slow | The console reports `software rendering detected` and detail drops automatically. Enable hardware acceleration in Chrome |
| Port already in use | The launcher moves to the next free port and prints it |
| Blank dashboard | `cd gcs/frontend && npm install && npm run build` |

MIT licence.
