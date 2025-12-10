import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.ts';
import { PauseScene } from './scenes/PauseScene.ts';
import { GameOverScene } from './scenes/GameOverScene.ts';
import { constants } from './config.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  physics: {
    default: 'arcade',
  },
  scene: [GameScene, PauseScene, GameOverScene],
};

window.onload = () => {
  new Phaser.Game(config);
};
