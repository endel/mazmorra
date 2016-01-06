'use strict';

export default class Highlight extends THREE.Sprite {

  constructor () {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get( "effects-highlight"),
      color: 0xffffff,
      fog: true,
      transparent: true
    }))

    this.material.opacity = 0.8

    this.name = name
    this.scale.set(5, 4, 5)
  }

}

