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
    const coef = Math.round(Math.random() * 3);
    const angle = Phaser.Math.Between(30 + 90 * coef, 60 + 90 * coef);
    const angleRad = Phaser.Math.DegToRad(angle);

    // Вычисление проекций скорости
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

    // Установка скорости объекта
    this.setVelocity(vx, vy);
  }
}
