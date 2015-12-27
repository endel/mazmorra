'use strict';

import { Behaviour } from 'behaviour.js'

export default class Chest extends THREE.Object3D {

  constructor () {
    super()

    this.head = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'thing-chest-head' ),
      color: 0xffffff,
      fog: true
    }))
    this.head.position.x = 0
    this.head.position.y = 0.099
    this.add(this.head)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'thing-chest-body' ),
      color: 0xffffff,
      fog: true
    }))
    this.body.position.y = 0
    this.add(this.body)

    this.scale.set(3, 3, 3)
    this.behave(new ChestBehaviour)
  }

}

class ChestBehaviour extends Behaviour {

  onAttach () {
    this.isOpen = false;
    this.closedY = this.object.head.position.y;
    this.openedY = this.closedY + 0.2;
    this.object.head.position.y = (this.isOpen) ? this.openedY : this.closedY
    window.chest = this
  }

  open() {
    this.isOpen = true

    tweener.add(this.object.head.position).
      to({ y: this.openedY }, 500, Tweener.ease.quartOut)
  }

  close () {
    this.isOpen = false
    tweener.add(this.object.head.position).
      to({ y: this.closedY }, 500, Tweener.ease.quartOut)
  }

}
