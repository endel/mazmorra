import { Enemy } from "./Enemy";
import { DBHero } from "../db/Hero";
import { StatsModifiers, Unit } from "./Unit";

export interface UnitSpawner {
  type: string[],
  lvl: number
}

export class Boss extends Enemy {
  unitSpawner?: UnitSpawner;

  lastUnitSpawnTime = Date.now() - 5800; // give some time for the spawn to appear during camera animation
  unitSpawnTime = 8000;

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(kind, data,modifiers);

    this.isBoss = true;
  }

  get aiDistance () {
    return 4;
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.unitSpawner && this.isAlive) {
      const timeDiff = currentTime - this.lastUnitSpawnTime;
      const spawnAllowed = timeDiff > this.unitSpawnTime

      if (spawnAllowed) {
        const checkPositions = [
          [this.position.y - 1, this.position.x],
          [this.position.y + 1, this.position.x],
          [this.position.y, this.position.x + 1],
          [this.position.y, this.position.x - 1],
          [this.position.y - 1, this.position.x - 1],
          [this.position.y - 1, this.position.x + 1],
          [this.position.y + 1, this.position.x - 1],
          [this.position.y + 1, this.position.x + 1],
        ];

        const availablePosition = checkPositions.find((position) => {
          return (
            !this.state.gridUtils.getEntityAt(position[0], position[1], Unit) &&
            this.state.pathgrid.isWalkableAt(position[1], position[0])
          )
        });

        if (availablePosition) {
          const enemyType = this.unitSpawner.type[this.state.roomUtils.realRand.intBetween(0, this.unitSpawner.type.length - 1)];
          const enemy = this.state.roomUtils.createEnemy(enemyType, Enemy, this.unitSpawner.lvl);

          enemy.position.set({
            x: availablePosition[1],
            y: availablePosition[0]
          });

          // disable drop for this unit.
          enemy.willDropItem = null;

          this.state.addEntity(enemy);
        }

        this.lastUnitSpawnTime = currentTime;
      }
    }
  }

}
