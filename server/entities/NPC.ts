import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";
import { Potion, POTION_1_MODIFIER, POTION_2_MODIFIER } from "./items/consumable/Potion";
import { Scroll } from "./items/consumable/Scroll";

export class NPC extends Player {
  @type("string") kind: string;
  wanderer: boolean = true;

  constructor (kind, npcHero = {}, state?) {
    super(undefined, npcHero as any, state);

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;

    this.walkable = false;
  }

  updateMovementSpeed () {
    this.statsModifiers.movementSpeed = -this.state.rand.intBetween(200, 300);
  }

  interact (moveEvent, player: Player, state) {
    moveEvent.cancel();

    this.updateDirection(player.position.x, player.position.y);

    if (this.kind === "elder") {
      const items = [];

      const hpPotion = new Potion();
      hpPotion.addModifier({ attr: "hp", modifier: POTION_1_MODIFIER });
      items.push(hpPotion);

      const mpPotion = new Potion();
      mpPotion.addModifier({ attr: "mp", modifier: POTION_1_MODIFIER });
      items.push(mpPotion);

      const scroll = new Scroll();
      items.push(scroll);

      player.purchase.clear();
      player.purchase.set(items);

      // populate item prices
      for (let itemId in player.purchase.slots) {
        player.purchase.slots[itemId].price = player.purchase.slots[itemId].getPrice();
      }

      state.events.emit("send", player, ["trading-items", player.purchase.slots]);

    } else if (this.kind === "merchant") {
      const items = [
        this.state.roomUtils.createArmor(),
        this.state.roomUtils.createBoot(),
        this.state.roomUtils.createHelmet(),
        this.state.roomUtils.createShield(),
        this.state.roomUtils.createWeapon(player.primaryAttribute),
      ];

      player.purchase.clear();
      player.purchase.set(items);

      // populate item prices
      for (let itemId in player.purchase.slots) {
        player.purchase.slots[itemId].price = player.purchase.slots[itemId].getPrice();
      }

      state.events.emit("send", player, ["trading-items", player.purchase.slots]);

    } else if (this.kind === "majesty") {
      if (this.state.rand.intBetween(0, 5) === 0) {
        state.createTextEvent("I've got you a deal.", this.position, 'white', 1000);

        setTimeout(() => {
          const items = [];

          const potion = new Potion();
          potion.addModifier({ attr: "xp", modifier: POTION_2_MODIFIER });
          items.push(potion);

          player.purchase.clear();
          player.purchase.set(items);

          // populate item prices
          for (let itemId in player.purchase.slots) {
            player.purchase.slots[itemId].price = 500;
          }

          state.events.emit("send", player, ["trading-items", player.purchase.slots]);
        }, 1000);

      } else {
        const genericMessages = [
          `Bring me something special!`,
          `The prophecy is true.`,
          `Demons are amongst us`,
        ];
        state.createTextEvent(genericMessages[Math.floor(Math.random() * genericMessages.length)], this.position, 'white', 1000);

      }

    } else {
      const genericMessages = [
        `Hello traveler`,
        `Take care out there`,
        `Be safe!`,
        `You gotta be stronger than them`,
        `Save us from their curse!`,
        `We believe in your ${player.primaryAttribute}`
      ]
      state.createTextEvent(genericMessages[Math.floor(Math.random() * genericMessages.length)], this.position, 'white', 1000);
    }

    // prevent NPC from moving right after talking.
    this.position.lastMove += 500;
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.position.pending.length === 0 && this.wanderer) {
      this.updateMovementSpeed();
      const nextPosition = this.state.roomUtils.getRandomPosition();

      // NPC's shouldn't walk over each other.
      if (!this.state.gridUtils.getEntityAt(nextPosition.x, nextPosition.y)) {
        this.state.move(this, nextPosition);
      }
    }
  }

}
