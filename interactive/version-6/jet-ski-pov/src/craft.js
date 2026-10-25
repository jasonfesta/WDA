import * as THREE from './vendor/three.module.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

/**
 * High-Fidelity PBR 3D Jet-Ski Cockpit, Sculpted Hull, & Handlebar Rig
 *
 * Uses `MeshPhysicalMaterial` with PMREM HDRI reflections, clearcoat wet-look gloss,
 * procedural normal/bump maps (wet carbon-polymer grain, diamond-knurled rubber grips,
 * brushed metallic anodized aluminum, ribbed footwell EVA foam, and 3D glistening
 * water droplets on the cowling), continuous hydro-formed 3D `TubeGeometry` handlebar bars,
 * sculpted forward bow hood & sponsons, and a sleek dark automotive/marine OLED glass-cockpit
 * telemetry display.
 */
export class CraftRig {
  constructor(scene) {
    this.scene = scene;

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.hullGroup = new THREE.Group();
    this.root.add(this.hullGroup);

    // Steering assembly positioned close to the camera just like `references/jet-ski-pov-photograph.jpg`
    this.steeringPivot = new THREE.Group();
    this.steeringPivot.position.set(0, 0.94, -0.34);
    this.steeringPivot.rotation.x = -0.20;
    this.hullGroup.add(this.steeringPivot);

    // Generate procedural PBR micro-detail bump/normal/roughness textures
    this.wetPolymerTex = this._createWetPolymerBumpTexture();
    this.knurledGripTex = this._createKnurledGripBumpTexture();
    this.ribbedDeckTex = this._createRibbedDeckTexture();
    this.carbonWeaveTex = this._createCarbonWeaveTexture();

    // High-resolution 1024x512 OLED Marine Glass-Cockpit Display Canvas
    this.dashCanvas = document.createElement('canvas');
    this.dashCanvas.width = 1024;
    this.dashCanvas.height = 512;
    this.dashCtx = this.dashCanvas.getContext('2d');
    this.dashTexture = new THREE.CanvasTexture(this.dashCanvas);
    this.dashTexture.minFilter = THREE.LinearFilter;
    this.dashTexture.magFilter = THREE.LinearFilter;
    this.dashTexture.colorSpace = THREE.SRGBColorSpace;

    this.showRiderHands = true;
    this.lanyardSwayX = 0;
    this.lanyardSwayZ = 0;

    this._buildSculptedHullAndCowling();
    this._buildDashboardCluster();
    this._buildHandlebarsAndControls();
    this._buildWaterDropletsOnCockpit();
    this._buildCoiledRedLanyard();
    this._buildRiderRightHand();

    // Enable real 3D shadow casting & receiving across all cockpit/hull meshes
    this.root.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    this.updateDashboard(0, 0, 100, 0, 'READY');
  }

