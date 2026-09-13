/**
 * Ground base console — the mission-control screen.
 *
 * This is what the base laptop shows: no 3D view of the operation (that is the
 * forward node's job), but everything the base is actually responsible for —
 * rehearsing the swarm, committing it to the mission, reading the reports that
 * come back from the field, and authorising anything the field cannot release
 * on its own.
 */

import {
  CausalPanel, ClusterPanel, ControlPanel, EventLog, LinkHealthPanel,
  MetricsStrip, SitrepPanel, SwarmPanel, TopologyPanel,
} from './Panels';

const fmt = (v, d = 0) => (v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toFixed(d));

const clock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

function MissionControl({ telemetry, run }) {
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const metrics = telemetry?.metrics || {};
  const live = mission.phase === 'LIVE';
  const done = mission.phase === 'COMPLETE' || mission.phase === 'ABORTED';
  const rehearsal = mission.rehearsal || {};
  const theatre = telemetry?.demo?.theatre;

  return (
    <section className={`base-card base-mission ${live ? 'live' : ''}`}>
      <div className="base-card__head">
        <div>
          <div className="base-card__kicker">Mission control</div>
          <div className="base-card__title">
            {live ? `LIVE · ${mission.mission_id || ''}`
              : done ? `${mission.phase} · ${mission.mission_id || ''}`
                : 'Pre-mission rehearsal'}
          </div>
        </div>
        <span className={`base-pill ${live ? 'bad' : done ? '' : 'ok'}`}>
          {live ? `T+${clock(mission.elapsed)}` : done ? 'STOOD DOWN' : 'TRAINING'}
        </span>
      </div>

      <div className="base-card__body">
        {!live && !done && (
          <>
            <p>
              The swarm is rehearsing over <b>{theatre?.name || '—'}</b>: real terrain,
              valley wind and contested radio. Everything it learns here — relay
              placement, self-healing, causal diagnosis — is what it carries into the
              operation. Commit it when the numbers below look right.
            </p>
            <div className="base-grid">
              <div><span>Backhaul</span><b>{fmt((metrics.backhaul_pdr ?? 0) * 100)}%</b></div>
              <div><span>Targets</span><b>{metrics.pois_surveyed ?? 0}/{metrics.total_pois ?? 0}</b></div>
              <div><span>Self-heal</span><b>{fmt(metrics.election_time_ms)} ms</b></div>
              <div><span>Battery</span><b>{fmt(metrics.avg_battery)}%</b></div>
            </div>
            <button className="base-launch" onClick={() => run('launch_mission')}>
              Launch mission ▸
            </button>
            <div className="base-note">
              The forward node flies the operation. This screen keeps command of it.
            </div>
          </>
        )}

        {live && (
          <>
            <p>
              The swarm is committed and flying the rehearsed plan at the forward node.
              Reports stream back here in real time.
            </p>
            <div className="base-card__kicker">Carried in from rehearsal</div>
            <div className="base-grid">
              <div><span>Rehearsed PDR</span><b>{fmt((rehearsal.backhaul_pdr ?? 0) * 100)}%</b></div>
              <div><span>Relay solves</span><b>{rehearsal.relay_solves ?? 0}</b></div>
              <div><span>Self-heal</span><b>{fmt(rehearsal.self_heal_ms)} ms</b></div>
              <div><span>Trained for</span><b>{clock(rehearsal.flight_time_s)}</b></div>
            </div>
            <div className="base-card__kicker">Live now</div>
            <div className="base-grid">
              <div><span>Backhaul</span><b>{fmt((metrics.backhaul_pdr ?? 0) * 100)}%</b></div>
              <div><span>Airborne</span><b>{metrics.active_nodes ?? 0}</b></div>
              <div><span>Targets</span><b>{metrics.pois_surveyed ?? 0}/{metrics.total_pois ?? 0}</b></div>
              <div><span>Battery</span><b>{fmt(metrics.avg_battery)}%</b></div>
            </div>
            <button className="base-launch base-launch--end" onClick={() => run('end_mission')}>
              End mission
            </button>
          </>
        )}

        {done && (
          <button className="base-launch" onClick={() => run('reset_mission')}>
            Reset for another run
          </button>
        )}
      </div>
    </section>
  );
}

