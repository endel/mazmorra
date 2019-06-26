'use strict';

import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

export default class Aesthetic extends THREE.Object3D {

  constructor (mapkind) {
    super()

    var i = Math.floor(Math.random() * 2) + 1;

    this.sprite = ResourceManager.getSprite(`aesthetics-${mapkind}-${i}`);
    this.sprite.position.y = 0.099
    this.add(this.sprite)

    this.addBehaviour(new NearPlayerOpacity)
  }

}

