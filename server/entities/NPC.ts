import { type } from "@colyseus/schema";

import helpers from "../../shared/helpers";

// Entities
import { Player } from "./Player";

export class NPC extends Player {
  @type("string") kind: string;
  wanderer: boolean = true;

  constructor (kind, npcHero = {}, state?) {
    super(undefined, npcHero as any, state);

    // // only used for Player
    // delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;

    this.walkable = false;
  }

  updateMovementSpeed () {
    this.statsModifiers.movementSpeed = -this.state.rand.intBetween(200, 300);
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel();
    this.updateDirection(player.position.x, player.position.y);

    if (this.kind === "elder") {
      const items = [];
      state.events.emit("send", player, ["trading-items", items]);

    } else if (this.kind === "merchant") {
      const items = [];
      state.events.emit("send", player, ["trading-items", items]);

    } else {
      const genericMessages = [
        `Hello traveler`,
        `Take care out there`,
        `Be safe!`,
        `You gotta be stronger than them`,
        `Save us from their curse!`,
        `We believe in your ${player.primaryAttribute}`
      ]
      state.createTextEvent(genericMessages[Math.floor(Math.random() * genericMessages.length)], this.position, 'white', 1000);
    }

    // prevent NPC from moving right after talking.
    this.position.lastMove += 500;
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
