import type { GoalArea } from './classes/GoalArea';
import type { Team } from './classes/Team';

class GameState {
  public teams: Team[] = [];
  public goalAreas: GoalArea[] = [];
  public field!: Phaser.Geom.Rectangle;

  constructor() {}

  addTeam(team: Team) {
    this.teams.push(team);
  }

  addGoalArea(goalArea: GoalArea) {
    this.goalAreas.push(goalArea);
  }

  addField(field: Phaser.Geom.Rectangle) {
    this.field = field;
  }
}

const gameState = new GameState();
export default gameState;
