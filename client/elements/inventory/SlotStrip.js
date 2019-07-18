import ItemSlot from './ItemSlot'

export default class SlotStrip extends THREE.Object3D {

  constructor (options = {}) {
    super()

    this.slots = []
    this.columns = options.columns || 6
    this.allowRemove = options.allowRemove || false
    this.inventoryType = options.inventoryType;

    this.accepts = options.accepts

    if (options.slots) {
      this.numSlots = options.slots
    }
  }

  set enabled (bool) {
    this._enabled = bool;
    this.children.forEach(slot => slot.enabled = bool);
  }

  get enabled () {
    return this._enabled;
  }

  clearItems () {
    for (let i=0; i<this.slots.length; i++) {
      if (this.slots[i].item) {
        this.slots[i].item.getEntity().destroy();
        this.slots[i].item = null;
      }
    }
  }

  updateItems () {
    const items = this.userData.slots;

    this.clearItems();

    const itemIds = Object.keys(items);
    for (let i=0; i<this.numSlots;i++) {
      this.slots[i].item = null;

      const itemId = itemIds[i];
      const item = items[itemId];

      if (item) {
        const itemIcon = ResourceManager.getHUDElement(`items-${item.type}`);
        itemIcon.userData.item = item;
        itemIcon.userData.itemId = itemId;
        itemIcon.userData.inventoryType = this.inventoryType;
        this.slots[i].item = itemIcon;
      }

      this.slots[i].enabled = this.enabled;
    }
  }

  set numSlots (total) {
    this._numSlots = total
    this.createChildren();
  }

  get numSlots () {
    return this._numSlots
  }

  createChildren () {
    let row, column
      , i = this.children.length
      , slot = null

    // remove previous children
    while (i--) {
      this.children[i].removeAllListeners();
      this.remove(this.children[i])
    }

    const maxRows = Math.floor(this.numSlots / this.columns) - 1;

    for (i = 0; i < this.numSlots; i++) {
      column = i % this.columns
      row = Math.floor(i / this.columns)

      slot = new ItemSlot({ accepts: this.accepts });
      slot.position.x = (slot.width - config.HUD_SCALE) * (column);
      slot.position.y = (slot.height - config.HUD_SCALE) * (maxRows - row);

      this.slots.push(slot);
      this.add(slot);
    }

    // this.slots.reverse();

    /*
    // add REMOVE slot
    if (this.allowRemove) {
      let x = slot.position.x + slot.width
        , y = slot.position.y

      slot = ResourceManager.getHUDElement('hud-item-slot-delete')
      slot.position.x = x +  config.HUD_SCALE
      slot.position.y = y
      slot.material.opacity = 0.8

      this.slots.push(slot)
      this.add(slot)
    }
    */

    this.width = slot.position.x + slot.width
    this.height = (slot.height - config.HUD_SCALE) * (row+1)
  }

  get slotSize () {
    return this.slots[0].width;
  }

}
