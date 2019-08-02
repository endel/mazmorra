import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class StunTile extends Interactive {
  constructor (position, type: string = helpers.ENTITIES.STUN_TILE) {
    super(type, position)

    this.walkable = true;
    this.activateOnWalkThrough = true;
  }

  interact (moveEvent, player, state) {
    player.stun(1600);
    state.removeEntity(this);
  }

}
