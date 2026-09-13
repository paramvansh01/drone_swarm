import * as THREE from 'three';

/**
 * Cinematic camera director.
 *
 * Runs a sequence of framed shots over the live swarm — establishing cranes,
 * chase cams, low orbits, ridge-level passes — and cuts between them, either
 * on a timer or in response to a mission event.
 *
 * Two things make this read as filmed rather than as a moving viewport:
 *
 *   1. Critically-damped smoothing on both the camera position and its look
 *      target. A camera that snaps to its ideal position every frame looks
 *      like a video game; a real one has mass and lags its operator.
 *
 *   2. Event-driven cutting. When a node is killed or a jammer lights up, the
 *      director cuts to a shot framing that subject, the way a director
 *      covering a live event would.
 *
 * The operator can take manual control at any time (drag to orbit); the
 * director stands down until they release it, and `resume()` hands it back.
 */

const SHOTS = [
  'establishing',
  'chase',
  'low_orbit',
  'ridge_pass',
  'formation',
  'top_down',
];

/** Critically-damped spring interpolation — frame-rate independent. */
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function dampVec(current, target, lambda, dt) {
  current.x = damp(current.x, target.x, lambda, dt);
  current.y = damp(current.y, target.y, lambda, dt);
  current.z = damp(current.z, target.z, lambda, dt);
  return current;
}

export default class CameraDirector {
  constructor(camera, terrain) {
    this.camera = camera;
    this.terrain = terrain;

    this.enabled = true;
    this.shotIndex = 0;
    this.shotName = 'establishing';
    this.shotElapsed = 0;
    this.shotDuration = 12;
    this.orbitAngle = Math.random() * Math.PI * 2;

    // Smoothed state the camera actually uses
    this.position = new THREE.Vector3(600, 1200, 1800);
    this.lookAt = new THREE.Vector3(1200, 750, 2200);
    this.targetPosition = this.position.clone();
    this.targetLookAt = this.lookAt.clone();
    this.fov = 55;
    this.targetFov = 55;

    this.subjectId = null;
    this._lastSubject = new THREE.Vector3(1200, 750, 2200);

    // Manual override
    this.manual = false;
    this.manualOrbit = { theta: 0.7, phi: 1.0, radius: 900 };
    this.manualTarget = new THREE.Vector3(1200, 750, 2200);
  }

  // -- shot selection ------------------------------------------------------

  /** Cut to a named shot, optionally framing a specific aircraft. */
  cutTo(shotName, subjectId = null, duration = null) {
    this.shotName = shotName;
    this.subjectId = subjectId;
    this.shotElapsed = 0;
    this.shotDuration = duration ?? this._defaultDuration(shotName);
    this.orbitAngle = Math.random() * Math.PI * 2;
  }

  _defaultDuration(shotName) {
    return {
      establishing: 13,
      chase: 11,
      low_orbit: 10,
      ridge_pass: 11,
      formation: 9,
      top_down: 8,
    }[shotName] ?? 10;
  }

  /**
   * React to a mission event by cutting to appropriate coverage.
   * Called by the scene manager when the event log gains an entry.
   */
  onEvent(event) {
    if (!this.enabled || this.manual) return;

    const type = event.type || '';

    if (type === 'KILL_NODE' || type.includes('NODE')) {
      this.cutTo('low_orbit', event.params?.drone_id ?? null, 9);
    } else if (type.includes('JAMMING')) {
      this.cutTo('establishing', null, 8);
    } else if (type.includes('INTERVENTION_EXECUTED')) {
      this.cutTo('chase', event.drone_id ?? null, 8);
    } else if (type === 'INTERCEPTOR' && (event.message || '').includes('launched')) {
      // Ride along with the munition for the whole engagement
      this.cutTo('chase', event.params?.interceptor_id ?? null, 60);
    } else if (type === 'JAMMER_DESTROYED') {
      this.cutTo('strike', 'STRIKE', 7);
    } else if (type === 'SURVEY_COMPLETE') {
      this.cutTo('top_down', event.drone ?? null, 7);
    }
  }

