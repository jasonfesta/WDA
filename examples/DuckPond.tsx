import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// 1. CONSTANTS & PAPER / SDF CONFIGURATION
// ============================================================================

export const BG_COLOR = { r: 245, g: 241, b: 236 }; // #f5f1ec

export const PAPER_CONFIG = {
  brightness: 21,
  contrast: 31,
  warmth: 23,
  grain: 71,
  grainPop: 9,
  fog: 63,
  lightLeak: 12,
  edgeFade: 10,
  cornerRadius: 28,
  edgeNoise: 27,
  edgeMargin: 5,
};

const DUCK_LINES = [
  'hi :)',
  'u clicked me!',
  'hey! that tickles',
  "do u think they'll feed us",
  'i think they like us',
  'psst... scroll down',
  'we see u',
  'stop poking me',
  'bao made this pond for us :)',
  "bao hasn't fed us today smh",
  "i can't feel my feet actually",
  "we don't get paid for this",
  'i peaked at birth honestly',
  "this water isn't even real",
  'nice weather today',
  'quack',
  'QUACK QUACK QUACK',
  'quack',
  '...',
  "u ever wonder what's below the water",
  'stop following me',
  'race u to the other side',
  "i think i'm the favorite duck",
  "don't tell bao i said this but the pond is kinda small",
];

const FISH_LINES = [
  'YO IS THAT A FISH',
  'omg a fish!!',
  "bro there's a FISH",
  'FISH FISH FISH',
  'wait... do fish even live here',
  'GET IT GET IT',
  'dibs on the fish',
  'that fish is MINE',
  'yo who invited the fish',
  'a fish?? in THIS economy?',
  'nature is healing 🐟',
];

function pickRandomLine(lines: string[], exclude?: string | null): string {
  const pool = exclude ? lines.filter((item) => item !== exclude) : lines;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================================
// 2. PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL ASSETS)
// ============================================================================

class PondAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private activeVoices = 0;
  private throttleMap = new Map<string, number>();
  private enabled = true;

  private init() {
    if (this.ctx || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -6;
    compressor.knee.value = 4;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.12;
    compressor.connect(this.ctx.destination);

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(compressor);

    this.noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  private getAudio() {
    if (!this.enabled) return null;
    if (!this.ctx) this.init();
    if (!this.ctx || !this.master) return null;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return { ctx: this.ctx, master: this.master };
  }

  private throttled(key: string, ms: number): boolean {
    const now = performance.now();
    const last = this.throttleMap.get(key);
    if (last !== undefined && now - last < ms) return true;
    this.throttleMap.set(key, now);
    return false;
  }

  private stereo(nx?: number): number {
    if (nx === undefined) return 0;
    return (Math.max(0, Math.min(1, nx)) - 0.5) * 0.7;
  }

  private detune(freq: number, cents = 30): number {
    return freq * Math.pow(2, ((Math.random() * 2 - 1) * cents) / 1200);
  }

  private pentatonic(step: number): number {
    const scale = [392, 440, 523.25, 587.33, 698.46];
    const len = scale.length;
    const octave = Math.floor(step / len);
    return scale[((step % len) + len) % len] * Math.pow(2, octave);
  }

  private playNoise(opts: {
    filter?: BiquadFilterType;
    freq?: number;
    to?: number;
    dur?: number;
    gain?: number;
    q?: number;
    delay?: number;
    pan?: number;
  }) {
    const audio = this.getAudio();
    if (!audio || !this.noiseBuffer || this.activeVoices >= 14) return;
    this.activeVoices++;

    const { ctx, master } = audio;
    const start = ctx.currentTime + (opts.delay ?? 0);
    const dur = opts.dur ?? 0.05;
    const gainVal = opts.gain ?? 0.08;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const offset = Math.random() * Math.max(0, this.noiseBuffer.duration - dur - 0.05);

    const filter = ctx.createBiquadFilter();
    filter.type = opts.filter ?? 'bandpass';
    filter.frequency.setValueAtTime(opts.freq ?? 1200, start);
    if (opts.to !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), start + dur);
    }
    filter.Q.value = opts.q ?? 1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainVal, start + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    src.connect(filter);
    filter.connect(gain);

    let out: AudioNode = gain;
    if (opts.pan !== undefined && ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, opts.pan));
      gain.connect(panner);
      out = panner;
    }
    out.connect(master);

    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        this.activeVoices = Math.max(0, this.activeVoices - 1);
      }
    };
    src.onended = release;
    setTimeout(release, (start + dur + 0.02 - ctx.currentTime) * 1000 + 250);
    src.start(start, offset, dur + 0.02);
    src.stop(start + dur + 0.02);
  }

  private playTone(opts: {
    freq: number;
    to?: number;
    dur?: number;
    attack?: number;
    gain?: number;
    type?: OscillatorType;
    filter?: BiquadFilterType;
    cutoff?: number;
    q?: number;
    delay?: number;
    pan?: number;
  }) {
    const audio = this.getAudio();
    if (!audio || this.activeVoices >= 14) return;
    this.activeVoices++;

    const { ctx, master } = audio;
    const start = ctx.currentTime + (opts.delay ?? 0);
    const dur = opts.dur ?? 0.12;
    const attack = opts.attack ?? 0.004;
    const gainVal = opts.gain ?? 0.1;

    const osc = ctx.createOscillator();
    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(opts.freq, start);
    if (opts.to !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), start + dur);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainVal, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);

    let out: AudioNode = gain;
    if (opts.cutoff !== undefined) {
      const filter = ctx.createBiquadFilter();
      filter.type = opts.filter ?? 'lowpass';
      filter.frequency.value = opts.cutoff;
      filter.Q.value = opts.q ?? 0.7;
      gain.connect(filter);
      out = filter;
    }

    if (opts.pan !== undefined && ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, opts.pan));
      out.connect(panner);
      out = panner;
    }
    out.connect(master);

    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        this.activeVoices = Math.max(0, this.activeVoices - 1);
      }
    };
    osc.onended = release;
    setTimeout(release, (start + dur + 0.02 - ctx.currentTime) * 1000 + 250);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  tap(vol = 1) {
    this.playNoise({ filter: 'lowpass', freq: 1500, dur: 0.022, gain: 0.295 * vol, q: 0.5 });
    this.playTone({ freq: this.detune(196), to: 120, dur: 0.07, gain: 0.1023 * vol, cutoff: 900 });
  }

  toggle(active: boolean) {
    this.tap(0.7);
    const f1 = active ? this.pentatonic(1) : this.pentatonic(3);
    const f2 = active ? this.pentatonic(3) : this.pentatonic(1);
    this.playTone({ freq: f1, dur: 0.06, gain: 0.057, cutoff: 2400 });
    this.playTone({ freq: f2, dur: 0.14, gain: 0.0665, delay: 0.045, attack: 0.006, cutoff: 2400 });
  }

  plop(nx: number, vol = 1) {
    const pan = this.stereo(nx);
    this.playNoise({ filter: 'lowpass', freq: 1400, to: 260, dur: 0.09, gain: 1.177 * vol, q: 0.7, pan });
    const f1 = this.detune(760, 140);
    this.playTone({ freq: f1, to: 1.5 * f1, dur: 0.028, gain: 0.18 * vol, cutoff: 3000, pan });
    const f2 = this.detune(1150, 200);
    this.playTone({
      freq: f2,
      to: 1.4 * f2,
      dur: 0.018,
      gain: 0.09 * vol,
      cutoff: 4000,
      delay: 0.035 + Math.random() * 0.03,
      pan: pan + 0.06,
    });
  }

  pellets(nx: number) {
    if (this.throttled('pellets', 130)) return;
    const pan = this.stereo(nx);
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      this.playNoise({
        filter: 'bandpass',
        freq: 1800 + Math.random() * 2200,
        dur: 0.01,
        gain: 0.306,
        q: 1.4,
        delay: Math.random() * 0.12,
        pan: pan + (Math.random() - 0.5) * 0.3,
      });
    }
    const f = this.detune(1300, 220);
    this.playTone({ freq: f, to: 1.4 * f, dur: 0.02, gain: 0.0884, cutoff: 4000, delay: 0.045, pan });
  }

  surface(nx: number) {
    const pan = this.stereo(nx);
    this.playNoise({ filter: 'lowpass', freq: 260, to: 2000, dur: 0.11, gain: 1.896, q: 0.6, pan });
    this.playNoise({ filter: 'lowpass', freq: 1600, to: 400, dur: 0.13, gain: 1.138, q: 0.6, delay: 0.1, pan });
    const f = this.detune(680, 160);
    this.playTone({ freq: f, to: 1.5 * f, dur: 0.025, gain: 0.2, cutoff: 3000, delay: 0.12, pan });
  }

  nibble(nx: number) {
    if (this.throttled('nibble', 240)) return;
    const pan = this.stereo(nx);
    let delay = 0;
    for (let i = 0; i < 3; i++) {
      this.playNoise({
        filter: 'bandpass',
        freq: 900 + Math.random() * 700,
        dur: 0.014,
        gain: 0.3936,
        q: 1.1,
        delay,
        pan,
      });
      delay += 0.03 + Math.random() * 0.03;
    }
  }

  chomp(nx: number) {
    const pan = this.stereo(nx);
    this.playNoise({ filter: 'lowpass', freq: 2600, to: 500, dur: 0.06, gain: 0.774, q: 0.7, pan });
    this.playNoise({ filter: 'bandpass', freq: 700, dur: 0.02, gain: 0.3612, q: 1.2, delay: 0.03, pan });
    const f = this.detune(520, 120);
    this.playTone({ freq: f, to: 1.35 * f, dur: 0.02, gain: 0.1836, cutoff: 2600, delay: 0.045, pan });
  }

  chirp(index: number, nx: number) {
    const pan = this.stereo(nx);
    const base = 300 * Math.pow(1.14, ((index % 5) + 5) % 5);
    this.playTone({
      freq: 1.12 * base,
      to: 0.86 * base,
      dur: 0.09,
      gain: 0.61,
      type: 'sawtooth',
      filter: 'bandpass',
      cutoff: 3.4 * base,
      q: 3.2,
      attack: 0.006,
      pan,
    });
    this.playNoise({
      filter: 'bandpass',
      freq: 3.4 * base,
      dur: 0.05,
      gain: 0.2916,
      q: 2.5,
      pan,
    });
  }
}

const sfx = new PondAudioEngine();

// ============================================================================
// 3. NOISE, SDF EDGE MASK & PAPER GRAIN OVERLAY (LAYER 3)
// ============================================================================

function intHash2D(x: number, y: number): number {
  let r = (0x165667b1 * x + 0x27d4eb2f * y) | 0;
  r = Math.imul(r ^ (r >> 13), 0x4bf19f61);
  return ((r ^ (r >> 16)) & 0x7fffffff) / 0x7fffffff;
}

function valueNoise2D(x: number, y: number, scale: number): number {
  const sx = x * scale;
  const sy = y * scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    (intHash2D(ix, iy) * (1 - ux) + intHash2D(ix + 1, iy) * ux) * (1 - uy) +
    (intHash2D(ix, iy + 1) * (1 - ux) + intHash2D(ix + 1, iy + 1) * ux) * uy
  );
}

export function fractalNoise(x: number, y: number): number {
  return 0.6 * valueNoise2D(x, y, 0.004) + 0.25 * valueNoise2D(x, y, 0.01) + 0.15 * valueNoise2D(x, y, 0.025);
}

export function filmGrain(amount: number, popProb: number, popMult: number): number {
  const r = Math.random();
  if (r < 0.6 * popProb) return popMult * (0.5 + 0.5 * Math.random()) * amount;
  if (r < popProb) return -(popMult * (0.3 + 0.4 * Math.random()) * amount);
  return ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * amount * 2;
}

export function evaluateEdgeSDF(x: number, y: number, width: number, height: number): number {
  const margin = (PAPER_CONFIG.edgeMargin / 100) * Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const halfW = cx - margin;
  const halfH = cy - margin;
  const minHalf = Math.min(halfW, halfH);
  const radius = (PAPER_CONFIG.cornerRadius / 100) * minHalf;
  const noiseAmp = (PAPER_CONFIG.edgeNoise / 100) * Math.min(width, height) * 0.06;

  const dx = Math.abs(x - cx) - (halfW - radius);
  const dy = Math.abs(y - cy) - (halfH - radius);
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  let dist = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(dx, dy), 0) - radius;

  if (noiseAmp > 0) {
    dist += (2 * fractalNoise(x, y) - 1) * noiseAmp;
  }
  return dist;
}

