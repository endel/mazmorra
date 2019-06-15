'use strict';
import { Behaviour } from 'behaviour.js'
import { toScreenPosition } from '../../utils';

import lerp from 'lerp'

class ProjectileBehaviour extends Behaviour {

  onAttach(data) {
    this.target = data.target;

    const source = toScreenPosition(camera, data.source);
    const destiny = toScreenPosition(camera, data.target);

    this.object.material.rotation = -Math.atan2(source.y - destiny.y, source.x - destiny.x);
  }

  update() {
    this.object.position.x = lerp(this.object.position.x, this.target.position.x, 0.3);
    this.object.position.z = lerp(this.object.position.z, this.target.position.z, 0.3);

    // remove itself when reached target.
    if (
      Math.abs(this.object.position.x - this.target.position.x) <= 0.1 &&
      Math.abs(this.object.position.z - this.target.position.z) <= 0.1
    ) {
      this.detach();
    }
  }

  onDetach() {
    this.object.parent.remove(this.object);
  }

}

export default class Projectile extends THREE.Sprite {

  constructor (data) {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get(data.type),
      color: 0xffffff,
      transparent: true
    }))

    this.scale.normalizeWithTexture(this.material.map)

    this.addBehaviour(new ProjectileBehaviour(), data);
  }

}

