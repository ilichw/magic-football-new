import { AIPlayer } from '../classes/AIPlayer.ts';
import { Ball } from '../classes/Ball.ts';
import { Player } from '../classes/Player.ts';
import { handleBallCollision } from '../functions/handleBallCollision.ts';
import { constants, initials } from '../config.ts';

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
    this.load.spritesheet('bot', './assets/bot_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image('ball', './assets/ball.png');
    this.load.image('game-field', './assets/game-field.png');
    this.load.image('goal-area', './assets/goal-area.png');
  }

  create() {
    const fieldBoundStartX = (constants.screenWidth - constants.fieldWidth) / 2,
      fieldBoundStartY = (constants.screenHeight - constants.fieldHeight) / 2,
      fieldBoundEndX = constants.screenWidth - fieldBoundStartX * 2,
      fieldBoundEndY = constants.screenHeight - fieldBoundStartY * 2;
    this.physics.world.setBounds(fieldBoundStartX, fieldBoundStartY, fieldBoundEndX, fieldBoundEndY);

    // game field
    this.physics.add.sprite(constants.screenWidth / 2, constants.screenHeight / 2, 'game-field');

    // ads
    this.add.text(20, 570, 'PHASER', { color: 'yellow', backgroundColor: 'green' });
    this.add.text(150, 570, 'TypeScript', { color: 'red', fontStyle: 'italic' });
    this.add.text(300, 570, 'Any Sponsor');

    // goal areas
    const goalAreaLeft = this.physics.add.sprite(
      fieldBoundStartX + constants.goalAreaOffset,
      constants.screenHeight / 2,
      'goal-area'
    );
    const goalAreaRight = this.physics.add.sprite(
      fieldBoundStartX + fieldBoundEndX - constants.goalAreaOffset,
      constants.screenHeight / 2,
      'goal-area'
    );
    this.goalAreas = [goalAreaLeft, goalAreaRight];

    // ball
    this.ball = new Ball(this, constants.screenWidth / 2, constants.screenHeight / 2, 'ball');

    // players
    this.player = new Player(this, initials.playerX, constants.screenHeight / 2, 'player');
    this.bot = new AIPlayer(this, initials.botX, constants.screenHeight / 2, 'bot', this.ball);

    // COLLISIONS
    this.ball.setCollideWorldBounds(true, 1, 1);
    this.player.setCollideWorldBounds(true);
    this.bot.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.ball, handleBallCollision, undefined, this);
    this.physics.add.collider(this.bot, this.ball, handleBallCollision, undefined, this);

    this.goalAreas!.forEach((goalArea) => {
      this.physics.add.overlap(this.ball, goalArea, this.handleGoal, undefined, this);
    });

    // pause logic
    this.input.keyboard!.on('keydown-P', this.handlePauseKeyPress, this);
  }

  update() {
    this.ball.update();
    this.player.update();
    this.bot.update();
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
