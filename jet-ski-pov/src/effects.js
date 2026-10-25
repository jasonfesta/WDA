import * as THREE from './vendor/three.module.js';

/**
 * Water Spray, Takeoff Burst, Landing Splash, & Underwater Propulsion Bubble Particle System
 *
 * Uses bounded, reusable particle pools (`TECHNICAL-PLAN.md`) so zero garbage collection
 * or frame drops occur during intense carving, big-air landings, or submarine diving.
 */
export class WaterEffectsSystem {
  constructor(scene) {
    this.scene = scene;
    this.maxParticles = 420;
    this.particles = [];

    const positions = new Float32Array(this.maxParticles * 3);
    const scales = new Float32Array(this.maxParticles);
    const alphas = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: -999,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 1.0,
        size: 1.0,
        isBubble: false,
      });
      positions[i * 3 + 1] = -999;
      scales[i] = 0;
      alphas[i] = 0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aScale * (260.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r = length(uv);
          if (r > 0.5) discard;
          float soft = smoothstep(0.5, 0.1, r);
          gl_FragColor = vec4(0.92, 0.98, 1.0, vAlpha * soft);
        }
      `,
    });

    this.pointsMesh = new THREE.Points(this.geometry, this.material);
    this.pointsMesh.frustumCulled = false;
    this.scene.add(this.pointsMesh);

    this.poolCursor = 0;
  }

  _spawnParticle(x, y, z, vx, vy, vz, size, maxLife, isBubble = false) {
    const p = this.particles[this.poolCursor];
    this.poolCursor = (this.poolCursor + 1) % this.maxParticles;

    p.active = true;
    p.x = x;
    p.y = y;
    p.z = z;
    p.vx = vx;
    p.vy = vy;
    p.vz = vz;
    p.size = size;
    p.life = 0;
    p.maxLife = maxLife;
    p.isBubble = isBubble;
  }

  /**
   * Emits a dramatic ring of spray droplets on takeoff, clean/rough landing, or submarine breach.
   */
  spawnSplashBurst(position, count = 45, upwardSpeed = 6.5, spreadSpeed = 5.5) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.35 + Math.random() * 0.65) * spreadSpeed;
      const vx = Math.cos(ang) * spd;
      const vz = Math.sin(ang) * spd;
      const vy = (0.4 + Math.random() * 0.7) * upwardSpeed;
      this._spawnParticle(
        position.x + (Math.random() - 0.5) * 1.4,
        position.y + 0.2,
        position.z + (Math.random() - 0.5) * 1.4,
        vx,
        vy,
        vz,
        1.1 + Math.random() * 1.4,
        0.55 + Math.random() * 0.45,
        false
      );
    }
  }

  update(dt, craftState) {
    const speed2D = Math.hypot(craftState.velocity.x, craftState.velocity.z);
    const fwdX = -Math.sin(craftState.heading);
    const fwdZ = -Math.cos(craftState.heading);
    const rightX = Math.cos(craftState.heading);
    const rightZ = -Math.sin(craftState.heading);

    // 1. Continuous side-chine spray & rooster-tail when carving on the surface
    if (!craftState.isAirborne && !craftState.isSubmerged && speed2D > 5.0) {
      const count = Math.min(4, Math.ceil(speed2D / 8));
      for (let i = 0; i < count; i++) {
        const side = Math.random() > 0.5 ? 1 : -1;
        const px = craftState.position.x + rightX * side * 0.65 - fwdX * (Math.random() * 1.1);
        const pz = craftState.position.z + rightZ * side * 0.65 - fwdZ * (Math.random() * 1.1);
        const py = craftState.position.y + 0.1;

        const outSpeed = 2.0 + Math.abs(craftState.steerAngle) * 3.5 + speed2D * 0.12;
        const vx = rightX * side * outSpeed + (Math.random() - 0.5) * 1.4;
        const vz = rightZ * side * outSpeed + (Math.random() - 0.5) * 1.4;
        const vy = 1.6 + Math.random() * 2.2;

        this._spawnParticle(px, py, pz, vx, vy, vz, 0.75 + Math.random() * 0.85, 0.38 + Math.random() * 0.25, false);
      }
    }

    // 2. Underwater waterjet bubble stream when diving submerged!
    if (craftState.isSubmerged) {
      for (let i = 0; i < 4; i++) {
        const px = craftState.position.x - fwdX * 1.5 + (Math.random() - 0.5) * 0.8;
        const py = craftState.position.y + (Math.random() - 0.5) * 0.5;
        const pz = craftState.position.z - fwdZ * 1.5 + (Math.random() - 0.5) * 0.8;

        this._spawnParticle(
          px,
          py,
          pz,
          (Math.random() - 0.5) * 1.5,
          1.8 + Math.random() * 2.2, // bubbles rise toward surface
          (Math.random() - 0.5) * 1.5,
          0.65 + Math.random() * 0.9,
          0.85 + Math.random() * 0.6,
          true
        );
      }
    }

    // 3. Advance active particles and upload attributes
    const posAttr = this.geometry.attributes.position;
    const scaleAttr = this.geometry.attributes.aScale;
    const alphaAttr = this.geometry.attributes.aAlpha;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        posAttr.array[i * 3 + 1] = -999;
        scaleAttr.array[i] = 0;
        alphaAttr.array[i] = 0;
        continue;
      }

      if (p.isBubble) {
        p.vy += 2.2 * dt; // upward buoyancy
        p.vx *= 0.96;
        p.vz *= 0.96;
      } else {
        p.vy -= 9.81 * dt; // gravity
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      const normLife = p.life / p.maxLife;
      posAttr.array[i * 3] = p.x;
      posAttr.array[i * 3 + 1] = p.y;
      posAttr.array[i * 3 + 2] = p.z;
      scaleAttr.array[i] = p.size * (1.0 + normLife * 0.65);
      alphaAttr.array[i] = (1.0 - normLife) * (p.isBubble ? 0.65 : 0.55);
    }

    posAttr.needsUpdate = true;
    scaleAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  }
}
