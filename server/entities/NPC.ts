import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";

export class NPC extends Player {
  @type("string") kind: string;

  constructor (kind, npcHero = {}) {
    super(undefined, npcHero as any)

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;
  }

  updateMovementSpeed () {
    this.statsModifiers.movementSpeed = -this.state.rand.intBetween(60, 80);
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.position.pending.length === 0) {
      this.updateMovementSpeed();
      this.state.move(this, this.state.roomUtils.getRandomPosition());
    }
  }

}
