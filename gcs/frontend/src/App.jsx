import { useCallback, useEffect, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import Viewport from './components/Viewport';
import OperatorPanel from './components/OperatorPanel';
import TheatreSelector from './components/TheatreSelector';
import BaseConsole from './components/BaseConsole';
import {
  CausalPanel,
  ClusterPanel,
  CommsPanel,
  ControlPanel,
  ControlsPanel,
  EventLog,
  EvidencePanel,
  LinkHealthPanel,
  MetricsStrip,
  SitrepPanel,
  SituationBanner,
  SwarmPanel,
  TopologyPanel,
} from './components/Panels';

const PHASES = [
  { id: 1, label: 'Launch & Survey' },
  { id: 2, label: 'Comms Degraded' },
  { id: 3, label: 'UAV Failure' },
  { id: 4, label: 'Emergency Task' },
  { id: 5, label: 'Recharge & Handover' },
];

function CommandBar({ connected, telemetry, onTheatre, onSwitch }) {
  const simTime = telemetry?.mission?.phase === 'LIVE'
    ? (telemetry?.mission?.elapsed ?? 0) : (telemetry?.sim_time ?? 0);
  const phase = telemetry?.metrics?.current_phase ?? 0;
  const cluster = telemetry?.cluster;
  // The node this browser tab is actually connected to. On BRAVO/CHARLIE the
  // relayed cluster block describes ALPHA, so `served_by` is authoritative.
  const here = telemetry?.served_by || cluster?.self;

  const minutes = String(Math.floor(simTime / 60)).padStart(2, '0');
  const seconds = String(Math.floor(simTime % 60)).padStart(2, '0');

  return (
    <header className="cmdbar">
      <div className="brand">
        <div>
          <div className="brand__name">C-DAWN</div>
          <div className="brand__sub">UAV-X · Simulation</div>
        </div>
      </div>

      <div className="phases">
        {PHASES.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`phase ${phase > p.id ? 'done' : phase === p.id ? 'active' : ''}`}
            >
              <span className="phase__dot" />
              <span className="phase__label">{p.label}</span>
            </div>
            {i < PHASES.length - 1 && <span className="phase__sep" />}
          </div>
        ))}
      </div>

      <button className="theatre-btn" onClick={onTheatre} title="Change the disaster site">
        <span className="theatre-btn__label">Disaster site</span>
        <span className="theatre-btn__name">{telemetry?.demo?.theatre?.name || '—'}</span>
        {telemetry?.demo?.theatre?.lat != null && (
          <span className="theatre-btn__coords">
            {telemetry.demo.theatre.lat.toFixed(3)}°N {telemetry.demo.theatre.lon.toFixed(3)}°E
          </span>
        )}
        <span className="theatre-btn__chev">▾</span>
      </button>

      <div className="cmdbar__right">
        <button className="view-switch" onClick={onSwitch}
          title="Switch this screen to the ground base console">
          Ground base ▸
        </button>
        {here && (
          <div className="cmdbar__viewing" style={{ textAlign: 'right' }}>
            <div className="clock__label">
              Viewing from{here.upstream ? ` · sim on ${here.upstream}` : ''}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              {here.callsign}
              <span style={{
                color: 'var(--ink-3)', fontWeight: 500,
                fontFamily: 'var(--mono)', fontSize: 11, marginLeft: 6,
              }}>
                {here.address}
              </span>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <div className="clock__label">
            {telemetry?.mission?.phase === 'LIVE' ? 'Mission time' : (telemetry?.mission?.phase || 'Sim time')}
          </div>
          <div className="clock">T+{minutes}:{seconds}</div>
        </div>

        <div className={`linkstate ${connected ? 'up' : 'down'}`}>
          <span className="linkstate__dot" />
          {connected ? 'LIVE' : 'NO LINK'}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const { data, connected, runCommand, lastResult } = useWebSocket();
  const [focusDrone, setFocusDrone] = useState(null);

  // Operator state
  const [tool, setTool] = useState('select');
  const [selected, setSelected] = useState(null);      // {kind, id}
  const [jammerPower, setJammerPower] = useState(5);
  const [wind, setWind] = useState({ speed: 7, heading: 15 });
  const [toast, setToast] = useState(null);
  // Open the globe on launch: the operator starts by choosing where to fly
  // (?globe=0 skips it, e.g. when recording a demo of a scenario already loaded)
  const [theatreOpen, setTheatreOpen] = useState(
    () => new URLSearchParams(window.location.search).get('globe') !== '0',
  );

  // Two screens, two jobs: the base laptop runs mission control and reads the
  // field's reports; the forward node shows the operation itself. Chosen by
  // ?view=base, by a node serving as ground control, or by the header toggle
  // (remembered in this browser).
  const [view, setView] = useState(() => {
    const param = new URLSearchParams(window.location.search).get('view');
    if (param === 'base' || param === 'field') return param;
    return localStorage.getItem('cdawn.view') || null;
  });
  useEffect(() => {
    if (view) localStorage.setItem('cdawn.view', view);
  }, [view]);
  useEffect(() => {
    if (view) return;
    const role = data?.served_by?.role;
    if (role) setView(role === 'gcs' ? 'base' : 'field');
  }, [view, data?.served_by?.role]);

  const frame = useCallback((id) => setFocusDrone(id), []);
  const clearFocus = useCallback(() => setFocusDrone(null), []);

  // Esc always returns to the select tool
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setTool('select'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Surface command results briefly, errors in red
  useEffect(() => {
    if (!lastResult) return undefined;
    const r = lastResult.result || {};
    if (!r.ok) setToast({ bad: true, text: r.error || 'Command failed' });
    else if (r.drone_id && lastResult.name === 'add_drone') setToast({ text: `${r.drone_id} deployed` });
    else if (r.jammer_id && lastResult.name === 'add_interference') setToast({ text: `Interference ${r.jammer_id} switched on` });
    else if (r.poi_id && lastResult.name === 'add_poi') setToast({ text: `${r.poi_id} reported — priority 1` });
    else if (lastResult.name === 'launch_mission') setToast({ text: 'Mission launched' });
    else return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [lastResult]);

  const handleGroundClick = useCallback((point, activeTool) => {
    const { x, y } = point;
    switch (activeTool) {
      case 'add_scout': runCommand('add_drone', { role: 'SCOUT', x, y }); break;
      case 'add_poi': runCommand('add_poi', { x, y, category: 'trapped_survivors', priority: 1 }); break;
      case 'add_interference': runCommand('add_interference', { x, y, power_dbm: jammerPower }); break;
      case 'goto':
        if (selected?.kind === 'drone') runCommand('goto', { drone_id: selected.id, x, y });
        setTool('select');
        break;
      default:
        setSelected(null);
    }
  }, [runCommand, jammerPower, selected]);

  const handlePick = useCallback((pick) => setSelected(pick), []);

  const handleReset = useCallback(() => {
    setSelected(null);
    setTool('select');
    runCommand('reset_mission');
  }, [runCommand]);

  if (view === 'base') {
    return (
      <BaseConsole
        telemetry={data}
        run={runCommand}
        onReset={handleReset}
        onSwitch={() => setView('field')}
      />
    );
  }

  return (
    <div className="app">
      <CommandBar connected={connected} telemetry={data} onTheatre={() => setTheatreOpen(true)}
        onSwitch={() => setView('base')} />
      <TheatreSelector
        open={theatreOpen}
        onClose={() => { setTheatreOpen(false); setSelected(null); }}
        currentId={data?.demo?.theatre?.id}
        canClose={Boolean(data)}
      />

      <div className="workspace">
        <div className="stage">
          <Viewport
            telemetry={data}
            focusDrone={focusDrone}
            onFocusHandled={clearFocus}
            tool={tool}
            selectedId={selected?.kind === 'drone' ? selected.id : null}
            onGroundClick={handleGroundClick}
            onPick={handlePick}
          />
          <div className="overlay overlay--tl">
            <SituationBanner telemetry={data} />
          </div>
          <div className="overlay overlay--tr">
            <OperatorPanel
              telemetry={data}
              tool={tool}
              setTool={setTool}
              selected={selected}
              setSelected={setSelected}
              run={runCommand}
              jammerPower={jammerPower}
              setJammerPower={setJammerPower}
              wind={wind}
              setWind={setWind}
              onFrame={frame}
            />
          </div>
          {toast && <div className={`toast ${toast.bad ? 'bad' : ''}`}>{toast.text}</div>}
        </div>

        <div className="sidebar">
          <SwarmPanel
            telemetry={data}
            selectedId={selected?.kind === 'drone' ? selected.id : null}
            onSelect={(id) => { setSelected({ kind: 'drone', id }); frame(id); }}
            run={runCommand}
          />
          <CommsPanel telemetry={data} />
          <CausalPanel telemetry={data} />
          <LinkHealthPanel telemetry={data} />
          <TopologyPanel telemetry={data} />
          <ControlPanel telemetry={data} />
          <ClusterPanel telemetry={data} />
          <EvidencePanel />
          <SitrepPanel telemetry={data} />
          <EventLog telemetry={data} />
          <ControlsPanel run={runCommand} onReset={handleReset} />
        </div>
      </div>

      <MetricsStrip telemetry={data} />
    </div>
  );
}
