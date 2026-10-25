/**
 * ============================================================================
 * RETINA 2500x1875 PHOTOGRAMMETRIC 3D YAMAHA WAVERUNNER FX CRUISER & RIDER ARM RIG (`cockpit_rig.js`)
 * ============================================================================
 * Combines:
 *  1. The sub-pixel chroma-key alpha matte extracted from our isolated studio
 *     asset `assets/jetski_cockpit_studio.jpg` (`#FF00FF` background removal)
 *  2. The full-resolution Retina 2500x1875 pixel RGB from `references/jet-ski-pov-photograph.jpg`
 *     with unsharp-mask micro-contrast enhancement and 16x anisotropic filtering
 *     (preserving razor-sharp `SPEED/RPM`, `RiDE`, `STOP`, `22 MPH` gauge labels,
 *     water droplets, coiled red lanyard, and sunlit forearm hair)
 *  3. A high-density 3D depth-displaced, vertex-weighted articulated mesh (`220 x 165` grid)
 *     that gives true 3D relief, steering rotation around the steering column,
 *     articulated right forearm & wrist tracking on the throttle grip, aerial trick
 *     motions (No-Hander, Nac-Nac, Superman, Barrel Roll, Backflip), hull
 *     pitch/roll response, and a live Retina digital speedometer (`MPH`).
 */

import * as THREE from './vendor/three.module.js';

export class FirstPersonJetSkiRig {
  constructor(scene, renderer, onReady) {
    this.scene = scene;
    this.renderer = renderer;
    this.onReady = onReady;
    this.root = new THREE.Group();
    this.root.name = 'PhotogrammetricJetSkiRig';
    this.scene.add(this.root);

    this.steerAngle = 0;
    this.targetSteerAngle = 0;
    this.throttleAmount = 0;
    this.loaded = false;

    this.craftMesh = null;
    this.displacedGeo = null;
    this.basePosAttr = null;
    this.wSteerAttr = null;
    this.wArmAttr = null;

    this.baseCraftCanvas = null;
    this.liveCanvas = null;
    this.liveCtx = null;
    this.craftTexture = null;
    this.lastSpeedMph = -1;

    this._loadAndBuild3DRig();
  }

