import { initials } from '../config.ts';
import { Actor } from './Actor.ts';

export class Player extends Actor {
  private keyW: any;
  private keyA: any;
  private keyS: any;
  private keyD: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // keyboard settings
    this.keyW = this.scene.input.keyboard!.addKey('W');
    this.keyA = this.scene.input.keyboard!.addKey('A');
    this.keyS = this.scene.input.keyboard!.addKey('S');
    this.keyD = this.scene.input.keyboard!.addKey('D');

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
    if (this.keyA.isDown) {
      vx = -initials.playerSpeed;
    } else if (this.keyD.isDown) {
      vx = initials.playerSpeed;
    }

    if (this.keyW.isDown) {
      vy = -initials.playerSpeed;
    } else if (this.keyS.isDown) {
      vy = initials.playerSpeed;
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
