import * as THREE from 'three';
import { BAKED_CHARACTER_MODELS, BAKED_WEAPON_MODELS } from './bakedModelData.js';

// ============================================================================
// High-Craft Baked 3D Volumetric Character & Weapon Model Builder
// Constructs watertight, double-shelled 3D relief meshes from pre-baked
// silhouette/depth grids (src/bakedModelData.js) and UV-maps them onto the
// edge-dilated studio turnaround atlases (assets/baked-*-uv.png).
// Includes real-time 3D vertex articulation for leg strides, arm swings,
// torso twist, breathing, and ear physics.
// ============================================================================

const _textureLoader = new THREE.TextureLoader();
const _geometryCache = new Map();
const _textureCache = new Map();

function _loadBakedTexture(url) {
  if (_textureCache.has(url)) return _textureCache.get(url);

  const isCharUv = url.includes('baked-pip-uv') || url.includes('baked-bruno-uv') || url.includes('baked-volt-uv');
  if (!isCharUv) {
    const tex = _textureLoader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 8;
    _textureCache.set(url, tex);
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 752;
  canvas.height = 602;
  const ctx = canvas.getContext('2d');

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  _textureCache.set(url, tex);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    canvas.width = img.width || 752;
    canvas.height = img.height || 602;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // 1. Erase top-left BUNNY ROYALE logo & studio corner smudge + bottom floor line
    ctx.clearRect(0, 0, 224, 112);
    ctx.clearRect(198, 0, 56, 34);
    ctx.clearRect(0, canvas.height - 4, canvas.width, 4);

    // 2. For Volt, fill missing pale-lavender fur & cobalt shin armor behind existing pixels
    if (url.includes('baked-volt-uv')) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';

      const fillShinColumn = (x0, y0, w, h) => {
        const g = ctx.createLinearGradient(x0, y0, x0 + w, y0);
        g.addColorStop(0, '#2b3268');
        g.addColorStop(0.22, '#434b96');
        g.addColorStop(0.5, '#dcd6ec');
        g.addColorStop(0.78, '#434b96');
        g.addColorStop(1, '#262c5c');
        ctx.fillStyle = g;
        ctx.fillRect(x0, y0, w, h);
      };

      // Back-view left & right shins + lower torso undersuit
      fillShinColumn(458, 452, 56, 108);
      fillShinColumn(570, 452, 56, 108);
      fillShinColumn(478, 396, 120, 68);

      // Front-view left & right shins + lower torso undersuit
      fillShinColumn(126, 452, 56, 108);
      fillShinColumn(238, 452, 56, 108);
      fillShinColumn(152, 396, 120, 68);

      ctx.restore();
    }

    tex.needsUpdate = true;
  };
  img.src = url;
  return tex;
}

