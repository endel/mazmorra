'use strict';

import LightOscillator from '../behaviors/LightOscillator'

export default class Portal extends THREE.Object3D {

  constructor () {
    super()

    var frames = [
      ResourceManager.get("billboards-portal-frame0"),
      ResourceManager.get("billboards-portal-frame1"),
      ResourceManager.get("billboards-portal-frame2"),
    ]

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: frames[0],
      color: 0xffffff,
      fog: true
    }))
    this.sprite.position.y = 0.55
    this.add(this.sprite)

    var scale = SCALES[ frames[0].image.width ]
    this.sprite.scale.set(scale, scale, scale)

    var light = new THREE.PointLight(0x1c80e4, 1, 50);
    light.addBehaviour(new LightOscillator, 0.8, 1.2)
    light.position.set(0, 1.5, 0)
    this.add(light)

    var currentTexture = 0
    setInterval(() => {
      currentTexture = (currentTexture+1)%3
      this.sprite.material.map = frames[currentTexture]
    }, 80)
  }

}



