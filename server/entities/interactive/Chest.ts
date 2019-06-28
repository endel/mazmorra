import { type } from "@colyseus/schema";

import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Action } from "../../actions/Action";

export class Chest extends Interactive {
  @type("string") kind: string;

  walkable = true;

  constructor (position, kind: string, isOpen = false) {
    super(helpers.ENTITIES.CHEST, position)

    this.kind = kind;

    if (isOpen) {
      this.action = new Action("open", false);
    }
  }

  interact (moveEvent, player, state) {
    if (!this.action) {
      this.action = new Action("open", true);

      if (this.kind === 'chest2') {
        state.dropItemFrom(this, undefined, {
          isRare: true,
          isMagical: state.rand.intBetween(0, 1) === 0
        });

      } else {
        state.dropItemFrom(this);
      }

      moveEvent.cancel();
    }
  }

}
