export class Player extends Phaser.Physics.Arcade.Sprite {
  protected lastShoot = 0; // время крайней атаки
  protected shootCooldown = 1500; // время перезарядки ms
  protected initialX: number;
  protected initialY: number;

  public name: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
    // создание спрайта
    super(scene, x, y, texture);
    this.name = name; // проблема: как генерировать уникальный id в многопользовательских играх

    // сохранить начальные позиции (
    this.initialX = x;
    this.initialY = y;

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  // логика атаки
  shoot(time: number) {
    // атака происходит только если прошло время перезарядки
    if (time - this.lastShoot >= this.shootCooldown) {
      // console.log(`shoot! ${time}   x: ${this.x}`);

      // срабатывание события атаки (слушается в сцене)
      this.scene.events.emit('userShoots', this.x, this.y, this.name, time);

      // обновление времени крайней атаки
      this.lastShoot = time;
    }
  }

  // логика получения урона
  getDamage() {
    console.log(`${this.name} gets damage`);
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
  }
}
