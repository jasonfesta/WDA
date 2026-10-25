const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ============================================================================
// Pure Node.js PNG Decoder & Encoder + 3D Silhouette/Depth/UV Atlas Baker
// Bakes clean, edge-dilated UV texture atlases (assets/baked-*-uv.png) and
// precomputed 3D volumetric relief grids (src/bakedModelData.js) for:
//   - Playable Fighters: pip, bruno, volt
//   - Enemies: raider, hopper, foreman
//   - 3D Weapons: pip, bruno, volt
// ============================================================================

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SRC_DIR = path.join(__dirname, '..', 'src');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width = 0, height = 0, bitDepth = 8, colorType = 2;
  const idatChunks = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
  const stride = width * bpp + 1;
  const unfilter = Buffer.alloc(width * height * bpp);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * stride];
    const rowStart = y * stride + 1;
    const outRow = y * width * bpp;
    for (let x = 0; x < width * bpp; x++) {
      let val = raw[rowStart + x];
      const a = x >= bpp ? unfilter[outRow + x - bpp] : 0;
      const b = y > 0 ? unfilter[outRow - width * bpp + x] : 0;
      const c = (x >= bpp && y > 0) ? unfilter[outRow - width * bpp + x - bpp] : 0;

      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        val = (val + pr) & 0xff;
      }
      unfilter[outRow + x] = val;
    }
  }

  const rgba = new Uint8Array(width * height * 4);
  if (bpp === 4) {
    rgba.set(unfilter);
  } else if (bpp === 3) {
    for (let i = 0, j = 0; i < unfilter.length; i += 3, j += 4) {
      rgba[j] = unfilter[i];
      rgba[j + 1] = unfilter[i + 1];
      rgba[j + 2] = unfilter[i + 2];
      rgba[j + 3] = 255;
    }
  }
  return { width, height, data: rgba };
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter none
    const srcOff = y * width * 4;
    Buffer.from(rgba.buffer, rgba.byteOffset + srcOff, width * 4).copy(raw, y * stride + 1);
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function cropRGBA(img, x, y, w, h) {
  const out = new Uint8Array(w * h * 4);
  for (let row = 0; row < h; row++) {
    const sy = Math.min(img.height - 1, Math.max(0, y + row));
    for (let col = 0; col < w; col++) {
      const sx = Math.min(img.width - 1, Math.max(0, x + col));
      const si = (sy * img.width + sx) * 4;
      const di = (row * w + col) * 4;
      out[di] = img.data[si];
      out[di + 1] = img.data[si + 1];
      out[di + 2] = img.data[si + 2];
      out[di + 3] = img.data[si + 3];
    }
  }
  return { width: w, height: h, data: out };
}

