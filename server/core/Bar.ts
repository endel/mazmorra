import { Schema, type } from "@colyseus/schema";

export class Bar extends Schema {
  @type("number") current: number;
  @type("number") max: number;

  constructor (current: number, max?: number) {
    super();
    this.current = current;
    this.max = max || current;
  }

  set (value: number, max?: number) {
    if (max) {
      this.max = max;
    }

    this.current = Math.max(0, Math.min(value, this.max));
  }
}
