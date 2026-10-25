// ============================================================================
// BUNNY ROYALE — 60 FPS LIVE SCREEN AMBIENCE ENGINE (screenAmbience.js)
// Attaches fullscreen pointer-events-none <canvas class="screen-ambience-canvas">
// behind the UI chrome on:
//   • #screen-main-menu
//   • #screen-char-select
//   • #screen-level-briefing (inside #screen-briefing)
//   • #screen-victory
//   • #screen-defeat
//
// Features:
//   • Animated Sky & Streetlamp Glow: Drifting purple-blue storm energy bands
//     across the upper sky, warm pulsing streetlamp halos (x=66%, y=14%), and
//     slanting volumetric god-rays across Carrot Cove street.
//   • Floating Environmental Particles: Tumbling green leaf particles, warm
//     golden pollen motes, and sweeping translucent wind streaks.
//   • Briefing Hologram Pedestal & Tactical Radar Sweep: Rising cyan holo-rings
//     & vertical projector beams around the hero's pedestal + rotating radar
//     sweep and sonar pulses across the Carrot Cove tactical map.
//   • Victory Confetti & Golden Stars / Defeat Twilight Embers & Mist.
// ============================================================================

const SCREEN_TARGETS = [
  { key: 'main-menu', containerId: 'screen-main-menu', zIndex: 3 },
  { key: 'char-select', containerId: 'screen-char-select', zIndex: 3 },
  { key: 'briefing', containerId: 'screen-level-briefing', fallbackId: 'screen-briefing', zIndex: 5 },
  { key: 'victory', containerId: 'screen-victory', zIndex: 3 },
  { key: 'defeat', containerId: 'screen-defeat', zIndex: 3 }
];

const CONFETTI_COLORS = [
  '#ff6600',
  '#00e5ff',
  '#ffea00',
  '#00e640',
  '#ff2a9d',
  '#a855f7',
  '#ffffff'
];

