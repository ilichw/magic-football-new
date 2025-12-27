import gameState from '../state';
import type { Effect } from './Effect';

export class Attack extends Phaser.Physics.Arcade.Sprite {
  public creationTime: number;
  public emitterName: string;
  public effect: Effect;
  private velocity: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    emitterName: string, // имя игрока который стрелял
    creationTime: number,
    effect: Effect,
    velocity: number
  ) {
    // создание спрайта
    super(scene, x, y, texture);
    this.creationTime = creationTime; // время создания используется как id
    this.emitterName = emitterName;
    this.effect = effect;
    this.velocity = velocity;

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
    const distance = this.velocity * (delta / 1000); // px, т.к. delta в ms
    this.x += distance;

    // логика унчтожения спрайта при достижении границ поля
    const isOutLeft = this.x < gameState.field.left;
    const isOutRight = this.x > gameState.field.right;

    if (isOutLeft || isOutRight) {
      this.destroy();
    }
  }
}
