import shortid from "shortid";
import { Schema, type } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Position } from "../core/Position";

export class Entity extends Schema {
  @type("string") id: string;
  @type("string") type: string;
  @type(Position) position = new Position();

  walkable = false;

  state: DungeonState;

  constructor (id?: string) {
    super();

    this.id = id || shortid.generate()
  }

  update(currentTime?: number) {
    /* does nothing */
  }

}
