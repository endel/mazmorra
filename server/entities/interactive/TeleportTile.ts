import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class TeleportTile extends Interactive {
  destiny: TeleportTile;

  constructor (position) {
    super(helpers.ENTITIES.TELEPORT_TILE, position)

    this.walkable = true;
    this.activateOnWalkThrough = true;
  }

  interact (moveEvent, player, state) {
    if (this.destiny) {
      player.clearPendingMovement();
      setTimeout(() => {
        player.position.x = this.destiny.position.x;
        player.position.y = this.destiny.position.y;
        player.clearPendingMovement();
      }, player.getMovementSpeed() / 2);

    } else {
      state.createTextEvent(`Oops...`, player.position, 'white', 100);
    }
  }

}
