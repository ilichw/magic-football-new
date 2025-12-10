import { Ball } from '../classes/Ball.ts';

export class GameScene extends Phaser.Scene {
  protected ball!: Ball;
  protected goalAreas!: Phaser.Physics.Arcade.Sprite[];
  protected player!: Phaser.Physics.Arcade.Sprite;

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
    this.player = this.physics.add.sprite(200, 300, 'player');
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      // repeat: -1,
    });

    this.physics.add.sprite(600, 300, 'bot');

    // ball
    this.ball = new Ball(this, 400, 300, 'ball');

    this.goalAreas!.forEach((goalArea) => {
      this.physics.add.overlap(this.ball, goalArea, () => this.handleGoal());
    });

    // pause logic
    this.input.keyboard!.on('keydown-P', (event: KeyboardEvent) => this.handlePauseKeyPress(event));
  }

  update() {
    // Логика игры
    const cursors = this.input.keyboard!.createCursorKeys();
    let vx = 0,
      vy = 0;

    // Логика движения игрока
    if (cursors.left.isDown) {
      vx = -200;
    } else if (cursors.right.isDown) {
      vx = 200;
    }
    if (cursors.up.isDown) {
      vy = -200;
    } else if (cursors.down.isDown) {
      vy = 200;
    }

    if (vx || vy) {
      this.player.anims.play('walk', true); // Игрок начинает анимацию
      this.player.setFlipX(vx < 0);
    } else {
      // this.player.setFlipX(false);
      this.player.anims.stop();
    }

    this.player.setVelocity(vx, vy);
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
