// ============================================================================
// BUNNY ROYALE — REAL-TIME 2.5D MESH-DEFORMED LIVE HERO ANIMATOR (heroAnimator.js)
// Replaces static hero <img> renders on Main Menu, Character Select, Level
// Briefing, Victory, and Defeat screens with a 60 FPS multi-zone skeletal/mesh
// animated character canvas:
//   • Planted Boots (y: 0.82..1.00) — 100% anchored to the ground/pedestal
//   • Knees & Hips (y: 0.58..0.82) — rhythmic knee-bend bounce & hop-squash
//   • Torso, Shoulders & Weapon (y: 0.34..0.58) — deep chest breathing, weapon
//     sway, and pulsing weapon core glow (Carrot Carbine / Seed Thumper / Arc Fork)
//   • Head & Expressive Face (y: 0.18..0.36) — head nod, mouse-look parallax,
//     and periodic natural eye blinking (with occasional double-blinks)
//   • Articulated Rabbit Ears (y: 0.00..0.22) — independent left/right ear
//     wind-wave physics, spring-lag, and energetic ear-perk emotes
//   • Character-Specific Aura Particles & Live Plasma Lightning Arcs
// ============================================================================

const HERO_SLOTS = [
  { imgId: 'menu-hero-img', screenId: 'main-menu', containerId: 'menu-hero-showcase', mode: 'menu' },
  { imgId: 'stage-hero-img', screenId: 'char-select', containerId: 'stage-hero-figure-wrap', mode: 'stage' },
  { imgId: 'briefing-hero-img', screenId: 'briefing', containerId: null, mode: 'briefing' },
  { imgId: 'victory-hero-img', screenId: 'victory', containerId: null, mode: 'victory' },
  { imgId: 'defeat-hero-img', screenId: 'defeat', containerId: null, mode: 'defeat' }
];

