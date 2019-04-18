import shortid from "shortid";
import { Schema, type } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Position } from "../core/Position";

export class Entity extends Schema {
  @type("string") id: string;
  @type("number") type: number;
  @type(Position) position = new Position();

  state: DungeonState;

  constructor (id?: string) {
    super();

    this.id = id || shortid.generate()
  }

  update(currentTime?: number) {
    /* does nothing */
  }

}