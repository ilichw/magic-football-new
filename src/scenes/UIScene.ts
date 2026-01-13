import Phaser from 'phaser';
import gameState from '../state.ts';
import { constants } from '../config.ts';
import type { GoalArea } from '../classes/GoalArea.ts';

enum GameStatus {
  GOAL,
  GAME_OVER,
  PAUSED,
  HELP,
  RUNNING,
}

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private helpTipText!: Phaser.GameObjects.Text;

  // private gameStatus = GameStatus.GAME_OVER;
  // private running = false
  private goal = false;
  private gameOver = false;
  private paused = false;
  private help = false;

  private gameTime = 0;
  private timeLeft = constants.gameTime;

  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    // создание элементов сцены
    const newScoreText = this.createScoreText();
    const scoreTextStyle = { fontSize: '20px', color: '#fff' };
    this.scoreText = this.add.text(200, 10, newScoreText, scoreTextStyle);

    const newTimeText = this.createTimeText(0, 0);
    this.timeText = this.add.text(600, 10, newTimeText, scoreTextStyle);

    this.helpTipText = this.add.text(600, 570, constants.helpTipText, scoreTextStyle);

    // обработчики событий
    this.events.on('updateScore', this.refresh, this);
    this.input.keyboard!.on('keydown-P', this.handleKeyP, this);
    this.events.on('goal', this.handleGoal, this);
    this.input.keyboard!.on('keydown-F1', this.handleKeyF1, this);

    // как только все готово игра считается запущенной
    // this.gameStatus = GameStatus.RUNNING
    // this.running = true
  }

  private showMessage(titleText: string, msgText: string): void {
    const bigMessageScene = this.scene.get('BigMessageScene');
    bigMessageScene.events.emit('showMessage', titleText, msgText);
  }

  private handleKeyF1(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.help) {
      this.help = false;

      if (this.paused) {
        this.showMessage(constants.pauseMessage.title, constants.pauseMessage.message);
        return;
      }

      if (this.goal) {
        this.showMessage(constants.goalMessage.title, constants.goalMessage.message);
        return;
      }

      this.scene.get('BigMessageScene').events.emit('hideMessage');
      this.scene.resume('MainScene');
      return;
    }

    if (this.scene.isActive('MainScene')) this.scene.pause('MainScene');
    this.help = true;

    this.showMessage(constants.helpMessage.title, constants.helpMessage.message);
  }

  update(time: number, delta: number): void {
    const newTime = Math.floor(time / 1000);

    if (newTime !== this.gameTime) {
      this.gameTime = newTime;
      if (!this.goal && !this.paused && !this.help && !this.gameOver) this.timeLeft--;
      this.refreshTime(this.timeLeft);
    }

    if (this.checkGameOver()) {
      this.gameOver = true;
    }

    if (this.gameOver) {
      this.scene.pause('MainScene');
      this.showGameOverMessage();
    }
  }

  private showGameOverMessage(): void {
    const winnerTeam = gameState.getWinner();

    let titleText = constants.gameOverMessage.title;
    let msgText = constants.gameOverMessage.message;

    if (winnerTeam === 'draw') {
      titleText = constants.drawMessage.title;
      msgText = constants.drawMessage.message;
    }

    msgText = msgText.replace('{WINNER_TEAM}', winnerTeam);
    this.showMessage(titleText, msgText);
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

  // действия при возобновлении игры
  restartGame(): void {
    // сброс игрового времени
    this.gameTime = 0;
    this.timeLeft = constants.gameTime;
  }

  private handleKeyP(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.gameOver) {
      this.scene.get('BigMessageScene').events.emit('hideMessage');
      this.restartGame();
      this.gameOver = false;
      this.scene.stop('MainScene');
      this.scene.start('MainScene');
      return;
    }

    if (this.goal) {
      this.scene.get('MainScene').events.emit('kickOff'); // kick-off типа возобн игру после гола по англ
      this.goal = false;
      this.paused = false;
      return;
    }

    const scene = this.scene.get('BigMessageScene');

    if (this.paused) {
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

    // запуск экрана "гооооооооооооол"
    const titleText = this.gameOver ? constants.gameOverMessage.title : constants.goalMessage.title;
    const msgText = this.gameOver ? constants.gameOverMessage.message : constants.goalMessage.message;
    this.showMessage(titleText, msgText);
  }

  shutdown() {
    this.events.on('updateScore', this.refresh, this);
    this.input.keyboard!.on('keydown-P', this.handleKeyP, this);
    this.events.on('goal', this.handleGoal, this);
    this.input.keyboard!.off('keydown-F1', this.handleKeyF1, this);
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
    return this.timeLeft <= 0;
  }
}
