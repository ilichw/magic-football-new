import { Player } from './Player.ts';
import type { Ball } from './Ball.ts';

export class AIPlayer extends Player {
  private ball: Ball | null;
  private opponent: Player | null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
    super(scene, x, y, texture, name);

    this.ball = null;
    this.opponent = null;
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

  addObjectToFollow(object: Ball) {
    this.ball = object;
  }

  addOpponent(opponent: Player) {
    this.opponent = opponent;
  }

  update(time: number) {
    if (this.ball === null) return;
    this.follow(this.ball);
    this.attack(time);
  }

  attack(time: number) {
    if (this.opponent === null) return;

    if (this.opponent.y === this.y) {
      this.shoot(time);
    }
  }

  follow(ball: Ball) {
    let vx = 0;
    let vy = 0;

    // Логика движения AI к мячу
    const distance = Phaser.Math.Distance.Between(this.x, this.y, ball.x, ball.y);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, ball.x, ball.y);

    // Если AI игрок ближе определенного расстояния к мячу, двигаемся к мячу
    if (distance < 300) {
      vx = Math.cos(angle) * this.speed;
      vy = Math.sin(angle) * this.speed;
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
