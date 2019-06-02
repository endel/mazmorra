import ItemSlot from './ItemSlot'

export default class EquipedItems extends THREE.Object3D {

  constructor () {
    super()

    this.head = new ItemSlot({ accepts: 'helmet' }) // 'head'
    this.left = new ItemSlot({ accepts: 'weapon' }) // 'left'
    this.right = new ItemSlot({ accepts: 'shield' }) // 'right'
    this.body = new ItemSlot({ accepts: 'armor' }) // 'body
    this.feet = new ItemSlot({ accepts: 'boot' }) // 'feet'

    this.inventoryType = "equipedItems";

    this.add(this.head)
    this.add(this.left)
    this.add(this.right)
    this.add(this.body)
    this.add(this.feet)

    this.head.position.y = -this.head.height -  config.HUD_SCALE
    this.feet.position.y = this.feet.height  +  config.HUD_SCALE
    this.left.position.x = -this.left.width -  config.HUD_SCALE
    this.right.position.x = this.right.width +  config.HUD_SCALE

    this.width = (this.head.width +  config.HUD_SCALE) * 3
    this.height = (this.head.height +  config.HUD_SCALE) * 3
  }

  updateItems () {
    const equipmentSlots = ['head', 'left', 'right', 'body', 'feet'];

    for (const slotName of equipmentSlots) {
      const itemData = this.userData.slots[slotName];
      if (itemData) {
        this[slotName].item = ResourceManager.getHUDElement(`items-${itemData.type}`)
        this[slotName].item.userData.itemId = slotName;
        this[slotName].item.userData.inventoryType = this.inventoryType;

      } else if (this[slotName].item) {
        this[slotName].item.getEntity().detachAll();
        this[slotName].item = null;
      }
    }
  }

}
