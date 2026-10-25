// Wave and Encounter State Manager for Carrot Cove
// Wave 1 / 3: CLEAR THE MARKET (2 Raiders + 1 Hopper + 1 Rival Rabbit Challenger)
// Wave 2 / 3: PUSH THROUGH MARKET AVENUE (2 Raiders + 2 Hoppers + Heavy Rival Bruno Challenger)
// Wave 3 / 3: DEFEAT THE FOREMAN (Foreman Boss + 2 Raiders + Elite Rival Challenger)

export class WaveManager {
  constructor(enemyAI, gameState, onWaveChange, onWaveComplete, onGameVictory) {
    this.enemyAI = enemyAI;
    this.gameState = gameState;
    this.onWaveChange = onWaveChange;
    this.onWaveComplete = onWaveComplete;
    this.onGameVictory = onGameVictory;

    this.currentWave = 1;
    this.maxWaves = 3;
    this.waveState = 'pending'; // 'pending' | 'active' | 'wave_cleared' | 'victory'
    this.objectiveText = 'CLEAR THE MARKET';
  }

  startEncounter(waveIndex = 1, immediate = false) {
    this.currentWave = waveIndex;
    this.waveState = 'active';
    const playerFighter = this.gameState ? this.gameState.currentFighterId : 'pip';

    if (waveIndex === 1) {
      this.objectiveText = 'CLEAR THE MARKET';
      this.gameState.setZone('01 NEIGHBORHOOD');
      // 2 Raiders + 1 Hopper + 1 Rival Challenger spaced downrange across Carrot Cove street
      const rivalType = playerFighter === 'volt' ? 'rival_pip' : 'rival_volt';
      this.enemyAI.spawnEnemy('raider', { x: -2.85, y: 0, z: 9.2 }, immediate);
      this.enemyAI.spawnEnemy('hopper', { x: -0.35, y: 0.45, z: 3.4 }, immediate);
      this.enemyAI.spawnEnemy('raider', { x: 3.85, y: 0, z: 9.6 }, immediate);
      this.enemyAI.spawnEnemy(rivalType, { x: 1.65, y: 0, z: -1.4 }, immediate);
    } else if (waveIndex === 2) {
      this.objectiveText = 'CLEAR MARKET AVENUE';
      this.gameState.setZone('02 MARKET');
      // 2 Raiders + 2 Hoppers + 1 Heavy Rival Challenger (rival_bruno)
      this.enemyAI.spawnEnemy('hopper', { x: -1.8, y: 0, z: 1.5 }, immediate);
      this.enemyAI.spawnEnemy('hopper', { x: 2.2, y: 0, z: -2.0 }, immediate);
      this.enemyAI.spawnEnemy('raider', { x: -4.2, y: 0, z: -4.5 }, immediate);
      this.enemyAI.spawnEnemy('raider', { x: 4.5, y: 0, z: -6.0 }, immediate);
      this.enemyAI.spawnEnemy('rival_bruno', { x: 0.35, y: 0, z: -3.2 }, immediate);
    } else if (waveIndex === 3) {
      this.objectiveText = 'DEFEAT THE FOREMAN';
      this.gameState.setZone('03 SERVICE YARD');
      // The Foreman Boss + 2 Raiders + 1 Elite Rival Challenger
      const eliteRival = playerFighter === 'pip' ? 'rival_volt' : 'rival_pip';
      this.enemyAI.spawnEnemy('foreman', { x: -0.6, y: 0, z: -20.2 }, immediate);
      this.enemyAI.spawnEnemy('raider', { x: -4.8, y: 0, z: -16.5 }, immediate);
      this.enemyAI.spawnEnemy('raider', { x: 4.8, y: 0, z: -16.5 }, immediate);
      this.enemyAI.spawnEnemy(eliteRival, { x: 3.6, y: 0, z: -17.2 }, immediate);
    }

    if (this.onWaveChange) {
      this.onWaveChange(this.currentWave, this.maxWaves, this.objectiveText, immediate);
    }
  }

  spawnRivalDuel(fighterId = null, customPos = null) {
    if (!this.enemyAI) return null;
    if (this.waveState !== 'active') {
      this.waveState = 'active';
    }
    return this.enemyAI.spawnRivalDuel(fighterId, customPos);
  }

  update(dt) {
    if (this.waveState !== 'active') return;

    const remainingEnemies = this.enemyAI.enemies.length + this.enemyAI.spawnTelegraphs.length;

    if (remainingEnemies === 0) {
      if (this.currentWave < this.maxWaves) {
        this.waveState = 'wave_cleared';
        if (this.onWaveComplete) this.onWaveComplete(this.currentWave);

        setTimeout(() => {
          if (this.waveState === 'wave_cleared') {
            this.startEncounter(this.currentWave + 1, false);
          }
        }, 1600);
      } else {
        this.waveState = 'victory';
        this.objectiveText = 'REACH THE EXIT \u2192';
        if (this.onWaveChange) {
          this.onWaveChange(this.currentWave, this.maxWaves, this.objectiveText);
        }
        if (this.onGameVictory) this.onGameVictory();
      }
    }
  }

  restart() {
    this.enemyAI.clear();
    this.startEncounter(1, true);
  }
}
