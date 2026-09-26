import { useEffect, useState } from 'react';

/**
 * Operator panels for the C-DAWN GCS (UAV-X disaster response).
 *
 * Written for a disaster-response operator rather than for the engineer who built the
 * system: every panel leads with what is happening and what the autonomy is
 * doing about it, and keeps the underlying model parameters available but
 * subordinate. Where a number could be misread as a guarantee (a causal
 * effect estimated under a confounded window, for instance), the panel says
 * so on the same line rather than in a footnote.
 */

const fmt = (value, digits = 1, fallback = '—') =>
  (value === null || value === undefined || Number.isNaN(value))
    ? fallback
    : Number(value).toFixed(digits);

// ---------------------------------------------------------------------------
// Situation banner
// ---------------------------------------------------------------------------

export function SituationBanner({ telemetry }) {
  const demo = telemetry?.demo;
  const metrics = telemetry?.metrics || {};
  const causal = telemetry?.causal;
  const rf = telemetry?.rf || {};

  const phase = metrics.current_phase ?? 0;
  const jamming = rf.jamming_active;
  const backhaul = (metrics.backhaul_pdr ?? 1) * 100;
  const mission = telemetry?.mission || demo?.mission || {};

  let tone = 'info';
  if (jamming || backhaul < 60) tone = 'alert';
  else if (backhaul < 90) tone = 'caution';

  // What the autonomy is currently doing, in one sentence.
  let action = 'All links nominal. Relays holding assigned stations.';

  const latest = causal?.interventions?.latest;
  const ew = rf.ew;
  const handovers = Object.entries(mission.roles?.handovers || {});
  if (mission.phase === 'PLANNING') {
    action = `Fleet on the pads. Relay chain planned for ${mission.roles?.relays_needed ?? '—'} relay(s); `
      + 'launch the mission to begin.';
  } else if (ew?.active && ew.summary) {
    action = `Interference response — ${ew.summary}`;
  } else if (handovers.length) {
    const [from, h] = handovers[0];
    action = `Relay handover: ${h.to} is flying out to take ${from}'s station before ${from} `
      + 'returns to recharge — the chain stays closed throughout.';
  } else if (latest && latest.phase === 'complete') {
    if (latest.confounded) {
      action = `Causal test ${latest.id} on ${latest.link_id} was inconclusive — `
        + 'the conditions moved during the measurement, so no cause is being claimed.';
    } else if (latest.attribution === 'terrain_occlusion') {
      action = `Diagnosed ${latest.link_id} as TERRAIN occlusion by direct test — `
        + `climbing ${fmt(latest.achieved_dz, 0)} m cut packet loss `
        + `${fmt(latest.causal_effect * 100, 0)} points. Holding the new altitude.`;
    } else if (latest.attribution === 'not_terrain') {
      action = `Ruled OUT terrain on ${latest.link_id}: altitude made no difference, `
        + 'so the loss is interference or range. Rerouting instead of climbing.';
    } else if (latest.attribution === 'partial_terrain') {
      action = `Terrain is a partial cause on ${latest.link_id}. `
        + 'Requesting relay repositioning rather than altitude alone.';
    }
  } else if (causal?.interventions?.active_count > 0) {
    const active = causal.interventions.active?.[0];
    action = `Running a controlled altitude test on ${active?.link_id ?? 'a degraded link'} `
      + 'to establish whether the cause is terrain or interference.';
  }

  return (
    <div className={`situation ${tone}`}>
      <div className="situation__head">
        <span className="situation__tag">
          {mission.phase === 'LIVE'
            ? (mission.remaining_s != null ? `${Math.max(0, Math.floor(mission.remaining_s / 60))}:${String(Math.max(0, Math.floor(mission.remaining_s % 60))).padStart(2, '0')} left` : 'Live')
            : (mission.phase || 'Standby')}
        </span>
        <span className="situation__title">
          {demo?.phase_name || 'Awaiting mission start'}
        </span>
      </div>
      <div className="situation__body">
        {demo?.phase_brief || 'System initialising.'}
      </div>
      <div className="situation__action">
        <b>System action:</b> {action}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aircraft roster
// ---------------------------------------------------------------------------

export function SwarmPanel({ telemetry, onSelect, run, selectedId }) {
  const drones = Object.values(telemetry?.drones || {});
  const ground = ['KILLED', 'CHARGING', 'READY', 'LANDED'];
  const alive = drones.filter((d) => !ground.includes(d.status)).length;
  const onPad = drones.filter((d) => ['CHARGING', 'READY'].includes(d.status)).length;

  const badgeClass = (d) => {
    if (d.status === 'KILLED') return 'dead';
    if (d.role === 'SCOUT') return 'scout';
    if (d.role === 'RELAY') return 'relay';
    return 'gcs';
  };

  const shortRole = (d) => (d.status === 'CHARGING' ? 'CHG' : d.status === 'READY' ? 'RDY' : ({
    SCOUT: 'SCT', RELAY: 'RLY', STANDBY: d.status === 'RETURNING' ? 'RTH' : 'STB',
  }[d.role] ?? '—'));

  // The swarm's own view: aircraft nobody can currently hear
  const silent = new Set(telemetry?.mission?.awareness?.suspected || []);

  const describe = (d) => {
    if (d.status === 'KILLED') return silent.has(d.id) ? 'FAILED · swarm: not heard' : 'FAILED';
    if (silent.has(d.id) && !ground.includes(d.status)) return 'NOT HEARD by the swarm (radio out?)';
    if (d.status === 'CHARGING') return `on pad · recharging ${fmt(d.battery, 0)}%`;
    if (d.status === 'READY') return 'on pad · charged, ready to launch';
    const link = !d.radio_ok ? 'radio out' : d.connected ? `${d.hops} hop${d.hops === 1 ? '' : 's'} to GCS` : 'NO LINK';
    const what = d.status === 'RETURNING' ? 'returning to GCS'
      : d.handover_to ? `handing station to ${d.handover_to}`
      : d.ew_hold ? 'withdrawn to regain link'
      : d.manual_target ? 'operator order'
      : d.role === 'RELAY' ? 'relay station'
      : (d.assigned_poi || 'standing by');
    const backlog = d.data_backlog ? ` · ${d.data_backlog} chunks queued` : '';
    return `${what} · ${link}${backlog}`;
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Swarm</span>
        <span className={`panel__badge ${alive === drones.length ? 'ok' : 'bad'}`}>
          {alive} UP · {onPad} ON PAD
        </span>
      </div>
      <div className="panel__body tight">
        {drones.length === 0 && (
          <div className="empty">Awaiting telemetry from the simulation node.</div>
        )}
        {drones.map((d) => {
          const battery = d.battery ?? 0;
          const batClass = battery > 50 ? 'hi' : battery > 22 ? 'mid' : 'lo';
          return (
            <div
              key={d.id}
              className={`aircraft ${ground.includes(d.status) ? 'dead' : ''} ${d.id === selectedId ? 'selected' : ''}`}
              onClick={() => onSelect?.(d.id)}
              title="Click to select this aircraft and frame it in the 3D view"
            >
              <div className={`aircraft__badge ${badgeClass(d)}`}>
                {shortRole(d)}
              </div>
              <div>
                <div className="aircraft__id">{d.id}</div>
                <div className={`aircraft__meta ${!ground.includes(d.status) && !d.connected ? 'bad-text' : ''}`}>
                  {describe(d)}
                </div>
                {(d.status === 'KILLED' || !ground.includes(d.status)) && (
                  <button
                    className={`mini ${d.status === 'KILLED' ? 'revive' : 'kill'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      run?.(d.status === 'KILLED' ? 'revive' : 'kill', { drone_id: d.id });
                    }}
                  >
                    {d.status === 'KILLED' ? 'Return to service' : 'Fail UAV'}
                  </button>
                )}
              </div>
              <div className="aircraft__right">
                <div className="aircraft__alt">{fmt(d.agl, 0)} m AGL</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 10 }}>
                  {fmt(battery, 0)}%
                </div>
                <div className="bat">
                  <div
                    className={`bat__fill ${batClass}`}
                    style={{ width: `${Math.max(battery, 0)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Causal diagnostics
// ---------------------------------------------------------------------------

const COEFFICIENTS = [
  { key: 'β_T', symbol: 'T', label: 'Terrain', color: '#a45a06' },
  { key: 'β_D', symbol: 'D', label: 'Distance', color: '#1549c9' },
  { key: 'β_J', symbol: 'J', label: 'Interference', color: '#c1201b' },
  { key: 'β_W', symbol: 'W', label: 'Weather', color: '#0e7490' },
  { key: 'β_θ', symbol: 'θ', label: 'Antenna', color: '#6d28d9' },
];

export function CausalPanel({ telemetry }) {
  const causal = telemetry?.causal;
  const scm = causal?.scm;
  const interventions = causal?.interventions;

  if (!scm?.dag) {
    return (
      <div className="panel">
        <div className="panel__head">
          <span className="panel__title">Causal Diagnostics</span>
        </div>
        <div className="panel__body">
          <div className="empty">Collecting link observations…</div>
        </div>
      </div>
    );
  }

  const coefficients = scm.dag.coefficients || {};
  const maxAbs = Math.max(
    ...COEFFICIENTS.map((c) => Math.abs(coefficients[c.key] ?? 0)), 1,
  );

  const latest = interventions?.latest;
  let verdictClass = 'unknown';
  let verdictHead = 'No completed test yet';
  let verdictBody = 'The engine runs a controlled altitude change on a degraded '
    + 'link and measures the result, rather than inferring cause from correlation.';

  if (latest && latest.phase === 'complete') {
    if (latest.confounded) {
      verdictClass = 'unknown';
      verdictHead = 'Inconclusive — not identified';
      verdictBody = `Test ${latest.id} on ${latest.link_id} measured `
        + `${fmt(latest.causal_effect * 100, 1)} points of change, but the `
        + 'no-confounding assumption failed, so this is descriptive only.';
    } else if (latest.attribution === 'terrain_occlusion') {
      verdictClass = 'terrain';
      verdictHead = 'Cause: terrain occlusion';
      verdictBody = `${latest.id}: climbing ${fmt(latest.achieved_dz, 0)} m reduced `
        + `packet loss by ${fmt(latest.causal_effect * 100, 1)} points `
        + `(confidence ${fmt(latest.confidence * 100, 0)}%). Altitude retained.`;
    } else if (latest.attribution === 'not_terrain') {
      verdictClass = 'jam';
      verdictHead = 'Cause: NOT terrain';
      verdictBody = `${latest.id}: altitude produced no improvement, so terrain is `
        + 'excluded. Consistent with interference or range. Rerouting.';
    } else {
      verdictClass = 'unknown';
      verdictHead = 'Cause: partially terrain';
      verdictBody = `${latest.id}: altitude helped by `
        + `${fmt(latest.causal_effect * 100, 1)} points — contributing but not dominant.`;
    }
  }

  const identified = interventions?.identified_count ?? 0;
  const confounded = interventions?.confounded_count ?? 0;
  const total = interventions?.completed_count ?? 0;

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Causal Diagnostics (SCM)</span>
        <span className={`panel__badge ${interventions?.active_count ? 'warn' : ''}`}>
          {interventions?.active_count ? 'TEST RUNNING' : `${total} TESTS`}
        </span>
      </div>
      <div className="panel__body">
        <div className="scm-eq">L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_W·W + β_θ·θ)</div>

        {COEFFICIENTS.map((c) => {
          const value = coefficients[c.key] ?? 0;
          return (
            <div className="coef" key={c.key}>
              <span className="coef__name">
                <span
                  className="coef__sym"
                  style={{ background: `${c.color}1a`, color: c.color }}
                >
                  {c.symbol}
                </span>
                {c.label}
              </span>
              <span className="coef__bar">
                <span
                  className="coef__fill"
                  style={{
                    width: `${(Math.abs(value) / maxAbs) * 100}%`,
                    background: c.color,
                  }}
                />
              </span>
              <span className="coef__val">{fmt(value, 2)}</span>
            </div>
          );
        })}

        <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8 }}>
          Coefficients updated online by recursive least squares from{' '}
          {scm.total_observations ?? 0} link observations.
        </div>

        <div className={`verdict ${verdictClass}`}>
          <div className="verdict__head">{verdictHead}</div>
          <div>{verdictBody}</div>
          {latest?.confounded && latest?.confound_reason && (
            <div className="confound">
              <b>Why it does not identify:</b> {latest.confound_reason}.
            </div>
          )}
        </div>

        <div style={{ marginTop: 9 }}>
          <div className="kv">
            <span className="kv__k">Tests with a clean identification</span>
            <span className="kv__v">{identified}</span>
          </div>
          <div className="kv">
            <span className="kv__k">Tests rejected as confounded</span>
            <span className="kv__v">{confounded}</span>
          </div>
          <div className="kv">
            <span className="kv__k">Intervention magnitude</span>
            <span className="kv__v">do(Δz = +{fmt(interventions?.delta_z, 0)} m)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Relay topology (GNN)
// ---------------------------------------------------------------------------

export function TopologyPanel({ telemetry }) {
  const gnn = telemetry?.gnn;
  if (!gnn) return null;

  const before = gnn.connectivity_before ?? 0;
  const after = gnn.connectivity_after ?? 0;
  const gnnOnly = gnn.connectivity_gnn_only ?? 0;
  const gain = after - before;

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Relay Topology — E(3) GNN</span>
        <span className={`panel__badge ${gnn.model_trained ? 'ok' : 'bad'}`}>
          {gnn.model_trained ? 'TRAINED' : 'UNTRAINED'}
        </span>
      </div>
      <div className="panel__body">
        <div className="kv">
          <span className="kv__k">Backhaul connectivity, before</span>
          <span className="kv__v">{fmt(before * 100, 1)}%</span>
        </div>
        <div className="kv">
          <span className="kv__k">After GNN proposal</span>
          <span className="kv__v">{fmt(gnnOnly * 100, 1)}%</span>
        </div>
        <div className="kv">
          <span className="kv__k">After gradient refinement</span>
          <span className="kv__v" style={{ color: gain > 0.001 ? 'var(--nominal)' : 'inherit' }}>
            {fmt(after * 100, 1)}%
          </span>
        </div>
        <div className="kv">
          <span className="kv__k">Solve time (propose + refine)</span>
          <span className="kv__v">
            {fmt(gnn.propose_ms, 1)} + {fmt(gnn.refine_ms, 1)} ms
          </span>
        </div>
        <div className="kv">
          <span className="kv__k">Optimisations run</span>
          <span className="kv__v">{gnn.optimization_count ?? 0}</span>
        </div>

        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 9, lineHeight: 1.5 }}>
          The network proposes relay positions in one equivariant forward pass;
          a short gradient refinement then polishes them against the terrain
          actually under the swarm. Both figures are shown so the contribution
          of each is visible.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flight control comparison
// ---------------------------------------------------------------------------

export function ControlPanel({ telemetry }) {
  const metrics = telemetry?.metrics || {};
  const demo = telemetry?.demo || {};
  const series = telemetry?.charts?.control || [];

  const flying = demo.controller || '—';
  const shadow = demo.shadow || (/LTC/i.test(flying) ? 'PID' : 'LTC');

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Flight Control</span>
        <span className="panel__badge ok">{flying}</span>
      </div>
      <div className="panel__body">
        <Sparkline
          series={series}
          keys={[
            { key: 'active', color: '#1549c9' },
            { key: 'shadow', color: '#a45a06' },
          ]}
        />
        <div className="chart-legend">
          <span><i style={{ background: '#1549c9' }} />{flying} tracking error (m)</span>
          <span><i style={{ background: '#a45a06' }} />{shadow} divergence (m/s²)</span>
        </div>

        <div style={{ marginTop: 9 }}>
          <div className="kv">
            <span className="kv__k">Tracking error (live)</span>
            <span className="kv__v">{fmt(metrics.tracking_error_m, 2)} m</span>
          </div>
          <div className="kv">
            <span className="kv__k">{shadow} shadow divergence</span>
            <span className="kv__v">{fmt(metrics.shadow_divergence_ms2, 2)} m/s²</span>
          </div>
        </div>

        <div style={{
          marginTop: 10, padding: 9, borderRadius: 6,
          background: 'var(--caution-bg)', border: '1px solid #f4dcbb',
          fontSize: 10.5, color: '#7d4405', lineHeight: 1.5,
        }}>
          <b style={{ display: 'block', marginBottom: 3 }}>
            Benchmark result: PID selected over LTC
          </b>
          The Liquid Time-Constant controller is implemented and trained
          (12.8k params), but on paired gust trials the cascaded PID held track
          closer — 0.18 m vs 0.62 m cross-track RMS in distribution, and
          1.55 m vs 1.99 m on gusts beyond the LTC&apos;s training envelope —
          at under half the control effort. The system therefore flies PID by
          default. Run <code>--controller ltc</code> to fly the LTC instead;
          whichever is not flying runs in shadow on the identical gust.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------

export function Sparkline({ series, keys, height = 76, yMax = null }) {
  if (!series || series.length < 2) {
    return <div className="empty" style={{ height }}>Collecting data…</div>;
  }

  const width = 360;
  const pad = 4;

  const allValues = series.flatMap((p) => keys.map((k) => p[k.key] ?? 0));
  const max = yMax ?? Math.max(...allValues, 0.001) * 1.15;

  const toPath = (key) => series.map((point, i) => {
    const x = pad + (i / (series.length - 1)) * (width - pad * 2);
    const y = height - pad - ((point[key] ?? 0) / max) * (height - pad * 2);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={pad} x2={width - pad}
          y1={height * f} y2={height * f}
          stroke="var(--border)" strokeWidth="1"
        />
      ))}
      {keys.map((k) => (
        <path
          key={k.key}
          d={toPath(k.key)}
          fill="none"
          stroke={k.color}
          strokeWidth="1.8"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function LinkHealthPanel({ telemetry }) {
  const charts = telemetry?.charts || {};
  const metrics = telemetry?.metrics || {};
  const backhaul = (metrics.backhaul_pdr ?? 0) * 100;

  const series = (charts.backhaul || []).map((p, i) => ({
    backhaul: p.value,
    swarm: charts.pdr?.[i]?.value ?? 0,
  }));

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Link Health</span>
        <span className={`panel__badge ${backhaul > 92 ? 'ok' : backhaul > 70 ? 'warn' : 'bad'}`}>
          {fmt(backhaul, 1)}% BACKHAUL
        </span>
      </div>
      <div className="panel__body">
        <Sparkline
          series={series}
          keys={[
            { key: 'backhaul', color: '#0b7a52' },
            { key: 'swarm', color: '#7b8aa1' },
          ]}
          yMax={1.05}
        />
        <div className="chart-legend">
          <span><i style={{ background: '#0b7a52' }} />Scout → ground station</span>
          <span><i style={{ background: '#7b8aa1' }} />Mean of all links</span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          Backhaul is the operational number: whether each scout's data can
          actually reach the ground station over the best multi-hop path. A
          healthy all-links average can still hide one cut-off scout.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cluster
// ---------------------------------------------------------------------------

export function ClusterPanel({ telemetry }) {
  const cluster = telemetry?.cluster;
  if (!cluster?.self) return null;

  const nodes = [cluster.self, ...(cluster.peers || [])];
  const hereId = telemetry?.served_by?.node_id ?? cluster.self.node_id;
  const ownership = cluster.ownership || {};

  const SUBSYSTEM_LABEL = {
    gnn_topology: 'Relay optimisation',
    scm_causal: 'Causal diagnostics',
    rag_sitrep: 'SITREP synthesis',
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Cluster</span>
        <span className="panel__badge">{nodes.length} NODE{nodes.length === 1 ? '' : 'S'}</span>
      </div>
      <div className="panel__body tight">
        {nodes.map((node) => (
          <div
            key={node.node_id}
            className={`node ${node.node_id === hereId ? 'self' : ''} ${node.online ? '' : 'offline'}`}
          >
            <span className="node__dot" />
            <div>
              <div className="node__call">
                {node.callsign}
                {node.node_id === hereId && (
                  <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}> · this screen</span>
                )}
              </div>
              <div className="node__desc">
                {node.description || node.role}
              </div>
            </div>
            <div className="node__addr">{node.address}</div>
          </div>
        ))}

        <div style={{ marginTop: 9 }}>
          {Object.entries(ownership).map(([subsystem, info]) => (
            <div className="kv" key={subsystem}>
              <span className="kv__k">{SUBSYSTEM_LABEL[subsystem] || subsystem}</span>
              <span className="kv__v">{info.callsign}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          Open any node's address on this network to see the same mission.
          If an edge node drops, its work returns to the simulation host
          automatically.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events + SITREP
// ---------------------------------------------------------------------------

const EVENT_TONE = (type = '') => {
  if (/KILL|JAM|FAULT|DEGRADE|ALERT|OUTAGE|PACKET_LOSS|LINK_FAILURE|NEW_TASK|DATA_LOST/i.test(type)) return 'alert';
  if (/COMPLETE|RESTORE|ELECTION|SURVEY|LANDED|DELIVERED|READY|HANDOVER/i.test(type)) return 'ok';
  if (/INTERVENTION|RTH|REASSIGN|PREEMPT|REALLOCATION|INTERFERENCE/i.test(type)) return 'warn';
  return 'info';
};

export function EventLog({ telemetry }) {
  const events = [...(telemetry?.events || [])].reverse();

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Mission Log</span>
        <span className="panel__badge">{events.length}</span>
      </div>
      <div className="panel__body tight">
        <div className="log">
          {events.length === 0 && <div className="empty">No events yet.</div>}
          {events.map((event, i) => (
            <div className="log__row" key={`${event.time}-${i}`}>
              <span className="log__time">T+{fmt(event.time, 0)}</span>
              <span className="log__msg">
                <span className={`log__type ${EVENT_TONE(event.type)}`}>
                  {(event.type || 'info').replace(/_/g, ' ')}
                </span>
                {event.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Save a SITREP as a text file, with its evidence citations appended. */
function downloadSitrep(sitrep) {
  const citations = (sitrep.citations || []).map((c) =>
    `  [${c.index}] ${String(c.class).toUpperCase()} — ${(c.confidence * 100).toFixed(0)}% `
    + `confidence, ${c.drone_id}, T+${Number(c.timestamp).toFixed(1)}s`).join('\n');
  const body = `${sitrep.text}\n\nEVIDENCE LOG\n${citations || '  (none)'}\n`;
  const blob = new Blob([body], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sitrep.sitrep_id || 'SITREP'}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SitrepPanel({ telemetry }) {
  const sitrep = telemetry?.sitrep;
  const latest = sitrep?.latest;

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Situation Report</span>
        <span className="panel__badge">
          {latest ? `${fmt(latest.generation_time_ms, 0)} ms` : 'PENDING'}
        </span>
      </div>
      <div className="panel__body">
        {latest ? (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 7, fontSize: 11,
            }}>
              <b style={{ fontFamily: 'var(--mono)' }}>{latest.sitrep_id}</b>
              <button className="btn" style={{ padding: '4px 10px', fontSize: 10.5 }}
                onClick={() => downloadSitrep(latest)}>
                Download
              </button>
            </div>
            <div className="sitrep">{latest.text}</div>
          </>
        ) : (
          <div className="empty">
            No report yet. Press <b>Generate SITREP</b> (Operator Control →
            Weather &amp; mission) to synthesise one from on-board detections.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

export function ControlsPanel({ run, onReset }) {
  const inject = (kind, params = {}) => run('inject', { kind, ...params });
  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Disturbances</span>
      </div>
      <div className="panel__body">
        <div className="controls">
          <button className="btn danger" onClick={() => inject('uav_failure', { target: 'relay' })}>
            Fail a relay
          </button>
          <button className="btn danger" onClick={() => inject('comm_outage', { target: 'scout', duration: 40 })}>
            Scout radio out
          </button>
          <button className="btn danger" onClick={() => inject('comm_outage', { gcs: true, duration: 20 })}>
            GCS outage 20 s
          </button>
          <button className="btn danger" onClick={() => inject('packet_loss', { rate: 0.3, duration: 45 })}>
            Packet loss 30%
          </button>
          <button className="btn danger" onClick={() => inject('comm_outage', { scope: 'global', noise_db: 14, duration: 30 })}>
            Degrade RF (area)
          </button>
          <button className="btn danger" onClick={() => inject('battery_fault', { target: 'relay' })}>
            Relay battery fault
          </button>
          <button className="btn" onClick={() => run('gust', { magnitude: 14 })}>
            Wind gust
          </button>
          <button className="btn" onClick={() => run('inject', { kind: 'restore' })}>
            Restore RF
          </button>
          <button className="btn primary wide" onClick={onReset}>
            Reset mission to planning
          </button>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          These are the Stage 2 disturbance types. For placed ones use Operator Control on the
          3D view: <b>+ Emergency</b> reports a new priority task, <b>+ Interference</b> opens a
          communication-outage zone, and any aircraft can be failed from its card.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Communication and roles
// ---------------------------------------------------------------------------

export function CommsPanel({ telemetry }) {
  const comms = telemetry?.comms || {};
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const roles = mission.roles || {};
  const drones = Object.values(telemetry?.drones || {});
  const relays = drones.filter((d) => d.role === 'RELAY' && d.status === 'ACTIVE').length;
  const pct = (v) => (v == null ? '—' : `${fmt(v * 100, 1)}%`);
  const recent = [...(roles.recent || [])].reverse().slice(0, 4);

  const rows = [
    ['Relays flying / needed', `${relays} / ${roles.relays_needed ?? '—'}`, 'terrain-aware chain from the GCS'],
    ['Packet delivery', pct(comms.pdr), `telemetry ${pct(comms.pdr_telemetry)} · survey ${pct(comms.pdr_survey)}`],
    ['Latency', `${fmt(comms.latency_ms_mean, 1)} ms`, `p95 ${fmt(comms.latency_ms_p95, 1)} ms, end to end`],
    ['Connectivity', pct(comms.connectivity_availability), 'airborne time with a path to the GCS'],
    ['Downtime', `${fmt(comms.downtime_s_total, 1)} s`, `${comms.outage_count ?? 0} outages · longest ${fmt(comms.downtime_s_longest, 1)} s`],
    ['Relay reallocations', String(comms.relay_reallocations ?? 0), `${roles.flaps ?? 0} undone within 30 s`],
    ['Recovery time', comms.recovery_time_s_mean == null ? '—' : `${fmt(comms.recovery_time_s_mean, 1)} s`,
      `mean over ${comms.disruptions ?? 0} disruptions`],
    ['Data waiting in the air', String(comms.backlog_chunks ?? 0), 'survey chunks in store-and-forward'],
  ];

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Communication &amp; Roles</span>
        <span className={`panel__badge ${(comms.connectivity_availability ?? 1) > 0.95 ? 'ok' : 'bad'}`}>
          {pct(comms.connectivity_availability)} LINKED
        </span>
      </div>
      <div className="panel__body">
        {rows.map(([label, value, note]) => (
          <div className="kv" key={label}>
            <span className="kv__k">
              {label}
              <span style={{ display: 'block', fontSize: 9.5, color: 'var(--ink-3)', opacity: 0.8 }}>{note}</span>
            </span>
            <span className="kv__v" style={{ alignSelf: 'center' }}>{value}</span>
          </div>
        ))}
        {recent.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 10.5, lineHeight: 1.5 }}>
            <b>Recent role changes</b>
            {recent.map((r) => (
              <div key={`${r.time}-${r.uav}`} style={{ color: 'var(--ink-2)' }}>
                T+{fmt(r.time, 0)} {r.uav}: {r.from.toLowerCase()} → {r.to.toLowerCase()} — {r.reason}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metrics strip
// ---------------------------------------------------------------------------

export function MetricsStrip({ telemetry }) {
  const metrics = telemetry?.metrics || {};
  const comms = telemetry?.comms || {};
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const tasks = mission.tasks || {};

  const pct = (v) => (v == null ? '—' : fmt(v * 100, 1));
  const remaining = mission.remaining_s;
  const clock = remaining == null ? '—'
    : `${Math.max(0, Math.floor(remaining / 60))}:${String(Math.max(0, Math.floor(remaining % 60))).padStart(2, '0')}`;
  const separation = metrics.min_separation_ever_m ?? 999;
  const collisions = metrics.collisions ?? 0;
  const safetyIssues = collisions + (comms.geofence_violations ?? 0) + (comms.battery_depleted ?? 0);

  const items = [
    {
      label: 'Mission clock',
      value: clock, unit: '',
      tone: mission.phase !== 'LIVE' ? 'neutral' : remaining > 120 ? 'ok' : 'warn',
      sub: mission.phase === 'LIVE' ? 'remaining of allotted time' : (mission.phase || '').toLowerCase(),
    },
    {
      label: 'Tasks delivered',
      value: `${tasks.delivered ?? 0}/${tasks.released ?? 0}`, unit: '',
      tone: tasks.released && tasks.delivered === tasks.released ? 'ok' : 'info',
      sub: `priority-weighted ${pct(mission.priority_score)}%`,
    },
    {
      label: 'Packet delivery',
      value: pct(comms.pdr), unit: '%',
      tone: comms.pdr == null ? 'neutral' : comms.pdr > 0.95 ? 'ok' : comms.pdr > 0.85 ? 'warn' : 'bad',
      sub: `latency ${fmt(comms.latency_ms_mean, 1)} ms`,
    },
    {
      label: 'Connectivity',
      value: pct(comms.connectivity_availability), unit: '%',
      tone: comms.connectivity_availability == null ? 'neutral'
        : comms.connectivity_availability > 0.95 ? 'ok' : comms.connectivity_availability > 0.85 ? 'warn' : 'bad',
      sub: `downtime ${fmt(comms.downtime_s_total, 0)} s`,
    },
    {
      label: 'Recovery',
      value: comms.recovery_time_s_mean == null ? '—' : fmt(comms.recovery_time_s_mean, 1), unit: 's',
      tone: comms.recovery_time_s_mean == null ? 'neutral' : comms.recovery_time_s_mean < 10 ? 'ok' : 'warn',
      sub: `${comms.relay_reallocations ?? 0} relay reallocations`,
    },
    {
      label: 'Closest approach',
      value: separation > 900 ? '—' : fmt(separation, 0), unit: 'm',
      tone: separation > 15 ? 'ok' : separation > 5 ? 'warn' : 'bad',
      sub: `${collisions} collisions`,
    },
    {
      label: 'Safety',
      value: safetyIssues === 0 ? 'OK' : String(safetyIssues), unit: '',
      tone: safetyIssues === 0 ? 'ok' : 'bad',
      sub: `geofence ${comms.geofence_violations ?? 0} · flat battery ${comms.battery_depleted ?? 0}`,
    },
  ];

  return (
    <div className="metrics">
      {items.map((item) => (
        <div className="metric" key={item.label}>
          <span className="metric__label">{item.label}</span>
          <span className={`metric__value ${item.tone}`}>
            {item.value}
            {item.unit && <span className="metric__unit">{item.unit}</span>}
          </span>
          <span className="metric__sub">{item.sub}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Logged evidence (offline benchmarks)
// ---------------------------------------------------------------------------

/**
 * Headline results from `bench/run_benchmarks.py`, fetched once.
 *
 * These are the numbers a jury should be quoted, each a mean over repeated
 * randomised runs with its spread — shown next to the live figures so the
 * two can be compared, and including the results that went against us.
 */
export function EvidencePanel() {
  const [data, setData] = useState(null);

  const [suite, setSuite] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/benchmarks')
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setData(json); })
      .catch(() => { if (!cancelled) setData({ available: false }); });
    fetch('/api/uavx_benchmarks')
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setSuite(json); })
      .catch(() => { if (!cancelled) setSuite({ available: false }); });
    return () => { cancelled = true; };
  }, []);

  const pm = (s, scale = 1, digits = 1, unit = '') => (s && s.n
    ? `${fmt(s.mean * scale, digits)} ± ${fmt(s.std * scale, digits)}${unit}`
    : '—');

  if (!data) return null;

  if (!data.available) {
    return (
      <div className="panel">
        <div className="panel__head"><span className="panel__title">Logged Evidence</span></div>
        <div className="panel__body">
          <div className="empty">
            No benchmark results yet.<br />Run <code>python -m bench.run_benchmarks</code>.
          </div>
        </div>
      </div>
    );
  }

  const m = data.missions || {};
  const t = data.topology || {};
  const c = data.causal || {};
  const ctrl = data.control || {};
  const heal = m.self_heal_latency_ms || m.election_time_ms;

  const agg = suite?.available ? (suite.aggregate || {}) : null;
  const pmS = (key, scale = 100, digits = 1, unit = '%') => {
    const s0 = agg?.[key];
    return s0 && s0.n ? `${fmt(s0.mean * scale, digits)} ± ${fmt(s0.std * scale, digits)}${unit}` : '—';
  };
  const rows = [
    ...(agg ? [
      ['Mission completion', pmS('completion_rate'), `${suite.runs ?? 0} scenario runs`],
      ['Priority-weighted score', pmS('priority_weighted_score'), 'P1 = 3, P2 = 2, P3 = 1'],
      ['Packet delivery ratio', pmS('packet_delivery_ratio'), 'all traffic, end to end'],
      ['Connectivity availability', pmS('connectivity_availability'), 'airborne time linked to GCS'],
      ['Recovery time', pmS('recovery_time_s_mean', 1, 1, ' s'), 'per disruption'],
      ['Collisions', pmS('collisions', 1, 1, ''), 'per mission'],
    ] : []),
    ['Self-heal, end-to-end', pm(heal, 1, 0, ' ms'), 'relay failover · target < 300 ms'],
    ['Relay gain over naive', pm(t.improvement_over_naive, 100, 1, ' pts'),
      'GNN placement, held-out terrain'],
    ['Causal: interference ruled out', c.jamming_recall != null ? `${fmt(c.jamming_recall * 100, 0)}%` : '—',
      'no false "terrain"'],
    ['Causal: terrain confirmed', c.terrain_recall != null ? `${fmt(c.terrain_recall * 100, 0)}%` : '—',
      'single-node probe'],
  ];

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="panel__title">Logged Evidence</span>
        <span className="panel__badge">{data.quick_mode ? 'QUICK RUN' : 'FULL RUN'}</span>
      </div>
      <div className="panel__body">
        {rows.map(([label, value, note]) => (
          <div className="kv" key={label}>
            <span className="kv__k">
              {label}
              <span style={{ display: 'block', fontSize: 9.5, color: 'var(--ink-3)', opacity: 0.8 }}>
                {note}
              </span>
            </span>
            <span className="kv__v" style={{ alignSelf: 'center' }}>{value}</span>
          </div>
        ))}

        {ctrl.LTC && (
          <div className="kv">
            <span className="kv__k">
              Cross-track RMS, LTC vs PID
              <span style={{ display: 'block', fontSize: 9.5, color: 'var(--ink-3)' }}>
                paired gusts · LTC better in {ctrl.paired_improvement?.rms_ltc_better_in}/{ctrl.trials}
              </span>
            </span>
            <span className="kv__v" style={{ alignSelf: 'center' }}>
              {fmt(ctrl.LTC.cross_track_rms_m_mean, 2)} / {fmt(ctrl.PID.cross_track_rms_m_mean, 2)} m
            </span>
          </div>
        )}

        <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>
          Mean ± standard deviation over repeated randomised runs. Mission figures:{' '}
          <code>python -m bench.uavx_suite</code> ({suite?.generated_at || 'not run'}); component
          figures: <code>models/benchmarks.json</code>.
        </div>
      </div>
    </div>
  );
}