function _createShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, 'rgba(8, 12, 22, 0.75)');
  grad.addColorStop(0.6, 'rgba(8, 12, 22, 0.35)');
  grad.addColorStop(1, 'rgba(8, 12, 22, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const _sharedShadowTex = _createShadowTexture();

/**
 * Builds a watertight 3D volumetric BufferGeometry from a baked depth grid.
 * Front (-Z) and Back (+Z) shells are sculpted with anatomical 3D curvature
 * and welded seamlessly at z = 0 along the silhouette contour.
 */
export function buildBakedCharacterGeometry(spec, charW, charH, maxDepth = 0.44, isFrontPrimary = false) {
  const { nx, ny } = spec;
  const depthGrid = spec.depthGrid.slice();

  // Heal Volt's pale-gray undersuit torso/hips & slim shins where studio-gray luminance matched background
  if (spec.id === 'volt' || (spec.atlasUrl && spec.atlasUrl.includes('volt'))) {
    for (let y = 46; y <= 52; y++) {
      for (let x = 12; x <= 25; x++) {
        if (depthGrid[y * nx + x] < 48) depthGrid[y * nx + x] = 60;
      }
    }
    for (let y = 53; y <= 62; y++) {
      for (let x = 10; x <= 15; x++) {
        if (depthGrid[y * nx + x] < 45) depthGrid[y * nx + x] = 55;
      }
      for (let x = 23; x <= 28; x++) {
        if (depthGrid[y * nx + x] < 45) depthGrid[y * nx + x] = 55;
      }
    }
  }

  const cols = nx + 1;
  const rows = ny + 1;

  // 1. Compute corner vertex thickness (0 on silhouette boundary so Front & Back weld watertight)
  const vDepthBack = new Float32Array(cols * rows);
  const vDepthFront = new Float32Array(cols * rows);

  for (let vy = 0; vy <= ny; vy++) {
    const vNorm = 1.0 - vy / ny; // 0 at bottom (feet), 1 at top (ears)
    for (let vx = 0; vx <= nx; vx++) {
      const uNorm = vx / nx; // 0 at left (-X), 1 at right (+X)
      const cx = uNorm - 0.5;

      // Sample the 4 surrounding grid cells with smooth boundary taper
      let sumCell = 0;
      let count = 0;
      for (let dy = -1; dy <= 0; dy++) {
        for (let dx = -1; dx <= 0; dx++) {
          const gx = vx + dx;
          const gy = vy + dy;
          if (gx >= 0 && gx < nx && gy >= 0 && gy < ny) {
            sumCell += depthGrid[gy * nx + gx];
          }
          count++;
        }
      }

      const vIdx = vy * cols + vx;
      if (sumCell === 0 || count === 0) {
        // Exterior contour vertex: weld Front and Back shells at z = 0
        vDepthBack[vIdx] = 0;
        vDepthFront[vIdx] = 0;
        continue;
      }

      const baseNorm = (sumCell / count) / 99.0;

      // Anatomical 3D sculpting weights (torso/backpack, tail puff, cranium, ears, limbs)
      let backScale = 0.96;
      let frontScale = 0.92;

      if (vNorm > 0.74) {
        // Ears: sculpted 3D profile
        const earT = Math.min(1, (vNorm - 0.74) / 0.22);
        backScale = 0.56 * (1 - earT * 0.42);
        frontScale = 0.50 * (1 - earT * 0.42);
      } else if (vNorm > 0.52) {
        // Head & fluffy cheeks: full rounded 3D ellipsoid
        backScale = 1.12;
        frontScale = 1.18;
      } else if (vNorm > 0.27) {
        // Torso & Backpack (+Z bulge for carrot battery / seed drum / twin-disc pack)
        const packDist2 = Math.pow(cx / 0.20, 2) + Math.pow((vNorm - 0.41) / 0.13, 2);
        const packBulge = packDist2 < 1.0 ? 0.58 * Math.cos(packDist2 * Math.PI * 0.5) : 0;
        backScale = 1.04 + packBulge;
        frontScale = 1.02;
      } else {
        // Legs, Cotton Tail & Chunky Boots
        const tailDist2 = Math.pow(cx / 0.11, 2) + Math.pow((vNorm - 0.24) / 0.06, 2);
        const tailBulge = tailDist2 < 1.0 ? 0.60 * Math.cos(tailDist2 * Math.PI * 0.5) : 0;
        const bootToe = vNorm < 0.11 ? 0.42 : 0;
        backScale = 0.90 + tailBulge;
        frontScale = 0.90 + bootToe;
      }

      vDepthBack[vIdx] = baseNorm * maxDepth * backScale;
      vDepthFront[vIdx] = baseNorm * maxDepth * frontScale;
    }
  }

  // 2. Build indexed triangles for Back Shell (+Z) and Front Shell (-Z)
  const positions = [];
  const uvs = [];
  const indices = [];

  const backVertMap = new Int32Array(cols * rows).fill(-1);
  const frontVertMap = new Int32Array(cols * rows).fill(-1);

  const getBackVertex = (vx, vy) => {
    const key = vy * cols + vx;
    if (backVertMap[key] !== -1) return backVertMap[key];

    const u = vx / nx;
    const vImg = vy / ny;
    const vNorm = 1.0 - vImg;

    const x = (u - 0.5) * charW;
    const y = vNorm * charH;
    // Slight natural backward curve on ear tips
    const earCurveZ = vNorm > 0.75 ? -0.08 * (vNorm - 0.75) : 0;
    const z = vDepthBack[key] + earCurveZ;

    // Back shell samples right half of baked atlas (u in [0.5, 1.0]) unless isFrontPrimary
    const uAtlas = isFrontPrimary
      ? (0.5 + (1.0 - u) * 0.496)
      : (0.502 + u * 0.496);
    const vAtlas = Math.max(0.005, Math.min(0.995, 1.0 - vImg));

    const idx = positions.length / 3;
    positions.push(x, y, z);
    uvs.push(uAtlas, vAtlas);
    backVertMap[key] = idx;
    return idx;
  };

  const getFrontVertex = (vx, vy) => {
    const key = vy * cols + vx;
    if (frontVertMap[key] !== -1) return frontVertMap[key];

    const u = vx / nx;
    const vImg = vy / ny;
    const vNorm = 1.0 - vImg;

    const x = (u - 0.5) * charW;
    const y = vNorm * charH;
    const earCurveZ = vNorm > 0.75 ? -0.08 * (vNorm - 0.75) : 0;
    const z = -vDepthFront[key] + earCurveZ;

    // Front shell samples left half of baked atlas (u in [0.0, 0.5])
    // Note: In baked-volt-uv.png, both Front and Back views have ears sweeping right (+u)
    const isVoltEars = (spec.id === 'volt' && vNorm > 0.68);
    const uAtlas = (isFrontPrimary || isVoltEars)
      ? (0.002 + u * 0.496)
      : (0.002 + (1.0 - u) * 0.496);
    const vAtlas = Math.max(0.005, Math.min(0.995, 1.0 - vImg));

    const idx = positions.length / 3;
    positions.push(x, y, z);
    uvs.push(uAtlas, vAtlas);
    frontVertMap[key] = idx;
    return idx;
  };

  const hasNearbyMask = (gx, gy) => {
    if (gy >= ny - 1) return false;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x2 = gx + dx, y2 = gy + dy;
        if (x2 >= 0 && x2 < nx && y2 >= 0 && y2 < ny && depthGrid[y2 * nx + x2] > 0) {
          return true;
        }
      }
    }
    return false;
  };

  const midGx = Math.floor(nx / 2);

  for (let gy = 0; gy < ny; gy++) {
    const cellVNorm = 1.0 - (gy + 0.5) / ny;
    for (let gx = 0; gx < nx; gx++) {
      if (!hasNearbyMask(gx, gy)) continue;
      // Split the centerline gap between left and right boots/shins only when the cell itself is empty
      if (cellVNorm < 0.20 && gx === midGx && depthGrid[gy * nx + gx] === 0) continue;

      // Back Shell (+Z facing outward)
      const b00 = getBackVertex(gx, gy);
      const b10 = getBackVertex(gx + 1, gy);
      const b01 = getBackVertex(gx, gy + 1);
      const b11 = getBackVertex(gx + 1, gy + 1);
      indices.push(b00, b01, b10);
      indices.push(b10, b01, b11);

      // Front Shell (-Z facing outward — reversed winding)
      const f00 = getFrontVertex(gx, gy);
      const f10 = getFrontVertex(gx + 1, gy);
      const f01 = getFrontVertex(gx, gy + 1);
      const f11 = getFrontVertex(gx + 1, gy + 1);
      indices.push(f00, f10, f01);
      indices.push(f10, f11, f01);
    }
  }

  const geo = new THREE.BufferGeometry();
  const posArray = new Float32Array(positions);
  geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  // Save rest positions & char dimensions for real-time 3D limb articulation
  geo.userData.restPos = new Float32Array(posArray);
  geo.userData.charW = charW;
  geo.userData.charH = charH;

  return geo;
}

