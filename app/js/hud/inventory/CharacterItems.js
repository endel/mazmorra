import ItemSlot from './ItemSlot'

export default class CharacterItems extends THREE.Object3D {

  constructor () {
    super()

    this.top = new ItemSlot()
    this.left = new ItemSlot()
    this.right = new ItemSlot()
    this.center = new ItemSlot()
    this.bottom = new ItemSlot()

    this.add(this.top)
    this.add(this.left)
    this.add(this.right)
    this.add(this.center)
    this.add(this.bottom)

    this.top.position.y = -this.top.height - HUD_SCALE
    this.bottom.position.y = this.bottom.height  + HUD_SCALE
    this.left.position.x = -this.left.width - HUD_SCALE
    this.right.position.x = this.right.width + HUD_SCALE

    this.width = (this.top.width + HUD_SCALE) * 3
    this.height = (this.top.height + HUD_SCALE) * 3
  }

}
