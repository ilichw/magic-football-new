export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    // overlay
    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.7);
    background.fillRect(0, 0, 800, 600);

    // pause text
    this.add.text(300, 250, 'Пауза', { fontSize: '32px', color: '#fff' });
    this.add.text(250, 300, 'Нажмите P для продолжения', { fontSize: '20px', color: '#fff' });

    // resume logic
    this.input.keyboard!.once('keydown-P', (event: KeyboardEvent) => {
      event.preventDefault();
      this.scene.stop();
      this.scene.resume('MainScene');
    });
  }
}
