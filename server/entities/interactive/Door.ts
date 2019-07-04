import { Schema, type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";

export enum DoorProgress {
  BACK = -1,
  FORWARD = -2,
  HOME = 1,
  LATEST = -3,
}

interface DoorDestinyOptions {
  progress: number;
  room?: string;
}

export class DoorDestiny extends Schema implements DoorDestinyOptions {
  // @type("string") identifier: string;
  // @type("string") mapkind: string;
  // @type("number") difficulty: number;
  @type("number") progress: DoorProgress;
  @type("string") room: string;

  constructor(data: DoorDestinyOptions) {
    super();
    // this.identifier = data.identifier;
    // this.mapkind = data.mapkind;
    // this.difficulty = data.difficulty;
    this.progress = data.progress;

    if (data.room) {
      this.room = data.room;
    }
  }
}

export class Door extends Interactive {
  @type(DoorDestiny) destiny: DoorDestiny;
  @type("boolean") isLocked: boolean = false;
  @type("string") mapkind: string;

  walkable = true;

  constructor (position: Point, destiny: DoorDestiny, isLocked: boolean = false) {
    super(helpers.ENTITIES.DOOR, position);
    this.destiny = destiny;
    this.isLocked = isLocked;
  }

  interact (moveEvent, player, state) {
    if (!player.isAlive || player.isSwitchingDungeons) {
      return;
    }

    if (this.isLocked) {
      const { inventoryType, itemId } = player.getItemByType('key-' + (this.mapkind || state.mapkind));

      // use key to unlock door
      if (
        !inventoryType ||
        !itemId ||
        !player.useItem(inventoryType, itemId, true)
      ) {
        setTimeout(() => {
          state.createTextEvent(`Door is locked!`, player.position, "white", 100);
        }, 1);
        return;

      } else if (this.destiny.room === undefined) { // do not unlock special rooms!
        this.isLocked = false;
      }
    }

    player.isSwitchingDungeons = true;
    state.events.emit('goto', player, this.destiny, { isPortal: false });
  }

}
