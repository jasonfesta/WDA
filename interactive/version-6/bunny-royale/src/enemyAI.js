import * as THREE from 'three';
import { createEnemyMesh } from './enemyModel.js';
import { createRabbitMesh, createWeaponMesh, updateRabbit3DAnimation } from './rabbitModel.js';
import { FIGHTER_CONFIGS } from './fighterConfig.js';
import { assetAtlas } from './assetAtlas.js';
import { soundEngine } from './soundEngine.js';
import { SoundFX } from './soundFX.js';

// Enemy & Rival Player AI Manager:
// - Grunts & Boss: Raiders (cover/ranged), Hoppers (rush/leap), Foreman Boss (phases/ground slam)
// - Rival Rabbit Players: Rival Pip (Scout), Rival Bruno (Heavy), Rival Volt (Tech)
export class EnemyAIManager {
  constructor(scene, env, gameState, pickupManager) {
    this.scene = scene;
    this.env = env;
    this.gameState = gameState;
    this.pickupManager = pickupManager;

    this.enemies = [];
    this.enemyProjectiles = [];
    this.spawnTelegraphs = [];
    this.vfxEffects = [];

    // Optional hook for shield breaks, rival callouts, and eliminations
    this.onCombatEvent = null;
  }

  _createRivalNameplateTexture(rivalTitle, roleTag, accentHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 112;
    const ctx = canvas.getContext('2d');

    // Sleek dark tactical pill
    ctx.fillStyle = 'rgba(9, 16, 32, 0.90)';
    ctx.beginPath();
    ctx.roundRect(8, 10, 496, 92, 24);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = accentHex || '#00f2fe';
    ctx.stroke();

    // Star badge + Rival Name
    ctx.fillStyle = '#ffd166';
    ctx.font = '900 40px "Chakra Petch", "Arial Black", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 28, 57);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px "Chakra Petch", "Arial Black", sans-serif';
    ctx.fillText(rivalTitle, 74, 57);

    // Role tag pill on right
    ctx.fillStyle = accentHex || '#00f2fe';
    ctx.font = '800 26px "Chakra Petch", "Arial Black", sans-serif';
    const tagText = `[${roleTag}]`;
    const tagW = ctx.measureText(tagText).width;
    ctx.fillText(tagText, 480 - tagW, 57);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _createRivalPlayerMesh(fighterId) {
    const cfg = FIGHTER_CONFIGS[fighterId] || FIGHTER_CONFIGS.volt;
    const group = createRabbitMesh(cfg);
    group.name = `rival_${fighterId}`;
    group.scale.setScalar(1.18);

    const isHeavy = fighterId === 'bruno';
    const isVolt = fighterId === 'volt';
    const charH = isHeavy ? 2.18 : (isVolt ? 2.08 : 2.02);

    // In EnemyAI, e.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z) makes +Z face the player.
    // Rotate spriteRig by Math.PI so the studio FRONT turnaround faces +Z (towards the player).
    const spriteRig = group.userData.spriteRig;
    if (spriteRig) {
      spriteRig.rotation.y = Math.PI;
      // Grab front plane material so damage flash works identically
      if (spriteRig.children[1] && spriteRig.children[1].material) {
        group.userData.frontMat = spriteRig.children[1].material;
      }
      // Adjust weapon mesh so it renders in front of the front-facing Rival sprite
      const oldWeapon = group.userData.weaponMesh;
      if (oldWeapon) {
        spriteRig.remove(oldWeapon);
      }
    }

    // Mount visible forward-facing 3D/2.5D signature weapon + muzzle flare on the Rival
    const rivalWeapon = createWeaponMesh(cfg.weapon, fighterId, isHeavy ? 1.15 : 1.05);
    rivalWeapon.position.set(isHeavy ? -0.38 : -0.30, charH * 0.43, 0.08);
    group.add(rivalWeapon);
    group.userData.weaponMesh = rivalWeapon;

    const flashTex = assetAtlas.getVFXTexture(fighterId === 'volt' ? 'arc_burst' : 'muzzle_flash');
    const flashMat = new THREE.MeshBasicMaterial({
      map: flashTex,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const flashMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), flashMat);
    flashMesh.position.set(isHeavy ? -0.62 : -0.52, charH * 0.45, 0.14);
    group.add(flashMesh);
    group.userData.muzzleFlashMesh = flashMesh;

    // Rival Challenger Ground Aura Ring
    const accentColorHex = fighterId === 'bruno' ? 0xeab308 : (fighterId === 'volt' ? 0xff2a9d : 0x00f2fe);
    const accentCss = fighterId === 'bruno' ? '#eab308' : (fighterId === 'volt' ? '#ff2a9d' : '#00f2fe');
    const auraRing = new THREE.Mesh(
      new THREE.RingGeometry(0.56, 0.82, 24),
      new THREE.MeshBasicMaterial({
        color: accentColorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      })
    );
    auraRing.rotation.x = -Math.PI / 2;
    auraRing.position.y = 0.04;
    group.add(auraRing);
    group.userData.auraRing = auraRing;

    // Floating Nameplate + Shield & Health Dual Bar above Rival's head
    const hpBarGroup = new THREE.Group();
    hpBarGroup.position.set(0, charH + 0.34, 0);
    hpBarGroup.visible = true; // Always show Rival Player nameplate & dual bars!

    const barW = 1.18;
    const bgPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(barW + 0.10, 0.22),
      new THREE.MeshBasicMaterial({ color: 0x091326, side: THREE.DoubleSide, transparent: true, opacity: 0.92 })
    );
    hpBarGroup.add(bgPlane);

    // Top bar: Shield (Cyan)
    const shieldFill = new THREE.Mesh(
      new THREE.PlaneGeometry(barW, 0.065),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide })
    );
    shieldFill.position.set(0, 0.044, 0.01);
    hpBarGroup.add(shieldFill);

    // Bottom bar: Health (Vibrant Coral/Red)
    const hpFill = new THREE.Mesh(
      new THREE.PlaneGeometry(barW, 0.075),
      new THREE.MeshBasicMaterial({ color: 0xff2a6d, side: THREE.DoubleSide })
    );
    hpFill.position.set(0, -0.042, 0.01);
    hpBarGroup.add(hpFill);

    // Floating Rival Nameplate Badge above bars
    const nameplateTex = this._createRivalNameplateTexture(`RIVAL ${cfg.name}`, cfg.title, accentCss);
    const nameplateMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.62, 0.35),
      new THREE.MeshBasicMaterial({
        map: nameplateTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    nameplateMesh.position.set(0, 0.30, 0.01);
    hpBarGroup.add(nameplateMesh);

    group.add(hpBarGroup);
    group.userData.hpBarGroup = hpBarGroup;
    group.userData.hpFillMesh = hpFill;
    group.userData.shieldFillMesh = shieldFill;
    group.userData.hpBarWidth = barW;

    return group;
  }

  spawnEnemy(type, pos, immediate = false) {
    const vecPos = new THREE.Vector3(pos.x, pos.y || 0, pos.z);
    if (immediate) {
      return this._materializeEnemy(type, vecPos);
    }

    const isRival = type.startsWith('rival_');
    const ringColor = isRival ? 0x00f2fe : 0xffaa00;
    const telegraphMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.35, isRival ? 1.45 : 1.2, 20),
      new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.88 })
    );
    telegraphMesh.rotation.x = -Math.PI / 2;
    telegraphMesh.position.set(vecPos.x, 0.05, vecPos.z);
    this.scene.add(telegraphMesh);

    this.spawnTelegraphs.push({
      mesh: telegraphMesh,
      pos: vecPos,
      type,
      timer: 0.60
    });
    return null;
  }

  spawnRivalDuel(fighterId = null, customPos = null) {
    let chosenId = fighterId;
    if (!chosenId || !FIGHTER_CONFIGS[chosenId]) {
      const playerFighter = this.gameState ? this.gameState.currentFighterId : 'pip';
      chosenId = playerFighter === 'volt' ? 'pip' : (playerFighter === 'pip' ? 'volt' : 'bruno');
    }
    const spawnPos = customPos || { x: 0.0, y: 0, z: 9.5 };
    return this.spawnEnemy(`rival_${chosenId}`, spawnPos, true);
  }

  _materializeEnemy(type, pos) {
    const isRival = type.startsWith('rival_');
    let fighterId = null;
    let mesh = null;

    if (isRival) {
      fighterId = type.replace('rival_', '');
      mesh = this._createRivalPlayerMesh(fighterId);
    } else {
      mesh = createEnemyMesh(type);
    }

    mesh.position.copy(pos);
    this.scene.add(mesh);

    let maxHp = 90;
    let maxShield = 0;
    let speed = 3.8;
    let label = 'RAIDER';
    let rivalName = null;
    let radius = 0.75;
    let height = 1.85;
    let scale = 1.0;

    if (type === 'hopper') {
      maxHp = 75;
      speed = 5.4;
      label = 'HOPPER';
      radius = 0.78;
      height = 2.0;
    } else if (type === 'foreman') {
      maxHp = 450;
      maxShield = 120;
      speed = 3.3;
      label = 'FOREMAN BOSS';
      radius = 1.38;
      height = 3.1;
      scale = 1.45;
    } else if (type === 'rival_pip') {
      maxHp = 105;
      maxShield = 50;
      speed = 6.2;
      rivalName = 'RIVAL PIP';
      label = '★ RIVAL PIP';
      radius = 0.80;
      height = 2.02;
      scale = 1.0;
    } else if (type === 'rival_bruno') {
      maxHp = 140;
      maxShield = 75;
      speed = 4.6;
      rivalName = 'RIVAL BRUNO';
      label = '★ RIVAL BRUNO';
      radius = 0.92;
      height = 2.18;
      scale = 1.08;
    } else if (type === 'rival_volt') {
      maxHp = 110;
      maxShield = 60;
      speed = 5.6;
      rivalName = 'RIVAL VOLT';
      label = '★ RIVAL VOLT';
      radius = 0.82;
      height = 2.08;
      scale = 1.02;
    }

    const enemy = {
      mesh,
      type,
      fighterId,
      isRival,
      rivalName,
      label,
      isBoss: type === 'foreman',
      health: maxHp,
      maxHealth: maxHp,
      shield: maxShield,
      maxShield,
      speed,
      scale,
      homePos: pos.clone(),
      strafePhase: Math.random() * Math.PI * 2,
      strafeDir: Math.random() < 0.5 ? 1 : -1,
      strafeSwitchTimer: 1.4 + Math.random() * 1.4,
      attackCooldown: 0.75 + Math.random() * 0.65,
      abilityCooldown: 2.5 + Math.random() * 1.5,
      dodgeCooldown: 0,
      burstRemaining: 0,
      burstTimer: 0,
      radius,
      height,
      jumpVelocityY: type === 'hopper' ? 5.5 : 0,
      knockbackVel: new THREE.Vector3(0, 0, 0),
      isGrounded: type !== 'hopper',
      wobbleTime: 0,
      phase: 1
    };

    this.enemies.push(enemy);
    return enemy;
  }

  getActiveBoss() {
    return this.enemies.find(e => e.type === 'foreman' && e.health > 0) || null;
  }

  getActiveRival() {
    return this.enemies.find(e => e.isRival && e.health > 0) || null;
  }

  update(dt, playerPos, camera, onPlayerHit, onEnemyDefeated) {
    // 1. Update Spawn Telegraphs
    for (let i = this.spawnTelegraphs.length - 1; i >= 0; i--) {
      const t = this.spawnTelegraphs[i];
      t.timer -= dt;
      const s = 1 + (0.60 - t.timer) * 1.2;
      t.mesh.scale.set(s, s, 1);
      if (t.timer <= 0) {
        this.scene.remove(t.mesh);
        this._materializeEnemy(t.type, t.pos);
        this.spawnTelegraphs.splice(i, 1);
      }
    }

    // 2. Update Active Enemies & Rival Players
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.health <= 0) {
        this._spawnEliminationVFX(e.mesh.position, e.isRival || e.isBoss);
        soundEngine.playElimination();

        if (this.pickupManager) {
          if (typeof this.pickupManager.spawnLootBurst === 'function') {
            this.pickupManager.spawnLootBurst(e.mesh.position, e.isRival || e.isBoss);
          } else {
            const r = Math.random();
            const dropType = r < 0.4 ? 'health' : (r < 0.75 ? 'shield' : 'ammo');
            this.pickupManager.spawnPickup(dropType, e.mesh.position);
          }
        }

        const defeatedEnemy = e;
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
        this.gameState.recordDefeat();
        this.onCombatEvent?.({ type: 'eliminated', enemy: defeatedEnemy });
        if (onEnemyDefeated) onEnemyDefeated(defeatedEnemy);
        continue;
      }

      // Apply decay to any knockback impulse
      if (e.knockbackVel && e.knockbackVel.lengthSq() > 0.01) {
        const stepKB = e.knockbackVel.clone().multiplyScalar(dt);
        const nextPos = e.mesh.position.clone().add(stepKB);
        if (!this.env || !this.env.checkCollision || !this.env.checkCollision(nextPos, e.radius * 0.6, e.height)) {
          e.mesh.position.x = nextPos.x;
          e.mesh.position.z = nextPos.z;
        }
        e.knockbackVel.multiplyScalar(Math.max(0, 1 - dt * 6.5));
      }

      // Update floating 3D HP + Shield bar & Rival Nameplate
      const hpBarGroup = e.mesh.userData.hpBarGroup;
      const hpFill = e.mesh.userData.hpFillMesh;
      const shieldFill = e.mesh.userData.shieldFillMesh;
      const barW = e.mesh.userData.hpBarWidth || 0.80;
      if (hpBarGroup && camera) {
        const shouldShow = e.isRival || e.health < e.maxHealth || (e.maxShield > 0 && e.shield < e.maxShield);
        if (shouldShow) {
          hpBarGroup.visible = true;
          hpBarGroup.lookAt(camera.position);
          const pct = Math.max(0.01, e.health / e.maxHealth);
          hpFill.scale.x = pct;
          hpFill.position.x = -(1 - pct) * (barW * 0.5);

          if (shieldFill && e.maxShield > 0) {
            const sPct = Math.max(0.0, e.shield / e.maxShield);
            shieldFill.visible = sPct > 0.005;
            shieldFill.scale.x = Math.max(0.01, sPct);
            shieldFill.position.x = -(1 - sPct) * (barW * 0.5);
          }
        } else {
          hpBarGroup.visible = false;
        }
      }

      // Pulse Rival aura ring & muzzle flash
      const auraRing = e.mesh.userData.auraRing;
      if (auraRing) {
        const s = 0.96 + Math.sin(performance.now() * 0.008 + e.strafePhase) * 0.08;
        auraRing.scale.set(s, s, 1);
      }

      const flashMesh = e.mesh.userData.muzzleFlashMesh;
      if (flashMesh) {
        const pulse = 0.82 + Math.sin(performance.now() * 0.025 + e.strafePhase) * 0.24;
        flashMesh.scale.set(pulse, pulse, 1);
      }

      // Hit wobble & flash
      const frontMat = e.mesh.userData.frontMat;
      if (e.wobbleTime > 0) {
        e.wobbleTime -= dt;
        e.mesh.rotation.z = Math.sin(e.wobbleTime * 34) * 0.16;
        if (frontMat) frontMat.color.setHex(0xffb4a2);
      } else {
        e.mesh.rotation.z = 0;
        if (frontMat) frontMat.color.setHex(0xffffff);
      }

      if (e.dodgeCooldown > 0) e.dodgeCooldown = Math.max(0, e.dodgeCooldown - dt);
      if (e.abilityCooldown > 0) e.abilityCooldown = Math.max(0, e.abilityCooldown - dt);
      e.attackCooldown -= dt;

      const toPlayer = playerPos.clone().sub(e.mesh.position);
      toPlayer.y = 0;
      const dist = toPlayer.length();

      const prevX = e.mesh.position.x;
      const prevZ = e.mesh.position.z;

      if (e.isRival) {
        this._updateRival(e, dt, dist, toPlayer, playerPos, onPlayerHit);
      } else if (e.type === 'raider') {
        this._updateRaider(e, dt, dist, toPlayer);
      } else if (e.type === 'hopper') {
        this._updateHopper(e, dt, dist, toPlayer, onPlayerHit);
      } else if (e.type === 'foreman') {
        this._updateForeman(e, dt, dist, toPlayer, onPlayerHit);
      }

      // Keep minimum personal standoff distance from player so enemies never clip into player or block OTS camera
      const dxP = e.mesh.position.x - playerPos.x;
      const dzP = e.mesh.position.z - playerPos.z;
      const horizDist = Math.hypot(dxP, dzP);
      const minStandoff = e.type === 'hopper' ? 4.2 : 5.2;
      if (horizDist < minStandoff && horizDist > 0.001) {
        e.mesh.position.x = playerPos.x + (dxP / horizDist) * minStandoff;
        e.mesh.position.z = playerPos.z + (dzP / horizDist) * minStandoff;
      }

      // Enemy-to-enemy personal space separation so 3D enemies never overlap or pile on top of each other
      for (const other of this.enemies) {
        if (other === e || other.health <= 0) continue;
        const ex = e.mesh.position.x - other.mesh.position.x;
        const ez = e.mesh.position.z - other.mesh.position.z;
        const eDist = Math.hypot(ex, ez);
        const minSep = (e.type === 'foreman' || other.type === 'foreman') ? 3.6 : 2.6;
        if (eDist < minSep && eDist > 0.001) {
          const push = (minSep - eDist) * 0.5;
          e.mesh.position.x += (ex / eDist) * push;
          e.mesh.position.z += (ez / eDist) * push;
        }
      }

      // Clamp within street & sidewalk arena bounds
      e.mesh.position.x = Math.max(-7.5, Math.min(7.5, e.mesh.position.x));
      e.mesh.position.z = Math.max(-42, Math.min(24, e.mesh.position.z));

      // Compute 3D movement vector & turn 3D body into sprint/flank direction so 3D depth is unmistakable!
      const moveDX = e.mesh.position.x - prevX;
      const moveDZ = e.mesh.position.z - prevZ;
      const movedDist = Math.hypot(moveDX, moveDZ);
      const moveSpeedNow = dt > 0.0001 ? movedDist / dt : 0;

      if (dist > 0.1) {
        const playerFaceYaw = Math.atan2(toPlayer.x, toPlayer.z);
        let desiredYaw = playerFaceYaw;
        if (moveSpeedNow > 0.8) {
          const moveYaw = Math.atan2(moveDX, moveDZ);
          const diffMove = Math.atan2(Math.sin(moveYaw - playerFaceYaw), Math.cos(moveYaw - playerFaceYaw));
          // Turn up to ±13 deg into the sprint direction + bank torso into turn
          desiredYaw = playerFaceYaw + Math.max(-0.22, Math.min(0.22, diffMove * 0.25));
          if (e.hitFlashTimer <= 0) {
            e.mesh.rotation.z = Math.max(-0.09, Math.min(0.09, -(moveDX / Math.max(0.016, dt)) * 0.015));
          }
        }
        const yawDiff = Math.atan2(Math.sin(desiredYaw - e.mesh.rotation.y), Math.cos(desiredYaw - e.mesh.rotation.y));
        e.mesh.rotation.y += yawDiff * Math.min(1, dt * 12.0);
      }

      // Animate 3D running stride, knee kick-up, torso twist, arm pump & ear physics on all Enemies & Rival Rabbits!
      const speedRatio = Math.min(1.30, Math.max(0.78, moveSpeedNow / Math.max(2.4, e.speed || 4.0)));
      e.animClock = (e.animClock || e.strafePhase || 0) + dt * (1.15 + speedRatio * 0.35);
      updateRabbit3DAnimation(e.mesh, e.animClock, speedRatio, e.isGrounded !== false, e.jumpVelocityY || 0);
    }

    // 3. Update Enemy & Rival Projectiles
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      p.life -= dt;

      if (p.isBallistic) {
        p.velocity.y += (p.gravity || -18.0) * dt;
      }

      p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));

      if (p.isBallistic && p.mesh.position.y <= 0.18) {
        p.mesh.position.y = 0.18;
        p.velocity.y = Math.abs(p.velocity.y) * 0.52;
        p.bounces = (p.bounces || 1) - 1;
        if (p.bounces <= 0) {
          this._spawnRivalVFXRing(p.mesh.position, 'seed_explosion', 2.2);
          if (p.mesh.position.distanceTo(playerPos) < 3.4 && onPlayerHit) {
            onPlayerHit(p.damage);
          }
          this.scene.remove(p.mesh);
          this.enemyProjectiles.splice(i, 1);
          continue;
        }
      }

      const dPlayer = p.mesh.position.distanceTo(playerPos.clone().add(new THREE.Vector3(0, 0.9, 0)));
      if (dPlayer < 0.92) {
        if (onPlayerHit) onPlayerHit(p.damage);
        this._spawnRivalVFXRing(p.mesh.position, p.hitVfx || 'impact_burst', 1.15);
        this.scene.remove(p.mesh);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // 4. Update Rival VFX Rings & Decoys
    for (let i = this.vfxEffects.length - 1; i >= 0; i--) {
      const fx = this.vfxEffects[i];
      fx.life -= dt;
      if (fx.growthRate) {
        fx.scale += dt * fx.growthRate;
        fx.mesh.scale.set(fx.scale, fx.scale, 1);
      }
      if (fx.isDecoy) {
        fx.mesh.position.y = 0.85 + Math.sin(performance.now() * 0.009) * 0.10;
      } else if (fx.mesh.material) {
        fx.mesh.material.opacity = Math.min(1, Math.max(0, fx.life * 3.5));
      }
      if (fx.life <= 0) {
        this.scene.remove(fx.mesh);
        this.vfxEffects.splice(i, 1);
      }
    }
  }

  _updateRival(e, dt, dist, toPlayer, playerPos, onPlayerHit) {
    const moveDir = dist > 0.001 ? toPlayer.clone().normalize() : new THREE.Vector3(0, 0, 1);
    const rightVec = new THREE.Vector3(-moveDir.z, 0, moveDir.x);

    // 1. Tactical Strafe Direction Switching
    e.strafeSwitchTimer -= dt;
    if (e.strafeSwitchTimer <= 0) {
      e.strafeDir *= -1;
      e.strafeSwitchTimer = 1.1 + Math.random() * 1.4;
    }

    const desiredDist = e.fighterId === 'bruno' ? 9.2 : (e.fighterId === 'volt' ? 12.5 : 11.0);
    let forwardFactor = 0;
    if (dist > desiredDist + 3.2) forwardFactor = 0.72;
    else if (dist < desiredDist - 2.8) forwardFactor = -0.58;

    const moveStep = rightVec.clone().multiplyScalar(e.strafeDir * e.speed * 0.78 * dt)
      .add(moveDir.clone().multiplyScalar(forwardFactor * e.speed * dt));

    const candidatePos = e.mesh.position.clone().add(moveStep);
    if (!this.env || !this.env.checkCollision || !this.env.checkCollision(candidatePos, e.radius * 0.65, e.height)) {
      e.mesh.position.x = candidatePos.x;
      e.mesh.position.z = candidatePos.z;
    } else {
      e.strafeDir *= -1;
    }

    // 2. Vertical Bunny-Hop & Bounce Pad Interaction
    if (!e.isGrounded) {
      e.jumpVelocityY -= 22.0 * dt;
      e.mesh.position.y += e.jumpVelocityY * dt;
      if (e.mesh.position.y <= 0) {
        e.mesh.position.y = 0;
        e.jumpVelocityY = 0;
        e.isGrounded = true;
        // If Rival Bruno lands from a Ground Slam leap, trigger shockwave!
        if (e.isSlamming) {
          e.isSlamming = false;
          this._spawnRivalGroundSlam(e.mesh.position, dist, onPlayerHit);
        }
      }
    } else {
      // Check Arena Bounce Pads
      if (this.env && this.env.bouncePads) {
        for (const pad of this.env.bouncePads) {
          const dPad = Math.hypot(e.mesh.position.x - pad.center.x, e.mesh.position.z - pad.center.z);
          if (dPad < pad.radius + 0.6) {
            e.isGrounded = false;
            e.jumpVelocityY = Math.min(13.5, pad.launchVelocity.y * 0.78);
            this._spawnRivalVFXRing(e.mesh.position, 'double_hop', 1.4, true);
            break;
          }
        }
      }
      // Periodic agile bunny-hopping in combat
      if (e.isGrounded && Math.random() < dt * (e.fighterId === 'pip' ? 0.85 : 0.45)) {
        e.isGrounded = false;
        e.jumpVelocityY = e.fighterId === 'pip' ? 8.8 : 7.4;
        if (e.fighterId === 'pip') {
          this._spawnRivalVFXRing(e.mesh.position, 'double_hop', 1.25, true);
        }
      }
    }

    // 3. Rival Signature Abilities
    if (e.abilityCooldown <= 0 && dist < 24) {
      if (e.fighterId === 'bruno' && dist < 8.2 && e.isGrounded) {
        // Rival Bruno leaps and performs Ground Slam!
        e.isGrounded = false;
        e.jumpVelocityY = 9.6;
        e.isSlamming = true;
        e.abilityCooldown = 5.5;
      } else if (e.fighterId === 'volt') {
        // Rival Volt deploys a Holographic Decoy Bunny!
        this._deployRivalDecoy(e.mesh.position.clone().add(rightVec.clone().multiplyScalar(1.35 * e.strafeDir)));
        e.abilityCooldown = 6.8;
      } else if (e.fighterId === 'pip' && e.isGrounded) {
        // Rival Pip triggers Double Hop dash!
        e.isGrounded = false;
        e.jumpVelocityY = 9.5;
        e.knockbackVel.copy(rightVec.clone().multiplyScalar(e.strafeDir * 6.5));
        this._spawnRivalVFXRing(e.mesh.position, 'double_hop', 1.35, true);
        e.abilityCooldown = 4.2;
      }
    }

    // 4. Rival Signature Weapon Fire
    const muzzleOrigin = e.mesh.position.clone().add(new THREE.Vector3(0, 1.05, 0));
    const aimVec = playerPos.clone().add(new THREE.Vector3(0, 0.85, 0)).sub(muzzleOrigin).normalize();

    if (e.fighterId === 'pip') {
      // Rapid 3-shot Carrot Carbine burst
      if (e.burstRemaining > 0) {
        e.burstTimer -= dt;
        if (e.burstTimer <= 0) {
          e.burstRemaining--;
          e.burstTimer = 0.14;
          this._fireRivalCarrotBolt(muzzleOrigin, aimVec);
        }
      } else if (e.attackCooldown <= 0 && dist < 36) {
        e.burstRemaining = 3;
        e.burstTimer = 0;
        e.attackCooldown = 1.65 + Math.random() * 0.45;
      }
    } else if (e.fighterId === 'bruno') {
      if (e.attackCooldown <= 0 && dist < 34) {
        e.attackCooldown = 2.0 + Math.random() * 0.5;
        this._fireRivalSeedBomb(muzzleOrigin, aimVec);
      }
    } else if (e.fighterId === 'volt') {
      if (e.attackCooldown <= 0 && dist < 36) {
        e.attackCooldown = 1.35 + Math.random() * 0.45;
        this._fireRivalArcBolt(muzzleOrigin, aimVec);
      }
    }
  }

  _updateRaider(e, dt, dist, toPlayer) {
    // Raiders actively sprint & flank across the street between cover positions and hop while firing bursts!
    e.strafePhase = (e.strafePhase || 0) + dt * 2.6;
    if (e.strafeDir === undefined) e.strafeDir = e.mesh.position.x < 0 ? 1 : -1;
    e.strafeSwitchTimer = (e.strafeSwitchTimer === undefined ? 1.8 : e.strafeSwitchTimer) - dt;
    if (e.strafeSwitchTimer <= 0 || Math.abs(e.mesh.position.x) > 4.6) {
      e.strafeDir *= -1;
      e.strafeSwitchTimer = 1.6 + Math.random() * 1.4;
    }

    const moveDir = dist > 0.001 ? toPlayer.clone().normalize() : new THREE.Vector3(0, 0, 1);
    const rightVec = new THREE.Vector3(-moveDir.z, 0, moveDir.x);

    const desiredDist = 11.5;
    let forwardSpeed = Math.sin(e.strafePhase * 1.4) * 1.8;
    if (dist > desiredDist + 3.0) forwardSpeed = e.speed * 0.85;
    else if (dist < desiredDist - 2.5) forwardSpeed = -e.speed * 0.70;

    const lateralSpeed = e.strafeDir * e.speed * 0.92;
    const step = rightVec.multiplyScalar(lateralSpeed * dt).add(moveDir.clone().multiplyScalar(forwardSpeed * dt));
    const cand = e.mesh.position.clone().add(step);
    if (!this.env || !this.env.checkCollision || !this.env.checkCollision(cand, 0.55, 2.2)) {
      e.mesh.position.x = cand.x;
      e.mesh.position.z = cand.z;
    } else {
      e.strafeDir *= -1;
    }

    // Agile Raider combat hops
    if (e.isGrounded === undefined) e.isGrounded = true;
    if (!e.isGrounded) {
      e.jumpVelocityY = (e.jumpVelocityY || 0) - 22.0 * dt;
      e.mesh.position.y += e.jumpVelocityY * dt;
      if (e.mesh.position.y <= 0) {
        e.mesh.position.y = 0;
        e.jumpVelocityY = 0;
        e.isGrounded = true;
      }
    } else if (Math.random() < dt * 0.55) {
      e.isGrounded = false;
      e.jumpVelocityY = 6.8;
    }

    if (e.attackCooldown <= 0 && dist < 38) {
      e.attackCooldown = 1.45 + Math.random() * 0.55;
      this._fireEnemyBlaster(e.mesh.position.clone().add(new THREE.Vector3(0, 1.32, 0)), moveDir);
    }
  }

  _updateHopper(e, dt, dist, toPlayer, onPlayerHit) {
    const moveDir = dist > 0.001 ? toPlayer.clone().normalize() : new THREE.Vector3(0, 0, 1);
    const rightVec = new THREE.Vector3(-moveDir.z, 0, moveDir.x);
    e.strafePhase = (e.strafePhase || 0) + dt * 3.4;

    // Fast weaving 3D zig-zag sprint down the street!
    const weaveSpeed = Math.cos(e.strafePhase) * e.speed * 0.78;
    const chargeSpeed = dist > 3.0 ? e.speed * 0.92 : Math.sin(e.strafePhase * 1.5) * 2.2;
    const step = moveDir.clone().multiplyScalar(chargeSpeed * dt).add(rightVec.multiplyScalar(weaveSpeed * dt));
    const cand = e.mesh.position.clone().add(step);
    if (!this.env || !this.env.checkCollision || !this.env.checkCollision(cand, 0.6, 2.4)) {
      e.mesh.position.x = cand.x;
      e.mesh.position.z = cand.z;
    }

    if (e.isGrounded) {
      if (dist < 18.0 && e.attackCooldown <= 0) {
        e.isGrounded = false;
        e.jumpVelocityY = 8.6;
        e.attackCooldown = 1.45;
        this._spawnRivalVFXRing(e.mesh.position, 'double_hop', 1.35, true);
      }
    } else {
      e.jumpVelocityY -= 21.0 * dt;
      e.mesh.position.y += e.jumpVelocityY * dt;

      if (e.mesh.position.y <= 0) {
        e.mesh.position.y = 0;
        e.isGrounded = true;
        this._spawnRivalVFXRing(e.mesh.position, 'sonic_ring', 1.45, true);
        if (dist < 3.4 && onPlayerHit) {
          onPlayerHit(16);
        }
      }
    }
  }

  _updateForeman(e, dt, dist, toPlayer, onPlayerHit) {
    if (e.health < e.maxHealth * 0.5 && e.phase === 1) {
      e.phase = 2;
      e.speed = 5.2;
    }

    e.strafePhase = (e.strafePhase || 0) + dt * 2.1;
    const moveDir = dist > 0.001 ? toPlayer.clone().normalize() : new THREE.Vector3(0, 0, 1);
    const rightVec = new THREE.Vector3(-moveDir.z, 0, moveDir.x);

    const lateralSpeed = Math.cos(e.strafePhase) * (e.speed || 3.8) * 0.75;
    const forwardSpeed = dist > 8.5 ? (e.speed || 3.8) * 0.78 : (dist < 5.5 ? -2.2 : 0);
    e.mesh.position.add(
      moveDir.clone().multiplyScalar(forwardSpeed * dt).add(rightVec.multiplyScalar(lateralSpeed * dt))
    );

    if (e.attackCooldown <= 0) {
      if (dist < 7.8) {
        e.attackCooldown = 2.8;
        this._spawnBossShockwave(e.mesh.position, dist, onPlayerHit);
      } else {
        e.attackCooldown = 1.85;
        this._fireBossSeedCannon(e.mesh.position.clone().add(new THREE.Vector3(0, 1.85, 0)), moveDir);
      }
    }
  }

  _fireRivalCarrotBolt(startPos, dir) {
    const tex = assetAtlas.getVFXTexture('bolt');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    sprite.scale.set(0.95, 0.52, 1);
    sprite.position.copy(startPos);
    this.scene.add(sprite);

    this.enemyProjectiles.push({
      mesh: sprite,
      velocity: dir.clone().multiplyScalar(25.0),
      damage: 7,
      hitVfx: 'impact_burst',
      life: 2.2
    });
  }

  _fireRivalSeedBomb(startPos, dir) {
    const tex = assetAtlas.getVFXTexture('seed_bomb');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true })
    );
    sprite.scale.set(0.75, 0.75, 1);
    sprite.position.copy(startPos);
    this.scene.add(sprite);

    const vel = dir.clone().multiplyScalar(17.5);
    vel.y += 4.2;

    this.enemyProjectiles.push({
      mesh: sprite,
      velocity: vel,
      isBallistic: true,
      gravity: -18.0,
      bounces: 2,
      damage: 14,
      hitVfx: 'seed_explosion',
      life: 3.0
    });
  }

  _fireRivalArcBolt(startPos, dir) {
    const tex = assetAtlas.getVFXTexture('arc_burst');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    sprite.scale.set(0.82, 0.82, 1);
    sprite.position.copy(startPos);
    this.scene.add(sprite);

    this.enemyProjectiles.push({
      mesh: sprite,
      velocity: dir.clone().multiplyScalar(27.0),
      damage: 9,
      hitVfx: 'arc_burst',
      life: 2.0
    });
  }

  _deployRivalDecoy(pos) {
    const tex = assetAtlas.getVFXTexture('decoy_bunny');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true })
    );
    sprite.position.copy(pos).setY(0.88);
    sprite.scale.set(1.65, 1.65, 1);
    this.scene.add(sprite);

    this.vfxEffects.push({
      mesh: sprite,
      isDecoy: true,
      scale: 1.65,
      growthRate: 0,
      life: 4.2
    });
  }

  _spawnRivalGroundSlam(pos, distToPlayer, onPlayerHit) {
    SoundFX.playSlam();
    this._spawnRivalVFXRing(pos, 'ground_slam', 1.8, true);
    if (distToPlayer < 6.8 && onPlayerHit) {
      onPlayerHit(18);
    }
  }

  _spawnRivalVFXRing(pos, vfxKey = 'double_hop', baseScale = 1.2, flatOnGround = false) {
    const tex = assetAtlas.getVFXTexture(vfxKey);
    let mesh;
    if (flatOnGround) {
      mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(baseScale * 1.6, baseScale * 1.6),
        new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.copy(pos).setY(Math.max(0.14, pos.y + 0.14));
    } else {
      mesh = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthWrite: false
        })
      );
      mesh.position.copy(pos);
      mesh.scale.set(baseScale, baseScale, 1);
    }
    this.scene.add(mesh);

    this.vfxEffects.push({
      mesh,
      scale: baseScale,
      growthRate: 4.2,
      life: 0.34
    });
  }

  _spawnShieldBreakVFX(pos) {
    this._spawnRivalVFXRing(pos.clone().add(new THREE.Vector3(0, 1.1, 0)), 'arc_burst', 1.65, false);
    this._spawnRivalVFXRing(pos, 'sonic_ring', 1.4, true);
  }

  _spawnEliminationVFX(pos, isMajor = false) {
    this._spawnRivalVFXRing(
      pos.clone().add(new THREE.Vector3(0, 1.0, 0)),
      isMajor ? 'seed_explosion' : 'impact_burst',
      isMajor ? 2.1 : 1.45,
      false
    );
  }

  _fireEnemyBlaster(startPos, dir) {
    const boltGroup = new THREE.Group();
    boltGroup.position.copy(startPos);

    const geo = new THREE.ConeGeometry(0.18, 1.35, 8);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff6a00 });
    boltGroup.add(new THREE.Mesh(geo, mat));

    const tex = assetAtlas.getVFXTexture('bolt');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, color: 0xffaa00, transparent: true, depthWrite: false })
    );
    sprite.scale.set(1.25, 0.72, 1.0);
    boltGroup.add(sprite);

    boltGroup.lookAt(startPos.clone().add(dir));
    this.scene.add(boltGroup);

    this.enemyProjectiles.push({
      mesh: boltGroup,
      velocity: dir.clone().multiplyScalar(22.0),
      damage: 8,
      hitVfx: 'impact_burst',
      life: 2.5
    });
  }

  _fireBossSeedCannon(startPos, dir) {
    for (const spreadAngle of [-0.14, 0, 0.14]) {
      const shotDir = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), spreadAngle);
      const bombGroup = new THREE.Group();
      bombGroup.position.copy(startPos);

      const geo = new THREE.SphereGeometry(0.32, 10, 10);
      const mat = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff2200, emissiveIntensity: 0.75 });
      bombGroup.add(new THREE.Mesh(geo, mat));

      const tex = assetAtlas.getVFXTexture('seed_bomb');
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sp.scale.set(1.25, 1.25, 1.0);
      bombGroup.add(sp);

      this.scene.add(bombGroup);

      const vel = shotDir.multiplyScalar(19.5);
      vel.y += 3.5;
      this.enemyProjectiles.push({
        mesh: bombGroup,
        velocity: vel,
        isBallistic: true,
        gravity: -16.0,
        bounces: 2,
        damage: 16,
        hitVfx: 'seed_explosion',
        life: 3.0
      });
    }
  }

  _spawnBossShockwave(pos, distToPlayer, onPlayerHit) {
    const ringGeo = new THREE.RingGeometry(0.5, 1.4, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos).setY(0.12);
    this.scene.add(ring);

    let scale = 1.0;
    const interval = setInterval(() => {
      scale += 0.75;
      ring.scale.set(scale, scale, scale);
      ringMat.opacity -= 0.1;
      if (scale > 8.0) {
        clearInterval(interval);
        this.scene.remove(ring);
      }
    }, 30);

    if (distToPlayer < 7.5 && onPlayerHit) {
      onPlayerHit(22);
    }
  }

  applyKnockback(enemy, impulseVec) {
    if (!enemy || !enemy.knockbackVel) return;
    enemy.knockbackVel.add(impulseVec);
    if (enemy.isGrounded && impulseVec.y > 0) {
      enemy.isGrounded = false;
      enemy.jumpVelocityY = impulseVec.y;
    }
  }

  applyDamage(enemy, damage) {
    let remDamage = damage;

    // Deplete Rival / Boss Shield first
    if (enemy.shield && enemy.shield > 0) {
      const absorbed = Math.min(enemy.shield, remDamage);
      enemy.shield -= absorbed;
      remDamage -= absorbed;
      if (enemy.shield <= 0) {
        enemy.shield = 0;
        soundEngine.playShieldBreak();
        this._spawnShieldBreakVFX(enemy.mesh.position);
        this.onCombatEvent?.({ type: 'shield_break', enemy });
      }
    }

    if (remDamage > 0) {
      enemy.health = Math.max(0, enemy.health - remDamage);
    }
    enemy.wobbleTime = 0.35;

    // Reactive dodge-hop when a Rival Player takes fire
    if (enemy.isRival && enemy.health > 0 && enemy.dodgeCooldown <= 0) {
      enemy.dodgeCooldown = 2.8;
      enemy.strafeDir *= -1;
      if (enemy.isGrounded) {
        enemy.isGrounded = false;
        enemy.jumpVelocityY = 7.8;
        this._spawnRivalVFXRing(enemy.mesh.position, 'double_hop', 1.25, true);
      }
    }

    return enemy.health <= 0;
  }

  clear() {
    for (const t of this.spawnTelegraphs) {
      this.scene.remove(t.mesh);
    }
    this.spawnTelegraphs = [];
    for (const e of this.enemies) {
      this.scene.remove(e.mesh);
    }
    this.enemies = [];
    for (const p of this.enemyProjectiles) {
      this.scene.remove(p.mesh);
    }
    this.enemyProjectiles = [];
    for (const fx of this.vfxEffects) {
      this.scene.remove(fx.mesh);
    }
    this.vfxEffects = [];
  }
}
