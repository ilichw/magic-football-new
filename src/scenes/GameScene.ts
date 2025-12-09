// import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Загрузка спрайтов и ресурсов
    this.load.image('player', './assets/player.png');
    this.load.image('bot', './assets/bot.png');
    this.load.image('ball', './assets/ball.png');
  }

  create() {
    // game field
    this.add.text(0, 0, 'PHASER', { color: 'yellow', backgroundColor: 'green' });
    this.add.text(150, 0, 'TypeScript', { color: 'red', fontStyle: 'italic' });
    this.add.text(300, 0, 'Any Sponsor');

    this.physics.add.sprite(400, 300, 'ball');

    // players
    this.physics.add.sprite(200, 300, 'player');
    this.physics.add.sprite(600, 300, 'bot');
  }

  update() {
    // Логика игры
  }
}
