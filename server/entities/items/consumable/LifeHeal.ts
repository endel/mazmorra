import { ConsumableItem } from "../ConsumableItem";
import helpers from "../../../../shared/helpers";

export class LifeHeal extends ConsumableItem {

  constructor () {
    super();
    this.type = helpers.ENTITIES.LIFE_HEAL;

    this.addModifier({
      attr: "hp",
      modifier: 15
    })
  }

  use(player, state) {
    const heal = this.modifiers[0].modifier;
    player.hp.current += heal;
    state.createTextEvent("+" + heal, player.position, 'red', 100);
    state.events.emit("sound", "potion", player);
    return true;
  }

}
