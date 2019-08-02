import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";
import { Scroll } from "./items/consumable/Scroll";
import { Key } from "./items/consumable/Key";
import { NUM_LEVELS_PER_CHECKPOINT, MAX_LEVELS } from "../utils/ProgressionConfig";
import { PotionPoints } from "./items/consumable/PotionPoints";
import { ScrollTeleport } from "./items/consumable/ScrollTeleport";
import { HpPotion } from "./items/consumable/HpPotion";
import { MpPotion } from "./items/consumable/MpPotion";
import { XpPotion } from "./items/consumable/XpPotion";

export class NPC extends Player {
  @type("string") kind: string;

  wanderer: boolean = true;
  rotatingMessages?: IterableIterator<string>;

  constructor (kind, npcHero = {}, state?) {
    super(undefined, npcHero as any, state);

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;
  }

  updateMovementSpeed () {
    this.statsModifiers.movementSpeed = -this.state.rand.intBetween(200, 300);
  }

  generateRotatingMessages(messages) {
    if (this.rotatingMessages) { return; }
    this.rotatingMessages = (function*() {
      let i = 0;
      while (true) {
        yield messages[(i++) % messages.length];
      }
    })();
  }

  interact (moveEvent, player: Player, state) {
    moveEvent.cancel();

    this.updateDirection(player.position.x, player.position.y);

    const isLastLevel = (state.progress === MAX_LEVELS);

    /**
     * Tutorial
     */
    if (state.progress !== 1 && !isLastLevel && this.rotatingMessages) {
      state.createTextEvent(this.rotatingMessages.next().value, this.position, 'white', 1000);
      return;
    }
    // end of tutorial!

    if (this.kind === "elder") {
      const items = [];

      const hpPotion = new HpPotion(this.getPotionTierForPlayer(player, 'hp'));
      items.push(hpPotion);

      const mpPotion = new MpPotion(this.getPotionTierForPlayer(player, 'hp'));
      items.push(mpPotion);

      const scroll = new Scroll();
      items.push(scroll);

      const scrollTeleport = new ScrollTeleport();
      items.push(scrollTeleport);

      const pointsPotion = new PotionPoints();
      items.push(pointsPotion);

      player.setTradingItems(items);

    } else if (this.kind === "merchant") {
      const itemDropOptions = {
        progress: this.state.roomUtils.realRand.intBetween(Math.max(1, player.latestProgress - 1), player.latestProgress + 1)
      };

      player.setTradingItems([
        this.state.roomUtils.createArmor(itemDropOptions),
        this.state.roomUtils.createBoot(itemDropOptions),
        this.state.roomUtils.createHelmet(itemDropOptions),
        this.state.roomUtils.createShield(itemDropOptions),
        this.state.roomUtils.createWeapon('strength', itemDropOptions),
        this.state.roomUtils.createWeapon('intelligence', itemDropOptions),
        this.state.roomUtils.createWeapon('agility', itemDropOptions),
      ]);

    } else if (this.kind === "majesty") {
      this.generateRotatingMessages((!isLastLevel) ? [
        `The prophecy is true.`,
        `You've got the gems?`,
        `Demons are amongst us`,
      ] : [
        `What happened?`,
        `I wish things could be different.`,
      ]);

      state.createTextEvent(this.rotatingMessages.next().value, this.position, 'white', 1000);

      setTimeout(() => {
        if (player.removed) { return; }

        const itemDropOptions = {
          progress: (!isLastLevel)
            ? this.state.roomUtils.realRand.intBetween(player.latestProgress, player.latestProgress + NUM_LEVELS_PER_CHECKPOINT)
            : MAX_LEVELS * 1.5,
          isMagical: true,
          isRare: true
        };

        const items = [];

        [
          this.state.roomUtils.createArmor(itemDropOptions),
          this.state.roomUtils.createBoot(itemDropOptions),
          this.state.roomUtils.createHelmet(itemDropOptions),
          this.state.roomUtils.createShield(itemDropOptions),
          this.state.roomUtils.createWeapon('strength', itemDropOptions),
          this.state.roomUtils.createWeapon('intelligence', itemDropOptions),
          this.state.roomUtils.createWeapon('agility', itemDropOptions),
          new XpPotion(1),
          new XpPotion(2),
          new XpPotion(3),
          new XpPotion(4),
        ].forEach(item => {
          item.premium = true;
          items.push(item);
        });

        player.setTradingItems(items);
      }, 1000);

    } else if (this.kind === "locksmith") {
      const items = [
        helpers.ENTITIES.KEY_GRASS,
        helpers.ENTITIES.KEY_ROCK,
        helpers.ENTITIES.KEY_CAVE,
        helpers.ENTITIES.KEY_ICE,
        helpers.ENTITIES.KEY_INFERNO
      ].map(type => {
        const key = new Key();
        key.type = type;
        return key;
      });

      player.setTradingItems(items);

    } else {
      this.generateRotatingMessages((!isLastLevel) ? [
        `PvP is experimental.`,
        `Join the Discord Server for feedback!`,
      ] : [
        `You're awesome!`,
        `Majesty has the best items you can find.`
      ]);

      if (
        !player.equipedItems.slots['left'] ||
        player.equipedItems.slots['left'].damageAttribute !== player.primaryAttribute
      ) {
        const weapons = {
          agility: 'bow',
          intelligence: 'staff',
          strength: 'melee weapon',
        };
        state.createTextEvent(`You need a ${weapons[player.primaryAttribute]}!`, this.position, 'white', 1000);

      } else {
        state.createTextEvent(this.rotatingMessages.next().value, this.position, 'white', 1000);
      }
    }

    // prevent NPC from moving right after talking.
    this.position.lastMove += 500;
  }

  getPotionTierForPlayer(player, attr: 'hp' | 'mp') {
    let tier = 1;

    if (player[attr].max >= 80) {
      tier = 4;

    } else if (player[attr].max >= 50) {
      tier = 3;

    } else if (player[attr].max >= 30) {
      tier = 2;
    }

    return tier;
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
