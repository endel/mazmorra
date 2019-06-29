import { type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";

export class Fountain extends Interactive {
  @type("boolean") active: boolean = (Math.random() > 0.5);

  activationTime: number = Date.now();
  fillTimeout: number = 5000; // 20 seconds to fill

  constructor (position) {
    super(helpers.ENTITIES.FOUNTAIN, position)
  }

  update (currentTime) {
    if (currentTime > this.activationTime + this.fillTimeout) {
      this.active = true
    }
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel()

    // activate if player needs hp or mana
    if (
      this.active && (
        player.hp.current < player.hp.max ||
        player.mp.current < player.mp.max
      )
    ) {
      player.hp.current = player.hp.max
      player.mp.current = player.mp.max

      this.active = false
      this.activationTime = Date.now()
    }
  }

}
