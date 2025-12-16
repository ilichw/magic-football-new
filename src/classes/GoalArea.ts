import type { Team } from './Team';

export class GoalArea {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public homeTeam!: Team;
  public opposingTeam!: Team;

  constructor(x: number, y: number, width: number, height: number /*scene: Phaser.Scene*/) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // const g = scene.add.graphics();
    // g.fillStyle(0x00ff00, 1); // цвет и альфа
    // g.fillRect(x, y, width, height);
  }

  setOpposingTeam(team: Team) {
    this.opposingTeam = team;
  }
}
