import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.ts';
import { PauseScene } from './scenes/PauseScene.ts';
import { GoalScene } from './scenes/GoalScene.ts';
import { constants } from './config.ts';
import { ScoreScene } from './scenes/ScoreScene.ts';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  physics: {
    default: 'arcade',
  },
  scene: [MainScene, PauseScene, GoalScene, ScoreScene],
};

window.onload = () => {
  new Phaser.Game(gameConfig);
};