  _pointInPoly(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect =
        yi > py !== yj > py &&
        px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-9) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  _distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  _signedDistToPoly(px, py, poly) {
    let minDist = Infinity;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const d = this._distToSegment(px, py, poly[j][0], poly[j][1], poly[i][0], poly[i][1]);
      if (d < minDist) minDist = d;
    }
    return this._pointInPoly(px, py, poly) ? minDist : -minDist;
  }

  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }

  _loadAndBuild3DRig() {
    Promise.all([
      this._loadImage('references/jet-ski-pov-photograph.jpg'),
      this._loadImage('assets/jetski_cockpit_studio.jpg'),
    ])
      .then(([photoImg, maskImg]) => {
        this._buildFromPhotoAndChromaMask(photoImg, maskImg);
        this.loaded = true;
        document.title = 'READY: Jet Ski POV';
        const el = document.getElementById('readout-depth');
        if (el) el.textContent = 'SURFACE CONTACT LOCKED · RETINA 3D RIG READY';
        if (this.onReady) this.onReady();
      })
      .catch((err) => {
        console.error('Error loading photogrammetric rig images:', err);
      });
  }

  _buildFromPhotoAndChromaMask(photoImg, maskImg) {
    // Full native Retina resolution from the 2500x1875 photograph
    const W = 2500;
    const H = 1875;

    // 1. Draw crisp original photograph at full 2500x1875 Retina resolution
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = W;
    photoCanvas.height = H;
    const pctx = photoCanvas.getContext('2d');
    pctx.imageSmoothingEnabled = true;
    pctx.imageSmoothingQuality = 'high';
    pctx.drawImage(photoImg, 0, 0, W, H);
    const photoData = pctx.getImageData(0, 0, W, H).data;

    // 2. Draw chroma-key studio asset (#FF00FF magenta background) upscaled smoothly to 2500x1875
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = W;
    maskCanvas.height = H;
    const mctx = maskCanvas.getContext('2d');
    mctx.imageSmoothingEnabled = true;
    mctx.imageSmoothingQuality = 'high';
    mctx.drawImage(maskImg, 0, 0, W, H);
    const maskData = mctx.getImageData(0, 0, W, H).data;

    // 3. Combine chroma-key alpha matte from `maskImg` with crisp Retina RGB from `photoImg`
    const outCanvas = document.createElement('canvas');
    outCanvas.width = W;
    outCanvas.height = H;
    const octx = outCanvas.getContext('2d');
    const outImg = octx.createImageData(W, H);
    const dst = outImg.data;

    // 4. Spatial edge-distance pass to clean any residual magenta or cyan fringe
    const alphaBuf = new Float32Array(W * H);
    for (let y = Math.floor(H * 0.48); y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const idx = i * 4;
        const mr = maskData[idx];
        const mg = maskData[idx + 1];
        const mb = maskData[idx + 2];
        const magentaScore = (Math.min(mr, mb) - mg) / 255.0;
        let a = 1.0 - (magentaScore - 0.36) / 0.26;
        a = Math.max(0.0, Math.min(1.0, a));
        alphaBuf[i] = a;
      }
    }

    // Erode and feather on alphaBuf, suppress water/magenta spill near edges,
    // and apply subtle Retina unsharp-mask luminance crispness to bring out forearm hair & wet droplets
    for (let y = Math.floor(H * 0.49); y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const idx = i * 4;
        let minNeighbor = 1.0;
        let sumNeighbor = 0.0;
        let cnt = 0;
        for (let dy = -3; dy <= 3; dy++) {
          const yy = Math.min(H - 1, Math.max(0, y + dy));
          for (let dx = -3; dx <= 3; dx++) {
            const xx = Math.min(W - 1, Math.max(0, x + dx));
            const na = alphaBuf[yy * W + xx];
            if (na < minNeighbor) minNeighbor = na;
            sumNeighbor += na;
            cnt++;
          }
        }
        const avgAlpha = sumNeighbor / cnt;
        let finalAlpha = Math.max(0.0, Math.min(1.0, (avgAlpha - 0.18) / 0.82));
        if (finalAlpha <= 0.005) {
          dst[idx + 3] = 0;
          continue;
        }

        let pr = photoData[idx];
        let pg = photoData[idx + 1];
        let pb = photoData[idx + 2];

        // Suppress ocean cyan bleed near silhouette boundary
        if (minNeighbor < 0.85) {
          const isOceanCyan = pg > pr * 1.12 && pb > pr * 1.08 && pr < 180;
          if (isOceanCyan) {
            finalAlpha = 0.0;
          }
        }

        // Retina 5-tap micro-contrast unsharp mask on interior pixels
        if (x > 1 && x < W - 2 && y > 1 && y < H - 2) {
          const idxL = idx - 4;
          const idxR = idx + 4;
          const idxU = idx - W * 4;
          const idxD = idx + W * 4;
          const blurR = (photoData[idxL] + photoData[idxR] + photoData[idxU] + photoData[idxD]) * 0.25;
          const blurG = (photoData[idxL + 1] + photoData[idxR + 1] + photoData[idxU + 1] + photoData[idxD + 1]) * 0.25;
          const blurB = (photoData[idxL + 2] + photoData[idxR + 2] + photoData[idxU + 2] + photoData[idxD + 2]) * 0.25;
          const sharpAmount = 0.38;
          pr = Math.max(0, Math.min(255, pr + (pr - blurR) * sharpAmount));
          pg = Math.max(0, Math.min(255, pg + (pg - blurG) * sharpAmount));
          pb = Math.max(0, Math.min(255, pb + (pb - blurB) * sharpAmount));
        }

        dst[idx] = pr;
        dst[idx + 1] = pg;
        dst[idx + 2] = pb;
        dst[idx + 3] = Math.round(finalAlpha * 255);
      }
    }

    octx.putImageData(outImg, 0, 0);
    this.baseCraftCanvas = outCanvas;

    this.liveCanvas = document.createElement('canvas');
    this.liveCanvas.width = W;
    this.liveCanvas.height = H;
    this.liveCtx = this.liveCanvas.getContext('2d');
    this.liveCtx.drawImage(this.baseCraftCanvas, 0, 0);

    this.craftTexture = new THREE.CanvasTexture(this.liveCanvas);
    this.craftTexture.colorSpace = THREE.SRGBColorSpace;
    this.craftTexture.generateMipmaps = true;
    this.craftTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.craftTexture.magFilter = THREE.LinearFilter;
    if (this.renderer && this.renderer.capabilities) {
      this.craftTexture.anisotropy = Math.min(16, this.renderer.capabilities.getMaxAnisotropy());
    } else {
      this.craftTexture.anisotropy = 16;
    }
    this.craftTexture.needsUpdate = true;

    // Polygons for smooth 3D articulation weights (Handlebars vs Right Arm vs Hull)
    const rightArmPoly = [
      [0.665, 0.630],
      [0.720, 0.632],
      [0.772, 0.646],
      [0.790, 0.685],
      [0.795, 0.738],
      [0.845, 0.780],
      [0.925, 0.842],
      [1.005, 0.898],
      [1.005, 1.005],
      [0.850, 1.005],
      [0.800, 0.918],
      [0.735, 0.822],
      [0.680, 0.750],
      [0.665, 0.705],
    ];

    const handlebarPoly = [
      [0.001, 0.795],
      [0.015, 0.765],
      [0.072, 0.748],
      [0.172, 0.705],
      [0.180, 0.672],
      [0.245, 0.635],
      [0.345, 0.600],
      [0.432, 0.594],
      [0.515, 0.596],
      [0.605, 0.616],
      [0.668, 0.634],
      [0.810, 0.710],
      [0.812, 0.738],
      [0.672, 0.752],
      [0.608, 0.742],
      [0.518, 0.735],
      [0.435, 0.745],
      [0.348, 0.742],
      [0.268, 0.775],
      [0.195, 0.792],
      [0.095, 0.814],
      [0.018, 0.818],
    ];

    // High-density 220 x 165 3D depth-displaced mesh
    const segX = 220;
    const segY = 165;
    const geo = new THREE.PlaneGeometry(2.0, 2.0, segX, segY);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;

    const wSteerAttr = new Float32Array(pos.count);
    const wArmAttr = new Float32Array(pos.count);
    const basePosAttr = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i);
      const v = 1.0 - uv.getY(i);

      let depthZ = 0.0;
      let wSteer = 0.0;
      let wArm = 0.0;

      const sdArm = this._signedDistToPoly(u, v, rightArmPoly);
      const sdBar = this._signedDistToPoly(u, v, handlebarPoly);

      if (sdArm > -0.02) {
        wArm = Math.max(0, Math.min(1, (sdArm + 0.02) / 0.04));
        const armProgress = Math.max(0, Math.min(1, (u - 0.67) / 0.32));
        const armArch = Math.max(0, Math.min(1, sdArm / 0.045));
        depthZ += wArm * (0.14 + armProgress * 0.22 + Math.sin(armArch * Math.PI * 0.5) * 0.055);
      }

      if (sdBar > -0.02) {
        wSteer = Math.max(0, Math.min(1, (sdBar + 0.02) / 0.04)) * (1.0 - wArm * 0.55);
        const centerPadBump = Math.exp(-Math.pow((u - 0.435) / 0.09, 2) - Math.pow((v - 0.66) / 0.06, 2)) * 0.08;
        const barArch = Math.max(0, Math.min(1, sdBar / 0.04));
        depthZ += wSteer * (0.11 + centerPadBump + Math.sin(barArch * Math.PI * 0.5) * 0.04);
      }

      const hoodCrown = Math.exp(-Math.pow((u - 0.45) / 0.22, 2)) * 0.06;
      depthZ += (1.0 - Math.max(wArm, wSteer)) * (hoodCrown + (v - 0.5) * 0.08);

      const x0 = pos.getX(i);
      const y0 = pos.getY(i);
      const z0 = depthZ;

      pos.setXYZ(i, x0, y0, z0);
      basePosAttr[i * 3 + 0] = x0;
      basePosAttr[i * 3 + 1] = y0;
      basePosAttr[i * 3 + 2] = z0;
      wSteerAttr[i] = wSteer;
      wArmAttr[i] = wArm;
    }

    this.basePosAttr = basePosAttr;
    this.wSteerAttr = wSteerAttr;
    this.wArmAttr = wArmAttr;
    this.displacedGeo = geo;

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      depthTest: true,
      uniforms: {
        uMap: { value: this.craftTexture },
        uSteer: { value: 0.0 },
        uLookOffset: { value: new THREE.Vector2(0, 0) },
        uTrickGlow: { value: 0.0 },
      },
      vertexShader: `
        uniform vec2 uLookOffset;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vUv = uv;
          vDepth = position.z;
          vec2 parallax = uLookOffset * (0.65 + vDepth * 1.15);
          gl_Position = vec4(position.x + parallax.x, position.y + parallax.y, -vDepth * 0.5, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uSteer;
        uniform float uTrickGlow;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vec4 tex = texture2D(uMap, vUv);
          if (tex.a < 0.02) discard;
          // Crisp Retina micro-specular highlight across wet handlebars & forearm
          float sheen = sin(vUv.x * 6.283 + uSteer * 3.8) * 0.025 * vDepth;
          float sunRim = smoothstep(0.12, 0.35, vDepth) * 0.018 * (1.0 + uTrickGlow * 1.5);
          vec3 col = clamp(tex.rgb + sheen + vec3(1.0, 0.97, 0.90) * sunRim, 0.0, 1.0);
          gl_FragColor = vec4(col, tex.a);
        }
      `,
    });

    this.craftMesh = new THREE.Mesh(geo, mat);
    this.craftMesh.frustumCulled = false;
    this.root.add(this.craftMesh);

    this._updateLiveSpeedometer(23);
  }

  _updateLiveSpeedometer(speedMph) {
    if (!this.liveCtx || !this.baseCraftCanvas) return;
    const rounded = Math.round(speedMph);
    if (rounded === this.lastSpeedMph) return;
    this.lastSpeedMph = rounded;

    const W = this.liveCanvas.width;
    const H = this.liveCanvas.height;

    const rx = Math.floor(W * 0.402);
    const ry = Math.floor(H * 0.572);
    const rw = Math.ceil(W * 0.036);
    const rh = Math.ceil(H * 0.032);
    this.liveCtx.clearRect(rx, ry, rw, rh);
    this.liveCtx.drawImage(this.baseCraftCanvas, rx, ry, rw, rh, rx, ry, rw, rh);

    this.liveCtx.save();
    this.liveCtx.fillStyle = 'rgba(150, 166, 174, 0.94)';
    this.liveCtx.fillRect(W * 0.411, H * 0.583, W * 0.020, H * 0.015);

    const fontPx = Math.round(W * 0.01);
    this.liveCtx.font = `700 ${fontPx}px "Inter", monospace`;
    this.liveCtx.fillStyle = '#22323b';
    this.liveCtx.textAlign = 'center';
    this.liveCtx.textBaseline = 'middle';
    this.liveCtx.fillText(String(rounded), W * 0.421, H * 0.591);
    this.liveCtx.restore();

    if (this.craftTexture) {
      this.craftTexture.needsUpdate = true;
    }
  }

  update(dt, time, state) {
    if (!this.loaded || !this.displacedGeo) return;

    const {
      speedKts = 20,
      steerInput = 0,
      throttleInput = 0,
      pitch = 0,
      roll = 0,
      heave = 0,
      lookYaw = 0,
      lookPitch = 0,
      airborne = false,
      trickType = '',
      trickPhase = 0,
      landingShock = 0,
    } = state;

    // Extra bar-whip if performing an aerial Nac-Nac or Can-Can trick
    let trickBarAdd = 0;
    let trickArmAddX = 0;
    let trickArmAddY = 0;
    if (airborne && trickPhase > 0) {
      const s = Math.sin(trickPhase * Math.PI);
      if (trickType === 'NAC-NAC') {
        trickBarAdd = s * 0.32;
        trickArmAddX = s * 0.06;
        trickArmAddY = s * 0.08;
      } else if (trickType === 'NO-HANDER') {
        trickArmAddX = s * 0.14;
        trickArmAddY = s * 0.22;
      } else if (trickType === 'SUPERMAN') {
        trickArmAddY = -s * 0.12;
      } else if (trickType === 'BACKFLIP' || trickType === 'FRONTFLIP') {
        trickBarAdd = Math.sin(trickPhase * Math.PI * 2.0) * 0.08;
        trickArmAddY = s * 0.05;
      } else if (trickType === 'BARREL ROLL') {
        trickBarAdd = s * 0.22;
      }
    }

    this.targetSteerAngle = steerInput * 0.24 + trickBarAdd;
    this.steerAngle += (this.targetSteerAngle - this.steerAngle) * Math.min(1.0, dt * 12.0);

    const speedMph = speedKts * 1.15078;
    this._updateLiveSpeedometer(speedMph);

    const pos = this.displacedGeo.attributes.position;
    const base = this.basePosAttr;
    const wSteer = this.wSteerAttr;
    const wArm = this.wArmAttr;

    // Steering stem pivot in NDC coordinates: (x = -0.13, y = -0.34)
    const pivotX = -0.13;
    const pivotY = -0.34;
    const steerRot = -this.steerAngle * 0.28;
    const cosS = Math.cos(steerRot);
    const sinS = Math.sin(steerRot);

    // Right throttle grip displacement at (x = 0.42, y = -0.40)
    const gripDx = (0.42 - pivotX) * (cosS - 1.0) - (-0.40 - pivotY) * sinS + trickArmAddX;
    const gripDy = (0.42 - pivotX) * sinS + (-0.40 - pivotY) * (cosS - 1.0) + trickArmAddY;

    const vibY = Math.sin(time * 38.0) * 0.0012 * (1.0 + speedKts * 0.02) * (airborne ? 0.25 : 1.0);
    const hullRoll = -roll * 0.22;
    const cosR = Math.cos(hullRoll);
    const sinR = Math.sin(hullRoll);
    const hullPitchY = pitch * 0.16 - heave * 0.022 - landingShock * 0.095;

    for (let i = 0; i < pos.count; i++) {
      let x = base[i * 3 + 0];
      let y = base[i * 3 + 1];
      let z = base[i * 3 + 2];

      const ws = wSteer[i];
      const wa = wArm[i];

      if (ws > 0.001) {
        const dx = x - pivotX;
        const dy = y - pivotY;
        const rx = pivotX + dx * cosS - dy * sinS;
        const ry = pivotY + dx * sinS + dy * cosS;
        x = x + (rx - x) * ws;
        y = y + (ry - y + vibY) * ws;
      }

      if (wa > 0.001) {
        // Right arm is anchored at bottom-right shoulder (x=0.98, y=-0.98) and tracks the right grip at the wrist (x=0.42, y=-0.40)
        const wristReach = Math.max(0.0, Math.min(1.0, (0.98 - x) / 0.56));
        x += gripDx * wa * wristReach;
        y += (gripDy + vibY * 0.6) * wa * wristReach;
      }

      // Subtle 3D hull roll & wave pitch around bottom center
      const hx = x * cosR - (y + 0.55) * sinR;
      const hy = x * sinR + (y + 0.55) * cosR - 0.55 + hullPitchY;

      pos.setXYZ(i, hx, hy, z);
    }

    pos.needsUpdate = true;
    if (this.craftMesh.material.uniforms) {
      this.craftMesh.material.uniforms.uSteer.value = this.steerAngle;
      this.craftMesh.material.uniforms.uTrickGlow.value = airborne ? 1.0 : 0.0;
      this.craftMesh.material.uniforms.uLookOffset.value.set(
        lookYaw * 0.45,
        -lookPitch * 0.45
      );
    }
  }

  setVisible(visible) {
    this.root.visible = visible;
  }
}
