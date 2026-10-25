import * as THREE from './vendor/three.module.js';

/**
 * Photorealistic 3D WebGL Ocean System with Planar Reflection + Analytical Sky/Sun Fallback + 4-Octave Normal Map + 3D Gerstner Swells
 *
 * Combines:
 * 1. Real-time Planar Mirror Reflection (`WebGLRenderTarget` + Oblique Clip-Plane Mirror Camera
 *    just like `three/addons/objects/Water.js` from `webgl_shaders_ocean.html`), seamlessly blended
 *    with an analytical Rayleigh/Mie sky & sun reflection fallback so displaced wave troughs never show
 *    clipping artifacts or UV border seams.
 * 2. High-resolution 512x512 seamless multi-octave normal map texture sampled at 4 scrolling UV scales
 *    (`getNoise(uv)` from `Water.js`) blended with the 8-wave Gerstner vertex displacement normals.
 * 3. 1:1 CPU/GPU Wave Height Agreement (`getWaveHeightAndNormal(x, z, time)`), deep turquoise
 *    subsurface crest scattering, Schlick Fresnel reflectance, sun specular glints, Kelvin V-wake
 *    ribbons, and underwater Snell's window + god-ray ceiling when diving underwater.
 */

export const WAVE_COMPONENTS = [
  // [dirX, dirZ, amplitude(m), wavelength(m), speedMultiplier, steepness]
  [0.25,  0.968, 0.64, 52.0, 1.05, 0.44],  // Primary long coastal swell
  [-0.32, 0.947, 0.44, 34.0, 1.15, 0.40],  // Secondary crossing swell
  [0.62,  0.784, 0.28, 20.0, 1.25, 0.36],  // Medium quartering wave
  [-0.71, 0.704, 0.19, 14.0, 1.35, 0.32],  // Medium chop
  [0.12, -0.992, 0.13, 9.5,  1.40, 0.28],  // Counter-chop
  [0.88,  0.474, 0.09, 6.4,  1.55, 0.25],  // Surface wind wave A
  [-0.85, 0.526, 0.07, 4.7,  1.65, 0.22],  // Surface wind wave B
  [0.44,  0.898, 0.045, 3.3, 1.80, 0.20],  // Fine crest detail
];

export function getZoneWaveScale(worldX, worldZ) {
  const t1 = Math.max(0.0, Math.min(1.0, (-worldZ - 20.0) / 220.0));
  const s1 = t1 * t1 * (3.0 - 2.0 * t1);
  const t2 = Math.max(0.0, Math.min(1.0, (-worldZ - 420.0) / 280.0));
  const s2 = t2 * t2 * (3.0 - 2.0 * t2);

  const radialDist = Math.hypot(worldX, worldZ);
  const tRad = Math.max(0.0, Math.min(1.0, (radialDist - 350.0) / 750.0));
  const sRad = tRad * tRad * (3.0 - 2.0 * tRad);

  return 0.58 + Math.max(0.42 * s1 + 0.52 * s2, sRad * 1.05);
}

export function getWaveHeightAndNormal(x, z, time, outNormal = null) {
  const zoneScale = getZoneWaveScale(x, z);
  let height = 0.0;
  let dHx = 0.0;
  let dHz = 0.0;
  let vertVel = 0.0;

  const G = 9.81;

  for (let i = 0; i < WAVE_COMPONENTS.length; i++) {
    const w = WAVE_COMPONENTS[i];
    const dx = w[0];
    const dz = w[1];
    const amp = w[2] * zoneScale;
    const wavelength = w[3];
    const speedMult = w[4];

    const k = (2.0 * Math.PI) / wavelength;
    const omega = Math.sqrt(G * k) * speedMult;
    const phase = k * (dx * x + dz * z) - omega * time;

    const sinP = Math.sin(phase);
    const cosP = Math.cos(phase);

    const crestBoost = 1.0 + 0.18 * w[5] * sinP;
    height += amp * sinP * crestBoost;

    const dPhase = amp * k * cosP * (1.0 + 0.36 * w[5] * sinP);
    dHx += dPhase * dx;
    dHz += dPhase * dz;

    vertVel -= amp * omega * cosP;
  }

  if (outNormal) {
    outNormal.set(-dHx, 1.0, -dHz).normalize();
  }

  return {
    height,
    normalX: -dHx,
    normalY: 1.0,
    normalZ: -dHz,
    verticalVelocity: vertVel,
    zoneScale,
  };
}