  // -- manual control ------------------------------------------------------

  beginManual(targetPoint) {
    this.manual = true;
    this.enabled = false;
    if (targetPoint) this.manualTarget.copy(targetPoint);

    // Seed the orbit from wherever the camera currently is, so taking
    // control does not jump the view.
    const offset = this.position.clone().sub(this.manualTarget);
    this.manualOrbit.radius = Math.max(offset.length(), 60);
    this.manualOrbit.theta = Math.atan2(offset.x, offset.z);
    this.manualOrbit.phi = Math.acos(
      THREE.MathUtils.clamp(offset.y / this.manualOrbit.radius, -1, 1),
    );
  }

  orbit(deltaX, deltaY) {
    this.manualOrbit.theta -= deltaX * 0.005;
    this.manualOrbit.phi = THREE.MathUtils.clamp(
      this.manualOrbit.phi - deltaY * 0.005, 0.08, Math.PI * 0.495,
    );
  }

  zoom(delta) {
    this.manualOrbit.radius = THREE.MathUtils.clamp(
      this.manualOrbit.radius * (1 + delta * 0.0012), 40, 6000,
    );
  }

  resume() {
    this.manual = false;
    this.enabled = true;
    this.cutTo('establishing');
  }

  // -- per-frame -----------------------------------------------------------

  update(dt, drones, pois, worldInfo) {
    if (this.manual) {
      this._updateManual(dt);
      return;
    }
    if (!this.enabled) return;

    this.shotElapsed += dt;
    if (this.shotElapsed > this.shotDuration) {
      this.shotIndex = (this.shotIndex + 1) % SHOTS.length;
      this.cutTo(SHOTS[this.shotIndex]);
    }

    const subject = this._resolveSubject(drones);
    const swarm = this._swarmCentroid(drones);
    const t = this.shotElapsed;

    let desiredPos = new THREE.Vector3();
    let desiredLook = subject.clone();
    let desiredFov = 52;

    switch (this.shotName) {
      case 'establishing': {
        // Slow high crane arcing over the massif, framing the whole valley
        const angle = this.orbitAngle + t * 0.045;
        const radius = 1500 - t * 22;
        desiredPos.set(
          swarm.x + Math.cos(angle) * radius,
          swarm.y + 620 - t * 12,
          swarm.z + Math.sin(angle) * radius,
        );
        desiredLook = swarm.clone();
        desiredFov = 46;
        break;
      }

      case 'chase': {
        // Trail the subject from behind and slightly above, along its track
        const vel = this._subjectVelocity(drones);
        const back = vel.lengthSq() > 1
          ? vel.clone().normalize().multiplyScalar(-46)
          : new THREE.Vector3(-46, 0, 0);
        desiredPos.copy(subject).add(back).add(new THREE.Vector3(0, 17, 0));
        desiredLook = subject.clone().add(vel.clone().multiplyScalar(1.6));
        desiredFov = 58;
        break;
      }

      case 'strike': {
        // Wide slow orbit on the impact point: the fireball is ~70 m across
        const angle = this.orbitAngle + t * 0.18;
        desiredPos.set(
          subject.x + Math.cos(angle) * 280,
          subject.y + 110,
          subject.z + Math.sin(angle) * 280,
        );
        desiredLook = subject.clone();
        desiredFov = 50;
        break;
      }

      case 'low_orbit': {
        // Tight orbit at aircraft level — the shot that reads as "close"
        const angle = this.orbitAngle + t * 0.42;
        const radius = 34;
        desiredPos.set(
          subject.x + Math.cos(angle) * radius,
          subject.y + 7 + Math.sin(t * 0.5) * 4,
          subject.z + Math.sin(angle) * radius,
        );
        desiredFov = 50;
        break;
      }

      case 'ridge_pass': {
        // Camera parked on high ground looking down at the swarm in the
        // valley — the shot that communicates how enclosed the terrain is.
        const ridge = this._nearbyHighGround(swarm);
        desiredPos.copy(ridge);
        desiredLook = swarm.clone();
        desiredFov = 40;
        break;
      }

      case 'formation': {
        // Slow lateral dolly across the swarm, roughly at its own altitude
        const angle = this.orbitAngle + t * 0.12;
        const radius = 150;
        desiredPos.set(
          swarm.x + Math.cos(angle) * radius,
          swarm.y + 40,
          swarm.z + Math.sin(angle) * radius,
        );
        desiredLook = swarm.clone();
        desiredFov = 55;
        break;
      }

      case 'top_down': {
        // Near-vertical tactical view of the subject and the ground it is over
        desiredPos.set(subject.x + 18, subject.y + 145, subject.z + 18);
        desiredLook = subject.clone();
        desiredFov = 48;
        break;
      }

      default:
        desiredPos.copy(swarm).add(new THREE.Vector3(200, 120, 200));
    }

    // Never let the camera end up inside a mountain: raise it to clear the
    // terrain beneath it. Without this, a chase shot down a narrow valley
    // spends half its time looking at the inside of a ridge.
    const ground = this.terrain ? this.terrain.heightAt(desiredPos.x, desiredPos.z) : 0;
    desiredPos.y = Math.max(desiredPos.y, ground + 22);

    // Clearing the ground under the camera is not enough: in a winding valley
    // a chase camera 40 m behind the aircraft is often on the far side of a
    // spur, and the shot becomes a close-up of a rock face with the subject
    // hidden behind it. Raise the camera until the sight-line is clear.
    this._clearSightLine(desiredPos, desiredLook);

    this.targetPosition.copy(desiredPos);
    this.targetLookAt.copy(desiredLook);
    this.targetFov = desiredFov;

    // Ease in at the start of a shot so a cut settles rather than snaps
    const settle = THREE.MathUtils.clamp(this.shotElapsed / 1.6, 0, 1);
    const posLambda = THREE.MathUtils.lerp(6.5, 1.5, settle);
    const lookLambda = THREE.MathUtils.lerp(7.5, 2.6, settle);

    dampVec(this.position, this.targetPosition, posLambda, dt);
    dampVec(this.lookAt, this.targetLookAt, lookLambda, dt);
    this.fov = damp(this.fov, this.targetFov, 2.0, dt);

    this._apply();
  }

