import { type } from "@colyseus/schema";

import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Action } from "../../actions/Action";
import { ItemDropOptions } from "../../utils/RoomUtils";

export class Chest extends Interactive {
  @type("string") kind: string;

  walkable = true;
  itemDropOptions: ItemDropOptions;

  isLocked: boolean = false;

  actionTimeout: NodeJS.Timeout;

  constructor (position, kind: string, isOpen = false) {
    super(helpers.ENTITIES.CHEST, position)

    this.kind = kind;

    if (isOpen) {
      this.action = new Action("open", false);
    }
  }

  unlock() {
    this.isLocked = false;
  }

  open(state) {
    this.action = new Action("open", true);

    if (this.itemDropOptions) {
      state.dropItemFrom(this, undefined, this.itemDropOptions);

    } else {
      state.dropItemFrom(this);
    }
  }

  interact (moveEvent, player, state) {
    if (this.isLocked) {
      state.createTextEvent(`Chest is locked!`, this.position, "white", 100);
      return;
    }

    if (!this.action) {
      moveEvent.cancel();

      if (
        state.progress > 9 && Math.random() > 0.5 &&
        this.kind === "chest-mimic"
      ) {
        this.action = new Action("preopen", true);
        this.actionTimeout = setTimeout(() => {
          if (Math.random() > 0.5) {
            const mimic = state.roomUtils.createEnemy("mimic");
            mimic.position.set(this.position);
            mimic.direction = "bottom";

            mimic.dropOptions = this.itemDropOptions;
            mimic.dropOptions.progress++;

            state.removeEntity(this);
            state.addEntity(mimic);

          } else {
            this.open(state);
          }
        }, 500);
        return;

      } else {
        this.open(state);
      }

    }
  }

  dispose() {
    super.dispose();
    clearTimeout(this.actionTimeout);
  }

}
