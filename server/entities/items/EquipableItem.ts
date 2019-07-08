import { Item } from "../Item";
import { DungeonState } from "../../rooms/states/DungeonState";
import { EquipmentSlot } from "../../core/EquipmentSlot";
import { type } from "@colyseus/schema";
import { Unit } from "../Unit";
import { Inventory } from "../../core/Inventory";

export abstract class EquipableItem extends Item {
  @type("string") abstract slotName: EquipmentSlot;

  use(player: Unit, state: DungeonState) {
    // prevent performing action on already equiped item.
    if (player.equipedItems.getItem(this.slotName) === this) {
      return false;
    }

    if (player.equipedItems.isSlotAvailable(this.slotName)) {
      // just equip!
      player.equipedItems.add(this);
      return true;

    } else {
      // swap with previously equiped item.
      const equipedItem = player.equipedItems.getItem(this.slotName);

      let inventoryFrom: Inventory;
      if (player.inventory.getItem(this.id)) {
        player.inventory.remove(this.id);
        inventoryFrom = player.inventory;

      } else if (player.quickInventory.getItem(this.id)) {
        player.quickInventory.remove(this.id);
        inventoryFrom = player.quickInventory;
      }

      if (!inventoryFrom) {
        return false;
      }

      inventoryFrom.add(equipedItem);
      player.equipedItems.add(this, true);
      return false;
    }

  }

  pick (unit: Unit, state: DungeonState) {
    let success = false;

    if (
      unit.equipedItems.isSlotAvailable(this.slotName) &&
      ( // only auto-equip items if primaryAttribute matches player's primaryAttribute
        !(this as any).damageAttribute ||
        ((this as any).damageAttribute && unit.primaryAttribute === (this as any).damageAttribute)
      ) &&
      this.use(unit, state)
    ) {
      success = true;
    }

    if (!success) {
      success = super.pick(unit, state);
    }

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }
}
