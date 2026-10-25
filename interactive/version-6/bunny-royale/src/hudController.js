// AAA Arena Shooter Reactive HUD Controller for Bunny Royale: Carrot Cove
// Provides Dynamic Reticle Bloom, X Hit-Marker & Elim Pop, Reload SVG Ring,
// Directional Damage Arcs, Shield-Crack & Low-HP Vignettes, Chamfered Kill Feed,
// Smooth Trailing Vitals Ghost Bars, Carrot/Elim Pills, Wave/Rival Tracker,
// and a Live 360° Scrolling Compass Strip with Threat & Objective Pips.

const COMPASS_POINTS = [
  { deg: 0, label: 'N', isCardinal: true, isNorth: true },
  { deg: 15, label: '15' },
  { deg: 30, label: '30' },
  { deg: 45, label: 'NE', isCardinal: true },
  { deg: 60, label: '60' },
  { deg: 75, label: '75' },
  { deg: 90, label: 'E', isCardinal: true },
  { deg: 105, label: '105' },
  { deg: 120, label: '120' },
  { deg: 135, label: 'SE', isCardinal: true },
  { deg: 150, label: '150' },
  { deg: 165, label: '165' },
  { deg: 180, label: 'S', isCardinal: true },
  { deg: 195, label: '195' },
  { deg: 210, label: '210' },
  { deg: 225, label: 'SW', isCardinal: true },
  { deg: 240, label: '240' },
  { deg: 255, label: '255' },
  { deg: 270, label: 'W', isCardinal: true },
  { deg: 285, label: '285' },
  { deg: 300, label: '300' },
  { deg: 315, label: 'NW', isCardinal: true },
  { deg: 330, label: '330' },
  { deg: 345, label: '345' }
];

export class HUDController {
  constructor(options = {}) {
    if (typeof window !== 'undefined' && window.__BUNNY_HUD_CONTROLLER__) {
      const existing = window.__BUNNY_HUD_CONTROLLER__;
      existing._configure(options);
      return existing;
    }

    this.gameState = null;
    this.app = null;
    this.currentSpread = 0;
    this.fireBloomBoost = 0;
    this.reloadElapsed = 0;
    this.reloadDuration = 1.2;

    this.prevHealth = 100;
    this.prevShield = 50;
    this.prevCarrots = 250;
    this.prevElims = 0;
    this.lastCompassBearingQuant = null;

    this._ensureStylesheet();
    this._injectElements();
    this._configure(options);

    if (typeof window !== 'undefined') {
      window.__BUNNY_HUD_CONTROLLER__ = this;
    }
  }

  _configure(options = {}) {
    if (!options) return;
    if (options.gameState) {
      this.gameState = options.gameState;
    } else if (options.maxHealth !== undefined && typeof options.subscribe === 'function') {
      this.gameState = options;
    }
    if (options.app) {
      this.app = options.app;
    } else if (options.scene && options.cameraRig) {
      this.app = options;
    }
  }

