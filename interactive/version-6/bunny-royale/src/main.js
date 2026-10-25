import * as THREE from 'three';
import { FIGHTER_CONFIGS } from './fighterConfig.js';
import { GameState } from './gameState.js';
import { InputManager } from './inputManager.js';
import { createRabbitMesh } from './rabbitModel.js';
import { ArenaEnvironment } from './arenaEnvironment.js';
import { ThirdPersonCamera, CAMERA_MODES } from './cameraRig.js';
import { FirstPersonRig } from './firstPersonRig.js';
import { WeaponSystem } from './weaponSystem.js';
import { CharacterController } from './characterController.js';
import { EnemyAIManager } from './enemyAI.js';
import { WaveManager } from './waveManager.js';
import { Minimap } from './minimap.js';
import { PickupManager } from './pickupManager.js';
import { DamageTextManager } from './damageTextManager.js';
import { SoundFX } from './soundFX.js';
import { soundEngine } from './soundEngine.js';
import { MenuController } from './menuController.js';
import { HUDController } from './hudController.js';
import { heroAnimator } from './heroAnimator.js';
import { screenAmbience } from './screenAmbience.js';

// Bunny Royale: Carrot Cove V2 — Complete Playable 3D Third-Person Shooter Engine
class BunnyRoyaleApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.damageLayer = document.getElementById('damage-numbers-layer');

    // UI Screens
    this.screenMainMenu = document.getElementById('screen-main-menu');
    this.screenCharSelect = document.getElementById('screen-char-select');
    this.screenBriefing = document.getElementById('screen-briefing');
    this.screenPause = document.getElementById('screen-pause');
    this.screenVictory = document.getElementById('screen-victory');
    this.screenDefeat = document.getElementById('screen-defeat');
    this.hudOverlay = document.getElementById('hud-overlay');

    // Default fighter: Pip (Scout)
    this.currentFighterConfig = FIGHTER_CONFIGS.pip;
    this.gameState = new GameState(this.currentFighterConfig);

    this.activeScreen = 'main-menu';
    this.isMuted = false;

    this._setupThree();
    this._setupEnvironment();
    this._setupFighter(this.currentFighterConfig);
    this._setupSystems();
    this._setupInput();
    this._setupUINavigation();

    // Support URL query parameter ?autostart=1 for instant drop
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      this.startGameplay();
    } else {
      // Position camera in OTS view initially so even behind menus the street matches canonical framing
      this.cameraRig.update(0.016, false, false);
    }

    this.lastTime = performance.now() / 1000;
    this._loop();
  }

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _setSrc(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  }

  _setupThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 350);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _setupEnvironment() {
    this.env = new ArenaEnvironment(this.scene);
  }

  _setupFighter(fighterConfig) {
    const prevPos = this.characterMesh
      ? this.characterMesh.position.clone()
      : new THREE.Vector3(-0.65, 0, 17.8);
    const prevRotY = this.characterMesh ? this.characterMesh.rotation.y : 0;

    if (this.characterMesh) {
      this.scene.remove(this.characterMesh);
    }

    this.currentFighterConfig = fighterConfig;
    this.characterMesh = createRabbitMesh(fighterConfig);
    this.characterMesh.position.copy(prevPos);
    this.characterMesh.rotation.y = prevRotY;
    this.scene.add(this.characterMesh);

    if (this.cameraRig) {
      this.cameraRig.setTarget(this.characterMesh);
    }
    if (this.controller) {
      this.controller.setConfig(fighterConfig, this.characterMesh);
    }
    if (this.firstPersonRig) {
      this.firstPersonRig.buildViewmodel(fighterConfig.id);
      if (this.cameraRig) this.cameraRig.updateTargetVisibility();
    }

    this.gameState.setFighter(fighterConfig);
  }

  _setupSystems() {
    this.damageTextManager = new DamageTextManager(this.damageLayer);
    this.minimap = new Minimap(document.getElementById('minimap-canvas'));

    this.pickupManager = new PickupManager(this.scene, this.gameState, (pickupType) => {
      const labels = {
        health: '+35 HEALTH MEDKIT',
        shield: '+25 SHIELD POTION',
        ammo: '+MAX AMMO CELL',
        carrot: '+25 CARROTS & ABILITY READY'
      };
      this.showNotification(labels[pickupType] || 'PICKUP COLLECTED');
    });
    this.pickupManager.spawnInitialPickups();

    this.enemyAI = new EnemyAIManager(this.scene, this.env, this.gameState, this.pickupManager);

    this.waveManager = new WaveManager(
      this.enemyAI,
      this.gameState,
      // onWaveChange(currentWave, maxWaves, objectiveText, immediate)
      (waveIdx, maxWaves, objectiveText, immediate) => {
        this.gameState.setWaveInfo(waveIdx, objectiveText);
        if (waveIdx === 3 && objectiveText.includes('EXIT')) {
          SoundFX.playBounce();
          soundEngine.playFanfare();
          this.showNotification('FOREMAN DEFEATED! REACH THE EXIT ->');
        } else if (!immediate) {
          this.showNotification(`WAVE ${waveIdx} / ${maxWaves} · ${objectiveText}`);
        }
      },
      // onWaveComplete(clearedWave)
      (clearedWave) => {
        SoundFX.playBounce();
        this.showNotification(`WAVE ${clearedWave} CLEARED! NEXT WAVE INCOMING...`);
      },
      // onGameVictory()
      () => {
        this._triggerVictory();
      }
    );

    // Spawn Wave 1 immediately so Raider & Hopper enemies are visible on Carrot Cove street
    this.waveManager.startEncounter(1, true);

    this.firstPersonRig = new FirstPersonRig(this.camera, this.scene);
    this.cameraRig = new ThirdPersonCamera(this.camera, this.characterMesh, this.env, this.firstPersonRig);
    this.cameraRig.onModeChange = (mode) => this._updateCameraSwitcherUI(mode);

    this.weaponSystem = new WeaponSystem(this.scene, this.env, this.gameState, this.enemyAI);
    this.weaponSystem.setCameraRig(this.cameraRig);
    this.weaponSystem.activeFighterConfig = this.currentFighterConfig;
    this.weaponSystem.onBarrelExploded = (blastPos) => {
      if (this.damageTextManager && this.damageTextManager.spawnCallout) {
        this.damageTextManager.spawnCallout(blastPos.clone().add(new THREE.Vector3(0, 1.8, 0)), 'NITRO BARREL BOOM!', '#ff5500');
      }
    };
    this.controller = new CharacterController(
      this.characterMesh,
      this.currentFighterConfig,
      this.env,
      this.weaponSystem,
      this.gameState
    );

    // Hit Marker, HUD Controller & Combat Event Hooks
    const hitMarker = document.getElementById('hit-marker');
    this.weaponSystem.setHitCallback((damage, hitPos, isBoss) => {
      if (hitMarker) {
        hitMarker.classList.remove('hidden');
        hitMarker.classList.add('visible');
        setTimeout(() => {
          hitMarker.classList.remove('visible');
          hitMarker.classList.add('hidden');
        }, 95);
      }
      this._spawnFloatingDamageNumber(damage, hitPos, isBoss);
      this.cameraRig.addShake(isBoss ? 0.25 : 0.08);
    });

    this.weaponSystem.onHitConfirmed = ({ enemy, damage, isCrit, isElim, hitPos }) => {
      if (this.hudController) {
        this.hudController.triggerHitMarker(isCrit, isElim);
      }
      const nowMs = performance.now();
      if (isCrit && hitPos && this.damageTextManager && this.damageTextManager.spawnCallout) {
        if (!this._lastCritCalloutMs || nowMs - this._lastCritCalloutMs > 950) {
          this._lastCritCalloutMs = nowMs;
          this.damageTextManager.spawnCallout(hitPos, 'CRITICAL HIT!', '#ffbe00');
        }
      }
    };

    this.enemyAI.onCombatEvent = ({ type, enemy }) => {
      if (type === 'shield_break' && enemy) {
        if (this.damageTextManager && this.damageTextManager.spawnCallout) {
          this.damageTextManager.spawnCallout(enemy.mesh.position.clone().add(new THREE.Vector3(0, 2.1, 0)), 'SHIELD CRACKED!', '#00e5ff');
        }
      } else if (type === 'eliminated' && enemy) {
        if (this.hudController) {
          this.hudController.pushKillFeed(
            this.currentFighterConfig.name,
            enemy.rivalName || enemy.label || enemy.type.toUpperCase(),
            this.currentFighterConfig.weapon.name,
            Boolean(enemy.isRival)
          );
        }
      }
    };

    // Expose global inspection API for evaluation and automated testing
    window.__BUNNY_ROYALE__ = {
      app: this,
      scene: this.scene,
      camera: this.camera,
      cameraRig: this.cameraRig,
      gameState: this.gameState,
      env: this.env,
      controller: this.controller,
      weaponSystem: this.weaponSystem,
      enemyAI: this.enemyAI,
      waveManager: this.waveManager,
      pickupManager: this.pickupManager,
      minimap: this.minimap,
      heroAnimator,
      screenAmbience,
      switchFighter: (id) => this.switchFighter(id),
      setCameraMode: (mode) => {
        if (this.damageTextManager && this.damageTextManager.clearAll) {
          this.damageTextManager.clearAll();
        }
        this.cameraRig.setMode(mode);
      },
      startGameplay: (reset) => this.startGameplay(reset),
      setScreen: (scr) => this.setScreen(scr)
    };

    this.hudController = new HUDController({ app: this, gameState: this.gameState });
    this.menuController = new MenuController(window.__BUNNY_ROYALE__);
    window.__BUNNY_ROYALE__.hudController = this.hudController;
    window.__BUNNY_ROYALE__.menuController = this.menuController;
  }

  _tryPointerLock() {
    if (this.canvas && this.canvas.requestPointerLock) {
      try {
        const res = this.canvas.requestPointerLock();
        if (res && typeof res.catch === 'function') {
          res.catch(() => {});
        }
      } catch (_) {}
    }
  }

  _setupInput() {
    this.input = new InputManager(this.canvas, () => {
      if (this.activeScreen === 'game') {
        this._tryPointerLock();
      }
    });

    this.input.onToggleCamera = () => {
      if (this.cameraRig) {
        this.cameraRig.cycleMode();
        const modeObj = CAMERA_MODES.find(m => m.id === this.cameraRig.mode);
        this.showNotification(`CAMERA: ${modeObj ? modeObj.label : this.cameraRig.mode.toUpperCase()}`);
      }
    };

    const toggleMap = () => {
      if (this.cameraRig) {
        this.cameraRig.toggleMapOverview();
        const modeObj = CAMERA_MODES.find(m => m.id === this.cameraRig.mode);
        this.showNotification(`CAMERA: ${modeObj ? modeObj.label : this.cameraRig.mode.toUpperCase()}`);
      }
    };
    this.input.onToggleMapOverview = toggleMap;
    this.input.onToggleMapCamera = toggleMap;

    window.addEventListener('keydown', (e) => {
      if (this.activeScreen === 'game') {
        if (e.code === 'Space') {
          e.preventDefault();
          if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) {
            document.activeElement.blur();
          }
          const cursorNDC = this.input.isLocked ? null : this.input.cursorNDC;
          this.weaponSystem.tryFire(
            this.cameraRig,
            this.characterMesh,
            this.currentFighterConfig,
            performance.now() / 1000,
            cursorNDC
          );
          if (this.cameraRig.mode === 'first_person' && this.firstPersonRig) {
            this.firstPersonRig.triggerFireFX();
          }
        }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyC') {
          e.preventDefault();
          this.controller.jump();
        }
        if (e.code === 'KeyR') {
          this.weaponSystem.triggerReload(this.currentFighterConfig);
        }
        if (e.code === 'KeyQ') {
          this.controller.tryTriggerAbility(performance.now() / 1000);
        }
        if (e.code === 'KeyT') {
          this.autoFireAssist = this.autoFireAssist === false;
          this.showNotification(`AUTO-FIRE ASSIST: ${this.autoFireAssist ? 'ON' : 'OFF'}`);
        }
        if (e.code === 'Digit1') this.switchFighter('pip');
        if (e.code === 'Digit2') this.switchFighter('bruno');
        if (e.code === 'Digit3') this.switchFighter('volt');
        if (e.code === 'Digit4') this.cameraRig.setMode('zone_1');
        if (e.code === 'Digit5') this.cameraRig.setMode('zone_2');
        if (e.code === 'Digit6') this.cameraRig.setMode('zone_3');
        if (e.code === 'Escape' || e.code === 'KeyP') {
          this.setScreen('pause');
        }
      } else if (this.activeScreen === 'pause') {
        if (e.code === 'Escape' || e.code === 'KeyP') {
          this.resumeGameplay();
        }
      }
    });
  }

  _bindClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
  }

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _setSrc(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  }

  _setupUINavigation() {
    // 1. Main Menu Buttons
    this._bindClick('btn-menu-play', () => {
      SoundFX.playSelect();
      this.setScreen('briefing');
    });

    this._bindClick('btn-menu-select', () => {
      SoundFX.playSelect();
      this.setScreen('char-select');
    });

    this._bindClick('btn-menu-briefing', () => {
      SoundFX.playSelect();
      this.setScreen('briefing');
    });

    this._bindClick('btn-menu-settings', () => {
      SoundFX.playSelect();
      this.setScreen('pause');
    });

    // Mute & Fullscreen Utility Buttons
    const toggleMute = () => {
      this.isMuted = !this.isMuted;
      soundEngine.enabled = !this.isMuted;
    };
    this._bindClick('btn-menu-mute', toggleMute);
    this._bindClick('btn-toggle-mute', toggleMute);

    const toggleFs = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };
    this._bindClick('btn-menu-fullscreen', toggleFs);
    this._bindClick('btn-toggle-fullscreen', toggleFs);

    // 2. Character Select Screen
    document.querySelectorAll('.roster-card').forEach(card => {
      card.addEventListener('click', () => {
        SoundFX.playSelect();
        this.previewFighterInLocker(card.dataset.char);
      });
    });

    this._bindClick('btn-select-back', () => {
      SoundFX.playSelect();
      this.setScreen('main-menu');
    });

    this._bindClick('btn-lock-in', () => {
      SoundFX.playSelect();
      this.setScreen('briefing');
    });

    // 3. Level Briefing Screen
    this._bindClick('btn-briefing-back', () => {
      SoundFX.playSelect();
      this.setScreen('char-select');
    });

    this._bindClick('btn-launch-drop', () => {
      SoundFX.playBounce();
      this.startGameplay();
    });

    // 4. Pause & Settings Modal
    this._bindClick('btn-resume-game', () => {
      SoundFX.playSelect();
      this.resumeGameplay();
    });

    const restartHandler = () => {
      SoundFX.playBounce();
      this.startGameplay(true);
    };
    this._bindClick('btn-restart-game', restartHandler);
    this._bindClick('btn-restart-level', restartHandler);

    this._bindClick('btn-return-menu', () => {
      SoundFX.playSelect();
      this.setScreen('main-menu');
    });

    // 5. Victory Screen
    this._bindClick('btn-victory-continue', () => {
      SoundFX.playSelect();
      this.setScreen('char-select');
    });

    this._bindClick('btn-victory-replay', () => {
      SoundFX.playBounce();
      this.startGameplay(true);
    });

    // 6. Defeat Screen
    this._bindClick('btn-defeat-retry', () => {
      SoundFX.playBounce();
      this.startGameplay(true);
    });

    this._bindClick('btn-defeat-change', () => {
      SoundFX.playSelect();
      this.setScreen('char-select');
    });

    this._bindClick('btn-defeat-menu', () => {
      SoundFX.playSelect();
      this.setScreen('main-menu');
    });

    // HUD Interactive Controls: Fighter Slots [1][2][3], Ability [Q], Camera Pills, Minimap, Pause
    document.querySelectorAll('.inventory-slots .slot').forEach(slot => {
      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playSelect();
        this.switchFighter(slot.dataset.fighter);
      });
    });

    const abilityCard = document.getElementById('ability-card');
    if (abilityCard) {
      abilityCard.addEventListener('click', (e) => {
        e.stopPropagation();
        this.controller.tryTriggerAbility(performance.now() / 1000);
      });
    }

    document.querySelectorAll('#hud-camera-bar .cam-pill[data-cam], .camera-switcher-bar .cam-pill[data-cam]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playSelect();
        this.cameraRig.setMode(pill.dataset.cam);
      });
    });

    this._bindClick('btn-hud-pause', (e) => {
      e.stopPropagation();
      SoundFX.playSelect();
      this.setScreen('pause');
    });

    const minimapContainer = document.getElementById('hud-minimap-container');
    if (minimapContainer) {
      minimapContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playSelect();
        this.cameraRig.toggleMapOverview();
      });
    }

    // Settings Sliders
    const volSlider = document.getElementById('slider-volume');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this._setText('val-volume', val);
        this._setText('lbl-vol', val);
        soundEngine.setVolume(val / 100);
        if (SoundFX.masterGain && SoundFX.ctx) {
          SoundFX.masterGain.gain.setValueAtTime((val / 100) * 0.4, SoundFX.ctx.currentTime);
        }
      });
    }

    const musicSlider = document.getElementById('slider-music');
    if (musicSlider) {
      musicSlider.addEventListener('input', (e) => {
        this._setText('val-music', e.target.value);
        this._setText('lbl-music', e.target.value);
      });
    }

    const sfxSlider = document.getElementById('slider-sfx');
    if (sfxSlider) {
      sfxSlider.addEventListener('input', (e) => {
        this._setText('val-sfx', e.target.value);
        this._setText('lbl-sfx', e.target.value);
      });
    }

    const sensSlider = document.getElementById('slider-sensitivity');
    if (sensSlider) {
      sensSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this._setText('val-sensitivity', val);
        this._setText('lbl-sens', val);
        this.input.sensitivity = 0.000045 * val;
      });
    }

    const rmCheck = document.getElementById('chk-reduced-motion');
    if (rmCheck) {
      rmCheck.addEventListener('change', (e) => {
        this.cameraRig.reducedMotion = e.target.checked;
      });
    }

    // Subscribe to GameState changes for HUD synchronization
    this.gameState.subscribe((state) => {
      this._updateHUD(state);
    });

    this._updateHUD(this.gameState);
    this.previewFighterInLocker('pip');
  }

  _updateCameraSwitcherUI(activeMode) {
    document.querySelectorAll('#hud-camera-bar .cam-pill[data-cam], .camera-switcher-bar .cam-pill[data-cam]').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.cam === activeMode);
    });
    if (this.env && this.env.horizonPlane) {
      this.env.horizonPlane.visible = activeMode !== 'map_overview';
    }
  }

  showNotification(msg) {
    const el = document.getElementById('game-notification');
    if (!el) return;
    el.textContent = msg;
    clearTimeout(this._notifyTimeout);
    this._notifyTimeout = setTimeout(() => {
      el.textContent = '';
    }, 2600);
  }

  setScreen(screenId) {
    this.activeScreen = screenId;
    const screens = [
      this.screenMainMenu,
      this.screenCharSelect,
      this.screenBriefing,
      this.screenPause,
      this.screenVictory,
      this.screenDefeat
    ];

    screens.forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (this.hudOverlay) this.hudOverlay.classList.add('hidden');

    if (screenId === 'main-menu') {
      if (this.screenMainMenu) this.screenMainMenu.classList.remove('hidden');
    } else if (screenId === 'char-select') {
      if (this.screenCharSelect) this.screenCharSelect.classList.remove('hidden');
    } else if (screenId === 'briefing') {
      if (this.screenBriefing) this.screenBriefing.classList.remove('hidden');
    } else if (screenId === 'pause') {
      const waveText = `CARROT COVE  •  WAVE ${this.waveManager.currentWave}`;
      this._setText('pause-wave-subtitle', waveText);
      this._setText('pause-wave-label', waveText);
      if (this.damageTextManager && this.damageTextManager.clearAll) {
        this.damageTextManager.clearAll();
      }
      if (this.cameraRig) {
        this.cameraRig.setMode('ots');
        this.cameraRig.yaw = 0;
        this.cameraRig.pitch = -0.05;
        this.cameraRig.update(0.016, false, false);
      }
      if (this.screenPause) this.screenPause.classList.remove('hidden');
      if (document.pointerLockElement === this.canvas) {
        document.exitPointerLock();
      }
    } else if (screenId === 'victory') {
      if (this.screenVictory) this.screenVictory.classList.remove('hidden');
      if (document.pointerLockElement === this.canvas) {
        document.exitPointerLock();
      }
    } else if (screenId === 'defeat') {
      this._setText('defeat-wave-label', `WAVE ${this.waveManager.currentWave} / 3`);
      if (this.screenDefeat) this.screenDefeat.classList.remove('hidden');
      if (document.pointerLockElement === this.canvas) {
        document.exitPointerLock();
      }
    } else if (screenId === 'game') {
      if (this.hudOverlay) this.hudOverlay.classList.remove('hidden');
    }
  }

  startGameplay(resetWaves = false) {
    this.setScreen('game');
    if (this.autoFireAssist === undefined) {
      this.autoFireAssist = true;
    }

    // Ensure canonical Third-Person Over-The-Shoulder ('ots') camera mode on launch
    this.cameraRig.setMode('ots');
    this.cameraRig.yaw = 0;
    this.cameraRig.pitch = -0.05;

    // Position player in Zone 01 Neighborhood Arrival facing North (-Z) toward the Market
    this.characterMesh.position.set(-0.65, 0, 17.8);
    this.characterMesh.rotation.y = 0;
    this.controller.velocity.set(0, 0, 0);

    this.gameState.health = this.gameState.maxHealth;
    this.gameState.shield = this.gameState.maxShield;
    this.gameState.curAmmo = this.gameState.maxAmmo;

    if (resetWaves || this.enemyAI.enemies.length === 0) {
      this.gameState.dummiesDefeated = 0;
      this.gameState.hitsLanded = 0;
      this.gameState.totalDamageDealt = 0;
      this.pickupManager.spawnInitialPickups();
      this.waveManager.restart();
    }

    this.gameState.notify();
    this.cameraRig.update(0.016, false, false);
  }

  resumeGameplay() {
    if (this.enemyAI.enemies.length === 0 && this.waveManager.waveState === 'victory') {
      this.startGameplay(true);
      return;
    }
    this.setScreen('game');
  }

  previewFighterInLocker(fighterId) {
    const cfg = FIGHTER_CONFIGS[fighterId];
    if (!cfg) return;

    this.switchFighter(fighterId);

    // Update Character Select Screen
    this._setSrc('stage-hero-img', cfg.beautyImg);
    this._setText('stage-hero-title', cfg.title);
    this._setText('stage-hero-name', cfg.name);
    this._setText('stage-hero-desc', `${cfg.role} — ${cfg.abilityDesc}.`);

    const dynLayer = document.getElementById('char-select-dynamic-layer');
    const summaryCard = document.getElementById('char-summary-card');
    if (dynLayer) {
      dynLayer.classList.toggle('hidden', fighterId === 'pip');
    }
    if (summaryCard) {
      summaryCard.classList.toggle('active-override', fighterId !== 'pip');
      summaryCard.classList.toggle('custom-char', fighterId !== 'pip');
    }

    const spEl = document.getElementById('stat-speed-fill');
    if (spEl) spEl.style.width = `${cfg.stats.speed}%`;
    const pwEl = document.getElementById('stat-power-fill');
    if (pwEl) pwEl.style.width = `${cfg.stats.power}%`;
    const tcEl = document.getElementById('stat-tech-fill');
    if (tcEl) tcEl.style.width = `${cfg.stats.tech}%`;

    this._setSrc('stage-weapon-icon', cfg.weaponImg);
    this._setText('stage-weapon-title', cfg.weapon.name);
    this._setText('stage-ability-title', cfg.abilityName);

    document.querySelectorAll('.roster-card').forEach(card => {
      const isSelected = card.dataset.char === fighterId;
      card.classList.toggle('active', isSelected);
      card.classList.toggle('non-default', isSelected && fighterId !== 'pip');
    });

    // Update Briefing fighter pill when non-default fighter is chosen
    const briefingPill = document.getElementById('briefing-fighter-pill');
    if (briefingPill) {
      briefingPill.classList.toggle('hidden', fighterId === 'pip');
    }
    this._setText('briefing-fighter-label', cfg.fullTitle);
    this._setSrc('menu-hero-img', cfg.beautyImg);
    this._setSrc('briefing-hero-img', cfg.beautyImg);
    this._setText('briefing-hero-label', cfg.fullTitle);
    this._setSrc('briefing-weapon-img', cfg.weaponImg);
    this._setText('briefing-weapon-label', cfg.weapon.name);
    this._setText('briefing-ability-label', cfg.abilityName);
    this._setText('briefing-armor-label', cfg.armorLabel);
    this._setSrc('victory-hero-img', cfg.beautyImg);
    this._setSrc('defeat-hero-img', cfg.beautyImg);
  }

  switchFighter(fighterId) {
    if (!FIGHTER_CONFIGS[fighterId]) return;
    this._setupFighter(FIGHTER_CONFIGS[fighterId]);

    document.querySelectorAll('.inventory-slots .slot').forEach(s => {
      s.classList.toggle('active', s.dataset.fighter === fighterId);
    });

    this._setSrc('hud-fighter-img', this.currentFighterConfig.beautyImg);
  }

  _updateHUD(state) {
    const cfg = state.config;

    const hpPct = Math.max(0, Math.round((state.health / state.maxHealth) * 100));
    const hpFill = document.getElementById('health-fill');
    if (hpFill) hpFill.style.width = `${hpPct}%`;
    this._setText('health-val', `${Math.ceil(state.health)}`);

    const shPct = Math.max(0, Math.round((state.shield / state.maxShield) * 100));
    const shFill = document.getElementById('shield-fill');
    if (shFill) shFill.style.width = `${shPct}%`;
    this._setText('shield-val', `${Math.ceil(state.shield)}`);

    this._setText('weapon-name', cfg.weapon.name);
    this._setText('weapon-type', cfg.weapon.type);
    this._setText('ammo-cur', state.isReloading ? 'RLD' : state.curAmmo);
    this._setText('ammo-max', state.reserveAmmo);

    this._setText('ability-name', cfg.abilityName);
    this._setText('ability-key', cfg.abilityKey);

    const waveTitle = `WAVE ${state.currentWave} / ${state.maxWaves}`;
    this._setText('hud-wave-title', waveTitle);
    this._setText('hud-wave-pill', waveTitle);
    this._setText('current-zone-label', state.objectiveText);
    this._setText('hud-zone-tag', state.currentZone);
    this._setText('stat-elim-count', `${state.dummiesDefeated} ELIMS`);
  }

  _triggerVictory() {
    if (this.activeScreen === 'victory') return;
    const state = this.gameState;
    this._setText('res-damage', state.totalDamageDealt);
    this._setText('res-elims', state.dummiesDefeated);
    this._setText('res-hits', state.hitsLanded);
    this._setText('res-carrots', state.carrotsCollected);
    SoundFX.playBounce();
    soundEngine.playFanfare();
    this.setScreen('victory');
  }

  _onPlayerDamaged(amount) {
    if (this.activeScreen !== 'game') return;
    const gs = this.gameState;

    if (gs.shield > 0) {
      const shDamage = Math.min(gs.shield, amount);
      gs.shield -= shDamage;
      amount -= shDamage;
    }
    if (amount > 0) {
      gs.health = Math.max(0, gs.health - amount);
    }
    gs.notify();

    // Flash directional damage vignette
    const vig = document.getElementById('damage-vignette');
    if (vig) {
      vig.classList.remove('hidden');
      clearTimeout(this._vigTimeout);
      this._vigTimeout = setTimeout(() => vig.classList.add('hidden'), 220);
    }

    if (gs.health <= 0) {
      this.setScreen('defeat');
    }
  }

  _spawnFloatingDamageNumber(damage, worldPos, isCrit = false) {
    const screenPos = worldPos.clone().project(this.camera);
    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;
    this.damageTextManager.spawnDamageNumber(x, y, `-${damage}`, isCrit);
  }

  _updateCompassAndBossHUD() {
    const strip = document.getElementById('hud-compass-strip') || document.getElementById('compass-strip');
    if (strip && this.cameraRig) {
      const normYaw = ((this.cameraRig.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const offsetPx = Math.sin(normYaw) * 65;
      strip.style.transform = `translateX(${offsetPx}px)`;
    }

    const bossContainer = document.getElementById('boss-hp-container') || document.getElementById('boss-hud-bar');
    if (bossContainer && this.enemyAI) {
      const boss = this.enemyAI.getActiveBoss();
      if (boss) {
        bossContainer.classList.remove('hidden');
        const pct = Math.max(0, Math.round((boss.health / boss.maxHealth) * 100));
        const fill = document.getElementById('boss-hp-fill') || document.getElementById('boss-bar-fill');
        if (fill) fill.style.width = `${pct}%`;
        this._setText('boss-hp-text', `${Math.ceil(boss.health)} / ${boss.maxHealth}`);
      } else {
        bossContainer.classList.add('hidden');
      }
    }
  }

  _loop() {
    requestAnimationFrame(() => this._loop());

    const now = performance.now() / 1000;
    const dt = Math.min(now - this.lastTime, 0.1);
    this.lastTime = now;

    if (this.activeScreen === 'game') {
      const mouseDelta = this.input.getAndResetMouseDelta();
      let yawDelta = mouseDelta.x;
      if (this.input.isKeyDown('ArrowLeft')) yawDelta -= dt * 2.2;
      if (this.input.isKeyDown('ArrowRight')) yawDelta += dt * 2.2;
      this.cameraRig.handleMouseDelta(yawDelta, mouseDelta.y);

      const isAiming = this.input.isMouseDown(2);

      this.controller.update(dt, this.input, this.cameraRig.yaw, now);
      const isSprinting = Boolean(this.controller.isSprinting);

      const isMoving =
        this.input.isKeyDown('KeyW') ||
        this.input.isKeyDown('KeyS') ||
        this.input.isKeyDown('KeyA') ||
        this.input.isKeyDown('KeyD') ||
        this.input.isKeyDown('ArrowUp') ||
        this.input.isKeyDown('ArrowDown');
      if (this.cameraRig.mode === 'first_person' && this.firstPersonRig) {
        this.firstPersonRig.update(dt, isMoving, isSprinting, isAiming);
      }

      this.cameraRig.update(dt, isAiming, isSprinting);

      // Update crosshair position (centered when Pointer Locked, or following cursor when unlocked)
      const cursorNDC = this.input.isLocked ? null : this.input.cursorNDC;
      const aimCheck = this.weaponSystem.findBestAimTarget(this.cameraRig.getAimRay(cursorNDC));
      const crosshairContainer = document.getElementById('crosshair-container');
      if (crosshairContainer) {
        if (this.input.isLocked) {
          crosshairContainer.style.left = '50%';
          crosshairContainer.style.top = '49%';
        } else {
          crosshairContainer.style.left = `${this.input.cursorPx.x}px`;
          crosshairContainer.style.top = `${this.input.cursorPx.y}px`;
        }
        crosshairContainer.classList.toggle('target-locked', Boolean(aimCheck.target));
      }

      // Smart Camera Aim-Assist: gently help keep camera aligned toward active frontal enemies while moving/fighting
      if (this.cameraRig.mode === 'ots' && Math.abs(mouseDelta.x) < 0.002) {
        const assistEnemy = aimCheck.target || (this.enemyAI.enemies.find(e => e.health > 0) || null);
        if (assistEnemy && assistEnemy.mesh) {
          const dxE = assistEnemy.mesh.position.x - this.characterMesh.position.x;
          const dzE = assistEnemy.mesh.position.z - this.characterMesh.position.z;
          const distE = Math.hypot(dxE, dzE);
          if (distE > 2.0 && distE < 36.0) {
            const desiredYaw = Math.atan2(-dxE, -dzE);
            const yawDiff = Math.atan2(Math.sin(desiredYaw - this.cameraRig.yaw), Math.cos(desiredYaw - this.cameraRig.yaw));
            if (Math.abs(yawDiff) < 0.78) {
              const assistStrength = aimCheck.target ? 2.6 : (isMoving ? 1.4 : 0.6);
              this.cameraRig.yaw += yawDiff * Math.min(1, dt * assistStrength);
            }
          }
        }
      }

      const manualFire =
        this.input.isMouseDown(0) ||
        this.input.isKeyDown('Space') ||
        this.input.isKeyDown('KeyF') ||
        this.input.isKeyDown('KeyE') ||
        this.input.isKeyDown('KeyJ') ||
        this.input.isKeyDown('Enter');
      const autoFireNow = (this.autoFireAssist !== false) && Boolean(aimCheck.target);

      if (manualFire || autoFireNow) {
        this.weaponSystem.tryFire(this.cameraRig, this.characterMesh, this.currentFighterConfig, now, cursorNDC);
        if (this.cameraRig.mode === 'first_person' && this.firstPersonRig) {
          this.firstPersonRig.triggerFireFX();
        }
      }

      // Update Enemy Waves, Pickups & Minimap
      this.enemyAI.update(
        dt,
        this.characterMesh.position,
        this.camera,
        (dmg) => this._onPlayerDamaged(dmg),
        (enemy) => {
          this.damageTextManager.addKillFeed(enemy.label || enemy.type.toUpperCase(), this.currentFighterConfig.weapon.name);
        }
      );
      this.waveManager.update(dt);
      this.pickupManager.update(dt, this.characterMesh.position);

      this.minimap.draw(
        this.characterMesh.position,
        this.cameraRig.yaw,
        this.enemyAI.enemies,
        this.env.bouncePads
      );

      this._updateCompassAndBossHUD();

      // Cooldown UI
      const cdEl = document.getElementById('cooldown-overlay');
      if (cdEl) {
        if (this.gameState.abilityCooldownRemaining > 0) {
          this.gameState.abilityCooldownRemaining = Math.max(0, this.gameState.abilityCooldownRemaining - dt);
          const cdFrac = this.gameState.abilityCooldownRemaining / this.currentFighterConfig.abilityCooldown;
          cdEl.style.transform = `scaleY(${cdFrac})`;
        } else {
          cdEl.style.transform = 'scaleY(0)';
        }
      }
    } else if (this.activeScreen === 'pause') {
      // Keep 3D camera framed where gameplay paused
      this.cameraRig.update(0.0, false, false);
    } else {
      // Keep canonical OTS Carrot Cove framing behind menu screens
      this.cameraRig.update(0.016, false, false);
    }

    this.weaponSystem.update(dt);
    this.env.update(dt, this.characterMesh.position);

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new BunnyRoyaleApp();
});
