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
import { DBHero } from "../../db/Hero";

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
  @type("boolean") daylight: boolean;
  @type("string") mapkind: string;

  @type(["number"]) grid = new ArraySchema<number>();
  @type("number") width: number;
  @type("number") height: number;
  @type({ map: Entity }) entities = new MapSchema<Entity>();

  rooms: any;
  players: {[id: string]: Player} = {};

  gridUtils: GridUtils;
  roomUtils: RoomUtils;

  pathgrid: PF.Grid;
  finder = new PF.AStarFinder({ allowDiagonal: true } as any);

  constructor (progress, difficulty, daylight?: boolean) {
    super()

    this.progress = progress;
    this.difficulty = difficulty;

    const serverMinutes = (new Date()).getMinutes();
    this.daylight = (serverMinutes >= 30);

    let grid, rooms;

    if (progress === 1) {
      this.mapkind = "castle";
      this.width = 12;
      this.height = 12;
      [grid, rooms] = dungeon.generate(this.rand, { x: this.width, y: this.height }, { x: 10, y: 10}, { x: 12, y: 12 }, 1);

    } else {
      // ['grass', 'rock', 'ice', 'inferno', 'castle']

      this.mapkind = 'rock';
      // this.mapkind = 'rock-2';
      // this.mapkind = 'ice';
      // this.mapkind = 'grass';
      // this.mapkind = 'inferno';
      // this.mapkind = 'castle';

      // const dungeonStyle = this.rand.intBetween(0, 5);
      const dungeonStyle: number = 0;

      let minRoomSize: Point = { x: 0, y: 0 };
      let maxRoomSize: Point = { x: 0, y: 0 };

      this.width = 14 + Math.floor(progress / 2);
      this.height = 14 + Math.floor(progress / 2);

      if (dungeonStyle === 0) {
        // regular rooms
        minRoomSize.x = Math.max(Math.ceil(this.width * 0.3), 6);
        minRoomSize.y = Math.max(Math.ceil(this.height * 0.3), 6);

        maxRoomSize.x = Math.max(Math.ceil(this.width * 0.4), 10);
        maxRoomSize.y = Math.max(Math.ceil(this.height * 0.4), 10);

      } else if (dungeonStyle === 1) {
        // compact / cave
        minRoomSize.x = 5
        minRoomSize.y = 5

        maxRoomSize.x = 8
        maxRoomSize.y = 8

      } else if (dungeonStyle === 2) {
        // one-direction
        if (progress % 2 === 0) {
          minRoomSize.x = this.width;
          minRoomSize.y = Math.max(Math.floor(this.height * 0.33), 6);

          maxRoomSize.x = this.width;
          maxRoomSize.y = Math.floor(this.height * 0.33);

        } else {
          minRoomSize.x = Math.max(Math.floor(this.width * 0.33), 6);
          minRoomSize.y = this.height;

          maxRoomSize.x = Math.floor(this.width * 0.33);
          maxRoomSize.y = this.height;
        }

      } else if (dungeonStyle === 3) {
        // maze-like
        this.width = Math.ceil(this.width * 1.4);
        this.height = Math.ceil(this.height * 1.4);

        minRoomSize.x = Math.max(Math.ceil(this.width / 4), 5);
        minRoomSize.y = Math.max(Math.ceil(this.height / 4), 5);

        maxRoomSize.x = Math.max(Math.ceil(this.width / 4), 10);
        maxRoomSize.y = Math.max(Math.ceil(this.height / 4), 10);

      } else if (dungeonStyle === 4) {
        // big-and-spread (castle)
        this.width = 48;
        this.height = 48;

        minRoomSize.x = 6;
        minRoomSize.y = 6;

        maxRoomSize.x = 12;
        maxRoomSize.y = 12;
      }

      const numRooms: number = Math.min(Math.floor((this.width * this.height) / (maxRoomSize.x * maxRoomSize.y)), Math.floor(progress / 2));

      console.log("SIZE:", { x: this.width, y: this.height });
      console.log({ minRoomSize });
      console.log({ maxRoomSize });
      console.log({ numRooms });

      [grid, rooms] = dungeon.generate(this.rand, { x: this.width, y: this.height }, minRoomSize, maxRoomSize, numRooms);
    }


    this.rooms = rooms;

    // assign flattened grid to array schema
    const flatgrid = this.flattenGrid(grid, this.width, this.height);
    for (let i = 0; i < flatgrid.length; i++) {
      this.grid[i] = flatgrid[i];
    }

    /**
    ////////////////
    let i = 0;
    while (flatgrid.length > 0) {
      const spliced = flatgrid.splice(0, this.width);
      console.log(spliced.length, spliced.join(","));
      i++;
    }
    ////////////////
    */

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

  createPlayer (client, hero: DBHero) {
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

    if (hero.currentProgress <= this.progress) {
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

  checkOverlapingEntities (targetEntity: Entity, moveEvent: MoveEvent, x, y) {
    const entities = this.gridUtils.getAllEntitiesAt(y, x);
    const unit = moveEvent.target;

    for (var i=0; i<entities.length; i++) {
      let entity = entities[i] as Entity;

      if (unit instanceof Unit) {
        if (entity instanceof Enemy && entity.isAlive) {
          moveEvent.cancel();
        }

        // if unit has reached target point,
        // try to pick/interact with other entity.
        if (
          targetEntity.position.x === entity.position.x &&
          targetEntity.position.y === entity.position.y
        ) {
          if (entity instanceof Item && entity.pick(unit, this)) {
            this.removeEntity(entity);
          }

          if (entity instanceof Interactive) {
            entity.interact(moveEvent, unit, this);
          }
        }

      }
    }
  }

  move (unit: Unit, destiny: Point, allowChangeTarget: boolean = true) {
    const targetEntity = this.gridUtils.getEntityAt(destiny.x, destiny.y);
    const allowedPath = this.pathgrid.clone();

    // Check which entities are walkable.
    for (const id in this.entities) {
      const entity: Entity = this.entities[id];

      /*if (entity === targetEntity && !targetEntity.walkable && !targetEntity.position.equals(entity.position)) {
        allowedPath.setWalkableAt(entity.position.x, entity.position.y, false);

      } else*/ if (!entity.walkable && entity !== targetEntity) {
        allowedPath.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    }

    const moves = this.finder.findPath(
      unit.position.x, unit.position.y,
      destiny.y, destiny.x, // TODO: why need to invert x/y here?
      allowedPath, // FIXME: we shouldn't create leaks that way!
    );

    // first block is always the starting point.
    // remove starting point if user have not clicked on it.
    if (moves.length > 1) {
      moves.shift();
    }

    if (allowChangeTarget) {
      unit.position.target = this.gridUtils.getEntityAt(destiny.x, destiny.y, Unit, 'isAlive')
        || targetEntity

      // TODO: refactor me
      if (
        unit.position.target instanceof Unit &&
        unit.position.target.isAlive &&
        unit.position.target !== unit // prevent user from attacking himself
      ) {
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

  flattenGrid (grid: any[][], width, height) {
    const flattened = Array(width * height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        flattened[x + width * y] = grid[y][x];
      }
    }

    // for (let x = 0; x < width; x++) {
    //   for (let y = 0; y < height; y++) {
    //     flattened[x + width * y] = grid[x][y];
    //   }
    // }

    return flattened;
  };

}
