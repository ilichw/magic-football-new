class Team {
  public score: number;
  public name: string;

  constructor(name: string) {
    this.score = 0;
    this.name = name;
  }

  increaseScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}

class GameState {
  public teams!: Team[];

  constructor() {
    this.teams = [new Team('Team 1'), new Team('Team 2')];
  }
}

const gameState = new GameState();
export default gameState;
