// Authoritative State Store for Player & Game Session
export class GameState {
  constructor(initialFighterConfig) {
    this.config = initialFighterConfig;
    this.currentFighterId = initialFighterConfig.id;

    // Vitals
    this.maxHealth = initialFighterConfig.maxHealth;
    this.health = this.maxHealth;
    this.maxShield = initialFighterConfig.maxShield;
    this.shield = this.maxShield;

    // Weapon state (matches 30 / 120 in ui-gameplay-v2.png)
    this.curAmmo = initialFighterConfig.weapon.magSize;
    this.maxAmmo = initialFighterConfig.weapon.magSize;
    this.reserveAmmo = initialFighterConfig.weapon.reserveAmmo || 120;
    this.isReloading = false;
    this.reloadProgress = 0;
    this.lastFireTime = 0;

    // Ability state
    this.abilityCooldownRemaining = 0;

    // Session & Wave Stats
    this.hitsLanded = 0;
    this.shotsFired = 0;
    this.totalDamageDealt = 0;
    this.dummiesDefeated = 0;
    this.carrotsCollected = 250;
    this.currentZone = '01 NEIGHBORHOOD';
    this.currentWave = 1;
    this.maxWaves = 3;
    this.objectiveText = 'CLEAR THE MARKET';

    // Observers / Listeners
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  setFighter(newConfig) {
    this.config = newConfig;
    this.currentFighterId = newConfig.id;
    this.maxHealth = newConfig.maxHealth;
    this.health = this.maxHealth;
    this.maxShield = newConfig.maxShield;
    this.shield = this.maxShield;
    this.maxAmmo = newConfig.weapon.magSize;
    this.curAmmo = this.maxAmmo;
    this.reserveAmmo = newConfig.weapon.reserveAmmo || 120;
    this.isReloading = false;
    this.abilityCooldownRemaining = 0;
    this.notify();
  }

  recordHit(damage) {
    this.hitsLanded++;
    this.totalDamageDealt += damage;
    this.notify();
  }

  recordDefeat() {
    this.dummiesDefeated++;
    this.carrotsCollected += 25;
    this.notify();
  }

  setZone(zoneName) {
    if (this.currentZone !== zoneName) {
      this.currentZone = zoneName;
      this.notify();
    }
  }

  setWaveInfo(wave, objective) {
    this.currentWave = wave;
    if (objective) this.objectiveText = objective;
    this.notify();
  }
}
