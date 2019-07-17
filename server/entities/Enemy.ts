import helpers from "../../shared/helpers";

  // Entities
import { Unit, StatsModifiers } from "./Unit";
import { Player } from "./Player";
import { type } from "@colyseus/schema";
import { DBHero } from "../db/Hero";
import { WeaponItem } from "./items/equipable/WeaponItem";
import { ItemModifier } from "./Item";
import { distance } from "../helpers/Math";

export class Enemy extends Unit {
  @type("string") kind: string;
  @type("boolean") isBoss?: boolean;

  aiUpdateTime = 500;
  lastUpdateTime = Date.now();

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // give boost on provided modifiers.
    for (let statName in modifiers) {
      this.statsBoostModifiers[statName] = modifiers[statName];
    }

    this.recalculateStatsModifiers();
  }

  update (currentTime) {
    if (!this.isAlive) { return; }

    super.update(currentTime)

    const timeDiff = currentTime - this.lastUpdateTime
    const aiAllowed = timeDiff > this.aiUpdateTime

    if (aiAllowed && (!this.action || !this.action.isEligible)) {
      const aiDistance = this.getAIDistance();

      let closePlayer: Player;

      for (let sessionId in this.state.players) {
        const player: Player = this.state.players[sessionId];

        if (
          !player.isSwitchingDungeons &&
          !player.removed &&
          player.isAlive &&
          distance(this.position, player.position) <= aiDistance
        ) {
          closePlayer = player;
          break;
        }
      }

      if (closePlayer) {
        this.state.move(this, { x: closePlayer.position.y, y: closePlayer.position.x }, true)

      } else if (
        !this.action &&
        (
          (
            this.position.destiny &&
            (
              this.position.destiny.x !== this.position.initialPosition.x &&
              this.position.destiny.y !== this.position.initialPosition.y
            )
          ) || (
            this.position.x !== this.position.initialPosition.x &&
            this.position.y !== this.position.initialPosition.y
          )
        )
      ) {
        // Move back to initial position!
        this.state.move(this, { x: this.position.initialPosition.y, y: this.position.initialPosition.x }, true);
      }

      this.lastUpdateTime = currentTime;
    }
  }

  onLevelUp () {
    super.onLevelUp();

    for (let i = this.pointsToDistribute; i > 0; i--) {
      this.attributes[this.primaryAttribute]++;
      this.pointsToDistribute--;
    }
  }

}
