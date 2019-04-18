import shortid from "shortid";
import { Schema, type } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";

export class Entity extends Schema {
  @type("string")
  id: string;

  state: DungeonState;

  constructor (id?: string) {
    super();

    this.id = id || shortid.generate()
  }

  update(currentTime?: number) {
    /* does nothing */
  }

}