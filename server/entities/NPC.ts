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

    this.attackSpeed = 1500
  }

  updateWalkSpeed () {
    this.statsModifiers.walkSpeed = (Math.random());
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.position.pending.length === 0) {
      this.updateWalkSpeed();
      this.state.move(this, this.state.roomUtils.getRandomPosition());
    }
  }

}
