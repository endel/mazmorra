import { Item } from "../Item";
import { Player } from "../Player";
import { DungeonState } from "../../rooms/states/DungeonState";

export abstract class ConsumableItem extends Item {

  abstract consume(player: Player, state: DungeonState);

  pick (player: Player, state) {
    console.log("quickInventory: ", player.quickInventory.hasAvailability());
    console.log("inventory: ", player.quickInventory.hasAvailability());

    if (player.quickInventory.hasAvailability()) {
      console.log("ADDED TO QUICK INVENTORY");
      return player.quickInventory.add(this);

    } else if (player.inventory.hasAvailability()) {
      console.log("ADDED TO INVENTORY");
      return player.inventory.add(this);
    }

    return false;
  }

}
