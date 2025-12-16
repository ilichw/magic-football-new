import type { Actor } from './Actor';

export class Team {
  public score = 0;
  public name: string;
  public players: Actor[] = [];

  constructor(name: string) {
    this.score = 0;
    this.name = name;
  }

  addPlayer(player: Actor) {
    this.players.push(player);
  }

  increaseScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}
