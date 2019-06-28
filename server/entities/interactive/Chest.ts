import { type } from "@colyseus/schema";

import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Action } from "../../actions/Action";
import { ItemDropOptions } from "../../utils/RoomUtils";

export class Chest extends Interactive {
  @type("string") kind: string;

  walkable = true;
  itemDropOptions: ItemDropOptions;

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

      if (this.itemDropOptions) {
        state.dropItemFrom(this, undefined, this.itemDropOptions);

      } else {
        state.dropItemFrom(this);
      }

      moveEvent.cancel();
    }
  }

}
