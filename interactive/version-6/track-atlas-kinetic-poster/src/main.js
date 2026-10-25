/**
 * main.js — Master Orchestrator for Track Atlas: 02 / Kinetic Poster
 *
 * Connects:
 * - AudioEngine ("Quiet Current" 96 BPM synth + local audio decoding + loop bounds)
 * - PaperTextureGenerator (Cold-press cotton watercolor paper #F3EDE0)
 * - KineticPosterRenderer (Hybrid 1:1 Reference Artwork + Live Interactive Watercolor & Calligraphy)
 * - Shared Bottom Transport & Waveform Scrubber with "Loop a moment" dual orange handles + arc
 * - Save Frame export + "Frame saved" confirmation card (matching shared-controls-v2.png)
 */

import { AudioEngine } from './audioEngine.js';
import { PaperTextureGenerator } from './paperTexture.js';
import { KineticPosterRenderer } from './kineticPosterRenderer.js';

class TrackAtlasApp {
  constructor() {
    this.canvas = document.getElementById('render-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.waveformCanvas = document.getElementById('waveform-canvas');
    this.waveformCtx = this.waveformCanvas.getContext('2d');

    this.audioEngine = new AudioEngine();
    this.currentMode = 'kinetic-poster';
    this.isVisualsPaused = false;
    this.dpr = window.devicePixelRatio || 1;

    // UI Elements
    this.btnPlay = document.getElementById('btn-play');
    this.playIcon = document.getElementById('play-icon');
    this.pauseIcon = document.getElementById('pause-icon');
    this.scrubberContainer = document.getElementById('scrubber-container');
    this.timeDisplay = document.getElementById('time-display');
    this.bpmBadge = document.getElementById('bpm-badge');
    this.loopBtn = document.getElementById('btn-loop');
    this.canvasHint = document.getElementById('canvas-hint');
    this.btnUndo = document.getElementById('btn-undo');
    this.btnReset = document.getElementById('btn-reset');
    this.btnTreatment = document.getElementById('btn-treatment');
    this.btnPauseVisuals = document.getElementById('btn-pause-visuals');
    this.trackTitleText = document.getElementById('track-title-text');
    this.trackSubtitleText = document.getElementById('track-subtitle-text');

    // Scrubber interaction state ('seek' | 'loop-start' | 'loop-end' | null)
    this.scrubDragMode = null;
    this.scrubberHovered = false;
    this.toastTimer = null;

    this.init();
  }

  init() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.paperGen = new PaperTextureGenerator(rect.width, rect.height);
    this.kineticPoster = new KineticPosterRenderer(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.bindEvents();
    this.updateScrubberUI();
    this.startAnimationLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, Math.floor(rect.width * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (this.paperGen) this.paperGen.resize(rect.width, rect.height);
    if (this.kineticPoster) this.kineticPoster.resize(rect.width, rect.height);

    const wRect = this.waveformCanvas.getBoundingClientRect();
    this.waveformCanvas.width = Math.max(1, Math.floor(wRect.width * this.dpr));
    this.waveformCanvas.height = Math.max(1, Math.floor(wRect.height * this.dpr));
    this.waveformCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  bindEvents() {
    // 1. Play / Pause Toggle
    this.btnPlay.addEventListener('click', () => {
      if (this.audioEngine.isPlaying) {
        this.audioEngine.pause();
        this.updatePlayState(false);
      } else {
        this.audioEngine.play();
        this.updatePlayState(true);
      }
    });

    // 2. Waveform Scrubber Seeking & "Loop a moment" Dual Handle Dragging
    const getScrubFraction = (clientX) => {
      const rect = this.scrubberContainer.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
    };

    this.scrubberContainer.addEventListener('pointerdown', (e) => {
      const rect = this.scrubberContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const w = Math.max(1, rect.width);
      const frac = Math.max(0, Math.min(1, x / w));
      const dur = this.audioEngine.duration;

      // Check if clicking near one of the orange loop handles when loop is enabled
      if (this.audioEngine.loop.enabled) {
        const startX = (this.audioEngine.loop.start / dur) * w;
        const endX = (this.audioEngine.loop.end / dur) * w;
        if (Math.abs(x - startX) <= 14) {
          this.scrubDragMode = 'loop-start';
          this.scrubberContainer.setPointerCapture(e.pointerId);
          return;
        }
        if (Math.abs(x - endX) <= 14) {
          this.scrubDragMode = 'loop-end';
          this.scrubberContainer.setPointerCapture(e.pointerId);
          return;
        }
      }

      this.scrubDragMode = 'seek';
      this.scrubberContainer.setPointerCapture(e.pointerId);
      this.audioEngine.seek(frac * dur);
      this.updateScrubberUI();
    });

    this.scrubberContainer.addEventListener('pointermove', (e) => {
      this.scrubberHovered = true;
      if (!this.scrubDragMode) return;

      const frac = getScrubFraction(e.clientX);
      const timeSec = frac * this.audioEngine.duration;

      if (this.scrubDragMode === 'seek') {
        this.audioEngine.seek(timeSec);
      } else if (this.scrubDragMode === 'loop-start') {
        this.audioEngine.setLoopRange(
          Math.min(timeSec, this.audioEngine.loop.end - 5),
          this.audioEngine.loop.end
        );
      } else if (this.scrubDragMode === 'loop-end') {
        this.audioEngine.setLoopRange(
          this.audioEngine.loop.start,
          Math.max(timeSec, this.audioEngine.loop.start + 5)
        );
      }
      this.updateScrubberUI();
    });

    const endScrub = () => {
      this.scrubDragMode = null;
    };
    this.scrubberContainer.addEventListener('pointerup', endScrub);
    this.scrubberContainer.addEventListener('pointercancel', endScrub);
    this.scrubberContainer.addEventListener('pointerleave', () => {
      this.scrubberHovered = false;
    });

    // Keyboard navigation on timeline scrubber
    this.scrubberContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.audioEngine.seek(this.audioEngine.currentTime + 4);
        this.updateScrubberUI();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.audioEngine.seek(this.audioEngine.currentTime - 4);
        this.updateScrubberUI();
      }
    });

    // 3. Loop Toggle ("Loop a moment")
    this.loopBtn.addEventListener('click', () => {
      const active = this.audioEngine.toggleLoop();
      this.loopBtn.classList.toggle('active', active);
      this.loopBtn.setAttribute('aria-pressed', String(active));
      this.canvasHint.textContent = active
        ? 'Loop active · Drag orange handles on timeline to shape passage'
        : 'Drag to compose · Tap to mark';
    });

    // 4. Canvas Direct Manipulation ("Drag to compose · Tap to mark")
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.canvas.setPointerCapture(e.pointerId);
      const hit = this.kineticPoster.onPointerDown(x, y);
      if (hit === 'pin') {
        this.canvasHint.textContent = 'Shaping phrase arch · Release to commit';
      } else if (hit === 'quiet' || hit === 'current') {
        this.canvasHint.textContent = `Arranging “${hit.toUpperCase()}” calligraphy · Release to commit`;
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const status = this.kineticPoster.onPointerMove(x, y);
      if (!status.dragging) {
        this.canvas.style.cursor = status.hover ? 'grab' : 'crosshair';
      } else {
        this.canvas.style.cursor = 'grabbing';
      }
    });

