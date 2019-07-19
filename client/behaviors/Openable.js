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

  open(playSound = true) {
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

