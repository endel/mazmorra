'use strict';

import Activatable from '../behaviors/Activatable'

export default class Fountain extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.activeSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( `interactive-fountain` ),
      fog: true
    }))
    this.add(this.activeSprite)

    this.inactiveSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( `interactive-fountain-dry` ),
      fog: true
    }))
    this.add(this.inactiveSprite)

    this.activeSprite.position.y += 0.1
    this.inactiveSprite.position.y += 0.1

    this.activateable = new Activatable()
    this.addBehaviour(this.activateable)

    this.activeSprite.scale.normalizeWithTexture(this.activeSprite.material.map)
    this.inactiveSprite.scale.normalizeWithTexture(this.inactiveSprite.material.map)
  }

  get label () {
    return ((this.activateable.isActive) ? "FOUNTAIN" : "DRY FOUNTAIN")
  }

}

