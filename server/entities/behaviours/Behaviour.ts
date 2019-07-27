import { DungeonState } from "../../rooms/states/DungeonState";
import { Entity } from "../Entity";

export interface Behaviour {
  update(unit: Entity, state: DungeonState, currentTime: number);
}
