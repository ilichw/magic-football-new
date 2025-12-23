export enum EffectType {
  Slowdown,
}

export class Effect {
  type: EffectType;
  duration: number;

  constructor(type: EffectType, duration: number) {
    this.type = type;
    this.duration = duration;
  }
}
