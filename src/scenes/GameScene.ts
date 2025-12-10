import { Ball } from '../classes/Ball.ts';
import { Player } from '../classes/Player.ts';

export class GameScene extends Phaser.Scene {
  protected ball!: Ball;
  protected goalAreas!: Phaser.Physics.Arcade.Sprite[];
  protected player!: Player;
  protected bot!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Загрузка спрайтов и ресурсов
    this.load.spritesheet('player', './assets/player_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
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
    const goalAreaLeft = this.physics.add.sprite(100, 300, 'goal-area');
    const goalAreaRight = this.physics.add.sprite(700, 300, 'goal-area');
    this.goalAreas = [goalAreaLeft, goalAreaRight];

    // players
    this.player = new Player(this, 200, 300, 'player');

    this.bot = this.physics.add.sprite(600, 300, 'bot');

    // ball
    this.ball = new Ball(this, 400, 300, 'ball');

    // COLLISIONS
    this.ball.setCollideWorldBounds(true, 1, 1);
    this.player.setCollideWorldBounds(true);
    this.bot.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.ball, this.handleBallCollision, undefined, this);
    this.physics.add.collider(this.bot, this.ball);

    this.goalAreas!.forEach((goalArea) => {
      this.physics.add.overlap(this.ball, goalArea, this.handleGoal, undefined, this);
    });

    // pause logic
    this.input.keyboard!.on('keydown-P', this.handlePauseKeyPress, this);
  }

  update() {
    this.player.update();
  }

  handleBallCollision(player: any, ball: any) {
    // Задайте направление отскока мяча
    const bounceStrength = 400; // Задайте силу отскока

    // Начавшаяся скорость мяча
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;

    // Нормализовать вектор
    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedX = dx / length;
    const normalizedY = dy / length;

    // Задаем новую скорость мяча
    ball.setVelocity(bounceStrength * normalizedX, bounceStrength * normalizedY);
  }

  handleGoal() {
    this.scene.pause();
    this.scene.launch('GameOverScene');
  }

  handlePauseKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    this.scene.pause();
    this.scene.launch('PauseScene');
  }
}
