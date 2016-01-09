import { Behaviour } from 'behaviour.js'

export default class Openable extends Behaviour {

  onAttach () {
    this.isOpen = false;
    this.closedY = this.object.head.position.y;
    this.openedY = this.closedY + 0.5;
    this.object.head.position.y = (this.isOpen) ? this.openedY : this.closedY
    window.chest = this

    this.on('open', this.open.bind(this))
  }

  open() {
    this.isOpen = true

    tweener.add(this.object.head.position).
      to({ y: this.openedY }, 500, Tweener.ease.quartOut).
      wait(100).
      to({ y: this.closedY - 0.2, z: this.object.head.position.z - 0.1 }, 500, Tweener.ease.quartOut)
  }

  close () {
    this.isOpen = false
    tweener.add(this.object.head.position).
      to({ y: this.closedY }, 500, Tweener.ease.quartOut)
  }

}

