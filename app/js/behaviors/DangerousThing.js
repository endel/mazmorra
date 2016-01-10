import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'
import HasLifebar from './HasLifebar'

export default class DangerousThing extends Behaviour {

  onAttach (amount = 0.05, duration) {
    this.object.addBehaviour(new Shadow)
    this.object.addBehaviour(new HasLifebar)

    this.initY = this.object.position.y
    this.destY = this.initY + amount
    this.duration = (duration) ? duration : 400 + (Math.random() * 200)

    this.tween = null
    setTimeout(() => this.goUp(), Math.random() * 1500)

    this.originalColor = this.object.sprite.material.color.getHex()
    this.on('damage', this.onTakeDamage.bind(this))

    this.on('died', this.detach.bind(this))
  }

  onTakeDamage () {
    if (this.object.sprite && (!this.lastTimeout || !this.lastTimeout.active)) {
      // red blink on enemies
      this.object.sprite.material.color.setHex(COLOR_RED.getHex())
      if (this.lastTimeout) this.lastTimeout.clear()

      this.lastTimeout = clock.setTimeout(() => {
        this.object.sprite.material.color.setHex(this.originalColor)
      }, 50)
    }
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

  onDetach () {
    if (this.tween) this.tween.dispose()
  }

}

