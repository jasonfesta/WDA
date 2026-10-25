// Bunny Royale — Interactive Menu Systems Controller
// Powers real chamfered menu UI animations, hover/click audio, keyboard navigation,
// interactive briefing map tooltips, hero stage inspection, and particle systems.

import { FIGHTER_CONFIGS } from './fighterConfig.js';
import { SoundFX } from './soundFX.js';
import { soundEngine } from './soundEngine.js';

const ZONE_INTEL = {
  '01': {
    tag: 'ZONE 01 • DROP POINT',
    wave: 'WAVE 1 / 3',
    title: 'Wave 1: Clear Raider Patrol',
    desc: 'Eliminate Raider scouts patrolling the suburban cul-de-sac and advance north toward the Carrot Market.',
    camMode: 'zone_1'
  },
  '02': {
    tag: 'ZONE 02 • MID-TOWN',
    wave: 'WAVE 2 / 3',
    title: 'Wave 2: Market Crossfire & Hoppers',
    desc: 'Clear fast-leaping Hopper squads and mid-range crossfire around the brick Carrot Market.',
    camMode: 'zone_2'
  },
  '03': {
    tag: 'ZONE 03 • BOSS ARENA',
    wave: 'WAVE 3 / 3',
    title: 'Wave 3: Defeat Foreman Boss',
    desc: 'Confront the heavily armored Foreman Boss and elite guards in the northern Service Yard.',
    camMode: 'zone_3'
  },
  exit: {
    tag: 'EXTRACTION POINT',
    wave: 'FINAL OBJECTIVE',
    title: 'Extraction Gate',
    desc: 'Breach the unlocked northern Service Yard extraction gate once the Foreman falls to complete Level 01!',
    camMode: 'map_overview'
  }
};

