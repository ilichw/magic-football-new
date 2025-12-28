export class PauseScene extends Phaser.Scene {
  background!: Phaser.GameObjects.Rectangle;
  visible = false;
  text1!: Phaser.GameObjects.Text;
  text2!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    // ~~~ CREATE ELEMENTS ~~~
    // overlay
    const w = this.scale.width;
    const h = this.scale.height;
    this.background = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);

    // text
    const titleTextStyle = { fontSize: '32px', color: '#fff', align: 'center' };
    this.text1 = this.add.text(w / 2, h / 2 - 30, 'Пауза', titleTextStyle);
    this.text1.setOrigin(0.5);

    const msgTextStyle = { fontSize: '20px', color: '#fff', align: 'center' };
    this.text2 = this.add.text(w / 2, h / 2 + 30, 'Нажмите P для продолжения', msgTextStyle);
    this.text2.setOrigin(0.5);

    // спрятать элементы сцены
    this.hide();

    // resume logic
    // this.events.on('toggle', this.handleToggle, this);

    // сейчас сцена пазы отвечает за слушание события клавиатуры
    this.events.on('showMessage', this.showMessage, this);
  }

  showMessage() {
    this.visible ? this.hide() : this.show();
    this.visible = !this.visible;
  }

  shutdown() {
    this.events.off('showMessage', this.showMessage, this);
  }

  handleToggle() {
    this.visible ? this.hide() : this.show();
    this.visible = !this.visible;
  }

  show() {
    this.background.setVisible(true);
    this.text1.setVisible(true);
    this.text2.setVisible(true);
  }

  hide() {
    this.background.setVisible(false);
    this.text1.setVisible(false);
    this.text2.setVisible(false);
  }
}
