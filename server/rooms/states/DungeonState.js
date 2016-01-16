 'use strict';

var gen = require('random-seed')

  , dungeon  = require('../../../shared/Dungeon')
  , helpers  = require('../../../shared/helpers')

  , EventEmitter  = require('events').EventEmitter
  , PF = require('pathfinding')

  , GridUtils  = require('../../utils/GridUtils')
  , RoomUtils  = require('../../utils/RoomUtils')

  // entities
  , Player  = require('../../entities/Player')
  , Enemy  = require('../../entities/Enemy')
  , Unit  = require('../../entities/Unit')
  , Entity  = require('../../entities/Entity')

  // entity types
  , Item  = require('../../entities/Item')
  , TextEvent  = require('../../entities/ephemeral/TextEvent')
  , Interactive  = require('../../entities/Interactive')

class DungeonState extends EventEmitter {

  constructor (mapkind, progress, difficulty, daylight) {
    super()

    // predicatble random generator
    this.rand = gen.create()

    // (gridSize, minRoomSize, maxRoomSize, maxRooms) {
    var data = dungeon.generate(this.rand, {x: 16, y: 16}, {x: 4, y: 4}, {x: 8, y: 8}, 24)
    // var data = dungeon.generate(this.rand, {x: 24, y: 24}, {x: 6, y: 6}, {x: 12, y: 12}, 3)

    this.mapkind = mapkind
    this.progress = progress
    this.difficulty = difficulty
    this.daylight = daylight

    this.grid = data[0]
    this.rooms = data[1]

    this.entities = {}
    this.players = {}

    this.gridUtils = new GridUtils(this.entities)

    // 0 = walkable, 1 = blocked
    this.pathgrid = new PF.Grid(this.grid.map(line => { return line.map(type => (type & helpers.TILE_TYPE.FLOOR) ? 0 : 1) }))
    this.finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }

    this.roomUtils = new RoomUtils(this.rand, this, this.rooms)
    this.roomUtils.createEntities()
  }

  addEntity (entity) { this.entities[ entity.id ] = entity }
  removeEntity (entity) { delete this.entities[ entity.id ] }

  createPlayer (client) {
    var player = new Player(client.id)
      , currentProgress = (client.currentProgress || -1)

    player.type = helpers.ENTITIES.PLAYER
    player.position.on('move', this.onEntityMove.bind(this))

    if (currentProgress < this.progress) {
      player.position.set(this.roomUtils.startPosition)
    } else {
      player.position.set(this.roomUtils.endPosition)
    }

    this.addEntity(player)
    this.players[ player.id ] = player

    // TODO: refactor me!
    client.player = player
    client.currentProgress = this.progress

    return player
  }

  removePlayer (player) {
    delete this.players[ player.id ]
    this.removeEntity(player)
  }

  dropItemFrom (unit) {
    let dropped = this.roomUtils.dropItemFrom(unit)
    if (dropped) {
      this.addEntity(dropped)
    }
  }

  onEntityMove (moveEvent, prevX, prevY, currentX, currentY) {
    var entity = moveEvent.target

    // check if target position has been changed
    if (entity.position.target) {

      // TODO: improve me
      if (entity.position.target instanceof Unit &&
          entity.position.target.isAlive &&
          currentX === entity.position.target.position.x &&
          currentY === entity.position.target.position.y) {
        moveEvent.cancel()
        return
      }

      if (
          entity.position.destiny && (
            entity.position.destiny.x !== entity.position.target.position.x ||
            entity.position.destiny.y !== entity.position.target.position.y
          )
      ) {
        entity.position.x = currentX
        entity.position.y = currentY
        this.move(entity, { x: entity.position.target.position.y, y: entity.position.target.position.x }, false)
      }

      // check if player picked up some item
      if (moveEvent.target instanceof Player) {
        this.checkOverlapingEntities(moveEvent, currentX, currentY)
      }
    }

    // if (prevX && prevY) this.pathgrid.setWalkableAt(prevX, prevY, true)
    // console.log(entity, currentX, currentY)
    // this.pathgrid.setWalkableAt(currentX, currentY, false)
  }

  checkOverlapingEntities (moveEvent, x, y) {
    var entities = this.gridUtils.getAllEntitiesAt(y, x)
      , player = moveEvent.target

    for (var i=0; i<entities.length; i++) {
      let entity = entities[i]

      if (entity instanceof Item) {
        entity.pick(player, this)
      }

      if (entity instanceof Interactive) {
        entity.interact(moveEvent, player, this)
      }
    }
  }

  move (player, destiny, allowChangeTarget) {
    if (destiny.x == player.position.y && destiny.y == player.position.x) {
      return false;
    }

    if (typeof(allowChangeTarget)==="undefined") {
      allowChangeTarget = true
    }

    var moves = this.finder.findPath(
      player.position.x, player.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      this.pathgrid.clone() // FIXME: we shouldn't create leaks that way!
    );

    moves.shift() // first block is always the starting point, we don't need it

    if (allowChangeTarget) {
      player.position.target = this.gridUtils.getEntityAt(destiny.x, destiny.y)
      // TODO: refactor me
      if (player.position.target instanceof Unit && player.position.target.isAlive) {
        player.attack(player.position.target)
      } else {
        player.attack(null)
      }
    }

    player.position.moveTo(moves)
  }

  addMessage (player, message) {
    return this.createTextEvent(message, player.position, false, false, true)
  }

  createTextEvent (text, position, kind, ttl, small) {
    var textEvent = new TextEvent(text, position, kind, ttl, small)
    textEvent.state = this
    this.addEntity(textEvent)
    return textEvent
  }

  update (currentTime) {
    for (var id in this.entities) {
      this.entities[id].update(currentTime)
    }
  }

  toJSON () {
    return {
      mapkind: this.mapkind,
      daylight: this.daylight,
      grid: this.grid,
      // players: this.players,
      entities: this.entities,
    }
  }

}

module.exports = DungeonState
