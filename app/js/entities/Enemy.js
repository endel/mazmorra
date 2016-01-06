'use strict';

import DangerousThing from '../behaviors/DangerousThing'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

export default class Enemy extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data
    this._direction = 'bottom'

    this.textures = {
      top: ResourceManager.get( 'enemies-' + this.userData.kind + '-top' ),
      bottom: ResourceManager.get( 'enemies-' + this.userData.kind + '-bottom' ),
      left: ResourceManager.get( 'enemies-' + this.userData.kind + '-left' ),
      right: ResourceManager.get( 'enemies-' + this.userData.kind + '-right' )
    }

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures[ this._direction ],
      // color: 0xffffff,
      fog: true
    }))

    var scale = SCALES[ this.sprite.material.map.image.width ]
    this.sprite.scale.set(scale, scale, scale)
    // this.sprite.position.y = scale/2 // - this.sprite.material.map.image.height
    this.sprite.position.y = 0.1

    this.add(this.sprite)

    this.addBehaviour(new DangerousThing)
    this.addBehaviour(new NearPlayerOpacity)
  }

  get label () {
    if (this.userData.hpCurrent > 0) {
      return `${ this.userData.kind } - LVL ${ this.userData.lvl }`
    }
  }

  set direction (direction) {
    this._direction = direction

    var texture = this.textures[ this._direction ]
    this.sprite.material.map = texture

    var scale = SCALES[ texture.image.width ]
    this.sprite.scale.set(scale, scale, scale)
  }

}
