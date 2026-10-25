import * as THREE from './vendor/three.module.js';
import { FirstPersonJetSkiRig } from './cockpit_rig.js?v=18';

/**
 * Jet Ski POV — Retina 3D Ocean, Luminous Sun, Reachable 3D Sail Tower & Tropical Archipelago,
 * Wave-Launch Jumping, 360° Backflips/Frontflips/Barrel Rolls, and Stunt Tricks.
 */

const OCEAN_VERTEX_SHADER = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const OCEAN_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUV;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCameraPos;
uniform mat3 uCameraBasis; // columns: right, up, forward
uniform float uFovTan;

uniform vec3 uSunDir;
uniform float uChoppy;
uniform float uWaveAmp;
uniform float uHazeAmount;
uniform float uTurquoiseBoost;
uniform float uSpeedKts;
uniform float uSteerAngle;
uniform float uUnderwater;
uniform float uSplashBurst;

const float PI = 3.14159265359;
const int NUM_STEPS = 11;
const int ITER_GEOMETRY = 4;
const int ITER_FRAGMENT = 8;

const mat2 OCTAVE_M = mat2(1.6, 1.2, -1.2, 1.6);

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return -1.0 + 2.0 * mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float seaOctave(vec2 uv, float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

float mapSeaGeometry(vec3 p) {
  float freq = 0.19;
  float amp = 0.52 * uWaveAmp;
  float choppy = 3.8 * uChoppy;
  vec2 uv = p.xz * 0.85;
  uv.x *= 0.78;

  float d, h = 0.0;
  float seaTime = 1.0 + uTime * 0.82;
  for (int i = 0; i < ITER_GEOMETRY; i++) {
    d = seaOctave((uv + seaTime) * freq, choppy);
    d += seaOctave((uv - seaTime) * freq, choppy);
    h += d * amp;
    uv *= OCTAVE_M;
    freq *= 1.92;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

float mapSeaDetailed(vec3 p) {
  float freq = 0.19;
  float amp = 0.52 * uWaveAmp;
  float choppy = 3.8 * uChoppy;
  vec2 uv = p.xz * 0.85;
  uv.x *= 0.78;

  float d, h = 0.0;
  float seaTime = 1.0 + uTime * 0.82;
  for (int i = 0; i < ITER_FRAGMENT; i++) {
    d = seaOctave((uv + seaTime) * freq, choppy);
    d += seaOctave((uv - seaTime) * freq, choppy);
    h += d * amp;
    uv *= OCTAVE_M;
    freq *= 1.92;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return p.y - h;
}

vec3 getSeaNormal(vec3 p, float eps) {
  vec3 n;
  n.y = mapSeaDetailed(p);
  n.x = mapSeaDetailed(vec3(p.x + eps, p.y, p.z)) - n.y;
  n.z = mapSeaDetailed(vec3(p.x, p.y, p.z + eps)) - n.y;
  n.y = eps;
  return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
  float tm = 0.0;
  float tx = 1600.0;
  float hx = mapSeaGeometry(ori + dir * tx);
  if (hx > 0.0) {
    p = ori + dir * tx;
    return tx;
  }
  float hm = mapSeaGeometry(ori + dir * tm);
  float tmid = 0.0;
  for (int i = 0; i < NUM_STEPS; i++) {
    tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;
    float hmid = mapSeaGeometry(p);
    if (hmid < 0.0) {
      tx = tmid;
      hx = hmid;
    } else {
      tm = tmid;
      hm = hmid;
    }
  }
  return tmid;
}

// Vibrant, Luminous Azure-Blue Sky + Brilliant Visible Solar Disc, Corona & Sunburst Rays
vec3 getSkyColor(vec3 e) {
  float y = clamp(max(e.y, 0.0), 0.0, 1.0);

  vec3 zenithBlue  = vec3(0.02, 0.30, 0.84); // Deep, brilliant cobalt-azure zenith
  vec3 midSkyBlue  = vec3(0.07, 0.50, 0.94); // Vibrant sun-lit sky blue across main view
  vec3 horizonBlue = vec3(0.18, 0.62, 0.96); // Rich saturated azure horizon

  vec3 sky = mix(horizonBlue, midSkyBlue, smoothstep(0.0, 0.24, y));
  sky = mix(sky, zenithBlue, smoothstep(0.20, 0.85, y));

  // Brilliant visible sun disc + golden-white corona + subtle starburst rays
  float sunAmt = max(dot(e, uSunDir), 0.0);
  float cosAngle = dot(e, uSunDir);
  float sunDisc = smoothstep(0.9990, 0.99965, cosAngle);
  float sunInnerHalo = pow(sunAmt, 140.0) * 1.35 + pow(sunAmt, 36.0) * 0.42;
  float sunOuterCorona = pow(sunAmt, 8.0) * 0.24;

  // Starburst diffraction rays around the sun
  vec3 sunRight = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)));
  vec3 sunUp = cross(sunRight, uSunDir);
  vec2 sunPlane = vec2(dot(e, sunRight), dot(e, sunUp));
  float rayAngle = atan(sunPlane.y, sunPlane.x);
  float starRays = pow(max(0.0, cos(rayAngle * 6.0) * 0.5 + 0.5), 8.0) * pow(sunAmt, 42.0) * 0.45;

  sky += vec3(0.16, 0.38, 0.58) * sunOuterCorona;
  sky += vec3(1.0, 0.94, 0.76) * (sunInnerHalo + starRays);
  sky += vec3(3.5, 3.3, 2.8) * sunDisc;
  return sky;
}

// ============================================================================
// REACHABLE 3D WORLD LANDMARKS:
//  1. Iconic Sail Tower (Burj Al Arab) & Resort Island at world (0.0, 0.0, -520.0)
//  2. Palm Lagoon Island at world (-195.0, 0.0, -340.0)
//  3. Coral Atoll & Lighthouse Island at world (210.0, 0.0, -370.0)
//  4. Twin Limestone Sea Stacks / Jump Arch at world (-85.0, 0.0, -175.0)
// ============================================================================
float getIslandHeight(vec2 xz, out int matType) {
  matType = 0; // 0: sand/rock, 1: lush tropical palm canopy, 2: sail tower structure
  float h = -10.0;
  float detail = noise(xz * 0.09) * 2.4 + noise(xz * 0.26) * 0.95 + noise(xz * 0.65) * 0.35;

  // 1. Main Sail Tower Base Island at (0, -520)
  vec2 pSail = xz - vec2(0.0, -520.0);
  float rSailIsl = length(pSail * vec2(0.75, 1.05));
  if (rSailIsl < 68.0) {
    float baseH = (1.0 - smoothstep(18.0, 65.0, rSailIsl)) * 5.2;
    if (baseH > h) {
      h = baseH;
      matType = baseH > 2.2 ? 1 : 0;
    }
  }

  // 2. Western Tropical Palm Island at (-195, -340)
  vec2 pWest = xz - vec2(-195.0, -340.0);
  float nW = noise(xz * 0.038) * 10.5 + detail;
  float rWest = length(pWest * vec2(0.82, 1.12)) + nW;
  if (rWest < 96.0) {
    float wH = pow(max(0.0, 1.0 - rWest / 92.0), 1.45) * 29.0 + detail * 0.85;
    if (wH > h) {
      h = wH;
      matType = wH > 2.8 ? 1 : 0;
    }
  }

  // 3. Eastern Volcanic Cliff & Resort Island at (185, -345)
  vec2 pEast = xz - vec2(185.0, -345.0);
  float nE = noise(xz * 0.045 + 4.2) * 10.0 + detail;
  float rEast = length(pEast * vec2(0.95, 0.85)) + nE;
  if (rEast < 105.0) {
    float eH = pow(max(0.0, 1.0 - rEast / 102.0), 1.35) * 35.0 + detail * 1.1;
    if (eH > h) {
      h = eH;
      matType = (eH > 3.2 && eH < 22.0) ? 1 : 0;
    }
  }

  // 4. Nearshore Limestone Sea Stack & Lagoon Cay at (-78, -175) — closely reachable in seconds!
  vec2 pCay = xz - vec2(-78.0, -175.0);
  float rCay = length(pCay * vec2(1.05, 0.9)) + detail * 1.35;
  if (rCay < 40.0) {
    float cH = pow(max(0.0, 1.0 - rCay / 38.0), 1.35) * 16.5 + detail * 0.75;
    if (cH > h) {
      h = cH;
      matType = cH > 2.2 ? 1 : 0;
    }
  }

  // 5. Starboard Sandbar & Palm Cay at (82, -190) — visible on the right side!
  vec2 pStar = xz - vec2(82.0, -190.0);
  float rStar = length(pStar * vec2(0.88, 1.10)) + detail * 1.3;
  if (rStar < 45.0) {
    float sH = pow(max(0.0, 1.0 - rStar / 43.0), 1.35) * 15.5 + detail * 0.7;
    if (sH > h) {
      h = sH;
      matType = sH > 2.0 ? 1 : 0;
    }
  }

  return h;
}

// Analytic 3D Ray-Intersection with the Sail Tower (Burj Al Arab) at (0, 0, -520)
// Real-world scale: 145 meters tall so you can drive right up to the base of the tower!
bool traceSailTower(vec3 ro, vec3 rd, float maxT, out float hitT, out vec3 hitPos, out vec3 hitNorm, out vec3 hitAlbedo) {
  vec3 towerCenter = vec3(0.0, 0.0, -520.0);
  vec2 oc = ro.xz - towerCenter.xz;
  float a = dot(rd.xz, rd.xz);
  float b = 2.0 * dot(oc, rd.xz);
  float c = dot(oc, oc) - 42.0 * 42.0;
  float disc = b * b - 4.0 * a * c;
  if (disc < 0.0) return false;

  float t0 = max(0.0, (-b - sqrt(disc)) / (2.0 * a));
  float t1 = min(maxT, (-b + sqrt(disc)) / (2.0 * a));
  if (t0 > t1) return false;

  float t = t0;
  float dt = (t1 - t0) / 48.0;
  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    vec3 lp = p - towerCenter;
    if (lp.y >= 0.0 && lp.y <= 162.0) {
      float hNorm = clamp(lp.y / 140.0, 0.0, 1.0);
      // Spire mast above the sail (132m to 160m)
      if (lp.y > 128.0 && abs(lp.x + 5.5) < 1.35 && abs(lp.z) < 1.35) {
        hitT = t;
        hitPos = p;
        hitNorm = normalize(vec3(lp.x + 5.5, 0.1, lp.z));
        hitAlbedo = vec3(0.96, 0.99, 1.0);
        return true;
      }
      // Iconic billowing sail profile in X-Y-Z
      float sailCurve = sin(hNorm * PI * 0.88) * 22.5;
      float halfWidthZ = 10.0 * (1.0 - hNorm * 0.62);
      float xMin = -8.0;
      float xMax = -5.5 + sailCurve;
      if (hNorm <= 1.0 && lp.x >= xMin && lp.x <= xMax && abs(lp.z) <= halfWidthZ * (0.42 + 0.58 * (lp.x - xMin) / max(1.0, xMax - xMin))) {
        hitT = t;
        hitPos = p;
        vec3 n = normalize(vec3(lp.x - (-2.0), 0.15, lp.z * 2.2));
        hitNorm = n;

        float diag1 = abs(sin(lp.y * 0.19 + lp.x * 0.19));
        float diag2 = abs(sin(lp.y * 0.19 - lp.x * 0.19));
        float floors = abs(sin(lp.y * 0.85));
        float mastSpine = smoothstep(2.6, 0.8, abs(lp.x - xMin));
        float outerArch = smoothstep(2.4, 0.6, abs(lp.x - xMax));
        float truss = smoothstep(0.90, 0.97, max(min(diag1, diag2), floors));
        float skybridge = smoothstep(3.0, 0.8, abs(lp.y - 108.0));
        float helipad = smoothstep(2.0, 0.5, abs(lp.y - 118.0)) * step(2.0, lp.x);
        vec3 glassCol = mix(vec3(0.14, 0.48, 0.78), vec3(0.38, 0.74, 0.96), clamp(hNorm, 0.0, 1.0));
        vec3 whiteTeflon = vec3(0.96, 0.99, 1.0);
        float frameMask = max(max(mastSpine, outerArch), max(truss * 0.85, max(skybridge, helipad)));
        hitAlbedo = mix(glassCol, whiteTeflon, frameMask);
        return true;
      }
    }
    t += dt;
  }
  return false;
}

