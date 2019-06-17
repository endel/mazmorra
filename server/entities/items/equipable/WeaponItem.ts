import { type } from "@colyseus/schema";
import { EquipableItem } from "../EquipableItem";
import { EquipmentSlot } from "../../../core/EquipmentSlot";
import { Attribute } from "../../Unit";

export class WeaponItem extends EquipableItem {
  @type("string") damageAttribute: Attribute;
  @type("number") manaCost: number;

  slotName = EquipmentSlot.LEFT;
}
