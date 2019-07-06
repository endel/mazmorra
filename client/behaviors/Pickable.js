import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'

export default class Pickable extends Behaviour {

  onAttach () {
    this.tween = null
    this.object.addBehaviour(new Shadow)

    this.initY = this.object.position.y
    this.destY = this.initY + 0.2
    this.duration = 1700 + (Math.random() * 300)

    this.object.position.y = this.initY - 1

    this.goUp = this.goUp.bind(this);
    this.goDown = this.goDown.bind(this);

    App.tweens.
      add(this.object.scale).
      from({x: 0.1, y: 0.1, z: 0.1}, 600, Tweener.ease.quartOut)

    App.tweens.
      add(this.object.position).
      to({ y: this.initY + 1 }, 700, Tweener.ease.quartOut).
      to({ y: this.initY }, 1600, Tweener.ease.quartInOut).
      then(() => {
        this.initTimeout = setTimeout(() => this.goUp(), Math.random() * 1500)
      })
  }

  goUp () {
    this.tween = App.tweens.
      add(this.object.position).
      to({ y: this.destY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goDown)
  }

  goDown () {
    this.tween = App.tweens.
      add(this.object.position).
      to({ y: this.initY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goUp)
  }

  onDetach () {
    App.tweens.remove(this.object.position);
    clearTimeout(this.initTimeout)
    if (this.tween) { this.tween.dispose(); }
  }

}
