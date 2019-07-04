import helpers from "../../../../shared/helpers";
import { DungeonState, Point } from "../../../rooms/states/DungeonState";
import { ConsumableItem } from "../ConsumableItem";
import { Unit } from "../../Unit";

export class Key extends ConsumableItem {

  constructor() {
    super();
  }

  cast(unit: Unit, state: DungeonState, position?: Point) {}
  use(player, state, force: boolean = false) { return force; }

  getSellPrice() {
    // players can't kill bosses to earn loads of money!
    return 10;
  }

  getPrice() {
    return 10000;
  }

}
