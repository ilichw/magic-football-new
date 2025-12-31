import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.ts';
import { BigMessageScene } from './scenes/BigMessageScene.ts';
import { constants } from './config.ts';
import { UIScene } from './scenes/UIScene.ts';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  physics: {
    default: 'arcade',
  },
  scene: [MainScene, BigMessageScene, UIScene],
};

window.onload = () => {
  new Phaser.Game(gameConfig);
};
