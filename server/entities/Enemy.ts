import helpers from "../../shared/helpers";

  // Entities
import { Unit, StatsModifiers } from "./Unit";
import { type } from "@colyseus/schema";
import { DBHero } from "../db/Hero";
import { AttackNearestPlayer } from "./behaviours/AttackNearestPlayer";

export class Enemy extends Unit {
  @type("string") kind: string;
  @type("boolean") isBoss?: boolean;

  lastUpdateTime = 0;

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // give boost on provided modifiers.
    for (let statName in modifiers) {
      this.statsBoostModifiers[statName] = modifiers[statName];
    }

    this.addBehaviour(new AttackNearestPlayer());

    this.recalculateStatsModifiers();
  }

  onLevelUp () {
    super.onLevelUp();

    for (let i = this.pointsToDistribute; i > 0; i--) {
      this.attributes[this.primaryAttribute]++;
      this.pointsToDistribute--;
    }
  }

}
