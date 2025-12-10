const initialVelocity = 280;

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setRandomVelocity(initialVelocity);

    this.setCollideWorldBounds();
    this.setBounce(1);
  }

  setRandomVelocity(speed: number) {
    // Генерация случайного угла в радианах
    const coef = Math.round(Math.random());
    const angle = coef ? Phaser.Math.Between(120, 240) : Phaser.Math.Between(-60, 60);
    const angleRad = Phaser.Math.DegToRad(angle);

    // Вычисление проекций скорости
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

    // Установка скорости объекта
    this.setVelocity(vx, vy);
  }
}
