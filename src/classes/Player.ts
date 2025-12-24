import { EffectType, type Effect } from './Effect';

export class Player extends Phaser.Physics.Arcade.Sprite {
  protected lastShoot = 0; // время крайней атаки
  protected shootCooldown = 1500; // время перезарядки ms
  protected initialX: number;
  protected initialY: number;

  protected speed = 200;
  protected slowdown = false;

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
      // срабатывание события атаки (слушается в сцене)
      this.scene.events.emit('userShoots', this.x, this.y, this.name, time);

      // обновление времени крайней атаки
      this.lastShoot = time;
    }
  }

  // логика наложения эффекта
  addEffect(effectType: EffectType) {
    if (effectType === EffectType.Slowdown) {
      this.slowdown = true;
    }
  }

  // логика снятия эффекта
  removeEffect(effectType: EffectType) {
    if (effectType === EffectType.Slowdown) {
      this.slowdown = false;
    }
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
  }
}