function removeStudioGrayAndDilate(crop, options = {}) {
  const { width: w, height: h, data } = crop;

  if (options.clearRects) {
    for (const r of options.clearRects) {
      for (let y = Math.max(0, r.y); y < Math.min(h, r.y + r.h); y++) {
        for (let x = Math.max(0, r.x); x < Math.min(w, r.x + r.w); x++) {
          data[(y * w + x) * 4 + 3] = 0;
        }
      }
    }
  }

  const rowBgR = new Float32Array(h);
  const rowBgG = new Float32Array(h);
  const rowBgB = new Float32Array(h);
  let fbR = 175, fbG = 172, fbB = 170;

  for (let y = 0; y < h; y++) {
    const iL = (y * w + 1) * 4;
    const iR = (y * w + (w - 2)) * 4;
    const rL = data[iL], gL = data[iL + 1], bL = data[iL + 2];
    const rR = data[iR], gR = data[iR + 1], bR = data[iR + 2];
    const satL = Math.max(rL, gL, bL) - Math.min(rL, gL, bL);
    const satR = Math.max(rR, gR, bR) - Math.min(rR, gR, bR);

    if (satL < 12 && rL > 148 && rL < 192 && satR < 12 && rR > 148 && rR < 192) {
      fbR = (rL + rR) * 0.5; fbG = (gL + gR) * 0.5; fbB = (bL + bR) * 0.5;
    } else if (satL < 12 && rL > 148 && rL < 192) {
      fbR = rL; fbG = gL; fbB = bL;
    } else if (satR < 12 && rR > 148 && rR < 192) {
      fbR = rR; fbG = gR; fbB = bR;
    }
    rowBgR[y] = fbR; rowBgG[y] = fbG; rowBgB[y] = fbB;
  }

  const tol = options.tolerance || 30;
  const maxSat = options.maxSat || 22;
  const maxWhite = options.maxWhite || 222;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0, tail = 0;

  const isBg = (x, y) => {
    const i = (y * w + x) * 4;
    if (data[i + 3] === 0) return true;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > maxSat) return false;
    if (r > maxWhite && g > maxWhite - 6 && b > maxWhite - 14) return false;
    const dist = Math.abs(r - rowBgR[y]) + Math.abs(g - rowBgG[y]) + Math.abs(b - rowBgB[y]);
    if (dist <= tol * 2.45) return true;
    if (y > h * 0.80 && sat <= 14 && r >= 102 && r <= 208) return true;
    return false;
  };

  const enqueue = (x, y) => {
    const p = y * w + x;
    if (visited[p]) return;
    if (isBg(x, y)) {
      visited[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < w; x++) { enqueue(x, 0); enqueue(x, h - 1); }
  for (let y = 1; y < h - 1; y++) { enqueue(0, y); enqueue(w - 1, y); }

  // Seed enclosed neutral studio-gray pockets (under arms, between legs)
  for (let y = 6; y < h - 6; y += 2) {
    const bgR = rowBgR[y], bgG = rowBgG[y], bgB = rowBgB[y];
    for (let x = 6; x < w - 6; x += 2) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (sat <= 9 && r >= 145 && r <= 198) {
        const d = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
        if (d <= 22) enqueue(x, y);
      }
    }
  }

  while (head < tail) {
    const p = queue[head++];
    data[p * 4 + 3] = 0;
    const x = p % w, y = (p - x) / w;
    if (x > 0) enqueue(x - 1, y);
    if (x + 1 < w) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y + 1 < h) enqueue(x, y + 1);
  }

  // Strip 2-pixel studio-gray fringe along silhouette boundary so dilation uses pure character colors
  for (let pass = 0; pass < 2; pass++) {
    const toClear = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        if (data[p * 4 + 3] === 0) continue;
        const hasEmptyNeighbor =
          data[(p - 1) * 4 + 3] === 0 ||
          data[(p + 1) * 4 + 3] === 0 ||
          data[(p - w) * 4 + 3] === 0 ||
          data[(p + w) * 4 + 3] === 0;
        if (hasEmptyNeighbor) {
          const i = p * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          const bgDist = Math.abs(r - rowBgR[y]) + Math.abs(g - rowBgG[y]) + Math.abs(b - rowBgB[y]);
          if (sat < 22 && bgDist < 85) {
            toClear.push(p);
          }
        }
      }
    }
    for (const p of toClear) data[p * 4 + 3] = 0;
  }

  // Extract clean binary alpha silhouette mask (1 = inside character, 0 = outside)
  // and preserve smooth anti-aliased alpha channel for razor-sharp 376x602 silhouette edges
  const alphaMask = new Uint8Array(w * h);
  const origAlpha = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    origAlpha[p] = data[p * 4 + 3];
    alphaMask[p] = origAlpha[p] >= 96 ? 1 : 0;
  }

  // Morphological RGB Color Dilation (12 passes): propagates nearest opaque character RGB
  // into transparent border pixels while keeping origAlpha so UV mipmaps/edges have zero gray halo!
  let currAlpha = new Uint8Array(alphaMask);
  for (let step = 0; step < 12; step++) {
    const nextPosts = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        if (currAlpha[p]) continue;
        let rSum = 0, gSum = 0, bSum = 0, cnt = 0;
        const neighbors = [p - 1, p + 1, p - w, p + w];
        for (const nb of neighbors) {
          if (currAlpha[nb]) {
            rSum += data[nb * 4];
            gSum += data[nb * 4 + 1];
            bSum += data[nb * 4 + 2];
            cnt++;
          }
        }
        if (cnt > 0) {
          nextPosts.push([p, Math.round(rSum / cnt), Math.round(gSum / cnt), Math.round(bSum / cnt)]);
        }
      }
    }
    for (const [p, r, g, b] of nextPosts) {
      data[p * 4] = r;
      data[p * 4 + 1] = g;
      data[p * 4 + 2] = b;
      // Keep original anti-aliased alpha so silhouette is pixel-crisp at 376x602!
      data[p * 4 + 3] = origAlpha[p];
      currAlpha[p] = 1;
    }
  }

  return { width: w, height: h, data, alphaMask };
}

