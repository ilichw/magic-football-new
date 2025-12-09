const initialVelocity = 200;

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocity(initialVelocity);

    this.setCollideWorldBounds();
    this.setBounce(1);
  }
}
