import helpers from "../../../shared/helpers";
import { ConsumableItem } from "./ConsumableItem";

export class ManaHeal extends ConsumableItem {

  constructor () {
    super()
    this.type = helpers.ENTITIES.MANA_HEAL;
  }

  use(player, state) {
    let heal = Math.floor(Math.random() * 10) + 10;
    player.mp.current += heal;
    state.createTextEvent("+" + heal, player.position, 'blue', 100);
    state.events.emit("sound", "potion", player);
    return true;
  }

}