// Exact anatomical rig & FX metadata per fighter (normalized 0..1 on 1024x1536 source)
const FIGHTER_RIG_PROFILES = {
  pip: {
    id: 'pip',
    src: 'assets/char-pip-beauty.png',
    xPivot: 0.468,
    earZoneEnd: 0.235,
    headZoneStart: 0.18,
    headZoneEnd: 0.37,
    torsoZoneStart: 0.35,
    torsoZoneEnd: 0.60,
    kneeZoneStart: 0.58,
    kneeZoneEnd: 0.82,
    bootLockStart: 0.82,
    bottomY: 0.962,
    earAmplitudeLeft: 9.5,
    earAmplitudeRight: 11.2,
    earFreqLeft: 3.4,
    earFreqRight: 3.05,
    breathRate: 2.8,
    furLidTop: '#f5efe6',
    furLidMid: '#ebe2d4',
    furLidShadow: '#c7b7a3',
    lashColor: '#211915',
    irisGlintColor: 'rgba(255, 255, 255, 0.88)',
    eyes: [
      // Viewer's left eye (Pip's right eye)
      { cx: 0.372, cy: 0.281, rx: 0.047, ry: 0.026, rot: 0.17, glintX: 0.360, glintY: 0.273 },
      // Viewer's right eye (Pip's left eye)
      { cx: 0.524, cy: 0.299, rx: 0.034, ry: 0.025, rot: 0.22, glintX: 0.515, glintY: 0.291 }
    ],
    weaponGlows: [
      // Carrot Carbine glowing orange magazine cylinder
      { x: 0.585, y: 0.675, rx: 0.052, ry: 0.062, color: '255, 136, 0', core: '255, 230, 120', phase: 0.0 },
      // Carrot Carbine side plasma vent
      { x: 0.654, y: 0.582, rx: 0.044, ry: 0.018, color: '255, 115, 0', core: '255, 220, 140', phase: 1.1 },
      // Carrot Carbine muzzle ring
      { x: 0.892, y: 0.662, rx: 0.036, ry: 0.042, color: '255, 102, 0', core: '255, 200, 90', phase: 2.2 },
      // Teal bracer energy core
      { x: 0.280, y: 0.548, rx: 0.030, ry: 0.022, color: '255, 145, 0', core: '255, 240, 170', phase: 0.6 },
      // Carrot backpack side vent
      { x: 0.162, y: 0.486, rx: 0.018, ry: 0.036, color: '0, 229, 255', core: '200, 255, 255', phase: 1.7 }
    ],
    auraPrimary: '#ff7b00',
    auraSecondary: '#00e5ff'
  },

  bruno: {
    id: 'bruno',
    src: 'assets/char-bruno-beauty.png',
    xPivot: 0.548,
    earZoneEnd: 0.245,
    headZoneStart: 0.12,
    headZoneEnd: 0.30,
    torsoZoneStart: 0.28,
    torsoZoneEnd: 0.62,
    kneeZoneStart: 0.60,
    kneeZoneEnd: 0.81,
    bootLockStart: 0.81,
    bottomY: 0.932,
    earAmplitudeLeft: 8.5,
    earAmplitudeRight: 9.2,
    earFreqLeft: 2.65,
    earFreqRight: 2.45,
    breathRate: 2.35,
    furLidTop: '#e7c9a6',
    furLidMid: '#dbb68e',
    furLidShadow: '#b0865c',
    lashColor: '#23160d',
    irisGlintColor: 'rgba(255, 250, 235, 0.86)',
    eyes: [
      // Viewer's left eye
      { cx: 0.502, cy: 0.165, rx: 0.035, ry: 0.021, rot: 0.15, glintX: 0.494, glintY: 0.158 },
      // Viewer's right eye
      { cx: 0.608, cy: 0.182, rx: 0.029, ry: 0.020, rot: 0.20, glintX: 0.600, glintY: 0.175 }
    ],
    weaponGlows: [
      // Seed Thumper glowing amber slit
      { x: 0.508, y: 0.488, rx: 0.036, ry: 0.016, color: '255, 140, 0', core: '255, 240, 150', phase: 0.0 },
      // Seed Thumper massive orange seed drum warm internal pulse
      { x: 0.515, y: 0.602, rx: 0.088, ry: 0.078, color: '255, 125, 0', core: '255, 200, 80', phase: 0.9 },
      // Seed Thumper cannon bore ember glow
      { x: 0.882, y: 0.580, rx: 0.042, ry: 0.052, color: '234, 179, 8', core: '255, 215, 100', phase: 1.8 }
    ],
    auraPrimary: '#f59e0b',
    auraSecondary: '#84cc16'
  },

  volt: {
    id: 'volt',
    src: 'assets/char-volt-beauty.png',
    xPivot: 0.485,
    earZoneEnd: 0.220,
    headZoneStart: 0.16,
    headZoneEnd: 0.35,
    torsoZoneStart: 0.33,
    torsoZoneEnd: 0.60,
    kneeZoneStart: 0.58,
    kneeZoneEnd: 0.82,
    bootLockStart: 0.82,
    bottomY: 0.978,
    earAmplitudeLeft: 10.8,
    earAmplitudeRight: 7.5,
    earFreqLeft: 3.6,
    earFreqRight: 3.3,
    breathRate: 3.0,
    furLidTop: '#e7e2f3',
    furLidMid: '#d8d0ec',
    furLidShadow: '#ae9fcc',
    lashColor: '#1b122e',
    irisGlintColor: 'rgba(240, 248, 255, 0.92)',
    eyes: [
      // Viewer's left eye
      { cx: 0.478, cy: 0.250, rx: 0.040, ry: 0.025, rot: 0.18, glintX: 0.468, glintY: 0.242 },
      // Viewer's right eye
      { cx: 0.594, cy: 0.276, rx: 0.031, ry: 0.023, rot: 0.22, glintX: 0.586, glintY: 0.268 }
    ],
    weaponGlows: [
      // Arc Fork central magenta core ring
      { x: 0.612, y: 0.522, rx: 0.046, ry: 0.046, color: '255, 42, 157', core: '255, 210, 245', phase: 0.0 },
      // Arc Fork upper plasma coil
      { x: 0.785, y: 0.495, rx: 0.048, ry: 0.026, color: '255, 20, 147', core: '255, 230, 255', phase: 0.5 },
      // Arc Fork lower plasma coil
      { x: 0.775, y: 0.570, rx: 0.048, ry: 0.026, color: '255, 20, 147', core: '255, 230, 255', phase: 1.0 },
      // Twin-disc backpack upper & lower cores
      { x: 0.268, y: 0.375, rx: 0.036, ry: 0.040, color: '217, 70, 239', core: '255, 200, 255', phase: 1.5 },
      { x: 0.252, y: 0.452, rx: 0.036, ry: 0.040, color: '217, 70, 239', core: '255, 200, 255', phase: 2.1 },
      // Forearm neon strip
      { x: 0.392, y: 0.478, rx: 0.046, ry: 0.018, color: '0, 229, 255', core: '255, 120, 220', phase: 0.8 }
    ],
    auraPrimary: '#ff2a9d',
    auraSecondary: '#00e5ff'
  }
};

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export class HeroAnimator {
  constructor() {
    if (window.__BUNNY_HERO_ANIMATOR_INSTANCE__) {
      return window.__BUNNY_HERO_ANIMATOR_INSTANCE__;
    }
    window.__BUNNY_HERO_ANIMATOR_INSTANCE__ = this;

    this.currentFighterId = 'pip';
    this.activeScreen = 'main-menu';
    this.time = 0;
    this.lastFrameTime = performance.now() / 1000;
    this._lastExternalUpdateMs = 0;

    // Loaded HTMLImageElement cache per fighterId
    this.images = {};
    this.imageLoaded = {};

    // Interactive mouse parallax state (-1..1)
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.headVelX = 0;
    this.earLagX = 0;

    // Drag inspection angle on Character Select stage
    this.stageDragOffset = 0;
    this.isDraggingStage = false;
    this.dragLastX = 0;

    // Natural eye blink state machine
    this.blinkTimer = 2.4;
    this.blinkDuration = 0.145;
    this.blinkProgress = 0; // 0 = open, 0..1 = blinking
    this.isBlinking = false;
    this.pendingDoubleBlink = false;

    // Emote state machine ('select' | 'ready' | 'victory')
    this.emoteType = null;
    this.emoteTimer = 0;
    this.emoteDuration = 0.68;

    // Dynamic character-specific aura particles
    this.particles = [];
    this.bootRings = [];
    this.ringSpawnTimer = 0;

    // Attached canvas slots
    this.slots = [];

    this._injectStyles();
    this._preloadFighterImages();
    this._attachHeroCanvases();
    this._bindInteractions();
    this._initParticles();
    this._startLoop();
  }

  _injectStyles() {
    if (document.getElementById('live-hero-animator-styles')) return;
    const style = document.createElement('style');
    style.id = 'live-hero-animator-styles';
    style.textContent = `
      .live-hero-canvas {
        position: relative;
        z-index: 3;
        width: auto;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 2 / 3;
        object-fit: contain;
        object-position: center bottom;
        pointer-events: none;
        display: block;
        transform-origin: center bottom;
        filter:
          drop-shadow(0 16px 28px rgba(0, 0, 0, 0.76))
          drop-shadow(0 0 16px rgba(0, 229, 255, 0.18));
      }
      #screen-victory .live-hero-canvas {
        filter:
          drop-shadow(0 18px 32px rgba(0, 0, 0, 0.8))
          drop-shadow(0 0 22px rgba(255, 175, 20, 0.28));
      }
      #screen-defeat .live-hero-canvas {
        filter:
          drop-shadow(0 18px 32px rgba(0, 0, 0, 0.84))
          drop-shadow(0 0 16px rgba(120, 90, 255, 0.22));
      }
      img.hero-static-hidden {
        opacity: 0 !important;
        position: absolute !important;
        inset: 0 !important;
        margin: auto !important;
        pointer-events: none !important;
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  _preloadFighterImages() {
    Object.values(FIGHTER_RIG_PROFILES).forEach((profile) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.imageLoaded[profile.id] = true;
        this._syncHiddenStateForLoadedImages();
      };
      img.src = profile.src;
      this.images[profile.id] = img;
    });
  }

  _syncHiddenStateForLoadedImages() {
    if (!this.imageLoaded[this.currentFighterId]) return;
    this.slots.forEach((slot) => {
      if (slot.imgEl && !slot.imgEl.classList.contains('hero-static-hidden')) {
        slot.imgEl.classList.add('hero-static-hidden');
      }
    });
  }

  _detectFighterFromSrc(src) {
    if (!src) return null;
    const s = src.toLowerCase();
    if (s.includes('bruno')) return 'bruno';
    if (s.includes('volt')) return 'volt';
    if (s.includes('pip')) return 'pip';
    return null;
  }

  _attachHeroCanvases() {
    // Resolution 768x1152 matches 1024x1536 (2:3) with crisp high-DPI fidelity & 60 FPS speed
    const CANVAS_W = 768;
    const CANVAS_H = 1152;

    HERO_SLOTS.forEach((slotDef) => {
      const imgEl = document.getElementById(slotDef.imgId);
      if (!imgEl) return;

      const parent = imgEl.parentElement;
      if (!parent) return;

      // Reuse existing live-hero-canvas if already present
      let canvas = parent.querySelector('canvas.live-hero-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'live-hero-canvas';
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        canvas.setAttribute('aria-hidden', 'true');
        parent.insertBefore(canvas, imgEl.nextSibling);
      }

      const ctx = canvas.getContext('2d');
      const initialFighter = this._detectFighterFromSrc(imgEl.getAttribute('src')) || 'pip';
      this.currentFighterId = initialFighter;

      // Observe src changes on the static <img> in case main.js or menuController.js sets img.src
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'src') {
            const detected = this._detectFighterFromSrc(imgEl.getAttribute('src'));
            if (detected && detected !== this.currentFighterId) {
              this.setFighter(detected);
            }
          }
        }
      });
      observer.observe(imgEl, { attributes: true, attributeFilter: ['src'] });

      this.slots.push({
        ...slotDef,
        imgEl,
        parent,
        canvas,
        ctx
      });
    });

    this._syncHiddenStateForLoadedImages();
  }

  _bindInteractions() {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
      this.targetMouseX = clamp(nx, -1, 1);
      this.targetMouseY = clamp(ny, -1, 1);

      if (this.isDraggingStage) {
        const dx = e.clientX - this.dragLastX;
        this.dragLastX = e.clientX;
        this.stageDragOffset = clamp(this.stageDragOffset + dx * 0.14, -22, 22);
      }
    }, { passive: true });

    const stageEl = document.getElementById('char-stage-interactive');
    if (stageEl) {
      stageEl.addEventListener('mousedown', (e) => {
        this.isDraggingStage = true;
        this.dragLastX = e.clientX;
        this.triggerEmote('ready');
      });
      window.addEventListener('mouseup', () => {
        this.isDraggingStage = false;
      });
    }

    // Trigger energetic ear-perk & hop-squash emote on primary CTA hover & roster clicks
    const ctaIds = [
      'btn-menu-play',
      'btn-menu-select',
      'btn-select-confirm',
      'btn-lock-in',
      'btn-briefing-deploy',
      'btn-launch-drop',
      'btn-victory-continue',
      'btn-victory-replay',
      'btn-defeat-retry',
      'btn-defeat-change'
    ];

    ctaIds.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('mouseenter', () => {
          this.triggerEmote('ready');
        });
      }
    });

    document.querySelectorAll('.roster-card').forEach((card) => {
      card.addEventListener('click', () => {
        const charId = card.dataset.char;
        if (charId) {
          this.setFighter(charId);
        }
      });
      card.addEventListener('mouseenter', () => {
        if (card.dataset.char === this.currentFighterId) {
          this.triggerEmote('ready');
        }
      });
    });
  }

  _initParticles() {
    this.particles = [];
    for (let i = 0; i < 24; i++) {
      this.particles.push(this._createParticle(true));
    }
    this.bootRings = [];
  }

  _createParticle(randomY = false) {
    return {
      x: 0.18 + Math.random() * 0.64,
      y: randomY ? 0.15 + Math.random() * 0.78 : 0.80 + Math.random() * 0.14,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(0.09 + Math.random() * 0.16),
      size: 2.2 + Math.random() * 4.2,
      alpha: 0.4 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      life: randomY ? Math.random() : 0,
      maxLife: 1.6 + Math.random() * 1.8,
      isSecondary: Math.random() > 0.55
    };
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  setFighter(fighterId) {
    const normId = (fighterId || 'pip').toLowerCase();
    if (!FIGHTER_RIG_PROFILES[normId]) return;

    const changed = this.currentFighterId !== normId;
    this.currentFighterId = normId;
    this._syncHiddenStateForLoadedImages();

    if (changed) {
      this.triggerEmote('select');
    }
  }

  triggerEmote(type = 'select') {
    const norm = (type || 'select').toLowerCase();
    if (FIGHTER_RIG_PROFILES[norm]) {
      this.currentFighterId = norm;
      this.emoteType = 'select';
    } else if (norm === 'ready' || norm === 'victory' || norm === 'select') {
      this.emoteType = norm;
    } else {
      this.emoteType = 'select';
    }

    this.emoteTimer = 0;
    this.emoteDuration = this.emoteType === 'select' ? 0.72 : (this.emoteType === 'victory' ? 0.88 : 0.56);

    // Trigger a natural blink and spawn an energetic ground ring on emote start
    if (!this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }

    this.bootRings.push({
      progress: 0,
      speed: this.emoteType === 'select' ? 1.55 : 1.25,
      strong: true
    });
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

  update(dt, activeScreen, _isInternal = false) {
    if (!_isInternal) {
      this._lastExternalUpdateMs = performance.now();
    }
    const clampedDt = clamp(dt || 0.016, 0.001, 0.05);
    this.time += clampedDt;
    this.activeScreen = activeScreen ? this._normalizeScreen(activeScreen) : this._detectActiveScreen();

    // Pause heavy canvas work when in active 3D gameplay or pause modal
    if (this.activeScreen === 'game' || this.activeScreen === 'pause') {
      return;
    }

    // Smooth mouse-look damping & spring-lag ear velocity
    const prevMouseX = this.mouseX;
    this.mouseX += (this.targetMouseX - this.mouseX) * Math.min(1, clampedDt * 7.5);
    this.mouseY += (this.targetMouseY - this.mouseY) * Math.min(1, clampedDt * 7.5);
    const instVelX = (this.mouseX - prevMouseX) / clampedDt;
    this.headVelX += (instVelX - this.headVelX) * Math.min(1, clampedDt * 10.0);
    this.earLagX += (-this.headVelX * 5.5 - this.earLagX) * Math.min(1, clampedDt * 8.0);

    if (!this.isDraggingStage) {
      this.stageDragOffset *= Math.pow(0.08, clampedDt);
    }

    // Update natural eye blink state machine (every 3.2 - 5.0s + double-blinks)
    if (this.isBlinking) {
      this.blinkProgress += clampedDt / this.blinkDuration;
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkProgress = 0;
        if (this.pendingDoubleBlink) {
          this.pendingDoubleBlink = false;
          this.blinkTimer = 0.13;
        } else {
          this.blinkTimer = 3.2 + Math.random() * 1.8;
          this.pendingDoubleBlink = Math.random() < 0.28;
        }
      }
    } else {
      this.blinkTimer -= clampedDt;
      if (this.blinkTimer <= 0) {
        this.isBlinking = true;
        this.blinkProgress = 0;
      }
    }

    // Update emote timer
    if (this.emoteType) {
      this.emoteTimer += clampedDt;
      if (this.emoteTimer >= this.emoteDuration) {
        this.emoteType = null;
        this.emoteTimer = 0;
      }
    }

    // Update character-specific aura particles & boot rings
    this._updateParticles(clampedDt);

    // Render only the slot(s) belonging to the currently visible screen
    const profile = FIGHTER_RIG_PROFILES[this.currentFighterId] || FIGHTER_RIG_PROFILES.pip;
    const img = this.images[profile.id];
    if (!img || !this.imageLoaded[profile.id]) return;

    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.screenId === this.activeScreen) {
        this._renderHeroSlot(slot, profile, img);
      }
    }
  }

  _updateParticles(dt) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife || p.y < 0.06) {
        this.particles[i] = this._createParticle(false);
        continue;
      }
      p.x += (p.vx + Math.sin(this.time * 2.4 + p.phase) * 0.025) * dt;
      p.y += p.vy * dt;
    }

    this.ringSpawnTimer -= dt;
    if (this.ringSpawnTimer <= 0) {
      this.ringSpawnTimer = this.currentFighterId === 'bruno' ? 1.35 : 1.05;
      this.bootRings.push({
        progress: 0,
        speed: 0.72,
        strong: false
      });
    }

    for (let i = this.bootRings.length - 1; i >= 0; i--) {
      this.bootRings[i].progress += dt * this.bootRings[i].speed;
      if (this.bootRings[i].progress >= 1) {
        this.bootRings.splice(i, 1);
      }
    }
  }

  // ==========================================================================
  // MULTI-ZONE 2.5D MESH DEFORMATION & LAYERED CHARACTER RENDERING
  // ==========================================================================

  _computeEmoteOffsets() {
    if (!this.emoteType) {
      return { hopSquashY: 0, chestScale: 0, earPerkY: 0, earWiggleX: 0, weaponSurge: 0 };
    }
    const u = clamp(this.emoteTimer / this.emoteDuration, 0, 1);

    if (this.emoteType === 'select') {
      // Phase 1 (0..0.22): Quick crouch squash (dy > 0)
      // Phase 2 (0.22..0.62): Energetic upward hop-extension (dy < 0) + ear perk
      // Phase 3 (0.62..1.0): Cushion settle back to idle
      const hopWave = Math.sin(u * Math.PI * 2.0) * (1 - u);
      const earPerk = -Math.sin(u * Math.PI) * 18.0 * (1 - 0.3 * u);
      const earWiggle = Math.sin(u * Math.PI * 5.0) * (1 - u) * 14.0;
      return {
        hopSquashY: -hopWave * 16.0,
        chestScale: Math.sin(u * Math.PI) * 0.026,
        earPerkY: earPerk,
        earWiggleX: earWiggle,
        weaponSurge: Math.sin(u * Math.PI)
      };
    }

    // 'ready' or 'victory' emote
    const pulse = Math.sin(u * Math.PI);
    const wiggle = Math.sin(u * Math.PI * 4.0) * (1 - u);
    return {
      hopSquashY: -Math.sin(u * Math.PI * 2.0) * (1 - u) * 10.5,
      chestScale: pulse * 0.020,
      earPerkY: -pulse * 14.0,
      earWiggleX: wiggle * 11.0,
      weaponSurge: pulse * 0.85
    };
  }

  _evalMeshZoneAtY(yNorm, profile, emote, mode) {
    const t = this.time;
    const wRate = mode === 'victory' ? profile.breathRate * 1.22 : (mode === 'defeat' ? profile.breathRate * 0.78 : profile.breathRate);

    // 1. Planted Boots (y: 0.82..1.00): 100% locked to ground (dx = 0, dy = 0)
    const groundFree = 1.0 - smoothstep(profile.bootLockStart - 0.04, profile.bootLockStart + 0.015, yNorm);
    if (groundFree <= 0.0001) {
      return {
        dxCenter: 0,
        dy: 0,
        scaleLeft: 1,
        scaleRight: 1,
        leftExtraDx: 0,
        rightExtraDx: 0
      };
    }

    // 2. Knees & Hips (y: 0.58..0.82): Rhythmic knee-bend bounce (sin(t * 2.8) * 4px)
    const kneeWeight = smoothstep(profile.bootLockStart, profile.kneeZoneStart + 0.04, yNorm);
    const kneeBounceDy = (Math.sin(t * wRate) * 4.4 + emote.hopSquashY * 0.55) * kneeWeight;
    const hipSwayDx = (Math.sin(t * (wRate * 0.5)) * 2.6 + this.mouseX * 4.0 + this.stageDragOffset * 0.25) * kneeWeight;

    // 3. Torso, Shoulders & Weapon (y: 0.34..0.58): Deep chest breathing expansion & vertical breath rise
    const torsoBand = smoothstep(profile.torsoZoneEnd + 0.06, profile.torsoZoneEnd - 0.06, yNorm) *
                      smoothstep(profile.headZoneStart + 0.02, profile.torsoZoneStart + 0.04, yNorm);
    const upperCarry = smoothstep(profile.kneeZoneEnd - 0.04, profile.torsoZoneEnd - 0.04, yNorm);

    const breathExpansion = (Math.sin(t * wRate) * 0.016 + emote.chestScale) * torsoBand;
    const breathRiseDy = (Math.sin(t * wRate - 0.3) * 7.2 + emote.hopSquashY * 0.45) * upperCarry;
    const torsoSwayDx = (Math.sin(t * (wRate * 0.5) - 0.25) * 4.2 + this.mouseX * 7.5 + this.stageDragOffset * 0.55) * upperCarry;

    // Secondary weapon barrel sway on the right half (y: 0.40..0.70)
    const weaponBand = smoothstep(0.36, 0.48, yNorm) * (1.0 - smoothstep(0.64, 0.74, yNorm));
    const weaponSwayDx = (Math.sin(t * wRate - 0.75) * 5.2 + this.mouseX * 5.0 + emote.weaponSurge * 6.0) * weaponBand;

    // 4. Head & Expressive Face (y: 0.18..0.36): Head tilt/nod + interactive mouse-look parallax
    const headCarry = smoothstep(profile.torsoZoneStart + 0.03, profile.headZoneEnd - 0.04, yNorm);
    const headNodDy = (Math.sin(t * 1.9) * 4.2 + this.mouseY * 6.5) * headCarry;
    const headLookDx = (Math.sin(t * 1.45 + 0.4) * 4.0 + this.mouseX * 9.5 + this.stageDragOffset * 0.4) * headCarry;

    // 5. Articulated Rabbit Ears (y: 0.00..0.22): Independent left & right ear wind sway + spring-lag
    const earFactor = Math.pow(clamp((profile.earZoneEnd - yNorm) / profile.earZoneEnd, 0, 1), 1.35);
    const yPhase = (profile.earZoneEnd - yNorm) * 14.0;

    const leftEarWave = (
      Math.sin(t * profile.earFreqLeft - yPhase) * profile.earAmplitudeLeft +
      Math.cos(t * (profile.earFreqLeft * 0.62) + 0.8) * 3.5 +
      this.earLagX * 1.15 +
      emote.earWiggleX
    ) * earFactor;

    const rightEarWave = (
      Math.sin(t * profile.earFreqRight - yPhase + 1.65) * profile.earAmplitudeRight +
      Math.sin(t * (profile.earFreqRight * 0.58) - 0.7) * 4.0 +
      this.earLagX * 1.15 -
      emote.earWiggleX * 0.9
    ) * earFactor;

    const earPerkDy = (emote.earPerkY - Math.abs(Math.sin(t * profile.earFreqLeft)) * 2.5) * earFactor;

    return {
      dxCenter: (hipSwayDx + torsoSwayDx + headLookDx) * groundFree,
      dy: (kneeBounceDy + breathRiseDy + headNodDy + earPerkDy) * groundFree,
      scaleLeft: 1.0 + breathExpansion * groundFree,
      scaleRight: 1.0 + breathExpansion * groundFree,
      leftExtraDx: leftEarWave * groundFree,
      rightExtraDx: (rightEarWave + weaponSwayDx) * groundFree
    };
  }

  _renderHeroSlot(slot, profile, img) {
    const { ctx, canvas, mode } = slot;
    const cw = canvas.width;
    const ch = canvas.height;
    const srcW = img.naturalWidth || 1024;
    const srcH = img.naturalHeight || 1536;
    const scaleX = cw / srcW;
    const scaleY = ch / srcH;

    ctx.clearRect(0, 0, cw, ch);

    // 1. Back Layer: Boot Ground Aura & Rising Character Particles behind Hero
    this._renderBootRings(ctx, cw, ch, profile, false);
    this._renderAuraParticles(ctx, cw, ch, profile, false);

    // 2. Main Layer: 88-Strip Continuous Split-Pivot 2.5D Mesh Deformation
    const NUM_STRIPS = 88;
    const emote = this._computeEmoteOffsets();
    const xPivotNorm = profile.xPivot;
    const srcPivotX = xPivotNorm * srcW;
    const srcRightW = srcW - srcPivotX;

    // Slight top padding (18px in canvas space) so upward ear-perk emotes never clip at y=0,
    // while keeping the bottom boot soles planted at their exact canvas bottom anchor
    const topHeadroom = 18;
    const usableH = ch - topHeadroom;

    let prevYNorm = 0;
    let prevZone = this._evalMeshZoneAtY(0, profile, emote, mode);
    let prevDestY = topHeadroom + prevZone.dy * scaleY;

    for (let i = 0; i < NUM_STRIPS; i++) {
      const nextYNorm = (i + 1) / NUM_STRIPS;
      const nextZone = this._evalMeshZoneAtY(nextYNorm, profile, emote, mode);

      // Compress headroom smoothly across the upper image while keeping bottom (yNorm=1) fixed at ch
      const baseNextY = topHeadroom * (1 - nextYNorm) + nextYNorm * ch;
      const nextDestY = baseNextY + nextZone.dy * scaleY;

      const sy = prevYNorm * srcH;
      const sh = Math.min(srcH - sy, (srcH / NUM_STRIPS) + 1.5);
      const dy = prevDestY;
      const dh = Math.max(1, (nextDestY - prevDestY) + 0.95);

      // Midpoint horizontal deformation for this strip
      const dxCenter = 0.5 * (prevZone.dxCenter + nextZone.dxCenter) * scaleX;
      const scaleL = 0.5 * (prevZone.scaleLeft + nextZone.scaleLeft);
      const scaleR = 0.5 * (prevZone.scaleRight + nextZone.scaleRight);
      const leftExtra = 0.5 * (prevZone.leftExtraDx + nextZone.leftExtraDx) * scaleX;
      const rightExtra = 0.5 * (prevZone.rightExtraDx + nextZone.rightExtraDx) * scaleX;

      const destPivotX = xPivotNorm * cw + dxCenter;
      const baseLeftW = xPivotNorm * cw * scaleL;
      const baseRightW = (1 - xPivotNorm) * cw * scaleR;

      const destLeftX = destPivotX - baseLeftW + leftExtra;
      const destLeftW = Math.max(1, destPivotX - destLeftX);
      const destRightW = Math.max(1, baseRightW + rightExtra);

      // Left Half (0 .. xPivot) — shares exact destPivotX edge with Right Half (zero seam!)
      ctx.drawImage(
        img,
        0, sy, srcPivotX, sh,
        destLeftX, dy, destLeftW + 0.45, dh
      );

      // Right Half (xPivot .. srcW)
      ctx.drawImage(
        img,
        srcPivotX, sy, srcRightW, sh,
        destPivotX, dy, destRightW, dh
      );

      prevYNorm = nextYNorm;
      prevZone = nextZone;
      prevDestY = nextDestY;
    }

    // Helper to map normalized (nx, ny) on the source image to current deformed canvas coordinates
    const mapPoint = (nx, ny) => {
      const z = this._evalMeshZoneAtY(ny, profile, emote, mode);
      const baseY = topHeadroom * (1 - ny) + ny * ch;
      const py = baseY + z.dy * scaleY;
      const pivotX = xPivotNorm * cw + z.dxCenter * scaleX;
      let px;
      if (nx <= xPivotNorm) {
        const leftW = xPivotNorm * cw * z.scaleLeft;
        const leftX = pivotX - leftW + z.leftExtraDx * scaleX;
        const tLeft = nx / Math.max(0.001, xPivotNorm);
        px = leftX + tLeft * (pivotX - leftX);
      } else {
        const rightW = (1 - xPivotNorm) * cw * z.scaleRight + z.rightExtraDx * scaleX;
        const tRight = (nx - xPivotNorm) / Math.max(0.001, 1 - xPivotNorm);
        px = pivotX + tRight * rightW;
      }
      return { x: px, y: py };
    };

    // 3. Expressive Face Overlay: Natural Fur-Matched Eye Blinking & Live Specular Eye Glints
    this._renderEyeBlinkAndGlint(ctx, cw, ch, profile, mapPoint);

    // 4. Weapon Core Glow Pulse & Volt's Crackling Plasma Lightning Arcs
    this._renderWeaponGlows(ctx, cw, ch, profile, mapPoint, emote);
    if (profile.id === 'volt') {
      this._renderVoltLightningArcs(ctx, cw, ch, mapPoint, emote);
    }

    // 5. Front Layer: Foreground Boot Rings & Aura Sparks
    this._renderBootRings(ctx, cw, ch, profile, true);
    this._renderAuraParticles(ctx, cw, ch, profile, true);
  }

  _renderEyeBlinkAndGlint(ctx, cw, ch, profile, mapPoint) {
    // Smooth sine closure curve: 0 -> 1 -> 0 over blinkProgress
    const blinkClosure = this.isBlinking
      ? Math.sin(clamp(this.blinkProgress, 0, 1) * Math.PI)
      : 0;

    for (let i = 0; i < profile.eyes.length; i++) {
      const eye = profile.eyes[i];
      const center = mapPoint(eye.cx, eye.cy);
      const rx = eye.rx * cw;
      const ry = eye.ry * ch;

      // Subtle live eye highlight glint that shifts slightly with mouse gaze when eyes are open
      if (blinkClosure < 0.55) {
        const glintPos = mapPoint(eye.glintX, eye.glintY);
        const gx = glintPos.x + this.mouseX * 2.4;
        const gy = glintPos.y + this.mouseY * 1.8;
        ctx.save();
        ctx.fillStyle = profile.irisGlintColor;
        ctx.beginPath();
        ctx.arc(gx, gy, Math.max(2.0, rx * 0.11), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (blinkClosure <= 0.02) continue;

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(eye.rot);

      // Clip to expanded almond eye socket shape
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 1.08, ry * 1.15, 0, 0, Math.PI * 2);
      ctx.clip();

      // Upper eyelid descending from -ry*1.25 down to +ry*0.85
      const lidBottomY = -ry * 1.15 + blinkClosure * (ry * 2.05);
      const grad = ctx.createLinearGradient(0, -ry * 1.2, 0, lidBottomY);
      grad.addColorStop(0, profile.furLidTop);
      grad.addColorStop(0.68, profile.furLidMid);
      grad.addColorStop(1, profile.furLidShadow);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-rx * 1.25, -ry * 1.35);
      ctx.lineTo(rx * 1.25, -ry * 1.35);
      ctx.lineTo(rx * 1.25, lidBottomY);
      ctx.quadraticCurveTo(0, lidBottomY + ry * 0.28 * blinkClosure, -rx * 1.25, lidBottomY);
      ctx.closePath();
      ctx.fill();

      // Lower eyelid rising slightly from bottom during full blink
      const lowerTopY = ry * 1.20 - blinkClosure * (ry * 0.55);
      ctx.fillStyle = profile.furLidMid;
      ctx.beginPath();
      ctx.moveTo(-rx * 1.2, ry * 1.35);
      ctx.lineTo(rx * 1.2, ry * 1.35);
      ctx.lineTo(rx * 1.2, lowerTopY);
      ctx.quadraticCurveTo(0, lowerTopY - ry * 0.12, -rx * 1.2, lowerTopY);
      ctx.closePath();
      ctx.fill();

      // Curved dark upper eyelash line moving with the upper lid margin
      ctx.strokeStyle = profile.lashColor;
      ctx.lineWidth = Math.max(2.5, ry * 0.22);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-rx * 1.02, lidBottomY - ry * 0.08);
      ctx.quadraticCurveTo(0, lidBottomY + ry * 0.26 * blinkClosure, rx * 1.02, lidBottomY - ry * 0.04);
      ctx.stroke();

      ctx.restore();
    }
  }

  _renderWeaponGlows(ctx, cw, ch, profile, mapPoint, emote) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < profile.weaponGlows.length; i++) {
      const g = profile.weaponGlows[i];
      const pt = mapPoint(g.x, g.y);
      const pulse = 0.62 + 0.38 * Math.sin(this.time * 4.2 + g.phase) + emote.weaponSurge * 0.35;
      const rx = g.rx * cw * (0.92 + 0.16 * pulse);
      const ry = g.ry * ch * (0.92 + 0.16 * pulse);
      const radius = Math.max(rx, ry);

      const grad = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, radius);
      grad.addColorStop(0, `rgba(${g.core}, ${clamp(0.42 * pulse, 0, 0.75)})`);
      grad.addColorStop(0.45, `rgba(${g.color}, ${clamp(0.26 * pulse, 0, 0.55)})`);
      grad.addColorStop(1, `rgba(${g.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _renderVoltLightningArcs(ctx, cw, ch, mapPoint, emote) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Twin jagged plasma arcs crackling across the Arc Fork prongs
    const upperProngA = mapPoint(0.845, 0.492);
    const lowerProngA = mapPoint(0.838, 0.582);
    const upperProngB = mapPoint(0.896, 0.502);
    const lowerProngB = mapPoint(0.886, 0.592);

    this._drawElectricBolt(ctx, upperProngA.x, upperProngA.y, lowerProngA.x, lowerProngA.y, '#ff2a9d', '#00e5ff', 6, 9 + emote.weaponSurge * 5);
    this._drawElectricBolt(ctx, upperProngB.x, upperProngB.y, lowerProngB.x, lowerProngB.y, '#00e5ff', '#ffffff', 6, 11 + emote.weaponSurge * 6);

    // 2. Periodic arc jumping between Volt's twin backpack discs and shoulder coil
    if (Math.sin(this.time * 9.5) > -0.15) {
      const discTop = mapPoint(0.268, 0.375);
      const discBot = mapPoint(0.252, 0.452);
      this._drawElectricBolt(ctx, discTop.x, discTop.y, discBot.x, discBot.y, '#ff2a9d', '#80f4ff', 5, 7);
    }

    ctx.restore();
  }

  _drawElectricBolt(ctx, x1, y1, x2, y2, outerColor, coreColor, segments, jitter) {
    const pts = [{ x: x1, y: y1 }];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const nx = -dy / Math.max(1, Math.hypot(dx, dy));
    const ny = dx / Math.max(1, Math.hypot(dx, dy));

    for (let i = 1; i < segments; i++) {
      const f = i / segments;
      const wave = Math.sin(this.time * 38.0 + i * 2.3) * Math.cos(this.time * 23.0 - i * 1.7);
      const offset = wave * jitter * Math.sin(f * Math.PI);
      pts.push({
        x: x1 + dx * f + nx * offset,
        y: y1 + dy * f + ny * offset
      });
    }
    pts.push({ x: x2, y: y2 });

    // Outer plasma glow stroke
    ctx.strokeStyle = outerColor;
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // Hot white/cyan inner filament
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  _renderBootRings(ctx, cw, ch, profile, isFrontHalf) {
    const centerX = cw * 0.48;
    const baseY = ch * profile.bottomY;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.bootRings.length; i++) {
      const ring = this.bootRings[i];
      const p = ring.progress;
      const alpha = (1 - p) * (ring.strong ? 0.55 : 0.32);
      if (alpha <= 0.01) continue;

      const rx = cw * (0.24 + p * (profile.id === 'bruno' ? 0.22 : 0.16));
      const ry = ch * (0.022 + p * 0.014);
      const ryPos = baseY - (profile.id === 'pip' ? p * ch * 0.09 : p * ch * 0.025);

      ctx.strokeStyle = profile.id === 'pip'
        ? `rgba(0, 229, 255, ${alpha})`
        : (profile.id === 'bruno' ? `rgba(245, 158, 11, ${alpha})` : `rgba(255, 42, 157, ${alpha})`);
      ctx.lineWidth = ring.strong ? 3.5 : 2.2;

      ctx.beginPath();
      if (isFrontHalf) {
        ctx.ellipse(centerX, ryPos, rx, ry, 0, 0, Math.PI);
      } else {
        ctx.ellipse(centerX, ryPos, rx, ry, 0, Math.PI, Math.PI * 2);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  _renderAuraParticles(ctx, cw, ch, profile, isForeground) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.particles.length; i++) {
      // Split half behind hero and half in front for 2.5D depth
      if ((i % 2 === 0) !== isForeground) continue;

      const p = this.particles[i];
      const lifeRatio = p.life / p.maxLife;
      const fade = Math.sin(clamp(lifeRatio, 0, 1) * Math.PI);
      const alpha = p.alpha * fade;
      if (alpha <= 0.02) continue;

      const px = p.x * cw;
      const py = p.y * ch;
      const color = p.isSecondary ? profile.auraSecondary : profile.auraPrimary;

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;

      if (profile.id === 'pip') {
        // Floating carrot-energy diamond sparks & wind motes
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(this.time * 2.5 + p.phase);
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.3);
        ctx.lineTo(s * 0.85, 0);
        ctx.lineTo(0, s * 1.3);
        ctx.lineTo(-s * 0.85, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (profile.id === 'bruno') {
        // Rising golden-amber shockwave embers
        ctx.beginPath();
        ctx.arc(px, py, p.size * 1.05, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Volt electric plasma sparks
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(this.time * 4.0 + p.phase);
        const s = p.size * 1.15;
        ctx.fillRect(-s * 0.25, -s, s * 0.5, s * 2);
        ctx.fillRect(-s, -s * 0.25, s * 2, s * 0.5);
        ctx.restore();
      }
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

export const heroAnimator = new HeroAnimator();
