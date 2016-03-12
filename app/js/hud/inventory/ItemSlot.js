export default class ItemSlot extends THREE.Object3D {
  static DEFAULT_OPACITY = 0.8;

  constructor () {
    super()

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

    // this.addEventListener('mouseover', this.onMouseOver.bind(this))
    // this.addEventListener('mouseout', this.onMouseOut.bind(this))
    // this.addEventListener('click', this.onClick.bind(this))
  }

  get material () {
    return this.free.material
  }


}

