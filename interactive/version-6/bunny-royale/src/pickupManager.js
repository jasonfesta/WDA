// Pickup Items: Carrot Tokens, Health Medkits, Shield Canisters, and Ammo Cells
// Uses native transparent RGBA studio art from assets/props-pickup-sheet.png via assetAtlas
import * as THREE from 'three';
import { SoundFX } from './soundFX.js';
import { soundEngine } from './soundEngine.js';
import { assetAtlas } from './assetAtlas.js';

export class PickupManager {
  constructor(scene, gameState, onPickupCallback = null) {
    this.scene = scene;
    this.gameState = gameState;
    this.onPickupCallback = onPickupCallback;
    this.pickups = [];
  }

  spawnInitialPickups() {
    this.clear();
    // Zone 01 Neighborhood pickups
    this.spawnPickup('carrot', new THREE.Vector3(-5.2, 0, 15.2));
    this.spawnPickup('shield', new THREE.Vector3(3.8, 0, 14.5));
    // Zone 02 Market pickups
    this.spawnPickup('health', new THREE.Vector3(-4.6, 0, 1.5));
    this.spawnPickup('ammo', new THREE.Vector3(5.6, 0, -5.5));
    this.spawnPickup('shield', new THREE.Vector3(14.5, 7.6, 1.0)); // Market roof reward!
    // Zone 03 Service Yard pickups
    this.spawnPickup('health', new THREE.Vector3(-6.8, 0, -19.5));
    this.spawnPickup('shield', new THREE.Vector3(6.8, 0, -21.5));
    this.spawnPickup('ammo', new THREE.Vector3(0, 2.6, -34.0));
  }

  spawnPickup(type, position, scatterOffset = null) {
    const group = new THREE.Group();
    const spawnPos = position.clone ? position.clone() : new THREE.Vector3(position.x, position.y || 0, position.z);
    if (scatterOffset) {
      spawnPos.x += scatterOffset.x || 0;
      spawnPos.z += scatterOffset.z || 0;
    }
    group.position.copy(spawnPos);
    const groundY = Math.max(0, spawnPos.y || 0);
    const baseY = groundY + 0.65;
    group.position.y = baseY;

    const colors = {
      health: 0x2ec4b6,
      shield: 0x00e5ff,
      ammo: 0xff7700,
      carrot: 0xffd166
    };
    const matColor = colors[type] || 0xffaa00;

    // 1. High-Res Painted Pickup Sprite from props-pickup-sheet.png
    const tex = assetAtlas.getPickupTexture(type);
    const spriteMat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.88, 0.96, 1.0);
    sprite.position.y = 0.08;
    group.add(sprite);

    // 2. Ground Glow Ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.34, 0.56, 20),
      new THREE.MeshBasicMaterial({
        color: matColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.58;
    group.add(ring);

    this.scene.add(group);

    this.pickups.push({
      mesh: group,
      sprite,
      ring,
      type,
      color: matColor,
      position: group.position,
      radius: 1.35,
      baseY,
      hopTimer: scatterOffset ? 0.38 : 0,
      time: Math.random() * Math.PI * 2
    });
  }

  spawnLootBurst(position, isRivalOrBoss = false) {
    if (isRivalOrBoss) {
      const drops = ['carrot', 'shield', 'health', 'ammo'];
      drops.forEach((type, idx) => {
        const angle = (idx / drops.length) * Math.PI * 2 + 0.4;
        const dist = 0.95;
        this.spawnPickup(type, position, {
          x: Math.cos(angle) * dist,
          z: Math.sin(angle) * dist
        });
      });
    } else {
      const r = Math.random();
      const primary = r < 0.38 ? 'health' : (r < 0.72 ? 'shield' : 'ammo');
      this.spawnPickup(primary, position, { x: -0.35, z: 0.2 });
      if (Math.random() < 0.65) {
        this.spawnPickup('carrot', position, { x: 0.45, z: -0.25 });
      }
    }
  }

  update(dt, playerPos) {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.time += dt * 3.2;

      if (p.hopTimer > 0) {
        p.hopTimer = Math.max(0, p.hopTimer - dt);
        p.mesh.position.y = p.baseY + Math.sin((p.hopTimer / 0.38) * Math.PI) * 0.75;
      } else {
        p.mesh.position.y = p.baseY;
      }

      if (p.sprite) {
        p.sprite.position.y = 0.08 + Math.sin(p.time) * 0.14;
      }
      if (p.ring) {
        p.ring.rotation.z += dt * 1.8;
      }

      if (playerPos) {
        const dist = p.position.distanceTo(playerPos);
        // Gentle magnetic pull when player is close
        if (dist < 3.1 && dist > 0.2) {
          const pullDir = playerPos.clone().sub(p.position);
          pullDir.y = 0;
          pullDir.normalize();
          p.position.x += pullDir.x * dt * 5.5;
          p.position.z += pullDir.z * dt * 5.5;
        }
        if (dist < p.radius + 0.7) {
          this._collect(p);
          this.scene.remove(p.mesh);
          this.pickups.splice(i, 1);
        }
      }
    }
  }

  _collect(pickup) {
    const gs = this.gameState;
    SoundFX.playBounce();
    soundEngine.playPickup();
    if (pickup.type === 'health') {
      gs.health = Math.min(gs.maxHealth, gs.health + 35);
    } else if (pickup.type === 'shield') {
      gs.shield = Math.min(gs.maxShield, gs.shield + 25);
    } else if (pickup.type === 'ammo') {
      gs.curAmmo = gs.maxAmmo;
      gs.reserveAmmo = Math.min(240, (gs.reserveAmmo || 120) + 45);
      gs.isReloading = false;
    } else if (pickup.type === 'carrot') {
      gs.carrotsCollected = (gs.carrotsCollected || 0) + 25;
      gs.abilityCooldownRemaining = 0;
    }
    gs.notify();
    if (this.onPickupCallback) {
      this.onPickupCallback(pickup.type);
    }
  }

  clear() {
    for (const p of this.pickups) {
      this.scene.remove(p.mesh);
    }
    this.pickups = [];
  }
}
