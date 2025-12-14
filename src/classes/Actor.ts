// import gameState from '../state';

export class Actor extends Phaser.Physics.Arcade.Sprite {
  private lastShoot = 0; // время крайней атаки
  private shootCooldown = 1500; // время перезарядки ms

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    // создание спрайта
    super(scene, x, y, texture);

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  // логика атаки
  shoot(time: number) {
    // атака происходит только ели прошла перезарядка
    if (time - this.lastShoot >= this.shootCooldown) {
      // gameState.createAttack();
      console.log(`shoot! ${time}`);
      this.lastShoot = time;
    }
  }

  // логика получения урона
  getDamage() {
    console.log('get damage');
  }
}
