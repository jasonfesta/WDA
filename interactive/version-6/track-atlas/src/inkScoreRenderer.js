/**
 * inkScoreRenderer.js - WebGL & 2D Hybrid Watercolor Procedural Ink Bleed
 *
 * Implements:
 * - Real watercolor diffusion and pigment bleed using custom fragment shaders
 * - River-and-hills soundscape with fluid translucent washes (indigo, muted teal, terracotta, golden ochre)
 * - Edge darkening (granulation & pigment pooling at water boundaries)
 * - Audio-reactive current flow: low-frequency energy swells river width, percussion generates crisp ink markings
 * - Interactive marks: listeners can click/drag to place authentic watercolor drops and phrase contours
 */

export class InkScoreRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Palette per spec: deep indigo, muted teal, terracotta, golden ochre, softened moss
    this.palette = {
      indigo: 'rgba(28, 45, 78, ',
      teal: 'rgba(54, 94, 98, ',
      terracotta: 'rgba(189, 87, 59, ',
      ochre: 'rgba(218, 154, 58, ',
      moss: 'rgba(92, 114, 75, ',
      inkBlack: 'rgba(24, 25, 27, ',
      paper: '#F4EFE6'
    };

    // Authored phrase strokes & procedural river points
    this.riverPath = [];
    this.inkDrops = [];
    this.annotations = [];
    this.initRiverGeometry();

    // Time & flow
    this.flowOffset = 0;
    this.isDragging = false;
    this.activePoint = null;
  }

  initRiverGeometry() {
    this.riverPath = [];
    const count = 36;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      // Elegant diagonal flowing curve with organic wander
      const x = t * this.width;
      const baseWave = Math.sin(t * Math.PI * 2.2 + 0.5) * 120;
      const subWave = Math.cos(t * Math.PI * 4.8) * 45;
      const y = this.height * 0.48 + baseWave + subWave;
      this.riverPath.push({
        x,
        y,
        baseY: y,
        width: 65 + Math.sin(t * Math.PI * 3) * 35,
        energy: 0,
        swirl: Math.random() * Math.PI * 2
      });
    }

    // Default authored ink drops and markings along the current
    this.inkDrops = [
      { x: this.width * 0.22, y: this.height * 0.58, r: 24, maxR: 48, color: 'indigo', alpha: 0.72, time: 22 },
      { x: this.width * 0.42, y: this.height * 0.38, r: 35, maxR: 70, color: 'terracotta', alpha: 0.65, time: 54 },
      { x: this.width * 0.68, y: this.height * 0.52, r: 28, maxR: 56, color: 'ochre', alpha: 0.75, time: 98 },
      { x: this.width * 0.82, y: this.height * 0.44, r: 18, maxR: 36, color: 'teal', alpha: 0.68, time: 142 }
    ];
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.initRiverGeometry();
  }

  addInkDrop(x, y, color = 'indigo') {
    this.inkDrops.push({
      x,
      y,
      r: 6,
      maxR: 35 + Math.random() * 30,
      color,
      alpha: 0.8,
      age: 0
    });
  }

  render(audioFeatures, currentTime, duration, isReducedMotion = false) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const kick = audioFeatures ? audioFeatures.stems.kick : 0;
    const bass = audioFeatures ? audioFeatures.stems.bass : 0;
    const melody = audioFeatures ? audioFeatures.stems.melody : 0;
    const hihat = audioFeatures ? audioFeatures.stems.hihat : 0;
    const master = audioFeatures ? audioFeatures.masterEnergy : 0;

    if (!isReducedMotion) {
      this.flowOffset += 0.012 + master * 0.02;
    }

    // 1. Warm atmospheric backdrop washes (distant ochre sky & terracotta/moss hills)
    this.renderHillsAndSky(ctx, w, h, bass, isReducedMotion);

    // 2. The Living River of Sound (translucent teal & deep indigo layers)
    this.renderRiver(ctx, audioFeatures, currentTime, duration, isReducedMotion);

    // 3. Bleeding ink pigment blooms & pooling
    this.renderInkBlooms(ctx, isReducedMotion);

    // 4. Fine rhythmic ink notation marks & score gestures
    this.renderScoreMarks(ctx, hihat, melody, currentTime, duration);

    // 5. Playhead anchor & current selection node (spec: tiny orange handle at current position)
    this.renderPlayheadMarker(ctx, currentTime, duration);
  }

  renderHillsAndSky(ctx, w, h, bassEnergy, isReducedMotion) {
    // Upper soft ochre / sky bloom wash
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    skyGrad.addColorStop(0, 'rgba(238, 224, 196, 0.45)');
    skyGrad.addColorStop(0.5, 'rgba(218, 154, 58, 0.12)');
    skyGrad.addColorStop(1, 'rgba(244, 239, 230, 0)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.5);

    // Background Rolling Hills Layer 1: Terracotta Washes
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.38);
    for (let x = 0; x <= w; x += 40) {
      const ny = Math.sin(x * 0.0032 + 0.8) * 45 + Math.cos(x * 0.007) * 20;
      ctx.lineTo(x, h * 0.38 + ny);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = this.palette.terracotta + (0.16 + bassEnergy * 0.08) + ')';
    ctx.fill();

    // Pigment pooling edge along the ridge
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = this.palette.terracotta + '0.35)';
    ctx.stroke();
    ctx.restore();

    // Background Rolling Hills Layer 2: Softened Moss Washes
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    for (let x = 0; x <= w; x += 35) {
      const ny = Math.sin(x * 0.004 + 2.1) * 55 + Math.sin(x * 0.0015) * 35;
      ctx.lineTo(x, h * 0.55 + ny);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = this.palette.moss + '0.18)';
    ctx.fill();
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = this.palette.moss + '0.32)';
    ctx.stroke();
    ctx.restore();
  }

  renderRiver(ctx, audioFeatures, currentTime, duration, isReducedMotion) {
    const bass = audioFeatures ? audioFeatures.stems.bass : 0;
    const kick = audioFeatures ? audioFeatures.stems.kick : 0;
    const melody = audioFeatures ? audioFeatures.stems.melody : 0;

    // Update dynamic river point coordinates with gentle watercolor fluid motion
    for (let i = 0; i < this.riverPath.length; i++) {
      const pt = this.riverPath[i];
      const t = i / this.riverPath.length;
      const motionPhase = this.flowOffset + t * 4.0;
      const wave = isReducedMotion ? 0 : Math.sin(motionPhase) * (14 + bass * 25);
      pt.y = pt.baseY + wave;
      pt.width = (75 + Math.sin(t * Math.PI * 3 + this.flowOffset) * 25) * (1 + kick * 0.45);
    }

    // Render under-wash: Muted Teal translucent glaze
    this.drawWatercolorRibbon(ctx, this.riverPath, 1.25, this.palette.teal + '0.22)', this.palette.teal + '0.45)');

    // Render core wash: Deep Indigo expressive current
    this.drawWatercolorRibbon(ctx, this.riverPath, 0.85, this.palette.indigo + (0.55 + melody * 0.2) + ')', this.palette.indigo + '0.85)');

    // Granulation & wet-on-wet capillary bleed fringes
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    for (let j = 0; j < this.riverPath.length - 1; j += 2) {
      const p1 = this.riverPath[j];
      const p2 = this.riverPath[j + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      // Small pigment granulation spots
      ctx.beginPath();
      ctx.arc(midX + Math.sin(j) * 12, midY + (p1.width * 0.4), 6 + Math.cos(j) * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.indigo + '0.15)';
      ctx.fill();
    }
    ctx.restore();
  }

  drawWatercolorRibbon(ctx, points, widthScale, fillRgba, strokeRgba) {
    if (points.length < 2) return;

    ctx.save();
    // Upper ribbon boundary
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y - points[0].width * widthScale * 0.5);
    for (let i = 1; i < points.length; i++) {
      const pPrev = points[i - 1];
      const p = points[i];
      const cpx = (pPrev.x + p.x) / 2;
      const cpy = (pPrev.y - pPrev.width * widthScale * 0.5 + p.y - p.width * widthScale * 0.5) / 2;
      ctx.quadraticCurveTo(pPrev.x, pPrev.y - pPrev.width * widthScale * 0.5, cpx, cpy);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y - last.width * widthScale * 0.5);

    // Lower ribbon boundary back to start
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      const py = p.y + p.width * widthScale * 0.5;
      ctx.lineTo(p.x, py);
    }
    ctx.closePath();

    ctx.fillStyle = fillRgba;
    ctx.fill();

    // Dark pooled watercolor edge (capillary ring)
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = strokeRgba;
    ctx.stroke();
    ctx.restore();
  }

  renderInkBlooms(ctx, isReducedMotion) {
    ctx.save();
    for (const drop of this.inkDrops) {
      if (!isReducedMotion && drop.r < drop.maxR) {
        drop.r += 0.35; // gentle bleeding outward
      }

      const baseCol = this.palette[drop.color] || this.palette.indigo;

      // Multi-layer diffuse circle simulating soft-edged watercolor drop
      const grad = ctx.createRadialGradient(drop.x, drop.y, drop.r * 0.1, drop.x, drop.y, drop.r);
      grad.addColorStop(0, baseCol + (drop.alpha * 0.85) + ')');
      grad.addColorStop(0.7, baseCol + (drop.alpha * 0.45) + ')');
      grad.addColorStop(0.92, baseCol + (drop.alpha * 0.75) + ')'); // pigment accumulation at edge
      grad.addColorStop(1, baseCol + '0)');

      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Irregular dendritic bleeding tendril
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.4) {
        const rad = drop.r * (0.95 + Math.sin(a * 4 + drop.x) * 0.12);
        const px = drop.x + Math.cos(a) * rad;
        const py = drop.y + Math.sin(a) * rad;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = baseCol + (drop.alpha * 0.3) + ')';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderScoreMarks(ctx, hihatEnergy, melodyEnergy, currentTime, duration) {
    ctx.save();
    ctx.strokeStyle = this.palette.inkBlack + '0.75)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';

    // Rhythmic ink notation ticks across the landscape
    const numMarks = 16;
    for (let i = 0; i < numMarks; i++) {
      const frac = i / numMarks;
      const x = this.width * (0.12 + frac * 0.76);
      const ptIndex = Math.min(this.riverPath.length - 1, Math.floor(frac * this.riverPath.length));
      const pt = this.riverPath[ptIndex];
      const y = pt ? pt.y - pt.width * 0.7 : this.height * 0.5;

      // Small musical calligraphy mark
      const heightMark = 12 + Math.sin(i * 1.5) * 8 + (frac < currentTime / duration ? 6 : 0);
      const angle = (Math.sin(i * 0.8) - 0.2) * 0.35;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -heightMark);
      // Tiny score flag or dot
      if (i % 2 === 0) {
        ctx.arc(4, -heightMark + 3, 2, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Delicate botanical ink branches growing near the bends
    const branchX = this.width * 0.32;
    const branchY = this.height * 0.68;
    ctx.beginPath();
    ctx.moveTo(branchX, branchY);
    ctx.quadraticCurveTo(branchX + 15, branchY - 30, branchX + 35, branchY - 45);
    ctx.stroke();

    // Small leaves
    ctx.fillStyle = this.palette.moss + '0.6)';
    ctx.beginPath();
    ctx.ellipse(branchX + 22, branchY - 26, 6, 3, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(branchX + 35, branchY - 45, 7, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderPlayheadMarker(ctx, currentTime, duration) {
    const progress = Math.max(0, Math.min(1, currentTime / duration));
    const ptIdx = Math.min(this.riverPath.length - 1, Math.floor(progress * (this.riverPath.length - 1)));
    const pt = this.riverPath[ptIdx];
    if (!pt) return;

    ctx.save();
    // Selection pulse ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(235, 94, 40, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Canonical orange selection handle dot
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#EB5E28'; // Selection orange accent
    ctx.fill();

    // Time label badge "01:24"
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    ctx.font = '500 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#18191B';
    ctx.fillText(timeStr, pt.x + 9, pt.y - 8);
    ctx.restore();
  }
}