  _updateManual(dt) {
    const { theta, phi, radius } = this.manualOrbit;
    const target = new THREE.Vector3(
      this.manualTarget.x + radius * Math.sin(phi) * Math.sin(theta),
      this.manualTarget.y + radius * Math.cos(phi),
      this.manualTarget.z + radius * Math.sin(phi) * Math.cos(theta),
    );

    // Stay above the ground and lift over any ridge between the camera and
    // what it is looking at, so orbiting never ends up inside a mountain.
    target.y = Math.max(target.y, this._floorAt(target.x, target.z));
    if (this.terrain) {
      const aim = this.manualTarget.clone();
      aim.y = Math.max(aim.y, this.terrain.heightAt(aim.x, aim.z)) + 25;
      this._clearSightLine(target, aim, 6);
    }

    dampVec(this.position, target, 9, dt);
    dampVec(this.lookAt, this.manualTarget, 9, dt);
    this.fov = damp(this.fov, 55, 5, dt);

    this._apply();
  }

  _apply() {
    // Hard floor, applied after smoothing: easing between two clear points
    // can still pass through a ridge, so check the position actually used.
    if (this.terrain) {
      this.position.y = Math.max(this.position.y, this._floorAt(this.position.x, this.position.z));
    }
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAt);
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  // -- helpers -------------------------------------------------------------

  /** Lowest safe camera height: highest ground within ~25 m, plus clearance. */
  _floorAt(x, z, clearance = 14) {
    if (!this.terrain) return -Infinity;
    const r = 25;
    const h = Math.max(
      this.terrain.heightAt(x, z),
      this.terrain.heightAt(x + r, z), this.terrain.heightAt(x - r, z),
      this.terrain.heightAt(x, z + r), this.terrain.heightAt(x, z - r),
    );
    return h + clearance;
  }

