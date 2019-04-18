import { Schema, type, MapSchema } from "@colyseus/schema";
import { Item } from "../entities/Item";

interface InventoryOptions {
  capacity?: number;
}

export class Inventory extends Schema {
  @type({ map: Item })
  slots = new MapSchema<Item>();

  @type("number")
  capacity: number;

  constructor (options: InventoryOptions = {}, items?: any) {
    super();

    this.capacity = options.capacity || 4

    if (items) {
      this.set(items)
    }
  }

  set (items: any) {
    for (let i=0; i<items.length; i++) {
      // TODO: fix position
      this.add(new Item(items[i].type, { x: i, y: 0 }))
    }
  }

  add (item) {
    let success = this.hasAvailability()

    if (this.hasAvailability()) {
      this.slots[ item.id ] = item
    }

    return success
  }

  hasAvailability () {
    return Object.keys( this.slots ).length < this.capacity
  }

}
