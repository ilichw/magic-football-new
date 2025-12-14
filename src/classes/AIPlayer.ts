import { initials } from '../config.ts';
import { Actor } from './Actor.ts';
import type { Ball } from './Ball.ts';

export class AIPlayer extends Actor {
  private ball: Ball;
  private speed = initials.playerSpeed; // Скорость AI

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, ball: Ball) {
    super(scene, x, y, texture); // 'player' - это имя вашего спрайта игрока

    this.ball = ball;
    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bot', {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
    });
  }

  update() {
    if (this.ball === undefined) return;

    let vx = 0,
      vy = 0;

    // Логика движения AI к мячу
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.ball.x, this.ball.y);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.ball.x, this.ball.y);

    // Если AI игрок ближе определенного расстояния к мячу, двигаемся к мячу
    if (distance < 300) {
      vx = Math.cos(angle) * this.speed;
      vy = Math.sin(angle) * this.speed;
    } else {
      vx = vy = 0;
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
