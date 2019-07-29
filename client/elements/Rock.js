'use strict';

export default class Chest extends THREE.Object3D {

  constructor () {
    super()

    var i = Math.floor(Math.random() * 3)
    // grass = mapkind

    this.sprite = ResourceManager.getSprite( 'aesthetics-grass-rock' + i )
    this.sprite.position.y = 0.099
    this.add(this.sprite)
  }

}
