import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.ts';
import { FullscreenMessageScene } from './scenes/FullscreenMessageScene.ts';
import { GoalScene } from './scenes/GoalScene.ts';
import { constants } from './config.ts';
import { UIScene } from './scenes/UIScene.ts';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  physics: {
    default: 'arcade',
  },
  scene: [MainScene, FullscreenMessageScene, GoalScene, UIScene],
};

window.onload = () => {
  new Phaser.Game(gameConfig);
};
