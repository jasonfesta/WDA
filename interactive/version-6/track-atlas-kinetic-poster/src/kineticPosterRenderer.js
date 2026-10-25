/**
 * kineticPosterRenderer.js — Track Atlas 02 / Kinetic Poster Watercolor & Calligraphy Engine
 *
 * Combines:
 * 1. High-resolution cleaned watercolor concept art (assets/kinetic-poster-desktop-v2.png
 *    & assets/kinetic-poster-mobile-v2.png) with surgical removal of baked-in static UI
 *    and decomposed into interactive Upper ("QUIET") and Lower ("CURRENT") feathered phrase layers.
 * 2. Live interactive authorship ("Drag to compose · Tap to mark"):
 *    - Draggable "01:24" terracotta pin handle ("Shape a phrase") on the T of QUIET
 *    - Independent draggable word groups ("QUIET" and "CURRENT") with real-time slice-mesh arch warping
 *    - Tap-to-mark wet-in-wet watercolor blooms + botanical sprigs + rhythmic ink score ticks (||||)
 *    - Full Undo / Reset history stack
 * 3. Four selectable painted treatments (Indigo Stream, Terracotta Bloom, Cypress Botanical, Dry-Brush Sumi)
 *    and custom track title hand-painted watercolor brush calligraphy.
 * 4. 60 FPS audio-reactive modulation driven by Kick, Bass, Chords, Melody, and Percussion stems.
 */

