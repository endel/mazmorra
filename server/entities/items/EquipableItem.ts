import { Item } from "../Item";
import { DungeonState } from "../../rooms/states/DungeonState";
import { EquipmentSlot } from "../../core/EquipmentSlot";
import { type } from "@colyseus/schema";
import { Unit } from "../Unit";

export abstract class EquipableItem extends Item {
  @type("string") abstract slotName: EquipmentSlot;

  use(player: Unit, state: DungeonState) {
    const isSlotAvailable = player.equipedItems.isSlotAvailable(this.slotName);

    if (isSlotAvailable) {
      player.equipedItems.add(this);
    }

    return isSlotAvailable;
  }

  pick (unit: Unit, state: DungeonState) {
    let success = false;

    if (this.use(unit, state)) {
      success = true;

    } else if (unit.inventory.add(this)) {
      success = super.pick(unit, state);
    }

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }
}
