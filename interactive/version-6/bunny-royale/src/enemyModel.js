import * as THREE from 'three';
import { assetAtlas } from './assetAtlas.js';
import { BAKED_ENEMY_MODELS } from './bakedModelData.js';
import { buildBakedCharacterGeometry } from './rabbitModel.js';

// ============================================================================
// High-Craft Baked 3D Volumetric Enemy Models (Raider, Hopper, Foreman)
// Uses watertight 3D relief meshes built from BAKED_ENEMY_MODELS and UV-mapped
// onto assets/baked-{raider|hopper|foreman}-uv.png.
// ============================================================================

const _texLoader = new THREE.TextureLoader();
const _enemyTexCache = new Map();

function _loadEnemyBakedTex(url) {
  if (_enemyTexCache.has(url)) return _enemyTexCache.get(url);
  const tex = _texLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  _enemyTexCache.set(url, tex);
  return tex;
}

function _createEnemyShadowTex() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  grad.addColorStop(0, 'rgba(10, 14, 24, 0.72)');
  grad.addColorStop(0.55, 'rgba(10, 14, 24, 0.32)');
  grad.addColorStop(1, 'rgba(10, 14, 24, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const _enemyShadowTex = _createEnemyShadowTex();

export function createEnemyMesh(type) {
  const group = new THREE.Group();
  group.name = `enemy_${type}`;

  const isBoss = type === 'foreman';
  const isHopper = type === 'hopper';

  const spec = BAKED_ENEMY_MODELS[type] || BAKED_ENEMY_MODELS.raider;
  const h = isBoss ? 4.10 : (isHopper ? 2.82 : 2.48);
  const w = h * spec.aspect;
  const maxDepth = isBoss ? 1.25 : (isHopper ? 0.88 : 0.78);

  // 1. Ground Contact Shadow Disc
  const shadowSize = isBoss ? 2.85 : (isHopper ? 1.72 : 1.55);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(shadowSize, shadowSize),
    new THREE.MeshBasicMaterial({
      map: _enemyShadowTex,
      transparent: true,
      depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // 2. Watertight Baked 3D Volumetric Enemy Mesh
  // Note: EnemyAI rotates e.mesh so +Z faces the player, so we rotate the 3D mesh by Math.PI
  // so its Front shell (-Z in buildBakedCharacterGeometry when isFrontPrimary=true) faces +Z!
  const spriteGroup = new THREE.Group();
  spriteGroup.name = 'enemy_3d_rig';
  group.add(spriteGroup);
  group.userData.spriteGroup = spriteGroup;
  group.userData.spriteRig = spriteGroup;

  const bakedTex = _loadEnemyBakedTex(spec.atlasUrl);
  const enemyGeo = buildBakedCharacterGeometry(spec, w, h, maxDepth, true);

  const frontMat = new THREE.MeshStandardMaterial({
    map: bakedTex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: bakedTex,
    emissiveIntensity: 0.72,
    transparent: true,
    alphaTest: 0.14,
    side: THREE.DoubleSide,
    roughness: 0.44,
    metalness: 0.08
  });

  const bodyMesh3D = new THREE.Mesh(enemyGeo, frontMat);
  bodyMesh3D.rotation.y = Math.PI;
  bodyMesh3D.position.y = -0.02;
  bodyMesh3D.castShadow = true;
  bodyMesh3D.receiveShadow = true;
  spriteGroup.add(bodyMesh3D);

  group.userData.frontMat = frontMat;
  group.userData.bodyMesh3D = bodyMesh3D;

  // 3. Muzzle Flash & Back Armor Accents (Weapons are already sculpted in high-res 3D relief in enemyGeo!)
  if (type === 'foreman') {
    const orangeArmorMat = new THREE.MeshStandardMaterial({ color: 0xff6b18, roughness: 0.35, metalness: 0.18 });
    const backTank = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), orangeArmorMat);
    backTank.position.set(0.16, 2.35, -0.45);
    spriteGroup.add(backTank);
  }

  if (type === 'raider' || type === 'foreman') {
    const flashTex = assetAtlas.getVFXTexture('muzzle_flash');
    const flashMat = new THREE.MeshBasicMaterial({
      map: flashTex,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const flashSize = isBoss ? 1.35 : 0.85;
    const flashMesh = new THREE.Mesh(new THREE.PlaneGeometry(flashSize, flashSize), flashMat);
    flashMesh.position.set(isBoss ? -0.58 : 0.56, isBoss ? 1.75 : 1.32, isBoss ? 0.72 : 0.52);
    spriteGroup.add(flashMesh);
    group.userData.muzzleFlashMesh = flashMesh;
  }

  // 4. Compact 3D Overhead Marker for Aerial Map View
  const overheadMarker = new THREE.Mesh(
    new THREE.RingGeometry(isBoss ? 0.85 : 0.45, isBoss ? 1.15 : 0.65, 18),
    new THREE.MeshBasicMaterial({
      color: isBoss ? 0xff0055 : 0xff3b30,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    })
  );
  overheadMarker.rotation.x = -Math.PI / 2;
  overheadMarker.position.y = 0.04;
  group.add(overheadMarker);

  // 5. Sleek Floating Health Bar (Hidden at 100% HP)
  const hpBarGroup = new THREE.Group();
  hpBarGroup.position.set(0, h + 0.18, 0);
  hpBarGroup.visible = false;

  const bgPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(isBoss ? 1.4 : 0.86, 0.11),
    new THREE.MeshBasicMaterial({ color: 0x0b192c, side: THREE.DoubleSide })
  );
  const fillPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(isBoss ? 1.32 : 0.80, 0.07),
    new THREE.MeshBasicMaterial({ color: isBoss ? 0xff0055 : 0xff3b30, side: THREE.DoubleSide })
  );
  fillPlane.position.z = 0.01;
  hpBarGroup.add(bgPlane, fillPlane);
  group.add(hpBarGroup);

  group.userData.hpBarGroup = hpBarGroup;
  group.userData.hpFillMesh = fillPlane;
  group.userData.hpBarWidth = isBoss ? 1.32 : 0.80;

  return group;
}
