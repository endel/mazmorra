import { Schema, type } from "@colyseus/schema";
import { Unit, InventoryType } from "./Unit";
import helpers from "../../shared/helpers";
import { Item } from "./Item";
import { DBHero } from "../db/Hero";
import { MoveEvent } from "../core/Movement";
import { EquipedItems } from "../core/EquipedItems";
import { EquipableItem } from "./items/EquipableItem";
import { Point } from "../rooms/states/DungeonState";
import { CastableItem } from "./items/CastableItem";
import { Inventory } from "../core/Inventory";
import { generateId } from "colyseus";
import { ConsumableItem } from "./items/ConsumableItem";

export class SkinProperties extends Schema {
  @type("number") klass: number;
  @type("number") hair: number;
  @type("number") hairColor: number;
  @type("number") eye: number;
  @type("number") body: number;
}

export class Player extends Unit {
  @type("string") name: string;
  @type(SkinProperties) properties = new SkinProperties();

  @type("number") gold: number;
  @type("number") diamond: number;

  @type("number") latestProgress: number;
  @type("number") pointsToDistribute: number;

  purchase: Inventory = new Inventory({ capacity: 12 });

  movementSpeed = 600;
  attackSpeed = 900;
  shouldSaveCoords: boolean = false;

  constructor (id, hero: DBHero, state?) {
    super(id, hero, state)
    this.type = helpers.ENTITIES.PLAYER

    this.latestProgress = hero.latestProgress;

    this.name = hero.name
    this.lvl = hero.lvl || 1

    // skin properties
    this.properties.klass = hero.klass;
    this.properties.hair = hero.hair;
    this.properties.hairColor = hero.hairColor;
    this.properties.eye = hero.eye;
    this.properties.body = hero.body;

    this.gold = hero.gold || 0;
    this.diamond = hero.diamond || 0;

    this.pointsToDistribute = hero.pointsToDistribute;

    this.hpRegeneration = 1;
    this.direction = "bottom";
    this.walkable = true;
  }

  getItemByType(type: string) {
    const inventoriesToSearchFor: InventoryType[] = ['inventory', 'quickInventory'];

    let inventoryType;
    let itemId;

    for (let i = 0; i < inventoriesToSearchFor.length; i++) {
      const _inventoryType = inventoriesToSearchFor[i];
      const inventory: Inventory = this[_inventoryType];
      for (const _itemId in inventory.slots) {
        const item: Item = inventory.slots[_itemId];
        if (item.type === type) {
          inventoryType = _inventoryType;
          itemId = _itemId;
          break;
        }
      }
    }

    return { inventoryType, itemId };
  }

  useItem(inventoryType: InventoryType, itemId: string, force: boolean = false) {
    const inventory = this[inventoryType];
    const item: Item = inventory.slots[itemId];

    console.log("useItem:", { inventoryType, itemId, inventory, item });

    // buying items!
    if (item && inventory === this.purchase) {
      return this.inventoryBuy(item);
    }

    if (item && item.use(this, this.state, force)) {
      return inventory.remove(itemId);
    }
  }

  castItem(inventoryType: InventoryType, itemId: string, position: Point) {
    const inventory = this[inventoryType];
    const item: CastableItem = inventory.slots[itemId];

    if (item && item.cast(this, this.state, position)) {
      inventory.remove(itemId);
    }
  }

  distributePoint (attribute: string) {
    if (
      this.pointsToDistribute > 0 &&
      typeof (this.attributes[attribute]) !== undefined
    ) {
      this.attributes[attribute]++;
      this.pointsToDistribute--;
      this.recalculateStatsModifiers();
    }
  }

  setTradingItems(items: Item[]) {
    this.purchase.clear();
    this.purchase.set(items);

    // populate item prices
    for (let itemId in this.purchase.slots) {
      this.purchase.slots[itemId].price = this.purchase.slots[itemId].getPrice();
    }

    this.state.events.emit("send", this, ["trading-items", this.purchase.slots]);
  }

  inventoryDrag(fromInventoryType: InventoryType, toInventoryType: InventoryType, itemId: string, switchItemId: string) {
    const fromInventory = this[fromInventoryType];
    const toInventory = this[toInventoryType]

    const item = fromInventory.getItem(itemId);
    const switchItem = toInventory.getItem(switchItemId);

    // buying items!
    if (fromInventory === this.purchase) {
      return this.inventoryBuy(item, toInventory);
    }

    if (item && switchItem) {
      // @colyseus/schema workaround
      // without workaround: https://github.com/colyseus/schema/issues/26
      if ((toInventory instanceof EquipedItems)) {
        if (item instanceof EquipableItem) {
          // item must be equipable!
          fromInventory.remove(itemId);
          fromInventory.add(switchItem);
          toInventory.add(item, true);
        }

      } else {
        fromInventory.remove(itemId);
        toInventory.remove(switchItemId);

        fromInventory.add(switchItem);
        toInventory.add(item);
      }

    } else if (item && toInventory.hasAvailability()) {
      fromInventory.remove(itemId);
      toInventory.add(item);
    }
  }

  inventorySell(fromInventoryType: InventoryType, itemId: string) {
    const fromInventory = this[fromInventoryType];
    const item = fromInventory.getItem(itemId);

    if (item && fromInventory !== this.purchase) {
      // selling price is half of buying price
      const price = Math.floor(item.getPrice() / 3);
      this.state.createTextEvent("+" + price, this.position, 'yellow', 100);

      this.gold += price;
      fromInventory.remove(itemId);

      // this.state.events.emit('sound', 'buy', this);
    }
  }

  inventoryBuy (item: Item, toInventory?: Inventory) {
    console.log("inventoryBuy!", { item, toInventory });

    if (!toInventory) {
      const toInventoryPriority = (item instanceof ConsumableItem)
        ? [this.quickInventory, this.inventory]
        : [this.inventory, this.quickInventory];

      for (let i=0; i<toInventoryPriority.length; i++) {
        if (toInventoryPriority[i].hasAvailability()) {
          toInventory = toInventoryPriority[i];
          break;
        }
      }
    }

    if (
      toInventory &&
      toInventory.hasAvailability() &&
      this.gold >= item.getPrice()
    ) {
      this.gold -= item.getPrice();

      item.id = generateId();
      toInventory.add(item);

      // this.state.events.emit('sound', 'buy', this);
    }
  }

  drop () {
    if (!this.state) { return; }

    if (this.state.isPVPAllowed) {
      // players will drop a random equipped item, if PVP is allowed.
      this.willDropItem = this.equipedItems.dropRandomItem();
    }
  }

  dropItem(inventoryType: InventoryType, itemId: string) {
    const inventory = this[inventoryType];
    const item: Item = inventory.getItem(itemId)

    // skip when trying to drop from trade
    if (inventory === this.purchase) {
      return;
    }

    if (item && inventory.remove(itemId)) {
      this.state.dropItemFrom(this, item.clone());
    }
  }

}