export function createEdgeMask(width: number, height: number): Float32Array {
  const mask = new Float32Array(width * height);
  const margin = (PAPER_CONFIG.edgeMargin / 100) * Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const halfW = cx - margin;
  const halfH = cy - margin;
  const minHalf = Math.min(halfW, halfH);
  const radius = (PAPER_CONFIG.cornerRadius / 100) * minHalf;
  const noiseAmp = (PAPER_CONFIG.edgeNoise / 100) * Math.min(width, height) * 0.06;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x - cx) - (halfW - radius);
      const dy = Math.abs(y - cy) - (halfH - radius);
      const ox = Math.max(dx, 0);
      const oy = Math.max(dy, 0);
      let d = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(dx, dy), 0) - radius;
      if (noiseAmp > 0) {
        d += (2 * fractalNoise(x, y) - 1) * noiseAmp;
      }
      mask[y * width + x] = d;
    }
  }
  return mask;
}

function applyPaperBackdrop(
  data: Uint8ClampedArray,
  mask: Float32Array,
  fadeDist: number,
  bg: { r: number; g: number; b: number }
) {
  for (let i = 0; i < mask.length; i++) {
    const d = mask[i];
    const idx = i * 4;
    if (d > 0) {
      data[idx] = bg.r;
      data[idx + 1] = bg.g;
      data[idx + 2] = bg.b;
      data[idx + 3] = 255;
    } else if (fadeDist > 0 && -d < fadeDist) {
      const t = -d / fadeDist;
      const borderAlpha = 1 - t * t * (3 - 2 * t);
      const dstAlpha = data[idx + 3] / 255;
      const outAlpha = borderAlpha + dstAlpha * (1 - borderAlpha);
      if (outAlpha > 0) {
        data[idx] = Math.round((bg.r * borderAlpha + data[idx] * dstAlpha * (1 - borderAlpha)) / outAlpha);
        data[idx + 1] = Math.round((bg.g * borderAlpha + data[idx + 1] * dstAlpha * (1 - borderAlpha)) / outAlpha);
        data[idx + 2] = Math.round((bg.b * borderAlpha + data[idx + 2] * dstAlpha * (1 - borderAlpha)) / outAlpha);
      }
      data[idx + 3] = Math.round(outAlpha * 255);
    }
  }
}

