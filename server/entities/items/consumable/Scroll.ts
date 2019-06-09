import { ConsumableItem } from "../ConsumableItem";
import helpers from "../../../../shared/helpers";
import { Unit } from "../../Unit";
import { DungeonState } from "../../../rooms/states/DungeonState";
import { Door, DoorDestiny, DoorProgress } from "../../interactive/Door";

export class Scroll extends ConsumableItem {

  constructor () {
    super();

    this.type = helpers.ENTITIES.SCROLL;
  }

  use(unit: Unit, state: DungeonState) {
    if (state.progress === 1) {
      console.log("CANNOT USE SCROLL ON THE VILLAGE.");
      return false;
    }

    if (unit.mp.current > 10) {
      const portal = new Door(unit.position, new DoorDestiny({
        progress: DoorProgress.HOME
      }));
      portal.type = helpers.ENTITIES.PORTAL;

      state.entities[portal.id] = portal;
      return true;

    } else {
      console.log("TODO: NOT ENOUGH MANA!");
    }

    return false;
  }

}
