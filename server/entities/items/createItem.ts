import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Item } from "../Item";
import { Potion } from "./consumable/Potion";
import { ShieldItem } from "./equipable/ShieldItem";
import { WeaponItem } from "./equipable/WeaponItem";
import { BootItem } from "./equipable/BootItem";
import { HelmetItem } from "./equipable/HelmetItem";
import { DBItem } from "../../db/Hero";
import { Scroll } from "./consumable/Scroll";
import { ArmorItem } from "./equipable/ArmorItem";
import { Key } from "./consumable/Key";
import { PotionPoints } from "./consumable/PotionPoints";
import { EquipableItem } from "./EquipableItem";
import { ConsumableItem } from "./ConsumableItem";

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

      break;

    case helpers.ENTITIES.POINTS_POTION_1:
    case helpers.ENTITIES.POINTS_POTION_2:
    case helpers.ENTITIES.POINTS_POTION_3:
    case helpers.ENTITIES.POINTS_POTION_4:
      item = new PotionPoints();
      break;

    // Generic consumables
    case helpers.ENTITIES.KEY_CASTLE:
    case helpers.ENTITIES.KEY_ROCK:
    case helpers.ENTITIES.KEY_CAVE:
    case helpers.ENTITIES.KEY_ICE:
    case helpers.ENTITIES.KEY_GRASS:
    case helpers.ENTITIES.KEY_INFERNO:
      item = new Key();
      break;

    case helpers.ENTITIES.SHIELD_1:
    case helpers.ENTITIES.SHIELD_2:
    case helpers.ENTITIES.SHIELD_3:
    case helpers.ENTITIES.SHIELD_4:
    case helpers.ENTITIES.SHIELD_5:
    case helpers.ENTITIES.SHIELD_6:
    case helpers.ENTITIES.SHIELD_7:
    case helpers.ENTITIES.SHIELD_8:
    case helpers.ENTITIES.SHIELD_9:
    case helpers.ENTITIES.SHIELD_10:
    case helpers.ENTITIES.SHIELD_11:
    case helpers.ENTITIES.SHIELD_12:
    case helpers.ENTITIES.SHIELD_13:
    case helpers.ENTITIES.SHIELD_14:
    case helpers.ENTITIES.SHIELD_15:
    case helpers.ENTITIES.SHIELD_16:
    case helpers.ENTITIES.SHIELD_17:
    case helpers.ENTITIES.SHIELD_18:
    case helpers.ENTITIES.SHIELD_19:
    case helpers.ENTITIES.SHIELD_20:
    case helpers.ENTITIES.SHIELD_21:
    case helpers.ENTITIES.SHIELD_22:
      item = new ShieldItem();
    break;

    case helpers.ENTITIES.WEAPON_1:
    case helpers.ENTITIES.WEAPON_2:
    case helpers.ENTITIES.WEAPON_3:
    case helpers.ENTITIES.WEAPON_4:
    case helpers.ENTITIES.WEAPON_5:
    case helpers.ENTITIES.WEAPON_6:
    case helpers.ENTITIES.WEAPON_7:
    case helpers.ENTITIES.WEAPON_8:
    case helpers.ENTITIES.WEAPON_9:
    case helpers.ENTITIES.WEAPON_10:
    case helpers.ENTITIES.BOW_1:
    case helpers.ENTITIES.BOW_2:
    case helpers.ENTITIES.BOW_3:
    case helpers.ENTITIES.BOW_4:
    case helpers.ENTITIES.WAND_1:
    case helpers.ENTITIES.WAND_2:
    case helpers.ENTITIES.WAND_3:
    case helpers.ENTITIES.WAND_4:
      item = new WeaponItem();
      (item as WeaponItem).damageAttribute = (data as DBItem).damageAttribute;
      (item as WeaponItem).manaCost = (data as DBItem).manaCost;
    break;

    case helpers.ENTITIES.BOOTS_1:
    case helpers.ENTITIES.BOOTS_2:
    case helpers.ENTITIES.BOOTS_3:
    case helpers.ENTITIES.BOOTS_4:
    case helpers.ENTITIES.BOOTS_5:
    case helpers.ENTITIES.BOOTS_6:
      item = new BootItem();
    break;

    case helpers.ENTITIES.ARMOR_1:
    case helpers.ENTITIES.ARMOR_2:
    case helpers.ENTITIES.ARMOR_3:
    case helpers.ENTITIES.ARMOR_4:
    case helpers.ENTITIES.ARMOR_5:
    case helpers.ENTITIES.ARMOR_6:
      item = new ArmorItem();
    break;

    case helpers.ENTITIES.HELMET_1:
    case helpers.ENTITIES.HELMET_2:
    case helpers.ENTITIES.HELMET_3:
    case helpers.ENTITIES.HELMET_4:
    case helpers.ENTITIES.HELMET_5:
    case helpers.ENTITIES.HELMET_6:
    case helpers.ENTITIES.HELMET_7:
    case helpers.ENTITIES.HELMET_8:
    case helpers.ENTITIES.HELMET_9:
    case helpers.ENTITIES.HELMET_10:
    case helpers.ENTITIES.HELMET_11:
    case helpers.ENTITIES.HELMET_12:
    case helpers.ENTITIES.HELMET_13:
    case helpers.ENTITIES.HELMET_14:
    case helpers.ENTITIES.HELMET_15:
    case helpers.ENTITIES.HELMET_16:
    case helpers.ENTITIES.HELMET_17:
    case helpers.ENTITIES.HELMET_18:
    case helpers.ENTITIES.HELMET_19:
    case helpers.ENTITIES.HELMET_20:
    case helpers.ENTITIES.HELMET_21:
    case helpers.ENTITIES.HELMET_22:
    case helpers.ENTITIES.HELMET_23:
    case helpers.ENTITIES.HELMET_24:
    case helpers.ENTITIES.HELMET_25:
    case helpers.ENTITIES.HELMET_26:
    case helpers.ENTITIES.HELMET_27:
    case helpers.ENTITIES.HELMET_28:
    case helpers.ENTITIES.HELMET_29:
    case helpers.ENTITIES.HELMET_30:
    case helpers.ENTITIES.HELMET_31:
    case helpers.ENTITIES.HELMET_32:
    case helpers.ENTITIES.HELMET_33:
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

  if (data.premium) { item.premium = data.premium; }
  if (data.isRare) { item.isRare = data.isRare; }
  if (data.isMagical) { item.isMagical = data.isMagical; }

  if ((data as EquipableItem).progressRequired) {
    (item as EquipableItem).progressRequired = (data as EquipableItem).progressRequired;
  }

  if (item instanceof ConsumableItem) {
    item.qty = (data as DBItem).qty || 1;
  }

  item.type = data.type;
  item.position.set(position);

  return item;
}
