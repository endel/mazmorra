'use strict';

import DangerousThing from '../behaviors/DangerousThing'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

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
      // color: 0xffffff,
      fog: true
    }))

    var scale = SCALES[ this.sprite.material.map.image.width ]
    this.sprite.scale.set(scale, scale, scale)
    // this.sprite.position.y = scale/2 // - this.sprite.material.map.image.height
    this.sprite.position.y = 0.1
    console.log(name, this.sprite.position.y)

    this.add(this.sprite)

    this.addBehaviour(new DangerousThing)
    this.addBehaviour(new NearPlayerOpacity)

    // TODO: change me
    setInterval(() => {
      var directions = Object.keys(this.textures)
      var currentIndex = directions.indexOf(this._direction)

      this._direction =( currentIndex < 3) ? directions[currentIndex+1] : directions[0]
      var texture = this.textures[ this._direction ]

      this.sprite.material.map = texture

      var scale = SCALES[ texture.image.width ]
      this.sprite.scale.set(scale, scale, scale)
    }, 2000)
  }

  set direction (direction) {
    this._direction = direction
    // this.sprite.material.map = this.textures[ this._direction ]
  }

}
