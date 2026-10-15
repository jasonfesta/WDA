import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { asset, type AreaProps, type ExampleState, type Knobs } from '../shared';
import { color } from '../theme';
import { materialBaseColors, type MaterialFinish } from '../material-palettes';
import './material-scene.css';

type Finish = MaterialFinish;
type Study = {
  name: string;
  file: string;
  note: string;
  arrangement: 'stack' | 'courtyard' | 'rosette' | 'honey' | 'triad';
  aggregate: boolean;
};

const studies: Study[] = [
  { name: 'Apricot balance', file: '01-apricot-balance', note: 'Apricot / cream / terracotta', arrangement: 'stack', aggregate: false },
  { name: 'Citron courtyard', file: '02-citron-courtyard', note: 'Travertine / citron / moss', arrangement: 'courtyard', aggregate: true },
  { name: 'Rosette tilt', file: '03-rosette-tilt', note: 'Rose terrazzo / clay / cream', arrangement: 'rosette', aggregate: true },
  { name: 'Honey translucence', file: '04-honey-translucence', note: 'Cream stone / clay / amber', arrangement: 'honey', aggregate: true },
  { name: 'Clay triad', file: '05-clay-triad', note: 'Three forms, one mineral family', arrangement: 'triad', aggregate: true },
  { name: 'Quiet monument', file: '06-quiet-monument', note: 'Terrazzo / citron / moss', arrangement: 'stack', aggregate: true },
];

const finishes: { value: Finish; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'stone', label: 'Stone' },
  { value: 'glaze', label: 'Glaze' },
  { value: 'linen', label: 'Linen' },
];
const cameraDefaults = { theta: 0.42, phi: 1.22, distance: 8.1 };
const getNumber = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const getFinish = (value: unknown): Finish => finishes.some((finish) => finish.value === value) ? value as Finish : 'original';

type SceneController = {
  update: (state: ExampleState, knobs: Knobs) => void;
  move: (theta: number, phi: number, zoom?: number) => void;
  reset: () => void;
  dispose: () => void;
};

