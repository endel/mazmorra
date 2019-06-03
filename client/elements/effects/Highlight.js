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

    this.scale.x /= 1.5
    this.scale.y /= 1.5
    this.scale.z /= 1.5

    this.material.opacity = 0.4

    this.name = name
  }

}

