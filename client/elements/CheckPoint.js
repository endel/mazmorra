'use strict';

import { Behaviour } from 'behaviour.js'
import LightOscillator from '../behaviors/LightOscillator'
import { getLightFromPool, removeLight } from '../utils';

class CheckPointBehaviour extends Behaviour {
  onAttach() {
    this.on("activate", (data) => {
      if (!this.light) {
        this.light = getLightFromPool();
      }

      this.light.intensity = 0.5;
      this.light.distance = 7;
      this.light.color = new THREE.Color(0xfe1313);
      this.light.position.set(0, 0, 0);

      this.object.material.map = this.object.getTexture();

      App.tweens.
        add(this.light).
        from({ intensity: 0 }, 300, Tweener.ease.quartOut).
        then(() => this.light.addBehaviour(new LightOscillator, 0.4, 0.6));

      this.object.add(this.light);
    })

  }

  onDetach() {
    if (this.light) {
      App.tweens.remove(this.light);
      removeLight(this.light);
    }
  }

}

export default class CheckPoint extends THREE.Object3D {

  constructor () {
    super()

    this.material = new THREE.MeshPhongMaterial({
      flatShading: true,
      map: this.getTexture(),
      side: THREE.FrontSide,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)
    const mesh = new THREE.Mesh(geometry, this.material)
    mesh.scale.normalizeWithTexture(this.material.map, true)
    mesh.rotateX(-Math.PI / 2);
    mesh.position.y -= 0.49;

    this.add(mesh);
    this.addBehaviour(new CheckPointBehaviour());
  }

  get label () {
    return `Checkpoint`;
  }

  getTexture() {
    const resourceName = (this.userData.active) ? "checkpoint-active" : "checkpoint";
    return ResourceManager.get(`interactive-${resourceName}`);
  }

}



