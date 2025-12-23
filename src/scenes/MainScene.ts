import { AIPlayer } from '../classes/AIPlayer.ts';
import { Ball } from '../classes/Ball.ts';
import { UIPlayer } from '../classes/UIPlayer.ts';
import { handleBallCollision } from '../functions/handleBallCollision.ts';
import { constants, initials } from '../config.ts';
import { Attack } from '../classes/Attack.ts';
import { Team } from '../classes/Team.ts';
import gameState from '../state.ts';
import { GoalArea } from '../classes/GoalArea.ts';
import { GameField } from '../classes/GameField.ts';
import type { Player } from '../classes/Player.ts';
import { Effect, EffectType } from '../classes/Effect.ts';

export class MainScene extends Phaser.Scene {
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
    const attacks = this.physics.add.group();
    gameState.attacks = attacks;

    // игровое поле
    const mapX = (constants.screenWidth - constants.mapWidth) / 2;
    const mapY = (constants.screenHeight - constants.mapHeight) / 2;
    const fieldX = mapX + constants.tileSize;
    const fieldY = mapY + constants.tileSize;
    const fieldWidth = constants.mapWidth - constants.tileSize * 2;
    const fieldHeight = constants.mapHeight - constants.tileSize * 2;

    const field = new GameField(fieldX, fieldY, fieldWidth, fieldHeight);
    field.addScene(this);
    field.initBackground('game-field'); // фон
    gameState.setField(field);

    this.initMap(mapX, mapY);
    this.createAds();
    this.createBall(gameState.field.centerX, gameState.field.centerY);
    this.createPlayers(gameState.field.centerY, gameState.field.centerY);
    this.createTeams();
    this.createGoalAreas();
    this.setColliders();
    this.scene.launch('ScoreScene'); // отображение счета

    // --- СОБЫТИЯ ---
    // pause logic
    this.input.keyboard!.on('keydown-P', this.handlePauseKeyPress, this);

    // логика создания атаки
    this.events.on('userShoots', this.handleUserShoot, this);

    // логика удаления атаки + получения урона игрока
    this.events.on('userHit', this.handleUserHit, this);

    // логика забивания гола
    this.events.on('goal', this.handleGoal, this);
  }

  shutdown() {
    // отключение обработчиков событий
    this.input.keyboard!.off('keydown-P', this.handlePauseKeyPress, this);
    this.events.off('userShoots', this.handleUserShoot, this);
    this.events.off('userHit', this.handleUserHit, this);
    this.events.off('goal', this.handleGoal, this);
  }

  update(time: number, delta: number) {
    // check goal logic
    this.detectGoal(time);

    // update sprites
    gameState.ball.update();

    // обновления для игроков
    gameState.players.forEach((player) => {
      player.update(time, delta);
    });

    // обновления для атак
    gameState.attacks.children.each((attack) => {
      attack.update(time, delta);
      return null;
    });
  }

  detectGoal(time: number) {
    gameState.goalAreas.forEach((goalArea) => {
      // получить текущие координаты мяча на поле
      const bounds = gameState.ball.getBounds();

      // проверить находится ли мяч внутри ворот
      if (!goalArea.goal && goalArea.contains(bounds.centerX, bounds.centerY)) {
        goalArea.goal = true;
        goalArea.goalTriggerTime = time;
      }

      // определение гола с задержкой для реалистичности
      if (goalArea.goal && time - goalArea.goalTriggerTime >= constants.goalTriggerCooldown) {
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
    const map = this.make.tilemap({
      key: 'field',
      tileHeight: constants.tileSize,
      tileWidth: constants.tileSize,
    });

    // привязать набор тайлов к карте
    const tileset = map.addTilesetImage('field_tileset', 'tiles') as Phaser.Tilemaps.Tileset;

    // загрузить слои карты
    this.boundLayer = map.createLayer('bounds', tileset, x, y) as Phaser.Tilemaps.TilemapLayer;
    this.goalLayer = map.createLayer('goal-areas', tileset, x, y) as Phaser.Tilemaps.TilemapLayer;

    // обозначить границы мира
    this.physics.world.setBounds(x, y, this.boundLayer.width, this.boundLayer.height);

    // столкновение с границами поля
    this.boundLayer.setCollisionByProperty({ collide: true });
  }

  createBall(x: number, y: number) {
    const ball = new Ball(this, x, y, 'ball');
    gameState.addBall(ball);
  }

  createPlayers(y1: number, y2: number) {
    const player = new UIPlayer(this, initials.playerX, y1, 'player', 'player 1');
    gameState.addPlayer(player);

    const bot = new AIPlayer(this, initials.botX, y2, 'bot', 'player 2');
    bot.addObjectToFollow(gameState.ball);
    gameState.addPlayer(bot);
  }

  createTeams() {
    const team1 = new Team('Team 1');
    team1.addPlayer(gameState.players[0]);
    gameState.addTeam(team1);

    const team2 = new Team('Team 2');
    team2.addPlayer(gameState.players[1]);
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
    gameState.ball.setBounce(0.9);
    this.physics.add.collider(gameState.ball, this.boundLayer);

    gameState.players.forEach((player) => {
      // для каждого игрока: столкновения с границами
      this.physics.add.collider(player, this.boundLayer);

      // логика столкновения с мячом
      this.physics.add.collider(player, gameState.ball, handleBallCollision, undefined, this);

      // логика столкновения с атакой
      this.physics.add.collider(player, gameState.attacks, (player, attack: any) => {
        this.events.emit('userHit', player, attack);
      });
    });
  }

  handleUserShoot(userX: number, userY: number, userName: string, time: number) {
    // логика создания новой атаки (спрайта)
    const effect = new Effect(EffectType.Slowdown, 5000);
    const attack = new Attack(this, userX, userY, 'attack', userName, time, effect);
    gameState.attacks.add(attack);
  }

  // логика попадания атаки в игрока
  handleUserHit(player: Player, attack: Attack) {
    // проверяется попадание в любого игрока кроме инициатора атаки
    if (player.name !== attack.emitterName) {
      player.addEffect(attack.effect.type);

      this.time.addEvent({
        delay: attack.effect.timeout,
        callback: () => player.removeEffect(attack.effect.type),
      });

      gameState.destroyAttack(attack);
    }
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
