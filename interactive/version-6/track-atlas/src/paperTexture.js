/**
 * paperTexture.js - Cold-Press Cotton Watercolor Paper Surface Generator
 *
 * Calibrated to match the warm uncoated watercolor paper (#F3EDE0 / #F4EFE4)
 * of assets/kinetic-poster-desktop-v2.png and assets/kinetic-poster-mobile-v2.png.
 */

export class PaperTextureGenerator {
  constructor(width = 1440, height = 900) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.max(1, Math.floor(width));
    this.canvas.height = Math.max(1, Math.floor(height));
    this.ctx = this.canvas.getContext('2d');
    this.generate();
  }

  resize(width, height) {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.generate();
  }

  generate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Base warm cotton paper tone matching V2 reference PNGs
    ctx.fillStyle = '#F3EDE0';
    ctx.fillRect(0, 0, w, h);

    // Subtle warm radial illumination from center
    const centerGrad = ctx.createRadialGradient(
      w * 0.5, h * 0.48, Math.min(w, h) * 0.1,
      w * 0.5, h * 0.48, Math.max(w, h) * 0.75
    );
    centerGrad.addColorStop(0, 'rgba(249, 245, 236, 0.55)');
    centerGrad.addColorStop(0.65, 'rgba(243, 237, 224, 0.15)');
    centerGrad.addColorStop(1, 'rgba(229, 220, 203, 0.35)');
    ctx.fillStyle = centerGrad;
    ctx.fillRect(0, 0, w, h);

    // Deterministic cold-press tooth & cellulose grain
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let seed = 1337;
    const nextRand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < data.length; i += 4) {
      const n = (nextRand() - 0.5) * 7.5;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.92));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.78));
    }
    ctx.putImageData(imgData, 0, 0);

    // Delicate organic cotton fibers
    ctx.strokeStyle = 'rgba(182, 168, 145, 0.11)';
    ctx.lineWidth = 0.55;
    const fiberCount = Math.min(360, Math.floor((w * h) / 9500));
    for (let f = 0; f < fiberCount; f++) {
      const fx = nextRand() * w;
      const fy = nextRand() * h;
      const len = 3 + nextRand() * 7;
      const ang = nextRand() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.cos(ang) * len, fy + Math.sin(ang) * len);
      ctx.stroke();
    }
  }

  draw(targetCtx, w, h) {
    targetCtx.drawImage(this.canvas, 0, 0, w, h);
  }
}
