export default class ItemSlot extends THREE.Object3D {
  static DEFAULT_OPACITY = 0.8;

  constructor () {
    super()

    this._item = null

    var freeTex = ResourceManager.get("hud-item-slot-free")
    this.free = new THREE.Sprite(new THREE.SpriteMaterial({ map: freeTex, transparent: true }))
    this.free.scale.set(freeTex.frame.w * HUD_SCALE, freeTex.frame.h * HUD_SCALE, 1)
    this.add(this.free)

    var useTex = ResourceManager.get("hud-item-slot-use")
    this.use = new THREE.Sprite(new THREE.SpriteMaterial({ map: useTex, transparent: true }))
    this.use.scale.set(useTex.frame.w * HUD_SCALE, useTex.frame.h * HUD_SCALE, 1)

    this.free.material.opacity = ItemSlot.DEFAULT_OPACITY
    this.use.material.opacity = ItemSlot.DEFAULT_OPACITY

    this.width = useTex.frame.w * HUD_SCALE
    this.height = useTex.frame.h * HUD_SCALE

    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
    // this.addEventListener('click', this.onClick.bind(this))
  }

  onMouseOver () {
    if (this._item) {
      tweener.remove(this.scale)
      tweener.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
    }
  }

  onMouseOut () {
    tweener.remove(this.scale)
    tweener.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

  set item (item) {
    if (item) {
      this.add(this.use)
      this.remove(this.free)

      item.position.z = 1
      this.add(item)

    } else {
      if (this._item) {
        this.remove(this._item)
      }
      this.remove(this.use)
      this.add(this.free)
    }

    this._item = item
  }

  get item () { return this._item }

  get material () {
    return this._item ? this.use.material : this.free.material
  }


}

