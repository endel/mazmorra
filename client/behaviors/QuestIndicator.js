import { Behaviour } from 'behaviour.js'

export default class QuestIndicator extends Behaviour {

  onAttach () {
    this.tween = null

    const map = ResourceManager.get('hud-quest-indicator');
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map }))
    this.sprite.scale.normalizeWithTexture(map);

    this.initY = 3.2;
    this.destY = this.initY + 0.2
    this.duration = 1500

    this.sprite.position.y = this.initY;

    this.object.add(this.sprite);

    this.goUp = this.goUp.bind(this);
    this.goDown = this.goDown.bind(this);

    this.goUp();
  }

  goUp () {
    this.tween = App.tweens.
      add(this.sprite.position).
      to({ y: this.destY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goDown)
  }

  goDown () {
    this.tween = App.tweens.
      add(this.sprite.position).
      to({ y: this.initY }, this.duration, Tweener.ease.cubicInOut).
      then(this.goUp)
  }

  onDetach () {
    this.object.remove(this.sprite);
    App.tweens.remove(this.sprite.position);
    clearTimeout(this.initTimeout)
    if (this.tween) { this.tween.dispose(); }
    delete this.sprite;
  }

}
