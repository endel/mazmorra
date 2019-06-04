import { Inventory } from "./Inventory";
import { EquipableItem } from "../entities/items/EquipableItem";
import { EquipmentSlot } from "./EquipmentSlot";
import { Item } from "../entities/Item";

export class EquipedItems extends Inventory {
  constructor () {
    super({ capacity: 5 })
  }

  isSlotAvailable(slot: EquipmentSlot) {
    return !this.slots[slot];
  }

  add (item: EquipableItem) {
    const hasAvailability = this.isSlotAvailable(item.slotName);

    if (hasAvailability) {
      this.slots[item.slotName] = item.clone();
    }

    return hasAvailability;
  }

  getItem(itemId: string) {
    for (let slotName in this.slots) {
      const itemInSlot: Item = this.slots[slotName];
      if (itemInSlot.id === itemId) {
        return itemInSlot;
      }
    }
  }

  remove(itemId: string) {
    for (let slotName in this.slots) {
      const itemInSlot: Item = this.slots[slotName];
      console.log("let's delete itemId:", itemId, "slot:", slotName, itemInSlot.id === itemId);

      if (itemInSlot.id === itemId) {
        delete this.slots[slotName];
        return true;
      }
    }

    return false;
  }

}
