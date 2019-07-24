import Composition from './character/Composition'

export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.composition = new Composition(data.properties)
    this.composition.position.y = 0.5

    this.isTypingSprite = ResourceManager.getSprite(`hud-talk-indicator`);
    this.isTypingSprite.position.y = 3;

    this.initialScale = this.isTypingSprite.scale.clone();

    this.add(this.composition)
  }

  get sprite () {
    return this.composition.sprite;
  }

  get label () {
    return (this !== global.player)
      ? `${ this.userData.name } - lvl ${ this.userData.lvl }`
      : undefined;
  }

  set direction (direction) {
    this.composition.direction = direction
  }

  set typing (isTyping) {
    if (isTyping) {
      App.tweens.remove(this.isTypingSprite.scale);

      this.isTypingSprite.scale.set(0.1, 0.1, 0.1);
      App.tweens.add(this.isTypingSprite.scale).to({
        x: this.initialScale.x,
        y: this.initialScale.y,
        z: this.initialScale.z
      }, 200, Tweener.ease.quintOut);

      this.add(this.isTypingSprite);

    } else {
      this.remove(this.isTypingSprite);
    }
  }

  destroy () {
     this.composition.destroy()
     super.destroy();
  }

}