// Raymarch 3D Archipelago Islands with Binary Refinement (Zero Stairstepping!)
bool traceIslands(vec3 ro, vec3 rd, float maxT, out float hitT, out vec3 hitPos, out vec3 hitNorm, out vec3 hitColor) {
  if (rd.y > 0.32) return false;
  float t = 18.0;
  float prevT = t;
  float tEnd = min(maxT, 720.0);
  for (int i = 0; i < 64; i++) {
    if (t > tEnd) break;
    vec3 p = ro + rd * t;
    if (p.y < 38.0) {
      int matType;
      float h = getIslandHeight(p.xz, matType);
      if (h > 0.0 && p.y <= h) {
        // 5-step binary refinement between prevT and t for razor-smooth terrain surface
        float ta = prevT;
        float tb = t;
        for (int b = 0; b < 5; b++) {
          float tm = 0.5 * (ta + tb);
          vec3 pm = ro + rd * tm;
          int m2;
          if (pm.y <= getIslandHeight(pm.xz, m2)) {
            tb = tm;
          } else {
            ta = tm;
          }
        }
        hitT = 0.5 * (ta + tb);
        hitPos = ro + rd * hitT;
        int mDummy;
        float hFinal = getIslandHeight(hitPos.xz, mDummy);
        float eps = 0.45;
        float hx = getIslandHeight(hitPos.xz + vec2(eps, 0.0), mDummy) - hFinal;
        float hz = getIslandHeight(hitPos.xz + vec2(0.0, eps), mDummy) - hFinal;
        hitNorm = normalize(vec3(-hx, eps, -hz));

        // Tropical white coral sand beach near waterline, limestone rock, and lush palm canopy above
        vec3 beachSand = vec3(0.95, 0.90, 0.78);
        float fTex = noise(hitPos.xz * 0.45) * 0.5 + 0.5;
        vec3 tropicalFoliage = mix(vec3(0.09, 0.40, 0.20), vec3(0.26, 0.60, 0.28), fTex);
        vec3 cliffRock = mix(vec3(0.52, 0.49, 0.44), vec3(0.66, 0.62, 0.56), fTex);

        float slope = 1.0 - hitNorm.y;
        vec3 baseCol = mix(beachSand, tropicalFoliage, smoothstep(1.2, 3.8, hFinal));
        baseCol = mix(baseCol, cliffRock, smoothstep(0.28, 0.58, slope) * smoothstep(1.8, 5.5, hFinal));
        hitColor = baseCol;
        return true;
      }
    }
    prevT = t;
    t += max(2.2, t * 0.022);
  }
  return false;
}

