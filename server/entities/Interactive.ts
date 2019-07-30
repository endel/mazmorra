import { Entity } from "./Entity";
import { Point, DungeonState } from "../rooms/states/DungeonState";
import { type } from "@colyseus/schema";
import { Action } from "../actions/Action";
import { MoveEvent } from "../core/Movement";
import { Unit } from "./Unit";

export abstract class Interactive extends Entity {
  @type(Action) action: Action;
  activateOnWalkThrough = false;

  constructor (type, position: Point) {
    super()

    this.type = type
    this.position.set(position);
  }

  abstract interact (moveEvent: MoveEvent, unit: Unit, state: DungeonState);
}
