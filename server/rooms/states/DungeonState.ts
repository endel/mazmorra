import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import gen, { RandomSeed } from "random-seed";

import dungeon from "../../../shared/Dungeon";
import helpers from "../../../shared/helpers";

import { EventEmitter } from "events";
import PF from "pathfinding";

import { GridUtils } from "../../utils/GridUtils";
import { RoomUtils } from "../../utils/RoomUtils";

// entities
import { Player } from "../../entities/Player";
import { Enemy } from "../../entities/Enemy";
import { Unit } from "../../entities/Unit";
import { Fountain } from "../../entities/interactive/Fountain";

// entity types
import { Item } from "../../entities/Item";
import { TextEvent } from "../../entities/ephemeral/TextEvent";
import { Interactive } from "../../entities/Interactive";
import { Entity } from "../../entities/Entity";
import { MoveEvent, Movement } from "../../core/Movement";

export interface Point {
  x: number;
  y: number;
}

export class DungeonState extends Schema {
  // predicatble random generator
  rand = gen.create();
  events = new EventEmitter();

  @type("number") progress: number;
  @type("number") difficulty: number;
  @type("boolean") daylight: boolean = true; // (serverHour % 2 === 1)
  @type("string") mapkind: string;

  @type(["number"]) grid = new ArraySchema<number>();
  @type("number") width: number;
  @type({ map: Entity }) entities = new MapSchema<Entity>();

  rooms: any;
  players: {[id: string]: Player} = {};

  gridUtils: GridUtils;
  roomUtils: RoomUtils;

  pathgrid: PF.Grid;
  finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }

  constructor (progress, difficulty, daylight?: boolean) {
    super()

    const serverHour = (new Date()).getHours();

    this.progress = progress;
    this.difficulty = difficulty;

    this.daylight = true
    let grid, rooms;

    if (progress === 1) {
      this.mapkind = "castle";
      [grid, rooms] = dungeon.generate(this.rand, { x: 12, y: 12 }, { x: 10, y: 10}, { x: 12, y: 12 }, 1);

    } else {
      // ['grass', 'rock', 'ice', 'inferno', 'castle']
      this.mapkind = 'rock';
      // this.mapkind = 'rock-2';
      // this.mapkind = 'castle';

      // // // big-and-spread (castle)
      // data = dungeon.generate(this.rand, {x: 52, y: 52}, {x: 6, y: 6}, {x: 12, y: 12}, 32)

      // // compact / cave (rock)
      // data = dungeon.generate(this.rand, {x: 16, y: 16}, {x: 4, y: 4}, {x: 8, y: 8}, 24)

      // // maze-like (castle)
      // data = dungeon.generate(this.rand, {x: 48, y: 48}, {x: 5, y: 5}, {x: 10, y: 10}, 32)

      // regular rooms
      [grid, rooms] = dungeon.generate(this.rand, {x: 24, y: 24}, {x: 6, y: 6}, {x: 12, y: 12}, 3);
    }

    this.width = grid.length;
    this.rooms = rooms;

    // assign flattened grid to array schema
    const flatgrid = this.flattenGrid(grid, this.width);
    for (let i = 0; i < flatgrid.length; i++) {
      this.grid[i] = flatgrid[i];
    }

    this.gridUtils = new GridUtils(this.entities);
    this.roomUtils = new RoomUtils(this.rand, this, this.rooms);

    if (progress === 1) {
      // lobby
      this.roomUtils.populateLobby(this.rooms);

    } else {
      // regular room
      this.roomUtils.createEntities()
    }

    // 0 = walkable, 1 = blocked
    this.pathgrid = new PF.Grid(grid.map((line, x) => {
      return line.map((type, y) => {
        // const hasInteractive = this.gridUtils.getEntityAt(x, y, Interactive, 'actAsObstacle');
        // console.log("has interactive?", x, y, hasInteractive);
        return (type & helpers.TILE_TYPE.FLOOR) ? 0 : 1;
      });
    }))

    console.log("mapkind:", this.mapkind);
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
    // prevent hero from starting the game dead
    // when he dies and returns to lobby
    if (
      hero.hp <= 0 &&
      this.progress === 1
    ) {
      hero.hp = 1;
    }

    var player = new Player(client.id, hero)
    player.state = this

    if (hero.progress <= this.progress) {
      player.position.set(this.roomUtils.startPosition)

    } else {
      player.position.set(this.roomUtils.endPosition)
    }

    this.addEntity(player)
    this.players[ player.id ] = player

    return player
  }

  removePlayer (player) {
    delete this.players[ player.id ]
    this.removeEntity(player)
  }

  dropItemFrom (unit, item?: Item) {
    item = item || this.roomUtils.createRandomItem();

    if (item) {
      item.position.set(unit.position);
      this.addEntity(item)
    }
  }

  checkOverlapingEntities (moveEvent: MoveEvent, x, y) {
    var entities = this.gridUtils.getAllEntitiesAt(y, x)
      , unit = moveEvent.target

    for (var i=0; i<entities.length; i++) {
      let entity = entities[i]

      if (unit instanceof Unit) {
        if (entity instanceof Enemy && entity.isAlive) {
          moveEvent.cancel();
        }

        if (entity instanceof Item && entity.pick(unit, this)) {
          this.removeEntity(entity);
        }

        if (entity instanceof Interactive && (moveEvent.target.position as Movement).target === entity) {
          entity.interact(moveEvent, unit, this);
        }
      }
    }
  }

  move (unit: Unit, destiny: Point, allowChangeTarget: boolean = true) {
    if (destiny.x == unit.position.y && destiny.y == unit.position.x) {
      return false;
    }

    var moves = this.finder.findPath(
      unit.position.x, unit.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      this.pathgrid.clone() // FIXME: we shouldn't create leaks that way!
    );

    moves.shift(); // first block is always the starting point, we don't need it

    if (allowChangeTarget) {
      unit.position.target = this.gridUtils.getEntityAt(destiny.x, destiny.y, Unit, 'isAlive')
        || this.gridUtils.getEntityAt(destiny.x, destiny.y);

      // TODO: refactor me
      if (unit.position.target instanceof Unit && unit.position.target.isAlive) {
        unit.attack(unit.position.target);

      } else {
        unit.attack(null);
      }
    }

    unit.position.moveTo(moves);
  }

  addMessage (player, message) {
    return this.createTextEvent(message, player.position, false, undefined, true)
  }

  createTextEvent (text, position, kind, ttl, small?) {
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

  flattenGrid (grid: any[][], width) {
    const flattened = Array(grid.length * grid[0].length);

    for (let y = 0, h = grid[0].length; y < h; y++) {
      for (let x = 0; x < width; x++) {
        flattened[x + width * y] = grid[y][x];
      }
    }

    return flattened;
  };

}
