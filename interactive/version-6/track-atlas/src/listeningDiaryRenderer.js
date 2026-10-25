/**
 * listeningDiaryRenderer.js - Human Watercolor Listening Journal
 *
 * Implements:
 * - Three distinct painted memory vignettes across warm paper:
 *   1. "pulse" (00:00) - Indigo pool with softly expanding watercolor ripples & tiny rhythmic ink marks
 *   2. "lift" (00:48) - Terracotta/ochre flowering stems & sweeping teal leaves rising in musical gesture
 *   3. "space" (01:24) - Pale blue horizon with moss islands & floating ochre pigment shapes in open sky
 * - Subtle hand-drawn connecting path & sparse note marks
 * - Interactive notes: users can click any vignette to seek or edit handwritten diary notes
 * - Canonical tiny orange selection dot at the 3rd vignette (01:24)
 */

export class ListeningDiaryRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.palette = {
      indigo: 'rgba(28, 45, 78, ',
      terracotta: 'rgba(189, 87, 59, ',
      ochre: 'rgba(218, 154, 58, ',
      teal: 'rgba(54, 94, 98, ',
      moss: 'rgba(92, 114, 75, ',
      paleBlue: 'rgba(132, 168, 185, ',
      inkBlack: 'rgba(24, 25, 27, ',
      orangeAccent: '#EB5E28'
    };

    this.vignettes = [
      {
        id: 'pulse',
        title: 'pulse',
        timeSec: 0,
        timeLabel: '00:00',
        note: 'Sub-bass warmth emerging beneath quiet water',
        xFrac: 0.22,
        yFrac: 0.52,
        radius: 65,
        ripples: [0.2, 0.5, 0.8]
      },
      {
        id: 'lift',
        title: 'lift',
        timeSec: 48,
        timeLabel: '00:48',
        note: 'Chord progression swells; terracotta stems unfurl',
        xFrac: 0.50,
        yFrac: 0.44,
        radius: 75,
        growth: 1.0
      },
      {
        id: 'space',
        title: 'space',
        timeSec: 84,
        timeLabel: '01:24',
        note: 'Floating ochre islands, wide atmospheric breathing room',
        xFrac: 0.78,
        yFrac: 0.50,
        radius: 70,
        floatOffset: 0
      }
    ];

    this.selectedVignetteIndex = 2; // Default selected: "space" at 01:24
    this.animTime = 0;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  selectVignetteAt(x, y) {
    for (let i = 0; i < this.vignettes.length; i++) {
      const v = this.vignettes[i];
      const vx = this.width * v.xFrac;
      const vy = this.height * v.yFrac;
      const dist = Math.hypot(x - vx, y - vy);
      if (dist <= v.radius + 25) {
        this.selectedVignetteIndex = i;
        return v;
      }
    }
    return null;
  }

  render(audioFeatures, currentTime, duration, isReducedMotion = false) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    const kick = audioFeatures ? audioFeatures.stems.kick : 0;
    const melody = audioFeatures ? audioFeatures.stems.melody : 0;
    const chords = audioFeatures ? audioFeatures.stems.chords : 0;
    const master = audioFeatures ? audioFeatures.masterEnergy : 0;

    if (!isReducedMotion) {
      this.animTime += 0.015 + master * 0.02;
    }

    // 1. Hand-drawn connecting trail between memory vignettes
    this.renderConnectingPath(ctx, w, h);

    // 2. Render Vignette 1: "pulse" (Indigo pool & ripples)
    this.renderPulseVignette(ctx, w, h, kick, isReducedMotion);

    // 3. Render Vignette 2: "lift" (Terracotta flowers & sweeping teal leaves)
    this.renderLiftVignette(ctx, w, h, chords, melody, isReducedMotion);

    // 4. Render Vignette 3: "space" (Pale horizon & floating moss islands)
    this.renderSpaceVignette(ctx, w, h, melody, isReducedMotion);

    // 5. Active selection highlight & editable diary cards
    this.renderActiveSelection(ctx, w, h);
  }

  renderConnectingPath(ctx, w, h) {
    const p1 = { x: w * this.vignettes[0].xFrac, y: h * this.vignettes[0].yFrac };
    const p2 = { x: w * this.vignettes[1].xFrac, y: h * this.vignettes[1].yFrac };
    const p3 = { x: w * this.vignettes[2].xFrac, y: h * this.vignettes[2].yFrac };

    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(28, 45, 78, 0.22)';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p1.x + (p2.x - p1.x) * 0.5, p1.y - 45, p2.x - (p2.x - p1.x) * 0.3, p2.y + 40, p2.x, p2.y);
    ctx.bezierCurveTo(p2.x + (p3.x - p2.x) * 0.4, p2.y - 35, p3.x - (p3.x - p2.x) * 0.3, p3.y + 55, p3.x, p3.y);
    ctx.stroke();

    // Small ink marks along the journey
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(28, 45, 78, 0.35)';
    ctx.beginPath();
    ctx.arc((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5 - 10, 2.5, 0, Math.PI * 2);
    ctx.arc((p2.x + p3.x) * 0.5, (p2.y + p3.y) * 0.5 + 15, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderPulseVignette(ctx, w, h, kick, isReducedMotion) {
    const v = this.vignettes[0];
    const cx = w * v.xFrac;
    const cy = h * v.yFrac;

    ctx.save();
    // Indigo pool base watercolor wash
    const poolGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, v.radius + (kick * 14));
    poolGrad.addColorStop(0, this.palette.indigo + '0.78)');
    poolGrad.addColorStop(0.65, this.palette.teal + '0.42)');
    poolGrad.addColorStop(0.9, this.palette.indigo + '0.65)'); // pigment edge
    poolGrad.addColorStop(1, this.palette.indigo + '0)');

    ctx.beginPath();
    ctx.ellipse(cx, cy, v.radius, v.radius * 0.75, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = poolGrad;
    ctx.fill();

    // Expanding soft ripples
    for (let i = 0; i < v.ripples.length; i++) {
      if (!isReducedMotion) {
        v.ripples[i] = (v.ripples[i] + 0.006) % 1.0;
      }
      const r = v.radius * (0.3 + v.ripples[i] * 0.85);
      const alpha = (1 - v.ripples[i]) * 0.55;

      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.65, 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = this.palette.indigo + alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Hand-drawn vignette labels
    this.drawVignetteHeader(ctx, cx, cy + v.radius * 0.95, v.title, v.timeLabel);
    ctx.restore();
  }

  renderLiftVignette(ctx, w, h, chords, melody, isReducedMotion) {
    const v = this.vignettes[1];
    const cx = w * v.xFrac;
    const cy = h * v.yFrac;

    ctx.save();
    // Terracotta & ochre bloom
    const bloomGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, v.radius * 0.9);
    bloomGrad.addColorStop(0, this.palette.terracotta + (0.55 + chords * 0.2) + ')');
    bloomGrad.addColorStop(0.5, this.palette.ochre + '0.35)');
    bloomGrad.addColorStop(1, this.palette.terracotta + '0)');

    ctx.beginPath();
    ctx.ellipse(cx, cy, v.radius * 0.85, v.radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = bloomGrad;
    ctx.fill();

    // Rising botanical stems & teal leaves
    const sway = isReducedMotion ? 0 : Math.sin(this.animTime * 1.5) * 6;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + 35);
    ctx.quadraticCurveTo(cx - 5 + sway, cy - 10, cx + 18 + sway, cy - 45);
    ctx.strokeStyle = this.palette.moss + '0.85)';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Flowering ochre petal marks
    const petalCount = 5;
    for (let p = 0; p < petalCount; p++) {
      const angle = (p / petalCount) * Math.PI * 2 + sway * 0.05;
      const px = cx + 18 + sway + Math.cos(angle) * (14 + melody * 8);
      const py = cy - 45 + Math.sin(angle) * (14 + melody * 8);

      ctx.beginPath();
      ctx.ellipse(px, py, 7, 4, angle, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.ochre + '0.85)';
      ctx.fill();
    }

    // Sweeping teal leaves
    ctx.beginPath();
    ctx.ellipse(cx - 16, cy + 5, 18, 7, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.teal + '0.72)';
    ctx.fill();

    this.drawVignetteHeader(ctx, cx, cy + v.radius * 0.95, v.title, v.timeLabel);
    ctx.restore();
  }

  renderSpaceVignette(ctx, w, h, melody, isReducedMotion) {
    const v = this.vignettes[2];
    const cx = w * v.xFrac;
    const cy = h * v.yFrac;

    ctx.save();
    // Pale blue open horizon wash
    const horizGrad = ctx.createLinearGradient(cx - v.radius, cy - 25, cx + v.radius, cy + 25);
    horizGrad.addColorStop(0, this.palette.paleBlue + '0.55)');
    horizGrad.addColorStop(0.5, this.palette.teal + '0.25)');
    horizGrad.addColorStop(1, this.palette.ochre + '0.35)');

    ctx.beginPath();
    ctx.ellipse(cx, cy, v.radius * 1.1, v.radius * 0.65, -0.1, 0, Math.PI * 2);
    ctx.fillStyle = horizGrad;
    ctx.fill();

    // Floating moss island shapes
    const float = isReducedMotion ? 0 : Math.sin(this.animTime + 1.2) * 4;
    ctx.beginPath();
    ctx.ellipse(cx - 24, cy - 8 + float, 20, 8, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.moss + '0.75)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + 26, cy + 12 - float, 16, 6, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.moss + '0.65)';
    ctx.fill();

    // Floating ochre pigment flecks in open sky
    for (let f = 0; f < 4; f++) {
      const fx = cx - 18 + f * 14;
      const fy = cy - 32 + Math.sin(f + this.animTime) * 5;
      ctx.beginPath();
      ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.ochre + '0.85)';
      ctx.fill();
    }

    this.drawVignetteHeader(ctx, cx, cy + v.radius * 0.95, v.title, v.timeLabel);
    ctx.restore();
  }

  drawVignetteHeader(ctx, x, y, title, timeStr) {
    ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#18191B';
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y);

    ctx.font = '500 11px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#6E6B65';
    ctx.fillText(timeStr, x, y + 16);
  }

  renderActiveSelection(ctx, w, h) {
    const v = this.vignettes[this.selectedVignetteIndex];
    if (!v) return;

    const cx = w * v.xFrac;
    const cy = h * v.yFrac;

    ctx.save();
    // Selection pulse ring
    ctx.beginPath();
    ctx.arc(cx, cy, v.radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(235, 94, 40, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.stroke();

    // Canonical orange selection handle dot
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(cx, cy - v.radius - 8, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.orangeAccent;
    ctx.fill();

    // Handwritten journal note card above the vignette
    const noteCardWidth = 240;
    const noteCardX = Math.max(20, Math.min(w - noteCardWidth - 20, cx - noteCardWidth / 2));
    const noteCardY = cy - v.radius - 65;

    ctx.fillStyle = 'rgba(255, 252, 246, 0.95)';
    ctx.shadowColor = 'rgba(28, 45, 78, 0.08)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(noteCardX, noteCardY, noteCardWidth, 48, 6);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(28, 45, 78, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text in note card
    ctx.textAlign = 'left';
    ctx.font = 'italic 12px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#18191B';
    ctx.fillText(`“${v.note}”`, noteCardX + 12, noteCardY + 22);

    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillStyle = '#EB5E28';
    ctx.fillText(`ENTRY ${v.timeLabel} · CLICK TO EDIT MEMORY`, noteCardX + 12, noteCardY + 38);

    ctx.restore();
  }
}
