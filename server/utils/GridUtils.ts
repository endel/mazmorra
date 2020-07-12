import { Entity } from "../entities/Entity";
import { Unit } from "../entities/Unit";
import { MapSchema } from "@colyseus/schema";

export class GridUtils {
  entities: MapSchema<Unit>;

  constructor (entities) {
    this.entities = entities
  }

  getEntityAt (x, y, classReference: any = Entity, meetAttribute?: string) {
    // var entities = []
    // const values = this.entities.values();

    for (const entity of this.entities.values()) {
      if (
        entity.position.y == x && entity.position.x == y &&
        entity instanceof classReference &&
        (!meetAttribute || entity[meetAttribute])
      ) {
        return entity;
      }
    }

    return null
  }

  getAllEntitiesAt (x, y) {
    return Array.from(this.entities.values()).filter(entity => {
      return (entity.position.y == x && entity.position.x == y);
    });
  }

}
