import { Behaviour } from 'behaviour.js'

export default class DangerousThing extends Behaviour {

  onAttach () {
    this.tween = null

    this.initY = this.object.position.y
    this.destY = this.initY + 0.1
    this.duration = 800 + (Math.random() * 200)

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

