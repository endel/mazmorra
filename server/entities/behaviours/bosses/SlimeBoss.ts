import helpers from "../../../../shared/helpers";
import { Behaviour } from "../Behaviour";
import { DungeonState } from "../../../rooms/states/DungeonState";
import { Unit } from "../../Unit";
import { StunTile } from "../../interactive/StunTile";

export class SlimeBoss implements Behaviour {
  lastStunTileTime: number = 0;
  stunTileInterval = 1000;

  update(unit: Unit, state: DungeonState, currentTime: number) {
    const stunTileDiff = currentTime - this.lastStunTileTime;
    const stunTileAllowed = stunTileDiff > this.stunTileInterval;

    if (stunTileAllowed) {
      if (!state.gridUtils.getEntityAt(unit.position.x, unit.position.y, StunTile)) {
        const newStunTile = new StunTile(unit.position, helpers.ENTITIES.STUN_TILE_GOO);
        newStunTile.state = state;
        state.addEntity(newStunTile);
      }
      this.lastStunTileTime = currentTime;
    }
  }

}
