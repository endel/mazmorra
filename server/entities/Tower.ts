import helpers from "../../shared/helpers";

  // Entities
import { Enemy } from "./Enemy";
import { DBHero } from "../db/Hero";
import { StatsModifiers, Unit } from "./Unit";
import { type } from "@colyseus/schema";
import { MoveEvent } from "../core/Movement";

export class Tower extends Enemy {

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY;

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // give boost on provided modifiers.
    for (let statName in modifiers) {
      this.statsBoostModifiers[statName] = modifiers[statName];
    }

    this.recalculateStatsModifiers();
    this.updateDirection();
  }

  updateDirection(x?: number, y?: number) {
    this.direction = "bottom";
  }

  update(currentTime) {
    super.update(currentTime);

    if (this.position.pending.length > 0) {
      this.clearPendingMovement();
    }
  }

}
