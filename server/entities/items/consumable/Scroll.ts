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
      state.createTextEvent(`Not allowed here.`, unit.position, 'white', 100);
      return false;
    }

    const mpCost = 10;

    if (unit.mp.current >= mpCost) {
      const portal = new Door(position, new DoorDestiny({ progress: DoorProgress.HOME }));
      portal.type = helpers.ENTITIES.PORTAL;

      unit.mp.increment(-mpCost);

      state.entities[portal.id] = portal;
      return true;

    } else {
      state.createTextEvent(`Not enough mana.`, unit.position, 'white', 100);
    }

    return false;
  }

  // you cannot use this.
  use(player, state) { return false; }

  getPrice() {
    // TODO: differentiate prices from portals and other magic
    return 50;
  }

}
