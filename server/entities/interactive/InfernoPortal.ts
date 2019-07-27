import { type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class InfernoPortal extends Interactive {
  @type("boolean") active: boolean = (Math.random() > 0.5);

  activationTime: number = Date.now();
  activeTimeout: number = 5000; // 5 seconds to destroy

  constructor (position) {
    super(helpers.ENTITIES.PORTAL_INFERNO, position)
  }

  update (currentTime) {
    super.update(currentTime);

    if (currentTime > this.activationTime + this.activeTimeout) {
      // remove itself after activeTimeout.
      this.state.removeEntity(this);
    }
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel()

  }

}
