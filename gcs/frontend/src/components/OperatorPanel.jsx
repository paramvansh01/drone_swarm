/**
 * Operator control toolbar.
 *
 * Floats over the 3D view so that deploying an aircraft is "pick a tool,
 * click the mountain" — the same gesture a judge would try first. Every action
 * goes to the simulation as a command; nothing here is scripted.
 */

import { useState } from 'react';

const TOOLS = [
  { id: 'select', label: 'Select', hint: 'Click an aircraft, jammer or target to select it. Drag to orbit.' },
  { id: 'add_scout', label: '+ Scout', hint: 'Click the terrain to deploy a scout. It will task itself to the nearest survey target.' },
  { id: 'add_relay', label: '+ Relay', hint: 'Click the terrain to deploy a relay. The GNN will position it to hold the mesh together.' },
  { id: 'add_poi', label: '+ Target', hint: 'Click the terrain to mark a survey target. An idle scout will be tasked to it.' },
  { id: 'add_jammer', label: '+ Jammer', hint: 'Click the terrain to emplace a hostile jammer. Ridges between it and a drone block its signal.' },
];

// Unobstructed distance at which a jammer lifts the noise floor to -82 dBm —
// mirrors RFChannel.jammer_radius_m (900 MHz free-space loss at 1 m = 31.5 dB).
const jammerReach = (powerDbm) => 10 ** ((powerDbm + 3 + 82 - 31.53) / 20);

