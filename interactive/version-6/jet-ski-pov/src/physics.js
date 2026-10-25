import * as THREE from './vendor/three.module.js';
import { getWaveHeightAndNormal, getSeabedHeight } from './ocean.js';

/**
 * Multi-Point Buoyancy, Carving, Full 360° Aerial Flips/Rolls, Submarine Diving, & Render-Pose Interpolation
 *
 * Implements:
 * 1. Fixed-step 60Hz multi-point hull contact sampling (`bow`, `stern`, `port`, `starboard`) against
 *    the deterministic Gerstner wave sampler + floating ramps, PLUS `getInterpolatedState(alpha)` so
 *    rendering at 60Hz/120Hz/144Hz has zero micro-stutter.
 * 2. Progressive analog-feel steering curves & speed-dependent carving lean with spring-damper suspension.
 * 3. Preload Hop (`Space` near water contact or ramp lip) for boosted takeoff lift.
 * 4. Full 360° Aerial Physics:
 *    - Unclamped 360° Backflips (`S` / `ArrowDown`), Frontflips (`W` / `ArrowUp`),
 *      Barrel Rolls (`Q` / `E`), and 360 Spins (`A` / `D` in air) with live rotation tracking
 *      (`cumulativePitch`, `cumulativeRoll`, `cumulativeYaw`) that awards **BACKFLIP**,
 *      **DOUBLE BACKFLIP**, **FRONTFLIP**, **BARREL ROLL**, and **360 SPIN** stamps!
 * 5. Submarine / Dolphin Diving Mechanics:
 *    - Hold `C` / `Ctrl` (or Dive button) or pitch steep nose-first into a wave to
 *      submerge beneath the waves, swim among coral reefs/fish with full 3D pitch & yaw control,
 *      and rocket back up through the surface (`DOLPHIN BREACH LAUNCH!`) straight into an aerial flip!
 */
