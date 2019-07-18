import { DungeonState, Point } from "../../../rooms/states/DungeonState";
import { ConsumableItem } from "../ConsumableItem";
import { Unit } from "../../Unit";

export class Key extends ConsumableItem {

  constructor() {
    super();
  }

  cast(unit: Unit, state: DungeonState, position?: Point) {}
  use(player, state, force: boolean = false) {
    if (force) {
      return super.use(player, state, force);

    } else {
      return false;
    }
  }

  getSellPrice() {
    // players can't kill bosses to earn loads of money!
    return 10;
  }

  getPrice() {
    return 10000 * this.qty;
  }

}
