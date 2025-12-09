import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    create: function () {
      this.add.text(100, 100, 'Hello, Phaser in TypeScript!', { color: 'yellow' });
    },
  },
};

const game = new Phaser.Game(config);