export class JetSkiPhysics {
  constructor(courseWorld, callbacks = {}) {
    this.course = courseWorld;
    this.callbacks = callbacks;

    this.state = {
      position: new THREE.Vector3(0, 0.2, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      heading: 0,           // Yaw in radians (0 = facing -Z North toward Sail Landmark)
      pitch: 0,             // Pitch in radians (+ = nose up, - = nose down)
      roll: 0,              // Roll in radians
      angularVelPitch: 0,
      angularVelRoll: 0,
      angularVelYaw: 0,

      steerInputSmooth: 0,  // Progressive analog-feel input (-1..1)
      steerAngle: 0,        // Smooth handlebar angle (-1..1)
      carveRoll: 0,         // Lean into turns
      speedMph: 0,
      throttleLoad: 0,
      boostEnergy: 100,
      isBoosting: false,

      // Suspension spring-damper state for silky wave absorption
      verticalSpringVel: 0,

      // Water contact & state flags
      isAirborne: false,
      airTime: 0,
      isSubmerged: false,
      submergeDepth: 0,
      submergeTime: 0,
      maxDiveDepthThisSubmerge: 0,
      onRamp: false,
      preloadReady: false,
      preloadCharge: 0,
      impactCompression: 0,

      // Aerial 360° Flip & Trick tracking
      cumulativePitch: 0,
      cumulativeRoll: 0,
      cumulativeYaw: 0,
      completedBackflips: 0,
      completedFrontflips: 0,
      completedBarrelRolls: 0,
      completedSpins: 0,
      trickPitchOffset: 0,
      trickRollOffset: 0,
      trickYawOffset: 0,
      activeTrickName: '',
      pendingAirChainScore: 0,
      pendingAirTrickList: [],

      // Last safe checkpoint pose for forgiving recovery
      safePose: {
        position: new THREE.Vector3(0, 0.3, 0),
        heading: 0,
      },
      isRecovering: false,
      recoveryTimer: 0,
    };

    // Snapshot of previous fixed-step pose for 120Hz/144Hz render interpolation
    this.prevState = {
      position: new THREE.Vector3(0, 0.2, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      heading: 0,
      pitch: 0,
      roll: 0,
      steerAngle: 0,
      carveRoll: 0,
      speedMph: 0,
      throttleLoad: 0,
      boostEnergy: 100,
      preloadCharge: 0,
      impactCompression: 0,
    };

    // Reusable interpolated output object
    this.renderState = {
      position: new THREE.Vector3(0, 0.2, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      heading: 0,
      pitch: 0,
      roll: 0,
      angularVelPitch: 0,
      angularVelRoll: 0,
      angularVelYaw: 0,
      steerAngle: 0,
      carveRoll: 0,
      speedMph: 0,
      throttleLoad: 0,
      boostEnergy: 100,
      isBoosting: false,
      isAirborne: false,
      airTime: 0,
      isSubmerged: false,
      submergeDepth: 0,
      preloadReady: false,
      preloadCharge: 0,
      impactCompression: 0,
      trickPitchOffset: 0,
      trickRollOffset: 0,
      trickYawOffset: 0,
    };
  }

  _savePrevState() {
    const s = this.state;
    const p = this.prevState;
    p.position.copy(s.position);
    p.velocity.copy(s.velocity);
    p.heading = s.heading;
    p.pitch = s.pitch;
    p.roll = s.roll;
    p.steerAngle = s.steerAngle;
    p.carveRoll = s.carveRoll;
    p.speedMph = s.speedMph;
    p.throttleLoad = s.throttleLoad;
    p.boostEnergy = s.boostEnergy;
    p.preloadCharge = s.preloadCharge;
    p.impactCompression = s.impactCompression;
  }

  /**
   * Computes a sub-frame interpolated render state for butter-smooth 60Hz/120Hz/144Hz visuals.
   */
  getInterpolatedState(alpha) {
    const t = Math.max(0, Math.min(1, alpha));
    const p = this.prevState;
    const s = this.state;
    const r = this.renderState;

    r.position.lerpVectors(p.position, s.position, t);
    r.velocity.lerpVectors(p.velocity, s.velocity, t);
    r.heading = THREE.MathUtils.lerp(p.heading, s.heading, t);
    r.pitch = THREE.MathUtils.lerp(p.pitch, s.pitch, t);
    r.roll = THREE.MathUtils.lerp(p.roll, s.roll, t);
    r.steerAngle = THREE.MathUtils.lerp(p.steerAngle, s.steerAngle, t);
    r.carveRoll = THREE.MathUtils.lerp(p.carveRoll, s.carveRoll, t);
    r.speedMph = THREE.MathUtils.lerp(p.speedMph, s.speedMph, t);
    r.throttleLoad = THREE.MathUtils.lerp(p.throttleLoad, s.throttleLoad, t);
    r.boostEnergy = THREE.MathUtils.lerp(p.boostEnergy, s.boostEnergy, t);
    r.preloadCharge = THREE.MathUtils.lerp(p.preloadCharge, s.preloadCharge, t);
    r.impactCompression = THREE.MathUtils.lerp(p.impactCompression, s.impactCompression, t);

    r.angularVelPitch = s.angularVelPitch;
    r.angularVelRoll = s.angularVelRoll;
    r.angularVelYaw = s.angularVelYaw;
    r.isBoosting = s.isBoosting;
    r.isAirborne = s.isAirborne;
    r.airTime = s.airTime;
    r.isSubmerged = s.isSubmerged;
    r.submergeDepth = s.submergeDepth;
    r.preloadReady = s.preloadReady;
    r.trickPitchOffset = s.trickPitchOffset;
    r.trickRollOffset = s.trickRollOffset;
    r.trickYawOffset = s.trickYawOffset;

    return r;
  }

  resetToStart() {
    const s = this.state;
    s.position.set(0, 0.25, 0);
    s.velocity.set(0, 0, 0);
    s.heading = 0;
    s.pitch = 0;
    s.roll = 0;
    s.angularVelPitch = 0;
    s.angularVelRoll = 0;
    s.angularVelYaw = 0;
    s.steerInputSmooth = 0;
    s.steerAngle = 0;
    s.carveRoll = 0;
    s.speedMph = 0;
    s.throttleLoad = 0;
    s.boostEnergy = 100;
    s.isBoosting = false;
    s.verticalSpringVel = 0;
    s.isAirborne = false;
    s.airTime = 0;
    s.isSubmerged = false;
    s.submergeDepth = 0;
    s.submergeTime = 0;
    s.maxDiveDepthThisSubmerge = 0;
    s.cumulativePitch = 0;
    s.cumulativeRoll = 0;
    s.cumulativeYaw = 0;
    s.completedBackflips = 0;
    s.completedFrontflips = 0;
    s.completedBarrelRolls = 0;
    s.completedSpins = 0;
    s.trickPitchOffset = 0;
    s.trickRollOffset = 0;
    s.trickYawOffset = 0;
    s.activeTrickName = '';
    s.pendingAirChainScore = 0;
    s.pendingAirTrickList = [];
    s.safePose.position.set(0, 0.3, 0);
    s.safePose.heading = 0;
    s.isRecovering = false;
    s.recoveryTimer = 0;
    this._savePrevState();
  }

  triggerManualRecovery() {
    const s = this.state;
    s.isRecovering = true;
    s.recoveryTimer = 0.85;
    s.pendingAirChainScore = 0;
    s.pendingAirTrickList = [];
    s.velocity.set(0, 0, 0);
    s.angularVelPitch = 0;
    s.angularVelRoll = 0;
    s.angularVelYaw = 0;
    s.verticalSpringVel = 0;
    s.position.copy(s.safePose.position);
    s.heading = s.safePose.heading;
    s.pitch = 0;
    s.roll = 0;
    s.isAirborne = false;
    s.isSubmerged = false;
    this._savePrevState();
  }

  /**
   * Fixed-step update (`dt = 1/60`)
   */
  step(dt, elapsedTime, input, isPlaying) {
    this._savePrevState();
    const s = this.state;

    // Decay landing impact compression smoothly
    s.impactCompression *= Math.exp(-3.8 * dt);
    if (s.impactCompression < 0.001) s.impactCompression = 0;

    // If in Ready or Paused state, float gently on the live 3D waves at the bay starting line
    if (!isPlaying) {
      const w = getWaveHeightAndNormal(s.position.x, s.position.z, elapsedTime);
      const kVert = 1.0 - Math.exp(-6.5 * dt);
      const kRot = 1.0 - Math.exp(-5.5 * dt);
      s.position.y = THREE.MathUtils.lerp(s.position.y, w.height + 0.14, kVert);
      const wavePitch = w.normalZ * Math.cos(s.heading) + w.normalX * Math.sin(s.heading);
      const waveRoll = w.normalX * Math.cos(s.heading) - w.normalZ * Math.sin(s.heading);
      s.pitch = THREE.MathUtils.lerp(s.pitch, wavePitch * 0.65, kRot);
      s.roll = THREE.MathUtils.lerp(s.roll, waveRoll * 0.65, kRot);
      s.velocity.set(0, 0, 0);
      s.speedMph = 0;
      s.throttleLoad = 0.05;
      return;
    }

    // Handle brief wipeout recovery state
    if (s.isRecovering) {
      s.recoveryTimer -= dt;
      const w = getWaveHeightAndNormal(s.position.x, s.position.z, elapsedTime);
      s.position.y = w.height + 0.18;
      s.pitch = THREE.MathUtils.lerp(s.pitch, 0, 1.0 - Math.exp(-8.0 * dt));
      s.roll = THREE.MathUtils.lerp(s.roll, 0, 1.0 - Math.exp(-8.0 * dt));
      if (s.recoveryTimer <= 0) {
        s.isRecovering = false;
        const fwdX = -Math.sin(s.heading);
        const fwdZ = -Math.cos(s.heading);
        s.velocity.set(fwdX * 8.5, 0, fwdZ * 8.5);
        this._savePrevState();
      }
      return;
    }

    // Forward & Right unit vectors in XZ plane
    const fwdX = -Math.sin(s.heading);
    const fwdZ = -Math.cos(s.heading);
    const rightX = Math.cos(s.heading);
    const rightZ = -Math.sin(s.heading);

    // Multi-point hull wave sampling (bow, stern, port, starboard)
    const bowDist = 1.48;
    const sideDist = 0.54;
    const centerWave = getWaveHeightAndNormal(s.position.x, s.position.z, elapsedTime);
    const bowWave = getWaveHeightAndNormal(s.position.x + fwdX * bowDist, s.position.z + fwdZ * bowDist, elapsedTime);
    const sternWave = getWaveHeightAndNormal(s.position.x - fwdX * bowDist, s.position.z - fwdZ * bowDist, elapsedTime);
    const portWave = getWaveHeightAndNormal(s.position.x - rightX * sideDist, s.position.z - rightZ * sideDist, elapsedTime);
    const stbdWave = getWaveHeightAndNormal(s.position.x + rightX * sideDist, s.position.z + rightZ * sideDist, elapsedTime);

    // Check ramp elevation under craft & bow
    const rampSample = this.course.sampleRampAt(s.position.x, s.position.z, centerWave.height);
    const surfaceHeight = rampSample.onRamp
      ? Math.max(centerWave.height, rampSample.height)
      : centerWave.height;

    const waterSlopePitch = rampSample.onRamp
      ? rampSample.slopeAngle
      : Math.atan2(bowWave.height - sternWave.height, bowDist * 2.0);
    const waterSlopeRoll = rampSample.onRamp
      ? 0
      : Math.atan2(portWave.height - stbdWave.height, sideDist * 2.0);

    // Progressive analog-feel steering input smoothing (eliminates binary keyboard twitch)
    const rawSteer = (input.left ? 1 : 0) - (input.right ? 1 : 0) + (input.touchSteer || 0);
    const clampedRaw = Math.max(-1, Math.min(1, rawSteer));
    const steerRate = clampedRaw !== 0 ? 9.5 : 12.5;
    s.steerInputSmooth = THREE.MathUtils.lerp(
      s.steerInputSmooth,
      clampedRaw,
      1.0 - Math.exp(-steerRate * dt)
    );
    const clampedSteer = s.steerInputSmooth;
    s.steerAngle = THREE.MathUtils.lerp(s.steerAngle, -clampedSteer, 1.0 - Math.exp(-14.0 * dt));

    // Boost management
    const speed2D = Math.hypot(s.velocity.x, s.velocity.z);
    if (input.boost && s.boostEnergy > 5 && (input.throttle || s.isSubmerged || speed2D > 4)) {
      s.isBoosting = true;
      s.boostEnergy = Math.max(0, s.boostEnergy - dt * 25);
    } else {
      s.isBoosting = false;
      s.boostEnergy = Math.min(100, s.boostEnergy + dt * 12);
    }

    // Determine vertical clearance relative to water/ramp surface
    const altitudeAboveSurface = s.position.y - surfaceHeight;
    const diveActive = Boolean(input.dive);

    // =========================================================================
    // STATE TRANSITION CHECK: SUBMERGED vs SURFACE vs AIRBORNE
    // =========================================================================
    if (!s.isSubmerged && !rampSample.onRamp) {
      if (diveActive && altitudeAboveSurface < 0.85) {
        s.isSubmerged = true;
        s.isAirborne = false;
        s.submergeTime = 0;
        s.maxDiveDepthThisSubmerge = 0;
        s.velocity.y = Math.min(s.velocity.y, -5.2);
        s.pitch = Math.min(s.pitch, -0.42);
        if (this.callbacks.onDiveStart) this.callbacks.onDiveStart();
      } else if (altitudeAboveSurface < -0.68) {
        s.isSubmerged = true;
        s.isAirborne = false;
        s.submergeTime = 0;
        s.maxDiveDepthThisSubmerge = 0;
        if (this.callbacks.onDiveStart) this.callbacks.onDiveStart();
      }
    }

    // =========================================================================
    // 1. UNDERWATER SUBMARINE / DOLPHIN DIVING PHYSICS
    // =========================================================================
    if (s.isSubmerged) {
      s.submergeTime += dt;
      s.submergeDepth = Math.max(0, centerWave.height - s.position.y);
      s.maxDiveDepthThisSubmerge = Math.max(s.maxDiveDepthThisSubmerge, s.submergeDepth);

      let targetSubPitch = 0.16; // gentle upward glide when neutral
      if (diveActive) {
        targetSubPitch = -0.58;
      } else if (input.throttle && !input.brake) {
        targetSubPitch = 0.04;
      }
      if (input.brake || input.preload) {
        targetSubPitch = 0.72; // steep upward breach launch angle!
      }

      s.pitch = THREE.MathUtils.lerp(s.pitch, targetSubPitch, 1.0 - Math.exp(-5.2 * dt));

      // Underwater Barrel Roll (`Q` / `E`) or Banked Turning (`A` / `D`)
      const rollInput = (input.trickLeft ? -1 : 0) + (input.trickRight ? 1 : 0);
      if (rollInput !== 0) {
        s.angularVelRoll = THREE.MathUtils.lerp(s.angularVelRoll, rollInput * 5.4, 1.0 - Math.exp(-9.0 * dt));
        s.roll += s.angularVelRoll * dt;
        s.cumulativeRoll += Math.abs(s.angularVelRoll * dt);
        if (s.cumulativeRoll >= Math.PI * 1.75) {
          s.cumulativeRoll -= Math.PI * 2;
          if (this.callbacks.onUnderwaterTrick) {
            this.callbacks.onUnderwaterTrick('HYDRO BARREL ROLL', 350);
          }
        }
      } else {
        const targetBank = -clampedSteer * 0.48;
        const rollDiff = Math.atan2(Math.sin(targetBank - s.roll), Math.cos(targetBank - s.roll));
        s.roll += rollDiff * (1.0 - Math.exp(-6.5 * dt));
      }

      // Underwater Steering Yaw
      const turnRate = 1.9;
      s.heading += clampedSteer * turnRate * dt;

      // Underwater Waterjet Thrust along 3D orientation vector
      const thrustMag = (input.throttle || diveActive || input.preload ? 26.5 : 12.5) * (s.isBoosting ? 1.48 : 1.0);
      const cosP = Math.cos(s.pitch);
      const sinP = Math.sin(s.pitch);
      const dirX = -Math.sin(s.heading) * cosP;
      const dirY = sinP;
      const dirZ = -Math.cos(s.heading) * cosP;

      s.velocity.x += dirX * thrustMag * dt;
      s.velocity.y += dirY * thrustMag * dt;
      s.velocity.z += dirZ * thrustMag * dt;

      if (input.preload) {
        s.velocity.y += 14.5 * dt;
      }
      if (!diveActive) {
        s.velocity.y += 4.2 * dt;
      }

      const uwDrag = Math.exp(-1.12 * dt);
      s.velocity.multiplyScalar(uwDrag);

      s.position.addScaledVector(s.velocity, dt);

      const seabedY = getSeabedHeight(s.position.x, s.position.z) + 1.4;
      if (s.position.y < seabedY) {
        s.position.y = seabedY;
        s.velocity.y = Math.max(0, s.velocity.y);
        s.pitch = Math.max(0, s.pitch);
      }

      // Check for Surface Breach!
      if (s.position.y >= centerWave.height - 0.05 && s.velocity.y > 0) {
        s.isSubmerged = false;
        const breachSpeedY = s.velocity.y;

        if (s.maxDiveDepthThisSubmerge >= 2.0 && this.callbacks.onSubmarineBreach) {
          const depthMeters = Math.round(s.maxDiveDepthThisSubmerge * 10) / 10;
          const divePoints = Math.round(200 + s.maxDiveDepthThisSubmerge * 48);
          this.callbacks.onSubmarineBreach(depthMeters, divePoints, breachSpeedY > 4.2);
        }

        if (breachSpeedY > 3.5 || input.preload) {
          s.velocity.y = Math.max(breachSpeedY * 1.32, 9.6);
          this._enterAirborneState();
        }
      }

      s.speedMph = Math.hypot(s.velocity.x, s.velocity.y, s.velocity.z) * 2.23694;
      s.throttleLoad = input.throttle || diveActive ? 0.85 : 0.3;
      this._checkCourseGatesAndObstacles();
      return;
    }

    // =========================================================================
    // 2. AIRBORNE STATE (Full 360° Backflips, Frontflips, Barrel Rolls & Spins!)
    // =========================================================================
    if (altitudeAboveSurface > 0.36 && !s.isAirborne) {
      this._enterAirborneState();
    }

    if (s.isAirborne) {
      s.airTime += dt;

      // Gravity
      s.velocity.y -= 9.81 * dt;

      // Slight horizontal air drag
      s.velocity.x *= Math.exp(-0.075 * dt);
      s.velocity.z *= Math.exp(-0.075 * dt);

      let pitchTorque = 0;
      if (input.brake) {
        pitchTorque = 1.0; // Backflip (+pitch)
      } else if (input.throttle) {
        pitchTorque = -1.0; // Frontflip (-pitch)
      }

      const rollTorque = (input.trickLeft ? -1 : 0) + (input.trickRight ? 1 : 0);
      const yawTorque = clampedSteer;

      if (pitchTorque !== 0) {
        s.angularVelPitch = THREE.MathUtils.lerp(s.angularVelPitch, pitchTorque * 5.9, 1.0 - Math.exp(-9.5 * dt));
      } else {
        s.angularVelPitch *= Math.exp(-3.8 * dt);
      }

      if (rollTorque !== 0) {
        s.angularVelRoll = THREE.MathUtils.lerp(s.angularVelRoll, rollTorque * 6.5, 1.0 - Math.exp(-10.5 * dt));
      } else {
        s.angularVelRoll *= Math.exp(-3.8 * dt);
      }

      if (yawTorque !== 0) {
        s.angularVelYaw = THREE.MathUtils.lerp(s.angularVelYaw, yawTorque * 4.7, 1.0 - Math.exp(-8.5 * dt));
      } else {
        s.angularVelYaw *= Math.exp(-4.2 * dt);
      }

      // Integrate full 360° pitch, roll, and yaw without clamping!
      const dPitch = s.angularVelPitch * dt;
      const dRoll = s.angularVelRoll * dt;
      const dYaw = s.angularVelYaw * dt;

      s.pitch += dPitch;
      s.roll += dRoll;
      s.heading += dYaw;

      s.cumulativePitch += dPitch;
      s.cumulativeRoll += dRoll;
      s.cumulativeYaw += dYaw;

      // Detect completed 360° Backflips (+2π rad)
      const backflipCount = Math.floor((s.cumulativePitch + Math.PI * 0.35) / (Math.PI * 1.82));
      if (backflipCount > s.completedBackflips) {
        s.completedBackflips = backflipCount;
        const label = s.completedBackflips > 1 ? `${s.completedBackflips}x BACKFLIP!` : 'BACKFLIP!';
        const pts = s.completedBackflips > 1 ? 800 : 500;
        this._registerAirTrick(label, pts);
      }

      // Detect completed 360° Frontflips (-2π rad)
      const frontflipCount = Math.floor((-s.cumulativePitch + Math.PI * 0.35) / (Math.PI * 1.82));
      if (frontflipCount > s.completedFrontflips) {
        s.completedFrontflips = frontflipCount;
        const label = s.completedFrontflips > 1 ? `${s.completedFrontflips}x FRONTFLIP!` : 'FRONTFLIP!';
        const pts = s.completedFrontflips > 1 ? 850 : 550;
        this._registerAirTrick(label, pts);
      }

      // Detect completed 360° Barrel Rolls (Q / E)
      const barrelCount = Math.floor((Math.abs(s.cumulativeRoll) + Math.PI * 0.35) / (Math.PI * 1.82));
      if (barrelCount > s.completedBarrelRolls) {
        s.completedBarrelRolls = barrelCount;
        const label = s.completedBarrelRolls > 1 ? `${s.completedBarrelRolls}x BARREL ROLL!` : 'BARREL ROLL!';
        const pts = s.completedBarrelRolls > 1 ? 750 : 450;
        this._registerAirTrick(label, pts);
      }

      // Detect completed 360° Spins (A / D)
      const spinCount = Math.floor((Math.abs(s.cumulativeYaw) + Math.PI * 0.4) / (Math.PI * 1.78));
      if (spinCount > s.completedSpins) {
        s.completedSpins = spinCount;
        const label = s.completedSpins > 1 ? `${s.completedSpins * 360}° SPIN!` : '360° TAIL WHIP!';
        const pts = 400;
        this._registerAirTrick(label, pts);
      }

      if (s.airTime > 0.18 && s.completedBarrelRolls === 0 && Math.abs(s.cumulativeRoll) > 0.65 && !s.pendingAirTrickList.includes('AERO TUCK')) {
        this._registerAirTrick('AERO TUCK', 200);
      }

      // Advance position
      s.position.addScaledVector(s.velocity, dt);

      // Re-sample surface at new XZ to check water contact / landing
      const newWave = getWaveHeightAndNormal(s.position.x, s.position.z, elapsedTime);
      const newRamp = this.course.sampleRampAt(s.position.x, s.position.z, newWave.height);
      const targetFloor = newRamp.onRamp ? Math.max(newWave.height, newRamp.height) : newWave.height;

      if (s.position.y <= targetFloor + 0.12 && s.velocity.y <= 0) {
        this._handleWaterLanding(newWave, newRamp, diveActive);
      }

      s.speedMph = Math.hypot(s.velocity.x, s.velocity.z) * 2.23694;
      s.throttleLoad = input.throttle ? 0.95 : 0.25;
      this._checkCourseGatesAndObstacles();
      return;
    }

    // =========================================================================
    // 3. SURFACE RIDING, CARVING & PRELOAD JUMPING PHYSICS
    // =========================================================================
    s.onRamp = rampSample.onRamp;

    // Buoyancy vertical spring-damper keeping craft locked to the Gerstner wave or ramp surface
    const targetY = surfaceHeight + 0.12;
    const kBuoy = 1.0 - Math.exp(-19.0 * dt);
    s.position.y = THREE.MathUtils.lerp(s.position.y, targetY, kBuoy);
    s.velocity.y = centerWave.verticalVelocity;

    // Preload readiness
    s.preloadReady = (waterSlopePitch > 0.055 || rampSample.onRamp || speed2D > 5.5);

    // Handle Preload Hop (`Space`)
    if (input.preload && s.preloadReady) {
      s.preloadCharge = Math.min(1.0, s.preloadCharge + dt * 5.0);
      const rampBonus = rampSample.onRamp ? 5.8 + rampSample.ramp.height * 0.98 : 0.0;
      const crestBonus = Math.max(0, waterSlopePitch * 14.5);
      const speedBonus = Math.min(5.0, speed2D * 0.19);
      s.velocity.y = 7.6 + rampBonus + crestBonus + speedBonus;
      s.position.y = surfaceHeight + 0.42;
      s.angularVelPitch = 0.58;
      s.preloadCharge = 0;
      this._enterAirborneState();
      if (this.callbacks.onTakeoff) {
        this.callbacks.onTakeoff(rampSample.onRamp ? 'RAMP LAUNCH' : 'PRELOAD HOP');
      }
      return;
    } else {
      s.preloadCharge = Math.max(0, s.preloadCharge - dt * 4.0);
    }

    // Natural Ramp Lip Launch when riding off the top of a ramp at speed
    if (rampSample.onRamp && rampSample.progress > 0.84 && speed2D > 8.2) {
      const launchSpeedY = Math.sin(rampSample.slopeAngle) * speed2D * 1.2 + 4.0;
      s.velocity.y = launchSpeedY;
      s.position.y = surfaceHeight + 0.42;
      s.angularVelPitch = 0.36;
      this._enterAirborneState();
      if (this.callbacks.onTakeoff) {
        this.callbacks.onTakeoff(rampSample.ramp.label.toUpperCase());
      }
      return;
    }

    // Natural Wave Crest Launch when hitting a steep ocean swell at high speed
    if (!rampSample.onRamp && waterSlopePitch > 0.21 && speed2D > 18.5 && centerWave.verticalVelocity < -0.18) {
      s.velocity.y = Math.sin(waterSlopePitch) * speed2D * 0.96 + 2.9;
      s.position.y = surfaceHeight + 0.40;
      this._enterAirborneState();
      if (this.callbacks.onTakeoff) {
        this.callbacks.onTakeoff('CREST LAUNCH');
      }
      return;
    }

    // Speed-dependent responsive carving steering
    const steerEffectiveness = 0.48 + Math.min(1.0, speed2D / 13.5) * 1.38;
    const yawRate = clampedSteer * steerEffectiveness * (input.brake ? 1.25 : 1.0);
    s.heading += yawRate * dt;

    // Carve lean into the turn
    const targetCarveRoll = -clampedSteer * Math.min(0.48, speed2D * 0.023);
    s.carveRoll = THREE.MathUtils.lerp(s.carveRoll, targetCarveRoll, 1.0 - Math.exp(-10.5 * dt));

    // Align hull pitch & roll with wave normal + throttle bow rise using shortest angular delta
    const throttleBowRise = input.throttle ? 0.068 : input.brake ? -0.05 : 0;
    const targetPitch = waterSlopePitch + throttleBowRise;
    const targetRoll = waterSlopeRoll * 0.85;

    const pitchDiff = Math.atan2(Math.sin(targetPitch - s.pitch), Math.cos(targetPitch - s.pitch));
    const rollDiff = Math.atan2(Math.sin(targetRoll - s.roll), Math.cos(targetRoll - s.roll));
    const kAlign = 1.0 - Math.exp(-11.0 * dt);
    s.pitch += pitchDiff * kAlign;
    s.roll += rollDiff * kAlign;

    // Waterjet Forward Thrust, Braking/Reverse, and Carving Side-Grip
    const maxAccel = s.isBoosting ? 25.0 : 17.2;
    let forwardAccel = 0;
    if (input.throttle) {
      forwardAccel = maxAccel;
      s.throttleLoad = THREE.MathUtils.lerp(s.throttleLoad, s.isBoosting ? 1.0 : 0.80, 1.0 - Math.exp(-6.5 * dt));
    } else if (input.brake) {
      forwardAccel = -14.5;
      s.throttleLoad = THREE.MathUtils.lerp(s.throttleLoad, 0.35, 1.0 - Math.exp(-6.5 * dt));
    } else {
      s.throttleLoad = THREE.MathUtils.lerp(s.throttleLoad, 0.08, 1.0 - Math.exp(-4.5 * dt));
    }

    const curFwdX = -Math.sin(s.heading);
    const curFwdZ = -Math.cos(s.heading);
    const curRightX = Math.cos(s.heading);
    const curRightZ = -Math.sin(s.heading);

    // Decompose horizontal velocity into forward and lateral components for crisp jet-ski carving grip
    let fwdSpeed = s.velocity.x * curFwdX + s.velocity.z * curFwdZ;
    let latSpeed = s.velocity.x * curRightX + s.velocity.z * curRightZ;

    fwdSpeed += forwardAccel * dt;

    // Hydrodynamic drag (caps normal top speed around ~52 MPH, Boost around ~69 MPH)
    const dragCoeff = input.throttle ? 0.50 : 0.82;
    fwdSpeed *= Math.exp(-dragCoeff * dt);
    fwdSpeed = Math.max(-8.0, Math.min(s.isBoosting ? 31.5 : 23.8, fwdSpeed));

    // Strong chine lateral grip so carving turns bite the water with a slight playful tail slide
    latSpeed *= Math.exp(-6.2 * dt);

    s.velocity.x = curFwdX * fwdSpeed + curRightX * latSpeed;
    s.velocity.z = curFwdZ * fwdSpeed + curRightZ * latSpeed;

    s.position.x += s.velocity.x * dt;
    s.position.z += s.velocity.z * dt;

    s.speedMph = Math.hypot(s.velocity.x, s.velocity.z) * 2.23694;

    this._checkCourseGatesAndObstacles();
  }

  _enterAirborneState() {
    const s = this.state;
    s.isAirborne = true;
    s.airTime = 0;
    s.cumulativePitch = 0;
    s.cumulativeRoll = 0;
    s.cumulativeYaw = 0;
    s.completedBackflips = 0;
    s.completedFrontflips = 0;
    s.completedBarrelRolls = 0;
    s.completedSpins = 0;
    s.pendingAirChainScore = 0;
    s.pendingAirTrickList = [];
  }

  _registerAirTrick(name, points) {
    const s = this.state;
    s.activeTrickName = name;
    s.pendingAirChainScore += points;
    s.pendingAirTrickList.push(name);
    if (this.callbacks.onAirTrick) {
      this.callbacks.onAirTrick(name, points, s.pendingAirChainScore);
    }
  }

  _handleWaterLanding(waveSample, rampSample, diveHeld) {
    const s = this.state;
    const totalAirTime = s.airTime;
    s.isAirborne = false;
    s.airTime = 0;
    s.angularVelPitch = 0;
    s.angularVelRoll = 0;
    s.angularVelYaw = 0;

    // Wrap pitch and roll into [-PI, PI] and sync prevState so interpolation doesn't unwind across 2π!
    const normPitch = Math.atan2(Math.sin(s.pitch), Math.cos(s.pitch));
    const normRoll = Math.atan2(Math.sin(s.roll), Math.cos(s.roll));
    s.pitch = normPitch;
    s.roll = normRoll;
    this.prevState.pitch = normPitch;
    this.prevState.roll = normRoll;

    // Check if nose-diving into the ocean
    if (!rampSample.onRamp && (diveHeld || (normPitch < -0.52 && normPitch > -2.3 && Math.abs(normRoll) < 1.1))) {
      s.isSubmerged = true;
      s.submergeTime = 0;
      s.maxDiveDepthThisSubmerge = 0.5;
      s.velocity.y = Math.min(s.velocity.y * 0.65, -6.0);

      const airPoints = s.pendingAirChainScore + Math.round(totalAirTime * 120);
      if (this.callbacks.onLanding) {
        this.callbacks.onLanding('SUBMARINE DIVE!', airPoints + 250, s.pendingAirTrickList, true);
      }
      if (this.callbacks.onDiveStart) {
        this.callbacks.onDiveStart();
      }
      s.pendingAirChainScore = 0;
      s.pendingAirTrickList = [];
      return;
    }

    s.position.y = (rampSample.onRamp ? Math.max(waveSample.height, rampSample.height) : waveSample.height) + 0.12;
    s.impactCompression = Math.min(1.0, Math.abs(s.velocity.y) * 0.085);
    s.velocity.y = 0;

    if (totalAirTime < 0.25) {
      return;
    }

    const pitchMisalign = Math.abs(normPitch);
    const rollMisalign = Math.abs(normRoll);

    const baseAirScore = Math.round(totalAirTime * 150);
    const totalJumpScore = baseAirScore + s.pendingAirChainScore;

    if (pitchMisalign < 0.80 && rollMisalign < 0.80) {
      // CLEAN LANDING! Boosts speed and banks full trick chain
      const fwdX = -Math.sin(s.heading);
      const fwdZ = -Math.cos(s.heading);
      s.velocity.x += fwdX * 4.0;
      s.velocity.z += fwdZ * 4.0;
      s.boostEnergy = Math.min(100, s.boostEnergy + 24);
      s.pitch *= 0.35;
      s.roll *= 0.35;
      this.prevState.pitch = s.pitch;
      this.prevState.roll = s.roll;

      const finalScore = totalJumpScore + 250;
      if (this.callbacks.onLanding) {
        this.callbacks.onLanding('CLEAN LANDING', finalScore, s.pendingAirTrickList, true);
      }
    } else {
      // ROUGH LANDING
      s.velocity.x *= 0.58;
      s.velocity.z *= 0.58;
      s.pitch = 0;
      s.roll = 0;
      this.prevState.pitch = 0;
      this.prevState.roll = 0;

      const roughScore = Math.round(baseAirScore * 0.5);
      if (this.callbacks.onLanding) {
        this.callbacks.onLanding('ROUGH LANDING', roughScore, [], false);
      }
    }

    s.pendingAirChainScore = 0;
    s.pendingAirTrickList = [];
  }

  _checkCourseGatesAndObstacles() {
    const s = this.state;

    // 1. Check Buoy Gate Crossings
    for (let i = 0; i < this.course.gates.length; i++) {
      const g = this.course.gates[i];
      if (g.cleared) continue;

      const dx = s.position.x - g.x;
      const dz = s.position.z - g.z;
      const distSq = dx * dx + dz * dz;
      const halfW = g.width * 0.5 + 2.8;

      if (distSq <= halfW * halfW && Math.abs(dz) < 6.8) {
        g.cleared = true;
        s.safePose.position.set(g.x, 0.3, g.z);
        s.safePose.heading = g.heading;

        if (this.callbacks.onGateCleared) {
          this.callbacks.onGateCleared(g);
        }
      }
    }

    // 2. Check Solid Island / Platform Pillar Colliders
    for (let i = 0; i < this.course.colliders.length; i++) {
      const col = this.course.colliders[i];
      const dx = s.position.x - col.x;
      const dz = s.position.z - col.z;
      const dist = Math.hypot(dx, dz);
      if (dist < col.radius) {
        const speed = Math.hypot(s.velocity.x, s.velocity.z);
        if (speed > 14.5) {
          if (this.callbacks.onWipeout) {
            this.callbacks.onWipeout();
          }
          this.triggerManualRecovery();
          return;
        } else {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          s.position.x = col.x + nx * (col.radius + 0.5);
          s.position.z = col.z + nz * (col.radius + 0.5);
          s.velocity.x *= -0.3;
          s.velocity.z *= -0.3;
        }
      }
    }
  }
}