  /**
   * Lift `from` until the straight line to `to` clears the terrain by a
   * margin. Samples the heightmap along the segment; each pass raises the
   * camera by the worst intrusion found, so it converges in a few steps.
   */
  _clearSightLine(from, to, margin = 12) {
    if (!this.terrain) return;
    const samples = 24;
    for (let pass = 0; pass < 6; pass++) {
      let worst = 0;
      for (let i = 1; i < samples; i++) {
        const t = i / samples;
        const x = from.x + (to.x - from.x) * t;
        const z = from.z + (to.z - from.z) * t;
        const lineY = from.y + (to.y - from.y) * t;
        const intrusion = this.terrain.heightAt(x, z) + margin - lineY;
        // Weight by (1 - t): raising the camera end lifts points near the
        // camera a lot and points near the subject hardly at all.
        if (intrusion > 0) worst = Math.max(worst, intrusion / Math.max(1 - t, 0.08));
      }
      if (worst <= 0) return;
      from.y += Math.min(worst, 400);
    }
  }

  _resolveSubject(drones) {
    const entries = Object.entries(drones || {});
    if (!entries.length) return this._lastSubject.clone();

    let chosen = null;
    if (this.subjectId && drones[this.subjectId]) {
      chosen = drones[this.subjectId];
    } else {
      // Default to a live scout — they are the ones actually going somewhere
      chosen = entries.find(([, d]) => d.role === 'SCOUT' && d.status !== 'KILLED')?.[1]
        ?? entries.find(([, d]) => d.status !== 'KILLED')?.[1]
        ?? entries[0][1];
    }

    const p = chosen.position;
    this._lastSubject.set(p[0], p[2], p[1]);   // sim (x,y,z-up) -> three (x,z-up=y)
    return this._lastSubject.clone();
  }

  _subjectVelocity(drones) {
    const entries = Object.entries(drones || {});
    const chosen = (this.subjectId && drones[this.subjectId])
      || entries.find(([, d]) => d.role === 'SCOUT' && d.status !== 'KILLED')?.[1]
      || entries[0]?.[1];

    if (!chosen?.velocity) return new THREE.Vector3();
    const v = chosen.velocity;
    return new THREE.Vector3(v[0], v[2], v[1]);
  }

  _swarmCentroid(drones) {
    const live = Object.values(drones || {}).filter((d) => d.status !== 'KILLED' && d.role !== 'INTERCEPTOR');
    if (!live.length) return this._lastSubject.clone();

    const sum = live.reduce(
      (acc, d) => {
        acc.x += d.position[0];
        acc.y += d.position[2];
        acc.z += d.position[1];
        return acc;
      },
      { x: 0, y: 0, z: 0 },
    );

    return new THREE.Vector3(sum.x / live.length, sum.y / live.length, sum.z / live.length);
  }

  /**
   * Find high ground near the swarm to park a camera on.
   * Samples a ring around the subject and takes the highest point, which in
   * this terrain reliably lands on a ridge shoulder overlooking the valley.
   */
  _nearbyHighGround(center) {
    if (!this.terrain) return center.clone().add(new THREE.Vector3(300, 300, 300));

    let best = null;
    let bestHeight = -Infinity;

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 420;
      const x = center.x + Math.cos(angle) * radius;
      const z = center.z + Math.sin(angle) * radius;
      const h = this.terrain.heightAt(x, z);
      if (h > bestHeight) {
        bestHeight = h;
        best = new THREE.Vector3(x, h + 45, z);
      }
    }

    return best ?? center.clone().add(new THREE.Vector3(300, 300, 300));
  }

  getStatus() {
    return {
      shot: this.shotName,
      manual: this.manual,
      subject: this.subjectId,
      remaining: Math.max(0, this.shotDuration - this.shotElapsed),
    };
  }
}
