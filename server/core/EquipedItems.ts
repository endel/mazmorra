import { Inventory } from "./Inventory";
import { EquipableItem } from "../entities/items/EquipableItem";
import { EquipmentSlot } from "./EquipmentSlot";

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

}
