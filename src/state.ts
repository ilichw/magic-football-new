import type { GoalArea } from './classes/GoalArea';
import type { Team } from './classes/Team';

class GameState {
  public teams: Team[] = [];
  public goalAreas: GoalArea[] = [];

  constructor() {
    // this.teams = [];
  }

  addTeam(team: Team) {
    this.teams.push(team);
  }

  addGoalArea(goalArea: GoalArea) {
    this.goalAreas.push(goalArea);
  }
}

const gameState = new GameState();
export default gameState;
