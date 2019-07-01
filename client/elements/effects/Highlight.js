'use strict';

export default class Highlight extends THREE.Sprite {

  constructor (type = 'rare') {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get( `effects-highlight-${type}`),
      color: 0xffffff,
      fog: true,
      transparent: true
    }))
    this.scale.normalizeWithTexture(this.material.map)

    this.scale.x /= 1.3;
    this.scale.y /= 1.3;
    this.scale.z /= 1.3;

    this.material.opacity = 0.3

    this.name = name
  }

}