// Neutral procedural maps describe pores and aggregate; material colors remain live.
function makeGrain(aggregate: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Texture canvas is unavailable');
  let seed = aggregate ? 71 : 43;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const data = ctx.createImageData(512, 512);
  for (let i = 0; i < data.data.length; i += 4) {
    const value = 217 + random() * 34;
    data.data[i] = data.data[i + 1] = data.data[i + 2] = value;
    data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  for (let i = 0; i < (aggregate ? 1050 : 2100); i++) {
    const x = random() * 512;
    const y = random() * 512;
    const size = aggregate ? 0.6 + random() ** 3 * 10 : 0.2 + random() * 1.4;
    const value = Math.round(aggregate ? 132 + random() * 120 : 175 + random() * 65);
    ctx.fillStyle = `rgb(${value},${value},${value})`;
    ctx.beginPath();
    if (aggregate && size > 3) {
      for (let side = 0; side < 5; side++) {
        const angle = side / 5 * Math.PI * 2;
        const radius = size * (0.65 + random() * 0.35);
        if (side === 0) ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        else ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
    } else ctx.ellipse(x, y, size, size * 0.7, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createScene(
  host: HTMLDivElement,
  study: Study,
  id: string,
  focused: boolean,
  initialState: ExampleState,
  initialKnobs: Knobs,
  persist: (state: ExampleState) => void,
  report: (status: 'ready' | 'error' | 'texture-error') => void,
): SceneController {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f1e7d9');
  scene.fog = new THREE.Fog('#f1e7d9', 14, 30);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.12, 0);
  controls.enablePan = false;
  controls.enableZoom = focused;
  controls.enableDamping = false;
  controls.minDistance = 4.8;
  controls.maxDistance = 11;
  controls.minPolarAngle = 0.48;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.autoRotateSpeed = 0.42;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.7;

  const textures = new Set<THREE.Texture>();
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  let disposed = false;
  let frame = 0;
  let autoRotate = false;
  let lastTime = 0;
  let currentFinish: Finish | null = null;
  let activeKnobs = initialKnobs;
  let activeState = initialState;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const requestRender = () => {
    if (!disposed && !frame && !document.hidden) frame = window.requestAnimationFrame(render);
  };
  function render(now: number) {
    frame = 0;
    if (disposed || document.hidden) return;
    controls.autoRotate = autoRotate && !reducedMotion.matches;
    controls.update(lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60);
    lastTime = now;
    renderer.render(scene, camera);
    if (controls.autoRotate) requestRender();
  }
  const addTexture = <T extends THREE.Texture>(texture: T): T => {
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    textures.add(texture);
    return texture;
  };
  const grain = addTexture(makeGrain(false));
  const terrazzo = addTexture(makeGrain(true));
  const grainBump = addTexture(grain.clone());
  grainBump.colorSpace = THREE.NoColorSpace;
  grainBump.repeat.set(2, 2);
  const terrazzoBump = addTexture(terrazzo.clone());
  terrazzoBump.colorSpace = THREE.NoColorSpace;
  const loader = new THREE.TextureLoader();
  const photoMaps = new Map<Finish, { color: THREE.Texture; bump: THREE.Texture | null; ready: boolean }>();
  const mapFiles: Partial<Record<Finish, string>> = {
    stone: '09-peach-travertine.png', glaze: '12-cream-glaze.png', linen: '08-moss-linen.png',
  };
  function photoMap(finish: Finish) {
    const cached = photoMaps.get(finish);
    if (cached) return cached.ready ? cached : null;
    const filename = mapFiles[finish];
    if (!filename) return null;
    const color = addTexture(loader.load(asset(`textures/${filename}`), () => {
      if (disposed) { color.dispose(); return; }
      const bump = addTexture(color.clone());
      bump.colorSpace = THREE.NoColorSpace;
      bump.needsUpdate = true;
      photoMaps.set(finish, { color, bump, ready: true });
      currentFinish = null;
      update(activeState, activeKnobs);
    }, undefined, () => { if (!disposed) report('texture-error'); }));
    color.colorSpace = THREE.SRGBColorSpace;
    color.wrapS = color.wrapT = THREE.MirroredRepeatWrapping;
    const pair = { color, bump: null, ready: false };
    photoMaps.set(finish, pair);
    return null;
  }

  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.48;
  room.dispose();
  pmrem.dispose();

  const ambient = new THREE.HemisphereLight('#fff7e8', '#b99b7c', 1.3);
  scene.add(ambient);
  const light = new THREE.DirectionalLight('#fff0d6', 2.9);
  light.position.set(-3.5, 7.5, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = light.shadow.camera.bottom = -4.5;
  light.shadow.camera.right = light.shadow.camera.top = 4.5;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 22;
  light.shadow.normalBias = 0.025;
  light.shadow.bias = -0.00015;
  light.shadow.radius = 7;
  light.shadow.blurSamples = 8;
  scene.add(light);
  const fill = new THREE.DirectionalLight('#fff7e8', 0.45);
  fill.position.set(4, 3, -3);
  scene.add(fill);

  function mesh(geometry: THREE.BufferGeometry, material: THREE.MeshPhysicalMaterial) {
    geometries.add(geometry);
    materials.add(material);
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    return object;
  }
  const cubeMaterial = new THREE.MeshPhysicalMaterial();
  const pyramidMaterial = new THREE.MeshPhysicalMaterial();
  const sphereMaterial = new THREE.MeshPhysicalMaterial();
  const objectMaterials = [cubeMaterial, pyramidMaterial, sphereMaterial];
  const cube = mesh(new RoundedBoxGeometry(1.62, 1.62, 1.62, 4, 0.035), cubeMaterial);
  const pyramid = mesh(new THREE.ConeGeometry(0.98, 1.32, 4, 1), pyramidMaterial);
  pyramid.rotation.y = Math.PI / 4;
  const sphere = mesh(new THREE.SphereGeometry(0.7, 64, 48), sphereMaterial);
  if (study.arrangement === 'courtyard') {
    cube.scale.setScalar(0.8); cube.position.set(-0.84, 0.648, -0.05);
    sphere.scale.setScalar(0.82); sphere.position.set(-0.84, 1.87, -0.05);
    pyramid.scale.set(1.22, 1.42, 1.22); pyramid.position.set(0.87, 0.938, 0.12);
  } else if (study.arrangement === 'rosette') {
    cube.position.set(0.54, 0.81, -0.22);
    sphere.position.set(0.54, 2.32, -0.22);
    pyramid.scale.setScalar(1.02); pyramid.position.set(-1.03, 0.674, 0.48);
  } else if (study.arrangement === 'honey') {
    cube.position.set(0.6, 0.81, -0.24);
    pyramid.scale.setScalar(0.8); pyramid.position.set(0.6, 2.148, -0.24);
    sphere.scale.setScalar(1.06); sphere.position.set(-1.03, 0.742, 0.55);
  } else if (study.arrangement === 'triad') {
    cube.position.set(0, 0.97, -0.52); cube.scale.setScalar(1.2);
    pyramid.position.set(-1.04, 0.66, 0.85);
    sphere.scale.setScalar(0.82); sphere.position.set(1.14, 0.574, 0.95);
  } else {
    cube.position.set(-0.62, 0.81, -0.02);
    pyramid.scale.setScalar(0.84); pyramid.position.set(-0.62, 2.1744, -0.02);
    sphere.position.set(1.04, 0.7, 0.14);
  }
  const floorMaterial = new THREE.MeshPhysicalMaterial({ color: '#f1e7d9', roughness: 0.98, bumpMap: grainBump, bumpScale: 0.008 });
  const floor = mesh(new THREE.PlaneGeometry(100, 100), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.015;
  floor.castShadow = false;

  // A soft ambient contact term anchors the objects; VSM provides directional shadows.
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext('2d');
  if (shadowContext) {
    const gradient = shadowContext.createRadialGradient(64, 64, 2, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(51, 32, 18, 0.6)');
    gradient.addColorStop(0.3, 'rgba(51, 32, 18, 0.32)');
    gradient.addColorStop(0.65, 'rgba(51, 32, 18, 0.08)');
    gradient.addColorStop(1, 'rgba(51, 32, 18, 0)');
    shadowContext.fillStyle = gradient;
    shadowContext.fillRect(0, 0, 128, 128);
    const shadowTexture = addTexture(new THREE.CanvasTexture(shadowCanvas));
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.72 });
    materials.add(shadowMaterial);
    const contactGeometry = new THREE.PlaneGeometry(2.6, 2.6);
    geometries.add(contactGeometry);
    [cube, pyramid, sphere].forEach((object) => {
      const bottom = object.position.y - (object === pyramid ? 0.66 : object === sphere ? 0.7 : 0.81) * object.scale.y;
      if (bottom > 0.08) return;
      const contact = new THREE.Mesh(contactGeometry, shadowMaterial);
      contact.rotation.x = -Math.PI / 2;
      contact.position.set(object.position.x, -0.01, object.position.z);
      contact.scale.setScalar(object.scale.x * (object === sphere ? 0.77 : 1));
      scene.add(contact);
    });
  }

  function update(state: ExampleState, knobs: Knobs) {
    activeKnobs = knobs;
    activeState = state;
    const finish = getFinish(state.material);
    const changed = finish !== currentFinish;
    if (changed) {
      const maps = photoMap(finish);
      objectMaterials.forEach((material, index) => {
        const aggregate = study.aggregate && (index === 0 || study.arrangement === 'triad');
        const amber = study.arrangement === 'honey' && index === 2 && finish === 'original';
        material.map = maps?.color ?? (amber ? null : aggregate ? terrazzo : grain);
        material.bumpMap = maps?.bump ?? (amber ? null : aggregate ? terrazzoBump : grainBump);
        material.bumpScale = finish === 'linen' ? 0.065 : finish === 'glaze' ? 0.022 : aggregate ? 0.042 : 0.024;
        material.roughness = amber ? 0.035 : finish === 'glaze' ? 0.21 : finish === 'linen' ? 0.96 : index === 2 ? 0.43 : 0.68;
        material.metalness = 0;
        material.clearcoat = amber ? 1 : finish === 'glaze' ? 0.8 : index === 2 ? 0.16 : 0.04;
        material.clearcoatRoughness = 0.18;
        material.transmission = amber ? 1 : 0;
        material.thickness = amber ? 1.4 : 0;
        material.ior = 1.46;
        material.attenuationColor.set('#d9a351');
        material.attenuationDistance = 3;
        material.sheen = finish === 'linen' ? 0.8 : 0;
        material.sheenColor.set('#f6e5ce');
        material.sheenRoughness = 0.9;
        material.needsUpdate = true;
      });
      sphere.castShadow = !(study.arrangement === 'honey' && finish === 'original');
      currentFinish = finish;
    }
    const palette = materialBaseColors(id, knobs, finish);
    [palette.cube, palette.pyramid, palette.sphere].forEach((tint, index) => objectMaterials[index].color.set(tint));
    if (palette.amberAttenuation) sphereMaterial.attenuationColor.set(palette.amberAttenuation);
    const backdrop = new THREE.Color(palette.backdrop);
    (scene.background as THREE.Color).copy(backdrop);
    (scene.fog as THREE.Fog).color.copy(backdrop);
    floorMaterial.color.copy(backdrop);
    light.color.set(color('#fff1da', { ...knobs, hue: 0, depth: 0 }));
    renderer.toneMappingExposure = 0.96 - knobs.depth / 350;
    autoRotate = state.autoRotate === true;
    requestRender();
  }
  function saveCamera() {
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    persist({ orbitTheta: spherical.theta, orbitPhi: spherical.phi, orbitDistance: spherical.radius });
  }
  function setCamera(theta: number, phi: number, distance: number) {
    const spherical = new THREE.Spherical(
      THREE.MathUtils.clamp(distance, controls.minDistance, controls.maxDistance),
      THREE.MathUtils.clamp(phi, controls.minPolarAngle, controls.maxPolarAngle), theta,
    );
    camera.position.setFromSpherical(spherical).add(controls.target);
    controls.update();
    requestRender();
  }
  setCamera(getNumber(initialState.orbitTheta, cameraDefaults.theta), getNumber(initialState.orbitPhi, cameraDefaults.phi), getNumber(initialState.orbitDistance, cameraDefaults.distance));
  controls.addEventListener('change', requestRender);
  controls.addEventListener('end', saveCamera);
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const visibility = () => {
    lastTime = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else requestRender();
  };
  const motionChange = () => requestRender();
  const contextLost = (event: Event) => {
    event.preventDefault();
    autoRotate = false;
    controls.enabled = false;
    cancelAnimationFrame(frame);
    frame = 0;
    report('error');
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  document.addEventListener('visibilitychange', visibility);
  reducedMotion.addEventListener('change', motionChange);
  resize();
  update(initialState, activeKnobs);
  renderer.render(scene, camera);
  report('ready');
  return {
    update,
    move(theta, phi, zoom = 1) {
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      setCamera(spherical.theta + theta, spherical.phi + phi, spherical.radius * zoom);
      saveCamera();
    },
    reset() {
      setCamera(cameraDefaults.theta, cameraDefaults.phi, cameraDefaults.distance);
      saveCamera();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', motionChange);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      controls.removeEventListener('change', requestRender);
      controls.removeEventListener('end', saveCamera);
      controls.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      light.shadow.dispose();
      environment.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

export default function MaterialScene({ id, focused, state, onState, knobs }: AreaProps) {
  const index = Math.max(0, Math.min(5, Number.parseInt(id.replace('REF-', ''), 10) - 31 || 0));
  const study = studies[index];
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SceneController | null>(null);
  const latest = useRef({ state, knobs, onState });
  latest.current = { state, knobs, onState };
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'texture-error'>('loading');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!host.current) return;
    setStatus('loading');
    const element = host.current;
    try {
      controller.current = createScene(element, study, id, focused, latest.current.state, latest.current.knobs, (patch) => latest.current.onState(patch), setStatus);
    } catch (error) {
      console.warn('Material study could not initialize WebGL.', error);
      element.replaceChildren();
      setStatus('error');
    }
    return () => {
      controller.current?.dispose();
      controller.current = null;
    };
  }, [focused, study, id, retry]);

  useEffect(() => { controller.current?.update(state, knobs); }, [state, knobs]);

  const description = `${study.name}: a textured cube, square pyramid, and sphere in warm studio light.`;
  const fallback = status === 'error';
  const finish = getFinish(state.material);
  return (
    <section className={`material-scene${focused ? ' is-focused' : ''}`} aria-label={`${study.name} material study`}>
      {(fallback || status === 'loading') && <img className="material-scene__reference" src={asset(`geometric-studies/${study.file}.png`)} alt={description} loading="eager" draggable={false} />}
      <div
        ref={host}
        className={`material-scene__canvas${fallback ? ' is-unavailable' : ''}`}
        tabIndex={status === 'error' ? -1 : 0}
        role="group"
        aria-label={`Interactive 3D ${study.name}. Arrow keys rotate, plus and minus zoom, R resets.`}
        onKeyDown={(event) => {
          const movements: Record<string, [number, number, number?]> = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.09], ArrowDown: [0, 0.09], '+': [0, 0, 0.9], '=': [0, 0, 0.9], '-': [0, 0, 1.1] };
          if (movements[event.key]) { event.preventDefault(); controller.current?.move(...movements[event.key]); }
          if (event.key.toLowerCase() === 'r') { event.preventDefault(); controller.current?.reset(); }
        }}
      />
      {focused && <header className="material-scene__heading">
        <div><span className="material-scene__eyebrow">FORM & MATERIAL / 0{index + 1}</span><h3>{study.name}</h3></div>
        <span className="material-scene__live">{focused && !fallback ? <><i /> LIVE 3D</> : 'OPEN 3D ↗'}</span>
      </header>}
      {focused && status === 'loading' && <p className="material-scene__status" role="status">Preparing materials…</p>}
      {focused && status === 'error' && <div className="material-scene__fallback" role="status"><p>3D is unavailable in this browser.<br />Showing the selected reference image.</p><button type="button" onClick={() => setRetry((value) => value + 1)}>Try 3D again</button></div>}
      {focused && status !== 'error' && <div className="material-scene__tools">
        <div className="material-scene__tool-row">
          <div className="material-scene__finishes" role="group" aria-label="Surface material">
            {finishes.map((item) => <button key={item.value} type="button" aria-pressed={finish === item.value} onClick={() => onState({ material: item.value })}>{item.label}</button>)}
          </div>
          <button type="button" className="material-scene__rotate" aria-pressed={state.autoRotate === true} onClick={() => onState({ autoRotate: state.autoRotate !== true })}>{state.autoRotate ? 'Ⅱ Pause' : '↻ Rotate'}</button>
        </div>
        <div className="material-scene__tool-row material-scene__tool-row--secondary">
          <p>{status === 'texture-error' ? 'A texture could not load. Geometry remains interactive.' : 'Drag to orbit · Scroll to zoom'}</p>
          <div className="material-scene__camera" role="group" aria-label="Camera controls">
            <button type="button" aria-label="Zoom out" onClick={() => controller.current?.move(0, 0, 1.12)}>−</button>
            <button type="button" aria-label="Zoom in" onClick={() => controller.current?.move(0, 0, 0.88)}>+</button>
            <button type="button" onClick={() => controller.current?.reset()}>Reset</button>
          </div>
        </div>
      </div>}
    </section>
  );
}
