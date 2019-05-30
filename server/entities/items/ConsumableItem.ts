import { Item } from "../Item";
import { Player } from "../Player";
import { DungeonState } from "../../rooms/states/DungeonState";

export abstract class ConsumableItem extends Item {

  abstract consume(player: Player, state: DungeonState);

  pick (player: Player, state) {
    if (player.quickInventory.hasAvailability()) {
      return player.quickInventory.add(this);

    } else if (player.inventory.hasAvailability()) {
      return player.inventory.add(this);
    }

    return false;
  }

}
