'use strict';

import LightOscillator from '../behaviors/LightOscillator'

export default class LightPole extends THREE.Object3D {

  constructor () {
    super()

    this.colors = [0xfcb438, 0xfc6018] // , 0xd00000
    var texture = ResourceManager.get("billboards-light-pole")

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      fog: true
    }))
    this.sprite.position.y = 0.5
    this.add(this.sprite)

    var scale = SCALES[ texture.image.width ]
    this.sprite.scale.set(scale, scale, scale)

    var light = new THREE.PointLight(this.colors[0], 1, 50);
    light.behave(new LightOscillator, 0.9, 1.1)
    light.position.set(0, 1.5, 0)
    this.add(light)
  }

}


