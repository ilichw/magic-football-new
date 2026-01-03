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
    // костыль чтобы не было ошибки в UIScene
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

  // возвращает имя победившей команды либо draw (ничья)
  getWinner(): string {
    const team1Score = this.teams[0].score;
    const team2Score = this.teams[1].score;
    if (team1Score === team2Score) return 'draw';

    return team1Score > team2Score ? this.teams[0].name : this.teams[1].name;
  }
}

const gameState = new GameState();
export default gameState;
