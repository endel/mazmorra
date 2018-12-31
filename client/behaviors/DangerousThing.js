import { Behaviour } from 'behaviour.js'

export default class DangerousThing extends Behaviour {

  onAttach (amount = 0.05, duration) {
    this.initY = this.object.position.y
    this.destY = this.initY + amount
    this.duration = (duration) ? duration : 400 + (Math.random() * 200)

    this.tween = null
    setTimeout(() => this.goUp(), Math.random() * 1500)

    this.on('died', this.detach.bind(this))
  }

  goUp () {
    this.tween = App.tweens.
      add(this.object.position).
      to({ y: this.destY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goDown.bind(this))
  }

  goDown () {
    this.tween = App.tweens.
      add(this.object.position).
      to({ y: this.initY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goUp.bind(this))
  }

  onDetach () {
    if (this.tween) this.tween.dispose()
  }

}

