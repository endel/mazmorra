'use strict';

import { Behaviour } from 'behaviour.js'

export default class Chest extends THREE.Object3D {

  constructor () {
    super()

    var i = Math.floor(Math.random() * 3)
    // grass = mapkind

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'aesthetics-grass-rock' + i ),
      color: 0xffffff,
      fog: true
    }))
    this.sprite.position.x = 0
    this.sprite.position.y = 0.099
    this.add(this.sprite)

    var scale = SCALES[ this.sprite.material.map.frame.w ]
    this.sprite.scale.set(scale, scale, scale)
  }

  get label () {
    return 'Rock'
  }

}
