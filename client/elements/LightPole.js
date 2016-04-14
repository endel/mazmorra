'use strict';

import LightOscillator from '../behaviors/LightOscillator'

export default class LightPole extends THREE.Object3D {

  constructor () {
    super()

    this.colors = [0xfcb438, 0xfc6018] // , 0xd00000

    this.sprite = ResourceManager.getSprite("billboards-light-pole")
    this.sprite.position.y = 0.55
    this.add(this.sprite)

    var light = new THREE.PointLight(this.colors[0], 0.3, 50);
    light.addBehaviour(new LightOscillator, 0.2, 0.4)
    light.position.set(0, 1.5, 0)
    this.add(light)
  }

}


