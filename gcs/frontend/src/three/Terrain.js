import * as THREE from 'three';

/**
 * Mountain terrain rendering.
 *
 * The geometry is built from the exact uint16 heightmap the backend uses for
 * RF diffraction and ground collision, so the ridge the operator watches a
 * drone struggle over is the same ridge that is attenuating its radio link.
 *
 * Shading is done in a custom material rather than with textures: at 4 km
 * across, any tileable rock texture reads as obvious repetition, and shipping
 * real satellite imagery is not an option for an offline venue LAN. Instead
 * the surface is classified per-fragment by altitude and slope into grass /
 * scree / rock / snow, with procedural detail breaking up the bands.
 */

/** Decode the base64 uint16 payload from /api/terrain into metres. */
export function decodeHeightmap(payload) {
  const binary = atob(payload.data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const quantised = new Uint16Array(bytes.buffer);
  const { quantise_min_m: lo, quantise_max_m: hi, resolution } = payload;
  const span = (hi - lo) / 65535;

  const heights = new Float32Array(quantised.length);
  for (let i = 0; i < quantised.length; i++) heights[i] = lo + quantised[i] * span;

  return { heights, resolution, sizeM: payload.size_m, minM: lo, maxM: hi };
}

/** Bilinear height lookup in world coordinates — mirrors Terrain.height_at. */
export function sampleHeight(terrain, x, y) {
  const { heights, resolution, sizeM } = terrain;
  const cell = sizeM / (resolution - 1);

  const fx = Math.min(Math.max(x / cell, 0), resolution - 1.001);
  const fy = Math.min(Math.max(y / cell, 0), resolution - 1.001);

  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;

  const h00 = heights[y0 * resolution + x0];
  const h10 = heights[y0 * resolution + x0 + 1];
  const h01 = heights[(y0 + 1) * resolution + x0];
  const h11 = heights[(y0 + 1) * resolution + x0 + 1];

  return (h00 * (1 - tx) + h10 * tx) * (1 - ty) + (h01 * (1 - tx) + h11 * tx) * ty;
}

const TERRAIN_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vSlope;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    vNormal = normalize(normalMatrix * normal);
    // Slope: 0 on flat ground, 1 on a vertical face.
    vSlope = 1.0 - clamp(dot(normalize(normal), vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const TERRAIN_FRAG = /* glsl */ `
  precision highp float;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vSlope;

  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uGroundColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uSnowLine;
  uniform float uValleyFloor;
  uniform float uPeak;
  uniform vec3 uCameraPos;
  uniform sampler2D uImagery;
  uniform float uHasImagery;
  uniform float uSize;
  uniform vec2 uOrigin;      // world XZ of this surface's south-west corner
  uniform float uInner;      // > 0: hide the playable square [0, uInner]^2

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }

  // Ridged noise for rock relief: sharp crests read as fractured stone
  // rather than the soft blobs plain fbm gives.
  float ridged(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * (1.0 - abs(noise(p) * 2.0 - 1.0));
      p = p * 2.11 + 9.7; a *= 0.5;
    }
    return v;
  }

  void main() {
    // The surrounding-terrain surface is cut away over the playable map,
    // which is drawn separately at full resolution.
    if (uInner > 0.0 && vWorldPos.x > 0.5 && vWorldPos.x < uInner - 0.5
        && vWorldPos.z > 0.5 && vWorldPos.z < uInner - 0.5) discard;

    float altitude = vWorldPos.y;
    float dist = length(uCameraPos - vWorldPos);
    vec3 baseNormal = normalize(vNormal);

    float relief = max(uPeak - uValleyFloor, 1.0);
    float h = clamp((altitude - uValleyFloor) / relief, 0.0, 1.0);

    // --- procedural bump ------------------------------------------------
    // The mesh is 8-20 m per cell; anything finer has to come from the
    // shader. Perturb the normal with the gradient of a ridged field so close
    // shots show broken rock, and fade it with distance so far ridges do not
    // shimmer.
    float detailFade = 1.0 - smoothstep(350.0, 1600.0, dist);
    vec2 q = vWorldPos.xz * 0.055;
    float e = 0.35;
    float r0 = ridged(q);
    float rx = ridged(q + vec2(e, 0.0));
    float rz = ridged(q + vec2(0.0, e));
    float rockiness = smoothstep(0.18, 0.55, vSlope);
    vec3 bump = vec3(r0 - rx, 0.0, r0 - rz) * (1.6 + 2.4 * rockiness) * detailFade;
    vec3 normal = normalize(baseNormal + bump);

    float largeDetail = fbm(vWorldPos.xz * 0.012);
    float fine = fbm(vWorldPos.xz * 0.35);

    // --- materials --------------------------------------------------------
    vec3 meadow  = vec3(0.30, 0.36, 0.20);   // alpine grass, valley floor
    vec3 moraine = vec3(0.47, 0.43, 0.36);   // glacial debris, lower slopes
    vec3 scree   = vec3(0.56, 0.53, 0.48);   // loose talus below cliffs
    vec3 granite = vec3(0.40, 0.37, 0.35);   // bare rock faces
    vec3 darkRock= vec3(0.24, 0.22, 0.22);   // wet / shadowed rock, lichen
    vec3 snow    = vec3(0.95, 0.96, 0.98);

    float grassToMoraine = smoothstep(0.05, 0.26, h + largeDetail * 0.14 - 0.07);
    vec3 albedo = mix(meadow, moraine, grassToMoraine);
    albedo = mix(albedo, scree, smoothstep(0.22, 0.45, vSlope) * (1.0 - rockiness * 0.6));

    // Rock faces, with sedimentary strata: horizontal banding on steep
    // ground is what makes a cliff read as geology rather than clay.
    float strata = 0.5 + 0.5 * sin(altitude * 0.19 + largeDetail * 9.0);
    strata = smoothstep(0.25, 0.9, strata);
    vec3 rock = mix(darkRock, granite, 0.45 + 0.55 * strata);
    rock = mix(rock, darkRock, smoothstep(0.55, 0.8, fine) * 0.5);   // lichen
    albedo = mix(albedo, rock, rockiness);

    // Snow: holds on gentle slopes above the line, slides off steep faces,
    // and drifts into the lee of ridges (modelled as noise on the band).
    float snowBand = smoothstep(uSnowLine - 140.0, uSnowLine + 180.0,
                                altitude + largeDetail * 160.0 - 80.0);
    float snowHold = 1.0 - smoothstep(0.38, 0.66, vSlope - fine * 0.08);
    float snowAmount = clamp(snowBand * snowHold, 0.0, 1.0);
    albedo = mix(albedo, snow, snowAmount);

    albedo *= 0.86 + 0.28 * fine;

    // Real theatres: drape the Sentinel-2 imagery. It already contains the
    // real snow, scree, vegetation and river beds, so it replaces the
    // procedural classification; the procedural fine detail is kept only as
    // a subtle modulation so close shots are not a smooth blur.
    if (uHasImagery > 0.5) {
      vec3 sat = texture2D(uImagery, (vWorldPos.xz - uOrigin) / uSize).rgb;
      albedo = sat * (0.93 + 0.14 * fine);
      snowAmount = 0.0;
    }

    // --- lighting ---------------------------------------------------------
    float ndl = max(dot(normal, uSunDirection), 0.0);

    // Valley occlusion: deep valley floors receive less sky light than
    // exposed ridges. Cheap stand-in for ambient occlusion.
    float occlusion = mix(0.62, 1.0, pow(h, 0.45));

    float hemi = 0.5 + 0.5 * normal.y;
    vec3 ambient = mix(uGroundColor, uSkyColor, hemi) * 0.42 * occlusion;

    // Slightly wrapped diffuse keeps shadowed faces readable without
    // flattening the terminator.
    float wrapped = (ndl + 0.12) / 1.12;
    vec3 diffuse = uSunColor * wrapped;

    vec3 lighting = ambient + diffuse;
    // Satellite imagery has the sun's shading baked in; applying full
    // lighting on top would darken shadowed slopes twice.
    lighting = mix(lighting, vec3(1.0), uHasImagery * 0.45);
    vec3 color = albedo * lighting;

    // Snow in shade picks up the blue of the sky
    color = mix(color, color * vec3(0.86, 0.92, 1.08), snowAmount * (1.0 - ndl));

    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    vec3 halfVec = normalize(uSunDirection + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
    color += uSunColor * spec * snowAmount * 0.35;

    // --- aerial perspective -------------------------------------------------
    float fogAmount = 1.0 - exp(-pow(dist * uFogDensity, 1.6));
    float heightFalloff = exp(-max(altitude - uValleyFloor, 0.0) * 0.0006);
    fogAmount = clamp(fogAmount * mix(0.7, 1.0, heightFalloff), 0.0, 0.97);
    color = mix(color, uFogColor, fogAmount);

    // Filmic tonemap + gamma
    color = color / (color + vec3(0.78));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Build the terrain mesh.
 *
 * `segments` controls render resolution independently of the heightmap
 * resolution: the physics grid is 513x513 (8 m cells), but the mesh is
 * subdivided finer and sampled bilinearly so silhouettes stay smooth when the
 * camera flies close to a ridge.
 */
function terrainMaterial({ minM, maxM, snowLine, sizeM, originX = 0, originZ = 0, inner = 0 }) {
  return new THREE.ShaderMaterial({
    vertexShader: TERRAIN_VERT,
    fragmentShader: TERRAIN_FRAG,
    uniforms: {
      uSunDirection: { value: SUN_DIRECTION.clone() },
      uSunColor: { value: new THREE.Color(0xfff3e0).multiplyScalar(1.15) },
      uSkyColor: { value: new THREE.Color(0xbcd6f0) },
      uGroundColor: { value: new THREE.Color(0x6b6257) },
      uFogColor: { value: HAZE.clone() },
      uFogDensity: { value: 1 / 16000 },
      uSnowLine: { value: snowLine },
      uValleyFloor: { value: minM },
      uPeak: { value: maxM },
      uCameraPos: { value: new THREE.Vector3() },
      uImagery: { value: null },
      uHasImagery: { value: 0.0 },
      uSize: { value: sizeM },
      uOrigin: { value: new THREE.Vector2(originX, originZ) },
      uInner: { value: inner },
    },
  });
}

/** Attach a base64 JPEG as the draped imagery of a terrain material. */
export function applyImagery(material, b64, renderer) {
  if (!b64) return;
  new THREE.TextureLoader().load(`data:image/jpeg;base64,${b64}`, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    material.uniforms.uImagery.value = tex;
    material.uniforms.uHasImagery.value = 1.0;
  });
}

/**
 * Surrounding terrain out to the horizon. Rendered only — the simulation
 * never leaves the playable square — and cut away over that square, where
 * the full-resolution mesh is drawn.
 */
export function createContextMesh(context, inner, { snowLine = 1350 } = {}) {
  const decoded = decodeHeightmap({
    data: context.data,
    quantise_min_m: context.quantise_min_m,
    quantise_max_m: context.quantise_max_m,
    resolution: context.resolution,
    size_m: context.size_m,
  });
  const extent = context.size_m;
  const origin = context.origin_m;
  const segments = context.resolution - 1;

  const geometry = new THREE.PlaneGeometry(extent, extent, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i) + extent / 2;
    const lz = pos.getZ(i) + extent / 2;
    // 1 m below the playable surface so the two never z-fight at the seam
    pos.setY(i, sampleHeight(decoded, lx, lz) - 1.0);
  }
  geometry.computeVertexNormals();

  const material = terrainMaterial({
    minM: inner.minM, maxM: inner.maxM, snowLine, sizeM: extent,
    originX: origin, originZ: origin, inner: inner.sizeM,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(origin + extent / 2, 0, origin + extent / 2);
  mesh.frustumCulled = false;
  mesh.name = 'terrain-context';
  mesh.userData.decoded = decoded;
  mesh.userData.origin = origin;
  return mesh;
}

/**
 * Vertical skirt around the playable square. The playable mesh and the
 * coarser surroundings disagree slightly at their shared edge; a skirt
 * dropped from the edge hides any crack instead of letting the sky show
 * through it.
 */
export function createSkirt(terrain, material, depth = 180, samples = 512) {
  const { sizeM } = terrain;
  const verts = [];
  const edge = (fn) => {
    for (let i = 0; i < samples; i++) {
      const [x0, z0] = fn(i / samples);
      const [x1, z1] = fn((i + 1) / samples);
      const h0 = sampleHeight(terrain, x0, z0);
      const h1 = sampleHeight(terrain, x1, z1);
      verts.push(x0, h0, z0, x1, h1, z1, x0, h0 - depth, z0,
                 x1, h1, z1, x1, h1 - depth, z1, x0, h0 - depth, z0);
    }
  };
  edge((t) => [t * sizeM, 0]);
  edge((t) => [sizeM, t * sizeM]);
  edge((t) => [sizeM - t * sizeM, sizeM]);
  edge((t) => [0, sizeM - t * sizeM]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geometry.computeVertexNormals();
  const skirtMaterial = material.clone();
  skirtMaterial.side = THREE.DoubleSide;
  skirtMaterial.uniforms = material.uniforms;   // share imagery + camera
  const mesh = new THREE.Mesh(geometry, skirtMaterial);
  mesh.frustumCulled = false;
  mesh.name = 'terrain-skirt';
  return mesh;
}

export function createTerrainMesh(terrain, { segments = 640, snowLine = 1350, imagery = null } = {}) {
  const { sizeM, minM, maxM } = terrain;

  const geometry = new THREE.PlaneGeometry(sizeM, sizeM, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.attributes.position;

  // PlaneGeometry is centred on the origin; the simulation's world origin is
  // a corner, so shift into simulation coordinates before sampling and keep
  // the mesh centred for numerical comfort in the renderer.
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) + sizeM / 2;
    const z = position.getZ(i) + sizeM / 2;
    position.setY(i, sampleHeight(terrain, x, z));
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  const material = terrainMaterial({ minM, maxM, snowLine, sizeM });
  if (imagery) {
    material.uniforms.uImagery.value = imagery;
    material.uniforms.uHasImagery.value = 1.0;
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(sizeM / 2, 0, sizeM / 2);
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  mesh.name = 'terrain';

  return mesh;
}

/**
 * A large gradient dome standing in for the sky.
 *
 * Rendered on the inside of a sphere with depth-write disabled so it never
 * occludes anything; the horizon colour is matched to the terrain fog so
 * distant ridges dissolve into the sky rather than ending at a visible line.
 */
export const SUN_DIRECTION = new THREE.Vector3(0.52, 0.62, 0.58).normalize();
export const HAZE = new THREE.Color(0xc9d3dd);

/**
 * Sky dome: deep blue at the zenith, desaturating into a pale haze at the
 * horizon that matches the terrain's aerial perspective exactly, so distant
 * ridges dissolve into the sky rather than ending against a flat backdrop.
 * Below the horizon it stays haze-coloured, which is what the eye expects
 * when looking down a valley into distance.
 */
export function createSky(radius = 60000) {
  const geometry = new THREE.SphereGeometry(radius, 48, 32);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uZenith: { value: new THREE.Color(0x2f5d96) },
      uMid: { value: new THREE.Color(0x7aa3cf) },
      uHorizon: { value: HAZE.clone() },
      uSunDirection: { value: SUN_DIRECTION.clone() },
      uSunColor: { value: new THREE.Color(0xfff4e0) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vDirection;
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSunDirection;
      uniform vec3 uSunColor;
      void main() {
        vec3 dir = normalize(vDirection);
        float h = dir.y;
        vec3 color = h > 0.0
          ? mix(mix(uHorizon, uMid, smoothstep(0.0, 0.18, h)), uZenith, smoothstep(0.18, 0.85, h))
          : uHorizon;
        float sun = max(dot(dir, uSunDirection), 0.0);
        color += uSunColor * pow(sun, 6.0) * 0.18;     // broad forward scatter
        color += uSunColor * pow(sun, 900.0) * 1.2;    // sun disc
        // thin band of extra haze sitting right on the horizon
        color = mix(color, uHorizon * 1.04, exp(-abs(h) * 22.0) * 0.55);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(geometry, material);
  sky.frustumCulled = false;
  sky.name = 'sky';
  return sky;
}
