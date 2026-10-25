import * as THREE from 'three';
import { SoundFX } from './soundFX.js';
import { updateRabbit3DAnimation } from './rabbitModel.js';

// Authoritative Kinematic Character Controller (KCC) with Grounded 3D Running & Abilities
export class CharacterController {
  constructor(mesh, fighterConfig, environment, weaponSystem, gameState) {
    this.mesh = mesh;
    this.config = fighterConfig;
    this.env = environment;
    this.weaponSystem = weaponSystem;
    this.gameState = gameState;

    this.position = this.mesh.position;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;
    this.canDoubleHop = (this.config.id === 'pip');
    this.isGroundSlamming = false;

    // Snappy arcade shooter gravity so running & hopping never feel floaty
    this.gravity = -38.0;
    this.terminalVelocity = -55.0;
    this.lastBounceTime = -10;

    // Procedural secondary motion & CoD/Fortnite Auto-Tac-Sprint state
    this.earVelocity = 0;
    this.earOffset = 0;
    this.legCycle = 0;
    this.idleTime = 0;
    this.animClock = 0;
    this.forwardRunTime = 0;
    this.isSprinting = false;
    this.lastFootstepStep = 0;
  }

  setConfig(newConfig, newMesh) {
    this.config = newConfig;
    this.mesh = newMesh;
    this.position = this.mesh.position;
    this.canDoubleHop = (this.config.id === 'pip');
    this.isGroundSlamming = false;
  }

