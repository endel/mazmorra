import { Item } from "../Item";
import helpers from "../../../shared/helpers";

export class Gold extends Item {
  amount: number;

  constructor (amount: number) {
    super()
    this.type = helpers.ENTITIES.GOLD;
    this.amount = amount;
  }

  // you cannot really use gold...
  use(player, state) { return true; }

  pick (player, state) {
    //
    // FIXME!
    // This is necessary to preserve updated position of player.
    //
    setTimeout(() => {
      player.gold += this.amount;
      state.createTextEvent("+" + this.amount, player.position, 'yellow', 100);
      state.events.emit("sound", "coin", player);
    }, 1);

    return true;
  }

}
