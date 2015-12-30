import { Behaviour } from 'behaviour.js'

import Lifebar from '../entities/Lifebar'
import Shadow from './Shadow'

export default class DangerousThing extends Behaviour {

  onAttach (amount = 0.05, duration) {
    this.object.addBehaviour(new Shadow)

    this.tween = null

    this.initY = this.object.position.y
    this.destY = this.initY + amount
    this.duration = (duration) ? duration : 400 + (Math.random() * 200)

    // lifebar
    this.lifebar = new Lifebar()
    this.lifebar.position.x = 0.5
    this.lifebar.position.y = 2.5
    this.lifebar.position.z = 1
    this.lifebar.visible = false
    this.object.add(this.lifebar)

    this.on('mouseover', this.onMouseOver.bind(this))
    this.on('mouseout', this.onMouseOut.bind(this))

    setTimeout(() => this.goUp(), Math.random() * 1500)
  }

  onMouseOver (tileSelection) {
    this.lifebar.visible = true
    tileSelection.setColor(0xd00000)
  }

  onMouseOut (tileSelection) {
    this.lifebar.visible = false
    tileSelection.setColor()
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

