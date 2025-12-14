export class Attack extends Phaser.Physics.Arcade.Sprite {
  public creationTime: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, creationTime: number) {
    // создание спрайта
    super(scene, x, y, texture);
    this.creationTime = creationTime; // время создания используется как id

    // добавление спрайта в сцену
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // добавление (чего?) при удалении спрайта атаки (при попадании)
    this.on('destroy', () => {
      console.log('sprite destroyed');
    });
  }

  update(time: number, delta: number) {
    // логика движения спрайта атаки
    const speed = 500; // px/сек
    const distance = speed * (delta / 1000); // px, т.к. delta в ms
    this.x += distance;
  }
}
