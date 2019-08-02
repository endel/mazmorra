import { Behaviour } from "./Behaviour";
import { DungeonState } from "../../rooms/states/DungeonState";
import { Unit } from "../Unit";
import { Enemy } from "../Enemy";

export class UnitListSpawner implements Behaviour {
  lastUnitSpawnTime = Date.now() - 5800; // give some time for the spawn to appear during camera animation
  units: Unit[];
  interval: number;
  surrounding: boolean;

  constructor (units: Unit[], interval: number, surrounding: boolean) {
    this.units = units;
    this.interval = interval;
    this.surrounding = surrounding;
  }

  update(unit: Unit, state: DungeonState, currentTime: number) {
    if (this.units && this.units.length) {
      const timeDiff = currentTime - this.lastUnitSpawnTime;
      const spawnAllowed = timeDiff > this.interval

      if (spawnAllowed) {
        const checkPositions = (this.surrounding) ? [
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
          const enemy = this.units.pop();

          if (enemy) {
            enemy.position.set({
              x: availablePosition[1],
              y: availablePosition[0]
            });
  
            //enemy.walkable = true;
  
            state.addEntity(enemy);
          }
        }

        this.lastUnitSpawnTime = currentTime;
      }
    }
  }

}
