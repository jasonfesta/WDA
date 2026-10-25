// Floating Comic Combat Text, Pop-and-Arc Damage Numbers, Callout Popups & Kill-Feed Bridge
import { HUDController } from './hudController.js';

export class DamageTextManager {
  constructor(containerEl = null, camera = null) {
    if (typeof containerEl === 'string') {
      this.container = typeof document !== 'undefined'
        ? (document.getElementById(containerEl) || document.querySelector(containerEl))
        : null;
    } else {
      this.container = containerEl;
    }

    if (!this.container && typeof document !== 'undefined') {
      this.container = document.getElementById('damage-numbers-layer');
    }

    this.camera = camera || null;
    this.items = [];
    this._lastExplicitUpdate = 0;
    this._lastRafTime = typeof performance !== 'undefined' ? performance.now() / 1000 : 0;

    if (typeof window !== 'undefined') {
      this._startAutoTicker();
    }
  }

  _getHUD() {
    if (typeof window === 'undefined') return null;
    const hud = new HUDController();
    if (window.__BUNNY_ROYALE__ && !hud._isAttachedToApp) {
      hud.attachToBunnyRoyale(window.__BUNNY_ROYALE__);
    }
    return hud;
  }

  /**
   * Projects a 3D world position (Vector3 or {x,y,z}) or 2D screen point to pixel coordinates.
   */
  _projectToScreen(worldPos) {
    const W = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const H = typeof window !== 'undefined' ? window.innerHeight : 720;

    if (!worldPos) {
      return { x: W * 0.5, y: H * 0.44 };
    }

    // Check if worldPos is a 3D point (has z coordinate)
    if (typeof worldPos.z === 'number') {
      const cam = this.camera || (typeof window !== 'undefined' ? window.__BUNNY_ROYALE__?.camera : null);
      if (cam && typeof worldPos.clone === 'function') {
        const projected = worldPos.clone().project(cam);
        return {
          x: (projected.x * 0.5 + 0.5) * W,
          y: (-(projected.y * 0.5) + 0.5) * H
        };
      } else if (cam && cam.matrixWorldInverse && cam.projectionMatrix) {
        // Fallback manual projection for plain {x, y, z} objects when Vector3.clone isn't on the object
        const brCam = cam;
        if (brCam.position) {
          // Use camera's Three.js constructor if available via camera.position.clone()
          const vec = brCam.position.clone().set(worldPos.x, worldPos.y, worldPos.z).project(brCam);
          return {
            x: (vec.x * 0.5 + 0.5) * W,
            y: (-(vec.y * 0.5) + 0.5) * H
          };
        }
      }
      return { x: W * 0.5, y: H * 0.44 };
    }

    // Already 2D screen coordinates {x, y}
    return {
      x: typeof worldPos.x === 'number' ? worldPos.x : W * 0.5,
      y: typeof worldPos.y === 'number' ? worldPos.y : H * 0.44
    };
  }

  /**
   * Spawns a 3D world-projected (or 2D) Fortnite-style angled damage number with pop-and-arc physics.
   */
  spawnDamage(worldPos, amount, isCrit = false) {
    const pt = this._projectToScreen(worldPos);
    return this.spawnDamageNumber(pt.x, pt.y, amount, isCrit);
  }

  /**
   * Backward-compatible 2D screen-space damage number spawner with pop-and-arc physics.
   */
  spawnDamageNumber(screenX, screenY, amount, isCrit = false) {
    if (!this.container && typeof document !== 'undefined') {
      this.container = document.getElementById('damage-numbers-layer');
    }
    if (!this.container) return null;

    const el = document.createElement('div');
    el.className = `damage-number physics-active${isCrit ? ' crit' : ''}`;

    const cleanAmount = String(amount).replace(/^-/, '');
    el.textContent = isCrit ? `💥 ${cleanAmount}!` : `-${cleanAmount}`;

    const startX = screenX + (Math.random() - 0.5) * 26;
    const startY = screenY + (Math.random() - 0.5) * 16;
    const vx = (Math.random() - 0.5) * 95;
    const vy = isCrit ? -165 - Math.random() * 35 : -130 - Math.random() * 30;
    const tiltDeg = (Math.random() - 0.5) * 14 - 4;

    el.style.left = `${startX.toFixed(1)}px`;
    el.style.top = `${startY.toFixed(1)}px`;
    this.container.appendChild(el);

    const item = {
      el,
      x: startX,
      y: startY,
      vx,
      vy,
      gravity: 340,
      age: 0,
      maxLife: isCrit ? 0.95 : 0.78,
      baseScale: isCrit ? 1.32 : 1.0,
      tiltDeg,
      isCallout: false
    };

    this.items.push(item);
    this._applyTransform(item);
    return el;
  }

