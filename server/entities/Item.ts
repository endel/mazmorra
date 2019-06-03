import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { DungeonState } from "../rooms/states/DungeonState";
import { Unit } from "./Unit";
import { DBAttributeModifier } from "../db/Hero";

export class ItemModifier extends Schema {
  @type("string") attr: string;
  @type("number") modifier: number;
}

export abstract class Item extends Entity {
  @type([ItemModifier]) modifiers: ArraySchema<ItemModifier> = new ArraySchema<ItemModifier>();

  constructor () {
    super()
  }

  abstract use(player: Unit, state: DungeonState): boolean;

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

}
