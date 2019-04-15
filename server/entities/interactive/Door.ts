import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class Door extends Interactive {

  constructor (position, destiny) {
    super(helpers.ENTITIES.DOOR, position)
    this.destiny = destiny
  }

  interact (moveEvent, player, state) {
    state.emit('goto', player, this.destiny)
  }

}
