import { Item } from "../Item";
import { Player } from "../Player";
import { type, MapSchema } from "@colyseus/schema";

const MAX_ITEM_STACK = 9;

export class ConsumableItem extends Item {
  @type("number") qty: number = 1;

  use(player, state, force: boolean = false) {
    this.qty -= 1;

    // return true if ConsumableItem should be removed from Inventory
    return this.qty <= 0;
  }

  getSameItemToIncrement(slots: MapSchema, combineWith?: ConsumableItem) {
    const qtyToAdd = (combineWith && combineWith.qty) || 1;
    return Array.from(slots.values()).find((item) => {
      if (
        item.type === this.type &&
        item.qty + qtyToAdd <= MAX_ITEM_STACK
      ) {
        return item;
      }
    });
  }

  incrementQtyFromSlots(slots, combineWith?: ConsumableItem) {
    const itemToIncrement = this.getSameItemToIncrement(slots, combineWith);

    if (itemToIncrement) {
      itemToIncrement.qty += this.qty;
      return true;
    }

    return false;
  }

  pick (player: Player, state) {
    let success: boolean = this.incrementQtyFromSlots(player.inventory.slots, this);

    if (!success && player.inventory.hasAvailability()) {
      success = player.inventory.add(this);
    }

    if (success) {
      state.events.emit("sound", "pickItem", player);
    }

    return success;
  }

  getPrice() {
    return super.getPrice() * this.qty;
  }

}
