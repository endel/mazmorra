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
  , Fountain  = require('../../entities/interactive/Fountain')

  // entity types
  , Item  = require('../../entities/Item')
  , TextEvent  = require('../../entities/ephemeral/TextEvent')
  , Interactive  = require('../../entities/Interactive')

class DungeonState extends EventEmitter {

  constructor (progress, difficulty, daylight) {
    super()

    const serverHour = (new Date()).getHours();

    // predicatble random generator
    this.rand = gen.create()

    this.progress = progress;
    this.difficulty = difficulty;
    this.daylight = (serverHour > 6 && serverHour < 19);

    var data;

    if (progress === 1) {
      this.mapkind = "castle";
      data = dungeon.generate(this.rand, { x: 12, y: 12 }, { x: 12, y: 12}, { x: 12, y: 12 }, 1);

    } else {
      // ['grass', 'rock', 'ice', 'inferno', 'castle']
      this.mapkind = 'grass';

      // data = dungeon.generate(this.rand, {x: 16, y: 16}, {x: 4, y: 4}, {x: 8, y: 8}, 24)
      // data = dungeon.generate(this.rand, {x: 48, y: 48}, {x: 5, y: 5}, {x: 10, y: 10}, 32)
      data = dungeon.generate(this.rand, {x: 24, y: 24}, {x: 6, y: 6}, {x: 12, y: 12}, 3);
    }

    this.grid = data[0]
    this.rooms = data[1]

    this.entities = {}
    this.players = {}

    this.gridUtils = new GridUtils(this.entities)

    // 0 = walkable, 1 = blocked
    this.pathgrid = new PF.Grid(
      this.grid.map(line => line.map(type => (type & helpers.TILE_TYPE.FLOOR) ? 0 : 1))
    )
    this.finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }

    this.roomUtils = new RoomUtils(this.rand, this, this.rooms)

    if (progress === 1) {
      // lobby
      this.roomUtils.populateLobby(this.rooms);

    } else {
      // regular room
      this.roomUtils.createEntities()
    }
  }

  addEntity (entity) {
    this.entities[entity.id] = entity

    if (entity instanceof Fountain) {
      // this.pathgrid.setWalkableAt(entity.position.x, entity.position.y, false);
    }
  }

  removeEntity (entity) {
    delete this.entities[entity.id]
  }

  createPlayer (client, hero) {
    var player = new Player(client.id, hero)

    player.state = this
    // player.position.on('move', this.onEntityMove.bind(this))

    if (hero.progress <= this.progress) {
      player.position.set(this.roomUtils.startPosition)
    } else {
      player.position.set(this.roomUtils.endPosition)
    }

    this.addEntity(player)
    this.players[ player.id ] = player

    // TODO: refactor me!
    client.player = player

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

  checkOverlapingEntities (moveEvent, x, y) {
    var entities = this.gridUtils.getAllEntitiesAt(y, x)
      , player = moveEvent.target

    for (var i=0; i<entities.length; i++) {
      let entity = entities[i]

      if (entity instanceof Enemy && entity.isAlive) {
        moveEvent.cancel()
      }

      if (entity instanceof Item && entity.pick(player, this)) {
        this.removeEntity(entity)
      }

      if (entity instanceof Interactive) {
        entity.interact(moveEvent, player, this)
      }
    }
  }

  move (unit, destiny, allowChangeTarget) {
    if (destiny.x == unit.position.y && destiny.y == unit.position.x) {
      return false;
    }

    if (typeof(allowChangeTarget)==="undefined") {
      allowChangeTarget = true
    }

    var moves = this.finder.findPath(
      unit.position.x, unit.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      this.pathgrid.clone() // FIXME: we shouldn't create leaks that way!
    );

    moves.shift() // first block is always the starting point, we don't need it

    if (allowChangeTarget) {
      unit.position.target = this.gridUtils.getEntityAt(destiny.x, destiny.y, Unit, 'isAlive')
        || this.gridUtils.getEntityAt(destiny.x, destiny.y)

      // TODO: refactor me
      if (unit.position.target instanceof Unit && unit.position.target.isAlive) {
        unit.attack(unit.position.target)
      } else {
        unit.attack(null)
      }
    }

    unit.position.moveTo(moves)
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
    // skip update if no actual players are connected
    if (Object.keys(this.players).length === 0) {
      return;
    }

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
