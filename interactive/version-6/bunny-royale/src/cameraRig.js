import * as THREE from 'three';

// Multi-Mode Camera Rig:
// 1. 'ots' (Default Canonical Third-Person Over-The-Shoulder matching ui-gameplay-v2.png)
// 2. 'map_overview' (Aerial Isometric Diorama matching env-map-v2.png)
// 3. 'zone_1' (Neighborhood Arrival Tactical Camera)
// 4. 'zone_2' (Market Intersection Tactical Camera)
// 5. 'zone_3' (Service Yard & Boss Arena Tactical Camera)
// 6. 'first_person' (Optional True First-Person Viewmodel POV)

export const CAMERA_MODES = [
  { id: 'ots', label: 'OTS 3RD PERSON', shortLabel: 'OTS' },
  { id: 'map_overview', label: 'MAP OVERVIEW', shortLabel: 'MAP' },
  { id: 'zone_1', label: '01 NEIGHBORHOOD', shortLabel: 'Z1' },
  { id: 'zone_2', label: '02 MARKET', shortLabel: 'Z2' },
  { id: 'zone_3', label: '03 SERVICE YARD', shortLabel: 'Z3' },
  { id: 'first_person', label: '1ST PERSON POV', shortLabel: '1P' }
];

export class CameraRig {
  constructor(camera, targetMesh, environment, firstPersonRig = null) {
    this.camera = camera;
    this.target = targetMesh;
    this.env = environment;
    this.firstPersonRig = firstPersonRig;

    // Facing North (-Z) down Carrot Cove Main Street by default
    this.yaw = 0;
    this.pitch = -0.06;

    this.minPitch = -Math.PI / 2.4;
    this.maxPitch = Math.PI / 2.4;

    // Default to canonical Third-Person Over-The-Shoulder ('ots') matching ui-gameplay-v2.png
    this.mode = 'ots';
    this.previousGameplayMode = 'ots';
    this.onModeChange = null;

    // Over-The-Shoulder (OTS) framing parameters:
    // Places Pip in the lower-left foreground (3/4 rear view over right shoulder)
    // with an unobstructed central aiming corridor down the street.
    this.defaultDistance = 2.65;
    this.defaultOffset = new THREE.Vector3(0.88, 0.36, 0);
    this.adsDistance = 1.55;
    this.adsOffset = new THREE.Vector3(0.55, 0.34, 0);

    this.currentDistance = this.defaultDistance;
    this.currentOffset = this.defaultOffset.clone();
    this.camera.fov = 68;

    // Screen Shake & CoD/Fortnite Spring-Damper Camera Recoil
    this.shakeIntensity = 0;
    this.reducedMotion = false;
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.recoilVelPitch = 0;
    this.recoilVelYaw = 0;

    // Preset Scenic / Tactical Map Camera Transforms
    this.presetViews = {
      map_overview: {
        pos: new THREE.Vector3(-28, 58, 36),
        lookAt: new THREE.Vector3(2, 0, -6),
        fov: 46
      },
      zone_1: {
        pos: new THREE.Vector3(14, 14, 38),
        lookAt: new THREE.Vector3(-4, 1.8, 16),
        fov: 55
      },
      zone_2: {
        pos: new THREE.Vector3(-14, 15, 18),
        lookAt: new THREE.Vector3(6, 2.0, -2),
        fov: 55
      },
      zone_3: {
        pos: new THREE.Vector3(-15, 17, -14),
        lookAt: new THREE.Vector3(0, 2.0, -36),
        fov: 56
      }
    };

    this.updateTargetVisibility();
  }

  setTarget(newTargetMesh) {
    this.target = newTargetMesh;
    this.updateTargetVisibility();
  }

  setFirstPersonRig(rig) {
    this.firstPersonRig = rig;
    this.updateTargetVisibility();
  }

  setMode(newMode) {
    if (!CAMERA_MODES.some(m => m.id === newMode)) return;
    if (this.mode === 'ots' || this.mode === 'first_person') {
      this.previousGameplayMode = this.mode;
    }
    this.mode = newMode;
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    if (newMode === 'ots') {
      this.camera.fov = 66;
      this.camera.updateProjectionMatrix();
    } else if (newMode === 'first_person') {
      this.camera.fov = 76;
      this.camera.updateProjectionMatrix();
    }
    this.updateTargetVisibility();
    if (this.onModeChange) {
      this.onModeChange(this.mode);
    }
  }