const LEAF_COLORS = [
  '#4ade80',
  '#84cc16',
  '#22c55e',
  '#a3e635'
];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export class ScreenAmbience {
  constructor() {
    if (window.__BUNNY_SCREEN_AMBIENCE_INSTANCE__) {
      return window.__BUNNY_SCREEN_AMBIENCE_INSTANCE__;
    }
    window.__BUNNY_SCREEN_AMBIENCE_INSTANCE__ = this;

    this.time = 0;
    this.activeScreen = 'main-menu';
    this.lastFrameTime = performance.now() / 1000;
    this._lastExternalUpdateMs = 0;

    this.canvases = {};
    this.width = window.innerWidth || 1280;
    this.height = window.innerHeight || 720;

    // Particle pools
    this.pollenMotes = [];
    this.leaves = [];
    this.windStreaks = [];
    this.holoRings = [];
    this.holoMotes = [];
    this.confetti = [];
    this.victoryStars = [];
    this.defeatEmbers = [];

    this._injectStyles();
    this._attachCanvases();
    this._initPools();

    window.addEventListener('resize', () => this._handleResize(), { passive: true });
    this._startLoop();
  }

  _injectStyles() {
    if (document.getElementById('screen-ambience-styles')) return;
    const style = document.createElement('style');
    style.id = 'screen-ambience-styles';
    style.textContent = `
      .screen-ambience-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  _attachCanvases() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = Math.max(640, Math.round((window.innerWidth || 1280) * dpr));
    this.height = Math.max(360, Math.round((window.innerHeight || 720) * dpr));

    SCREEN_TARGETS.forEach((target) => {
      const container = document.getElementById(target.containerId) ||
                        (target.fallbackId ? document.getElementById(target.fallbackId) : null);
      if (!container) return;

      let canvas = container.querySelector(':scope > canvas.screen-ambience-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'screen-ambience-canvas';
        canvas.style.zIndex = String(target.zIndex);
        canvas.setAttribute('aria-hidden', 'true');

        // Insert right after .menu-scenic-backdrop if present, otherwise prepend/append cleanly
        const backdrop = container.querySelector(':scope > .menu-scenic-backdrop');
        if (backdrop && backdrop.nextSibling) {
          container.insertBefore(canvas, backdrop.nextSibling);
        } else {
          container.appendChild(canvas);
        }
      }

      canvas.width = this.width;
      canvas.height = this.height;
      this.canvases[target.key] = {
        canvas,
        ctx: canvas.getContext('2d'),
        container
      };
    });
  }

  _handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = Math.max(640, Math.round((window.innerWidth || 1280) * dpr));
    this.height = Math.max(360, Math.round((window.innerHeight || 720) * dpr));

    Object.values(this.canvases).forEach((entry) => {
      entry.canvas.width = this.width;
      entry.canvas.height = this.height;
    });
  }

  _initPools() {
    // 1. Golden Pollen Motes (42 motes)
    this.pollenMotes = [];
    for (let i = 0; i < 42; i++) {
      this.pollenMotes.push({
        x: Math.random(),
        y: Math.random(),
        vx: 0.012 + Math.random() * 0.024,
        vy: -(0.008 + Math.random() * 0.018),
        r: 1.8 + Math.random() * 3.6,
        alpha: 0.25 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.25
      });
    }

    // 2. Drifting Green Leaves (14 leaves)
    this.leaves = [];
    for (let i = 0; i < 14; i++) {
      this.leaves.push(this._createLeaf(true));
    }

    // 3. Subtle Wind Streaks (6 streaks)
    this.windStreaks = [];
    for (let i = 0; i < 6; i++) {
      this.windStreaks.push({
        x: Math.random(),
        y: 0.22 + Math.random() * 0.62,
        len: 0.11 + Math.random() * 0.14,
        speed: 0.14 + Math.random() * 0.12,
        amp: 0.008 + Math.random() * 0.012,
        alpha: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. Briefing Hologram Pedestal Rings & Tech Motes
    this.holoRings = [
      { progress: 0.0, speed: 0.42 },
      { progress: 0.33, speed: 0.42 },
      { progress: 0.66, speed: 0.42 }
    ];
    this.holoMotes = [];
    for (let i = 0; i < 24; i++) {
      this.holoMotes.push({
        ox: (Math.random() - 0.5) * 0.16,
        y: Math.random(),
        speed: 0.22 + Math.random() * 0.32,
        size: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 5. Victory Confetti Ribbons (75 ribbons) & Golden Stars (22 stars)
    this.confetti = [];
    for (let i = 0; i < 75; i++) {
      this.confetti.push(this._createConfetti(true));
    }
    this.victoryStars = [];
    for (let i = 0; i < 22; i++) {
      this.victoryStars.push(this._createVictoryStar(true));
    }

    // 6. Defeat Twilight Embers (48 embers)
    this.defeatEmbers = [];
    for (let i = 0; i < 48; i++) {
      this.defeatEmbers.push(this._createDefeatEmber(true));
    }
  }

  _createLeaf(randomX = false) {
    return {
      x: randomX ? Math.random() : -0.06,
      y: 0.12 + Math.random() * 0.72,
      vx: 0.035 + Math.random() * 0.045,
      vy: 0.012 + Math.random() * 0.022,
      size: 5.0 + Math.random() * 5.5,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.8,
      tumblePhase: Math.random() * Math.PI * 2,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      alpha: 0.55 + Math.random() * 0.35
    };
  }

  _createConfetti(randomY = false) {
    return {
      x: Math.random(),
      y: randomY ? Math.random() : -(0.02 + Math.random() * 0.15),
      vx: (Math.random() - 0.5) * 0.08,
      vy: 0.11 + Math.random() * 0.16,
      w: 6 + Math.random() * 7,
      h: 11 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 5.5,
      tumble: Math.random() * Math.PI * 2,
      tumbleSpeed: 3.5 + Math.random() * 4.5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      alpha: 0.78 + Math.random() * 0.22
    };
  }

  _createVictoryStar(randomY = false) {
    return {
      x: 0.08 + Math.random() * 0.84,
      y: randomY ? Math.random() : 0.85 + Math.random() * 0.15,
      vy: -(0.04 + Math.random() * 0.07),
      size: 5 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.2,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.25
    };
  }

  _createDefeatEmber(randomY = false) {
    return {
      x: Math.random(),
      y: randomY ? Math.random() : 1.02 + Math.random() * 0.08,
      vx: (Math.random() - 0.35) * 0.028,
      vy: -(0.028 + Math.random() * 0.052),
      r: 1.6 + Math.random() * 3.4,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.55,
      isViolet: Math.random() > 0.68
    };
  }

  _normalizeScreen(scr) {
    if (!scr) return this._detectActiveScreen();
    const s = String(scr).toLowerCase().replace(/^#?screen-/, '');
    if (s === 'level-briefing' || s === 'briefing') return 'briefing';
    if (s === 'main-menu' || s === 'menu') return 'main-menu';
    if (s === 'char-select' || s === 'character-select' || s === 'select') return 'char-select';
    if (s === 'victory') return 'victory';
    if (s === 'defeat') return 'defeat';
    return s;
  }

  _detectActiveScreen() {
    const map = [
      { id: 'main-menu', el: document.getElementById('screen-main-menu') },
      { id: 'char-select', el: document.getElementById('screen-char-select') },
      { id: 'briefing', el: document.getElementById('screen-briefing') },
      { id: 'victory', el: document.getElementById('screen-victory') },
      { id: 'defeat', el: document.getElementById('screen-defeat') }
    ];
    for (const item of map) {
      if (item.el && !item.el.classList.contains('hidden')) {
        return item.id;
      }
    }
    return 'game';
  }

  // ==========================================================================
  // PUBLIC API: update(dt, activeScreen)
  // ==========================================================================

  update(dt, activeScreen, _isInternal = false) {
    if (!_isInternal) {
      this._lastExternalUpdateMs = performance.now();
    }

    const clampedDt = clamp(dt || 0.016, 0.001, 0.05);
    this.time += clampedDt;
    this.activeScreen = activeScreen ? this._normalizeScreen(activeScreen) : this._detectActiveScreen();

    // Pause all menu ambience rendering during active gameplay or pause overlay
    if (this.activeScreen === 'game' || this.activeScreen === 'pause') {
      return;
    }

    const entry = this.canvases[this.activeScreen];
    if (!entry || !entry.ctx) return;

    const { ctx, canvas } = entry;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (this.activeScreen === 'main-menu' || this.activeScreen === 'char-select') {
      this._updateStreetParticles(clampedDt);
      this._renderStormSkyBands(ctx, w, h, false);
      this._renderSunlightGodRays(ctx, w, h, false);
      this._renderStreetlampHalos(ctx, w, h, false);
      this._renderWindStreaks(ctx, w, h);
      this._renderPollenAndLeaves(ctx, w, h);
    } else if (this.activeScreen === 'briefing') {
      this._updateBriefingHolo(clampedDt);
      this._renderBriefingRadarAndHolo(ctx, w, h, entry.container);
    } else if (this.activeScreen === 'victory') {
      this._updateStreetParticles(clampedDt);
      this._updateVictoryConfetti(clampedDt);
      this._renderSunlightGodRays(ctx, w, h, true);
      this._renderStreetlampHalos(ctx, w, h, false);
      this._renderVictoryConfettiAndStars(ctx, w, h);
    } else if (this.activeScreen === 'defeat') {
      this._updateDefeatEmbers(clampedDt);
      this._renderStormSkyBands(ctx, w, h, true);
      this._renderStreetlampHalos(ctx, w, h, true);
      this._renderDefeatEmbersAndMist(ctx, w, h);
    }
  }

  // ==========================================================================
  // 1. SKY STORM BANDS, GOD-RAYS & STREETLAMP HALO (x = 66%, y = 14%)
  // ==========================================================================

  _renderStormSkyBands(ctx, w, h, isDefeat) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Drifting purple-blue storm energy bands across upper sky (y: 0..28%)
    for (let b = 0; b < 3; b++) {
      const bandY = h * (0.06 + b * 0.065);
      const bandH = h * 0.095;
      const grad = ctx.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
      const alpha = isDefeat ? 0.14 - b * 0.025 : 0.095 - b * 0.02;
      const colorMid = b % 2 === 0
        ? `rgba(124, 58, 237, ${alpha})`
        : `rgba(0, 210, 255, ${alpha * 0.85})`;

      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.5, colorMid);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = u * w;
        const wave = Math.sin(u * 5.2 + this.time * (0.55 + b * 0.18) + b * 1.4) * (h * 0.022) +
                     Math.cos(u * 8.5 - this.time * 0.4) * (h * 0.010);
        ctx.lineTo(x, bandY + wave + bandH);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  _renderSunlightGodRays(ctx, w, h, isVictory) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const rayConfigs = [
      { topX: 0.56, botX: 0.34, width: 0.11, phase: 0.0 },
      { topX: 0.66, botX: 0.46, width: 0.14, phase: 1.4 },
      { topX: 0.77, botX: 0.58, width: 0.10, phase: 2.8 },
      { topX: 0.86, botX: 0.70, width: 0.09, phase: 4.1 }
    ];

    for (let i = 0; i < rayConfigs.length; i++) {
      const r = rayConfigs[i];
      const pulse = 0.65 + 0.35 * Math.sin(this.time * 0.85 + r.phase);
      const maxAlpha = (isVictory ? 0.12 : 0.075) * pulse;

      const xTop = (r.topX + Math.sin(this.time * 0.3 + r.phase) * 0.015) * w;
      const xBot = (r.botX + Math.sin(this.time * 0.3 + r.phase) * 0.022) * w;
      const halfWTop = r.width * 0.45 * w;
      const halfWBot = r.width * 1.15 * w;

      const grad = ctx.createLinearGradient(xTop, 0, xBot, h * 0.88);
      grad.addColorStop(0, `rgba(255, 220, 135, ${maxAlpha})`);
      grad.addColorStop(0.55, `rgba(255, 185, 95, ${maxAlpha * 0.55})`);
      grad.addColorStop(1, 'rgba(255, 165, 60, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xTop - halfWTop, -10);
      ctx.lineTo(xTop + halfWTop, -10);
      ctx.lineTo(xBot + halfWBot, h * 0.92);
      ctx.lineTo(xBot - halfWBot, h * 0.92);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  _renderStreetlampHalos(ctx, w, h, isDefeat) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Primary canonical streetlamp halo at (x = 66%, y = 14%) + secondary street lamps
    const lamps = [
      { x: 0.66, y: 0.14, r: 0.135, weight: 1.0, phase: 0.0 },
      { x: 0.33, y: 0.23, r: 0.075, weight: 0.55, phase: 1.9 },
      { x: 0.81, y: 0.25, r: 0.070, weight: 0.50, phase: 3.4 }
    ];

    for (let i = 0; i < lamps.length; i++) {
      const lamp = lamps[i];
      const lx = lamp.x * w;
      const ly = lamp.y * h;
      const flicker = isDefeat
        ? 0.72 + 0.28 * Math.sin(this.time * 6.5 + lamp.phase) * Math.cos(this.time * 13.0)
        : 0.82 + 0.18 * Math.sin(this.time * 2.6 + lamp.phase);

      const radius = lamp.r * Math.min(w, h) * (0.94 + 0.12 * flicker);
      const alpha = (isDefeat ? 0.42 : 0.34) * lamp.weight * flicker;

      const grad = ctx.createRadialGradient(lx, ly, 1, lx, ly, radius);
      grad.addColorStop(0, `rgba(255, 248, 210, ${alpha * 1.15})`);
      grad.addColorStop(0.28, `rgba(255, 190, 75, ${alpha * 0.72})`);
      grad.addColorStop(0.65, `rgba(255, 125, 25, ${alpha * 0.25})`);
      grad.addColorStop(1, 'rgba(255, 110, 10, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle horizontal anamorphic lens flare on primary streetlamp (x = 66%, y = 14%)
      if (i === 0) {
        const flareW = radius * 1.65;
        const flareH = Math.max(3, radius * 0.075);
        const flareGrad = ctx.createLinearGradient(lx - flareW, ly, lx + flareW, ly);
        flareGrad.addColorStop(0, 'rgba(255, 210, 120, 0)');
        flareGrad.addColorStop(0.5, `rgba(255, 235, 175, ${alpha * 0.55})`);
        flareGrad.addColorStop(1, 'rgba(255, 210, 120, 0)');
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.ellipse(lx, ly, flareW, flareH, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ==========================================================================
  // 2. FLOATING LEAVES, GOLDEN POLLEN MOTES & WIND STREAKS
  // ==========================================================================

  _updateStreetParticles(dt) {
    for (let i = 0; i < this.pollenMotes.length; i++) {
      const m = this.pollenMotes[i];
      m.x += (m.vx + Math.sin(this.time * 1.4 + m.phase) * 0.012) * dt;
      m.y += (m.vy + Math.cos(this.time * 1.8 + m.phase) * 0.006) * dt;
      if (m.x > 1.04) m.x = -0.04;
      if (m.y < -0.04) m.y = 1.04;
    }

    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];
      l.x += (l.vx + Math.sin(this.time * 1.6 + l.tumblePhase) * 0.018) * dt;
      l.y += (l.vy + Math.cos(this.time * 2.2 + l.tumblePhase) * 0.014) * dt;
      l.rot += l.rotSpeed * dt;
      if (l.x > 1.06 || l.y > 1.06) {
        this.leaves[i] = this._createLeaf(false);
      }
    }

    for (let i = 0; i < this.windStreaks.length; i++) {
      const ws = this.windStreaks[i];
      ws.x += ws.speed * dt;
      if (ws.x - ws.len > 1.08) {
        ws.x = -0.15;
        ws.y = 0.20 + Math.random() * 0.65;
      }
    }
  }

  _renderWindStreaks(ctx, w, h) {
    ctx.save();
    ctx.lineCap = 'round';

    for (let i = 0; i < this.windStreaks.length; i++) {
      const ws = this.windStreaks[i];
      const xStart = (ws.x - ws.len) * w;
      const xEnd = ws.x * w;
      const yBase = ws.y * h;
      const waveY = Math.sin(this.time * 2.5 + ws.phase) * (ws.amp * h);

      const grad = ctx.createLinearGradient(xStart, yBase, xEnd, yBase);
      grad.addColorStop(0, 'rgba(220, 248, 255, 0)');
      grad.addColorStop(0.5, `rgba(220, 248, 255, ${ws.alpha})`);
      grad.addColorStop(1, 'rgba(220, 248, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(xStart, yBase);
      ctx.quadraticCurveTo((xStart + xEnd) * 0.5, yBase + waveY, xEnd, yBase - waveY * 0.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  _renderPollenAndLeaves(ctx, w, h) {
    // Golden pollen motes
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.pollenMotes.length; i++) {
      const m = this.pollenMotes[i];
      const twinkle = 0.55 + 0.45 * Math.sin(this.time * 3.1 + m.phase);
      const alpha = m.alpha * twinkle;
      const px = m.x * w;
      const py = m.y * h;

      const grad = ctx.createRadialGradient(px, py, 0.5, px, py, m.r * 2.4);
      if (m.warm) {
        grad.addColorStop(0, `rgba(255, 245, 180, ${alpha})`);
        grad.addColorStop(0.5, `rgba(255, 195, 60, ${alpha * 0.55})`);
        grad.addColorStop(1, 'rgba(255, 160, 20, 0)');
      } else {
        grad.addColorStop(0, `rgba(180, 250, 255, ${alpha})`);
        grad.addColorStop(0.5, `rgba(0, 229, 255, ${alpha * 0.45})`);
        grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, m.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Drifting green leaves
    ctx.save();
    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];
      const lx = l.x * w;
      const ly = l.y * h;
      const flutterScaleY = 0.45 + 0.55 * Math.abs(Math.cos(this.time * 3.2 + l.tumblePhase));

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(l.rot);
      ctx.scale(1, flutterScaleY);
      ctx.globalAlpha = l.alpha;
      ctx.fillStyle = l.color;

      const s = l.size;
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.quadraticCurveTo(0, -s * 0.75, s, 0);
      ctx.quadraticCurveTo(0, s * 0.75, -s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // ==========================================================================
  // 3. LEVEL BRIEFING: HOLOGRAM PEDESTAL RINGS & TACTICAL MAP RADAR SWEEP
  // ==========================================================================

  _updateBriefingHolo(dt) {
    for (let i = 0; i < this.holoRings.length; i++) {
      this.holoRings[i].progress = (this.holoRings[i].progress + this.holoRings[i].speed * dt) % 1.0;
    }
    for (let i = 0; i < this.holoMotes.length; i++) {
      const hm = this.holoMotes[i];
      hm.y -= hm.speed * dt;
      if (hm.y < 0) hm.y = 1.0;
    }
  }

  _renderBriefingRadarAndHolo(ctx, w, h, container) {
    // Determine pedestal center in normalized coordinates from DOM if available
    let pedX = w * 0.15;
    let pedY = h * 0.72;
    let pedRx = w * 0.095;
    let pedRy = h * 0.025;

    const discEl = container && container.querySelector('.holo-pedestal-disc');
    if (discEl) {
      const cRect = container.getBoundingClientRect();
      const dRect = discEl.getBoundingClientRect();
      if (cRect.width > 0 && dRect.width > 0) {
        pedX = ((dRect.left + dRect.width * 0.5 - cRect.left) / cRect.width) * w;
        pedY = ((dRect.top + dRect.height * 0.5 - cRect.top) / cRect.height) * h;
        pedRx = (dRect.width * 0.48 / cRect.width) * w;
        pedRy = Math.max(8, (dRect.height * 0.42 / cRect.height) * h);
      }
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // A. Hologram Pedestal Volumetric Light Cone & Rising Cyan Holographic Rings
    const coneHeight = h * 0.44;
    const coneGrad = ctx.createLinearGradient(pedX, pedY, pedX, pedY - coneHeight);
    coneGrad.addColorStop(0, 'rgba(0, 229, 255, 0.24)');
    coneGrad.addColorStop(0.45, 'rgba(0, 195, 255, 0.08)');
    coneGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(pedX - pedRx, pedY);
    ctx.lineTo(pedX + pedRx, pedY);
    ctx.lineTo(pedX + pedRx * 1.25, pedY - coneHeight);
    ctx.lineTo(pedX - pedRx * 1.25, pedY - coneHeight);
    ctx.closePath();
    ctx.fill();

    // Rising Cyan Holographic Rings around Hero Pedestal
    for (let i = 0; i < this.holoRings.length; i++) {
      const p = this.holoRings[i].progress;
      const ringY = pedY - p * coneHeight * 0.85;
      const ringRx = pedRx * (1.0 - p * 0.14);
      const ringRy = pedRy * (1.0 - p * 0.18);
      const alpha = Math.sin(p * Math.PI) * 0.65;

      ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(pedX, ringY, ringRx, ringRy, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Floating Cyan Hologram Data Motes above Pedestal
    for (let i = 0; i < this.holoMotes.length; i++) {
      const hm = this.holoMotes[i];
      const mx = pedX + hm.ox * w + Math.sin(this.time * 2.5 + hm.phase) * 6;
      const my = pedY - (1 - hm.y) * coneHeight * 0.92;
      const alpha = Math.sin(hm.y * Math.PI) * 0.68;
      ctx.fillStyle = `rgba(128, 244, 255, ${alpha})`;
      ctx.fillRect(mx - hm.size * 0.5, my - hm.size * 1.4, hm.size, hm.size * 2.8);
    }

    // B. Tactical Map Radar Scanline Sweep (Right 75% Map Viewport)
    const mapCenterX = w * 0.64;
    const mapCenterY = h * 0.42;
    const radarRadius = Math.min(w, h) * 0.44;
    const sweepAngle = (this.time * 0.95) % (Math.PI * 2);

    // Subtle radar ring & rotating sweep beam
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mapCenterX, mapCenterY, radarRadius * 0.68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.translate(mapCenterX, mapCenterY);
    ctx.rotate(sweepAngle);

    const beamGrad = ctx.createLinearGradient(0, 0, radarRadius, 0);
    beamGrad.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
    beamGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.08)');
    beamGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radarRadius, -0.38, 0.02);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radarRadius, 0);
    ctx.stroke();
    ctx.restore();

    // Horizontal tactical scanbar sweeping gently down the map viewport
    const scanY = ((this.time * 0.18) % 1.0) * (h * 0.84);
    const scanGrad = ctx.createLinearGradient(w * 0.24, scanY - 18, w * 0.24, scanY + 4);
    scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    scanGrad.addColorStop(0.85, 'rgba(0, 229, 255, 0.10)');
    scanGrad.addColorStop(1, 'rgba(140, 248, 255, 0.22)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(w * 0.24, scanY - 18, w * 0.76, 22);

    ctx.restore();
  }

  // ==========================================================================
  // 4. VICTORY CONFETTI RIBBONS & SPARKLING GOLDEN STARS
  // ==========================================================================

  _updateVictoryConfetti(dt) {
    for (let i = 0; i < this.confetti.length; i++) {
      const c = this.confetti[i];
      c.x += (c.vx + Math.sin(this.time * 2.2 + c.tumble) * 0.03) * dt;
      c.y += c.vy * dt;
      c.rot += c.rotSpeed * dt;
      c.tumble += c.tumbleSpeed * dt;
      if (c.y > 1.06) {
        this.confetti[i] = this._createConfetti(false);
      }
    }

    for (let i = 0; i < this.victoryStars.length; i++) {
      const s = this.victoryStars[i];
      s.y += s.vy * dt;
      s.rot += s.rotSpeed * dt;
      if (s.y < -0.05) {
        this.victoryStars[i] = this._createVictoryStar(false);
      }
    }
  }

  _renderVictoryConfettiAndStars(ctx, w, h) {
    // 1. Tumbling 3D-projected confetti ribbons
    ctx.save();
    for (let i = 0; i < this.confetti.length; i++) {
      const c = this.confetti[i];
      const cx = c.x * w;
      const cy = c.y * h;
      const scaleY = Math.cos(c.tumble);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(c.rot);
      ctx.scale(1, scaleY);
      ctx.globalAlpha = c.alpha;
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w * 0.5, -c.h * 0.5, c.w, c.h);
      ctx.restore();
    }
    ctx.restore();

    // 2. Sparkling golden 4-point stars
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.victoryStars.length; i++) {
      const s = this.victoryStars[i];
      const sx = s.x * w;
      const sy = s.y * h;
      const twinkle = 0.45 + 0.55 * Math.sin(this.time * 4.5 + s.phase);
      const r = s.size * (0.8 + 0.4 * twinkle);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(s.rot);
      ctx.fillStyle = s.gold
        ? `rgba(255, 230, 90, ${0.85 * twinkle})`
        : `rgba(140, 245, 255, ${0.80 * twinkle})`;

      ctx.beginPath();
      for (let p = 0; p < 8; p++) {
        const rad = p % 2 === 0 ? r : r * 0.28;
        const ang = (p * Math.PI) / 4;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // ==========================================================================
  // 5. DEFEAT TWILIGHT EMBERS & DUSK GROUND MIST
  // ==========================================================================

  _updateDefeatEmbers(dt) {
    for (let i = 0; i < this.defeatEmbers.length; i++) {
      const e = this.defeatEmbers[i];
      e.x += (e.vx + Math.sin(this.time * 1.5 + e.phase) * 0.015) * dt;
      e.y += e.vy * dt;
      if (e.y < -0.05 || e.x < -0.05 || e.x > 1.05) {
        this.defeatEmbers[i] = this._createDefeatEmber(false);
      }
    }
  }

  _renderDefeatEmbersAndMist(ctx, w, h) {
    // Low drifting twilight mist at bottom of street
    ctx.save();
    const mistGrad = ctx.createLinearGradient(0, h * 0.68, 0, h);
    mistGrad.addColorStop(0, 'rgba(18, 24, 52, 0)');
    mistGrad.addColorStop(1, 'rgba(28, 32, 68, 0.34)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, h * 0.68, w, h * 0.32);

    // Rising glowing twilight embers
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < this.defeatEmbers.length; i++) {
      const e = this.defeatEmbers[i];
      const ex = e.x * w;
      const ey = e.y * h;
      const pulse = 0.55 + 0.45 * Math.sin(this.time * 3.4 + e.phase);
      const alpha = e.alpha * pulse;
      const rad = e.r * 2.5;

      const grad = ctx.createRadialGradient(ex, ey, 0.5, ex, ey, rad);
      if (e.isViolet) {
        grad.addColorStop(0, `rgba(220, 180, 255, ${alpha})`);
        grad.addColorStop(0.5, `rgba(147, 51, 234, ${alpha * 0.55})`);
        grad.addColorStop(1, 'rgba(126, 34, 206, 0)');
      } else {
        grad.addColorStop(0, `rgba(255, 220, 150, ${alpha})`);
        grad.addColorStop(0.45, `rgba(255, 102, 20, ${alpha * 0.65})`);
        grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ex, ey, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _startLoop() {
    const step = (nowMs) => {
      requestAnimationFrame(step);
      const now = nowMs / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - this.lastFrameTime));
      this.lastFrameTime = now;
      if (nowMs - this._lastExternalUpdateMs > 45) {
        this.update(dt, this._detectActiveScreen(), true);
      }
    };
    requestAnimationFrame(step);
  }
}

export const screenAmbience = new ScreenAmbience();
