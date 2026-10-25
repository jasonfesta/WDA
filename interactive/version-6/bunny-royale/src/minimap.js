// AAA Tactical Radar & 2D Canvas Minimap Overlay over Carrot Cove Map (assets/env-map-v2.png)
// Renders Translucent Camera FOV Cone, Pulsing Cyan Zone Objective Ring (01 / 02 / 03 / EXIT ->),
// Standard Enemy Dots with Directional Ticks, Rival Rabbit Player Diamonds with Name Tags,
// Foreman Boss Pulsing Crown/Skull Icon, Pickups, Bounce Pads, and Player Navigation Arrow.

import { HUDController } from './hudController.js';

export class Minimap {
  constructor(canvasOrId = 'minimap-canvas', range = 110) {
    if (typeof canvasOrId === 'string') {
      this.canvas = typeof document !== 'undefined'
        ? (document.getElementById(canvasOrId) || document.querySelector(canvasOrId))
        : null;
    } else {
      this.canvas = canvasOrId;
    }

    if (!this.canvas && typeof document !== 'undefined') {
      this.canvas = document.getElementById('minimap-canvas');
    }

    this.range = range || 110;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    if (this.canvas) {
      this.width = this.canvas.width = 160;
      this.height = this.canvas.height = 160;
    } else {
      this.width = 160;
      this.height = 160;
    }

    // World coordinate bounds matching Carrot Cove (X: -28 to +28, Z: -45 North to +32 South)
    this.mapMinX = -28;
    this.mapMaxX = 28;
    this.mapMinZ = -45;
    this.mapMaxZ = 32;

    this._pulseTime = 0;

    // Schedule auto-attachment of HUDController if running inside BunnyRoyaleApp
    if (typeof window !== 'undefined') {
      setTimeout(() => this._ensureHUDAttached(), 0);
    }
  }

  _ensureHUDAttached() {
    if (typeof window === 'undefined') return null;
    const hud = new HUDController();
    if (window.__BUNNY_ROYALE__ && !hud._isAttachedToApp) {
      hud.attachToBunnyRoyale(window.__BUNNY_ROYALE__);
    }
    return hud;
  }

  worldToMap(wx, wz) {
    const nx = Math.max(0.06, Math.min(0.94, (wx - this.mapMinX) / (this.mapMaxX - this.mapMinX)));
    const nz = Math.max(0.06, Math.min(0.94, (wz - this.mapMinZ) / (this.mapMaxZ - this.mapMinZ)));
    return {
      x: nx * this.width,
      y: nz * this.height
    };
  }

