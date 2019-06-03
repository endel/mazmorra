import helpers from "../../../../shared/helpers";
import { ConsumableItem } from "../ConsumableItem";

export class ManaHeal extends ConsumableItem {

  constructor () {
    super()
    this.type = helpers.ENTITIES.MANA_HEAL;

    this.addModifier({
      attr: "mp",
      modifier: 15
    })
  }

  use(player, state) {
    const heal = this.modifiers[0].modifier;
    player.mp.current += heal;
    state.createTextEvent("+" + heal, player.position, 'blue', 100);
    state.events.emit("sound", "potion", player);
    return true;
  }

}
