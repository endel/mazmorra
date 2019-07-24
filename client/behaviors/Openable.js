import lerp from 'lerp'
import { Behaviour } from 'behaviour.js'
import { chestSound, playSound3D } from '../core/sound';

export default class Openable extends Behaviour {

  onAttach () {
    this.closedY = this.object.head.position.y;
    this.openedY = this.closedY + 0.5;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.entity.on('mouseover', this.onMouseOver);
    this.entity.on('mouseout', this.onMouseOut);

    if (!this.isOpen) {
      this.on('open', this.open.bind(this))
      this.on('preopen', this.preopen.bind(this))

    } else {
      this.open(false)
    }
  }

  onDetach() {
    this.entity.off('mouseover', this.onMouseOver)
    this.entity.off('mouseout', this.onMouseOut)
  }

  get isOpen () {
    return typeof(this.object.userData.action)==="object" && this.object.userData.action.type === 'open'
  }

  preopen() {
    this.hasPreopen = true;

    this.nextRotation = -0.20;
    this.updateInterval = setInterval(() => { this.nextRotation = this.nextRotation * -1 }, 80);
    this.update = () => {
      this.object.body.material.rotation = lerp(this.object.body.material.rotation, this.nextRotation, 0.1);
      this.object.head.material.rotation = lerp(this.object.head.material.rotation, this.nextRotation, 0.1);
    }

    this.originalScale = this.object.scale;
    App.tweens.add(this.object.scale).
      to({
        x: this.originalScale.x * 0.86,
        y: this.originalScale.y * 0.86,
        z: this.originalScale.z * 0.86
      }, 350, Tweener.ease.quintOut);
  }

  open(playSound = true) {
    if (this.hasPreopen) {
      delete this.update;
      clearInterval(this.updateInterval);
      this.object.body.material.rotation = 0;
      this.object.head.material.rotation = 0;

      App.tweens.remove(this.object.scale);
      App.tweens.add(this.object.scale).
        to({ x: this.originalScale.x, y: this.originalScale.y, z: this.originalScale.z }, 100, Tweener.ease.quadOut);
    }

    if (playSound) {
      playSound3D(chestSound, this.object);
    }

    App.tweens.add(this.object.head.position).
      to({ y: this.openedY }, 500, Tweener.ease.quartOut).
      wait(100).
      to({ y: this.closedY - 0.2, z: this.object.head.position.z - 0.2 }, 500, Tweener.ease.quartOut)

    this.detach();
  }

  close () {
    App.tweens.add(this.object.head.position).
      to({ y: this.closedY }, 500, Tweener.ease.quartOut)
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(config.COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

}

