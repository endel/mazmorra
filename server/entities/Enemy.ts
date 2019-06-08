import helpers from "../../shared/helpers";

  // Entities
import { Unit, StatsModifiers } from "./Unit";
import { Player } from "./Player";
import { type } from "@colyseus/schema";
import { DBHero } from "../db/Hero";
import { BattleAction } from "../actions/BattleAction";

export class Enemy extends Unit {
  @type("string") kind: string;

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // apply stats modifiers
    for (const statName in modifiers) {
      this.statsModifiers[statName] = modifiers[statName];
    }
  }

  update (currentTime) {
    super.update(currentTime)

    // TODO: better close-to-player unit detection.
    const closePlayer = this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x, Player)
          || this.state.gridUtils.getEntityAt(this.position.y, this.position.x + 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y, this.position.x - 1, Player)

          // diagonal
          || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x - 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x + 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x - 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x + 1, Player)

    if (closePlayer && !this.isBattlingAgainst(closePlayer)) {
      this.state.move(this, { x: closePlayer.position.y, y: closePlayer.position.x })
    }
  }

}
