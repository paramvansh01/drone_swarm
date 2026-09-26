import * as THREE from 'three';

/**
 * Procedural quadrotor model.
 *
 * Built from primitives rather than loaded from a GLTF on purpose: the demo
 * runs on an isolated venue LAN with no internet, and a CDN-hosted model that
 * silently fails to load would leave the operator looking at an empty sky.
 * Everything here is generated at runtime from code that ships with the app.
 *
 * The model carries the details that make a small object readable at the
 * distances a cinematic camera uses: a visible airframe silhouette, motor
 * pods, translucent rotor discs that spin with commanded thrust, a gimbal
 * ball, and role-coloured navigation lights.
 */

const ROLE_COLORS = {
  SCOUT: 0x0b6bcb,
  RELAY: 0x0f8a5f,
  GCS_RELAY: 0x8250df,
  STANDBY: 0x6b7280,
  KILLED: 0xb91c1c,
};

export function roleColor(role, status) {
  if (status === 'KILLED') return ROLE_COLORS.KILLED;
  return ROLE_COLORS[role] ?? ROLE_COLORS.STANDBY;
}

// Shared geometry/material instances — five aircraft would otherwise allocate
// five copies of identical buffers.
const shared = {};

/**
 * Soft radial glow for the strobe sprite.
 *
 * A Sprite with no texture renders as a solid square; with additive blending
 * and distance-based scaling that became a large flat cyan rectangle hanging
 * behind every aircraft on wide shots. A radial falloff makes it read as a
 * light instead of a panel.
 */
function glowTexture() {
  if (shared.glow) return shared.glow;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.42, 'rgba(255,255,255,0.22)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  shared.glow = new THREE.CanvasTexture(canvas);
  shared.glow.colorSpace = THREE.SRGBColorSpace;
  return shared.glow;
}

function getShared() {
  if (shared.initialised) return shared;

  shared.bodyGeo = new THREE.BoxGeometry(1.5, 0.42, 2.0);
  shared.canopyGeo = new THREE.SphereGeometry(0.52, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
  shared.armGeo = new THREE.CylinderGeometry(0.10, 0.13, 2.5, 8);
  shared.motorGeo = new THREE.CylinderGeometry(0.20, 0.24, 0.36, 12);
  shared.hubGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.16, 8);
  shared.bladeGeo = new THREE.BoxGeometry(2.05, 0.035, 0.17);
  shared.discGeo = new THREE.CircleGeometry(1.05, 28);
  shared.gimbalGeo = new THREE.SphereGeometry(0.27, 14, 12);
  shared.lensGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.12, 12);
  shared.legGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.72, 6);
  shared.skidGeo = new THREE.BoxGeometry(0.09, 0.07, 1.5);
  shared.navGeo = new THREE.SphereGeometry(0.1, 8, 8);

  shared.carbon = new THREE.MeshStandardMaterial({
    color: 0x23272e, roughness: 0.55, metalness: 0.35,
  });
  shared.darkPlastic = new THREE.MeshStandardMaterial({
    color: 0x14171c, roughness: 0.8, metalness: 0.1,
  });
  shared.metal = new THREE.MeshStandardMaterial({
    color: 0x8a9099, roughness: 0.32, metalness: 0.85,
  });
  shared.glass = new THREE.MeshStandardMaterial({
    color: 0x10161f, roughness: 0.12, metalness: 0.5,
  });

  shared.initialised = true;
  return shared;
}

/**
 * Build one aircraft.
 *
 * Returns a Group with an `update(dt, state)` method attached; the scene
 * manager drives that each frame.
 */
