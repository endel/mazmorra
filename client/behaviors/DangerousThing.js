import { Behaviour } from 'behaviour.js'

export default class DangerousThing extends Behaviour {

  onAttach (amount = 0.05, duration) {
    this.object.userData.interactive = true;

    this.initY = this.object.position.y
    this.destY = this.initY + amount
    this.duration = (duration) ? duration : 400 + (Math.random() * 200)

    this.goUp = this.goUp.bind(this);
    this.goDown = this.goDown.bind(this);

    this.tween = null
    setTimeout(() => this.goUp(), Math.random() * 1500)

    this.on('died', this.detach.bind(this))
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
    delete this.object.userData.interactive;
    if (this.tween) {
      this.tween.then(null);
      this.tween = null;
    }
  }

}

