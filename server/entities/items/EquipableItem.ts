import { Item } from "../Item";
import { Player } from "../Player";
import { DungeonState } from "../../rooms/states/DungeonState";
import { EquipmentSlot } from "../../core/EquipmentSlot";

export abstract class EquipableItem extends Item {
  abstract slotName: EquipmentSlot;

  use(player: Player, state: DungeonState) {
    const isSlotAvailable = player.equipedItems.isSlotAvailable(this.slotName);

    if (isSlotAvailable) {
      player.equipedItems.add(this);
    }

    return isSlotAvailable;
  }
}
