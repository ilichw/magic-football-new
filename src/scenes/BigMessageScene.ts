export class BigMessageScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;
  private msgText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BigMessageScene' });
  }

  create() {
    // создание элементов
    // (overlay)
    const w = this.scale.width;
    const h = this.scale.height;
    this.background = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);

    const titleTextStyle = { fontSize: '32px', color: '#fff', align: 'center' };
    this.titleText = this.add.text(w / 2, h / 2 - 30, '', titleTextStyle);
    this.titleText.setOrigin(0.5);

    const msgTextStyle = { fontSize: '20px', color: '#fff', align: 'center' };
    this.msgText = this.add.text(w / 2, h / 2 + 30, '', msgTextStyle);
    this.msgText.setOrigin(0.5);

    // спрятать элементы
    this.hide();

    // события
    this.events.on('showMessage', this.showMessage, this);
    this.events.on('hideMessage', this.hide, this);
  }

  shutdown() {
    // отписка от событий
    this.events.off('showMessage', this.showMessage, this);
    this.events.off('hideMessage', this.hide, this);
  }

  // прячет все элементы сцены
  hide() {
    this.background.setVisible(false);
    this.titleText.setVisible(false);
    this.msgText.setVisible(false);
  }

  showMessage(titleText: string, msgText: string) {
    // сделать элементы видимыми
    this.background.setVisible(true);
    this.titleText.setVisible(true);
    this.msgText.setVisible(true);

    // set text
    this.titleText.setText(titleText);
    this.msgText.setText(msgText);
  }
}