// Distant Coastal Skyline Silhouette on the northern horizon behind the 3D islands
vec3 applyDistantCoastlineSilhouette(vec3 skyCol, vec3 rd) {
  if (rd.z >= -0.05 || rd.y < -0.015 || rd.y > 0.12) return skyCol;

  float azim = atan(rd.x, -rd.z);
  float elev = rd.y;

  float coastStrip = smoothstep(0.0038, 0.0008, elev) * smoothstep(0.95, 0.25, abs(azim));
  vec3 sandCol = mix(vec3(0.76, 0.82, 0.88), skyCol, 0.35);

  float sailMask = 0.0;
  vec3 buildingCol = vec3(0.46, 0.72, 0.92);

  float cityX = azim * 18.5;
  float cityY = elev * 18.5;
  if (cityY > 0.0 && cityY < 0.35 && cityX > 2.2 && cityX < 9.5) {
    float cell = floor(cityX * 6.5);
    float bHeight = hash(vec2(cell, 4.0)) * 0.24 * smoothstep(2.2, 4.5, cityX);
    float bGap = step(0.28, fract(cityX * 6.5));
    if (cityY < bHeight && bGap > 0.5) {
      sailMask = max(sailMask, 0.78);
    }
  }

  float hazeMix = clamp(uHazeAmount * 0.32, 0.06, 0.42);
  vec3 hazedBuilding = mix(buildingCol, skyCol, hazeMix);
  vec3 col = mix(skyCol, sandCol, coastStrip * 0.65);
  col = mix(col, hazedBuilding, sailMask * smoothstep(0.0, 0.0018, elev));
  return col;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
  float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
  fresnel = pow(fresnel, 3.5) * 0.48;

  vec3 reflected = getSkyColor(reflect(eye, n));

  // Rich Arabian Gulf deep teal-turquoise palette + shallow turquoise lagoon glow around islands
  vec3 seaBase = vec3(0.005, 0.13, 0.21);
  vec3 seaWaterColor = vec3(0.02, 0.46, 0.52) * uTurquoiseBoost;

  // Shallow coral reef turquoise brightening near our 3D islands
  float dSail = length(p.xz - vec2(0.0, -520.0));
  float dWest = length(p.xz - vec2(-195.0, -340.0));
  float dEast = length(p.xz - vec2(210.0, -370.0));
  float dCay  = length(p.xz - vec2(-78.0, -175.0));
  float dStar = length(p.xz - vec2(88.0, -210.0));
  float shallowFactor = max(
    max(smoothstep(115.0, 48.0, dSail), smoothstep(140.0, 65.0, min(dWest, dEast))),
    smoothstep(68.0, 26.0, min(dCay, dStar))
  );
  seaWaterColor = mix(seaWaterColor, vec3(0.06, 0.78, 0.76) * uTurquoiseBoost, shallowFactor * 0.65);

  float diffuse = pow(dot(n, l) * 0.4 + 0.6, 80.0);
  vec3 refracted = seaBase + diffuse * seaWaterColor * 0.24;

  float waveHeight = clamp((p.y + 0.6 * uWaveAmp) / max(0.01, 1.45 * uWaveAmp), 0.0, 1.0);
  float crestGlow = pow(waveHeight, 1.65) * (0.40 + 0.60 * max(0.0, dot(n, -eye)));
  refracted += vec3(0.04, 0.56, 0.60) * uTurquoiseBoost * crestGlow * 0.44;

  // White surf breaking ring around island shorelines
  if (shallowFactor > 0.25) {
    int mDummy;
    float islH = getIslandHeight(p.xz, mDummy);
    float shoreFoam = smoothstep(-2.4, 0.2, islH) * (0.55 + 0.45 * sin(uTime * 3.2 + islH * 6.0));
    refracted = mix(refracted, vec3(0.92, 0.98, 1.0), clamp(shoreFoam * 0.75, 0.0, 0.85));
  }

  vec3 color = mix(refracted, reflected, fresnel);

  float atten = max(1.0 - dot(dist, dist) * 0.00025, 0.0);
  color += seaWaterColor * (p.y - 0.35 * uWaveAmp) * 0.14 * atten;

  vec3 reflLight = reflect(-l, n);
  float spec = pow(max(dot(reflLight, -eye), 0.0), 110.0);
  float tightGlint = pow(max(dot(reflLight, -eye), 0.0), 750.0);
  color += vec3(1.0, 0.98, 0.92) * (spec * 0.42 + tightGlint * 1.85);

  vec3 relWorld = p - uCameraPos;
  vec2 fwdXZ = normalize(vec2(uCameraBasis[2].x, uCameraBasis[2].z));
  vec2 rightXZ = vec2(-fwdXZ.y, fwdXZ.x);
  float localFwd = dot(relWorld.xz, fwdXZ);
  float localSide = dot(relWorld.xz, rightXZ);
  float dist2D = length(relWorld.xz);

  // Port & Starboard hull chine whitewater spray & splashdown burst
  if (dist2D < 26.0 && localFwd > -2.0 && localFwd < 14.5 && (abs(localSide) > 0.60 || uSplashBurst > 0.05) && uSpeedKts > 1.0) {
    float fNoise1 = noise(p.xz * 7.2 + vec2(0.0, uTime * 7.5)) * 0.5 + 0.5;
    float fNoise2 = noise(p.xz * 19.5 - vec2(uTime * 3.5, uTime * 10.5)) * 0.5 + 0.5;
    float fNoise3 = noise(p.xz * 42.0 + vec2(uTime * 6.0, uTime * 14.0)) * 0.5 + 0.5;
    float dropletPattern = smoothstep(0.32, 0.74, fNoise1 * 0.48 + fNoise2 * 0.36 + fNoise3 * 0.16);
    float fineDroplets = smoothstep(0.66, 0.86, fNoise2 * 0.45 + fNoise3 * 0.55);

    float hullHalfWidth = 0.76 + max(0.0, localFwd - 0.8) * 0.19;
    float sideSpread = abs(abs(localSide) - hullHalfWidth);
    float flankSpray = smoothstep(1.55 + uSplashBurst * 1.8, 0.05, sideSpread) * smoothstep(13.5, 1.2, localFwd) * smoothstep(-1.4, 0.8, localFwd);

    float speedScale = clamp(uSpeedKts / 20.0, 0.15, 1.45) + uSplashBurst * 1.25;
    float foamAmt = flankSpray * speedScale * max(dropletPattern, fineDroplets * 1.15);
    color = mix(color, vec3(0.96, 0.995, 1.0), clamp(foamAmt * 0.94, 0.0, 0.96));
  }

  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  vec3 rdLocal = normalize(vec3(uv.x * uFovTan, uv.y * uFovTan, 1.0));
  vec3 rd = normalize(uCameraBasis * rdLocal);
  vec3 ro = uCameraPos;

  vec3 sky = getSkyColor(rd);
  sky = applyDistantCoastlineSilhouette(sky, rd);

  vec3 color = sky;

  if (uUnderwater > 0.5) {
    vec3 p;
    heightMapTracing(ro, vec3(rd.x, abs(rd.y) + 0.05, rd.z), p);
    vec3 dist = p - ro;
    vec3 n = getSeaNormal(p, dot(dist, dist) * (0.15 / uResolution.x));
    float snell = smoothstep(0.35, 0.82, max(0.0, rd.y));
    vec3 abyss = vec3(0.01, 0.18, 0.32);
    vec3 caustic = vec3(0.06, 0.66, 0.78) * (0.7 + 0.3 * n.x);
    color = mix(abyss, caustic, snell);
    color += vec3(0.65, 0.95, 1.0) * pow(snell, 3.5) * 0.65;
  } else {
    float seaT = 1600.0;
    vec3 seaPos = ro + rd * seaT;
    bool hitSea = false;

    if (rd.y < 0.12) {
      seaT = heightMapTracing(ro, rd, seaPos);
      if (seaT < 1550.0) {
        hitSea = true;
      }
    }

    // Trace 3D Archipelago Islands and 3D Sail Tower against seaT
    float bestT = hitSea ? seaT : 1600.0;
    int hitObj = hitSea ? 1 : 0; // 1 = sea, 2 = island, 3 = sail tower
    vec3 objPos, objNorm, objAlbedo;

    float islT;
    vec3 islPos, islNorm, islCol;
    if (traceIslands(ro, rd, bestT, islT, islPos, islNorm, islCol)) {
      bestT = islT;
      hitObj = 2;
      objPos = islPos;
      objNorm = islNorm;
      objAlbedo = islCol;
    }

    float towT;
    vec3 towPos, towNorm, towCol;
    if (traceSailTower(ro, rd, bestT, towT, towPos, towNorm, towCol)) {
      bestT = towT;
      hitObj = 3;
      objPos = towPos;
      objNorm = towNorm;
      objAlbedo = towCol;
    }

    if (hitObj == 1) {
      vec3 dist = seaPos - ro;
      float eps = max(0.0015, dot(dist, dist) * (0.11 / uResolution.x));
      vec3 n = getSeaNormal(seaPos, eps);
      vec3 sea = getSeaColor(seaPos, n, uSunDir, rd, dist);

      float horizonBlend = pow(smoothstep(0.02, -0.032, rd.y), 0.85);
      float distFog = exp(-length(dist.xz) * (0.0005 + uHazeAmount * 0.0007));
      color = mix(sky, sea, horizonBlend * distFog);
    } else if (hitObj == 2 || hitObj == 3) {
      float diff = max(dot(objNorm, uSunDir), 0.0);
      float amb = 0.38 + 0.22 * objNorm.y;
      vec3 lit = objAlbedo * (amb * vec3(0.78, 0.90, 1.0) + diff * vec3(1.05, 0.98, 0.88) * 0.88);
      if (hitObj == 3) {
        vec3 refl = reflect(rd, objNorm);
        float spec = pow(max(dot(refl, uSunDir), 0.0), 64.0);
        lit += vec3(1.0, 0.96, 0.86) * spec * 0.55;
      }
      float fog = exp(-bestT * (0.00065 + uHazeAmount * 0.0008));
      color = mix(sky, lit, fog);
    }
  }

  color = color / (1.0 + color * 0.18);
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.15));

  fragColor = vec4(color, 1.0);
}
`;

const OCTAVE_M_CPU = [1.6, 1.2, -1.2, 1.6];

function fract(x) {
  return x - Math.floor(x);
}

function hashCPU(x, y) {
  const h = x * 127.1 + y * 311.7;
  return fract(Math.sin(h) * 43758.5453123);
}

function noiseCPU(px, py) {
  const ix = Math.floor(px);
  const iy = Math.floor(py);
  const fx = px - ix;
  const fy = py - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  const a = hashCPU(ix, iy);
  const b = hashCPU(ix + 1, iy);
  const c = hashCPU(ix, iy + 1);
  const d = hashCPU(ix + 1, iy + 1);

  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return -1.0 + 2.0 * (ab + (cd - ab) * uy);
}

function seaOctaveCPU(uvx, uvy, choppy) {
  const n = noiseCPU(uvx, uvy);
  const x = uvx + n;
  const y = uvy + n;
  let wvx = 1.0 - Math.abs(Math.sin(x));
  let wvy = 1.0 - Math.abs(Math.sin(y));
  const swvx = Math.abs(Math.cos(x));
  const swvy = Math.abs(Math.cos(y));
  wvx = wvx + (swvx - wvx) * wvx;
  wvy = wvy + (swvy - wvy) * wvy;
  return Math.pow(1.0 - Math.pow(wvx * wvy, 0.65), choppy);
}

export function sampleCPUWaveHeight(wx, wz, time, waveAmp = 0.85, choppyScale = 1.0) {
  let freq = 0.19;
  let amp = 0.52 * waveAmp;
  let choppy = 3.8 * choppyScale;
  let uvx = wx * 0.85 * 0.78;
  let uvy = wz * 0.85;

  let h = 0.0;
  const seaTime = 1.0 + time * 0.82;
  for (let i = 0; i < 3; i++) {
    let d = seaOctaveCPU((uvx + seaTime) * freq, (uvy + seaTime) * freq, choppy);
    d += seaOctaveCPU((uvx - seaTime) * freq, (uvy - seaTime) * freq, choppy);
    h += d * amp;
    const nx = OCTAVE_M_CPU[0] * uvx + OCTAVE_M_CPU[2] * uvy;
    const ny = OCTAVE_M_CPU[1] * uvx + OCTAVE_M_CPU[3] * uvy;
    uvx = nx;
    uvy = ny;
    freq *= 1.92;
    amp *= 0.22;
    choppy = choppy + (1.0 - choppy) * 0.2;
  }
  return h;
}

class OceanLookAndFeelStudio {
  constructor() {
    this.canvas = document.getElementById('ocean-canvas');
    this.cockpitCanvas = document.getElementById('cockpit-canvas');
    const urlParams = new URLSearchParams(window.location.search);
    this.evalMode = urlParams.has('eval');
    this.evalSteer = parseFloat(urlParams.get('steer') || '0');
    this.evalJump = urlParams.get('jump') || ''; // 'jump' | 'flip' | 'roll'
    this.evalZ = parseFloat(urlParams.get('z') || '0');

    this.gl = this.canvas.getContext('webgl2', {
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    const retinaDpr = Math.min(window.devicePixelRatio || 2, 2.5);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.cockpitCanvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(retinaDpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Sun positioned in the forward sky (21 deg elevation, -18 deg azimuth) so the glowing solar disc is visible!
    this.params = {
      choppy: 1.0,
      waveAmp: 0.85,
      speedKts: 28.0,
      sunElevDeg: 21.0,
      sunAzimDeg: -18.0,
      hazeAmount: 0.30,
      turquoiseBoost: 1.05,
      showCockpit: true,
    };

    this.position = { x: 0.0, y: 1.52, z: this.evalZ };
    this.heading = 0.0;
    this.pitch = -0.025;
    this.roll = 0.0;
    this.steerSmooth = 0.0;

    // 3D Wave-Launch Jump, Flip & Trick Physics State
    this.verticalVel = 0.0;
    this.isAirborne = false;
    this.airTime = 0.0;
    this.peakAltitudeFt = 0.0;
    this.flipPitchAngle = 0.0;
    this.flipPitchRate = 0.0;
    this.barrelRollAngle = 0.0;
    this.barrelRollRate = 0.0;
    this.activeTrickName = '';
    this.trickPhase = 0.0;
    this.totalScore = 0;
    this.landingShock = 0.0;
    this.splashBurst = 0.0;
    this.bannerTimer = 0.0;
    this.lastSpacePressTime = 0.0;

    this.lookYawOffset = 0.0;
    this.lookPitchOffset = 0.0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    this.keys = {
      w: false,
      s: false,
      a: false,
      d: false,
      dive: false,
    };

    this.elapsedTime = 0.0;
    this.lastTime = performance.now();

    this._initOceanRaymarchGL();
    this._initThreeCockpitScene();
    this._bindEvents();
    this._bindUI();
    this._resize();

    if (this.evalJump) {
      this._setupEvalJumpSnapshot(this.evalJump);
    }

    requestAnimationFrame((t) => this._frame(t));
  }

  _setupEvalJumpSnapshot(mode) {
    this.isAirborne = true;
    this.airTime = 0.85;
    this.position.y = 8.4;
    this.peakAltitudeFt = 24;
    if (mode === 'flip') {
      this.activeTrickName = '360° BACKFLIP';
      this.flipPitchAngle = 0.95; // Pitching skyward into the backflip with sun & ocean in view
      this.trickPhase = 0.5;
      this._showTrickBanner('360° BACKFLIP!', 'AIRBORNE · ALT 24 FT · +1,500 PTS');
    } else if (mode === 'invert') {
      this.activeTrickName = 'INVERTED 360° BACKFLIP';
      this.flipPitchAngle = Math.PI * 0.85;
      this.barrelRollAngle = 0.35;
      this.trickPhase = 0.5;
      this._showTrickBanner('INVERTED BACKFLIP!', 'APEX INVERT · ALT 28 FT · +2,000 PTS');
    } else {
      this.activeTrickName = 'NAC-NAC AIR';
      this.flipPitchAngle = 0.38;
      this.trickPhase = 0.5;
      this._showTrickBanner('BIG AIR + NAC-NAC!', 'AIRBORNE · ALT 22 FT · +1,000 PTS');
    }
  }

  _compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  _initOceanRaymarchGL() {
    const gl = this.gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, OCEAN_VERTEX_SHADER);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, OCEAN_FRAGMENT_SHADER);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
    }
    this.oceanProgram = prog;

    const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.oceanVbo = vbo;

    this.locs = {
      uResolution: gl.getUniformLocation(prog, 'uResolution'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uCameraPos: gl.getUniformLocation(prog, 'uCameraPos'),
      uCameraBasis: gl.getUniformLocation(prog, 'uCameraBasis'),
      uFovTan: gl.getUniformLocation(prog, 'uFovTan'),
      uSunDir: gl.getUniformLocation(prog, 'uSunDir'),
      uChoppy: gl.getUniformLocation(prog, 'uChoppy'),
      uWaveAmp: gl.getUniformLocation(prog, 'uWaveAmp'),
      uHazeAmount: gl.getUniformLocation(prog, 'uHazeAmount'),
      uTurquoiseBoost: gl.getUniformLocation(prog, 'uTurquoiseBoost'),
      uSpeedKts: gl.getUniformLocation(prog, 'uSpeedKts'),
      uSteerAngle: gl.getUniformLocation(prog, 'uSteerAngle'),
      uUnderwater: gl.getUniformLocation(prog, 'uUnderwater'),
      uSplashBurst: gl.getUniformLocation(prog, 'uSplashBurst'),
    };
  }

  _initThreeCockpitScene() {
    this.cockpitScene = new THREE.Scene();
    this.cockpitCamera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.05,
      60
    );
    this.cockpitCamera.position.set(0.0, 1.38, 0.30);
    this.cockpitCamera.lookAt(0.0, 1.32, -10.0);

    const hemiLight = new THREE.HemisphereLight(0xd8f0ff, 0x0a5868, 0.95);
    this.cockpitScene.add(hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff8eb, 2.8);
    this.sunLight.position.set(-2.5, 5.5, -3.5);
    this.cockpitScene.add(this.sunLight);

    this.jetSkiRig = new FirstPersonJetSkiRig(this.cockpitScene, this.renderer, () => {
      if (this.evalMode) {
        this._frame(performance.now());
      }
    });
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 2, 2.25);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerWidth ? window.innerHeight * dpr : 1000);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cockpitCamera.aspect = window.innerWidth / window.innerHeight;
    this.cockpitCamera.updateProjectionMatrix();
  }

  _showTrickBanner(title, meta) {
    const banner = document.getElementById('trick-hud-banner');
    const titleEl = document.getElementById('trick-hud-title');
    const metaEl = document.getElementById('trick-hud-meta');
    if (!banner || !titleEl || !metaEl) return;
    titleEl.textContent = title;
    metaEl.textContent = meta;
    banner.classList.remove('hidden');
    this.bannerTimer = 2.8;
  }

  triggerJumpOrFlip(forceFlip = false) {
    const now = performance.now();
    const doubleTapped = (now - this.lastSpacePressTime) < 420;
    this.lastSpacePressTime = now;

    if (!this.isAirborne) {
      // Launch into the air off the current wave!
      this.isAirborne = true;
      this.airTime = 0.0;
      this.peakAltitudeFt = 0.0;
      const speedBonus = Math.min(5.5, this.params.speedKts * 0.12);
      this.verticalVel = 11.8 + speedBonus;
      this.params.speedKts = Math.max(26, this.params.speedKts);
      this._syncSliders();

      if (forceFlip || doubleTapped) {
        this.activeTrickName = '360° BACKFLIP';
        this.flipPitchRate = (2.0 * Math.PI) / 1.45;
        this.trickPhase = 0.01;
        this._showTrickBanner('360° BACKFLIP LAUNCH!', 'HOLD [S] OR [F] FOR DOUBLE FLIP · [A/D] BARREL ROLL');
      } else {
        this.activeTrickName = 'WAVE LAUNCH AIR';
        this.flipPitchAngle = 0.22; // Nose-up wave launch posture
        this.flipPitchRate = 0.0;
        this.trickPhase = 0.01;
        this._showTrickBanner('BIG WAVE JUMP!', 'PRESS [SPACE] OR [F] IN AIR TO BACKFLIP · [1/2/3] TRICKS');
      }
    } else {
      // Already airborne -> pressing Space or F triggers a full 360° Backflip in mid-air!
      this.verticalVel = Math.max(this.verticalVel, 6.5); // extra pop for the flip
      this.activeTrickName = '360° BACKFLIP';
      this.flipPitchRate = (2.0 * Math.PI) / 1.32;
      this.trickPhase = 0.05;
      this._showTrickBanner('360° BACKFLIP!', 'ROTATING FULL 360° IN MID-AIR!');
    }
  }

  triggerAerialTrick(trickName) {
    if (!this.isAirborne) {
      this.triggerJumpOrFlip(trickName === 'BACKFLIP');
    }
    this.activeTrickName = trickName;
    this.trickPhase = 0.05;
    if (trickName === 'BACKFLIP') {
      this.flipPitchRate = (2.0 * Math.PI) / 1.35;
      this._showTrickBanner('360° BACKFLIP!', 'FULL VERTICAL LOOP IN THE AIR!');
    } else if (trickName === 'FRONTFLIP') {
      this.flipPitchRate = -(2.0 * Math.PI) / 1.35;
      this._showTrickBanner('360° FRONTFLIP!', 'FORWARD ROTATION OVER THE BOW!');
    } else if (trickName === 'BARREL ROLL') {
      this.barrelRollRate = (2.0 * Math.PI) / 1.30;
      this._showTrickBanner('360° BARREL ROLL!', 'AERIAL AILERON ROLL!');
    } else {
      this._showTrickBanner(`${trickName} STUNT!`, 'FREESTYLE AERIAL COMBO!');
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => this._resize());

    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.lookYawOffset = Math.max(-1.2, Math.min(1.2, this.lookYawOffset - dx * 0.0038));
      this.lookPitchOffset = Math.max(-0.45, Math.min(0.45, this.lookPitchOffset - dy * 0.003));
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.w = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.s = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.a = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.d = true;
      if (e.code === 'KeyV') this.keys.dive = true;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) this.triggerJumpOrFlip(false);
      }
      if (e.code === 'KeyF' && !e.repeat) {
        this.triggerJumpOrFlip(true);
      }
      if (e.code === 'KeyQ' && !e.repeat) {
        this.triggerAerialTrick('BARREL ROLL');
      }
      if (e.code === 'KeyE' && !e.repeat) {
        this.triggerAerialTrick('FRONTFLIP');
      }
      if (e.code === 'Digit1' && !e.repeat) {
        this.triggerAerialTrick('NAC-NAC');
      }
      if (e.code === 'Digit2' && !e.repeat) {
        this.triggerAerialTrick('NO-HANDER');
      }
      if (e.code === 'Digit3' && !e.repeat) {
        this.triggerAerialTrick('SUPERMAN');
      }

      if (e.code === 'KeyC') this.toggleCockpit();
      if (e.code === 'KeyR') this.toggleRefOverlay();
      if (e.code === 'KeyT') this.toggleTuningDrawer();
      if (e.code === 'KeyH') document.body.classList.toggle('ui-hidden');
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.w = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.s = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.a = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.d = false;
      if (e.code === 'KeyV') this.keys.dive = false;
    });
  }

  _bindUI() {
    document.getElementById('btn-jump-flip')?.addEventListener('click', () => {
      this.triggerJumpOrFlip(true);
    });

    const cockpitBtn = document.getElementById('btn-toggle-cockpit');
    if (cockpitBtn) {
      cockpitBtn.classList.toggle('active', this.params.showCockpit);
      cockpitBtn.textContent = this.params.showCockpit
        ? '[C] 3D JET SKI FRONT: ON'
        : '[C] 3D JET SKI FRONT: OFF';
      cockpitBtn.addEventListener('click', () => this.toggleCockpit());
    }

    document.getElementById('btn-toggle-ref')?.addEventListener('click', () => {
      this.toggleRefOverlay();
    });

    document.getElementById('btn-toggle-tuning')?.addEventListener('click', () => {
      this.toggleTuningDrawer();
    });
    document.getElementById('btn-close-tuning')?.addEventListener('click', () => {
      this.toggleTuningDrawer(false);
    });

    document.querySelectorAll('.preset-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyPreset(btn.dataset.preset);
      });
    });

    const bindSlider = (id, valId, applyFn) => {
      const sl = document.getElementById(id);
      const vl = document.getElementById(valId);
      if (!sl) return;
      sl.addEventListener('input', (e) => {
        const v = Number(e.target.value);
        applyFn(v, vl);
      });
    };

    bindSlider('sl-chop', 'val-chop', (v, vl) => {
      this.params.choppy = v / 100;
      if (vl) vl.textContent = this.params.choppy.toFixed(2);
    });
    bindSlider('sl-height', 'val-height', (v, vl) => {
      this.params.waveAmp = v / 100;
      if (vl) vl.textContent = this.params.waveAmp.toFixed(2);
    });
    bindSlider('sl-speed', 'val-speed', (v, vl) => {
      this.params.speedKts = v;
      if (vl) vl.textContent = `${v} KTS`;
    });
    bindSlider('sl-sun-elev', 'val-sun-elev', (v, vl) => {
      this.params.sunElevDeg = v;
      if (vl) vl.textContent = `${v}°`;
    });
    bindSlider('sl-sun-azim', 'val-sun-azim', (v, vl) => {
      this.params.sunAzimDeg = v;
      if (vl) vl.textContent = `${v}°`;
    });
    bindSlider('sl-haze', 'val-haze', (v, vl) => {
      this.params.hazeAmount = v / 100;
      if (vl) vl.textContent = `${v}%`;
    });
    bindSlider('sl-turq', 'val-turq', (v, vl) => {
      this.params.turquoiseBoost = v / 100;
      if (vl) vl.textContent = `${v}%`;
    });
  }

  applyPreset(name) {
    if (name === 'photo') {
      this.params.choppy = 1.0;
      this.params.waveAmp = 0.85;
      this.params.sunElevDeg = 21;
      this.params.sunAzimDeg = -18;
      this.params.hazeAmount = 0.30;
      this.params.turquoiseBoost = 1.05;
    } else if (name === 'swell') {
      this.params.choppy = 1.32;
      this.params.waveAmp = 1.55;
      this.params.sunElevDeg = 24;
      this.params.sunAzimDeg = -25;
      this.params.hazeAmount = 0.25;
      this.params.turquoiseBoost = 1.0;
    } else if (name === 'glassy') {
      this.params.choppy = 0.55;
      this.params.waveAmp = 0.42;
      this.params.sunElevDeg = 28;
      this.params.sunAzimDeg = 12;
      this.params.hazeAmount = 0.26;
      this.params.turquoiseBoost = 1.18;
    } else if (name === 'golden') {
      this.params.choppy = 1.05;
      this.params.waveAmp = 0.95;
      this.params.sunElevDeg = 12;
      this.params.sunAzimDeg = -8;
      this.params.hazeAmount = 0.35;
      this.params.turquoiseBoost = 0.94;
    }
    this._syncSliders();
  }

  _syncSliders() {
    const setSl = (id, valId, num, text) => {
      const sl = document.getElementById(id);
      const vl = document.getElementById(valId);
      if (sl) sl.value = String(Math.round(num));
      if (vl) vl.textContent = text;
    };
    setSl('sl-chop', 'val-chop', this.params.choppy * 100, this.params.choppy.toFixed(2));
    setSl('sl-height', 'val-height', this.params.waveAmp * 100, this.params.waveAmp.toFixed(2));
    setSl('sl-speed', 'val-speed', this.params.speedKts, `${Math.round(this.params.speedKts)} KTS`);
    setSl('sl-sun-elev', 'val-sun-elev', this.params.sunElevDeg, `${Math.round(this.params.sunElevDeg)}°`);
    setSl('sl-sun-azim', 'val-sun-azim', this.params.sunAzimDeg, `${Math.round(this.params.sunAzimDeg)}°`);
    setSl('sl-haze', 'val-haze', this.params.hazeAmount * 100, `${Math.round(this.params.hazeAmount * 100)}%`);
    setSl('sl-turq', 'val-turq', this.params.turquoiseBoost * 100, `${Math.round(this.params.turquoiseBoost * 100)}%`);
  }

  toggleCockpit() {
    this.params.showCockpit = !this.params.showCockpit;
    const btn = document.getElementById('btn-toggle-cockpit');
    if (btn) {
      btn.classList.toggle('active', this.params.showCockpit);
      btn.textContent = this.params.showCockpit
        ? '[C] 3D JET SKI FRONT: ON'
        : '[C] 3D JET SKI FRONT: OFF';
    }
  }

  toggleRefOverlay() {
    const el = document.getElementById('ref-compare-overlay');
    const btn = document.getElementById('btn-toggle-ref');
    if (!el) return;
    const hidden = el.classList.toggle('hidden');
    if (btn) btn.classList.toggle('active', !hidden);
  }

  toggleTuningDrawer(forceState) {
    const el = document.getElementById('tuning-drawer');
    const btn = document.getElementById('btn-toggle-tuning');
    if (!el) return;
    const shouldHide = forceState !== undefined ? !forceState : !el.classList.contains('hidden');
    el.classList.toggle('hidden', shouldHide);
    if (btn) btn.classList.toggle('active', !shouldHide);
  }

  _frame(now) {
    requestAnimationFrame((t) => this._frame(t));

    const dt = this.evalMode ? 0.0 : Math.max(0.0, Math.min(0.05, (now - this.lastTime) / 1000));
    this.lastTime = now;
    this.elapsedTime += dt;

    if (!this.isAirborne) {
      if (this.keys.w) {
        this.params.speedKts = Math.min(65, this.params.speedKts + 26 * dt);
        this._syncSliders();
      } else if (this.keys.s) {
        this.params.speedKts = Math.max(0, this.params.speedKts - 30 * dt);
        this._syncSliders();
      }
    }

    const steerTarget = this.evalMode && this.evalSteer !== 0
      ? this.evalSteer
      : (this.keys.a ? -1 : 0) + (this.keys.d ? 1 : 0);
    this.steerSmooth = this.evalMode && this.evalSteer !== 0
      ? this.evalSteer
      : this.steerSmooth + (steerTarget - this.steerSmooth) * (1.0 - Math.exp(-8.5 * dt));

    if (!this.isAirborne) {
      this.heading += this.steerSmooth * 0.92 * dt;
    } else {
      this.heading += this.steerSmooth * 0.35 * dt;
    }

    if (!this.isDragging) {
      this.lookYawOffset *= Math.exp(-3.5 * dt);
      this.lookPitchOffset *= Math.exp(-3.5 * dt);
    }

    // Real-world forward propulsion so you can physically reach the 3D islands & Sail Tower!
    const speedMetersPerSec = this.params.speedKts * 0.51444;
    const fwdX = Math.sin(this.heading);
    const fwdZ = -Math.cos(this.heading);
    this.position.x += fwdX * speedMetersPerSec * dt * 1.15;
    this.position.z += fwdZ * speedMetersPerSec * dt * 1.15;

    const hCenter = sampleCPUWaveHeight(
      this.position.x,
      this.position.z,
      this.elapsedTime,
      this.params.waveAmp,
      this.params.choppy
    );
    const hAhead = sampleCPUWaveHeight(
      this.position.x + fwdX * 1.8,
      this.position.z + fwdZ * 1.8,
      this.elapsedTime,
      this.params.waveAmp,
      this.params.choppy
    );

    const waveSlopePitch = Math.atan2(hAhead - hCenter, 1.8) * 0.28;
    const surfaceY = this.keys.dive ? hCenter - 1.2 : hCenter + 1.48;

    // Natural wave-crest launch if hitting a steep swell at high speed (> 42 KTS)
    if (!this.isAirborne && !this.evalMode && this.params.speedKts > 42 && (hAhead - hCenter) > 0.58 * this.params.waveAmp) {
      this.triggerJumpOrFlip(false);
    }

    if (this.isAirborne && !this.evalMode) {
      this.airTime += dt;
      this.verticalVel -= 18.2 * dt; // Gravity
      this.position.y += this.verticalVel * dt;

      const altFt = Math.max(0, Math.round((this.position.y - surfaceY) * 3.28084));
      if (altFt > this.peakAltitudeFt) this.peakAltitudeFt = altFt;

      // In-air pitch/flip control via W/S and barrel roll via A/D
      if (Math.abs(this.flipPitchRate) < 0.2) {
        if (this.keys.s) {
          this.flipPitchRate = (2.0 * Math.PI) / 1.35;
          this.activeTrickName = '360° BACKFLIP';
        } else if (this.keys.w) {
          this.flipPitchRate = -(2.0 * Math.PI) / 1.35;
          this.activeTrickName = '360° FRONTFLIP';
        }
      }
      if (Math.abs(this.barrelRollRate) < 0.2 && Math.abs(steerTarget) > 0.5 && this.airTime > 0.18) {
        if (this.keys.a || this.keys.d) {
          this.barrelRollAngle += -steerTarget * 2.4 * dt;
        }
      }

      this.flipPitchAngle += this.flipPitchRate * dt;
      this.barrelRollAngle += this.barrelRollRate * dt;
      this.trickPhase = Math.min(1.0, this.airTime / 1.35);

      // Auto-complete full 360° flip rotation smoothly
      if (Math.abs(this.flipPitchAngle) >= 2.0 * Math.PI) {
        this.flipPitchAngle = this.flipPitchAngle % (2.0 * Math.PI);
        this.flipPitchRate *= 0.25;
      }
      if (Math.abs(this.barrelRollAngle) >= 2.0 * Math.PI) {
        this.barrelRollAngle = this.barrelRollAngle % (2.0 * Math.PI);
        this.barrelRollRate *= 0.25;
      }

      // Splashdown detection
      if (this.position.y <= surfaceY && this.verticalVel < 0) {
        this.position.y = surfaceY;
        this.isAirborne = false;
        this.verticalVel = 0.0;
        this.flipPitchAngle = 0.0;
        this.flipPitchRate = 0.0;
        this.barrelRollAngle = 0.0;
        this.barrelRollRate = 0.0;
        this.landingShock = 1.0;
        this.splashBurst = 1.0;

        const pts = this.activeTrickName.includes('FLIP') || this.activeTrickName.includes('ROLL')
          ? 1500
          : (this.activeTrickName !== 'WAVE LAUNCH AIR' ? 1000 : 500);
        this.totalScore += pts;
        this._showTrickBanner(
          `LANDED ${this.activeTrickName}! +${pts} PTS`,
          `PEAK ALT ${this.peakAltitudeFt} FT · AIR TIME ${this.airTime.toFixed(1)}S · TOTAL SCORE ${this.totalScore.toLocaleString()}`
        );
        this.activeTrickName = '';
        this.trickPhase = 0.0;
      }
    } else if (!this.evalMode) {
      this.position.y += (surfaceY - this.position.y) * (1.0 - Math.exp(-10.0 * dt));
      this.flipPitchAngle *= Math.exp(-8.0 * dt);
      this.barrelRollAngle *= Math.exp(-8.0 * dt);
    }

    this.landingShock *= Math.exp(-7.5 * dt);
    this.splashBurst *= Math.exp(-3.2 * dt);

    if (this.bannerTimer > 0 && !this.evalMode) {
      this.bannerTimer -= dt;
      if (this.bannerTimer <= 0) {
        document.getElementById('trick-hud-banner')?.classList.add('hidden');
      }
    }

    const basePitch = -0.025 + waveSlopePitch + this.lookPitchOffset - this.landingShock * 0.08;
    const baseRoll = -this.steerSmooth * 0.14;

    if (this.isAirborne) {
      this.pitch = basePitch + this.flipPitchAngle;
      this.roll = baseRoll + this.barrelRollAngle;
    } else {
      this.pitch += (basePitch - this.pitch) * (1.0 - Math.exp(-8.0 * dt));
      this.roll += (baseRoll - this.roll) * (1.0 - Math.exp(-8.0 * dt));
    }

    this.jetSkiRig.update(dt, this.elapsedTime, {
      speedKts: this.params.speedKts,
      steerInput: this.steerSmooth,
      throttleInput: this.keys.w ? 1.0 : 0.25,
      pitch: waveSlopePitch,
      roll: this.roll,
      heave: hCenter - 0.5,
      lookYaw: this.lookYawOffset,
      lookPitch: this.lookPitchOffset,
      airborne: this.isAirborne,
      trickType: this.activeTrickName,
      trickPhase: this.trickPhase,
      landingShock: this.landingShock,
    });

    this.cockpitCamera.rotation.order = 'YXZ';
    this.cockpitCamera.rotation.y = -this.lookYawOffset * 0.65;
    this.cockpitCamera.rotation.x = -0.006 + this.lookPitchOffset * 0.65;

    const spdEl = document.getElementById('readout-speed');
    if (spdEl) spdEl.textContent = `${Math.round(this.params.speedKts)} KTS (${Math.round(this.params.speedKts * 1.15078)} MPH)`;

    const distToSail = Math.round(Math.hypot(this.position.x - 0.0, this.position.z - (-520.0)));
    const landEl = document.getElementById('readout-landmark');
    if (landEl) {
      landEl.textContent = distToSail < 75
        ? `ARRIVED AT SAIL TOWER (${distToSail}M)`
        : `SAIL TOWER: ${distToSail}M N`;
    }

    const depEl = document.getElementById('readout-depth');
    if (depEl) {
      if (this.isAirborne) {
        depEl.textContent = `AIRBORNE (${this.activeTrickName || 'JUMP'}) · ALT ${this.peakAltitudeFt} FT`;
      } else if (this.keys.dive) {
        depEl.textContent = 'SUBMERGED CAUSTIC STUDY';
      } else {
        depEl.textContent = `RETINA 3D RIG · SCORE ${this.totalScore.toLocaleString()}`;
      }
    }

    const hdgEl = document.getElementById('readout-heading');
    if (hdgEl) {
      const deg = ((Math.round((this.heading * 180) / Math.PI) % 360) + 360) % 360;
      hdgEl.textContent = `HDG ${String(deg).padStart(3, '0')}°`;
    }

    this._renderFrame();
  }

  _renderFrame() {
    const gl = this.gl;

    // PASS 1: FULL-SCREEN GPU RAYMARCHED OCEAN, SUN, 3D ARCHIPELAGO ISLANDS & 3D SAIL TOWER
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.oceanProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.oceanVbo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(this.locs.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.locs.uTime, this.elapsedTime);
    gl.uniform3f(this.locs.uCameraPos, this.position.x, this.position.y, this.position.z);

    const yaw = this.heading + this.lookYawOffset;
    const pitch = this.pitch;
    const roll = this.roll;

    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const cr = Math.cos(roll), sr = Math.sin(roll);

    const fx = sy * cp;
    const fy = sp;
    const fz = -cy * cp;

    const rx0 = cy, ry0 = 0.0, rz0 = sy;
    const ux0 = -sy * sp, uy0 = cp, uz0 = cy * sp;

    const rx = rx0 * cr + ux0 * sr;
    const ry = ry0 * cr + uy0 * sr;
    const rz = rz0 * cr + uz0 * sr;

    const ux = ux0 * cr - rx0 * sr;
    const uy = uy0 * cr - ry0 * sr;
    const uz = uz0 * cr - rz0 * sr;

    const basis = new Float32Array([rx, ry, rz, ux, uy, uz, fx, fy, fz]);
    gl.uniformMatrix3fv(this.locs.uCameraBasis, false, basis);
    gl.uniform1f(this.locs.uFovTan, Math.tan((58.0 * Math.PI) / 360.0));

    const elevRad = (this.params.sunElevDeg * Math.PI) / 180.0;
    const azimRad = (this.params.sunAzimDeg * Math.PI) / 180.0;
    const sunX = Math.sin(azimRad) * Math.cos(elevRad);
    const sunY = Math.sin(elevRad);
    const sunZ = -Math.cos(azimRad) * Math.cos(elevRad);
    gl.uniform3f(this.locs.uSunDir, sunX, sunY, sunZ);

    gl.uniform1f(this.locs.uChoppy, this.params.choppy);
    gl.uniform1f(this.locs.uWaveAmp, this.params.waveAmp);
    gl.uniform1f(this.locs.uHazeAmount, this.params.hazeAmount);
    gl.uniform1f(this.locs.uTurquoiseBoost, this.params.turquoiseBoost);
    gl.uniform1f(this.locs.uSpeedKts, this.params.speedKts);
    gl.uniform1f(this.locs.uSteerAngle, this.steerSmooth);
    gl.uniform1f(this.locs.uUnderwater, this.keys.dive ? 1.0 : 0.0);
    gl.uniform1f(this.locs.uSplashBurst, this.splashBurst);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // PASS 2: FOREGROUND RETINA 3D JET SKI COCKPIT & RIGGED ARM
    if (this.cockpitCanvas) {
      this.cockpitCanvas.style.display = this.params.showCockpit ? 'block' : 'none';
    }
    if (this.params.showCockpit) {
      this.renderer.render(this.cockpitScene, this.cockpitCamera);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.sim = new OceanLookAndFeelStudio();
});
