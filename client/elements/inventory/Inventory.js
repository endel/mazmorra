import EquipedItems from './EquipedItems'
import SlotStrip from './SlotStrip'
import ItemSlot from './ItemSlot'

export default class Inventory extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false
    this.isTrading = false;

    this.equipedItems = new EquipedItems()
    this.slots = new SlotStrip({ slots: 12, columns: 4, inventoryType: "inventory" })
    // this.exchangeSlots = new SlotStrip({ slots: 1, allowRemove: true, inventoryType: "exchange" })

    this.equipedItems.position.x -= this.equipedItems.width/2 + this.slots.slotSize/1.5
    this.slots.position.x = this.equipedItems.position.x + (this.equipedItems.width/2 + this.slots.slotSize / 2 +  config.HUD_SCALE * 2)
    this.slots.position.y = -this.slots.height/3

    // this.exchangeSlots.position.x = this.equipedItems.position.x + (this.equipedItems.width/2 + this.slots.slotSize / 2 +  config.HUD_SCALE * 2) + (this.exchangeSlots.width / 2)
    // this.exchangeSlots.position.y = -this.exchangeSlots.height

    this.exchangeSymbol = ResourceManager.getHUDElement('hud-exchange-icon')
    this.exchangeSymbol.position.y = - this.slots.height / 2 - this.exchangeSymbol.height;

    this.purchaseSlots = new SlotStrip({
      slots: 6,
      columns: 6,
      inventoryType: "purchase",
      accepts: "sell"
    });
    this.purchaseSlots.position.x = this.equipedItems.position.x - this.slots.slotSize / 2;
    this.purchaseSlots.position.y = this.exchangeSymbol.position.y - this.purchaseSlots.height;

    this.add(this.equipedItems)
    this.add(this.slots)
    // this.add(this.exchangeSlots)

    this.width = this.equipedItems.width + this.slots.position.x + this.slots.width;
    this.height = this.equipedItems.height;
  }

  setTradingItems (items) {
    console.log("ITEMS:", items);

    this.add(this.exchangeSymbol);
    this.add(this.purchaseSlots);

    this.isTrading = true;
  }

  updateItems () {
    this.slots.updateItems();
  }

  toggleOpen () {
    this.isOpen = !this.isOpen

    // emit toggle event
    this.getEntity().emit('toggle', this.isOpen)

    const scaleFrom = ((this.isOpen) ? 0.5 : 1)
    const scaleTo = ((this.isOpen) ? 1 : 0.5)

    this.scale.set(scaleFrom, scaleFrom, scaleFrom)

    if (this.isOpen) {
      this.visible = true

    } else {
      // remove trading UI
      this.isTrading = false;
      this.remove(this.exchangeSymbol);
      this.remove(this.purchaseSlots);
    }

    //
    // fade all element materials separately
    // (THREE.js can't change opacity of containers)
    //
    const elementsToFade = this.equipedItems.children.
      concat(this.slots.children);
      // concat(this.exchangeSlots.children).
      // concat(this.exchangeSymbol)

    elementsToFade.map((el, i) => {
      let targetOpacity = ((this.isOpen) ? ItemSlot.DEFAULT_OPACITY : 0)

      App.tweens.remove(el.material)

      // fade item inside ItemSlot, in case there's any
      if (el instanceof ItemSlot && el.item) {
        App.tweens.add(el.item.material).wait(i * 15).to({ opacity: (targetOpacity > 0) ? 1 : 0 }, 500, Tweener.ease.quintOut)

        if (targetOpacity > 0 && el.hasItem()) {
          targetOpacity = ItemSlot.OCCUPIED_OPACITY;
        }
      }

      App.tweens.add(el.material).wait(i * 15).to({ opacity: targetOpacity }, 500, Tweener.ease.quintOut)
    })

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false
    })
  }

}
