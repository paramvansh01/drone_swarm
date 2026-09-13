import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Theatre of operations selector — a zoomable globe.
 *
 * Imagery sharpens as the operator zooms:
 *   1. the whole Earth           NASA Blue Marble, 5400 x 2700
 *   2. streamed map tiles        Sentinel-2 cloudless, zoom level chosen from
 *                                the camera altitude (cached on the node)
 *   3. each theatre's area       high-resolution imagery of the ~36 km around it
 *
 * Each theatre's playable 5 km square is outlined on the imagery. Scrolling
 * in reveals the outlines; clicking an outlined area deploys the simulation
 * there. Tiles are cached on the node (pre-fetch them with
 * `python tools/build_terrain_packs.py tiles`), so the globe works on an
 * offline venue network.
 */

const R = 1;
const MIN_ALT = 0.0016;     // ≈ 10 km above the surface
const MAX_ALT = 3.2;
const DEPLOY_ALT = 0.05;    // ≈ 320 km: below this the outlines are visible and clicking deploys
const ARRIVE_ALT = 0.0058;  // fly-in stop: the sharp 36 km patch fills the view

function latLonToVector(lat, lon, r = R) {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

// ---- slippy-map tiles (Web Mercator) ----------------------------------------
const TILE_MIN_Z = 4;
const TILE_MAX_Z = 14;
const TILE_ALT = 0.9;         // tiles stream in below ≈ 5700 km
const TILE_CACHE = 420;       // GPU-resident tiles kept for panning back
const EARTH_CIRC = 40075016;

const tileLat = (y, z) => THREE.MathUtils.radToDeg(Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))));
const tileBounds = (z, x, y) => [
  tileLat(y + 1, z), tileLat(y, z), (x / 2 ** z) * 360 - 180, ((x + 1) / 2 ** z) * 360 - 180,
];
function latLonToTile(lat, lon, z) {
  const n = 2 ** z;
  const r = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(lat, -85, 85));
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n,
  };
}
function vectorToLatLon(v) {
  const r = v.length();
  const lat = 90 - THREE.MathUtils.radToDeg(Math.acos(v.y / r));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(v.z, -v.x)) - 180;
  return { lat, lon: ((lon + 540) % 360) - 180 };
}

const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + THREE.MathUtils.degToRad(lat) / 2));

/**
 * A patch of sphere covering [south, north] x [west, east], with texture
 * coordinates linear in Web Mercator — matching how the map tiles were cut,
 * so no reprojection of the imagery is needed.
 */
function sphericalPatch(bounds, radius, segments = 48) {
  const [south, north, west, east] = bounds;
  const positions = [];
  const uvs = [];
  const indices = [];
  const m0 = mercY(south);
  const m1 = mercY(north);
  for (let j = 0; j <= segments; j++) {
    const lat = south + (north - south) * (j / segments);
    for (let i = 0; i <= segments; i++) {
      const lon = west + (east - west) * (i / segments);
      const p = latLonToVector(lat, lon, radius);
      positions.push(p.x, p.y, p.z);
      uvs.push(i / segments, (mercY(lat) - m0) / (m1 - m0));
    }
  }
  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + 1;
      const c = a + segments + 1;
      const d = c + 1;
      // Counter-clockwise seen from outside the globe (outward-facing)
      indices.push(a, b, c, b, d, c);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function outline(bounds, radius, color, opacity = 1) {
  const [s, n, w, e] = bounds;
  const pts = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) pts.push(latLonToVector(s, w + (e - w) * i / steps, radius));
  for (let i = 0; i <= steps; i++) pts.push(latLonToVector(s + (n - s) * i / steps, e, radius));
  for (let i = 0; i <= steps; i++) pts.push(latLonToVector(n, e - (e - w) * i / steps, radius));
  for (let i = 0; i <= steps; i++) pts.push(latLonToVector(n - (n - s) * i / steps, w, radius));
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthTest: false }),
  );
  line.renderOrder = 5;
  return line;
}

function orientationFor(lat, lon) {
  const p = latLonToVector(lat, lon);
  return { spin: -Math.atan2(p.x, p.z), tilt: THREE.MathUtils.degToRad(lat) };
}

