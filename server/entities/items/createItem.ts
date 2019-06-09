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

export function createItem(data: Item | DBItem, position?: Point): Item {
  let item: Item;

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
      item.type = data.type;
      break;

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
