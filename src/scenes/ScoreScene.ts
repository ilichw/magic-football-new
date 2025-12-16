import Phaser from 'phaser';
// import type { GameState } from '../classes/GameState';
import gameState from '../state.ts';

export class ScoreScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  // protected gameState: GameState | null = null;

  constructor() {
    super({ key: 'ScoreScene', active: true });
  }

  create() {
    const newScoreText = this.createScoreText();
    this.scoreText = this.add.text(200, 10, newScoreText, {
      fontSize: '20px',
      color: '#fff',
    });

    this.events.on('updateScore', this.refresh, this);
  }

  // setGameState(gameState: GameState) {
  //   this.gameState = gameState;
  // }

  createScoreText() {
    if (gameState.teams[0] === undefined || gameState.teams[1] === undefined) {
      return '';
    }

    return (
      `${gameState.teams[0].name}   ` +
      `${gameState.teams[0].score} - ` +
      `${gameState.teams[1].score}   ` +
      `${gameState.teams[1].name}`
    );
  }

  refresh() {
    const newScoreText = this.createScoreText();
    this.scoreText.setText(newScoreText);
  }
}