  /**
   * Primary tactical radar update (compatible with both update(...) and legacy draw(...)).
   */
  update(playerPos, cameraYaw = 0, enemies = [], pickups = null, waveState = null) {
    this._pulseTime += 0.055;

    // Ensure HUDController is synced each frame even if main.js only calls minimap.draw/update
    const hud = this._ensureHUDAttached();
    if (hud && (!hud._lastUpdateFrameTime || performance.now() - hud._lastUpdateFrameTime > 10)) {
      hud.update(0.016, { playerPos, cameraYaw, enemies });
    }

    if (!this.ctx) return;
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    ctx.clearRect(0, 0, W, H);

    const br = typeof window !== 'undefined' ? window.__BUNNY_ROYALE__ : null;
    const activePickups = Array.isArray(pickups)
      ? pickups
      : (br?.pickupManager?.pickups || []);
    const bouncePads = br?.env?.bouncePads || (Array.isArray(pickups) && pickups[0]?.center ? pickups : []);
    const resolvedWave = this._resolveObjectiveState(waveState, br);

    // 1. Subtle Tactical Radar Ring & North Indicator
    this._drawRadarGrid(ctx, W, H);

    // 2. Active Zone Objective Pulsing Cyan Ring (01, 02, 03, or EXIT ->)
    if (resolvedWave) {
      this._drawObjectiveRing(ctx, resolvedWave);
    }

    // 3. Bounce Pads (Cyan Jump Rings)
    if (Array.isArray(bouncePads)) {
      for (const bp of bouncePads) {
        if (!bp || !bp.center) continue;
        const p = this.worldToMap(bp.center.x, bp.center.z);
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
        ctx.fillStyle = 'rgba(0, 229, 255, 0.32)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Pickups (Color-coded micro-diamonds)
    if (Array.isArray(activePickups)) {
      const pickupColors = {
        carrot: '#ffd166',
        health: '#00e640',
        shield: '#00e5ff',
        ammo: '#ff8800'
      };
      for (const pk of activePickups) {
        const pos = pk?.position || pk?.mesh?.position;
        if (!pos) continue;
        const mp = this.worldToMap(pos.x, pos.z);
        const col = pickupColors[pk.type] || '#ffd166';
        ctx.save();
        ctx.translate(mp.x, mp.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = col;
        ctx.strokeStyle = '#091526';
        ctx.lineWidth = 1;
        ctx.fillRect(-2.3, -2.3, 4.6, 4.6);
        ctx.strokeRect(-2.3, -2.3, 4.6, 4.6);
        ctx.restore();
      }
    }

    // 5. Player Translucent Camera FOV Cone (drawn under enemies & player arrow)
    if (playerPos) {
      const pp = this.worldToMap(playerPos.x, playerPos.z);
      this._drawFOVCone(ctx, pp.x, pp.y, cameraYaw);
    }

    // 6. Enemies: Standard Hostiles, Rival Rabbit Players, and Foreman Boss
    if (Array.isArray(enemies)) {
      for (const e of enemies) {
        if (!e || e.health <= 0) continue;
        const ePos = e.mesh ? e.mesh.position : e.position;
        if (!ePos) continue;
        const ep = this.worldToMap(ePos.x, ePos.z);
        const eYaw = e.mesh ? e.mesh.rotation.y : (e.rotationY || 0);

        if (e.type === 'foreman' || e.isBoss) {
          this._drawBossIcon(ctx, ep.x, ep.y);
        } else if (e.isRival || e.type === 'rival' || e.rivalId) {
          const rName = (e.name || e.label || e.rivalId || 'RIVAL').toUpperCase().replace(/^RIVAL\s+/, '');
          this._drawRivalIcon(ctx, ep.x, ep.y, rName, eYaw);
        } else {
          this._drawStandardEnemyIcon(ctx, ep.x, ep.y, eYaw);
        }
      }
    }

    // 7. Player Marker (Crisp White Directional Arrow with Dark Stroke)
    if (playerPos) {
      const pp = this.worldToMap(playerPos.x, playerPos.z);
      ctx.save();
      ctx.translate(pp.x, pp.y);
      ctx.rotate(-cameraYaw);

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -8.5);
      ctx.lineTo(6.2, 6.2);
      ctx.lineTo(0, 3.0);
      ctx.lineTo(-6.2, 6.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Backward-compatible alias for main.js: minimap.draw(playerPos, playerYaw, enemies, bouncePads)
   */
  draw(playerPos, playerYaw = 0, enemies = [], bouncePads = null, waveState = null) {
    this.update(playerPos, playerYaw, enemies, bouncePads, waveState);
  }

  _resolveObjectiveState(waveState, br) {
    let currentWave = 1;
    let isExit = false;

    if (typeof waveState === 'number') {
      currentWave = waveState;
    } else if (waveState && typeof waveState === 'object') {
      currentWave = waveState.currentWave || 1;
      isExit = waveState.waveState === 'victory' || /exit/i.test(waveState.objectiveText || '');
    } else if (br?.waveManager) {
      currentWave = br.waveManager.currentWave || 1;
      isExit = br.waveManager.waveState === 'victory' || /exit/i.test(br.waveManager.objectiveText || '');
    } else if (br?.gameState) {
      currentWave = br.gameState.currentWave || 1;
      isExit = /exit/i.test(br.gameState.objectiveText || '');
    }

    if (isExit) {
      return { x: 0.0, z: -35.0, label: 'EXIT ->', isExit: true };
    }
    if (currentWave === 1) {
      return { x: 0.2, z: 9.5, label: '01', isExit: false };
    }
    if (currentWave === 2) {
      return { x: 0.0, z: -2.5, label: '02', isExit: false };
    }
    return { x: 0.0, z: -22.0, label: '03', isExit: false };
  }

  _drawRadarGrid(ctx, W, H) {
    ctx.save();
    // Subtle tactical sweep ring
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, W * 0.36, 0, Math.PI * 2);
    ctx.stroke();

    // Top North 'N' micro-badge
    ctx.fillStyle = 'rgba(11, 25, 42, 0.82)';
    ctx.fillRect(W * 0.5 - 7, 2, 14, 12);
    ctx.font = '900 9px "Barlow Condensed", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', W * 0.5, 8.5);
    ctx.restore();
  }

  _drawObjectiveRing(ctx, obj) {
    const p = this.worldToMap(obj.x, obj.z);
    const pulse = (Math.sin(this._pulseTime * 2.2) + 1) * 0.5;
    const outerR = 11 + pulse * 6.5;

    ctx.save();
    // Outer pulsing cyan wave ring
    ctx.strokeStyle = `rgba(0, 229, 255, ${(0.85 - pulse * 0.55).toFixed(2)})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, outerR, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dashed/solid cyan ring
    ctx.fillStyle = 'rgba(0, 229, 255, 0.16)';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Objective tag pill
    ctx.font = '900 9px "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textW = ctx.measureText(obj.label).width + 6;
    ctx.fillStyle = 'rgba(7, 17, 30, 0.88)';
    ctx.fillRect(p.x - textW * 0.5, p.y - 17, textW, 10);
    ctx.fillStyle = '#00e5ff';
    ctx.fillText(obj.label, p.x, p.y - 11.5);
    ctx.restore();
  }

  _drawFOVCone(ctx, px, py, cameraYaw) {
    const coneRadius = 46;
    const halfAngle = (32 * Math.PI) / 180;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-cameraYaw);

    // -PI/2 is straight up (North) in local canvas coordinates
    const startAngle = -Math.PI / 2 - halfAngle;
    const endAngle = -Math.PI / 2 + halfAngle;

    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, coneRadius);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.38)');
    grad.addColorStop(0.65, 'rgba(0, 229, 255, 0.14)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, coneRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Crisp side boundary rays of FOV cone
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.42)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(startAngle) * coneRadius * 0.85, Math.sin(startAngle) * coneRadius * 0.85);
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(endAngle) * coneRadius * 0.85, Math.sin(endAngle) * coneRadius * 0.85);
    ctx.stroke();

    ctx.restore();
  }

  _drawStandardEnemyIcon(ctx, x, y, yaw = 0) {
    ctx.save();
    ctx.translate(x, y);

    // Directional tick showing enemy facing orientation
    // Note: in enemyAI.js, e.mesh.rotation.y = atan2(toPlayer.x, toPlayer.z), where 0 faces +Z (South = +Y on map)
    const dirX = Math.sin(yaw);
    const dirY = Math.cos(yaw);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(dirX * 3.5, dirY * 3.5);
    ctx.lineTo(dirX * 7.2, dirY * 7.2);
    ctx.stroke();

    // Red enemy dot with crisp white rim matching ui-gameplay-v2.png
    ctx.fillStyle = '#ff2a2a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 4.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawRivalIcon(ctx, x, y, rivalName, yaw = 0) {
    const pulse = (Math.sin(this._pulseTime * 3.2) + 1) * 0.5;
    ctx.save();
    ctx.translate(x, y);

    // Outer pulsing magenta/orange glow ring
    ctx.strokeStyle = `rgba(255, 42, 157, ${(0.85 - pulse * 0.45).toFixed(2)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 6.5 + pulse * 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Diamond Rival Marker
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#ff2a9d';
    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 1.6;
    ctx.fillRect(-4.6, -4.6, 9.2, 9.2);
    ctx.strokeRect(-4.6, -4.6, 9.2, 9.2);
    ctx.restore();

    // Crisp Name Tag (BRUNO / VOLT / PIP)
    ctx.font = '900 8.5px "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const tagW = ctx.measureText(rivalName).width + 5;
    ctx.fillStyle = 'rgba(11, 25, 42, 0.9)';
    ctx.fillRect(-tagW * 0.5, -16, tagW, 9.5);
    ctx.fillStyle = '#ffea00';
    ctx.fillText(rivalName, 0, -7);
    ctx.restore();
  }

  _drawBossIcon(ctx, x, y) {
    const pulse = (Math.sin(this._pulseTime * 3.8) + 1) * 0.5;
    ctx.save();
    ctx.translate(x, y);

    // Pulsing crimson/gold boss threat ring
    ctx.strokeStyle = `rgba(255, 0, 85, ${(0.9 - pulse * 0.5).toFixed(2)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 8 + pulse * 4.5, 0, Math.PI * 2);
    ctx.stroke();

    // Boss hexagon/circle badge
    ctx.fillStyle = '#ff0055';
    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 6.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mini gold crown inside boss icon
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.moveTo(-3.6, 2.2);
    ctx.lineTo(-3.6, -2.2);
    ctx.lineTo(-1.5, 0);
    ctx.lineTo(0, -2.8);
    ctx.lineTo(1.5, 0);
    ctx.lineTo(3.6, -2.2);
    ctx.lineTo(3.6, 2.2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
