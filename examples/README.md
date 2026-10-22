# WDA Examples — 3D Malleable Liquid (MLS-MPM + Narrow-Range SSFR)

Interactive 3D malleable and throwable liquid simulation built with **WebGL2**, combining:

- **3D Moving Least Squares Material Point Method (MLS-MPM)** with **APIC** $3 \times 3$ affine velocity matrices ($\mathbf{C}_p$), quadratic B-spline `P2G`/`G2P` transfers, viscoelastic shear strain memory, and Continuum Surface Tension (CSF).
- **3D Screen-Space Fluid Rendering (SSFR)** with ray-cast 3D sphere impostors, hardware depth occlusion, **Truong & Yuksel (2018) Separable Narrow-Range Depth Filtering**, multi-scale bilateral normal reconstruction, double-surface refraction, Total Internal Reflection (TIR) meniscus rim, Beer-Lambert volumetric absorption, and refractive floor caustics.

## Files

- [`index.html`](./index.html) / [`malleable-liquid.html`](./malleable-liquid.html) / [`liquid.html`](./liquid.html) — Self-contained interactive 3D WebGL2 simulation on a pure white studio canvas.
