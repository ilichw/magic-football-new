import Phaser from 'phaser';
import gameState from '../state.ts';
import { constants } from '../config.ts';
import type { GoalArea } from '../classes/GoalArea.ts';

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;

  private goal = false;
  private gameOver = false;
  private paused = false;

  private gameTime = 0;
  // private playTime = 0;
  private timeLeft = constants.gameTime;

  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    const newScoreText = this.createScoreText();
    const scoreTextStyle = { fontSize: '20px', color: '#fff' };
    this.scoreText = this.add.text(200, 10, newScoreText, scoreTextStyle);

    const newTimeText = this.createTimeText(0, 0);
    this.timeText = this.add.text(600, 10, newTimeText, scoreTextStyle);

    this.events.on('updateScore', this.refresh, this);
    this.input.keyboard!.on('keydown-P', this.handleKeyP, this);
    this.events.on('goal', this.handleGoal, this);
  }

  update(time: number, delta: number): void {
    const newTime = Math.floor(time / 1000);

    if (newTime !== this.gameTime) {
      this.gameTime = newTime;
      if (!this.goal && !this.paused) this.timeLeft--;
      this.refreshTime(this.timeLeft);
    }
  }

  private refreshTime(time: number): void {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timeText.setText(this.createTimeText(minutes, seconds));
  }

  private createTimeText(minutes: number, seconds: number): string {
    const f = (arg: number) => (arg > 9 ? `${arg}` : `0${arg}`);
    return f(minutes) + ':' + f(seconds);
  }

  private handleKeyP(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.goal) {
      this.scene.get('MainScene').events.emit('kickOff'); // kick-off типа возобн игру после гола по англ
      this.goal = false;
      this.paused = false;
      return;
    }

    const scene = this.scene.get('BigMessageScene');
    const paused = this.scene.isPaused('MainScene');

    if (paused) {
      scene.events.emit('hideMessage');
      this.scene.resume('MainScene');
      this.paused = false;
    } else {
      scene.events.emit('showMessage', constants.pauseMessage.title, constants.pauseMessage.message);
      this.scene.pause('MainScene');
      this.paused = true;
    }
  }

  private handleGoal(goalArea: GoalArea): void {
    // без этой строки событие срабатывает повторно
    if (this.goal) return;

    // флаг забитого мяча
    this.goal = true;

    // остановить главную сцену
    this.scene.pause('MainScene');

    // увеличить счет забившей команды
    goalArea.opposingTeam.increaseScore();
    this.events.emit('updateScore');

    if (this.checkGameOver()) {
      this.gameOver = true;
    }

    // запуск экрана "гооооооооооооол"
    const bigMessageScene = this.scene.get('BigMessageScene');
    const titleText = this.gameOver ? constants.gameOverMessage.title : constants.goalMessage.title;
    const msgText = this.gameOver ? constants.gameOverMessage.message : constants.goalMessage.message;
    bigMessageScene.events.emit('showMessage', titleText, msgText);
  }

  shutdown() {
    this.events.on('updateScore', this.refresh, this);
    this.input.keyboard!.on('keydown-P', this.handleKeyP, this);
    this.events.on('goal', this.handleGoal, this);
  }

  private createScoreText() {
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

  private refresh() {
    const newScoreText = this.createScoreText();
    this.scoreText.setText(newScoreText);
  }

  checkGameOver(): boolean {
    // return gameState.teams.some((team) => team.score >= 5);
    return this.timeLeft <= 0;
  }
}
