import { type } from "@colyseus/schema";

import { Entity } from "../Entity";
import helpers from "../../../shared/helpers";
import { Position } from "../../core/Position";

export class TextEvent extends Entity {
  @type("string") text: string;
  @type("number") ttl: number;

  @type("string") kind: string;
  @type("boolean") small: boolean;

  creationTime: number;

  constructor (text, position: Position, kind: string, ttl = 3000, small: boolean = false) {
    super();

    this.type = helpers.ENTITIES.TEXT_EVENT;
    this.text = text;
    this.position = position.clone();
    this.ttl = ttl; // ttl on interface

    this.creationTime =  Date.now();
    this.walkable = true;

    if (kind) { this.kind = kind; }
    if (small) { this.small = true; }
  }

  update (currentTime) {
    if (currentTime > this.creationTime + 3000) {
      this.state.removeEntity(this)
    }
  }

}
