import { ObjectId } from "@colyseus/social";
import { Schema, type } from "@colyseus/schema";
import helpers from "../../../shared/helpers";

import { Point } from "../../rooms/states/DungeonState";
import { Door, DoorDestiny } from "./Door";

export class Portal extends Door {
  ownerId: ObjectId;

  creationTime: number;
  ttl: number = 3 * 60 * 1000; // 3 minutes

  constructor (position: Point, destiny: DoorDestiny) {
    super(position, destiny, false);
    this.type = helpers.ENTITIES.PORTAL;
    this.creationTime = Date.now();
  }

  update(currentTime?: number) {
    if (currentTime >= this.creationTime + this.ttl) {
      this.state.removeEntity(this);
    }
  }

  interact (moveEvent, player, state) {
    if (
      !player.isAlive ||
      player.isSwitchingDungeons ||
      this.ownerId !== player.hero.userId.toString()
    ) {
      return;
    }

    // remove portal when using it.
    // only the portal owner can enter this portal.
    if (this.ownerId !== player.hero.userId.toString()) {
      return;
    }

    if (state.progress > 1) {
      player.shouldSaveCoords = true;

    } else {
      state.removeEntity(this);
    }

    player.isSwitchingDungeons = true;
    state.events.emit('goto', player, this.destiny, { isPortal: true });
  }

}
