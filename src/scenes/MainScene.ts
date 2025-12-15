import { AIPlayer } from '../classes/AIPlayer.ts';
import { Ball } from '../classes/Ball.ts';
import { Player } from '../classes/Player.ts';
import { handleBallCollision } from '../functions/handleBallCollision.ts';
import { constants, initials } from '../config.ts';
import gameState from '../state.ts';
import { Attack } from '../classes/Attack.ts';
import type { Actor } from '../classes/Actor.ts';

export class MainScene extends Phaser.Scene {
  goal!: boolean;
  goalTriggerCooldown = 100;
  goalTriggerTime!: number;

  protected ball!: Ball;
  protected player!: Player;
  protected bot!: AIPlayer;

  protected goalAreas!: Phaser.Physics.Arcade.Sprite[];
  protected attacks: Attack[] = [];
  protected players!: Actor[];

  protected map!: Phaser.Tilemaps.Tilemap;
  protected tileset!: Phaser.Tilemaps.Tileset;
  protected boundLayer!: Phaser.Tilemaps.TilemapLayer;
  protected goalLayer!: Phaser.Tilemaps.TilemapLayer;

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

    // map
    this.load.image('tiles', './assets/field_tileset.png');
    this.load.tilemapTiledJSON('field', './assets/magic-football-field.json');

    this.load.image('ball', './assets/ball.png');
    this.load.image('game-field', './assets/game-field.png');
    this.load.image('goal-area', './assets/goal-area.png');
    this.load.image('attack', './assets/attack.png');
  }

  create() {
    this.goal = false;

    // определение границ игрового мира
    const fieldLeftX = (constants.screenWidth - constants.fieldWidth) / 2;
    const fieldLeftY = (constants.screenHeight - constants.fieldHeight) / 2;
    const fieldRightX = constants.screenWidth - fieldLeftX * 2;
    const fieldRightY = constants.screenHeight - fieldLeftY * 2;
    const fieldCenterX = constants.screenWidth / 2;
    const fieldCenterY = constants.screenHeight / 2;

    // game field
    this.physics.add.image(fieldCenterX, fieldCenterY, 'game-field');
    this.initMap(fieldLeftX, fieldLeftY);

    // ads
    this.createAds();

    // goal areas
    const goalAreaLeftX = fieldLeftX + constants.goalAreaOffset;
    // const goalAreaLeft = this.physics.add.sprite(goalAreaLeftX, fieldCenterY, 'goal-area');

    const goalAreaRightX = fieldLeftX + fieldRightX - constants.goalAreaOffset;
    // const goalAreaRight = this.physics.add.sprite(goalAreaRightX, fieldCenterY, 'goal-area');

    // ворота в обратном порядке чтобы соответствовало номерам команд
    // типа команда 0 левая а забить надо в ворота 0 правые
    // this.goalAreas = [goalAreaRight, goalAreaLeft];
    this.goalAreas = [];

    // ball
    this.ball = new Ball(this, fieldCenterX, fieldCenterY, 'ball');

    // players
    this.createPlayers(fieldCenterY, fieldCenterY);

    // colliders logic
    this.setColliders();

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
    // check goal logic
    this.checkGoal(time);

    // update sprites
    this.ball.update();

    this.players.forEach((player) => {
      player.update(time, delta);
    });

    this.attacks.forEach((attack) => {
      attack.update(time, delta);
    });
  }

  checkGoal(time: number) {
    // получить текущие координаты мяча на поле
    const bounds = this.ball.getBounds();

    // получить тайлы с которыми пересекается спрайт мяча
    const tiles = this.goalLayer.getTilesWithinWorldXY(bounds.x, bounds.y, bounds.width, bounds.height);

    for (let tile of tiles) {
      if (this.goal) {
        // событие мяч в воротах триггерится с задержкой так задумано
        if (time - this.goalTriggerTime >= this.goalTriggerCooldown) {
          this.handleTriggerTile(tile, this.ball);
        } else break; // чтобы не срабатывало повторное определение гола когда мяч в воротах
      }

      // а это зачем ладно посмотрим
      if (!tile) continue;

      if (tile.properties && tile.properties.trigger === true) {
        // флаг что гол забит
        this.goal = true;
        this.goalTriggerTime = time;
      }
    }
  }

  handleTriggerTile(goalArea: any, ball: Ball) {
    // console.log('goal!', this.goal);
    // console.log(goalArea);
    this.scene.pause();
    this.scene.launch('GoalScene');
  }

  initMap(x: number, y: number) {
    this.map = this.make.tilemap({
      key: 'field',
      tileHeight: 8,
      tileWidth: 8,
    });

    // привязать набор тайлов к карте
    this.tileset = this.map.addTilesetImage('field_tileset', 'tiles') as Phaser.Tilemaps.Tileset;

    // загрузить слои карты
    this.boundLayer = this.map.createLayer('bounds', this.tileset, x, y) as Phaser.Tilemaps.TilemapLayer;
    this.goalLayer = this.map.createLayer('goal-areas', this.tileset, x, y) as Phaser.Tilemaps.TilemapLayer;

    this.physics.world.setBounds(x, y, this.boundLayer.width, this.boundLayer.height);

    // console.log(this.boundLayer);
    this.boundLayer.setCollisionByProperty({ collide: true });
  }

  createPlayers(y1: number, y2: number) {
    this.player = new Player(this, initials.playerX, y1, 'player', 'player 1');
    this.bot = new AIPlayer(this, initials.botX, y2, 'bot', 'player 2');
    // this.bot.addObjectToFollow(this.ball);
    this.players = [this.player, this.bot];
  }

  setColliders() {
    this.ball.setBounce(0.9);
    this.physics.add.collider(this.ball, this.boundLayer);

    this.players.forEach((player) => {
      player.setBounce(0.6);
      this.physics.add.collider(player, this.boundLayer);
    });
    // collisions with field bounds
    // this.ball.setCollideWorldBounds(true, 1, 1);
    // this.player.setCollideWorldBounds(true);
    // this.bot.setCollideWorldBounds(true);

    // this.player
    this.physics.add.collider(this.ball, this.boundLayer);
    // collisions with ball
    this.physics.add.collider(this.player, this.ball, handleBallCollision, undefined, this);
    this.physics.add.collider(this.bot, this.ball, handleBallCollision, undefined, this);

    // goal logic
    this.goalAreas!.forEach((goalArea, index) => {
      this.physics.add.overlap(this.ball, goalArea, () => this.handleGoal(index), undefined, this);
    });
  }

  handleUserShoot(userX: number, userY: number, userName: string, time: number) {
    // логика создания новой атаки (спрайта)
    const attack = new Attack(this, userX, userY, 'attack', time);
    this.attacks.push(attack);

    attack.setCollideWorldBounds(true, 0, 0, true);

    this.events.on('worldbounds', (attack: any) => {
      attack.destroy();
    });

    // логика добавления удаления атаки при попадании в игрока
    // + получения игроком урона
    this.players
      .filter((player) => player.name !== userName)
      .forEach((player) => {
        this.physics.add.collider(player, attack, (player, attack: any) => {
          // player.getDamage()
          this.events.emit('userHit', attack.creationTime);
        });
      });
  }

  handleUserHit(time: number) {
    console.log(time);
    // как находить атаку по id
    this.attacks
      .filter((attack) => attack.creationTime === time)
      .forEach((attack) => {
        attack.destroy();
      });
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