/**
 * Builds a watertight 3D extruded weapon mesh from BAKED_WEAPON_MODELS.
 */
function buildBakedWeaponGeometry(spec, length = 0.72, height = 0.46, thickness = 0.16) {
  const cacheKey = `weaponGeo:${spec.id}`;
  if (_geometryCache.has(cacheKey)) return _geometryCache.get(cacheKey);

  const { nx, ny, depthGrid } = spec;
  const cols = nx + 1;
  const rows = ny + 1;
  const vDepth = new Float32Array(cols * rows);

  for (let vy = 0; vy <= ny; vy++) {
    for (let vx = 0; vx <= nx; vx++) {
      let minCell = 999, sumCell = 0, count = 0;
      for (let dy = -1; dy <= 0; dy++) {
        for (let dx = -1; dx <= 0; dx++) {
          const gx = vx + dx, gy = vy + dy;
          if (gx < 0 || gx >= nx || gy < 0 || gy >= ny) minCell = 0;
          else {
            const val = depthGrid[gy * nx + gx];
            if (val < minCell) minCell = val;
            sumCell += val;
            count++;
          }
        }
      }
      vDepth[vy * cols + vx] = (minCell === 0 || count === 0)
        ? 0
        : ((sumCell / count) / 99.0) * (thickness * 0.5);
    }
  }

  const positions = [];
  const uvs = [];
  const indices = [];
  const rightMap = new Int32Array(cols * rows).fill(-1);
  const leftMap = new Int32Array(cols * rows).fill(-1);

  // Crop UVs matching bakeWeaponModel (140..1396 of 1536, 140..884 of 1024)
  const uMin = 140 / 1536, uSpan = 1256 / 1536;
  const vMin = 140 / 1024, vSpan = 744 / 1024;

  const getVert = (vx, vy, sideSign, map) => {
    const key = vy * cols + vx;
    if (map[key] !== -1) return map[key];
    const u = vx / nx;
    const vImg = vy / ny;

    // Weapon barrel (u=1) points toward +X, with Z-relief thickness
    const x = (u - 0.5) * length;
    const y = (0.5 - vImg) * height;
    const z = sideSign * vDepth[key];

    const uTex = uMin + u * uSpan;
    const vTex = 1.0 - (vMin + vImg * vSpan);

    const idx = positions.length / 3;
    positions.push(x, y, z);
    uvs.push(uTex, vTex);
    map[key] = idx;
    return idx;
  };

  for (let gy = 0; gy < ny; gy++) {
    for (let gx = 0; gx < nx; gx++) {
      const r00 = getVert(gx, gy, 1, rightMap);
      const r10 = getVert(gx + 1, gy, 1, rightMap);
      const r01 = getVert(gx, gy + 1, 1, rightMap);
      const r11 = getVert(gx + 1, gy + 1, 1, rightMap);
      indices.push(r00, r01, r10);
      indices.push(r10, r01, r11);

      const l00 = getVert(gx, gy, -1, leftMap);
      const l10 = getVert(gx + 1, gy, -1, leftMap);
      const l01 = getVert(gx, gy + 1, -1, leftMap);
      const l11 = getVert(gx + 1, gy + 1, -1, leftMap);
      indices.push(l00, l10, l01);
      indices.push(l10, l11, l01);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  _geometryCache.set(cacheKey, geo);
  return geo;
}

/**
 * Fortnite-Style 3D Skeletal Joint Run & Combat Articulation:
 * Rotates thighs around the Hip Joint, shins/boots around the Knee Joint,
 * twists the 3D torso/backpack around the Spine Y-axis, pumps the arms around
 * the Shoulder Joint, and sweeps/bounces the ears with each stride!
 */
export function updateRabbit3DAnimation(
  group,
  time,
  speedRatio = 0,
  isGrounded = true,
  velocityY = 0,
  moveX = 0,
  moveZ = 0
) {
  const mesh = group.userData.bodyMesh3D;
  if (!mesh || !mesh.geometry || !mesh.geometry.userData.restPos) return;

  const posAttr = mesh.geometry.attributes.position;
  const pos = posAttr.array;
  const rest = mesh.geometry.userData.restPos;
  const charH = mesh.geometry.userData.charH || 2.0;
  const charW = mesh.geometry.userData.charW || 1.25;

  const stridePhase = time * 15.5;
  const strideSin = Math.sin(stridePhase);
  const strideCos = Math.cos(stridePhase);
  const doubleSin = Math.sin(stridePhase * 2.0 - 0.45);
  const breath = Math.sin(time * 3.2) * 0.016;
  const airTilt = isGrounded ? 0 : Math.max(-0.20, Math.min(0.20, -velocityY * 0.014));

  const isForeman = group.name === 'enemy_foreman';
  const legSplitTop = isForeman ? 0.19 : 0.29;
  const hipPivotY = legSplitTop * charH;
  const kneePivotY = (isForeman ? 0.10 : 0.15) * charH;
  const shoulderPivotY = 0.50 * charH;

  // Whole-body Fortnite cadence bounce & lateral weight transfer over planted foot
  const isRunning = isGrounded && speedRatio > 0.04;
  const pelvisBounceY = isRunning ? (doubleSin * 0.055 + 0.025) * speedRatio : 0;
  const pelvisSwayX = isRunning ? -strideSin * 0.048 * speedRatio : 0;

  for (let i = 0; i < pos.length; i += 3) {
    let x = rest[i];
    const y0 = rest[i + 1];
    const shellZ = rest[i + 2];
    let y = y0;
    let midZ = 0;

    const vNorm = y0 / charH; // 0 = feet, 1 = ear tips
    const uSigned = x / (charW * 0.5); // -1 = left, +1 = right
    const sideSign = uSigned < 0 ? -1 : 1;
    // Smooth C1-continuous lateral weight so triangles crossing x=0 never shear or tear
    const smoothSide = Math.sin(Math.max(-1, Math.min(1, uSigned / 0.26)) * (Math.PI * 0.5));

    // -----------------------------------------------------------------------
    // 1. TRUE 3D HIP & KNEE ROTATIONAL RUN STRIDE (vNorm < legSplitTop)
    // -----------------------------------------------------------------------
    if (vNorm < legSplitTop) {
      const hipWeight = Math.min(1, (legSplitTop - vNorm) / 0.11) * Math.abs(smoothSide);

      if (isRunning) {
        const legWave = smoothSide * strideSin;
        const legPass = smoothSide * strideCos;

        // Thigh swings around Hip Joint (hipPivotY) on the midplane
        const thighAngle = legWave * 0.56 * speedRatio * hipWeight;
        const cosT = Math.cos(thighAngle);
        const sinT = Math.sin(thighAngle);

        const dyHip = y0 - hipPivotY;
        y = hipPivotY + dyHip * cosT;
        midZ = dyHip * sinT;

        // Knee bends during back-kick & mid-pass so boot sole kicks up in 3D!
        if (vNorm < kneePivotY / charH) {
          const kneeWeight = Math.min(1, (kneePivotY / charH - vNorm) / 0.12) * Math.abs(smoothSide);
          const kneeFlex = Math.max(0, legWave * 0.65 + Math.max(0, legPass) * 0.38) * speedRatio * kneeWeight;
          const curKneeY = hipPivotY + (kneePivotY - hipPivotY) * cosT;
          const curKneeZ = (kneePivotY - hipPivotY) * sinT;

          const cosK = Math.cos(kneeFlex);
          const sinK = Math.sin(kneeFlex);
          const dyK = y - curKneeY;
          const dzK = midZ - curKneeZ;

          y = curKneeY + dyK * cosK - dzK * sinK;
          midZ = curKneeZ + dyK * sinK + dzK * cosK;
        }

        // Strafe crossover step when moving left/right (A/D)
        x += moveX * legWave * 0.10 * speedRatio * hipWeight;
      } else if (!isGrounded) {
        // Mid-air Fortnite jump pose: one knee tucked high, one leg extended down
        const jumpAngle = (smoothSide > 0 ? 0.42 : -0.24) * hipWeight;
        const cosJ = Math.cos(jumpAngle);
        const sinJ = Math.sin(jumpAngle);
        const dyHip = y0 - hipPivotY;
        y = hipPivotY + dyHip * cosJ + (smoothSide > 0 ? 0.10 : 0.02) * hipWeight;
        midZ = dyHip * sinJ;
      }
    }

    // -----------------------------------------------------------------------
    // 2. 3D SPINE COUNTER-TORQUE TWIST, FORWARD LEAN & ARM PUMP (vNorm 0.28..0.60)
    // -----------------------------------------------------------------------
    let z = midZ + shellZ;
    if (vNorm >= 0.28 && vNorm <= 0.62) {
      const torsoWeight = Math.sin(((vNorm - 0.28) / 0.34) * Math.PI);
      // Chest & backpack breathing expansion
      z += (shellZ >= 0 ? breath : -breath) * torsoWeight;

      if (isRunning) {
        // Pelvis/hip lateral roll on each step
        y += smoothSide * strideSin * 0.042 * speedRatio * torsoWeight;

        // 3D Spine Yaw Counter-Rotation (±12 deg around Y axis)
        const torsoYaw = -strideSin * 0.20 * speedRatio * torsoWeight;
        const cosY = Math.cos(torsoYaw);
        const sinY = Math.sin(torsoYaw);
        const rxTorso = x * cosY + z * sinY;
        const rzTorso = -x * sinY + z * cosY;
        x = rxTorso;
        z = rzTorso;

        // Left & Right Shoulder Arm Pump (pivoting around shoulderPivotY)
        if (Math.abs(uSigned) > 0.34) {
          const armWeight = Math.min(1, (Math.abs(uSigned) - 0.34) / 0.36);
          const armAngle = -smoothSide * strideSin * 0.48 * speedRatio * armWeight;
          const dyArm = y - shoulderPivotY;
          const cosA = Math.cos(armAngle);
          const sinA = Math.sin(armAngle);
          y = shoulderPivotY + dyArm * cosA + Math.abs(strideSin) * 0.04 * speedRatio * armWeight;
          z += dyArm * sinA;
        }
      }
    }

    // -----------------------------------------------------------------------
    // 3. UPPER BODY FORWARD RUN LEAN & HEAD/EAR INERTIA (vNorm > 0.35)
    // -----------------------------------------------------------------------
    if (vNorm > 0.35 && isRunning) {
      const leanHeight = (vNorm - 0.35) / 0.65;
      const leanDir = moveZ <= 0 ? -1 : 0.6;
      z += leanDir * leanHeight * 0.16 * speedRatio;
      x += moveX * leanHeight * 0.09 * speedRatio;
    }

    if (vNorm > 0.70) {
      const earWeight = Math.pow((vNorm - 0.70) / 0.30, 1.25);
      const earBounce = Math.sin(stridePhase * 2.0 - 0.7 + sideSign * 0.35) * 0.085 * speedRatio;
      const earSwayX = Math.cos(stridePhase - 0.4) * 0.05 * speedRatio;
      x += earSwayX * earWeight;
      y += (earBounce + airTilt * 0.6) * earWeight;
      // Ears sweep backward in the wind when sprinting!
      z += (0.18 * speedRatio + Math.abs(earBounce) * 0.9 + airTilt * 1.1 + Math.sin(time * 2.4 + sideSign) * 0.025) * earWeight;
    }

    pos[i] = x + pelvisSwayX;
    pos[i + 1] = Math.max(0.0, y + pelvisBounceY);
    pos[i + 2] = z;
  }

  posAttr.needsUpdate = true;

  // 4. Animate 3D Attached Enemy Weapons (Mallet swing, Blaster bob, Foreman Rotary Barrels)
  if (group.userData.weaponMesh3D) {
    const wMesh = group.userData.weaponMesh3D;
    wMesh.rotation.x = Math.sin(stridePhase) * 0.26 * speedRatio;
    wMesh.rotation.z = Math.cos(stridePhase * 0.5) * 0.14 * speedRatio;
  }
  if (group.userData.rotaryBarrels) {
    group.userData.rotaryBarrels.rotation.z = time * 14.0;
  }
}

export function createRabbitMesh(fighterConfig) {
  const group = new THREE.Group();
  group.name = `rabbit_${fighterConfig.id}`;

  const id = fighterConfig.id || 'pip';
  const isHeavy = id === 'bruno';
  const isVolt = id === 'volt';

  const spec = BAKED_CHARACTER_MODELS[id] || BAKED_CHARACTER_MODELS.pip;
  const charH = isHeavy ? 2.18 : (isVolt ? 2.08 : 2.02);
  const charW = charH * spec.aspect * (isHeavy ? 1.12 : 1.0);
  const maxDepth = isHeavy ? 0.54 : (isVolt ? 0.42 : 0.44);

  // 1. Soft Ground Contact Shadow Blob
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(isHeavy ? 1.55 : 1.25, isHeavy ? 1.55 : 1.25),
    new THREE.MeshBasicMaterial({
      map: _sharedShadowTex,
      transparent: true,
      depthWrite: false
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.025;
  group.add(shadowPlane);

  // 2. Watertight Baked 3D Volumetric Character Model
  const spriteRig = new THREE.Group();
  spriteRig.name = 'studio_3d_rig';
  group.add(spriteRig);
  group.userData.spriteRig = spriteRig;

  const bakedTex = _loadBakedTexture(spec.atlasUrl);
  // Clone geometry per character instance so vertex animation is independent
  const bodyGeo = buildBakedCharacterGeometry(spec, charW, charH, maxDepth, false);

  const bodyMat = new THREE.MeshStandardMaterial({
    map: bakedTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: bakedTex,
    emissiveIntensity: 0.62,
    transparent: true,
    alphaTest: 0.14,
    roughness: 0.55,
    metalness: 0.05
  });

  const bodyMesh3D = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh3D.castShadow = true;
  bodyMesh3D.receiveShadow = true;
  bodyMesh3D.position.y = -0.02;
  spriteRig.add(bodyMesh3D);
  group.userData.bodyMesh3D = bodyMesh3D;

  // 3. Equipped 3D Volumetric Weapon Mounted on Right Hand
  const weaponMesh = createWeaponMesh(fighterConfig.weapon, id, isHeavy ? 1.12 : 1.0);
  weaponMesh.position.set(isHeavy ? 0.42 : 0.34, charH * 0.40, 0.02);
  spriteRig.add(weaponMesh);
  group.userData.weaponMesh = weaponMesh;

  // Animation hooks for CharacterController compatibility
  const earGroup = new THREE.Group();
  spriteRig.add(earGroup);
  group.userData.earGroup = earGroup;

  const footL = new THREE.Group();
  const footR = new THREE.Group();
  group.userData.feet = [footL, footR];

  // 4. Compact Overhead Ring Accent for Aerial Map Overview
  const overheadGroup = new THREE.Group();
  overheadGroup.name = 'overhead_3d_proxy';
  overheadGroup.visible = false;
  const accentColor = id === 'pip' ? 0xff6b00 : (isHeavy ? 0xeab308 : 0xff2a9d);
  const ring3D = new THREE.Mesh(
    new THREE.RingGeometry(0.65, 0.85, 24),
    new THREE.MeshBasicMaterial({ color: accentColor, side: THREE.DoubleSide })
  );
  ring3D.rotation.x = -Math.PI / 2;
  ring3D.position.y = 0.05;
  overheadGroup.add(ring3D);
  group.add(overheadGroup);
  group.userData.overheadGroup = overheadGroup;

  return group;
}

export function createWeaponMesh(weaponConfig, fighterId = 'pip', charScale = 1.0) {
  const wGroup = new THREE.Group();
  wGroup.name = `weapon_${weaponConfig?.id || fighterId}`;

  const spec = BAKED_WEAPON_MODELS[fighterId] || BAKED_WEAPON_MODELS.pip;
  const weaponTex = _loadBakedTexture(spec.texUrl);
  const weaponGeo = buildBakedWeaponGeometry(spec, 0.68 * charScale, 0.44 * charScale, 0.16 * charScale);

  const weaponMat = new THREE.MeshStandardMaterial({
    map: weaponTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: weaponTex,
    emissiveIntensity: 0.65,
    transparent: true,
    alphaTest: 0.12,
    roughness: 0.4,
    metalness: 0.15
  });

  const weaponMesh3D = new THREE.Mesh(weaponGeo, weaponMat);
  // Orient 3D weapon barrel (+X) forward-right toward the street while showing its 3D profile in OTS view
  weaponMesh3D.rotation.y = 0.28;
  weaponMesh3D.rotation.z = 0.08;
  weaponMesh3D.position.set(0.06, 0.02, -0.04);
  weaponMesh3D.castShadow = true;
  wGroup.add(weaponMesh3D);

  return wGroup;
}
