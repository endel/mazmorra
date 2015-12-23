'use strict';

import DangerousThing from '../behaviors/DangerousThing'
import Lifebar from './Lifebar'

export default class Enemy extends THREE.Object3D {

  constructor (name = 'rat') {
    super()

    this.name = name
    this._direction = 'top'
    this.textures = {
      top: ResourceManager.get( 'enemies-' + name + '-top' ),
      bottom: ResourceManager.get( 'enemies-' + name + '-bottom' ),
      left: ResourceManager.get( 'enemies-' + name + '-left' ),
      right: ResourceManager.get( 'enemies-' + name + '-right' )
    }

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures[ this._direction ],
      color: 0xffffff,
      fog: true
    }))
    this.sprite.position.y = 0.1
    this.sprite.behave(new DangerousThing)

    this.scale.set(1.5, 1.5, 1.5)
    this.add(this.sprite)

    this.lifebar = new Lifebar()
    this.add(this.lifebar)
  }

  set direction (direction) {
    this._direction = direction
    this.item.material.map = this.textures[ this._direction ]
  }

}


