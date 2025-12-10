import { Actor } from './Actor.ts';

export class Player extends Actor {
  private cursors: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // keyboard settings
    this.cursors = this.scene.input.keyboard!.createCursorKeys();

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
  }

  update() {
    let vx = 0,
      vy = 0;

    // Логика движения игрока
    if (this.cursors.left.isDown) {
      vx = -200;
    } else if (this.cursors.right.isDown) {
      vx = 200;
    }
    if (this.cursors.up.isDown) {
      vy = -200;
    } else if (this.cursors.down.isDown) {
      vy = 200;
    }

    if (vx || vy) {
      this.anims.play('walk', true); // Игрок начинает анимацию
      this.setFlipX(vx < 0);
    } else {
      this.anims.stop();
    }

    this.setVelocity(vx, vy);
  }
}
