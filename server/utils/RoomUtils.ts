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
import { MONSTER_BASE_ATTRIBUTES, isBossMap, MapKind } from "./ProgressionConfig";
import { ConsumableItem } from "../entities/items/ConsumableItem";

export interface DungeonRoom {
  position: Point;
  size: Point;
  tiles: any[];
  walls: any[];
  branches: Point[];
}

interface ItemDropOptions {
  progress?: number,
  isRare?: boolean,
  isMagical?: boolean,
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

  hasFountain: boolean = false;

  constructor (rand, state, rooms: DungeonRoom[]) {
    this.rand = rand
    this.state = state

    this.rooms = rooms

    this.cacheRoomData();

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
    // flattened branches
    const branches = this.rooms.map(room => room.branches).reduce((acc, val) => acc.concat(val), []);

    for (var i=0; i<this.rooms.length; i++) {
      const room = this.rooms[i];
      const positions = [];

      for (var x = 1; x < room.size.x - 1; x++) {
        for (var y = 1; y < room.size.y - 1; y++) {
          const position = { x: room.position.y + y , y: room.position.x + x };

          // prevent from placing items in the branches of the rooms.
          // because some of them can block move
          const branchAt = branches.findIndex(branch => branch.y === position.x && branch.x === position.y);
          if (branchAt === -1) {
            positions.push(position);

          } else {
            branches.splice(branchAt, 1);
          }
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

    // add a light pole!
    if (
      (
        this.state.mapkind === MapKind.ROCK ||
        this.state.mapkind === MapKind.ROCK_2 ||
        this.state.mapkind === MapKind.CASTLE ||
        this.state.mapkind === MapKind.INFERNO
      ) &&
      this.rand.intBetween(0, 1) === 0
    ) {
      this.addEntity(room, (position) => {
        const lightPole = new Entity();
        lightPole.type = helpers.ENTITIES.LIGHT;
        lightPole.position.set(position);
        return lightPole;
      });
    }

    if (this.rand.intBetween(0, 1) === 0) {
      this.addRandomAesthetics(room);
    }

    if (
      !this.hasFountain &&
      this.state.progress % 3 === 0 && // fountains CAN appear only each 3 levels
      this.rand.intBetween(0, 6) === 6
    ) {
      this.addEntity(room, (position) => new Fountain(position))
      this.hasFountain = true;
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
      const minLvl = Math.ceil(this.state.progress / 3);
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

  addRandomAesthetics (room) {
    if (!this.hasPositionsRemaining(room)) {
      return;
    }

    var entity = new Entity();
    entity.type = helpers.ENTITIES.AESTHETICS
    entity.walkable = true;
    entity.position.set(this.getNextAvailablePosition(room));
    this.state.addEntity(entity)
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
        const itemDropOptions: ItemDropOptions = {
          progress: this.state.progress,
          isRare: (chance >= 0.95),
          isMagical: (chance >= 0.985)
        }

        const itemType = this.rand.intBetween(0, 5);

        if (itemDropOptions.isRare) {
          console.log("DROP RARE ITEM!");
        }

        if (itemDropOptions.isMagical) {
          console.log("AND IT'S MAGICAL!!");
        }

        switch (itemType) {
          case 0:
            itemToDrop = new Scroll();
            break;

          case 1:
            itemToDrop = this.createShield(itemDropOptions);
            break;

          case 2:
            itemToDrop = this.createWeapon(undefined, itemDropOptions);
            break;

          case 3:
            itemToDrop = this.createBoot(itemDropOptions);
            break;

          case 4:
            itemToDrop = this.createHelmet(itemDropOptions);
            break;

          case 5:
            itemToDrop = this.createArmor(itemDropOptions);
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

  createWeapon(damageAttribute?: Attribute, itemDropOptions: ItemDropOptions = {}) {
    const item = new WeaponItem();
    item.damageAttribute = damageAttribute || this.getRandomPrimaryAttribute();

    let ratio: number;
    let type: string;
    let goodness: number;

    let hasAttackDistance: boolean;

    if (item.damageAttribute === "strength") {
      ({ ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
        helpers.ENTITIES.WEAPON_1,
        helpers.ENTITIES.WEAPON_2,
        helpers.ENTITIES.WEAPON_3,
        helpers.ENTITIES.WEAPON_4,
        helpers.ENTITIES.WEAPON_5,
        helpers.ENTITIES.WEAPON_6,
        helpers.ENTITIES.WEAPON_7,
        helpers.ENTITIES.WEAPON_8,
        helpers.ENTITIES.WEAPON_9,
        helpers.ENTITIES.WEAPON_10,
      ]));

      hasAttackDistance = false;

    } else if (item.damageAttribute === "agility") {
      ({ ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
        helpers.ENTITIES.BOW_1,
        helpers.ENTITIES.BOW_2,
        helpers.ENTITIES.BOW_3,
        helpers.ENTITIES.BOW_4,
      ]));

      hasAttackDistance = true;

    } else if (item.damageAttribute === "intelligence") {
      item.manaCost = 2;

      ({ ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
        helpers.ENTITIES.WAND_1,
        helpers.ENTITIES.WAND_2,
        helpers.ENTITIES.WAND_3,
        helpers.ENTITIES.WAND_4,
      ]));

      hasAttackDistance = true;
    }

    item.type = type;

    let minDamage = goodness + 1;
    let maxDamage = minDamage * (ratio * 2);

    item.addModifier({
      attr: "damage",
      modifier: this.rand.intBetween(minDamage, maxDamage)
    });

    if (hasAttackDistance) {
      item.addModifier({
        attr: "attackDistance",
        modifier: this.rand.intBetween(goodness, goodness + 1)
      });
    }

    return item;
  }

  createShield (itemDropOptions: ItemDropOptions) {
    const item = new ShieldItem();

    const { ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
      helpers.ENTITIES.SHIELD_1,
      helpers.ENTITIES.SHIELD_2,
      helpers.ENTITIES.SHIELD_3,
      helpers.ENTITIES.SHIELD_4,
      helpers.ENTITIES.SHIELD_5,
      helpers.ENTITIES.SHIELD_6,
      helpers.ENTITIES.SHIELD_7,
      helpers.ENTITIES.SHIELD_8,
      helpers.ENTITIES.SHIELD_9,
      helpers.ENTITIES.SHIELD_10,
      helpers.ENTITIES.SHIELD_11,
      helpers.ENTITIES.SHIELD_12,
      helpers.ENTITIES.SHIELD_13,
      helpers.ENTITIES.SHIELD_14,
      helpers.ENTITIES.SHIELD_15,
      helpers.ENTITIES.SHIELD_16,
      helpers.ENTITIES.SHIELD_17,
      helpers.ENTITIES.SHIELD_18,
      helpers.ENTITIES.SHIELD_19,
      helpers.ENTITIES.SHIELD_20,
      helpers.ENTITIES.SHIELD_21,
      helpers.ENTITIES.SHIELD_22,
    ]);

    item.type = type;

    let minArmor = goodness / 2;
    let maxArmor = minArmor + ratio * 2;

    item.addModifier({
      attr: "armor",
      modifier: Math.round(this.rand.floatBetween(minArmor, maxArmor) * 100) / 100
    });


    return item;
  }

  createBoot(itemDropOptions: ItemDropOptions) {
    const item = new BootItem();

    const { ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
      helpers.ENTITIES.BOOTS_1,
      helpers.ENTITIES.BOOTS_2,
      helpers.ENTITIES.BOOTS_3,
      helpers.ENTITIES.BOOTS_4,
      helpers.ENTITIES.BOOTS_5,
      helpers.ENTITIES.BOOTS_6,
    ]);

    item.type = type;

    let minArmor = (goodness / 2);
    let maxArmor = minArmor + ratio * 2;

    item.addModifier({
      attr: "armor",
      modifier: Math.round(this.rand.floatBetween(minArmor, maxArmor) * 100) / 100
    });

    item.addModifier({
      attr: "movementSpeed",
      modifier: this.rand.intBetween(goodness, goodness + Math.ceil(ratio * 3))
    });

    return item;
  }

  createHelmet(itemDropOptions: ItemDropOptions) {
    const item = new HelmetItem();

    const { ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
      helpers.ENTITIES.HELMET_1,
      helpers.ENTITIES.HELMET_2,
      helpers.ENTITIES.HELMET_3,
      helpers.ENTITIES.HELMET_4,
      helpers.ENTITIES.HELMET_5,
      helpers.ENTITIES.HELMET_6,
      helpers.ENTITIES.HELMET_7,
      helpers.ENTITIES.HELMET_8,
      helpers.ENTITIES.HELMET_9,
      helpers.ENTITIES.HELMET_10,
      helpers.ENTITIES.HELMET_11,
      helpers.ENTITIES.HELMET_12,
      helpers.ENTITIES.HELMET_13,
      helpers.ENTITIES.HELMET_14,
      helpers.ENTITIES.HELMET_15,
      helpers.ENTITIES.HELMET_16,
      helpers.ENTITIES.HELMET_17,
      helpers.ENTITIES.HELMET_18,
      helpers.ENTITIES.HELMET_19,
      helpers.ENTITIES.HELMET_20,
      helpers.ENTITIES.HELMET_21,
      helpers.ENTITIES.HELMET_22,
      helpers.ENTITIES.HELMET_23,
      helpers.ENTITIES.HELMET_24,
      helpers.ENTITIES.HELMET_25,
      helpers.ENTITIES.HELMET_26,
      helpers.ENTITIES.HELMET_27,
      helpers.ENTITIES.HELMET_28,
      helpers.ENTITIES.HELMET_29,
      helpers.ENTITIES.HELMET_30,
      helpers.ENTITIES.HELMET_31,
      helpers.ENTITIES.HELMET_32,
      helpers.ENTITIES.HELMET_33,
    ]);

    item.type = type;

    let minArmor = (goodness / 3);
    let maxArmor = minArmor + ratio * 2;

    item.addModifier({
      attr: "armor",
      modifier: Math.round(this.rand.floatBetween(minArmor, maxArmor) * 100) / 100
    });

    return item;
  }

  createArmor(itemDropOptions: ItemDropOptions) {
    const item = new ArmorItem();

    // (old, used to be): 0.1 ~ 0.2
    // (now): 1 ~ 15
    const { ratio, type, goodness } = this.getItemGoodness(itemDropOptions, [
      helpers.ENTITIES.ARMOR_1,
      helpers.ENTITIES.ARMOR_2,
      helpers.ENTITIES.ARMOR_3,
      helpers.ENTITIES.ARMOR_4,
      helpers.ENTITIES.ARMOR_5,
      helpers.ENTITIES.ARMOR_6,
    ]);

    item.type = type;

    let minArmor = goodness;
    let maxArmor = minArmor + ratio * 2;

    item.addModifier({
      attr: "armor",
      modifier: Math.round(this.rand.floatBetween(minArmor, maxArmor) * 100) / 100
    });

    return item;
  }

  getItemGoodness(itemDropOptions: ItemDropOptions, typeOptions: string[]) {
    // (No limits!)
    // const maxGoodness = typeOptions.length - 1;

    const progressForMaxGoodness = 60;
    typeOptions.length
    const maxGoodness = typeOptions.length - 1;

    let difficulty = 2;

    let ratio: number = 1;
    let goodness = 0;

    while (
      goodness < maxGoodness &&
      this.rand.intBetween(0, difficulty) === 0
    )  {
      ratio += this.rand.floatBetween(0, 1);
      goodness++;
      // difficulty++;
    }

    if (itemDropOptions.isRare) {
    }

    if (itemDropOptions.isMagical) {
    }

    return { ratio, goodness, type: typeOptions[goodness] };
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
