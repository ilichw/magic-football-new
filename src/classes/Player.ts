export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

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
    const cursors = this.scene.input.keyboard!.createCursorKeys();
    let vx = 0,
      vy = 0;

    // Логика движения игрока
    if (cursors.left.isDown) {
      vx = -200;
    } else if (cursors.right.isDown) {
      vx = 200;
    }
    if (cursors.up.isDown) {
      vy = -200;
    } else if (cursors.down.isDown) {
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
