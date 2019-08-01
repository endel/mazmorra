import EquipedItems from './EquipedItems'
import SlotStrip from './SlotStrip'
import ItemSlot from './ItemSlot'
import { SpriteText2D, textAlign } from 'three-text2d'
import { trackEvent } from '../../utils';
import { i18n } from '../../lang';

export default class Inventory extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false
    this.isTrading = false;

    this.title = ResourceManager.getHUDElement('hud-big-title-regular');
    this.add(this.title);

    this.titleText = new SpriteText2D("", {
      align: textAlign.center ,
      font: config.FONT_TITLE,
      fillStyle: "#282828"
    });
    this.add(this.titleText);

    this.equipedItems = new EquipedItems()
    this.slots = new SlotStrip({ slots: 15, columns: 5, inventoryType: "inventory" })
    // this.exchangeSlots = new SlotStrip({ slots: 1, allowRemove: true, inventoryType: "exchange" })

    // this.exchangeSlots.position.x = this.equipedItems.position.x + (this.equipedItems.width/2 + this.slots.slotSize / 2 +  config.HUD_SCALE * 2) + (this.exchangeSlots.width / 2)
    // this.exchangeSlots.position.y = -this.exchangeSlots.height

    this.exchangeSymbol = ResourceManager.getHUDElement('hud-exchange-icon')
    this.purchaseSlots = new SlotStrip({
      slots: 12,
      columns: 6,
      inventoryType: "purchase",
      accepts: "sell"
    });

    this.add(this.equipedItems)
    this.add(this.slots)
    // this.add(this.exchangeSlots)

    this.width = this.equipedItems.width + this.slots.position.x + this.slots.width;
    this.height = this.equipedItems.height;
  }

  setTradingItems (items) {
    trackEvent('trade-open', { event_category: 'Trade', event_label: 'Open' });

    this.purchaseSlots.userData.slots = items;
    this.purchaseSlots.updateItems();

    this.add(this.exchangeSymbol);
    this.add(this.purchaseSlots);

    this.isTrading = true;
  }

  updateItems () {
    this.slots.updateItems();
  }

  updatePositions() {
    this.titleText.text = (this.isTrading) ? i18n('trade') : i18n('inventory');

    this.title.position.y = (this.isTrading) ? this.title.height * 2.8 : this.title.height * 2.1;
    this.titleText.position.y = this.title.position.y - 8;

    this.equipedItems.position.x = - (this.equipedItems.width / 2 + this.slots.slotSize - config.HUD_SCALE);
    this.equipedItems.position.y = this.titleText.position.y - (this.equipedItems.height / 2) - ((config.HUD_MARGIN * 2) * config.HUD_SCALE);

    this.slots.position.x = this.equipedItems.position.x + (this.equipedItems.width / 2 + this.slots.slotSize / 2 + config.HUD_SCALE)
    this.slots.position.y = this.titleText.position.y - this.slots.height - ((config.HUD_MARGIN * 2) * config.HUD_SCALE)

    this.exchangeSymbol.position.y = this.slots.position.y - this.exchangeSymbol.height - (config.HUD_MARGIN * 2 * config.HUD_SCALE);

    this.purchaseSlots.position.x = this.equipedItems.position.x + (config.HUD_SCALE * 1.5);
    this.purchaseSlots.position.y = this.exchangeSymbol.position.y - this.purchaseSlots.height - config.HUD_MARGIN;
  }

  toggleOpen () {

    this.isOpen = !this.isOpen

    // emit toggle event
    this.getEntity().emit('toggle', this.isOpen)

    const scaleFrom = ((this.isOpen) ? 0.5 : 1);
    const scaleTo = ((this.isOpen) ? 1 : 0.85);

    this.scale.set(scaleFrom, scaleFrom, scaleFrom)

    if (this.isOpen) {
      this.updatePositions();

      this.parent.openInventoryButton.onOpen();
      this.parent.character.onOpenInventory();

      this.visible = true

    } else {
      this.parent.openInventoryButton.onClose();
      this.parent.character.onCloseInventory();

      // remove trading UI
      this.isTrading = false;
      this.remove(this.exchangeSymbol);
      this.remove(this.purchaseSlots);
    }

    // toggle interactivity
    this.equipedItems.enabled = this.isOpen;
    this.slots.enabled = this.isOpen;
    this.purchaseSlots.enabled = this.isOpen;

    //
    // fade all element materials separately
    // (THREE.js can't change opacity of containers)
    //
    const slotsToFade = this.equipedItems.children.concat(this.slots.children);

    slotsToFade.map((el, i) => {
      let targetOpacity = ((this.isOpen) ? ItemSlot.DEFAULT_OPACITY : 0)

      App.tweens.remove(el.material)

      // fade item inside ItemSlot, in case there's any
      if (el instanceof ItemSlot && el.item) {
        App.tweens.add(el.item.material).wait(i * 15).to({ opacity: (targetOpacity > 0) ? 1 : 0 }, 300, Tweener.ease.quintOut)

        el.qty.visible = this.isOpen;
        if (el.qtyText) { el.qtyText.visible = this.isOpen; }

        if (targetOpacity > 0 && el.hasItem()) {
          targetOpacity = ItemSlot.OCCUPIED_OPACITY;
        }
      }

      App.tweens.add(el.material).wait(i * 15).to({ opacity: targetOpacity }, 300, Tweener.ease.quintOut)
    });

    const opacity = ((this.isOpen) ? 1 : 0);
    App.tweens.add(this.title.material).to({ opacity: opacity }, 500, Tweener.ease.quintOut);
    App.tweens.add(this.titleText.material).to({ opacity: opacity }, 500, Tweener.ease.quintOut);

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false
    })
  }

}
