import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.ts';
import { PauseScene } from './scenes/PauseScene.ts';
import { GameOverScene } from './scenes/GameOverScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: [GameScene, PauseScene, GameOverScene],
};

const game = new Phaser.Game(config);
