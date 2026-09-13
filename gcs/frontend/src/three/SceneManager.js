import * as THREE from 'three';
import {
  createTerrainMesh, createContextMesh, createSkirt, applyImagery,
  createSky, decodeHeightmap, sampleHeight, SUN_DIRECTION, HAZE,
} from './Terrain';
import { createDrone, roleColor } from './DroneModel';
import CameraDirector from './CameraDirector';

/**
 * Owns the WebGL scene and the render loop.
 *
 * Coordinate convention
 * ---------------------
 * The simulation is Z-up (x east, y north, z altitude). Three.js is Y-up.
 * Everything crossing this boundary is converted in one place, `toScene()`,
 * so the mapping is stated once instead of being rediscovered at each call
 * site:  sim (x, y, z)  ->  three (x, z, y).
 */

function toScene(p) {
  return new THREE.Vector3(p[0], p[2], p[1]);
}

const LINK_GOOD = new THREE.Color(0x0f8a5f);
const LINK_FAIR = new THREE.Color(0xd97706);
const LINK_POOR = new THREE.Color(0xdc2626);

export default class SceneManager {
  constructor(container) {
    this.container = container;
    this.ready = false;
    this.disposed = false;

    this.drones = new Map();
    this.links = new Map();
    this.poiMarkers = new Map();
    this.labels = new Map();

    this.telemetry = null;
    this.lastEventCount = 0;
    this.clock = new THREE.Clock();

    this._initRenderer();
    this._initScene();
    this._initInteraction();
  }

  // -- setup ---------------------------------------------------------------

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    // Cap the device pixel ratio: a 3x retina display at full resolution
    // triples the fragment cost of the terrain shader for a difference no
    // one can see on a projector.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = HAZE.clone();

    this.camera = new THREE.PerspectiveCamera(
      52,
      this.container.clientWidth / this.container.clientHeight,
      2,
      90000,
    );

    this.sunDirection = SUN_DIRECTION.clone();

    this.sun = new THREE.DirectionalLight(0xfff3e0, 2.1);
    this.sun.position.copy(this.sunDirection).multiplyScalar(3000);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 100;
    this.sun.shadow.camera.far = 6000;
    const extent = 900;
    Object.assign(this.sun.shadow.camera, {
      left: -extent, right: extent, top: extent, bottom: -extent,
    });
    this.sun.shadow.bias = -0.0008;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.scene.add(new THREE.HemisphereLight(0xbcd6f0, 0x6b6257, 0.75));

    this.scene.add(createSky());

    this.linkGroup = new THREE.Group();
    this.poiGroup = new THREE.Group();
    this.droneGroup = new THREE.Group();
    this.scene.add(this.linkGroup, this.poiGroup, this.droneGroup);

    this._initJammingDome();

    // Placement cursor: a ring that follows the pointer over the terrain
    this.cursor = new THREE.Mesh(
      new THREE.RingGeometry(14, 19, 40),
      new THREE.MeshBasicMaterial({
        color: 0x1549c9, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide, depthTest: false,
      }),
    );
    this.cursor.rotation.x = -Math.PI / 2;
    this.cursor.renderOrder = 10;
    this.cursor.visible = false;
    this.scene.add(this.cursor);

