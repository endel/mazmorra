import { generateId } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { DungeonState } from "../rooms/states/DungeonState";
import { Position } from "../core/Position";
import { Behaviour } from "./behaviours/Behaviour";

export class Entity extends Schema {
  @type("string") id: string;
  @type("string") type: string;
  @type(Position) position = new Position();

  walkable: boolean;
  state: DungeonState;

  behaviours?: Behaviour[]

  removed?: boolean;

  constructor (id?: string) {
    super();

    this.id = id || generateId();
    this.walkable = false;
  }

  update(currentTime?: number) {
    if (this.behaviours) {
      let i: number = this.behaviours.length;
      while (i--) {
        this.behaviours[i].update(this, this.state, currentTime);
      }
    }
  }

  addBehaviour(behaviour: Behaviour) {
    if (!this.behaviours) { this.behaviours = []; }
    this.behaviours.push(behaviour);
  }

  dispose() {
    this.behaviours = null;
    this.removed = true;
    delete this.position;
  }

}
