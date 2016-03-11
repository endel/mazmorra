import ItemSlot from './ItemSlot'


export default class SlotStrip extends THREE.Object3D {

  constructor () {
    super()

    this.slots = []
    // TODO: break the line
    // this.itemsPerLine = 4
  }

  set numSlots (total) {
    this._numSlots = total
    this.updateChildren()
  }
  get numSlots () { return this._numSlots }

  updateChildren () {
    let i = this.children.length
    while (i--) { this.remove(this.children[i]) }

    this.slots = []
    for (i=0; i<this._numSlots; i++) {
      let slot = new ItemSlot()
      slot.position.x = (slot.width + HUD_SCALE) * i
      this.slots.push( slot )
      this.add(slot)
    }

    this.height = this.children[0].height

    let lastChild = this.children[ this.children.length-1 ]
    this.width = lastChild.position.x + HUD_SCALE
  }

}
