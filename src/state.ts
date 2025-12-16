import type { Team } from './classes/Team';

class GameState {
  public teams!: Team[];

  constructor() {
    this.teams = [];
  }

  addTeam(team: Team) {
    this.teams.push(team);
  }
}

const gameState = new GameState();
export default gameState;
