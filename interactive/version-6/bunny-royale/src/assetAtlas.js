import * as THREE from 'three';

// High-Craft Studio Asset & Sprite Atlas Manager for Bunny Royale V2
// Extracts & flood-fill alpha-keys studio turnaround renders, enemy roster views,
// environment props, RGBA pickups, and RGBA combat VFX into crisp Three.js textures.

class AssetAtlasManager {
  constructor() {
    this.cache = new Map();
    this.imagePromises = new Map();
    this.textureLoader = new THREE.TextureLoader();
  }

  _loadImage(url) {
    if (this.imagePromises.has(url)) {
      return this.imagePromises.get(url);
    }
    const p = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
    this.imagePromises.set(url, p);
    return p;
  }

  loadTilingTexture(url, repeatX = 1, repeatY = 1, mirrored = false) {
    const key = `tile:${url}:${repeatX}:${repeatY}:${mirrored}`;
    if (this.cache.has(key)) return this.cache.get(key);

    if (mirrored) {
      // Equalize low-frequency gradient across tile so repeating grass/road has zero checkerboard
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = url.includes('grass') ? '#4da836' : '#4a4c54';
      ctx.fillRect(0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.MirroredRepeatWrapping;
      tex.wrapT = THREE.MirroredRepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.anisotropy = 8;

      this._loadImage(url).then((img) => {
        ctx.drawImage(img, 0, 0, 256, 256);
        const imgData = ctx.getImageData(0, 0, 256, 256);
        const d = imgData.data;
        // Compute 8x8 block average luminance and global average luminance
        let globalLum = 0;
        const grid = 8;
        const blockLum = new Float32Array(grid * grid);
        const cell = 256 / grid;
        for (let gy = 0; gy < grid; gy++) {
          for (let gx = 0; gx < grid; gx++) {
            let sum = 0;
            for (let y = gy * cell; y < (gy + 1) * cell; y++) {
              for (let x = gx * cell; x < (gx + 1) * cell; x++) {
                const i = (y * 256 + x) * 4;
                sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
              }
            }
            const avg = sum / (cell * cell);
            blockLum[gy * grid + gx] = avg;
            globalLum += avg;
          }
        }
        globalLum /= (grid * grid);

        // Normalize low-frequency shading while preserving high-frequency blades/cracks
        for (let y = 0; y < 256; y++) {
          const fy = Math.min(grid - 1.001, Math.max(0, (y + 0.5) / cell - 0.5));
          const gy0 = Math.floor(fy), gy1 = Math.min(grid - 1, gy0 + 1);
          const ty = fy - gy0;
          for (let x = 0; x < 256; x++) {
            const fx = Math.min(grid - 1.001, Math.max(0, (x + 0.5) / cell - 0.5));
            const gx0 = Math.floor(fx), gx1 = Math.min(grid - 1, gx0 + 1);
            const tx = fx - gx0;
            const b00 = blockLum[gy0 * grid + gx0];
            const b10 = blockLum[gy0 * grid + gx1];
            const b01 = blockLum[gy1 * grid + gx0];
            const b11 = blockLum[gy1 * grid + gx1];
            const localLum = (b00 * (1 - tx) + b10 * tx) * (1 - ty) + (b01 * (1 - tx) + b11 * tx) * ty;
            const scale = localLum > 10 ? (globalLum / localLum) * 0.78 + 0.22 : 1;
            const i = (y * 256 + x) * 4;
            d[i]     = Math.min(255, Math.max(0, Math.round(d[i] * scale)));
            d[i + 1] = Math.min(255, Math.max(0, Math.round(d[i + 1] * scale)));
            d[i + 2] = Math.min(255, Math.max(0, Math.round(d[i + 2] * scale)));
          }
        }
        ctx.putImageData(imgData, 0, 0);
        tex.needsUpdate = true;
      }).catch(() => {});

      this.cache.set(key, tex);
      return tex;
    }

    const tex = this.textureLoader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 8;
    this.cache.set(key, tex);
    return tex;
  }

  // Row-adaptive border-seeded BFS flood-fill studio gray background remover + edge de-fringer
  _removeStudioGrayBackground(ctx, w, h, options = {}) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // 1. Optional pre-erase rectangles (e.g., stray ear tip in volt-back or text labels)
    if (options.clearRects) {
      for (const r of options.clearRects) {
        const x0 = Math.max(0, r.x);
        const y0 = Math.max(0, r.y);
        const x1 = Math.min(w, r.x + r.w);
        const y1 = Math.min(h, r.y + r.h);
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const idx = (y * w + x) * 4;
            data[idx + 3] = 0;
          }
        }
      }
    }

    // 2. Estimate row-by-row studio gray background RGB from left/right outer borders
    const rowBgR = new Float32Array(h);
    const rowBgG = new Float32Array(h);
    const rowBgB = new Float32Array(h);

    let fallbackR = 175, fallbackG = 173, fallbackB = 171;
    for (let y = 0; y < h; y++) {
      const iL = (y * w + 1) * 4;
      const iR = (y * w + (w - 2)) * 4;
      const rL = data[iL], gL = data[iL + 1], bL = data[iL + 2];
      const rR = data[iR], gR = data[iR + 1], bR = data[iR + 2];
      const satL = Math.max(rL, gL, bL) - Math.min(rL, gL, bL);
      const satR = Math.max(rR, gR, bR) - Math.min(rR, gR, bR);

      if (satL < 12 && rL > 148 && rL < 192 && satR < 12 && rR > 148 && rR < 192) {
        fallbackR = (rL + rR) * 0.5;
        fallbackG = (gL + gR) * 0.5;
        fallbackB = (bL + bR) * 0.5;
      } else if (satL < 12 && rL > 148 && rL < 192) {
        fallbackR = rL; fallbackG = gL; fallbackB = bL;
      } else if (satR < 12 && rR > 148 && rR < 192) {
        fallbackR = rR; fallbackG = gR; fallbackB = bR;
      }
      rowBgR[y] = fallbackR;
      rowBgG[y] = fallbackG;
      rowBgB[y] = fallbackB;
    }

    const tol = options.tolerance || 30;
    const maxSat = options.maxSat || 22;
    const maxWhite = options.maxWhite || 220; // Protects white rabbit fur (R > 220)

    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    const isBgCandidate = (x, y) => {
      const i = (y * w + x) * 4;
      if (data[i + 3] === 0) return true;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC - minC;
      if (sat > maxSat) return false;
      // Protect bright ivory/white fur
      if (r > maxWhite && g > maxWhite - 6 && b > maxWhite - 14) return false;

      const bgR = rowBgR[y], bgG = rowBgG[y], bgB = rowBgB[y];
      const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      if (dist <= tol * 2.4) return true;

      // Also remove neutral floor contact shadows near the bottom 18% of the frame
      if (y > h * 0.80 && sat <= 14 && r >= 102 && r <= 208) {
        return true;
      }
      return false;
    };

    const enqueue = (x, y) => {
      const p = y * w + x;
      if (visited[p]) return;
      if (isBgCandidate(x, y)) {
        visited[p] = 1;
        queue[tail++] = p;
      }
    };

    // Seed from all 4 borders
    for (let x = 0; x < w; x++) {
      enqueue(x, 0);
      enqueue(x, h - 1);
    }
    for (let y = 1; y < h - 1; y++) {
      enqueue(0, y);
      enqueue(w - 1, y);
    }

    // Also seed between character legs at the bottom center if neutral gray
    const midX = Math.floor(w * 0.5);
    for (let y = Math.floor(h * 0.72); y < h - 1; y += 2) {
      enqueue(midX, y);
    }

    // Seed enclosed studio-gray pockets (e.g. under character arms / inside foliage loops)
    // Only seeds pixels that are strictly neutral studio gray matching the row backdrop
    for (let y = 6; y < h - 6; y += 2) {
      const bgR = rowBgR[y], bgG = rowBgG[y], bgB = rowBgB[y];
      for (let x = 6; x < w - 6; x += 2) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const sat = Math.max(r, g, b) - Math.min(r, g, b);
        if (sat <= 8 && r >= 145 && r <= 198) {
          const d = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
          if (d <= 18) {
            enqueue(x, y);
          }
        }
      }
    }

    while (head < tail) {
      const p = queue[head++];
      const idx = p * 4;
      data[idx + 3] = 0;

      const x = p % w;
      const y = (p - x) / w;

      if (x > 0) enqueue(x - 1, y);
      if (x + 1 < w) enqueue(x + 1, y);
      if (y > 0) enqueue(x, y - 1);
      if (y + 1 < h) enqueue(x, y + 1);
    }

    // 3. Soft 1-pixel anti-aliased edge feathering & gray halo de-fringing
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        if (visited[p]) continue;
        const nEmpty =
          visited[p - 1] +
          visited[p + 1] +
          visited[p - w] +
          visited[p + w];
        if (nEmpty > 0) {
          const i = p * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          const bgDist = Math.abs(r - rowBgR[y]) + Math.abs(g - rowBgG[y]) + Math.abs(b - rowBgB[y]);
          if (sat < 26 && bgDist < 95) {
            data[i + 3] = Math.min(data[i + 3], Math.max(30, 210 - nEmpty * 45));
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  _extractSubTexture(url, crop, removeGrayBg = false, bgOptions = {}) {
    const key = `sub:${url}:${crop.x},${crop.y},${crop.w},${crop.h}:${removeGrayBg}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    this._loadImage(url).then((img) => {
      ctx.clearRect(0, 0, crop.w, crop.h);
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      if (removeGrayBg) {
        this._removeStudioGrayBackground(ctx, crop.w, crop.h, bgOptions);
      }
      tex.needsUpdate = true;
    }).catch(() => {});

    this.cache.set(key, tex);
    return tex;
  }

  // ===========================================================================
  // 1. PLAYER CHARACTER TURNAROUND SPRITES (Pip, Bruno, Volt — Back & Front)
  // ===========================================================================
  getCharacterTurnaroundTexture(fighterId, view = 'back') {
    const url = `assets/${fighterId}-${view}.png`;
    // Crop full character from y=8..610 (above the "BACK" / "FRONT" text at y=620)
    const crop = { x: 4, y: 8, w: 376, h: 602 };
    const clearRects = [];
    if (fighterId === 'volt' && view === 'back') {
      // Clear stray adjacent turnaround ear tip in top-right corner of volt-back.png
      clearRects.push({ x: 306, y: 0, w: 70, h: 185 });
    }
    return this._extractSubTexture(url, crop, true, {
      tolerance: 29,
      maxSat: 22,
      maxWhite: 222,
      clearRects
    });
  }

  // ===========================================================================
  // 2. ENEMY ROSTER SPRITES (Raider, Hopper, Foreman — Front & Back)
  // ===========================================================================
  getEnemySpriteTexture(type, view = 'front') {
    const url = 'assets/enemy-roster.png';
    const crops = {
      raider_front:  { x: 8,   y: 6,   w: 462, h: 576, clearRects: [{ x: 145, y: 560, w: 180, h: 20 }] },
      raider_back:   { x: 8,   y: 604, w: 462, h: 382, clearRects: [{ x: 145, y: 0,   w: 180, h: 14 }] },
      hopper_front:  { x: 482, y: 6,   w: 490, h: 576, clearRects: [{ x: 155, y: 560, w: 185, h: 20 }] },
      hopper_back:   { x: 482, y: 602, w: 490, h: 384, clearRects: [{ x: 155, y: 0,   w: 185, h: 14 }] },
      foreman_front: { x: 984, y: 4,   w: 546, h: 578, clearRects: [{ x: 180, y: 562, w: 205, h: 20 }] },
      foreman_back:  { x: 984, y: 598, w: 546, h: 390, clearRects: [{ x: 180, y: 0,   w: 205, h: 18 }] }
    };
    const key = `${type}_${view}`;
    const cfg = crops[key] || crops.raider_front;
    return this._extractSubTexture(url, cfg, true, {
      tolerance: 30,
      maxSat: 22,
      maxWhite: 222,
      clearRects: cfg.clearRects
    });
  }

  // ===========================================================================
  // 3. ENVIRONMENT PROPS SHEET (Tree, Pine, Terrain, Bounce Pad, Crate, Debris, etc.)
  // ===========================================================================
  getEnvPropTexture(propName) {
    const url = 'assets/env-props-v2.png';
    const crops = {
      house:      { x: 12,   y: 12,  w: 372, h: 296 },
      roof:       { x: 408,  y: 12,  w: 302, h: 296 },
      market:     { x: 734,  y: 12,  w: 364, h: 296 },
      fence:      { x: 1122, y: 12,  w: 314, h: 296 },
      crate:      { x: 12,   y: 374, w: 372, h: 292 },
      debris:     { x: 408,  y: 374, w: 302, h: 292 },
      bounce_pad: { x: 734,  y: 374, w: 364, h: 292 },
      streetlamp: { x: 1122, y: 374, w: 314, h: 292 },
      tree:       { x: 12,   y: 730, w: 372, h: 288, clearRects: [{ x: 0, y: 274, w: 372, h: 14 }] },
      pine:       { x: 408,  y: 730, w: 302, h: 288, clearRects: [{ x: 0, y: 274, w: 302, h: 14 }] },
      terrain:    { x: 734,  y: 730, w: 364, h: 288 },
      dumpster:   { x: 1122, y: 730, w: 314, h: 288 }
    };
    const cfg = crops[propName] || crops.tree;
    return this._extractSubTexture(url, cfg, true, {
      tolerance: 32,
      maxSat: 24,
      maxWhite: 235,
      clearRects: cfg.clearRects
    });
  }

  // ===========================================================================
  // 4. PICKUP ITEMS SHEET (Already Native Transparent RGBA!)
  // ===========================================================================
  getPickupTexture(type) {
    const url = 'assets/props-pickup-sheet.png';
    const crops = {
      carrot:  { x: 24,   y: 4,   w: 324, h: 472 },
      health:  { x: 378,  y: 4,   w: 432, h: 472 },
      shield:  { x: 816,  y: 4,   w: 379, h: 472 },
      ammo:    { x: 1215, y: 4,   w: 310, h: 472 },
      grenade: { x: 8,    y: 477, w: 364, h: 543 },
      battery: { x: 396,  y: 477, w: 304, h: 543 },
      chest:   { x: 716,  y: 477, w: 486, h: 543 },
      trophy:  { x: 1206, y: 477, w: 309, h: 543 }
    };
    const cfg = crops[type] || crops.carrot;
    return this._extractSubTexture(url, cfg, false);
  }

  // ===========================================================================
  // 5. PROJECTILE & ABILITY VFX SHEET (Already Native Transparent RGBA!)
  // ===========================================================================
  getVFXTexture(vfxName) {
    const url = 'assets/fx-projectile-ability-sheet.png';
    const crops = {
      bolt:           { x: 12,   y: 16,  w: 456, h: 329 },
      muzzle_flash:   { x: 482,  y: 16,  w: 274, h: 329 },
      impact_burst:   { x: 782,  y: 16,  w: 373, h: 329 },
      sonic_ring:     { x: 1178, y: 16,  w: 332, h: 329 },
      seed_bomb:      { x: 75,   y: 345, w: 245, h: 310 },
      seed_explosion: { x: 374,  y: 345, w: 382, h: 310 },
      arc_beam:       { x: 774,  y: 345, w: 430, h: 310 },
      arc_burst:      { x: 1206, y: 345, w: 299, h: 310 },
      double_hop:     { x: 16,   y: 660, w: 339, h: 325 },
      ground_slam:    { x: 356,  y: 660, w: 484, h: 325 },
      decoy_bunny:    { x: 842,  y: 660, w: 323, h: 325 },
      bounce_pad_fx:  { x: 1175, y: 660, w: 357, h: 325 }
    };
    const cfg = crops[vfxName] || crops.bolt;
    return this._extractSubTexture(url, cfg, false);
  }
}

export const assetAtlas = new AssetAtlasManager();