    // Selection halo around the chosen aircraft
    this.halo = new THREE.Mesh(
      new THREE.RingGeometry(3.2, 3.9, 40),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b, transparent: true, opacity: 0.95,
        side: THREE.DoubleSide, depthTest: false,
      }),
    );
    this.halo.rotation.x = -Math.PI / 2;
    this.halo.renderOrder = 11;
    this.halo.visible = false;
    this.scene.add(this.halo);

    this.jammers = new Map();
    this.interceptors = new Map();   // id -> { model, trail, state, receivedAt }
    this.enemies = new Map();        // hostile UAVs
    this.stormCells = new Map();
    this.denialZones = new Map();
    this.rain = null;
    this.effects = [];               // strike flashes and smoke
    this._seenStrikes = new Set();
    this.targets = new Map();
  }

  _initJammingDome() {
    // A translucent shell marking the contested RF volume. Additive blending
    // and back-face rendering give it a soft, obviously-not-solid look so it
    // does not read as terrain.
    const geometry = new THREE.SphereGeometry(1, 28, 20);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xdc2626) },
        uOpacity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;

        void main() {
          // Fresnel rim so the shell reads as a volume boundary
          float rim = pow(1.0 - abs(vNormal.z), 2.2);
          // Travelling interference rings
          float rings = 0.5 + 0.5 * sin(vPos.y * 22.0 - uTime * 3.0);
          float alpha = uOpacity * (0.12 + rim * 0.5) * (0.6 + rings * 0.4);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    this.jammingDome = new THREE.Mesh(geometry, material);
    this.jammingDome.visible = false;
    this.jammingDome.frustumCulled = false;
    this.scene.add(this.jammingDome);
  }

  _initInteraction() {
    const el = this.renderer.domElement;
    let pressed = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;

    // A press only becomes a camera drag once the pointer has actually
    // moved. Without this distinction every click to place a drone would
    // also knock the director into manual mode.
    el.addEventListener('pointerdown', (e) => {
      pressed = true;
      dragging = false;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (pressed) {
        if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
          dragging = true;
          if (this.director && !this.director.manual) {
            this.director.beginManual(this.director.lookAt.clone());
            this._notifyCamera();
          }
        }
        if (dragging && this.director) {
          this.director.orbit(e.clientX - lastX, e.clientY - lastY);
        }
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      this._updateHover(e);
    });

    const endPress = (e) => {
      if (pressed && !dragging) this._handleClick(e);
      pressed = false;
      dragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    };
    el.addEventListener('pointerup', endPress);
    el.addEventListener('pointercancel', () => { pressed = false; dragging = false; });
    el.addEventListener('pointerleave', () => { if (this.cursor) this.cursor.visible = false; });

    el.addEventListener('wheel', (e) => {
      if (!this.director) return;
      e.preventDefault();
      if (!this.director.manual) {
        this.director.beginManual(this.director.lookAt.clone());
        this._notifyCamera();
      }
      this.director.zoom(e.deltaY);
    }, { passive: false });

    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(this.container);
  }

  // -- picking ---------------------------------------------------------------

  _ndc(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  }

  /**
   * Intersect the view ray with the terrain by marching the heightfield.
   * Exact enough for placement (metre-level), and far cheaper than a
   * triangle raycast against a quarter-million-triangle mesh.
   */
  _terrainHit(e) {
    if (!this.terrainLookup) return null;
    const n = this._ndc(e);
    const ray = new THREE.Raycaster();
    ray.setFromCamera({ x: n.x, y: n.y }, this.camera);
    const origin = ray.ray.origin;
    const dir = ray.ray.direction;

    const size = this.terrainData.sizeM;
    let prevT = 0;
    const step = 6;
    for (let t = step; t < 9000; t += step) {
      const x = origin.x + dir.x * t;
      const z = origin.z + dir.z * t;
      const y = origin.y + dir.y * t;
      if (x < 0 || z < 0 || x > size || z > size) {
        if (t > 200 && (x < -500 || z < -500 || x > size + 500 || z > size + 500)) break;
        prevT = t;
        continue;
      }
      if (y <= this.terrainLookup.heightAt(x, z)) {
        // Bisect between the last point above ground and this one
        let lo = prevT;
        let hi = t;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          const mx = origin.x + dir.x * mid;
          const mz = origin.z + dir.z * mid;
          const my = origin.y + dir.y * mid;
          if (my <= this.terrainLookup.heightAt(mx, mz)) hi = mid; else lo = mid;
        }
        const hx = origin.x + dir.x * hi;
        const hz = origin.z + dir.z * hi;
        return new THREE.Vector3(hx, this.terrainLookup.heightAt(hx, hz), hz);
      }
      prevT = t;
    }
    return null;
  }

  /** Nearest pickable object to the pointer in screen space, if close enough. */
  _screenPick(e) {
    const n = this._ndc(e);
    const candidates = [];
    const project = (v) => {
      const p = v.clone().project(this.camera);
      if (p.z > 1) return null;
      return { x: (p.x + 1) / 2 * n.w, y: (1 - p.y) / 2 * n.h };
    };

    for (const [id, entry] of this.drones) {
      const s = project(entry.model.position);
      if (s) candidates.push({ kind: 'drone', id, d: Math.hypot(s.x - n.px, s.y - n.py) });
    }
    for (const [id, jam] of this.jammers) {
      const s = project(jam.mast.position);
      if (s) candidates.push({ kind: 'jammer', id, d: Math.hypot(s.x - n.px, s.y - n.py) });
    }
    for (const [id, marker] of this.poiMarkers) {
      const s = project(marker.group.position);
      if (s) candidates.push({ kind: 'poi', id, d: Math.hypot(s.x - n.px, s.y - n.py) });
    }
    candidates.sort((a, b) => a.d - b.d);
    return candidates.length && candidates[0].d < 28 ? candidates[0] : null;
  }

  _handleClick(e) {
    const tool = this.tool || 'select';
    const placing = tool !== 'select';

    // In select mode, objects take priority over the ground
    if (!placing || tool === 'goto') {
      const pick = this._screenPick(e);
      if (pick && tool === 'select') {
        this.onPick?.(pick);
        return;
      }
    }

    const hit = this._terrainHit(e);
    if (!hit) return;
    // Scene (x, y-up, z) -> simulation (x, y, z-up)
    this.onGroundClick?.({ x: hit.x, y: hit.z, z: hit.y }, tool);
  }

  _updateHover(e) {
    if (!this.cursor) return;
    const tool = this.tool || 'select';
    if (tool === 'select') {
      this.cursor.visible = false;
      this.renderer.domElement.style.cursor = this._screenPick(e) ? 'pointer' : 'grab';
      return;
    }
    const hit = this._terrainHit(e);
    this.renderer.domElement.style.cursor = 'crosshair';
    if (!hit) { this.cursor.visible = false; return; }
    this.cursor.visible = true;
    this.cursor.position.set(hit.x, hit.y + 2, hit.z);
  }

  /** Called by the UI when the operator changes tool. */
  setTool(tool) {
    this.tool = tool;
    if (!this.cursor) return;
    const colors = {
      add_scout: 0x0b6bcb, add_relay: 0x0f8a5f, add_poi: 0xb45309,
      add_jammer: 0xdc2626, goto: 0x7c3aed,
    };
    this.cursor.material.color.setHex(colors[tool] ?? 0x1549c9);
    const radius = tool === 'add_jammer' ? 3.2 : 1;
    this.cursor.scale.setScalar(radius);
    if (tool === 'select') this.cursor.visible = false;
  }

  setSelected(id) {
    this.selectedId = id;
  }

  /**
   * Screen angle (radians, clockwise from up) of true north for the current
   * camera. Theatres whose valley runs north-south are rotated so the mission
   * axis runs across the map; the pack records that rotation, and this undoes
   * it for the compass.
   */
  northScreenAngle() {
    const rotated = (this.theatre?.rotation_k ?? 0) === 1;
    const north = rotated ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    const f = new THREE.Vector3();
    this.camera.getWorldDirection(f);
    f.y = 0;
    if (f.lengthSq() < 1e-6) return 0;
    f.normalize();
    const right = new THREE.Vector3(-f.z, 0, f.x);
    return Math.atan2(north.dot(right), north.dot(f));
  }

  _notifyCamera() {
    if (this.onCameraChange) this.onCameraChange(this.director.getStatus());
  }

  // -- terrain -------------------------------------------------------------

  /**
   * Choose a terrain tessellation the host can actually render.
   *
   * A fixed 640x640 grid is 820k triangles — nothing for a discrete GPU, but
   * it brings software rendering to its knees. Laptops do fall back to
   * software rasterisation (no driver, remote desktop, a locked-down build),
   * and a demo that renders at 0.2 fps on the one machine available is worse
   * than one that renders a slightly coarser ridgeline smoothly.
   */
  _chooseTerrainDetail() {
    const gl = this.renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));

    if (/swiftshader|software|llvmpipe|angle \(software/i.test(renderer)) {
      console.warn('[cdawn] software rendering detected — reducing terrain detail');
      return 192;
    }
    // Integrated GPUs cope fine at this density; it is the shader cost, not
    // the vertex count, that dominates on them.
    // Discrete GPUs and Apple silicon handle the full 1,025-point grid; the
    // cap is set by the heightmap, not by a guess about the hardware.
    return 1024;
  }

  /** Remove everything tied to the current terrain before loading another. */
  _clearWorld() {
    for (const extra of [this.contextMesh, this.skirtMesh]) {
      if (!extra) continue;
      this.scene.remove(extra);
      extra.geometry.dispose();
      if (extra === this.contextMesh) {
        extra.material.uniforms.uImagery.value?.dispose?.();
        extra.material.dispose();
      }
    }
    this.contextMesh = null;
    this.skirtMesh = null;
    if (this.terrainMesh) {
      this.scene.remove(this.terrainMesh);
      this.terrainMesh.geometry.dispose();
      this.terrainMesh.material.uniforms.uImagery.value?.dispose?.();
      this.terrainMesh.material.dispose();
      this.terrainMesh = null;
    }
    for (const [, entry] of this.drones) this.droneGroup.remove(entry.model);
    this.drones.clear();
    for (const [, link] of this.links) {
      this.linkGroup.remove(link.line);
      link.geometry.dispose();
      link.material.dispose();
    }
    this.links.clear();
    for (const [, marker] of this.poiMarkers) this.poiGroup.remove(marker.group);
    this.poiMarkers.clear();
    for (const [, jam] of this.jammers) this.scene.remove(jam.dome, jam.mast);
    this.jammers.clear();
    for (const [, marker] of (this.ewMarkers || [])) this.scene.remove(marker.group);
    this.ewMarkers = new Map();
    this.ewMarker = null;
    for (const [, entry] of this.interceptors) this.scene.remove(entry.model, entry.trail);
    if (this.cloudDeck) { this.scene.remove(this.cloudDeck); this.cloudDeck = null; }
    for (const [, entry] of this.enemies) this.scene.remove(entry.model, entry.trail);
    this.enemies.clear();
    for (const [, z] of this.stormCells) this.scene.remove(z.group);
    this.stormCells.clear();
    for (const [, z] of this.denialZones) this.scene.remove(z.group);
    this.denialZones.clear();
    this.interceptors.clear();
    this.effects.forEach((fx) => this.scene.remove(fx.flash, fx.smoke, fx.light));
    this.effects = [];
    for (const [, t] of this.targets) this.scene.remove(t.line, t.marker);
    this.targets.clear();
  }

  /** Build (or rebuild, on a theatre switch) the world from a terrain payload. */
  loadTerrain(payload) {
    this.ready = false;
    this._clearWorld();

    const decoded = decodeHeightmap(payload);
    this.terrainData = decoded;
    this.terrainChecksum = payload.checksum;
    this.theatre = payload.theatre || null;

    const snowLine = payload.snow_line_m ?? 1350;
    this.terrainMesh = createTerrainMesh(decoded, {
      segments: Math.min(this._chooseTerrainDetail(), decoded.resolution - 1),
      snowLine,
    });
    this.scene.add(this.terrainMesh);
    applyImagery(this.terrainMesh.material, payload.imagery_jpeg_b64, this.renderer);

    // Skirt around the playable square, then the surroundings to the horizon
    this.skirtMesh = createSkirt(decoded, this.terrainMesh.material);
    this.scene.add(this.skirtMesh);
    if (payload.context) {
      this.contextMesh = createContextMesh(payload.context, decoded, { snowLine });
      this.scene.add(this.contextMesh);
      applyImagery(this.contextMesh.material, payload.context.imagery_jpeg_b64, this.renderer);
    }

    // Height lookup shared with the camera director
    // Inside the playable square use its 5 m grid; outside it, the
    // surrounding terrain (otherwise the camera would think the ground past
    // the edge is flat and sink into the mountains around the theatre).
    const size = decoded.sizeM;
    const around = this.contextMesh?.userData.decoded;
    const aroundOrigin = this.contextMesh?.userData.origin ?? 0;
    const lookup = {
      heightAt: (x, z) => {
        if (!around || (x >= 0 && z >= 0 && x <= size && z <= size)) return sampleHeight(decoded, x, z);
        return sampleHeight(around, x - aroundOrigin, z - aroundOrigin);
      },
    };
    this.terrainLookup = lookup;

    this.director = new CameraDirector(this.camera, lookup);
    // Start the camera above this theatre's terrain, not at fixed
    // coordinates tuned for the synthetic valley (which sit underground
    // in a 4,000 m Himalayan theatre).
    this.director.position.set(size * 0.12, decoded.maxM + 500, size * 0.5);
    this.director.lookAt.set(size * 0.5, decoded.minM, size * 0.5);
    this.director.cutTo('establishing');

    this.ready = true;
    this.start();
  }

  // -- telemetry -----------------------------------------------------------

  setTelemetry(data) {
    this.telemetry = data;
    if (!this.ready || !data) return;

    this._syncDrones(data.drones || {});
    this._syncPois(data.pois || []);
    this._syncTargets(data.drones || {});
    this._syncJamming(data);
    this._syncInterceptors(data.interceptors || []);
    this._syncInjects(data.injects || {});
    this._checkStrikes(data.events || []);
    this._checkEvents(data.events || []);
  }

  // -- interceptors ----------------------------------------------------------

  _createInterceptorModel() {
    // A small fixed-wing loitering munition, built along +Z so lookAt()
    // points it down its velocity vector.
    const group = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: 0x3d4636, roughness: 0.55, metalness: 0.3 });
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.2, 10), body);
    fuselage.rotation.x = Math.PI / 2;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 10), body);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 1.35;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.34), body);
    wing.position.z = 0.25;
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.22), body);
    tail.position.z = -0.95;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.25), body);
    fin.position.set(0, 0.22, -0.95);
    const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
    strobe.position.set(0, 0.28, -0.95);
    const inner = new THREE.Group();
    inner.add(fuselage, nose, wing, tail, fin, strobe);
    group.add(inner);
    group.userData.strobe = strobe;
    return group;
  }

  _syncInterceptors(list) {
    const seen = new Set();
    const now = performance.now();
    list.forEach((state) => {
      seen.add(state.id);
      let entry = this.interceptors.get(state.id);
      if (!entry) {
        const model = this._createInterceptorModel();
        const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
          color: 0xb45309, transparent: true, opacity: 0.75,
        }));
        trail.frustumCulled = false;
        this.scene.add(model, trail);
        entry = { model, trail, trailLen: 0 };
        this.interceptors.set(state.id, entry);
        model.position.copy(toScene(state.position));
      }
      entry.state = state;
      entry.target = toScene(state.position);
      entry.receivedAt = now;
      entry.model.visible = !state.done;
      if (state.trail.length !== entry.trailLen) {
        entry.trailLen = state.trail.length;
        entry.trail.geometry.setFromPoints(state.trail.map(toScene));
      }
    });
    for (const [id, entry] of this.interceptors) {
      if (!seen.has(id)) {
        this.scene.remove(entry.model, entry.trail);
        entry.trail.geometry.dispose();
        this.interceptors.delete(id);
      }
    }
  }

  // -- live-mission injects ---------------------------------------------------

  _syncInjects(injects) {
    this._setRain(injects.rain_mm_h || 0);
    this._cloudBase = injects.cloud_base_agl || 0;
    this._syncEnemies(injects.enemies || []);
    this._syncZones(this.stormCells, injects.cells || [], (z) => this._makeStormCell(z));
    this._syncZones(this.denialZones, injects.gps_denial || [], (z) => this._makeDenialZone(z));
  }

  _syncZones(store, list, make) {
    const seen = new Set();
    list.forEach((zone) => {
      seen.add(zone.id);
      let entry = store.get(zone.id);
      if (!entry) {
        entry = make(zone);
        this.scene.add(entry.group);
        store.set(zone.id, entry);
      }
      const ground = this.terrainLookup ? this.terrainLookup.heightAt(zone.x, zone.y) : 0;
      entry.group.position.set(zone.x, ground, zone.y);
      entry.zone = zone;
    });
    for (const [id, entry] of store) {
      if (!seen.has(id)) {
        this.scene.remove(entry.group);
        store.delete(id);
      }
    }
  }

  /** A drifting downdraught cell: dark column with falling streaks. */
  _makeStormCell(zone) {
    const group = new THREE.Group();
    const r = zone.radius_m;
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.05, r * 0.8, 1500, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x2f3944, transparent: true, opacity: 0.17, side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    column.position.y = 750;
    const positions = [];
    for (let i = 0; i < 280; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * r;
      const x = Math.cos(a) * rad;
      const z = Math.sin(a) * rad;
      const y = Math.random() * 1400;
      positions.push(x, y, z, x, y - 90, z);
    }
    const streaks = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute(
        'position', new THREE.Float32BufferAttribute(positions, 3)),
      new THREE.LineBasicMaterial({ color: 0x8fa3b8, transparent: true, opacity: 0.45 }),
    );
    group.add(column, streaks);
    group.userData.streaks = streaks;
    return { group };
  }

  /** GNSS denial bubble: amber ground ring and a soft dome. */
  _makeDenialZone(zone) {
    const group = new THREE.Group();
    const r = zone.radius_m;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.05,
        side: THREE.DoubleSide, depthWrite: false }),
    );
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const h = this.terrainLookup
        ? this.terrainLookup.heightAt(zone.x + x, zone.y + z) - this.terrainLookup.heightAt(zone.x, zone.y)
        : 0;
      pts.push(new THREE.Vector3(x, h + 5, z));
    }
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 40, gapSize: 26,
        transparent: true, opacity: 0.8, depthTest: false }),
    );
    ring.computeLineDistances();
    ring.renderOrder = 8;
    group.add(dome, ring);
    return { group };
  }

  _syncEnemies(list) {
    const seen = new Set();
    const now = performance.now();
    list.forEach((state) => {
      seen.add(state.id);
      let entry = this.enemies.get(state.id);
      if (!entry) {
        const model = createDrone('HOSTILE', state.id);
        const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
          color: 0xdc2626, transparent: true, opacity: 0.6,
        }));
        trail.frustumCulled = false;
        this.scene.add(model, trail);
        entry = { model, trail, trailLen: 0 };
        this.enemies.set(state.id, entry);
        model.position.copy(toScene(state.position));
      }
      entry.state = state;
      entry.target = toScene(state.position);
      entry.receivedAt = now;
      if (state.trail.length !== entry.trailLen) {
        entry.trailLen = state.trail.length;
        entry.trail.geometry.setFromPoints(state.trail.map(toScene));
      }
    });
    for (const [id, entry] of this.enemies) {
      if (!seen.has(id)) {
        this._spawnStrike(entry.model.position.clone());
        this.scene.remove(entry.model, entry.trail);
        entry.trail.geometry.dispose();
        this.enemies.delete(id);
      }
    }
  }

  /**
   * Rain: a box of falling streaks that travels with the camera, slanted by
   * the wind. The sky and the terrain fog thicken with the rain rate, which
   * is what actually sells it — particles alone read as confetti.
   */
  /** Cloud deck the swarm has to stay under — the reason it descends. */
  _setCloudDeck(agl) {
    if (!agl || !this.terrainMesh) {
      if (this.cloudDeck) this.cloudDeck.visible = false;
      return;
    }
    if (!this.cloudDeck) {
      const size = this.terrainMesh.geometry.boundingBox
        ? 26000 : 26000;
      const deck = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size, 1, 1),
        new THREE.MeshBasicMaterial({
          color: 0x9aa4b0, transparent: true, opacity: 0.34, side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      deck.rotation.x = -Math.PI / 2;
      deck.renderOrder = 1;
      deck.frustumCulled = false;
      this.scene.add(deck);
      this.cloudDeck = deck;
    }
    this.cloudDeck.visible = true;
    // Follow the camera horizontally; sit at cloud base over local ground
    const cam = this.camera.position;
    const ground = this.terrainLookup ? this.terrainLookup.heightAt(cam.x, cam.z) : 0;
    this.cloudDeck.position.set(cam.x, ground + agl, cam.z);
  }

  _setRain(rate) {
    const wanted = Math.min(rate, 60) / 60;
    if (wanted <= 0) {
      if (this.rain) { this.rain.points.visible = false; this.rain.rate = 0; }
      this._setWeatherTone(0);
      return;
    }
    if (!this.rain) {
      const count = 9000;
      const positions = new Float32Array(count * 6);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const points = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
        color: 0xbfd0e0, transparent: true, opacity: 0.42,
      }));
      points.frustumCulled = false;
      this.scene.add(points);
      const box = 420;
      const seeds = [];
      for (let i = 0; i < count; i++) {
        seeds.push([(Math.random() - 0.5) * box, Math.random() * box, (Math.random() - 0.5) * box]);
      }
      this.rain = { points, seeds, box, rate: 0 };
    }
    this.rain.points.visible = true;
    this.rain.rate = wanted;
    this.rain.points.material.opacity = 0.25 + 0.4 * wanted;
    this._setWeatherTone(wanted);
  }

  _setWeatherTone(intensity) {
    // Grey the sky down and thicken the haze as the weather closes in
    const clear = new THREE.Color(0xc9d3dd);
    const storm = new THREE.Color(0x6b727a);
    const fog = clear.clone().lerp(storm, intensity);
    for (const mesh of [this.terrainMesh, this.contextMesh]) {
      if (!mesh) continue;
      mesh.material.uniforms.uFogColor.value.copy(fog);
      mesh.material.uniforms.uFogDensity.value = (1 / 16000) * (1 + 2.6 * intensity);
    }
    const sky = this.scene.getObjectByName('sky');
    const u = sky?.material?.uniforms;
    if (u) {
      u.uHorizon.value.copy(fog);
      u.uZenith.value.copy(new THREE.Color(0x2f5d96).lerp(new THREE.Color(0x3a4149), intensity));
      u.uMid.value.copy(new THREE.Color(0x7aa3cf).lerp(new THREE.Color(0x5a626c), intensity));
      if (u.uSunColor) {
        u.uSunColor.value.copy(new THREE.Color(0xfff4e0).lerp(new THREE.Color(0x9aa1aa), intensity));
      }
    }
    if (this.sun) this.sun.intensity = 1.35 * (1 - 0.55 * intensity);
  }

  _updateRain(dt) {
    if (!this.rain || !this.rain.rate) return;
    const { seeds, box, points } = this.rain;
    const camera = this.camera.position;
    const wind = this.telemetry?.wind?.velocity || [0, 0, 0];
    const fall = 11 + 6 * this.rain.rate;
    const array = points.geometry.attributes.position.array;
    const visible = Math.floor(seeds.length * (0.25 + 0.75 * this.rain.rate));
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      if (i >= visible) {
        array[i * 6] = array[i * 6 + 3] = camera.x;
        array[i * 6 + 1] = array[i * 6 + 4] = camera.y - 4000;
        array[i * 6 + 2] = array[i * 6 + 5] = camera.z;
        continue;
      }
      s[1] -= fall * dt;
      s[0] += wind[0] * dt * 0.35;
      s[2] += wind[1] * dt * 0.35;
      if (s[1] < -box / 2) { s[1] = box / 2; s[0] = (Math.random() - 0.5) * box; s[2] = (Math.random() - 0.5) * box; }
      if (Math.abs(s[0]) > box / 2) s[0] -= Math.sign(s[0]) * box;
      if (Math.abs(s[2]) > box / 2) s[2] -= Math.sign(s[2]) * box;
      const x = camera.x + s[0];
      const y = camera.y + s[1] - box / 4;
      const z = camera.z + s[2];
      array[i * 6] = x; array[i * 6 + 1] = y; array[i * 6 + 2] = z;
      array[i * 6 + 3] = x + wind[0] * 0.12;
      array[i * 6 + 4] = y - 3.2 - 1.6 * this.rain.rate;
      array[i * 6 + 5] = z + wind[1] * 0.12;
    }
    points.geometry.attributes.position.needsUpdate = true;
  }

  _checkStrikes(events) {
    events.forEach((e) => {
      if (e.type !== 'JAMMER_DESTROYED') return;
      const key = `${e.time}-${e.params?.jammer_id}`;
      if (this._seenStrikes.has(key)) return;
      this._seenStrikes.add(key);
      if (e.params?.position) this._spawnStrike(toScene(e.params.position));
    });
  }

  _spawnStrike(point) {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 1, depthWrite: false,
        blending: THREE.AdditiveBlending }),
    );
    flash.position.copy(point);
    const smoke = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x2b2b2b, transparent: true, opacity: 0.55, depthWrite: false }),
    );
    smoke.position.copy(point);
    const light = new THREE.PointLight(0xffa040, 40, 600, 1.2);
    light.position.copy(point).add(new THREE.Vector3(0, 10, 0));
    this.scene.add(flash, smoke, light);
    this.effects.push({ flash, smoke, light, age: 0 });
    this._strikePoint = point.clone();
    this._strikeUntil = performance.now() + 8000;
  }

  _updateEffects(dt) {
    this.effects = this.effects.filter((fx) => {
      fx.age += dt;
      const t = fx.age;
      fx.flash.scale.setScalar(4 + 70 * Math.min(t / 0.6, 1));
      fx.flash.material.opacity = Math.max(1 - t / 0.9, 0);
      fx.flash.visible = fx.flash.material.opacity > 0;
      fx.light.intensity = Math.max(40 * (1 - t / 0.7), 0);
      fx.smoke.scale.setScalar(10 + 38 * Math.min(t / 3, 1));
      fx.smoke.position.y += dt * 6;
      fx.smoke.material.opacity = 0.55 * Math.max(1 - t / 7, 0);
      if (t > 7) {
        this.scene.remove(fx.flash, fx.smoke, fx.light);
        fx.flash.geometry.dispose(); fx.smoke.geometry.dispose();
        return false;
      }
      return true;
    });
  }

  _syncDrones(drones) {
    const seen = new Set();

    Object.entries(drones).forEach(([id, state]) => {
      seen.add(id);
      let entry = this.drones.get(id);

      if (!entry) {
        const model = createDrone(state.role, id);
        this.droneGroup.add(model);
        entry = { model, state, target: toScene(state.position) };
        this.drones.set(id, entry);
        model.position.copy(entry.target);
      }

      entry.state = state;
      entry.target = toScene(state.position);

      // Heading from the simulation's yaw. Sim yaw is measured about Z from
      // +x; three's Y rotation is about the vertical with the opposite sense.
      entry.targetYaw = -(state.heading ?? 0);
    });

    // Remove aircraft that have left the telemetry stream entirely
    for (const [id, entry] of this.drones) {
      if (!seen.has(id)) {
        this.droneGroup.remove(entry.model);
        this.drones.delete(id);
      }
    }

    this._syncLinks(drones);
  }

  _syncLinks(drones) {
    const wanted = new Set();

    Object.entries(drones).forEach(([id1, d1]) => {
      if (d1.status === 'KILLED') return;
      Object.entries(d1.neighbors || {}).forEach(([id2, quality]) => {
        // One line per unordered pair
        if (id1 >= id2) return;
        const other = drones[id2];
        if (!other || other.status === 'KILLED') return;
        // Below this the link carries nothing; drawing it implies a
        // connection that does not exist.
        if (quality < 0.04) return;

        const key = `${id1}|${id2}`;
        wanted.add(key);

        let link = this.links.get(key);
        if (!link) {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            'position', new THREE.BufferAttribute(new Float32Array(6), 3),
          );
          const material = new THREE.LineBasicMaterial({
            transparent: true, depthWrite: false,
          });
          const line = new THREE.Line(geometry, material);
          line.frustumCulled = false;
          this.linkGroup.add(line);
          link = { line, geometry, material };
          this.links.set(key, link);
        }

        const a = toScene(d1.position);
        const b = toScene(other.position);
        const positions = link.geometry.attributes.position.array;
        positions[0] = a.x; positions[1] = a.y; positions[2] = a.z;
        positions[3] = b.x; positions[4] = b.y; positions[5] = b.z;
        link.geometry.attributes.position.needsUpdate = true;

        // Colour and opacity both encode quality: colour for a quick read at
        // a glance, opacity because a marginal link should look marginal.
        const color = quality > 0.85 ? LINK_GOOD
          : quality > 0.5 ? LINK_FAIR : LINK_POOR;
        link.material.color.copy(color);
        link.material.opacity = 0.22 + quality * 0.62;
      });
    });

    for (const [key, link] of this.links) {
      if (!wanted.has(key)) {
        this.linkGroup.remove(link.line);
        link.geometry.dispose();
        link.material.dispose();
        this.links.delete(key);
      }
    }
  }

  _syncPois(pois) {
    // Remove targets the operator cancelled (or that a reset cleared)
    const ids = new Set(pois.map((poi) => poi.id));
    for (const [id, marker] of this.poiMarkers) {
      if (!ids.has(id)) {
        this.poiGroup.remove(marker.group);
        this.poiMarkers.delete(id);
      }
    }

    pois.forEach((poi) => {
      let marker = this.poiMarkers.get(poi.id);

      if (!marker) {
        const group = new THREE.Group();

        // Ground ring
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(9, 12, 32),
          new THREE.MeshBasicMaterial({
            color: 0xb45309, transparent: true, opacity: 0.85,
            side: THREE.DoubleSide, depthWrite: false,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        group.add(ring);

        // Vertical beacon so the target is findable from altitude
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(1.1, 1.1, 90, 8, 1, true),
          new THREE.MeshBasicMaterial({
            color: 0xb45309, transparent: true, opacity: 0.28,
            depthWrite: false, side: THREE.DoubleSide,
          }),
        );
        beam.position.y = 45;
        group.add(beam);

        group.position.copy(toScene(poi.position));
        this.poiGroup.add(group);
        marker = { group, ring, beam };
        this.poiMarkers.set(poi.id, marker);
      }

      // Surveyed targets turn green and drop their beacon
      const color = poi.surveyed ? 0x0f8a5f : 0xb45309;
      marker.ring.material.color.setHex(color);
      marker.beam.material.color.setHex(color);
      marker.beam.material.opacity = poi.surveyed ? 0.10 : 0.28;
    });
  }

  _syncJamming(data) {
    this._syncJammers(data.rf?.jammers || []);
    this._syncEwEstimates(data.rf?.ew?.estimates || (data.rf?.ew?.estimate ? [data.rf.ew.estimate] : []));

    // The global (scripted) jammer has no location; show it around the swarm
    const jamming = data.rf?.global_jamming ?? data.rf?.jamming_active;
    this.jammingDome.visible = Boolean(jamming) && !(data.rf?.jammers || []).length;

    if (!this.jammingDome.visible) return;

    const live = Object.values(data.drones || {}).filter((d) => d.status !== 'KILLED');
    if (!live.length) return;

    const centroid = live.reduce(
      (acc, d) => {
        acc[0] += d.position[0] / live.length;
        acc[1] += d.position[1] / live.length;
        acc[2] += d.position[2] / live.length;
        return acc;
      },
      [0, 0, 0],
    );

    this.jammingDome.position.copy(toScene(centroid));
    this.jammingDome.scale.setScalar(680);
    this.jammingDome.material.uniforms.uOpacity.value = 0.9;
  }

  _syncJammers(list) {
    const seen = new Set();
    list.forEach((jammer) => {
      seen.add(jammer.id);
      let entry = this.jammers.get(jammer.id);
      if (!entry) {
        const dome = new THREE.Mesh(
          this.jammingDome.geometry,
          this.jammingDome.material.clone(),
        );
        dome.frustumCulled = false;
        dome.material.uniforms.uOpacity.value = 0.9;

        const mast = new THREE.Group();
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(1.4, 2.4, 34, 10),
          new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 }),
        );
        pole.position.y = 17;
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(4.5, 16, 12),
          new THREE.MeshBasicMaterial({ color: 0xef4444 }),
        );
        head.position.y = 36;
        mast.add(pole, head);

        this.scene.add(dome, mast);
        entry = { dome, mast, head };
        this.jammers.set(jammer.id, entry);
      }
      const p = toScene(jammer.position);
      entry.mast.position.copy(p);
      entry.dome.position.copy(p);
      entry.dome.scale.setScalar(Math.max(jammer.radius_m, 60));
    });

    for (const [id, entry] of this.jammers) {
      if (!seen.has(id)) {
        this.scene.remove(entry.dome, entry.mast);
        entry.dome.material.dispose();
        this.jammers.delete(id);
      }
    }
  }

  /**
   * Where the swarm THINKS the jammer is: an amber uncertainty ring draped
   * on the terrain, a crosshair and a mast line. Drawn from the EW
   * geolocation only, so its offset from the real (red) jammer is the
   * estimate's actual error.
   */
  _syncEwEstimates(list) {
    if (!this.ewMarkers) this.ewMarkers = new Map();
    const seen = new Set();
    list.forEach((est) => { seen.add(est.id || 'EMIT'); this._syncEwEstimate(est, est.id || 'EMIT'); });
    for (const [id, marker] of this.ewMarkers) {
      if (!seen.has(id)) {
        this.scene.remove(marker.group);
        this.ewMarkers.delete(id);
      }
    }
  }

  _syncEwEstimate(est, id) {
    if (!this.ewMarkers) this.ewMarkers = new Map();
    if (!est || !this.terrainLookup) return;
    this.ewMarker = this.ewMarkers.get(id);
    if (!this.ewMarker) {
      const mat = () => new THREE.LineDashedMaterial({
        color: 0xf59e0b, dashSize: 14, gapSize: 9, depthTest: false, transparent: true, opacity: 0.95,
      });
      const ring = new THREE.LineLoop(new THREE.BufferGeometry(), mat());
      const cross = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
        color: 0xf59e0b, depthTest: false,
      }));
      const mast = new THREE.Line(new THREE.BufferGeometry(), mat());
      [ring, cross, mast].forEach((o) => { o.renderOrder = 9; o.frustumCulled = false; });
      const group = new THREE.Group();
      group.add(ring, cross, mast);
      this.scene.add(group);
      this.ewMarker = { group, ring, cross, mast, key: '' };
      this.ewMarkers.set(id, this.ewMarker);
    }
    const m = this.ewMarker;
    m.group.visible = true;
    const key = `${est.x.toFixed(0)}|${est.y.toFixed(0)}|${est.radius_m.toFixed(0)}`;
    if (key === m.key) return;
    m.key = key;

    const h = (x, z) => this.terrainLookup.heightAt(x, z) + 4;
    const pts = [];
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const x = est.x + Math.cos(a) * est.radius_m;
      const z = est.y + Math.sin(a) * est.radius_m;
      pts.push(new THREE.Vector3(x, h(x, z), z));
    }
    m.ring.geometry.setFromPoints(pts);
    m.ring.computeLineDistances();

    const c = 40;
    const g = h(est.x, est.y);
    m.cross.geometry.setFromPoints([
      new THREE.Vector3(est.x - c, h(est.x - c, est.y), est.y), new THREE.Vector3(est.x + c, h(est.x + c, est.y), est.y),
      new THREE.Vector3(est.x, h(est.x, est.y - c), est.y - c), new THREE.Vector3(est.x, h(est.x, est.y + c), est.y + c),
    ]);
    m.mast.geometry.setFromPoints([new THREE.Vector3(est.x, g, est.y), new THREE.Vector3(est.x, g + 160, est.y)]);
    m.mast.computeLineDistances();
  }

  /** Line + marker from each operator-commanded aircraft to its target. */
  _syncTargets(drones) {
    const wanted = new Set();
    Object.entries(drones).forEach(([id, d]) => {
      if (!d.manual_target || d.status === 'KILLED') return;
      wanted.add(id);
      let entry = this.targets.get(id);
      if (!entry) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
        const line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
          color: 0x7c3aed, dashSize: 14, gapSize: 9, transparent: true, opacity: 0.9,
        }));
        line.frustumCulled = false;
        const marker = new THREE.Mesh(
          new THREE.RingGeometry(10, 14, 32),
          new THREE.MeshBasicMaterial({
            color: 0x7c3aed, transparent: true, opacity: 0.9,
            side: THREE.DoubleSide, depthTest: false,
          }),
        );
        marker.rotation.x = -Math.PI / 2;
        this.scene.add(line, marker);
        entry = { line, marker };
        this.targets.set(id, entry);
      }
      const a = toScene(d.position);
      const b = toScene(d.manual_target);
      const pos = entry.line.geometry.attributes.position.array;
      pos[0] = a.x; pos[1] = a.y; pos[2] = a.z;
      pos[3] = b.x; pos[4] = b.y; pos[5] = b.z;
      entry.line.geometry.attributes.position.needsUpdate = true;
      entry.line.computeLineDistances();
      const ground = this.terrainLookup ? this.terrainLookup.heightAt(b.x, b.z) : b.y;
      entry.marker.position.set(b.x, ground + 2, b.z);
    });
    for (const [id, entry] of this.targets) {
      if (!wanted.has(id)) {
        this.scene.remove(entry.line, entry.marker);
        this.targets.delete(id);
      }
    }
  }

  _checkEvents(events) {
    if (!events.length || !this.director) return;
    const latest = events[events.length - 1];
    const signature = `${latest.time}-${latest.type}`;
    if (signature !== this._lastEventSignature) {
      this._lastEventSignature = signature;
      this.director.onEvent(latest);
      this._notifyCamera();
    }
  }

  // -- camera control (from the UI) ---------------------------------------

  setShot(shotName, subjectId = null) {
    if (!this.director) return;
    this.director.manual = false;
    this.director.enabled = true;
    this.director.cutTo(shotName, subjectId);
    this._notifyCamera();
  }

  resumeAuto() {
    if (!this.director) return;
    this.director.resume();
    this._notifyCamera();
  }

  focusDrone(id) {
    if (!this.director) return;
    this.director.manual = false;
    this.director.enabled = true;
    this.director.cutTo('low_orbit', id, 14);
    this._notifyCamera();
  }

  // -- loop ----------------------------------------------------------------

  start() {
    if (this._running) return;
    this._running = true;
    this.clock.start();
    this._animate();
  }

  _animate = () => {
    if (this.disposed) return;
    this._frame = requestAnimationFrame(this._animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const data = this.telemetry;

    // Interpolate aircraft toward their latest telemetry position.
    //
    // Telemetry arrives at 20 Hz while we render at 60; snapping to each new
    // sample would visibly stutter. Damping toward the target reconstructs
    // smooth motion between packets and also masks a dropped frame.
    for (const [, entry] of this.drones) {
      const model = entry.model;
      const lambda = 9;
      const alpha = 1 - Math.exp(-lambda * dt);

      model.position.lerp(entry.target, alpha);

      if (entry.targetYaw !== undefined) {
        let delta = entry.targetYaw - model.rotation.y;
        // Take the short way round
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        model.rotation.y += delta * alpha;
      }

      // Bank into the direction of travel — a multirotor that translates is
      // tilted, and a level model sliding sideways looks immediately wrong.
      const v = entry.state?.velocity;
      if (v) {
        const speed = Math.hypot(v[0], v[1]);
        const tilt = Math.min(speed / 22, 1) * 0.34;
        const heading = model.rotation.y;
        const vx = v[0] * Math.cos(heading) - v[1] * Math.sin(heading);
        const vy = v[0] * Math.sin(heading) + v[1] * Math.cos(heading);
        const norm = Math.max(Math.hypot(vx, vy), 1e-3);
        model.rotation.x += ((vy / norm) * tilt - model.rotation.x) * alpha;
        model.rotation.z += ((-vx / norm) * tilt - model.rotation.z) * alpha;
      }

      // Keep the aircraft legible: scale up with camera distance so it never
      // shrinks below a few pixels on a wide establishing shot.
      const distance = this.camera.position.distanceTo(model.position);
      const scale = THREE.MathUtils.clamp(distance / 220, 1, 9);

      model.update(dt, entry.state || {}, scale);
    }

    // Interceptors: extrapolate along velocity between 20 Hz packets (at
    // 55 m/s a plain lerp would trail the real position by tens of metres)
    const subjects = { ...(data?.drones || {}) };
    const nowMs = performance.now();
    for (const [id, entry] of this.interceptors) {
      if (!entry.state || entry.state.done) continue;
      const v = entry.state.velocity;
      const ahead = Math.min((nowMs - entry.receivedAt) / 1000, 0.12);
      const predicted = entry.target.clone().add(new THREE.Vector3(v[0], v[2], v[1]).multiplyScalar(ahead));
      entry.model.position.lerp(predicted, 1 - Math.exp(-20 * dt));
      const dir = new THREE.Vector3(v[0], v[2], v[1]);
      if (dir.lengthSq() > 1) entry.model.lookAt(entry.model.position.clone().add(dir));
      const distance = this.camera.position.distanceTo(entry.model.position);
      entry.model.scale.setScalar(THREE.MathUtils.clamp(distance / 120, 1, 14) * 1.6);
      entry.model.userData.strobe.visible = Math.floor(nowMs / 250) % 2 === 0;
      const p = entry.model.position;
      subjects[id] = { position: [p.x, p.z, p.y], velocity: v, role: 'INTERCEPTOR', status: 'ACTIVE' };
    }
    // Hostile UAVs move as fast as our own aircraft: extrapolate between packets
    for (const [, entry] of this.enemies) {
      if (!entry.state) continue;
      const v = entry.state.velocity;
      const ahead = Math.min((nowMs - entry.receivedAt) / 1000, 0.12);
      const predicted = entry.target.clone().add(new THREE.Vector3(v[0], v[2], v[1]).multiplyScalar(ahead));
      entry.model.position.lerp(predicted, 1 - Math.exp(-16 * dt));
      entry.model.rotation.y = -(entry.state.heading ?? 0);
      const distance = this.camera.position.distanceTo(entry.model.position);
      entry.model.update?.(dt, { status: 'ACTIVE' },
        THREE.MathUtils.clamp(distance / 200, 1, 10));
    }
    for (const [, cell] of this.stormCells) {
      const streaks = cell.group.userData.streaks;
      if (streaks) streaks.position.y = (streaks.position.y - dt * 26 + 1400) % 1400 - 700;
    }
    this._updateRain(dt);
    this._setCloudDeck(this._cloudBase);
    this._updateEffects(dt);
    if (this._strikePoint && nowMs < this._strikeUntil) {
      const p = this._strikePoint;
      subjects.STRIKE = { position: [p.x, p.z, p.y], velocity: [0, 0, 0], role: 'INTERCEPTOR', status: 'ACTIVE' };
    }

    if (this.director) {
      this.director.update(dt, subjects, data?.pois || [], null);
    }

    // Shadow frustum follows the camera so the limited shadow map is spent
    // where the viewer is looking rather than on the whole 4 km massif.
    if (this.terrainMesh) {
      const focus = this.director ? this.director.lookAt : this.camera.position;
      this.sun.position.copy(focus).add(this.sunDirection.clone().multiplyScalar(2200));
      this.sun.target.position.copy(focus);
      this.sun.target.updateMatrixWorld();

      this.terrainMesh.material.uniforms.uCameraPos.value.copy(this.camera.position);
      if (this.contextMesh) {
        this.contextMesh.material.uniforms.uCameraPos.value.copy(this.camera.position);
      }
    }

    if (this.jammingDome.visible) {
      this.jammingDome.material.uniforms.uTime.value += dt;
    }
    for (const [, jam] of this.jammers) {
      jam.dome.material.uniforms.uTime.value += dt;
      jam.head.scale.setScalar(1 + 0.25 * Math.sin(performance.now() / 180));
    }

    const selected = this.selectedId && this.drones.get(this.selectedId);
    this.halo.visible = Boolean(selected);
    if (selected) {
      const scale = selected.model.scale.x;
      this.halo.position.copy(selected.model.position);
      this.halo.scale.setScalar(scale * (1 + 0.08 * Math.sin(performance.now() / 220)));
    }

    // Keep the sky dome centred on the camera so no theatre, however large
    // or high, ever pokes through its edge.
    const sky = this.scene.getObjectByName('sky');
    if (sky) sky.position.copy(this.camera.position);

    this.renderer.render(this.scene, this.camera);
  };

  resize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.disposed = true;
    this._running = false;
    if (this._frame) cancelAnimationFrame(this._frame);
    if (this._resizeObserver) this._resizeObserver.disconnect();

    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
