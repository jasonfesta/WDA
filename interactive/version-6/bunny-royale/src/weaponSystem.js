import * as THREE from 'three';
import { SoundFX } from './soundFX.js';
import { soundEngine } from './soundEngine.js';
import { assetAtlas } from './assetAtlas.js';

// Weapon & Projectile Dispatcher with High-Craft Painted VFX from fx-projectile-ability-sheet.png
export class WeaponSystem {
  constructor(scene, environment, gameState, enemyAI = null) {
    this.scene = scene;
    this.env = environment;
    this.gameState = gameState;
    this.enemyAI = enemyAI;
    this.cameraRig = null;
    this.activeFighterConfig = null;

    this.projectiles = [];
    this.particles = [];
    this.explosionLights = [];
    this.lightningArcs = [];
    this.decoys = [];
    this.shotCounter = 0;

    this.onHitCallback = null;
    this.onHitConfirmed = null;
    this.onBarrelExploded = null;
  }

  setCameraRig(cameraRig) {
    this.cameraRig = cameraRig;
  }

  setEnemyAIManager(enemyAI) {
    this.enemyAI = enemyAI;
  }

  setHitCallback(cb) {
    this.onHitCallback = cb;
  }

  setHitConfirmedCallback(cb) {
    this.onHitConfirmed = cb;
  }

  _getTargets() {
    const list = [];
    if (this.enemyAI && this.enemyAI.enemies) {
      for (const e of this.enemyAI.enemies) {
        if (e.health > 0) list.push(e);
      }
    }
    if (this.env && this.env.targetDummies) {
      for (const d of this.env.targetDummies) {
        if (d.health > 0) list.push(d);
      }
    }
    return list;
  }

  /**
   * Finds the best enemy target under or near the crosshair ray using
   * both sphere intersection and a generous ~10.5 degree aim-assist cone.
   */
  findBestAimTarget(aimRay) {
    const targets = this._getTargets();
    let bestTarget = null;
    let bestPoint = null;
    let bestScore = Infinity;

    for (const t of targets) {
      const tPos = t.mesh ? t.mesh.position : t.position;
      const scale = t.scale || 1.0;
      const chestCenter = tPos.clone().add(new THREE.Vector3(0, 1.12 * scale, 0));
      const toEnemy = chestCenter.clone().sub(aimRay.origin);
      const dist = toEnemy.length();
      if (dist < 0.8 || dist > 65) continue;

      const dirToEnemy = toEnemy.clone().divideScalar(dist);
      const cosAngle = aimRay.direction.dot(dirToEnemy);

      // 1. Direct sphere intersection with generous hitbox
      const hitRadius = (t.radius || 0.85) + 0.85;
      const tSphere = new THREE.Sphere(chestCenter, hitRadius);
      const hitPt = new THREE.Vector3();
      if (aimRay.intersectSphere(tSphere, hitPt)) {
        const score = dist * (1.0 - cosAngle * 0.8);
        if (score < bestScore) {
          bestScore = score;
          bestTarget = t;
          bestPoint = chestCenter.clone();
        }
        continue;
      }

      // 2. Generous Angular Aim-Assist Cone (~16 degrees around crosshair ray)
      if (cosAngle >= 0.960) {
        const perpDist = Math.sin(Math.acos(Math.min(1, cosAngle))) * dist;
        if (perpDist < 3.8 * scale) {
          const score = dist + perpDist * 4.5;
          if (score < bestScore) {
            bestScore = score;
            bestTarget = t;
            bestPoint = chestCenter.clone();
          }
        }
      }
    }

    // Also allow aiming directly at Explosive Hazard Barrels in the arena!
    if (this.env && this.env.explosiveBarrels) {
      for (const b of this.env.explosiveBarrels) {
        if (b.exploded || b.health <= 0) continue;
        const bCenter = b.position.clone();
        const toBarrel = bCenter.clone().sub(aimRay.origin);
        const dist = toBarrel.length();
        if (dist < 1.0 || dist > 60) continue;
        const dirToBarrel = toBarrel.clone().divideScalar(dist);
        const cosAngle = aimRay.direction.dot(dirToBarrel);
        if (cosAngle >= 0.985) {
          const perpDist = Math.sin(Math.acos(Math.min(1, cosAngle))) * dist;
          if (perpDist < 1.85) {
            const score = dist + perpDist * 5.0 + 4.0;
            if (score < bestScore) {
              bestScore = score;
              bestTarget = b;
              bestPoint = bCenter.clone();
            }
          }
        }
      }
    }

    return { target: bestTarget, point: bestPoint };
  }

