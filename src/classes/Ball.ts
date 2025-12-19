import { initials } from '../config.ts';

export class Ball extends Phaser.Physics.Arcade.Sprite {
  private initialX: number;
  private initialY: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    // сохранить начальные позиции (
    this.initialX = x;
    this.initialY = y;

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  reset() {
    this.setPosition(this.initialX, this.initialY);
    this.setVelocity(0);
  }

  update() {
    if (this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0) {
      const vx = this.body!.velocity.x * initials.ballSlowdownRatio;
      const vy = this.body!.velocity.y * initials.ballSlowdownRatio;
      this.setVelocity(vx, vy); // Снижение скорости
    }
  }
}
