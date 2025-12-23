import type { Team } from './Team';

export class GoalArea extends Phaser.Geom.Rectangle {
  public homeTeam!: Team;
  public opposingTeam!: Team;
  public goal = false;
  public goalTriggerTime = 0;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  setTeams(homeTeam: Team, opposingTeam: Team) {
    this.homeTeam = homeTeam;
    this.opposingTeam = opposingTeam;
  }

  reset() {
    this.goal = false;
  }
}
