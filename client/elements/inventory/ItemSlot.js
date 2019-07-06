import hint from "../hud/Hint";
import EquipedItems from "./EquipedItems";
import { trackEvent, humanize } from "../../utils";

let draggingItem = null
  , draggingFrom = null

export default class ItemSlot extends THREE.Object3D {
  static DEFAULT_OPACITY = 0.6;
  static OCCUPIED_OPACITY = 1;

  constructor (options = { accepts: null }) {
    super()

    this._item = null
    // this.userData.hud = true;

    this.accepts = options.accepts

    var freeTex = ResourceManager.get("hud-item-slot-free")
    this.free = new THREE.Sprite(new THREE.SpriteMaterial({ map: freeTex, transparent: true }))
    this.free.scale.set(freeTex.frame.w *  config.HUD_SCALE, freeTex.frame.h *  config.HUD_SCALE, 1)
    this.free.material.opacity = ItemSlot.DEFAULT_OPACITY
    this.add(this.free)

    var useTex = ResourceManager.get("hud-item-slot-use")
    this.use = new THREE.Sprite(new THREE.SpriteMaterial({ map: useTex, transparent: true }))
    this.use.scale.set(useTex.frame.w *  config.HUD_SCALE, useTex.frame.h *  config.HUD_SCALE, 1)
    this.use.material.opacity = ItemSlot.OCCUPIED_OPACITY;

    this.width = useTex.frame.w *  config.HUD_SCALE
    this.height = useTex.frame.h *  config.HUD_SCALE

    // mouse-over / mouse-out
    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))

    // drag start
    this.addEventListener('mousedown', this.onDragStart.bind(this))
    this.addEventListener('touchstart', this.onDragStart.bind(this))

    // drag end
    this.addEventListener('mouseup', this.onDragEnd.bind(this))
    this.addEventListener('touchend', this.onDragEnd.bind(this))

    // double click
    this.addEventListener('dblclick', this.onDoubleClick.bind(this))
  }

  set enabled (bool) {
    this.userData.hud = bool;
  }

  hasItem () {
    return this._item
  }

  onMouseOver ( e ) {
    this._showHint();

    if (this._item || draggingItem) {
      App.tweens.remove(this.scale)
      App.tweens.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
    }
  }

  onMouseOut () {
    hint.hide();

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

  set item(item) {
    if (item) {
      this.add(this.use)
      this.remove(this.free)

      item.position.x = 0
      item.position.y = 0
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

  get item () {
    return this._item
  }

  get material () {
    return this._item ? this.use.material : this.free.material
  }

  onDragStart(e) {
    hint.hide();

    if (App.cursor.isPerformingCast()) {
      App.cursor.cancelItemCast();
    }

    let targetSlot = e.target
    if (targetSlot.item) {

      draggingItem = targetSlot.item
      draggingFrom = targetSlot

      draggingItem.slot = targetSlot;

      // setup initialScale variable for the first time
      if (draggingItem.initialScale === undefined) {
        draggingItem.initialScale = draggingItem.scale.clone()
      }

      targetSlot.item = null

      App.cursor.dispatchEvent({
        type: "drag",
        item: draggingItem
      });

      App.tweens.add(draggingItem.scale).to({
        x: draggingItem.initialScale.x + (2 * config.HUD_SCALE),
        y: draggingItem.initialScale.y + (2 * config.HUD_SCALE)
      }, 300, Tweener.ease.quintOut)
    }
  }

  dispatchSell(itemData) {
    trackEvent('trade-sell', { event_category: 'Trade', event_label: 'Sell' });

    this.dispatchEvent({
      type: "inventory-sell",
      bubbles: true,
      ...itemData
    });
  }

  onDragEnd(e) {
    let targetSlot = e.target

    const isPurchasing = (draggingFrom && draggingFrom.parent && draggingFrom.parent.inventoryType === "purchase");

    //
    // Sell item!
    //
    if (
      draggingItem &&
      draggingFrom.parent &&
      this.accepts === "sell" &&
      !isPurchasing
    ) {
      this.dispatchSell({
        fromInventoryType: draggingFrom.parent.inventoryType,
        itemId: draggingItem.userData.itemId
      })
      return;
    }

    //
    // EquipedItems: check if target slot accepts this type of item.
    //
    if (
      (
        draggingItem &&
        draggingItem.userData.item.slotName &&
        this.accepts &&
        draggingItem.userData.item.slotName !== this.accepts
      ) ||
      (
        draggingItem &&
        !draggingItem.userData.item.slotName &&
        this.parent instanceof EquipedItems
      )
    ) {
      // cancel drop if slotName doesn't match dropped slot.
      this._revertDraggingItem(true);
      return;
    }

    if (draggingItem) {

      let switchWith = {};
      if (this.item) {
        switchWith['switchItemId'] = this.item.userData.item.id
        draggingFrom.item = this.item;
      }

      /**
       * dispatch "inventory-drag" event only for different types of inventories
       */
      if (
        draggingFrom.parent && this.parent &&
        draggingFrom.parent.inventoryType !== this.parent.inventoryType
      ) {
        this.dispatchEvent({
          type: "inventory-drag",
          bubbles: true,
          fromInventoryType: draggingFrom.parent.inventoryType,
          toInventoryType: this.parent.inventoryType,
          itemId: draggingItem.userData.itemId,
          ...switchWith
        });
      }

      if (!isPurchasing) {
        targetSlot.item = draggingItem
      };

      this._revertDraggingItem(isPurchasing);
    }

    this._showHint();
  }

  onDoubleClick(e) {
    const targetSlot = e.target;
    const item = targetSlot.item;

    if (item) {
      const itemData = item.userData.item;

      if (
        hud.inventory.isTrading &&
        this.parent.inventoryType !== "purchase"
      ) {
        if (this.parent.inventoryType === "equipedItems") {
          if (!confirm(`Are you sure you'd like to sell this '${humanize(this._item.userData.item.type)}'?`)) {
            return;
          }
        }

        // Sell item!
        this.dispatchSell({
          fromInventoryType: this.parent.inventoryType,
          itemId: targetSlot.item.userData.itemId
        });

      } else if (itemData.isCastable && !hud.inventory.isTrading) {
        draggingFrom = targetSlot;
        App.cursor.prepareItemCast(item, draggingFrom);

        // force to close inventory if it's open.
        // FIXME: this code is duplicated all over the place!
        if (hud.isInventoryOpen()) {
          hud.openInventoryButton.onClick();
          hud.onToggleInventory();
        }

      } else {
        // attach inventory type for sending to room handler.
        this.dispatchEvent({
          type: "use-item",
          bubbles: true,
          itemId: targetSlot.item.userData.itemId,
          inventoryType: this.parent.inventoryType
        });

      }

    } else {
      e.stopPropagation = true;
    }
  }

  _showHint() {
    if (this._item && this._item.userData.item) {
      hint.show(this._item.userData.item, this);
    }
  }

  _drop() {
    draggingItem = null
  }

  _revertDraggingItem(cancelDrop) {
    if (cancelDrop) {
      draggingFrom.item = draggingItem;
    }

    App.cursor.dispatchEvent({
      type: "drag",
      item: false
    });

    App.tweens.remove(draggingItem.scale)
    App.tweens.add(draggingItem.scale).to(draggingItem.initialScale, 300, Tweener.ease.quintOut)

    draggingItem = null
  }

}
