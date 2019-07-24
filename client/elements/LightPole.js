'use strict';

import LightOscillator from '../behaviors/LightOscillator'
import { getLightFromPool, removeLight } from '../utils';

export default class LightPole extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = ResourceManager.getSprite("billboards-light-pole")
    this.sprite.position.y = 0.55;
    this.add(this.sprite)

    this.light = getLightFromPool();
    this.light.color = new THREE.Color(0xfc6018);
    this.light.intensity = 1;
    this.light.distance = 8;
    this.light.position.set(0, 2, 0);

    // var light = new THREE.PointLight(this.colors[0], 0.3, 50);
    this.light.addBehaviour(new LightOscillator, 0.7, 1.1);
    this.add(this.light)
  }

  destroy () {
    removeLight(this.light);
    super.destroy();
  }

}


