'use strict';

import Activatable from '../behaviors/Activatable'

export default class Lever extends THREE.Object3D {

  constructor (data, mapkind) {
    super()
    this.userData = data

    const leverSkin = (mapkind === "inferno") ? "lever-1" : "lever-2";

    this.activeSprite = ResourceManager.getSprite(`interactive-${leverSkin}-active`)
    this.add(this.activeSprite)

    this.inactiveSprite = ResourceManager.getSprite(`interactive-${leverSkin}`)
    this.add(this.inactiveSprite)

    this.activateable = new Activatable()
    this.addBehaviour(this.activateable)
  }

  get label () {
    return (this.activateable.isActive) ? "Activated Lever" : "Lever";
  }

}

