import * as THREE from 'three';
import { assetAtlas } from './assetAtlas.js';

// Stylized 3D Carrot Cove Suburban Arena matching ui-gameplay-v2.png, env-fortnite-suburb-v2.png & env-map-v2.png
// Uses real tiling textures (tex-road, tex-grass, tex-brick, tex-house-blue, tex-crate, tex-wood-fence),
// studio prop cutouts from env-props-v2.png, and the painted storm-sky/cliff horizon from env-fortnite-suburb-v2.png.

export class ArenaEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.bouncePads = [];
    this.targetDummies = [];
    this.explosiveBarrels = [];
    this.destructibleCrates = [];
    this.pickups = [];
    this.streetLamps = [];
    this.exitGateBeacon = null;

    this.textureLoader = new THREE.TextureLoader();
    this._buildEnvironment();
  }

  _createMarketSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#d8b888';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#754c24';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 118);

    ctx.fillStyle = '#19683d';
    ctx.font = '900 72px "Chakra Petch", "Arial Black", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('MARKET', 26, 66);

    ctx.save();
    ctx.translate(432, 62);
    ctx.rotate(-0.45);
    ctx.fillStyle = '#2fa84f';
    ctx.beginPath();
    ctx.ellipse(26, -10, 14, 6, 0.3, 0, Math.PI * 2);
    ctx.ellipse(28, 0, 15, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(26, 10, 14, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff6b00';
    ctx.beginPath();
    ctx.moveTo(-36, 0);
    ctx.lineTo(18, -16);
    ctx.lineTo(18, 16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6b2000';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createStorefrontWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Warm sunlit grocery interior with colorful produce shelves
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#5a4632');
    grad.addColorStop(0.25, '#a87e51');
    grad.addColorStop(1, '#3b2d20');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Warm ceiling lamps
    ctx.fillStyle = '#fff5cc';
    ctx.beginPath();
    ctx.ellipse(75, 28, 28, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(185, 28, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Produce shelves (carrots, greens, apples)
    const shelfColors = ['#ff6b00', '#4ade80', '#facc15', '#ef4444'];
    for (let row = 0; row < 3; row++) {
      const y = 85 + row * 52;
      ctx.fillStyle = '#4a3520';
      ctx.fillRect(16, y + 22, 224, 10);
      for (let col = 0; col < 6; col++) {
        ctx.fillStyle = shelfColors[(row + col) % shelfColors.length];
        ctx.beginPath();
        ctx.arc(36 + col * 36, y + 12, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dark Mullion Frame
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 242, 242);
    ctx.beginPath();
    ctx.moveTo(128, 0); ctx.lineTo(128, 256);
    ctx.moveTo(0, 82); ctx.lineTo(256, 82);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createExitSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EXIT \u2192', 128, 48);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createAwningStripesTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const stripeW = 32;
    for (let x = 0; x < 256; x += stripeW) {
      ctx.fillStyle = (Math.floor(x / stripeW) % 2 === 0) ? '#1a7f46' : '#f8fafc';
      ctx.fillRect(x, 0, stripeW, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _createCrateFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // 1. Horizontal warm oak planks
    const plankColors = ['#d49552', '#c88744', '#da9d5b', '#c4823f', '#d2914e'];
    const plankH = 256 / 5;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = plankColors[i];
      ctx.fillRect(0, i * plankH, 256, plankH);
      ctx.fillStyle = '#5c3312';
      ctx.fillRect(0, i * plankH, 256, 3);
    }

    // 2. Diagonal X-Braces
    ctx.strokeStyle = '#5c3312';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(22, 22); ctx.lineTo(234, 234);
    ctx.moveTo(234, 22); ctx.lineTo(22, 234);
    ctx.stroke();

    ctx.strokeStyle = '#dca262';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(22, 22); ctx.lineTo(234, 234);
    ctx.moveTo(234, 22); ctx.lineTo(22, 234);
    ctx.stroke();

    // 3. Outer Perimeter Frame Rails
    const fw = 28;
    ctx.fillStyle = '#b87636';
    ctx.fillRect(0, 0, 256, fw);
    ctx.fillRect(0, 256 - fw, 256, fw);
    ctx.fillRect(0, 0, fw, 256);
    ctx.fillRect(256 - fw, 0, fw, 256);

    ctx.strokeStyle = '#5c3312';
    ctx.lineWidth = 5;
    ctx.strokeRect(2.5, 2.5, 251, 251);
    ctx.strokeRect(fw, fw, 256 - fw * 2, 256 - fw * 2);

    // 4. Dark Iron Corner Bolts
    ctx.fillStyle = '#2d3748';
    for (const [bx, by] of [[14, 14], [242, 14], [14, 242], [242, 242]]) {
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  _createHorizonBackdropTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1672;
    canvas.height = 580;
    const ctx = canvas.getContext('2d');

    // Fallback painted storm-sky gradient before image finishes loading
    const grad = ctx.createLinearGradient(0, 0, 0, 580);
    grad.addColorStop(0, '#364fc7');
    grad.addColorStop(0.28, '#4c6ef5');
    grad.addColorStop(0.68, '#748ffc');
    grad.addColorStop(1, '#58b432');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1672, 580);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    assetAtlas._loadImage('assets/env-fortnite-suburb-v2.png').then((img) => {
      ctx.clearRect(0, 0, 1672, 580);
      // Extend the upper storm-cloud sky upward (y = 0..130) so high camera angles never show flat sky
      ctx.save();
      ctx.translate(0, 125);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, 1672, 125, 0, 0, 1672, 125);
      ctx.restore();

      // Draw upper 460px of env-fortnite-suburb-v2.png (storm sky, cliff ridge, hilltop cabin & pines)
      ctx.drawImage(img, 0, 0, 1672, 460, 0, 120, 1672, 460);

      // Softly feather bottom 28px so it blends seamlessly into the 3D street & lawn
      const imgData = ctx.getImageData(0, 0, 1672, 580);
      const d = imgData.data;
      for (let y = 552; y < 580; y++) {
        const alpha = Math.max(0, Math.round(255 * (1 - (y - 552) / 28)));
        for (let x = 0; x < 1672; x++) {
          d[(y * 1672 + x) * 4 + 3] = alpha;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      tex.needsUpdate = true;
    }).catch(() => {});

    return tex;
  }

  _createLushGrassTexture(repeatX = 18, repeatY = 18) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Rich sunny Fortnite lawn base
    ctx.fillStyle = '#4fb82e';
    ctx.fillRect(0, 0, 256, 256);

    // Seamless overlapping soft organic lawn patches (wrapped across 256x256 boundaries)
    const patches = [
      [40, 50, 62, '#58c634'], [160, 80, 70, '#46a827'],
      [90, 180, 68, '#5acc36'], [210, 200, 60, '#44a325'],
      [130, 110, 55, '#54bf31'], [20, 220, 58, '#59c935']
    ];
    for (const [px, py, r, col] of patches) {
      for (const ox of [-256, 0, 256]) {
        for (const oy of [-256, 0, 256]) {
          const grad = ctx.createRadialGradient(px + ox, py + oy, 4, px + ox, py + oy, r);
          grad.addColorStop(0, col);
          grad.addColorStop(1, 'rgba(79, 184, 46, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px + ox, py + oy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Fine stylized grass blade strokes (deterministic pseudo-random for crispness)
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    ctx.lineWidth = 2;
    for (let i = 0; i < 420; i++) {
      const gx = rand() * 256;
      const gy = rand() * 256;
      const gh = 5 + rand() * 6;
      const tilt = (rand() - 0.5) * 4;
      ctx.strokeStyle = i % 2 === 0 ? '#68d840' : '#3d9820';
      for (const ox of [-256, 0, 256]) {
        for (const oy of [-256, 0, 256]) {
          ctx.beginPath();
          ctx.moveTo(gx + ox, gy + oy);
          ctx.lineTo(gx + ox + tilt, gy + oy - gh);
          ctx.stroke();
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 8;
    return tex;
  }

  _createConcreteSidewalkTexture(repeatX = 2, repeatY = 36) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ddd9cf';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle aggregate grain & warm/cool concrete mottling
    let seed = 4099;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 650; i++) {
      const x = rand() * 256;
      const y = rand() * 256;
      const r = 1 + rand() * 2.5;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.28)' : 'rgba(120,114,102,0.22)';
      ctx.fillRect(x, y, r, r);
    }

    // Horizontal & vertical expansion joints for concrete slabs
    ctx.fillStyle = '#9e998e';
    ctx.fillRect(0, 0, 256, 5);
    ctx.fillRect(0, 126, 256, 4);
    ctx.fillRect(126, 0, 4, 256);

    ctx.fillStyle = '#f2efe6';
    ctx.fillRect(0, 5, 256, 3);
    ctx.fillRect(0, 130, 256, 3);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 8;
    return tex;
  }

  _createStoneMasonryTexture(repeatX = 4, repeatY = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#cfc4ae';
    ctx.fillRect(0, 0, 256, 128);

    const shades = ['#d8ceb8', '#c4b89f', '#ded4c0', '#bcb096'];
    const rowH = 32;
    for (let r = 0; r < 4; r++) {
      const offset = (r % 2) * 32;
      for (let c = -1; c < 5; c++) {
        const bx = c * 64 + offset;
        const by = r * rowH;
        ctx.fillStyle = shades[(r + c + 4) % shades.length];
        ctx.fillRect(bx + 2, by + 2, 60, rowH - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(bx + 2, by + 2, 60, 3);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
  }

  _createFoliageCanopyTexture(baseHex = '#46b824', lightHex = '#74e346', darkHex = '#2a7d14') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    let seed = 8821;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 160; i++) {
      const x = rand() * 256;
      const y = rand() * 256;
      const rx = 10 + rand() * 16;
      const ry = 7 + rand() * 11;
      const rot = rand() * Math.PI;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = i % 3 === 0 ? darkHex : (i % 3 === 1 ? lightHex : baseHex);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(20, 60, 10, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  _createTreeBarkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#754c29';
    ctx.fillRect(0, 0, 128, 256);

    const cols = ['#5c381b', '#875a33', '#4a2c14', '#694222'];
    for (let x = 0; x < 128; x += 8) {
      ctx.fillStyle = cols[(x / 8) % cols.length];
      ctx.fillRect(x, 0, 6, 256);
    }
    ctx.strokeStyle = '#3b210d';
    ctx.lineWidth = 3;
    for (let y = 16; y < 256; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(64, y + 6);
      ctx.lineTo(128, y - 4);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  _createVehiclePaintTexture(baseHex, highlightHex, seamHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, highlightHex);
    grad.addColorStop(0.45, baseHex);
    grad.addColorStop(0.55, highlightHex);
    grad.addColorStop(1, baseHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle body panel lines, beltline crease & door seams
    ctx.strokeStyle = seamHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 240, 240);
    ctx.beginPath();
    ctx.moveTo(128, 8); ctx.lineTo(128, 248);
    ctx.moveTo(8, 118); ctx.lineTo(248, 118);
    ctx.stroke();

    // Stylized gloss clearcoat reflection band
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, 88, 256, 22);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createHazardStripeTexture(repeatX = 6, repeatY = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 256, 128);

    ctx.fillStyle = '#1e293b';
    for (let x = -128; x < 384; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 32, 0);
      ctx.lineTo(x - 32, 128);
      ctx.lineTo(x - 64, 128);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 256, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
  }

  _createCorrugatedContainerTexture(baseHex = '#b93829', darkHex = '#7f1d1d') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 256);

    // Corrugated vertical steel shadow/highlight ribs
    for (let x = 0; x < 512; x += 24) {
      ctx.fillStyle = darkHex;
      ctx.fillRect(x, 16, 8, 224);
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.fillRect(x + 8, 16, 6, 224);
    }

    // Top/bottom heavy steel frame rails
    ctx.fillStyle = '#6b1818';
    ctx.fillRect(0, 0, 512, 18);
    ctx.fillRect(0, 238, 512, 18);

    // Stenciled industrial shipping container markings
    ctx.fillStyle = 'rgba(255, 248, 235, 0.88)';
    ctx.font = '900 30px "Chakra Petch", sans-serif';
    ctx.fillText('CARROT CARGO // CC-03', 38, 72);
    ctx.font = '700 18px "Chakra Petch", sans-serif';
    ctx.fillText('MAX GROSS 30,480 KG  •  TARE 3,800 KG', 40, 102);

    // Warning diamond badge
    ctx.fillStyle = '#facc15';
    ctx.fillRect(420, 42, 48, 48);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.strokeRect(420, 42, 48, 48);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createBayDoorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 32) {
      const grad = ctx.createLinearGradient(0, y, 0, y + 32);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 256, 29);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, y + 29, 256, 3);
    }

    // Center steel handle plate
    ctx.fillStyle = '#facc15';
    ctx.fillRect(104, 196, 48, 16);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(104, 196, 48, 16);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createDumpsterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e6638';
    ctx.fillRect(0, 0, 256, 256);

    // Painted steel panel ribs & edge wear
    for (let y = 24; y < 232; y += 52) {
      ctx.fillStyle = '#144726';
      ctx.fillRect(12, y, 232, 10);
      ctx.fillStyle = '#2b824b';
      ctx.fillRect(12, y + 10, 232, 6);
    }

    // Stenciled recycling carrot emblem
    ctx.fillStyle = 'rgba(240, 253, 244, 0.85)';
    ctx.font = '900 22px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CARROT COVE DISPOSAL', 128, 126);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _buildEnvironment() {
    // 1. Vibrant Fortnite Storm-Blue Sky & Golden Hour Sunlight
    this.scene.background = new THREE.Color(0x4666f2);
    this.scene.fog = new THREE.FogExp2(0x6e8eff, 0.0032);

    const sunLight = new THREE.DirectionalLight(0xfff4d6, 2.05);
    sunLight.position.set(28, 78, 52);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 190;
    sunLight.shadow.camera.left = -65;
    sunLight.shadow.camera.right = 65;
    sunLight.shadow.camera.top = 65;
    sunLight.shadow.camera.bottom = -65;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xa8caff, 0x5c9638, 1.05);
    this.scene.add(hemiLight);

    // 2. Seamless Stylized Lawn & Tiling Asset Textures
    const grassTex = this._createLushGrassTexture(24, 24);
    const vergeGrassTex = this._createLushGrassTexture(2, 24);
    const roadTex = assetAtlas.loadTilingTexture('assets/tex-road.png', 1, 12, true);
    const brickTex = assetAtlas.loadTilingTexture('assets/tex-brick.png', 3, 2);
    const blueHouseTex = assetAtlas.loadTilingTexture('assets/tex-house-blue.png', 2, 2);
    const crateTex = this._createCrateFaceTexture();
    const fenceTex = assetAtlas.loadTilingTexture('assets/tex-wood-fence.png', 2, 1);

    const grassMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      color: 0x76d63e,
      roughness: 0.82
    });
    const vergeGrassMat = new THREE.MeshStandardMaterial({
      map: vergeGrassTex,
      color: 0x74d43b,
      roughness: 0.8
    });
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      color: 0xb8bcc4,
      roughness: 0.86
    });
    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: this._createConcreteSidewalkTexture(2, 36),
      color: 0xe2dfd7,
      roughness: 0.78
    });
    const curbMat = new THREE.MeshStandardMaterial({
      map: this._createConcreteSidewalkTexture(1, 36),
      color: 0xc2bfb5,
      roughness: 0.72
    });
    const blueSidingMat = new THREE.MeshStandardMaterial({
      map: blueHouseTex,
      color: 0x5696db,
      roughness: 0.58
    });
    const whiteTrimMat = new THREE.MeshStandardMaterial({
      map: this._createCottageSidingTexture('#f1f5f9'),
      color: 0xf8fafc,
      roughness: 0.48
    });
    const roofSlateMat = new THREE.MeshStandardMaterial({
      map: this._createShingleRoofTexture(),
      color: 0x556478,
      roughness: 0.65
    });
    const redBrickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      color: 0xd87a5e,
      roughness: 0.72
    });
    const stoneTrimMat = new THREE.MeshStandardMaterial({
      map: this._createStoneMasonryTexture(4, 2),
      color: 0xd8ceb8,
      roughness: 0.68
    });
    const crateMat = new THREE.MeshStandardMaterial({
      map: crateTex,
      color: 0xfff5e8,
      roughness: 0.65
    });
    const fenceWoodMat = new THREE.MeshStandardMaterial({
      map: fenceTex,
      color: 0xebe2d5,
      roughness: 0.72
    });
    const yellowCarMat = new THREE.MeshStandardMaterial({
      map: this._createVehiclePaintTexture('#ffcb1f', '#ffe066', '#d97706'),
      color: 0xffd43b,
      emissive: 0x2e1e00,
      roughness: 0.25,
      metalness: 0.16
    });
    const blueTruckMat = new THREE.MeshStandardMaterial({
      map: this._createVehiclePaintTexture('#3572bd', '#60a5fa', '#1e3a8a'),
      color: 0x3b82f6,
      emissive: 0x0a1c36,
      roughness: 0.30,
      metalness: 0.18
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      map: this._createFoliageCanopyTexture('#46b824', '#74e346', '#2a7d14'),
      color: 0x62d938,
      roughness: 0.65
    });
    const pineMat = new THREE.MeshStandardMaterial({
      map: this._createFoliageCanopyTexture('#22782b', '#41a64c', '#144d1b'),
      color: 0x389c42,
      roughness: 0.68
    });
    const trunkMat = new THREE.MeshStandardMaterial({
      map: this._createTreeBarkTexture(),
      color: 0x8c5b32,
      roughness: 0.80
    });
    const cliffRockMat = new THREE.MeshStandardMaterial({
      map: this._createStoneMasonryTexture(3, 3),
      color: 0x949ba6,
      roughness: 0.85,
      flatShading: true
    });

    // 3. Ground Lawn (220m x 220m)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 4. Main Cracked Asphalt Street (Carrot Cove Avenue along Z)
    const road = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 130), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.02, -4);
    road.receiveShadow = true;
    this.scene.add(road);

    // Concrete Sidewalks & Lush Grass Verges on Left (-X) and Right (+X)
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 130), curbMat);
      curb.position.set(side * 6.0, 0.09, -4);
      curb.receiveShadow = true;
      this.scene.add(curb);

      const verge = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 130), vergeGrassMat);
      verge.position.set(side * 7.05, 0.08, -4);
      verge.receiveShadow = true;
      this.scene.add(verge);

      const walk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.17, 130), sidewalkMat);
      walk.position.set(side * 9.1, 0.085, -4);
      walk.receiveShadow = true;
      this.scene.add(walk);
    }

    // White Zebra Crosswalk across the street at Z = 7.8 (matching ui-gameplay-v2.png)
    for (let x = -4.5; x <= 4.5; x += 1.5) {
      const stripe = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 2.5),
        new THREE.MeshBasicMaterial({ color: 0xedeff2 })
      );
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(x, 0.035, 7.8);
      this.scene.add(stripe);
    }

    // =========================================================================
    // ZONE 01: NEIGHBORHOOD (Left / -X Side & Foreground: Blue House, Yellow Car)
    // =========================================================================
    this._buildBlueSuburbanHouse(-14.6, 0, 9.8, blueSidingMat, whiteTrimMat, roofSlateMat);

    // White Picket Fence along front/side yard of Blue House
    this._createPicketFence(-9.6, 0, 4.8, 6.5, true, fenceWoodMat);
    this._createPicketFence(-13.5, 0, 1.5, 8.0, false, fenceWoodMat);
    this._createPicketFence(-9.6, 0, 19.2, 6.0, true, fenceWoodMat);

    // Round green shrubs beside Blue House & fence
    this._createBush(-9.0, 0, 9.8, 1.15, foliageMat);
    this._createBush(-9.0, 0, 7.2, 0.98, foliageMat);
    this._createBush(-9.0, 0, 16.5, 1.08, foliageMat);

    // Parked Yellow Sedan on Left Curb (x = -4.6, z = 10.6) — framed on left like ui-gameplay-v2.png!
    this._createYellowSedan(-4.6, 0, 10.6, yellowCarMat);

    // Wooden Cover Crates on Left Side near crosswalk (where left Raider peeks in ui-gameplay-v2.png)
    this._createCrate(-3.6, 0, 7.4, 1.35, crateMat);
    this._createCrate(-4.9, 0, 7.7, 1.20, crateMat);

    // =========================================================================
    // ZONE 02: MARKET AVENUE (Right / +X Side: Red-Brick MARKET, Awning, Crates, Pickup)
    // =========================================================================
    this._buildRedBrickMarket(13.8, 0, 7.2, redBrickMat, stoneTrimMat);

    // Wooden Cover Crates in front of Market (where right Raider shoots in ui-gameplay-v2.png)
    this._createCrate(4.7, 0, 8.8, 1.34, crateMat);
    this._createCrate(6.1, 0, 9.1, 1.34, crateMat);
    this._createCrate(8.3, 0, 11.8, 1.42, crateMat);

    // Broken Crate Debris Accent
    this._createDebris(4.4, 0.03, 10.2);

    // Green Wheeled Dumpster & Yellow Fire Hydrant on Right Sidewalk
    this._createDumpster(9.1, 0, 14.2);
    this._createFireHydrant(7.3, 0, 8.2);

    // Curved Overhanging Streetlamp on Right Curb (placed at z = 3.5 so MARKET sign is 100% unobstructed!)
    this._createStreetLamp(6.2, 0, 3.5, -1);
    this._createStreetLamp(-6.2, 0, 0.2, 1);

    // Parked Blue Pickup Truck further down the street on the Right (x = 4.1, z = 1.2)
    this._createBluePickupTruck(4.1, 0, 1.2, blueTruckMat);

    // Explosive Carrot-Fuel Hazard Barrels near enemy cover spots (CoD/Fortnite chain-reaction barrels!)
    this._createExplosiveBarrel(-4.3, 0, 6.2);
    this._createExplosiveBarrel(5.5, 0, 7.5);
    this._createExplosiveBarrel(5.6, 0, -0.8);
    this._createExplosiveBarrel(-4.8, 0, -3.5);
    this._createExplosiveBarrel(3.8, 0, -14.5);
    this._createExplosiveBarrel(-3.2, 0, -24.5);
    this._createExplosiveBarrel(4.8, 0, -26.0);

    // Detailed Suburban Cottages behind Market/trees (with clapboard siding, pitched roofs, windows & chimneys)
    this._buildDistantHouse(15.5, 0, -10.5, whiteTrimMat, roofSlateMat, '#e9e2d4', '#335d8a');
    this._buildDistantHouse(-16.5, 0, -8.5, whiteTrimMat, roofSlateMat, '#dce6f2', '#7a3e2e');

    // Glowing Blue Bounce Pads (with studio bounce_pad_fx vortex)
    this._createBouncePad(-7.2, 0.08, 4.5, 2.2, new THREE.Vector3(1.2, 12.2, -8.5));
    this._createBouncePad(2.8, 0.08, -5.5, 2.2, new THREE.Vector3(-0.6, 12.6, -9.0));
    this._createBouncePad(2.5, 0.08, -24.5, 2.2, new THREE.Vector3(0.0, 12.8, -8.5));

    // =========================================================================
    // ZONE 03: SERVICE YARD & EXIT GATE (North / Z = -16 to -44)
    // =========================================================================
    this._buildServiceYard(0, 0, -32.0, stoneTrimMat, roofSlateMat, crateMat);

    // =========================================================================
    // PAINTED HORIZON SKY/CLIFF PANORAMA + 3D CLIFFS & TREES
    // =========================================================================
    this._buildBackgroundHillAndCliffs(grassMat, cliffRockMat, foliageMat, pineMat, trunkMat);

    // Studio-Painted 2.5D/3D Hybrid Deciduous & Pine Trees framing Carrot Cove street
    this._createDeciduousTree(-8.4, 0, 3.8, 1.28, foliageMat, trunkMat);
    this._createDeciduousTree(-8.2, 0, -14.5, 1.35, foliageMat, trunkMat);
    this._createDeciduousTree(8.5, 0, 1.8, 1.22, foliageMat, trunkMat);
    this._createDeciduousTree(9.2, 0, 22.8, 1.3, foliageMat, trunkMat);
    this._createPineTree(-12.8, 0, 1.8, 1.45, pineMat, trunkMat);
    this._createPineTree(-10.5, 0, -0.5, 1.25, pineMat, trunkMat);
    this._createPineTree(7.6, 0, -7.8, 1.2, pineMat, trunkMat);
  }

  _createShingleRoofTexture(baseHex = '#3d4856', highlightHex = '#526072') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    const rows = 8;
    const cols = 6;
    const rh = 256 / rows;
    const cw = 256 / cols;
    for (let r = 0; r < rows; r++) {
      const y = r * rh;
      const offset = (r % 2) * (cw * 0.5);
      ctx.fillStyle = (r % 2 === 0) ? baseHex : highlightHex;
      ctx.fillRect(0, y, 256, rh - 2);
      ctx.strokeStyle = '#1e242d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, y + rh - 1);
      ctx.lineTo(256, y + rh - 1);
      for (let c = 0; c <= cols; c++) {
        const x = (c * cw + offset) % 256;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rh);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }

  _createCottageSidingTexture(baseHex = '#e9e2d4') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    const planks = 12;
    const ph = 256 / planks;
    for (let i = 0; i < planks; i++) {
      const y = i * ph;
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.fillRect(0, y, 256, 3);
      ctx.fillStyle = 'rgba(15,23,42,0.18)';
      ctx.fillRect(0, y + ph - 3, 256, 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  _createPitchedGableRoof(width, length, ridgeHeight, roofMat, trimMat) {
    const roofGroup = new THREE.Group();
    const halfW = width * 0.5 + 0.55;
    const halfL = length * 0.5 + 0.55;
    const slopeLen = Math.hypot(halfW, ridgeHeight);
    const slopeAngle = Math.atan2(ridgeHeight, halfW);

    // Left and Right pitched shingle roof slopes
    for (const side of [-1, 1]) {
      const slope = new THREE.Mesh(
        new THREE.BoxGeometry(slopeLen, 0.26, halfL * 2),
        roofMat
      );
      slope.position.set(side * (halfW * 0.5), ridgeHeight * 0.5, 0);
      slope.rotation.z = -side * slopeAngle;
      slope.castShadow = true;
      slope.receiveShadow = true;
      roofGroup.add(slope);

      // White eave fascia board
      const fascia = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.32, halfL * 2 + 0.08),
        trimMat
      );
      fascia.position.set(side * halfW, 0.05, 0);
      roofGroup.add(fascia);
    }

    // Ridge beam cap
    const ridgeCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.28, halfL * 2 + 0.1),
      trimMat
    );
    ridgeCap.position.set(0, ridgeHeight + 0.04, 0);
    roofGroup.add(ridgeCap);

    // Front and Back triangular gable walls
    const shape = new THREE.Shape();
    shape.moveTo(-width * 0.5, 0);
    shape.lineTo(width * 0.5, 0);
    shape.lineTo(0, ridgeHeight);
    shape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    gableGeo.translate(0, 0, -length * 0.5);
    const gableMesh = new THREE.Mesh(gableGeo, trimMat);
    gableMesh.castShadow = true;
    roofGroup.add(gableMesh);

    return roofGroup;
  }

  _buildBlueSuburbanHouse(x, y, z, sidingMat, trimMat, roofMat) {
    const house = new THREE.Group();
    house.position.set(x, y, z);

    const w = 10.5;
    const h = 7.4;
    const d = 12.0;

    const shingleMat = new THREE.MeshStandardMaterial({
      map: this._createShingleRoofTexture('#3c4757', '#4f5d73'),
      roughness: 0.65
    });
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.5 });
    const brickChimneyMat = new THREE.MeshStandardMaterial({ color: 0x9c4232, roughness: 0.75 });

    // Stone foundation plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.35, 0.55, d + 0.35),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
    );
    plinth.position.y = 0.275;
    house.add(plinth);

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), sidingMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    house.add(body);

    // Corner vertical white trim boards & mid-floor belt course
    for (const cx of [-w / 2, w / 2]) {
      for (const cz of [-d / 2, d / 2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, h + 0.1, 0.32), trimMat);
        post.position.set(cx, h / 2, cz);
        house.add(post);
      }
    }
    const belt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.22, 0.28, d + 0.22), trimMat);
    belt.position.y = 3.75;
    house.add(belt);

    // True Pitched Shingled Gable Roof + Brick Chimney
    const pitchedRoof = this._createPitchedGableRoof(w, d, 3.3, shingleMat, trimMat);
    pitchedRoof.position.y = h;
    house.add(pitchedRoof);

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.15, 3.8, 1.15), brickChimneyMat);
    chimney.position.set(-1.8, h + 2.1, -2.5);
    chimney.castShadow = true;
    house.add(chimney);

    // Front Porch with Gable Pediment, Deck & Steps facing the street (+X)
    const porchDeck = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.42, 5.4),
      new THREE.MeshStandardMaterial({ color: 0xc8bca8, roughness: 0.7 })
    );
    porchDeck.position.set(w / 2 + 1.3, 0.21, 1.5);
    porchDeck.receiveShadow = true;
    house.add(porchDeck);

    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.34, 5.5), shingleMat);
    porchRoof.position.set(w / 2 + 1.25, 3.65, 1.5);
    porchRoof.rotation.z = -0.18;
    porchRoof.castShadow = true;
    house.add(porchRoof);

    for (const pz of [-0.8, 3.8]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.4, 0.32), trimMat);
      col.position.set(w / 2 + 2.35, 1.85, pz);
      col.castShadow = true;
      house.add(col);
    }

    // Front Door under porch with warm brass handle & window lite
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.45 });
    const frontDoor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.35, 1.15), doorMat);
    frontDoor.position.set(w / 2 + 0.06, 1.55, 1.5);
    house.add(frontDoor);

    // Paneled Roll-Up Garage Door on side-front
    const garageGroup = new THREE.Group();
    garageGroup.position.set(w / 2 + 0.06, 1.5, -2.6);
    const garageFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.95, 3.65), trimMat);
    garageGroup.add(garageFrame);
    for (let p = 0; p < 4; p++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.58, 3.35),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45 })
      );
      panel.position.set(0.02, -1.0 + p * 0.66, 0);
      garageGroup.add(panel);
    }
    house.add(garageGroup);

    // White-trimmed mullioned windows with louvered shutters on street-facing facade (+X)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x67a3d9,
      emissive: 0x1d3b5c,
      roughness: 0.18,
      metalness: 0.45
    });
    for (const wy of [2.15, 5.35]) {
      for (const wz of [-2.6, 2.2]) {
        if (wy < 3.0 && wz === -2.6) continue;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.58, 1.75), trimMat);
        frame.position.set(w / 2 + 0.05, wy, wz);
        house.add(frame);

        const pane = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.28, 1.42), glassMat);
        pane.position.set(w / 2 + 0.06, wy, wz);
        house.add(pane);

        // Mullion crossbars
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.30, 0.08), trimMat);
        vBar.position.set(w / 2 + 0.07, wy, wz);
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 1.44), trimMat);
        hBar.position.set(w / 2 + 0.07, wy, wz);
        house.add(vBar, hBar);

        // Left & Right Navy Shutters
        for (const sSide of [-1, 1]) {
          const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.20, 1.52, 0.42), shutterMat);
          shutter.position.set(w / 2 + 0.06, wy, wz + sSide * 1.12);
          house.add(shutter);
        }
      }

      // South-facing (+Z) facade windows & navy shutters so visible from foreground!
      for (const wx of [-2.4, 2.2]) {
        const frameZ = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.58, 0.18), trimMat);
        frameZ.position.set(wx, wy, d / 2 + 0.05);
        const paneZ = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.28, 0.22), glassMat);
        paneZ.position.set(wx, wy, d / 2 + 0.06);
        const vBarZ = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.30, 0.25), trimMat);
        vBarZ.position.set(wx, wy, d / 2 + 0.07);
        const hBarZ = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.08, 0.25), trimMat);
        hBarZ.position.set(wx, wy, d / 2 + 0.07);
        house.add(frameZ, paneZ, vBarZ, hBarZ);

        for (const sSide of [-1, 1]) {
          const shutterZ = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.52, 0.20), shutterMat);
          shutterZ.position.set(wx + sSide * 1.12, wy, d / 2 + 0.06);
          house.add(shutterZ);
        }
      }
    }

    this.scene.add(house);

    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(x - w / 2, y, z - d / 2),
      new THREE.Vector3(x + w / 2 + 0.6, y + h + 1.5, z + d / 2)
    ));
  }

  _buildRedBrickMarket(x, y, z, brickMat, trimMat) {
    const market = new THREE.Group();
    market.position.set(x, y, z);

    const w = 11.0;
    const h = 8.4;
    const d = 14.5;

    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), brickMat);
    mainBox.position.y = h / 2;
    mainBox.castShadow = true;
    mainBox.receiveShadow = true;
    market.add(mainBox);

    // Stone roof cornice & middle belt trim
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.55, 0.55, d + 0.55), trimMat);
    cornice.position.y = h + 0.25;
    market.add(cornice);

    // Commercial Tar-and-Gravel Roof Deck (visible in aerial Map Overview)
    const roofDeck = new THREE.Mesh(
      new THREE.BoxGeometry(w - 0.3, 0.18, d - 0.3),
      new THREE.MeshStandardMaterial({
        map: this._createConcreteSidewalkTexture(4, 6),
        color: 0x475569,
        roughness: 0.85
      })
    );
    roofDeck.position.y = h + 0.48;
    market.add(roofDeck);

    const beltTrim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.35, d + 0.3), trimMat);
    beltTrim.position.y = 4.25;
    market.add(beltTrim);

    // Rooftop HVAC Units & Skylight (visible in env-map-v2.png and ui-gameplay-v2.png)
    const hvacMat = new THREE.MeshStandardMaterial({
      map: this._createBayDoorTexture(),
      color: 0x94a3b8,
      roughness: 0.45,
      metalness: 0.35
    });
    const hvac1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.6), hvacMat);
    hvac1.position.set(-2.2, h + 1.0, 1.2);
    const hvac2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 2.1), hvacMat);
    hvac2.position.set(2.1, h + 0.88, -2.8);
    market.add(hvac1, hvac2);

    // MARKET Sign Board on Street Facade (-X side facing street)
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 1.5, 6.4),
      new THREE.MeshBasicMaterial({ map: this._createMarketSignTexture() })
    );
    signBoard.position.set(-w / 2 - 0.14, 5.05, 0.5);
    market.add(signBoard);

    // Green-and-White Striped Awning below the MARKET sign
    const awningGroup = new THREE.Group();
    awningGroup.position.set(-w / 2 - 1.15, 3.78, 0.5);
    const awningMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.45, 0.24, 6.5),
      new THREE.MeshStandardMaterial({ map: this._createAwningStripesTexture(), roughness: 0.55 })
    );
    awningMesh.rotation.z = 0.28;
    awningMesh.castShadow = true;
    awningGroup.add(awningMesh);
    market.add(awningGroup);

    // Rich Painted Storefront Windows showing interior shelves of produce
    const winTex = this._createStorefrontWindowTexture();
    const storeWinMat = new THREE.MeshBasicMaterial({ map: winTex });
    const frameDarkMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5 });
    for (const wz of [-1.4, 2.2]) {
      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 2.8), frameDarkMat);
      winFrame.position.set(-w / 2 - 0.04, 1.65, wz);
      market.add(winFrame);

      const glowPane = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.55, 2.55), storeWinMat);
      glowPane.position.set(-w / 2 - 0.06, 1.65, wz);
      market.add(glowPane);
    }

    // Upper floor mullioned windows
    const upperGlassMat = new THREE.MeshStandardMaterial({ color: 0x3b4d66, roughness: 0.25, metalness: 0.4 });
    for (const wz of [-2.4, 1.8]) {
      const uFrame = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.75, 1.6), trimMat);
      uFrame.position.set(-w / 2 - 0.04, 6.65, wz);
      market.add(uFrame);

      const uGlass = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.45, 1.3), upperGlassMat);
      uGlass.position.set(-w / 2 - 0.06, 6.65, wz);
      market.add(uGlass);
    }

    this.scene.add(market);

    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(x - w / 2 - 0.3, y, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h + 0.6, z + d / 2)
    ));
  }

  _buildDistantHouse(x, y, z, trimMat, roofMat, sidingHex = '#e9e2d4', shutterHex = '#335d8a') {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const faceSign = x < 0 ? 1 : -1;

    const w = 9.0;
    const h = 6.0;
    const d = 9.4;

    const sidingMat = new THREE.MeshStandardMaterial({
      map: this._createCottageSidingTexture(sidingHex),
      roughness: 0.62
    });
    const shingleMat = new THREE.MeshStandardMaterial({
      map: this._createShingleRoofTexture('#3d4856', '#526072'),
      roughness: 0.65
    });
    const shutterMat = new THREE.MeshStandardMaterial({ color: shutterHex, roughness: 0.55 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x67a3d9,
      emissive: 0x203e5f,
      roughness: 0.2,
      metalness: 0.4
    });

    // Foundation plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.3, 0.45, d + 0.3),
      new THREE.MeshStandardMaterial({ color: 0x8b95a5, roughness: 0.8 })
    );
    plinth.position.y = 0.225;
    g.add(plinth);

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), sidingMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);

    // Corner trim posts & mid belt
    for (const cx of [-w / 2, w / 2]) {
      for (const cz of [-d / 2, d / 2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, h + 0.08, 0.28), trimMat);
        post.position.set(cx, h / 2, cz);
        g.add(post);
      }
    }
    const belt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.18, 0.24, d + 0.18), trimMat);
    belt.position.y = 3.05;
    g.add(belt);

    // True Pitched Shingled Gable Roof + Chimney
    const pitchedRoof = this._createPitchedGableRoof(w, d, 2.7, shingleMat, trimMat);
    pitchedRoof.position.y = h;
    g.add(pitchedRoof);

    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 3.1, 0.95),
      new THREE.MeshStandardMaterial({ color: 0x9c4232, roughness: 0.75 })
    );
    chimney.position.set(-faceSign * 1.4, h + 1.8, -1.8);
    g.add(chimney);

    // Street-facing Windows & Shutters + South-facing (+Z) Windows so visible looking down street!
    for (const wy of [1.75, 4.45]) {
      for (const wz of [-2.1, 2.1]) {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.38, 1.45), trimMat);
        frame.position.set(faceSign * (w / 2 + 0.04), wy, wz);
        const pane = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.12, 1.18), glassMat);
        pane.position.set(faceSign * (w / 2 + 0.05), wy, wz);
        g.add(frame, pane);

        for (const sSide of [-1, 1]) {
          const sh = new THREE.Mesh(new THREE.BoxGeometry(0.20, 1.34, 0.34), shutterMat);
          sh.position.set(faceSign * (w / 2 + 0.05), wy, wz + sSide * 0.92);
          g.add(sh);
        }
      }

      // South-facing (+Z) facade windows facing toward player camera!
      for (const wx of [-2.1, 2.1]) {
        const frameZ = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.38, 0.18), trimMat);
        frameZ.position.set(wx, wy, d / 2 + 0.04);
        const paneZ = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.12, 0.22), glassMat);
        paneZ.position.set(wx, wy, d / 2 + 0.05);
        g.add(frameZ, paneZ);

        for (const sSide of [-1, 1]) {
          const shZ = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.34, 0.20), shutterMat);
          shZ.position.set(wx + sSide * 0.92, wy, d / 2 + 0.05);
          g.add(shZ);
        }
      }
    }

    // Small Covered Stoop / Awning on South-facing (+Z) or Street side
    const awning = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.28, 1.6), shingleMat);
    awning.position.set(0, 2.85, d / 2 + 0.75);
    awning.rotation.x = 0.2;
    g.add(awning);

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.2, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 })
    );
    door.position.set(0, 1.32, d / 2 + 0.05);
    g.add(door);

    this.scene.add(g);
    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(x - 4.5, y, z - 4.7),
      new THREE.Vector3(x + 4.5, y + 8.0, z + 4.7)
    ));
  }

  _createYellowSedan(x, y, z, carMat) {
    const car = new THREE.Group();
    car.position.set(x, y, z);
    car.rotation.y = 0.08;

    const trimDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdbe4ee, roughness: 0.22, metalness: 0.65 });

    // Lower rocker skirt
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.22, 4.38), trimDarkMat);
    skirt.position.y = 0.34;
    car.add(skirt);

    // Sculpted lower body + sloped hood & rear trunk deck
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.66, 4.42), carMat);
    chassis.position.y = 0.66;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    car.add(chassis);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.18, 1.32), carMat);
    hood.position.set(0, 0.96, 1.48);
    hood.rotation.x = 0.11;
    car.add(hood);

    const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.16, 1.12), carMat);
    trunk.position.set(0, 0.95, -1.58);
    trunk.rotation.x = -0.09;
    car.add(trunk);

    // True Sloped Trapezoidal Greenhouse Cabin (angled A-pillars & C-pillars!)
    const cabShape = new THREE.Shape();
    cabShape.moveTo(-1.15, 0);
    cabShape.lineTo(1.05, 0);
    cabShape.lineTo(0.68, 0.62);
    cabShape.lineTo(-0.78, 0.62);
    cabShape.closePath();
    const cabGeo = new THREE.ExtrudeGeometry(cabShape, { depth: 1.82, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    cabGeo.rotateY(Math.PI / 2);
    cabGeo.translate(-0.91, 0.98, 0);
    const cabin = new THREE.Mesh(cabGeo, carMat);
    cabin.castShadow = true;
    car.add(cabin);

    // Sky-reflective blue-gray sloped windshield, rear window & trapezoidal side windows
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x7cb8e8,
      emissive: 0x1e3a5f,
      roughness: 0.15,
      metalness: 0.35
    });
    const winShape = new THREE.Shape();
    winShape.moveTo(-1.02, 0.06);
    winShape.lineTo(0.92, 0.06);
    winShape.lineTo(0.62, 0.54);
    winShape.lineTo(-0.72, 0.54);
    winShape.closePath();
    const sideWinGeo = new THREE.ExtrudeGeometry(winShape, { depth: 1.92, bevelEnabled: false });
    sideWinGeo.rotateY(Math.PI / 2);
    sideWinGeo.translate(-0.96, 0.98, 0);
    const sideWin = new THREE.Mesh(sideWinGeo, winMat);
    car.add(sideWin);

    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.64, 0.10), winMat);
    frontWindshield.position.set(0, 1.29, 0.87);
    frontWindshield.rotation.x = -0.54;
    car.add(frontWindshield);

    const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.62, 0.10), winMat);
    rearWindshield.position.set(0, 1.29, -0.97);
    rearWindshield.rotation.x = 0.54;
    car.add(rearWindshield);

    // Dark B-pillar, side rub strips & side mirrors
    const bPillar = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.50, 0.14), trimDarkMat);
    bPillar.position.set(0, 1.26, -0.06);
    car.add(bPillar);

    const sideStrip = new THREE.Mesh(new THREE.BoxGeometry(2.19, 0.08, 3.2), trimDarkMat);
    sideStrip.position.set(0, 0.62, 0);
    car.add(sideStrip);

    for (const sx of [-1.06, 1.06]) {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.16), trimDarkMat);
      mirror.position.set(sx, 1.12, 0.72);
      car.add(mirror);
    }

    // Bumpers, Front Grille, Headlights & Rear Taillights + License Plates
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.26, 0.32), bumperMat);
    frontBumper.position.set(0, 0.38, 2.22);
    car.add(frontBumper);
    const rearBumper = frontBumper.clone();
    rearBumper.position.z = -2.22;
    car.add(rearBumper);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.26, 0.12), trimDarkMat);
    grille.position.set(0, 0.68, 2.23);
    car.add(grille);
    for (const gy of [0.63, 0.73]) {
      const gBar = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.04, 0.14), chromeMat);
      gBar.position.set(0, gy, 2.24);
      car.add(gBar);
    }

    const plateMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const fPlate = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.20, 0.06), plateMat);
    fPlate.position.set(0, 0.39, 2.38);
    const rPlate = fPlate.clone();
    rPlate.position.z = -2.38;
    car.add(fPlate, rPlate);

    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfff5c0 });
    const turnSignalMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    for (const hx of [-0.74, 0.74]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), headlightMat);
      hl.position.set(hx, 0.70, 2.23);
      car.add(hl);
      const ts = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.12), turnSignalMat);
      ts.position.set(hx * 1.22, 0.70, 2.22);
      car.add(ts);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.10), taillightMat);
      tl.position.set(hx, 0.72, -2.22);
      car.add(tl);
    }

    // 4 Wheels with Dark Wheel-Arch Wells & Silver Hubcaps
    const wheelGeo = new THREE.CylinderGeometry(0.40, 0.40, 0.30, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const hubGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.32, 12);
    hubGeo.rotateZ(Math.PI / 2);

    for (const wx of [-1.05, 1.05]) {
      for (const wz of [-1.35, 1.35]) {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.92), trimDarkMat);
        arch.position.set(wx * 0.96, 0.56, wz);
        car.add(arch);

        const wheel = new THREE.Mesh(wheelGeo, bumperMat);
        wheel.position.set(wx, 0.40, wz);
        wheel.castShadow = true;
        car.add(wheel);

        const hub = new THREE.Mesh(hubGeo, chromeMat);
        hub.position.set(wx, 0.40, wz);
        car.add(hub);
      }
    }

    this.scene.add(car);
    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(x - 1.15, y, z - 2.25),
      new THREE.Vector3(x + 1.15, y + 1.65, z + 2.25)
    ));
  }

  _createBluePickupTruck(x, y, z, truckMat) {
    const truck = new THREE.Group();
    truck.position.set(x, y, z);
    truck.rotation.y = -0.36;

    const darkBedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdbe4ee, roughness: 0.22, metalness: 0.65 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.75 });
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x7cb8e8,
      emissive: 0x1e3a5f,
      roughness: 0.15,
      metalness: 0.35
    });

    // 1. Lower chassis frame + front hood (z = +0.1 to +2.5)
    const frontBody = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.86, 2.55), truckMat);
    frontBody.position.set(0, 0.74, 1.22);
    frontBody.castShadow = true;
    frontBody.receiveShadow = true;
    truck.add(frontBody);

    const hoodBulge = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.14, 1.35), truckMat);
    hoodBulge.position.set(0, 1.20, 1.75);
    truck.add(hoodBulge);

    // 2. Sculpted Hollow Rear Pickup Bed (z = -2.5 to +0.05)
    const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.36, 2.55), darkBedMat);
    bedFloor.position.set(0, 0.50, -1.22);
    bedFloor.receiveShadow = true;
    truck.add(bedFloor);

    for (const side of [-1, 1]) {
      const bedWall = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.66, 2.52), truckMat);
      bedWall.position.set(side * 1.02, 0.88, -1.22);
      bedWall.castShadow = true;
      truck.add(bedWall);

      const railCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 2.54), darkBedMat);
      railCap.position.set(side * 1.02, 1.23, -1.22);
      truck.add(railCap);
    }

    // Detailed Tailgate at z = -2.44 with recessed panel, chrome handle & taillights
    const tailgate = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.64, 0.18), truckMat);
    tailgate.position.set(0, 0.88, -2.42);
    tailgate.castShadow = true;
    truck.add(tailgate);

    const tailgateTrim = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.22, 0.21), darkBedMat);
    tailgateTrim.position.set(0, 0.92, -2.43);
    truck.add(tailgateTrim);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.26, 0.28), chromeMat);
    rearBumper.position.set(0, 0.42, -2.52);
    truck.add(rearBumper);

    const licensePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.22, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    licensePlate.position.set(0, 0.43, -2.67);
    truck.add(licensePlate);

    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const reverseMat = new THREE.MeshBasicMaterial({ color: 0xfff5c0 });
    for (const side of [-1, 1]) {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.44, 0.12), taillightMat);
      tl.position.set(side * 1.02, 0.90, -2.46);
      const rev = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.14), reverseMat);
      rev.position.set(side * 1.02, 0.82, -2.47);
      truck.add(tl, rev);
    }

    // Cargo in the pickup bed (wooden crate + spare tire)
    const bedCrate = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.78, 0.95),
      new THREE.MeshStandardMaterial({ map: this._createCrateFaceTexture(), roughness: 0.65 })
    );
    bedCrate.position.set(-0.35, 0.98, -0.95);
    bedCrate.rotation.y = 0.18;
    truck.add(bedCrate);

    // 3. True Sloped Pickup Cab with Angled A-Pillar Front Windshield (+Z), Side Windows & Rear Window
    const pCabShape = new THREE.Shape();
    pCabShape.moveTo(-0.30, 0);
    pCabShape.lineTo(1.52, 0);
    pCabShape.lineTo(1.16, 0.88);
    pCabShape.lineTo(-0.24, 0.88);
    pCabShape.closePath();
    const pCabGeo = new THREE.ExtrudeGeometry(pCabShape, { depth: 2.02, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    pCabGeo.rotateY(Math.PI / 2);
    pCabGeo.translate(-1.01, 1.08, 0);
    const cab = new THREE.Mesh(pCabGeo, truckMat);
    cab.castShadow = true;
    truck.add(cab);

    // Trapezoidal side windows + B-pillar
    const pWinShape = new THREE.Shape();
    pWinShape.moveTo(-0.18, 0.14);
    pWinShape.lineTo(1.36, 0.14);
    pWinShape.lineTo(1.06, 0.76);
    pWinShape.lineTo(-0.14, 0.76);
    pWinShape.closePath();
    const pWinGeo = new THREE.ExtrudeGeometry(pWinShape, { depth: 2.12, bevelEnabled: false });
    pWinGeo.rotateY(Math.PI / 2);
    pWinGeo.translate(-1.06, 1.08, 0);
    const cabWin = new THREE.Mesh(pWinGeo, winMat);
    truck.add(cabWin);

    const bPillar = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.64, 0.14), darkBedMat);
    bPillar.position.set(0, 1.52, 0.44);
    truck.add(bPillar);

    // Sloped Front Windshield on +Z face of Cab (facing player camera!)
    const frontWinFrame = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.76, 0.10), darkBedMat);
    frontWinFrame.position.set(0, 1.53, 1.35);
    frontWinFrame.rotation.x = -0.39;
    truck.add(frontWinFrame);

    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.68, 0.12), winMat);
    frontWindshield.position.set(0, 1.53, 1.37);
    frontWindshield.rotation.x = -0.39;
    truck.add(frontWindshield);

    const rearCabWin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.56, 0.12), winMat);
    rearCabWin.position.set(0, 1.54, -0.28);
    truck.add(rearCabWin);

    // Side mirrors
    for (const sx of [-1.14, 1.14]) {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.16), darkBedMat);
      mirror.position.set(sx, 1.42, 1.28);
      truck.add(mirror);
    }

    // Sport Roll-Bar behind cab
    for (const side of [-0.78, 0.78]) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 8), darkBedMat);
      bar.position.set(side, 1.52, -0.45);
      bar.rotation.x = 0.28;
      truck.add(bar);
    }
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.10, 0.10), darkBedMat);
    topBar.position.set(0, 1.98, -0.32);
    truck.add(topBar);

    // Front Bumper, Dark Recessed Multi-Bar Grille & Headlights (matching ui-gameplay-v2.png!)
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.28, 0.30), chromeMat);
    frontBumper.position.set(0, 0.42, 2.54);
    truck.add(frontBumper);

    const grilleSurround = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.50, 0.10), darkBedMat);
    grilleSurround.position.set(0, 0.80, 2.51);
    truck.add(grilleSurround);

    for (const gy of [0.68, 0.80, 0.92]) {
      const grilleBar = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 0.13), chromeMat);
      grilleBar.position.set(0, gy, 2.52);
      truck.add(grilleBar);
    }

    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfff5c0 });
    const turnSignalMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });
    for (const hx of [-0.88, 0.88]) {
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.10), darkBedMat);
      bezel.position.set(hx, 0.82, 2.51);
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.24, 0.13), headlightMat);
      hl.position.set(hx, 0.82, 2.52);
      const ts = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.12), turnSignalMat);
      ts.position.set(hx * 1.18, 0.82, 2.50);
      truck.add(bezel, hl, ts);
    }

    // 4 Oversized All-Terrain Wheels with Dark Wheel-Arch Fenders & Chrome Rims
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.34, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.36, 12);
    rimGeo.rotateZ(Math.PI / 2);
    for (const wx of [-1.12, 1.12]) {
      for (const wz of [-1.52, 1.58]) {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.56, 1.04), darkBedMat);
        arch.position.set(wx * 0.96, 0.62, wz);
        truck.add(arch);

        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.position.set(wx, 0.45, wz);
        w.castShadow = true;
        truck.add(w);

        const rim = new THREE.Mesh(rimGeo, chromeMat);
        rim.position.set(wx, 0.45, wz);
        truck.add(rim);
      }
    }

    this.scene.add(truck);
    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(x - 1.4, y, z - 2.6),
      new THREE.Vector3(x + 1.4, y + 1.9, z + 2.6)
    ));
  }

  _createPicketFence(x, y, z, length, alongZ, mat) {
    const fence = new THREE.Group();
    fence.position.set(x, y, z);

    const railGeo = alongZ
      ? new THREE.BoxGeometry(0.12, 0.12, length)
      : new THREE.BoxGeometry(length, 0.12, 0.12);
    const r1 = new THREE.Mesh(railGeo, mat);
    r1.position.y = 0.35;
    const r2 = new THREE.Mesh(railGeo, mat);
    r2.position.y = 0.78;
    fence.add(r1, r2);

    const count = Math.floor(length / 0.42);
    for (let i = 0; i <= count; i++) {
      const offset = -length / 2 + i * (length / count);
      const picket = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.05, 0.16), mat);
      picket.position.set(alongZ ? 0 : offset, 0.52, alongZ ? offset : 0);
      picket.castShadow = true;
      fence.add(picket);
    }

    this.scene.add(fence);

    const halfW = alongZ ? 0.2 : length / 2;
    const halfD = alongZ ? length / 2 : 0.2;
    const box = new THREE.Box3(
      new THREE.Vector3(x - halfW, y, z - halfD),
      new THREE.Vector3(x + halfW, y + 1.05, z + halfD)
    );
    box.isGroundOrLow = true;
    this.colliders.push(box);
  }

  _createCrate(x, y, z, s, mat) {
    const crateGroup = new THREE.Group();
    crateGroup.position.set(x, y + s / 2, z);

    const core = new THREE.Mesh(new THREE.BoxGeometry(s * 0.96, s * 0.96, s * 0.96), mat);
    core.castShadow = true;
    core.receiveShadow = true;
    crateGroup.add(core);

    // 3D Warm Golden-Oak Corner Bevel Rails so crates have 3D depth without dark vertical bars!
    const trimWoodMat = new THREE.MeshStandardMaterial({
      color: 0xc88744,
      emissive: 0x3b220c,
      emissiveIntensity: 0.38,
      roughness: 0.62
    });
    const half = s * 0.46;
    for (const cx of [-half, half]) {
      for (const cz of [-half, half]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(s * 0.08, s, s * 0.08), trimWoodMat);
        post.position.set(cx, 0, cz);
        crateGroup.add(post);
      }
    }

    this.scene.add(crateGroup);

    const box = new THREE.Box3(
      new THREE.Vector3(x - s / 2, y, z - s / 2),
      new THREE.Vector3(x + s / 2, y + s, z + s / 2)
    );
    box.isGroundOrLow = true;
    box.isStepable = true;
    this.colliders.push(box);

    this.destructibleCrates.push({
      mesh: crateGroup,
      position: new THREE.Vector3(x, y + s * 0.5, z),
      size: s,
      health: 65,
      maxHealth: 65,
      collider: box,
      destroyed: false
    });
  }

  _createHazardBarrelTexture() {
    if (this._barrelTex) return this._barrelTex;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // High-vis Crimson/Orange Explosive Barrel Paint
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 256, 256);

    // Center warning band
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 86, 256, 84);

    // Diagonal black hazard stripes on top/bottom of yellow band
    ctx.fillStyle = '#111827';
    for (let x = -32; x < 288; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 86); ctx.lineTo(x + 16, 86); ctx.lineTo(x + 6, 102); ctx.lineTo(x - 10, 102);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, 154); ctx.lineTo(x + 16, 154); ctx.lineTo(x + 6, 170); ctx.lineTo(x - 10, 170);
      ctx.fill();
    }

    // Flame / Explosive Icon & "BOOM" stencil
    ctx.fillStyle = '#b91c1c';
    ctx.font = '900 32px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ NITRO CARROT ⚡', 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    this._barrelTex = tex;
    return tex;
  }

  _createExplosiveBarrel(x, y, z) {
    const barrelGroup = new THREE.Group();
    barrelGroup.position.set(x, y, z);

    const bodyMat = new THREE.MeshStandardMaterial({
      map: this._createHazardBarrelTexture(),
      roughness: 0.38,
      metalness: 0.25
    });
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.65 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.04, 18), bodyMat);
    cyl.position.y = 0.52;
    cyl.castShadow = true;
    cyl.receiveShadow = true;
    barrelGroup.add(cyl);

    // 4 Corrugated Steel Reinforcement Hoops
    for (const ry of [0.10, 0.36, 0.68, 0.96]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.026, 8, 20), ribMat);
      hoop.rotation.x = Math.PI / 2;
      hoop.position.y = ry;
      barrelGroup.add(hoop);
    }

    // Glowing Orange Pressure Valve Cap on top
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.10, 12), glowMat);
    valve.position.set(0.09, 1.07, 0);
    barrelGroup.add(valve);

    this.scene.add(barrelGroup);

    const box = new THREE.Box3(
      new THREE.Vector3(x - 0.38, y, z - 0.38),
      new THREE.Vector3(x + 0.38, y + 1.08, z + 0.38)
    );
    box.isGroundOrLow = true;
    this.colliders.push(box);

    this.explosiveBarrels.push({
      mesh: barrelGroup,
      position: new THREE.Vector3(x, y + 0.54, z),
      radius: 0.65,
      health: 30,
      maxHealth: 30,
      collider: box,
      exploded: false
    });
  }

  _createDebris(x, y, z) {
    const tex = assetAtlas.getEnvPropTexture('debris');
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.1),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.08, side: THREE.DoubleSide })
    );
    plane.position.set(x, y + 0.45, z);
    this.scene.add(plane);
  }

  _createDumpster(x, y, z) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const greenMat = new THREE.MeshStandardMaterial({
      map: this._createDumpsterTexture(),
      color: 0x29874c,
      roughness: 0.48,
      metalness: 0.22
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      map: this._createBayDoorTexture(),
      color: 0x334155,
      roughness: 0.62,
      metalness: 0.35
    });

    const bin = new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.32, 2.42), greenMat);
    bin.position.y = 0.72;
    bin.castShadow = true;
    bin.receiveShadow = true;
    g.add(bin);

    // Vertical structural steel ribs & fork pockets on dumpster sides
    for (const rz of [-0.85, 0, 0.85]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(1.80, 1.24, 0.10), greenMat);
      rib.position.set(0, 0.72, rz);
      g.add(rib);
    }
    const forkPocket = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.14, 2.52), darkTrimMat);
    forkPocket.position.set(0, 0.88, 0);
    g.add(forkPocket);

    // Split ribbed plastic lids
    for (const lz of [-0.58, 0.58]) {
      const lid = new THREE.Mesh(new THREE.BoxGeometry(1.80, 0.16, 1.14), darkTrimMat);
      lid.position.set(0, 1.44, lz);
      lid.rotation.z = -0.06;
      g.add(lid);
    }

    this.scene.add(g);
    const box = new THREE.Box3(
      new THREE.Vector3(x - 0.9, y, z - 1.25),
      new THREE.Vector3(x + 0.9, y + 1.5, z + 1.25)
    );
    box.isGroundOrLow = true;
    this.colliders.push(box);
  }

  _createFireHydrant(x, y, z) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const mat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.75, 10), mat);
    post.position.y = 0.38;
    post.castShadow = true;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), mat);
    cap.position.y = 0.76;
    g.add(post, cap);
    this.scene.add(g);
  }

  _createStreetLamp(x, y, z, armDirX = -1) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.5 });

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.15, 6.2, 10), poleMat);
    pole.position.y = 3.1;
    pole.castShadow = true;
    g.add(pole);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.2, 8), poleMat);
    arm.rotation.z = armDirX * -1.15;
    arm.position.set(armDirX * 0.95, 6.15, 0);
    g.add(arm);

    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.18, 12), poleMat);
    housing.position.set(armDirX * 1.85, 6.35, 0);
    g.add(housing);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff3b0 })
    );
    bulb.position.set(armDirX * 1.85, 6.24, 0);
    g.add(bulb);

    this.scene.add(g);
  }

  _createBush(x, y, z, r, mat) {
    const bushGroup = new THREE.Group();
    bushGroup.position.set(x, y, z);

    const mainCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), mat);
    mainCluster.scale.set(1.18, 0.86, 1.18);
    mainCluster.position.y = r * 0.65;
    mainCluster.castShadow = true;
    bushGroup.add(mainCluster);

    const leftCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.72, 1), mat);
    leftCluster.position.set(-r * 0.55, r * 0.48, r * 0.22);
    const rightCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(r * 0.68, 1), mat);
    rightCluster.position.set(r * 0.52, r * 0.45, -r * 0.20);
    bushGroup.add(leftCluster, rightCluster);

    this.scene.add(bushGroup);
  }

  _createDeciduousTree(x, y, z, scale, folMat, trunkMat) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(scale);

    // Studio-Painted Tree Cutout from env-props-v2.png (Crossed 2.5D Planes)
    const treeTex = assetAtlas.getEnvPropTexture('tree');
    const cardMat = new THREE.MeshBasicMaterial({
      map: treeTex,
      transparent: true,
      alphaTest: 0.16,
      side: THREE.DoubleSide
    });
    const p1 = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), cardMat);
    p1.position.y = 2.55;
    p1.rotation.y = -0.12;
    const p2 = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), cardMat);
    p2.position.y = 2.55;
    p2.rotation.y = Math.PI / 2.2;
    g.add(p1, p2);

    this.scene.add(g);
  }

  _createPineTree(x, y, z, scale, pineMat, trunkMat) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(scale);

    // Studio-Painted Pine Cutout from env-props-v2.png (Crossed 2.5D Planes)
    const pineTex = assetAtlas.getEnvPropTexture('pine');
    const cardMat = new THREE.MeshBasicMaterial({
      map: pineTex,
      transparent: true,
      alphaTest: 0.16,
      side: THREE.DoubleSide
    });
    const p1 = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 6.2), cardMat);
    p1.position.y = 3.05;
    p1.rotation.y = -0.1;
    const p2 = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 6.2), cardMat);
    p2.position.y = 3.05;
    p2.rotation.y = Math.PI / 2;
    g.add(p1, p2);

    this.scene.add(g);
  }

  _buildServiceYard(x, y, z, wallMat, roofMat, crateMat) {
    // 1. Industrial Service Yard Garage with Roll-Up Bay Doors, Roof Cornice & Signage
    const garageGroup = new THREE.Group();
    garageGroup.position.set(-9.5, 0, z);

    const garageWallMat = new THREE.MeshStandardMaterial({
      map: this._createCottageSidingTexture('#cbd5e1'),
      roughness: 0.6,
      metalness: 0.2
    });
    const steelTrimMat = new THREE.MeshStandardMaterial({
      map: this._createBayDoorTexture(),
      color: 0x475569,
      roughness: 0.45,
      metalness: 0.5
    });
    const bayDoorMat = new THREE.MeshStandardMaterial({
      map: this._createBayDoorTexture(),
      color: 0x94a3b8,
      roughness: 0.38,
      metalness: 0.52
    });
    const hazardYellowMat = new THREE.MeshStandardMaterial({
      map: this._createHazardStripeTexture(4, 1),
      roughness: 0.4
    });

    const garageBody = new THREE.Mesh(new THREE.BoxGeometry(13.0, 6.2, 9.5), garageWallMat);
    garageBody.position.y = 3.1;
    garageBody.castShadow = true;
    garageBody.receiveShadow = true;
    garageGroup.add(garageBody);

    // Roof Parapet Cornice, Gravel Roof Deck & HVAC Units
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.55, 9.9), steelTrimMat);
    parapet.position.y = 6.35;
    garageGroup.add(parapet);

    const garageRoofDeck = new THREE.Mesh(
      new THREE.BoxGeometry(12.6, 0.16, 9.1),
      new THREE.MeshStandardMaterial({
        map: this._createConcreteSidewalkTexture(4, 3),
        color: 0x64748b,
        roughness: 0.82
      })
    );
    garageRoofDeck.position.y = 6.58;
    garageGroup.add(garageRoofDeck);

    for (const hx of [-3.2, 2.8]) {
      const hvac = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.1, 2.2), bayDoorMat);
      hvac.position.set(hx, 7.1, 0);
      garageGroup.add(hvac);
    }

    // Two Large Roll-Up Bay Doors facing South (+Z) and East (+X) toward street
    for (const bx of [-3.1, 3.1]) {
      const bayFrame = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.2, 0.28), steelTrimMat);
      bayFrame.position.set(bx, 2.1, 4.78);
      garageGroup.add(bayFrame);

      for (let slat = 0; slat < 6; slat++) {
        const slatMesh = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.56, 0.32), bayDoorMat);
        slatMesh.position.set(bx, 0.48 + slat * 0.62, 4.82);
        garageGroup.add(slatMesh);
      }

      const hazardStrip = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.26, 0.34), hazardYellowMat);
      hazardStrip.position.set(bx, 0.18, 4.84);
      garageGroup.add(hazardStrip);
    }

    // East-facing (+X) Service Door & Industrial Windows facing the street
    const eastBayFrame = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.2, 4.6), steelTrimMat);
    eastBayFrame.position.set(6.52, 2.1, 1.2);
    const eastBayDoor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.8, 4.1), bayDoorMat);
    eastBayDoor.position.set(6.55, 2.0, 1.2);
    garageGroup.add(eastBayFrame, eastBayDoor);

    this.scene.add(garageGroup);
    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(-16.0, 0, z - 4.75),
      new THREE.Vector3(-3.0, 6.4, z + 4.75)
    ));

    // 2. Corrugated Red Steel Shipping Container with 3D Ribs, Corner Castings & Cargo Doors
    const containerGroup = new THREE.Group();
    containerGroup.position.set(9.5, 0, z + 4.0);

    const containerMat = new THREE.MeshStandardMaterial({
      map: this._createCorrugatedContainerTexture('#c93b2b', '#7f1d1d'),
      color: 0xffffff,
      roughness: 0.46,
      metalness: 0.28
    });
    const darkRedRibMat = new THREE.MeshStandardMaterial({ color: 0x8f281c, roughness: 0.52, metalness: 0.35 });

    const containerCore = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.2, 3.0), containerMat);
    containerCore.position.y = 1.6;
    containerCore.castShadow = true;
    containerCore.receiveShadow = true;
    containerGroup.add(containerCore);

    // 3D Vertical Corrugation Ribs along South/North walls
    for (let rx = -2.8; rx <= 2.8; rx += 0.56) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.95, 3.12), darkRedRibMat);
      rib.position.set(rx, 1.6, 0);
      containerGroup.add(rib);
    }

    // Steel Corner Castings & Locking Bars on West (-X) Cargo Doors facing street
    for (const lz of [-0.55, -0.22, 0.22, 0.55]) {
      const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.95, 8), steelTrimMat);
      lockBar.position.set(-3.28, 1.6, lz);
      containerGroup.add(lockBar);
    }

    this.scene.add(containerGroup);
    this.colliders.push(new THREE.Box3(
      new THREE.Vector3(6.25, 0, z + 2.5),
      new THREE.Vector3(12.75, 3.2, z + 5.5)
    ));

    this._createCrate(-3.5, 0, z + 8.0, 1.6, crateMat);
    this._createCrate(4.0, 0, z + 9.0, 1.6, crateMat);

    // Hazard-Striped EXIT -> Gate at North end of street (Z = -41)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, -41.0);

    const postMat = new THREE.MeshStandardMaterial({
      map: this._createBayDoorTexture(),
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.5
    });
    const yellowMat = new THREE.MeshStandardMaterial({
      map: this._createHazardStripeTexture(8, 1),
      roughness: 0.38
    });

    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 0.8), postMat);
      pillar.position.set(side * 4.5, 2.6, 0);
      pillar.castShadow = true;
      gateGroup.add(pillar);
    }

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.9, 0.9), yellowMat);
    crossBeam.position.set(0, 4.9, 0);
    gateGroup.add(crossBeam);

    const exitSign = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.35, 0.3),
      new THREE.MeshBasicMaterial({ map: this._createExitSignTexture() })
    );
    exitSign.position.set(0, 6.1, 0.25);
    gateGroup.add(exitSign);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    );
    beacon.position.set(0, 7.1, 0.25);
    gateGroup.add(beacon);
    this.exitGateBeacon = beacon;

    this.scene.add(gateGroup);
  }

  _buildBackgroundHillAndCliffs(grassMat, rockMat, folMat, pineMat, trunkMat) {
    // Grand Painted Fortnite Storm-Sky & Cliff/Forest Horizon Backdrop at Z = -45.5
    // Matches the exact horizon of env-fortnite-suburb-v2.png and ui-gameplay-v2.png!
    const horizonTex = this._createHorizonBackdropTexture();
    const horizonMat = new THREE.MeshBasicMaterial({
      map: horizonTex,
      transparent: true,
      alphaTest: 0.05,
      fog: false,
      depthWrite: true
    });
    const horizonPlane = new THREE.Mesh(new THREE.PlaneGeometry(240, 62), horizonMat);
    horizonPlane.position.set(0, 24.5, -45.5);
    this.scene.add(horizonPlane);
    this.horizonPlane = horizonPlane;
  }

  _createBouncePad(x, y, z, size, launchVelocity) {
    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    // Armored Blue Bounce Pad Rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(size * 0.5, size * 0.56, 0.22, 20),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.3 })
    );
    rim.position.y = 0.11;
    padGroup.add(rim);

    // Dark Trampoline Mat
    const matMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(size * 0.40, size * 0.40, 0.24, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    matMesh.position.y = 0.12;
    padGroup.add(matMesh);

    // Glowing Launch Vortex Overlay from fx-projectile-ability-sheet.png
    const vortexTex = assetAtlas.getVFXTexture('bounce_pad_fx');
    const vortexPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(size * 1.15, size * 1.15),
      new THREE.MeshBasicMaterial({
        map: vortexTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    vortexPlane.rotation.x = -Math.PI / 2;
    vortexPlane.position.y = 0.26;
    padGroup.add(vortexPlane);

    this.scene.add(padGroup);

    this.bouncePads.push({
      center: new THREE.Vector3(x, y, z),
      radius: size * 0.38,
      launchVelocity: launchVelocity || new THREE.Vector3(0, 12.5, -8.5),
      mesh: padGroup
    });
  }

  update(dt, playerPos, onPickupCollected) {
    // Environment animations
    const now = performance.now() / 1000;
    if (this.exitGateBeacon) {
      const s = 1.0 + Math.sin(now * 4.0) * 0.15;
      this.exitGateBeacon.scale.setScalar(s);
    }
  }

  checkCollision(position, radius, height) {
    const charBox = new THREE.Box3(
      new THREE.Vector3(position.x - radius, position.y, position.z - radius),
      new THREE.Vector3(position.x + radius, position.y + height, position.z + radius)
    );

    for (const col of this.colliders) {
      if (charBox.intersectsBox(col)) {
        return col;
      }
    }
    return null;
  }
}
