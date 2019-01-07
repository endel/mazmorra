export default class Button extends THREE.Object3D {

  constructor (kind = 'button-left') {
    super()

    this.userData.hud = true;

    this.hoverScale = 1.04
    this.mouseOutScale = 1

    this.standby = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-${ kind }`),
      transparent: true
    }))
    this.standby.scale.normalizeWithHUDTexture(this.standby.material.map)
    this.add(this.standby)

    this.over = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-${ kind }-over`),
      transparent: true
    }))
    this.over.scale.normalizeWithHUDTexture(this.over.material.map)
    // this.add(this.over)

    this.width = this.standby.material.map.frame.w *  config.HUD_SCALE
    this.height = this.standby.material.map.frame.h *  config.HUD_SCALE

    this.addEventListener('click', this.onClick.bind(this))
    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
  }

  colorize (color) {
    this.standby.material.color = color
    this.over.material.color = color
  }

  onClick () {
    App.tweens.remove(this.scale)
    this.scale.set(1.5, 1.5, 1.5)

    App.tweens.add(this.scale).
      to({ x: this.hoverScale, y: this.hoverScale, z: this.hoverScale }, 200, Tweener.ease.cubicOut)
  }

  onMouseOut () {
    App.tweens.add(this.scale).
      to({ x: this.mouseOutScale, y: this.mouseOutScale, z: this.mouseOutScale }, 300, Tweener.ease.cubicInOut)

    this.over.renderOrder = null
    if (this.over.parent) this.over.parent.remove(this.over)
    this.add(this.standby)
  }

  onMouseOver () {
    App.tweens.add(this.scale).
      to({ x: this.hoverScale, y: this.hoverScale, z: this.hoverScale }, 300, Tweener.ease.cubicInOut)

    this.over.renderOrder = 100
    if (this.standby.parent) this.standby.parent.remove(this.standby)
    this.add(this.over)
  }

}
