import { RandomSeed } from "random-seed";

import helpers from "../../shared/helpers";

// entities
import { Attribute, Unit }  from "../entities/Unit";
import { Enemy }  from "../entities/Enemy";
import { Boss }  from "../entities/Boss";
import { NPC }  from "../entities/NPC";
import { Entity }  from "../entities/Entity";

// entity types
import { Item }  from "../entities/Item";

// items
import { Gold }  from "../entities/items/Gold";
import { Potion, POTION_1_MODIFIER }  from "../entities/items/consumable/Potion";

// interactive
import { Door, DoorDestiny, DoorProgress }  from "../entities/interactive/Door";
import { Chest }  from "../entities/interactive/Chest";
import { Fountain }  from "../entities/interactive/Fountain";

import { DungeonState, Point } from "../rooms/states/DungeonState";
import { ShieldItem } from "../entities/items/equipable/ShieldItem";
import { WeaponItem } from "../entities/items/equipable/WeaponItem";
import { BootItem } from "../entities/items/equipable/BootItem";
import { HelmetItem } from "../entities/items/equipable/HelmetItem";
import { ArmorItem } from "../entities/items/equipable/ArmorItem";
import { Diamond } from "../entities/items/Diamond";
import { Scroll } from "../entities/items/consumable/Scroll";
import { MONSTER_BASE_ATTRIBUTES, isBossMap } from "./ProgressionConfig";
import { ConsumableItem } from "../entities/items/ConsumableItem";

export interface DungeonRoom {
  position: Point;
  size: Point;
  tiles: any[];
  walls: any[];
}

export class RoomUtils {

  rand: RandomSeed;
  state: DungeonState;
  rooms: DungeonRoom[];
  cache = new WeakMap<DungeonRoom, Point[]>();

  startRoom: DungeonRoom;
  startPosition: any;
  endRoom: DungeonRoom;
  endPosition: any;

  constructor (rand, state, rooms: DungeonRoom[]) {
    this.rand = rand
    this.state = state

    this.rooms = rooms

    this.cacheRoomData()

    this.startRoom = this.rooms[0];
    this.endRoom = this.rooms[ this.rooms.length-1 ];

    this.startPosition = this.getRandomDoorPosition(this.startRoom);
    this.endPosition = this.getRandomDoorPosition(this.endRoom);
  }

  isValidTile(position: Point) {
    const tile = this.state.grid[position.x + this.state.width * position.y]
    return tile & helpers.TILE_TYPE.FLOOR;
  }

  getRandomDoorPosition (room: DungeonRoom) {
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

  getNumPositionsRemaining (room: DungeonRoom) {
    return this.cache.get(room).length;
  }

  hasPositionsRemaining (room: DungeonRoom) {
    return this.getNumPositionsRemaining(room) > 0
  }

  getNextAvailablePosition (room: DungeonRoom) {
    let positions = this.cache.get(room)
    return positions.shift()
  }

  populateRooms () {
    const isBossDungeon = isBossMap(this.state.progress);
    const isLocked = isBossDungeon;

    // entrance
    this.state.addEntity(new Door(this.startPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: DoorProgress.BACK
    })));

    // out
    // obs: door is locked on boss dungeons!
    this.state.addEntity(new Door(this.endPosition, new DoorDestiny({
      identifier: 'grass',
      mapkind: 'grass',
      difficulty: 1,
      progress: DoorProgress.FORWARD
    }), isLocked));

    // create the BOSS for the dungeon.
    if (isBossDungeon) {
      const bossType = this.state.config.boss[0];
      const boss = this.createEnemy(bossType, Boss) as Boss;
      boss.position.set(this.endPosition);
      boss.unitSpawner = MONSTER_BASE_ATTRIBUTES[bossType].spawner;

      // define the item the boss will drop
      // for now, he only drops the key for the next level.
      const key = new ConsumableItem();
      key.type = helpers.ENTITIES.KEY_1;
      boss.willDropItem = key;

      this.state.addEntity(boss);
    }