  _ensureStylesheet() {
    if (typeof document === 'undefined') return;
    if (!document.querySelector('link[href*="hudStyles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'src/hudStyles.css';
      document.head.appendChild(link);
    }
  }

  _injectElements() {
    if (typeof document === 'undefined') return;

    const gameContainer = document.getElementById('game-container') || document.body;
    const hudOverlay = document.getElementById('hud-overlay') || gameContainer;
    const crosshair = document.getElementById('crosshair-container') || document.getElementById('crosshair');

    // 1. Crosshair Reload SVG Ring & Elimination Badge
    if (crosshair) {
      this.crosshairEl = crosshair;
      this.hitMarkerEl = document.getElementById('hit-marker');

      if (!document.getElementById('reticle-reload-ring')) {
        const ringWrap = document.createElement('div');
        ringWrap.id = 'reticle-reload-ring';
        ringWrap.innerHTML = `
          <svg viewBox="0 0 48 48">
            <circle class="reload-track" cx="24" cy="24" r="20"></circle>
            <circle class="reload-progress" id="reticle-reload-circle" cx="24" cy="24" r="20"></circle>
          </svg>
          <span id="reticle-reload-label">RLD</span>
        `;
        crosshair.appendChild(ringWrap);
      }
      this.reloadRingEl = document.getElementById('reticle-reload-ring');
      this.reloadCircleEl = document.getElementById('reticle-reload-circle');

      if (!document.getElementById('reticle-elim-pop')) {
        const elimPop = document.createElement('div');
        elimPop.id = 'reticle-elim-pop';
        elimPop.textContent = '☠ ELIM!';
        crosshair.appendChild(elimPop);
      }
      this.elimPopEl = document.getElementById('reticle-elim-pop');
    }

    // 2. Directional Damage Arcs Layer & Shield-Crack / Low-HP Vignettes
    if (!document.getElementById('hud-damage-arcs-layer')) {
      const arcsLayer = document.createElement('div');
      arcsLayer.id = 'hud-damage-arcs-layer';
      gameContainer.appendChild(arcsLayer);
    }
    this.damageArcsLayer = document.getElementById('hud-damage-arcs-layer');

    if (!document.getElementById('shield-crack-vignette')) {
      const scVig = document.createElement('div');
      scVig.id = 'shield-crack-vignette';
      gameContainer.appendChild(scVig);
    }
    this.shieldCrackVig = document.getElementById('shield-crack-vignette');

    if (!document.getElementById('low-hp-vignette')) {
      const lowVig = document.createElement('div');
      lowVig.id = 'low-hp-vignette';
      gameContainer.appendChild(lowVig);
    }
    this.lowHpVig = document.getElementById('low-hp-vignette');

    // 3. Live Combat / Kill Feed (#hud-kill-feed in top-left below camera pills)
    if (!document.getElementById('hud-kill-feed')) {
      const killFeed = document.createElement('div');
      killFeed.id = 'hud-kill-feed';
      hudOverlay.appendChild(killFeed);
    }
    this.killFeedEl = document.getElementById('hud-kill-feed');

    // 4. Compass Threat Pips Track & Rival/Wave Status Tracker under #hud-top-center
    const topCenter = document.getElementById('hud-top-center');
    if (topCenter) {
      const ticksEl = topCenter.querySelector('.compass-ticks');
      if (!document.getElementById('hud-compass-pips-track')) {
        const pipsTrack = document.createElement('div');
        pipsTrack.id = 'hud-compass-pips-track';
        if (ticksEl && ticksEl.nextSibling) {
          topCenter.insertBefore(pipsTrack, ticksEl.nextSibling);
        } else {
          topCenter.appendChild(pipsTrack);
        }
      }
      this.compassPipsTrack = document.getElementById('hud-compass-pips-track');

      if (!document.getElementById('hud-wave-tracker')) {
        const tracker = document.createElement('div');
        tracker.id = 'hud-wave-tracker';
        tracker.innerHTML = `
          <div class="tracker-badge hostiles-badge">
            <span class="tracker-dot"></span>
            <span>HOSTILES:</span>
            <span class="tracker-val" id="hud-hostiles-count">3</span>
          </div>
          <div class="tracker-badge rivals-badge">
            <span class="tracker-dot rival-dot"></span>
            <span>RIVALS:</span>
            <span class="tracker-val" id="hud-rivals-count">2 ACTIVE</span>
          </div>
        `;
        const bossHp = document.getElementById('boss-hp-container');
        if (bossHp) {
          topCenter.insertBefore(tracker, bossHp);
        } else {
          topCenter.appendChild(tracker);
        }
      }
      this.hostilesCountEl = document.getElementById('hud-hostiles-count');
      this.rivalsCountEl = document.getElementById('hud-rivals-count');
    }

    // 5. Smooth Damage-Ghost Bars & Carrot / Elimination Pills in #hud-bottom-left
    const healthFill = document.getElementById('health-fill');
    if (healthFill && healthFill.parentElement && !document.getElementById('health-ghost-fill')) {
      const hpGhost = document.createElement('div');
      hpGhost.id = 'health-ghost-fill';
      hpGhost.className = 'stat-bar-ghost';
      hpGhost.style.width = healthFill.style.width || '100%';
      healthFill.parentElement.insertBefore(hpGhost, healthFill);
    }
    this.healthGhostEl = document.getElementById('health-ghost-fill');

    const shieldFill = document.getElementById('shield-fill');
    if (shieldFill && shieldFill.parentElement && !document.getElementById('shield-ghost-fill')) {
      const shGhost = document.createElement('div');
      shGhost.id = 'shield-ghost-fill';
      shGhost.className = 'stat-bar-ghost';
      shGhost.style.width = shieldFill.style.width || '100%';
      shieldFill.parentElement.insertBefore(shGhost, shieldFill);
    }
    this.shieldGhostEl = document.getElementById('shield-ghost-fill');

    const bottomLeft = document.getElementById('hud-bottom-left');
    if (bottomLeft && !document.getElementById('hud-vitals-pills')) {
      const pillsWrap = document.createElement('div');
      pillsWrap.id = 'hud-vitals-pills';
      pillsWrap.innerHTML = `
        <div class="vital-stat-pill carrot-pill" id="hud-carrot-pill" title="Collected Carrots">
          <span class="vital-pill-icon">🥕</span>
          <span class="vital-pill-val" id="hud-carrot-count">250</span>
        </div>
        <div class="vital-stat-pill elim-pill" id="hud-elim-pill" title="Confirmed Eliminations">
          <span class="vital-pill-icon">☠</span>
          <span class="vital-pill-val" id="hud-elim-badge">0</span>
        </div>
      `;
      bottomLeft.appendChild(pillsWrap);
    }
    this.carrotCountEl = document.getElementById('hud-carrot-count');
    this.elimBadgeEl = document.getElementById('hud-elim-badge');
    this.carrotPillEl = document.getElementById('hud-carrot-pill');
    this.elimPillEl = document.getElementById('hud-elim-pill');
  }

  /**
   * Flashes the diagonal X hit-marker and optional elimination skull badge.
   */
  triggerHitMarker(isCrit = false, isElim = false) {
    const hm = this.hitMarkerEl || document.getElementById('hit-marker');
    if (hm) {
      hm.classList.remove('hidden', 'crit', 'elim');
      hm.classList.add('visible');
      if (isCrit) hm.classList.add('crit');
      if (isElim) hm.classList.add('elim');

      clearTimeout(this._hmTimeout);
      this._hmTimeout = setTimeout(() => {
        hm.classList.remove('visible', 'crit', 'elim');
        hm.classList.add('hidden');
      }, isElim ? 210 : (isCrit ? 150 : 105));
    }

    if (isElim) {
      const pop = this.elimPopEl || document.getElementById('reticle-elim-pop');
      if (pop) {
        pop.classList.add('active');
        clearTimeout(this._elimPopTimeout);
        this._elimPopTimeout = setTimeout(() => {
          pop.classList.remove('active');
        }, 650);
      }
    }

    this.fireBloomBoost = Math.min(12, this.fireBloomBoost + 3.5);
  }

  /**
   * Spawns a directional red/orange/cyan arc around the center reticle pointing toward the attacker.
   */
  triggerDamageArc(attackerWorldPos, playerWorldPos, cameraYaw = 0, isShieldCrack = false) {
    if (!this.damageArcsLayer) {
      this.damageArcsLayer = document.getElementById('hud-damage-arcs-layer');
    }
    if (!this.damageArcsLayer) return;

    let deg = 0;
    if (attackerWorldPos && playerWorldPos && typeof attackerWorldPos.x === 'number' && typeof playerWorldPos.x === 'number') {
      const dx = attackerWorldPos.x - playerWorldPos.x;
      const dz = attackerWorldPos.z - playerWorldPos.z;
      // In Carrot Cove, North is -Z (yaw = 0). World bearing clockwise from North:
      const worldBearingRad = Math.atan2(dx, -dz);
      // Camera yaw rotates CCW, so relative clockwise angle on screen is worldBearing + cameraYaw
      const relRad = worldBearingRad + (cameraYaw || 0);
      deg = (relRad * 180) / Math.PI;
    } else if (typeof attackerWorldPos === 'number') {
      deg = attackerWorldPos;
    } else {
      deg = (Math.random() - 0.5) * 90;
    }

    const arc = document.createElement('div');
    arc.className = 'damage-arc-indicator';
    arc.style.setProperty('--arc-deg', `${deg.toFixed(1)}deg`);
    arc.style.setProperty('--arc-color', isShieldCrack ? '#00e5ff' : '#ff2a2a');
    this.damageArcsLayer.appendChild(arc);

    setTimeout(() => {
      if (arc.parentNode) arc.parentNode.removeChild(arc);
    }, 680);

    if (isShieldCrack && this.shieldCrackVig) {
      this.shieldCrackVig.classList.add('active');
      clearTimeout(this._scTimeout);
      this._scTimeout = setTimeout(() => {
        this.shieldCrackVig.classList.remove('active');
      }, 320);
    }
  }

  /**
   * Pushes a chamfered combat/kill-feed toast to #hud-kill-feed in the top-left.
   */
  pushKillFeed(killerName, victimName = null, weaponName = null, isRivalPlayer = false) {
    const feed = this.killFeedEl || document.getElementById('hud-kill-feed');
    if (!feed) return;

    const toast = document.createElement('div');
    const isBannerEvent = !victimName && !weaponName;
    const rivalFlag = Boolean(
      isRivalPlayer ||
      (victimName && /rival|bruno|volt|pip/i.test(victimName)) ||
      (killerName && /rival/i.test(killerName))
    );

    toast.className = `kill-feed-toast${rivalFlag ? ' rival-kill' : ''}${isBannerEvent ? ' wave-event' : ''}`;

    if (isBannerEvent) {
      toast.innerHTML = `<span class="kf-banner-text">⚡ ${killerName}</span>`;
    } else {
      const kName = killerName || 'PIP';
      const wName = weaponName || 'CARROT CARBINE';
      const vName = victimName || 'RAIDER';
      toast.innerHTML = `
        <span class="kf-killer">${kName}</span>
        <span class="kf-weapon-pill">[${wName}]</span>
        <span class="kf-victim">${vName}</span>
      `;
    }

    feed.appendChild(toast);

    // Keep maximum 5 feed items visible at once
    while (feed.children.length > 5) {
      feed.removeChild(feed.firstElementChild);
    }

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 360);
    }, 3500);
  }

  /**
   * Updates the 360° scrolling compass strip and renders live enemy, rival, boss, and exit pips.
   */
  updateCompass(cameraYaw = 0, playerPos = null, enemies = [], exitGatePos = null) {
    const strip = document.getElementById('hud-compass-strip');
    if (!strip) return;

    // Convert cameraYaw (CCW radians where 0 = North -Z) to clockwise compass bearing [0, 360)
    const rawDeg = ((-cameraYaw * 180) / Math.PI) % 360;
    const bearingDeg = (rawDeg + 360) % 360;

    // When facing nearly due North (within 8 deg of 0), preserve the exact canonical 12-item strip
    // from ui-gameplay-v2.png and smoothly translate for sub-step smoothness.
    const quantStep = Math.round(bearingDeg / 15) * 15 % 360;
    const fineOffsetDeg = bearingDeg - Math.round(bearingDeg / 15) * 15;
    const pxPerDeg = 1.65;

    if (this.lastCompassBearingQuant !== quantStep) {
      this.lastCompassBearingQuant = quantStep;
      // Build 11 visible markers spanning [-75 deg .. +75 deg] around quantStep
      const items = [];
      for (let offset = -75; offset <= 75; offset += 15) {
        const ptDeg = (quantStep + offset + 360) % 360;
        const pt = COMPASS_POINTS.find(p => p.deg === ptDeg) || { deg: ptDeg, label: `${ptDeg}` };
        const isCenter = offset === 0;
        if (pt.isCardinal || isCenter) {
          const idAttr = isCenter ? ' id="compass-center-label"' : '';
          const northClass = (pt.isNorth || isCenter) ? ' comp-north' : '';
          items.push(`<span class="comp-dir${northClass}"${idAttr}>${pt.label}</span>`);
        } else {
          items.push(`<span class="comp-deg">${pt.label}</span>`);
        }
      }
      strip.innerHTML = items.join('');
    }

    strip.style.transform = `translateX(${(-fineOffsetDeg * pxPerDeg).toFixed(1)}px)`;

    // Render live enemy, rival, boss, and exit pips along #hud-compass-pips-track
    const track = this.compassPipsTrack || document.getElementById('hud-compass-pips-track');
    if (!track || !playerPos) return;

    let pipsHtml = '';
    const halfFovDeg = 85;

    if (Array.isArray(enemies)) {
      for (const e of enemies) {
        if (!e || e.health <= 0) continue;
        const ePos = e.mesh ? e.mesh.position : e.position;
        if (!ePos) continue;

        const dx = ePos.x - playerPos.x;
        const dz = ePos.z - playerPos.z;
        const targetDeg = ((Math.atan2(dx, -dz) * 180) / Math.PI + 360) % 360;
        let deltaDeg = ((targetDeg - bearingDeg + 540) % 360) - 180;
        deltaDeg = Math.max(-halfFovDeg, Math.min(halfFovDeg, deltaDeg));
        const pct = 50 + (deltaDeg / halfFovDeg) * 46;

        const isBoss = e.type === 'foreman' || e.isBoss;
        const isRival = Boolean(e.isRival || e.type === 'rival' || e.rivalId);
        const pipClass = isBoss ? 'boss-pip' : (isRival ? 'rival-pip' : 'enemy-pip');
        pipsHtml += `<span class="compass-pip ${pipClass}" style="left:${pct.toFixed(1)}%"></span>`;
      }
    }

    // Exit Gate / Active Zone Objective Diamond on Compass
    const exitPos = exitGatePos || { x: 0, z: -36 };
    const edx = exitPos.x - playerPos.x;
    const edz = exitPos.z - playerPos.z;
    const exitDeg = ((Math.atan2(edx, -edz) * 180) / Math.PI + 360) % 360;
    const exitDelta = ((exitDeg - bearingDeg + 540) % 360) - 180;
    if (Math.abs(exitDelta) <= halfFovDeg) {
      const exitPct = 50 + (exitDelta / halfFovDeg) * 46;
      pipsHtml += `<span class="compass-pip exit-pip" style="left:${exitPct.toFixed(1)}%">EXIT</span>`;
    }

    track.innerHTML = pipsHtml;
  }

  /**
   * Smoothly updates crosshair reticle spread bloom and circular reload progress ring.
   */
  updateReticle(dt = 0.016, state = {}) {
    const ch = this.crosshairEl || document.getElementById('crosshair-container');
    if (!ch) return;

    const {
      isMoving = false,
      isSprinting = false,
      isAirborne = false,
      isFiring = false,
      isAiming = false,
      isReloading = false,
      reloadProgress = 0
    } = state;

    if (isFiring) {
      this.fireBloomBoost = Math.min(11, this.fireBloomBoost + dt * 42);
    } else {
      this.fireBloomBoost = Math.max(0, this.fireBloomBoost - dt * 26);
    }

    let targetSpread = 0;
    if (isMoving) targetSpread += isSprinting ? 5.5 : 3.0;
    if (isAirborne) targetSpread += 6.5;
    targetSpread += this.fireBloomBoost;
    if (isAiming) targetSpread *= 0.35;

    this.currentSpread += (targetSpread - this.currentSpread) * Math.min(1, dt * 18);
    ch.style.setProperty('--reticle-spread', `${this.currentSpread.toFixed(2)}px`);
    ch.classList.toggle('is-firing', Boolean(isFiring));
    ch.classList.toggle('is-aiming', Boolean(isAiming));

    // Reload SVG Progress Ring
    const ring = this.reloadRingEl || document.getElementById('reticle-reload-ring');
    const circle = this.reloadCircleEl || document.getElementById('reticle-reload-circle');
    if (ring && circle) {
      if (isReloading) {
        ring.classList.add('active');
        const circumference = 125.66;
        const offset = circumference * (1 - Math.max(0, Math.min(1, reloadProgress)));
        circle.style.strokeDashoffset = `${offset.toFixed(2)}`;
      } else {
        ring.classList.remove('active');
        circle.style.strokeDashoffset = '125.66';
      }
    }
  }

  /**
   * Updates trailing damage-ghost bars, low-HP vignette, and Carrot / Elim counter pills.
   */
  updateVitals(gameState) {
    if (!gameState) return;

    const hpPct = Math.max(0, Math.min(100, Math.round((gameState.health / Math.max(1, gameState.maxHealth)) * 100)));
    const shPct = Math.max(0, Math.min(100, Math.round((gameState.shield / Math.max(1, gameState.maxShield)) * 100)));

    if (this.healthGhostEl) {
      this.healthGhostEl.style.width = `${hpPct}%`;
    }
    if (this.shieldGhostEl) {
      this.shieldGhostEl.style.width = `${shPct}%`;
    }

    // Low-HP critical heartbeat vignette
    if (this.lowHpVig) {
      this.lowHpVig.classList.toggle('active', gameState.health > 0 && gameState.health <= 35);
    }

    // Carrot Counter Pill & Pop
    const carrots = gameState.carrotsCollected ?? 250;
    if (this.carrotCountEl) {
      this.carrotCountEl.textContent = `${carrots}`;
    }
    if (carrots > this.prevCarrots && this.carrotPillEl) {
      this._popElement(this.carrotPillEl);
    }
    this.prevCarrots = carrots;

    // Eliminations Pill & Pop
    const elims = gameState.dummiesDefeated ?? 0;
    if (this.elimBadgeEl) {
      this.elimBadgeEl.textContent = `${elims}`;
    }
    if (elims > this.prevElims && this.elimPillEl) {
      this._popElement(this.elimPillEl);
    }
    this.prevElims = elims;

    this.prevHealth = gameState.health;
    this.prevShield = gameState.shield;
  }

  /**
   * Updates the remaining wave hostiles and rival rabbit players tracker under #hud-top-center.
   */
  updateWaveTracker(enemies = [], waveManager = null, gameState = null) {
    const aliveEnemies = Array.isArray(enemies) ? enemies.filter(e => e && e.health > 0) : [];
    const telegraphs = (this.app && this.app.enemyAI && this.app.enemyAI.spawnTelegraphs)
      ? this.app.enemyAI.spawnTelegraphs.length
      : 0;
    const totalHostiles = aliveEnemies.length + telegraphs;

    const explicitRivals = aliveEnemies.filter(e => e.isRival || e.type === 'rival' || e.rivalId);
    const activeFighterId = (gameState && gameState.currentFighterId) || 'pip';
    const rivalNames = ['PIP', 'BRUNO', 'VOLT'].filter(n => n.toLowerCase() !== activeFighterId);

    if (this.hostilesCountEl) {
      this.hostilesCountEl.textContent = totalHostiles > 0 ? `${totalHostiles}` : 'CLEAR';
    }
    if (this.rivalsCountEl) {
      if (explicitRivals.length > 0) {
        this.rivalsCountEl.textContent = `${explicitRivals.length} ACTIVE`;
      } else {
        this.rivalsCountEl.textContent = rivalNames.join(' · ');
      }
    }
  }

  _popElement(el) {
    if (!el) return;
    el.classList.remove('pill-pop');
    void el.offsetWidth;
    el.classList.add('pill-pop');
    setTimeout(() => el.classList.remove('pill-pop'), 260);
  }

  /**
   * Master per-frame update called either directly by main.js or automatically via hook.
   */
  update(dt = 0.016, context = {}) {
    this._lastUpdateFrameTime = performance.now();

    const app = context.app || this.app || (typeof window !== 'undefined' && window.__BUNNY_ROYALE__?.app);
    const gs = context.gameState || this.gameState || app?.gameState;
    const playerPos = context.playerPos || app?.characterMesh?.position;
    const cameraYaw = context.cameraYaw ?? app?.cameraRig?.yaw ?? 0;
    const enemies = context.enemies || app?.enemyAI?.enemies || [];
    const waveManager = context.waveManager || app?.waveManager;
    const input = context.input || app?.input;
    const controller = context.controller || app?.controller;

    // Compute reload progress smoothly if reloading
    if (gs && gs.isReloading) {
      const reloadTime = gs.config?.weapon?.reloadTime || 1.2;
      this.reloadElapsed = Math.min(reloadTime, this.reloadElapsed + dt);
      gs.reloadProgress = Math.min(1, this.reloadElapsed / reloadTime);
    } else {
      this.reloadElapsed = 0;
    }

    const isMoving = context.isMoving ?? Boolean(
      input && (input.isKeyDown('KeyW') || input.isKeyDown('KeyS') || input.isKeyDown('KeyA') || input.isKeyDown('KeyD'))
    );
    const isSprinting = context.isSprinting ?? Boolean(
      input && (input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight'))
    );
    const isAirborne = context.isAirborne ?? Boolean(controller && !controller.isGrounded);
    const isFiring = context.isFiring ?? Boolean(
      input && (input.isMouseDown(0) || input.isKeyDown('KeyJ')) && gs && !gs.isReloading && gs.curAmmo > 0
    );
    const isAiming = context.isAiming ?? Boolean(input && input.isMouseDown(2));

    this.updateReticle(dt, {
      isMoving,
      isSprinting,
      isAirborne,
      isFiring,
      isAiming,
      isReloading: Boolean(gs?.isReloading),
      reloadProgress: gs?.reloadProgress || 0
    });

    this.updateCompass(cameraYaw, playerPos, enemies, context.exitGatePos);
    this.updateWaveTracker(enemies, waveManager, gs);
    if (gs) {
      this.updateVitals(gs);
    }
  }

  /**
   * Non-destructively wires HUDController into BunnyRoyaleApp if main.js hasn't explicitly wired it.
   */
  attachToBunnyRoyale(br) {
    if (!br || this._isAttachedToApp) return;
    const app = br.app || br;
    if (!app) return;

    this._isAttachedToApp = true;
    this.app = app;
    this.gameState = app.gameState;
    br.hudController = this;
    app.hudController = this;

    // 1. Subscribe to GameState for vitals ghost bars & pills
    if (app.gameState && typeof app.gameState.subscribe === 'function') {
      app.gameState.subscribe((state) => {
        this.updateVitals(state);
      });
      this.updateVitals(app.gameState);
    }

    // 2. Wrap WeaponSystem hit callback to trigger X hit-marker, crit/elim badges & comic callouts
    if (app.weaponSystem) {
      const origHitCb = app.weaponSystem.onHitCallback;
      app.weaponSystem.setHitCallback((damage, hitPos, isBoss, target) => {
        const isElim = Boolean(target && target.health <= 0);
        const isCrit = Boolean(isBoss || damage >= 65);
        this.triggerHitMarker(isCrit, isElim);

        if (origHitCb) {
          origHitCb(damage, hitPos, isBoss, target);
        }

        if (app.damageTextManager && typeof app.damageTextManager.spawnCallout === 'function') {
          if (isElim && hitPos) {
            const label = (target && (target.isRival || target.type === 'rival'))
              ? `RIVAL ${target.label || 'ELIMINATED'}!`
              : 'ELIMINATED!';
            app.damageTextManager.spawnCallout(hitPos, label, '#ffea00');
          } else if (isCrit && hitPos) {
            app.damageTextManager.spawnCallout(hitPos, 'CRITICAL HIT!', '#ff3b30');
          }
        }
      });
    }

    // 3. Wrap _onPlayerDamaged to trigger Directional Damage Arc & Shield Crack Callout
    if (typeof app._onPlayerDamaged === 'function' && !app._hudDamagedWrapped) {
      app._hudDamagedWrapped = true;
      const origOnDamaged = app._onPlayerDamaged.bind(app);
      app._onPlayerDamaged = (amount, attackerPos = null) => {
        const prevShield = app.gameState ? app.gameState.shield : 0;
        origOnDamaged(amount);
        const newShield = app.gameState ? app.gameState.shield : 0;
        const shieldCracked = prevShield > 0 && newShield <= 0;

        // Find nearest enemy as attacker position if not explicitly provided
        let sourcePos = attackerPos;
        if (!sourcePos && app.enemyAI && Array.isArray(app.enemyAI.enemies) && app.characterMesh) {
          let bestDist = Infinity;
          for (const e of app.enemyAI.enemies) {
            if (e && e.health > 0 && e.mesh) {
              const d = e.mesh.position.distanceTo(app.characterMesh.position);
              if (d < bestDist) {
                bestDist = d;
                sourcePos = e.mesh.position;
              }
            }
          }
        }

        this.triggerDamageArc(
          sourcePos,
          app.characterMesh ? app.characterMesh.position : null,
          app.cameraRig ? app.cameraRig.yaw : 0,
          shieldCracked || prevShield > 0
        );

        if (shieldCracked && app.damageTextManager && typeof app.damageTextManager.spawnCallout === 'function') {
          app.damageTextManager.spawnCallout(
            app.characterMesh ? app.characterMesh.position : null,
            'SHIELD CRACKED!',
            '#00e5ff'
          );
        }
      };
    }

    // 4. Wrap PickupManager callback for comic callouts
    if (app.pickupManager && !app.pickupManager._hudPickupWrapped) {
      app.pickupManager._hudPickupWrapped = true;
      const origPickupCb = app.pickupManager.onPickupCallback;
      app.pickupManager.onPickupCallback = (pickupType) => {
        if (origPickupCb) origPickupCb(pickupType);
        if (app.damageTextManager && typeof app.damageTextManager.spawnCallout === 'function') {
          const calloutMap = {
            carrot: { text: '+25 🥕', color: '#ffea00' },
            health: { text: '+35 HP', color: '#00e640' },
            shield: { text: '+25 SHIELD', color: '#00e5ff' },
            ammo: { text: '+MAX AMMO', color: '#ff8800' }
          };
          const cfg = calloutMap[pickupType];
          if (cfg && app.characterMesh) {
            app.damageTextManager.spawnCallout(app.characterMesh.position, cfg.text, cfg.color);
          }
        }
      };
    }

    // 5. Wrap WaveManager callbacks for Kill-Feed Wave Announcements
    if (app.waveManager && !app.waveManager._hudWaveWrapped) {
      app.waveManager._hudWaveWrapped = true;
      const origWaveComplete = app.waveManager.onWaveComplete;
      app.waveManager.onWaveComplete = (clearedWave) => {
        if (origWaveComplete) origWaveComplete(clearedWave);
        this.pushKillFeed(`WAVE ${clearedWave} CLEARED`);
      };
    }

    // 6. Push initial tactical feed entry so HUD kill feed is immediately alive
    this.pushKillFeed('CARROT COVE · DROP ZONE ACTIVE');
  }
}
