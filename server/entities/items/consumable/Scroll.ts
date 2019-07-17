import helpers from "../../../../shared/helpers";
import { Unit } from "../../Unit";
import { DungeonState, Point } from "../../../rooms/states/DungeonState";
import { DoorDestiny, DoorProgress } from "../../interactive/Door";
import { ConsumableItem } from "../ConsumableItem";
import { Portal } from "../../interactive/Portal";

export class Scroll extends ConsumableItem {

  constructor() {
    super();

    this.type = helpers.ENTITIES.SCROLL;
  }

  cast(unit: Unit, state: DungeonState, position?: Point) {
  }

  // you cannot use this.
  use(player, state) {
    if (state.progress === 1) {
      state.createTextEvent(`Not allowed here.`, player.position, 'white', 100);
      return false;
    }

    const availablePosition = this.getAvailablePosition(player, state);

    if (availablePosition) {
      //
      // remove previous portals from this player.
      //
      for (let id in state.entities) {
        const entity = state.entities[id];
        if (
          entity.type === helpers.ENTITIES.PORTAL &&
          entity.ownerId === player.hero._id.toString()
        ) {
          state.removeEntity(entity);
        }
      }

      const portal = new Portal({
        x: availablePosition[1],
        y: availablePosition[0]
      }, new DoorDestiny({ progress: DoorProgress.HOME }));

      portal.ownerId = player.hero._id.toString();
      portal.state = state;

      state.addEntity(portal);
      return true;

    } else {
      state.createTextEvent(`I need more space`, player.position, 'white', 100);
      return false;
    }


    return false;
  }

  getAvailablePosition(player, state) {
    const checkPositions = [
      [player.position.y - 1, player.position.x],
      [player.position.y + 1, player.position.x],
      [player.position.y, player.position.x + 1],
      [player.position.y, player.position.x - 1],
      [player.position.y - 1, player.position.x - 1],
      [player.position.y - 1, player.position.x + 1],
      [player.position.y + 1, player.position.x - 1],
      [player.position.y + 1, player.position.x + 1],
    ];

    const availablePosition = checkPositions.find((position) => {
      return (
        !state.gridUtils.getEntityAt(position[0], position[1], Unit) &&
        state.pathgrid.isWalkableAt(position[1], position[0])
      )
    });

    return availablePosition;
  }

  getPrice() {
    // TODO: differentiate prices from portals and other magic
    return 50;
  }

}
