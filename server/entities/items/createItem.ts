import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Item } from "../Item";
import { LifeHeal } from "./LifeHeal";
import { ManaHeal } from "./ManaHeal";
import { ShieldItem } from "./ShieldItem";

export function createItem(type: string, position?: Point): Item {
  let item: Item;

  switch (type) {
    // Consumables
    case helpers.ENTITIES.LIFE_HEAL: item = new LifeHeal(); break;
    case helpers.ENTITIES.LIFE_POTION: item = new LifeHeal(); break;
    case helpers.ENTITIES.MANA_HEAL: item = new ManaHeal(); break;
    case helpers.ENTITIES.MANA_POTION: item = new ManaHeal(); break;

    case helpers.ENTITIES.SHIELD_WOOD:
      item = new ShieldItem();
      item.type = type;
    break;

    // // Default
    // default:
    //   item = new Item();
    //   item.type = type;
    //   break;
  }

  item.position.set(position);

  return item;
}
