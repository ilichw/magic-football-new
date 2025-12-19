import type { Player } from './Player';

export class Team {
  public score = 0;
  public name: string;
  public players: Player[] = [];

  constructor(name: string) {
    this.score = 0;
    this.name = name;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  increaseScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}
