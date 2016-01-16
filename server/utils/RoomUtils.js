var helpers  = require('../../shared/helpers')

  // entities
  , Player  = require('../entities/Player')
  , Enemy  = require('../entities/Enemy')
  , Unit  = require('../entities/Unit')
  , Entity  = require('../entities/Entity')

  // entity types
  , Item  = require('../entities/Item')
  , Interactive  = require('../entities/Interactive')

  // items
  , Gold  = require('../entities/items/Gold')
  , LifeHeal  = require('../entities/items/LifeHeal')

  // interactive
  , Door  = require('../entities/interactive/Door')
  , Chest  = require('../entities/interactive/Chest')
  , Fountain  = require('../entities/interactive/Fountain')

class RoomUtils {

  constructor (rand, state, rooms) {
    this.rand = rand
    this.state = state

    this.rooms = rooms
    this.data = new WeakMap()

    this.cacheRoomData()
    this.startPosition = this.getRandomDoorPosition(this.rooms[0]);
  }

  getRandomDoorPosition (room) {
    var possiblePositions = []
      , positions = this.data.get(room)

    for (var i=0; i<positions.length; i++) {
      let position = positions[i]
        , type = this.state.grid[position.y][position.x-1]

      if ((type & helpers.TILE_TYPE.WALL) && (type & helpers.DIRECTION.NORTH)) {
        possiblePositions.push(position)
      }
    }

    var rand = this.rand.intBetween(0, possiblePositions.length-1)
    positions.splice(positions.indexOf( possiblePositions[rand] ), 1)

    return possiblePositions[rand]
  }

  cacheRoomData () {
    for (var i=0; i<this.rooms.length; i++) {
      let room = this.rooms[i]
        , positions = []

      for (var x = 1; x < room.size.x - 1; x++) {
        for (var y = 1; y < room.size.y - 1; y++) {
          positions.push({ x: room.position.y + y , y: room.position.x + x })
        }
      }

      this.data.set(room, this.shuffle(positions))
    }
  }

  getNumPositionsRemaining (room) {
    return this.data.get(room).length
  }

  hasPositionsRemaining (room) {
    return this.getNumPositionsRemaining(room) > 0
  }

  getNextAvailablePosition (room) {
    let positions = this.data.get(room)
    return positions.shift()
  }

  createEntities () {
    // entrance
    this.state.addEntity(new Door(this.startPosition, {
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: 1
    }))

    // out
    this.state.addEntity(new Door(this.getRandomDoorPosition(this.rooms[ this.rooms.length-1 ]), {
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: 1
    }))

    this.rooms.forEach(room => this.populateRoom(room))
  }

  populateRoom (room) {
    var entities = Math.floor(Math.max(0, this.getNumPositionsRemaining(room) / 3))
    while (entities--) {
      this.addEntity(room, (position) => {
        var enemy = new Enemy('rabbit')
        enemy.position.set(position)
        enemy.position.on('move', this.state.onEntityMove.bind(this.state))
        enemy.state = this.state
        return enemy
      })
    }

    this.populateAesthetics(room, 3)

    if (this.rand.intBetween(0, 12) === 12) {
      this.addEntity(room, (position) => {
        return new Chest(position)
      })
    }

    if (this.rand.intBetween(0, 6) === 6) {
      this.addEntity(room, (position) => {
        return new Fountain(position)
      })
    }

    // if (this.hasPositionsRemaining(room)) {
    //   var entity = new Entity()
    //   entity.type = helpers.ENTITIES.ROCK
    //   entity.position = this.getNextAvailablePosition(room)
    //   this.state.addEntity(entity)
    //   this.state.pathgrid.setWalkableAt(entity.position.x, entity.position.y, false)
    // }

      // var heal = new Item(helpers.ENTITIES.LIFE_HEAL, {
      //   x: room.position.y + 1 + this.rand.intBetween(0, room.size.y - 4), // ( isn't -3 to prevent enemies to be behide walls  )
      //   y: room.position.x + 1 + this.rand.intBetween(0, room.size.x - 3)
      // })
      // this.state.addEntity(heal)
  }

  populateAesthetics (room, qty) {
    for (let i=0; i<qty; i++) {
      if (!this.hasPositionsRemaining(room)) return

      var entity = new Entity()
      entity.type = helpers.ENTITIES.AESTHETICS
      entity.position = this.getNextAvailablePosition(room)
      this.state.addEntity(entity)
    }
  }

  addEntity (room, getEntity) {
    if (this.hasPositionsRemaining(room)) {
      this.state.addEntity(getEntity(this.getNextAvailablePosition(room)))
    }
  }

  dropItemFrom (unit) {
    return new Gold(unit.position)
  }

  shuffle (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = this.rand.intBetween(0, i)
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

}

module.exports = RoomUtils
