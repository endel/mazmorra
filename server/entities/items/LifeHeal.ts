import { ConsumableItem } from "./ConsumableItem";
import helpers from "../../../shared/helpers";

export class LifeHeal extends ConsumableItem {

  constructor () {
    super();
    this.type = helpers.ENTITIES.LIFE_HEAL;
  }

  consume(player, state) {
    let heal = Math.floor(Math.random() * 10) + 10;
    player.hp.current += heal;
    state.createTextEvent("+" + heal, player.position, 'red', 100);
  }

}
