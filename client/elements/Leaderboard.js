'use strict';

export default class Leaderboard extends THREE.Object3D {

  constructor (data) {
    super()

    this.sprite = ResourceManager.getSprite(`interactive-leaderboard`);
    this.sprite.position.y = 0.5;
    this.add(this.sprite)
  }

  get label () {
    return "Hall of Fame";
  }

}