  update(dt, input, cameraYaw, nowSec) {
    const cfg = this.config;
    const gs = this.gameState;

    // 1. Process Horizontal Movement Input relative to Camera Yaw
    let moveX = 0;
    let moveZ = 0;

    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) moveZ -= 1;
    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) moveZ += 1;
    if (input.isKeyDown('KeyA')) moveX -= 1;
    if (input.isKeyDown('KeyD')) moveX += 1;

    const inputLen = Math.hypot(moveX, moveZ);
    let targetVelX = 0;
    let targetVelZ = 0;

    const isAiming = input.isMouseDown && input.isMouseDown(2);
    const shiftHeld = input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight');

    // CoD / Fortnite Automatic Tactical Sprint (Auto-Tac-Sprint):
    // Holding W / Up automatically engages full Tactical Sprint after 0.16s without needing Shift!
    if (moveZ < -0.1 && !isAiming) {
      this.forwardRunTime = Math.min(1.0, this.forwardRunTime + dt);
    } else {
      this.forwardRunTime = Math.max(0, this.forwardRunTime - dt * 4.0);
    }

    const isSprinting = !isAiming && (shiftHeld || (inputLen > 0.1 && this.forwardRunTime >= 0.16));
    this.isSprinting = isSprinting;
    const moveSpeed = isAiming
      ? cfg.runSpeed * 0.72
      : (isSprinting ? cfg.sprintSpeed : cfg.runSpeed);

    if (inputLen > 0.001) {
      moveX /= inputLen;
      moveZ /= inputLen;

      const sinYaw = Math.sin(cameraYaw);
      const cosYaw = Math.cos(cameraYaw);

      const worldMoveX = moveX * cosYaw + moveZ * sinYaw;
      const worldMoveZ = -moveX * sinYaw + moveZ * cosYaw;

      targetVelX = worldMoveX * moveSpeed;
      targetVelZ = worldMoveZ * moveSpeed;
    }

    // Keep rabbit facing camera aiming direction in Over-The-Shoulder combat
    // with a slight responsive yaw offset when strafing
    const strafeYawOffset = -moveX * 0.22;
    const targetYaw = cameraYaw + strafeYawOffset;
    const diff = Math.atan2(Math.sin(targetYaw - this.mesh.rotation.y), Math.cos(targetYaw - this.mesh.rotation.y));
    this.mesh.rotation.y += diff * Math.min(1, dt * 18);

    const accelRate = this.isGrounded ? 18.0 : (14.0 * cfg.airControl);
    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelX, Math.min(1, dt * accelRate));
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelZ, Math.min(1, dt * accelRate));

    // 2. Vertical Physics & Jump Logic
    if (this.isGroundSlamming) {
      this.velocity.y -= 62 * dt;
    } else {
      this.velocity.y += this.gravity * dt;
      this.velocity.y = Math.max(this.terminalVelocity, this.velocity.y);
    }

    // 3. Proposed Movement Step & Grounded Street / Low-Crate Collision
    const deltaMove = this.velocity.clone().multiplyScalar(dt);
    const newPos = this.position.clone().add(deltaMove);

    let groundHeight = 0;

    const feetBox = new THREE.Box3(
      new THREE.Vector3(newPos.x - cfg.radius * 0.85, newPos.y - 0.1, newPos.z - cfg.radius * 0.85),
      new THREE.Vector3(newPos.x + cfg.radius * 0.85, newPos.y + 0.35, newPos.z + cfg.radius * 0.85)
    );

    // Only allow stepping onto explicitly stepable low wooden crates (never buildings, fences, or cars!)
    for (const col of this.env.colliders) {
      if (!col.isStepable || col.max.y > 1.65) continue;
      if (feetBox.intersectsBox(col)) {
        if (this.position.y >= col.max.y - 0.35 && this.velocity.y <= 0) {
          groundHeight = Math.max(groundHeight, col.max.y);
        }
      }
    }

    if (newPos.y <= groundHeight) {
      newPos.y = groundHeight;
      if (!this.isGrounded) {
        this._onLand();
      }
      this.isGrounded = true;
      this.velocity.y = 0;
      this.canDoubleHop = (cfg.id === 'pip');
    } else {
      this.isGrounded = false;
    }

    const charRadius = cfg.radius;
    const charHeight = cfg.height;

    const testPosX = this.position.clone();
    testPosX.x = newPos.x;
    testPosX.y = newPos.y + 0.08;
    if (this.env.checkCollision(testPosX, charRadius, charHeight)) {
      newPos.x = this.position.x;
      this.velocity.x = 0;
    }

    const testPosZ = this.position.clone();
    testPosZ.z = newPos.z;
    testPosZ.y = newPos.y + 0.08;
    if (this.env.checkCollision(testPosZ, charRadius, charHeight)) {
      newPos.z = this.position.z;
      this.velocity.z = 0;
    }

    // Keep within Carrot Cove street & yard bounds
    newPos.x = Math.max(-13.5, Math.min(13.5, newPos.x));
    newPos.z = Math.max(-40.5, Math.min(28.0, newPos.z));

    this.position.copy(newPos);

    // 4. Check Bounce Pad Triggers (with cooldown so you never get stuck bouncing)
    this._checkBouncePads(nowSec);

    // 5. Update Current Zone Based on Z position (South +Z -> North -Z)
    if (this.position.z > 10) {
      gs.setZone('01 NEIGHBORHOOD');
    } else if (this.position.z >= -16) {
      gs.setZone('02 MARKET');
    } else {
      gs.setZone('03 SERVICE YARD');
    }

    // 6. Procedural 3D Running & Secondary Animation
    this._updateProceduralAnimation(dt, inputLen > 0.01, moveX, moveZ);
  }

  jump() {
    if (this.isGrounded) {
      this.velocity.y = this.config.jumpForce;
      this.isGrounded = false;
      this.earVelocity = 9.0;
      SoundFX.playSelect();
    } else if (this.canDoubleHop && this.config.id === 'pip') {
      this.velocity.y = this.config.doubleHopForce;
      this.canDoubleHop = false;
      this.earVelocity = 13.0;
      this.gameState.abilityCooldownRemaining = this.config.abilityCooldown;
      SoundFX.playBounce();

      if (this.weaponSystem) {
        this.weaponSystem.spawnDoubleHopRings(this.position.clone());
      }
    }
  }

  tryTriggerAbility(nowSec) {
    const gs = this.gameState;
    if (gs.abilityCooldownRemaining > 0) return false;

    if (this.config.id === 'pip') {
      // Pip Q ability: Agile Combat Dash-Hop forward (fast horizontal dash + low tactical hop)
      this.velocity.y = 8.4;
      const forward = new THREE.Vector3(-Math.sin(this.mesh.rotation.y), 0, -Math.cos(this.mesh.rotation.y));
      this.velocity.x += forward.x * 11.5;
      this.velocity.z += forward.z * 11.5;
      this.isGrounded = false;
      this.canDoubleHop = false;
      this.earVelocity = 13.0;
      gs.abilityCooldownRemaining = this.config.abilityCooldown;
      SoundFX.playBounce();
      if (this.weaponSystem) {
        this.weaponSystem.spawnDoubleHopRings(this.position.clone());
      }
      return true;
    } else if (this.config.id === 'bruno') {
      // Bruno Q ability: Ground Slam (quick hop & heavy slam shockwave)
      if (this.isGrounded) {
        this.velocity.y = 10.5;
        this.isGrounded = false;
        setTimeout(() => {
          this.isGroundSlamming = true;
        }, 180);
      } else {
        this.isGroundSlamming = true;
      }
      gs.abilityCooldownRemaining = this.config.abilityCooldown;
      return true;
    } else if (this.config.id === 'volt') {
      this.weaponSystem.deployVoltDecoy(this.position, this.mesh.rotation.y);
      gs.abilityCooldownRemaining = this.config.abilityCooldown;
      return true;
    }
    return false;
  }

  _onLand() {
    if (this.isGroundSlamming) {
      this.isGroundSlamming = false;
      this.weaponSystem.triggerBrunoGroundSlamAOE(this.position.clone());
    }
    this.earVelocity = -10.5;
  }

  _checkBouncePads(nowSec = 0) {
    if (nowSec - this.lastBounceTime < 1.35) return;
    for (const pad of this.env.bouncePads) {
      const d = Math.hypot(this.position.x - pad.center.x, this.position.z - pad.center.z);
      if (d < pad.radius && Math.abs(this.position.y - pad.center.y) < 0.75) {
        this.lastBounceTime = nowSec;
        this.velocity.copy(pad.launchVelocity);
        this.isGrounded = false;
        this.earVelocity = 14.0;
        this.canDoubleHop = (this.config.id === 'pip');
        SoundFX.playBounce();
        if (this.weaponSystem) {
          this.weaponSystem.spawnDoubleHopRings(this.position.clone());
        }
        break;
      }
    }
  }

  _updateProceduralAnimation(dt, isMoving, moveX = 0, moveZ = 0) {
    // 1. Ear Spring Dynamics
    const earGroup = this.mesh.userData.earGroup;
    if (earGroup) {
      const k = 140;
      const d = 12;
      const force = -k * this.earOffset - d * this.earVelocity;
      this.earVelocity += force * dt;
      this.earOffset += this.earVelocity * dt;
      earGroup.rotation.x = this.earOffset * 0.08;
    }

    // 2. 3D Volumetric Running Stride, High Boot Kick-Up, Arm Pump & Ear Physics
    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const speedRatio = isMoving
      ? Math.max(0.55, Math.min(1.35, horizSpeed / Math.max(1, this.config.runSpeed)))
      : (horizSpeed > 0.4 ? horizSpeed / Math.max(1, this.config.runSpeed) : 0);

    if (speedRatio > 0.05 && this.isGrounded) {
      this.animClock += dt * (1.0 + speedRatio * 0.35);
      this.legCycle += dt * 16.5;

      // Spawn 3D Footstep Dust Puff on each grounded boot plant (Fortnite/CoD sprint dust!)
      const stepCount = Math.floor(this.legCycle / Math.PI);
      if (stepCount !== this.lastFootstepStep && this.weaponSystem && this.weaponSystem.spawnFootstepDust) {
        this.lastFootstepStep = stepCount;
        const footSide = (stepCount % 2 === 0) ? -0.22 : 0.22;
        this.weaponSystem.spawnFootstepDust(this.position, this.mesh.rotation.y, footSide, this.isSprinting);
      }
    } else {
      this.animClock += dt;
    }

    updateRabbit3DAnimation(
      this.mesh,
      this.animClock,
      speedRatio,
      this.isGrounded,
      this.velocity.y,
      moveX,
      moveZ
    );

    // 3. Grounded Run Lean, Side-to-Side Cadence Rock & Weapon Bob
    const spriteRig = this.mesh.userData.spriteRig;
    const weaponMesh = this.mesh.userData.weaponMesh;
    if (spriteRig) {
      if (speedRatio > 0.05 && this.isGrounded) {
        // Keep planted foot touching the road (no floating!) while leaning into the run
        const cadenceBounce = Math.abs(Math.sin(this.legCycle)) * 0.042 - 0.018;
        const sideRock = Math.cos(this.legCycle) * 0.065 * speedRatio - moveX * 0.08;
        const forwardLean = (moveZ <= 0 ? -0.13 : 0.08) * speedRatio;

        spriteRig.position.y = THREE.MathUtils.lerp(spriteRig.position.y, cadenceBounce, dt * 18);
        spriteRig.rotation.x = THREE.MathUtils.lerp(spriteRig.rotation.x, forwardLean, dt * 14);
        spriteRig.rotation.z = THREE.MathUtils.lerp(spriteRig.rotation.z, sideRock, dt * 16);
        spriteRig.scale.set(1.0, 1.0, 1.0);
      } else if (!this.isGrounded) {
        spriteRig.position.y = THREE.MathUtils.lerp(spriteRig.position.y, 0.02, dt * 12);
        spriteRig.rotation.x = THREE.MathUtils.lerp(spriteRig.rotation.x, -0.08, dt * 10);
        spriteRig.rotation.z = THREE.MathUtils.lerp(spriteRig.rotation.z, -moveX * 0.06, dt * 10);
        spriteRig.scale.set(0.97, 1.04, 1.0);
      } else {
        this.idleTime += dt * 3.0;
        spriteRig.position.y = THREE.MathUtils.lerp(spriteRig.position.y, Math.sin(this.idleTime) * 0.012, dt * 12);
        spriteRig.rotation.x = THREE.MathUtils.lerp(spriteRig.rotation.x, 0, dt * 12);
        spriteRig.rotation.z = THREE.MathUtils.lerp(spriteRig.rotation.z, 0, dt * 12);
        spriteRig.scale.set(1.0, 1.0, 1.0);
      }
    }

    // 4. 3D Equipped Weapon Run Bob, Recoil Recovery & CoD/Fortnite Reload Flip
    if (weaponMesh) {
      const isHeavy = this.config.id === 'bruno';
      const baseX = isHeavy ? 0.42 : 0.34;
      const baseY = (isHeavy ? 2.18 : (this.config.id === 'volt' ? 2.08 : 2.02)) * 0.40;
      const runBobY = (speedRatio > 0.05 && this.isGrounded) ? Math.sin(this.legCycle * 2.0) * 0.038 * speedRatio : 0;
      const runSwingZ = (speedRatio > 0.05 && this.isGrounded) ? Math.cos(this.legCycle) * 0.075 * speedRatio : 0;
      const recoilZ = weaponMesh.userData.recoilZ || 0;
      weaponMesh.userData.recoilZ = THREE.MathUtils.lerp(recoilZ, 0, dt * 18);

      weaponMesh.position.x = baseX;
      weaponMesh.position.y = baseY + runBobY;
      weaponMesh.position.z = 0.02 + runSwingZ + weaponMesh.userData.recoilZ;

      if (this.gameState && this.gameState.isReloading) {
        const prog = this.gameState.reloadProgress || 0;
        const reloadTilt = Math.sin(prog * Math.PI);
        weaponMesh.rotation.x = THREE.MathUtils.lerp(weaponMesh.rotation.x || 0, -0.58 * reloadTilt, dt * 18);
        weaponMesh.rotation.z = THREE.MathUtils.lerp(weaponMesh.rotation.z || 0, 0.72 * reloadTilt, dt * 18);
        weaponMesh.position.y -= 0.12 * reloadTilt;
      } else {
        weaponMesh.rotation.x = THREE.MathUtils.lerp(weaponMesh.rotation.x || 0, -recoilZ * 0.9, dt * 18);
        weaponMesh.rotation.z = THREE.MathUtils.lerp(weaponMesh.rotation.z || 0, 0, dt * 18);
      }
    }
  }
}