/** Stack tags that would overlap (the Ladakh theatres sit close together). */
function declutter(items, rowHeight = 30, width = 170) {
  const placed = [];
  [...items].sort((a, b) => a.y - b.y).forEach((item) => {
    let ly = item.y;
    for (const other of placed) {
      if (Math.abs(other.x - item.x) < width && Math.abs(other.ly - ly) < rowHeight) ly = other.ly + rowHeight;
    }
    placed.push({ ...item, ly });
  });
  return placed;
}

const fmtCoord = (lat, lon) => (lat == null ? '—'
  : `${Math.abs(lat).toFixed(3)}°${lat >= 0 ? 'N' : 'S'}  ${Math.abs(lon).toFixed(3)}°${lon >= 0 ? 'E' : 'W'}`);

export default function TheatreSelector({ open, onClose, currentId, canClose }) {
  const mountRef = useRef(null);
  const apiRef = useRef({});
  const [theatres, setTheatres] = useState([]);
  const [hover, setHover] = useState(null);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [altitudeKm, setAltitudeKm] = useState(null);

  useEffect(() => {
    if (!open) return;
    fetch('/api/theatres', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => setTheatres(d.theatres || []))
      .catch(() => setError('Simulation node unreachable'));
  }, [open]);

  // ---- globe scene ----------------------------------------------------------
  useEffect(() => {
    if (!open || !mountRef.current) return undefined;
    const mount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x05070a);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.0002, 50);

    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    tilt.add(spin);
    scene.add(tilt);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const loadTex = (url, onLoad) => loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      onLoad?.(tex);
    });

    // Level 1 — the Earth
    const earthMat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
    loadTex('/earth_hd.jpg', (t) => { earthMat.map = t; earthMat.needsUpdate = true; });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 256, 160), earthMat);
    spin.add(earth);

    // Stars: a sparse field behind the globe
    const starPos = [];
    for (let i = 0; i < 1800; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 10);
      starPos.push(v.x, v.y, v.z);
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3)),
      new THREE.PointsMaterial({ color: 0xb8c4d4, size: 0.05, sizeAttenuation: true }),
    );
    scene.add(stars);

    // Atmosphere rim
    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.035, 96, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, transparent: true, depthWrite: false,
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vN; void main(){ float i = pow(clamp(0.75 - dot(vN, vec3(0,0,1.0)), 0.0, 1.0), 3.2); gl_FragColor = vec4(0.45,0.66,0.98,1.0) * i * 1.4; }',
      }),
    );
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    const sun = new THREE.DirectionalLight(0xffffff, 1.35);
    sun.position.set(2.5, 1.5, 4);
    scene.add(sun);

    // Level 2 — the Himalayan arc
    const regional = [];
    fetch('/himalaya.json').then((r) => r.json()).then((b) => {
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false, side: THREE.DoubleSide });
      loadTex('/himalaya.jpg', (t) => { mat.map = t; mat.needsUpdate = true; });
      const mesh = new THREE.Mesh(sphericalPatch([b.south, b.north, b.west, b.east], R, 96), mat);
      mesh.renderOrder = 1;
      spin.add(mesh);
      regional.push(mesh);
    }).catch(() => {});

    // Level 2b — streamed satellite tiles. The zoom level follows the camera
    // so a screen pixel always maps to roughly one image pixel; the two
    // coarser levels stay underneath so nothing flashes while tiles arrive.
    const tiles = new Map();   // key -> { key, z, mesh, mat, state, opacity, used }
    const tileQueue = [];
    let tileInflight = 0;
    let wantedTiles = new Set();
    let tileFrame = 0;

    const pumpTiles = () => {
      tileQueue.sort((a, b) => a.z - b.z || a.dist - b.dist);
      while (tileInflight < 8 && tileQueue.length) {
        const tile = tileQueue.shift();
        if (!wantedTiles.has(tile.key)) { tiles.delete(tile.key); continue; }
        tileInflight += 1;
        tile.state = 'loading';
        loader.load(`/api/tiles/${tile.key}.jpg`, (tex) => {
          tileInflight -= 1;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = maxAniso;
          tex.generateMipmaps = true;
          tile.mat = new THREE.MeshBasicMaterial({
            map: tex, transparent: true, opacity: 0, depthTest: false, side: THREE.DoubleSide,
          });
          const [z, x, y] = tile.key.split('/').map(Number);
          tile.mesh = new THREE.Mesh(sphericalPatch(tileBounds(z, x, y), R, z <= 6 ? 16 : 6), tile.mat);
          tile.mesh.renderOrder = 2.2 + z * 0.01;   // above the mid ring, below the Esri close-up
          tile.mesh.visible = false;
          spin.add(tile.mesh);
          tile.state = 'ready';
          pumpTiles();
        }, undefined, () => {
          tileInflight -= 1;
          tile.state = 'failed';
          pumpTiles();
        });
      }
    };

    const disposeTile = (tile) => {
      if (tile.mesh) {
        spin.remove(tile.mesh);
        tile.mesh.geometry.dispose();
        tile.mat.map?.dispose();
        tile.mat.dispose();
      }
      tiles.delete(tile.key);
    };

    const updateTiles = (dtFade) => {
      tileFrame = (tileFrame + 1) % 4;
      const fade = THREE.MathUtils.clamp((TILE_ALT - view.alt) / 0.3, 0, 1);
      if (!tileFrame) {
        const wanted = new Set();
        if (fade > 0) {
          tilt.updateMatrixWorld(true);
          const { lat, lon } = vectorToLatLon(spin.worldToLocal(new THREE.Vector3(0, 0, R)));
          const viewH = 2 * view.alt * 6371000 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
          const mpp = viewH / mount.clientHeight / Math.min(window.devicePixelRatio, 1.5);
          const cosLat = Math.max(Math.cos(THREE.MathUtils.degToRad(lat)), 0.05);
          const top = THREE.MathUtils.clamp(
            Math.round(Math.log2((EARTH_CIRC * cosLat) / (256 * mpp))), TILE_MIN_Z, TILE_MAX_Z,
          );
          for (let z = top; z >= Math.max(TILE_MIN_Z, top - 2); z--) {
            const n = 2 ** z;
            const tileM = (EARTH_CIRC * cosLat) / n;
            // Exactly the tiles under the view footprint (+15% for curvature)
            const hx = Math.min(((viewH * camera.aspect) / 2 / tileM) * 1.15, 5);
            const hy = Math.min((viewH / 2 / tileM) * 1.15, 4);
            const c = latLonToTile(lat, lon, z);
            for (let ty = Math.floor(c.y - hy); ty <= Math.floor(c.y + hy); ty++) {
              const y = ty;
              const dy = ty - Math.floor(c.y);
              if (y < 0 || y >= n) continue;
              for (let tx = Math.floor(c.x - hx); tx <= Math.floor(c.x + hx); tx++) {
                const dx = tx - Math.floor(c.x);
                const x = ((tx % n) + n) % n;
                const key = `${z}/${x}/${y}`;
                wanted.add(key);
                let tile = tiles.get(key);
                if (!tile) {
                  tile = { key, z, state: 'queued', opacity: 0, used: 0, dist: dx * dx + dy * dy };
                  tiles.set(key, tile);
                  tileQueue.push(tile);
                }
                tile.used = performance.now();
                if (tile.state === 'queued') tile.dist = dx * dx + dy * dy;
              }
            }
          }
        }
        wantedTiles = wanted;
        // Drop requests the camera has already moved past
        for (let i = tileQueue.length - 1; i >= 0; i--) {
          if (!wanted.has(tileQueue[i].key)) { tiles.delete(tileQueue[i].key); tileQueue.splice(i, 1); }
        }
        pumpTiles();
        if (tiles.size > TILE_CACHE) {
          [...tiles.values()]
            .filter((t) => !wanted.has(t.key) && t.state !== 'loading')
            .sort((a, b) => a.used - b.used)
            .slice(0, tiles.size - TILE_CACHE)
            .forEach(disposeTile);
        }
      }
      tiles.forEach((tile) => {
        if (tile.state !== 'ready') return;
        const target = wantedTiles.has(tile.key) ? fade : 0;
        tile.opacity += (target - tile.opacity) * dtFade;
        tile.mat.opacity = tile.opacity;
        tile.mesh.visible = tile.opacity > 0.01;
      });
    };

    // Level 3 — theatre patches and outlines (built when the list arrives)
    const areas = new Map();   // id -> { patch, fill, box, ring, theatre, loaded }

    const buildAreas = (list) => {
      list.filter((t) => t.lat != null && t.inner_bounds).forEach((t) => {
        if (areas.has(t.id)) return;
        const entry = { theatre: t, loaded: false, midLoaded: false };
        // Mid ring (~160 km, 135 m imagery) bridges the regional mosaic and
        // the close-in patch, so there is no blocky zone as you descend.
        if (t.has_mid && t.mid_bounds) {
          entry.midMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false, side: THREE.DoubleSide });
          entry.mid = new THREE.Mesh(sphericalPatch(t.mid_bounds, R, 48), entry.midMat);
          entry.mid.renderOrder = 2;
          spin.add(entry.mid);
        }
        if (t.has_patch && t.context_bounds) {
          entry.patchMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false, side: THREE.DoubleSide });
          entry.patch = new THREE.Mesh(sphericalPatch(t.context_bounds, R, 48), entry.patchMat);
          entry.patch.renderOrder = 3;
          spin.add(entry.patch);
          entry.ring = outline(t.context_bounds, R, 0xffffff, 0.25);
          spin.add(entry.ring);
        }
        entry.fill = new THREE.Mesh(
          sphericalPatch(t.inner_bounds, R, 8),
          new THREE.MeshBasicMaterial({
            color: 0xffb020, transparent: true, opacity: 0.12, depthTest: false, side: THREE.DoubleSide,
          }),
        );
        entry.fill.renderOrder = 4;
        entry.fill.userData.id = t.id;
        spin.add(entry.fill);
        entry.box = outline(t.inner_bounds, R, 0xffb020, 1);
        spin.add(entry.box);
        // A larger invisible hit target so an area can be picked from orbit
        entry.hit = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 10, 8),
          new THREE.MeshBasicMaterial({ visible: false }),
        );
        entry.hit.position.copy(latLonToVector(t.lat, t.lon, R));
        entry.hit.userData.id = t.id;
        spin.add(entry.hit);
        areas.set(t.id, entry);
      });
    };

    // ---- camera state ------------------------------------------------------
    const view = { spin: 0, tilt: 0, alt: 2.6, tSpin: 0, tTilt: 0, tAlt: 2.6 };
    const start = orientationFor(29, 82);
    view.spin = view.tSpin = start.spin;
    view.tilt = view.tTilt = start.tilt;

    const flyTo = (lat, lon, alt) => {
      const o = orientationFor(lat, lon);
      let d = o.spin - view.tSpin;
      d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      view.tSpin += d;
      view.tTilt = o.tilt;
      if (alt != null) view.tAlt = alt;
    };

    // ---- input ---------------------------------------------------------------
    const el = renderer.domElement;
    let pressed = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    const raycaster = new THREE.Raycaster();

    const pick = (e) => {
      const rect = el.getBoundingClientRect();
      const ndc = { x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: -((e.clientY - rect.top) / rect.height) * 2 + 1 };
      raycaster.setFromCamera(ndc, camera);
      const targets = [];
      areas.forEach((a) => { targets.push(a.fill); if (view.alt > DEPLOY_ALT) targets.push(a.hit); });
      const hits = raycaster.intersectObjects(targets, false);
      // Ignore hits on the far side of the globe
      const earthHit = raycaster.intersectObject(earth, false)[0];
      const hit = hits.find((h) => !earthHit || h.distance <= earthHit.distance + 0.001);
      return hit ? hit.object.userData.id : null;
    };

    el.addEventListener('pointerdown', (e) => { pressed = true; moved = false; lastX = e.clientX; lastY = e.clientY; });
    const onMove = (e) => {
      if (pressed) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        // Rotation slows as you descend, so close-in panning stays controllable
        const rate = 0.0022 * Math.min(view.alt, 2.2) + 0.00001;
        view.tSpin += dx * rate;
        view.tTilt = THREE.MathUtils.clamp(view.tTilt + dy * rate, -1.3, 1.3);
        lastX = e.clientX; lastY = e.clientY;
      } else {
        const id = pick(e);
        el.style.cursor = id ? 'pointer' : 'grab';
        apiRef.current.onHover?.(id);
      }
    };
    const onUp = (e) => {
      if (pressed && !moved) {
        const id = pick(e);
        if (id) apiRef.current.onAreaClick?.(id, view.alt);
      }
      pressed = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      view.tAlt = THREE.MathUtils.clamp(view.tAlt * Math.exp(e.deltaY * 0.0016), MIN_ALT, MAX_ALT);
    }, { passive: false });

    // ---- loop ----------------------------------------------------------------
    let frame;
    const clock = new THREE.Clock();
    let labelTick = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const k = 1 - Math.exp(-4.5 * dt);
      view.spin += (view.tSpin - view.spin) * k;
      view.tilt += (view.tTilt - view.tilt) * k;
      // Zoom eases in log space so the descent feels even at every altitude
      view.alt = Math.exp(Math.log(view.alt) + (Math.log(view.tAlt) - Math.log(view.alt)) * k);

      spin.rotation.y = view.spin;
      tilt.rotation.x = view.tilt;
      camera.position.set(0, 0, R + view.alt);
      camera.lookAt(0, 0, 0);

      updateTiles(1 - Math.exp(-6 * dt));

      // Fade the finer imagery in as the camera descends
      const regionalOpacity = THREE.MathUtils.clamp((1.4 - view.alt) / 0.9, 0, 1);
      regional.forEach((m) => { m.material.opacity = regionalOpacity; m.visible = regionalOpacity > 0.01; });

      const camDir = camera.position.clone().normalize();
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const out = [];
      areas.forEach((a, id) => {
        const centre = latLonToVector(a.theatre.lat, a.theatre.lon, R);
        const world = centre.clone().applyMatrix4(spin.matrixWorld);
        const facing = world.clone().normalize().dot(camDir) > 0.2;

        if (a.mid) {
          const mop = THREE.MathUtils.clamp((0.16 - view.alt) / 0.1, 0, 1) * (facing ? 1 : 0);
          a.midMat.opacity = mop;
          a.mid.visible = mop > 0.01;
          if (!a.midLoaded && view.alt < 0.4) {
            a.midLoaded = true;
            loadTex(`/api/theatre/${id}/patch.jpg?level=mid`, (t) => { a.midMat.map = t; a.midMat.needsUpdate = true; });
          }
        }
        if (a.patch) {
          const op = THREE.MathUtils.clamp((0.03 - view.alt) / 0.02, 0, 1) * (facing ? 1 : 0);
          a.patchMat.opacity = op;
          a.patch.visible = op > 0.01;
          a.ring.visible = op > 0.05;
          // Load the high-resolution patch only when it is about to be seen
          if (!a.loaded && view.alt < 0.1) {
            a.loaded = true;
            loadTex(`/api/theatre/${id}/patch.jpg`, (t) => { a.patchMat.map = t; a.patchMat.needsUpdate = true; });
          }
        }
        const highlighted = apiRef.current.hoverId === id || apiRef.current.focusId === id;
        const showBox = facing && view.alt < 0.12;
        a.fill.material.opacity = showBox ? (highlighted ? 0.32 : 0.12) : 0;
        a.box.visible = showBox;
        a.box.material.color.setHex(id === apiRef.current.currentId ? 0x7ee2a8 : 0xffb020);

        const s = world.clone().project(camera);
        out.push({ id, x: (s.x + 1) / 2 * w, y: (1 - s.y) / 2 * h, visible: facing && s.z < 1 });
      });

      labelTick = (labelTick + 1) % 3;
      if (!labelTick) apiRef.current.pushFrame?.(out, view.alt);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    apiRef.current = { ...apiRef.current, flyTo, buildAreas, view };
    window.__cdawnGlobe = { areas, view, regional, rim, earth, stars, camera, renderer, tiles };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) {
          o.material.map?.dispose?.();
          o.material.dispose?.();
        }
      });
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
    };
  }, [open]);

  // Wire React state into the imperative scene
  useEffect(() => { apiRef.current.buildAreas?.(theatres); }, [theatres, open]);
  useEffect(() => {
    apiRef.current.currentId = currentId;
    apiRef.current.hoverId = hover;
    apiRef.current.focusId = focused;
  }, [currentId, hover, focused]);

  const deploy = async (theatre) => {
    if (loading || !theatre) return;
    setError(null);
    setLoading(theatre.id);
    try {
      const response = await fetch(`/api/theatre/${theatre.id}`, { method: 'POST' });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || 'Could not load theatre');
      setTimeout(() => { setLoading(null); onClose(); }, 600);
    } catch (err) {
      setLoading(null);
      setError(String(err.message || err));
    }
  };

  const zoomInto = (theatre) => {
    setFocused(theatre.id);
    if (theatre.lat != null) apiRef.current.flyTo?.(theatre.lat, theatre.lon, ARRIVE_ALT);
  };

  apiRef.current.onHover = (id) => setHover(id);
  apiRef.current.onAreaClick = (id, alt) => {
    const theatre = theatres.find((t) => t.id === id);
    if (!theatre) return;
    if (alt <= DEPLOY_ALT) deploy(theatre);
    else zoomInto(theatre);
  };
  apiRef.current.pushFrame = (out, alt) => {
    setLabels(out);
    setAltitudeKm(alt * 6371);
  };

  if (!open) return null;

  const detail = theatres.find((t) => t.id === (hover || focused || currentId));
  const close = altitudeKm != null && altitudeKm / 6371 <= DEPLOY_ALT;

  return (
    <div className="theatre">
      <div className="theatre__globe" ref={mountRef}>
        {declutter(labels.filter((l) => l.visible)).map((l) => {
          const t = theatres.find((x) => x.id === l.id);
          if (!t) return null;
          return (
            <div
              key={l.id}
              className={`globe-tag ${close ? 'near' : 'far'} ${l.id === currentId ? 'current' : ''} ${l.id === hover ? 'hover' : ''}`}
              style={{ left: l.x, top: l.ly }}
            >
              <span className="globe-tag__name">{t.name}</span>
              {close && <span className="globe-tag__hint">{loading === t.id ? 'deploying…' : 'click area to deploy'}</span>}
            </div>
          );
        })}

        <div className="globe-hud">
          <span>ALT {altitudeKm == null ? '—' : altitudeKm >= 1000 ? `${(altitudeKm / 1000).toFixed(1)}k` : altitudeKm.toFixed(0)} km</span>
          <span>{close ? 'Click an outlined area to deploy' : 'Scroll to zoom · drag to rotate · click an area to fly in'}</span>
        </div>

        <div className="theatre__credit">
          Globe: NASA Blue Marble · Satellite tiles: Sentinel-2 cloudless 2016 (EOX, CC BY 4.0) ·
          Theatre imagery: Esri World Imagery (local cache) · Terrain: SRTM/Copernicus via AWS Open Data
        </div>
      </div>

      <div className="theatre__panel">
        <div className="theatre__head">
          <div>
            <div className="theatre__kicker">C-DAWN · Mission planning</div>
            <div className="theatre__title">Select theatre of operations</div>
          </div>
          {canClose && <button className="theatre__close" onClick={onClose}>Close ✕</button>}
        </div>

        <div className="theatre__list">
          {theatres.map((t) => (
            <button
              key={t.id}
              className={`theatre__item ${t.id === currentId ? 'current' : ''} ${t.id === (hover || focused) ? 'hover' : ''}`}
              onMouseEnter={() => setHover(t.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => zoomInto(t)}
              disabled={Boolean(loading)}
            >
              <div className="theatre__item-top">
                <span className="theatre__name">{t.name}</span>
                <span className="theatre__tag">
                  {loading === t.id ? 'LOADING…' : t.id === currentId ? 'ACTIVE' : t.synthetic ? 'TRAINING MODEL' : 'REAL TERRAIN'}
                </span>
              </div>
              <div className="theatre__region">{t.region}</div>
              <div className="theatre__coords">
                {fmtCoord(t.lat, t.lon)}
                {t.min_height_m != null && ` · ${Math.round(t.min_height_m)}–${Math.round(t.max_height_m)} m`}
              </div>
            </button>
          ))}
        </div>

        {detail && (
          <div className="theatre__detail">
            <div className="theatre__detail-name">{detail.name}</div>
            <p>{detail.description}</p>
            {detail.use_case && <p><b>Use case:</b> {detail.use_case}</p>}
            {detail.size_m && <p><b>Area:</b> {(detail.size_m / 1000).toFixed(1)} × {(detail.size_m / 1000).toFixed(1)} km</p>}
            <button
              className="btn primary"
              style={{ marginTop: 10, width: '100%' }}
              disabled={Boolean(loading)}
              onClick={() => deploy(detail)}
            >
              {loading === detail.id ? 'Deploying…' : detail.id === currentId ? 'Re-deploy here' : `Deploy to ${detail.name}`}
            </button>
          </div>
        )}
        {error && <div className="theatre__error">{error}</div>}
      </div>
    </div>
  );
}