const ABILITY_SVGS = {
  pip: {
    small: `
      <svg viewBox="0 0 36 36" class="summary-ability-svg">
        <path d="M7 22L18 11L29 22" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M7 30L18 19L29 30" stroke="#00e5ff" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `,
    large: `
      <svg viewBox="0 0 120 80" class="briefing-ability-svg" id="briefing-ability-svg">
        <ellipse cx="42" cy="64" rx="28" ry="7" fill="none" stroke="#00e5ff" stroke-width="3.5"/>
        <ellipse cx="42" cy="56" rx="20" ry="5" fill="none" stroke="#80f4ff" stroke-width="2.5"/>
        <path d="M35 58 Q48 28 66 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M78 16 C82 6 89 4 91 7 C93 10 88 16 84 20 C90 22 94 27 92 33 C90 39 83 42 75 43 L66 54 L58 52 L63 42 C56 41 51 37 51 31 C51 25 56 21 63 20 C67 13 72 10 76 13 C77 9 77 12 78 16 Z" fill="#ffffff"/>
      </svg>
    `
  },
  bruno: {
    small: `
      <svg viewBox="0 0 36 36" class="summary-ability-svg">
        <polygon points="18,4 23,16 31,12 25,24 33,26 4,26 11,24 5,12 13,16" fill="#ffbe00"/>
        <ellipse cx="18" cy="29" rx="14" ry="3.5" fill="none" stroke="#ff6600" stroke-width="2.5"/>
      </svg>
    `,
    large: `
      <svg viewBox="0 0 120 80" class="briefing-ability-svg" id="briefing-ability-svg">
        <ellipse cx="60" cy="64" rx="44" ry="9" fill="none" stroke="#ff8800" stroke-width="3.5"/>
        <ellipse cx="60" cy="64" rx="28" ry="5.5" fill="none" stroke="#ffea00" stroke-width="2.5"/>
        <polygon points="60,10 69,38 86,24 76,52 94,46 80,62 40,62 26,46 44,52 34,24 51,38" fill="#ffffff" stroke="#ff8800" stroke-width="2"/>
      </svg>
    `
  },
  volt: {
    small: `
      <svg viewBox="0 0 36 36" class="summary-ability-svg">
        <ellipse cx="18" cy="16" rx="13" ry="5" fill="none" stroke="#00e5ff" stroke-width="2.5"/>
        <circle cx="18" cy="14" r="6" fill="#ff2a9d"/>
        <path d="M12 24 H24 M14 29 H22" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,
    large: `
      <svg viewBox="0 0 120 80" class="briefing-ability-svg" id="briefing-ability-svg">
        <ellipse cx="60" cy="36" rx="38" ry="11" fill="none" stroke="#00e5ff" stroke-width="3.5"/>
        <path d="M42 34 C42 20 78 20 78 34" fill="rgba(255,42,157,0.35)" stroke="#ff2a9d" stroke-width="3"/>
        <circle cx="60" cy="30" r="8" fill="#ffffff"/>
        <path d="M46 52 H74 M50 60 H70 M55 68 H65" stroke="#00e5ff" stroke-width="3.5" stroke-linecap="round"/>
      </svg>
    `
  }
};

const ARMOR_CONFIG = {
  pip: {
    label: 'LIGHT ARMOR',
    svg: `
      <svg viewBox="0 0 100 84" class="briefing-armor-svg" id="briefing-armor-svg">
        <path d="M26 16 L38 10 L50 18 L62 10 L74 16 L84 30 L76 44 L72 72 L28 72 L24 44 L16 30 Z" fill="#1b8a84" stroke="#0d253c" stroke-width="3"/>
        <path d="M34 12 C42 20 58 20 66 12 L72 22 C60 32 40 32 28 22 Z" fill="#ff6b00"/>
        <polygon points="44,34 56,34 50,44" fill="#ff7700"/>
        <rect x="32" y="48" width="36" height="14" rx="3" fill="#136360" stroke="#00e5ff" stroke-width="1.5"/>
        <rect x="22" y="56" width="10" height="14" rx="2" fill="#ff6b00"/>
        <rect x="68" y="56" width="10" height="14" rx="2" fill="#ff6b00"/>
      </svg>
    `
  },
  bruno: {
    label: 'HEAVY ARMOR',
    svg: `
      <svg viewBox="0 0 100 84" class="briefing-armor-svg" id="briefing-armor-svg">
        <path d="M18 18 L36 8 L50 14 L64 8 L82 18 L90 36 L80 50 L76 74 L24 74 L20 50 L10 36 Z" fill="#4f6232" stroke="#1e2812" stroke-width="3.5"/>
        <path d="M28 14 H72 L76 30 H24 Z" fill="#e6a817"/>
        <rect x="30" y="36" width="40" height="26" rx="4" fill="#3b4a24" stroke="#e6a817" stroke-width="2.5"/>
        <rect x="16" y="52" width="12" height="18" rx="3" fill="#e6a817"/>
        <rect x="72" y="52" width="12" height="18" rx="3" fill="#e6a817"/>
      </svg>
    `
  },
  volt: {
    label: 'TECH SUIT',
    svg: `
      <svg viewBox="0 0 100 84" class="briefing-armor-svg" id="briefing-armor-svg">
        <path d="M24 16 L38 10 L50 18 L62 10 L76 16 L86 32 L76 46 L72 72 L28 72 L24 46 L14 32 Z" fill="#233eb0" stroke="#0d184a" stroke-width="3"/>
        <path d="M32 14 L50 26 L68 14" fill="none" stroke="#ff2a9d" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="40" r="9" fill="#121e5c" stroke="#ff2a9d" stroke-width="3"/>
        <circle cx="50" cy="40" r="4" fill="#00e5ff"/>
        <path d="M30 56 H70" stroke="#00e5ff" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `
  }
};

export class MenuController {
  constructor(api) {
    this.api = api;
    this.app = api ? api.app : null;
    this.fightersOrder = ['pip', 'bruno', 'volt'];
    this.isDraggingHero = false;
    this.dragStartX = 0;
    this.heroYawOffset = 0;

    this._initParticles();
    this._hookAppMethods();
    this._bindMenuControls();
    this._bindBriefingMap();
    this._bindStageInspection();
    this._bindKeyboardNav();
    this._syncSelectedFighter(this.app ? this.app.currentFighterConfig.id : 'pip', false);
  }

  _hookAppMethods() {
    if (!this.app) return;

    // 1. Hook previewFighterInLocker for animated hero transitions & custom SVGs
    const origPreview = this.app.previewFighterInLocker.bind(this.app);
    this.app.previewFighterInLocker = (fighterId) => {
      origPreview(fighterId);
      this._syncSelectedFighter(fighterId, true);
    };

    // 2. Hook setScreen for Victory confetti, Defeat stats, and camera framing
    const origSetScreen = this.app.setScreen.bind(this.app);
    this.app.setScreen = (screenId) => {
      // Normalize 'level-briefing' alias if called externally
      const normalized = screenId === 'level-briefing' ? 'briefing' : screenId;
      origSetScreen(normalized);
      this._onScreenChanged(normalized);
    };

    // 3. Subscribe to GameState to keep HUD #carrot-count and #elim-count live
    if (this.app.gameState && typeof this.app.gameState.subscribe === 'function') {
      this.app.gameState.subscribe((state) => {
        const carrotEl = document.getElementById('carrot-count');
        if (carrotEl) carrotEl.textContent = `${state.carrotsCollected || 0}`;
        const elimEl = document.getElementById('elim-count');
        if (elimEl) elimEl.textContent = `${state.dummiesDefeated || 0}`;
      });
    }
  }

  _syncSelectedFighter(fighterId, animate = true) {
    const cfg = FIGHTER_CONFIGS[fighterId];
    if (!cfg) return;

    document.documentElement.style.setProperty('--hero-accent', cfg.accentColor || '#00e5ff');
    document.documentElement.style.setProperty('--hero-secondary', cfg.secondaryColor || '#ff6600');

    // Main Menu Hero Tag
    const tagText = document.getElementById('menu-hero-tag-text');
    if (tagText) {
      tagText.textContent = `${cfg.name} • ${cfg.title}`;
    }

    // Character Select numeric stat values
    const spVal = document.getElementById('stat-speed-val');
    if (spVal) spVal.textContent = `${cfg.stats.speed}`;
    const pwVal = document.getElementById('stat-power-val');
    if (pwVal) pwVal.textContent = `${cfg.stats.power}`;
    const tcVal = document.getElementById('stat-tech-val');
    if (tcVal) tcVal.textContent = `${cfg.stats.tech}`;

    // Update Roster cards aria-checked & active state
    document.querySelectorAll('.roster-card').forEach((card) => {
      const isSel = card.dataset.char === fighterId;
      card.classList.toggle('active', isSel);
      card.setAttribute('aria-checked', isSel ? 'true' : 'false');
    });

    // Update Ability SVGs on Character Select & Briefing
    const abilityCfg = ABILITY_SVGS[fighterId] || ABILITY_SVGS.pip;
    const smallAbilityBox = document.getElementById('stage-ability-icon-box');
    if (smallAbilityBox) {
      smallAbilityBox.innerHTML = abilityCfg.small;
    }
    const largeAbilityBox = document.getElementById('briefing-ability-visual');
    if (largeAbilityBox) {
      largeAbilityBox.innerHTML = abilityCfg.large;
    }

    // Update Armor SVG & Label on Briefing (Pip: LIGHT ARMOR, Bruno: HEAVY ARMOR, Volt: TECH SUIT)
    const armorCfg = ARMOR_CONFIG[fighterId] || ARMOR_CONFIG.pip;
    const armorVisual = document.getElementById('briefing-armor-visual');
    if (armorVisual) {
      armorVisual.innerHTML = armorCfg.svg;
    }
    const armorLabel = document.getElementById('briefing-armor-label');
    if (armorLabel) {
      armorLabel.textContent = armorCfg.label;
    }

    // Trigger entrance slide/scale animation on Center Stage figure
    if (animate) {
      const wrap = document.getElementById('stage-hero-figure-wrap');
      if (wrap) {
        wrap.classList.remove('switching-in');
        void wrap.offsetWidth;
        wrap.classList.add('switching-in');
      }
    }
  }

  _onScreenChanged(screenId) {
    if (screenId === 'victory') {
      const gs = this.app ? this.app.gameState : null;
      const elims = gs && gs.dummiesDefeated > 0 ? gs.dummiesDefeated : 12;
      const hits = gs ? gs.hitsLanded : 0;
      const acc = hits > 0 ? Math.min(99, Math.max(76, 82 + (hits % 16))) : 92;

      const elimEl = document.getElementById('victory-elims');
      if (elimEl) elimEl.textContent = `${elims}`;
      const accEl = document.getElementById('victory-acc');
      if (accEl) accEl.textContent = `${acc}%`;

      this._spawnConfettiBurst();
    } else if (screenId === 'defeat') {
      const wave = this.app && this.app.waveManager ? this.app.waveManager.currentWave : 1;
      const waveEl = document.getElementById('defeat-wave-label');
      if (waveEl) waveEl.textContent = `WAVE ${wave} / 3`;
    }
  }

  _bindMenuControls() {
    // Universal UI Hover & Click Sound Effects
    const interactiveSelectors = [
      '.chamfer-game-btn',
      '.chamfer-btn',
      '.roster-card',
      '.briefing-loadout-card',
      '.briefing-zone-pin',
      '.utility-icon-btn'
    ];
    document.querySelectorAll(interactiveSelectors.join(',')).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        soundEngine.playUIHover();
      });
      el.addEventListener('mousedown', () => {
        soundEngine.playUIClick();
      });
    });

    // Character Select READY (#btn-select-confirm)
    const confirmBtn = document.getElementById('btn-select-confirm');
    if (confirmBtn && this.app) {
      confirmBtn.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-lock-in') return;
        SoundFX.playSelect();
        this.app.setScreen('briefing');
      });
    }

    // Briefing START LEVEL (#btn-briefing-deploy)
    const deployBtn = document.getElementById('btn-briefing-deploy');
    if (deployBtn && this.app) {
      deployBtn.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-launch-drop') return;
        SoundFX.playBounce();
        this.app.startGameplay();
      });
    }

    // Live 3D View Toggle on Main Menu
    const camToggleBtn = document.getElementById('btn-menu-BackdropToggle');
    if (camToggleBtn) {
      camToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('live-3d-backdrop');
        SoundFX.playSelect();
      });
    }

    // Sync Mute SVG Icons when #btn-menu-mute is clicked
    const muteBtn = document.getElementById('btn-menu-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        setTimeout(() => {
          const isMuted = this.app ? this.app.isMuted : false;
          muteBtn.classList.toggle('is-muted', isMuted);
          const unmutedSvg = muteBtn.querySelector('.icon-unmuted');
          const mutedSvg = muteBtn.querySelector('.icon-muted');
          if (unmutedSvg) unmutedSvg.classList.toggle('hidden', isMuted);
          if (mutedSvg) mutedSvg.classList.toggle('hidden', !isMuted);
        }, 10);
      });
    }
  }

  _bindBriefingMap() {
    const viewport = document.getElementById('briefing-map-viewport');
    const mapImg = viewport ? viewport.querySelector('.briefing-map-img') : null;
    const pins = document.querySelectorAll('.briefing-zone-pin');
    const tagEl = document.getElementById('tooltip-zone-tag');
    const waveEl = document.getElementById('tooltip-wave-pill');
    const titleEl = document.getElementById('tooltip-title');
    const descEl = document.getElementById('tooltip-desc');

    this.selectedBriefingZone = '01';

    // Cleanly heal the 4 baked-in callout rectangles on env-map-v2.png so interactive HTML zone pins & top-right card never double-overlap!
    if (mapImg && !mapImg.dataset.healedBadges) {
      mapImg.dataset.healedBadges = 'true';
      const healMapBadges = () => {
        if (!mapImg.naturalWidth) return;
        const c = document.createElement('canvas');
        c.width = mapImg.naturalWidth;
        c.height = mapImg.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(mapImg, 0, 0);
        // 1. Heal baked-in '03 SERVICE YARD' (x=984, y=76, w=238, h=58) using adjacent tree/yard strip
        ctx.drawImage(mapImg, 984, 18, 238, 56, 984, 76, 238, 58);
        // 2. Heal baked-in 'EXIT ->' (x=1346, y=62, w=132, h=70) using adjacent grass/trees
        ctx.drawImage(mapImg, 1210, 52, 132, 70, 1346, 62, 132, 70);
        // 3. Heal baked-in '02 MARKET' (x=696, y=248, w=176, h=54) using adjacent roof/street
        ctx.drawImage(mapImg, 696, 304, 176, 54, 696, 248, 176, 54);
        // 4. Heal baked-in '01 NEIGHBORHOOD' (x=138, y=826, w=252, h=56) using adjacent lawn/trees
        ctx.drawImage(mapImg, 138, 884, 252, 56, 138, 826, 252, 56);
        mapImg.src = c.toDataURL('image/png');
      };
      if (mapImg.complete && mapImg.naturalWidth > 0) {
        healMapBadges();
      } else {
        mapImg.addEventListener('load', healMapBadges, { once: true });
      }
    }

    // Inject interactive 60 FPS Live Tactical Map Canvas + Live 3D Arena View Toggle inside #briefing-map-viewport
    if (viewport && !this.briefingMapCanvas) {
      const liveCanvas = document.createElement('canvas');
      liveCanvas.id = 'briefing-live-map-canvas';
      liveCanvas.className = 'briefing-live-map-canvas';
      viewport.insertBefore(liveCanvas, viewport.querySelector('.briefing-map-left-fade'));
      this.briefingMapCanvas = liveCanvas;

      const liveBtn = document.createElement('button');
      liveBtn.type = 'button';
      liveBtn.className = 'briefing-live-cam-btn';
      liveBtn.innerHTML = '🎥 LIVE 3D ZONE VIEW';
      liveBtn.title = 'Toggle Live 3D Arena Camera Preview for Selected Zone';
      liveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playSelect();
        const isLive = viewport.classList.toggle('live-3d-active');
        liveBtn.classList.toggle('active', isLive);
        liveBtn.innerHTML = isLive ? '🗺️ TACTICAL MAP VIEW' : '🎥 LIVE 3D ZONE VIEW';
        const intel = ZONE_INTEL[this.selectedBriefingZone] || ZONE_INTEL['01'];
        if (this.app && this.app.cameraRig && intel.camMode) {
          this.app.cameraRig.setMode(isLive ? intel.camMode : 'ots');
        }
      });
      viewport.appendChild(liveBtn);
    }

    const ZONE_TRANSFORMS = {
      '01': 'scale(1.08) translate(4.5%, -4.5%)',
      '02': 'scale(1.12) translate(-1.5%, 2.0%)',
      '03': 'scale(1.14) translate(-6.5%, 6.5%)',
      exit: 'scale(1.15) translate(-10.0%, 7.5%)'
    };

    const selectZone = (zoneKey, triggerCam = false, zoomMap = false) => {
      const intel = ZONE_INTEL[zoneKey];
      if (!intel) return;
      this.selectedBriefingZone = zoneKey;

      pins.forEach((p) => p.classList.toggle('active', p.dataset.zone === zoneKey));
      if (tagEl) tagEl.textContent = intel.tag;
      if (waveEl) waveEl.textContent = intel.wave;
      if (titleEl) titleEl.textContent = intel.title;
      if (descEl) descEl.textContent = intel.desc;

      if (mapImg && this.briefingMapCanvas) {
        const tf = zoomMap ? (ZONE_TRANSFORMS[zoneKey] || 'scale(1)') : 'scale(1)';
        mapImg.style.transform = tf;
        this.briefingMapCanvas.style.transform = tf;
      }

      if (triggerCam && this.app && this.app.cameraRig && intel.camMode) {
        this.app.cameraRig.setMode(intel.camMode);
      }
    };

    pins.forEach((pin) => {
      pin.addEventListener('mouseenter', () => {
        selectZone(pin.dataset.zone, false, false);
      });
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playSelect();
        selectZone(pin.dataset.zone, true, true);
      });
    });

    // Clicking directly on the tactical map selects and zooms to the nearest zone!
    if (viewport) {
      viewport.addEventListener('click', (e) => {
        if (e.target.closest('button, .briefing-loadout-card, .briefing-map-tooltip')) return;
        const rect = viewport.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
        const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
        const pts = {
          '01': [0.22, 0.78],
          '02': [0.52, 0.36],
          '03': [0.68, 0.20],
          exit: [0.88, 0.18]
        };
        let bestK = '01';
        let bestD = Infinity;
        for (const [k, [px, py]] of Object.entries(pts)) {
          const d = Math.hypot(nx - px, ny - py);
          if (d < bestD) {
            bestD = d;
            bestK = k;
          }
        }
        SoundFX.playSelect();
        selectZone(bestK, true, true);
      });
    }

    // Make < PIP / SCOUT > pedestal pill on Briefing screen cycle fighters live!
    const heroPill = document.querySelector('.briefing-hero-label-pill');
    if (heroPill && this.app) {
      heroPill.title = 'Click to Switch Fighter';
      heroPill.addEventListener('click', () => {
        const curId = this.app.currentFighterConfig.id;
        const idx = this.fightersOrder.indexOf(curId);
        const nextId = this.fightersOrder[(idx + 1) % this.fightersOrder.length];
        SoundFX.playSelect();
        this.app.previewFighterInLocker(nextId);
        if (window.__BUNNY_ROYALE__ && window.__BUNNY_ROYALE__.heroAnimator) {
          window.__BUNNY_ROYALE__.heroAnimator.triggerEmote('select');
        }
      });
    }

    // Interactive Loadout Cards on Briefing (with live sound & hero emote)
    const loadoutCards = document.querySelectorAll('.briefing-loadout-card');
    loadoutCards.forEach((card) => {
      card.addEventListener('click', () => {
        loadoutCards.forEach((c) => c.classList.remove('active-weapon-card'));
        card.classList.add('active-weapon-card');
        const cfg = this.app ? this.app.currentFighterConfig : FIGHTER_CONFIGS.pip;
        const slot = card.dataset.slot;
        if (window.__BUNNY_ROYALE__ && window.__BUNNY_ROYALE__.heroAnimator) {
          window.__BUNNY_ROYALE__.heroAnimator.triggerEmote('ready');
        }
        if (slot === '1') {
          SoundFX.playLaser(cfg.id === 'volt');
          if (tagEl) tagEl.textContent = 'SLOT 1 • PRIMARY WEAPON';
          if (waveEl) waveEl.textContent = `${cfg.weapon.damage} DMG`;
          if (titleEl) titleEl.textContent = cfg.weapon.name;
          if (descEl) descEl.textContent = `${cfg.weapon.type} — Magazine: ${cfg.weapon.magSize} / Reserve: ${cfg.weapon.reserveAmmo}.`;
        } else if (slot === '2') {
          SoundFX.playBounce();
          if (tagEl) tagEl.textContent = 'SLOT 2 • Q ABILITY';
          if (waveEl) waveEl.textContent = `${cfg.abilityCooldown}S CD`;
          if (titleEl) titleEl.textContent = cfg.abilityName;
          if (descEl) descEl.textContent = cfg.abilityDesc;
        } else if (slot === '3') {
          SoundFX.playSelect();
          const armorLabel = (ARMOR_CONFIG[cfg.id] || ARMOR_CONFIG.pip).label;
          if (tagEl) tagEl.textContent = 'SLOT 3 • PROTECTION';
          if (waveEl) waveEl.textContent = `${cfg.maxHealth} HP / ${cfg.maxShield} SHD`;
          if (titleEl) titleEl.textContent = armorLabel;
          if (descEl) descEl.textContent = `${cfg.role} chassis tuned for Carrot Cove urban combat.`;
        }
      });
    });
  }

  _bindStageInspection() {
    const stageEl = document.getElementById('char-stage-interactive');
    const figureWrap = document.getElementById('stage-hero-figure-wrap');
    if (stageEl && figureWrap) {
      stageEl.addEventListener('pointerdown', (e) => {
        this.isDraggingHero = true;
        this.dragStartX = e.clientX;
      });

      window.addEventListener('pointerup', () => {
        this.isDraggingHero = false;
        figureWrap.style.transform = '';
      });

      stageEl.addEventListener('pointermove', (e) => {
        const rect = stageEl.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        const tiltY = relX * 11;
        const tiltX = -relY * 5;
        figureWrap.style.transform = `rotateY(${tiltY.toFixed(1)}deg) rotateX(${tiltX.toFixed(1)}deg) translateX(${(relX * 6).toFixed(1)}px)`;

        if (this.isDraggingHero && this.app && this.app.characterMesh) {
          const dx = e.clientX - this.dragStartX;
          this.dragStartX = e.clientX;
          this.app.characterMesh.rotation.y += dx * 0.015;
        }
      });

      stageEl.addEventListener('pointerleave', () => {
        if (!this.isDraggingHero) {
          figureWrap.style.transform = '';
        }
      });
    }

    // Subtle Multi-Plane Parallax on Main Menu
    const mainMenu = document.getElementById('screen-main-menu');
    const heroImg = document.getElementById('menu-hero-img');
    if (mainMenu && heroImg) {
      mainMenu.addEventListener('pointermove', (e) => {
        if (!this.app || this.app.activeScreen !== 'main-menu') return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        heroImg.style.transform = `translate(${(-nx * 8).toFixed(1)}px, ${(-ny * 5).toFixed(1)}px)`;
      });
    }
  }

  _bindKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      if (!this.app) return;
      const scr = this.app.activeScreen;
      if (scr === 'game') return;

      if (scr === 'char-select') {
        const curId = this.app.currentFighterConfig.id;
        const idx = this.fightersOrder.indexOf(curId);
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          const nextId = this.fightersOrder[(idx + 1) % this.fightersOrder.length];
          SoundFX.playSelect();
          this.app.previewFighterInLocker(nextId);
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          const prevId = this.fightersOrder[(idx - 1 + this.fightersOrder.length) % this.fightersOrder.length];
          SoundFX.playSelect();
          this.app.previewFighterInLocker(prevId);
        } else if (e.code === 'Digit1') {
          SoundFX.playSelect();
          this.app.previewFighterInLocker('pip');
        } else if (e.code === 'Digit2') {
          SoundFX.playSelect();
          this.app.previewFighterInLocker('bruno');
        } else if (e.code === 'Digit3') {
          SoundFX.playSelect();
          this.app.previewFighterInLocker('volt');
        } else if (e.code === 'Enter') {
          e.preventDefault();
          SoundFX.playSelect();
          this.app.setScreen('briefing');
        } else if (e.code === 'Escape') {
          e.preventDefault();
          SoundFX.playSelect();
          this.app.setScreen('main-menu');
        }
      } else if (scr === 'briefing') {
        if (e.code === 'Enter') {
          e.preventDefault();
          SoundFX.playBounce();
          this.app.startGameplay();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          SoundFX.playSelect();
          this.app.setScreen('char-select');
        }
      }
    });
  }

  _initParticles() {
    this.menuCanvas = document.getElementById('menu-particles-canvas');
    this.confettiCanvas = document.getElementById('victory-confetti-canvas');

    this.pollenParticles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.5 + Math.random() * 2.8,
      vx: -0.00015 + Math.random() * 0.0003,
      vy: -0.00025 - Math.random() * 0.00045,
      alpha: 0.25 + Math.random() * 0.55,
      hue: Math.random() > 0.3 ? '#ffbe44' : '#00e5ff'
    }));

    this.confettiParticles = [];
    this._resizeCanvases();
    window.addEventListener('resize', () => this._resizeCanvases());
    this._animateParticles();
  }

  _resizeCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.menuCanvas) {
      this.menuCanvas.width = w;
      this.menuCanvas.height = h;
    }
    if (this.confettiCanvas) {
      this.confettiCanvas.width = w;
      this.confettiCanvas.height = h;
    }
  }

  _spawnConfettiBurst() {
    const colors = ['#ff6600', '#00e5ff', '#ffea00', '#ff2a85', '#00e640'];
    this.confettiParticles = Array.from({ length: 75 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.5,
      w: 8 + Math.random() * 10,
      h: 14 + Math.random() * 12,
      vx: -1.5 + Math.random() * 3,
      vy: 2.2 + Math.random() * 3.8,
      rot: Math.random() * Math.PI * 2,
      vrot: -0.08 + Math.random() * 0.16,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  _animateParticles() {
    requestAnimationFrame(() => this._animateParticles());

    const activeScreen = this.app ? this.app.activeScreen : 'main-menu';

    if (this.menuCanvas && activeScreen === 'main-menu') {
      const ctx = this.menuCanvas.getContext('2d');
      const w = this.menuCanvas.width;
      const h = this.menuCanvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of this.pollenParticles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.02) p.y = 1.02;
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.hue;
        ctx.shadowColor = p.hue;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (this.confettiCanvas && activeScreen === 'victory') {
      const ctx = this.confettiCanvas.getContext('2d');
      const w = this.confettiCanvas.width;
      const h = this.confettiCanvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const c of this.confettiParticles) {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vrot;
        if (c.y > h + 30) {
          c.y = -20;
          c.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    }

    // Animate 60 FPS Live Tactical Map Overlay on Level Briefing Screen
    if (this.briefingMapCanvas && activeScreen === 'briefing') {
      this._drawLiveBriefingMap();
    }
  }

  _drawLiveBriefingMap() {
    const canvas = this.briefingMapCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() * 0.001;

    // 1. Waypoint Coordinates (normalized to #briefing-map-viewport)
    const zoneCoords = {
      '01': { x: 0.34, y: 0.74, color: '#00e5ff', label: 'DROP ZONE 01' },
      '02': { x: 0.56, y: 0.42, color: '#ffaa00', label: 'MARKET CROSSFIRE' },
      '03': { x: 0.72, y: 0.24, color: '#ff3b30', label: 'FOREMAN ARENA' },
      exit: { x: 0.89, y: 0.19, color: '#00e640', label: 'EXTRACTION' }
    };

    // 2. Animated Energy Pulses Traveling Along the Tactical Route
    const routePts = [zoneCoords['01'], zoneCoords['02'], zoneCoords['03'], zoneCoords.exit];
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([12, 10]);
    ctx.lineDashOffset = -t * 38;
    ctx.beginPath();
    routePts.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x * w, pt.y * h);
      else ctx.lineTo(pt.x * w, pt.y * h);
    });
    ctx.stroke();
    ctx.restore();

    // 3. Live Animated Enemy Patrols, Bounce Pads, & Boss Radar Blips on the Map
    const patrols = [
      { x: 0.37 + Math.sin(t * 1.8) * 0.025, y: 0.68 + Math.cos(t * 1.4) * 0.02, color: '#ff3b30', r: 5.5, fov: t * 1.6 },
      { x: 0.43 + Math.cos(t * 1.5) * 0.02, y: 0.62 + Math.sin(t * 1.9) * 0.02, color: '#ff3b30', r: 5.5, fov: -t * 1.3 },
      { x: 0.54 + Math.sin(t * 2.2) * 0.03, y: 0.46 + Math.cos(t * 1.7) * 0.02, color: '#ff3b30', r: 6.0, fov: t * 2.0 },
      { x: 0.59 + Math.cos(t * 2.6) * 0.028, y: 0.41 + Math.sin(t * 2.1) * 0.022, color: '#ff2a9d', r: 7.5, isRival: true },
      { x: 0.74 + Math.sin(t * 1.1) * 0.015, y: 0.25 + Math.cos(t * 1.1) * 0.012, color: '#ffbe00', r: 9.0, isBoss: true }
    ];

    for (const u of patrols) {
      const ux = u.x * w;
      const uy = u.y * h;
      ctx.save();
      if (u.fov !== undefined) {
        ctx.fillStyle = 'rgba(255, 59, 48, 0.18)';
        ctx.beginPath();
        ctx.moveTo(ux, uy);
        ctx.arc(ux, uy, 26, u.fov - 0.45, u.fov + 0.45);
        ctx.closePath();
        ctx.fill();
      }
      if (u.isBoss) {
        const pulseR = 14 + (t * 18) % 24;
        ctx.strokeStyle = `rgba(255, 60, 40, ${Math.max(0, 1 - (pulseR - 14) / 24)})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(ux, uy, pulseR, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = u.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ux, uy, u.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 4. Glowing Rotating Target Spotlight on Currently Selected Zone
    const sel = zoneCoords[this.selectedBriefingZone || '01'] || zoneCoords['01'];
    const sx = sel.x * w;
    const sy = sel.y * h;
    ctx.save();
    const grad = ctx.createRadialGradient(sx, sy, 6, sx, sy, 68);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.26)');
    grad.addColorStop(0.65, 'rgba(255, 102, 0, 0.12)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(sx, sy);
    ctx.rotate(t * 0.9);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, 42 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function initMenuController() {
  if (window.__BUNNY_ROYALE__) {
    window.__BUNNY_ROYALE__.menuController = new MenuController(window.__BUNNY_ROYALE__);
  } else {
    setTimeout(initMenuController, 30);
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initMenuController);
} else {
  initMenuController();
}
