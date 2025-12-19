export class GameField extends Phaser.Geom.Rectangle {
  private scene: Phaser.Scene | null = null;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  addScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  initBackground(texture: string) {
    if (!this.scene) return;
    this.scene.add.image(this.centerX, this.centerY, texture);
  }
}
