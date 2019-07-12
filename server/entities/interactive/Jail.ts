import helpers from "../../../shared/helpers";
import { type } from "@colyseus/schema";

import { Point } from "../../rooms/states/DungeonState";
import { Interactive } from "../Interactive";

export class Jail extends Interactive {
  @type("boolean") isLocked: boolean;
  @type("number") direction: number;

  constructor (position: Point, direction: number, isLocked: boolean = true) {
    super(helpers.ENTITIES.JAIL, position);
    this.isLocked = isLocked;
    this.direction = direction;
  }

  unlock () {
    this.isLocked = false;
    this.walkable = true;
  }

  interact (moveEvent, player, state) {
    if (this.isLocked) {
      moveEvent.cancel();

      setTimeout(() => {
        state.createTextEvent(`It's locked!`, player.position, "white", 100);
      }, 1);
      return;
    }
  }

}
