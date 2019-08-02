import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { UnitSpawner } from "../behaviours/UnitSpawner";
import { Action } from "../../actions/Action";
import { UnitListSpawner } from "../behaviours/UnitListSpawner";
import { Unit } from "../Unit";

export class TrueHellSpawner extends Interactive {
  activated: boolean;
  activationTime: number;
  units: Unit[];
  
  // Check to activate portal.
  lastUpdateTime: number = 0;
  spawnInterval = 1000;
  aiUpdateTime = 500;

  constructor (position) {
    super(helpers.ENTITIES.PORTAL_INFERNO, position)
  }

  update (currentTime) {
    super.update(currentTime);

    if (!this.action) {
      const timeDiff = currentTime - this.lastUpdateTime;
      const aiAllowed = timeDiff > this.aiUpdateTime;

      if (aiAllowed) {
        if (this.activated && this.units) {
          this.action = new Action("active", true);
          this.addBehaviour(new UnitListSpawner(this.units, this.spawnInterval, false));
        }
        this.lastUpdateTime = currentTime;
      }

    } else {
      if (this.units && this.units.length === 0) {
        // Spawner ran out of units
        this.activated = false;
        this.action = null;
        this.behaviours = [];
        //this.state.removeEntity(this);
      } 
    }
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel()
    player.stun(1000);
    //player.takeDamage({ attacker: this, damage: 666});
  }

}
