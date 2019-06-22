'use strict';

import { Behaviour } from 'behaviour.js'
import LightOscillator from '../behaviors/LightOscillator'
import { getLightFromPool, removeLight } from '../utils';

class PortalBehaviour extends Behaviour {
  onAttach() {
    this.light = getLightFromPool();
    this.light.intensity = 2;
    this.light.distance = 15;
    this.light.color = new THREE.Color(0x1c80e4);
    this.light.position.set(0, 1.5, 0);

    App.tweens.
      add(this.light).
      from({ intensity: 0 }, 800, Tweener.ease.quartOut).
      then(() => this.light.addBehaviour(new LightOscillator, 0.8, 1.2));

    this.object.add(this.light);

    var currentTexture = 0;
    this.interval = setInterval(() => {
      currentTexture = (currentTexture+1)%3
      this.object.sprite.material.map = this.object.frames[currentTexture];
    }, 80);
  }

  onDetach() {
    App.tweens.remove(this.light);
    removeLight(this.light);

    clearInterval(this.interval);
  }

}

export default class Portal extends THREE.Object3D {

  constructor () {
    super()
    window.portal = this;

    this.frames = [
      ResourceManager.get("billboards-portal-frame0"),
      ResourceManager.get("billboards-portal-frame1"),
      ResourceManager.get("billboards-portal-frame2"),
    ];

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.frames[0],
      color: 0xffffff,
    }))
    this.sprite.scale.normalizeWithTexture(this.frames[0])
    this.sprite.position.y = 0.55;
    this.add(this.sprite);

    this.initialScale = this.sprite.scale.clone();
    this.sprite.scale.set(0, 0, 0);

    // animate portal
    App.tweens.
      add(this.sprite.material).
      from({ opacity: 0 }, 500, Tweener.ease.quartOut);

    App.tweens.
      add(this.sprite.scale).
      to(this.initialScale, 1000, Tweener.ease.quartOut);

    this.addBehaviour(new PortalBehaviour());
  }

}



