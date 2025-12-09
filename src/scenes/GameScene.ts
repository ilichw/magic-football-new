// import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private ball!: Phaser.Physics.Arcade.Sprite;

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
    this.physics.world.setBounds(80, 60, 800 - 80 * 2, 600 - 60 * 2);

    // game field
    this.physics.add.sprite(400, 300, 'game-field');

    // ads
    this.add.text(20, 570, 'PHASER', { color: 'yellow', backgroundColor: 'green' });
    this.add.text(150, 570, 'TypeScript', { color: 'red', fontStyle: 'italic' });
    this.add.text(300, 570, 'Any Sponsor');

    // goal areas
    this.physics.add.sprite(100, 300, 'goal-area');
    this.physics.add.sprite(700, 300, 'goal-area');

    // players
    this.physics.add.sprite(200, 300, 'player');
    this.physics.add.sprite(600, 300, 'bot');

    // ball
    this.ball = this.physics.add.sprite(400, 300, 'ball');
    this.ball.setVelocity(200, 200);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    // pause logic
    this.input.keyboard!.once('keydown-P', (event: KeyboardEvent) => {
      event.preventDefault();
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  update() {
    // Логика игры
  }
}
