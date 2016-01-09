'use strict';

import Openable from '../behaviors/Openable'

export default class Chest extends THREE.Object3D {

  constructor () {
    super()

    this.head = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'interactive-chest-head' ),
      color: 0xffffff,
      fog: true
    }))
    this.head.position.x = 0
    this.head.position.y = 0.099
    this.add(this.head)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'interactive-chest-body' ),
      color: 0xffffff,
      fog: true
    }))
    this.body.position.y = 0
    this.add(this.body)

    this.scale.set(3, 3, 3)
    this.addBehaviour(new Openable)
  }

  get label () {
    return "Chest"
  }

}
