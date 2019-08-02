import helpers from "../../../../shared/helpers";
import { Unit } from "../../Unit";
import { DungeonState, Point } from "../../../rooms/states/DungeonState";
import { CastableItem } from "../CastableItem";

export class ScrollTeleport extends CastableItem {

  constructor() {
    super();

    this.type = helpers.ENTITIES.SCROLL_MAGIC;
  }

  cast(unit: Unit, state: DungeonState, position?: Point) {
    if (state.roomUtils.isValidTile(position)) {
      unit.position.set(position);
      return super.cast(unit, state, position);

    } else {
      return false;
    }
  }

  // you cannot use this.
  use(player, state) { return false; }

  getPrice() {
    return 400;
  }

}
