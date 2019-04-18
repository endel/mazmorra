import { Schema, type } from "@colyseus/schema";

export class Action extends Schema {
    @type("string") type: string = 'attack';
    @type("number") lastUpdateTime: number = Date.now();

    constructor (type?: string) {
        super();
        this.type = type;
    }
}