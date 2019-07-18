import { ConsumableItem } from "../ConsumableItem";
import helpers from "../../../../shared/helpers";
import { DBAttributeModifier } from "../../../db/Hero";
import { Bar } from "../../../core/Bar";

export const POTION_1_MODIFIER = 15;
export const POTION_2_MODIFIER = 30;
export const POTION_3_MODIFIER = 50;
export const POTION_4_MODIFIER = 80;

export class Potion extends ConsumableItem {

  constructor () {
    super();
  }

  addModifier(modifier: DBAttributeModifier) {
    if (modifier.attr == "hp") {

      if (modifier.modifier <= POTION_1_MODIFIER) {
        this.type = helpers.ENTITIES.HP_POTION_1;

      } else if (modifier.modifier <= POTION_2_MODIFIER) {
        this.type = helpers.ENTITIES.HP_POTION_2;

      } else if (modifier.modifier <= POTION_3_MODIFIER) {
        this.type = helpers.ENTITIES.HP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.HP_POTION_4;
      }

    } else if (modifier.attr == "mp") {
      if (modifier.modifier <= POTION_1_MODIFIER) {
        this.type = helpers.ENTITIES.MP_POTION_1;

      } else if (modifier.modifier <= POTION_2_MODIFIER) {
        this.type = helpers.ENTITIES.MP_POTION_2;

      } else if (modifier.modifier <= POTION_3_MODIFIER) {
        this.type = helpers.ENTITIES.MP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.MP_POTION_4;
      }

    } else if (modifier.attr == "xp") {
      this.premium = true;

      if (modifier.modifier <= POTION_1_MODIFIER) {
        this.type = helpers.ENTITIES.XP_POTION_1;

      } else if (modifier.modifier <= POTION_2_MODIFIER) {
        this.type = helpers.ENTITIES.XP_POTION_2;

      } else if (modifier.modifier <= POTION_3_MODIFIER) {
        this.type = helpers.ENTITIES.XP_POTION_3;

      } else {
        this.type = helpers.ENTITIES.XP_POTION_4;
      }

    } else {
      this.type = helpers.ENTITIES.ELIXIR_POTION_1;
    }

    super.addModifier(modifier);
  }

  use(player, state) {
    const shouldBeRemovedFromInventory = super.use(player, state);

    const attr = this.modifiers[0].attr;
    const amount = this.modifiers[0].modifier;

    const COLORS = {
      "hp": "red",
      "mp": "blue",
      "xp": "white"
    };

    if (player[attr] instanceof Bar) {
      (player[attr] as Bar).increment(amount);
    }

    state.createTextEvent(`+ ${amount} ${attr}`, player.position, COLORS[attr], 100);
    state.events.emit("sound", "potion", player);

    return shouldBeRemovedFromInventory;
  }

}
