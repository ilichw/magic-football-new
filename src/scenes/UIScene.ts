import Phaser from 'phaser';
import gameState from '../state.ts';
import { constants } from '../config.ts';

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    const newScoreText = this.createScoreText();
    this.scoreText = this.add.text(200, 10, newScoreText, {
      fontSize: '20px',
      color: '#fff',
    });

    this.events.on('updateScore', this.refresh, this);
    this.input.keyboard!.on('keydown-P', this.handleKeyP, this);
  }

  handleKeyP(event: KeyboardEvent) {
    event.preventDefault();

    this.scene
      .get('FullscreenMessageScene')
      .events.emit('showMessage', constants.pauseMessage.title, constants.pauseMessage.message);

    this.scene.get('MainScene').events.emit('togglePause');
  }

  shutdown() {
    this.input.keyboard!.off('keydown-P', this.handleKeyP, this);
  }

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
