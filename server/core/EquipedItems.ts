import { Inventory } from "./Inventory";
import { EquipableItem } from "../entities/items/EquipableItem";

export type EquipedPosition = 'head' | 'body' | 'left' | 'right' | 'boot'

export class EquipedItems extends Inventory {

  constructor () {
    super({ capacity: 5 })
  }

  hasHead() {
    return !!this.slots['head'];
  }

  hasBody() {
    return !!this.slots['body'];
  }

  hasLeft() {
    return !!this.slots['left'];
  }

  hasRight() {
    return !!this.slots['right'];
  }

  hasBoot() {
    return !!this.slots['boot'];
  }

  equip(position: EquipedPosition, item: EquipableItem) {

  }

}
