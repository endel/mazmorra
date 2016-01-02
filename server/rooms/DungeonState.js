 'use strict';

var dungeon  = require('../../shared/dungeon')
  , helpers  = require('../../shared/helpers')

  , PF = require('pathfinding')

  // entities
  , Player  = require('../entities/Player')
  , Enemy  = require('../entities/Enemy')
  , SwitchEntity  = require('../entities/SwitchEntity')

class DungeonState {

  constructor (mapkind, level, daylight) {
    // (gridSize, minRoomSize, maxRoomSize, maxRooms) {
    var data = dungeon.generate({x: 16, y: 16}, {x: 4, y: 4}, {x: 8, y: 8}, 24)

    this.mapkind = mapkind
    this.daylight = daylight

    this.grid = data[0]
    this.rooms = data[1]
    this.entities = []
    this.players = []

    this.pathgrid = new PF.Grid(this.grid.map(line => {
      // 0 = walkable, 1 = blocked
      return line.map(type => (type & helpers.TILE_TYPE.FLOOR) ? 0 : 1)
    }))
    this.finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }

    this.startPosition = this.getStartPosition()

    this.createEntities()
  }

  createPlayer (client) {
    var player = new Player(client.id)
    player.type = helpers.ENTITIES.PLAYER
    player.position.on('move', this.onEntityMove.bind(this, player))
    player.position.set(this.startPosition.y, this.startPosition.x)

    this.entities.push(player)
    this.players.push(player)

    client.player = player
  }

  removePlayer (player) {
    this.players.splice(this.players.indexOf(player), 1)
    this.entities.splice(this.entities.indexOf(player), 1)
  }

  createEntities () {
    // entrance door door
    this.entities.push(new SwitchEntity(helpers.ENTITIES.DOOR, this.startPosition))

    this.rooms.forEach(room => {
      // if (helpers.randInt(0, 3) === 3) {
        var enemy = new Enemy('skeleton')
        enemy.type = helpers.ENTITIES.ENEMY
        enemy.position.on('move', this.onEntityMove.bind(this, enemy))
        enemy.position.set(
          room.position.x + 1 + helpers.randInt(0, room.size.x - 3),
          room.position.y + 1 + helpers.randInt(0, room.size.y - 3)
        )
        this.entities.push(enemy)
      // }
    })

  }

  onEntityMove (entity, prevX, prevY, currentX, currentY) {
    // if (prevX && prevY) this.pathgrid.setWalkableAt(prevX, prevY, true)
    // console.log(entity, currentX, currentY)
    // this.pathgrid.setWalkableAt(currentX, currentY, false)
  }

  move (client, destiny) {
    var moves = this.finder.findPath(
      client.player.position.x, client.player.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      this.pathgrid.clone() // FIXME: we shouldn't create leaks that way!
    );

    console.log(this.getEntityAt(destiny.x, destiny.y))

    moves.shift() // first block is always the starting point, we don't need it
    client.player.position.moveTo(moves)
  }

  update (deltaTime) {
    var i = this.players.length;
    while (i--) {
      this.players[i].update(deltaTime)
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

  getEntityAt (x, y) {
    return this.entities.filter(entity => entity.position.x == x && entity.position.y == y)
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
