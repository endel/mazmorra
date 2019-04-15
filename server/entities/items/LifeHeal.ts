import { Item } from "../Item";
import helpers from "../../../shared/helpers";

export class LifeHeal extends Item {

  constructor (position) {
    super(helpers.ENTITIES.LIFE_HEAL, position)
  }

  pick (player, state) {
    let heal = Math.floor(Math.random() * 10) + 10
    player.hp.current += heal
    state.createTextEvent("+" + heal, player.position, 'red', 100)

    return true;
  }

}
