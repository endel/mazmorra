import { Item } from "../Item";
import helpers from "../../../shared/helpers";

export class Gold extends Item {

  constructor () {
    super()
    this.type = helpers.ENTITIES.GOLD;
  }

  pick (player, state) {
    let gold = Math.floor(Math.random() * 5)+1
    player.gold += gold
    state.createTextEvent("+" + gold, player.position, 'yellow', 100)

    return true;
  }

}
