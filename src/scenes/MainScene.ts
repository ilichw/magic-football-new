import { AIPlayer } from '../classes/AIPlayer.ts';
import { Ball } from '../classes/Ball.ts';
import { Player } from '../classes/Player.ts';
import { handleBallCollision } from '../functions/handleBallCollision.ts';
import { constants, initials } from '../config.ts';
import { Attack } from '../classes/Attack.ts';
import type { Actor } from '../classes/Actor.ts';
import { Team } from '../classes/Team.ts';
import gameState from '../state.ts';
import { GoalArea } from '../classes/GoalArea.ts';

export class MainScene extends Phaser.Scene {
  protected goal!: boolean;
  protected goalTriggerCooldown = 100;
  protected goalTriggerTime!: number;

  protected ball!: Ball;
  protected player!: Player;
  protected bot!: AIPlayer;

  // protected goalAreas!: Phaser.Physics.Arcade.Sprite[]; перенос в gameState
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
    // animations
    this.load.spritesheet('player', './assets/player_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('bot', './assets/bot_spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // images
    this.load.image('ball', './assets/ball.png');
    this.load.image('game-field', './assets/game-field.png');
    this.load.image('attack', './assets/attack.png');

    // map
    this.load.image('tiles', './assets/field_tileset.png');
    this.load.tilemapTiledJSON('field', './assets/magic-football-field.json');
  }

  create() {
    // при создании сцены обнуляем флаг гола
    this.goal = false;

    // игровое поле
    const mapX = (constants.screenWidth - constants.mapWidth) / 2;
    const mapY = (constants.screenHeight - constants.mapHeight) / 2;
    const gameFieldX = mapX + constants.tileSize;
    const gameFieldY = mapY + constants.tileSize;
    const gameFieldWidth = constants.mapWidth - constants.tileSize * 2;
    const gameFieldHeight = constants.mapHeight - constants.tileSize * 2;

    const gameField = new Phaser.Geom.Rectangle(gameFieldX, gameFieldY, gameFieldWidth, gameFieldHeight);
    gameState.addField(gameField);

    // фон
    this.physics.add.image(gameState.field.centerX, gameState.field.centerY, 'game-field');

    // карта
    this.initMap(mapX, mapY);

    // ads
    this.createAds();

    // ball
    this.ball = new Ball(this, gameState.field.centerX, gameState.field.centerY, 'ball');

    // players
    this.createPlayers(gameState.field.centerY, gameState.field.centerY);

    // команды
    this.createTeams();

    // ворота
    this.createGoalAreas();

    // collision logic
    this.setColliders();

    // score logic
    this.scene.launch('ScoreScene');

    // pause logic
    this.input.keyboard!.on('keydown-P', this.handlePauseKeyPress, this);

    // логика создания атаки
    this.events.on('userShoots', this.handleUserShoot, this);

    // логика удаления атаки + получения урона игрока
    this.events.on('userHit', this.handleUserHit, this);

    // логика забивания гола
    this.events.once('goal', this.handleGoal, this);
  }

  update(time: number, delta: number) {
    // check goal logic
    this.checkGoal(time);

    // update sprites
    this.ball.update();

    // обновления для игроков
    this.players.forEach((player) => {
      player.update(time, delta);
    });

    // обновления для атак
    this.attacks.forEach((attack) => {
      attack.update(time, delta);
    });
  }

  checkGoal(time: number) {
    gameState.goalAreas.forEach((goalArea) => {
      // получить текущие координаты мяча на поле
      const bounds = this.ball.getBounds();

      // проверить находится ли мяч внутри ворот
      if (goalArea.checkObjectInside(bounds.x, bounds.y, bounds.width, bounds.height)) {
        this.events.emit('goal', goalArea);
      }
    });
  }

  handleGoal(goalArea: GoalArea) {
    // увеличить счет забившей команды
    goalArea.opposingTeam.increaseScore();

    // остановить текущую (главную) сцену
    this.scene.pause();

    // обновить сцену отображения счета
    this.scene.get('ScoreScene').events.emit('updateScore');

    // запуск экрана "гооооооооооооол"
    this.scene.launch('GoalScene');
  }

  initMap(x: number, y: number) {
    this.map = this.make.tilemap({
      key: 'field',
      tileHeight: constants.tileSize,
      tileWidth: constants.tileSize,
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
    this.bot.addObjectToFollow(this.ball);
    this.players = [this.player, this.bot];
  }

  createTeams() {
    const team1 = new Team('Team 1');
    team1.addPlayer(this.player);
    gameState.addTeam(team1);

    const team2 = new Team('Team 2');
    team2.addPlayer(this.bot);
    gameState.addTeam(team2);
  }

  createGoalAreas() {
    const goalAreaY = gameState.field.centerY - constants.goalAreaHeight / 2;
    const goalAreaLeft = new GoalArea(
      gameState.field.left, // x
      goalAreaY, // y
      constants.goalAreaWidth, // width
      constants.goalAreaHeight // height
    );
    const goalAreaRight = new GoalArea(
      gameState.field.right - constants.goalAreaWidth,
      goalAreaY,
      constants.goalAreaWidth,
      constants.goalAreaHeight
    );

    goalAreaLeft.setTeams(gameState.teams[0], gameState.teams[1]);
    goalAreaRight.setTeams(gameState.teams[1], gameState.teams[0]);

    gameState.addGoalArea(goalAreaLeft);
    gameState.addGoalArea(goalAreaRight);
  }

  setColliders() {
    this.ball.setBounce(0.9);
    this.physics.add.collider(this.ball, this.boundLayer);

    this.players.forEach((player) => {
      player.setBounce(0.6);
      this.physics.add.collider(player, this.boundLayer);
    });

    this.physics.add.collider(this.ball, this.boundLayer);

    // collisions with ball
    this.physics.add.collider(this.player, this.ball, handleBallCollision, undefined, this);
    this.physics.add.collider(this.bot, this.ball, handleBallCollision, undefined, this);
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

  handlePauseKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    this.scene.pause();
    this.scene.launch('PauseScene');
  }
}