    this.rooms.forEach(room => {
      if (isBossDungeon && room === this.endRoom) {
        this.populateBossRoom(room);

      } else {
        this.populateRoom(room);
      }
    });
  }

  populateRoom (room: DungeonRoom) {
    this.populateEnemies(room)

    // this.populateAesthetics(room, Math.max(room.size.x, room.size.y) / 2)

    // if (this.rand.intBetween(0, 12) === 12) {
    //   this.addEntity(room, (position) => new Chest(position))
    // }

    // const chestTypes = ['chest', 'chest2', 'bucket'];
    // const chestKind = 'bucket';
    const chestKind = 'bucket';

    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))
    this.addEntity(room, (position) => new Chest(position, chestKind))

    if (
      this.state.progress % 3 === 0 && // fountains CAN appear only each 3 levels
      this.rand.intBetween(0, 6) === 6
    ) {
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

  populateBossRoom(room: DungeonRoom) {
    this.addEntity(room, (position) => new Chest(position, 'chest2'));
    this.addEntity(room, (position) => new Chest(position, 'chest2'));
  }

  populateLobby (rooms: DungeonRoom[]) {
    rooms.forEach(room => {
      /**
       * Marchant
       */
      const merchant = new NPC('merchant', {}, this.state);
      merchant.wanderer = false;
      merchant.position.set(room.position.x + Math.floor(room.size.x / 2), 1);
      this.state.addEntity(merchant);

      const merchantChest = new Chest({
        x: merchant.position.x + 1,
        y: merchant.position.y
      }, 'chest', true);
      merchantChest.walkable = false;
      this.state.addEntity(merchantChest);

      /**
       * Elder
       */
      const elder = new NPC('elder', {}, this.state);
      elder.wanderer = false;
      elder.position.set(1, room.position.y + Math.floor(room.size.y / 2));
      this.state.addEntity(elder);

      const elderChest = new Chest({
        x: elder.position.x,
        y: elder.position.y + 1
      }, 'bucket', true);
      elderChest.walkable = false;
      this.state.addEntity(elderChest);

      this.endPosition = {
        x: elder.position.x,
        y: elder.position.y - 3
      };

      // add door
      const door = new Door(this.endPosition, new DoorDestiny({
        difficulty: 1,
        progress: DoorProgress.LATEST
      }));
      this.state.addEntity(door);

      // add guards and lady
      ['guard', 'lady', 'woman', 'majesty'].forEach(kind => {
        this.addEntity(room, (position) => {
          var npc = new NPC(kind, {}, this.state);
          npc.position.set(position)
          return npc
        })
      });

      // add 5 fountains in the center.
      const centerY = Math.floor(room.size.y / 2);
      this.state.addEntity(new Fountain({ x: room.position.x + room.size.x - 2, y: room.position.y + centerY }));
      this.state.addEntity(new Fountain({ x: room.position.x + room.size.x - 2, y: room.position.y + centerY-1 }));
      this.state.addEntity(new Fountain({ x: room.position.x + room.size.x - 2, y: room.position.y + centerY-2 }));
      this.state.addEntity(new Fountain({ x: room.position.x + room.size.x - 2, y: room.position.y + centerY+1 }));
      this.state.addEntity(new Fountain({ x: room.position.x + room.size.x - 2, y: room.position.y + centerY+2 }));
    })
  }

  populateEnemies (room: DungeonRoom) {
    // allow 0 enemies on room?
    const minEnemies = (this.rand.intBetween(0, 3) === 0) ? 0 : 1;

    const maxEnemies = (this.state.progress <= 8)
      ? 1
      : Math.min(this.state.progress, (room.size.x * room.size.y) / 15);

    let numEnemies = this.rand.intBetween(minEnemies, maxEnemies);

    const enemyList = this.state.config.enemies;
    const enemyNames = Object.keys(enemyList);

    let currentRange = 0;
    const enemyRange = [];
    enemyNames.forEach((enemyId) => {
      currentRange += enemyList[enemyId];
      enemyRange.push(currentRange);
    });

    // this.addEntity(room, (position) => {
    //   const enemy = this.createEnemy('spider-giant', 1);
    //   enemy.state = this.state;
    //   enemy.position.set(position);
    //   return enemy;
    // });

    while (numEnemies--) {
      this.addEntity(room, (position) => {
        const rand = this.rand.floatBetween(0, 1);

        const enemyTypeIndex = enemyRange.findIndex(range => rand <= range);
        const enemyType = enemyNames[enemyTypeIndex];

        const enemy = this.createEnemy(enemyType, Enemy);
        enemy.position.set(position);
        return enemy;
      })
    }
  }

  createEnemy(type: string, enemyKlass: new (...args: any[]) => Enemy, lvl?: number): Enemy {
    if (!lvl) {
      const minLvl = Math.ceil(this.state.progress / 6);
      lvl = this.rand.intBetween(minLvl, minLvl + 1);
    }

    const attributes = MONSTER_BASE_ATTRIBUTES[type];

    const baseAttributes = {...attributes.base};
    const modifiers = {...attributes.modifiers};

    baseAttributes.lvl = lvl;

    // level up enemy attributes
    for (let i = 0; i < lvl; i++) {
      baseAttributes.strength += 1;
      baseAttributes.intelligence += 1;
      baseAttributes.agility += 1;
      baseAttributes[baseAttributes.primaryAttribute] += 1;
    }

    // TODO: generate better modififers.

    const enemy = new enemyKlass(type, baseAttributes, modifiers);
    enemy.state = this.state;

    return enemy;
  }

  populateAesthetics (room, qty) {
    for (let i=0; i<qty; i++) {
      if (!this.hasPositionsRemaining(room)) return

      var entity = new Entity();
      entity.type = helpers.ENTITIES.AESTHETICS
      entity.position.set(this.getNextAvailablePosition(room));
      this.state.addEntity(entity)
    }
  }

  addEntity (room: DungeonRoom, getEntity) {
    if (this.hasPositionsRemaining(room)) {
      this.state.addEntity(getEntity(this.getNextAvailablePosition(room)))
    }
  }

  createRandomItem () {
    // 10% nothing
    // 40% gold
    // 25% potion (70% hp / 25 % mp / 5% xp)
    // 20% common item
    // 4% rare item
    // 0.5% unique item
    // 0.5% diamonds!

    const chance = this.rand.floatBetween(0, 1);

    let itemToDrop: Item;
    // itemToDrop = new Scroll();


    // 0~10% don't drop anything.
    if (chance >= 0.1) {

      // gold
      if (chance < 0.5) {
        const amount = this.rand.intBetween(this.state.progress, Math.floor(this.state.progress * 1.5));
        itemToDrop = new Gold(amount);

      // potion
      } else if (chance < 0.75) {

        itemToDrop = new Potion();
        const potionChance = this.rand.floatBetween(0, 1);

        if (potionChance < 0.7) {
          itemToDrop.addModifier({ attr: "hp", modifier: POTION_1_MODIFIER });

        } else if (potionChance < 0.95) {
          itemToDrop.addModifier({ attr: "mp", modifier: POTION_1_MODIFIER });

        } else {
          itemToDrop.addModifier({ attr: "xp", modifier: POTION_1_MODIFIER });

        }

      // common item
      } else if (chance < 0.99) {
        const isRare = (chance >= 0.95);
        const isMagical = (chance >= 0.985);
        const itemType = this.rand.intBetween(0, 5);

        if (isRare) { console.log("DROP RARE ITEM!"); }
        if (isMagical) { console.log("AND IT'S MAGICAL!!"); }

        switch (itemType) {
          case 0:
            itemToDrop = new Scroll();
            break;

          case 1:
            itemToDrop = this.createShield();
            break;

          case 2:
            itemToDrop = this.createWeapon();
            break;

          case 3:
            itemToDrop = this.createBoot();
            break;

          case 4:
            itemToDrop = this.createHelmet();
            break;

          case 5:
            itemToDrop = this.createArmor();
            break;
        }

        // if (itemToDrop instanceof EquipableItem) {
        //   this.assignEquipableItemModifiers(itemToDrop);
        // }

      } else if (chance >= 0.99) {
        // drop diamond!
        const amount = this.rand.intBetween(1, 2);
        itemToDrop = new Diamond(amount);

      }
    } else {
      console.log("EMPTY DROP");
    }

    return itemToDrop;
  }

  getRandomPrimaryAttribute() {
    const attributes = ['strength', 'agility', 'intelligence'];
    return attributes[this.rand.intBetween(0, 2)] as Attribute;
  }

  createWeapon(damageAttribute?: Attribute) {
    const item = new WeaponItem();
    item.damageAttribute = damageAttribute || this.getRandomPrimaryAttribute();

    if (item.damageAttribute === "strength") {
      item.type = helpers.ENTITIES.WEAPON_1;

    } else if (item.damageAttribute === "agility") {
      item.type = helpers.ENTITIES.BOW_1;

      const attackDistance = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "attackDistance", modifier: attackDistance });

    } else if (item.damageAttribute === "intelligence") {
      item.type = helpers.ENTITIES.WAND_1;
      item.manaCost = 2;

      const attackDistance = this.rand.intBetween(1, 2);
      item.addModifier({ attr: "attackDistance", modifier: attackDistance });
    }

    const modifier = this.rand.intBetween(1, 2);
    item.addModifier({ attr: "damage", modifier });

    return item;
  }

  createShield () {
    const item = new ShieldItem();
    item.type = helpers.ENTITIES.SHIELD_1;

    const modifier = Math.round(this.rand.floatBetween(0.01, 0.2) * 100) / 100;
    item.addModifier({ attr: "armor", modifier });

    return item;
  }

  createBoot() {
    const item = new BootItem();
    item.type = helpers.ENTITIES.BOOTS_1;

    const modifier = Math.round(this.rand.floatBetween(0.01, 0.2) * 100) / 100;
    item.addModifier({ attr: "armor", modifier });
    item.addModifier({ attr: "movementSpeed", modifier: 5 });

    return item;
  }

  createHelmet() {
    const item = new HelmetItem();
    item.type = helpers.ENTITIES.HELMET_1;

    const modifier = Math.round(this.rand.floatBetween(0.01, 0.2) * 100) / 100;
    item.addModifier({ attr: "armor", modifier });

    return item;
  }

  createArmor() {
    const item = new ArmorItem();
    item.type = helpers.ENTITIES.ARMOR_1;

    const modifier = Math.round(this.rand.floatBetween(0.01, 0.2) * 100) / 100;
    item.addModifier({ attr: "armor", modifier });

    return item;
  }

  shuffle (array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = this.rand.intBetween(0, i)
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

}
