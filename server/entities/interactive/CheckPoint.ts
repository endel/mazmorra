import { type } from "@colyseus/schema";
import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Action } from "../../actions/Action";

export class CheckPoint extends Interactive {
  @type("boolean") active: boolean = false;

  activationTime: number = Date.now();
  fillTimeout: number = 10000; // 10 seconds to fill

  constructor (position) {
    super(helpers.ENTITIES.CHECK_POINT, position)
    this.walkable = true;
  }

  update (currentTime) {
    if (currentTime > this.activationTime + this.fillTimeout) {
      this.active = false
    }
  }

  interact (moveEvent, player, state) {
    this.action = new Action("activate", true);
    setTimeout(() => this.action = null, 2000);

    this.active = true;
    this.activationTime = Date.now();

    if (state.progress > 1) {
      player.checkPoint = state.progress;
    }

    if (player.hero.checkPoints.indexOf(state.progress) === -1) {
      player.hero.checkPoints.push(state.progress);
    }

    if (state.progress === 1 && player.hero.checkPoints.length === 1) {
      setTimeout(() => {
        state.createTextEvent(`noCheckpoints`, player.position, 'white', 1000);
      }, 1);

    } else {
      state.events.emit("send", player, ["checkpoints", player.hero.checkPoints]);
    }

  }

}
