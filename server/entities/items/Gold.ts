import { Item } from "../Item";
import helpers from "../../../shared/helpers";

export class Gold extends Item {

  constructor (position) {
    super(helpers.ENTITIES.GOLD, position)
  }

  pick (player, state) {
    let gold = Math.floor(Math.random() * 5)+1
    player.gold += gold
    state.createTextEvent("+" + gold, player.position, 'yellow', 100)

    return true;
  }

}