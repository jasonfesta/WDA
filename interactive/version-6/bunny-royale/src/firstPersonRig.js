import * as THREE from 'three';

// True First-Person POV Controller & Viewmodel Rig
// Displays rabbit arms/paws in combat gloves, animated gun bob/sway, recoil, and glowing weapon barrels.
export class FirstPersonRig {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    // Viewmodel container attached directly to the camera
    this.viewmodelContainer = new THREE.Group();
    this.camera.add(this.viewmodelContainer);

    this.textureLoader = new THREE.TextureLoader();

    // Weapon textures from assets
    this.weaponTextures = {
      pip: this.textureLoader.load('assets/gear-pip-weapon.png'),
      bruno: this.textureLoader.load('assets/gear-bruno-weapon.png'),
      volt: this.textureLoader.load('assets/gear-volt-weapon.png')
    };

    for (const key in this.weaponTextures) {
      this.weaponTextures[key].colorSpace = THREE.SRGBColorSpace;
    }

    // Default resting transform of the viewmodel (lower right corner of the screen)
    this.restPosition = new THREE.Vector3(0.28, -0.22, -0.48);
    this.adsPosition = new THREE.Vector3(0.0, -0.15, -0.35); // Centered iron sights
    this.currentPosition = this.restPosition.clone();

    // Procedural weapon sway and bobbing state
    this.swayEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.targetSway = new THREE.Vector2(0, 0);
    this.bobTimer = 0;
    this.recoilOffset = 0;
    this.recoilRot = 0;

    this.currentFighter = 'pip';
    this.weaponMesh = null;
    this.muzzleFlash = null;
    this.pawsMesh = null;

