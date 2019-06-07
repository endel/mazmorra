import helpers from "../../shared/helpers";

  // Entities
import { Unit, StatsModifiers } from "./Unit";
import { Player } from "./Player";
import { type } from "@colyseus/schema";
import { DBHero } from "../db/Hero";

export class Enemy extends Unit {
  @type("string") kind: string;

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // enemy starts with a random direction
    const directions = ['bottom', 'left', 'top', 'right'];
    this.direction = directions[ Math.floor(Math.random() * directions.length) ];

    // apply stats modifiers
    for (const statName in modifiers) {
      this.statsModifiers[statName] = modifiers[statName];
    }
  }

  update (currentTime) {
    super.update(currentTime)

    if (!this.action) {
      const closePlayer = this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x, Player)
           || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x, Player)
           || this.state.gridUtils.getEntityAt(this.position.y, this.position.x + 1, Player)
           || this.state.gridUtils.getEntityAt(this.position.y, this.position.x - 1, Player)

           // diagonal
           || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x - 1, Player)
           || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x + 1, Player)
           || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x - 1, Player)
           || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x + 1, Player)

      if (closePlayer) {
        this.state.move(this, { x: closePlayer.position.y, y: closePlayer.position.x })
      }
    }
  }

  takeDamage (battleAction ) {
    this.state.move(this, { x: battleAction.attacker.position.y, y: battleAction.attacker.position.x })
    return super.takeDamage(battleAction)
  }

}
