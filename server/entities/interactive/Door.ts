import { Schema, type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";

export enum DoorProgress {
  FORWARD = 1,
  BACK = -1,
  HOME = 0,
  LATEST = 10,
}

interface DoorDestinyOptions {
  progress: number;
  difficulty?: number;
  identifier?: string;
  mapkind?: string;
}

export class DoorDestiny extends Schema implements DoorDestinyOptions {
  @type("string") identifier: string;
  @type("string") mapkind: string;
  @type("number") difficulty: number;
  @type("number") progress: DoorProgress;

  constructor(data: DoorDestinyOptions) {
    super();
    this.identifier = data.identifier;
    this.mapkind = data.mapkind;
    this.difficulty = data.difficulty;
    this.progress = data.progress;
  }
}

export class Door extends Interactive {
  @type(DoorDestiny) destiny: DoorDestiny;
  @type("boolean") isLocked: boolean = false;

  walkable = true;

  constructor (position: Point, destiny: DoorDestiny, isLocked: boolean = false) {
    super(helpers.ENTITIES.DOOR, position);
    this.destiny = destiny;
    this.isLocked = isLocked;
  }

  interact (moveEvent, player, state) {
    if (this.isLocked) {
      const { inventoryType, itemId } = player.getItemByType(helpers.ENTITIES.KEY_1);

      // use key to unlock door
      if (
        !inventoryType ||
        !itemId ||
        !player.useItem(inventoryType, itemId)
      ) {
        setTimeout(() => {
          state.createTextEvent(`Door is locked!`, player.position, "white", 100);
        }, 1);
        return;

      } else {
        this.isLocked = false;
      }
    }

    state.events.emit('goto', player, this.destiny);

    // remove portal when using it.
    if (this.type === helpers.ENTITIES.PORTAL) {
      player.shouldSaveCoords = true;
      state.removeEntity(this);
    }
  }

}
