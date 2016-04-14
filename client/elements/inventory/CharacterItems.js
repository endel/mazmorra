import ItemSlot from './ItemSlot'

export default class CharacterItems extends THREE.Object3D {

  constructor () {
    super()

    this.top = new ItemSlot({ accepts: 'head' })
    this.left = new ItemSlot({ accepts: 'hand' })
    this.right = new ItemSlot({ accepts: 'hand' })
    this.center = new ItemSlot({ accepts: 'body' })
    this.bottom = new ItemSlot({ accepts: 'feet' })

    this.add(this.top)
    this.add(this.left)
    this.add(this.right)
    this.add(this.center)
    this.add(this.bottom)

    this.top.position.y = -this.top.height -  config.HUD_SCALE
    this.bottom.position.y = this.bottom.height  +  config.HUD_SCALE
    this.left.position.x = -this.left.width -  config.HUD_SCALE
    this.right.position.x = this.right.width +  config.HUD_SCALE

    this.width = (this.top.width +  config.HUD_SCALE) * 3
    this.height = (this.top.height +  config.HUD_SCALE) * 3
  }

}