export function renderPaperOverlay(canvas: HTMLCanvasElement, mask: Float32Array) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx || width === 0 || height === 0) return;

  // Pass 1: Per-pixel film grain & soft edge fade into #f5f1ec
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const fadeDist = (PAPER_CONFIG.edgeFade / 100) * Math.min(width, height) * 0.45;
  const grainAmt = (PAPER_CONFIG.grain / 100) * 80;
  const pop = PAPER_CONFIG.grainPop / 100;
  const popProb = 0.15 * pop;
  const popMult = 1.5 + 2.5 * pop;
  const warmth = 0.3 * PAPER_CONFIG.warmth;
  const bright = (PAPER_CONFIG.brightness / 100) * 255;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const idx = i * 4;
      const d = mask[i];
      if (d > 0) continue;

      let r = warmth + bright;
      let g = bright;
      let b = -warmth + bright;
      const gr = filmGrain(grainAmt, popProb, popMult);
      r += gr;
      g += gr;
      b += gr;
      const avg = (r + g + b) / 3;
      const alpha = Math.min(255, Math.max(0, 0.7 * Math.abs(avg)));

      if (avg >= 0) {
        data[idx] = Math.min(255, 245 + Math.round(0.5 * warmth));
        data[idx + 1] = 240;
        data[idx + 2] = Math.max(0, 230 - Math.round(0.3 * warmth));
        data[idx + 3] = Math.round(alpha);
      } else {
        data[idx] = 30;
        data[idx + 1] = 25;
        data[idx + 2] = 20;
        data[idx + 3] = Math.round(0.6 * alpha);
      }

      if (fadeDist > 0 && -d < fadeDist) {
        const t = -d / fadeDist;
        const edgeA = Math.round(255 * (1 - t * t * (3 - 2 * t)));
        const srcA = data[idx + 3] / 255;
        const bgA = edgeA / 255;
        const outA = srcA + bgA * (1 - srcA);
        if (outA > 0) {
          data[idx] = Math.round((data[idx] * srcA + BG_COLOR.r * bgA * (1 - srcA)) / outA);
          data[idx + 1] = Math.round((data[idx + 1] * srcA + BG_COLOR.g * bgA * (1 - srcA)) / outA);
          data[idx + 2] = Math.round((data[idx + 2] * srcA + BG_COLOR.b * bgA * (1 - srcA)) / outA);
        }
        data[idx + 3] = Math.round(255 * outA);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Pass 2: Radial fog & warm light leaks (composited via source-atop)
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  const fogAlpha = (PAPER_CONFIG.fog / 100) * 0.35;
  const fogGrad = ctx.createRadialGradient(cx, cy, 0.05 * width, cx, cy, maxR);
  fogGrad.addColorStop(0, `rgba(240, 235, 228, ${fogAlpha})`);
  fogGrad.addColorStop(0.5, `rgba(240, 235, 228, ${0.6 * fogAlpha})`);
  fogGrad.addColorStop(1, `rgba(220, 215, 210, ${0.8 * fogAlpha})`);

  ctx.fillStyle = fogGrad;
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillRect(0, 0, width, height);

  const leakAlpha = (PAPER_CONFIG.lightLeak / 100) * 0.35;
  const leaks = [
    { x: 0.15 * width, y: 0.2 * height, r: 0.5 * width },
    { x: 0.85 * width, y: 0.7 * height, r: 0.4 * width },
    { x: 0.5 * width, y: 0.1 * height, r: 0.35 * width },
  ];
  for (const leak of leaks) {
    const grad = ctx.createRadialGradient(leak.x, leak.y, 0, leak.x, leak.y, leak.r);
    grad.addColorStop(0, `rgba(255, 252, 245, ${leakAlpha})`);
    grad.addColorStop(0.4, `rgba(255, 250, 240, ${0.4 * leakAlpha})`);
    grad.addColorStop(1, 'rgba(255, 250, 240, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.globalCompositeOperation = 'source-over';

  // Pass 3: Solid paper backdrop outside SDF mask
  const finalImg = ctx.getImageData(0, 0, width, height);
  applyPaperBackdrop(finalImg.data, mask, 0, BG_COLOR);
  ctx.putImageData(finalImg, 0, 0);
}

// ============================================================================
// 4. GLSL SHADERS & WEBGL WATER / RIPPLE ENGINE (LAYER 1)
// ============================================================================

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_ripples[12]; // xy = pixel pos, z = drop time, w = amplitude

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return -1.0 + 2.0 * mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Seascape wave octave: 1.0 - abs(sin()) creates sharp crests
float sea_octave(vec2 uv, float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

// Rotation between octaves kills axis-aligned banding
const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);

float getHeight(vec2 uv) {
  float SEA_TIME = u_time * 0.8;
  float freq = 0.16;
  float amp = 0.6;
  float choppy = 4.0;
  float h = 0.0;

  for (int i = 0; i < 5; i++) {
    float d  = sea_octave((uv + SEA_TIME) * freq, choppy);
          d += sea_octave((uv - SEA_TIME) * freq, choppy);
    h += d * amp;
    uv *= octave_m;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return h;
}

vec3 getNormal(vec2 uv, float eps) {
  float h  = getHeight(uv);
  float hx = getHeight(uv + vec2(eps, 0.0));
  float hy = getHeight(uv + vec2(0.0, eps));
  return normalize(vec3(h - hx, eps * 8.0, h - hy));
}

// Ripple that warps and stretches with the underlying wave surface
float ripple(vec2 pos, vec2 center, float time, float dropTime) {
  float age = time - dropTime;
  if (age < 0.0 || age > 4.0) return 0.0;

  // Wave surface gradient — how the water slopes at this point
  float eps = 0.04;
  float hc = getHeight(pos);
  float hx = getHeight(pos + vec2(eps, 0.0));
  float hy = getHeight(pos + vec2(0.0, eps));
  vec2 grad = vec2(hx - hc, hy - hc) / eps;

  // Strong gradient warp — ripple stretches along wave slopes
  vec2 diff = pos - center + grad * 1.2;

  // Add organic noise distortion to break perfect circles
  float n = noise(pos * 3.0 + time * 0.5) * 0.15;
  diff += vec2(n, -n);

  float dist = length(diff);

  // Tighter wavefront ring, speed affected by local wave height
  float speedMod = 1.0 + hc * 0.3;
  float wavefront = age * 4.5 * speedMod;
  float envelope = exp(-pow(dist - wavefront, 2.0) / 1.5);
  float decay = exp(-age * 1.4);

  // Higher frequency rings
  return 0.45 * envelope * decay * cos(dist * 5.0 - time * 6.0);
}

vec3 getWaterColor(vec2 uv, vec3 normal, float height) {
  vec3 deepColor = vec3(0.02, 0.18, 0.32);
  vec3 waterColor = vec3(0.25, 0.65, 0.60);
  vec3 skyColor = vec3(0.50, 0.82, 0.88);

  vec3 lightDir = normalize(vec3(0.4, 0.7, 0.3));
  vec3 eye = vec3(0.0, 1.0, 0.0);

  // Fresnel
  float fresnel = 1.0 - max(dot(normal, eye), 0.0);
  fresnel = clamp(pow(fresnel, 3.0) * 0.65, 0.0, 1.0);

  // Diffuse subsurface
  float diff = pow(dot(normal, lightDir) * 0.4 + 0.6, 80.0);
  vec3 refracted = deepColor + diff * waterColor * 0.12;

  vec3 color = mix(refracted, skyColor, fresnel);

  // Height variation
  color += waterColor * (height - 0.6) * 0.18;

  // Specular
  vec3 refl = reflect(-eye, normal);
  float spec = pow(max(dot(refl, lightDir), 0.0), 60.0);
  float nrm = (60.0 + 8.0) / (3.14159 * 8.0);
  color += vec3(spec * nrm * 0.15);

  return color;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  px.y = u_resolution.y - px.y;
  vec2 res = u_resolution;

  float scale = 30.0;
  vec2 uv = (px / min(res.x, res.y)) * scale;

  float height = getHeight(uv);

  for (int i = 0; i < 12; i++) {
    vec2 mouseUV = (u_ripples[i].xy / min(res.x, res.y)) * scale;
    float dropTime = u_ripples[i].z;
    float amp = u_ripples[i].w;
    height += ripple(uv, mouseUV, u_time, dropTime) * amp;
  }

  vec3 normal = getNormal(uv, 0.01);
  vec3 color = getWaterColor(uv, normal, height);

  // Gamma correction
  color = pow(max(color, vec3(0.0)), vec3(0.75));

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

interface RippleDrop {
  x: number;
  y: number;
  time: number;
  amp: number;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function useWaveGL(
  waveCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  paperCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  visRef: React.RefObject<boolean>
) {
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const ripplesRef = useRef<RippleDrop[]>([]);
  const loopFnRef = useRef<() => void>(() => {});

  const addPixelRipple = useCallback((x: number, y: number, amp = 1) => {
    const now = (performance.now() - startTimeRef.current) / 1000;
    const list = ripplesRef.current;
    let writeIdx = 0;
    for (let i = 0; i < list.length; i++) {
      if (now - list[i].time < 4) {
        list[writeIdx++] = list[i];
      }
    }
    list.length = writeIdx;
    if (list.length >= 12) list.shift();
    list.push({ x, y, time: now, amp });
  }, []);

  const triggerRippleAt = useCallback(
    (nx: number, ny: number, amp = 1) => {
      const canvas = waveCanvasRef.current;
      if (canvas) {
        addPixelRipple(nx * canvas.width, ny * canvas.height, amp);
      }
    },
    [waveCanvasRef, addPixelRipple]
  );

  useEffect(() => {
    const waveCanvas = waveCanvasRef.current;
    const paperCanvas = paperCanvasRef.current;
    if (!waveCanvas || !paperCanvas) return;

    const rect = waveCanvas.getBoundingClientRect();
    waveCanvas.width = Math.round(rect.width);
    waveCanvas.height = Math.round(rect.height);
    paperCanvas.width = Math.round(rect.width);
    paperCanvas.height = Math.round(rect.height);

    const gl = waveCanvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uRipples: (WebGLUniformLocation | null)[] = [];
    for (let i = 0; i < 12; i++) {
      uRipples.push(gl.getUniformLocation(program, `u_ripples[${i}]`));
    }

    gl.uniform2f(uRes, waveCanvas.width, waveCanvas.height);
    startTimeRef.current = performance.now();

    for (let i = 0; i < 12; i++) {
      gl.uniform4f(uRipples[i], 0, 0, -10, 0);
    }

    const mask = createEdgeMask(paperCanvas.width, paperCanvas.height);
    renderPaperOverlay(paperCanvas, mask);

    const renderLoop = () => {
      if (!visRef.current) {
        if (pausedAtRef.current === 0) pausedAtRef.current = performance.now();
        return;
      }
      if (pausedAtRef.current > 0) {
        startTimeRef.current += performance.now() - pausedAtRef.current;
        pausedAtRef.current = 0;
      }

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      timeRef.current = elapsed;
      gl.uniform1f(uTime, elapsed);

      const ripples = ripplesRef.current;
      for (let i = 0; i < 12; i++) {
        if (i < ripples.length) {
          gl.uniform4f(uRipples[i], ripples[i].x, ripples[i].y, ripples[i].time, ripples[i].amp);
        } else {
          gl.uniform4f(uRipples[i], 0, 0, -10, 0);
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    loopFnRef.current = renderLoop;
    rafRef.current = requestAnimationFrame(renderLoop);

    let resizeTimer = 0;
    const onResize = () => {
      const r = waveCanvas.getBoundingClientRect();
      waveCanvas.width = Math.round(r.width);
      waveCanvas.height = Math.round(r.height);
      gl.viewport(0, 0, waveCanvas.width, waveCanvas.height);
      gl.uniform2f(uRes, waveCanvas.width, waveCanvas.height);

      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const pr = waveCanvas.getBoundingClientRect();
        paperCanvas.width = Math.round(pr.width);
        paperCanvas.height = Math.round(pr.height);
        const newMask = createEdgeMask(paperCanvas.width, paperCanvas.height);
        renderPaperOverlay(paperCanvas, newMask);
      }, 150);
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [waveCanvasRef, paperCanvasRef, visRef]);

  const resume = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => loopFnRef.current());
  }, []);

  return { timeRef, triggerRippleAt, resume };
}

// ============================================================================
// 5. OVERSIZED SHORELINE PLANT & CATTAIL CANVAS (LAYER 5)
// ============================================================================

const PLANT_COLORS = [
  'rgba(120, 160, 105, 0.72)',
  'rgba(130, 168, 112, 0.68)',
  'rgba(112, 152, 100, 0.65)',
  'rgba(135, 172, 118, 0.62)',
  'rgba(125, 164, 108, 0.68)',
];

interface PlantClusterSpec {
  edge: 'bottom' | 'left' | 'right' | 'top';
  along: number;
  bladeCount: number;
  spread: number;
  heightRange: [number, number];
  cattailChance: number;
}

const PLANT_CLUSTER_SPECS: PlantClusterSpec[] = [
  { edge: 'bottom', along: 0.06, bladeCount: 12, spread: 0.03, heightRange: [80, 150], cattailChance: 0.25 },
  { edge: 'bottom', along: 0.12, bladeCount: 10, spread: 0.025, heightRange: [70, 130], cattailChance: 0.2 },
  { edge: 'bottom', along: 0.18, bladeCount: 8, spread: 0.025, heightRange: [55, 110], cattailChance: 0.15 },
  { edge: 'bottom', along: 0.24, bladeCount: 6, spread: 0.02, heightRange: [42, 90], cattailChance: 0.1 },
  { edge: 'bottom', along: 0.3, bladeCount: 4, spread: 0.018, heightRange: [35, 70], cattailChance: 0.1 },
  { edge: 'bottom', along: 0.42, bladeCount: 3, spread: 0.02, heightRange: [28, 55], cattailChance: 0.15 },
  { edge: 'bottom', along: 0.55, bladeCount: 3, spread: 0.018, heightRange: [25, 50], cattailChance: 0.2 },
  { edge: 'bottom', along: 0.7, bladeCount: 4, spread: 0.018, heightRange: [35, 70], cattailChance: 0.1 },
  { edge: 'bottom', along: 0.76, bladeCount: 5, spread: 0.02, heightRange: [38, 85], cattailChance: 0.1 },
  { edge: 'bottom', along: 0.82, bladeCount: 7, spread: 0.025, heightRange: [52, 105], cattailChance: 0.15 },
  { edge: 'bottom', along: 0.88, bladeCount: 9, spread: 0.025, heightRange: [62, 125], cattailChance: 0.2 },
  { edge: 'bottom', along: 0.94, bladeCount: 11, spread: 0.03, heightRange: [75, 145], cattailChance: 0.25 },
  { edge: 'left', along: 0.22, bladeCount: 3, spread: 0.01, heightRange: [32, 62], cattailChance: 0.3 },
  { edge: 'left', along: 0.35, bladeCount: 3, spread: 0.012, heightRange: [35, 70], cattailChance: 0.3 },
  { edge: 'left', along: 0.5, bladeCount: 4, spread: 0.012, heightRange: [42, 84], cattailChance: 0.35 },
  { edge: 'left', along: 0.65, bladeCount: 5, spread: 0.015, heightRange: [48, 98], cattailChance: 0.3 },
  { edge: 'left', along: 0.8, bladeCount: 6, spread: 0.018, heightRange: [55, 110], cattailChance: 0.3 },
  { edge: 'right', along: 0.25, bladeCount: 3, spread: 0.01, heightRange: [32, 62], cattailChance: 0.3 },
  { edge: 'right', along: 0.38, bladeCount: 3, spread: 0.012, heightRange: [35, 70], cattailChance: 0.35 },
  { edge: 'right', along: 0.52, bladeCount: 4, spread: 0.012, heightRange: [38, 76], cattailChance: 0.3 },
  { edge: 'right', along: 0.68, bladeCount: 5, spread: 0.015, heightRange: [45, 90], cattailChance: 0.3 },
  { edge: 'right', along: 0.82, bladeCount: 6, spread: 0.018, heightRange: [52, 105], cattailChance: 0.25 },
  { edge: 'top', along: 0.08, bladeCount: 6, spread: 0.02, heightRange: [48, 98], cattailChance: 0.2 },
  { edge: 'top', along: 0.15, bladeCount: 4, spread: 0.018, heightRange: [38, 76], cattailChance: 0.15 },
  { edge: 'top', along: 0.35, bladeCount: 3, spread: 0.018, heightRange: [28, 55], cattailChance: 0.2 },
  { edge: 'top', along: 0.6, bladeCount: 3, spread: 0.018, heightRange: [25, 52], cattailChance: 0.25 },
  { edge: 'top', along: 0.85, bladeCount: 4, spread: 0.018, heightRange: [35, 70], cattailChance: 0.15 },
  { edge: 'top', along: 0.92, bladeCount: 5, spread: 0.02, heightRange: [45, 90], cattailChance: 0.2 },
];

interface PlantBlade {
  baseX: number;
  baseY: number;
  height: number;
  lean: number;
  curve: number;
  width: number;
  color: string;
  windPhase: number;
  windFlex: number;
  type: 'cattail' | 'reed';
  headHeight?: number;
}

function findShorelineNormalized(
  edge: PlantClusterSpec['edge'],
  along: number,
  width: number,
  height: number
): number {
  let lo: number;
  let hi: number;
  if (edge === 'bottom') {
    const x = along * width;
    lo = 0.5 * height;
    hi = height;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (evaluateEdgeSDF(x, mid, width, height) < -20) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2 / height;
  }
  if (edge === 'top') {
    const x = along * width;
    lo = 0;
    hi = 0.5 * height;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (evaluateEdgeSDF(x, mid, width, height) < -20) hi = mid;
      else lo = mid;
    }
    return (lo + hi) / 2 / height;
  }
  if (edge === 'left') {
    const y = along * height;
    lo = 0;
    hi = 0.5 * width;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (evaluateEdgeSDF(mid, y, width, height) < -20) hi = mid;
      else lo = mid;
    }
    return (lo + hi) / 2 / width;
  }
  const y = along * height;
  lo = 0.5 * width;
  hi = width;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (evaluateEdgeSDF(mid, y, width, height) < -20) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2 / width;
}

function generatePlantClusters(width: number, height: number, seed = 42) {
  let state = seed | 0;
  const rand = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };

  return {
    clusters: PLANT_CLUSTER_SPECS.map((spec) => {
      const shorePos = findShorelineNormalized(spec.edge, spec.along, width, height);
      const cx = spec.edge === 'bottom' || spec.edge === 'top' ? spec.along : shorePos;
      const cy = spec.edge === 'bottom' || spec.edge === 'top' ? shorePos : spec.along;

      const blades: PlantBlade[] = [];
      for (let i = 0; i < spec.bladeCount; i++) {
        const frac = spec.bladeCount > 1 ? i / (spec.bladeCount - 1) : 0.5;
        const isCattail = rand() < spec.cattailChance;
        const fanAngle = (frac - 0.5) * 0.8;
        let dx = (rand() - 0.5) * spec.spread;
        let dy = (rand() - 0.5) * spec.spread * 0.3;
        if (spec.edge === 'left' || spec.edge === 'right') {
          [dx, dy] = [dy, dx];
        }
        const bladeHeight = spec.heightRange[0] + rand() * (spec.heightRange[1] - spec.heightRange[0]);
        blades.push({
          baseX: cx + dx,
          baseY: cy + dy,
          height: bladeHeight,
          lean: fanAngle + (rand() - 0.5) * 0.3,
          curve: 0.15 + 0.35 * rand(),
          width: isCattail ? 1.2 + 0.6 * rand() : 0.6 + 0.9 * rand(),
          color: PLANT_COLORS[Math.floor(rand() * PLANT_COLORS.length)],
          windPhase: rand() * Math.PI * 2,
          windFlex: 0.3 + 0.5 * rand(),
          type: isCattail ? 'cattail' : 'reed',
          headHeight: isCattail ? 8 + 7 * rand() : undefined,
        });
      }
      blades.sort((a, b) => b.height - a.height);
      return { x: cx, y: cy, blades };
    }),
  };
}

function drawPlantBlade(
  ctx: CanvasRenderingContext2D,
  blade: PlantBlade,
  pondW: number,
  pondH: number,
  time: number
) {
  const bx = blade.baseX * pondW;
  const by = blade.baseY * pondH;
  const wind =
    8 * Math.sin(0.8 * time + blade.windPhase) * blade.windFlex +
    3 * Math.sin(0.3 * time + 0.7 * blade.windPhase + 0.01 * bx) * blade.windFlex;
  const angle = blade.lean + (wind / blade.height) * 0.5;

  const tipX = bx + Math.sin(angle) * blade.height + wind * blade.curve;
  const tipY = by - Math.cos(angle) * blade.height;
  const ctrlX = bx + Math.sin(0.4 * angle) * blade.height * 0.55 + wind * blade.curve * 0.3;
  const ctrlY = by - Math.cos(0.4 * angle) * blade.height * 0.55;

  const halfW = 0.5 * blade.width;
  const perpX = Math.cos(0.3 * angle);
  const perpY = Math.sin(0.3 * angle);

  ctx.beginPath();
  ctx.moveTo(bx - perpX * halfW, by - perpY * halfW);
  ctx.quadraticCurveTo(ctrlX - perpX * halfW * 0.5, ctrlY, tipX, tipY);
  ctx.quadraticCurveTo(ctrlX + perpX * halfW * 0.5, ctrlY, bx + perpX * halfW, by + perpY * halfW);
  ctx.closePath();
  ctx.fillStyle = blade.color;
  ctx.fill();

  if (blade.type === 'cattail' && blade.headHeight) {
    const headX = bx + Math.sin(0.72 * angle) * blade.height * 0.72 + wind * blade.curve * 0.36;
    const headY = by - Math.cos(0.72 * angle) * blade.height * 0.72;
    const headRot = 0.6 * angle;
    const ry = 0.55 * blade.headHeight;
    const rx = 1.3 * blade.width;

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(headRot);

    // Soft halo around cattail head
    ctx.beginPath();
    ctx.ellipse(0, 0, rx + 1.2, ry + 1.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(140, 118, 98, 0.25)';
    ctx.fill();

    // Brown radial gradient cylinder
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
    grad.addColorStop(0, 'rgba(95, 68, 52, 0.75)');
    grad.addColorStop(0.6, 'rgba(120, 92, 72, 0.55)');
    grad.addColorStop(1, 'rgba(125, 108, 92, 0.08)');
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Horizontal texture strokes
    ctx.strokeStyle = 'rgba(65, 48, 38, 0.12)';
    ctx.lineWidth = 0.3;
    for (let y = -0.6 * ry; y < 0.6 * ry; y += 3.5) {
      const span = rx * Math.sqrt(1 - (y / ry) * (y / ry)) * 0.85;
      ctx.beginPath();
      ctx.moveTo(-span, y);
      ctx.lineTo(span, y);
      ctx.stroke();
    }

    // Pointed spike above cattail head
    const spikeH = 0.8 * blade.headHeight;
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.lineTo(-0.35, -ry - 0.35 * spikeH);
    ctx.lineTo(0, -ry - spikeH);
    ctx.lineTo(0.35, -ry - 0.35 * spikeH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(125, 160, 108, 0.6)';
    ctx.fill();
    ctx.restore();
  }
}

function usePlantCanvas(
  plantCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  timeRef: React.RefObject<number>,
  visRef: React.RefObject<boolean>
) {
  const clustersRef = useRef<ReturnType<typeof generatePlantClusters> | null>(null);
  const rafRef = useRef<number>(0);
  const loopFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = plantCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      clustersRef.current = generatePlantClusters(canvas.width - 400, canvas.height - 400);
    };
    rebuild();

    let resizeTimer = 0;
    const renderLoop = () => {
      if (!visRef.current) return;
      const data = clustersRef.current;
      if (data) {
        const t = timeRef.current ?? 0;
        const pondW = canvas.width - 400;
        const pondH = canvas.height - 400;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(200, 200);
        for (const cluster of data.clusters) {
          for (const blade of cluster.blades) {
            drawPlantBlade(ctx, blade, pondW, pondH, t);
          }
        }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    loopFnRef.current = renderLoop;
    rafRef.current = requestAnimationFrame(renderLoop);

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [plantCanvasRef, timeRef, visRef]);

  const resume = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => loopFnRef.current());
  }, []);

  return { resume };
}

// ============================================================================
// 6. SVG ENTITY GRAPHICS: DUCK (CREAM + MALLARD) & FISH (LAYER 2)
// ============================================================================

function PaddlingFootSVG() {
  const [footSide, setFootSide] = useState(() => (Math.random() > 0.5 ? 1 : 0));
  useEffect(() => {
    const id = setInterval(() => setFootSide((prev) => (prev === 0 ? 1 : 0)), 250);
    return () => clearInterval(id);
  }, []);
  const x = footSide === 0 ? 21.5 : 26;
  return (
    <g opacity="0.35">
      <line x1={x + 0.5} y1="33" x2={x + 0.5} y2="36" stroke="#E8A030" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <g transform={`translate(${x}, 35.5)`}>
        <path d="M-0.8 0 L-1.5 2 L-0.3 1.5 L0.5 2.5 L1.3 1.5 L2.5 2 L1.8 0Z" fill="#E8A030" />
        <path
          d="M-0.8 0 L-1.5 2 L-0.3 1.5 L0.5 2.5 L1.3 1.5 L2.5 2 L1.8 0Z"
          fill="none"
          stroke="#C07820"
          strokeWidth="0.2"
          opacity="0.5"
        />
      </g>
    </g>
  );
}

const DuckSVG = memo(function DuckSVG({
  paddling = false,
  mallard = false,
}: {
  paddling?: boolean;
  mallard?: boolean;
}) {
  const wingFill = mallard ? '#7A7268' : '#E8E2D8';
  const wingShadow = mallard ? '#5A5248' : '#C4BAA8';
  const wingStroke1 = mallard ? '#6A6258' : '#CCC4B4';
  const wingStroke2 = mallard ? '#7A7268' : '#D4CCC0';
  const wingEdge = mallard ? '#5A5248' : '#B8B0A0';
  const beakStroke = mallard ? '#806818' : '#B07020';

  return (
    <g>
      <defs>
        <filter id="duck-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
        <radialGradient id="body-grad" cx="0.48" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="#FAF7F2" />
          <stop offset="60%" stopColor="#F0EBE3" />
          <stop offset="100%" stopColor="#DDD6CA" />
        </radialGradient>
        <radialGradient id="mallard-body-grad" cx="0.48" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="#A8A098" />
          <stop offset="60%" stopColor="#8E8680" />
          <stop offset="100%" stopColor="#726B64" />
        </radialGradient>
        <radialGradient id="head-grad" cx="0.46" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="white" />
          <stop offset="50%" stopColor="#F5F1EB" />
          <stop offset="100%" stopColor="#E4DED4" />
        </radialGradient>
        <radialGradient id="mallard-head-grad" cx="0.46" cy="0.38" r="0.55">
          <stop offset="0%" stopColor="#2D6B4A" />
          <stop offset="50%" stopColor="#1B5E3A" />
          <stop offset="100%" stopColor="#0F4028" />
        </radialGradient>
        <linearGradient id="beak-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#F0B848" />
          <stop offset="100%" stopColor="#D89028" />
        </linearGradient>
        <linearGradient id="mallard-beak-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#C8A830" />
          <stop offset="100%" stopColor="#A08020" />
        </linearGradient>
      </defs>

      {/* Subtle water rings & drop shadow */}
      <ellipse cx="24" cy="27" rx="10" ry="7.5" fill="none" stroke="#1a4a65" strokeWidth="0.4" opacity="0.06" />
      <ellipse cx="24" cy="27" rx="11.5" ry="8.5" fill="none" stroke="#1a4a65" strokeWidth="0.25" opacity="0.04" />
      <ellipse cx="24.5" cy="28" rx="7.5" ry="6" fill="#1a4a65" opacity="0.08" filter="url(#duck-shadow)" />

      {/* Alternating paddling webbed foot */}
      {paddling && <PaddlingFootSVG />}

      {/* Tail */}
      <g>
        <path d="M22 34 Q24 38, 26 34" fill={mallard ? '#6A6258' : '#E0D8CC'} />
        <path d="M23 34 Q24 36.5, 25 34" fill={mallard ? '#7A7268' : '#E8E2D8'} />
      </g>

      {/* Body */}
      <g>
        <ellipse cx="24" cy="26" rx="7" ry="8.5" fill={mallard ? 'url(#mallard-body-grad)' : 'url(#body-grad)'} />
        <path d="M17.5 28 Q20 34, 24 35 Q28 34, 30.5 28" fill={mallard ? '#5A5450' : '#C8C0B0'} opacity="0.35" />
        <path d="M17.2 22 Q16.8 27, 17.8 32" fill="none" stroke={mallard ? '#605850' : '#C4BAA8'} strokeWidth="2" opacity="0.12" />
        <path d="M30.8 22 Q31.2 27, 30.2 32" fill="none" stroke={mallard ? '#605850' : '#C4BAA8'} strokeWidth="2" opacity="0.12" />
        <ellipse cx="23" cy="23" rx="2.5" ry="3" fill="white" opacity={mallard ? 0.12 : 0.2} />
        <path d="M30 22 Q31 26, 30 30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08" />
        <ellipse cx="24" cy="26" rx="7" ry="8.5" fill="none" stroke={mallard ? '#6A6258' : '#B8B0A0'} strokeWidth="0.35" opacity="0.18" />
      </g>

      {/* Folded Wings */}
      <g>
        <path d="M17.5 22 Q16 26.5, 17.5 32 Q19.5 27.5, 17.5 22Z" fill={wingShadow} opacity="0.15" />
        <path d="M17 21 Q15.5 26.5, 17 32.5 Q19.5 27, 17 21Z" fill={wingFill} />
        <path d="M17.2 21.5 Q19 21, 19.2 22" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />
        <path d="M17.8 23 Q17 26.5, 17.8 30" fill="none" stroke={wingStroke1} strokeWidth="0.4" opacity="0.3" />
        <path d="M18.3 24 Q17.5 27, 18.3 29" fill="none" stroke={wingStroke2} strokeWidth="0.3" opacity="0.22" />
        <path d="M17 21 Q15.5 26.5, 17 32.5" fill="none" stroke={wingEdge} strokeWidth="0.35" opacity="0.25" />

        <path d="M30.5 22 Q32 26.5, 30.5 32 Q28.5 27.5, 30.5 22Z" fill={wingShadow} opacity="0.15" />
        <path d="M31 21 Q32.5 26.5, 31 32.5 Q28.5 27, 31 21Z" fill={wingFill} />
        <path d="M30.8 21.5 Q29 21, 28.8 22" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />
        <path d="M30.2 23 Q31 26.5, 30.2 30" fill="none" stroke={wingStroke1} strokeWidth="0.4" opacity="0.3" />
        <path d="M29.7 24 Q30.5 27, 29.7 29" fill="none" stroke={wingStroke2} strokeWidth="0.3" opacity="0.22" />
        <path d="M31 21 Q32.5 26.5, 31 32.5" fill="none" stroke={wingEdge} strokeWidth="0.35" opacity="0.25" />
      </g>

      {/* Neck & Head */}
      <g>
        <ellipse cx="24" cy="19.5" rx="3" ry="1.2" fill={mallard ? '#0F4028' : '#C4BAA8'} opacity="0.2" />
        <ellipse cx="24" cy="18.5" rx="2.3" ry="1.5" fill={mallard ? '#E8E4DC' : '#EDE8E0'} />
        <ellipse cx="24" cy="17.5" rx="2.8" ry="0.8" fill={mallard ? '#0A3020' : '#C8C0B2'} opacity="0.15" />
        <circle cx="24" cy="15.2" r="3.2" fill={mallard ? 'url(#mallard-head-grad)' : 'url(#head-grad)'} />
        <circle cx="23" cy="14" r="1.2" fill={mallard ? '#4AE88A' : 'white'} opacity={mallard ? 0.2 : 0.25} />
        <path d="M21 13.5 Q20.7 15.2, 21.3 16.5" fill="none" stroke={mallard ? '#0A3020' : '#C8C0B2'} strokeWidth="0.8" opacity="0.2" />
        <path d="M27 13.5 Q27.3 15.2, 26.7 16.5" fill="none" stroke={mallard ? '#0A3020' : '#C8C0B2'} strokeWidth="0.8" opacity="0.2" />
        <circle cx="24" cy="15.2" r="3.2" fill="none" stroke={mallard ? '#0A3020' : '#B8B0A2'} strokeWidth="0.3" opacity="0.2" />
        <circle cx="21.3" cy="15" r="0.6" fill="#1a1a1a" />
        <circle cx="26.7" cy="15" r="0.6" fill="#1a1a1a" />
        <circle cx="21.5" cy="14.8" r="0.2" fill="white" opacity="0.6" />
        <circle cx="26.9" cy="14.8" r="0.2" fill="white" opacity="0.6" />
      </g>

      {/* Beak */}
      <g>
        <path d="M21 13.2 Q24 14, 27 13.2" fill={mallard ? '#0A3020' : '#C4BAA8'} opacity="0.15" />
        <path
          d="M20.8 13.5 Q20.2 11.5, 21.5 10 Q24 8.5, 26.5 10 Q27.8 11.5, 27.2 13.5"
          fill={mallard ? 'url(#mallard-beak-grad)' : 'url(#beak-grad)'}
        />
        <path d="M22.5 10.5 Q24 9.5, 25.5 10.5" fill="white" opacity="0.15" />
        <path
          d="M20.8 13.5 Q20.2 11.5, 21.5 10 Q24 8.5, 26.5 10 Q27.8 11.5, 27.2 13.5"
          fill="none"
          stroke={beakStroke}
          strokeWidth="0.35"
          opacity="0.35"
        />
        <ellipse cx="23" cy="11" rx="0.4" ry="0.2" fill={beakStroke} opacity="0.3" />
        <ellipse cx="25" cy="11" rx="0.4" ry="0.2" fill={beakStroke} opacity="0.3" />
        <path d="M23 9.8 Q24 8.9, 25 9.8" fill={beakStroke} opacity="0.25" />
      </g>

      <ellipse cx="22" cy="22" rx="4" ry="5" fill="white" opacity="0.06" />
    </g>
  );
});

const FishSVG = memo(function FishSVG({ burst = false }: { burst?: boolean }) {
  return (
    <g>
      <defs>
        <radialGradient id="fish-body-grad" cx="0.45" cy="0.4" r="0.55">
          <stop offset="0%" stopColor="#F4A460" />
          <stop offset="60%" stopColor="#E8913A" />
          <stop offset="100%" stopColor="#D07828" />
        </radialGradient>
        <filter id="fish-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>
      <ellipse cx="24" cy="24" rx="3.5" ry="5" fill="#1a4a65" opacity="0.06" filter="url(#fish-shadow)" />
      <ellipse cx="24" cy="24" rx="4.5" ry="6.5" fill="none" stroke="#1a4a65" strokeWidth="0.3" opacity="0.05" />
      <path d={burst ? 'M24 31 L19 36 L29 36 Z' : 'M24 31 L21 35 L27 35 Z'} fill="#D07828" opacity="0.85" />
      <ellipse cx="24" cy="24" rx="4" ry="8" fill="url(#fish-body-grad)" />
      <ellipse cx="23.5" cy="23" rx="1.8" ry="4" fill="white" opacity="0.2" />
      <path d="M24 18 Q21 24, 24 30" fill="none" stroke="#C06820" strokeWidth="0.6" opacity="0.3" />
      <circle cx="22.5" cy="19" r="1.2" fill="#2A2520" />
      <circle cx="22.2" cy="18.7" r="0.4" fill="white" opacity="0.7" />
      <ellipse cx="24" cy="24" rx="4" ry="8" fill="none" stroke="#B06818" strokeWidth="0.3" opacity="0.2" />
      <ellipse cx="23" cy="22" rx="1" ry="2" fill="white" opacity="0.1" />
    </g>
  );
});

const RING_PALETTES = {
  pink: {
    ring: '#C49AAB',
    ringLight: '#D4B4C0',
    ringDark: '#A8808E',
    skin: '#D8C4A0',
    hair: '#4A3A30',
    swimsuit: '#A85868',
  },
  yellow: {
    ring: '#C4B470',
    ringLight: '#D0C490',
    ringDark: '#A89850',
    skin: '#D4BC98',
    hair: '#302418',
    swimsuit: '#988040',
  },
  green: {
    ring: '#7AAA8A',
    ringLight: '#94BCA0',
    ringDark: '#5C8E70',
    skin: '#D8C4A0',
    hair: '#5A3428',
    swimsuit: '#4A7858',
  },
  blue: {
    ring: '#7AA0B0',
    ringLight: '#90B4C0',
    ringDark: '#5C8498',
    skin: '#D4BC98',
    hair: '#1A1A28',
    swimsuit: '#486878',
  },
} as const;

type RingColor = keyof typeof RING_PALETTES;
const RING_COLOR_KEYS: RingColor[] = ['pink', 'yellow', 'green', 'blue'];

function PersonRingSVG({ color }: { color: RingColor }) {
  const c = RING_PALETTES[color];
  return (
    <g>
      <circle cx="24" cy="24" r="21" fill={c.ring} />
      <path d="M24 3 A21 21 0 0 1 45 24" fill="none" stroke={c.ringLight} strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <path d="M24 45 A21 21 0 0 1 3 24" fill="none" stroke={c.ringLight} strokeWidth="6" strokeLinecap="round" opacity="0.25" />
      <circle cx="24" cy="24" r="21" fill="none" stroke={c.ringDark} strokeWidth="0.8" opacity="0.5" />
      <circle cx="24" cy="24" r="12" fill="none" stroke={c.ringDark} strokeWidth="0.6" opacity="0.4" />
      <path d="M11 16 Q16 8, 24 6 Q32 8, 37 16" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.18" />
      <circle cx="24" cy="24" r="12" fill="#1e4d6b" opacity="0.15" />
      <path d="M22 28 Q21 32, 20 35" stroke={c.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.25" />
      <path d="M26 28 Q27 32, 28 35" stroke={c.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.25" />
      <ellipse cx="24" cy="25" rx="5.5" ry="6" fill={c.swimsuit} />
      <path d="M18.5 23 Q14 20, 9 22" stroke={c.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M29.5 23 Q34 20, 39 22" stroke={c.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="8.5" cy="22.5" r="1.5" fill={c.skin} />
      <circle cx="39.5" cy="22.5" r="1.5" fill={c.skin} />
      <circle cx="24" cy="18" r="5.5" fill={c.skin} />
      <ellipse cx="24" cy="16.5" rx="6" ry="4.5" fill={c.hair} />
      <path d="M20 14.5 Q24 12, 28 14.5" fill="none" stroke={c.hair} strokeWidth="1.5" opacity="0.3" />
      <path d="M7 30 Q12 38, 24 41 Q36 38, 41 30" fill={c.ring} stroke={c.ringDark} strokeWidth="0.6" opacity="0.45" />
      <path d="M13 33 Q18 38, 24 39 Q30 38, 35 33" fill="none" stroke={c.ringLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </g>
  );
}

interface FloatVariant {
  kind: 'duck' | 'fish' | 'person';
  color: RingColor;
  mallard?: boolean;
}

const FloatEntitySVG = memo(function FloatEntitySVG({
  variant,
  size = 48,
  paddling = false,
  eating = false,
  burst = false,
}: {
  variant: FloatVariant;
  size?: number;
  paddling?: boolean;
  eating?: boolean;
  burst?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={eating ? { overflow: 'visible' } : undefined}
    >
      {variant.kind === 'person' ? (
        <PersonRingSVG color={variant.color} />
      ) : variant.kind === 'fish' ? (
        <FishSVG burst={burst} />
      ) : (
        <DuckSVG paddling={paddling} mallard={variant.mallard} />
      )}
    </svg>
  );
});

// ============================================================================
// 7. CPU-SIDE MIRROR OF GLSL WAVE HEIGHT & SLOPE + BOIDS SIMULATION
// ============================================================================

function cpuHash(x: number, y: number): number {
  const t = 43758.5453123 * Math.sin(127.1 * x + 311.7 * y);
  return t - Math.floor(t);
}

function cpuSeaOctave(u: number, v: number, choppy: number): number {
  const ix = Math.floor(u);
  const iy = Math.floor(v);
  const fx = u - ix;
  const fy = v - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = cpuHash(ix, iy);
  const b = cpuHash(ix + 1, iy);
  const c = cpuHash(ix, iy + 1);
  const d = cpuHash(ix + 1, iy + 1);
  const n = -1 + 2 * ((a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy);

  const u2 = u + n;
  const v2 = v + n;
  let wvx = 1 - Math.abs(Math.sin(u2));
  let wvy = 1 - Math.abs(Math.sin(v2));
  const swvx = Math.abs(Math.cos(u2));
  const swvy = Math.abs(Math.cos(v2));
  wvx += (swvx - wvx) * wvx;
  wvy += (swvy - wvy) * wvy;
  return Math.pow(1 - Math.pow(wvx * wvy, 0.65), choppy);
}

function cpuGetWaveHeight(u: number, v: number, time: number, octaves = 2): number {
  const seaTime = 0.8 * time;
  let freq = 0.16;
  let amp = 0.6;
  let choppy = 4.0;
  let h = 0;
  let cu = u;
  let cv = v;

  for (let i = 0; i < octaves; i++) {
    let d = cpuSeaOctave((cu + seaTime) * freq, (cv + seaTime) * freq, choppy);
    d += cpuSeaOctave((cu - seaTime) * freq, (cv - seaTime) * freq, choppy);
    h += d * amp;
    const nu = 1.6 * cu + 1.2 * cv;
    const nv = -1.2 * cu + 1.6 * cv;
    cu = nu;
    cv = nv;
    freq *= 1.9;
    amp *= 0.22;
    choppy += (1 - choppy) * 0.2;
  }
  return h;
}

function sampleWaveSurface(u: number, v: number, time: number) {
  const h = cpuGetWaveHeight(u, v, time, 2);
  return {
    height: h,
    slopeX: (cpuGetWaveHeight(u + 0.05, v, time, 2) - h) / 0.05,
    slopeY: (cpuGetWaveHeight(u, v + 0.05, time, 2) - h) / 0.05,
  };
}

function lerpAngleDeg(from: number, to: number, t: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return from + diff * t;
}

interface FloatEntity {
  id: number;
  variant: FloatVariant;
  nx: number;
  ny: number;
  offsetY: number;
  rotation: number;
  spawnTime: number;
  scale: number;
  phase: number;
  heading: number;
  actionEnd: number;
  action: 'float' | 'paddle' | 'leaving' | 'drowning';
  paddleIntensity: number;
  turnRate: number;
  speed: number;
  lastRipple: number;
  drowning: boolean;
  opacity: number;
  speedBoost: number;
  waveVx: number;
  waveVy: number;
}

interface FoodTarget {
  id: number;
  nx: number;
  ny: number;
  startTime: number;
  arrivedTime: number | null;
}

interface FoodPelletVisual {
  foodId: number;
  pellets: {
    x: number;
    y: number;
    size: number;
    hue: number;
    blur: number;
  }[];
}

let nextEntityId = 0;

// ============================================================================
// 8. FEED MODE TOGGLE BUTTON (BLURRED GOLDEN PELLET CLUSTER)
// ============================================================================

const PELLET_ICON_DOTS = [
  { x: 22, y: 20, s: 8, h: 34 },
  { x: 15, y: 16, s: 7, h: 30 },
  { x: 29, y: 17, s: 7.5, h: 38 },
  { x: 18, y: 26, s: 6.5, h: 32 },
  { x: 27, y: 25, s: 7, h: 36 },
  { x: 24, y: 12, s: 5.5, h: 29 },
  { x: 11, y: 21, s: 5, h: 31 },
  { x: 35, y: 23, s: 5.5, h: 33 },
  { x: 13, y: 28, s: 4.5, h: 28 },
  { x: 32, y: 29, s: 5, h: 35 },
  { x: 9, y: 14, s: 4, h: 30 },
  { x: 37, y: 15, s: 4.2, h: 32 },
];

function FeedModeButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        sfx.toggle(!active);
        onClick();
      }}
      aria-label={active ? 'Exit feed mode' : 'Feed the ducks'}
      title={active ? 'Exit feed mode' : 'Feed the ducks'}
      className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      style={{ width: 46, height: 46 }}
    >
      {active ? (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" y1="4" x2="16" y2="16" stroke="rgba(42,37,32,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="4" x2="4" y2="16" stroke="rgba(42,37,32,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <div className="relative" style={{ width: 46, height: 46, filter: 'blur(0.4px)' }}>
          {PELLET_ICON_DOTS.map((dot, idx) => (
            <div
              key={idx}
              className="absolute rounded-full"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.s,
                height: dot.s,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, hsla(${dot.h}, 45%, 60%, 0.5) 0%, hsla(${dot.h}, 40%, 45%, 0.3) 50%, hsla(${dot.h}, 35%, 35%, 0.1) 100%)`,
                filter: `blur(${0.6 + (idx % 3) * 0.3}px)`,
                boxShadow: `0 0 ${1.5 * dot.s}px hsla(${dot.h}, 35%, 50%, 0.15)`,
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}

// ============================================================================
// 9. MAIN DUCK POND COMPONENT (ALL 5 ARCHITECTURAL LAYERS)
// ============================================================================

export function DuckPond() {
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paperCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const plantCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visRef = useRef<boolean>(true);

  const { timeRef, triggerRippleAt, resume: resumeWaveGL } = useWaveGL(
    waveCanvasRef,
    paperCanvasRef,
    visRef
  );
  const { resume: resumePlants } = usePlantCanvas(plantCanvasRef, timeRef, visRef);

  // Speech bubble state
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [speakerIndex, setSpeakerIndex] = useState<number>(0);
  const lastLineRef = useRef<string | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);

  const triggerDuckSpeech = useCallback((idx: number) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    const line = pickRandomLine(DUCK_LINES, lastLineRef.current);
    lastLineRef.current = line;
    setBubbleText(line);
    setSpeakerIndex(idx);
    bubbleTimerRef.current = window.setTimeout(() => setBubbleText(null), 4000 + Math.random() * 1500);
  }, []);

  const triggerFishSpeech = useCallback((idx: number) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setBubbleText(pickRandomLine(FISH_LINES));
    setSpeakerIndex(idx);
    bubbleTimerRef.current = window.setTimeout(() => setBubbleText(null), 3500 + Math.random() * 1500);
  }, []);

  // Aspect ratio tracking
  const aspectRef = useRef<number>(1.5);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateAspect = () => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        aspectRef.current = el.offsetWidth / el.offsetHeight;
      }
    };
    updateAspect();
    const ro = new ResizeObserver(updateAspect);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Simulation refs
  const floatsRef = useRef<FloatEntity[]>([]);
  const foodsRef = useRef<FoodTarget[]>([]);
  const nextBoostTimeRef = useRef<number>(0);
  const whirlpoolRef = useRef<{ start: number; end: number; cx: number; cy: number } | null>(null);
  const nextWhirlpoolRef = useRef<number>(12 + Math.random() * 4);
  const foodIdCounterRef = useRef<number>(0);
  const dropCountRef = useRef<number>(0);
  const fishToHunterMapRef = useRef<Map<number, number>>(new Map());

  const addDuck = useCallback((nx: number, ny: number, now: number) => {
    const active = floatsRef.current.filter((f) => f.action !== 'drowning' && f.action !== 'leaving');
    if (active.length >= 15) {
      const oldest = active[0];
      oldest.action = 'leaving';
      const dLeft = oldest.nx;
      const dRight = 1 - oldest.nx;
      const dTop = oldest.ny;
      const dBottom = 1 - oldest.ny;
      const minD = Math.min(dLeft, dRight, dTop, dBottom);
      if (minD === dLeft) oldest.heading = Math.PI;
      else if (minD === dRight) oldest.heading = 0;
      else if (minD === dTop) oldest.heading = -Math.PI / 2;
      else oldest.heading = Math.PI / 2;
      oldest.heading += (Math.random() - 0.5) * 0.3;
      oldest.speed = 1.2;
      oldest.speedBoost = 1.5;
      oldest.actionEnd = now + 4;
    }

    const heading = Math.random() * Math.PI * 2;
    const turnRate = (Math.random() - 0.5) * 0.6;
    floatsRef.current.push({
      id: nextEntityId++,
      variant: {
        kind: 'duck',
        color: RING_COLOR_KEYS[Math.floor(Math.random() * RING_COLOR_KEYS.length)],
        mallard: Math.random() < 0.06,
      },
      nx,
      ny,
      offsetY: 0,
      rotation: (180 / Math.PI) * heading,
      spawnTime: now,
      scale: 0,
      phase: Math.random() * 100,
      heading,
      actionEnd: now + 1 + Math.random() * 2,
      action: 'float',
      paddleIntensity: 0,
      turnRate,
      speed: 0,
      lastRipple: 0,
      drowning: false,
      opacity: 1,
      speedBoost: 1,
      waveVx: 0,
      waveVy: 0,
    });
  }, []);

  const addFish = useCallback((nx: number, ny: number, now: number) => {
    const heading = Math.random() * Math.PI * 2;
    floatsRef.current.push({
      id: nextEntityId++,
      variant: { kind: 'fish', color: 'yellow' },
      nx,
      ny,
      offsetY: 0,
      rotation: (180 / Math.PI) * heading,
      spawnTime: now,
      scale: 0,
      phase: Math.random() * 100,
      heading,
      actionEnd: now + 1 + Math.random() * 2,
      action: 'paddle',
      paddleIntensity: 0,
      turnRate: 0,
      speed: 0,
      lastRipple: 0,
      drowning: false,
      opacity: 1,
      speedBoost: 1,
      waveVx: 0,
      waveVy: 0,
    });
  }, []);

  const dropFood = useCallback(
    (nx: number, ny: number, now: number) => {
      dropCountRef.current++;
      if (dropCountRef.current % 4 === 0) {
        addFish(nx, ny, now);
        triggerRippleAt(nx, ny, 0.5);
        return { id: -1, spawnedFish: true };
      }
      const id = foodIdCounterRef.current++;
      foodsRef.current.push({ id, nx, ny, startTime: now, arrivedTime: null });
      return { id, spawnedFish: false };
    },
    [addFish, triggerRippleAt]
  );

  // Physics & Boids update step
  const updateSimulation = useCallback(
    (now: number, dt: number) => {
      const ducks: FloatEntity[] = [];
      const fishes: FloatEntity[] = [];
      for (const ent of floatsRef.current) {
        if (ent.variant.kind === 'duck') ducks.push(ent);
        else if (ent.variant.kind === 'fish') fishes.push(ent);
      }

      // Random speed boost on paddling ducks
      if (now >= nextBoostTimeRef.current && ducks.length > 0) {
        const paddlingDucks = ducks.filter((d) => d.action === 'paddle');
        if (paddlingDucks.length > 0) {
          const chosen = paddlingDucks[Math.floor(Math.random() * paddlingDucks.length)];
          chosen.speedBoost = Math.random() < 0.2 ? 3.2 : 1.6;
        }
        nextBoostTimeRef.current = now + 1.5 + Math.random();
      }

      // Periodic whirlpool / social circle behavior
      if (whirlpoolRef.current && now > whirlpoolRef.current.end) {
        whirlpoolRef.current = null;
        nextWhirlpoolRef.current = now + 10 + Math.random() * 6;
      }
      if (!whirlpoolRef.current && now >= nextWhirlpoolRef.current && ducks.length >= 3) {
        const centerDucks = ducks.filter(
          (d) => d.action !== 'drowning' && Math.abs(d.nx - 0.5) < 0.25 && Math.abs(d.ny - 0.5) < 0.25
        );
        if (centerDucks.length >= 2) {
          whirlpoolRef.current = {
            start: now,
            end: now + 4,
            cx: centerDucks.reduce((acc, d) => acc + d.nx, 0) / centerDucks.length,
            cy: centerDucks.reduce((acc, d) => acc + d.ny, 0) / centerDucks.length,
          };
          for (const d of centerDucks) {
            if (d.action === 'float') {
              d.action = 'paddle';
              d.actionEnd = now + 5;
            }
          }
        }
      }

      // Expire eaten food pellets
      foodsRef.current = foodsRef.current.filter(
        (f) => f.arrivedTime === null || now - f.arrivedTime < 2.5
      );

      // Assign 1-to-1 duck hunters to active fish
      const hunterMap = fishToHunterMapRef.current;
      const activeFishIds = new Set(
        fishes
          .filter((f) => f.action !== 'drowning' && f.action !== 'leaving' && f.opacity !== -1)
          .map((f) => f.id)
      );
      for (const fid of hunterMap.keys()) {
        if (!activeFishIds.has(fid)) hunterMap.delete(fid);
      }
      const assignedDuckIds = new Set(hunterMap.values());
      for (const fid of activeFishIds) {
        if (
          hunterMap.has(fid) &&
          ducks.some((d) => d.id === hunterMap.get(fid) && d.action !== 'drowning' && d.action !== 'leaving')
        ) {
          continue;
        }
        const fishObj = fishes.find((f) => f.id === fid);
        if (!fishObj) continue;
        let bestDist = Infinity;
        let bestDuckId = -1;
        for (const d of ducks) {
          if (d.action === 'drowning' || d.action === 'leaving' || assignedDuckIds.has(d.id)) continue;
          const dx = fishObj.nx - d.nx;
          const dy = fishObj.ny - d.ny;
          const distSq = dx * dx + dy * dy;
          if (distSq < bestDist) {
            bestDist = distSq;
            bestDuckId = d.id;
          }
        }
        if (bestDuckId >= 0) {
          hunterMap.set(fid, bestDuckId);
          assignedDuckIds.add(bestDuckId);
        }
      }

      const smoothFactor = 1 - Math.pow(0.01, dt);
      let needsCleanup = false;

      for (const ent of floatsRef.current) {
        // Pop-in spawn scale animation
        if (ent.action !== 'drowning' && ent.action !== 'leaving') {
          const age = now - ent.spawnTime;
          if (age < 0.35) {
            const p = age / 0.35;
            ent.scale = p < 0.6 ? (p / 0.6) * 1.15 : 1.15 - ((p - 0.6) / 0.4) * 0.15;
          } else {
            ent.scale = 1;
          }
        }

        // Sample wave height and slope at entity's UV coordinates
        const aspect = aspectRef.current;
        const uvX = aspect >= 1 ? ent.nx * aspect * 30 : 30 * ent.nx;
        const uvY = aspect >= 1 ? 30 * ent.ny : (ent.ny / aspect) * 30;
        const { height, slopeX, slopeY } = sampleWaveSurface(uvX, uvY, now);

        ent.offsetY += (0.8 * height - ent.offsetY) * smoothFactor;
        const targetWaveVx = -0.006 * slopeX;
        const targetWaveVy = -0.006 * slopeY;
        const waveLerp = Math.min(1, 3 * dt);
        ent.waveVx += (targetWaveVx - ent.waveVx) * waveLerp;
        ent.waveVy += (targetWaveVy - ent.waveVy) * waveLerp;

        // Fish evasion & darting behavior
        if (ent.variant.kind === 'fish' && ent.action !== 'drowning' && ent.action !== 'leaving') {
          let fleeDx = 0;
          let fleeDy = 0;
          let nearestDuckSq = Infinity;
          for (const d of ducks) {
            if (d.action === 'drowning' || d.action === 'leaving') continue;
            const dx = ent.nx - d.nx;
            const dy = ent.ny - d.ny;
            const dSq = dx * dx + dy * dy;
            if (dSq < nearestDuckSq) {
              nearestDuckSq = dSq;
              fleeDx = dx;
              fleeDy = dy;
            }
          }
          const isBursting = ((now + ent.phase) % 1.3) / 1.3 < 0.62;
          const toCenterX = 0.5 - ent.nx;
          const toCenterY = 0.5 - ent.ny;
          const distCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
          const angleCenter = Math.atan2(toCenterY, toCenterX);

          if (nearestDuckSq < 0.0625) {
            const fleeAngle = Math.atan2(fleeDy, fleeDx);
            const blended =
              fleeAngle +
              Math.atan2(Math.sin(angleCenter - fleeAngle), Math.cos(angleCenter - fleeAngle)) *
                Math.min(1, 4 * distCenter) *
                0.5;
            const wiggle = 0.2 * Math.sin(3 * now + ent.phase);
            ent.heading += (blended + wiggle - ent.heading) * Math.min(1, dt * (isBursting ? 12 : 4));
            ent.action = 'paddle';
          } else {
            ent.heading +=
              (angleCenter + 0.5 * Math.sin(2 * now + ent.phase) - ent.heading) *
              Math.min(1, dt * (distCenter > 0.15 ? 6 : 2));
          }

          ent.speed += ((isBursting ? 1.8 : 0.3) - ent.speed) * Math.min(1, dt * (isBursting ? 8 : 3));
          const vx = 0.06 * Math.cos(ent.heading) * ent.speed;
          const vy = 0.06 * Math.sin(ent.heading) * ent.speed;
          ent.nx += (ent.waveVx + vx) * dt;
          ent.ny += (ent.waveVy + vy) * dt;
          ent.nx = Math.max(0.12, Math.min(0.88, ent.nx));
          ent.ny = Math.max(0.12, Math.min(0.88, ent.ny));

          if (Math.sqrt(vx * vx + vy * vy) > 0.0003) {
            const targetRot = (180 / Math.PI) * Math.atan2(vx, -vy);
            ent.rotation = lerpAngleDeg(ent.rotation, targetRot, smoothFactor * (isBursting ? 0.85 : 0.3));
          }
          ent.paddleIntensity = isBursting ? 1 : 0.2;
          if (isBursting && ent.speed > 0.5 && now - ent.lastRipple > 0.2) {
            const rx = ent.nx - 0.015 * Math.cos(ent.heading);
            const ry = ent.ny - 0.015 * Math.sin(ent.heading);
            if (rx > 0.02 && rx < 0.98 && ry > 0.02 && ry < 0.98) {
              triggerRippleAt(rx, ry, 0.35);
              ent.lastRipple = now;
            }
          }
          continue;
        }

        // Duck boids & state machine
        if (ent.variant.kind === 'duck' && ent.action !== 'drowning' && ent.action !== 'leaving') {
          let sepX = 0;
          let sepY = 0;
          let cohX = 0;
          let cohY = 0;
          let sinSum = 0;
          let cosSum = 0;
          let neighbors = 0;

          for (const other of ducks) {
            if (other.id === ent.id) continue;
            const dx = other.nx - ent.nx;
            const dy = other.ny - ent.ny;
            const dSq = dx * dx + dy * dy;
            if (dSq <= 0.04 && dSq >= 1e-6) {
              neighbors++;
              cohX += other.nx;
              cohY += other.ny;
              sinSum += Math.sin(other.heading);
              cosSum += Math.cos(other.heading);
              if (dSq < 0.0036) {
                const dist = Math.sqrt(dSq);
                const push = (0.06 - dist) / 0.06;
                sepX -= (dx / dist) * push;
                sepY -= (dy / dist) * push;
              }
            }
          }

          const hasFlock = neighbors > 0;
          const boidFx = hasFlock ? 0.03 * sepX + 0.008 * (cohX / neighbors - ent.nx) : 0;
          const boidFy = hasFlock ? 0.03 * sepY + 0.008 * (cohY / neighbors - ent.ny) : 0;
          const alignHeading = hasFlock ? Math.atan2(sinSum / neighbors, cosSum / neighbors) : null;

          // Check if hunting a fish
          let targetFish: FloatEntity | undefined;
          if (fishes.length > 0) {
            for (const [fid, did] of hunterMap.entries()) {
              if (did === ent.id) {
                targetFish = fishes.find((f) => f.id === fid);
                break;
              }
            }
          }

          // Or seeking nearest food pellet
          let nearestFood: FoodTarget | null = null;
          if (!targetFish && foodsRef.current.length > 0) {
            let bestDist = Infinity;
            for (const fd of foodsRef.current) {
              const dx = fd.nx - ent.nx;
              const dy = fd.ny - ent.ny;
              const dSq = dx * dx + dy * dy;
              if (dSq < bestDist) {
                bestDist = dSq;
                nearestFood = fd;
              }
            }
          }

          if (nearestFood) {
            const dx = nearestFood.nx - ent.nx;
            const dy = nearestFood.ny - ent.ny;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.045) {
              if (ent.action === 'paddle') {
                ent.action = 'float';
                ent.actionEnd = now + 10;
                ent.speed *= 0.3;
              }
              if (nearestFood.arrivedTime === null) {
                nearestFood.arrivedTime = now;
                sfx.nibble(ent.nx);
              }
            } else {
              ent.heading = Math.atan2(dy, dx) + 0.12 * Math.sin(ent.phase + 2 * now);
              ent.action = 'paddle';
              ent.actionEnd = now + 2;
              const factor = Math.min(1, dist / 0.3);
              ent.speed += (0.6 + 0.4 * factor - ent.speed) * 0.1;
            }
          } else if (targetFish && targetFish.opacity !== -1) {
            const dx = targetFish.nx - ent.nx;
            const dy = targetFish.ny - ent.ny;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.035) {
              targetFish.opacity = -1;
              triggerRippleAt(targetFish.nx, targetFish.ny, 0.5);
              sfx.chomp(targetFish.nx);
              needsCleanup = true;
            } else {
              ent.heading = Math.atan2(dy, dx) + 0.08 * Math.sin(ent.phase + 2 * now);
              ent.action = 'paddle';
              ent.actionEnd = now + 1;
              ent.speed += (1 + 0.3 * Math.min(1, dist / 0.2) - ent.speed) * 0.15;
            }
          } else {
            // Wander / state transitions
            if (now > ent.actionEnd) {
              if (ent.action === 'float') {
                ent.action = 'paddle';
                ent.turnRate = hasFlock ? (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 0.5;
                const cx = 0.5 - ent.nx;
                const cy = 0.5 - ent.ny;
                if (Math.sqrt(cx * cx + cy * cy) > 0.25) {
                  ent.heading = Math.atan2(cy, cx) + (Math.random() - 0.5) * 0.8;
                } else if (hasFlock && alignHeading !== null && Math.random() < 0.6) {
                  ent.heading = alignHeading + (Math.random() - 0.5) * 0.4;
                } else {
                  ent.heading += (Math.random() - 0.5) * Math.PI * 0.7;
                }
                ent.actionEnd = hasFlock ? now + 4 + Math.random() * 4 : now + 2 + Math.random() * 3;
              } else {
                ent.action = 'float';
                ent.turnRate = (Math.random() - 0.5) * 0.15;
                const longRest = !hasFlock && Math.random() < 0.3;
                ent.actionEnd = hasFlock
                  ? now + 1 + Math.random() * 2
                  : longRest
                    ? now + 6 + Math.random() * 8
                    : now + 2 + Math.random() * 4;
              }
            }

            // Contagious paddling when a neighbor swims by
            if (ent.action === 'float') {
              const neighborPaddling = ducks.some((other) => {
                if (other.id === ent.id || other.action !== 'paddle' || other.speed <= 0.3) return false;
                const dx = other.nx - ent.nx;
                const dy = other.ny - ent.ny;
                return dx * dx + dy * dy < 0.04;
              });
              if (neighborPaddling && Math.random() < 0.05) {
                ent.action = 'paddle';
                ent.turnRate = (Math.random() - 0.5) * 0.1;
                ent.heading = (alignHeading ?? 0) + (Math.random() - 0.5) * 0.2;
                ent.actionEnd = now + 3 + Math.random() * 3;
              }
            }

            // Speed & paddle intensity damping
            if (ent.action === 'paddle') {
              const baseSpd = 0.8 + 0.2 * Math.sin(ent.phase);
              ent.speed += ((hasFlock ? 1.15 * baseSpd : baseSpd) - ent.speed) * Math.min(1, 2.5 * dt);
            } else {
              ent.speed *= Math.pow(0.15, dt);
              if (ent.speed < 0.005) ent.speed = 0;
            }
            const isPaddlingNum = ent.action === 'paddle' ? 1 : 0;
            ent.paddleIntensity += (isPaddlingNum - ent.paddleIntensity) * Math.min(1, 3 * dt);
            ent.speedBoost += (1 - ent.speedBoost) * Math.min(1, 1.5 * dt);
          }

          // Steering forces (alignment + soft wall avoidance + whirlpool)
          let turn = ent.turnRate;
          if (alignHeading !== null && ent.paddleIntensity > 0.1) {
            const diff = alignHeading - ent.heading;
            turn += 1.2 * Math.atan2(Math.sin(diff), Math.cos(diff)) * ent.paddleIntensity;
          }
          let wallX = 0;
          let wallY = 0;
          if (ent.nx < 0.15) wallX = (0.15 - ent.nx) / 0.15;
          if (ent.nx > 0.85) wallX = -(ent.nx - 0.85) / 0.15;
          if (ent.ny < 0.15) wallY = (0.15 - ent.ny) / 0.15;
          if (ent.ny > 0.85) wallY = -(ent.ny - 0.85) / 0.15;
          if (wallX !== 0 || wallY !== 0) {
            const wallAngle = Math.atan2(wallY, wallX);
            turn +=
              Math.atan2(Math.sin(wallAngle - ent.heading), Math.cos(wallAngle - ent.heading)) *
              Math.sqrt(wallX * wallX + wallY * wallY) *
              2.5;
          }
          const wp = whirlpoolRef.current;
          if (wp) {
            const dx = ent.nx - wp.cx;
            const dy = ent.ny - wp.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.25) {
              const tangent = Math.atan2(dx, -dy);
              const tDiff = Math.atan2(Math.sin(tangent - ent.heading), Math.cos(tangent - ent.heading));
              const env = Math.sin(((now - wp.start) / (wp.end - wp.start)) * Math.PI);
              const prox = 1 - dist / 0.25;
              turn += tDiff * prox * env * 3;
              const inward = Math.atan2(-dy, -dx);
              turn +=
                Math.atan2(Math.sin(inward - ent.heading), Math.cos(inward - ent.heading)) *
                prox *
                env *
                0.4;
            }
          }

          ent.heading += turn * dt;

          // Integrate velocity + waddle rotation
          const baseVel = hasFlock ? 0.06 : 0.05;
          const selfVx = Math.cos(ent.heading) * baseVel * ent.speed * ent.speedBoost;
          const selfVy = Math.sin(ent.heading) * baseVel * ent.speed * ent.speedBoost;
          const waddle =
            ent.paddleIntensity > 0.1 ? 0.8 * Math.sin(5 * now + ent.phase) * ent.paddleIntensity : 0;
          const totalVx = ent.waveVx + selfVx + boidFx;
          const totalVy = ent.waveVy + selfVy + boidFy;
          ent.nx += totalVx * dt;
          ent.ny += totalVy * dt;

          const activeVx = selfVx + boidFx;
          const activeVy = selfVy + boidFy;
          const activeMag = Math.sqrt(activeVx * activeVx + activeVy * activeVy);
          if (Math.sqrt(totalVx * totalVx + totalVy * totalVy) > 0.0003) {
            const targetDeg =
              (180 / Math.PI) *
                Math.atan2(activeMag > 0.0002 ? activeVx : totalVx, -(activeMag > 0.0002 ? activeVy : totalVy)) +
              waddle;
            const rotRate = ent.speed > 0.1 ? 0.18 : 0.04;
            ent.rotation = lerpAngleDeg(ent.rotation, targetDeg, smoothFactor * rotRate);
          }

          // Wake ripples behind swimming duck
          if (ent.speed > 0.15 && now - ent.lastRipple > 0.3) {
            const rx = ent.nx - 0.02 * Math.cos(ent.heading);
            const ry = ent.ny - 0.02 * Math.sin(ent.heading);
            if (rx > 0.02 && rx < 0.98 && ry > 0.02 && ry < 0.98) {
              triggerRippleAt(rx, ry, 0.55);
              ent.lastRipple = now;
            }
          }
        } else if (ent.action === 'leaving') {
          const prog = Math.min(1, (now - (ent.actionEnd - 4)) / 4);
          const vx = 0.08 * Math.cos(ent.heading) * ent.speed * ent.speedBoost;
          const vy = 0.08 * Math.sin(ent.heading) * ent.speed * ent.speedBoost;
          ent.nx += vx * dt;
          ent.ny += vy * dt;
          const targetRot = (180 / Math.PI) * Math.atan2(vx, -vy);
          ent.rotation = lerpAngleDeg(ent.rotation, targetRot, Math.min(1, 3 * dt));
          ent.speedBoost += (1 - ent.speedBoost) * Math.min(1, 0.8 * dt);
          if (ent.speed > 0.1 && now - ent.lastRipple > 0.25) {
            triggerRippleAt(ent.nx - 0.02 * Math.cos(ent.heading), ent.ny - 0.02 * Math.sin(ent.heading), 0.4);
            ent.lastRipple = now;
          }
          if (prog > 0.5) {
            const fade = (prog - 0.5) / 0.5;
            ent.scale = Math.max(0, 1 - 0.7 * fade);
            ent.opacity = Math.max(0, 1 - fade);
          }
          if (prog >= 1 || ent.nx < -0.02 || ent.nx > 1.02 || ent.ny < -0.02 || ent.ny > 1.02) {
            ent.opacity = -1;
            needsCleanup = true;
          }
        } else if (!(ent.variant.kind === 'duck' && ent.action === 'drowning')) {
          const driftX = 0.002 * Math.cos(ent.phase + 0.1 * now);
          const driftY = 0.002 * Math.sin(ent.phase + 0.13 * now);
          const vx = ent.waveVx + driftX;
          const vy = ent.waveVy + driftY;
          ent.nx += vx * dt;
          ent.ny += vy * dt;
          if (Math.sqrt(vx * vx + vy * vy) > 0.0003) {
            const targetRot = (180 / Math.PI) * Math.atan2(vx, -vy);
            ent.rotation = lerpAngleDeg(ent.rotation, targetRot, 0.08 * smoothFactor);
          }
        }

        if (ent.action === 'drowning') {
          const prog = Math.min(1, (now - (ent.actionEnd - 2)) / 2);
          if (ent.variant.kind === 'duck') {
            ent.scale = 1;
            ent.opacity = 1;
            ent.speed = 0;
            const shake = 2 * Math.sin(20 * now + ent.phase) * Math.min(1, 3 * prog);
            ent.rotation += shake * dt * 5;
            if (prog > 0.05 && prog < 0.42 && Math.random() < 2.5 * dt) {
              const ang = Math.random() * Math.PI * 2;
              const rad = 0.015 + Math.random() * 0.015;
              triggerRippleAt(ent.nx + Math.cos(ang) * rad, ent.ny + Math.sin(ang) * rad, 0.35);
            }
            if (prog > 0.49 && prog < 0.56 && Math.random() < 8 * dt) {
              triggerRippleAt(ent.nx, ent.ny, 0.8);
              const ang = Math.random() * Math.PI * 2;
              triggerRippleAt(ent.nx + 0.025 * Math.cos(ang), ent.ny + 0.025 * Math.sin(ang), 0.4);
            }
          } else {
            const pSq = prog * prog;
            ent.scale = Math.max(0, 1 - 0.6 * pSq);
            ent.opacity = Math.max(0, 1 - pSq);
            ent.rotation += 25 * dt * prog;
            if (prog > 0.3 && Math.random() < 1.5 * dt) {
              triggerRippleAt(
                ent.nx + (Math.random() - 0.5) * 0.015,
                ent.ny + (Math.random() - 0.5) * 0.015,
                0.15
              );
            }
          }
          if (prog >= 1) {
            triggerRippleAt(ent.nx, ent.ny, 0.3);
            ent.opacity = -1;
            needsCleanup = true;
          }
        }

        // Clamp inside pond bounds
        if (ent.action !== 'leaving') {
          const hitEdge = ent.nx < 0.03 || ent.nx > 0.97 || ent.ny < 0.03 || ent.ny > 0.97;
          ent.nx = Math.max(0.03, Math.min(0.97, ent.nx));
          ent.ny = Math.max(0.03, Math.min(0.97, ent.ny));
          if (hitEdge && (ent.variant.kind === 'duck' || ent.variant.kind === 'fish')) {
            ent.heading = Math.atan2(0.5 - ent.ny, 0.5 - ent.nx) + (Math.random() - 0.5) * 0.6;
          }
        }
      }

      if (needsCleanup) {
        floatsRef.current = floatsRef.current.filter((f) => f.opacity !== -1);
      }
    },
    [triggerRippleAt]
  );

  // DOM node refs for 60fps direct style updates without React re-renders
  const entityDomMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const foodDomMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const speechDomRef = useRef<HTMLDivElement | null>(null);
  const speakerIndexRef = useRef<number>(speakerIndex);
  speakerIndexRef.current = speakerIndex;

  const [renderEntities, setRenderEntities] = useState<
    { id: number; variant: FloatVariant; paddling: boolean; burst: boolean }[]
  >([]);
  const stateHashRef = useRef<string>('');
  const [feedMode, setFeedMode] = useState<boolean>(false);
  const [foodVisuals, setFoodVisuals] = useState<FoodPelletVisual[]>([]);
  const foodVisualsRef = useRef<FoodPelletVisual[]>([]);

  useEffect(() => {
    foodVisualsRef.current = foodVisuals;
  }, [foodVisuals]);

  // Main 60fps Entity Animation Loop
  const simRafRef = useRef<number>(0);
  const lastSimTimeRef = useRef<number>(0);
  const simLoopFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    const step = () => {
      if (!visRef.current) return;
      const now = timeRef.current ?? 0;
      const dt = lastSimTimeRef.current > 0 ? Math.min(now - lastSimTimeRef.current, 0.05) : 0.016;
      lastSimTimeRef.current = now;

      updateSimulation(now, dt);

      const list = floatsRef.current;
      let hashNum = list.length;
      for (const f of list) {
        hashNum =
          31 * (31 * hashNum + f.id) +
          (f.action === 'paddle' ? 1 : f.action === 'drowning' ? 2 : f.action === 'leaving' ? 3 : 0);
        if (f.variant.kind === 'fish') {
          hashNum = 31 * hashNum + (f.paddleIntensity > 0.5 ? 5 : 6);
        }
      }
      const hashStr = String(hashNum);
      if (hashStr !== stateHashRef.current) {
        stateHashRef.current = hashStr;
        setRenderEntities(
          list.map((f) => ({
            id: f.id,
            variant: f.variant,
            paddling: f.action === 'paddle' || f.action === 'leaving',
            burst: f.variant.kind === 'fish' && f.paddleIntensity > 0.5,
          }))
        );
      }

      // Direct DOM transforms for smooth 60fps movement
      for (const f of list) {
        const el = entityDomMapRef.current.get(f.id);
        if (el) {
          el.style.left = `${100 * f.nx}%`;
          el.style.top = `${100 * f.ny}%`;
          el.style.transform = `translate(-50%,-50%) translateY(${-f.offsetY}px) rotate(${f.rotation}deg) scale(${f.scale})`;
          el.style.opacity = String(f.opacity);
        }
      }

      const bubbleEl = speechDomRef.current;
      if (bubbleEl && list.length > 0) {
        const speaker = list[speakerIndexRef.current % list.length];
        bubbleEl.style.left = `${100 * speaker.nx}%`;
        bubbleEl.style.top = `${100 * speaker.ny}%`;
        bubbleEl.style.transform = 'translate(-50%, -100%) translateY(-28px)';
        bubbleEl.style.opacity = String(speaker.opacity);
      }

      if (foodVisualsRef.current.length > 0) {
        const activeFoods = foodsRef.current;
        for (const [fid, el] of foodDomMapRef.current.entries()) {
          const fObj = activeFoods.find((item) => item.id === fid);
          if (fObj) {
            if (fObj.arrivedTime !== null) {
              const p = (now - fObj.arrivedTime) / 2.5;
              el.style.opacity = String(Math.max(0, 1 - p * p));
            } else {
              el.style.opacity = '1';
            }
          } else {
            el.style.opacity = '0';
          }
        }
        const activeIds = new Set(activeFoods.map((f) => f.id));
        setFoodVisuals((prev) => {
          const filtered = prev.filter((item) => activeIds.has(item.foodId));
          if (filtered.length !== prev.length) {
            foodVisualsRef.current = filtered;
            return filtered;
          }
          return prev;
        });
      }

      simRafRef.current = requestAnimationFrame(step);
    };

    simLoopFnRef.current = step;
    simRafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(simRafRef.current);
  }, [timeRef, updateSimulation]);

  // Spawn initial 2 ducks on startup
  const initializedRef = useRef<boolean>(false);
  useEffect(() => {
    if (initializedRef.current) return;
    let raf = 0;
    let t1 = 0;
    let t2 = 0;
    const waitReady = () => {
      if (timeRef.current && timeRef.current > 0) {
        initializedRef.current = true;
        const spawnAt = (nx: number, ny: number) => () => {
          addDuck(nx, ny, timeRef.current ?? 0);
          triggerRippleAt(nx, ny);
        };
        t1 = window.setTimeout(spawnAt(0.35 + Math.random() * 0.1, 0.4 + Math.random() * 0.1), 200);
        t2 = window.setTimeout(spawnAt(0.55 + Math.random() * 0.1, 0.55 + Math.random() * 0.1), 800);
      } else {
        raf = requestAnimationFrame(waitReady);
      }
    };
    raf = requestAnimationFrame(waitReady);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [addDuck, timeRef, triggerRippleAt]);

  // IntersectionObserver pause/resume when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasHidden = !visRef.current;
        visRef.current = entry.isIntersecting;
        if (wasHidden && entry.isIntersecting) {
          resumeWaveGL();
          resumePlants();
          cancelAnimationFrame(simRafRef.current);
          simRafRef.current = requestAnimationFrame(() => simLoopFnRef.current());
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [resumeWaveGL, resumePlants]);

  // Click / Tap handler on the pond
  const handlePondTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;

      if (feedMode) {
        const { id, spawnedFish } = dropFood(nx, ny, timeRef.current ?? 0);
        if (spawnedFish) {
          sfx.surface(nx);
          const duckEntries = floatsRef.current
            .map((f, idx) => ({ f, idx }))
            .filter(({ f }) => f.variant.kind !== 'fish');
          let nearestIdx = -1;
          let bestDist = Infinity;
          for (const { f, idx } of duckEntries) {
            const dx = f.nx - nx;
            const dy = f.ny - ny;
            const dSq = dx * dx + dy * dy;
            if (dSq < bestDist) {
              bestDist = dSq;
              nearestIdx = idx;
            }
          }
          if (nearestIdx >= 0) {
            triggerFishSpeech(nearestIdx);
            const speakerNx = floatsRef.current[nearestIdx]?.nx ?? nx;
            setTimeout(() => sfx.chirp(nearestIdx, speakerNx), 190);
          }
        } else {
          sfx.pellets(nx);
          triggerRippleAt(nx, ny);
          setFoodVisuals((prev) => {
            const next: FoodPelletVisual[] = [
              ...prev,
              {
                foodId: id,
                pellets: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
                  x: nx + (Math.random() - 0.5) * 0.08,
                  y: ny + (Math.random() - 0.5) * 0.08,
                  size: 5 + Math.random() * 6,
                  hue: 28 + Math.random() * 16,
                  blur: 2 + Math.random() * 2,
                })),
              },
            ];
            foodVisualsRef.current = next;
            return next;
          });
        }
      } else {
        addDuck(nx, ny, timeRef.current ?? 0);
        triggerRippleAt(nx, ny);
        sfx.plop(nx);
      }
    },
    [feedMode, dropFood, timeRef, triggerFishSpeech, triggerRippleAt, addDuck]
  );

  return (
    <div className="min-h-screen bg-[#f5f1ec] flex flex-col items-center justify-center select-none overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Top helper prompt when in Feed Mode */}
        <div className="h-6 mb-1.5 flex items-center justify-center">
          {feedMode && (
            <span
              className="text-[11px] tracking-wide text-[#2a2520]/40"
              style={{ letterSpacing: '0.06em', fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              tap anywhere to feed the ducks
            </span>
          )}
        </div>

        {/* Main Pond Stage */}
        <div className="relative w-[88vw] h-[45dvh] sm:w-[70vw] sm:h-[65vh] max-w-[900px] max-h-[600px]">
          {/* Clipped Inner Container (Layers 1, 2, 3) */}
          <div
            ref={containerRef}
            onClick={handlePondTap}
            className="relative w-full h-full border-0 outline-none rounded-sm overflow-hidden"
            style={{ cursor: feedMode ? 'crosshair' : 'pointer' }}
          >
            <div className="absolute inset-[1.25px] overflow-hidden">
              {/* LAYER 1: WebGL Procedural Seascape Water & Slope-Warped Ripples */}
              <canvas
                ref={waveCanvasRef}
                className="absolute pointer-events-none"
                style={{
                  inset: '-1.25px',
                  width: 'calc(100% + 2.5px)',
                  height: 'calc(100% + 2.5px)',
                }}
              />

              {/* LAYER 2: Sandwiched DOM/SVG Entities (Food Pellets, Ducks, Fish) */}
              {foodVisuals.map((group) => (
                <div
                  key={`food-${group.foodId}`}
                  ref={(el) => {
                    if (el) foodDomMapRef.current.set(group.foodId, el);
                    else foodDomMapRef.current.delete(group.foodId);
                  }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ transition: 'opacity 0.8s ease-out', willChange: 'opacity' }}
                >
                  {group.pellets.map((pellet, idx) => (
                    <div
                      key={idx}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${100 * pellet.x}%`,
                        top: `${100 * pellet.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: pellet.size,
                          height: pellet.size,
                          background: `radial-gradient(circle, hsla(${pellet.hue}, 45%, 60%, 0.5) 0%, hsla(${pellet.hue}, 40%, 45%, 0.3) 50%, hsla(${pellet.hue}, 35%, 35%, 0.1) 100%)`,
                          filter: `blur(${pellet.blur}px)`,
                          boxShadow: `0 0 ${2 * pellet.size}px hsla(${pellet.hue}, 35%, 50%, 0.2)`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}

              {renderEntities.map((ent, idx) => (
                <div
                  key={ent.id}
                  ref={(el) => {
                    if (el) entityDomMapRef.current.set(ent.id, el);
                    else entityDomMapRef.current.delete(ent.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.chirp(idx, floatsRef.current[idx]?.nx ?? 0.5);
                    triggerDuckSpeech(idx);
                  }}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    willChange: 'transform, opacity',
                    filter: 'blur(0.45px) drop-shadow(0 0 3px rgba(42,37,32,0.08))',
                  }}
                >
                  <FloatEntitySVG
                    variant={ent.variant}
                    size={ent.variant.kind === 'fish' ? 48 : 72}
                    paddling={ent.paddling}
                    burst={ent.burst}
                  />
                </div>
              ))}

              {/* LAYER 3: 2D Canvas Film Grain, Fog, Light Leaks & Noisy SDF Edge Vignette */}
              <canvas
                ref={paperCanvasRef}
                className="absolute pointer-events-none"
                style={{
                  inset: '-1.25px',
                  width: 'calc(100% + 2.5px)',
                  height: 'calc(100% + 2.5px)',
                }}
              />
            </div>
          </div>

          {/* LAYER 4: Unclipped Speech Bubble Layer (z-index: 50) */}
          <div
            ref={speechDomRef}
            className="absolute pointer-events-none"
            style={{ willChange: 'transform, opacity', zIndex: 50 }}
          >
            {bubbleText && (
              <div className="relative px-3 py-1 bg-white rounded-xl shadow-sm border border-black/[0.06] max-w-[200px] whitespace-normal transition-all duration-200">
                <p
                  className="text-[10px] sm:text-[11px] text-[#2a2520]/70 leading-relaxed m-0"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {bubbleText}
                </p>
                <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-black/[0.06] rotate-45" />
              </div>
            )}
          </div>

          {/* LAYER 5: Oversized 2D Shoreline Reeds & Cattails Canvas (inset: -200px, z-index: 7) */}
          <canvas
            ref={plantCanvasRef}
            className="absolute pointer-events-none"
            style={{
              inset: '-200px',
              width: 'calc(100% + 400px)',
              height: 'calc(100% + 400px)',
              zIndex: 7,
            }}
          />
        </div>

        {/* Feed Mode Toggle Button */}
        <div className="mt-2" style={{ zIndex: 20 }}>
          <FeedModeButton active={feedMode} onClick={() => setFeedMode((prev) => !prev)} />
        </div>
      </div>
    </div>
  );
}

export default DuckPond;
