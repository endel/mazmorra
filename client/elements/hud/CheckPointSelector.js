import { SpriteText2D, textAlign, MeshText2D } from 'three-text2d'
import { checkpoint } from '../../core/sound';

export default class CheckPointSelector extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false

    this.title = ResourceManager.getHUDElement('hud-big-title-red');
    this.title.position.y = this.title.height * 2;
    this.add(this.title);

    this.titleText = new MeshText2D("Checkpoints", {
      align: textAlign.center ,
      font: config.FONT_TITLE,
      fillStyle: "#ffffff"
    });
    this.titleText.position.y = this.title.position.y + this.title.height - this.titleText.height - 6;
    this.add(this.titleText);

    this.options = new THREE.Object3D();
    this.add(this.options);

    this.width = this.title.width;
    this.height = this.title.height;
  }

  openWithCheckPoints (numbers, currentProgress) {
    this.isNavigating = false;

    // remove previous children
    let row, column
      , i = this.options.children.length

    // remove previous children
    while (i--) {
      this.options.remove(this.options.children[i]);
    }

    const numSlots = 6;
    const columns = 5;
    const maxRows = Math.floor(numSlots / columns) - 1;

    this.slots = []
    for (i = 0; i < numbers.length; i++) {
      column = i % columns;
      row = Math.floor(i / columns);

      const checkpoint = this.createCheckPointEntry(numbers[i]);
      this.options.add(checkpoint);

      if (numbers[i] === currentProgress) {
        checkpoint.userData.hud = false;
        checkpoint.children[0].material.opacity = 0.2;
        // checkpoint.children[1].material.opacity = 0.5;
      }

      checkpoint.position.x = (checkpoint.width + config.HUD_SCALE) * (column);
      checkpoint.position.y = (checkpoint.height + config.HUD_SCALE) * (maxRows - row);

      App.tweens.
        add(checkpoint.scale).
        wait(50 * i).
        from({ x: 0.6, y: 0.6 }, 300, Tweener.ease.quintOut);

      this.options.add(checkpoint);
    }

    this.options.position.x = - ((Math.min(columns, numbers.length) - 1) / 2) * (this.options.children[0].width + config.HUD_SCALE);

    this.toggleOpen();
  }

  onCheckPointClick(checkpointButton, progress) {
    // skip if already navigating.
    if (!this.isNavigating) {
      this.isNavigating = true;
    } else {
      return;
    }

    this.dispatchEvent({
      type: "checkpoint",
      bubbles: true,
      progress
    });

    checkpointButton.children[0].material.opacity = 0.5;
    checkpointButton.userData.hud = false;

    // force close hud overlay
    this.parent.forceCloseOverlay();
  }

  createCheckPointEntry(num) {
    const checkpoint = new THREE.Object3D();
    checkpoint.userData.hud = true;
    checkpoint.addEventListener("click", () => this.onCheckPointClick(checkpoint, num));

    const background = ResourceManager.getHUDElement("hud-checkpoint");
    checkpoint.add(background);

    const text = new MeshText2D(num.toString(), {
      align: textAlign.center,
      font: config.FONT_TITLE,
      fillStyle: "#727c8e"
    });
    text.position.y = text.height / 2 - 6;
    checkpoint.add(text);

    checkpoint.width = background.width;
    checkpoint.height = background.height;

    return checkpoint;
  }

  toggleOpen (cb) {
    this.isOpen = !this.isOpen
    this.visible = true;

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

      // fade out all check point items
      let i = 0
      while (i < this.options.children.length) {
        // this.options.children[i].visible = false;
        App.tweens.remove(this.options.children[i].children[0].material);
        App.tweens.remove(this.options.children[i].children[1].material);
        App.tweens.add(this.options.children[i].children[0].material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);
        App.tweens.add(this.options.children[i].children[1].material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);
        i++;
      }
    }

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false;
      if (cb) cb();
    });
  }

}
