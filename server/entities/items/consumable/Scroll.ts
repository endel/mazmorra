import helpers from "../../../../shared/helpers";
import { Unit } from "../../Unit";
import { DungeonState, Point } from "../../../rooms/states/DungeonState";
import { Door, DoorDestiny, DoorProgress } from "../../interactive/Door";
import { CastableItem } from "../CastableItem";

export class Scroll extends CastableItem {

  constructor () {
    super();

    this.type = helpers.ENTITIES.SCROLL;
  }

  cast (unit: Unit, state: DungeonState, position?: Point) {
    if (state.progress === 1) {
      console.log("CANNOT USE SCROLL ON THE VILLAGE.");
      return false;
    }

    if (unit.mp.current > 10) {
      const portal = new Door(position, new DoorDestiny({ progress: DoorProgress.HOME }));
      portal.type = helpers.ENTITIES.PORTAL;

      state.entities[portal.id] = portal;
      return true;

    } else {
      console.log("TODO: NOT ENOUGH MANA!");
    }

    return false;
  }

  // you cannot use this.
  use(player, state) { return false; }

}
