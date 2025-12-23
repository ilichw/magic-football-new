import type { Attack } from './classes/Attack';
import { Ball } from './classes/Ball';
import { GameField } from './classes/GameField';
import type { GoalArea } from './classes/GoalArea';
import type { Player } from './classes/Player';
import type { Team } from './classes/Team';

class GameState {
  public field: GameField;
  public goalAreas: GoalArea[] = [];
  public ball!: Ball;
  public teams: Team[] = [];
  public players: Player[] = [];
  public attacks!: Phaser.GameObjects.Group;

  constructor() {
    // костыль чтобы не было ошибки в ScoreScene
    this.field = new GameField(0, 0, 0, 0);
  }

  // оказывается я ее не использую
  init() {
    this.goalAreas = [];
    this.teams = [];
    this.players = [];
  }

  refresh() {
    [...this.players, ...this.goalAreas, this.ball].forEach((elem) => {
      elem.reset();
    });
  }

  // для меня так понятнее чем gameState.players.push()
  addBall(ball: Ball) {
    this.ball = ball;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addTeam(team: Team) {
    this.teams.push(team);
  }

  addGoalArea(goalArea: GoalArea) {
    this.goalAreas.push(goalArea);
  }

  setField(field: GameField) {
    this.field = field;
  }

  destroyAttack(attack: Attack) {
    attack.destroy();
  }
}

const gameState = new GameState();
export default gameState;
