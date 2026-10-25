import * as THREE from './vendor/three.module.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { getWaveHeightAndNormal, getSeabedHeight } from './ocean.js';

/**
 * Authored 3-Zone Coastal Course + High-Poly 3D Open-Ocean World + Underwater Reef Environment
 *
 * Uses `MeshPhysicalMaterial`, `RoundedBoxGeometry`, `LatheGeometry`, displaced 3D coastal mountain/island
 * meshes, and full shadow casting (`castShadow = true; receiveShadow = true`) so every structure
 * reflects the physical Preetham `Sky` HDRI environment and casts real shadows on the water.
 */
export class CourseAndWorld {
  constructor(scene) {
    this.scene = scene;
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.gates = [];
    this.ramps = [];
    this.colliders = [];
    this.floatingBuoys = [];
    this.fishSchools = [];
    this.kelpClusters = [];
    this.godRayCones = [];

    this._buildCoastalHorizonAndLandmark();
    this._buildOpenOceanIslandsAndFeatures();
    this._buildAuthoredThreeZoneCourse();
    this._buildOpenOceanStuntRamps();
    this._buildUnderwaterEnvironment();

    // Enable 3D shadow casting/receiving on world meshes
    this.worldGroup.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }

  _buildCoastalHorizonAndLandmark() {
    const coastGroup = new THREE.Group();
    coastGroup.position.set(0, 0, -1350);
    this.worldGroup.add(coastGroup);

    const sandMat = new THREE.MeshStandardMaterial({ color: 0xdccbb4, roughness: 0.78 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x7a8794, roughness: 0.65 });
    const towerWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f8fc,
      roughness: 0.16,
      metalness: 0.22,
      clearcoat: 0.9,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e6b96,
      roughness: 0.08,
      metalness: 0.78,
      clearcoat: 1.0,
      reflectivity: 1.0,
    });

    // Sculpted 3D Coastal Headland & Mountain Ridge Mesh (replaces flat rectangles with organic 3D topography)
    const ridgeGeo = new THREE.PlaneGeometry(3600, 320, 140, 20);
    ridgeGeo.rotateX(-Math.PI / 2);
    const pos = ridgeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const distFromWaterEdge = Math.max(0, (160 - vz) / 320);
      const mountainElev =
        (Math.sin(vx * 0.0045) * 0.5 + 0.5) * 65 * Math.pow(distFromWaterEdge, 1.5) +
        (Math.cos(vx * 0.014 + vz * 0.01) * 0.5 + 0.5) * 28 * distFromWaterEdge;
      pos.setY(i, -1.0 + distFromWaterEdge * 8.0 + mountainElev);
    }
    ridgeGeo.computeVertexNormals();
    const ridgeMesh = new THREE.Mesh(ridgeGeo, sandMat);
    ridgeMesh.position.set(0, 0, -190);
    coastGroup.add(ridgeMesh);

    // Sculpted Island Causeway Peninsula for the Sail Landmark
    const peninsula = new THREE.Mesh(new THREE.CylinderGeometry(82, 108, 12, 36), stoneMat);
    peninsula.position.set(0, 3, 45);
    coastGroup.add(peninsula);

    // Iconic 3D Architectural Sail Tower Landmark (inspired by the horizon silhouette in reference photo)
    const sailTower = new THREE.Group();
    sailTower.position.set(0, 8, 45);
    coastGroup.add(sailTower);

    // Central spine mast
    const mast = new THREE.Mesh(
      new RoundedBoxGeometry(10, 238, 12, 4, 2.0),
      towerWhiteMat
    );
    mast.position.set(-14, 116, 0);
    sailTower.add(mast);

    // Sculpted Glass Billowing Sail Body using LatheGeometry
    const sailPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const radius = 12 + Math.sin(t * Math.PI * 0.88) * 24;
      sailPoints.push(new THREE.Vector2(radius, t * 195));
    }
    const sailBodyGeo = new THREE.LatheGeometry(sailPoints, 28, -Math.PI * 0.45, Math.PI * 0.9);
    const sailBody = new THREE.Mesh(sailBodyGeo, glassMat);
    sailBody.scale.set(1.15, 1.0, 0.72);
    sailBody.position.set(-4, 0, 0);
    sailTower.add(sailBody);

    // Outer curving structural exoskeleton arch ribs
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, 220, 0),
      new THREE.Vector3(26, 168, 0),
      new THREE.Vector3(40, 95, 0),
      new THREE.Vector3(28, 4, 0),
    ]);
    const archRib = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve, 40, 4.0, 16, false),
      towerWhiteMat
    );
    sailTower.add(archRib);

    // Horizontal structural cross-braces & cantilevered skybridge/helipad
    for (let h = 42; h <= 168; h += 28) {
      const brace = new THREE.Mesh(new RoundedBoxGeometry(44, 3.2, 20, 3, 0.8), towerWhiteMat);
      brace.position.set(8, h, 0);
      sailTower.add(brace);
    }

    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 2.5, 32), towerWhiteMat);
    helipad.position.set(24, 164, 0);
    sailTower.add(helipad);

    // Adjacent Wave-Crest Glass Resort Pavilion
    const wavePavilion = new THREE.Mesh(
      new THREE.CylinderGeometry(35, 58, 44, 28, 1, false, 0, Math.PI),
      glassMat
    );
    wavePavilion.rotation.z = 0.25;
    wavePavilion.position.set(-145, 18, -10);
    coastGroup.add(wavePavilion);

    // Sculpted 3D Glass & Steel Marina Towers along distant shoreline wings
    const towerClusters = [
      [-680, 68, 18], [-620, 92, 20], [-560, 56, 16],
      [640, 96, 20], [705, 118, 22], [770, 82, 18]
    ];
    for (const [bx, bh, br] of towerClusters) {
      const tGroup = new THREE.Group();
      tGroup.position.set(bx, 4, -95);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(br * 0.82, br, bh, 20), glassMat);
      core.position.y = bh * 0.5;
      tGroup.add(core);

      const spire = new THREE.Mesh(new THREE.CylinderGeometry(1.2, br * 0.5, 22, 12), towerWhiteMat);
      spire.position.y = bh + 10;
      tGroup.add(spire);
      coastGroup.add(tGroup);
    }
  }

  _buildOpenOceanIslandsAndFeatures() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x56636c,
      roughness: 0.78,
      metalness: 0.08,
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x2b6e3f,
      roughness: 0.72,
    });

    // 1. East Natural 3D Sea-Arch Island (`x = +260, z = -360`)
    const archGroup = new THREE.Group();
    archGroup.position.set(260, 0, -360);
    this.worldGroup.add(archGroup);

    // Sculpted 3D Arch Tube spanning between two rocky headlands
    const seaArchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-42, -6, 0),
      new THREE.Vector3(-34, 18, 0),
      new THREE.Vector3(0, 35, 0),
      new THREE.Vector3(34, 18, 0),
      new THREE.Vector3(42, -6, 0),
    ]);
    const seaArchMesh = new THREE.Mesh(
      new THREE.TubeGeometry(seaArchCurve, 36, 12.5, 16, false),
      rockMat
    );
    archGroup.add(seaArchMesh);

    const leftBase = new THREE.Mesh(new THREE.DodecahedronGeometry(24, 2), rockMat);
    leftBase.position.set(-36, 4, 0);
    leftBase.scale.set(1.1, 0.85, 1.2);
    archGroup.add(leftBase);
    this.colliders.push({ x: 260 - 36, z: -360, radius: 22, label: 'Sea Arch Pillar' });

    const rightBase = new THREE.Mesh(new THREE.DodecahedronGeometry(25, 2), rockMat);
    rightBase.position.set(36, 4, 0);
    rightBase.scale.set(1.1, 0.9, 1.2);
    archGroup.add(rightBase);
    this.colliders.push({ x: 260 + 36, z: -360, radius: 23, label: 'Sea Arch Pillar' });

    const topFoliage = new THREE.Mesh(new THREE.DodecahedronGeometry(22, 2), foliageMat);
    topFoliage.position.set(0, 42, 0);
    topFoliage.scale.set(1.7, 0.48, 0.85);
    archGroup.add(topFoliage);

    // 2. West Offshore Marine Research Platform (`x = -290, z = -520`)
    const rigGroup = new THREE.Group();
    rigGroup.position.set(-290, 0, -520);
    this.worldGroup.add(rigGroup);

    const steelMat = new THREE.MeshPhysicalMaterial({
      color: 0xe86f00,
      roughness: 0.28,
      metalness: 0.65,
      clearcoat: 0.6,
    });
    const deckMat = new THREE.MeshPhysicalMaterial({
      color: 0x35424e,
      roughness: 0.42,
      metalness: 0.55,
    });

    const legOffsets = [[-22, -22], [22, -22], [-22, 22], [22, 22]];
    for (const [lx, lz] of legOffsets) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 48, 20), steelMat);
      leg.position.set(lx, 6, lz);
      rigGroup.add(leg);
      this.colliders.push({ x: -290 + lx, z: -520 + lz, radius: 4.5, label: 'Platform Leg' });
    }

    const platformDeck = new THREE.Mesh(new RoundedBoxGeometry(64, 5.5, 64, 4, 1.2), deckMat);
    platformDeck.position.set(0, 26, 0);
    rigGroup.add(platformDeck);

    const radarDome = new THREE.Mesh(
      new THREE.SphereGeometry(9.5, 24, 18),
      new THREE.MeshPhysicalMaterial({ color: 0xf4f8fc, roughness: 0.2, clearcoat: 0.8 })
    );
    radarDome.position.set(-14, 35, -12);
    rigGroup.add(radarDome);
  }

  _buildAuthoredThreeZoneCourse() {
    const gateDefs = [
      // Zone 1: Sheltered Bay
      { id: 1, x: 0,   z: -55,  width: 28, heading: 0,     zone: 1, zoneName: 'ZONE 1 · SHELTERED BAY' },
      { id: 2, x: -10, z: -120, width: 26, heading: 0.10,  zone: 1, zoneName: 'ZONE 1 · SHELTERED BAY' },
      { id: 3, x: 6,   z: -195, width: 25, heading: -0.12, zone: 1, zoneName: 'ZONE 1 · SHELTERED BAY' },
      { id: 4, x: 0,   z: -275, width: 24, heading: 0,     zone: 1, zoneName: 'ZONE 1 · SHELTERED BAY' },

      // Zone 2: Slalom Channel
      { id: 5, x: -28, z: -360, width: 22, heading: 0.25,  zone: 2, zoneName: 'ZONE 2 · SLALOM CHANNEL' },
      { id: 6, x: 26,  z: -445, width: 22, heading: -0.32, zone: 2, zoneName: 'ZONE 2 · SLALOM CHANNEL' },
      { id: 7, x: -24, z: -530, width: 21, heading: 0.28,  zone: 2, zoneName: 'ZONE 2 · SLALOM CHANNEL' },
      { id: 8, x: 14,  z: -615, width: 22, heading: -0.15, zone: 2, zoneName: 'ZONE 2 · SLALOM CHANNEL' },

      // Zone 3: Open Jump Field
      { id: 9,  x: 0,   z: -700, width: 25, heading: 0,     zone: 3, zoneName: 'ZONE 3 · OPEN JUMP FIELD' },
      { id: 10, x: -16, z: -790, width: 25, heading: 0.12,  zone: 3, zoneName: 'ZONE 3 · OPEN JUMP FIELD' },
      { id: 11, x: 0,   z: -885, width: 26, heading: -0.06, zone: 3, zoneName: 'ZONE 3 · OPEN JUMP FIELD' },
      { id: 12, x: 0,   z: -990, width: 32, heading: 0,     zone: 3, zoneName: 'ZONE 3 · FINISH GATE', isFinish: true },
    ];

    for (const def of gateDefs) {
      const gateObj = this._createBuoyGate(def);
      this.gates.push(gateObj);
    }

    const courseRamps = [
      { x: 3,  z: -235, width: 12, length: 16, height: 2.3, heading: 0,    label: 'Bay Intro Ramp' },
      { x: 2,  z: -488, width: 11, length: 17, height: 3.1, heading: 0.12, label: 'Slalom Channel Ramp' },
      { x: -8, z: -745, width: 13, length: 19, height: 3.8, heading: 0.05, label: 'Open Swell Ramp' },
      { x: 0,  z: -935, width: 16, length: 23, height: 5.2, heading: 0,    label: 'Apex Big-Air Ramp', isApex: true },
    ];

    for (const rDef of courseRamps) {
      this._createFloatingRamp(rDef);
    }
  }

  _buildOpenOceanStuntRamps() {
    const stuntRamps = [
      { x: 110,  z: -180, width: 14, length: 20, height: 4.5, heading: -0.4, label: 'East Bay Kicker' },
      { x: -120, z: -220, width: 14, length: 20, height: 4.5, heading: 0.4,  label: 'West Bay Kicker' },
      { x: 260,  z: -325, width: 15, length: 22, height: 5.0, heading: 0.0,  label: 'Sea-Arch Launch Ramp', isApex: true },
      { x: -240, z: -490, width: 15, length: 22, height: 5.4, heading: 0.25, label: 'Rig Mega Ramp', isApex: true },
      { x: 140,  z: -680, width: 16, length: 24, height: 5.8, heading: -0.2, label: 'Offshore Mega Kicker', isApex: true },
    ];

    for (const rDef of stuntRamps) {
      this._createFloatingRamp(rDef);
    }
  }

  _createBuoyGate(def) {
    const group = new THREE.Group();
    group.position.set(def.x, 0, def.z);
    group.rotation.y = def.heading;
    this.worldGroup.add(group);

    const halfW = def.width * 0.5;
    const portColor = def.isFinish ? 0xffbe0b : 0xff4d00;
    const starboardColor = def.isFinish ? 0xffbe0b : 0x00b4d8;

    const leftBuoy = this._createSingleBuoy(portColor, def.isFinish ? 4.8 : 3.5);
    leftBuoy.position.set(-halfW, 0, 0);
    group.add(leftBuoy);

    const rightBuoy = this._createSingleBuoy(starboardColor, def.isFinish ? 4.8 : 3.5);
    rightBuoy.position.set(halfW, 0, 0);
    group.add(rightBuoy);

    if (def.id === 1 || def.isFinish) {
      const archMat = new THREE.MeshPhysicalMaterial({
        color: def.isFinish ? 0xffbe0b : 0x00a8cc,
        roughness: 0.22,
        metalness: 0.35,
        clearcoat: 0.85,
      });
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-halfW, 0.5, 0),
        new THREE.Vector3(-halfW * 0.85, 6.8, 0),
        new THREE.Vector3(0, 8.2, 0),
        new THREE.Vector3(halfW * 0.85, 6.8, 0),
        new THREE.Vector3(halfW, 0.5, 0),
      ]);
      const archTube = new THREE.Mesh(
        new THREE.TubeGeometry(archCurve, 32, 0.42, 14, false),
        archMat
      );
      group.add(archTube);
    }

    const gateRecord = {
      ...def,
      group,
      leftBuoy,
      rightBuoy,
      cleared: false,
    };

    this.floatingBuoys.push(
      { mesh: leftBuoy, worldX: def.x - Math.cos(def.heading) * halfW, worldZ: def.z + Math.sin(def.heading) * halfW },
      { mesh: rightBuoy, worldX: def.x + Math.cos(def.heading) * halfW, worldZ: def.z - Math.sin(def.heading) * halfW }
    );

    return gateRecord;
  }

  _createSingleBuoy(accentColor, height = 3.5) {
    const buoy = new THREE.Group();

    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a222a,
      roughness: 0.35,
      metalness: 0.3,
      clearcoat: 0.6,
    });
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: accentColor,
      roughness: 0.18,
      metalness: 0.12,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });
    const stripeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.16,
      clearcoat: 0.9,
    });

    // Torus pontoon collar at waterline
    const floatTorus = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.34, 16, 28), baseMat);
    floatTorus.rotation.x = Math.PI / 2;
    floatTorus.position.y = 0.22;
    buoy.add(floatTorus);

    const coneTower = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.92, height, 24), bodyMat);
    coneTower.position.y = 0.45 + height * 0.5;
    buoy.add(coneTower);

    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.68, height * 0.25, 24), stripeMat);
    stripe.position.y = 0.45 + height * 0.55;
    buoy.add(stripe);

    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentColor,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 16), beaconMat);
    beacon.position.y = 0.55 + height;
    buoy.add(beacon);

    return buoy;
  }

  _createFloatingRamp(rDef) {
    const group = new THREE.Group();
    group.position.set(rDef.x, 0, rDef.z);
    group.rotation.y = rDef.heading;
    this.worldGroup.add(group);

    const shape = new THREE.Shape();
    const L = rDef.length;
    const H = rDef.height;
    shape.moveTo(-L * 0.5, -0.6);
    shape.lineTo(L * 0.5, -0.6);
    shape.lineTo(L * 0.5, H);
    shape.quadraticCurveTo(0, H * 0.42, -L * 0.5, -0.15);
    shape.closePath();

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: rDef.width,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.10,
      bevelSegments: 4,
    });
    extrudeGeo.rotateY(-Math.PI / 2);
    extrudeGeo.translate(rDef.width * 0.5, 0, 0);

    const deckColor = rDef.isApex ? 0xff5400 : 0x0096c7;
    const rampMat = new THREE.MeshPhysicalMaterial({
      color: deckColor,
      roughness: 0.22,
      metalness: 0.18,
      clearcoat: 0.85,
    });
    const mesh = new THREE.Mesh(extrudeGeo, rampMat);
    group.add(mesh);

    const railMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd166,
      roughness: 0.2,
      metalness: 0.3,
      clearcoat: 0.8,
      emissive: 0x332200,
    });
    const railGeo = new RoundedBoxGeometry(0.48, 0.48, L, 4, 0.1);
    const slopeAngle = Math.atan2(H, L);

    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-rDef.width * 0.5 + 0.25, H * 0.48, 0);
    leftRail.rotation.x = slopeAngle;
    group.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(rDef.width * 0.5 - 0.25, H * 0.48, 0);
    rightRail.rotation.x = slopeAngle;
    group.add(rightRail);

    const rampObj = {
      ...rDef,
      group,
      slopeAngle,
    };
    this.ramps.push(rampObj);
    return rampObj;
  }

  _buildUnderwaterEnvironment() {
    this.underwaterGroup = new THREE.Group();
    this.scene.add(this.underwaterGroup);

    const seabedGeo = new THREE.PlaneGeometry(900, 900, 110, 110);
    seabedGeo.rotateX(-Math.PI / 2);

    this.seabedUniforms = {
      uTime: { value: 0 },
      uCraftPos: { value: new THREE.Vector3() },
    };

    const seabedMat = new THREE.ShaderMaterial({
      uniforms: this.seabedUniforms,
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          float h = -16.5
            + sin(worldPos.x * 0.018) * cos(worldPos.z * 0.018) * 4.2
            + sin(worldPos.x * 0.052 + worldPos.z * 0.041) * 1.8;
          worldPos.y = h;
          vWorldPos = worldPos;
          gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uCraftPos;
        varying vec3 vWorldPos;

        float causticPattern(vec2 uv, float t) {
          vec2 p = uv * 0.28;
          float c1 = abs(sin(p.x * 3.1 + t * 1.4 + cos(p.y * 2.7 - t * 1.1)));
          float c2 = abs(cos(p.x * 2.4 - t * 1.2 + sin(p.y * 3.5 + t * 1.6)));
          float net = pow(1.0 - min(c1, c2), 4.0);
          return clamp(net, 0.0, 1.0);
        }

        void main() {
          float dist = length(vWorldPos.xz - uCraftPos.xz);
          vec3 sandBase = vec3(0.06, 0.34, 0.44);
          vec3 reefRock = vec3(0.04, 0.22, 0.32);
          float heightMix = clamp((vWorldPos.y + 20.0) / 8.0, 0.0, 1.0);
          vec3 col = mix(reefRock, sandBase, heightMix);

          float caust = causticPattern(vWorldPos.xz, uTime) + causticPattern(vWorldPos.xz * 1.7 + 12.0, -uTime * 0.8) * 0.5;
          col += vec3(0.18, 0.78, 0.88) * caust * 0.55;

          float fog = smoothstep(25.0, 180.0, dist);
          vec3 uwFog = vec3(0.015, 0.26, 0.38);
          gl_FragColor = vec4(mix(col, uwFog, fog), 1.0);
        }
      `,
    });

    this.seabedMesh = new THREE.Mesh(seabedGeo, seabedMat);
    this.seabedMesh.frustumCulled = false;
    this.underwaterGroup.add(this.seabedMesh);

    const rayGeo = new THREE.ConeGeometry(8, 22, 12, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x56cfe1,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 14; i++) {
      const cone = new THREE.Mesh(rayGeo, rayMat);
      const angle = (i / 14) * Math.PI * 2;
      const dist = 12 + (i % 3) * 14;
      cone.userData = {
        offsetX: Math.cos(angle) * dist,
        offsetZ: Math.sin(angle) * dist,
        phase: i * 0.7,
      };
      cone.rotation.z = 0.18;
      cone.rotation.x = -0.12;
      this.underwaterGroup.add(cone);
      this.godRayCones.push(cone);
    }

    const coralColors = [0xff6b6b, 0xff9f1c, 0x2ec4b6, 0xb5179e, 0xf72585];
    const kelpMat = new THREE.MeshStandardMaterial({
      color: 0x1b7a43,
      roughness: 0.6,
      emissive: 0x052814,
    });

    for (let i = 0; i < 36; i++) {
      const cluster = new THREE.Group();
      const localX = ((i * 73) % 220) - 110;
      const localZ = ((i * 137) % 220) - 110;
      cluster.userData = { baseOffsetX: localX, baseOffsetZ: localZ, phase: i };

      const stalkHeight = 5 + (i % 4) * 1.8;
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, stalkHeight, 8), kelpMat);
      stalk.position.y = stalkHeight * 0.5;
      cluster.add(stalk);

      const cMat = new THREE.MeshStandardMaterial({
        color: coralColors[i % coralColors.length],
        roughness: 0.5,
        emissive: coralColors[i % coralColors.length],
        emissiveIntensity: 0.18,
      });
      const coral = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3 + (i % 3) * 0.5, 1), cMat);
      coral.position.set(1.2, 0.8, 0);
      cluster.add(coral);

      this.underwaterGroup.add(cluster);
      this.kelpClusters.push(cluster);
    }

    const fishGeo = new THREE.ConeGeometry(0.22, 0.85, 8);
    fishGeo.rotateX(Math.PI / 2);
    const fishMat = new THREE.MeshStandardMaterial({
      color: 0xffbe0b,
      emissive: 0x0077b6,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    });

    for (let s = 0; s < 8; s++) {
      const school = new THREE.Group();
      for (let f = 0; f < 9; f++) {
        const fish = new THREE.Mesh(fishGeo, fishMat);
        fish.position.set(
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 4.5
        );
        school.add(fish);
      }
      school.userData = {
        radius: 18 + s * 8,
        speed: 0.4 + (s % 3) * 0.15,
        phase: s * 1.3,
        depth: -4.2 - (s % 4) * 1.8,
      };
      this.underwaterGroup.add(school);
      this.fishSchools.push(school);
    }
  }

  sampleRampAt(x, z, waveSurfaceY) {
    for (let i = 0; i < this.ramps.length; i++) {
      const r = this.ramps[i];
      const dx = x - r.x;
      const dz = z - r.z;
      const cosH = Math.cos(-r.heading);
      const sinH = Math.sin(-r.heading);
      const lx = dx * cosH - dz * sinH;
      const lz = dx * sinH + dz * cosH;

      const halfW = r.width * 0.5;
      const halfL = r.length * 0.5;
      if (Math.abs(lx) <= halfW && Math.abs(lz) <= halfL) {
        const progress = (halfL - lz) / r.length;
        const curvedProgress = Math.pow(Math.max(0, Math.min(1, progress)), 1.25);
        const rampHeight = waveSurfaceY - 0.15 + curvedProgress * r.height;
        return {
          onRamp: true,
          height: rampHeight,
          slopeAngle: r.slopeAngle,
          progress,
          ramp: r,
        };
      }
    }
    return { onRamp: false, height: -999, slopeAngle: 0, progress: 0, ramp: null };
  }

  resetCourseGates() {
    for (const g of this.gates) {
      g.cleared = false;
    }
  }

  update(dt, elapsedTime, craftPos) {
    for (let i = 0; i < this.floatingBuoys.length; i++) {
      const b = this.floatingBuoys[i];
      const w = getWaveHeightAndNormal(b.worldX, b.worldZ, elapsedTime);
      b.mesh.position.y = w.height;
      b.mesh.rotation.z = w.normalX * 0.35;
      b.mesh.rotation.x = -w.normalZ * 0.35;
    }

    for (let i = 0; i < this.ramps.length; i++) {
      const r = this.ramps[i];
      const w = getWaveHeightAndNormal(r.x, r.z, elapsedTime);
      r.group.position.y = w.height;
      r.group.rotation.x = -w.normalZ * 0.18;
      r.group.rotation.z = w.normalX * 0.18;
    }

    this.seabedUniforms.uTime.value = elapsedTime;
    this.seabedUniforms.uCraftPos.value.copy(craftPos);
    const snap = 10.0;
    this.seabedMesh.position.x = Math.round(craftPos.x / snap) * snap;
    this.seabedMesh.position.z = Math.round(craftPos.z / snap) * snap;

    for (let i = 0; i < this.godRayCones.length; i++) {
      const cone = this.godRayCones[i];
      const ud = cone.userData;
      cone.position.set(
        craftPos.x + ud.offsetX + Math.sin(elapsedTime * 0.7 + ud.phase) * 2.5,
        -9.5,
        craftPos.z + ud.offsetZ + Math.cos(elapsedTime * 0.6 + ud.phase) * 2.5
      );
    }

    const cellSize = 220.0;
    for (let i = 0; i < this.kelpClusters.length; i++) {
      const c = this.kelpClusters[i];
      const ud = c.userData;
      const cellX = Math.round((craftPos.x - ud.baseOffsetX) / cellSize) * cellSize + ud.baseOffsetX;
      const cellZ = Math.round((craftPos.z - ud.baseOffsetZ) / cellSize) * cellSize + ud.baseOffsetZ;
      const bedY = getSeabedHeight(cellX, cellZ);
      c.position.set(cellX, bedY, cellZ);
      c.rotation.z = Math.sin(elapsedTime * 1.8 + ud.phase) * 0.14;
    }

    for (let i = 0; i < this.fishSchools.length; i++) {
      const school = this.fishSchools[i];
      const ud = school.userData;
      const ang = elapsedTime * ud.speed + ud.phase;
      const fx = craftPos.x + Math.cos(ang) * ud.radius;
      const fz = craftPos.z + Math.sin(ang) * ud.radius;
      school.position.set(fx, ud.depth + Math.sin(elapsedTime * 1.5 + i) * 0.6, fz);
      school.rotation.y = -ang + Math.PI;
    }
  }
}
