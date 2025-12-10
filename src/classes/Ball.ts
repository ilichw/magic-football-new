import { initials } from '../config.ts';

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update() {
    if (this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0) {
      const vx = this.body!.velocity.x * initials.ballSlowdownRatio,
        vy = this.body!.velocity.y * initials.ballSlowdownRatio;
      this.setVelocity(vx, vy); // Снижение скорости
    }
  }
}
