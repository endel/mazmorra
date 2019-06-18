'use strict';
import { Behaviour } from 'behaviour.js'
import { toScreenPosition, getLightFromPool, removeLight } from '../../utils';

import lerp from 'lerp'

class ProjectileBehaviour extends Behaviour {

  onAttach(data) {
    this.target = data.target;

    const source = toScreenPosition(camera, data.source);
    const destiny = toScreenPosition(camera, data.target);

    this.object.sprite.material.rotation = -Math.atan2(source.y - destiny.y, source.x - destiny.x);
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
    if (this.object.light) {
      const explosionSprites = [
        ResourceManager.get("effects-explode-1-1"),
        ResourceManager.get("effects-explode-1-2"),
        ResourceManager.get("effects-explode-1-3"),
        ResourceManager.get("effects-explode-1-4"),
      ];

      let spriteProgress = 0;

      const nextSprite = () => {
        this.object.sprite.material.map = explosionSprites[spriteProgress];
        this.object.sprite.scale.normalizeWithTexture(this.object.sprite.material.map);
        spriteProgress++;
      }
      nextSprite();

      let interval = setInterval(() => {
        if (spriteProgress === explosionSprites.length) {
          this.object.remove(this.object.sprite);
          clearInterval(interval);

        } else {
          nextSprite();
        }
      }, 30);


      App.tweens.add(this.object.light)
        .to({ intensity: 1, distance: 6 }, 150, Tweener.ease.quartOut)
        .then(() => {
          removeLight(this.object.light)
          this.object.parent.remove(this.object);
        });

    } else {
      this.object.parent.remove(this.object);

    }
  }

}

export default class Projectile extends THREE.Object3D {
  constructor (data) {
    super()
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(data.type),
      color: 0xffffff,
      transparent: true
    }));
    this.add(this.sprite);
    this.sprite.scale.normalizeWithTexture(this.sprite.material.map)

    if (data.type.indexOf("-magic") !== -1) {
      this.light = getLightFromPool();
      this.light.position.y = 1;
      this.light.intensity = 0.5;
      this.light.distance = 5;
      this.add(this.light);
    }

    this.addBehaviour(new ProjectileBehaviour(), data);
  }

}