    this.buildViewmodel('pip');
  }

  buildViewmodel(fighterId) {
    this.currentFighter = fighterId;

    // Clear existing viewmodel
    while (this.viewmodelContainer.children.length > 0) {
      const obj = this.viewmodelContainer.children[0];
      this.viewmodelContainer.remove(obj);
    }

    const gunGroup = new THREE.Group();
    gunGroup.name = 'gun_viewmodel';

    // 1. High-Fidelity Weapon Billboard / Extruded Viewmodel
    // Mapped from high-res gear-*-weapon.png
    const weaponTex = this.weaponTextures[fighterId] || this.weaponTextures.pip;
    const weaponAspect = 1.5;
    const weaponWidth = 0.52;
    const weaponHeight = weaponWidth / weaponAspect;

    const weaponGeo = new THREE.PlaneGeometry(weaponWidth, weaponHeight);
    const weaponMat = new THREE.MeshToonMaterial({
      map: weaponTex,
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide
    });

    const weaponPlane = new THREE.Mesh(weaponGeo, weaponMat);
    weaponPlane.position.set(0, 0.05, 0);
    weaponPlane.rotation.y = -Math.PI / 18; // Slight angle towards center of screen
    gunGroup.add(weaponPlane);

    // 2. Volumetric 3D Barrel & Glowing Energy Core
    const coreColor = fighterId === 'pip' ? 0xff7700 : (fighterId === 'bruno' ? 0x22c55e : 0xd946ef);
    const barrelGeo = new THREE.CylinderGeometry(0.032, 0.04, 0.28, 10);
    const barrelMat = new THREE.MeshToonMaterial({
      color: 0x2a2e39
    });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(-0.06, 0.04, -0.12);
    gunGroup.add(barrel);

    // Glowing energy tube
    const tubeGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.22, 8);
    const tubeMat = new THREE.MeshBasicMaterial({ color: coreColor });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(-0.06, 0.07, -0.06);
    gunGroup.add(tube);

    // 3. Stylized Rabbit Paw & Forearm in Combat Glove
    const furColor = fighterId === 'pip' ? 0xf4ede2 : (fighterId === 'bruno' ? 0xbaa182 : 0xc7b5df);
    const gloveColor = 0x2563eb; // Tactical blue glove

    const pawGroup = new THREE.Group();
    // Arm sleeve
    const armGeo = new THREE.CylinderGeometry(0.055, 0.07, 0.35, 10);
    const armMat = new THREE.MeshToonMaterial({ color: gloveColor });
    const armMesh = new THREE.Mesh(armGeo, armMat);
    armMesh.rotation.x = Math.PI / 3.2;
    armMesh.position.set(0.08, -0.15, 0.1);
    pawGroup.add(armMesh);

    // Fur paw wrist
    const pawGeo = new THREE.SphereGeometry(0.048, 10, 8);
    const pawMat = new THREE.MeshToonMaterial({ color: furColor });
    const pawMesh = new THREE.Mesh(pawGeo, pawMat);
    pawMesh.position.set(0.04, -0.05, 0.02);
    pawGroup.add(pawMesh);

    gunGroup.add(pawGroup);

    // 4. Muzzle Flash Flare (Hidden by default)
    const flashGeo = new THREE.PlaneGeometry(0.28, 0.28);
    const flashMat = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.muzzleFlash = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlash.position.set(-0.06, 0.04, -0.28);
    gunGroup.add(this.muzzleFlash);

    this.weaponMesh = gunGroup;
    this.viewmodelContainer.add(gunGroup);
    this.viewmodelContainer.position.copy(this.restPosition);
  }

  triggerFireFX() {
    // Instant snappy recoil kick
    this.recoilOffset = 0.065;
    this.recoilRot = 0.14;

    // Trigger muzzle flash
    if (this.muzzleFlash) {
      this.muzzleFlash.material.opacity = 0.95;
      this.muzzleFlash.rotation.z = Math.random() * Math.PI * 2;
    }
  }

  handleMouseDelta(dx, dy) {
    // Weapon lag/sway on rapid camera mouse look
    this.targetSway.x -= dx * 0.0006;
    this.targetSway.y -= dy * 0.0006;

    // Clamp sway
    this.targetSway.x = THREE.MathUtils.clamp(this.targetSway.x, -0.08, 0.08);
    this.targetSway.y = THREE.MathUtils.clamp(this.targetSway.y, -0.06, 0.06);
  }

  update(dt, isMoving, isSprinting, isAiming) {
    if (!this.weaponMesh) return;

    // 1. Natural bobbing motion while walking/sprinting
    if (isMoving) {
      const bobSpeed = isSprinting ? 14 : 9;
      this.bobTimer += dt * bobSpeed;
      const bobX = Math.cos(this.bobTimer * 0.5) * (isSprinting ? 0.025 : 0.012);
      const bobY = Math.abs(Math.sin(this.bobTimer)) * (isSprinting ? 0.03 : 0.015);
      this.currentPosition.x = (isAiming ? this.adsPosition.x : this.restPosition.x) + bobX;
      this.currentPosition.y = (isAiming ? this.adsPosition.y : this.restPosition.y) - bobY;
    } else {
      // Gentle breathing idle sway
      this.bobTimer += dt * 2.2;
      const idleY = Math.sin(this.bobTimer) * 0.003;
      this.currentPosition.x = isAiming ? this.adsPosition.x : this.restPosition.x;
      this.currentPosition.y = (isAiming ? this.adsPosition.y : this.restPosition.y) + idleY;
    }

    // 2. Aim-Down-Sights (ADS) centering
    const targetBasePos = isAiming ? this.adsPosition : this.restPosition;
    this.viewmodelContainer.position.lerp(
      new THREE.Vector3(
        this.currentPosition.x + this.targetSway.x,
        this.currentPosition.y + this.targetSway.y,
        targetBasePos.z + this.recoilOffset
      ),
      dt * 18
    );

    // 3. Recover recoil
    this.recoilOffset = THREE.MathUtils.lerp(this.recoilOffset, 0, dt * 16);
    this.recoilRot = THREE.MathUtils.lerp(this.recoilRot, 0, dt * 14);

    // 4. Recover sway
    this.targetSway.lerp(new THREE.Vector2(0, 0), dt * 10);

    // 5. Apply weapon rotations (sway + recoil kick)
    this.weaponMesh.rotation.x = -this.recoilRot + this.targetSway.y * 1.5;
    this.weaponMesh.rotation.y = this.targetSway.x * 1.5;
    this.weaponMesh.rotation.z = -this.targetSway.x * 0.8;

    // 6. Fade muzzle flash
    if (this.muzzleFlash && this.muzzleFlash.material.opacity > 0) {
      this.muzzleFlash.material.opacity = THREE.MathUtils.lerp(this.muzzleFlash.material.opacity, 0, dt * 25);
    }
  }

  setVisible(visible) {
    this.viewmodelContainer.visible = visible;
  }
}
