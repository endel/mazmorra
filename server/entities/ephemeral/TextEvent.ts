import { Entity } from "../Entity";
import helpers from "../../../shared/helpers";

export class TextEvent extends Entity {

  creationTime: number;

  constructor (text, position, kind, ttl, small) {
    super()
    if (!ttl) { ttl = 3000 }

    this.type = helpers.ENTITIES.TEXT_EVENT
    this.text = text
    this.position = position
    this.ttl = ttl // ttl on interface

    this.creationTime =  Date.now();

    if (kind)  { this.kind = kind }
    if (small) { this.small = true }
  }

  update (currentTime) {
    if (currentTime > this.creationTime + 3000) {
      this.state.removeEntity(this)
    }
  }

}
