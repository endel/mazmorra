import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Item } from "../Item";
import { Potion } from "./consumable/Potion";
import { ShieldItem } from "./equipable/ShieldItem";
import { WeaponItem } from "./equipable/WeaponItem";
import { BootItem } from "./equipable/BootItem";
import { HelmetItem } from "./equipable/HelmetItem";
import { DBItem } from "../../db/Hero";
import { EquipableItem } from "./EquipableItem";
import { Scroll } from "./consumable/Scroll";

export function createItem(data: Item | DBItem, position?: Point): Item {
  let item: Item;

  console.log("createItem: ", data.type);

  switch (data.type) {
    // Consumables
    case helpers.ENTITIES.HP_POTION_1:
    case helpers.ENTITIES.HP_POTION_2:
    case helpers.ENTITIES.HP_POTION_3:
    case helpers.ENTITIES.HP_POTION_4:
    case helpers.ENTITIES.MP_POTION_1:
    case helpers.ENTITIES.MP_POTION_2:
    case helpers.ENTITIES.MP_POTION_3:
    case helpers.ENTITIES.MP_POTION_4:
    case helpers.ENTITIES.XP_POTION_1:
    case helpers.ENTITIES.XP_POTION_2:
    case helpers.ENTITIES.XP_POTION_3:
    case helpers.ENTITIES.XP_POTION_4:
    case helpers.ENTITIES.ELIXIR_POTION_1:
    case helpers.ENTITIES.ELIXIR_POTION_2:
    case helpers.ENTITIES.ELIXIR_POTION_3:
    case helpers.ENTITIES.ELIXIR_POTION_4:
      item = new Potion();
      break;

    case helpers.ENTITIES.SHIELD_WOOD:
      item = new ShieldItem();
    break;

    case helpers.ENTITIES.SWORD:
      item = new WeaponItem();
    break;

    case helpers.ENTITIES.BOOTS_REGULAR:
      item = new BootItem();
    break;

    case helpers.ENTITIES.HELMET_CAP:
      item = new HelmetItem();
    break;

    case helpers.ENTITIES.SCROLL:
      item = new Scroll();
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

  item.type = data.type;
  item.position.set(position);

  return item;
}
