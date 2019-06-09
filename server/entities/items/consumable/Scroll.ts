import { ConsumableItem } from "../ConsumableItem";
import helpers from "../../../../shared/helpers";
import { Unit } from "../../Unit";
import { DungeonState } from "../../../rooms/states/DungeonState";
import { Entity } from "../../Entity";

export class Scroll extends ConsumableItem {

  constructor () {
    super();

    this.type = helpers.ENTITIES.SCROLL;
  }

  use(unit: Unit, state: DungeonState) {
    console.log("PROGRESS:", state.progress);

    if (unit.mp.current > 10 && state.progress !== 1) {

      const portal = new Entity();
      portal.type = helpers.ENTITIES.PORTAL;
      portal.position.set(unit.position);

      state.entities[portal.id] = portal;

      return true;

    } else {
      console.log("TODO: NOT ENOUGH MANA!");
    }

    return false;
  }

}
