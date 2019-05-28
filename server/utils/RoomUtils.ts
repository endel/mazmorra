import { RandomSeed } from "random-seed";

import helpers from "../../shared/helpers";

// entities
import { Player }  from "../entities/Player";
import { Enemy }  from "../entities/Enemy";
import { NPC }  from "../entities/NPC";
import { Unit }  from "../entities/Unit";
import { Entity }  from "../entities/Entity";

// entity types
import { Item }  from "../entities/Item";
import { Interactive }  from "../entities/Interactive";

// items
import { Gold }  from "../entities/items/Gold";
import { LifeHeal }  from "../entities/items/LifeHeal";
import { ManaHeal }  from "../entities/items/ManaHeal";

// interactive
import { Door, DoorDestiny }  from "../entities/interactive/Door";
import { Chest }  from "../entities/interactive/Chest";
import { Fountain }  from "../entities/interactive/Fountain";

import { DungeonState } from "../rooms/states/DungeonState";

export class RoomUtils {

  rand: RandomSeed;
  state: DungeonState;
  rooms: any;
  data = new WeakMap();

  startPosition: any;
  endPosition: any;

  constructor (rand, state, rooms) {
    this.rand = rand
    this.state = state

    this.rooms = rooms

    this.cacheRoomData()

    this.startPosition = this.getRandomDoorPosition(this.rooms[0]);
    this.endPosition = this.getRandomDoorPosition(this.rooms[ this.rooms.length-1 ])
    console.log("this.startPosition:", this.startPosition);
    console.log("this.endPosition:", this.endPosition);
  }

  getRandomDoorPosition (room) {
    var possiblePositions = []
      , positions = this.data.get(room)

    for (var i=0; i<positions.length; i++) {
      let position = positions[i]
        , type = this.state.grid[(position.x-1) + this.state.width * position.y ];

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

  getRandomPosition() {
    const room = this.rooms[this.rand.intBetween(0, this.rooms.length - 1)];
    return {
      x: room.position.x + this.rand.intBetween(0, room.size.x - 1),
      y: room.position.y + this.rand.intBetween(0, room.size.y - 1),
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
    this.state.addEntity(new Door(this.startPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: this.state.progress - 1
    })));

    // out
    this.state.addEntity(new Door(this.endPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: this.state.progress + 1
    })));

    this.rooms.forEach(room => this.populateRoom(room))
  }

  populateRoom (room) {
    this.populateEnemies(room)

    // this.populateAesthetics(room, Math.max(room.size.x, room.size.y) / 2)

    if (this.rand.intBetween(0, 12) === 12) {
      this.addEntity(room, (position) => new Chest(position))
    }

    if (this.rand.intBetween(0, 6) === 6) {
      this.addEntity(room, (position) => new Fountain(position))
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

  populateLobby (rooms) {
    rooms.forEach(room => {
      this.populateNPCs(room);

      // add door
      console.log("endPosition:", this.endPosition);
      this.state.addEntity(new Door(this.endPosition, new DoorDestiny({
        difficulty: 1,
        progress: this.state.progress + 1
      })));

      // create 3 fountains
      for (let i=0; i<3; i++) {
        this.addEntity(room, (position) => new Fountain(position))
      }
    })
  }

  populateEnemies (room) {
    var numEnemies = Math.floor(this.rand.intBetween(0, this.state.difficulty * 2))
    var enemyList = [
      'bat',
      'eye',
      'fairy',
      'fat-zombie',
      'flying-eye',
      'frog',
      'spider-giant',
      'glass-eye',
      'goblin-2',
      'goblin-3',
      'goblin-boss',
      'goblin',
      'golem',
      'lava-ogre',
      'lava-totem',
      'minion',
      'monkey',
      'octopus-boss',
      'owl',
      'rabbit',
      'rat',
      'scorpio-boss',
      'skeleton-2',
      'skeleton',
      'snow-goblin-boss',
      'snow-minion-2',
      'snow-minion',
      'witch',
      'zombie'
    ];

    while (numEnemies--) {
      this.addEntity(room, (position) => {

        var enemy = new Enemy(enemyList[Math.floor((Math.random() * enemyList.length))])
        enemy.state = this.state
        enemy.position.set(position)
        return enemy
      })
    }
  }

  populateNPCs (room) {
    // const npcs = ['village-old-man', 'village-man', 'village-man-2',
    //   'village-child', 'village-child-2', 'man', 'man-2', 'guard', 'village-woman',
    //   'woman', 'woman-2', 'woman-3'];

    const npcs = [
      'merchant',
      'elder',
      'lady',
      'guard',
      'guard',
    ];

    npcs.forEach(kind => {
      this.addEntity(room, (position) => {
        var npc = new NPC(kind)
        npc.state = this.state
        npc.position.set(position)
        return npc
      })
    });
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
    const position = unit.position;
    const index = this.rand.intBetween(0, 2);

    let itemToDrop;

    switch (index) {
      case 0: itemToDrop = new Gold(position); break;
      case 1: itemToDrop = new LifeHeal(position); break;
      case 2: itemToDrop = new ManaHeal(position); break;
    }

    return itemToDrop;
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