export class KineticPosterRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.clientWidth || 1440;
    this.height = canvas.clientHeight || 900;

    // Palette tokens matching VISUAL-DIRECTION.md
    this.palette = {
      indigo: [23, 52, 82],
      cerulean: [46, 108, 152],
      teal: [47, 102, 120],
      terracotta: [198, 89, 53],
      ochre: [219, 155, 59],
      moss: [72, 99, 66],
      ink: [23, 24, 26],
      orangePin: '#E85B26'
    };

    // Painted treatment styles
    this.treatments = [
      { id: 'indigo-stream', label: 'Indigo Stream', tint: null, primary: 'indigo', accent: 'terracotta' },
      { id: 'terracotta-bloom', label: 'Terracotta Bloom', tint: 'rgba(198, 89, 53, 0.08)', primary: 'terracotta', accent: 'ochre' },
      { id: 'cypress-botanical', label: 'Cypress Botanical', tint: 'rgba(72, 99, 66, 0.08)', primary: 'moss', accent: 'teal' },
      { id: 'dry-brush-sumi', label: 'Dry-Brush Sumi', tint: 'rgba(23, 35, 52, 0.09)', primary: 'ink', accent: 'indigo' }
    ];
    this.treatmentIndex = 0;

    // Custom title state (defaults to canonical "Quiet Current")
    this.titleText = 'Quiet Current';
    this.upperWord = 'QUIET';
    this.lowerWord = 'CURRENT';
    this.isCustomTitle = false;

    // Authored composition state (modifiable via Drag to compose & Tap to mark)
    this.state = {
      pinOffset: { dx: 0, dy: 0 },      // "01:24" Shape a phrase handle offset (normalized -0.25..0.25)
      quietOffset: { dx: 0, dy: 0 },    // Upper "QUIET" phrase translation (normalized)
      currentOffset: { dx: 0, dy: 0 },  // Lower "CURRENT" phrase translation (normalized)
      marks: []                         // User-planted watercolor blooms & ink marks
    };

    this.undoStack = [];
    this.hoverTarget = null; // 'pin' | 'quiet' | 'current' | null
    this.activeDrag = null;  // { type, startX, startY, origDx, origDy, moved }
    this.selectedTarget = 'pin';

    // Animation phase & river particles
    this.phase = 0;
    this.riverParticles = this.createRiverParticles(28);

    // Offscreen processed reference artwork buffers
    this.desktopImg = new Image();
    this.mobileImg = new Image();
    this.desktopReady = false;
    this.mobileReady = false;

    this.desktopClean = null;
    this.desktopUpper = null;
    this.desktopLower = null;

    this.mobileClean = null;
    this.mobileUpper = null;
    this.mobileLower = null;

    this.loadReferenceArtwork();
  }

  loadReferenceArtwork() {
    this.desktopImg.onload = () => {
      this.prepareDesktopLayers(this.desktopImg);
      this.desktopReady = true;
    };
    this.desktopImg.src = 'assets/kinetic-poster-desktop-v2.png';

    this.mobileImg.onload = () => {
      this.prepareMobileLayers(this.mobileImg);
      this.mobileReady = true;
    };
    this.mobileImg.src = 'assets/kinetic-poster-mobile-v2.png';
  }

  /**
   * Surgically removes baked-in static UI text from assets/kinetic-poster-desktop-v2.png (1586x992)
   * using pure clean paper strips sampled directly from the image's own open margins,
   * and splits into feathered Upper ("QUIET") and Lower ("CURRENT") interactive layers.
   */
  prepareDesktopLayers(img) {
    const w = img.naturalWidth || 1586;
    const h = img.naturalHeight || 992;

    const clean = document.createElement('canvas');
    clean.width = w;
    clean.height = h;
    const cctx = clean.getContext('2d');
    cctx.drawImage(img, 0, 0, w, h);

    // Pure paper source strip between TRACK ATLAS (y:26..36) and 02 / KINETIC POSTER (y:84..100): (x:20..260, y:44..76)
    // 1. Heal Top-Left UI ("TRACK ATLAS" at x:40..170, y:20..42 & "02 / KINETIC POSTER" at x:40..280, y:78..105)
    cctx.drawImage(img, 20, 44, 160, 26, 40, 20, 160, 24);
    cctx.drawImage(img, 20, 44, 160, 28, 40, 78, 160, 28);
    cctx.drawImage(img, 20, 44, 95, 28, 195, 78, 86, 28);

    // 2. Heal Top-Right UI ("Open track" & "Save frame" at x:1350..1548, y:18..42)
    // Sample pure paper left of Open track at x:1120..1325, y:10..36
    cctx.drawImage(img, 1120, 10, 205, 28, 1350, 18, 205, 26);

    // 3. Heal static "01:24" text (x:988..1026, y:140..154) and 2px orange stem (x:992..998, y:154..204)
    cctx.drawImage(img, 988, 124, 38, 15, 988, 140, 38, 15);
    cctx.drawImage(img, 986, 154, 6, 40, 992, 154, 7, 40);
    cctx.drawImage(img, 976, 195, 14, 13, 989, 194, 14, 13);

    // 4. Heal Lower-Left UI ("Drag to compose · Tap to mark" at x:42..260, y:836..856 & Mode tabs at x:42..485, y:876..906)
    // Pure paper source at (x:20..145, y:792..830)
    for (let x = 36; x < 490; x += 115) {
      const sw = Math.min(115, 490 - x);
      cctx.drawImage(img, 20, 794, sw, 32, x, 834, sw, 26);
      cctx.drawImage(img, 20, 794, sw, 32, x, 874, sw, 32);
    }

    // 5. Heal Bottom Hairline & Transport Strip (x:0..1586, y:904..992)
    for (let y = 904; y < h; y += 32) {
      const sh = Math.min(32, h - y);
      for (let x = 0; x < w; x += 115) {
        const sw = Math.min(115, w - x);
        cctx.drawImage(img, 20, 794, sw, sh, x, y, sw, sh);
      }
    }

    this.desktopClean = clean;

    // Create Upper ("QUIET") and Lower ("CURRENT") layers separated along the central river curve
    this.desktopUpper = document.createElement('canvas');
    this.desktopUpper.width = w;
    this.desktopUpper.height = h;
    const uctx = this.desktopUpper.getContext('2d');

    this.desktopLower = document.createElement('canvas');
    this.desktopLower.width = w;
    this.desktopLower.height = h;
    const lctx = this.desktopLower.getContext('2d');

    // Split around y = 485 (48.9% height) where the blue wash separates QUIET and CURRENT.
    // Stagger the alpha ramps so lowerCanvas is 100% opaque across [splitY - 35, h] and
    // upperCanvas is 100% opaque across [0, splitY - 5] and feathers over opaque lowerCanvas
    // across [splitY - 5, splitY + 45], guaranteeing 100% composite opacity with zero seam.
    const splitY = 485;

    uctx.drawImage(clean, 0, 0);
    const uGrad = uctx.createLinearGradient(0, splitY - 5, 0, splitY + 45);
    uGrad.addColorStop(0, 'rgba(0,0,0,1)');
    uGrad.addColorStop(1, 'rgba(0,0,0,0)');
    uctx.globalCompositeOperation = 'destination-in';
    uctx.fillStyle = uGrad;
    uctx.fillRect(0, 0, w, h);
    uctx.globalCompositeOperation = 'source-over';

    lctx.drawImage(clean, 0, 0);
    const lGrad = lctx.createLinearGradient(0, splitY - 75, 0, splitY - 35);
    lGrad.addColorStop(0, 'rgba(0,0,0,0)');
    lGrad.addColorStop(1, 'rgba(0,0,0,1)');
    lctx.globalCompositeOperation = 'destination-in';
    lctx.fillStyle = lGrad;
    lctx.fillRect(0, 0, w, h);
    lctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Surgically removes baked-in static UI text from assets/kinetic-poster-mobile-v2.png (853x1844)
   */
  prepareMobileLayers(img) {
    const w = img.naturalWidth || 853;
    const h = img.naturalHeight || 1844;

    const clean = document.createElement('canvas');
    clean.width = w;
    clean.height = h;
    const cctx = clean.getContext('2d');
    cctx.drawImage(img, 0, 0, w, h);

    // Pure paper source between TRACK ATLAS (y:37..50) and 02 / KINETIC POSTER (y:94..108): (x:30..290, y:56..86)
    // 1. Heal Top-Left ("TRACK ATLAS" at x:40..215, y:32..54 & "02 / KINETIC POSTER" at x:40..310, y:88..114)
    cctx.drawImage(img, 30, 56, 185, 26, 40, 32, 185, 24);
    cctx.drawImage(img, 30, 56, 260, 28, 40, 88, 275, 26);

    // 2. Heal Top-Right ("Open track" & "Save frame" at x:558..812, y:30..56)
    cctx.drawImage(img, 30, 56, 255, 26, 558, 30, 255, 26);

    // 3. Heal static "01:24" text (x:512..558, y:376..392) and 2px orange stem/dot (x:512..531, y:392..456)
    cctx.drawImage(img, 512, 358, 46, 16, 512, 376, 46, 16);
    cctx.drawImage(img, 492, 392, 10, 44, 516, 392, 10, 44);
    cctx.drawImage(img, 480, 405, 22, 24, 511, 433, 22, 24);

    // 4. Heal Lower-Left ("Drag to compose" at x:40..310, y:1544..1568 & Mode tabs at x:40..605, y:1590..1628)
    // Pure paper source at (x:25..195, y:1502..1538)
    for (let x = 35; x < 610; x += 150) {
      const sw = Math.min(150, 610 - x);
      cctx.drawImage(img, 25, 1504, sw, 30, x, 1542, sw, 28);
      cctx.drawImage(img, 25, 1504, sw, 34, x, 1588, sw, 38);
    }

    // 5. Heal Mobile Bottom Hairline & Transport (x:0..853, y:1628..1844)
    for (let y = 1628; y < h; y += 34) {
      const sh = Math.min(34, h - y);
      for (let x = 0; x < w; x += 150) {
        const sw = Math.min(150, w - x);
        cctx.drawImage(img, 25, 1504, sw, sh, x, y, sw, sh);
      }
    }

    this.mobileClean = clean;

    const splitY = 918;

    this.mobileUpper = document.createElement('canvas');
    this.mobileUpper.width = w;
    this.mobileUpper.height = h;
    const uctx = this.mobileUpper.getContext('2d');
    uctx.drawImage(clean, 0, 0);
    const uGrad = uctx.createLinearGradient(0, splitY - 5, 0, splitY + 48);
    uGrad.addColorStop(0, 'rgba(0,0,0,1)');
    uGrad.addColorStop(1, 'rgba(0,0,0,0)');
    uctx.globalCompositeOperation = 'destination-in';
    uctx.fillStyle = uGrad;
    uctx.fillRect(0, 0, w, h);
    uctx.globalCompositeOperation = 'source-over';

    this.mobileLower = document.createElement('canvas');
    this.mobileLower.width = w;
    this.mobileLower.height = h;
    const lctx = this.mobileLower.getContext('2d');
    lctx.drawImage(clean, 0, 0);
    const lGrad = lctx.createLinearGradient(0, splitY - 80, 0, splitY - 38);
    lGrad.addColorStop(0, 'rgba(0,0,0,0)');
    lGrad.addColorStop(1, 'rgba(0,0,0,1)');
    lctx.globalCompositeOperation = 'destination-in';
    lctx.fillStyle = lGrad;
    lctx.fillRect(0, 0, w, h);
    lctx.globalCompositeOperation = 'source-over';
  }

  createRiverParticles(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        t: i / count,
        speed: 0.0012 + (i % 5) * 0.00035,
        offset: ((i % 7) - 3) * 4.5,
        radius: 2.2 + (i % 4) * 1.4,
        colorKey: i % 3 === 0 ? 'indigo' : (i % 3 === 1 ? 'cerulean' : 'teal')
      });
    }
    return arr;
  }

  resize(width, height) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
  }

  isPortraitViewport() {
    return (this.width / this.height) < (10 / 11) || this.width <= 760;
  }

  /**
   * Computes destination rectangle for the reference artwork so it fills the canvas
   * cleanly while preserving composition proportions on any screen size.
   */
  getArtworkRect(isPortrait) {
    const srcW = isPortrait ? 853 : 1586;
    const srcH = isPortrait ? 1844 : 992;
    const srcAspect = srcW / srcH;
    const dstAspect = this.width / this.height;

    let drawW, drawH;
    if (Math.abs(dstAspect - srcAspect) < 0.18) {
      drawW = this.width;
      drawH = this.height;
    } else if (dstAspect > srcAspect) {
      drawH = this.height;
      drawW = drawH * srcAspect;
    } else {
      drawW = this.width;
      drawH = drawW / srcAspect;
    }

    const drawX = (this.width - drawW) * 0.5;
    const drawY = (this.height - drawH) * 0.5;
    return { x: drawX, y: drawY, w: drawW, h: drawH, srcW, srcH };
  }

  /**
   * Returns current screen coordinates of the "01:24" Shape a phrase pin handle
   */
  getPinHandlePosition() {
    const isPortrait = this.isPortraitViewport();
    const rect = this.getArtworkRect(isPortrait);
    const baseNx = isPortrait ? 0.6108 : 0.6274;
    const baseNy = isPortrait ? 0.2408 : 0.2016;

    const nx = baseNx + this.state.pinOffset.dx + this.state.quietOffset.dx * 0.85;
    const ny = baseNy + this.state.pinOffset.dy + this.state.quietOffset.dy * 0.85;

    return {
      x: rect.x + nx * rect.w,
      y: rect.y + ny * rect.h,
      rect
    };
  }

  /**
   * Hit-tests pointer coordinates against the "01:24" pin handle, "QUIET" phrase, or "CURRENT" phrase
   */
  hitTest(x, y) {
    const pin = this.getPinHandlePosition();
    const distPin = Math.hypot(x - pin.x, y - (pin.y - 12));
    if (distPin <= 34 || Math.hypot(x - pin.x, y - pin.y) <= 28) {
      return 'pin';
    }

    const isPortrait = this.isPortraitViewport();
    const rect = this.getArtworkRect(isPortrait);
    const nx = (x - rect.x) / rect.w - this.state.quietOffset.dx;
    const ny = (y - rect.y) / rect.h - this.state.quietOffset.dy;

    if (isPortrait) {
      if (nx >= 0.08 && nx <= 0.88 && ny >= 0.24 && ny <= 0.48) return 'quiet';
    } else {
      if (nx >= 0.16 && nx <= 0.74 && ny >= 0.16 && ny <= 0.46) return 'quiet';
    }

    const lnx = (x - rect.x) / rect.w - this.state.currentOffset.dx;
    const lny = (y - rect.y) / rect.h - this.state.currentOffset.dy;
    if (isPortrait) {
      if (lnx >= 0.08 && lnx <= 0.92 && lny >= 0.49 && lny <= 0.74) return 'current';
    } else {
      if (lnx >= 0.15 && lnx <= 0.90 && lny >= 0.48 && lny <= 0.79) return 'current';
    }

    return null;
  }

  pushUndoSnapshot() {
    this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
    if (this.undoStack.length > 30) {
      this.undoStack.shift();
    }
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  hasEdits() {
    return (
      this.undoStack.length > 0 ||
      Math.hypot(this.state.pinOffset.dx, this.state.pinOffset.dy) > 0.001 ||
      Math.hypot(this.state.quietOffset.dx, this.state.quietOffset.dy) > 0.001 ||
      Math.hypot(this.state.currentOffset.dx, this.state.currentOffset.dy) > 0.001 ||
      this.state.marks.length > 0
    );
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    this.state = this.undoStack.pop();
    return true;
  }

  resetComposition() {
    if (!this.hasEdits()) return false;
    this.pushUndoSnapshot();
    this.state = {
      pinOffset: { dx: 0, dy: 0 },
      quietOffset: { dx: 0, dy: 0 },
      currentOffset: { dx: 0, dy: 0 },
      marks: []
    };
    return true;
  }

  cycleTreatment() {
    this.treatmentIndex = (this.treatmentIndex + 1) % this.treatments.length;
    return this.treatments[this.treatmentIndex];
  }

  getCurrentTreatment() {
    return this.treatments[this.treatmentIndex];
  }

  setPosterTitle(titleStr) {
    const cleaned = (titleStr || 'Quiet Current').trim();
    this.titleText = cleaned;
    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) {
      this.upperWord = parts[0].toUpperCase();
      this.lowerWord = '';
    } else {
      const mid = Math.ceil(parts.length / 2);
      this.upperWord = parts.slice(0, mid).join(' ').toUpperCase();
      this.lowerWord = parts.slice(mid).join(' ').toUpperCase();
    }
    this.isCustomTitle = cleaned.toLowerCase() !== 'quiet current';
  }

  /**
   * Pointer interaction handlers ("Drag to compose · Tap to mark")
   */
  onPointerDown(x, y) {
    const target = this.hitTest(x, y) || 'pin';
    this.selectedTarget = target;
    const hit = this.hitTest(x, y);

    const bucket = hit === 'quiet'
      ? this.state.quietOffset
      : (hit === 'current' ? this.state.currentOffset : this.state.pinOffset);

    this.activeDrag = {
      type: hit, // 'pin' | 'quiet' | 'current' | null
      startX: x,
      startY: y,
      origDx: bucket.dx,
      origDy: bucket.dy,
      moved: false,
      snapshotSaved: false
    };
    return hit;
  }

  onPointerMove(x, y) {
    if (!this.activeDrag) {
      this.hoverTarget = this.hitTest(x, y);
      return { dragging: false, hover: this.hoverTarget };
    }

    const dxPx = x - this.activeDrag.startX;
    const dyPx = y - this.activeDrag.startY;
    if (Math.hypot(dxPx, dyPx) > 4) {
      if (!this.activeDrag.moved && this.activeDrag.type) {
        this.pushUndoSnapshot();
        this.activeDrag.snapshotSaved = true;
      }
      this.activeDrag.moved = true;
    }

    if (this.activeDrag.moved && this.activeDrag.type) {
      const isPortrait = this.isPortraitViewport();
      const rect = this.getArtworkRect(isPortrait);
      const ndx = dxPx / rect.w;
      const ndy = dyPx / rect.h;

      if (this.activeDrag.type === 'pin') {
        this.state.pinOffset.dx = Math.max(-0.18, Math.min(0.18, this.activeDrag.origDx + ndx));
        this.state.pinOffset.dy = Math.max(-0.14, Math.min(0.16, this.activeDrag.origDy + ndy));
      } else if (this.activeDrag.type === 'quiet') {
        this.state.quietOffset.dx = Math.max(-0.14, Math.min(0.14, this.activeDrag.origDx + ndx));
        this.state.quietOffset.dy = Math.max(-0.12, Math.min(0.12, this.activeDrag.origDy + ndy));
      } else if (this.activeDrag.type === 'current') {
        this.state.currentOffset.dx = Math.max(-0.14, Math.min(0.14, this.activeDrag.origDx + ndx));
        this.state.currentOffset.dy = Math.max(-0.12, Math.min(0.12, this.activeDrag.origDy + ndy));
      }
    }

    return { dragging: this.activeDrag.moved, type: this.activeDrag.type };
  }

  onPointerUp(x, y, currentTimeFormatted = '01:24') {
    if (!this.activeDrag) return { action: null };
    const wasMoved = this.activeDrag.moved;
    const dragType = this.activeDrag.type;
    this.activeDrag = null;

    if (!wasMoved) {
      // Tap to mark: plant an organic wet-in-wet watercolor bloom + botanical sprig / ink ticks
      this.plantWatercolorMark(x, y, currentTimeFormatted);
      return { action: 'mark' };
    }
    return { action: 'drag', target: dragType };
  }

  nudgeSelected(dxNorm, dyNorm) {
    this.pushUndoSnapshot();
    const target = this.selectedTarget || 'pin';
    if (target === 'quiet') {
      this.state.quietOffset.dx = Math.max(-0.14, Math.min(0.14, this.state.quietOffset.dx + dxNorm));
      this.state.quietOffset.dy = Math.max(-0.12, Math.min(0.12, this.state.quietOffset.dy + dyNorm));
    } else if (target === 'current') {
      this.state.currentOffset.dx = Math.max(-0.14, Math.min(0.14, this.state.currentOffset.dx + dxNorm));
      this.state.currentOffset.dy = Math.max(-0.12, Math.min(0.12, this.state.currentOffset.dy + dyNorm));
    } else {
      this.state.pinOffset.dx = Math.max(-0.18, Math.min(0.18, this.state.pinOffset.dx + dxNorm));
      this.state.pinOffset.dy = Math.max(-0.14, Math.min(0.16, this.state.pinOffset.dy + dyNorm));
    }
  }

  plantWatercolorMark(x, y, timeStr = '01:24') {
    this.pushUndoSnapshot();
    const isPortrait = this.isPortraitViewport();
    const rect = this.getArtworkRect(isPortrait);
    const nx = (x - rect.x) / rect.w;
    const ny = (y - rect.y) / rect.h;

    const colorKeys = ['terracotta', 'indigo', 'ochre', 'teal', 'moss'];
    const treatment = this.getCurrentTreatment();
    const colorKey = this.state.marks.length % 2 === 0
      ? treatment.accent
      : colorKeys[this.state.marks.length % colorKeys.length];

    this.state.marks.push({
      nx,
      ny,
      colorKey,
      radius: 26 + (this.state.marks.length % 4) * 7,
      seed: (this.state.marks.length + 1) * 97.3,
      timeStr,
      createdAt: performance.now()
    });
  }

  /**
   * Main 60 FPS Render Entry
   */
  render(audioFeatures, currentTime, duration, isReducedMotion = false, timeFormatted = '01:24') {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const kick = audioFeatures ? audioFeatures.stems.kick : 0;
    const bass = audioFeatures ? audioFeatures.stems.bass : 0;
    const chords = audioFeatures ? audioFeatures.stems.chords : 0;
    const melody = audioFeatures ? audioFeatures.stems.melody : 0;
    const hihat = audioFeatures ? audioFeatures.stems.hihat : 0;
    const master = audioFeatures ? audioFeatures.masterEnergy : 0;
    const isPlaying = master > 0.01;

    if (!isReducedMotion && isPlaying) {
      this.phase += 0.028 + master * 0.04;
    }

    const isPortrait = this.isPortraitViewport();
    const rect = this.getArtworkRect(isPortrait);

    // 1. Render base painted poster artwork (either 1:1 Reference Layers or Custom Title Calligraphy)
    if (!this.isCustomTitle) {
      this.renderReferenceArtworkLayers(ctx, rect, isPortrait, kick, bass, melody, isReducedMotion);
    } else {
      this.renderCustomTitlePoster(ctx, rect, isPortrait, kick, bass, melody, isReducedMotion);
    }

    // 2. Render live audio-reactive & interactive watercolor river current, blooms, and rhythmic ink ticks
    if (isPlaying || this.hasEdits() || this.treatmentIndex !== 0) {
      this.renderLiveWatercolorOverlay(ctx, rect, isPortrait, kick, bass, chords, melody, hihat, isReducedMotion);
    }

    // 3. Render user-planted "Tap to mark" watercolor blooms & botanical sprigs
    if (this.state.marks.length > 0) {
      this.renderPlantedMarks(ctx, rect, melody, isReducedMotion);
    }

    // 4. Render interactive selection guides (when hovering or dragging) & the canonical "01:24" pin handle
    this.renderPhraseHandles(ctx, rect, isPortrait, timeFormatted);
  }

  /**
   * Renders the cleaned high-resolution reference artwork (desktop or mobile).
   * At rest with zero edits and audio paused, it draws the unified clean plate 1:1.
   * When phrases are dragged or audio is playing, it renders the Upper ("QUIET") and
   * Lower ("CURRENT") feathered layers through a 40-slice vertical arch warp!
   */
  renderReferenceArtworkLayers(ctx, rect, isPortrait, kick, bass, melody, isReducedMotion) {
    const ready = isPortrait ? this.mobileReady : this.desktopReady;
    const cleanCanvas = isPortrait ? this.mobileClean : this.desktopClean;
    const upperCanvas = isPortrait ? this.mobileUpper : this.desktopUpper;
    const lowerCanvas = isPortrait ? this.mobileLower : this.desktopLower;

    if (!ready || !cleanCanvas) return;

    const pinMoved = Math.hypot(this.state.pinOffset.dx, this.state.pinOffset.dy) > 0.0005;
    const quietMoved = Math.hypot(this.state.quietOffset.dx, this.state.quietOffset.dy) > 0.0005;
    const currentMoved = Math.hypot(this.state.currentOffset.dx, this.state.currentOffset.dy) > 0.0005;
    const audioActive = !isReducedMotion && (kick + bass + melody) > 0.02;

    ctx.save();

    if (!pinMoved && !quietMoved && !currentMoved && !audioActive) {
      // Exact 1:1 unwarped reference artwork at rest
      ctx.drawImage(cleanCanvas, rect.x, rect.y, rect.w, rect.h);
    } else {
      // Slice-warped interactive & audio-reactive rendering of Lower ("CURRENT") and Upper ("QUIET") layers.
      // Draw lowerCanvas first (100% opaque from splitY - 35 to bottom) and upperCanvas on top
      // (feathering 1 -> 0 over [splitY - 5, splitY + 45]) so composite opacity is 1.0 everywhere.
      const slices = 44;
      const srcW = cleanCanvas.width;
      const srcH = cleanCanvas.height;

      const qDx = this.state.quietOffset.dx * rect.w + this.state.pinOffset.dx * rect.w * 0.35;
      const qDy = this.state.quietOffset.dy * rect.h;
      const pinArchY = this.state.pinOffset.dy * rect.h * 1.15;

      // 1. Lower phrase ("CURRENT") with independent offset + counter-wave
      const cDx = this.state.currentOffset.dx * rect.w;
      const cDy = this.state.currentOffset.dy * rect.h;

      for (let i = 0; i < slices; i++) {
        const u0 = i / slices;
        const u1 = (i + 1) / slices;
        const uMid = (u0 + u1) * 0.5;

        const phraseBell = Math.sin(uMid * Math.PI);
        const audioWave = audioActive
          ? Math.cos(this.phase * 1.6 + uMid * 4.8) * (melody * 6.0 + bass * 4.5) * phraseBell
          : 0;
        const pinCounter = -pinArchY * 0.22 * Math.sin(uMid * Math.PI);

        const sliceDy = cDy + pinCounter + audioWave;
        const sx = u0 * srcW;
        const sw = (u1 - u0) * srcW;
        const dx = rect.x + cDx + u0 * rect.w;
        const dw = (u1 - u0) * rect.w + 0.6;

        ctx.drawImage(lowerCanvas, sx, 0, sw, srcH, dx, rect.y + sliceDy, dw, rect.h);
      }

      // 2. Upper phrase ("QUIET") with pin arch bend + audio wave drawn over lowerCanvas
      for (let i = 0; i < slices; i++) {
        const u0 = i / slices;
        const u1 = (i + 1) / slices;
        const uMid = (u0 + u1) * 0.5;

        // Bell-curve arch centered around the T of QUIET (u = 0.62)
        const pinBell = Math.exp(-Math.pow((uMid - 0.62) / 0.24, 2));
        const phraseBell = Math.sin(uMid * Math.PI);
        const audioWave = audioActive
          ? Math.sin(this.phase * 1.8 + uMid * 5.2) * (bass * 6.5 + kick * 5.0) * phraseBell
          : 0;

        const sliceDy = qDy + pinArchY * pinBell + audioWave;
        const sx = u0 * srcW;
        const sw = (u1 - u0) * srcW;
        const dx = rect.x + qDx + u0 * rect.w;
        const dw = (u1 - u0) * rect.w + 0.6;

        ctx.drawImage(upperCanvas, sx, 0, sw, srcH, dx, rect.y + sliceDy, dw, rect.h);
      }
    }

    // Apply subtle watercolor glaze if a non-default painted treatment is selected
    const treatment = this.getCurrentTreatment();
    if (treatment.tint) {
      ctx.globalCompositeOperation = 'multiply';
      const grad = ctx.createRadialGradient(
        rect.x + rect.w * 0.5, rect.y + rect.h * 0.48, rect.w * 0.08,
        rect.x + rect.w * 0.5, rect.y + rect.h * 0.48, rect.w * 0.48
      );
      grad.addColorStop(0, treatment.tint);
      grad.addColorStop(1, 'rgba(244, 239, 228, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.restore();
  }

  /**
   * Renders bespoke hand-painted watercolor brush calligraphy when the user customizes
   * the poster title or loads a local audio file with a different title.
   */
  renderCustomTitlePoster(ctx, rect, isPortrait, kick, bass, melody, isReducedMotion) {
    ctx.save();

    // Soft atmospheric washes behind the custom calligraphy
    ctx.globalCompositeOperation = 'multiply';
    const cx = rect.x + rect.w * 0.5;
    const cy = rect.y + rect.h * 0.47;

    const washes = [
      { x: cx - rect.w * 0.16, y: cy - rect.h * 0.14, rx: rect.w * 0.26, ry: rect.h * 0.14, rot: -0.18, color: 'terracotta', alpha: 0.24 + bass * 0.12 },
      { x: cx + rect.w * 0.12, y: cy - rect.h * 0.18, rx: rect.w * 0.24, ry: rect.h * 0.13, rot: 0.12, color: 'ochre', alpha: 0.22 + melody * 0.1 },
      { x: cx, y: cy + rect.h * 0.02, rx: rect.w * 0.36, ry: rect.h * 0.09, rot: -0.08, color: 'cerulean', alpha: 0.26 + bass * 0.14 },
      { x: cx + rect.w * 0.06, y: cy + rect.h * 0.18, rx: rect.w * 0.28, ry: rect.h * 0.14, rot: 0.14, color: 'moss', alpha: 0.20 + kick * 0.1 }
    ];

    for (const wsh of washes) {
      const rgb = this.palette[wsh.color] || this.palette.indigo;
      const g = ctx.createRadialGradient(wsh.x, wsh.y, 10, wsh.x, wsh.y, Math.max(wsh.rx, wsh.ry));
      g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${wsh.alpha})`);
      g.addColorStop(0.65, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${wsh.alpha * 0.45})`);
      g.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(wsh.x, wsh.y, wsh.rx, wsh.ry, wsh.rot, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw custom arched hand-painted brush lettering for upperWord and lowerWord
    const fontSize = isPortrait ? Math.min(rect.w * 0.19, 118) : Math.min(rect.w * 0.115, 148);
    ctx.font = `800 italic ${fontSize}px "Fraunces", "Playfair Display", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawArchedWord = (word, baseYNorm, offsetBucket, archSign) => {
      if (!word) return;
      const chars = word.split('');
      const span = Math.min(0.72, chars.length * 0.105);
      for (let i = 0; i < chars.length; i++) {
        const u = chars.length === 1 ? 0.5 : i / (chars.length - 1);
        const nx = (0.5 - span * 0.5) + u * span + offsetBucket.dx;
        const arch = Math.sin(u * Math.PI) * -0.075 * archSign + this.state.pinOffset.dy * Math.sin(u * Math.PI) * 0.5;
        const wave = !isReducedMotion ? Math.sin(this.phase * 2 + i * 0.7) * (kick * 0.012 + melody * 0.008) : 0;
        const ny = baseYNorm + arch + offsetBucket.dy + wave;

        const gx = rect.x + nx * rect.w;
        const gy = rect.y + ny * rect.h;
        const rot = -0.14 + (u - 0.5) * 0.22;

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(rot);

        // Wet-in-wet terracotta & ochre under-bleed
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(198, 89, 53, 0.42)';
        ctx.fillText(chars[i], -4, 5);
        ctx.fillStyle = 'rgba(219, 155, 59, 0.34)';
        ctx.fillText(chars[i], 4, -3);

        // Deep Prussian Indigo primary calligraphy
        ctx.fillStyle = 'rgba(21, 50, 79, 0.92)';
        ctx.fillText(chars[i], 0, 0);

        // Capillary dark edge outline
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(16, 36, 58, 0.55)';
        ctx.strokeText(chars[i], 0, 0);
        ctx.restore();
      }
    };

    drawArchedWord(this.upperWord, 0.34, this.state.quietOffset, 1);
    drawArchedWord(this.lowerWord, 0.62, this.state.currentOffset, -0.6);

    ctx.restore();
  }

  /**
   * Renders live audio-reactive watercolor river current filaments, wet blooms,
   * swaying botanical accents, and rhythmic black ink score ticks (||||)
   */
  renderLiveWatercolorOverlay(ctx, rect, isPortrait, kick, bass, chords, melody, hihat, isReducedMotion) {
    ctx.save();

    const qDx = this.state.quietOffset.dx * rect.w;
    const qDy = this.state.quietOffset.dy * rect.h;
    const pinDy = this.state.pinOffset.dy * rect.h;

    // 1. Flowing Watercolor River Current S-Curve weaving from T of QUIET through the center
    ctx.globalCompositeOperation = 'multiply';
    const p0 = { x: rect.x + rect.w * 0.58 + qDx, y: rect.y + rect.h * 0.22 + qDy + pinDy * 0.8 };
    const p1 = { x: rect.x + rect.w * 0.84, y: rect.y + rect.h * 0.18 + pinDy * 0.4 };
    const p2 = { x: rect.x + rect.w * 0.68, y: rect.y + rect.h * 0.34 };
    const p3 = { x: rect.x + rect.w * 0.93, y: rect.y + rect.h * 0.47 };

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    ctx.strokeStyle = `rgba(46, 108, 152, ${0.12 + bass * 0.22})`;
    ctx.lineWidth = 10 + bass * 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Central horizontal current between QUIET and CURRENT
    const c0 = { x: rect.x + rect.w * 0.33, y: rect.y + rect.h * 0.49 + qDy * 0.4 };
    const c1 = { x: rect.x + rect.w * 0.49, y: rect.y + rect.h * 0.44 - bass * 12 };
    const c2 = { x: rect.x + rect.w * 0.63, y: rect.y + rect.h * 0.54 + melody * 12 };
    const c3 = { x: rect.x + rect.w * 0.78, y: rect.y + rect.h * 0.50 };

    ctx.beginPath();
    ctx.moveTo(c0.x, c0.y);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, c3.x, c3.y);
    ctx.strokeStyle = `rgba(36, 94, 138, ${0.14 + chords * 0.24})`;
    ctx.lineWidth = 8 + chords * 12;
    ctx.stroke();

    // Floating pigment droplets along the current
    for (const pt of this.riverParticles) {
      if (!isReducedMotion) {
        pt.t = (pt.t + pt.speed * (1 + bass * 2.5)) % 1;
      }
      const t = pt.t;
      const mt = 1 - t;
      const bx = mt * mt * mt * c0.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * c3.x;
      const by = mt * mt * mt * c0.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * c3.y + pt.offset;
      const rgb = this.palette[pt.colorKey] || this.palette.cerulean;

      ctx.beginPath();
      ctx.arc(bx, by, pt.radius * (1 + melody * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.18 + melody * 0.25})`;
      ctx.fill();
    }

    // 2. Rhythmic Black Ink Score Ticks (||||) pulsing on 96 BPM kick & hihat onsets
    ctx.globalCompositeOperation = 'source-over';
    const tickClusters = isPortrait
      ? [
          { nx: 0.24, ny: 0.23, count: 5 },
          { nx: 0.69, ny: 0.17, count: 4 },
          { nx: 0.79, ny: 0.65, count: 4 }
        ]
      : [
          { nx: 0.195, ny: 0.232, count: 4 },
          { nx: 0.106, ny: 0.345, count: 5 },
          { nx: 0.551, ny: 0.112, count: 4 },
          { nx: 0.590, ny: 0.412, count: 4 },
          { nx: 0.752, ny: 0.762, count: 5 }
        ];

    for (const cl of tickClusters) {
      const baseX = rect.x + cl.nx * rect.w;
      const baseY = rect.y + cl.ny * rect.h;
      const scaleH = 1 + kick * 0.45 + hihat * 0.25;

      for (let i = 0; i < cl.count; i++) {
        const tx = baseX + (i - (cl.count - 1) * 0.5) * 7.5;
        const halfH = (10 + (i % 2) * 4) * scaleH;
        ctx.beginPath();
        ctx.moveTo(tx, baseY - halfH);
        ctx.lineTo(tx, baseY + halfH);
        ctx.strokeStyle = `rgba(23, 24, 26, ${0.42 + kick * 0.45})`;
        ctx.lineWidth = 1.4 + kick * 0.8;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Renders user-authored watercolor blooms + botanical sprigs planted via "Tap to mark"
   */
  renderPlantedMarks(ctx, rect, melody, isReducedMotion) {
    ctx.save();
    const now = performance.now();

    for (const m of this.state.marks) {
      const mx = rect.x + m.nx * rect.w;
      const my = rect.y + m.ny * rect.h;
      const ageSec = Math.min(1, (now - m.createdAt) / 450);
      const easeOut = 1 - Math.pow(1 - ageSec, 3);
      const rad = m.radius * easeOut * (1 + (!isReducedMotion ? melody * 0.08 : 0));
      const rgb = this.palette[m.colorKey] || this.palette.terracotta;

      // 1. Multi-layered wet-in-wet watercolor bloom with capillary edge ring
      ctx.globalCompositeOperation = 'multiply';
      const grad = ctx.createRadialGradient(mx, my, rad * 0.1, mx, my, rad);
      grad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.34)`);
      grad.addColorStop(0.72, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.18)`);
      grad.addColorStop(0.92, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.28)`); // Pooled pigment edge
      grad.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      for (let a = 0; a <= 24; a++) {
        const ang = (a / 24) * Math.PI * 2;
        const wobble = 1 + 0.14 * Math.sin(ang * 5 + m.seed) + 0.08 * Math.cos(ang * 3 - m.seed);
        const px = mx + Math.cos(ang) * rad * wobble;
        const py = my + Math.sin(ang) * rad * wobble;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // 2. Delicate botanical sprig & rhythmic ink ticks inside the bloom
      ctx.globalCompositeOperation = 'source-over';
      const sway = !isReducedMotion ? Math.sin(this.phase * 1.5 + m.seed) * 3 : 0;
      ctx.beginPath();
      ctx.moveTo(mx, my + rad * 0.35);
      ctx.quadraticCurveTo(mx + sway, my - rad * 0.1, mx + sway * 1.4, my - rad * 0.65);
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.72)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Two small botanical leaves
      for (const dir of [-1, 1]) {
        ctx.save();
        ctx.translate(mx + sway * 0.6, my - rad * (dir > 0 ? 0.22 : 0.05));
        ctx.rotate(dir * 0.65);
        ctx.fillStyle = `rgba(72, 99, 66, 0.68)`;
        ctx.beginPath();
        ctx.ellipse(dir * 6, 0, 6.5 * easeOut, 2.8 * easeOut, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Timestamp micro-label
      ctx.font = '600 10px Inter, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(23, 24, 26, 0.78)';
      ctx.textAlign = 'center';
      ctx.fillText(m.timeStr, mx, my + rad * 0.62 + 10);
    }

    ctx.restore();
  }

  /**
   * Renders the signature "Shape a phrase" terracotta-orange pin handle ("01:24")
   * on the upper crossbar of the T in QUIET, matching assets/kinetic-poster-desktop-v2.png
   * and assets/shared-controls-v2.png 1:1.
   */
  renderPhraseHandles(ctx, rect, isPortrait, timeFormatted = '01:24') {
    const pin = this.getPinHandlePosition();
    const isHovered = this.hoverTarget === 'pin' || (this.activeDrag && this.activeDrag.type === 'pin');
    const pinMoved = Math.hypot(this.state.pinOffset.dx, this.state.pinOffset.dy) > 0.002;

    ctx.save();

    // When hovered, dragged, or shaped, render the signature "Shape a phrase" curved dark guide arc + endpoint ticks (shared-controls-v2.png)
    if (isHovered || pinMoved || (this.activeDrag && this.activeDrag.moved)) {
      const arcSpan = isPortrait ? 88 : 135;
      const x0 = pin.x - arcSpan;
      const y0 = pin.y + 34;
      const x1 = pin.x + arcSpan;
      const y1 = pin.y + 22;
      const cpX = pin.x;
      const cpY = pin.y - 32;

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpX, cpY, x1, y1);
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.72)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Endpoint ticks on the guide arc
      ctx.beginPath();
      ctx.moveTo(x0 - 3, y0 - 5);
      ctx.lineTo(x0 + 3, y0 + 5);
      ctx.moveTo(x1 - 3, y1 + 5);
      ctx.lineTo(x1 + 3, y1 - 5);
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.78)';
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }

    // Vertical stem above the orange dot (matches kinetic-poster-desktop-v2.png & shared-controls-v2.png)
    const stemHeight = isPortrait ? 32 : 38;
    ctx.beginPath();
    ctx.moveTo(pin.x, pin.y - stemHeight);
    ctx.lineTo(pin.x, pin.y);
    ctx.strokeStyle = this.palette.orangePin;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Lower dark anchor stem when actively selected/hovered/shaped (shared-controls-v2.png "Shape a phrase")
    if (isHovered || pinMoved) {
      ctx.beginPath();
      ctx.moveTo(pin.x, pin.y + 6);
      ctx.lineTo(pin.x, pin.y + 32);
      ctx.strokeStyle = 'rgba(23, 24, 26, 0.72)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Cream halo ring around orange pin
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, 8.2, 0, Math.PI * 2);
      ctx.fillStyle = '#F6F1E7';
      ctx.fill();
    }

    // Terracotta-orange circular pin dot (#E85B26)
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = this.palette.orangePin;
    ctx.fill();

    // Timestamp label ("01:24") directly above the vertical stem
    const labelText = pinMoved ? timeFormatted : '01:24';
    ctx.font = '600 11px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#17181A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(labelText, pin.x + 8, pin.y - stemHeight - 4);

    // Subtle hover/drag hint pill for word groups ("QUIET" / "CURRENT")
    if (this.hoverTarget === 'quiet' || this.hoverTarget === 'current') {
      const isQuiet = this.hoverTarget === 'quiet';
      const hx = rect.x + rect.w * (isQuiet ? 0.44 : 0.48) + (isQuiet ? this.state.quietOffset.dx : this.state.currentOffset.dx) * rect.w;
      const hy = rect.y + rect.h * (isQuiet ? 0.28 : 0.62) + (isQuiet ? this.state.quietOffset.dy : this.state.currentOffset.dy) * rect.h;

      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 91, 38, 0.85)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#F6F1E7';
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Renders a clean, high-resolution still export of the watercolor poster (without interactive drag handles)
   */
  exportStillPNG(paperGen, audioFeatures, currentTime, duration, timeFormatted = '01:24') {
    const off = document.createElement('canvas');
    off.width = this.width;
    off.height = this.height;
    const octx = off.getContext('2d');

    if (paperGen) {
      paperGen.draw(octx, this.width, this.height);
    } else {
      octx.fillStyle = '#F3EDE0';
      octx.fillRect(0, 0, this.width, this.height);
    }

    const isPortrait = this.isPortraitViewport();
    const rect = this.getArtworkRect(isPortrait);
    const kick = audioFeatures ? audioFeatures.stems.kick : 0;
    const bass = audioFeatures ? audioFeatures.stems.bass : 0;
    const chords = audioFeatures ? audioFeatures.stems.chords : 0;
    const melody = audioFeatures ? audioFeatures.stems.melody : 0;
    const hihat = audioFeatures ? audioFeatures.stems.hihat : 0;

    if (!this.isCustomTitle) {
      this.renderReferenceArtworkLayers(octx, rect, isPortrait, kick, bass, melody, true);
    } else {
      this.renderCustomTitlePoster(octx, rect, isPortrait, kick, bass, melody, true);
    }

    if (this.hasEdits() || this.treatmentIndex !== 0) {
      this.renderLiveWatercolorOverlay(octx, rect, isPortrait, kick, bass, chords, melody, hihat, true);
    }

    if (this.state.marks.length > 0) {
      this.renderPlantedMarks(octx, rect, melody, true);
    }

    return off.toDataURL('image/png');
  }
}
