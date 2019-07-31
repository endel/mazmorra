import { Behaviour } from "./Behaviour";
import { DungeonState } from "../../rooms/states/DungeonState";
import { Unit } from "../Unit";
import { distance } from "../../helpers/Math";
import { Player } from "../Player";

export class AttackNearestPlayer implements Behaviour {
  lastUpdateTime: number = 0;
  aiUpdateTime = 500;

  update(unit: Unit, state: DungeonState, currentTime: number) {
    const timeDiff = currentTime - this.lastUpdateTime;
    const aiAllowed = timeDiff > this.aiUpdateTime;

    if (aiAllowed && (!unit.action || !unit.action.isEligible)) {
      const closePlayer: Player = state.findClosestPlayer(unit, unit.getAIDistance());

      if (closePlayer) {
        unit.state.move(unit, { x: closePlayer.position.y, y: closePlayer.position.x }, true)

      } else if (
        !unit.action &&
        (
          (
            unit.position.destiny &&
            (
              unit.position.destiny.x !== unit.position.initialPosition.x &&
              unit.position.destiny.y !== unit.position.initialPosition.y
            )
          ) || (
            unit.position.x !== unit.position.initialPosition.x &&
            unit.position.y !== unit.position.initialPosition.y
          )
        )
      ) {
        // Move back to initial position!
        state.move(unit, { x: unit.position.initialPosition.y, y: unit.position.initialPosition.x }, true);
      }

      this.lastUpdateTime = currentTime;
    }
  }

}
