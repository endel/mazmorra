'use strict';

import { Behaviour } from 'behaviour.js'

export default class Highlight extends THREE.Sprite {

  constructor () {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get( "effects-highlight"),
      color: 0xffffff,
      fog: true,
      transparent: true
    }))

    this.material.opacity = 0.3

    this.name = name
    this.scale.set(4, 4, 4)

    this.behave(new Strechable)
  }

}

class Strechable extends Behaviour {

  onAttach () {
    this.tween = null

    this.dest = this.object.scale.x + 0.2
    this.init = this.object.scale.x - 0.2

    this.shrink()
  }

  shrink () {
    this.tween = tweener.
      add(this.object.scale).
      to({ x: this.dest }, 1500, Tweener.ease.cubicInOut).
      then(this.grow.bind(this))
  }

  grow () {
    this.tween = tweener.
      add(this.object.scale).
      to({ x: this.init }, 1500, Tweener.ease.cubicInOut).
      then(this.shrink.bind(this))
  }

  onDestroy () {
    if (this.tween) this.tween.dispose()
  }

}