export function createDrone(role = 'SCOUT', id = '') {
  const s = getShared();
  const group = new THREE.Group();
  group.name = `drone-${id}`;

  const accent = new THREE.MeshStandardMaterial({
    color: roleColor(role, 'ACTIVE'),
    roughness: 0.4,
    metalness: 0.25,
    emissive: new THREE.Color(roleColor(role, 'ACTIVE')),
    emissiveIntensity: 0.22,
  });

  // --- fuselage ---------------------------------------------------------
  const body = new THREE.Mesh(s.bodyGeo, s.carbon);
  body.castShadow = true;
  group.add(body);

  const canopy = new THREE.Mesh(s.canopyGeo, accent);
  canopy.position.set(0, 0.2, 0.25);
  canopy.castShadow = true;
  group.add(canopy);

  // --- arms, motors, rotors --------------------------------------------
  const rotors = [];
  const armPositions = [
    [1, 1], [-1, 1], [-1, -1], [1, -1],
  ];

  armPositions.forEach(([sx, sz], index) => {
    const arm = new THREE.Mesh(s.armGeo, s.carbon);
    arm.position.set(sx * 0.82, 0.02, sz * 0.82);
    // Lay the cylinder along the diagonal from the body to the motor pod
    arm.rotation.set(Math.PI / 2, 0, sx * sz > 0 ? -Math.PI / 4 : Math.PI / 4);
    arm.castShadow = true;
    group.add(arm);

    const motor = new THREE.Mesh(s.motorGeo, s.metal);
    motor.position.set(sx * 1.55, 0.14, sz * 1.55);
    motor.castShadow = true;
    group.add(motor);

    const hub = new THREE.Mesh(s.hubGeo, s.darkPlastic);
    hub.position.set(sx * 1.55, 0.38, sz * 1.55);
    group.add(hub);

    // Rotor: two solid blades for when the camera is close and the disc is
    // slow, plus a translucent disc that carries the motion at speed. Real
    // footage of a multirotor shows exactly this — blades resolve on a
    // stationary aircraft, a blur disc in flight.
    const rotor = new THREE.Group();
    rotor.position.set(sx * 1.55, 0.44, sz * 1.55);

    const bladeA = new THREE.Mesh(s.bladeGeo, s.darkPlastic);
    const bladeB = new THREE.Mesh(s.bladeGeo, s.darkPlastic);
    bladeB.rotation.y = Math.PI / 2;
    rotor.add(bladeA, bladeB);

    const disc = new THREE.Mesh(
      s.discGeo,
      new THREE.MeshBasicMaterial({
        color: 0xdfe6ee,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.01;
    rotor.add(disc);

    // Counter-rotating pairs, as on a real quad
    rotor.userData.direction = index % 2 === 0 ? 1 : -1;
    rotor.userData.disc = disc;
    rotor.userData.blades = [bladeA, bladeB];

    group.add(rotor);
    rotors.push(rotor);
  });

  // --- sensor gimbal ----------------------------------------------------
  const gimbal = new THREE.Mesh(s.gimbalGeo, s.darkPlastic);
  gimbal.position.set(0, -0.32, 0.52);
  group.add(gimbal);

  const lens = new THREE.Mesh(s.lensGeo, s.glass);
  lens.position.set(0, -0.42, 0.72);
  lens.rotation.x = Math.PI / 2.2;
  group.add(lens);

  // --- landing gear -----------------------------------------------------
  [-1, 1].forEach((sx) => {
    const leg = new THREE.Mesh(s.legGeo, s.carbon);
    leg.position.set(sx * 0.55, -0.5, 0);
    leg.rotation.z = sx * 0.22;
    group.add(leg);

    const skid = new THREE.Mesh(s.skidGeo, s.carbon);
    skid.position.set(sx * 0.68, -0.85, 0);
    group.add(skid);
  });

  // --- navigation lights -------------------------------------------------
  // Aviation convention: red to port, green to starboard, white astern.
  const navLights = [];
  const navSpec = [
    { color: 0xff2d2d, pos: [-1.62, 0.2, 1.62] },
    { color: 0x22ff6a, pos: [1.62, 0.2, 1.62] },
    { color: 0xffffff, pos: [0, 0.3, -1.05] },
  ];

  navSpec.forEach(({ color, pos }) => {
    const light = new THREE.Mesh(
      s.navGeo,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 }),
    );
    light.position.set(...pos);
    group.add(light);
    navLights.push(light);
  });

  // Strobe: a sprite-based glow so the aircraft stays visible against
  // bright snow at long camera distances, where 0.1 m geometry vanishes.
  const strobe = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: roleColor(role, 'ACTIVE'),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  strobe.scale.set(4, 4, 1);
  group.add(strobe);

  group.userData = {
    rotors,
    navLights,
    strobe,
    accent,
    role,
    id,
    strobePhase: Math.random() * Math.PI * 2,
    spin: 0,
  };

  /**
   * Per-frame update.
   *
   * @param {number} dt      seconds since last frame
   * @param {object} state   drone telemetry (thrust, status, battery)
   * @param {number} scale   model scale, set by the camera director so the
   *                         aircraft stays legible at wide shots
   */
  group.update = (dt, state = {}, scale = 1) => {
    const data = group.userData;
    const dead = state.status === 'KILLED';
    // On a GCS pad (charging or ready) the rotors are stopped too
    const grounded = dead || ['CHARGING', 'READY', 'LANDED'].includes(state.status);

    // Rotor speed tracks commanded thrust; a dead aircraft windmills down.
    const hoverThrust = 1.9 * 9.81;
    const thrustRatio = grounded ? 0 : Math.min((state.thrust ?? hoverThrust) / hoverThrust, 2.0);
    const targetSpin = grounded ? 0 : 55 + thrustRatio * 45;
    data.spin += (targetSpin - data.spin) * Math.min(dt * 3.0, 1);

    data.rotors.forEach((rotor) => {
      rotor.rotation.y += rotor.userData.direction * data.spin * dt;

      // Cross-fade blades into the blur disc as RPM rises, so neither is
      // visible in the regime where it would look wrong.
      const blur = Math.min(data.spin / 40, 1);
      rotor.userData.disc.material.opacity = blur * 0.30;
      rotor.userData.blades.forEach((b) => {
        b.material = b.material; // shared material; visibility handles fade
        b.visible = blur < 0.92;
      });
    });

    // Strobe at ~1.2 Hz, off entirely when the node is down
    data.strobePhase += dt * 7.5;
    const flash = dead ? 0 : Math.max(0, Math.sin(data.strobePhase)) ** 6;
    data.strobe.material.opacity = 0.25 + flash * 0.75;
    // The group is already scaled by `scale`; the sprite inherits it.
    data.strobe.scale.setScalar(3 + flash * 3);

    // Roles change in flight (scout -> relay -> standby); colour follows them
    const color = roleColor(state.role ?? data.role, state.status);
    data.strobe.material.color.setHex(color);
    data.accent.color.setHex(color);
    data.accent.emissive.setHex(color);
    data.accent.emissiveIntensity = dead ? 0 : 0.22;

    data.navLights.forEach((light) => { light.material.opacity = dead ? 0.15 : 0.95; });

    group.scale.setScalar(scale);
  };

  return group;
}

/**
 * Downwash dust puff, spawned when an aircraft is close to the ground.
 * Subtle, but it is the cue that sells "this thing is actually hovering
 * over terrain" rather than floating in front of a backdrop.
 */
export function createDownwash() {
  const count = 24;
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xc9bda8,
    size: 1.6,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.userData = { count, seeds: Array.from({ length: count }, () => Math.random()) };
  return points;
}
