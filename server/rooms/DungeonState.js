 'use strict';

var dungeon  = require('../../shared/dungeon')
  , helpers  = require('../../shared/helpers')

  , PF = require('pathfinding')

  , GridUtils  = require('../utils/GridUtils')

  // entities
  , Player  = require('../entities/Player')
  , Enemy  = require('../entities/Enemy')
  , Unit  = require('../entities/Unit')
  , SwitchEntity  = require('../entities/SwitchEntity')

class DungeonState {

  constructor (mapkind, level, daylight) {
    // (gridSize, minRoomSize, maxRoomSize, maxRooms) {
    var data = dungeon.generate({x: 16, y: 16}, {x: 4, y: 4}, {x: 8, y: 8}, 24)

    this.mapkind = mapkind
    this.daylight = daylight

    this.grid = data[0]
    this.rooms = data[1]

    this.entities = {}
    this.players = {}

    this.gridUtils = new GridUtils(this.entities)

    // 0 = walkable, 1 = blocked
    this.pathgrid = new PF.Grid(this.grid.map(line => { return line.map(type => (type & helpers.TILE_TYPE.FLOOR) ? 0 : 1) }))
    this.finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }

    this.startPosition = this.getStartPosition()
    this.createEntities()
  }

  addEntity (entity) { this.entities[ entity.id ] = entity }
  removeEntity (entity) { delete this.entities[ entity.id ] }

  createPlayer (client) {
    var player = new Player(client.id)
    player.type = helpers.ENTITIES.PLAYER
    player.position.on('move', this.onEntityMove.bind(this))
    player.position.set(this.startPosition.y, this.startPosition.x)

    this.addEntity(player)
    this.players[ player.id ] = player

    client.player = player
  }

  removePlayer (player) {
    delete this.players[ player.id ]
    this.removeEntity(player)
  }

  createEntities () {
    // entrance door door
    var entranceDoor = new SwitchEntity(helpers.ENTITIES.DOOR)
    entranceDoor.position.x = this.startPosition.y
    entranceDoor.position.y = this.startPosition.x
    this.addEntity(entranceDoor)

    this.rooms.forEach(room => {
      // if (helpers.randInt(0, 3) === 3) {
        // var enemy = new Enemy('skeleton')
        var enemy = new Enemy('rabbit')
        enemy.type = helpers.ENTITIES.ENEMY
        enemy.position.on('move', this.onEntityMove.bind(this))
        enemy.position.set(
          room.position.y + 1 + helpers.randInt(0, room.size.y - 3),
          room.position.x + 1 + helpers.randInt(0, room.size.x - 3)
        )
        this.addEntity(enemy)
      // }
    })

  }

  onEntityMove (moveEvent, prevX, prevY, currentX, currentY) {
    var entity = moveEvent.target

    // check if target position has been changed
    if (entity.position.target) {
      if (currentX === entity.position.target.position.x &&
          currentY === entity.position.target.position.y) {
        console.log("Reached!")
        moveEvent.cancel()

        return
      }

      if (
          entity.position.destiny && (
            entity.position.destiny.x !== entity.position.target.position.x ||
            entity.position.destiny.y !== entity.position.target.position.y
          )
      ) {
        console.log("Recompute position...")
        entity.position.x = currentX
        entity.position.y = currentY
        this.move(entity, { x: entity.position.target.position.y, y: entity.position.target.position.x }, false)
      }

    }

    // if (prevX && prevY) this.pathgrid.setWalkableAt(prevX, prevY, true)
    // console.log(entity, currentX, currentY)
    // this.pathgrid.setWalkableAt(currentX, currentY, false)
  }

  move (player, destiny, allowChangeTarget) {
    if (typeof(allowChangeTarget)==="undefined") {
      allowChangeTarget = true
    }

    var moves = this.finder.findPath(
      player.position.x, player.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      this.pathgrid.clone() // FIXME: we shouldn't create leaks that way!
    );

    if (allowChangeTarget) {
      player.position.target = this.gridUtils.getEntityAt(destiny.x, destiny.y)
      if (player.position.target instanceof Enemy) {
        player.attack(player.position.target)
      } else {
        player.attack(null)
      }
    }

    moves.shift() // first block is always the starting point, we don't need it
    player.position.moveTo(moves)
  }

  update (deltaTime) {
    for (var id in this.entities) {
      this.entities[id].update(deltaTime)
    }
  }

  getStartPosition () {
    var firstRoom = this.rooms[0]
      , likelyTiles = []

    for (var i=1, l=firstRoom.size.x-2; i<=l; i++) {
      if (this.grid[firstRoom.position.x + i][firstRoom.position.y] & helpers.TILE_TYPE.WALL) {
        likelyTiles.push( firstRoom.position.x + i )
      }
    }

    var rand = helpers.randInt(0, likelyTiles.length-1)
    return { x: likelyTiles[ rand ], y: firstRoom.position.y + 1 }
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
