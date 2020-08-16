import assert from "assert";
import { Reflection } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Hero, DBHero } from "../db/Hero";
import { HpPotion } from "../entities/items/consumable/HpPotion";
import { Player } from "../entities/Player";
import { NPC } from "../entities/NPC";
import { ConsumableItem } from "../entities/items/ConsumableItem";
import { Enemy } from "../entities/Enemy";

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

  it("should not fail creating multiple BattleAction's between patches", () => {
    const state = new DungeonState(30, "hello", 'dungeon');
    const player = state.createPlayer(
      { sessionId: "player" },
      { gold: 100000 } as DBHero,
      {}
    );

    const bow = state.roomUtils.createWeapon("agility", { goodness: 1, progress: 30, isMagical: true, isRare: true });
    player.attributes.agility = 999;
    player.statsModifiers.attackDistance = 999;
    player.statsModifiers.attackSpeed = 2000;
    player.primaryAttribute = "agility";
    player.equipedItems.add(bow);

    const decodedState = Reflection.decode<DungeonState>(Reflection.encode(state));
    decodedState.decode(state.encodeAll());

    const enemies = Array.from(state.entities.values()).filter(entity => entity instanceof Enemy);

    console.log("NUM ENEMIES:", enemies.length)

    let now = 0;
    state.update(now);

    player.useSkill('attack-speed');

    for (let i = 0; i < enemies.length; i++) {
      console.log("Auto attack!", i, enemies[i].position.toJSON());
      player.autoAttack(enemies[i].position);

      now += 50;
      state.update(now);

      decodedState.decode(state.encode());
    }
  });

});
