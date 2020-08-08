import assert from "assert";
import { Reflection } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Hero, DBHero } from "../db/Hero";
import { HpPotion } from "../entities/items/consumable/HpPotion";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { ConsumableItem } from "../entities/items/ConsumableItem";

describe("Schema Edge Cases", () => {

  it("purchase consumable items (add qty)", () => {
    const state = new DungeonState(1, "hello", 'dungeon');
    const player = state.createPlayer(
      { sessionId: "player" },
      { gold: 100000 } as DBHero,
      {}
    );

    const decodedState = Reflection.decode<DungeonState>(Reflection.encode(state));
    decodedState.decode(state.encodeAll());

    const elder = Array.from(state.entities.values()).find(entity => (entity as NPC).kind === "elder") as NPC;
    elder.interact({ cancel: () => { } }, player, state);

    for (let i = 0; i <= 10; i++) {
      const hpPotion = Array.from(player.purchase.slots.values())[0] as HpPotion;
      player.inventoryBuy(hpPotion, player.inventory);
      decodedState.decode(state.encode());
    }

    const decodedPlayer = decodedState.entities.get("player") as Player;
    const items = Array.from(decodedPlayer.inventory.slots.values()) as ConsumableItem[];
    assert.equal(9, items[0].qty);
    assert.equal(2, items[1].qty);
  });

});
