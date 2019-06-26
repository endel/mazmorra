'use strict';

import LightOscillator from '../behaviors/LightOscillator'
import { getLightFromPool } from '../utils';

export default class LightPole extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = ResourceManager.getSprite("billboards-light-pole")
    this.sprite.position.y = 0.55;
    this.add(this.sprite)

    const light = getLightFromPool();
    light.color = new THREE.Color(0xfc6018);
    light.intensity = 1;
    light.distance = 8;
    light.position.set(0, 2, 0);

    // var light = new THREE.PointLight(this.colors[0], 0.3, 50);
    light.addBehaviour(new LightOscillator, 0.7, 1.1);
    this.add(light)
  }

}


