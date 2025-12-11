import Phaser from 'phaser';
import gameState from '../state';

export class ScoreScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ScoreScene', active: true }); // active: true — чтобы всегда отображалась, можно false и запускать вручную
  }

  create() {
    const newScoreText = this.createScoreText();
    this.scoreText = this.add.text(200, 10, newScoreText, {
      fontSize: '20px',
      color: '#fff',
    });

    // слушаем событие обновления счёта (альтернатива — сцена опрашивает GameState в update)
    this.events.on('updateScore', this.refresh, this);
  }

  createScoreText() {
    return `Score: ${gameState.score.team1} - ${gameState.score.team2}`;
  }

  refresh() {
    const newScoreText = this.createScoreText();
    this.scoreText.setText(newScoreText);
  }
}
