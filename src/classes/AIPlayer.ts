import Phaser from 'phaser';

export class AIPlayer extends Phaser.Physics.Arcade.Sprite {
  private ball: Phaser.Physics.Arcade.Sprite;
  private speed: number = 150; // Скорость AI

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    ball: Phaser.Physics.Arcade.Sprite
  ) {
    super(scene, x, y, texture); // 'player' - это имя вашего спрайта игрока

    this.ball = ball;
    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setCollideWorldBounds(true);
  }

  update() {
    // Логика движения AI к мячу
    if (this.ball) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.ball.x, this.ball.y);
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.ball.x, this.ball.y);

      // Если AI игрок ближе определенного расстояния к мячу, двигаемся к мячу
      if (distance < 300) {
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
      } else {
        this.setVelocity(0); // Остановка, если мяч далеко
      }
    }
  }
}
