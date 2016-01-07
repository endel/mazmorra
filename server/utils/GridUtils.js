class GridUtils {

  constructor (entities) {
    this.entities = entities
  }

  getEntityAt (x, y) {
    // var entities = []
    for (var id in this.entities) {
      // return first entity found at that position
      if (this.entities[ id ].position.y == x && this.entities[ id ].position.x == y) {
        return this.entities[ id ]
      }
    }
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
