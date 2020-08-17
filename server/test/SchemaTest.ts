import assert from "assert";
import { Reflection } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Hero, DBHero } from "../db/Hero";
import { HpPotion } from "../entities/items/consumable/HpPotion";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { ConsumableItem } from "../entities/items/ConsumableItem";
import { Enemy } from "../entities/Enemy";
import { Unit } from "../entities/Unit";

describe("Schema Edge Cases", () => {

  xit("purchase consumable items (add qty)", () => {
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

  describe("refId not found", () => {
    const originalGetAttackSpeed = Unit.prototype.getAttackSpeed;

    before(() => Unit.prototype.getAttackSpeed = function () { return 0; });
    after(() => Unit.prototype.getAttackSpeed = originalGetAttackSpeed);

    it("should not fail creating multiple BattleAction's between patches", () => {
      const state = new DungeonState(3, "hello", 'dungeon');
      const player = state.createPlayer(
        { sessionId: "player" },
        { gold: 100000 } as DBHero,
        {}
      );

      const weapon = state.roomUtils.createWeapon("strength", { goodness: 1, progress: 30, isMagical: true, isRare: true });
      player.attributes.strength = 999;
      player.attributes.agility = 8;
      player.primaryAttribute = "strength";
      player.equipedItems.add(weapon);

      const decodedState = Reflection.decode<DungeonState>(Reflection.encode(state));
      decodedState.decode(state.encodeAll());

      const enemies = Array.from(state.entities.values()).filter(entity => entity instanceof Enemy);

      let now = Date.now();
      state.update(now);

      for (let i = 0; i < enemies.length; i++) {
        enemies[i].position.set(player.position);
        (enemies[i] as Enemy).attack(player);
        player.attack(enemies[i]);

        console.log("ENCODE/DECODE", { i });
        decodedState.decode(state.encode());

        now += 50;
        console.log("UPDATE!");
        state.update(now);
      }
    });

  });

});
