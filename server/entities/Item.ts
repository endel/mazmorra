import { Entity } from "./Entity";
import helpers from "../../shared/helpers";
import { Point } from "../rooms/states/DungeonState";

export class Item extends Entity {

  constructor (type, position: Point) {
    super()

    this.type = type
    this.position.set(position);
  }

  pick (player, state) {
    return player.inventory.add(this)
  }

}
