import { useState, useMemo } from 'react';
import useWebSocket from './hooks/useWebSocket';

// Inline components for maximum delivery speed

function Header({ connected, simTime, phase }) {
  const phaseNames = {
    0: 'STANDBY', 1: 'LAUNCH & SURVEY', 2: 'FAULT INJECTION',
    3: 'KILL NODE', 4: 'SITREP', 5: 'COMPLETE'
  };

  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">CD</div>
        <div>
          <div className="header__title">C-DAWN</div>
          <div className="header__subtitle">Ground Control Station</div>
        </div>
      </div>

      <div className="timeline">
        {[1, 2, 3, 4].map((p, i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <div className={`timeline__step ${p < phase ? 'completed' : p === phase ? 'active' : 'pending'}`}>
              P{p}
            </div>
            {i < 3 && <div className={`timeline__connector ${p < phase ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="header__status">
        <div className="status-indicator">
          <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
          <span>{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
          T+{simTime.toFixed(1)}s
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          {phaseNames[phase] || 'UNKNOWN'}
        </span>
      </div>
    </header>
  );
}

function DroneCard({ drone }) {
  if (!drone) return null;
  const roleClass = drone.status === 'KILLED' ? 'dead'
    : drone.role === 'SCOUT' ? 'scout'
    : drone.role === 'GCS_RELAY' ? 'gcs' : 'relay';

  const roleIcon = drone.status === 'KILLED' ? '✕'
    : drone.role === 'SCOUT' ? '🔍'
    : drone.role === 'GCS_RELAY' ? '📡' : '🔗';

  const batteryClass = drone.battery > 50 ? 'high' : drone.battery > 20 ? 'mid' : 'low';

  return (
    <div className="drone-card">
      <div className={`drone-card__icon ${roleClass}`}>{roleIcon}</div>
      <div className="drone-card__info">
        <div className="drone-card__name">{drone.id}</div>
        <div className="drone-card__role">{drone.role} • {drone.status}</div>
      </div>
      <div className="drone-card__stats">
        <div className="drone-card__stat">
          <span style={{ color: 'var(--accent-amber)' }}>⚡</span>
          <span>{drone.battery?.toFixed(0)}%</span>
        </div>
        <div className="drone-card__stat">
          <span style={{ color: 'var(--accent-cyan)' }}>↑</span>
          <span>{drone.altitude?.toFixed(0)}m</span>
        </div>
      </div>
      <div className="battery-bar">
        <div className={`battery-bar__fill ${batteryClass}`} style={{ width: `${drone.battery}%` }} />
      </div>
    </div>
  );
}

function MapVisualization({ drones, world }) {
  const mapWidth = 100;
  const mapHeight = 100;
  const bounds = world?.bounds || [200, 100, 80];

  const droneEntries = Object.entries(drones || {});

  const toMapCoords = (pos) => {
    if (!pos) return { x: 50, y: 50 };
    return {
      x: (pos[0] / bounds[0]) * mapWidth,
      y: 50 - (pos[1] / bounds[1]) * 50 + 25,
    };
  };

  const getRoleClass = (drone) => {
    if (drone.status === 'KILLED') return 'dead';
    if (drone.role === 'SCOUT') return 'scout';
    if (drone.role === 'GCS_RELAY') return 'gcs';
    return 'relay';
  };

  // Build link lines
  const links = [];
  droneEntries.forEach(([id1, d1]) => {
    if (d1.status === 'KILLED') return;
    Object.entries(d1.neighbors || {}).forEach(([id2, quality]) => {
      if (id1 < id2 && drones[id2] && drones[id2].status !== 'KILLED') {
        const p1 = toMapCoords(d1.position);
        const p2 = toMapCoords(drones[id2].position);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const qualityClass = quality > 0.8 ? 'good' : quality > 0.5 ? 'moderate' : 'poor';
        links.push({ p1, length, angle, qualityClass, key: `${id1}-${id2}` });
      }
    });
  });

  // Obstacles
  const obstacles = (world?.obstacles || []).map((obs, i) => {
    const pos = toMapCoords(obs.center);
    const w = (obs.size[0] * 2 / bounds[0]) * mapWidth;
    const h = (obs.size[1] * 2 / bounds[1]) * 50;
    return { ...pos, w: Math.max(w, 2), h: Math.max(h, 2), key: `obs-${i}` };
  });

  // PoIs
  const pois = (world?.pois || []).map((poi) => ({
    ...toMapCoords(poi.position),
    surveyed: poi.surveyed,
    id: poi.id,
  }));

  return (
    <div className="drone-viz">
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.05 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`vg-${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="white" />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`hg-${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="white" />
        ))}
      </svg>

      {/* Obstacles */}
      {obstacles.map(({ x, y, w, h, key }) => (
        <div key={key} className="obstacle-rect" style={{
          left: `${x - w/2}%`, top: `${y - h/2}%`,
          width: `${w}%`, height: `${h}%`,
        }} />
      ))}

      {/* PoIs */}
      {pois.map((poi) => (
        <div key={poi.id} className={`poi-marker ${poi.surveyed ? 'surveyed' : ''}`}
          style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          title={poi.id}
        />
      ))}

      {/* Links */}
      {links.map(({ p1, length, angle, qualityClass, key }) => (
        <div key={key} className={`link-line ${qualityClass}`} style={{
          left: `${p1.x}%`, top: `${p1.y}%`,
          width: `${length}%`,
          transform: `rotate(${angle}deg)`,
        }} />
      ))}

      {/* Drones */}
      {droneEntries.map(([id, drone]) => {
        const pos = toMapCoords(drone.position);
        return (
          <div key={id}>
            <div className={`drone-dot ${getRoleClass(drone)}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${id} | ${drone.altitude?.toFixed(1)}m | ${drone.battery?.toFixed(0)}%`}
            />
            <div className="drone-label" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              {id}
            </div>
          </div>
        );
      })}

      {/* Overlays */}
      <div className="map-overlay">
        <div className="map-badge">DIGITAL TWIN — SIMULATION</div>
        <div className="map-badge">{droneEntries.length} NODES ACTIVE</div>
      </div>
    </div>
  );
}

function CausalPanel({ causalState }) {
  if (!causalState?.dag) return <div className="panel__body" style={{color:'var(--text-dim)'}}>Awaiting diagnostics...</div>;

  const coeffs = causalState.dag.coefficients || {};
  const latest = causalState.latest_diagnosis;
  const variables = [
    { key: 'β_T', label: 'Terrain', symbol: 'T', color: 'var(--accent-amber)' },
    { key: 'β_D', label: 'Distance', symbol: 'D', color: 'var(--accent-blue)' },
    { key: 'β_J', label: 'Jamming', symbol: 'J', color: 'var(--accent-red)' },
    { key: 'β_θ', label: 'Antenna', symbol: 'θ', color: 'var(--accent-purple)' },
  ];

  return (
    <div className="panel__body">
      {/* DAG Visualization */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        {variables.map(v => (
          <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div className="dag-node" style={{ background: `${v.color}15`, color: v.color, border: `1px solid ${v.color}30` }}>
              {v.symbol}
            </div>
            <span className="dag-edge">→</span>
            <span className={`dag-coefficient ${(coeffs[v.key] || 0) > 0 ? 'positive' : 'negative'}`}>
              β={coeffs[v.key]?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', margin: '4px 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
        → L (Packet Loss)
      </div>

      {/* Latest Diagnosis */}
      {latest && (
        <div style={{ marginTop: '8px', padding: '8px', borderRadius: '6px',
          background: latest.is_anomaly ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.05)',
          border: `1px solid ${latest.is_anomaly ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'}`,
          fontFamily: 'var(--font-mono)', fontSize: '10px'
        }}>
          <div style={{ color: latest.is_anomaly ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600 }}>
            {latest.is_anomaly ? '⚠ ANOMALY' : '✓ NOMINAL'}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Root cause: {latest.root_cause?.toUpperCase()} ({latest.root_cause_contribution?.toFixed(3)})
          </div>
          <div style={{ color: 'var(--text-dim)' }}>
            Observed: {(latest.observed_loss * 100).toFixed(1)}% | Predicted: {(latest.predicted_loss * 100).toFixed(1)}%
          </div>
        </div>
      )}

      <div style={{ marginTop: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
        {causalState.total_observations || 0} observations | {causalState.anomaly_count || 0} anomalies
      </div>
    </div>
  );
}

function SitrepPanel({ sitrepState }) {
  const latest = sitrepState?.latest;
  if (!latest) return <div className="panel__body" style={{color:'var(--text-dim)'}}>Awaiting SITREP generation...</div>;

  return (
    <div className="panel__body">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
          {latest.sitrep_id}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
          {latest.generation_time_ms?.toFixed(0)}ms | {latest.mode?.toUpperCase()}
        </span>
      </div>
      <div className="sitrep-text">{latest.text}</div>
    </div>
  );
}

function DemoControls({ sendCommand, phase }) {
  return (
    <div className="demo-controls">
      <button className="btn active" onClick={() => sendCommand('start_demo')}>
        ▶ Start
      </button>
      <button className="btn" onClick={() => sendCommand('advance_phase')}>
        ⏭ Phase {(phase || 0) + 1}
      </button>
      <button className="btn danger" onClick={() => sendCommand('inject_fault', { fault_type: 'rf_degrade' })}>
        📡 RF Degrade
      </button>
      <button className="btn danger" onClick={() => sendCommand('inject_fault', { fault_type: 'jamming' })}>
        ⚡ Jamming
      </button>
      <button className="btn danger" onClick={() => sendCommand('inject_fault', { fault_type: 'kill_node', params: { drone_id: 'RELAY-1' } })}>
        💀 Kill Node
      </button>
      <button className="btn" onClick={() => sendCommand('inject_fault', { fault_type: 'restore' })}>
        🔄 Restore
      </button>
      <button className="btn" onClick={() => sendCommand('reset')}>
        ⟲ Reset
      </button>
    </div>
  );
}

function MetricsBar({ metrics, election, gnn }) {
  const pdr = (metrics?.swarm_pdr || 0) * 100;
  const battery = metrics?.avg_battery || 0;
  const electionMs = election?.last_election_ms || 0;
  const pois = `${metrics?.pois_surveyed || 0}/${metrics?.total_pois || 0}`;
  const gnnMs = gnn?.convergence_time_ms || 0;

  const pdrClass = pdr > 92 ? 'good' : pdr > 70 ? 'warn' : 'bad';
  const batClass = battery > 50 ? 'good' : battery > 20 ? 'warn' : 'bad';
  const elecClass = electionMs < 300 ? 'good' : 'bad';

  return (
    <div className="metrics-bar">
      <div className="metric-item">
        <span className="metric-item__label">PDR</span>
        <span className={`metric-item__value ${pdrClass}`}>{pdr.toFixed(1)}<span className="metric-item__unit">%</span></span>
      </div>
      <div className="metric-item">
        <span className="metric-item__label">Battery</span>
        <span className={`metric-item__value ${batClass}`}>{battery.toFixed(0)}<span className="metric-item__unit">%</span></span>
      </div>
      <div className="metric-item">
        <span className="metric-item__label">Election</span>
        <span className={`metric-item__value ${elecClass}`}>{electionMs.toFixed(0)}<span className="metric-item__unit">ms</span></span>
      </div>
      <div className="metric-item">
        <span className="metric-item__label">GNN Conv</span>
        <span className="metric-item__value info">{gnnMs.toFixed(1)}<span className="metric-item__unit">ms</span></span>
      </div>
      <div className="metric-item">
        <span className="metric-item__label">Survey</span>
        <span className="metric-item__value info">{pois}</span>
      </div>
      <div className="metric-item">
        <span className="metric-item__label">Phase</span>
        <span className="metric-item__value info">{metrics?.current_phase || 0}</span>
      </div>
    </div>
  );
}

// PDR chart using CSS bars
function PDRChart({ chartData }) {
  const points = chartData || [];
  const lastN = points.slice(-40);
  if (lastN.length === 0) return null;

  return (
    <div className="chart-area" style={{ justifyContent: 'flex-end', padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '100%' }}>
        {lastN.map((p, i) => {
          const val = p.value || 0;
          const color = val > 0.92 ? 'var(--accent-green)' : val > 0.7 ? 'var(--accent-amber)' : 'var(--accent-red)';
          return (
            <div key={i} style={{
              flex: 1,
              height: `${val * 100}%`,
              background: color,
              borderRadius: '1px 1px 0 0',
              opacity: 0.7,
              minWidth: '2px',
            }} />
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', textAlign: 'right' }}>
        PDR over time
      </div>
    </div>
  );
}


export default function App() {
  const { data, connected, sendCommand } = useWebSocket();

  const drones = data?.drones || {};
  const metrics = data?.metrics || {};
  const world = data?.world || {};
  const causal = data?.causal || null;
  const sitrep = data?.sitrep || null;
  const election = data?.election || null;
  const gnn = data?.gnn || null;
  const charts = data?.charts || {};
  const simTime = data?.sim_time || 0;
  const phase = metrics?.current_phase || 0;

  // Fallback demo data when not connected
  const showDemoData = !connected || !data;

  return (
    <div className="app">
      <Header connected={connected} simTime={simTime} phase={phase} />

      <div className="main-grid">
        {/* 3D Map / Drone Visualization */}
        <div className="panel map-panel">
          <MapVisualization drones={drones} world={world} />
        </div>

        {/* Right Sidebar — Drone Telemetry + Controls */}
        <div className="sidebar">
          {/* Telemetry */}
          <div className="panel" style={{ flex: 1 }}>
            <div className="panel__header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel__accent" style={{ background: 'var(--accent-cyan)' }} />
                <span className="panel__title">Swarm Telemetry</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                {Object.keys(drones).length} nodes
              </span>
            </div>
            <div className="panel__body">
              {Object.values(drones).length > 0 ? (
                Object.values(drones).map(d => <DroneCard key={d.id} drone={d} />)
              ) : (
                <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '20px', textAlign: 'center' }}>
                  Awaiting telemetry...<br />
                  <span style={{ fontSize: '10px' }}>Start the backend: <code>python demo/run_demo.py</code></span>
                </div>
              )}
            </div>
          </div>

          {/* Demo Controls */}
          <div className="panel">
            <div className="panel__header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel__accent" style={{ background: 'var(--accent-amber)' }} />
                <span className="panel__title">Demo Controls</span>
              </div>
            </div>
            <div className="panel__body">
              <DemoControls sendCommand={sendCommand} phase={phase} />
            </div>
          </div>

          {/* PDR Chart */}
          <div className="panel" style={{ minHeight: '100px' }}>
            <div className="panel__header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel__accent" style={{ background: 'var(--accent-green)' }} />
                <span className="panel__title">PDR History</span>
              </div>
            </div>
            <div className="panel__body" style={{ padding: '4px 8px' }}>
              <PDRChart chartData={charts?.pdr} />
            </div>
          </div>
        </div>

        {/* Bottom Panels — Causal + SITREP */}
        <div className="bottom-panels">
          <div className="panel">
            <div className="panel__header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel__accent" style={{ background: 'var(--accent-magenta)' }} />
                <span className="panel__title">Causal Diagnostics (SCM)</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: causal?.anomaly_count > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {causal?.anomaly_count || 0} anomalies
              </span>
            </div>
            <CausalPanel causalState={causal} />
          </div>

          <div className="panel">
            <div className="panel__header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel__accent" style={{ background: 'var(--accent-blue)' }} />
                <span className="panel__title">SITREP — Situation Report</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                {sitrep?.total_generated || 0} generated
              </span>
            </div>
            <SitrepPanel sitrepState={sitrep} />
          </div>
        </div>
      </div>

      <MetricsBar metrics={metrics} election={election} gnn={gnn} />
    </div>
  );
}
