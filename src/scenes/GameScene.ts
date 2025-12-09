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
    this.load.image('game-field', './assets/game-field.png');
    this.load.image('goal-area', './assets/goal-area.png');
  }

  create() {
    // game field
    this.physics.add.sprite(400, 300, 'game-field');

    // ads
    this.add.text(20, 570, 'PHASER', { color: 'yellow', backgroundColor: 'green' });
    this.add.text(150, 570, 'TypeScript', { color: 'red', fontStyle: 'italic' });
    this.add.text(300, 570, 'Any Sponsor');

    // goal areas
    this.physics.add.sprite(100, 300, 'goal-area');
    this.physics.add.sprite(700, 300, 'goal-area');

    // ball
    this.physics.add.sprite(400, 300, 'ball');

    // players
    this.physics.add.sprite(200, 300, 'player');
    this.physics.add.sprite(600, 300, 'bot');
  }

  update() {
    // Логика игры
  }
}
