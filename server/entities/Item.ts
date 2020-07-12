import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { DungeonState } from "../rooms/states/DungeonState";
import { Unit, StatsModifiers } from "./Unit";
import { DBAttributeModifier } from "../db/Hero";

export class ItemModifier extends Schema {
  @type("string") attr: keyof StatsModifiers;
  @type("number") modifier: number;
}

export abstract class Item extends Entity {
  @type([ItemModifier]) modifiers: ArraySchema<ItemModifier> = new ArraySchema<ItemModifier>();
  walkable = true;

  @type("number") price: number;

  @type("boolean") premium: boolean;
  @type("boolean") isRare = false;
  @type("boolean") isMagical = false;

  constructor () {
    super()
  }

  abstract use(player: Unit, state: DungeonState, force?:boolean): boolean;

  pick (unit: Unit, state: DungeonState) {
    const success = unit.inventory.add(this);

    if (success) {
      state.events.emit("sound", "pickItem", unit);
    }

    return success
  }

  addModifier(modifier: DBAttributeModifier) {
    const mod = new ItemModifier();
    mod.attr = modifier.attr;
    mod.modifier = modifier.modifier;
    this.modifiers.push(mod);
  }

  getModifier(attr: keyof StatsModifiers) {
    return this.modifiers.find(modifier => modifier.attr === attr);
  }

  getSellPrice() {
    return (this.premium)
      ? Math.floor(this.getPrice() / 12) // premium items should be real cheap when selling
      : Math.floor(this.getPrice() / 8);
  }

  getPrice(allowPremium: boolean = true) {
    let price = 0;

    this.modifiers.forEach((modifier, i) => {
      if (
        modifier.attr == "hp" ||
        modifier.attr == "mp"
      ) {
        price += modifier.modifier * 2;

      } else if (modifier.attr == "xp") {
        const tier = parseInt(this.type[this.type.length - 1]) - 1;
        price += (modifier.modifier * 50) - ((tier * tier) * 200);

      } else if (
        modifier.attr == "strength" ||
        modifier.attr == "agility" ||
        modifier.attr == "intelligence"
      ) {
        price += modifier.modifier * 500;

      } else if (modifier.attr == "armor") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "damage") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "movementSpeed") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "attackDistance") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "attackSpeed") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "evasion") {
        price += modifier.modifier * 400;

      } else if (modifier.attr == "criticalStrikeChance") {
        price += modifier.modifier * 600;
      }
    });

    return (!this.premium || !allowPremium)
      ? Math.round(price * 10) / 10
      : Math.max(Math.floor(price / 150), 1);
  }

}
