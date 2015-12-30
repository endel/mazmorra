import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'
import NearPlayerOpacity from './NearPlayerOpacity'

export default class Pickable extends Behaviour {

  onAttach () {
    this.tween = null
    this.object.addBehaviour(new Shadow)

    this.initY = this.object.position.y
    this.destY = this.initY + 0.2
    this.duration = 1700 + (Math.random() * 300)

    setTimeout(() => this.goUp(), Math.random() * 1500)
  }

  goUp () {
    this.tween = tweener.
      add(this.object.position).
      to({ y: this.destY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goDown.bind(this))
  }

  goDown () {
    this.tween = tweener.
      add(this.object.position).
      to({ y: this.initY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goUp.bind(this))
  }

  onDestroy () {
    if (this.tween) this.tween.dispose()
  }

}
