// import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Загрузка спрайтов и ресурсов
  }

  create() {
    this.add.text(400, 300, 'Hello, Phaser in TypeScript!', { color: 'yellow' });
    // Инициализация начальных объектов
  }

  update() {
    // Логика игры
  }
}
