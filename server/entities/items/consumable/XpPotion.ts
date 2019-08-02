import helpers from "../../../../shared/helpers";
import { ConsumableItem } from "../ConsumableItem";

const ATTRIBUTE = "xp";
const POTION_1_MODIFIER = 75;
const POTION_2_MODIFIER = 150;
const POTION_3_MODIFIER = 300;
const POTION_4_MODIFIER = 600;

export class XpPotion extends ConsumableItem {

  constructor (tier: number = 1) {
    super();

    this.premium = true;

    switch (tier) {
      case 1:
        this.type = helpers.ENTITIES.XP_POTION_1;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_1_MODIFIER });
        break;
      case 2:
        this.type = helpers.ENTITIES.XP_POTION_2;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_2_MODIFIER });
        break;
      case 3:
        this.type = helpers.ENTITIES.XP_POTION_3;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_3_MODIFIER });
        break;
      case 4:
        this.type = helpers.ENTITIES.XP_POTION_4;
        this.addModifier({ attr: ATTRIBUTE, modifier: POTION_4_MODIFIER });
        break;
    }
  }

  use(player, state) {
    const shouldBeRemovedFromInventory = super.use(player, state);

    const amount = this.modifiers[0].modifier;
    player[ATTRIBUTE].increment(amount);

    state.createTextEvent(`+ ${amount} ${ATTRIBUTE}`, player.position, "white", 100);
    state.events.emit("sound", "potion", player);

    return shouldBeRemovedFromInventory;
  }

}
