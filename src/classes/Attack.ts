export class Attack extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    // создание спрайта
    super(scene, x, y, texture);

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update(time: number, delta: number) {
    // логика движения спрайта атаки
    const speed = 500; // px/сек
    const distance = speed * (delta / 1000); // px, т.к. delta в ms
    this.x += distance;
  }
}
