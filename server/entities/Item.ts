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

  getSellPrice() {
    return Math.floor(this.getPrice() / 3);
  }

  getPrice(allowPremium: boolean = true) {
    let price = 0;

    for (let i = 0; i < this.modifiers.length; i++) {

      if (
        this.modifiers[i].attr == "hp" ||
        this.modifiers[i].attr == "mp"
      ) {
        price += this.modifiers[i].modifier * 2;

      } else if (this.modifiers[i].attr == "xp") {
        const num = parseInt(this.type[this.type.length - 1]);
        price += (this.modifiers[i].modifier * 50) - (Math.pow(num, 2) * 70);

      } else if (
        this.modifiers[i].attr == "strength" ||
        this.modifiers[i].attr == "agility" ||
        this.modifiers[i].attr == "intelligence"
      ) {
        price += this.modifiers[i].modifier * 300;

      } else if (this.modifiers[i].attr == "armor") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "damage") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "movementSpeed") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "attackDistance") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "attackSpeed") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "evasion") {
        price += this.modifiers[i].modifier * 200;

      } else if (this.modifiers[i].attr == "criticalStrikeChance") {
        price += this.modifiers[i].modifier * 500;
      }
    }

    return (!this.premium || !allowPremium)
      ? Math.round(price * 100) / 100
      : Math.max(Math.floor(price / 150), 1);
  }

}
