export default class InventoryIcon extends THREE.Object3D {

  constructor () {
    super()

    this.closed = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-bag"),
      transparent: true
    }))
    this.add(this.closed)

    this.open = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-bag-open"),
      transparent: true
    }))
    // this.add(this.open)

    this.scale.set(this.open.material.map.frame.w *  config.HUD_SCALE, this.open.material.map.frame.h *  config.HUD_SCALE, 1)

    this.width = this.open.material.map.frame.w *  config.HUD_SCALE
    this.height = this.open.material.map.frame.h *  config.HUD_SCALE
  }

}
