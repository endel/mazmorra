import { Entity } from "../entities/Entity";
import { Unit } from "../entities/Unit";

export class GridUtils {
  entities: {[id: string]: Unit};

  constructor (entities) {
    this.entities = entities
  }

  getEntityAt (x, y, classReference: any = Entity, meetAttribute?: string) {
    // var entities = []
    for (var id in this.entities) {
      // return first entity found at that position
      if (this.entities[ id ].position.y == x && this.entities[ id ].position.x == y &&
          this.entities[ id ] instanceof classReference &&
          (!meetAttribute || this.entities[ id ][ meetAttribute ])) {
        return this.entities[ id ]
      }
    }

    return null
  }

  getAllEntitiesAt (x, y) {
    return Object.values(this.entities).filter(entity => {
      return (entity.position.y == x && entity.position.x == y);
    });
  }

}
