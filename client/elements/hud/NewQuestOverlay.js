import { SpriteText2D, textAlign, MeshText2D } from 'three-text2d'
import { checkpoint } from '../../core/sound';

export default class NewQuestOverlay extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false

    this.title = ResourceManager.getHUDElement('hud-big-title-red');
    this.title.position.y = this.title.height * 2;
    this.add(this.title);

    this.titleText = new MeshText2D("Quests", {
      align: textAlign.center ,
      font: config.FONT_TITLE,
      fillStyle: "#ffffff",
      shadowColor: "#000000",
      shadowOffsetY: 3,
      shadowBlur: 0
    });
    this.titleText.position.y = this.title.position.y + this.title.height - this.titleText.height - 6;
    this.add(this.titleText);

    this.options = new THREE.Object3D();
    this.add(this.options);

    this.width = this.title.width;
    this.height = this.title.height;
  }

  toggleOpen (cb) {
    this.isOpen = !this.isOpen
    this.visible = true;

    this.options.visible = this.isOpen;

    const scaleFrom = ((this.isOpen) ? 0.5 : 1);
    const scaleTo = ((this.isOpen) ? 1 : 0.85);

    this.scale.set(scaleFrom, scaleFrom, scaleFrom);

    if (this.isOpen) {
      this.title.materialopacity = 0;
      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

    } else {
      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);
    }

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false;
      if (cb) cb();
    });
  }

}
