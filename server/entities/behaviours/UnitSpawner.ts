import { Behaviour } from "./Behaviour";
import { DungeonState } from "../../rooms/states/DungeonState";
import { Unit } from "../Unit";
import { Enemy } from "../Enemy";

export interface UnitSpawnerConfig {
  type: string[],
  lvl: number,
  giveXP?: boolean,
  interval?: number,
  surrounding?: boolean
}

export class UnitSpawner implements Behaviour {
  unitSpawner: UnitSpawnerConfig;
  lastUnitSpawnTime = Date.now() - 5800; // give some time for the spawn to appear during camera animation

  constructor (unitSpawner: UnitSpawnerConfig) {
    if (!unitSpawner.interval) {
      unitSpawner.interval = 6000;
    }

    if (unitSpawner.giveXP === undefined) {
      unitSpawner.giveXP = true;
    }

    if (unitSpawner.surrounding === undefined) {
      unitSpawner.surrounding = true;
    }

    this.unitSpawner = unitSpawner;
  }

  update(unit: Unit, state: DungeonState, currentTime: number) {
    if (this.unitSpawner) {
      const timeDiff = currentTime - this.lastUnitSpawnTime;
      const spawnAllowed = timeDiff > this.unitSpawner.interval

      if (spawnAllowed) {
        const checkPositions = (this.unitSpawner.surrounding) ? [
          [unit.position.y - 1, unit.position.x],
          [unit.position.y + 1, unit.position.x],
          [unit.position.y, unit.position.x + 1],
          [unit.position.y, unit.position.x - 1],
          [unit.position.y - 1, unit.position.x - 1],
          [unit.position.y - 1, unit.position.x + 1],
          [unit.position.y + 1, unit.position.x - 1],
          [unit.position.y + 1, unit.position.x + 1],
        ] : [
          [unit.position.y, unit.position.x],
        ];

        const availablePosition = checkPositions.find((position) => {
          return (
            !state.gridUtils.getEntityAt(position[0], position[1], Unit) &&
            state.pathgrid.isWalkableAt(position[1], position[0])
          )
        });

        if (availablePosition) {
          const enemyType = this.unitSpawner.type[state.roomUtils.realRand.intBetween(0, this.unitSpawner.type.length - 1)];
          const enemy = state.roomUtils.createEnemy(enemyType, Enemy, this.unitSpawner.lvl);

          enemy.position.set({
            x: availablePosition[1],
            y: availablePosition[0]
          });

          enemy.walkable = true;

          if (!this.unitSpawner.giveXP) {
            enemy.doNotGiveXP = true;
          }

          // disable drop for this unit.
          enemy.dropOptions = null;

          state.addEntity(enemy);
        }

        this.lastUnitSpawnTime = currentTime;
      }
    }
  }

}
