import { Item } from "../Item";
import { Player } from "../Player";
import { DungeonState } from "../../rooms/states/DungeonState";

export abstract class ConsumableItem extends Item {

  abstract consume(player: Player, state: DungeonState);

  pick (player: Player, state) {
    let success: boolean = false;

    if (player.quickInventory.hasAvailability()) {
      success = player.quickInventory.add(this);

    } else if (player.inventory.hasAvailability()) {
      success = player.inventory.add(this);
    }

    if (success) {
      state.events.emit("sound", "pickItem", player);
    }

    return success;
  }

}
