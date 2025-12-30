import Phaser from 'phaser';
import gameState from '../state.ts';
import { constants } from '../config.ts';
import type { GoalArea } from '../classes/GoalArea.ts';

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  goal = false;
  // paused = false;

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
    this.events.on('goal', this.handleGoal, this);
  }

  handleKeyP(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.goal) {
      this.scene.get('MainScene').events.emit('kickOff'); // kick-off типа возобн игру после гола по англ
      this.goal = false;
      return;
    }

    const scene = this.scene.get('FullscreenMessageScene');
    const paused = this.scene.isPaused('MainScene');

    if (paused) {
      scene.events.emit('hideMessage');
    } else {
      scene.events.emit('showMessage', constants.pauseMessage.title, constants.pauseMessage.message);
    }

    this.scene.get('MainScene').events.emit('togglePause');
  }

  handleGoal(goalArea: GoalArea) {
    // без этой строки событие срабатывает повторно
    if (this.goal) return;

    // флаг заитого мяча
    this.goal = true;

    // остановить главную сцену
    this.scene.pause('MainScene');

    // увеличить счет забившей команды
    goalArea.opposingTeam.increaseScore();
    this.events.emit('updateScore');

    // запуск экрана "гооооооооооооол"
    this.scene
      .get('FullscreenMessageScene')
      .events.emit('showMessage', constants.goalMessage.title, constants.goalMessage.message);
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
