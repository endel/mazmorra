import { type } from "@colyseus/schema";

import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Action } from "../../actions/Action";

export class Chest extends Interactive {
  @type("string") kind: string;

  constructor (position) {
    super(helpers.ENTITIES.CHEST, position)
    this.kind = 'chest2'
  }

  interact (moveEvent, player, state) {
    if (!this.action) {
      this.action = new Action("open");
      state.dropItemFrom(this);
      moveEvent.cancel()
    }
  }

}
