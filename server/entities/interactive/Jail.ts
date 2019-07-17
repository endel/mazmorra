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

  getLockedTiles() {
    if (this.direction === helpers.DIRECTION.SOUTH) {
      return [{ x: this.position.x - 1, y: this.position.y }];

    } else if (this.direction === helpers.DIRECTION.NORTH) {
      return [{ x: this.position.x + 1, y: this.position.y }];

    } else if (this.direction === helpers.DIRECTION.WEST) {
      return [{ x: this.position.x, y: this.position.y + 1 }];

    } else if (this.direction === helpers.DIRECTION.EAST) {
      return [{ x: this.position.x, y: this.position.y - 1 }];
    }
  }

  unlock (state) {
    this.isLocked = false;
    this.walkable = true;

    this.getLockedTiles().forEach(position => {
      state.pathgrid.setWalkableAt(position.x, position.y, true);
    });
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
