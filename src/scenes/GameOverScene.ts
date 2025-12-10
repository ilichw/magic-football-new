export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    // overlay
    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.7);
    background.fillRect(0, 0, 800, 600);

    // game over text
    this.add.text(300, 250, 'Гол!', { fontSize: '32px', color: '#fff' });
    this.add.text(250, 300, 'Нажмите пробел для продолжения', {
      fontSize: '20px',
      color: '#fff',
    });

    // new game start logic
    this.input.keyboard!.once('keydown-SPACE', (event: KeyboardEvent) => {
      event.preventDefault();
      this.scene.stop();
      this.scene.launch('GameScene');
      // setTimeout(() => {this.scene.launch('GameScene')}, 5000)
    });
  }
}
