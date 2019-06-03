import { Entity } from "./Entity";
import { DungeonState } from "../rooms/states/DungeonState";
import { Unit } from "./Unit";

export abstract class Item extends Entity {

  constructor () {
    super()
  }

  abstract use(player: Unit, state: DungeonState): boolean;

  pick (unit: Unit, state: DungeonState) {
    const success = unit.inventory.add(this);

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }

}
