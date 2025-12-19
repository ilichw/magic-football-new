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

  constructor() {
    this.field = new GameField(0, 0, 0, 0);
  }

  init() {
    this.goalAreas = [];
    this.teams = [];
    this.players = [];
  }

  refresh() {
    this.players.forEach((player) => {
      player.reset();
    });
    this.ball.reset();
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
}

const gameState = new GameState();
export default gameState;
