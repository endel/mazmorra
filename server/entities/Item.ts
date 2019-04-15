import { Entity } from "./Entity";
import helpers from "../../shared/helpers";

export class Item extends Entity {

  constructor (type, position) {
    super()

    this.type = type
    this.position = { x: position.x, y: position.y }
  }

  pick (player, state) {
    return player.inventory.add(this)
  }

}
