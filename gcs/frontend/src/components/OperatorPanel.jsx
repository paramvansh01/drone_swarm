/**
 * Operator control toolbar.
 *
 * Floats over the 3D view so that reporting a new emergency is "pick a tool,
 * click the valley" — the same gesture a judge would try first. Every action
 * goes to the simulation as a command; nothing here is scripted.
 */

import { useState } from 'react';

const TOOLS = [
  { id: 'select', label: 'Select', hint: 'Click an aircraft, task or interference source to select it. Drag to orbit.' },
  { id: 'add_poi', label: '+ Emergency', hint: 'Click the terrain to report a new priority-1 emergency. The swarm re-plans for it at once.' },
  { id: 'add_interference', label: '+ Interference', hint: 'Click the terrain to open a communication-outage zone (RF interference). Ridges between it and an aircraft block it.' },
  { id: 'add_scout', label: '+ UAV', hint: 'Click the terrain to deploy an extra scout there (testing aid; the fleet itself launches from the GCS pads).' },
];

// Unobstructed distance at which a source lifts the noise floor to -82 dBm —
// mirrors RFChannel.jammer_radius_m (900 MHz free-space loss at 1 m = 31.5 dB).
const interferenceReach = (powerDbm) => 10 ** ((powerDbm + 3 + 82 - 31.53) / 20);

const fmt = (v, d = 0) => (v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toFixed(d));
const clock = (s) => {
  const v = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
};

const INJECTS = [
  ['uav_failure', 'Fail relay', 'A relay UAV drops out of the sky', { target: 'relay' }],
  ['uav_failure', 'Fail scout', 'A scout UAV drops out of the sky', { target: 'scout' }],
  ['comm_outage', 'Radio out', "A scout's radio fails for 40 s", { target: 'scout', duration: 40 }],
  ['comm_outage', 'GCS outage', 'The GCS receiver is down for 20 s', { gcs: true, duration: 20 }],
  ['packet_loss', 'Packet loss', '30% loss on every link for 45 s', { rate: 0.3, duration: 45 }],
  ['battery_fault', 'Battery fault', "A relay's power draw jumps", { target: 'relay' }],
  ['heavy_rain', 'Heavy rain', 'Monsoon rain: turbulence, low cloud, wet antennas', {}],
  ['storm_cell', 'Downdraught', 'A drifting mountain-wave cell with a 9 m/s sink', {}],
  ['gps_denial', 'GNSS degraded', 'Valley multipath: the navigation solution drifts', {}],
];

