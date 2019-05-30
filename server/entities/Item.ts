import { Entity } from "./Entity";
import { Player } from "./Player";

export class Item extends Entity {

  constructor () {
    super()
  }

  pick (player: Player, state) {
    return player.inventory.add(this);
  }

}
