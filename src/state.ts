export const _GameState = {
  score: { player: 0, bot: 0 },
  reset() {
    this.score.player = 0;
    this.score.bot = 0;
  },
};

class Score {
  public team1: number;
  public team2: number;

  constructor() {
    this.team1 = 0;
    this.team2 = 0;
  }

  setTeam1Score(newScore: number) {
    this.team1 = newScore;
  }

  setTeam2Score(newScore: number) {
    this.team2 = newScore;
  }

  reset() {
    this.team1 = 0;
    this.team2 = 0;
  }
}

class GameState {
  public score!: Score;

  constructor() {
    this.score = new Score();
  }
}

const gameState = new GameState();
export default gameState;
