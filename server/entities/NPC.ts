import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";

export class NPC extends Player {
  @type("string") kind: string;

  constructor (kind, npcHero = {}) {
    super(undefined, npcHero)

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;

    this.attackSpeed = 1500
  }

  updateWalkSpeed () {
    this.walkSpeed = 1500 + Math.floor((Math.random() * 4000))
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.position.pending.length === 0) {
      this.updateWalkSpeed();
      this.state.move(this, this.state.roomUtils.getRandomPosition());
    }
  }

}