const fmt = (v, d = 0) => (v === null || v === undefined || Number.isNaN(v) ? '—' : Number(v).toFixed(d));

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
  const fix = fixes[0];
  const magazine = demo.magazine ?? 0;
  const interceptors = telemetry?.interceptors || [];
  const mission = telemetry?.mission || demo.mission || {};
  const injects = telemetry?.injects || {};
  const live = mission.phase === 'LIVE';
  const pending = (mission.requests || []).filter((r) => r.status === 'PENDING');
  const INJECTS = [
    ['heavy_rain', 'Heavy rain', 'Convective rainfall: turbulence, wet antennas, degraded optics'],
    ['storm_cell', 'Downdraught', 'Drifting mountain-wave cell with a 9 m/s sink'],
    ['gps_denial', 'GNSS denial', 'Spoofing bubble: the navigation solution drifts'],
    ['equipment_fault', 'Motor fault', 'Motor/ESC failure on one aircraft'],
    ['enemy_uav', 'Hostile UAV', 'Enemy interceptor drone hunting the swarm'],
  ];
  const launchBlocked = !fix ? 'The swarm has not located the jammer yet — no fix to launch against.'
    : magazine <= 0 ? 'No interceptors remaining.' : null;
  const launchButton = (target) => (
    <button
      className="btn danger"
      disabled={Boolean(launchBlocked)}
      title={launchBlocked || 'Operator authorisation: launch a home-on-jam interceptor at the located jammer'}
      onClick={() => run('launch_interceptor', target ? { emitter_id: target } : {})}
    >
      Authorise interceptor · {magazine} left
    </button>
  );
  const PHASE_LABEL = {
    LAUNCH: 'Climbing out', MIDCOURSE: 'Midcourse to fix', TERMINAL: 'Terminal — homing on emission',
    REACQUIRE: 'Lock lost — reacquiring', LOITER: 'Loitering — no emission', HIT: 'TARGET DESTROYED',
    TERRAIN: 'Missed — hit terrain', ABORTED: 'Aborted', ENDURANCE: 'Self-neutralised',
  };

  const dead = drone?.status === 'KILLED';
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

      {(tool === 'add_jammer' || jammer) && (
        <div className="operator__row">
          <label>
            Jammer power <b>{fmt(jammer ? jammer.power_dbm : jammerPower)} dBm</b>
            <span className="operator__sub">
              {' '}· reach ≈ {fmt(jammerReach(jammer ? jammer.power_dbm : jammerPower))} m in open air
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
            <span className={`pill ${dead ? 'bad' : 'ok'}`}>{dead ? 'DOWN' : drone.status}</span>
          </div>
          <div className="operator__stats">
            <span>{drone.role.replace('_', ' ')}</span>
            <span>{fmt(drone.agl)} m AGL</span>
            <span>{fmt(drone.battery)}% batt</span>
            <span>{drone.ew_hold ? 'EW WITHDRAWAL' : drone.manual_target ? 'OPERATOR ORDER' : 'AUTONOMOUS'}</span>
          </div>
          <div className="operator__actions">
            {!dead && (
              <button className="btn" onClick={() => setTool('goto')}>Send to…</button>
            )}
            {!dead && drone.manual_target && (
              <button className="btn" onClick={() => run('release', { drone_id: drone.id })}>
                Release to autonomy
              </button>
            )}
            {!dead && drone.role !== 'GCS_RELAY' && (
              <button
                className="btn"
                onClick={() => run('set_role', {
                  drone_id: drone.id, role: drone.role === 'SCOUT' ? 'RELAY' : 'SCOUT',
                })}
              >
                Make {drone.role === 'SCOUT' ? 'relay' : 'scout'}
              </button>
            )}
            <button className="btn" onClick={() => onFrame(drone.id)}>Frame camera</button>
            {dead ? (
              <button className="btn primary" onClick={() => run('revive', { drone_id: drone.id })}>
                Relaunch
              </button>
            ) : (
              <button className="btn danger" onClick={() => run('kill', { drone_id: drone.id })}>
                Take down
              </button>
            )}
          </div>
        </div>
      )}

      {jammer && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>{jammer.id}</b><span className="pill bad">HOSTILE</span>
          </div>
          {rf.ew?.estimate?.true_id === jammer.id && (
            <div className="operator__stats">
              <span>Located by swarm ± {fmt(rf.ew.estimate.radius_m)} m</span>
              <span>estimate {fmt(rf.ew.estimate.error_m)} m off</span>
              <span>≈{fmt(rf.ew.estimate.power_dbm)} dBm est.</span>
            </div>
          )}
          <div className="operator__actions">
            {launchButton(null)}
            <button className="btn" onClick={() => { run('remove_jammer', { jammer_id: jammer.id }); setSelected(null); }}>
              Neutralise (ground team)
            </button>
          </div>
          {launchBlocked && <div className="operator__hint">{launchBlocked}</div>}
        </div>
      )}

      {poi && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>{poi.id}</b>
            <span className={`pill ${poi.surveyed ? 'ok' : 'warn'}`}>{poi.surveyed ? 'SURVEYED' : 'PENDING'}</span>
          </div>
          <div className="operator__stats"><span>{poi.category}</span><span>priority {poi.priority}</span></div>
          <div className="operator__actions">
            <button className="btn" onClick={() => { run('remove_poi', { poi_id: poi.id }); setSelected(null); }}>
              Cancel target
            </button>
          </div>
        </div>
      )}

      {/* ---- mission phase ------------------------------------------- */}
      <div className={`operator__card mission-card ${live ? 'mission-card--live' : ''}`}>
        <div className="operator__card-head">
          <b>{live ? `LIVE MISSION · ${mission.mission_id || ''}` : 'PRE-MISSION REHEARSAL'}</b>
          <span className={`pill ${live ? 'bad' : 'ok'}`}>{live ? 'COMMITTED' : 'TRAINING'}</span>
        </div>
        {!live && (
          <>
            <div className="operator__sub">
              The swarm is training against this theatre's terrain, wind and radio
              conditions. Commit it when the rehearsal looks good.
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
              <span>T+{Math.floor((mission.elapsed || 0) / 60)}:{String(Math.floor((mission.elapsed || 0) % 60)).padStart(2, '0')}</span>
              <span>rehearsed PDR {fmt((mission.rehearsal?.backhaul_pdr ?? 0) * 100)}%</span>
              <span>{mission.rehearsal?.relay_solves ?? 0} relay solves</span>
            </div>
            <div className="operator__section">Inject (exercise control)</div>
            <div className="inject-tools">
              {INJECTS.map(([kind, label, hint]) => (
                <button key={kind} className="tool" title={hint}
                  onClick={() => run('inject', { kind })}>{label}</button>
              ))}
            </div>
            <div className="operator__stats">
              {injects.rain_mm_h > 0 && <span>rain {fmt(injects.rain_mm_h)} mm/h</span>}
              {injects.cloud_base_agl && <span>cloud base {fmt(injects.cloud_base_agl)} m AGL</span>}
              {injects.nav_fallback && <span>terrain-relative nav</span>}
              {(injects.cells || []).length > 0 && <span>{injects.cells.length} cell(s)</span>}
              {(injects.enemies || []).length > 0 && <span className="bad-text">{injects.enemies.length} hostile UAV</span>}
              {Object.keys(injects.faults || {}).length > 0 && <span>{Object.keys(injects.faults).join(', ')} degraded</span>}
            </div>
            <div className="operator__actions">
              <button className="btn" onClick={() => run('clear_injects')}>Clear injects</button>
              <button className="btn" onClick={() => run('end_mission')}>End mission</button>
            </div>
          </>
        )}
      </div>

      {/* Support requests are authorised at the GROUND BASE, not here. The
          field raises them; the base approves. Shown read-only for awareness. */}
      {pending.length > 0 && (
        <div className="operator__card operator__card--alert">
          <div className="operator__card-head">
            <b>Awaiting base authority</b><span className="pill bad">{pending.length}</span>
          </div>
          {pending.map((r) => (
            <div key={r.id} className="operator__sub" style={{ marginTop: 4 }}>
              <b>{r.id} · {r.kind.replace(/_/g, ' ')}</b> — {r.reason}
            </div>
          ))}
        </div>
      )}

      {fixes.length > 0 && !jammer && (
        <div className="operator__card operator__card--alert">
          <div className="operator__card-head">
            <b>{fixes.length > 1 ? `${fixes.length} hostile emitters located` : 'Hostile jammer located'}</b>
            <span className="pill bad">EW</span>
          </div>
          {fixes.map((e) => (
            <div key={e.id} className="interceptor-row">
              <div>
                <b>{e.id}</b>
                <div className="operator__sub">
                  grid ({fmt(e.x)}, {fmt(e.y)}) · ± {fmt(e.radius_m)} m · ≈{fmt(e.power_dbm)} dBm
                  {e.sensors ? ` · ${e.sensors}-aircraft cross-fix` : ''}
                </div>
              </div>
              {launchButton(e.id)}
            </div>
          ))}
        </div>
      )}

      {interceptors.length > 0 && (
        <div className="operator__card">
          <div className="operator__card-head">
            <b>Interceptors</b><span className="pill warn">{magazine}/{demo.magazine_size ?? 2} in magazine</span>
          </div>
          {interceptors.map((u) => (
            <div key={u.id} className="interceptor-row">
              <div>
                <b>{u.id}</b>{' '}
                <span className={`interceptor-row__phase ${u.outcome === 'HIT' ? 'ok' : u.done ? 'bad' : ''}`}>
                  {u.phase === 'TERMINAL' && u.locked_on && !String(u.locked_on).startsWith('JAM')
                    ? `Terminal — closing on ${u.locked_on}`
                    : (PHASE_LABEL[u.phase] || u.phase)}
                </span>
                <div className="operator__sub">
                  {fmt(u.speed)} m/s · {fmt(u.range_m)} m to fix
                  {u.seeker_dbm != null && ` · seeker ${fmt(u.seeker_dbm)} dBm`}
                </div>
              </div>
              {!u.done && (
                <button className="btn" onClick={() => run('abort_interceptor', { interceptor_id: u.id })}>Abort</button>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="operator__more" onClick={() => setShowMore(!showMore)}>
        {showMore ? '▾ Hide weather & mission' : '▸ Weather & mission'}
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
          <button className="btn" onClick={() => run('clear_jammers')}>Clear all jammers</button>
        )}
      </div>

      {/* ---- mission ---------------------------------------------------- */}
      <div className="operator__section">Mission</div>
      <div className="operator__actions">
        <button className="btn" onClick={() => run('sitrep')}>Generate SITREP</button>
        {scripted ? (
          <button className="btn" onClick={() => run('stop_scenario')}>Stop scripted run</button>
        ) : (
          <button className="btn" onClick={() => run('run_scenario')}>Run scripted 4-phase demo</button>
        )}
      </div>
      </>)}
    </div>
  );
}
