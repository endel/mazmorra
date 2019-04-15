import { Item } from "../Item";
import helpers from "../../../shared/helpers";

export class ManaHeal extends Item {

  constructor (position) {
    super(helpers.ENTITIES.LIFE_HEAL, position)
  }

  pick (player, state) {
    let heal = Math.floor(Math.random() * 10)+10
    player.mp.current += heal
    state.createTextEvent("+" + heal, player.position, 'blue', 100)

    return true;
  }

}
