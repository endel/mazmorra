'use strict';

import { Behaviour } from 'behaviour.js'
import LightOscillator from '../behaviors/LightOscillator'

class PortalBehaviour extends Behaviour {
  onAttach() {
    const light = new THREE.PointLight(0x1c80e4, 2, 15);
    light.position.set(0, 1.5, 0);

    App.tweens.
      add(light).
      from({ intensity: 0 }, 800, Tweener.ease.quartOut).
      then(() => light.addBehaviour(new LightOscillator, 0.8, 1.2));

    this.object.add(light);

    var currentTexture = 0;
    this.interval = setInterval(() => {
      currentTexture = (currentTexture+1)%3
      this.object.sprite.material.map = this.object.frames[currentTexture];
    }, 80);
  }

  onDetach() {
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

    this.sprite.position.y = 0.55;
    this.add(this.sprite);

    // animate portal
    App.tweens.
      add(this.sprite.material).
      from({ opacity: 0 }, 500, Tweener.ease.quartOut);

    App.tweens.
      add(this.sprite.position).
      from({y: -1.5}, 1000, Tweener.ease.quartOut);

    this.sprite.scale.normalizeWithTexture(this.frames[0])
    this.addBehaviour(new PortalBehaviour());
  }

}



