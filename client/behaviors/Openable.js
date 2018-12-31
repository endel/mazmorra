import { Behaviour } from 'behaviour.js'
import { chestSound } from '../core/sound';

export default class Openable extends Behaviour {

  onAttach () {
    this.closedY = this.object.head.position.y;
    this.openedY = this.closedY + 0.5;

    if (!this.isOpen) {
      this.on('open', this.open.bind(this))

    } else {
      this.open(false)
    }
  }

  get isOpen () {
    return typeof(this.object.userData.action)==="object" && this.object.userData.action.type === 'open'
  }

  open(playSound = true) {
    if (playSound) chestSound.play();

    App.tweens.add(this.object.head.position).
      to({ y: this.openedY }, 500, Tweener.ease.quartOut).
      wait(100).
      to({ y: this.closedY - 0.2, z: this.object.head.position.z - 0.1 }, 500, Tweener.ease.quartOut)
  }

  close () {
    App.tweens.add(this.object.head.position).
      to({ y: this.closedY }, 500, Tweener.ease.quartOut)
  }

}

