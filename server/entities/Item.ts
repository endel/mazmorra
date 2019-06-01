import { Entity } from "./Entity";
import { DungeonState } from "../rooms/states/DungeonState";
import { Unit } from "./Unit";

export class Item extends Entity {

  constructor () {
    super()
  }

  pick (unit: Unit, state: DungeonState) {
    return unit.inventory.add(this);
  }

}
