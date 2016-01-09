'use strict';

import Openable from '../behaviors/Openable'

export default class Chest extends THREE.Object3D {

  constructor () {
    super()

    this.head = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'interactive-chest-head' ),
      // map: ResourceManager.get( 'interactive-bucket-head' ),
      color: 0xffffff,
      fog: true
    }))
    this.head.position.x = 0
    // this.head.position.y = 0.099
    this.add(this.head)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'interactive-chest-body' ),
      // map: ResourceManager.get( 'interactive-bucket-body' ),
      color: 0xffffff,
      fog: true
    }))
    this.body.position.y = 0
    this.add(this.body)

    var scale = SCALES[ this.body.material.map.image.width ]
    this.body.scale.set(scale, scale, scale)
    this.head.scale.set(scale, scale, scale)

    // this.scale.set(3, 3, 3)
    this.addBehaviour(new Openable)
  }

  get label () {
    return "Chest"
  }

}
