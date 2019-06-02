import { Entity } from "./Entity";
import { DungeonState } from "../rooms/states/DungeonState";
import { Unit } from "./Unit";
import { Player } from "./Player";

export abstract class Item extends Entity {

  constructor () {
    super()
  }

  abstract use(player: Player, state: DungeonState): boolean;

  pick (unit: Unit, state: DungeonState) {
    const success = unit.inventory.add(this);

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }

}
