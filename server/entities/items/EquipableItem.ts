import { Item } from "../Item";
import { DungeonState } from "../../rooms/states/DungeonState";
import { EquipmentSlot } from "../../core/EquipmentSlot";
import { type } from "@colyseus/schema";
import { Unit } from "../Unit";

export abstract class EquipableItem extends Item {
  @type("string") abstract slotName: EquipmentSlot;

  use(player: Unit, state: DungeonState) {
    // prevent performing action on already equiped item.
    if (player.equipedItems.getItem(this.slotName) === this) {
      console.log("cannot equip already equiped item!");
      return false;
    }

    if (player.equipedItems.isSlotAvailable(this.slotName)) {
      // just equip!
      console.log("slot available, just equip!");
      player.equipedItems.add(this);
      return true;

    } else {
      console.log("let's swap!");
      // swap with previously equiped item.
      const equipedItem = player.equipedItems.getItem(this.slotName);
      player.inventory.remove(this.id);
      player.inventory.add(equipedItem);
      player.equipedItems.add(this, true);
      return false;
    }

  }

  pick (unit: Unit, state: DungeonState) {
    let success = false;

    if (unit.equipedItems.isSlotAvailable(this.slotName) && this.use(unit, state)) {
      success = true;

    } else {
      success = super.pick(unit, state);
    }

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }
}
