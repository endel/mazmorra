import { Inventory } from "./Inventory";
import { EquipableItem } from "../entities/items/EquipableItem";
import { EquipmentSlot } from "./EquipmentSlot";
import { Item } from "../entities/Item";
import { EventEmitter } from "events";

export class EquipedItems extends Inventory {
  events = new EventEmitter();

  constructor () {
    super({ capacity: 5 })
  }

  isSlotAvailable(slot: EquipmentSlot) {
    return !this.slots[slot];
  }

  add (item: EquipableItem, force: boolean = false) {
    const hasAvailability = this.isSlotAvailable(item.slotName);

    // FORCE is a workaround for a @colyseus/schema bug
    if (hasAvailability || force) {
      this.slots[item.slotName] = item.clone();

      this.events.emit('change');
    }

    return hasAvailability;
  }

  getItem(itemId: string) {
    if (this.slots[itemId]) {
      // allow to get item by slot name
      return this.slots[itemId];

    } else {
      // allow to get item by id
      for (let slotName in this.slots) {
        const itemInSlot: Item = this.slots[slotName];
        if (itemInSlot.id === itemId) {
          return itemInSlot;
        }
      }
    }
  }

  remove(itemId: string) {
    if (this.slots[itemId]) {
      delete this.slots[itemId];
      this.events.emit('change');
      return true;

    } else {
      for (let slotName in this.slots) {
        const itemInSlot: Item = this.slots[slotName];

        if (itemInSlot.id === itemId) {
          delete this.slots[slotName];
          this.events.emit('change');
          return true;
        }
      }
    }

    return false;
  }

}
