import { initials } from '../config.ts';
import { Player } from './Player.ts';

export class UIPlayer extends Player {
  private keyW: any;
  private keyA: any;
  private keyS: any;
  private keyD: any;
  private keySpace: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
    super(scene, x, y, texture, name);

    // логика управления игрока
    this.keyW = this.scene.input.keyboard!.addKey('W');
    this.keyA = this.scene.input.keyboard!.addKey('A');
    this.keyS = this.scene.input.keyboard!.addKey('S');
    this.keyD = this.scene.input.keyboard!.addKey('D');
    this.keySpace = this.scene.input.keyboard!.addKey(32);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
  }

  update(time: number, delta: number) {
    // логика атаки игрока
    if (this.keySpace.isDown) {
      this.shoot(time);
    }

    // Логика движения игрока
    let vx = 0;
    let vy = 0;

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

    if (this.slowdown) {
      vx /= 2;
      vy /= 2;
    }

    this.setVelocity(vx, vy);
  }
}
