import { Entity } from "./Entity";
import { Point } from "../rooms/states/DungeonState";
import { type } from "@colyseus/schema";
import { Action } from "../actions/Action";

export class Interactive extends Entity {
  @type(Action) action: Action;

  constructor (type, position: Point) {
    super()

    this.type = type
    this.position.set(position);
  }

  interact (moveEvent, player, state) {
    throw new Error(`${this.constructor.name} should implement interact(moveEvent, player, state) method`)
  }

}
