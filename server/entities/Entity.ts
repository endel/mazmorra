import shortid from "shortid";
import { Schema, type } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Position } from "../core/Position";

export class Entity extends Schema {
  @type("string") id: string;
  @type("string") type: string;
  @type(Position) position = new Position();

  walkable: boolean;
  state: DungeonState;

  removed?: boolean;

  constructor (id?: string) {
    super();

    this.id = id || shortid.generate()
    this.walkable = false;
  }

  update(currentTime?: number) {
    /* does nothing */
  }

  dispose() {
    this.removed = true;
    delete this.position;
  }

}
