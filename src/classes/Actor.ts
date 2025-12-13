export class Actor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    // создание спрайта
    super(scene, x, y, texture);

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  // логика атаки
  releaseAttack() {
    console.log('attack released');
  }

  // логика получения урона
  getDamage() {
    console.log('get damage');
  }
}