  /**
   * Spawns a bold angled Fortnite-style comic callout popup (e.g. SHIELD CRACKED!, ELIMINATED!, HEADSHOT!, +25 🥕).
   */
  spawnCallout(worldPos, text = 'HEADSHOT!', color = '#00e5ff') {
    if (!this.container && typeof document !== 'undefined') {
      this.container = document.getElementById('damage-numbers-layer');
    }
    if (!this.container) return null;

    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (this._lastCalloutSpawnMs && (nowMs - this._lastCalloutSpawnMs) < 360) {
      return null;
    }
    this._lastCalloutSpawnMs = nowMs;

    // Keep at most 1 existing callout on screen so callouts never pile up
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].isCallout) {
        if (this.items[i].el && this.items[i].el.parentNode) {
          this.items[i].el.parentNode.removeChild(this.items[i].el);
        }
        this.items.splice(i, 1);
      }
    }

    const pt = this._projectToScreen(worldPos);
    const el = document.createElement('div');
    el.className = 'combat-callout';
    el.textContent = text;
    el.style.setProperty('--callout-color', color || '#00e5ff');

    const startX = pt.x + (Math.random() - 0.5) * 18;
    const startY = pt.y - 24 + (Math.random() - 0.5) * 10;
    const vx = (Math.random() - 0.5) * 40;
    const vy = -95 - Math.random() * 20;
    const tiltDeg = -4 + (Math.random() - 0.5) * 4;

    el.style.left = `${startX.toFixed(1)}px`;
    el.style.top = `${startY.toFixed(1)}px`;
    this.container.appendChild(el);

    const item = {
      el,
      x: startX,
      y: startY,
      vx,
      vy,
      gravity: 190,
      age: 0,
      maxLife: 0.72,
      baseScale: 0.96,
      tiltDeg,
      isCallout: true
    };

    this.items.push(item);
    this._applyTransform(item);
    return el;
  }

  clearAll() {
    for (const it of this.items) {
      if (it.el && it.el.parentNode) {
        it.el.parentNode.removeChild(it.el);
      }
    }
    this.items.length = 0;
  }

  /**
   * Updates pop-and-arc physics for all active damage numbers and comic callout popups.
   */
  update(dt = 0.016) {
    this._lastExplicitUpdate = typeof performance !== 'undefined' ? performance.now() : 0;
    this._stepPhysics(dt);
  }

  _stepPhysics(dt) {
    if (this.items.length === 0) return;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.age += dt;

      if (it.age >= it.maxLife) {
        if (it.el && it.el.parentNode) {
          it.el.parentNode.removeChild(it.el);
        }
        this.items.splice(i, 1);
        continue;
      }

      it.vy += it.gravity * dt;
      it.x += it.vx * dt;
      it.y += it.vy * dt;

      this._applyTransform(it);
    }
  }

  _applyTransform(it) {
    const t = it.age / it.maxLife;
    // Energetic initial pop (0 -> 0.14), steady hold, then crisp shrink-fade
    let scale = it.baseScale;
    if (t < 0.14) {
      const p = t / 0.14;
      scale = it.baseScale * (0.55 + p * 0.65);
    } else if (t < 0.32) {
      const p = (t - 0.14) / 0.18;
      scale = it.baseScale * (1.2 - p * 0.2);
    } else {
      const p = (t - 0.32) / 0.68;
      scale = it.baseScale * (1.0 - p * 0.18);
    }

    const opacity = t > 0.68 ? Math.max(0, 1 - (t - 0.68) / 0.32) : 1;

    it.el.style.left = `${it.x.toFixed(1)}px`;
    it.el.style.top = `${it.y.toFixed(1)}px`;
    it.el.style.opacity = `${opacity.toFixed(2)}`;
    it.el.style.transform = `translate(-50%, -50%) rotate(${it.tiltDeg.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
  }

  _startAutoTicker() {
    const tick = () => {
      const nowMs = performance.now();
      const nowSec = nowMs / 1000;
      const dt = Math.min(0.05, Math.max(0.001, nowSec - this._lastRafTime));
      this._lastRafTime = nowSec;

      if (nowMs - this._lastExplicitUpdate > 24) {
        this._stepPhysics(dt);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /**
   * Routes kill-feed events directly into HUDController (#hud-kill-feed) and legacy #kill-feed if present.
   */
  addKillFeed(enemyName, weaponName, killerName = null, isRival = false) {
    const br = typeof window !== 'undefined' ? window.__BUNNY_ROYALE__ : null;
    const activeKiller = killerName || br?.gameState?.config?.name || 'PIP';
    const hud = this._getHUD();

    if (hud) {
      hud.pushKillFeed(activeKiller, enemyName, weaponName, isRival);
    }

    // Legacy #kill-feed support if a separate element exists
    const legacyFeed = typeof document !== 'undefined' ? document.getElementById('kill-feed') : null;
    if (legacyFeed) {
      const item = document.createElement('div');
      item.className = 'kill-feed-item';
      item.innerHTML = `<span class="kf-player">${activeKiller}</span> eliminated <span class="kf-enemy">${enemyName}</span> [<span class="kf-weapon">${weaponName}</span>]`;
      legacyFeed.appendChild(item);

      setTimeout(() => {
        item.classList.add('fade-out');
        setTimeout(() => {
          if (item.parentNode) item.parentNode.removeChild(item);
        }, 500);
      }, 3500);
    }
  }
}
