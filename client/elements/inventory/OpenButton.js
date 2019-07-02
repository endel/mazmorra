import Hint from "../hud/Hint";

export default class OpenInventoryButton extends THREE.Object3D {

  constructor () {
    super()

    this.userData.hud = true;

    this.isOpen = false

    var closedMaterial = ResourceManager.get("hud-bag")
    this.closed = new THREE.Sprite(new THREE.SpriteMaterial({ map: closedMaterial, transparent: true }))
    this.closed.scale.set(closedMaterial.frame.w *  config.HUD_SCALE, closedMaterial.frame.h *  config.HUD_SCALE, 1)
    this.add(this.closed)

    var openMaterial = ResourceManager.get("hud-bag-open")
    this.open = new THREE.Sprite(new THREE.SpriteMaterial({ map: openMaterial, transparent: true }))
    this.open.scale.set(openMaterial.frame.w *  config.HUD_SCALE, openMaterial.frame.h *  config.HUD_SCALE, 1)

    this.openYOffset = openMaterial.frame.h - closedMaterial.frame.h - 2

    this.width = openMaterial.frame.w *  config.HUD_SCALE
    this.height = openMaterial.frame.h *  config.HUD_SCALE

    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
    this.addEventListener('click', this.onClick.bind(this))
  }

  onClick () {
    // toggle open

    if (this.isOpen) {
      this.add(this.closed)
      this.remove(this.open)
      App.tweens.add(this.closed.position).to({ y: 0 }, 200, Tweener.ease.quintOut)

    } else {
      App.clock.setTimeout(() => {
        this.add(this.open)
        this.remove(this.closed)
      }, 80)
      App.tweens.add(this.closed.position).to({ y: -this.openYOffset *  config.HUD_SCALE }, 150, Tweener.ease.quintOut)
    }

    this.isOpen = !this.isOpen
  }

  onMouseOver () {
    Hint.show("Inventory", this);

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
  }

  onMouseOut () {
    Hint.hide();

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

}