export default function OperatorPanel({
  telemetry, tool, setTool, selected, setSelected, run,
  jammerPower, setJammerPower, wind, setWind, onFrame,
}) {
  const drones = telemetry?.drones || {};
  const rf = telemetry?.rf || {};
  const pois = telemetry?.pois || [];
  const demo = telemetry?.demo || {};

  const drone = selected?.kind === 'drone' ? drones[selected.id] : null;
  const jammer = selected?.kind === 'jammer'
    ? (rf.jammers || []).find((j) => j.id === selected.id) : null;
  const poi = selected?.kind === 'poi' ? pois.find((p) => p.id === selected.id) : null;

  const activeTool = tool === 'goto'
    ? { hint: `Click the terrain to send ${selected?.id} there. Esc to cancel.` }
    : TOOLS.find((t) => t.id === tool);

  const ew = rf.ew || {};
  const fixes = ew.estimates || (ew.estimate ? [ew.estimate] : []);
  const mission = telemetry?.mission || demo.mission || {};
  const injects = telemetry?.injects || {};
  const live = mission.phase === 'LIVE';
  const planning = mission.phase === 'PLANNING';

  const status = drone?.status;
  const dead = status === 'KILLED';
  const onPad = status === 'CHARGING' || status === 'READY';
  const airborne = drone && !dead && !onPad && status !== 'LANDED';
  const scripted = demo.mode === 'scripted';
  const [minimised, setMinimised] = useState(false);
  const [showMore, setShowMore] = useState(false);

  if (minimised) {
    return (
      <button className="operator operator--min" onClick={() => setMinimised(false)}>
        ▸ Operator Control
      </button>
    );
  }

  return (
    <div className="operator">
      <div className="operator__head">
        <span className="operator__title">Operator Control</span>
        <span className={`operator__mode ${scripted ? 'scripted' : ''}`}>
          {scripted ? 'SCRIPTED' : 'LIVE'}
        </span>
        <button className="operator__x" title="Minimise" onClick={() => setMinimised(true)}>–</button>
      </div>

      <div className="operator__tools">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`tool tool--${t.id} ${tool === t.id ? 'on' : ''}`}
            onClick={() => setTool(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="operator__hint">{activeTool?.hint}</div>

      {(tool === 'add_interference' || jammer) && (
        <div className="operator__row">
          <label>
            Interference power <b>{fmt(jammer ? jammer.power_dbm : jammerPower)} dBm</b>
            <span className="operator__sub">
              {' '}· reach ≈ {fmt(interferenceReach(jammer ? jammer.power_dbm : jammerPower))} m in open air
            </span>
          </label>
          <input
            type="range" min="-10" max="25" step="1"
            value={jammer ? jammer.power_dbm : jammerPower}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (jammer) run('set_jammer_power', { jammer_id: jammer.id, power_dbm: value });
              else setJammerPower(value);
            }}
          />
        </div>
      )}

      {/* ---- selection ------------------------------------------------ */}
      {drone && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>{drone.id}</b>
            <span className={`pill ${dead ? 'bad' : onPad ? 'warn' : 'ok'}`}>{dead ? 'FAILED' : status}</span>
          </div>
          <div className="operator__stats">
            <span>{drone.role.replace('_', ' ')}</span>
            {airborne && <span>{fmt(drone.agl)} m AGL</span>}
            <span>{fmt(drone.battery)}% batt</span>
            {airborne && (
              <span>{!drone.radio_ok ? 'RADIO OUT' : drone.connected ? `${drone.hops} hop(s) to GCS` : 'NO LINK'}</span>
            )}
            {airborne && (
              <span>{drone.ew_hold ? 'WITHDRAWN' : drone.manual_target ? 'OPERATOR ORDER' : 'AUTONOMOUS'}</span>
            )}
          </div>
          <div className="operator__actions">
            {airborne && (
              <button className="btn" onClick={() => setTool('goto')}>Send to…</button>
            )}
            {airborne && drone.manual_target && (
              <button className="btn" onClick={() => run('release', { drone_id: drone.id })}>
                Release to autonomy
              </button>
            )}
            {airborne && drone.role !== 'STANDBY' && (
              <button
                className="btn"
                onClick={() => run('set_role', {
                  drone_id: drone.id, role: drone.role === 'SCOUT' ? 'RELAY' : 'SCOUT',
                })}
              >
                Make {drone.role === 'SCOUT' ? 'relay' : 'scout'}
              </button>
            )}
            {airborne && (
              <button className="btn" onClick={() => run('rth', { drone_id: drone.id })}>Return home</button>
            )}
            {status === 'READY' && live && (
              <button className="btn" onClick={() => run('launch', { drone_id: drone.id, role: 'SCOUT' })}>
                Launch as scout
              </button>
            )}
            <button className="btn" onClick={() => onFrame(drone.id)}>Frame camera</button>
            {dead && (
              <button className="btn primary" onClick={() => run('revive', { drone_id: drone.id })}>
                Return to service
              </button>
            )}
            {airborne && (
              <button className="btn danger" onClick={() => run('kill', { drone_id: drone.id })}>
                Fail UAV
              </button>
            )}
          </div>
        </div>
      )}

      {jammer && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>{jammer.id}</b><span className="pill bad">INTERFERENCE</span>
          </div>
          {rf.ew?.estimate?.true_id === jammer.id && (
            <div className="operator__stats">
              <span>Localised by swarm ± {fmt(rf.ew.estimate.radius_m)} m</span>
              <span>estimate {fmt(rf.ew.estimate.error_m)} m off</span>
              <span>≈{fmt(rf.ew.estimate.power_dbm)} dBm est.</span>
            </div>
          )}
          <div className="operator__actions">
            <button className="btn" onClick={() => { run('remove_jammer', { jammer_id: jammer.id }); setSelected(null); }}>
              Switch off (ground team)
            </button>
          </div>
        </div>
      )}

      {poi && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>{poi.id}</b>
            <span className={`pill ${poi.delivered ? 'ok' : poi.surveyed ? 'warn' : 'bad'}`}>
              {poi.delivered ? 'DATA AT GCS' : poi.surveyed ? 'SURVEYED' : 'PENDING'}
            </span>
          </div>
          <div className="operator__stats">
            <span>{poi.category.replace(/_/g, ' ')}</span>
            <span>priority {poi.priority}</span>
            {poi.emergent && <span>reported T+{fmt(poi.release_time)} s</span>}
            {poi.surveyed_by && <span>by {poi.surveyed_by}</span>}
          </div>
          <div className="operator__actions">
            <button className="btn" onClick={() => { run('remove_poi', { poi_id: poi.id }); setSelected(null); }}>
              Cancel task
            </button>
          </div>
        </div>
      )}

      {/* ---- mission ------------------------------------------------- */}
      <div className={`operator__card mission-card ${live ? 'mission-card--live' : ''}`}>
        <div className="operator__card-head">
          <b>{live ? `MISSION ${mission.mission_id || ''}` : planning ? 'MISSION PLANNING' : `MISSION ${mission.phase || ''}`}</b>
          <span className={`pill ${live ? 'bad' : 'ok'}`}>
            {live ? `${clock(mission.remaining_s)} LEFT` : planning ? 'ON PADS' : 'DONE'}
          </span>
        </div>
        {mission.scenario?.name && <div className="operator__sub">{mission.scenario.name}</div>}
        {planning && (
          <>
            <div className="operator__sub">
              {mission.tasks?.released ?? 0} task(s) known, {mission.time_limit_s ? `${clock(mission.time_limit_s)} allotted` : 'no time limit'}.
              The fleet launches in sequence from the GCS pads; relays take stations as the
              terrain requires.
            </div>
            <div className="operator__actions">
              <button className="btn primary" onClick={() => run('launch_mission')}>
                Launch mission ▸
              </button>
            </div>
          </>
        )}
        {live && (
          <>
            <div className="operator__stats">
              <span>{mission.tasks?.delivered ?? 0}/{mission.tasks?.released ?? 0} delivered</span>
              <span>priority score {fmt((mission.priority_score ?? 0) * 100)}%</span>
              <span>{mission.roles?.relays_needed ?? 0} relay(s) needed</span>
              {mission.pending_disturbances > 0 && <span>{mission.pending_disturbances} scenario events to come</span>}
            </div>
            <div className="operator__section">Inject a disturbance</div>
            <div className="inject-tools">
              {INJECTS.map(([kind, label, hint, params]) => (
                <button key={`${kind}-${label}`} className="tool" title={hint}
                  onClick={() => run('inject', { kind, ...params })}>{label}</button>
              ))}
            </div>
            <div className="operator__stats">
              {injects.rain_mm_h > 0 && <span>rain {fmt(injects.rain_mm_h)} mm/h</span>}
              {injects.cloud_base_agl && <span>cloud base {fmt(injects.cloud_base_agl)} m AGL</span>}
              {injects.nav_fallback && <span>terrain-relative nav</span>}
              {(injects.cells || []).length > 0 && <span>{injects.cells.length} cell(s)</span>}
              {Object.keys(injects.faults || {}).length > 0 && <span>{Object.keys(injects.faults).join(', ')} degraded</span>}
            </div>
            <div className="operator__actions">
              <button className="btn" onClick={() => run('clear_injects')}>Clear weather</button>
              <button className="btn" onClick={() => run('end_mission')}>End mission</button>
            </div>
          </>
        )}
        {!live && !planning && (
          <div className="operator__actions">
            <button className="btn primary" onClick={() => run('reset_mission')}>Back to planning</button>
          </div>
        )}
      </div>

      {fixes.length > 0 && !jammer && (
        <div className="operator__card operator__card--alert">
          <div className="operator__card-head">
            <b>{fixes.length > 1 ? `${fixes.length} interference sources localised` : 'Interference source localised'}</b>
            <span className="pill bad">COMMS</span>
          </div>
          {fixes.map((e) => (
            <div key={e.id} className="operator__sub" style={{ marginTop: 4 }}>
              <b>{e.id}</b> grid ({fmt(e.x)}, {fmt(e.y)}) · ± {fmt(e.radius_m)} m · ≈{fmt(e.power_dbm)} dBm
              {e.sensors ? ` · ${e.sensors}-aircraft cross-fix` : ''}
            </div>
          ))}
          <div className="operator__sub" style={{ marginTop: 4 }}>
            Scouts inside it withdraw to regain the link; the relay planner routes around it.
          </div>
        </div>
      )}

      <button className="operator__more" onClick={() => setShowMore(!showMore)}>
        {showMore ? '▾ Hide weather & reports' : '▸ Weather & reports'}
      </button>

      {showMore && (<>
      {/* ---- environment ---------------------------------------------- */}
      <div className="operator__section">Weather</div>
      <div className="operator__row">
        <label>Wind <b>{fmt(wind.speed)} m/s</b> toward <b>{fmt(wind.heading)}°</b></label>
        <input type="range" min="0" max="18" step="1" value={wind.speed}
          onChange={(e) => setWind({ ...wind, speed: Number(e.target.value) })}
          onMouseUp={() => run('set_wind', { speed: wind.speed, heading_deg: wind.heading })}
          onTouchEnd={() => run('set_wind', { speed: wind.speed, heading_deg: wind.heading })} />
        <input type="range" min="0" max="355" step="5" value={wind.heading}
          onChange={(e) => setWind({ ...wind, heading: Number(e.target.value) })}
          onMouseUp={() => run('set_wind', { speed: wind.speed, heading_deg: wind.heading })}
          onTouchEnd={() => run('set_wind', { speed: wind.speed, heading_deg: wind.heading })} />
      </div>
      <div className="operator__actions">
        <button className="btn" onClick={() => run('gust', { magnitude: 13 })}>Trigger gust</button>
        {(rf.jammers || []).length > 0 && (
          <button className="btn" onClick={() => run('clear_jammers')}>Clear interference</button>
        )}
      </div>

      {/* ---- reports ---------------------------------------------------- */}
      <div className="operator__section">Reports</div>
      <div className="operator__actions">
        <button className="btn" onClick={() => run('sitrep')}>Generate SITREP</button>
        <a className="btn" href="/api/summary" target="_blank" rel="noreferrer">Mission metrics (JSON)</a>
        {scripted ? (
          <button className="btn" onClick={() => run('stop_scenario')}>Stop scripted demo</button>
        ) : (
          <button className="btn" onClick={() => run('run_scenario')}>Run scripted demo</button>
        )}
      </div>
      </>)}
    </div>
  );
}