// Compute 2D Grid Silhouette & Normalized Distance-to-Edge Field (NX x NY)
function computeGridRelief(alphaMask, imgW, imgH, nx, ny, flipX = false) {
  const maskGrid = new Uint8Array(nx * ny);
  for (let gy = 0; gy < ny; gy++) {
    const iy0 = Math.floor((gy / ny) * imgH);
    const iy1 = Math.max(iy0 + 1, Math.floor(((gy + 1) / ny) * imgH));
    for (let gx = 0; gx < nx; gx++) {
      const srcGx = flipX ? (nx - 1 - gx) : gx;
      const ix0 = Math.floor((srcGx / nx) * imgW);
      const ix1 = Math.max(ix0 + 1, Math.floor(((srcGx + 1) / nx) * imgW));
      let sum = 0, total = 0;
      for (let y = iy0; y < iy1; y++) {
        for (let x = ix0; x < ix1; x++) {
          sum += alphaMask[y * imgW + x];
          total++;
        }
      }
      maskGrid[gy * nx + gx] = (sum / total) >= 0.35 ? 1 : 0;
    }
  }

  // Compute Euclidean distance to nearest 0-cell on the (nx x ny) grid
  const distGrid = new Float32Array(nx * ny);
  for (let gy = 0; gy < ny; gy++) {
    for (let gx = 0; gx < nx; gx++) {
      const idx = gy * nx + gx;
      if (!maskGrid[idx]) {
        distGrid[idx] = 0;
        continue;
      }
      let minD2 = 9999;
      for (let dy = -14; dy <= 14; dy++) {
        const ny2 = gy + dy;
        for (let dx = -14; dx <= 14; dx++) {
          const nx2 = gx + dx;
          const isOut = (nx2 < 0 || nx2 >= nx || ny2 < 0 || ny2 >= ny) ? true : (maskGrid[ny2 * nx + nx2] === 0);
          if (isOut) {
            const d2 = dx * dx + dy * dy;
            if (d2 < minD2) minD2 = d2;
          }
        }
      }
      distGrid[idx] = Math.sqrt(minD2);
    }
  }

  // Smooth the distance field (2-pass 3x3 box blur inside mask) for organic 3D curvature
  let curr = distGrid;
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(nx * ny);
    for (let gy = 0; gy < ny; gy++) {
      for (let gx = 0; gx < nx; gx++) {
        const idx = gy * nx + gx;
        if (!maskGrid[idx]) continue;
        let sum = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const x2 = gx + dx, y2 = gy + dy;
            if (x2 >= 0 && x2 < nx && y2 >= 0 && y2 < ny) {
              sum += curr[y2 * nx + x2];
              cnt++;
            }
          }
        }
        next[idx] = sum / cnt;
      }
    }
    curr = next;
  }

  return { maskGrid, distGrid: curr };
}

function bakeCharacterAtlas(id, frontCrop, backCrop, nx = 44, ny = 68) {
  const w = frontCrop.width;
  const h = frontCrop.height;

  // Pack Front (left half: 0..w) and Back (right half: w..2w) into a single baked UV atlas
  const atlasW = w * 2;
  const atlasH = h;
  const atlasRGBA = new Uint8Array(atlasW * atlasH * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4;
      // Left half: Front
      const diF = (y * atlasW + x) * 4;
      atlasRGBA[diF] = frontCrop.data[si];
      atlasRGBA[diF + 1] = frontCrop.data[si + 1];
      atlasRGBA[diF + 2] = frontCrop.data[si + 2];
      atlasRGBA[diF + 3] = frontCrop.data[si + 3];
      // Right half: Back
      const diB = (y * atlasW + (w + x)) * 4;
      atlasRGBA[diB] = backCrop.data[si];
      atlasRGBA[diB + 1] = backCrop.data[si + 1];
      atlasRGBA[diB + 2] = backCrop.data[si + 2];
      atlasRGBA[diB + 3] = backCrop.data[si + 3];
    }
  }

  const outPath = path.join(ASSETS_DIR, `baked-${id}-uv.png`);
  fs.writeFileSync(outPath, encodePNG(atlasW, atlasH, atlasRGBA));
  console.log(`Baked UV Atlas: assets/baked-${id}-uv.png (${atlasW}x${atlasH})`);

  // Compute unified 3D silhouette & relief grid (using back silhouette as primary OTS contour)
  const backRelief = computeGridRelief(backCrop.alphaMask, w, h, nx, ny, false);

  // Quantize distGrid to 0..99 integers for compact JSON embedding
  const maxD = 8.5;
  const qDepth = [];
  for (let i = 0; i < nx * ny; i++) {
    if (!backRelief.maskGrid[i]) {
      qDepth.push(0);
    } else {
      const t = Math.min(1, backRelief.distGrid[i] / maxD);
      // Circular/ellipsoidal 3D profile: sqrt(1 - (1 - t)^2)
      const sphereProfile = Math.sqrt(Math.max(0.04, 1 - Math.pow(1 - t, 2)));
      qDepth.push(Math.max(1, Math.min(99, Math.round(sphereProfile * 99))));
    }
  }

  return {
    id,
    nx,
    ny,
    aspect: w / h,
    atlasUrl: `assets/baked-${id}-uv.png`,
    depthGrid: qDepth
  };
}

