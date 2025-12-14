import { AIPlayer } from '../classes/AIPlayer.ts';
import { Ball } from '../classes/Ball.ts';
import { Player } from '../classes/Player.ts';
import { handleBallCollision } from '../functions/handleBallCollision.ts';
import { constants, initials } from '../config.ts';
import gameState from '../state.ts';
import { Attack } from '../classes/Attack.ts';
import type { Actor } from '../classes/Actor.ts';

export class MainScene extends Phaser.Scene {
  protected ball!: Ball;
  protected player!: Player;
  protected bot!: AIPlayer;

  protected goalAreas!: Phaser.Physics.Arcade.Sprite[];
  protected attacks: Attack[] = [];
  protected players!: Actor[];

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
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
    this.load.image('attack', './assets/attack.png');
  }

  create() {
    // определение границ игрового мира
    const fieldLeftX = (constants.screenWidth - constants.fieldWidth) / 2,
      fieldLeftY = (constants.screenHeight - constants.fieldHeight) / 2,
      fieldRightX = constants.screenWidth - fieldLeftX * 2,
      fieldRightY = constants.screenHeight - fieldLeftY * 2;
    this.physics.world.setBounds(fieldLeftX, fieldLeftY, fieldRightX, fieldRightY);

    const fieldCenterX = constants.screenWidth / 2;
    const fieldCenterY = constants.screenHeight / 2;

    // game field
    this.physics.add.sprite(fieldCenterX, fieldCenterY, 'game-field');

    // ads
    this.createAds();

    // goal areas
    const goalAreaLeftX = fieldLeftX + constants.goalAreaOffset;
    const goalAreaLeft = this.physics.add.sprite(goalAreaLeftX, fieldCenterY, 'goal-area');

    const goalAreaRightX = fieldLeftX + fieldRightX - constants.goalAreaOffset;
    const goalAreaRight = this.physics.add.sprite(goalAreaRightX, fieldCenterY, 'goal-area');

    // ворота в обратном порядке чтобы соответствовало номерам команд
    // типа команда 0 левая а забить надо в ворота 0 правые
    this.goalAreas = [goalAreaRight, goalAreaLeft];

    // ball
    this.ball = new Ball(this, fieldCenterX, fieldCenterY, 'ball');

    // players
    this.player = new Player(this, initials.playerX, fieldCenterY, 'player');
    this.bot = new AIPlayer(this, initials.botX, fieldCenterY, 'bot', this.ball);
    this.players = [this.player, this.bot];

    // collisions with field bounds
    this.ball.setCollideWorldBounds(true, 1, 1);
    this.player.setCollideWorldBounds(true);
    this.bot.setCollideWorldBounds(true);

    // collisions with ball
    this.physics.add.collider(this.player, this.ball, handleBallCollision, undefined, this);
    this.physics.add.collider(this.bot, this.ball, handleBallCollision, undefined, this);

    // goal logic
    this.goalAreas!.forEach((goalArea, index) => {
      this.physics.add.overlap(this.ball, goalArea, () => this.handleGoal(index), undefined, this);
    });

    // score logic
    this.scene.launch('ScoreScene');

    // pause logic
    this.input.keyboard!.on('keydown-P', this.handlePauseKeyPress, this);

    // логика создания атаки
    this.events.on('userShoots', this.handleUserShoot, this);

    // логика удаления атаки + получения урона игрока
    this.events.on('userHit', this.handleUserHit, this);
  }

  update(time: number, delta: number) {
    this.ball.update();

    this.players.forEach((player) => {
      player.update(time, delta);
    });

    this.attacks.forEach((attack) => {
      attack.update(time, delta);
    });
  }

  handleUserHit() {
    // как находить атаку по id
  }

  handleUserShoot(userX: number, userY: number) {
    const attack = new Attack(this, userX, userY, 'attack');
    this.attacks.push(attack);
  }

  createAds() {
    this.add.text(20, 570, 'PHASER', { color: 'yellow', backgroundColor: 'green' });
    this.add.text(150, 570, 'TypeScript', { color: 'red', fontStyle: 'italic' });
    this.add.text(300, 570, 'Any Sponsor');
  }

  handleGoal(goalIndex: number) {
    gameState.teams[goalIndex].increaseScore();
    this.scene.get('ScoreScene').events.emit('updateScore');
    this.scene.pause();
    this.scene.launch('GoalScene');
  }

  handlePauseKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    this.scene.pause();
    this.scene.launch('PauseScene');
  }
}
