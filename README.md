# C-DAWN: Causal Dynamic Aerial Wireless Network

> **Resilient BVLOS Swarm Autonomy for Disaster Response & Electronic Warfare**

[![Stack](https://img.shields.io/badge/Stack-Python%20%2B%20PyTorch%20%2B%20FastAPI%20%2B%20React-purple)]()
[![Challenge](https://img.shields.io/badge/Challenge-PUSHPAK%20Grand%20Challenge%202026-blue)]()

---

## Quick Start

```bash
# 1. Setup Python environment
cd c-dawn
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 2. Build the GCS dashboard
cd gcs/frontend
npm install
npm run build
cd ../..

# 3. Launch the demo
python demo/run_demo.py
# → Opens http://localhost:8080 with the GCS dashboard
```

For development with hot-reload:
```bash
# Terminal 1: Backend
python demo/run_demo.py --port 8080

# Terminal 2: Frontend (with proxy to backend)
cd gcs/frontend && npm run dev
# → Opens http://localhost:5173
```

---

## Architecture

```
c-dawn/
├── sim/           # Python-only UAV swarm simulation engine
│   ├── world.py       3D terrain + obstacles + PoIs
│   ├── drone.py       6-DOF drone agent model
│   ├── physics.py     Flight dynamics (thrust, drag, wind)
│   ├── rf_channel.py  RF link-budget + fading + jamming
│   ├── wind.py        Dryden turbulence + gust injection
│   └── runner.py      Tick-based simulation orchestrator
│
├── ltc/           # Component 1 — LTC Flight Controller
│   ├── ltc_cell.py        Liquid Time-Constant neural ODE cell
│   ├── ltc_controller.py  Closed-loop attitude/velocity controller
│   ├── pid_baseline.py    Cascaded PID baseline
│   └── train.py           Behavioral cloning training loop
│
├── gnn/           # Component 2 — E(3)-Equivariant GNN Topology
│   ├── equivariant_layer.py  SE(3)-equivariant message passing
│   ├── topology_net.py       Attractive + repulsive topology GNN
│   ├── relay_optimizer.py    Online relay position optimizer
│   └── utils.py              Graph construction + PDR computation
│
├── scm/           # Component 3 — Structural Causal Model Diagnostics
│   ├── causal_dag.py     SCM DAG (T, D, J, θ → L)
│   ├── diagnostics.py    Online RLS + anomaly detection
│   └── interventions.py  do(Δz) execution + causal attribution
│
├── rag/           # Component 4 — Tactical Edge RAG Pipeline
│   ├── detector.py         YOLOv11-nano object detection
│   ├── embedder.py         CLIP ViT-B/32 embeddings
│   ├── vector_store.py     ChromaDB vector store
│   ├── sitrep_generator.py Phi-3-Mini SITREP + template fallback
│   └── payload.py          Signed JSON mesh payloads
│
├── mesh/          # Communication Mesh Layer
│   ├── mesh_network.py    Multi-hop mesh + PDR tracking
│   ├── routing.py         SCM-aware adaptive routing
│   └── election.py        Battery-weighted relay election
│
├── gcs/           # Ground Control Station
│   ├── backend/       FastAPI + WebSocket (10Hz telemetry)
│   └── frontend/      React + Vite premium dark dashboard
│
├── demo/          # Demo Orchestration
│   ├── run_demo.py        Single entry point
│   └── scenarios/         Pre-built canyon/urban configurations
│
└── tests/         # Unit tests
```

---

## Core Components

### 1. LTC Flight Controller
Liquid Time-Constant neural ODE with input-dependent time constants for adaptive wind-gust rejection. Benchmarked against a cascaded PID baseline on identical wind profiles.

### 2. E(3)-Equivariant GNN Relay Topology
Jointly optimizes relay positions for maximum link-budget while enforcing >5m separation. Generalizes across canyon geometries without retraining due to equivariance.

### 3. Structural Causal Model (SCM) Diagnostics
Real-time root-cause analysis: `L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_θ·θ)`. Coefficients updated online via RLS. Executes `do(Δz=+15m)` altitude interventions for causal attribution.

### 4. Tactical Edge RAG Pipeline
YOLOv11-nano + CLIP ViT-B/32 on-edge detection and embedding. ChromaDB retrieval. Phi-3-Mini SITREP generation with evidence citations (template fallback guaranteed).

---

## Demo Protocol (3 Minutes)

| Phase | Duration | Events | Key Metrics |
|-------|----------|--------|-------------|
| **1** | 45s | Swarm launch, PoI survey | Mission progress, PDR baseline |
| **2** | 45s | RF degradation + jamming | SCM diagnostics, root-cause |
| **3** | 45s | KILL NODE → self-healing | Election time (<300ms), reroute |
| **4** | 45s | SITREP synthesis | Generation time, evidence grounding |

---

## License

MIT
