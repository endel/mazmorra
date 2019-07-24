import { Schema, type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

import { Point, RoomType } from "../../rooms/states/DungeonState";

export enum DoorProgress {
  BACK = -1,
  FORWARD = -2,
  HOME = 1,
  LATEST = -3,
}

interface DoorDestinyOptions {
  progress: number;
  room?: RoomType;
}

export class DoorDestiny extends Schema implements DoorDestinyOptions {
  // @type("string") identifier: string;
  // @type("string") mapkind: string;
  // @type("number") difficulty: number;
  @type("number") progress: DoorProgress;
  @type("string") room: RoomType;

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
  lockedMessage?: string;

  constructor (position: Point, destiny: DoorDestiny, isLocked: boolean = false) {
    super(helpers.ENTITIES.DOOR, position);
    this.destiny = destiny;
    this.isLocked = isLocked;
  }

  unlock() {
    this.isLocked = false;
  }

  interact (moveEvent, player, state) {
    if (!player.isAlive || player.isSwitchingDungeons) {
      return;
    }

    if (this.isLocked) {
      const item = player.getItemByType('key-' + (this.mapkind || state.mapkind));

      // use key to unlock door
      if (!item) {
        state.createTextEvent(this.lockedMessage || `Door is locked!`, this.position, "white", 500);
        return;

      } else if (this.destiny.room === undefined) { // do not unlock special rooms!
        this.isLocked = false;
      }

      player.useItem('inventory', item.id, true);
    }

    player.isSwitchingDungeons = true;
    state.events.emit('goto', player, this.destiny, { isPortal: false });
  }

}
