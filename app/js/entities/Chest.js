'use strict';

import Openable from '../behaviors/Openable'

export default class Chest extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.head = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( `interactive-${ data.kind }-head` ),
      color: 0xffffff,
      fog: true
    }))
    this.head.position.x = 0
    this.add(this.head)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( `interactive-${ data.kind }-body` ),
      color: 0xffffff,
      fog: true
    }))
    this.body.position.y = 0
    this.add(this.body)

    this.body.scale.normalizeWithTexture(this.body.material.map)
    this.head.scale.normalizeWithTexture(this.head.material.map)

    // this.scale.set(3, 3, 3)
    this.openableBehaviour = new Openable
    this.addBehaviour(this.openableBehaviour)
  }

  get label () {
    let status = (this.openableBehaviour.isOpen) ?  "Open " : ""
    return `${status}Chest`
  }

}
