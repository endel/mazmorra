import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'

export default class DangerousThing extends Behaviour {

  onAttach (amount = 0.05, duration) {
    this.object.behave(new Shadow)

    this.tween = null

    this.initY = this.object.position.y
    this.destY = this.initY + amount
    this.duration = (duration) ? duration : 400 + (Math.random() * 200)

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

