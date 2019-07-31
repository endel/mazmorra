import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { UnitSpawnerConfig, UnitSpawner } from "../behaviours/UnitSpawner";
import { Action } from "../../actions/Action";

export class InfernoPortal extends Interactive {
  activationTime: number;
  activeTimeout: number = 5000; // 5 seconds to destroy

  // Check to activate portal.
  lastUpdateTime: number = 0;
  aiUpdateTime = 500;

  unitSpawner: UnitSpawnerConfig;

  constructor (position, unitSpawner: UnitSpawnerConfig) {
    super(helpers.ENTITIES.PORTAL_INFERNO, position)

    this.unitSpawner = unitSpawner;
  }

  update (currentTime) {
    super.update(currentTime);

    if (!this.action) {
      const timeDiff = currentTime - this.lastUpdateTime;
      const aiAllowed = timeDiff > this.aiUpdateTime;

      if (aiAllowed) {
        if (this.state.findClosestPlayer(this, 4)) {
          this.activationTime = currentTime;
          this.action = new Action("active", true);
          this.addBehaviour(new UnitSpawner(this.unitSpawner));
        }
        this.lastUpdateTime = currentTime;
      }

    } else if (currentTime > this.activationTime + this.activeTimeout) {
      // remove itself after activeTimeout.
      this.state.removeEntity(this);
    }
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel()

  }

}
