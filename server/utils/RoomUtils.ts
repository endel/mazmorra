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
import { LifeHeal }  from "../entities/items/consumable/LifeHeal";
import { ManaHeal }  from "../entities/items/consumable/ManaHeal";

// interactive
import { Door, DoorDestiny, DoorProgress }  from "../entities/interactive/Door";
import { Chest }  from "../entities/interactive/Chest";
import { Fountain }  from "../entities/interactive/Fountain";

import { DungeonState } from "../rooms/states/DungeonState";
import { ShieldItem } from "../entities/items/equipable/ShieldItem";
import { WeaponItem } from "../entities/items/equipable/WeaponItem";
import { BootItem } from "../entities/items/equipable/BootItem";
import { HelmetItem } from "../entities/items/equipable/HelmetItem";
import { ArmorItem } from "../entities/items/equipable/ArmorItem";
import { ConsumableItem } from "../entities/items/ConsumableItem";
import { EquipableItem } from "../entities/items/EquipableItem";
import { DBHero } from "../db/Hero";

export class RoomUtils {

  rand: RandomSeed;
  state: DungeonState;
  rooms: any;
  cache = new WeakMap();

  startPosition: any;
  endPosition: any;

  constructor (rand, state, rooms) {
    this.rand = rand
    this.state = state

    this.rooms = rooms

    this.cacheRoomData()

    this.startPosition = this.getRandomDoorPosition(this.rooms[0]);
    this.endPosition = this.getRandomDoorPosition(this.rooms[ this.rooms.length-1 ])
  }

  getRandomDoorPosition (room) {
    var possiblePositions = []
      , positions = this.cache.get(room)

    for (var i=0; i<positions.length; i++) {
      const position = positions[i];

      const northTile = this.state.grid[(position.x - 1) + this.state.width * position.y];
      const westTile = this.state.grid[(position.x) + this.state.width * (position.y - 1)];

      if ((northTile & helpers.TILE_TYPE.WALL) && (northTile & helpers.DIRECTION.NORTH)) {
        possiblePositions.push(position)

      } else if ((westTile & helpers.TILE_TYPE.WALL) && (westTile & helpers.DIRECTION.WEST)) {
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

      this.cache.set(room, this.shuffle(positions))
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
    return this.cache.get(room).length
  }

  hasPositionsRemaining (room) {
    return this.getNumPositionsRemaining(room) > 0
  }

  getNextAvailablePosition (room) {
    let positions = this.cache.get(room)
    return positions.shift()
  }

  createEntities () {
    // entrance
    this.state.addEntity(new Door(this.startPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: DoorProgress.BACK
    })));

    // out
    this.state.addEntity(new Door(this.endPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: DoorProgress.FORWARD
    })));

    this.rooms.forEach(room => this.populateRoom(room))
  }

  populateRoom (room) {
    this.populateEnemies(room)

    // this.populateAesthetics(room, Math.max(room.size.x, room.size.y) / 2)

    // if (this.rand.intBetween(0, 12) === 12) {
    //   this.addEntity(room, (position) => new Chest(position))
    // }

    // const chestTypes = ['chest', 'chest2', 'bucket'];
    const chestKind = 'bucket';

    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))

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
      this.state.addEntity(new Door(this.endPosition, new DoorDestiny({
        difficulty: 1,
        progress: DoorProgress.LATEST
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
      'rat',
      'spider',
      // 'spider-medium',
      // 'spider-giant',
      // 'slime',
      // 'slime-cube',
      // 'slime-2',
      // 'slime-big',

      // 'eye',
      // 'fairy',
      // 'fat-zombie',
      // 'flying-eye',
      // 'frog',
      // 'spider-giant',
      // 'glass-eye',
      // 'goblin-2',
      // 'goblin-3',
      // 'goblin-boss',
      // 'goblin',
      // 'golem',
      // 'lava-ogre',
      // 'lava-totem',
      // 'minion',
      // 'monkey',
      // 'octopus-boss',
      // 'owl',
      // 'rabbit',
      // 'scorpio-boss',
      // 'skeleton-2',
      // 'skeleton',
      // 'snow-goblin-boss',
      // 'snow-minion-2',
      // 'snow-minion',
      // 'witch',
      // 'zombie'
    ];

    while (numEnemies--) {
      this.addEntity(room, (position) => {
        const enemyType = enemyList[Math.floor((Math.random() * enemyList.length))];
        const enemy = new Enemy(enemyType, {
          primaryAttribute: "strength",
          strength: 3,
          agility: 1,
          intelligence: 1,
        }, {
          // damage: 2
        });
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

  createRandomItem () {
    const index = this.rand.intBetween(0, 7);

    let itemToDrop: Item;

    switch (index) {
      case 0: itemToDrop = new Gold(); break;
      case 1: itemToDrop = new LifeHeal(); break;
      case 2: itemToDrop = new ManaHeal(); break;
      case 3:
        itemToDrop = new ShieldItem();
        itemToDrop.type = helpers.ENTITIES.SHIELD_WOOD;
        break;

      case 4:
        itemToDrop = new WeaponItem();
        itemToDrop.type = helpers.ENTITIES.SWORD;
        break;

      case 5:
        itemToDrop = new BootItem();
        itemToDrop.type = helpers.ENTITIES.BOOTS_REGULAR;
        break;

      case 6:
        itemToDrop = new HelmetItem();
        itemToDrop.type = helpers.ENTITIES.HELMET_CAP;
        break;

      // case 7:
      //   itemToDrop = new ArmorItem();
      //   itemToDrop.type = helpers.ENTITIES.SWORD;
      //   break;
    }

    if (itemToDrop instanceof EquipableItem) {
      this.assignEquipableItemModifiers(itemToDrop);
    }

    return itemToDrop;
  }

  assignEquipableItemModifiers(item: Item) {
    if (item instanceof ShieldItem) {
      const modifier = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "armor", modifier });

    } else if (item instanceof WeaponItem) {
      const modifier = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "damage", modifier });

    } else if (item instanceof BootItem) {
      const modifier = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "armor", modifier });

    } else if (item instanceof HelmetItem) {
      const modifier = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "armor", modifier });

    } else if (item instanceof ArmorItem) {
      const modifier = this.rand.intBetween(1, 3);
      item.addModifier({ attr: "armor", modifier });

    }
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
