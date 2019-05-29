import { Schema, type } from "@colyseus/schema";

export class Action extends Schema {
    @type("string") type: string;
    @type("number") lastUpdateTime: number = Date.now();
    @type("boolean") active: boolean;

    constructor (type: string = "attack", active: boolean = false) {
        super();
        this.type = type;
        this.active = active;
    }
}