    const finishCanvasPointer = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const curFmt = this.audioEngine.formatTime(this.audioEngine.currentTime);
      const result = this.kineticPoster.onPointerUp(x, y, curFmt);
      this.syncUndoResetButtons();
      if (result.action === 'mark') {
        this.canvasHint.textContent = `Marked watercolor bloom at ${curFmt} · Undo available`;
      } else if (result.action === 'drag') {
        this.canvasHint.textContent = 'Phrase composition updated · Drag to compose · Tap to mark';
      }
    };

    this.canvas.addEventListener('pointerup', finishCanvasPointer);
    this.canvas.addEventListener('pointercancel', () => {
      this.kineticPoster.activeDrag = null;
    });

    // Keyboard accessibility on canvas (Arrow keys nudge selected phrase handle)
    this.canvas.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 0.025 : 0.01;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.kineticPoster.nudgeSelected(0, -step);
        this.syncUndoResetButtons();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.kineticPoster.nudgeSelected(0, step);
        this.syncUndoResetButtons();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.kineticPoster.nudgeSelected(-step, 0);
        this.syncUndoResetButtons();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.kineticPoster.nudgeSelected(step, 0);
        this.syncUndoResetButtons();
      }
    });

    // 5. Undo & Reset Actions
    this.btnUndo.addEventListener('click', () => {
      if (this.kineticPoster.undo()) {
        this.syncUndoResetButtons();
        this.canvasHint.textContent = 'Undid last composition change';
      }
    });

    this.btnReset.addEventListener('click', () => {
      if (this.kineticPoster.resetComposition()) {
        this.syncUndoResetButtons();
        this.canvasHint.textContent = 'Drag to compose · Tap to mark';
      }
    });

    // 6. Painted Treatment Switcher
    this.btnTreatment.addEventListener('click', () => {
      const t = this.kineticPoster.cycleTreatment();
      this.btnTreatment.textContent = `Treatment: ${t.label}`;
      this.canvasHint.textContent = `Painted treatment: ${t.label}`;
    });

    // 7. Pause Visuals (Reduced Motion / Freeze Artwork while Audio Continues)
    this.btnPauseVisuals.addEventListener('click', () => {
      this.isVisualsPaused = !this.isVisualsPaused;
      this.btnPauseVisuals.setAttribute('aria-pressed', String(this.isVisualsPaused));
      this.btnPauseVisuals.textContent = this.isVisualsPaused ? 'Resume visuals' : 'Pause visuals';
    });

    // 8. Open Track & Title Customization Modal
    const openModal = document.getElementById('modal-open');
    const errorBanner = document.getElementById('audio-error-msg');
    const titleInput = document.getElementById('poster-title-input');

    const showOpenModal = () => {
      errorBanner.hidden = true;
      titleInput.value = this.kineticPoster.titleText;
      openModal.classList.add('open');
    };

    document.getElementById('btn-open-track').addEventListener('click', showOpenModal);
    document.getElementById('track-meta-box').addEventListener('click', showOpenModal);

    const fileInput = document.getElementById('file-audio-input');
    fileInput.addEventListener('change', async (e) => {
      if (e.target.files.length > 0) {
        await this.handleAudioFileLoad(e.target.files[0]);
      }
    });

    document.getElementById('btn-apply-title').addEventListener('click', () => {
      const val = titleInput.value.trim() || 'Quiet Current';
      this.kineticPoster.setPosterTitle(val);
      this.trackTitleText.textContent = val;
      openModal.classList.remove('open');
    });

    document.getElementById('btn-restore-demo').addEventListener('click', () => {
      this.audioEngine.restoreDemoTrack();
      this.kineticPoster.setPosterTitle('Quiet Current');
      this.trackTitleText.textContent = 'Quiet Current';
      this.trackSubtitleText.textContent = 'Demo track';
      this.bpmBadge.textContent = `${this.audioEngine.bpm} BPM`;
      this.updateScrubberUI();
      openModal.classList.remove('open');
    });

    // Drag & Drop audio file onto window
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', async (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await this.handleAudioFileLoad(e.dataTransfer.files[0]);
      }
    });

    // 9. Tempo Estimate Adjustment Modal
    const tempoModal = document.getElementById('modal-tempo');
    const tempoInput = document.getElementById('tempo-input');
    this.bpmBadge.addEventListener('click', () => {
      tempoInput.value = this.audioEngine.bpm;
      tempoModal.classList.add('open');
    });

    document.getElementById('btn-save-tempo').addEventListener('click', () => {
      const updated = this.audioEngine.setBpm(tempoInput.value);
      this.bpmBadge.textContent = `${updated} BPM`;
      tempoModal.classList.remove('open');
    });

    // 10. Save Frame Still Export
    document.getElementById('btn-save-frame').addEventListener('click', () => {
      this.saveStillFrame();
    });

    // Close modals via close buttons or Escape
    document.querySelectorAll('.btn-close, .modal-cancel').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('open'));
      });
    });

    // Global keyboard shortcuts (Space = Play/Pause, Cmd/Ctrl+Z = Undo, Escape = Close modal)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('open'));
        return;
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.btnPlay.click();
      } else if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        this.loopBtn.click();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (this.kineticPoster.undo()) {
          this.syncUndoResetButtons();
          this.canvasHint.textContent = 'Undid last composition change';
        }
      }
    });
  }

  async handleAudioFileLoad(file) {
    const errorBanner = document.getElementById('audio-error-msg');
    const openModal = document.getElementById('modal-open');
    try {
      errorBanner.hidden = true;
      const info = await this.audioEngine.loadCustomAudio(file);
      this.trackTitleText.textContent = info.title;
      this.trackSubtitleText.textContent = 'Local audio file';
      this.kineticPoster.setPosterTitle(info.title);
      document.getElementById('poster-title-input').value = info.title;
      openModal.classList.remove('open');
      this.audioEngine.play();
      this.updatePlayState(true);
      this.updateScrubberUI();
    } catch (err) {
      // Recoverable error: preserve previous good session & artwork (INTERACTION-STATES.md)
      errorBanner.textContent = 'Could not decode that audio file. Please choose an MP3, WAV, OGG, M4A, or FLAC file.';
      errorBanner.hidden = false;
    }
  }

  syncUndoResetButtons() {
    const hasEdits = this.kineticPoster.hasEdits();
    this.btnUndo.hidden = !this.kineticPoster.canUndo();
    this.btnReset.hidden = !hasEdits;
  }

  updatePlayState(isPlaying) {
    this.playIcon.style.display = isPlaying ? 'none' : 'block';
    this.pauseIcon.style.display = isPlaying ? 'block' : 'none';
    this.btnPlay.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
  }

  updateScrubberUI() {
    const cur = this.audioEngine.currentTime;
    const dur = this.audioEngine.duration;
    const curFmt = this.audioEngine.formatTime(cur);
    const durFmt = this.audioEngine.formatTime(dur);

    this.timeDisplay.textContent = `${curFmt} / ${durFmt}`;
    this.scrubberContainer.setAttribute('aria-valuemax', String(Math.round(dur)));
    this.scrubberContainer.setAttribute('aria-valuenow', String(Math.round(cur)));
    this.scrubberContainer.setAttribute('aria-valuetext', `${curFmt} of ${durFmt}`);
  }

  /**
   * Renders the fine vertical-bar Waveform Scrubber with:
   * - Dotted horizontal leader tails on left and right
   * - Played vs unplayed vertical bar contrast
   * - Current playhead vertical black bar + solid center dot (at 01:24 / 43.75% by default)
   * - Dual terracotta-orange "Loop a moment" handles connected by a sweeping black Bezier arc
   */
  renderWaveformScrubber(audioFeatures) {
    const ctx = this.waveformCtx;
    const rect = this.waveformCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    ctx.clearRect(0, 0, w, h);

    const midY = h * 0.5;
    const cur = this.audioEngine.currentTime;
    const dur = Math.max(1, this.audioEngine.duration);
    const progress = Math.max(0, Math.min(1, cur / dur));

    const profile = this.audioEngine.getWaveformProfile();
    const totalBars = profile.length;
    const padX = 6;
    const usableW = Math.max(10, w - padX * 2);
    const stepX = usableW / totalBars;
    const playheadX = padX + progress * usableW;

    // 1. Optional "Loop a moment" warm wash & connecting arc (matching shared-controls-v2.png)
    if (this.audioEngine.loop.enabled) {
      const startFrac = Math.max(0, Math.min(1, this.audioEngine.loop.start / dur));
      const endFrac = Math.max(0, Math.min(1, this.audioEngine.loop.end / dur));
      const lx0 = padX + startFrac * usableW;
      const lx1 = padX + endFrac * usableW;

      // Soft warm terracotta/ochre loop highlight
      const loopGrad = ctx.createLinearGradient(lx0, 0, lx1, 0);
      loopGrad.addColorStop(0, 'rgba(232, 91, 38, 0.14)');
      loopGrad.addColorStop(0.5, 'rgba(219, 155, 59, 0.18)');
      loopGrad.addColorStop(1, 'rgba(232, 91, 38, 0.14)');
      ctx.fillStyle = loopGrad;
      ctx.fillRect(lx0, midY - h * 0.34, Math.max(2, lx1 - lx0), h * 0.68);
    }

    // 2. Fine vertical waveform bars + dotted tails
    const maxBarH = h * 0.58;
    const liveEnergy = (this.audioEngine.isPlaying && !this.isVisualsPaused && audioFeatures)
      ? audioFeatures.masterEnergy
      : 0;

    for (let i = 0; i < totalBars; i++) {
      const u = i / (totalBars - 1);
      const bx = padX + i * stepX;

      // Dotted horizontal leader tails at start & end (matching kinetic-poster-desktop-v2.png)
      if (u < 0.065 || u > 0.935) {
        ctx.beginPath();
        ctx.arc(bx, midY, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = bx <= playheadX ? 'rgba(23, 24, 26, 0.72)' : 'rgba(23, 24, 26, 0.35)';
        ctx.fill();
        continue;
      }

      let amp = profile[i];
      if (liveEnergy > 0.01) {
        const distToPlayhead = Math.abs(u - progress);
        if (distToPlayhead < 0.08) {
          amp = Math.min(1.0, amp * (1 + liveEnergy * 0.45));
        }
      }

      const barH = Math.max(2.5, amp * maxBarH);
      const isPlayed = bx <= playheadX;

      ctx.fillStyle = isPlayed ? 'rgba(23, 24, 26, 0.88)' : 'rgba(23, 24, 26, 0.36)';
      ctx.fillRect(bx - 0.65, midY - barH * 0.5, 1.3, barH);
    }

    // 3. Dual Terracotta-Orange Loop Handles + Sweeping Black Arc ("Loop a moment" in shared-controls-v2.png)
    if (this.audioEngine.loop.enabled) {
      const startFrac = Math.max(0, Math.min(1, this.audioEngine.loop.start / dur));
      const endFrac = Math.max(0, Math.min(1, this.audioEngine.loop.end / dur));
      const lx0 = padX + startFrac * usableW;
      const lx1 = padX + endFrac * usableW;

      // Vertical thin stems at loop boundaries
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.78)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(lx0, midY - h * 0.44);
      ctx.lineTo(lx0, midY + h * 0.44);
      ctx.moveTo(lx1, midY - h * 0.44);
      ctx.lineTo(lx1, midY + h * 0.44);
      ctx.stroke();

      // Sweeping black arc connecting the two loop handles
      ctx.beginPath();
      ctx.moveTo(lx0, midY - 4);
      ctx.quadraticCurveTo((lx0 + lx1) * 0.5, midY - h * 0.54, lx1, midY - 4);
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.85)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Two terracotta-orange circular handles with cream inner ring
      for (const hx of [lx0, lx1]) {
        ctx.beginPath();
        ctx.arc(hx, midY, 6.2, 0, Math.PI * 2);
        ctx.fillStyle = '#F6F1E7';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(hx, midY, 4.4, 0, Math.PI * 2);
        ctx.fillStyle = '#E85B26';
        ctx.fill();
      }
    }

    // 4. Current Playhead Vertical Black Line + Center Solid Circle (matching kinetic-poster-desktop-v2.png)
    const stemHalf = Math.min(20, h * 0.44);
    ctx.beginPath();
    ctx.moveTo(playheadX, midY - stemHalf);
    ctx.lineTo(playheadX, midY + stemHalf);
    ctx.strokeStyle = '#17181A';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(playheadX, midY, 3.8, 0, Math.PI * 2);
    ctx.fillStyle = '#17181A';
    ctx.fill();
  }

  /**
   * Exports clean high-resolution PNG of the artwork canvas and shows the
   * "Frame saved" confirmation card matching assets/shared-controls-v2.png.
   */
  saveStillFrame() {
    const curFmt = this.audioEngine.formatTime(this.audioEngine.currentTime);
    const features = this.audioEngine.getAudioFeatures();
    const dataUrl = this.kineticPoster.exportStillPNG(
      this.paperGen,
      features,
      this.audioEngine.currentTime,
      this.audioEngine.duration,
      curFmt
    );

    // Trigger file download
    const link = document.createElement('a');
    const safeTime = curFmt.replace(':', '-');
    link.download = `track-atlas-kinetic-poster-${safeTime}.png`;
    link.href = dataUrl;
    link.click();

    // Update & show "Frame saved" confirmation badge with live artwork preview
    const toast = document.getElementById('toast');
    const thumb = document.getElementById('toast-thumb');
    const meta = document.getElementById('toast-meta');

    if (thumb) thumb.src = dataUrl;
    if (meta) meta.textContent = `02 / Kinetic Poster · ${curFmt}`;

    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('show');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3400);
  }

  startAnimationLoop() {
    const renderFrame = (nowMs) => {
      // 1. Advance audio clock smoothly at 60fps
      this.audioEngine.updateClock(nowMs);
      const features = this.audioEngine.getAudioFeatures();

      // 2. Draw cold-press watercolor paper background
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.paperGen.draw(this.ctx, rect.width, rect.height);

      // 3. Render 02 / Kinetic Poster composition
      const curTime = this.audioEngine.currentTime;
      const dur = this.audioEngine.duration;
      const curFmt = this.audioEngine.formatTime(curTime);

      this.kineticPoster.render(features, curTime, dur, this.isVisualsPaused, curFmt);

      // 4. Update transport readout & waveform scrubber
      this.updateScrubberUI();
      this.renderWaveformScrubber(features);

      requestAnimationFrame(renderFrame);
    };

    requestAnimationFrame(renderFrame);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new TrackAtlasApp();
});
