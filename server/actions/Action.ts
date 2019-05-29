import { Schema, type } from "@colyseus/schema";

export class Action extends Schema {
    @type("string") type: string;
    @type("number") lastUpdateTime: number = Date.now();
    @type("boolean") active: boolean = false;

    constructor (type: string = "attack") {
        super();
        this.type = type;
    }
}
