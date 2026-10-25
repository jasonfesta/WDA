/**
 * Procedural Multi-Layered WebAudio Sound Engine (`CONTENT-ASSETS.md` & `INTERACTION-STATES.md`)
 *
 * Audio begins ONLY after a deliberate start action (`INTERACTION-STATES.md`).
 * Layers:
 * 1. Waterjet Marine Engine Synthesizer (fundamental sawtooth + harmonic triangle + load filter,
 *    with unloaded airborne revving pitch burst and underwater hydrophone low-pass muffling!).
 * 2. Hull-on-Water Contact & Carving Spray Hiss (filtered pink/white noise modulated by speed & steering).
 * 3. High-Speed Wind Rush.
 * 4. Event One-Shots:
 *    - Takeoff / Preload Hop whoosh
 *    - Clean Landing crisp spray + harmonic confirmation chord
 *    - Rough Landing heavy splash impact
 *    - Submarine Dive Submerge plunge & Breach Launch splash burst
 *    - Buoy Gate Cleared chime & Aerial Trick completed chime
 */
export class OceanAudioEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.muted = false;
    this.masterVolume = 0.8;

    this.masterGain = null;
    this.underwaterFilter = null;

    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;

    this.waterNoiseNode = null;
    this.waterFilter = null;
    this.waterGain = null;

    this.windGain = null;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.initialized = true;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
    this.masterGain.connect(this.ctx.destination);

    // Global underwater hydrophone low-pass filter (20,000 Hz above water -> 320 Hz submerged!)
    this.underwaterFilter = this.ctx.createBiquadFilter();
    this.underwaterFilter.type = 'lowpass';
    this.underwaterFilter.frequency.value = 18000;
    this.underwaterFilter.Q.value = 1.2;
    this.underwaterFilter.connect(this.masterGain);

    // 1. Waterjet Engine Layer
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.08;

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 540;
    this.engineFilter = engineFilter;

    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.value = 62;

    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'triangle';
    this.engineOsc2.frequency.value = 124;

    this.engineOsc1.connect(engineFilter);
    this.engineOsc2.connect(engineFilter);
    engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.underwaterFilter);

    this.engineOsc1.start();
    this.engineOsc2.start();

    // 2. Water Surface Contact & Carving Spray Noise Layer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.35;
    }

    this.waterNoiseNode = this.ctx.createBufferSource();
    this.waterNoiseNode.buffer = noiseBuffer;
    this.waterNoiseNode.loop = true;

    this.waterFilter = this.ctx.createBiquadFilter();
    this.waterFilter.type = 'bandpass';
    this.waterFilter.frequency.value = 850;
    this.waterFilter.Q.value = 0.8;

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.value = 0.02;

    this.waterNoiseNode.connect(this.waterFilter);
    this.waterFilter.connect(this.waterGain);
    this.waterGain.connect(this.underwaterFilter);
    this.waterNoiseNode.start();
  }

  setVolume(val0to1) {
    this.masterVolume = Math.max(0, Math.min(1, val0to1));
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.04);
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime, 0.04);
    }
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  update(craftState, isCameraUnderwater, isPaused) {
    if (!this.initialized || !this.ctx) return;

    if (isPaused) {
      this.engineGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.05);
      this.waterGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.05);
      return;
    }

    const now = this.ctx.currentTime;
    const speedNorm = Math.min(1.0, craftState.speedMph / 65.0);

    // Underwater low-pass hydrophone filter
    const targetCutoff = isCameraUnderwater || craftState.isSubmerged ? 340 : 16500;
    this.underwaterFilter.frequency.setTargetAtTime(targetCutoff, now, 0.08);

    // Engine RPM pitch: revs higher when unloaded in the air!
    const airRevBoost = craftState.isAirborne ? 32 : 0;
    const boostPitch = craftState.isBoosting ? 24 : 0;
    const baseFreq = 58 + speedNorm * 115 + craftState.throttleLoad * 42 + airRevBoost + boostPitch;

    this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.05);
    this.engineFilter.frequency.setTargetAtTime(380 + speedNorm * 950 + airRevBoost * 8, now, 0.06);
    this.engineGain.gain.setTargetAtTime(0.065 + craftState.throttleLoad * 0.085, now, 0.06);

    // Water surface spray & carving noise (drops off while airborne, rumbles underwater)
    if (craftState.isAirborne) {
      this.waterGain.gain.setTargetAtTime(0.015, now, 0.08);
      this.waterFilter.frequency.setTargetAtTime(1400, now, 0.08);
    } else if (craftState.isSubmerged) {
      this.waterGain.gain.setTargetAtTime(0.14, now, 0.08);
      this.waterFilter.frequency.setTargetAtTime(240, now, 0.08);
    } else {
      const carveBoost = Math.abs(craftState.steerAngle) * 0.06;
      const sprayVol = Math.min(0.22, 0.02 + speedNorm * 0.13 + carveBoost);
      this.waterGain.gain.setTargetAtTime(sprayVol, now, 0.06);
      this.waterFilter.frequency.setTargetAtTime(650 + speedNorm * 900 + carveBoost * 4000, now, 0.06);
    }
  }

  playCleanLandingCue() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;

    // Pleasant two-note confirmation chime + crisp water slap
    const freqs = [523.25, 659.25, 783.99]; // C5 - E5 - G5
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.055);
      gain.gain.setValueAtTime(0.09, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.32);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.34);
    });
  }

  playRoughLandingSplash() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  playGateChime(isFinish = false) {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const notes = isFinish ? [587.33, 783.99, 987.77, 1174.66] : [587.33, 880.0];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      g.gain.setValueAtTime(0.08, now + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.28);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.3);
    });
  }

  playTrickChime() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(990, now + 0.16);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playDivePlunge() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}
