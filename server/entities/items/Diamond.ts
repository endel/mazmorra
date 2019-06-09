import { Item } from "../Item";
import helpers from "../../../shared/helpers";
import { Player } from "../Player";

export class Diamond extends Item {
  amount: number;

  constructor (amount: number) {
    super()
    this.type = helpers.ENTITIES.DIAMOND;
    this.amount = amount;
  }

  // you cannot really use gold...
  use(player, state) { return true; }

  pick (player: Player, state) {
    //
    // FIXME!
    // This is necessary to preserve updated position of player.
    //
    setTimeout(() => {
      player.diamond += this.amount;
      state.createTextEvent("+" + this.amount, player.position, 'blue', 100);
      state.events.emit("sound", "coin", player);
    }, 1);

    return true;
  }

}