function Conditions({ telemetry }) {
  const injects = telemetry?.injects || {};
  const ew = telemetry?.rf?.ew || {};
  const enemies = injects.enemies || [];
  const cells = injects.cells || [];
  const denial = injects.gps_denial || [];
  const faults = Object.keys(injects.faults || {});
  const nothing = !injects.rain_mm_h && !enemies.length && !cells.length
    && !denial.length && !faults.length && !ew.active;

  return (
    <section className="base-card">
      <div className="base-card__head">
        <div className="base-card__title">Field conditions</div>
        <span className={`base-pill ${nothing ? 'ok' : 'bad'}`}>
          {nothing ? 'NOMINAL' : 'CONTESTED'}
        </span>
      </div>
      <div className="base-card__body">
        {nothing && <p>No weather, jamming or hostile activity reported by the field.</p>}
        <ul className="base-list">
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
            <li key={z.id}><b>{z.id}</b> — GNSS denial, {fmt(z.radius_m)} m radius
              {injects.nav_fallback ? ' · swarm on terrain-relative navigation' : ' · solution drifting'}</li>
          ))}
          {faults.map((id) => <li key={id}><b>{id}</b> — equipment fault, degraded thrust</li>)}
          {enemies.map((e) => (
            <li key={e.id} className="bad-text"><b>{e.id}</b> — hostile UAV
              {e.detected ? ` tracked, closing on ${e.target || '—'}` : ' inbound, not yet detected'}</li>
          ))}
          {(ew.estimates || []).map((e) => (
            <li key={e.id}><b>{e.id}</b> — hostile emitter cross-fixed at
              {' '}({fmt(e.x)}, {fmt(e.y)}) ± {fmt(e.radius_m)} m, ≈{fmt(e.power_dbm)} dBm</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Requests({ telemetry, run }) {
  const mission = telemetry?.mission || telemetry?.demo?.mission || {};
  const requests = mission.requests || [];
  const pending = requests.filter((r) => r.status === 'PENDING');
  const handled = requests.filter((r) => r.status !== 'PENDING').slice(-4).reverse();

  return (
    <section className={`base-card ${pending.length ? 'base-card--alert' : ''}`}>
      <div className="base-card__head">
        <div className="base-card__title">Support requests</div>
        <span className={`base-pill ${pending.length ? 'bad' : ''}`}>
          {pending.length ? `${pending.length} AWAITING AUTHORITY` : 'NONE PENDING'}
        </span>
      </div>
      <div className="base-card__body">
        {!requests.length && (
          <p>The field can ask for an interceptor release or a replacement aircraft.
            Neither happens without authorisation from this console.</p>
        )}
        {pending.map((r) => (
          <div key={r.id} className="base-request">
            <div>
              <div className="base-request__head">
                <b>{r.id} · {r.kind.replace(/_/g, ' ')}</b>
                <span className={`base-urgency ${r.urgency === 'IMMEDIATE' ? 'bad' : ''}`}>{r.urgency}</span>
              </div>
              <div className="base-request__why">{r.reason}</div>
            </div>
            <div className="base-request__actions">
              <button className="base-approve" onClick={() => run('approve_request', { request_id: r.id })}>
                Authorise
              </button>
              <button className="base-deny" onClick={() => run('deny_request', { request_id: r.id })}>
                Deny
              </button>
            </div>
          </div>
        ))}
        {handled.map((r) => (
          <div key={r.id} className="base-request base-request--done">
            <span><b>{r.id}</b> {r.kind.replace(/_/g, ' ')}</span>
            <span className={r.status === 'APPROVED' ? 'ok-text' : 'bad-text'}>{r.status}</span>
          </div>
        ))}
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
          <div className="base-bar__title">C-DAWN · GROUND BASE</div>
          <div className="base-bar__sub">Mission control · forward node reporting</div>
        </div>
        <div className="base-bar__status">
          <span className={`base-pill ${live ? 'bad' : 'ok'}`}>
            {live ? 'OPERATION IN PROGRESS' : 'REHEARSAL'}
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
          <Requests telemetry={telemetry} run={run} />
          <Conditions telemetry={telemetry} />
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
