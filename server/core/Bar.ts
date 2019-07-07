import { Schema, type } from "@colyseus/schema";
import { EventEmitter } from "events";

export class Bar extends Schema {
  @type("number") current: number;
  @type("number") max: number;

  attribute: string;
  public events: EventEmitter;

  constructor (attribute: string, current?: number, max?: number) {
    super();
    this.current = current;
    this.max = max || current;

    this.attribute = attribute;

    if (this.attribute === "xp") {
      this.events = new EventEmitter();
    }
  }

  increment (value: number) {
    if (this.attribute === "xp") {
      // xp bar is re-set, and emits an event when max is reached.
      let xp: number = value

      while (this.current + xp > this.max) {
        xp = (this.current + xp) - this.max;

        this.events.emit('lvl-up');
        this.current = 0;
      }

      this.current += xp;

    } else {
      this.set(this.current + value);
    }
  }

  set (value: number, max?: number) {
    if (max) {
      this.max = max;
    }

    this.current = Math.max(0, Math.min(value, this.max));
  }

  dispose() {
    if (this.events) {
      this.events.removeAllListeners();
      delete this.events;
    }
  }
}
