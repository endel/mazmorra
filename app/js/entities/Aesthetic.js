'use strict';

import { Behaviour } from 'behaviour.js'

import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

export default class Aesthetic extends THREE.Object3D {

  constructor () {
    super()

    var i = Math.floor(Math.random() * 4)

    this.sprite = ResourceManager.getSprite( 'aesthetics-grass' + i )
    this.sprite.position.y = 0.099
    this.add(this.sprite)

    this.addBehaviour(new NearPlayerOpacity)
  }

}