function bakeWeaponModel(id, nx = 42, ny = 28) {
  const img = decodePNG(path.join(ASSETS_DIR, `gear-${id}-weapon.png`));
  // Crop weapon tightly from 1536x1024 RGBA
  const crop = cropRGBA(img, 140, 140, 1256, 744);
  const w = crop.width, h = crop.height;
  const alphaMask = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    alphaMask[p] = crop.data[p * 4 + 3] >= 60 ? 1 : 0;
  }

  const relief = computeGridRelief(alphaMask, w, h, nx, ny, false);
  const maxD = 6.5;
  const qDepth = [];
  for (let i = 0; i < nx * ny; i++) {
    if (!relief.maskGrid[i]) {
      qDepth.push(0);
    } else {
      const t = Math.min(1, relief.distGrid[i] / maxD);
      const profile = Math.sqrt(Math.max(0.06, 1 - Math.pow(1 - t, 2)));
      qDepth.push(Math.max(1, Math.min(99, Math.round(profile * 99))));
    }
  }

  return {
    id,
    nx,
    ny,
    aspect: w / h,
    texUrl: `assets/gear-${id}-weapon.png`,
    depthGrid: qDepth
  };
}

function main() {
  const bakedCharacters = {};
  const bakedEnemies = {};
  const bakedWeapons = {};

  // 1. Bake Playable Fighters (pip, bruno, volt)
  for (const id of ['pip', 'bruno', 'volt']) {
    const frontRaw = decodePNG(path.join(ASSETS_DIR, `${id}-front.png`));
    const backRaw = decodePNG(path.join(ASSETS_DIR, `${id}-back.png`));

    const frontCrop = removeStudioGrayAndDilate(cropRGBA(frontRaw, 4, 8, 376, 602), {
      tolerance: 30,
      maxSat: 22,
      maxWhite: 222
    });
    const clearRects = id === 'volt' ? [{ x: 306, y: 0, w: 70, h: 185 }] : [];
    const backCrop = removeStudioGrayAndDilate(cropRGBA(backRaw, 4, 8, 376, 602), {
      tolerance: 30,
      maxSat: 22,
      maxWhite: 222,
      clearRects
    });

    bakedCharacters[id] = bakeCharacterAtlas(id, frontCrop, backCrop, 44, 68);
    bakedWeapons[id] = bakeWeaponModel(id, 42, 28);
  }

  // 2. Bake Enemies from enemy-roster.png (raider, hopper, foreman)
  const rosterRaw = decodePNG(path.join(ASSETS_DIR, 'enemy-roster.png'));
  const enemySpecs = {
    raider: {
      front: { x: 8, y: 6, w: 462, h: 576, clear: [{ x: 145, y: 556, w: 185, h: 24 }] },
      back:  { x: 8, y: 604, w: 462, h: 382, clear: [{ x: 145, y: 0, w: 185, h: 16 }] }
    },
    hopper: {
      front: { x: 482, y: 6, w: 490, h: 576, clear: [{ x: 155, y: 556, w: 190, h: 24 }] },
      back:  { x: 482, y: 602, w: 490, h: 384, clear: [{ x: 155, y: 0, w: 190, h: 16 }] }
    },
    foreman: {
      front: { x: 984, y: 4, w: 546, h: 578, clear: [{ x: 180, y: 558, w: 210, h: 24 }] },
      back:  { x: 984, y: 598, w: 546, h: 390, clear: [{ x: 180, y: 0, w: 210, h: 20 }] }
    }
  };

  for (const [id, spec] of Object.entries(enemySpecs)) {
    const fCrop = removeStudioGrayAndDilate(
      cropRGBA(rosterRaw, spec.front.x, spec.front.y, spec.front.w, spec.front.h),
      { tolerance: 30, maxSat: 22, maxWhite: 222, clearRects: spec.front.clear }
    );
    // Resample back crop vertically to match frontCrop height so UV atlas is symmetric
    const bRawCrop = removeStudioGrayAndDilate(
      cropRGBA(rosterRaw, spec.back.x, spec.back.y, spec.back.w, spec.back.h),
      { tolerance: 30, maxSat: 22, maxWhite: 222, clearRects: spec.back.clear }
    );
    const bResampled = {
      width: fCrop.width,
      height: fCrop.height,
      data: new Uint8Array(fCrop.width * fCrop.height * 4),
      alphaMask: new Uint8Array(fCrop.width * fCrop.height)
    };
    for (let y = 0; y < fCrop.height; y++) {
      const sy = Math.min(bRawCrop.height - 1, Math.floor((y / fCrop.height) * bRawCrop.height));
      for (let x = 0; x < fCrop.width; x++) {
        const sx = Math.min(bRawCrop.width - 1, x);
        const si = (sy * bRawCrop.width + sx) * 4;
        const di = (y * fCrop.width + x) * 4;
        bResampled.data[di] = bRawCrop.data[si];
        bResampled.data[di + 1] = bRawCrop.data[si + 1];
        bResampled.data[di + 2] = bRawCrop.data[si + 2];
        bResampled.data[di + 3] = bRawCrop.data[si + 3];
        bResampled.alphaMask[y * fCrop.width + x] = bRawCrop.alphaMask[sy * bRawCrop.width + sx];
      }
    }

    // For enemies (primarily viewed from the front as they charge the player), use front silhouette for 3D hull
    const w = fCrop.width, h = fCrop.height;
    const atlasW = w * 2, atlasH = h;
    const atlasRGBA = new Uint8Array(atlasW * atlasH * 4);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const si = (y * w + x) * 4;
        const diF = (y * atlasW + x) * 4;
        atlasRGBA[diF] = fCrop.data[si];
        atlasRGBA[diF + 1] = fCrop.data[si + 1];
        atlasRGBA[diF + 2] = fCrop.data[si + 2];
        atlasRGBA[diF + 3] = fCrop.data[si + 3];
        const diB = (y * atlasW + (w + x)) * 4;
        atlasRGBA[diB] = bResampled.data[si];
        atlasRGBA[diB + 1] = bResampled.data[si + 1];
        atlasRGBA[diB + 2] = bResampled.data[si + 2];
        atlasRGBA[diB + 3] = bResampled.data[si + 3];
      }
    }
    fs.writeFileSync(path.join(ASSETS_DIR, `baked-${id}-uv.png`), encodePNG(atlasW, atlasH, atlasRGBA));
    console.log(`Baked Enemy UV Atlas: assets/baked-${id}-uv.png (${atlasW}x${atlasH})`);

    const nx = 42, ny = 58;
    const fRelief = computeGridRelief(fCrop.alphaMask, w, h, nx, ny, false);
    const maxD = 8.0;
    const qDepth = [];
    for (let i = 0; i < nx * ny; i++) {
      if (!fRelief.maskGrid[i]) qDepth.push(0);
      else {
        const t = Math.min(1, fRelief.distGrid[i] / maxD);
        const profile = Math.sqrt(Math.max(0.04, 1 - Math.pow(1 - t, 2)));
        qDepth.push(Math.max(1, Math.min(99, Math.round(profile * 99))));
      }
    }
    bakedEnemies[id] = {
      id,
      nx,
      ny,
      aspect: w / h,
      atlasUrl: `assets/baked-${id}-uv.png`,
      depthGrid: qDepth
    };
  }

  // Write src/bakedModelData.js
  const jsOut = `// AUTO-GENERATED BY tools/bake_models.js — DO NOT EDIT MANUALLY
// Pre-baked 3D Volumetric Silhouette & Ellipsoidal Depth Relief Grids + Baked UV Atlas Metadata
export const BAKED_CHARACTER_MODELS = ${JSON.stringify(bakedCharacters)};
export const BAKED_ENEMY_MODELS = ${JSON.stringify(bakedEnemies)};
export const BAKED_WEAPON_MODELS = ${JSON.stringify(bakedWeapons)};
`;
  fs.writeFileSync(path.join(SRC_DIR, 'bakedModelData.js'), jsOut);
  console.log('Successfully generated src/bakedModelData.js!');
}

main();
