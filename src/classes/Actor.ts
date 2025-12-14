// import gameState from '../state';

export class Actor extends Phaser.Physics.Arcade.Sprite {
  private lastShoot = 0; // время крайней атаки
  private shootCooldown = 1500; // время перезарядки ms
  public name: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
    // создание спрайта
    super(scene, x, y, texture);
    this.name = name; // проблема: как генерировать уникальный id в многопользовательских играх

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  // логика атаки
  shoot(time: number) {
    // атака происходит только ели прошла перезарядка
    if (time - this.lastShoot >= this.shootCooldown) {
      console.log(`shoot! ${time}   x: ${this.x}`);

      this.scene.events.emit('userShoots', this.x, this.y, this.name, time);

      this.lastShoot = time;
    }
  }

  // логика получения урона
  getDamage() {
    console.log('get damage');
  }
}
