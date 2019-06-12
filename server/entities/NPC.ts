import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";

export class NPC extends Player {
  @type("string") kind: string;
  wanderer: boolean = true;

  constructor (kind, npcHero = {}) {
    super(undefined, npcHero as any)

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;
  }

  updateMovementSpeed () {
    this.statsModifiers.movementSpeed = -this.state.rand.intBetween(200, 300);
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
