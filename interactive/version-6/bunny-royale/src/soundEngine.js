// Procedural Tactical Sound Engine using Web Audio API
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.5;
    this.enabled = true;
  }

  _init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = this.volume;
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (_) {
      // Fail silently if AudioContext is blocked or unavailable
    }
  }

  setVolume(val) {
    this.volume = THREE_MATH_CLAMP(val, 0, 1);
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      }
    } catch (_) {}
  }

  playLaser() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  playSeedThump() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      gain.gain.setValueAtTime(0.48, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }

  playArcLightning() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(1480, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  playHitMarker(isCrit = false) {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const now = this.ctx.currentTime;

      // Crisp tactical transient tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isCrit ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isCrit ? 1560 : 920, now);
      osc.frequency.exponentialRampToValueAtTime(isCrit ? 2240 : 480, now + 0.055);

      gain.gain.setValueAtTime(isCrit ? 0.38 : 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);

      if (isCrit) {
        // Metallic headshot ping harmonic
        const ping = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(2680, now + 0.015);
        ping.frequency.exponentialRampToValueAtTime(3120, now + 0.09);
        pingGain.gain.setValueAtTime(0.24, now + 0.015);
        pingGain.gain.exponentialRampToValueAtTime(0.005, now + 0.095);
        ping.connect(pingGain);
        pingGain.connect(this.masterGain);
        ping.start(now + 0.015);
        ping.stop(now + 0.095);
      }
    } catch (_) {}
  }

  playHitTick(isCrit = false) {
    this.playHitMarker(isCrit);
  }

  playShieldBreak() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const now = this.ctx.currentTime;
      // Crystalline electric shield shatter chord
      const freqs = [1680, 1240, 820, 460];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        const t0 = now + idx * 0.024;
        osc.frequency.setValueAtTime(f, t0);
        osc.frequency.exponentialRampToValueAtTime(f * 0.55, t0 + 0.14);
        gain.gain.setValueAtTime(0.22, t0);
        gain.gain.exponentialRampToValueAtTime(0.008, t0 + 0.15);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t0);
        osc.stop(t0 + 0.15);
      });
    } catch (_) {}
  }

  playElimination() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const now = this.ctx.currentTime;
      // Punchy two-tone arena KO chime + sub drop
      const notes = [659.25, 987.77, 1318.51]; // E5 -> B5 -> E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t0 = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.30, t0);
        gain.gain.exponentialRampToValueAtTime(0.008, t0 + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t0);
        osc.stop(t0 + 0.22);
      });
    } catch (_) {}
  }

  playJump() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (_) {}
  }

  playBounce() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.28);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (_) {}
  }

  playPickup() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (_) {}
  }

  playUIHover() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.035);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  playUIClick() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  playFanfare() {
    try {
      this._init();
      if (!this.ctx || !this.enabled) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startT = this.ctx.currentTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, startT);
        gain.gain.setValueAtTime(0.3, startT);
        gain.gain.exponentialRampToValueAtTime(0.01, startT + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startT);
        osc.stop(startT + 0.35);
      });
    } catch (_) {}
  }
}

function THREE_MATH_CLAMP(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export const soundEngine = new SoundEngine();