  cycleMode() {
    const idx = CAMERA_MODES.findIndex(m => m.id === this.mode);
    const nextIdx = (idx + 1) % CAMERA_MODES.length;
    this.setMode(CAMERA_MODES[nextIdx].id);
  }

  toggleMode() {
    this.cycleMode();
  }

  toggleMapOverview() {
    if (this.mode === 'map_overview') {
      this.setMode(this.previousGameplayMode || 'ots');
    } else {
      this.setMode('map_overview');
    }
  }

  updateTargetVisibility() {
    if (!this.target) return;
    if (this.mode === 'first_person') {
      this.target.visible = false;
      if (this.firstPersonRig) this.firstPersonRig.setVisible(true);
    } else {
      this.target.visible = true;
      if (this.firstPersonRig) this.firstPersonRig.setVisible(false);
      const overheadGroup = this.target.userData.overheadGroup;
      const spriteRig = this.target.userData.spriteRig;
      if (overheadGroup) {
        overheadGroup.visible = (this.mode === 'map_overview');
      }
      if (spriteRig) {
        spriteRig.rotation.x = (this.mode === 'map_overview') ? -0.48 : 0;
      }
    }
  }

  handleMouseDelta(dx, dy) {
    this.yaw -= dx;
    this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch - dy));

    if (this.mode === 'first_person' && this.firstPersonRig) {
      this.firstPersonRig.handleMouseDelta(dx, dy);
    }
  }

  addShake(amount) {
    if (this.reducedMotion) return;
    this.shakeIntensity = Math.min(this.shakeIntensity + amount, 1.0);
  }

  applyRecoil(pitchKick = 0.014, yawKick = 0.003) {
    if (this.reducedMotion) return;
    this.recoilPitch = THREE.MathUtils.clamp(this.recoilPitch + pitchKick, 0, 0.065);
    this.recoilYaw = THREE.MathUtils.clamp(this.recoilYaw + yawKick, -0.035, 0.035);
  }

  update(dt, isAiming = false, isSprinting = false) {
    if (!this.target) return;

    // Unconditionally stable CoD / Fortnite Recoil Recovery (immune to large frame dt spikes)
    if (dt > 0) {
      const decay = Math.exp(-14.0 * dt);
      this.recoilPitch *= decay;
      this.recoilYaw *= decay;
      if (Math.abs(this.recoilPitch) < 0.0002) this.recoilPitch = 0;
      if (Math.abs(this.recoilYaw) < 0.0002) this.recoilYaw = 0;
    }

    // Check if we are in a fixed/tactical preset camera mode
    if (this.presetViews[this.mode]) {
      const preset = this.presetViews[this.mode];
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, preset.fov, dt * 10);
      this.camera.updateProjectionMatrix();

      // Subtle dynamic tracking of player position in tactical views
      const targetPos = preset.pos.clone();
      const lookTarget = preset.lookAt.clone();
      if (this.mode === 'map_overview') {
        lookTarget.lerp(this.target.position, 0.18);
      } else {
        lookTarget.lerp(this.target.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 0.35);
      }

      this.camera.position.lerp(targetPos, dt * 10);
      this.camera.lookAt(lookTarget);
      return;
    }

    // Dynamic FOV tuning for OTS and First-Person
    let baseFOV = (this.mode === 'first_person') ? 76 : 66;
    if (isAiming) {
      baseFOV = 50;
    } else if (isSprinting) {
      baseFOV += 7;
    }

    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, baseFOV, dt * 14);
    this.camera.updateProjectionMatrix();

    const effectivePitch = THREE.MathUtils.clamp(this.pitch + this.recoilPitch, this.minPitch, this.maxPitch);
    const effectiveYaw = this.yaw + this.recoilYaw;
    const euler = new THREE.Euler(effectivePitch, effectiveYaw, 0, 'YXZ');
    const quat = new THREE.Quaternion().setFromEuler(euler);

    if (this.mode === 'first_person') {
      const eyePos = this.target.position.clone().add(new THREE.Vector3(0, 1.32, 0));

      if (this.shakeIntensity > 0.001) {
        eyePos.x += (Math.random() - 0.5) * this.shakeIntensity * 0.25;
        eyePos.y += (Math.random() - 0.5) * this.shakeIntensity * 0.25;
        eyePos.z += (Math.random() - 0.5) * this.shakeIntensity * 0.25;
        this.shakeIntensity = THREE.MathUtils.lerp(this.shakeIntensity, 0, dt * 8);
      }

      this.camera.position.copy(eyePos);
      this.camera.quaternion.copy(quat);
    } else {
      // CANONICAL THIRD-PERSON OVER-THE-SHOULDER ('ots')
      const pivot = this.target.position.clone().add(new THREE.Vector3(0, 1.08, 0));
      const targetDist = isAiming ? this.adsDistance : this.defaultDistance;
      const targetOff = isAiming ? this.adsOffset : this.defaultOffset;

      this.currentDistance = THREE.MathUtils.lerp(this.currentDistance, targetDist, dt * 14);
      this.currentOffset.lerp(targetOff, dt * 14);

      const shoulderOffset = this.currentOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const cameraOrigin = pivot.clone().add(shoulderOffset);

      const backwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);

      // Wall Anti-Clipping Spring Arm
      let actualDistance = this.currentDistance;
      const rayStart = pivot.clone();
      const toCam = cameraOrigin.clone().add(backwardDir.clone().multiplyScalar(actualDistance)).sub(rayStart);
      const maxDist = toCam.length();
      const rayDir = toCam.clone().normalize();

      if (this.env && this.env.colliders) {
        const ray = new THREE.Ray(rayStart, rayDir);
        const hitPoint = new THREE.Vector3();
        let minHitDist = maxDist;
        for (const box of this.env.colliders) {
          if (box.isGroundOrLow) continue;
          if (ray.intersectBox(box, hitPoint)) {
            const hitDist = rayStart.distanceTo(hitPoint) - 0.3;
            if (hitDist > 0.6 && hitDist < minHitDist) {
              minHitDist = hitDist;
            }
          }
        }
        if (minHitDist < maxDist) {
          actualDistance = Math.max(0.7, actualDistance * (minHitDist / maxDist));
        }
      }

      const finalPos = cameraOrigin.clone().add(backwardDir.multiplyScalar(actualDistance));
      if (finalPos.y < 0.45) finalPos.y = 0.45;

      if (this.shakeIntensity > 0.001) {
        finalPos.x += (Math.random() - 0.5) * this.shakeIntensity * 0.35;
        finalPos.y += (Math.random() - 0.5) * this.shakeIntensity * 0.35;
        finalPos.z += (Math.random() - 0.5) * this.shakeIntensity * 0.35;
        this.shakeIntensity = THREE.MathUtils.lerp(this.shakeIntensity, 0, dt * 8);
      }

      this.camera.position.copy(finalPos);

      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(quat);
      const lookAtPoint = cameraOrigin.clone().add(forwardDir.multiplyScalar(40));
      this.camera.lookAt(lookAtPoint);
    }
  }

  getAimRay(cursorNDC = null) {
    if (this.presetViews[this.mode] && this.target) {
      // In overhead/zone camera modes, if cursorNDC is provided, raycast from camera through cursor onto arena plane
      if (cursorNDC && (Math.abs(cursorNDC.x) > 0.001 || Math.abs(cursorNDC.y - 0.02) > 0.001)) {
        const rc = new THREE.Raycaster();
        rc.setFromCamera(new THREE.Vector2(cursorNDC.x, cursorNDC.y), this.camera);
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.0);
        const hitPt = new THREE.Vector3();
        if (rc.ray.intersectPlane(groundPlane, hitPt)) {
          const origin = this.target.position.clone().add(new THREE.Vector3(0, 1.05, 0));
          const dir = hitPt.sub(origin).normalize();
          return new THREE.Ray(origin, dir);
        }
      }
      const euler = new THREE.Euler(this.pitch * 0.3, this.yaw, 0, 'YXZ');
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();
      const origin = this.target.position.clone().add(new THREE.Vector3(0, 1.05, 0));
      return new THREE.Ray(origin, forward);
    }

    if (cursorNDC && (Math.abs(cursorNDC.x) > 0.001 || Math.abs(cursorNDC.y - 0.02) > 0.001)) {
      const rc = new THREE.Raycaster();
      rc.setFromCamera(new THREE.Vector2(cursorNDC.x, cursorNDC.y), this.camera);
      return rc.ray.clone();
    }

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    return new THREE.Ray(this.camera.position.clone(), forward);
  }
}

export { CameraRig as ThirdPersonCamera };
