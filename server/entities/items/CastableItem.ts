import { type } from "@colyseus/schema";
import { Unit } from "../Unit";
import { DungeonState, Point } from "../../rooms/states/DungeonState";
import { ConsumableItem } from "./ConsumableItem";

export abstract class CastableItem extends ConsumableItem {
  @type("boolean") isCastable = true;

  cast (unit: Unit, state: DungeonState, position?: Point): boolean {
    this.qty--;
    return this.qty === 0;
  }
}
