import { type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class Lever extends Interactive {
  @type("boolean") active: boolean = false;

  numPlayersToUnlock: number = 1;
  playersInteracted: Set<string>;

  _unlock?: any[];

  constructor (position) {
    super(helpers.ENTITIES.LEVER, position)
  }

  set unlock (doors) {
    for (let i=0;i<doors.length; i++) {
      if (doors[i].type === helpers.ENTITIES.DOOR) {
        doors[i].lockedMessage = "Find the lever to unlock";
      }
    }
    this._unlock = doors;
  }

  activate () {
    this.active = true

    this.playersInteracted.clear();
    delete this.playersInteracted;

    if (this._unlock) {
      this._unlock.forEach(unlock => unlock.unlock());
    }

    this._unlock = null;
  }

  interact (moveEvent, player, state) {
    // skip if already active.
    if (this.active) { return; }

    moveEvent.cancel();

    if (!this.playersInteracted) { this.playersInteracted = new Set<string>(); }
    this.playersInteracted.add(player.hero._id.toString());

    const playersMissing = this.numPlayersToUnlock - this.playersInteracted.size;

    // activate!
    if (playersMissing <= 0) {
      this.activate();

    } else {
      const isPlural = (playersMissing > 1);
      state.createTextEvent(`${playersMissing} more player${(isPlural) ? 's' : ''} to unlock`, this.position, "white", 500);
      state.events.emit("sound", "pending", player);
    }
  }

  dispose() {
    super.dispose();

    if (this.playersInteracted) {
      this.playersInteracted.clear();
    }
  }

}
