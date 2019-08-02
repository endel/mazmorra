import helpers from "../../../../shared/helpers";
import { ConsumableItem } from "../ConsumableItem";

const ATTRIBUTE = "mp";
const POTION_1_MODIFIER = 15;
const POTION_2_MODIFIER = 30;
const POTION_3_MODIFIER = 50;
const POTION_4_MODIFIER = 80;

export class MpPotion extends ConsumableItem {

  constructor (tier: number = 1) {
    super();

    switch (tier) {
      case 1:
        this.type = helpers.ENTITIES.MP_POTION_1;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_1_MODIFIER });
        break;
      case 2:
        this.type = helpers.ENTITIES.MP_POTION_2;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_2_MODIFIER });
        break;
      case 3:
        this.type = helpers.ENTITIES.MP_POTION_3;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_3_MODIFIER });
        break;
      case 4:
        this.type = helpers.ENTITIES.MP_POTION_4;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_4_MODIFIER });
        break;
    }
  }

  use(player, state) {
    const shouldBeRemovedFromInventory = super.use(player, state);

    const amount = this.modifiers[0].modifier;
    player[ATTRIBUTE].increment(amount);

    state.createTextEvent(`+ ${amount} ${ATTRIBUTE}`, player.position, "blue", 100);
    state.events.emit("sound", "potion", player);

    return shouldBeRemovedFromInventory;
  }

}
