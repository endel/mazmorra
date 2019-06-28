import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";
import { Potion, POTION_1_MODIFIER, POTION_2_MODIFIER, POTION_4_MODIFIER, POTION_3_MODIFIER } from "./items/consumable/Potion";
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

      player.setTradingItems(items);

    } else if (this.kind === "merchant") {
      player.setTradingItems([
        this.state.roomUtils.createArmor({ progress: player.latestProgress }),
        this.state.roomUtils.createBoot({ progress: player.latestProgress }),
        this.state.roomUtils.createHelmet({ progress: player.latestProgress }),
        this.state.roomUtils.createShield({ progress: player.latestProgress }),
        this.state.roomUtils.createWeapon(player.primaryAttribute, { progress: player.latestProgress }),
      ]);

    } else if (this.kind === "majesty") {
      const genericMessages = [
        "I've got you a deal.",
        `Bring me something special!`,
        `The prophecy is true.`,
        `Demons are amongst us`,
      ];
      state.createTextEvent(genericMessages[Math.floor(Math.random() * genericMessages.length)], this.position, 'white', 1000);

      setTimeout(() => {
        const itemDropOptions = {
          progress: 500,
          isMagical: true,
          isRare: true
        };

        const items = [];

        const potion1 = new Potion();
        potion1.addModifier({ attr: "xp", modifier: POTION_1_MODIFIER });
        items.push(potion1);

        [
          this.state.roomUtils.createArmor(itemDropOptions),
          this.state.roomUtils.createBoot(itemDropOptions),
          this.state.roomUtils.createHelmet(itemDropOptions),
          this.state.roomUtils.createShield(itemDropOptions),
          this.state.roomUtils.createWeapon(player.primaryAttribute, itemDropOptions),
        ].forEach(item => {
          item.premium = true;
          items.push(item);
        });

        player.setTradingItems(items);
      }, 1000);

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

  getPotionModifierForPlayer(player) {
    let modifier = POTION_1_MODIFIER;

    if (player.hp > 180) {
      modifier = POTION_4_MODIFIER;

    } else if (player.hp > 110) {
      modifier = POTION_3_MODIFIER;

    } else if (player.hp > 50) {
      modifier = POTION_2_MODIFIER;
    }

    return modifier;
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
