var Entity = require('../entities/Entity')

class GridUtils {

  constructor (entities) {
    this.entities = entities
  }

  getEntityAt (x, y, classReference) {
    if (!classReference) classReference = Entity

    // var entities = []
    for (var id in this.entities) {
      // return first entity found at that position
      if (this.entities[ id ].position.y == x && this.entities[ id ].position.x == y &&
          this.entities[ id ] instanceof classReference) {
        return this.entities[ id ]
      }
    }

    return null
  }

  getAllEntitiesAt (x, y) {
    var entities = [ ]

    for (var id in this.entities) {
      if (this.entities[ id ].position.y == x && this.entities[ id ].position.x == y) {
        entities.push(this.entities[ id ])
      }
    }

    return entities
  }


}

module.exports = GridUtils
