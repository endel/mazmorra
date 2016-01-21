'use strict';

import { Behaviour } from 'behaviour.js'

import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

export default class Aesthetic extends THREE.Object3D {

  constructor () {
    super()

    var i = Math.floor(Math.random() * 4)

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get( 'aesthetics-grass' + i ),
      color: 0xffffff,
      fog: true
    }))
    this.sprite.position.x = 0
    this.sprite.position.y = 0.099
    this.add(this.sprite)

    this.sprite.scale.normalizeWithTexture(this.sprite.material.map)

    this.addBehaviour(new NearPlayerOpacity)
  }

}

