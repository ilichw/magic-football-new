export enum EffectType {
  Slowdown,
}

export class Effect {
  type: EffectType;
  timeout: number;

  constructor(type: EffectType, timeout: number) {
    this.type = type;
    this.timeout = timeout;
  }
}
