/**
 * audioEngine.js - Track Atlas Web Audio Engine & Electro-Acoustic Synthesizer
 *
 * Implements:
 * - Default demonstration track "Quiet Current" (96 BPM, 03:12 / 192s, starting at 01:24 / 84s)
 * - Smooth 60fps transport clock with loop bounds ("Loop a moment")
 * - Multi-stem synthesis (Kick, Sub-Bass, Rhodes/Felt Chords, Kalimba/Chime Melody, Brushed Percussion)
 * - Real-time Web Audio AnalyserNode feature extraction + deterministic fallback envelope
 * - Local audio file decoding (MP3, WAV, OGG, M4A, FLAC, AAC) with safe error recovery
 */

export class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTime = 84.0; // Canonical starting timestamp: 01:24
    this.duration = 192.0;   // Canonical duration: 03:12 (192s)
    this.bpm = 96;
    this.trackTitle = 'Quiet Current';
    this.trackSubtitle = 'Demo track';

    // Loop a moment bounds (framing 01:24 nicely)
    this.loop = {
      enabled: false,
      start: 56.0, // ~29%
      end: 118.0   // ~61.5%
    };

    // Stem nodes & real-time energy
    this.stems = {
      kick: { name: 'Kick', gainNode: null, analyser: null, muted: false, dataArray: null, energy: 0 },
      bass: { name: 'Bass', gainNode: null, analyser: null, muted: false, dataArray: null, energy: 0 },
      melody: { name: 'Melody', gainNode: null, analyser: null, muted: false, dataArray: null, energy: 0 },
      chords: { name: 'Chords', gainNode: null, analyser: null, muted: false, dataArray: null, energy: 0 },
      hihat: { name: 'Percussion', gainNode: null, analyser: null, muted: false, dataArray: null, energy: 0 }
    };

    this.masterGain = null;
    this.masterAnalyser = null;
    this.masterData = null;
    this.masterWaveform = null;

    // Sequencer timing
    this.step = 0;
    this.sixteenthDuration = 60 / (this.bpm * 4);
    this.nextNoteTime = 0;
    this.lastFrameTime = 0;
    this.schedulerTimer = null;

    // Custom audio buffer state
    this.customAudioBuffer = null;
    this.customSourceNode = null;
    this.isCustom = false;
    this.customWaveformPeaks = null;

    // E minor / Dorian warm scale
    this.scale = [
      164.81, // E3
      196.00, // G3
      220.00, // A3
      246.94, // B3
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      493.88, // B4
      587.33, // D5
      659.25  // E5
    ];

    this.chordProgression = [
      [164.81, 196.00, 246.94, 293.66], // Em7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [110.00, 146.83, 164.81, 220.00]  // Am7
    ];

    // Precompute canonical waveform bar profile matching kinetic-poster-desktop-v2.png
    this.demoWaveformProfile = this.buildDemoWaveformProfile(136);
  }

  buildDemoWaveformProfile(count) {
    const bars = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      // Tapered dotted intro and outro tails
      if (u < 0.08 || u > 0.92) {
        bars[i] = 0.04;
        continue;
      }
      // Phrase envelope with three expressive swells matching reference scrubber
      const env1 = Math.exp(-Math.pow((u - 0.22) / 0.09, 2)) * 0.88;
      const env2 = Math.exp(-Math.pow((u - 0.44) / 0.11, 2)) * 0.95;
      const env3 = Math.exp(-Math.pow((u - 0.66) / 0.12, 2)) * 0.78;
      const env4 = Math.exp(-Math.pow((u - 0.82) / 0.07, 2)) * 0.72;
      const base = Math.max(env1, env2, env3, env4, 0.18);
      const grain = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.73 + Math.cos(i * 0.61) * 2.1));
      bars[i] = Math.min(1.0, Math.max(0.08, base * grain));
    }
    return bars;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.audioCtx = new AudioContextClass();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.82, this.audioCtx.currentTime);

    this.masterAnalyser = this.audioCtx.createAnalyser();
    this.masterAnalyser.fftSize = 512;
    this.masterAnalyser.smoothingTimeConstant = 0.82;
    this.masterData = new Uint8Array(this.masterAnalyser.frequencyBinCount);
    this.masterWaveform = new Uint8Array(this.masterAnalyser.fftSize);

    this.masterGain.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.audioCtx.destination);

    for (const key of Object.keys(this.stems)) {
      const g = this.audioCtx.createGain();
      g.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
      const an = this.audioCtx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.76;
      g.connect(an);
      an.connect(this.masterGain);

      this.stems[key].gainNode = g;
      this.stems[key].analyser = an;
      this.stems[key].dataArray = new Uint8Array(an.frequencyBinCount);
    }
  }

  async resumeContext() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        // Ignore autoplay restriction errors in headless environments
      }
    }
  }

  play() {
    this.resumeContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();

    if (this.isCustom && this.customAudioBuffer) {
      this.playCustomAudio();
    } else {
      this.startSynthesizerScheduler();
    }
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.customSourceNode) {
      try { this.customSourceNode.stop(); } catch (e) {}
      this.customSourceNode = null;
    }
  }

  seek(timeInSeconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, timeInSeconds));
    if (this.isPlaying && this.isCustom) {
      this.pause();
      this.play();
    }
  }

  setBpm(newBpm) {
    const clamped = Math.max(40, Math.min(200, Math.round(Number(newBpm) || 96)));
    this.bpm = clamped;
    this.sixteenthDuration = 60 / (this.bpm * 4);
    return this.bpm;
  }

  toggleLoop() {
    this.loop.enabled = !this.loop.enabled;
    if (this.loop.enabled) {
      if (this.currentTime < this.loop.start || this.currentTime > this.loop.end) {
        this.seek(this.loop.start);
      }
    }
    return this.loop.enabled;
  }

  setLoopRange(start, end) {
    const minGap = Math.min(6.0, this.duration * 0.04);
    let s = Math.max(0, Math.min(this.duration - minGap, start));
    let e = Math.max(s + minGap, Math.min(this.duration, end));
    this.loop.start = s;
    this.loop.end = e;
  }

  updateClock(nowMs = performance.now()) {
    if (!this.isPlaying) {
      this.lastFrameTime = nowMs;
      return;
    }
    const dt = Math.min(0.1, Math.max(0, (nowMs - this.lastFrameTime) / 1000));
    this.lastFrameTime = nowMs;
    this.currentTime += dt;

    if (this.loop.enabled && this.currentTime >= this.loop.end) {
      this.currentTime = this.loop.start;
      if (this.isCustom && this.customAudioBuffer) {
        this.pause();
        this.play();
      }
    } else if (this.currentTime >= this.duration) {
      this.currentTime = this.loop.enabled ? this.loop.start : 0;
      if (this.isCustom && this.customAudioBuffer) {
        this.pause();
        this.play();
      }
    }
  }

  startSynthesizerScheduler() {
    if (!this.audioCtx) return;
    this.nextNoteTime = this.audioCtx.currentTime + 0.02;
    this.step = Math.floor(this.currentTime / this.sixteenthDuration) % 64;

    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    this.schedulerTimer = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      while (this.nextNoteTime < this.audioCtx.currentTime + 0.12) {
        this.triggerStepAudio(this.nextNoteTime, this.step);
        this.nextNoteTime += this.sixteenthDuration;
        this.step = (this.step + 1) % 64;
      }
    }, 35);
  }

  triggerStepAudio(time, s) {
    if (!this.audioCtx) return;

    // 1. Soft Warm Kick on beats
    if ((s % 8 === 0 || s % 16 === 6) && !this.stems.kick.muted) {
      this.playKick(time, s % 8 === 0 ? 0.9 : 0.55);
    }

    // 2. Deep Sub-Bass pulse
    if ((s % 4 === 0 || s % 8 === 3) && !this.stems.bass.muted) {
      const chordIdx = Math.floor(s / 16) % this.chordProgression.length;
      const rootFreq = this.chordProgression[chordIdx][0] * 0.5;
      this.playBass(time, rootFreq);
    }

    // 3. Felt Piano / Rhodes Chords on bar boundaries
    if (s % 16 === 0 && !this.stems.chords.muted) {
      const chordIdx = Math.floor(s / 16) % this.chordProgression.length;
      this.playChords(time, this.chordProgression[chordIdx]);
    }

    // 4. Brushed Organic Shaker / Percussion
    if (!this.stems.hihat.muted && (s % 2 === 0 || s % 4 === 3)) {
      const vel = (s % 4 === 2) ? 0.28 : 0.12;
      this.playHihat(time, vel);
    }

    // 5. Delicate Water-Drop / Kalimba Melody
    const melodySteps = [0, 3, 6, 9, 12, 14, 18, 22, 24, 27, 30];
    if (!this.stems.melody.muted && melodySteps.includes(s % 32)) {
      const noteIdx = Math.abs(Math.floor(Math.sin(s * 0.45) * 5 + 5)) % this.scale.length;
      this.playMelody(time, this.scale[noteIdx]);
    }
  }

  playKick(time, level = 0.85) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.frequency.setValueAtTime(128, time);
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.13);

    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);

    osc.connect(gain);
    gain.connect(this.stems.kick.gainNode);
    osc.start(time);
    osc.stop(time + 0.27);
  }

  playBass(time, freq) {
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(210, time);
    filter.frequency.exponentialRampToValueAtTime(85, time + 0.36);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.44);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.stems.bass.gainNode);
    osc.start(time);
    osc.stop(time + 0.46);
  }

  playChords(time, frequencies) {
    frequencies.forEach((f, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, time);
      osc.detune.setValueAtTime((i - 1.5) * 5, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.16, time + 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 2.3);

      osc.connect(gain);
      gain.connect(this.stems.chords.gainNode);
      osc.start(time);
      osc.stop(time + 2.35);
    });
  }

  playHihat(time, volume) {
    const bufferSize = Math.floor(this.audioCtx.sampleRate * 0.045);
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(6200, time);
    filter.Q.setValueAtTime(1.4, time);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.042);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.stems.hihat.gainNode);
    noise.start(time);
    noise.stop(time + 0.045);
  }

  playMelody(time, freq) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.32, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.75);

    osc.connect(gain);
    gain.connect(this.stems.melody.gainNode);
    osc.start(time);
    osc.stop(time + 0.78);
  }

  async loadCustomAudio(file) {
    await this.resumeContext();
    const arrayBuffer = await file.arrayBuffer();
    const decoded = await this.audioCtx.decodeAudioData(arrayBuffer);

    this.customAudioBuffer = decoded;
    this.isCustom = true;
    this.duration = Math.max(1, decoded.duration);
    this.currentTime = 0;
    this.trackTitle = file.name.replace(/\.[^/.]+$/, '');
    this.trackSubtitle = 'Local audio file';
    this.loop.start = Math.min(this.duration * 0.25, this.duration - 2);
    this.loop.end = Math.min(this.duration * 0.65, this.duration);

    // Compute custom waveform peaks for scrubber
    this.customWaveformPeaks = this.extractPeaksFromBuffer(decoded, 136);

    if (this.isPlaying) {
      this.pause();
      this.play();
    }
    return {
      title: this.trackTitle,
      duration: this.duration
    };
  }

  restoreDemoTrack() {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();
    this.isCustom = false;
    this.customAudioBuffer = null;
    this.customWaveformPeaks = null;
    this.duration = 192.0;
    this.currentTime = 84.0;
    this.bpm = 96;
    this.trackTitle = 'Quiet Current';
    this.trackSubtitle = 'Demo track';
    this.loop.start = 56.0;
    this.loop.end = 118.0;
    if (wasPlaying) this.play();
  }

  extractPeaksFromBuffer(buffer, count) {
    const chan = buffer.getChannelData(0);
    const peaks = new Float32Array(count);
    const blockSize = Math.max(1, Math.floor(chan.length / count));
    let maxPeak = 0.01;
    for (let i = 0; i < count; i++) {
      let sum = 0;
      const start = i * blockSize;
      const stride = Math.max(1, Math.floor(blockSize / 64));
      let samples = 0;
      for (let j = 0; j < blockSize && start + j < chan.length; j += stride) {
        sum += Math.abs(chan[start + j]);
        samples++;
      }
      peaks[i] = samples > 0 ? sum / samples : 0.1;
      if (peaks[i] > maxPeak) maxPeak = peaks[i];
    }
    for (let i = 0; i < count; i++) {
      peaks[i] = Math.max(0.06, Math.min(1.0, (peaks[i] / maxPeak) * 0.92));
    }
    return peaks;
  }

  playCustomAudio() {
    if (!this.customAudioBuffer || !this.audioCtx) return;
    if (this.customSourceNode) {
      try { this.customSourceNode.stop(); } catch (e) {}
    }

    const src = this.audioCtx.createBufferSource();
    src.buffer = this.customAudioBuffer;
    this.customSourceNode = src;

    const bands = [
      { key: 'kick', type: 'lowpass', freq: 120, q: 1.0 },
      { key: 'bass', type: 'bandpass', freq: 240, q: 1.8 },
      { key: 'chords', type: 'bandpass', freq: 780, q: 1.4 },
      { key: 'melody', type: 'bandpass', freq: 2200, q: 1.6 },
      { key: 'hihat', type: 'highpass', freq: 5800, q: 1.0 }
    ];

    for (const b of bands) {
      const f = this.audioCtx.createBiquadFilter();
      f.type = b.type;
      f.frequency.value = b.freq;
      f.Q.value = b.q;
      src.connect(f);
      f.connect(this.stems[b.key].gainNode);
    }

    src.start(0, this.currentTime);
  }

  getWaveformProfile() {
    return this.isCustom && this.customWaveformPeaks
      ? this.customWaveformPeaks
      : this.demoWaveformProfile;
  }

  getAudioFeatures() {
    // Beat phase at current BPM for deterministic visual cadence even when AudioContext is muted/headless
    const beatPeriod = 60 / this.bpm;
    const beatPhase = (this.currentTime % beatPeriod) / beatPeriod;
    const pulse = this.isPlaying ? Math.pow(Math.max(0, Math.cos(beatPhase * Math.PI * 2)), 4) : 0;
    const subPulse = this.isPlaying ? 0.5 + 0.5 * Math.sin((this.currentTime / beatPeriod) * Math.PI) : 0;

    if (!this.audioCtx || !this.isPlaying) {
      return {
        masterEnergy: 0,
        beatPhase,
        stems: { kick: 0, bass: 0, melody: 0, chords: 0, hihat: 0 },
        isQuiet: true
      };
    }

    this.masterAnalyser.getByteFrequencyData(this.masterData);
    this.masterAnalyser.getByteTimeDomainData(this.masterWaveform);

    let sum = 0;
    for (let i = 0; i < this.masterData.length; i++) {
      sum += this.masterData[i];
    }
    const measuredMaster = sum / (this.masterData.length * 255);

    const stemEnergies = {};
    for (const key of Object.keys(this.stems)) {
      const stem = this.stems[key];
      stem.analyser.getByteFrequencyData(stem.dataArray);
      let sSum = 0;
      for (let i = 0; i < stem.dataArray.length; i++) {
        sSum += stem.dataArray[i];
      }
      stem.energy = sSum / (stem.dataArray.length * 255);
      stemEnergies[key] = stem.energy;
    }

    // Blend measured Web Audio FFT with musical clock envelope so headless/muted browsers still animate authentically
    const kick = Math.max(stemEnergies.kick, pulse * 0.55);
    const bass = Math.max(stemEnergies.bass, subPulse * 0.42);
    const chords = Math.max(stemEnergies.chords, (0.3 + 0.2 * Math.sin(this.currentTime * 0.8)));
    const melody = Math.max(stemEnergies.melody, (0.25 + 0.25 * Math.abs(Math.sin(this.currentTime * 2.1))));
    const hihat = Math.max(stemEnergies.hihat, (0.2 + 0.2 * Math.abs(Math.cos(this.currentTime * 6.0))));
    const masterEnergy = Math.max(measuredMaster, (kick + bass + chords + melody) * 0.22);

    return {
      masterEnergy,
      beatPhase,
      rawFrequencyData: this.masterData,
      rawWaveform: this.masterWaveform,
      stems: { kick, bass, chords, melody, hihat },
      isQuiet: masterEnergy < 0.04
    };
  }

  formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