  tryFire(cameraRig, characterMesh, fighterConfig, nowSec, cursorNDC = null) {
    this.cameraRig = cameraRig;
    this.activeFighterConfig = fighterConfig;
    const w = fighterConfig.weapon;
    const gs = this.gameState;

    if (gs.isReloading) return false;
    if (gs.curAmmo <= 0) {
      this.triggerReload(fighterConfig);
      return false;
    }

    const minInterval = 1.0 / w.fireRate;
    if (nowSec - gs.lastFireTime < minInterval) return false;

    gs.lastFireTime = nowSec;
    gs.curAmmo--;
    gs.shotsFired = (gs.shotsFired || 0) + 1;
    this.shotCounter++;
    gs.notify();

    // Auto-trigger reload the instant the last round in the magazine is fired!
    if (gs.curAmmo <= 0) {
      setTimeout(() => this.triggerReload(fighterConfig), 90);
    }

    // Apply CoD / Fortnite Spring-Damper Camera Recoil Kick
    if (cameraRig && typeof cameraRig.applyRecoil === 'function') {
      const pitchKick = w.projectileType === 'bomb' ? 0.026 : (w.projectileType === 'arc' ? 0.011 : 0.014);
      const yawKick = (Math.random() - 0.5) * 0.008;
      cameraRig.applyRecoil(pitchKick, yawKick);
    }

    // Compute visible world muzzle position at the exact tip of the 3D weapon barrel
    const muzzlePos = new THREE.Vector3();
    const weaponMesh = characterMesh.userData.weaponMesh;
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), characterMesh.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), characterMesh.rotation.y);
    if (weaponMesh) {
      weaponMesh.getWorldPosition(muzzlePos);
      weaponMesh.userData.recoilZ = 0.22;
      muzzlePos.add(forward.clone().multiplyScalar(0.52)).add(right.clone().multiplyScalar(0.14));
      muzzlePos.y += 0.08;
    } else {
      muzzlePos.copy(characterMesh.position)
        .add(forward.clone().multiplyScalar(0.45))
        .add(right.clone().multiplyScalar(0.44))
        .add(new THREE.Vector3(0, 0.96, 0));
    }

    // Every 3rd shot of Carrot Carbine / Arc Fork is an Overcharged Explosive Round!
    const isExplosiveRound = (w.projectileType === 'bomb') || (this.shotCounter % 3 === 0);

    // Determine Aim Direction from Camera Crosshair / Cursor Ray with smart target magnetism
    const aimRay = cameraRig.getAimRay(cursorNDC);
    const farPoint = aimRay.origin.clone().add(aimRay.direction.clone().multiplyScalar(75));
    let targetPoint = farPoint.clone();

    const { target: lockedTarget, point: lockedPoint } = this.findBestAimTarget(aimRay);
    if (lockedTarget && lockedPoint && lockedPoint.distanceTo(muzzlePos) > 6.5) {
      targetPoint.copy(lockedPoint);
    } else {
      let closestDist = Infinity;
      for (const box of this.env.colliders) {
        if (box.isGroundOrLow) continue;
        const hitPt = new THREE.Vector3();
        if (aimRay.intersectBox(box, hitPt)) {
          const d = aimRay.origin.distanceTo(hitPt);
          if (d > 10.0 && d < closestDist) {
            closestDist = d;
            targetPoint.copy(hitPt);
          }
        }
      }
    }

    const spread = THREE.MathUtils.lerp(w.spreadMin, w.spreadMax, 0.02);
    const shootDir = targetPoint.clone().sub(muzzlePos).normalize();
    if (!lockedTarget) {
      shootDir.x += (Math.random() - 0.5) * spread;
      shootDir.y += (Math.random() - 0.5) * spread;
      shootDir.z += (Math.random() - 0.5) * spread;
      shootDir.normalize();
    }

    // Long-distance downrange beam vector with slight upward horizon elevation for dramatic OTS parallax!
    const downrangeTarget = farPoint.clone();
    downrangeTarget.y = Math.max(muzzlePos.y + 1.95, farPoint.y + 0.85);
    const downrangeDir = downrangeTarget.sub(muzzlePos).normalize();

    // Spawn Unmistakable 3D Muzzle Blast Assembly at the Barrel Tip
    this._spawnMuzzleFlash(muzzlePos, downrangeDir, w.projectileType === 'arc' ? 'arc_burst' : 'muzzle_flash');

    // Project a 60-meter downrange 3D plasma beam starting 1.8m ahead of muzzle (never trails behind running player!)
    const beamStart = muzzlePos.clone().add(downrangeDir.clone().multiplyScalar(1.8));
    const downrangeEnd = muzzlePos.clone().add(downrangeDir.clone().multiplyScalar(60));
    const tracerColor = w.projectileType === 'arc' ? 0xff2a9d : (isExplosiveRound ? 0xffbb00 : 0xff6a00);
    this._spawnShotTracer(beamStart, downrangeEnd, tracerColor);

    if (w.projectileType === 'bolt') {
      SoundFX.playLaser(false);
      soundEngine.playLaser();
      this._spawnCarrotBolt(muzzlePos.clone().add(downrangeDir.clone().multiplyScalar(0.9)), shootDir, w, lockedTarget, isExplosiveRound);
      // Spawn high-speed downrange tracer bolts at 4.5m, 10.5m, and 18.0m so every shot blasts far into the distance!
      for (const dLead of [4.5, 10.5, 18.0]) {
        const leadPos = muzzlePos.clone().add(downrangeDir.clone().multiplyScalar(dLead));
        this._spawnCarrotBolt(leadPos, downrangeDir, w, null, false);
      }
    } else if (w.projectileType === 'bomb') {
      SoundFX.playCannon();
      soundEngine.playSeedThump();
      this._spawnSeedBomb(muzzlePos, shootDir, w, lockedTarget);
    } else if (w.projectileType === 'arc') {
      SoundFX.playLaser(true);
      soundEngine.playArcLightning();
      this._fireArcLightning(muzzlePos, downrangeDir, w, lockedTarget, isExplosiveRound);
    }

    return true;
  }

  _spawnMuzzleFlash(pos, shootDir = new THREE.Vector3(0, 0, -1), vfxKey = 'muzzle_flash') {
    const isArc = vfxKey === 'arc_burst';
    const tex = assetAtlas.getVFXTexture(vfxKey);

    // 1. Crisp Starburst Muzzle Flash at Barrel Tip
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      })
    );
    sprite.position.copy(pos);
    sprite.scale.set(1.45, 1.45, 1.0);
    this.scene.add(sprite);

    this.particles.push({
      mesh: sprite,
      isShockwave: true,
      scale: 1.45,
      growthRate: 6.5,
      life: 0.14
    });

    // 2. Crossed 3D Forward Muzzle Flame Fins shooting out along shootDir (never blocks camera with flat disc!)
    const boltTex = assetAtlas.getVFXTexture('bolt');
    const jetGroup = new THREE.Group();
    jetGroup.position.copy(pos).add(shootDir.clone().multiplyScalar(0.85));
    jetGroup.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), shootDir);
    const jetMat = new THREE.MeshBasicMaterial({
      map: boltTex,
      color: isArc ? 0x00f2fe : 0xffffff,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const j1 = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.72), jetMat);
    const j2 = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.72), jetMat);
    j2.rotation.x = Math.PI / 2;
    jetGroup.add(j1, j2);
    this.scene.add(jetGroup);
    this.lightningArcs.push({ line: jetGroup, life: 0.14 });

    // 3. Expanding Muzzle Sonic Ring downrange of barrel (smaller radius so it stays at barrel height)
    const ringTex = assetAtlas.getVFXTexture('sonic_ring');
    const ringSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: ringTex,
        color: isArc ? 0xff2a9d : 0xffaa00,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );
    ringSprite.position.copy(pos).add(shootDir.clone().multiplyScalar(1.2));
    ringSprite.scale.set(0.65, 0.65, 1.0);
    this.scene.add(ringSprite);
    this.particles.push({
      mesh: ringSprite,
      isShockwave: true,
      scale: 0.65,
      growthRate: 4.2,
      life: 0.14
    });

    // 4. Dynamic Muzzle PointLight illuminating player & street
    const flashLight = new THREE.PointLight(isArc ? 0xff2a9d : 0xff8800, 3.6, 9.5, 1.6);
    flashLight.position.copy(pos);
    this.scene.add(flashLight);
    this.explosionLights.push({ light: flashLight, life: 0.14, maxLife: 0.14, baseIntensity: 3.6 });

    // 5. High-velocity forward muzzle sparks blasting downrange
    const firePuffTex = this._getSoftPuffTexture('fire');
    for (let i = 0; i < 6; i++) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: firePuffTex,
          color: isArc ? 0x00f2fe : 0xffdd44,
          transparent: true,
          depthWrite: false
        })
      );
      sp.scale.set(0.36, 0.36, 1.0);
      sp.position.copy(pos).add(shootDir.clone().multiplyScalar(0.6 + i * 0.5));
      const spVel = shootDir.clone().multiplyScalar(26 + Math.random() * 18);
      spVel.x += (Math.random() - 0.5) * 3.2;
      spVel.y += (Math.random() - 0.3) * 3.0;
      spVel.z += (Math.random() - 0.5) * 3.2;
      this.scene.add(sp);
      this.particles.push({
        mesh: sp,
        isShockwave: false,
        velocity: spVel,
        gravity: -6.0,
        bounces: 0,
        life: 0.24
      });
    }
  }

  _spawnShotTracer(startPt, endPt, colorHex = 0xff7700) {
    const delta = endPt.clone().sub(startPt);
    const len = Math.max(1.0, delta.length());
    const dir = delta.clone().normalize();
    const mid = startPt.clone().add(dir.clone().multiplyScalar(len * 0.5));

    const tracerGroup = new THREE.Group();
    tracerGroup.position.copy(mid);
    tracerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);

    // 1. White-hot inner laser core + outer glowing plasma cylinder streaking 60m downrange
    const coreGeo = new THREE.CylinderGeometry(0.05, 0.08, len, 8);
    coreGeo.rotateZ(Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.96,
      depthWrite: false
    });
    tracerGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const outerGeo = new THREE.CylinderGeometry(0.14, 0.22, len, 8);
    outerGeo.rotateZ(Math.PI / 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.68,
      depthWrite: false
    });
    tracerGroup.add(new THREE.Mesh(outerGeo, outerMat));

    // 2. Spaced 3D-Aligned Plasma Bolt Cones & Glowing Orbs streaking downrange along the beam
    const firePuffTex = this._getSoftPuffTexture('fire');
    for (const d of [2.5, 6.8, 12.5, 19.5, 28.0, 38.0]) {
      if (d >= len) break;
      const orbSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: firePuffTex,
          color: 0xffdd55,
          transparent: true,
          depthWrite: false
        })
      );
      orbSprite.position.set(-len * 0.5 + d, 0, 0);
      const s = Math.max(0.55, 1.15 - d * 0.014);
      orbSprite.scale.set(s, s, 1.0);
      tracerGroup.add(orbSprite);
    }

    this.scene.add(tracerGroup);
    this.lightningArcs.push({ line: tracerGroup, life: 0.09 });
  }

  _getSoftPuffTexture(mode = 'dust') {
    this._puffTexCache = this._puffTexCache || {};
    if (this._puffTexCache[mode]) return this._puffTexCache[mode];

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    if (mode === 'fire') {
      grad.addColorStop(0, 'rgba(255, 250, 190, 1)');
      grad.addColorStop(0.45, 'rgba(255, 120, 0, 0.92)');
      grad.addColorStop(0.8, 'rgba(220, 38, 38, 0.45)');
      grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    } else if (mode === 'smoke') {
      grad.addColorStop(0, 'rgba(71, 85, 105, 0.85)');
      grad.addColorStop(0.55, 'rgba(51, 65, 85, 0.5)');
      grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
    } else {
      grad.addColorStop(0, 'rgba(241, 245, 249, 0.75)');
      grad.addColorStop(0.6, 'rgba(203, 213, 225, 0.35)');
      grad.addColorStop(1, 'rgba(203, 213, 225, 0)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    this._puffTexCache[mode] = tex;
    return tex;
  }

  spawnFootstepDust(playerPos, yaw, sideOffset = 0.2, isSprinting = false) {
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const puffPos = playerPos.clone()
      .add(right.multiplyScalar(sideOffset))
      .add(new THREE.Vector3(0, 0.14, 0));

    const puff = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this._getSoftPuffTexture('dust'),
        transparent: true,
        opacity: isSprinting ? 0.55 : 0.36,
        depthWrite: false
      })
    );
    puff.position.copy(puffPos);
    const baseS = isSprinting ? 0.42 : 0.28;
    puff.scale.set(baseS, baseS, 1.0);
    this.scene.add(puff);

    this.particles.push({
      mesh: puff,
      isShockwave: true,
      scale: baseS,
      growthRate: isSprinting ? 1.8 : 1.2,
      life: 0.24
    });
  }

  spawnDoubleHopRings(pos) {
    const tex = assetAtlas.getVFXTexture('double_hop');
    const ringPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 2.1),
      new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
      })
    );
    ringPlane.rotation.x = -Math.PI / 2;
    ringPlane.position.copy(pos).add(new THREE.Vector3(0, 0.18, 0));
    this.scene.add(ringPlane);

    this.particles.push({
      mesh: ringPlane,
      isShockwave: true,
      scale: 1.0,
      growthRate: 4.5,
      life: 0.42
    });
  }

  triggerReload(fighterConfig) {
    const cfg = fighterConfig || this.activeFighterConfig;
    const gs = this.gameState;
    if (!gs || gs.isReloading || gs.curAmmo >= gs.maxAmmo) return;
    gs.isReloading = true;
    gs.reloadProgress = 0;
    this._reloadDuration = Math.min(0.85, (cfg && cfg.weapon && cfg.weapon.reloadTime) ? cfg.weapon.reloadTime * 0.65 : 0.72);
    this._reloadElapsed = 0;
    SoundFX.playSelect();
    gs.notify();
  }

  _spawnCarrotBolt(pos, dir, weaponConfig, lockedTarget = null, isExplosiveRound = false) {
    const boltGroup = new THREE.Group();
    boltGroup.position.copy(pos);

    const boltTex = assetAtlas.getVFXTexture('bolt');
    const mat = new THREE.MeshBasicMaterial({
      map: boltTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // 1. 3D Volumetric Glowing Carrot Plasma Torpedo Core (+X nose)
    const torpedoGeo = new THREE.ConeGeometry(0.24, 2.15, 8);
    torpedoGeo.rotateZ(-Math.PI / 2);
    const torpedoMat = new THREE.MeshBasicMaterial({
      color: isExplosiveRound ? 0xffe600 : 0xff7b00,
      transparent: true,
      opacity: 0.94
    });
    boltGroup.add(new THREE.Mesh(torpedoGeo, torpedoMat));

    const innerGeo = new THREE.CylinderGeometry(0.08, 0.14, 2.35, 6);
    innerGeo.rotateZ(-Math.PI / 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    boltGroup.add(new THREE.Mesh(innerGeo, innerMat));

    // 3D Green Carrot Leaf Tail Fins at rear (-X)
    const finGeo = new THREE.ConeGeometry(0.22, 0.58, 5);
    finGeo.rotateZ(Math.PI / 2);
    finGeo.translate(-1.05, 0, 0);
    const finMat = new THREE.MeshBasicMaterial({ color: 0x38d942 });
    boltGroup.add(new THREE.Mesh(finGeo, finMat));

    // 2. Large Crossed 3D Studio VFX Planes + 3.2m Glowing Plasma Tail + Radial Halo Orb
    const p1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.95), mat);
    const p2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.95), mat);
    p2.rotation.x = Math.PI / 2;
    boltGroup.add(p1, p2);

    const tailGeo = new THREE.CylinderGeometry(0.03, 0.14, 3.2, 6);
    tailGeo.rotateZ(Math.PI / 2);
    tailGeo.translate(-1.8, 0, 0);
    const tailMat = new THREE.MeshBasicMaterial({
      color: isExplosiveRound ? 0xffea00 : 0xff7700,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    boltGroup.add(new THREE.Mesh(tailGeo, tailMat));

    const coreSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this._getSoftPuffTexture('fire'),
        color: isExplosiveRound ? 0xffea44 : 0xffa611,
        transparent: true,
        depthWrite: false
      })
    );
    const s = isExplosiveRound ? 1.25 : 0.95;
    coreSprite.scale.set(s, s, 1.0);
    boltGroup.add(coreSprite);

    // Orient +X of 3D torpedo along flight direction dir
    boltGroup.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
    this.scene.add(boltGroup);

    this.projectiles.push({
      mesh: boltGroup,
      velocity: dir.clone().multiplyScalar(38.0),
      damage: weaponConfig.damage,
      isBallistic: false,
      isExplosiveRound,
      splashRadius: isExplosiveRound ? 4.2 : 0,
      homingTarget: lockedTarget,
      pierceRemaining: 2,
      hitTargets: new Set(),
      trailTimer: 0,
      life: 2.2,
      type: 'bolt'
    });
  }

  _spawnSeedBomb(pos, dir, weaponConfig, lockedTarget = null) {
    const bombGroup = new THREE.Group();
    bombGroup.position.copy(pos);

    // 3D Sculpted Glowing Seed Bomb Core + Outer Spikes
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      emissive: 0xff5500,
      emissiveIntensity: 0.85,
      roughness: 0.3
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    bombGroup.add(coreMesh);
    bombGroup.userData.spinMesh = coreMesh;

    const tex = assetAtlas.getVFXTexture('seed_bomb');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      })
    );
    sprite.scale.set(1.48, 1.48, 1.0);
    bombGroup.add(sprite);

    this.scene.add(bombGroup);

    const vel = dir.clone().multiplyScalar(Math.max(28.0, weaponConfig.projectileSpeed || 28.0));
    vel.y += 3.2;

    this.projectiles.push({
      mesh: bombGroup,
      velocity: vel,
      damage: weaponConfig.damage,
      isBallistic: true,
      gravity: -15.0,
      bounces: 1,
      homingTarget: lockedTarget,
      splashRadius: weaponConfig.splashRadius || 5.8,
      trailTimer: 0,
      life: 3.5,
      type: 'bomb'
    });
  }

  _spawnArcBeamRibbon(startPt, endPt, thickness = 0.90, life = 0.14) {
    const delta = endPt.clone().sub(startPt);
    const dist = Math.max(0.2, delta.length());
    const dir = delta.clone().normalize();
    const midPt = startPt.clone().add(dir.clone().multiplyScalar(dist * 0.5));

    const arcTex = assetAtlas.getVFXTexture('arc_beam');
    const beamMat = new THREE.MeshBasicMaterial({
      map: arcTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beamPlane = new THREE.Mesh(new THREE.PlaneGeometry(dist, thickness), beamMat);
    beamPlane.position.copy(midPt);
    beamPlane.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
    this.scene.add(beamPlane);

    this.lightningArcs.push({ line: beamPlane, life });
  }

  _fireArcLightning(muzzlePos, dir, weaponConfig, lockedTarget = null, isExplosiveRound = false) {
    const maxRange = 58;
    const endPoint = muzzlePos.clone().add(dir.clone().multiplyScalar(maxRange));

    let hitTarget = lockedTarget && lockedTarget.health > 0 ? lockedTarget : null;
    let closestDist = maxRange;

    const targets = this._getTargets();
    if (hitTarget) {
      const tPos = hitTarget.mesh ? hitTarget.mesh.position : hitTarget.position;
      const scale = hitTarget.scale || 1.0;
      endPoint.copy(tPos).add(new THREE.Vector3(0, 1.15 * scale, 0));
      closestDist = muzzlePos.distanceTo(endPoint);
    } else {
      for (const t of targets) {
        const tPos = t.mesh ? t.mesh.position : t.position;
        const scale = t.scale || 1.0;
        const tSphere = new THREE.Sphere(
          tPos.clone().add(new THREE.Vector3(0, 1.08 * scale, 0)),
          (t.radius || 0.85) + 0.85
        );
        const hitPt = new THREE.Vector3();
        const ray = new THREE.Ray(muzzlePos, dir);
        if (ray.intersectSphere(tSphere, hitPt)) {
          const d = muzzlePos.distanceTo(hitPt);
          if (d < closestDist) {
            closestDist = d;
            endPoint.copy(hitPt);
            hitTarget = t;
          }
        }
      }
    }

    if (hitTarget) {
      // Check if hitTarget is an Explosive Hazard Barrel!
      if (hitTarget.exploded !== undefined) {
        this._detonateExplosiveBarrel(hitTarget);
      } else {
        const tPos = hitTarget.mesh ? hitTarget.mesh.position : hitTarget.position;
        const scale = hitTarget.scale || 1.0;
        const isCrit = (endPoint.y - tPos.y) > 1.35 * scale;
        this._applyDamageToTarget(hitTarget, weaponConfig.damage, isCrit, endPoint);
        if (isExplosiveRound) {
          this.spawnMultiStageExplosion(endPoint, 3.8, 1.15, 'arc');
        } else {
          this._spawnImpactBurst(endPoint, 'arc_burst', 1.48);
        }

        // Also check if any Explosive Barrel is within 4.5m of the shocked enemy and detonate it!
        this._checkNearbyBarrelDetonation(tPos, 4.2);

        // Volt's Arc Fork Chain Lightning: jump to nearby enemies within 6.5m!
        const chainRadius = 6.5;
        const chainDamage = Math.round(weaponConfig.damage * 0.55);
        let chainsCount = 0;
        for (const other of targets) {
          if (other === hitTarget || other.health <= 0 || chainsCount >= 3) continue;
          const otherPos = (other.mesh ? other.mesh.position : other.position).clone();
          const dChain = otherPos.distanceTo(tPos);
          if (dChain <= chainRadius) {
            chainsCount++;
            const chainEnd = otherPos.clone().add(new THREE.Vector3(0, 1.1, 0));
            this._spawnArcBeamRibbon(endPoint, chainEnd, 0.72, 0.16);
            this._spawnImpactBurst(chainEnd, 'arc_burst', 1.25);
            this._applyDamageToTarget(other, chainDamage, false, chainEnd);
          }
        }
      }
    }

    // Render primary hot-pink & cyan lightning beam ribbon all the way into the distance (52m!)
    const beamDist = Math.max(closestDist, 52);
    const beamEnd = muzzlePos.clone().add(dir.clone().multiplyScalar(beamDist));
    this._spawnArcBeamRibbon(muzzlePos, beamEnd, 1.25, 0.16);

    // Also launch a high-visibility 3D electric plasma orb streaming downrange along the beam!
    this._spawnCarrotBolt(muzzlePos, dir, weaponConfig, null, true);
  }

  deployVoltDecoy(position) {
    SoundFX.playSelect();
    const decoyGroup = new THREE.Group();
    decoyGroup.position.copy(position).add(new THREE.Vector3(0, 0.85, -1.2));

    const tex = assetAtlas.getVFXTexture('decoy_bunny');
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true
      })
    );
    sprite.scale.set(1.85, 1.85, 1.0);
    decoyGroup.add(sprite);

    const disc = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.72, 20),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, side: THREE.DoubleSide })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -0.80;
    decoyGroup.add(disc);

    this.scene.add(decoyGroup);

    this.decoys.push({
      group: decoyGroup,
      life: 6.0
    });
  }

  /**
   * CoD / Fortnite Multi-Stage Painterly 3D Explosion Engine (Zero Blocky Primitives!)
   * Stage 1: Studio-Painted Fireball Core (`seed_explosion` + `muzzle_flash`) + Dynamic PointLight Flash
   * Stage 2: Rapidly Expanding 3D Horizontal Shockwave Ring (`sonic_ring` / `ground_slam`)
   * Stage 3: 18 Painterly Fire Embers, Soft Smoke Clouds & Studio Debris Sprites with Gravity & Bounce
   */
  spawnMultiStageExplosion(centerPos, radius = 4.5, scale = 1.25, theme = 'fire') {
    const pos = centerPos.clone();
    if (pos.y < 0.35) pos.y = 0.35;

    const midColor = theme === 'arc' ? 0xff2a9d : 0xff6b00;

    // 1. Dynamic PointLight Flash illuminating surrounding buildings & street (balanced intensity)
    const flashLight = new THREE.PointLight(midColor, 2.8 * scale, 11 * scale, 1.8);
    flashLight.position.copy(pos).add(new THREE.Vector3(0, 0.8, 0));
    this.scene.add(flashLight);
    this.explosionLights.push({ light: flashLight, life: 0.22, maxLife: 0.22, baseIntensity: 2.8 * scale });

    // 2. Multi-Layer Studio Painted Fireball Core + Flash Sprites
    this._spawnImpactBurst(
      pos.clone().add(new THREE.Vector3(0, 0.35 * scale, 0)),
      theme === 'arc' ? 'arc_burst' : 'seed_explosion',
      1.95 * scale
    );
    this._spawnImpactBurst(
      pos.clone().add(new THREE.Vector3(0, 0.55 * scale, 0)),
      theme === 'arc' ? 'sonic_ring' : 'muzzle_flash',
      1.55 * scale
    );

    // 3. Expanding 3D Ground Shockwave Ring (using studio ground_slam / sonic_ring texture)
    const ringTex = assetAtlas.getVFXTexture(theme === 'arc' ? 'sonic_ring' : 'ground_slam');
    const ringPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4 * scale, 2.4 * scale),
      new THREE.MeshBasicMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
        depthWrite: false
      })
    );
    ringPlane.rotation.x = -Math.PI / 2;
    ringPlane.position.set(pos.x, 0.15, pos.z);
    this.scene.add(ringPlane);
    this.particles.push({
      mesh: ringPlane,
      isShockwave: true,
      scale: 0.85 * scale,
      growthRate: 6.2 * scale,
      life: 0.36
    });

    // 4. 16 Painterly Physics Embers, Soft Smoke Clouds & Secondary Spark Bursts
    const firePuffTex = this._getSoftPuffTexture('fire');
    const smokePuffTex = this._getSoftPuffTexture('smoke');
    const sparkBurstTex = assetAtlas.getVFXTexture(theme === 'arc' ? 'arc_burst' : 'impact_burst');
    const sparkCount = Math.min(16, Math.round(10 * scale));

    for (let i = 0; i < sparkCount; i++) {
      const isSmoke = (i % 4 === 0);
      const isBurst = (i % 3 === 1);

      const mat = new THREE.SpriteMaterial({
        map: isSmoke ? smokePuffTex : (isBurst ? sparkBurstTex : firePuffTex),
        transparent: true,
        opacity: isSmoke ? 0.65 : 0.95,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      const s = isSmoke ? (0.65 * scale) : (isBurst ? (0.55 * scale) : (0.34 * scale));
      sprite.scale.set(s, s, 1.0);
      sprite.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        0.15 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.5
      ));

      const angle = Math.random() * Math.PI * 2;
      const horizSpeed = isSmoke ? (1.2 + Math.random() * 2.4) : (3.5 + Math.random() * 6.8 * scale);
      const upSpeed = isSmoke ? (2.6 + Math.random() * 2.5) : (3.5 + Math.random() * 6.5 * scale);

      this.scene.add(sprite);
      this.particles.push({
        mesh: sprite,
        isShockwave: false,
        isSmoke,
        velocity: new THREE.Vector3(
          Math.cos(angle) * horizSpeed,
          upSpeed,
          Math.sin(angle) * horizSpeed
        ),
        gravity: isSmoke ? 1.5 : -22.0,
        bounces: isSmoke ? 0 : 1,
        life: isSmoke ? 0.52 : 0.44
      });
    }

    if (this.cameraRig) {
      this.cameraRig.addShake(Math.min(0.32, 0.14 * scale));
    }
  }

  _checkNearbyBarrelDetonation(worldPos, triggerRadius = 3.8) {
    if (!this.env || !this.env.explosiveBarrels) return;
    for (const barrel of this.env.explosiveBarrels) {
      if (barrel.exploded || barrel.health <= 0) continue;
      if (barrel.position.distanceTo(worldPos) <= triggerRadius) {
        this._detonateExplosiveBarrel(barrel);
      }
    }
  }

  _detonateExplosiveBarrel(barrel) {
    if (!barrel || barrel.exploded) return;
    barrel.exploded = true;
    barrel.health = 0;

    // Remove barrel mesh & collider from arena
    if (barrel.mesh) this.scene.remove(barrel.mesh);
    if (barrel.collider && this.env && this.env.colliders) {
      const idx = this.env.colliders.indexOf(barrel.collider);
      if (idx !== -1) this.env.colliders.splice(idx, 1);
    }

    const blastPos = barrel.position.clone();
    SoundFX.playSlam();
    SoundFX.playCannon();

    // Multi-Stage Nitro Carrot Barrel Explosion!
    this.spawnMultiStageExplosion(blastPos, 5.4, 1.45, 'fire');

    if (this.onBarrelExploded) {
      this.onBarrelExploded(blastPos);
    }

    // Deal heavy 95 AOE splash damage & launch nearby enemies!
    const blastRadius = 5.4;
    const targets = this._getTargets();
    for (const t of targets) {
      const tPos = t.mesh ? t.mesh.position : t.position;
      const d = tPos.distanceTo(blastPos);
      if (d <= blastRadius) {
        const falloff = Math.max(0.45, 1.0 - d / (blastRadius * 1.25));
        const dmg = Math.round(95 * falloff);
        const hitPos = tPos.clone().add(new THREE.Vector3(0, 1.2, 0));
        this._applyDamageToTarget(t, dmg, true, hitPos);

        if (this.enemyAI && typeof this.enemyAI.applyKnockback === 'function') {
          const pushDir = tPos.clone().sub(blastPos);
          pushDir.y = 0;
          if (pushDir.z > -0.25) pushDir.z = -0.65;
          if (pushDir.lengthSq() < 0.01) pushDir.set(0, 0, -1);
          pushDir.normalize();
          const impulse = pushDir.multiplyScalar(8.5 * falloff);
          impulse.y = 5.5;
          this.enemyAI.applyKnockback(t, impulse);
        }
      }
    }

    // Splinter any Destructible Crates within 4.5m!
    if (this.env && this.env.destructibleCrates) {
      for (const crate of this.env.destructibleCrates) {
        if (!crate.destroyed && crate.position.distanceTo(blastPos) <= 4.5) {
          this._damageDestructibleCrate(crate, 999);
        }
      }
    }

    // Chain-reaction detonate any other Explosive Barrels within 5.2m after a 110ms stagger!
    if (this.env && this.env.explosiveBarrels) {
      for (const other of this.env.explosiveBarrels) {
        if (!other.exploded && other.position.distanceTo(blastPos) <= 5.2) {
          setTimeout(() => this._detonateExplosiveBarrel(other), 110);
        }
      }
    }
  }

  _damageDestructibleCrate(crate, amount) {
    if (!crate || crate.destroyed) return;
    crate.health -= amount;
    if (crate.health > 0) return;

    crate.destroyed = true;
    if (crate.mesh) this.scene.remove(crate.mesh);
    if (crate.collider && this.env && this.env.colliders) {
      const idx = this.env.colliders.indexOf(crate.collider);
      if (idx !== -1) this.env.colliders.splice(idx, 1);
    }

    // Place studio-painted broken wooden crate debris on the street where the crate stood + burst!
    const debrisTex = assetAtlas.getEnvPropTexture('debris');
    const debrisPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55, 1.15),
      new THREE.MeshBasicMaterial({ map: debrisTex, transparent: true, alphaTest: 0.08, side: THREE.DoubleSide })
    );
    debrisPlane.position.set(crate.position.x, 0.45, crate.position.z);
    this.scene.add(debrisPlane);
    this._spawnImpactBurst(crate.position.clone().add(new THREE.Vector3(0, 0.3, 0)), 'impact_burst', 1.45);
  }

  triggerBrunoGroundSlamAOE(centerPos, customRadius = 6.8, baseDamage = 85) {
    SoundFX.playSlam();
    this.spawnMultiStageExplosion(centerPos, customRadius, 1.55, 'fire');

    const slamTex = assetAtlas.getVFXTexture('ground_slam');
    const slamPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 2.2),
      new THREE.MeshBasicMaterial({
        map: slamTex,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
      })
    );
    slamPlane.rotation.x = -Math.PI / 2;
    slamPlane.position.copy(centerPos).setY(0.14);
    this.scene.add(slamPlane);

    this.particles.push({
      mesh: slamPlane,
      isShockwave: true,
      scale: 1.0,
      growthRate: 6.5,
      life: 0.48
    });

    // Check nearby barrels & crates
    this._checkNearbyBarrelDetonation(centerPos, customRadius);

    const targets = this._getTargets();
    for (const t of targets) {
      const tPos = t.mesh ? t.mesh.position : t.position;
      const d = tPos.distanceTo(centerPos);
      if (d <= customRadius) {
        const falloff = Math.max(0.45, 1.0 - (d / (customRadius * 1.35)));
        const dmg = Math.round(baseDamage * falloff);
        const hitPos = tPos.clone().add(new THREE.Vector3(0, 1.15, 0));
        this._applyDamageToTarget(t, dmg, false, hitPos);
        this._spawnImpactBurst(hitPos, 'seed_explosion', 1.6);

        // Apply radial knockback away from blast center
        if (this.enemyAI && typeof this.enemyAI.applyKnockback === 'function') {
          const pushDir = tPos.clone().sub(centerPos);
          pushDir.y = 0;
          if (pushDir.lengthSq() < 0.01) pushDir.set(0, 0, -1);
          pushDir.normalize();
          const impulse = pushDir.multiplyScalar(8.5 * falloff);
          impulse.y = 5.2;
          this.enemyAI.applyKnockback(t, impulse);
        }
      }
    }
  }

  _applyDamageToTarget(target, baseDamage, isCrit = false, hitPos = null) {
    const tPos = (target.mesh ? target.mesh.position : target.position).clone();
    const finalDamage = isCrit ? Math.round(baseDamage * 1.5) : Math.round(baseDamage);
    const impactWorldPos = hitPos ? hitPos.clone() : tPos.clone().add(new THREE.Vector3(0, 1.3, 0));

    let isElim = false;
    if (this.enemyAI && typeof this.enemyAI.applyDamage === 'function' && target.mesh) {
      isElim = this.enemyAI.applyDamage(target, finalDamage);
    } else {
      target.health = Math.max(0, target.health - finalDamage);
      target.wobbleTime = 0.35;
      isElim = target.health <= 0;
    }

    // Trigger a Multi-Stage Elimination Explosion whenever an enemy or Rival Player is defeated!
    if (isElim) {
      this.spawnMultiStageExplosion(impactWorldPos, 3.8, target.isBoss ? 1.85 : 1.25, 'fire');
    }

    this.gameState.recordHit(finalDamage);
    const isMajorHit = isCrit || !!target.isBoss || !!target.isRival;
    SoundFX.playHit(isMajorHit);
    soundEngine.playHitMarker(isCrit);

    if (this.onHitConfirmed) {
      this.onHitConfirmed({
        enemy: target,
        damage: finalDamage,
        isCrit,
        isElim,
        hitPos: impactWorldPos
      });
    }

    if (this.onHitCallback) {
      this.onHitCallback(finalDamage, impactWorldPos, isMajorHit, target, isElim);
    }
  }

  _spawnImpactBurst(pos, vfxKey = 'impact_burst', baseScale = 1.15) {
    const tex = assetAtlas.getVFXTexture(vfxKey);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      })
    );
    sprite.position.copy(pos);
    sprite.scale.set(baseScale, baseScale, 1.0);
    this.scene.add(sprite);

    this.particles.push({
      mesh: sprite,
      isShockwave: true,
      scale: baseScale,
      growthRate: 4.2,
      life: 0.24
    });
  }

  update(dt) {
    const gs = this.gameState;
    const nowSec = performance.now() / 1000;

    // 0. CoD / Fortnite Automatic Reload Progress & Out-Of-Combat Auto Top-Off
    if (gs) {
      if (gs.isReloading) {
        const dur = this._reloadDuration || 0.72;
        this._reloadElapsed = (this._reloadElapsed || 0) + dt;
        gs.reloadProgress = Math.min(1.0, this._reloadElapsed / dur);
        if (this._reloadElapsed >= dur) {
          gs.curAmmo = gs.maxAmmo;
          gs.isReloading = false;
          gs.reloadProgress = 0;
          gs.notify();
        }
      } else if (gs.curAmmo <= 0) {
        this.triggerReload(this.activeFighterConfig);
      } else if (gs.curAmmo < gs.maxAmmo && gs.lastFireTime > 0 && (nowSec - gs.lastFireTime) > 1.45) {
        // Automatically reload partially spent magazine after 1.45s idle!
        this.triggerReload(this.activeFighterConfig);
      }
    }

    const targets = this._getTargets();

    // 1. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;

      if (p.isBallistic) {
        p.velocity.y += (p.gravity || -16) * dt;
      }

      // Soft target-magnetism guidance toward locked enemy or barrel
      if (p.homingTarget && p.homingTarget.health > 0) {
        const tPos = p.homingTarget.mesh ? p.homingTarget.mesh.position : p.homingTarget.position;
        const scale = p.homingTarget.scale || 1.0;
        const yOff = (p.homingTarget.exploded !== undefined) ? 0.0 : (1.12 * scale);
        const aimCenter = tPos.clone().add(new THREE.Vector3(0, yOff, 0));
        const speed = p.velocity.length();
        const desiredDir = aimCenter.sub(p.mesh.position).normalize();
        const curDir = p.velocity.clone().normalize();
        curDir.lerp(desiredDir, Math.min(1, dt * 10.5)).normalize();
        p.velocity.copy(curDir.multiplyScalar(speed));
      }

      const prevPos = p.mesh.position.clone();
      const moveStep = p.velocity.clone().multiplyScalar(dt);
      p.mesh.position.add(moveStep);

      if (p.mesh.userData && p.mesh.userData.spinMesh) {
        p.mesh.userData.spinMesh.rotation.x += dt * 12.0;
        p.mesh.userData.spinMesh.rotation.y += dt * 9.0;
      } else if (p.type === 'bolt') {
        p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), p.velocity.clone().normalize());
      }

      // Spawn continuous glowing plasma & ember wake trail behind flying projectiles!
      p.trailTimer = (p.trailTimer || 0) - dt;
      if (p.trailTimer <= 0) {
        p.trailTimer = 0.022;
        const trailSprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: this._getSoftPuffTexture('fire'),
            color: p.type === 'bomb' ? 0xff7700 : (p.isExplosiveRound ? 0xffe600 : 0xff9900),
            transparent: true,
            opacity: 0.88,
            depthWrite: false
          })
        );
        const ts = p.type === 'bomb' ? 0.65 : 0.48;
        trailSprite.scale.set(ts, ts, 1.0);
        trailSprite.position.copy(prevPos);
        this.scene.add(trailSprite);
        this.particles.push({
          mesh: trailSprite,
          isShockwave: true,
          scale: ts,
          growthRate: -1.4,
          life: 0.18
        });
      }

      if (p.isBallistic && p.mesh.position.y <= 0.18) {
        p.mesh.position.y = 0.18;
        p.bounces--;
        if (p.bounces <= 0) {
          this._detonateSeedBomb(p.mesh.position, p.splashRadius || 5.4, p.damage);
          this.scene.remove(p.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
        p.velocity.y = -p.velocity.y * 0.55;
        p.velocity.x *= 0.75;
        p.velocity.z *= 0.75;
      }

      let hit = false;
      const seg = new THREE.Line3(prevPos, p.mesh.position);
      const closestPt = new THREE.Vector3();

      // 1a. Check Direct Hit on Live Enemies / Rivals (bolts pierce through close targets into the distance!)
      for (const t of targets) {
        if (p.hitTargets && p.hitTargets.has(t)) continue;
        const tPos = t.mesh ? t.mesh.position : t.position;
        const scale = t.scale || 1.0;
        const center = tPos.clone().add(new THREE.Vector3(0, 1.08 * scale, 0));
        const hitRadius = (t.radius || 0.85) + (p.type === 'bomb' ? 1.25 : 0.85);

        seg.closestPointToPoint(center, true, closestPt);

        if (closestPt.distanceTo(center) < hitRadius) {
          if (p.hitTargets) p.hitTargets.add(t);
          if (p.type === 'bomb') {
            hit = true;
            this._detonateSeedBomb(closestPt, p.splashRadius || 5.4, p.damage);
          } else if (p.isExplosiveRound) {
            const relY = closestPt.y - tPos.y;
            const isCrit = relY > 1.32 * scale;
            this._applyDamageToTarget(t, Math.round(p.damage * 1.25), isCrit, closestPt);
            this.spawnMultiStageExplosion(closestPt, p.splashRadius || 3.8, 1.18, 'fire');
            this._checkNearbyBarrelDetonation(closestPt, 3.8);
            p.homingTarget = null;
            p.pierceRemaining = (p.pierceRemaining || 1) - 1;
            if (p.pierceRemaining <= 0) hit = true;
          } else {
            const relY = closestPt.y - tPos.y;
            const isCrit = relY > 1.32 * scale;
            this._applyDamageToTarget(t, p.damage, isCrit, closestPt);
            this._spawnImpactBurst(closestPt, isCrit ? 'arc_burst' : 'impact_burst', isCrit ? 1.55 : 1.35);
            p.homingTarget = null;
            p.pierceRemaining = (p.pierceRemaining || 1) - 1;
            if (p.pierceRemaining <= 0) hit = true;
          }
          break;
        }
      }

      // 1b. Check Direct Hit on Explosive Hazard Barrels!
      if (!hit && this.env && this.env.explosiveBarrels) {
        for (const barrel of this.env.explosiveBarrels) {
          if (barrel.exploded || barrel.health <= 0) continue;
          seg.closestPointToPoint(barrel.position, true, closestPt);
          if (closestPt.distanceTo(barrel.position) < 0.95) {
            hit = true;
            this._detonateExplosiveBarrel(barrel);
            break;
          }
        }
      }

      // 1c. Check Destructible Cover Crates & Building Colliders
      if (!hit && this.env && this.env.destructibleCrates) {
        for (const crate of this.env.destructibleCrates) {
          if (crate.destroyed) continue;
          if (crate.collider.containsPoint(p.mesh.position)) {
            hit = true;
            this._damageDestructibleCrate(crate, p.damage);
            if (p.type === 'bomb' || p.isExplosiveRound) {
              this.spawnMultiStageExplosion(p.mesh.position, 3.6, 1.15, 'fire');
            } else {
              this._spawnImpactBurst(p.mesh.position, 'impact_burst', 1.15);
            }
            break;
          }
        }
      }

      if (!hit) {
        for (const box of this.env.colliders) {
          if (box.isGroundOrLow) continue;
          if (box.containsPoint(p.mesh.position)) {
            hit = true;
            if (p.type === 'bomb' || p.isExplosiveRound) {
              this._detonateSeedBomb(p.mesh.position, p.splashRadius || 4.2, p.damage);
            } else {
              this._spawnImpactBurst(p.mesh.position, 'impact_burst', 1.1);
            }
            break;
          }
        }
      }

      if (hit || p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 2. Update Dynamic Explosion PointLights
    for (let i = this.explosionLights.length - 1; i >= 0; i--) {
      const el = this.explosionLights[i];
      el.life -= dt;
      if (el.life <= 0) {
        this.scene.remove(el.light);
        this.explosionLights.splice(i, 1);
      } else {
        el.light.intensity = el.baseIntensity * (el.life / el.maxLife);
      }
    }

    // 3. Update Lightning Arcs
    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      const arc = this.lightningArcs[i];
      arc.life -= dt;
      if (arc.life <= 0) {
        this.scene.remove(arc.line);
        if (arc.line.geometry) arc.line.geometry.dispose();
        if (arc.line.material) arc.line.material.dispose();
        this.lightningArcs.splice(i, 1);
      }
    }

    // 4. Update Decoys
    for (let i = this.decoys.length - 1; i >= 0; i--) {
      const decoy = this.decoys[i];
      decoy.life -= dt;
      decoy.group.position.y = 0.85 + Math.sin(performance.now() * 0.008) * 0.1;
      if (decoy.life <= 0) {
        this._spawnImpactBurst(decoy.group.position, 'arc_burst', 1.4);
        this.scene.remove(decoy.group);
        this.decoys.splice(i, 1);
      }
    }

    // 5. Update Particles, Shrapnel & Shockwaves
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;

      if (pt.isShockwave) {
        pt.scale += dt * (pt.growthRate || 6.0);
        if (pt.is3DSphere) {
          pt.mesh.scale.setScalar(pt.scale);
        } else {
          pt.mesh.scale.set(pt.scale, pt.scale, 1.0);
        }
        if (pt.mesh.material) {
          pt.mesh.material.opacity = Math.min(1.0, Math.max(0, pt.life * 3.8));
        }
      } else {
        pt.velocity.y += pt.gravity * dt;
        pt.mesh.position.add(pt.velocity.clone().multiplyScalar(dt));

        if (pt.rotVel) {
          pt.mesh.rotation.x += pt.rotVel.x * dt;
          pt.mesh.rotation.y += pt.rotVel.y * dt;
          pt.mesh.rotation.z += pt.rotVel.z * dt;
        }

        if (pt.isSmoke) {
          pt.mesh.scale.multiplyScalar(1 + dt * 1.8);
          if (pt.mesh.material) {
            pt.mesh.material.opacity = Math.max(0, pt.life * 0.85);
          }
        } else if (pt.mesh.position.y <= 0.12 && pt.velocity.y < 0) {
          pt.mesh.position.y = 0.12;
          if (pt.bounces > 0) {
            pt.bounces--;
            pt.velocity.y = -pt.velocity.y * 0.48;
            pt.velocity.x *= 0.72;
            pt.velocity.z *= 0.72;
          } else {
            pt.velocity.set(0, 0, 0);
          }
        }
      }

      if (pt.life <= 0) {
        this.scene.remove(pt.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  _detonateSeedBomb(centerPos, splashRadius = 5.4, baseDamage = 75) {
    this.triggerBrunoGroundSlamAOE(centerPos, Math.max(4.5, splashRadius), baseDamage);
  }
}
