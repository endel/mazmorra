import helpers from "../../../../shared/helpers";
import { ConsumableItem } from "../ConsumableItem";
import { POTION_1_MODIFIER, POTION_2_MODIFIER, POTION_3_MODIFIER, POTION_4_MODIFIER } from "./Potion";

const ATTRIBUTE = "hp";

export class HpPotion extends ConsumableItem {

  constructor (tier: number = 1) {
    super();

    switch (tier) {
      case 1:
        this.type = helpers.ENTITIES.HP_POTION_1;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_1_MODIFIER });
        break;
      case 2:
        this.type = helpers.ENTITIES.HP_POTION_2;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_2_MODIFIER });
        break;
      case 3:
        this.type = helpers.ENTITIES.HP_POTION_3;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_3_MODIFIER });
        break;
      case 4:
        this.type = helpers.ENTITIES.HP_POTION_4;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_4_MODIFIER });
        break;
    }
  }

  use(player, state) {
    const shouldBeRemovedFromInventory = super.use(player, state);

    const amount = this.modifiers[0].modifier;
    player[ATTRIBUTE].increment(amount);

    state.createTextEvent(`+ ${amount} ${ATTRIBUTE}`, player.position, "red", 100);
    state.events.emit("sound", "potion", player);

    return shouldBeRemovedFromInventory;
  }

}
