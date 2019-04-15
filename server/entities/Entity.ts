import shortid from "shortid";
import { Schema, type } from "@colyseus/schema";

export class Entity extends Schema {
  @type("string")
  id: string;

  constructor (id?: string) {
    super();

    this.id = id || shortid.generate()
  }

  update() {
    /* does nothing */
  }

  set state (value) { state.set(this, value) }
  get state () { return state.get(this) }

}