  _buildSculptedHullAndCowling() {
    // 1. Marine Glossy White Gelcoat Hull (`MeshPhysicalMaterial` with clearcoat)
    const whiteGelcoatMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f8fc,
      roughness: 0.10,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });

    // 2. Wet Textured Dark Marine Polymer (`MeshPhysicalMaterial` with water-spotted bump & roughness map)
    const wetDarkPolymerMat = new THREE.MeshPhysicalMaterial({
      color: 0x181f26,
      roughness: 0.26,
      metalness: 0.16,
      bumpMap: this.wetPolymerTex,
      bumpScale: 0.004,
      roughnessMap: this.wetPolymerTex,
      clearcoat: 0.88,
      clearcoatRoughness: 0.10,
    });

    // 3. Glossy Carbon-Black Central Hood Cowling
    const carbonHoodMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1319,
      roughness: 0.12,
      metalness: 0.24,
      bumpMap: this.carbonWeaveTex,
      bumpScale: 0.0028,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    // 4. Metallic Cyan/Teal Marine Accent Trim
    const cyanAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x00b4d8,
      roughness: 0.18,
      metalness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    // 5. Ribbed Non-Slip Hydro-Turf Footwell Deck Mats
    const footwellMat = new THREE.MeshStandardMaterial({
      color: 0x323941,
      roughness: 0.72,
      metalness: 0.06,
      map: this.ribbedDeckTex,
      bumpMap: this.ribbedDeckTex,
      bumpScale: 0.018,
    });

    // Smooth sculpted V-hull outer body
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 2.15);
    hullShape.bezierCurveTo(0.46, 1.62, 0.65, 0.78, 0.66, 0.0);
    hullShape.lineTo(0.58, -1.75);
    hullShape.quadraticCurveTo(0, -1.86, -0.58, -1.75);
    hullShape.lineTo(-0.66, 0.0);
    hullShape.bezierCurveTo(-0.65, 0.78, -0.46, 1.62, 0, 2.15);

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
      steps: 2,
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.14,
      bevelSegments: 10,
    });
    hullGeo.rotateX(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, whiteGelcoatMat);
    hullMesh.position.set(0, 0.35, 0);
    this.hullGroup.add(hullMesh);

    // Sculpted Forward Bow Nose Fairing & Splash Deflector Visible Ahead of the Instrument Hood in 1P POV!
    const bowCrestCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.90, -0.82),
      new THREE.Vector3(0, 0.78, -1.35),
      new THREE.Vector3(0, 0.56, -1.92),
      new THREE.Vector3(0, 0.38, -2.18),
    ]);
    const bowCrestSpine = new THREE.Mesh(
      new THREE.TubeGeometry(bowCrestCurve, 28, 0.16, 16, false),
      carbonHoodMat
    );
    bowCrestSpine.scale.set(1.55, 0.52, 1.0);
    this.hullGroup.add(bowCrestSpine);

    // Forward White Gelcoat Bow Cheek Fairings (Left & Right visible past the mirrors)
    const cheekGeo = new RoundedBoxGeometry(0.28, 0.20, 1.05, 6, 0.08);
    const leftCheek = new THREE.Mesh(cheekGeo, whiteGelcoatMat);
    leftCheek.position.set(-0.22, 0.64, -1.26);
    leftCheek.rotation.set(0.22, 0.24, 0.18);
    this.hullGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, whiteGelcoatMat);
    rightCheek.position.set(0.22, 0.64, -1.26);
    rightCheek.rotation.set(0.22, -0.24, -0.18);
    this.hullGroup.add(rightCheek);

    // Forward Cyan Aero Intake Strakes
    const strakeGeo = new RoundedBoxGeometry(0.06, 0.08, 0.78, 4, 0.025);
    const leftStrake = new THREE.Mesh(strakeGeo, cyanAccentMat);
    leftStrake.position.set(-0.34, 0.58, -1.16);
    leftStrake.rotation.set(0.18, 0.25, 0.25);
    this.hullGroup.add(leftStrake);

    const rightStrake = new THREE.Mesh(strakeGeo, cyanAccentMat);
    rightStrake.position.set(0.34, 0.58, -1.16);
    rightStrake.rotation.set(0.18, -0.25, -0.25);
    this.hullGroup.add(rightStrake);

    // Dark Rubber Nose Bumper Tip at Bow Apex
    const noseBumper = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 20, 16),
      wetDarkPolymerMat
    );
    noseBumper.scale.set(1.2, 0.65, 1.35);
    noseBumper.position.set(0, 0.36, -2.14);
    this.hullGroup.add(noseBumper);

    // Sculpted 3D Dark Gunwale Rub-Rail & Side Sponsons
    const rubRailCurveLeft = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.32, -2.14),
      new THREE.Vector3(-0.53, 0.33, -1.12),
      new THREE.Vector3(-0.69, 0.31, 0.0),
      new THREE.Vector3(-0.62, 0.28, 1.72),
    ]);
    const leftRail = new THREE.Mesh(
      new THREE.TubeGeometry(rubRailCurveLeft, 36, 0.058, 14, false),
      wetDarkPolymerMat
    );
    this.hullGroup.add(leftRail);

    const rubRailCurveRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, 0.32, -2.14),
      new THREE.Vector3(0.53, 0.33, -1.12),
      new THREE.Vector3(0.69, 0.31, 0.0),
      new THREE.Vector3(0.62, 0.28, 1.72),
    ]);
    const rightRail = new THREE.Mesh(
      new THREE.TubeGeometry(rubRailCurveRight, 36, 0.058, 14, false),
      wetDarkPolymerMat
    );
    this.hullGroup.add(rightRail);

    // Port & Starboard Ribbed Footwell Mats (RoundedBoxGeometry)
    const footMatGeo = new RoundedBoxGeometry(0.26, 0.035, 1.62, 4, 0.012);
    const leftFootMat = new THREE.Mesh(footMatGeo, footwellMat);
    leftFootMat.position.set(-0.42, 0.48, 0.16);
    leftFootMat.rotation.z = 0.09;
    leftFootMat.rotation.y = 0.05;
    this.hullGroup.add(leftFootMat);

    const rightFootMat = new THREE.Mesh(footMatGeo, footwellMat);
    rightFootMat.position.set(0.42, 0.48, 0.16);
    rightFootMat.rotation.z = -0.09;
    rightFootMat.rotation.y = -0.05;
    this.hullGroup.add(rightFootMat);

    // Sculpted Central Glossy Cowling Dome (matches dark reflective center console in reference photo)
    const cowlingGeo = new RoundedBoxGeometry(0.54, 0.44, 1.28, 8, 0.18);
    const cowlingMesh = new THREE.Mesh(cowlingGeo, carbonHoodMat);
    cowlingMesh.position.set(0, 0.62, -0.38);
    cowlingMesh.rotation.x = 0.14;
    this.hullGroup.add(cowlingMesh);

    // Upper Steering Column Neck Boot with Flexible Accordion Ribs
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.82, -0.30);
    neckGroup.rotation.x = -0.25;
    this.hullGroup.add(neckGroup);

    const neckBoot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.23, 0.28, 28),
      wetDarkPolymerMat
    );
    neckGroup.add(neckBoot);

    for (let r = 0; r < 3; r++) {
      const bellowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.165 + r * 0.018, 0.016, 12, 28),
        wetDarkPolymerMat
      );
      bellowRing.rotation.x = Math.PI / 2;
      bellowRing.position.y = 0.06 - r * 0.055;
      neckGroup.add(bellowRing);
    }

    // Lower Console Membrane Switch Panel (`SPEED/RPM`, `VOLT/HOUR`, `START/STOP`, `MODE/RESET` from photo)
    const lowerPanelGroup = new THREE.Group();
    lowerPanelGroup.position.set(0, 0.77, -0.11);
    lowerPanelGroup.rotation.x = -0.48;
    this.hullGroup.add(lowerPanelGroup);

    const panelPlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.34, 0.19, 0.04, 4, 0.012),
      wetDarkPolymerMat
    );
    lowerPanelGroup.add(panelPlate);

    const chromeBtnMat = new THREE.MeshPhysicalMaterial({
      color: 0xc2ceda,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.9,
    });
    const positions = [
      [-0.095, 0.042],
      [-0.095, -0.042],
      [0.095, 0.042],
      [0.095, -0.042],
    ];
    for (const [bx, by] of positions) {
      const bezel = new THREE.Mesh(
        new RoundedBoxGeometry(0.088, 0.052, 0.022, 3, 0.006),
        carbonHoodMat
      );
      bezel.position.set(bx, by, 0.018);
      lowerPanelGroup.add(bezel);

      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.028, 18), chromeBtnMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(bx, by, 0.026);
      lowerPanelGroup.add(btn);
    }

    // Sculpted Bolstered Two-Tone Marine Seat & Rear Jet Pump Nozzle (for 3D Chase Cam / Orbit view)
    const seatBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.50, 0.24, 1.08, 6, 0.09),
      wetDarkPolymerMat
    );
    seatBase.position.set(0, 0.64, 0.56);
    this.hullGroup.add(seatBase);

    const seatBolster = new THREE.Mesh(
      new RoundedBoxGeometry(0.46, 0.16, 0.52, 6, 0.07),
      new THREE.MeshPhysicalMaterial({ color: 0x222c36, roughness: 0.42, clearcoat: 0.35 })
    );
    seatBolster.position.set(0, 0.74, 0.78);
    this.hullGroup.add(seatBolster);

    // Stern Boarding Grab Handle & Jet Pump Nozzle
    const grabCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 0.58, 1.12),
      new THREE.Vector3(-0.14, 0.66, 1.24),
      new THREE.Vector3(0.14, 0.66, 1.24),
      new THREE.Vector3(0.18, 0.58, 1.12),
    ]);
    const grabBar = new THREE.Mesh(
      new THREE.TubeGeometry(grabCurve, 20, 0.018, 10, false),
      chromeBtnMat
    );
    this.hullGroup.add(grabBar);
  }

  _buildDashboardCluster() {
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x121820,
      roughness: 0.22,
      metalness: 0.20,
      bumpMap: this.wetPolymerTex,
      bumpScale: 0.003,
      clearcoat: 0.78,
    });

    const whiteFairingMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f8fc,
      roughness: 0.10,
      metalness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xdce6f0,
      roughness: 0.12,
      metalness: 0.94,
      clearcoat: 1.0,
    });

    const browGroup = new THREE.Group();
    browGroup.position.set(0, 0.96, -0.68);
    this.hullGroup.add(browGroup);

    // Sculpted arched instrument hood brow
    const hoodArchGeo = new THREE.CylinderGeometry(0.30, 0.36, 0.40, 36, 1, false, -Math.PI * 0.48, Math.PI * 0.96);
    hoodArchGeo.rotateZ(Math.PI / 2);
    hoodArchGeo.rotateY(Math.PI / 2);
    const hoodArch = new THREE.Mesh(hoodArchGeo, visorMat);
    hoodArch.scale.set(1.18, 0.58, 1.0);
    hoodArch.position.set(0, 0.04, 0);
    browGroup.add(hoodArch);

    // Recessed Dark Instrument Cavity Backplate
    const cavityBack = new THREE.Mesh(
      new RoundedBoxGeometry(0.43, 0.22, 0.09, 5, 0.024),
      visorMat
    );
    cavityBack.position.set(0, 0.02, 0.06);
    cavityBack.rotation.x = -0.18;
    browGroup.add(cavityBack);

    // Sleek White Side Mirror Fairing Wings + Reflective Mirror Glass (matching reference photo!)
    const wingGeo = new RoundedBoxGeometry(0.25, 0.115, 0.32, 6, 0.038);
    const leftWing = new THREE.Mesh(wingGeo, whiteFairingMat);
    leftWing.position.set(-0.295, -0.02, 0.05);
    leftWing.rotation.y = 0.34;
    leftWing.rotation.z = 0.18;
    browGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, whiteFairingMat);
    rightWing.position.set(0.295, -0.02, 0.05);
    rightWing.rotation.y = -0.34;
    rightWing.rotation.z = -0.18;
    browGroup.add(rightWing);

    // Mirror glass inserts on inside of left/right fairings
    const mirrorGlassGeo = new RoundedBoxGeometry(0.115, 0.068, 0.02, 3, 0.008);
    const leftMirror = new THREE.Mesh(mirrorGlassGeo, chromeMat);
    leftMirror.position.set(-0.225, -0.005, 0.145);
    leftMirror.rotation.y = 0.25;
    browGroup.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGlassGeo, chromeMat);
    rightMirror.position.set(0.225, -0.005, 0.145);
    rightMirror.rotation.y = -0.25;
    browGroup.add(rightMirror);

    // Recessed Live Marine OLED Telemetry Screen
    const screenGeo = new THREE.PlaneGeometry(0.365, 0.182);
    const screenMat = new THREE.MeshStandardMaterial({
      map: this.dashTexture,
      roughness: 0.15,
      metalness: 0.12,
      emissive: 0xffffff,
      emissiveMap: this.dashTexture,
      emissiveIntensity: 0.62,
    });
    this.dashScreen = new THREE.Mesh(screenGeo, screenMat);
    this.dashScreen.position.set(0, 0.02, 0.108);
    this.dashScreen.rotation.x = -0.18;
    browGroup.add(this.dashScreen);

    // 3D Physical Brushed-Chrome Center Tachometer Bezel Ring (`TorusGeometry` for true 3D depth)
    const torusBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.0075, 18, 56),
      chromeMat
    );
    torusBezel.position.set(0, 0.02, 0.114);
    torusBezel.rotation.x = -0.18;
    browGroup.add(torusBezel);

    // Physical Clear Protective Anti-Glare Glass Lens over Gauge Cluster
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.04,
      metalness: 0.1,
      clearcoat: 1.0,
      reflectivity: 1.0,
    });
    const glassCover = new THREE.Mesh(new THREE.PlaneGeometry(0.37, 0.185), lensGlassMat);
    glassCover.position.set(0, 0.022, 0.118);
    glassCover.rotation.x = -0.18;
    browGroup.add(glassCover);
  }

  _buildHandlebarsAndControls() {
    // Wet Dark Textured Handlebar Yoke Material (matches water-spotted black crossbar in reference photo!)
    const wetYokeMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d242c,
      roughness: 0.24,
      metalness: 0.24,
      bumpMap: this.wetPolymerTex,
      bumpScale: 0.0055,
      roughnessMap: this.wetPolymerTex,
      clearcoat: 0.92,
      clearcoatRoughness: 0.10,
    });

    // Brushed Silver Metallic Center Pad (matches central silver oval cover in reference photo!)
    const brushedSilverPadMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4dce4,
      roughness: 0.22,
      metalness: 0.62,
      bumpMap: this.wetPolymerTex,
      bumpScale: 0.002,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
    });

    // Knurled Textured Ergonomic Rubber Grips
    const knurledRubberMat = new THREE.MeshPhysicalMaterial({
      color: 0x11151a,
      roughness: 0.65,
      metalness: 0.06,
      bumpMap: this.knurledGripTex,
      bumpScale: 0.012,
      clearcoat: 0.28,
    });

    const switchPodMat = new THREE.MeshPhysicalMaterial({
      color: 0x161d24,
      roughness: 0.30,
      metalness: 0.20,
      bumpMap: this.wetPolymerTex,
      bumpScale: 0.003,
      clearcoat: 0.68,
    });

    const billetAluminumMat = new THREE.MeshPhysicalMaterial({
      color: 0x9aa8b6,
      roughness: 0.20,
      metalness: 0.85,
      clearcoat: 0.85,
    });

    // 1. Continuous Hydro-Formed 3D Swept Handlebar Tube + Sculpted Aero Yoke Shroud
    const mainBarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, -0.045, 0.115),
      new THREE.Vector3(-0.31, -0.008, 0.048),
      new THREE.Vector3(-0.16, 0.022, 0.005),
      new THREE.Vector3(0.0, 0.026, 0.0),
      new THREE.Vector3(0.16, 0.022, 0.005),
      new THREE.Vector3(0.31, -0.008, 0.048),
      new THREE.Vector3(0.48, -0.045, 0.115),
    ]);
    const mainBarTube = new THREE.Mesh(
      new THREE.TubeGeometry(mainBarCurve, 48, 0.028, 16, false),
      wetYokeMat
    );
    this.steeringPivot.add(mainBarTube);

    // Sculpted Aero Yoke Clamshell Shroud over Center & Inner Arms
    const centerShroud = new THREE.Mesh(
      new RoundedBoxGeometry(0.44, 0.096, 0.112, 8, 0.036),
      wetYokeMat
    );
    centerShroud.position.set(0, 0.02, 0.004);
    this.steeringPivot.add(centerShroud);

    const armShroudGeo = new RoundedBoxGeometry(0.20, 0.082, 0.096, 6, 0.028);
    const leftShroud = new THREE.Mesh(armShroudGeo, wetYokeMat);
    leftShroud.position.set(-0.245, 0.004, 0.030);
    leftShroud.rotation.y = 0.24;
    leftShroud.rotation.z = 0.12;
    this.steeringPivot.add(leftShroud);

    const rightShroud = new THREE.Mesh(armShroudGeo, wetYokeMat);
    rightShroud.position.set(0.245, 0.004, 0.030);
    rightShroud.rotation.y = -0.24;
    rightShroud.rotation.z = -0.12;
    this.steeringPivot.add(rightShroud);

    // 2. Sculpted Central Brushed-Silver Handlebar Cover with Recessed Channel Grooves (1:1 with photo)
    const padGroup = new THREE.Group();
    padGroup.position.set(0, 0.032, 0.026);
    padGroup.rotation.x = 0.15;
    this.steeringPivot.add(padGroup);

    const padCore = new THREE.Mesh(
      new RoundedBoxGeometry(0.26, 0.105, 0.13, 8, 0.048),
      brushedSilverPadMat
    );
    padGroup.add(padCore);

    // Subtle dark recessed channel grooves flanking the center emblem boss
    const grooveMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a222a,
      roughness: 0.35,
      metalness: 0.3,
    });
    const grooveGeo = new RoundedBoxGeometry(0.010, 0.092, 0.126, 3, 0.004);
    const leftGroove = new THREE.Mesh(grooveGeo, grooveMat);
    leftGroove.position.set(-0.062, 0.01, 0.006);
    leftGroove.rotation.z = -0.14;
    padGroup.add(leftGroove);

    const rightGroove = new THREE.Mesh(grooveGeo, grooveMat);
    rightGroove.position.set(0.062, 0.01, 0.006);
    rightGroove.rotation.z = 0.14;
    padGroup.add(rightGroove);

    // Center Raised Brushed Emblem Boss
    const centerBoss = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.028, 0.014, 24),
      billetAluminumMat
    );
    centerBoss.rotation.x = Math.PI / 2;
    centerBoss.position.set(0, 0.006, 0.062);
    padGroup.add(centerBoss);

    // Mounting hex bolts on the handlebar yoke
    const boltMat = new THREE.MeshPhysicalMaterial({ color: 0x0e1217, metalness: 0.85, roughness: 0.22 });
    const boltCoords = [
      [-0.155, 0.018, 0.056],
      [-0.145, -0.022, 0.056],
      [0.155, 0.018, 0.056],
      [0.145, -0.022, 0.056],
    ];
    for (const [bx, by, bz] of boltCoords) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.016, 6), boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(bx, by, bz);
      this.steeringPivot.add(bolt);
    }

    // 3. Left Switch Pod (`RIDE`, `TRIM` rockers, red `STOP` button, kill-switch post)
    const leftPod = new THREE.Group();
    leftPod.position.set(-0.275, -0.005, 0.046);
    leftPod.rotation.y = 0.24;
    leftPod.rotation.z = 0.10;
    this.steeringPivot.add(leftPod);

    const leftPodHousing = new THREE.Mesh(
      new RoundedBoxGeometry(0.125, 0.115, 0.12, 6, 0.024),
      switchPodMat
    );
    leftPod.add(leftPodHousing);

    const redBtnMat = new THREE.MeshPhysicalMaterial({
      color: 0xe62419,
      roughness: 0.22,
      clearcoat: 0.9,
    });
    const stopBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.022, 20), redBtnMat);
    stopBtn.rotation.x = Math.PI / 2;
    stopBtn.position.set(-0.014, -0.028, 0.056);
    leftPod.add(stopBtn);

    const greyBtnMat = new THREE.MeshPhysicalMaterial({
      color: 0x9aa6b2,
      roughness: 0.28,
      metalness: 0.45,
      clearcoat: 0.6,
    });
    const trimUp = new THREE.Mesh(new RoundedBoxGeometry(0.026, 0.018, 0.02, 3, 0.004), greyBtnMat);
    trimUp.position.set(-0.038, 0.006, 0.056);
    leftPod.add(trimUp);

    const trimDown = new THREE.Mesh(new RoundedBoxGeometry(0.026, 0.018, 0.02, 3, 0.004), greyBtnMat);
    trimDown.position.set(-0.038, -0.022, 0.056);
    leftPod.add(trimDown);

    const postPlug = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.023, 0.034, 20), knurledRubberMat);
    postPlug.rotation.x = Math.PI / 2 - 0.35;
    postPlug.position.set(0.02, 0.034, 0.054);
    leftPod.add(postPlug);

    this.lanyardAttachLocal = new THREE.Vector3(-0.245, 0.026, 0.096);

    // 4. Right Switch Pod (`CRUISE ASSIST` rockers, blue `NO-WAKE MODE` button, & Right Index-Finger Throttle Trigger)
    const rightPod = new THREE.Group();
    rightPod.position.set(0.275, -0.005, 0.046);
    rightPod.rotation.y = -0.24;
    rightPod.rotation.z = -0.10;
    this.steeringPivot.add(rightPod);

    const rightPodHousing = new THREE.Mesh(
      new RoundedBoxGeometry(0.12, 0.115, 0.12, 6, 0.024),
      switchPodMat
    );
    rightPod.add(rightPodHousing);

    const blueBtnMat = new THREE.MeshPhysicalMaterial({
      color: 0x1964ff,
      roughness: 0.22,
      clearcoat: 0.9,
    });
    const blueBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.022, 20), blueBtnMat);
    blueBtn.rotation.x = Math.PI / 2;
    blueBtn.position.set(-0.022, -0.03, 0.056);
    rightPod.add(blueBtn);

    const cruiseUp = new THREE.Mesh(new RoundedBoxGeometry(0.026, 0.018, 0.02, 3, 0.004), greyBtnMat);
    cruiseUp.position.set(0.024, 0.006, 0.056);
    rightPod.add(cruiseUp);

    const cruiseDown = new THREE.Mesh(new RoundedBoxGeometry(0.026, 0.018, 0.02, 3, 0.004), greyBtnMat);
    cruiseDown.position.set(0.024, -0.022, 0.056);
    rightPod.add(cruiseDown);

    // 5. Left & Right Knurled Ergonomic Grips with Palm Rest Flange, Anodized Bar-End Caps, & Levers
    const leftGripGroup = new THREE.Group();
    leftGripGroup.position.set(-0.435, -0.032, 0.09);
    leftGripGroup.rotation.y = 0.28;
    leftGripGroup.rotation.z = 0.14;
    this.steeringPivot.add(leftGripGroup);

    const gripCoreGeo = new THREE.CylinderGeometry(0.024, 0.028, 0.22, 28);
    gripCoreGeo.rotateZ(Math.PI / 2);
    const leftGripMesh = new THREE.Mesh(gripCoreGeo, knurledRubberMat);
    leftGripGroup.add(leftGripMesh);

    // Inner & Outer Billet Aluminum Grip Collars
    const innerCollarGeo = new THREE.CylinderGeometry(0.030, 0.030, 0.016, 24);
    innerCollarGeo.rotateZ(Math.PI / 2);
    const leftInnerCollar = new THREE.Mesh(innerCollarGeo, billetAluminumMat);
    leftInnerCollar.position.set(0.105, 0, 0);
    leftGripGroup.add(leftInnerCollar);

    const leftEndCap = new THREE.Mesh(innerCollarGeo, billetAluminumMat);
    leftEndCap.position.set(-0.112, 0, 0);
    leftGripGroup.add(leftEndCap);

    const palmFlangeGeo = new THREE.SphereGeometry(0.035, 20, 16);
    palmFlangeGeo.scale(1.65, 0.65, 1.35);
    const leftFlange = new THREE.Mesh(palmFlangeGeo, knurledRubberMat);
    leftFlange.position.set(-0.075, -0.008, 0.014);
    leftGripGroup.add(leftFlange);

    // Sculpted Left Brake/Reverse Lever (`RiDE` lever)
    const leverMat = new THREE.MeshPhysicalMaterial({
      color: 0x35404d,
      roughness: 0.22,
      metalness: 0.82,
      clearcoat: 0.85,
    });
    const leftLeverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, -0.006, -0.032),
      new THREE.Vector3(0.01, -0.008, -0.056),
      new THREE.Vector3(-0.065, -0.010, -0.050),
    ]);
    this.leftBrakeLever = new THREE.Mesh(
      new THREE.TubeGeometry(leftLeverCurve, 16, 0.009, 10, false),
      leverMat
    );
    leftGripGroup.add(this.leftBrakeLever);

    const rightGripGroup = new THREE.Group();
    rightGripGroup.position.set(0.435, -0.032, 0.09);
    rightGripGroup.rotation.y = -0.28;
    rightGripGroup.rotation.z = -0.14;
    this.steeringPivot.add(rightGripGroup);

    const rightGripMesh = new THREE.Mesh(gripCoreGeo, knurledRubberMat);
    rightGripGroup.add(rightGripMesh);

    const rightInnerCollar = new THREE.Mesh(innerCollarGeo, billetAluminumMat);
    rightInnerCollar.position.set(-0.105, 0, 0);
    rightGripGroup.add(rightInnerCollar);

    const rightEndCap = new THREE.Mesh(innerCollarGeo, billetAluminumMat);
    rightEndCap.position.set(0.112, 0, 0);
    rightGripGroup.add(rightEndCap);

    const rightFlange = new THREE.Mesh(palmFlangeGeo, knurledRubberMat);
    rightFlange.position.set(0.075, -0.008, 0.014);
    rightGripGroup.add(rightFlange);

    // Sculpted Right Index-Finger Throttle Trigger Lever
    const rightTriggerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, -0.005, -0.032),
      new THREE.Vector3(-0.01, -0.008, -0.054),
      new THREE.Vector3(0.055, -0.010, -0.046),
    ]);
    this.rightThrottleLever = new THREE.Mesh(
      new THREE.TubeGeometry(rightTriggerCurve, 16, 0.0085, 10, false),
      leverMat
    );
    rightGripGroup.add(this.rightThrottleLever);
  }

  /**
   * Adds 3D glistening water droplets across the dark handlebar yoke and center cowling
   * just like the wet water beads visible in `references/jet-ski-pov-photograph.jpg`!
   */
  _buildWaterDropletsOnCockpit() {
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xe8f7fc,
      transparent: true,
      opacity: 0.68,
      roughness: 0.02,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 1.333,
      reflectivity: 1.0,
    });

    const dropGeo = new THREE.SphereGeometry(0.0045, 8, 6);
    dropGeo.scale(1.2, 0.45, 1.1);

    const dropletGroup = new THREE.Group();
    this.steeringPivot.add(dropletGroup);

    for (let i = 0; i < 46; i++) {
      const drop = new THREE.Mesh(dropGeo, dropletMat);
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (0.035 + ((i * 19) % 24) * 0.01);
      const y = 0.048 + Math.sin(i * 1.7) * 0.018;
      const z = 0.03 + Math.cos(i * 2.3) * 0.025;
      drop.position.set(x, y, z);
      const s = 0.65 + (i % 5) * 0.25;
      drop.scale.setScalar(s);
      dropletGroup.add(drop);
    }
  }

  _buildCoiledRedLanyard() {
    this.lanyardMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2214,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0x330400,
    });

    this.lanyardGroup = new THREE.Group();
    this.steeringPivot.add(this.lanyardGroup);

    this.lanyardMesh = null;
    this._updateLanyardGeometry(0, 0);
  }

  _updateLanyardGeometry(swayX, swayZ) {
    const points = [];
    const start = this.lanyardAttachLocal;
    const segments = 96;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const dropY = start.y - t * 0.44;
      const baseX = start.x + t * 0.07 + swayX * (t * t);
      const baseZ = start.z + t * 0.14 + swayZ * (t * t);

      let coilX = 0;
      let coilY = 0;
      let coilZ = 0;
      if (t > 0.25) {
        const ct = (t - 0.25) / 0.75;
        const turns = 6.8 * Math.PI * 2.0;
        const angle = ct * turns;
        const radius = 0.025 * Math.sin(Math.min(1.0, ct * 4.0) * (Math.PI / 2));
        coilX = Math.cos(angle) * radius;
        coilZ = Math.sin(angle) * radius;
        coilY = Math.sin(angle * 0.5) * 0.005;
      }

      points.push(new THREE.Vector3(baseX + coilX, dropY + coilY, baseZ + coilZ));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 90, 0.0072, 10, false);

    if (this.lanyardMesh) {
      this.lanyardMesh.geometry.dispose();
      this.lanyardMesh.geometry = tubeGeo;
    } else {
      this.lanyardMesh = new THREE.Mesh(tubeGeo, this.lanyardMat);
      this.lanyardMesh.castShadow = true;
      this.lanyardGroup.add(this.lanyardMesh);
    }
  }

  _buildRiderRightHand() {
    this.riderHandGroup = new THREE.Group();
    this.steeringPivot.add(this.riderHandGroup);

    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xdca482,
      roughness: 0.50,
      metalness: 0.02,
      clearcoat: 0.30, // wet sun-kissed skin sheen
      clearcoatRoughness: 0.32,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xffbfa0),
    });

    const neopreneCuffMat = new THREE.MeshPhysicalMaterial({
      color: 0x141b22,
      roughness: 0.55,
      metalness: 0.1,
      clearcoat: 0.4,
    });

    // Sculpted palm + 4 articulated fingers wrapped around the right throttle grip
    const handPalm = new THREE.Mesh(
      new RoundedBoxGeometry(0.088, 0.044, 0.082, 5, 0.018),
      skinMat
    );
    handPalm.position.set(0.395, -0.012, 0.094);
    handPalm.rotation.set(0.22, -0.25, -0.18);
    this.riderHandGroup.add(handPalm);

    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.036, 8, 12), skinMat);
      finger.position.set(0.365 + f * 0.019, -0.015 - f * 0.003, 0.058);
      finger.rotation.set(1.15, 0.0, -0.15);
      this.riderHandGroup.add(finger);
    }

    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.042, 8, 12), skinMat);
    thumb.position.set(0.345, -0.024, 0.108);
    thumb.rotation.set(0.4, 0.35, 1.15);
    this.riderHandGroup.add(thumb);

    // Sport marine watch / wrist band on right wrist
    const wristBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.037, 0.039, 0.026, 20),
      neopreneCuffMat
    );
    wristBand.position.set(0.435, -0.05, 0.16);
    wristBand.rotation.set(0.65, -0.45, -0.35);
    this.riderHandGroup.add(wristBand);

    const forearmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.405, -0.02, 0.115),
      new THREE.Vector3(0.495, -0.11, 0.265),
      new THREE.Vector3(0.59, -0.22, 0.45),
    ]);
    const forearmGeo = new THREE.TubeGeometry(forearmCurve, 24, 0.039, 16, false);
    const forearmMesh = new THREE.Mesh(forearmGeo, skinMat);
    this.riderHandGroup.add(forearmMesh);
  }

  _createWetPolymerBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const v = 110 + Math.floor(Math.random() * 36);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, y, 2, 2);
    }
    for (let i = 0; i < 55; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 3 + Math.random() * 9;
      const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      grad.addColorStop(0, 'rgba(220,220,220,0.85)');
      grad.addColorStop(0.8, 'rgba(160,160,160,0.5)');
      grad.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  _createKnurledGripBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#606060';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 2;
    for (let i = -128; i < 256; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 128, 128);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i + 128, 0);
      ctx.lineTo(i, 128);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    return tex;
  }

  _createCarbonWeaveTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#707070';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#989898';
    for (let y = 0; y < 64; y += 8) {
      for (let x = 0; x < 64; x += 8) {
        if ((x + y) % 16 === 0) ctx.fillRect(x, y, 6, 4);
        else ctx.fillRect(x, y + 4, 4, 6);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);
    return tex;
  }

  _createRibbedDeckTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#343b42';
    ctx.fillRect(0, 0, 128, 256);
    ctx.fillStyle = '#1e2328';
    for (let y = 0; y < 256; y += 8) {
      ctx.fillRect(0, y, 128, 4);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  setShowHands(visible) {
    this.showRiderHands = visible;
    if (this.riderHandGroup) {
      this.riderHandGroup.visible = visible;
    }
  }

  /**
   * Renders a sleek, high-contrast AAA Marine Glass-Cockpit OLED Telemetry Cluster (`1024x512`).
   * Features deep obsidian radial gradients, glowing cyan/emerald/amber LED arcs, anti-aliased
   * digital speed/knots/RPM readout, boost capacitor cells, and dynamic pitch/trim horizon ladder.
   */
  updateDashboard(speedMph, throttleLoad, boostPct, pitchDeg, modeLabel = 'F-DRIVE') {
    const ctx = this.dashCtx;
    const w = this.dashCanvas.width;
    const h = this.dashCanvas.height;

    // 1. Deep Obsidian Marine OLED Glass Background with Subtle Radial Glow
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.52, 20, w * 0.5, h * 0.5, w * 0.62);
    bgGrad.addColorStop(0, '#0c2233');
    bgGrad.addColorStop(0.55, '#071521');
    bgGrad.addColorStop(1, '#030a11');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle carbon scanline grid texture
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
    ctx.lineWidth = 1;
    for (let y = 16; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Outer recessed metallic frame border
    ctx.strokeStyle = 'rgba(77, 212, 239, 0.32)';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    // =========================================================================
    // LEFT WING: DIGITAL SPEEDOMETER, KNOTS, & WATERJET THRUST LOAD BAR
    // =========================================================================
    const lx = 52;
    ctx.fillStyle = '#4dd4ef';
    ctx.font = '800 26px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SPEED · MPH', lx, 84);

    const displayMph = Math.round(speedMph);
    ctx.save();
    ctx.shadowColor = 'rgba(0, 212, 255, 0.55)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 148px "JetBrains Mono", "SF Mono", Consolas, monospace';
    ctx.fillText(String(displayMph).padStart(2, '0'), lx - 4, 232);
    ctx.restore();

    const kts = Math.round(speedMph * 0.868976);
    ctx.font = '700 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#72efdd';
    ctx.fillText(`${String(kts).padStart(2, '0')} KTS`, lx, 286);

    // Segmented Waterjet Thrust Load Bar
    ctx.font = '700 22px "Inter", sans-serif';
    ctx.fillStyle = '#8bb4c7';
    ctx.fillText('JET PUMP LOAD', lx, 356);

    const loadSegments = 12;
    const activeLoadSegs = Math.round(Math.min(1, Math.max(0.06, throttleLoad)) * loadSegments);
    for (let i = 0; i < loadSegments; i++) {
      const sx = lx + i * 20;
      const sy = 374;
      if (i < activeLoadSegs) {
        ctx.fillStyle = i >= 9 ? '#ff9f1c' : '#00d4ff';
      } else {
        ctx.fillStyle = 'rgba(139, 180, 199, 0.16)';
      }
      ctx.fillRect(sx, sy, 15, 32);
    }

    // Water Temp & Compass Heading Indicator
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6495ad';
    ctx.fillText('SEA 78°F · DEPTH OK', lx, 448);

    // =========================================================================
    // CENTER: HIGH-CONTRAST TACHOMETER DIAL RING (Aligned with 3D Chrome Torus)
    // =========================================================================
    const cx = w * 0.5;
    const cy = h * 0.52;
    const r = 176;

    // Dark dial face inside the 3D chrome bezel
    const dialGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, r);
    dialGrad.addColorStop(0, '#0f293d');
    dialGrad.addColorStop(0.78, '#071624');
    dialGrad.addColorStop(1, '#040c14');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // Background track arc
    const startAng = Math.PI * 0.78;
    const sweepAng = Math.PI * 1.44;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 22, startAng, startAng + sweepAng);
    ctx.lineWidth = 18;
    ctx.strokeStyle = 'rgba(120, 180, 210, 0.14)';
    ctx.stroke();

    // Active glowing RPM arc
    const rpmFrac = Math.min(1.0, Math.max(0.03, (speedMph / 74.0) * 0.78 + throttleLoad * 0.22));
    const activeEndAng = startAng + rpmFrac * sweepAng;
    const arcGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    arcGrad.addColorStop(0, '#00b4d8');
    arcGrad.addColorStop(0.65, '#4ef2b8');
    arcGrad.addColorStop(1, '#ff5400');

    ctx.save();
    ctx.shadowColor = 'rgba(78, 242, 184, 0.55)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 22, startAng, activeEndAng);
    ctx.lineWidth = 18;
    ctx.strokeStyle = arcGrad;
    ctx.stroke();
    ctx.restore();

    // Tick marks & RPM numbers (0..8 x1000 RPM)
    for (let i = 0; i <= 8; i++) {
      const frac = i / 8;
      const ang = startAng + frac * sweepAng;
      const x1 = cx + Math.cos(ang) * (r - 44);
      const y1 = cy + Math.sin(ang) * (r - 44);
      const x2 = cx + Math.cos(ang) * (r - 10);
      const y2 = cy + Math.sin(ang) * (r - 10);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = i >= 7 ? '#ff4d4d' : '#cbe8f6';
      ctx.stroke();

      const lxTick = cx + Math.cos(ang) * (r - 70);
      const lyTick = cy + Math.sin(ang) * (r - 70) + 10;
      ctx.font = '800 26px "Inter", sans-serif';
      ctx.fillStyle = i >= 7 ? '#ff6b6b' : '#9ad1e8';
      ctx.textAlign = 'center';
      ctx.fillText(String(i), lxTick, lyTick);
    }

    // Glowing Tachometer Needle
    ctx.save();
    ctx.shadowColor = 'rgba(255, 84, 0, 0.8)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(activeEndAng) * 24, cy - Math.sin(activeEndAng) * 24);
    ctx.lineTo(cx + Math.cos(activeEndAng) * (r - 28), cy + Math.sin(activeEndAng) * (r - 28));
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ff5400';
    ctx.stroke();
    ctx.restore();

    // Center cap & digital RPM readout
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#182b3a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#4dd4ef';
    ctx.stroke();

    const rpmVal = Math.round(1250 + rpmFrac * 6950);
    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${rpmVal}`, cx, cy + 78);

    ctx.font = '700 19px "Inter", sans-serif';
    ctx.fillStyle = '#6ba4be';
    ctx.fillText('RPM', cx, cy + 106);

    // =========================================================================
    // RIGHT WING: DRIVE MODE PILL, BOOST CAPACITOR, & TRIM/PITCH HORIZON
    // =========================================================================
    const rx = 720;
    ctx.textAlign = 'left';

    // Mode Badge Pill
    const isSpecialMode = modeLabel === 'AIRBORNE' || modeLabel === 'BOOST' || modeLabel === 'SUBMERGED';
    ctx.fillStyle = isSpecialMode ? 'rgba(255, 159, 28, 0.24)' : 'rgba(0, 180, 216, 0.22)';
    ctx.strokeStyle = isSpecialMode ? '#ff9f1c' : '#00b4d8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(rx, 50, 250, 54, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 28px "Inter", system-ui, sans-serif';
    ctx.fillStyle = isSpecialMode ? '#ffd166' : '#72efdd';
    ctx.textAlign = 'center';
    ctx.fillText(modeLabel, rx + 125, 87);

    // Boost Capacitor Cells
    ctx.textAlign = 'left';
    ctx.font = '700 22px "Inter", sans-serif';
    ctx.fillStyle = '#8bb4c7';
    ctx.fillText(`BOOST CAPACITOR · ${Math.round(boostPct)}%`, rx, 156);

    const segs = 6;
    for (let s = 0; s < segs; s++) {
      const threshold = (s + 1) * (100 / segs) - 10;
      const active = boostPct >= threshold;
      ctx.fillStyle = active ? '#4ef2b8' : 'rgba(139, 180, 199, 0.16)';
      ctx.fillRect(rx + s * 42, 174, 34, 38);
    }

    // Hull Pitch / Trim Attitude Ladder
    ctx.fillStyle = '#8bb4c7';
    ctx.font = '700 22px "Inter", sans-serif';
    ctx.fillText('HULL TRIM / PITCH', rx, 278);

    ctx.fillStyle = 'rgba(12, 38, 56, 0.9)';
    ctx.strokeStyle = 'rgba(114, 239, 221, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(rx, 296, 246, 44);
    ctx.fillRect(rx, 296, 246, 44);

    // Center zero tick
    ctx.strokeStyle = '#8bb4c7';
    ctx.beginPath();
    ctx.moveTo(rx + 123, 290);
    ctx.lineTo(rx + 123, 346);
    ctx.stroke();

    const trimNorm = Math.max(-1, Math.min(1, pitchDeg / 35));
    const markerX = rx + 123 + trimNorm * 104;
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(markerX - 8, 292, 16, 52);

    ctx.font = '800 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`PITCH ${pitchDeg >= 0 ? '+' : ''}${Math.round(pitchDeg)}°`, rx, 396);

    // Specular diagonal glass highlight across the OLED screen
    const sheenGrad = ctx.createLinearGradient(0, 0, w * 0.65, h);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, w, h);

    this.dashTexture.needsUpdate = true;
  }

  update(dt, elapsedTime, craftState) {
    this.root.position.copy(craftState.position);
    this.root.rotation.y = craftState.heading;

    this.hullGroup.rotation.order = 'YXZ';
    this.hullGroup.rotation.x = craftState.pitch + (craftState.trickPitchOffset || 0);
    this.hullGroup.rotation.z = craftState.roll + craftState.carveRoll + (craftState.trickRollOffset || 0);
    this.hullGroup.rotation.y = craftState.trickYawOffset || 0;

    // Frame-rate independent exponential smoothing on steering handlebar pivot
    const targetSteerAngle = -craftState.steerAngle * 0.42;
    const kSteer = 1.0 - Math.exp(-22.0 * dt);
    this.steeringPivot.rotation.y = THREE.MathUtils.lerp(
      this.steeringPivot.rotation.y,
      targetSteerAngle,
      kSteer
    );

    // Subtle throttle trigger squeeze animation
    if (this.rightThrottleLever) {
      this.rightThrottleLever.rotation.y = -craftState.throttleLoad * 0.22;
    }

    const preloadDip = craftState.preloadCharge > 0 ? -0.026 * craftState.preloadCharge : 0;
    const impactDip = craftState.impactCompression || 0;
    const kDip = 1.0 - Math.exp(-16.0 * dt);
    this.steeringPivot.position.y = THREE.MathUtils.lerp(
      this.steeringPivot.position.y,
      0.94 + preloadDip - impactDip * 0.042,
      kDip
    );

    const targetSwayX = -craftState.steerAngle * 0.055 + Math.sin(elapsedTime * 6.5) * 0.008 * (1 + craftState.speedMph * 0.02);
    const targetSwayZ = Math.min(0.08, craftState.speedMph * 0.0012) + Math.cos(elapsedTime * 5.2) * 0.006;
    const kLanyard = 1.0 - Math.exp(-10.0 * dt);
    this.lanyardSwayX = THREE.MathUtils.lerp(this.lanyardSwayX, targetSwayX, kLanyard);
    this.lanyardSwayZ = THREE.MathUtils.lerp(this.lanyardSwayZ, targetSwayZ, kLanyard);
    this._updateLanyardGeometry(this.lanyardSwayX, this.lanyardSwayZ);

    this._dashAccum = (this._dashAccum || 0) + dt;
    if (this._dashAccum >= 0.045) {
      this._dashAccum = 0;
      const pitchDeg = THREE.MathUtils.radToDeg(craftState.pitch);
      const modeStr = craftState.isSubmerged
        ? 'SUBMERGED'
        : craftState.isAirborne
        ? 'AIRBORNE'
        : craftState.isBoosting
        ? 'BOOST'
        : craftState.preloadReady
        ? 'CREST'
        : 'F-DRIVE';
      this.updateDashboard(
        craftState.speedMph,
        craftState.throttleLoad,
        craftState.boostEnergy,
        pitchDeg,
        modeStr
      );
    }
  }
}
