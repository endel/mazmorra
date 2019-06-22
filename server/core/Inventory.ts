import { Schema, type, MapSchema } from "@colyseus/schema";
import { Item } from "../entities/Item";
import { createItem } from "../entities/items/createItem";
import { DBItem } from "../db/Hero";

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

  clear() {
    for (let id in this.slots) {
      delete this.slots[id];
    }
  }

  set (items: Item[] | DBItem[]) {
    for (let i=0; i<items.length; i++) {
      // TODO: fix position
      this.add(createItem(items[i], { x: i, y: 0 }));
    }
  }

  add (item: Item) {
    const hasAvailability = this.hasAvailability();

    if (hasAvailability) {
      this.slots[item.id] = item.clone();
    }

    return hasAvailability;
  }

  getItem(itemId: string) {
    return this.slots[itemId];
  }

  remove(itemId: string) {
    if (this.slots[itemId]) {
      delete this.slots[itemId];
      return true;
    }
    return false;
  }

  hasAvailability () {
    return Object.keys(this.slots).length < this.capacity;
  }

}
