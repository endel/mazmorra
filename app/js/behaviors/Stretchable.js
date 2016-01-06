'use strict';

import { Behaviour } from 'behaviour.js'

export default class Strechable extends Behaviour {

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

  onDetach () {
    if (this.tween) this.tween.dispose()
  }

}
