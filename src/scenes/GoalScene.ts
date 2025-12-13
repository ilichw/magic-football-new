export class GoalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GoalScene' });
  }

  create() {
    // overlay
    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.7);
    background.fillRect(0, 0, 800, 600);

    // game over text
    this.add.text(300, 250, 'Гол!', { fontSize: '32px', color: 'white' });
    this.add.text(250, 300, 'Нажмите P для продолжения', { fontSize: '20px', color: 'white' });

    // new game start logic
    this.input.keyboard!.once('keydown-P', (event: KeyboardEvent) => {
      event.preventDefault();
      this.scene.stop();
      this.scene.launch('GameScene');
    });
  }
}
