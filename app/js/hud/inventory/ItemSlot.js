export default class ItemSlot extends THREE.Object3D {

  constructor () {
    super()

    var freeTex = ResourceManager.get("hud-item-slot-free")
    this.free = new THREE.Sprite(new THREE.SpriteMaterial({ map: freeTex, transparent: true }))
    this.free.scale.set(freeTex.frame.w * HUD_SCALE, freeTex.frame.h * HUD_SCALE, 1)
    this.add(this.free)

    var useTex = ResourceManager.get("hud-item-slot-use")
    this.use = new THREE.Sprite(new THREE.SpriteMaterial({ map: useTex, transparent: true }))
    this.use.scale.set(useTex.frame.w * HUD_SCALE, useTex.frame.h * HUD_SCALE, 1)

    this.free.material.opacity = 0.8
    this.use.material.opacity = 0.8

    this.width = useTex.frame.w * HUD_SCALE
    this.height = useTex.frame.h * HUD_SCALE

    // this.addEventListener('mouseover', this.onMouseOver.bind(this))
    // this.addEventListener('mouseout', this.onMouseOut.bind(this))
    // this.addEventListener('click', this.onClick.bind(this))
  }


}

