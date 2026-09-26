/**
 * Ground base console — the GCS mission-control screen.
 *
 * What the ground control station outside the affected area shows: no 3D
 * view of the operation (that is the operations screen's job), but everything
 * the GCS is actually responsible for — launching the mission, watching the
 * challenge metrics, reading the situation reports that come back over the
 * mesh, and seeing what the field is up against.
 */

import {
  CausalPanel, ClusterPanel, CommsPanel, ControlPanel, EventLog, LinkHealthPanel,
  MetricsStrip, SitrepPanel, SwarmPanel, TopologyPanel,
} from './Panels';

const fmt = (v, d = 0) => (v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toFixed(d));
const pct = (v, d = 0) => (v === null || v === undefined ? '—' : `${fmt(v * 100, d)}%`);

const clock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function MissionControl({ telemetry, run }) {
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const comms = telemetry?.comms || {};
  const metrics = telemetry?.metrics || {};
  const live = mission.phase === 'LIVE';
  const planning = mission.phase === 'PLANNING';
  const done = mission.phase === 'COMPLETE' || mission.phase === 'ABORTED';
  const theatre = telemetry?.demo?.theatre;
  const tasks = mission.tasks || {};
  const summary = mission.summary;

  return (
    <section className={`base-card base-mission ${live ? 'live' : ''}`}>
      <div className="base-card__head">
        <div>
          <div className="base-card__kicker">Mission control</div>
          <div className="base-card__title">
            {live ? `LIVE · ${mission.mission_id || ''}`
              : done ? `${mission.phase} · ${mission.mission_id || ''}`
                : 'Mission planning'}
          </div>
        </div>
        <span className={`base-pill ${live ? 'bad' : done ? '' : 'ok'}`}>
          {live ? `${clock(mission.remaining_s)} LEFT` : done ? 'RECOVERED' : 'ON PADS'}
        </span>
      </div>

      <div className="base-card__body">
        {mission.scenario?.name && <p><b>{mission.scenario.name}</b></p>}
        {planning && (
          <>
            <p>
              The fleet is on its pads at the GCS outside the affected area over{' '}
              <b>{theatre?.name || '—'}</b>. {tasks.released ?? 0} survey task(s) are known;
              the relay chain needs <b>{mission.roles?.relays_needed ?? '—'}</b> relay(s) to
              reach them. Aircraft launch in sequence once the mission starts.
            </p>
            <button className="base-launch" onClick={() => run('launch_mission')}>
              Launch mission ▸
            </button>
          </>
        )}

        {(live || done) && (
          <>
            <div className="base-card__kicker">Mission</div>
            <div className="base-grid">
              <div><span>Delivered</span><b>{tasks.delivered ?? 0}/{tasks.released ?? 0}</b></div>
              <div><span>Priority score</span><b>{pct(mission.priority_score)}</b></div>
              <div><span>Airborne</span><b>{metrics.active_nodes ?? 0}</b></div>
              <div><span>On pads</span><b>{metrics.on_pad ?? 0}</b></div>
            </div>
            <div className="base-card__kicker">Communication</div>
            <div className="base-grid">
              <div><span>PDR</span><b>{pct(comms.pdr, 1)}</b></div>
              <div><span>Latency</span><b>{fmt(comms.latency_ms_mean, 1)} ms</b></div>
              <div><span>Linked</span><b>{pct(comms.connectivity_availability, 1)}</b></div>
              <div><span>Downtime</span><b>{fmt(comms.downtime_s_total, 0)} s</b></div>
            </div>
            <div className="base-card__kicker">Autonomy &amp; safety</div>
            <div className="base-grid">
              <div><span>Reallocations</span><b>{comms.relay_reallocations ?? 0}</b></div>
              <div><span>Recovery</span><b>{comms.recovery_time_s_mean == null ? '—' : `${fmt(comms.recovery_time_s_mean, 1)} s`}</b></div>
              <div><span>Collisions</span><b>{metrics.collisions ?? 0}</b></div>
              <div><span>Geofence</span><b>{comms.geofence_violations ?? 0}</b></div>
            </div>
            {live && (
              <button className="base-launch base-launch--end" onClick={() => run('end_mission')}>
                End mission and recall
              </button>
            )}
          </>
        )}

        {done && (
          <>
            {summary && (
              <p style={{ fontSize: 12 }}>
                Completion {pct(summary.mission?.completion_rate)} · completion time{' '}
                {summary.mission?.completion_time_s != null ? `${fmt(summary.mission.completion_time_s)} s` : '—'} ·
                min separation {fmt(summary.safety?.min_separation_m, 1)} m · min battery{' '}
                {fmt(summary.safety?.min_battery_pct, 0)}%.
              </p>
            )}
            <a className="base-launch" href="/api/summary" target="_blank" rel="noreferrer">
              Full mission metrics (JSON)
            </a>
            <button className="base-launch" onClick={() => run('reset_mission')}>
              Reset for another run
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Conditions({ telemetry }) {
  const injects = telemetry?.injects || {};
  const ew = telemetry?.rf?.ew || {};
  const active = telemetry?.mission?.disturbances?.active || [];
  const cells = injects.cells || [];
  const denial = injects.gps_denial || [];
  const faults = Object.keys(injects.faults || {});
  const nothing = !injects.rain_mm_h && !cells.length && !denial.length
    && !faults.length && !ew.active && !active.length;
  const label = { radio: 'radio failure', loss: 'packet loss', global: 'area-wide RF degradation', jammer: 'interference zone' };

  return (
    <section className="base-card">
      <div className="base-card__head">
        <div className="base-card__title">Field conditions</div>
        <span className={`base-pill ${nothing ? 'ok' : 'bad'}`}>
          {nothing ? 'NOMINAL' : 'DEGRADED'}
        </span>
      </div>
      <div className="base-card__body">
        {nothing && <p>No weather, interference or communication faults reported by the field.</p>}
        <ul className="base-list">
          {active.map((e) => (
            <li key={`${e.effect}-${e.on}`}><b>{label[e.effect] || e.effect}</b> — {e.on === '*' ? 'all links' : e.on}
              {' '}until T+{fmt(e.until)}</li>
          ))}
          {injects.rain_mm_h > 0 && (
            <li><b>Rainfall {fmt(injects.rain_mm_h)} mm/h</b> — cloud base
              {' '}{fmt(injects.cloud_base_agl)} m AGL, swarm flying under it · wet-antenna loss
              {' '}{fmt(injects.antenna_loss_db, 1)} dB/aircraft, power draw
              {' '}+{fmt((injects.power_factor - 1) * 100)}%</li>
          )}
          {cells.map((c) => (
            <li key={c.id}><b>{c.id}</b> — downdraught cell {fmt(c.downdraught_ms)} m/s,
              {' '}{fmt(c.radius_m)} m across</li>
          ))}
          {denial.map((z) => (
            <li key={z.id}><b>{z.id}</b> — GNSS degradation, {fmt(z.radius_m)} m radius
              {injects.nav_fallback ? ' · swarm on terrain-relative navigation' : ' · solution drifting'}</li>
          ))}
          {faults.map((id) => <li key={id}><b>{id}</b> — equipment fault, degraded thrust</li>)}
          {(ew.estimates || []).map((e) => (
            <li key={e.id}><b>{e.id}</b> — interference source localised at
              {' '}({fmt(e.x)}, {fmt(e.y)}) ± {fmt(e.radius_m)} m, ≈{fmt(e.power_dbm)} dBm</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function BaseConsole({ telemetry, run, onReset, onSwitch }) {
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const live = mission.phase === 'LIVE';

  return (
    <div className="base">
      <header className="base-bar">
        <div>
          <div className="base-bar__title">C-DAWN · GROUND CONTROL STATION</div>
          <div className="base-bar__sub">UAV-X disaster response · swarm reporting over the mesh</div>
        </div>
        <div className="base-bar__status">
          <span className={`base-pill ${live ? 'bad' : 'ok'}`}>
            {live ? 'MISSION IN PROGRESS' : (mission.phase || 'PLANNING')}
          </span>
          <span className="base-bar__theatre">
            {telemetry?.demo?.theatre?.name || '—'}
          </span>
          <button className="base-reset" onClick={onSwitch}
            title="Switch this screen to the operations view">Operations view ▸</button>
          <button className="base-reset" onClick={onReset}>Reset</button>
        </div>
      </header>

      <div className="base-body">
        <div className="base-col">
          <MissionControl telemetry={telemetry} run={run} />
          <Conditions telemetry={telemetry} />
          <CommsPanel telemetry={telemetry} />
          <SitrepPanel telemetry={telemetry} />
        </div>
        <div className="base-col">
          <div className="base-card base-card--flush">
            <EventLog telemetry={telemetry} />
          </div>
          <SwarmPanel telemetry={telemetry} run={run} onSelect={() => {}} selectedId={null} />
          <CausalPanel telemetry={telemetry} />
          <LinkHealthPanel telemetry={telemetry} />
          <TopologyPanel telemetry={telemetry} />
          <ControlPanel telemetry={telemetry} />
          <ClusterPanel telemetry={telemetry} />
        </div>
      </div>

      <MetricsStrip telemetry={telemetry} />
    </div>
  );
}
