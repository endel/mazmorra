import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Item } from "../Item";
import { LifeHeal } from "./consumable/LifeHeal";
import { ManaHeal } from "./consumable/ManaHeal";
import { ShieldItem } from "./equipable/ShieldItem";
import { WeaponItem } from "./equipable/WeaponItem";
import { BootItem } from "./equipable/BootItem";
import { HelmetItem } from "./equipable/HelmetItem";
import { DBItem } from "../../db/Hero";

export function createItem(data: Item | DBItem, position?: Point): Item {
  let item: Item;

  switch (data.type) {
    // Consumables
    case helpers.ENTITIES.LIFE_HEAL: item = new LifeHeal(); break;
    case helpers.ENTITIES.LIFE_POTION: item = new LifeHeal(); break;
    case helpers.ENTITIES.MANA_HEAL: item = new ManaHeal(); break;
    case helpers.ENTITIES.MANA_POTION: item = new ManaHeal(); break;

    case helpers.ENTITIES.SHIELD_WOOD:
      item = new ShieldItem();
      item.type = data.type;
    break;

    case helpers.ENTITIES.SWORD:
      item = new WeaponItem();
      item.type = data.type;
    break;

    case helpers.ENTITIES.BOOTS_REGULAR:
      item = new BootItem();
      item.type = data.type;
    break;

    case helpers.ENTITIES.HELMET_CAP:
      item = new HelmetItem();
      item.type = data.type;
    break;

    // // Default
    // default:
    //   item = new Item();
    //   item.type = type;
    //   break;
  }

  /**
   * Assign item modifiers
   */
  if ('modifiers' in data) {
    data.modifiers.forEach(modifier => {
      item.addModifier(modifier);
    });
  }

  item.position.set(position);

  return item;
}
