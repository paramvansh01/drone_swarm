import { useEffect, useRef, useState } from 'react';
import SceneManager from '../three/SceneManager';

const SHOTS = [
  { id: 'establishing', label: 'Establishing' },
  { id: 'chase', label: 'Chase' },
  { id: 'low_orbit', label: 'Close Orbit' },
  { id: 'ridge_pass', label: 'Ridge' },
  { id: 'formation', label: 'Formation' },
  { id: 'top_down', label: 'Overhead' },
];

/**
 * The 3D tactical view.
 *
 * The Three.js scene is imperative and lives outside React's render cycle —
 * it runs at 60 fps against telemetry arriving at 20 Hz, and re-rendering a
 * React tree at either rate would be pure overhead. React owns the surrounding
 * chrome; `SceneManager` owns the canvas, and telemetry is pushed into it
 * through an effect rather than through props-driven re-renders.
 */
export default function Viewport({
  telemetry, focusDrone, onFocusHandled,
  tool = 'select', selectedId = null, onGroundClick, onPick,
}) {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [camera, setCamera] = useState({ shot: 'establishing', manual: false });
  const [north, setNorth] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const m = managerRef.current;
      if (m && m.ready) setNorth(m.northScreenAngle());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // --- one-time scene setup ------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return undefined;

    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;
    manager.onCameraChange = setCamera;

    // Debug handle. The 3D scene is imperative and lives outside React, so
    // without this there is no way to inspect what the renderer is actually
    // doing from the browser console or from an automated check — and "the
    // panel is blank" is otherwise indistinguishable from "the data is empty".
    if (typeof window !== 'undefined') window.__cdawnScene = manager;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/api/terrain', { cache: 'no-store' });
        if (!response.ok) throw new Error(`terrain ${response.status}`);
        const payload = await response.json();
        if (cancelled) return;
        manager.loadTerrain(payload);
        setStatus('ready');
      } catch (err) {
        console.error('[viewport] terrain load failed', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  // --- operator interaction ------------------------------------------------
  // Callbacks are routed through refs so the imperative scene always calls
  // the latest React handlers without being re-created.
  const groundRef = useRef(onGroundClick);
  const pickRef = useRef(onPick);
  groundRef.current = onGroundClick;
  pickRef.current = onPick;

  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.onGroundClick = (point, activeTool) => groundRef.current?.(point, activeTool);
    manager.onPick = (pick) => pickRef.current?.(pick);
  }, []);

  useEffect(() => { managerRef.current?.setTool(tool); }, [tool, status]);
  useEffect(() => { managerRef.current?.setSelected(selectedId); }, [selectedId]);

  // --- follow theatre switches ------------------------------------------------
  // When the simulation node loads another theatre, the terrain fingerprint
  // in telemetry changes; refetch and rebuild the world.
  const liveChecksum = telemetry?.demo?.terrain_checksum;
  const reloadFor = useRef(null);
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager || !liveChecksum || status === 'loading') return;
    if (manager.terrainChecksum && manager.terrainChecksum !== liveChecksum
        && reloadFor.current !== liveChecksum) {
      // Remember which terrain we asked for, so a stale response can never
      // turn this into a fetch loop.
      reloadFor.current = liveChecksum;
      setStatus('loading');
      fetch(`/api/terrain?c=${liveChecksum}`, { cache: 'no-store' })
        .then((r) => r.json())
        .then((payload) => { manager.loadTerrain(payload); setStatus('ready'); })
        .catch(() => { reloadFor.current = null; setStatus('error'); });
    }
  }, [liveChecksum, status]);

  // --- push telemetry into the scene --------------------------------------
  useEffect(() => {
    if (managerRef.current && telemetry) {
      managerRef.current.setTelemetry(telemetry);
    }
  }, [telemetry]);

  // --- external focus request (clicking an aircraft in the sidebar) -------
  useEffect(() => {
    if (focusDrone && managerRef.current) {
      managerRef.current.focusDrone(focusDrone);
      onFocusHandled?.();
    }
  }, [focusDrone, onFocusHandled]);

  const selectShot = (shotId) => managerRef.current?.setShot(shotId);
  const resumeAuto = () => managerRef.current?.resumeAuto();

  const rf = telemetry?.rf || {};
  const jamming = rf.jamming_active;
  // Open by default only where there is room beside the operator panel
  const [legendOpen, setLegendOpen] = useState(() => window.innerHeight > 1150);

  return (
    <div className="viewport">
      <div ref={containerRef} className="viewport__canvas" />

      {status !== 'ready' && (
        <div className="viewport__loading">
          <div>
            {status === 'error' ? (
              <>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Terrain unavailable
                </div>
                <div>The simulation node is not reachable.</div>
              </>
            ) : (
              <>
                <div className="spinner" />
                <div style={{ fontWeight: 600 }}>Loading terrain model</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                  {telemetry?.demo?.theatre?.name || 'Elevation model'} · 513 × 513 grid
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="overlay overlay--compass" title="True north">
        <div className="compass">
          <div className="compass__needle" style={{ transform: `rotate(${north}rad)` }}>
            <span className="compass__n">N</span>
          </div>
        </div>
      </div>

      <div className="overlay overlay--bl">
        <div className="camstrip">
          <button
            className={`camstrip__btn ${!camera.manual && camera.shot ? 'on' : ''}`}
            onClick={resumeAuto}
            title="Hand the camera back to the automatic director"
          >
            ● AUTO
          </button>
          {SHOTS.map((shot) => (
            <button
              key={shot.id}
              className={`camstrip__btn ${!camera.manual && camera.shot === shot.id ? 'on' : ''}`}
              onClick={() => selectShot(shot.id)}
            >
              {shot.label}
            </button>
          ))}
          {camera.manual && (
            <span
              className="camstrip__btn on"
              style={{ cursor: 'default' }}
              title="Drag to orbit, scroll to zoom"
            >
              MANUAL
            </span>
          )}
        </div>
      </div>

      <div className="overlay overlay--br">
        {!legendOpen ? (
          <div className="legend">
            <button className="legend__toggle" onClick={() => setLegendOpen(true)}>▸ Legend</button>
          </div>
        ) : (
        <div className="legend">
          <button className="legend__toggle" onClick={() => setLegendOpen(false)}>▾ Legend</button>
          <div className="legend__title" style={{ marginTop: 6 }}>Link quality</div>
          <div className="legend__row">
            <i className="legend__swatch" style={{ background: '#0f8a5f' }} />
            <span>Good &gt; 85%</span>
          </div>
          <div className="legend__row">
            <i className="legend__swatch" style={{ background: '#d97706' }} />
            <span>Marginal 50–85%</span>
          </div>
          <div className="legend__row">
            <i className="legend__swatch" style={{ background: '#dc2626' }} />
            <span>Degraded &lt; 50%</span>
          </div>

          <div className="legend__title" style={{ marginTop: 9 }}>Aircraft</div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#0b6bcb' }} />
            <span>Scout</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#0f8a5f' }} />
            <span>Relay</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#6b7280' }} />
            <span>Returning / on pad</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#1d4ed8' }} />
            <span>Ground control station</span>
          </div>

          <div className="legend__title" style={{ marginTop: 9 }}>Survey tasks</div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#dc2626' }} />
            <span>Priority 1 · 2 · 3 (red · amber · yellow)</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#2563eb' }} />
            <span>Surveyed, data in transit</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: '#0f8a5f' }} />
            <span>Data delivered to GCS</span>
          </div>
          <div className="legend__row">
            <i className="legend__dot" style={{ background: 'transparent', border: '1.5px dashed #f97316' }} />
            <span>Geofence</span>
          </div>

          {jamming && (
            <>
              <div className="legend__title" style={{ marginTop: 9 }}>Communication outage</div>
              <div className="legend__row">
                <i className="legend__dot" style={{ background: '#dc2626' }} />
                <span>Interference zone</span>
              </div>
              <div className="legend__row">
                <i className="legend__dot" style={{ background: 'transparent', border: '1.5px dashed #f59e0b' }} />
                <span>Source (swarm estimate)</span>
              </div>
            </>
          )}

          <div
            style={{
              marginTop: 9, paddingTop: 7,
              borderTop: '1px solid var(--border)',
              fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.45,
            }}
          >
            Drag to orbit · scroll to zoom
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
