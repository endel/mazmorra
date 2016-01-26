'use strict';

export default class Highlight extends THREE.Sprite {

  constructor () {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get( "effects-highlight"),
      color: 0xffffff,
      fog: true,
      transparent: true
    }))
    this.scale.normalizeWithTexture(this.material.map)
    this.scale.x /= 2
    this.scale.y /= 2
    this.scale.z /= 2

    this.material.opacity = 0.8

    this.name = name
  }

}

