import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.ts';
import { PauseScene } from './scenes/PauseScene.ts';
import { GameOverScene } from './scenes/GameOverScene.ts';
import { constants } from './config.ts';
import { ScoreScene } from './scenes/ScoreScene.ts';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  physics: {
    default: 'arcade',
  },
  scene: [GameScene, PauseScene, GameOverScene, ScoreScene],
};

window.onload = () => {
  new Phaser.Game(gameConfig);
};
