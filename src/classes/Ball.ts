export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update() {
    if (this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0) {
      this.setVelocity(this.body!.velocity.x * 0.995, this.body!.velocity.y * 0.995); // Снижение скорости
    }
  }
}
