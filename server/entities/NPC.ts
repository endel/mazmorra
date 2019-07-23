import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";
import { Potion, POTION_1_MODIFIER, POTION_2_MODIFIER, POTION_4_MODIFIER, POTION_3_MODIFIER } from "./items/consumable/Potion";
import { Scroll } from "./items/consumable/Scroll";
import { Key } from "./items/consumable/Key";
import { NUM_LEVELS_PER_CHECKPOINT, MAX_LEVELS } from "../utils/ProgressionConfig";
import { PotionPoints } from "./items/consumable/PotionPoints";

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
    if (state.progress !== 1 && !isLastLevel) {
      if (this.kind === "warrior-woman") {
        if (state.progress < NUM_LEVELS_PER_CHECKPOINT - 1) {
          this.generateRotatingMessages([
            `First ${NUM_LEVELS_PER_CHECKPOINT - 1} stages are alone`,
            `Gain XP by killing mobs`,
            `Open chests for loot`,
            `Kill enemies for loot`,
          ]);
          state.createTextEvent(this.rotatingMessages.next().value, this.position, 'white', 1000);

        } else if (state.progress == NUM_LEVELS_PER_CHECKPOINT - 1) {
          state.createTextEvent(`You did it! Good luck!`, this.position, 'white', 1000);
        }
      }

      if (this.kind === "merchant") {
        this.generateRotatingMessages([
          `Go back to the Castle`,
          `...sell your stuff!`,
        ]);

        state.createTextEvent(this.rotatingMessages.next().value, this.position, 'white', 1000);
      }
      return;
    }
    // end of tutorial!

    if (this.kind === "elder") {
      const items = [];

      const hpPotion = new Potion();
      hpPotion.addModifier({ attr: "hp", modifier: this.getPotionModifierForPlayer(player, 'hp') });
      items.push(hpPotion);

      const mpPotion = new Potion();
      mpPotion.addModifier({ attr: "mp", modifier: this.getPotionModifierForPlayer(player, 'mp') });
      items.push(mpPotion);

      const scroll = new Scroll();
      items.push(scroll);

      const pointsPotion = new PotionPoints();
      items.push(pointsPotion);

      player.setTradingItems(items);

    } else if (this.kind === "merchant") {
      const progress = this.state.roomUtils.realRand.intBetween(Math.max(1, player.latestProgress - 1), player.latestProgress + 1)
      player.setTradingItems([
        this.state.roomUtils.createArmor({ progress }),
        this.state.roomUtils.createBoot({ progress }),
        this.state.roomUtils.createHelmet({ progress }),
        this.state.roomUtils.createShield({ progress }),
        this.state.roomUtils.createWeapon(player.primaryAttribute, { progress }),
      ]);

    } else if (this.kind === "majesty") {
      this.generateRotatingMessages((!isLastLevel) ? [
        `I don't reveal the source of my weapons.`,
        `The prophecy is true.`,
        `You've got the diamonds?`,
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

        const potion1 = new Potion();
        potion1.addModifier({ attr: "xp", modifier: this.getPotionModifierForPlayer(player, 'xp') });
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

  getPotionModifierForPlayer(player, attr: 'hp' | 'mp' | 'xp') {
    let modifier = POTION_1_MODIFIER;

    if (player[attr].max >= POTION_4_MODIFIER) {
      modifier = POTION_4_MODIFIER;

    } else if (player[attr].max >= POTION_3_MODIFIER) {
      modifier = POTION_3_MODIFIER;

    } else if (player[attr].max >= POTION_2_MODIFIER) {
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