export function getSeabedHeight(x, z) {
  const baseDepth = -16.5;
  const undulating =
    Math.sin(x * 0.018) * Math.cos(z * 0.018) * 4.2 +
    Math.sin(x * 0.052 + z * 0.041) * 1.8;
  return baseDepth + undulating;
}

/**
 * Generates a high-detail 512x512 seamless tileable tangent-space water normal map
 * matching Three.js `waternormals.jpg` (multi-octave directional capillary wave heightfield).
 */
function createSeamlessWaterNormalsTexture() {
  const size = 512;
  const data = new Uint8Array(size * size * 4);
  const heights = new Float32Array(size * size);

  const waves = [
    [1, 2, 0.35, 0.4], [2, -1, 0.32, 1.2], [3, 1, 0.25, 2.5], [-2, 3, 0.24, 0.8],
    [4, 3, 0.18, 3.1], [-4, 2, 0.17, 1.9], [5, -3, 0.14, 4.2], [2, 6, 0.13, 2.1],
    [7, -4, 0.10, 0.5], [-6, -5, 0.09, 3.7], [8, 5, 0.08, 1.4], [-9, 4, 0.07, 5.0],
    [11, -7, 0.055, 2.8], [-10, 9, 0.05, 0.9], [13, 8, 0.042, 4.4], [-14, -6, 0.038, 1.7],
    [17, -11, 0.03, 3.3], [-16, 13, 0.028, 2.2], [21, 14, 0.022, 5.1], [-19, -15, 0.02, 0.3],
    [25, -18, 0.015, 1.8], [-24, 21, 0.014, 3.9], [29, 17, 0.011, 2.6], [-28, -23, 0.01, 4.7]
  ];

  const TAU = Math.PI * 2;
  for (let y = 0; y < size; y++) {
    const v = (y / size) * TAU;
    for (let x = 0; x < size; x++) {
      const u = (x / size) * TAU;
      let h = 0;
      for (let i = 0; i < waves.length; i++) {
        const w = waves[i];
        const phase = w[0] * u + w[1] * v + w[3];
        const s = Math.sin(phase);
        h += w[2] * (s + 0.25 * s * s);
      }
      heights[y * size + x] = h;
    }
  }

  const strength = 3.8;
  for (let y = 0; y < size; y++) {
    const yPrev = (y - 1 + size) % size;
    const yNext = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xPrev = (x - 1 + size) % size;
      const xNext = (x + 1) % size;

      const dX = (heights[y * size + xNext] - heights[y * size + xPrev]) * strength;
      const dY = (heights[yNext * size + x] - heights[yPrev * size + x]) * strength;

      let nx = -dX;
      let ny = -dY;
      let nz = 1.0;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * size + x) * 4;
      data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export class OceanSystem {
  constructor(scene, sunDirection) {
    this.scene = scene;
    this.sunDirection = sunDirection.clone().normalize();

    const nearGeo = new THREE.PlaneGeometry(2200, 2200, 320, 320);
    nearGeo.rotateX(-Math.PI / 2);

    this.normalMap = createSeamlessWaterNormalsTexture();

    // Planar reflection render target (just like Three.js `Water.js`)
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.mirrorCamera = new THREE.PerspectiveCamera();
    this.textureMatrix = new THREE.Matrix4();

    this.uniforms = {
      uTime: { value: 0.0 },
      uSunDir: { value: this.sunDirection },
      uSunColor: { value: new THREE.Color(0xfff6e5) },
      uWaterColor: { value: new THREE.Color(0x004e64) },
      uCrestColor: { value: new THREE.Color(0x14bdb6) },
      uCameraPos: { value: new THREE.Vector3() },
      uCraftPos: { value: new THREE.Vector3(0, 0, 0) },
      uCraftVel: { value: new THREE.Vector3(0, 0, 0) },
      uCraftHeading: { value: 0.0 },
      uUnderwater: { value: 0.0 },
      uNormalSampler: { value: this.normalMap },
      uMirrorSampler: { value: this.renderTarget.texture },
      uTextureMatrix: { value: this.textureMatrix },
      uWakeTrail: { value: Array.from({ length: 24 }, () => new THREE.Vector4(0, 0, 9999, 0)) },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform mat4 uTextureMatrix;
        varying vec3 vWorldPos;
        varying vec4 vMirrorCoord;
        varying vec3 vNormal;
        varying float vCrestFactor;
        varying float vZoneScale;

        float getZoneWaveScale(float worldX, float worldZ) {
          float t1 = clamp((-worldZ - 20.0) / 220.0, 0.0, 1.0);
          float s1 = t1 * t1 * (3.0 - 2.0 * t1);
          float t2 = clamp((-worldZ - 420.0) / 280.0, 0.0, 1.0);
          float s2 = t2 * t2 * (3.0 - 2.0 * t2);

          float radialDist = length(vec2(worldX, worldZ));
          float tRad = clamp((radialDist - 350.0) / 750.0, 0.0, 1.0);
          float sRad = tRad * tRad * (3.0 - 2.0 * tRad);

          return 0.58 + max(0.42 * s1 + 0.52 * s2, sRad * 1.05);
        }

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          float x = worldPosition.x;
          float z = worldPosition.z;
          float zoneScale = getZoneWaveScale(x, z);

          float height = 0.0;
          float dHx = 0.0;
          float dHz = 0.0;
          float crestAccum = 0.0;
          const float G = 9.81;
          const float PI2 = 6.28318530718;

          vec4 w0 = vec4(0.25,  0.968, 0.64, 52.0); float sm0 = 1.05; float st0 = 0.44;
          vec4 w1 = vec4(-0.32, 0.947, 0.44, 34.0); float sm1 = 1.15; float st1 = 0.40;
          vec4 w2 = vec4(0.62,  0.784, 0.28, 20.0); float sm2 = 1.25; float st2 = 0.36;
          vec4 w3 = vec4(-0.71, 0.704, 0.19, 14.0); float sm3 = 1.35; float st3 = 0.32;
          vec4 w4 = vec4(0.12, -0.992, 0.13, 9.5);  float sm4 = 1.40; float st4 = 0.28;
          vec4 w5 = vec4(0.88,  0.474, 0.09, 6.4);  float sm5 = 1.55; float st5 = 0.25;
          vec4 w6 = vec4(-0.85, 0.526, 0.07, 4.7);  float sm6 = 1.65; float st6 = 0.22;
          vec4 w7 = vec4(0.44,  0.898, 0.045, 3.3); float sm7 = 1.80; float st7 = 0.20;

          #define EVAL_WAVE(w, sm, st) { \
            float amp = w.z * zoneScale; \
            float k = PI2 / w.w; \
            float omega = sqrt(G * k) * sm; \
            float phase = k * (w.x * x + w.y * z) - omega * uTime; \
            float sinP = sin(phase); \
            float cosP = cos(phase); \
            float crestBoost = 1.0 + 0.18 * st * sinP; \
            height += amp * sinP * crestBoost; \
            float dPhase = amp * k * cosP * (1.0 + 0.36 * st * sinP); \
            dHx += dPhase * w.x; \
            dHz += dPhase * w.y; \
            crestAccum += max(0.0, sinP) * st; \
          }

          EVAL_WAVE(w0, sm0, st0)
          EVAL_WAVE(w1, sm1, st1)
          EVAL_WAVE(w2, sm2, st2)
          EVAL_WAVE(w3, sm3, st3)
          EVAL_WAVE(w4, sm4, st4)
          EVAL_WAVE(w5, sm5, st5)
          EVAL_WAVE(w6, sm6, st6)
          EVAL_WAVE(w7, sm7, st7)

          worldPosition.y = height;
          vWorldPos = worldPosition.xyz;
          vMirrorCoord = uTextureMatrix * vec4(worldPosition.x, 0.0, worldPosition.z, 1.0);
          vNormal = normalize(vec3(-dHx, 1.0, -dHz));
          vCrestFactor = clamp(crestAccum * 0.42 * zoneScale, 0.0, 1.0);
          vZoneScale = zoneScale;

          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        uniform vec3 uWaterColor;
        uniform vec3 uCrestColor;
        uniform vec3 uCameraPos;
        uniform vec3 uCraftPos;
        uniform vec3 uCraftVel;
        uniform float uCraftHeading;
        uniform float uUnderwater;
        uniform sampler2D uNormalSampler;
        uniform sampler2D uMirrorSampler;
        uniform vec4 uWakeTrail[24];

        varying vec3 vWorldPos;
        varying vec4 vMirrorCoord;
        varying vec3 vNormal;
        varying float vCrestFactor;
        varying float vZoneScale;

        // Exact 4-octave normal-map sampling from Three.js Water.js (webgl_shaders_ocean.html)
        vec4 getNoise(vec2 uv) {
          vec2 uv0 = (uv / 28.0) + vec2(uTime / 17.0, uTime / 29.0);
          vec2 uv1 = (uv / 34.0) - vec2(uTime / -19.0, uTime / 31.0);
          vec2 uv2 = (uv / vec2(128.0, 142.0)) + vec2(uTime / 51.0, uTime / 47.0);
          vec2 uv3 = (uv / vec2(9.5, 10.2)) - vec2(uTime / 29.0, uTime / -33.0);
          vec4 noise = texture2D(uNormalSampler, uv0) +
                       texture2D(uNormalSampler, uv1) +
                       texture2D(uNormalSampler, uv2) +
                       texture2D(uNormalSampler, uv3);
          return noise * 0.5 - 1.0;
        }

        void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {
          vec3 reflection = normalize(reflect(-uSunDir, surfaceNormal));
          float direction = max(0.0, dot(eyeDirection, reflection));
          specularColor += pow(direction, shiny) * uSunColor * spec;
          diffuseColor += max(dot(uSunDir, surfaceNormal), 0.0) * uSunColor * diffuse;
        }

        // Analytical Preetham-matched Sky reflection for seamless blending at screen edges or flipped camera angles
        vec3 sampleAnalyticalSky(vec3 reflDir) {
          float y = clamp(reflDir.y, 0.0, 1.0);
          vec3 horizonCol = vec3(0.76, 0.87, 0.94);
          vec3 zenithCol = vec3(0.24, 0.56, 0.82);
          vec3 sky = mix(horizonCol, zenithCol, pow(y, 0.55));
          float sunDot = max(0.0, dot(reflDir, uSunDir));
          sky += uSunColor * (pow(sunDot, 18.0) * 0.25 + pow(sunDot, 220.0) * 1.15);
          return sky;
        }

        void main() {
          vec3 worldToEye = uCameraPos - vWorldPos;
          float dist = length(worldToEye);
          vec3 eyeDirection = normalize(worldToEye);

          vec4 noise = getNoise(vWorldPos.xz * 2.4);
          vec3 detailNormal = normalize(noise.xzy * vec3(1.55, 1.0, 1.55));
          float detailAtten = clamp(1.0 - dist / 460.0, 0.18, 1.0);

          // Combine physical 3D Gerstner wave normal with 4-octave Water.js normal map
          vec3 surfaceNormal = normalize(mix(vNormal, normalize(vNormal + vec3(detailNormal.x, 0.0, detailNormal.z) * 0.92), detailAtten));

          // UNDERWATER WAVE CEILING (Snell's Window & Caustics)
          if (uUnderwater > 0.5 || !gl_FrontFacing) {
            vec3 underN = -surfaceNormal;
            float upDot = max(0.0, dot(eyeDirection, -underN));
            float snellWindow = smoothstep(0.38, 0.78, upDot);
            vec3 deepAbyss = vec3(0.01, 0.16, 0.28);
            vec3 turquoiseCaustic = vec3(0.08, 0.68, 0.78);
            vec3 sunLightWindow = vec3(0.75, 0.96, 1.0);

            vec3 ceilingColor = mix(deepAbyss, turquoiseCaustic, snellWindow * 0.78 + (noise.x * 0.5 + 0.5) * 0.25);
            ceilingColor = mix(ceilingColor, sunLightWindow, pow(snellWindow, 2.8) * 0.88);

            float uwFog = smoothstep(18.0, 150.0, dist);
            gl_FragColor = vec4(mix(ceilingColor, vec3(0.015, 0.26, 0.38), uwFog), 1.0);
            return;
          }

          // ABOVE-WATER PHOTOREALISTIC SHADING (Mirror Reflection + Analytical Sky Fallback + Subsurface Turquoise Scattering + Specular)
          vec3 diffuseLight = vec3(0.0);
          vec3 specularLight = vec3(0.0);
          sunLight(surfaceNormal, eyeDirection, 160.0, 2.35, 0.55, diffuseLight, specularLight);

          vec3 reflDir = reflect(-eyeDirection, surfaceNormal);
          vec3 analyticalSky = sampleAnalyticalSky(reflDir);

          // Sample Planar Mirror Reflection with normal distortion and soft edge fade
          vec3 reflectionSample = analyticalSky;
          if (vMirrorCoord.w > 0.05) {
            vec2 projUV = vMirrorCoord.xy / vMirrorCoord.w;
            vec2 distortion = surfaceNormal.xz * (0.0014 + 0.95 / max(4.5, dist)) * 15.0;
            vec2 reflUV = projUV + distortion;
            // Smoothly fade to analytical sky near UV borders so flipped/rolled cameras never clamp-stretch
            vec2 edgeDist = min(reflUV, 1.0 - reflUV);
            float validUVMask = smoothstep(0.01, 0.12, min(edgeDist.x, edgeDist.y));
            if (validUVMask > 0.001) {
              vec3 mirrorCol = texture2D(uMirrorSampler, clamp(reflUV, 0.002, 0.998)).rgb;
              reflectionSample = mix(analyticalSky, mirrorCol, validUVMask * 0.88);
            }
          }

          // Schlick Fresnel reflectance
          float theta = max(dot(eyeDirection, surfaceNormal), 0.0);
          float rf0 = 0.04;
          float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta), 4.5);

          // Subsurface turquoise scattering through crests & sunlit troughs
          vec3 deepTroughColor = vec3(0.006, 0.18, 0.28);
          vec3 scatterBase = mix(deepTroughColor, uWaterColor, clamp(vWorldPos.y * 0.35 + 0.55, 0.0, 1.0));
          float sssMask = pow(clamp(vCrestFactor * 1.18 + max(0.0, dot(surfaceNormal, -uSunDir)) * 0.36, 0.0, 1.0), 1.25);
          vec3 scatter = mix(scatterBase, uCrestColor, sssMask * 0.88);

          vec3 waterLit = uSunColor * diffuseLight * 0.25 + scatter;
          vec3 reflectedLight = reflectionSample * 0.94 + specularLight;
          vec3 outgoingLight = mix(waterLit, reflectedLight, clamp(reflectance, 0.06, 0.88)) + specularLight * 0.45;

          // Dynamic whitewater foam (Crests + Craft Kelvin Bow V-Wave + Persistent Wake Trail)
          float foamMask = 0.0;
          float foamTex = (noise.x + noise.y) * 0.5 + 0.5;
          float crestFoam = smoothstep(0.56, 0.88, vCrestFactor + foamTex * 0.26) * (0.45 + 0.55 * foamTex);
          foamMask = max(foamMask, crestFoam * 0.65);

          // Hull Kelvin V-wake bow wave & side whitewater churn (matches reference photo's whitewater flanks)
          vec2 relXZ = vWorldPos.xz - uCraftPos.xz;
          float craftDist = length(relXZ);
          float speedMag = length(uCraftVel.xz);
          float speedFactor = clamp(speedMag / 15.0, 0.20, 1.5);
          if (craftDist < 26.0) {
            float sinH = sin(uCraftHeading);
            float cosH = cos(uCraftHeading);
            // Local coordinates relative to craft (localZ > 0 is behind stern, localX is port/starboard)
            float localX = relXZ.x * cosH - relXZ.y * sinH;
            float localZ = relXZ.x * sinH + relXZ.y * cosH;

            float heightProx = clamp(1.0 - abs(uCraftPos.y - vWorldPos.y) * 0.45, 0.0, 1.0);
            float hullRing = smoothstep(5.2 * speedFactor, 0.9, craftDist);
            foamMask = max(foamMask, hullRing * (0.48 + 0.52 * foamTex) * heightProx);

            // Expanding V-shape Kelvin wake arms behind the craft
            if (localZ > -1.0 && localZ < 24.0 && speedMag > 2.5) {
              float vWidth = 0.55 + max(0.0, localZ) * 0.34;
              float armDist = abs(abs(localX) - vWidth);
              float vArm = smoothstep(1.25, 0.15, armDist) * smoothstep(24.0, 1.0, localZ);
              float centerJet = smoothstep(1.1, 0.1, abs(localX)) * smoothstep(18.0, 0.5, localZ);
              foamMask = max(foamMask, max(vArm * 0.85, centerJet * 0.92) * (0.45 + 0.55 * foamTex) * heightProx);
            }
          }

          // Persistent curved wake trail points
          for (int i = 0; i < 24; i++) {
            vec4 wp = uWakeTrail[i];
            if (wp.w > 0.01) {
              float d = length(vWorldPos.xz - wp.xy);
              float radius = wp.z;
              float wFoam = smoothstep(radius, radius * 0.15, d) * wp.w * (0.5 + 0.5 * foamTex);
              foamMask = max(foamMask, wFoam * 0.84);
            }
          }

          vec3 foamAlbedo = vec3(0.95, 0.99, 1.0);
          outgoingLight = mix(outgoingLight, foamAlbedo, clamp(foamMask, 0.0, 0.93));

          // Distance atmospheric blend into the physical Sky horizon
          float fogFactor = smoothstep(420.0, 1150.0, dist);
          vec3 horizonHaze = vec3(0.76, 0.86, 0.92);
          outgoingLight = mix(outgoingLight, horizonHaze, fogFactor);

          gl_FragColor = vec4(outgoingLight, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(nearGeo, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;

    // Hook up real-time planar reflection pass (adapted from Three.js `Water.js`)
    const scope = this;
    const mirrorPlane = new THREE.Plane();
    const normal = new THREE.Vector3(0, 1, 0);
    const mirrorWorldPosition = new THREE.Vector3();
    const cameraWorldPosition = new THREE.Vector3();
    const rotationMatrix = new THREE.Matrix4();
    const lookAtPosition = new THREE.Vector3(0, 0, -1);
    const clipPlane = new THREE.Vector4();
    const view = new THREE.Vector3();
    const target = new THREE.Vector3();
    const q = new THREE.Vector4();

    this.mesh.onBeforeRender = function (renderer, scene, camera) {
      if (scope.uniforms.uUnderwater.value > 0.5) return;

      mirrorWorldPosition.set(scope.mesh.position.x, 0, scope.mesh.position.z);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
      if (cameraWorldPosition.y < 0.05) return;

      normal.set(0, 1, 0);
      view.subVectors(mirrorWorldPosition, cameraWorldPosition);
      if (view.dot(normal) > 0) return;

      view.reflect(normal).negate();
      view.add(mirrorWorldPosition);

      rotationMatrix.extractRotation(camera.matrixWorld);
      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);

      target.subVectors(mirrorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(mirrorWorldPosition);

      scope.mirrorCamera.position.copy(view);
      scope.mirrorCamera.up.set(0, 1, 0);
      scope.mirrorCamera.up.applyMatrix4(rotationMatrix);
      scope.mirrorCamera.up.reflect(normal);
      scope.mirrorCamera.lookAt(target);
      scope.mirrorCamera.far = camera.far;
      scope.mirrorCamera.updateMatrixWorld();
      scope.mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

      scope.textureMatrix.set(
        0.5, 0.0, 0.0, 0.5,
        0.0, 0.5, 0.0, 0.5,
        0.0, 0.0, 0.5, 0.5,
        0.0, 0.0, 0.0, 1.0
      );
      scope.textureMatrix.multiply(scope.mirrorCamera.projectionMatrix);
      scope.textureMatrix.multiply(scope.mirrorCamera.matrixWorldInverse);

      mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
      mirrorPlane.applyMatrix4(scope.mirrorCamera.matrixWorldInverse);

      clipPlane.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);
      const projectionMatrix = scope.mirrorCamera.projectionMatrix;

      q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
      q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
      q.z = -1.0;
      q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0 - 0.06;
      projectionMatrix.elements[14] = clipPlane.w;

      const currentRenderTarget = renderer.getRenderTarget();
      const currentXrEnabled = renderer.xr.enabled;
      const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

      scope.mesh.visible = false;
      if (scope.craftRoot) scope.craftRoot.visible = false;

      renderer.xr.enabled = false;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(scope.renderTarget);
      renderer.state.buffers.depth.setMask(true);
      if (renderer.autoClear === false) renderer.clear();
      renderer.render(scene, scope.mirrorCamera);

      scope.mesh.visible = true;
      if (scope.craftRoot) scope.craftRoot.visible = true;
      renderer.xr.enabled = currentXrEnabled;
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
      renderer.setRenderTarget(currentRenderTarget);

      const viewport = camera.viewport;
      if (viewport !== undefined) renderer.state.viewport(viewport);
    };

    this.scene.add(this.mesh);

    this.wakePoints = Array.from({ length: 24 }, () => ({
      x: 0,
      z: 9999,
      radius: 2.0,
      alpha: 0.0,
    }));
    this.wakeTimer = 0;
    this.wakeIndex = 0;
  }

  setCraftReference(craftRoot) {
    this.craftRoot = craftRoot;
  }

  update(dt, elapsedTime, cameraPos, craftState, isCameraUnderwater) {
    this.uniforms.uTime.value = elapsedTime;
    this.uniforms.uCameraPos.value.copy(cameraPos);
    this.uniforms.uCraftPos.value.copy(craftState.position);
    this.uniforms.uCraftVel.value.copy(craftState.velocity);
    this.uniforms.uCraftHeading.value = craftState.heading;
    this.uniforms.uUnderwater.value = isCameraUnderwater ? 1.0 : 0.0;

    const snap = 5.0;
    this.mesh.position.x = Math.round(craftState.position.x / snap) * snap;
    this.mesh.position.z = Math.round(craftState.position.z / snap) * snap;

    this.wakeTimer += dt;
    const speed2D = Math.hypot(craftState.velocity.x, craftState.velocity.z);
    if (this.wakeTimer >= 0.06) {
      this.wakeTimer = 0;
      if (!craftState.isAirborne && !craftState.isSubmerged && speed2D > 2.0) {
        const pt = this.wakePoints[this.wakeIndex];
        const backX = craftState.position.x + Math.sin(craftState.heading) * 1.8;
        const backZ = craftState.position.z + Math.cos(craftState.heading) * 1.8;
        pt.x = backX;
        pt.z = backZ;
        pt.radius = 1.6 + Math.min(3.8, speed2D * 0.098);
        pt.alpha = Math.min(1.0, 0.38 + speed2D * 0.035);
        this.wakeIndex = (this.wakeIndex + 1) % this.wakePoints.length;
      }
    }

    for (let i = 0; i < 24; i++) {
      const pt = this.wakePoints[i];
      if (pt.alpha > 0.001) {
        pt.alpha = Math.max(0, pt.alpha - dt * 0.36);
        pt.radius += dt * 2.3;
      }
      this.uniforms.uWakeTrail.value[i].set(pt.x, pt.z, pt.radius, pt.alpha);
    }
  }
}
