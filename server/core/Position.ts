import { Schema, type } from "@colyseus/schema";
import { Point } from "../rooms/states/DungeonState";

export class Position extends Schema {
    @type("number") x: number = 0;
    @type("number") y: number = 0;

    set(newPosition: Point) {
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}