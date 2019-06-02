import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Item } from "../Item";
import { LifeHeal } from "./consumable/LifeHeal";
import { ManaHeal } from "./consumable/ManaHeal";
import { ShieldItem } from "./equipable/ShieldItem";
import { WeaponItem } from "./equipable/WeaponItem";
import { BootItem } from "./equipable/BootItem";
import { HelmetItem } from "./equipable/HelmetItem";

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

    case helpers.ENTITIES.SWORD:
      item = new WeaponItem();
      item.type = type;
    break;

    case helpers.ENTITIES.BOOTS_REGULAR:
      item = new BootItem();
      item.type = type;
    break;

    case helpers.ENTITIES.HELMET_CAP:
      item = new HelmetItem();
      item.type = type;
    break;

    // // Default
    // default:
    //   item = new Item();
    //   item.type = type;
    //   break;
  }
  console.log(type);

  item.position.set(position);

  return item;
}
