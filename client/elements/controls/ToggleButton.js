
export default class ToggleButton extends THREE.Object3D {

  constructor (isChecked = true) {
    super()

    this.userData.hud = true;

    this.width = 5 + config.HUD_SCALE;
    this.height = 5 + config.HUD_SCALE;

    this.uncheckedSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-checkbox`),
      transparent: true
    }))
    this.uncheckedSprite.scale.normalizeWithHUDTexture(this.uncheckedSprite.material.map)

    this.checkedSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-checkbox-checked`),
      transparent: true
    }))
    this.checkedSprite.scale.normalizeWithHUDTexture(this.checkedSprite.material.map)

    this.hoverScale = 1.05
    this.checkedScale = 1.25

    this.checked = isChecked;
    this.onUpdate();

    this.addEventListener('click', this.onClick.bind(this))
    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
  }

  onUpdate() {
    if (this.checked) {
      this.remove(this.uncheckedSprite);
      this.add(this.checkedSprite);
    } else {
      this.remove(this.checkedSprite);
      this.add(this.uncheckedSprite);
    }
  }

  onMouseOver() {
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).
      to({ x: this.hoverScale, y: this.hoverScale, z: this.hoverScale }, 200, Tweener.ease.cubicOut)
  }

  onMouseOut() {
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).
      to({ x: 1, y: 1, z: 1 }, 200, Tweener.ease.cubicOut)
  }

  onClick () {
    this.checked = !this.checked;
    this.onUpdate();

    this.dispatchEvent({ type: "change", value: this.checked });

    App.tweens.remove(this.scale)
    this.scale.set(1.5, 1.5, 1.5)

    const scale = (this.checked) ? this.checkedScale : 1;

    App.tweens.add(this.scale).
      to({ x: scale, y: scale, z: scale }, 200, Tweener.ease.cubicOut)
  }


}
