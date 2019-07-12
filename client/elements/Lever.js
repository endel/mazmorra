'use strict';

import Activatable from '../behaviors/Activatable'

export default class Lever extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.activeSprite = ResourceManager.getSprite(`interactive-lever-2-active`)
    this.add(this.activeSprite)

    this.inactiveSprite = ResourceManager.getSprite(`interactive-lever-2`)
    this.add(this.inactiveSprite)

    this.activateable = new Activatable()
    this.addBehaviour(this.activateable)
  }

  get label () {
    return (this.activateable.isActive) ? "Activated Lever" : "Lever";
  }

}

