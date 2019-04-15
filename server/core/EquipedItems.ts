import { Inventory } from "./Inventory";

export class EquipedItems extends Inventory {

  constructor () {
    super({ capacity: 5 })
  }

  add (item) {
    return super.add(item)
  }

}
