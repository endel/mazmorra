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
  difficulty: number;
  progress: number;
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

  constructor (position: Point, destiny: DoorDestiny) {
    super(helpers.ENTITIES.DOOR, position);
    this.destiny = destiny;
  }

  interact (moveEvent, player, state) {
    state.events.emit('goto', player, this.destiny);
  }

}
