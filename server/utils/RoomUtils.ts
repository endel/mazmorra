import gen, { RandomSeed } from "random-seed";

import helpers from "../../shared/helpers";

// entities
import { Attribute, Unit, StatsModifiers }  from "../entities/Unit";
import { Enemy }  from "../entities/Enemy";
import { Boss }  from "../entities/Boss";
import { NPC }  from "../entities/NPC";
import { Entity }  from "../entities/Entity";

// entity types
import { Item }  from "../entities/Item";

// items
import { Gold }  from "../entities/items/Gold";
import { Potion, POTION_1_MODIFIER, POTION_2_MODIFIER, POTION_3_MODIFIER, POTION_4_MODIFIER }  from "../entities/items/consumable/Potion";

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
import { ENEMY_CONFIGS, isBossMap, MapKind, isCheckPointMap, getMapKind, NUM_LEVELS_PER_LOOT_ROOM, NUM_LEVELS_PER_CHECKPOINT, MAX_LEVELS, MAX_WEAPON_DAMAGE, MAX_BOW_DAMAGE, MAX_STAFF_DAMAGE, MAX_BOW_ATTACK_DISTANCE, MAX_STAFF_ATTACK_DISTANCE, MAX_BOOTS_ARMOR, MAX_BOOTS_MOVEMENT_SPEED, MAX_HELMET_ARMOR, MAX_ARMOR_ARMOR, MAX_SHIELD_ARMOR, NUM_LEVELS_PER_MAP } from "./ProgressionConfig";
import { ConsumableItem } from "../entities/items/ConsumableItem";
import { EquipableItem } from "../entities/items/EquipableItem";
import { DBAttributeModifier } from "../db/Hero";
import { CheckPoint } from "../entities/interactive/CheckPoint";
import { Key } from "../entities/items/consumable/Key";
import { Leaderboard } from "../entities/interactive/Leaderboard";
import { Lever } from "../entities/interactive/Lever";
import { Jail } from "../entities/interactive/Jail";

const ALL_BOOTS = [
  helpers.ENTITIES.BOOTS_1,
  helpers.ENTITIES.BOOTS_2,
  helpers.ENTITIES.BOOTS_3,
  helpers.ENTITIES.BOOTS_4,
  helpers.ENTITIES.BOOTS_5,
  helpers.ENTITIES.BOOTS_6,
];

const ALL_SHIELDS = [
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
];

const ALL_HELMETS = [
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
  // helpers.ENTITIES.HELMET_25,
  // helpers.ENTITIES.HELMET_26,
  // helpers.ENTITIES.HELMET_27,
  // helpers.ENTITIES.HELMET_28,
  // helpers.ENTITIES.HELMET_29,
  // helpers.ENTITIES.HELMET_30,
  // helpers.ENTITIES.HELMET_31,
  // helpers.ENTITIES.HELMET_32,
  // helpers.ENTITIES.HELMET_33,
];

const ALL_ARMOR = [
  helpers.ENTITIES.ARMOR_1,
  helpers.ENTITIES.ARMOR_2,
  helpers.ENTITIES.ARMOR_3,
  helpers.ENTITIES.ARMOR_4,
  helpers.ENTITIES.ARMOR_5,
  helpers.ENTITIES.ARMOR_6,
];

const ALL_STAFFS = [
  helpers.ENTITIES.WAND_1,
  helpers.ENTITIES.WAND_2,
  helpers.ENTITIES.WAND_3,
  helpers.ENTITIES.WAND_4,
];

const ALL_BOWS = [
  helpers.ENTITIES.BOW_1,
  helpers.ENTITIES.BOW_2,
  helpers.ENTITIES.BOW_3,
  helpers.ENTITIES.BOW_4,
];

const ALL_WEAPONS = [
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
];

const ALL_POTION_MODIFIERS = [
  POTION_1_MODIFIER,
  POTION_2_MODIFIER,
  POTION_3_MODIFIER,
  POTION_4_MODIFIER,
];

export interface DungeonRoom {
  position: Point;
  size: Point;
  tiles: any[];
  walls: any[];
  branches: (Point & { dir: number })[];
}

export interface ItemDropOptions {
  progress?: number,
  isRare?: boolean,
  isMagical?: boolean,
  goodness?: number,
}

export interface ItemGoodness {
  ratio: number,
  tier: number, // 0~maxTier
  type: string
}

export class RoomUtils {

  // random generators!
  rand: RandomSeed;
  realRand: RandomSeed = gen.create();

  state: DungeonState;
  rooms: DungeonRoom[];
  cache = new WeakMap<DungeonRoom, Point[]>();

  startRoom: DungeonRoom;
  startPosition: any;
  startDoor: Door;

  endRoom: DungeonRoom;
  endPosition: any;
  endDoor: Door;

  hasSecretDoor: boolean = false;

  isBossDungeon: boolean = false;
  bosses?: Boss[];

  hasFountain: boolean = false;
  checkPoint?: CheckPoint;

  difficultyGap: number;

  constructor (rand, state, rooms: DungeonRoom[]) {
    this.rand = rand
    this.state = state
    this.rooms = rooms

    this.isBossDungeon = isBossMap(this.state.progress);
    this.difficultyGap = Math.floor(state.progress / NUM_LEVELS_PER_MAP);

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
    const room = this.getRandomRoom();
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

  getNextAvailablePosition (room: DungeonRoom, avoidCorners?) {
    let positions = this.cache.get(room)

    if (avoidCorners) {
      const index = positions.findIndex(position => {
        return position.y < room.position.x + room.size.x - 2 &&
        position.x < room.position.y + room.size.y - 2
      });

      return positions.splice(index, 1)[0];

    } else {
      return positions.shift()
    }
  }

  getRandomRoom(excluding?: DungeonRoom[]) {
    let room: DungeonRoom;

    do {
      room = this.rooms[this.rand.intBetween(0, this.rooms.length - 1)];

    } while (
      excluding !== undefined &&
      excluding.indexOf(room) !== -1 &&
      this.rooms.length > 1
    );

    return room;
  }

  populateRooms () {
    const isLocked = this.isBossDungeon;
    const isLastLevel = (this.state.progress === MAX_LEVELS - 1);

    // entrance
    this.startDoor = new Door(this.startPosition, new DoorDestiny({
      progress: DoorProgress.BACK
    }))
    this.state.addEntity(this.startDoor);

    // out
    // obs: door is locked on boss dungeons!
    this.endDoor = new Door(this.endPosition, new DoorDestiny({
      progress: DoorProgress.FORWARD
    }), isLocked)

    this.state.addEntity(this.endDoor);

    // create the BOSS for the dungeon.
    if (this.isBossDungeon) {
      if (!isLastLevel) {

        const bossType = this.state.config.boss[0];
        const boss = this.createEnemy(bossType, Boss) as Boss;
        boss.position.set(this.endPosition);
        boss.unitSpawner = ENEMY_CONFIGS[bossType].spawner;

        this.bosses = [boss];

        // drop key for next level!
        boss.dropOptions = { isRare: true, isMagical: true };

        this.state.addEntity(boss);

      } else {
        //
        // FINAL STAGE!!!!
        //
        let currentBoss = 0;

        this.rooms.forEach(room => {
          this.addEntity(room, (position) => {
            const isFirstBoss = (currentBoss === 0);
            const bossType = this.state.config.boss[(currentBoss++) % this.state.config.boss.length];
            const boss = this.createEnemy(bossType, (isFirstBoss) ? Boss : Enemy) as Boss;
            boss.position.set(position);

            if (isFirstBoss) {
              boss.unitSpawner = ENEMY_CONFIGS[bossType].spawner;
              boss.dropOptions = { isRare: true, isMagical: true };
              this.bosses = [boss];

            } else {
              boss.dropOptions = { isRare: true };
            }

            return boss;
          })
        });
      }

      this.bosses[0].thingsToUnlockWhenDead.push(this.endDoor);
    }

    if (((this.state.progress + 1) % NUM_LEVELS_PER_LOOT_ROOM) === 0) {
      this.hasSecretDoor = true;

      const secredDoorRoom = this.getRandomRoom([this.startRoom]);
      const doorPosition = this.getRandomDoorPosition(secredDoorRoom);

      const secretDoor = new Door(doorPosition, new DoorDestiny({
        progress: this.state.progress,
        room: "loot"
      }));
      secretDoor.isLocked = true;
      secretDoor.mapkind = getMapKind(this.state.progress, 2);

      // Easter Egg
      // During every 10 starting minutes of the hour, there's a lever
      // with 3 people required to open the loot room.
      var now = new Date();
      if (now.getMinutes() <= 10) {
        this.addEntity(secredDoorRoom, (position) => {
          const lever = new Lever(position);
          lever.unlock = [secretDoor];
          lever.numPlayersToUnlock = 3;
          return lever;
        });
      }

      this.state.addEntity(secretDoor);
    }

    // // 2 levels behind a checkpoint there's a lever to reach the latest room.
    // if (isCheckPointMap(this.state.progress + 2)) {
    //   const branch = this.endRoom.branches[0];
    //   if (branch) {
    //     const jail = new Jail({ x: branch.y, y: branch.x }, branch.dir);
    //     this.state.addEntity(jail);

    //     const randomRoom = this.getRandomRoom([this.endRoom])
    //     this.addEntity(randomRoom, (position) => {
    //       const lever = new Lever(position);
    //       lever.unlock = [jail];
    //       return lever;
    //     });
    //   }
    // }

    /**
     * JAIL TIME
     */
    let lockedRoom: DungeonRoom;
    if (
      this.rooms.length > 3 &&
      (this.state.progress % 2 === 0)
    ) {
      // -2 because the last room may have a boss
      const lockedRoomIndex = this.rand.intBetween(1, this.rooms.length - 2);
      lockedRoom = this.rooms[lockedRoomIndex];

      const branch = lockedRoom.branches[0];
      if (branch) {
        const jail = new Jail({ x: branch.y, y: branch.x }, branch.dir);
        this.state.addEntity(jail);

        const leverRoomIndex = this.rand.intBetween(0, lockedRoomIndex-1);

        this.addEntity(this.rooms[leverRoomIndex], (position) => {
          const lever = new Lever(position);
          lever.unlock = [jail];
          return lever;
        }, true);

        // create a higher level enemy inside jails
        this.addEntity(this.rooms[lockedRoomIndex], (position) => {
          const enemyList = this.state.config.strongerEnemies;
          const rand = this.realRand.intBetween(0, enemyList.length - 1);

          const enemy = this.createEnemy(
            enemyList[rand],
            Enemy,
            this.getEnemyLevel() + 4,
            { aiDistance: 20 }
          );
          enemy.position.set(position);
          enemy.dropOptions = {
            progress: this.state.progress + 10
          }
          return enemy;
        });
      }
    }

    // create checkpoint after "JAIL TIME", so we prevent placing checking after a locked room.
    if (isCheckPointMap(this.state.progress)) {
      const checkPointRoom = this.getRandomRoom(
        (lockedRoom)
          ? [lockedRoom, this.endRoom]
          : [this.endRoom]
      );
      this.rooms = this.rooms.filter(r => r !== checkPointRoom);

      this.checkPoint = new CheckPoint({
        x: checkPointRoom.position.y + Math.ceil(checkPointRoom.size.y / 2) - 1,
        y: checkPointRoom.position.x + Math.ceil(checkPointRoom.size.x / 2) - 1,
      })
      this.state.addEntity(this.checkPoint);
    }


    this.rooms.forEach(room => {
      if (this.isBossDungeon && room === this.endRoom) {
        this.populateBossRoom(room);

      } else {
        this.populateRoom(room);
      }
    });
  }

  populatePVP () {
    // entrance
    this.state.addEntity(new Door(this.startPosition, new DoorDestiny({
      progress: DoorProgress.HOME
    })));

    this.state.mapkind = MapKind.CASTLE;
    this.state.daylight = false;

    this.rooms.forEach(room => {
      for (let i=0; i<2; i++) {
        if (this.realRand.intBetween(0, 1) === 0) {
          this.addRandomAesthetics(room);
        }
      }
    });
  }

  populateRoomsWithLoot () {
    // entrance
    this.state.addEntity(new Door(this.startPosition, new DoorDestiny({
      progress: this.state.progress
    })));

    this.rooms.forEach(room => this.populateLootRoom(room));
  }

  populateRoom (room: DungeonRoom) {
    this.populateEnemies(room)

    // const chestTypes = ['chest', 'chest2', 'bucket'];
    // const chestKind = 'bucket';
    const chestKind = 'bucket';

    // add up to 3 chests per room.
    const numChests = this.rand.intBetween(1, 3);
    // const numChests = this.rand.intBetween(3, 5);
    for (let i = 0; i < numChests; i++) {
      this.addEntity(room, (position) => new Chest(position, chestKind))
    }

    // add a light pole!
    if (
      (
        this.state.mapkind === MapKind.ROCK ||
        this.state.mapkind === MapKind.CAVE ||
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

  populateLootRoom(room) {
    for (let i=0; i<1; i++) {
      this.addEntity(room, (position) => {
        const chest = new Chest(position, 'chest2')
        chest.itemDropOptions = {
          isRare: true,
          isMagical: this.realRand.intBetween(0, 1) === 0
        };
        return chest;
      }, true);
    }

    for (let i=0; i<3; i++) {
      this.addEntity(room, (position) => {
        const chest = new Chest(position, 'chest')
        chest.itemDropOptions = {
          isRare: true,
          isMagical: this.realRand.intBetween(0, 1) === 0
        };
        return chest;
      }, true);
    }

    for (let i=0; i<5; i++) {
      this.addEntity(room, (position) => {
        const chest = new Chest(position, 'bucket')
        chest.itemDropOptions = {
          isRare: true,
          isMagical: this.realRand.intBetween(0, 1) === 0
        };
        return chest;
      }, true);
    }

    for (let i=0; i<2; i++) {
      var entity = new Entity();
      entity.type = helpers.ENTITIES.AESTHETICS
      entity.walkable = true;
      entity.position.set(this.getNextAvailablePosition(room, true));
      this.state.addEntity(entity)
    }
  }

  populateBossRoom(room: DungeonRoom) {
    // 2 boss chests!
    for (let i=0; i<2; i++) {
      this.addEntity(room, (position) => {
        const chest = new Chest(position, 'chest2')
        chest.isLocked = true;
        chest.itemDropOptions = { isRare: true };

        // killing boss will unlock this chest
        this.bosses[0].thingsToUnlockWhenDead.push(chest);

        return chest;
      });
    }
  }

  populateLobby (rooms: DungeonRoom[]) {
    const room = this.startRoom;

    /**
     * Marchant
     */
    const merchant = new NPC('merchant', {}, this.state);
    merchant.wanderer = false;
    merchant.walkable = false;
    merchant.position.set(room.position.x + Math.floor(room.size.x / 2), room.position.y + 1);
    this.state.addEntity(merchant);

    // const merchantChest = new Chest({
    //   x: merchant.position.x + 1,
    //   y: merchant.position.y
    // }, 'chest', true);
    // merchantChest.walkable = false;
    // this.state.addEntity(merchantChest);

    /**
     * Elder
     */
    const elder = new NPC('elder', {}, this.state);
    elder.wanderer = false;
    elder.walkable = false;
    elder.position.set(room.position.x + 1, room.position.y + Math.floor(room.size.y / 2));
    this.state.addEntity(elder);

    // const elderChest = new Chest({
    //   x: elder.position.x,
    //   y: elder.position.y + 1
    // }, 'bucket', true);
    // elderChest.walkable = false;
    // this.state.addEntity(elderChest);

    this.state.addEntity(new Fountain({ x: elder.position.x, y: elder.position.y - 1 }));

    // add door
    this.endPosition = {
      x: merchant.position.x - 2,
      y: merchant.position.y
    };
    const initialDoor = new Door(this.endPosition, new DoorDestiny({
      progress: 2
    }));
    this.state.addEntity(initialDoor);

    // Start position on lobby
    this.startPosition = {
      x: room.position.y + Math.ceil(room.size.y / 2) - 1,
      y: room.position.x + Math.ceil(room.size.x / 2) - 1,
    }

    /**
     * Lady
     */
    const lady = new NPC('woman', {}, this.state);
    lady.wanderer = false;
    lady.walkable = false;
    lady.position.set(this.endRoom.position.y + 1, this.endRoom.position.x + Math.ceil(this.endRoom.size.x / 2) - 2);
    this.state.addEntity(lady);

    // Door for PVP
    const pvpDoor = new Door({
      x: lady.position.x + 4,
      y: lady.position.y - 1,
    }, new DoorDestiny({
      progress: this.realRand.intBetween(4, 6),
      room: "pvp"
    }));
    this.state.addEntity(pvpDoor);

    // Leaderboard
    const leaderboard = new Leaderboard({
      x: lady.position.x + 1,
      y: lady.position.y - 1,
    });
    this.state.addEntity(leaderboard);

    /**
     * Locksmith
     */
    this.addEntity(this.endRoom, (position) => {
      const locksmith = new NPC('locksmith', {}, this.state);
      locksmith.wanderer = true;
      locksmith.position.set(position);
      return locksmith;
    })

    /**
     * Majesty
     */
    this.addEntity(this.endRoom, (position) => {
      const majesty = new NPC('majesty', {}, this.state);
      majesty.wanderer = true;
      majesty.position.set(position);
      return majesty;
    })

    this.checkPoint = new CheckPoint({
      x: this.endRoom.position.y + Math.ceil(this.endRoom.size.y / 2) - 1,
      y: this.endRoom.position.x + Math.ceil(this.endRoom.size.x / 2) - 1,
    })
    this.state.addEntity(this.checkPoint);
  }

  populateEnemies (room: DungeonRoom) {
    if (room === this.startRoom || this.state.progress === MAX_LEVELS - 1) {
      // when in a boss dungeon, first room doens't have enemies!
      return;
    }

    // allow 0 enemies on room?
    const minEnemies = (this.realRand.intBetween(0, 3) === 0) ? 0 : 1;

    // const maxEnemies = (this.state.progress <= 8)
    //   ? 1
    //   : Math.min(this.state.progress, Math.floor((room.size.x * room.size.y) / 10));

    const maxEnemies = Math.min(this.state.progress, Math.floor((room.size.x * room.size.y) / 10));

    let numEnemies = this.realRand.intBetween(minEnemies, maxEnemies);

    const enemyList = this.state.config.enemies;

    while (numEnemies--) {
      this.addEntity(room, (position) => {
        const rand = this.realRand.intBetween(0, enemyList.length - 1);
        const enemy = this.createEnemy(enemyList[rand], Enemy);
        enemy.position.set(position);
        return enemy;
      })
    }
  }

  getEnemyLevel() {
    return Math.ceil(this.state.progress / 4);
  }

  createEnemy(
    type: string,
    enemyKlass: (new (...args: any[]) => Enemy) = Enemy,
    lvl = this.getEnemyLevel(),
    statBoost?: Partial<StatsModifiers>
  ): Enemy {
    // increase difficulty
    if (this.difficultyGap > 0) {
      lvl += (3 * this.difficultyGap);
    }

    const attributes = ENEMY_CONFIGS[type];

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

    // boost given stats
    if (statBoost) {
      for (let statName in statBoost) {
        if (!modifiers[statName]) {
          modifiers[statName] = 0;
        }
        modifiers[statName] += statBoost[statName];
      }
    }

    const enemy = new enemyKlass(type, baseAttributes, modifiers);
    enemy.state = this.state;

    // equip enemy!
    if (baseAttributes.primaryAttribute === "intelligence") {
      const equipment = this.createWeapon("intelligence", { progress: 1 });
      enemy.equipedItems.add(equipment);
    }

    return enemy;
  }

  addRandomAesthetics (room) {
    if (!this.hasPositionsRemaining(room)) {
      return;
    }

    var entity = new Entity();
    entity.type = helpers.ENTITIES.AESTHETICS
    entity.walkable = true;
    entity.position.set(this.getNextAvailablePosition(room, true));
    this.state.addEntity(entity)
  }

  addEntity (room: DungeonRoom, getEntity, avoidCorners?: boolean) {
    if (this.hasPositionsRemaining(room)) {
      this.state.addEntity(getEntity(this.getNextAvailablePosition(room, avoidCorners)))
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

    const chance = this.realRand.floatBetween(0, 1);

    let itemToDrop: Item;
    // itemToDrop = new Scroll();

    // 0~10% don't drop anything.
    if (chance >= 0.1) {

      // gold
      if (chance < 0.5) {
        const amount = this.realRand.intBetween(this.state.progress, this.state.progress * 1.5);
        itemToDrop = new Gold(amount);

      // potion
      } else if (chance < 0.75) {

        itemToDrop = new Potion();
        const potionTypeChance = this.realRand.floatBetween(0, 1);

        let modifierIndex = 0;
        // 30% chance to drop current level potion
        if (this.realRand.floatBetween(0, 1) > 0.6) {
          // let ratio = this._sineOut(this.state.progress / MAX_LEVELS);
          let ratio = this.state.progress / MAX_LEVELS;
          const totalPotionModifiers = ALL_POTION_MODIFIERS.length;
          modifierIndex = Math.floor(ratio * totalPotionModifiers);
          // cap max tier
          if (modifierIndex > totalPotionModifiers - 1) { modifierIndex = totalPotionModifiers - 1; }
        }

        if (potionTypeChance < 0.8) {
          itemToDrop.addModifier({ attr: "hp", modifier: ALL_POTION_MODIFIERS[modifierIndex] });

        } else if (potionTypeChance < 0.98) {
          itemToDrop.addModifier({ attr: "mp", modifier: ALL_POTION_MODIFIERS[modifierIndex] });

        } else {
          itemToDrop.addModifier({ attr: "xp", modifier: ALL_POTION_MODIFIERS[modifierIndex] });
        }

      // common item
      } else if (chance < 0.99) {
        const dropOptions: ItemDropOptions = {
          progress: this.state.progress,
          isRare: (this.state.progress > NUM_LEVELS_PER_CHECKPOINT && chance >= 0.965),
          isMagical: (this.state.progress > NUM_LEVELS_PER_CHECKPOINT && chance >= 0.990)
        };

        const itemType = this.realRand.intBetween(0, 5);
        switch (itemType) {
          case 0:
            itemToDrop = new Scroll();
            break;

          case 1:
            itemToDrop = this.createShield(dropOptions);
            break;

          case 2:
            itemToDrop = this.createWeapon(undefined, dropOptions);
            break;

          case 3:
            itemToDrop = this.createBoot(dropOptions);
            break;

          case 4:
            itemToDrop = this.createHelmet(dropOptions);
            break;

          case 5:
            itemToDrop = this.createArmor(dropOptions);
            break;
        }

        // if (itemToDrop instanceof EquipableItem) {
        //   this.assignEquipableItemModifiers(itemToDrop);
        // }

      } else if (chance >= 0.995) {
        // drop diamond!
        const amount = this.realRand.intBetween(1, 2);
        itemToDrop = new Diamond(amount);

      }
    } else {
      // empty drop
    }

    return itemToDrop;
  }

  createItemByDropOptions (dropOptions: ItemDropOptions) {
    let itemToDrop: Item;

    const itemType = this.realRand.intBetween(0, 5);

    switch (itemType) {
      case 0:
        itemToDrop = new Diamond(this.realRand.intBetween(2, 3));
        break;

      case 1:
        itemToDrop = this.createShield(dropOptions);
        break;

      case 2:
        itemToDrop = this.createWeapon(undefined, dropOptions);
        break;

      case 3:
        itemToDrop = this.createBoot(dropOptions);
        break;

      case 4:
        itemToDrop = this.createHelmet(dropOptions);
        break;

      case 5:
        itemToDrop = this.createArmor(dropOptions);
        break;
    }

    return itemToDrop;
  }

  getRandomPrimaryAttribute() {
    const attributes = ['strength', 'agility', 'intelligence'];
    return attributes[this.realRand.intBetween(0, 2)] as Attribute;
  }

  createWeapon(damageAttribute?: Attribute, dropOptions: ItemDropOptions = {}) {
    const item = new WeaponItem();
    item.damageAttribute = damageAttribute || this.getRandomPrimaryAttribute();

    // let ratio: number;
    // let type: string;
    // let goodness: number;

    let hasAttackDistance: boolean;
    let goodness: ItemGoodness;

    let minDamage: number;
    let maxDamage: number;

    let minAttackDistance: number;
    let maxAttackDistance: number;

    if (item.damageAttribute === "strength") {
      goodness = this.getItemGoodness(dropOptions, ALL_WEAPONS);

      minDamage = Math.floor(MAX_WEAPON_DAMAGE * goodness.ratio);
      maxDamage = Math.ceil(MAX_WEAPON_DAMAGE * goodness.ratio);

      hasAttackDistance = false;

    } else if (item.damageAttribute === "agility") {
      goodness = this.getItemGoodness(dropOptions, ALL_BOWS);

      minDamage = Math.floor(MAX_BOW_DAMAGE * goodness.ratio);
      maxDamage = Math.ceil(MAX_BOW_DAMAGE * goodness.ratio);

      hasAttackDistance = true;
      minAttackDistance = Math.max(1, Math.floor(MAX_BOW_ATTACK_DISTANCE * goodness.ratio));
      maxAttackDistance = Math.ceil(MAX_BOW_ATTACK_DISTANCE * goodness.ratio);

    } else if (item.damageAttribute === "intelligence") {
      item.manaCost = 2;
      goodness = this.getItemGoodness(dropOptions, ALL_STAFFS);

      minDamage = Math.floor(MAX_STAFF_DAMAGE * goodness.ratio);
      maxDamage = Math.ceil(MAX_STAFF_DAMAGE * goodness.ratio);

      hasAttackDistance = true;
      minAttackDistance = Math.max(1, Math.floor(MAX_STAFF_ATTACK_DISTANCE * goodness.ratio));
      maxAttackDistance = Math.ceil(MAX_STAFF_ATTACK_DISTANCE * goodness.ratio);
    }

    item.type = goodness.type;

    item.addModifier({
      attr: "damage",
      modifier: Math.max(1, this.realRand.intBetween(minDamage, maxDamage))
    });

    if (hasAttackDistance) {
      item.addModifier({
        attr: "attackDistance",
        modifier: this.realRand.intBetween(minAttackDistance, maxAttackDistance)
      });
    }

    if (dropOptions.isRare) {
      item.isRare = true;
      this.assignBetterItemModifiers(item, ['attackSpeed', 'evasion', 'damage', 'criticalStrikeChance'], goodness);
    }

    if (dropOptions.isMagical) {
      item.isMagical = true;
      this.assignBetterItemModifiers(item, ['strength', 'intelligence', 'agility'], goodness);
    }

    this.setItemProgressRequired(item);

    return item;
  }

  createShield (dropOptions: ItemDropOptions) {
    const item = new ShieldItem();

    const goodness = this.getItemGoodness(dropOptions, ALL_SHIELDS);
    item.type = goodness.type;

    let minArmor = Math.floor(MAX_SHIELD_ARMOR * goodness.ratio);
    let maxArmor = Math.ceil(MAX_SHIELD_ARMOR * goodness.ratio);

    item.addModifier({
      attr: "armor",
      modifier: Math.round(Math.max(0.1, this.realRand.floatBetween(minArmor, maxArmor)) * 10) / 10
    });

    if (dropOptions.isRare) {
      item.isRare = true;
      this.assignBetterItemModifiers(item, ['armor', 'evasion', 'criticalStrikeChance'], goodness);
    }

    if (dropOptions.isMagical) {
      item.isMagical = true;
      this.assignBetterItemModifiers(item, ['strength', 'intelligence', 'agility'], goodness);
    }

    this.setItemProgressRequired(item);

    return item;
  }

  createBoot(dropOptions: ItemDropOptions) {
    const item = new BootItem();

    const goodness = this.getItemGoodness(dropOptions, ALL_BOOTS);
    item.type = goodness.type;

    let minArmor = Math.floor(MAX_BOOTS_ARMOR * goodness.ratio);
    let maxArmor = Math.ceil(MAX_BOOTS_ARMOR * goodness.ratio);

    item.addModifier({
      attr: "armor",
      modifier: Math.round(Math.max(0.1, this.realRand.floatBetween(minArmor, maxArmor)) * 10) / 10
    });

    const movementSpeed = this.realRand.intBetween(Math.floor(MAX_BOOTS_MOVEMENT_SPEED * goodness.ratio), Math.ceil(MAX_BOOTS_MOVEMENT_SPEED * goodness.ratio));
    if (movementSpeed > 0) {
      item.addModifier({ attr: "movementSpeed", modifier: movementSpeed });
    }

    if (dropOptions.isRare) {
      item.isRare = true;
      this.assignBetterItemModifiers(item, ['armor', 'movementSpeed', 'evasion'], goodness);
    }

    if (dropOptions.isMagical) {
      item.isMagical = true;
      this.assignBetterItemModifiers(item, ['strength', 'intelligence', 'agility'], goodness);
    }

    this.setItemProgressRequired(item);

    return item;
  }

  createHelmet(dropOptions: ItemDropOptions) {
    const item = new HelmetItem();

    const goodness = this.getItemGoodness(dropOptions, ALL_HELMETS);
    item.type = goodness.type;

    let minArmor = Math.floor(MAX_HELMET_ARMOR * goodness.ratio);
    let maxArmor = Math.ceil(MAX_HELMET_ARMOR * goodness.ratio);

    item.addModifier({
      attr: "armor",
      modifier: Math.round(Math.max(0.1, this.realRand.floatBetween(minArmor, maxArmor)) * 10) / 10
    });

    if (dropOptions.isRare) {
      item.isRare = true;
      this.assignBetterItemModifiers(item, ['armor', 'evasion'], goodness);
    }

    if (dropOptions.isMagical) {
      item.isMagical = true;
      this.assignBetterItemModifiers(item, ['strength', 'intelligence', 'agility'], goodness);
    }

    this.setItemProgressRequired(item);

    return item;
  }

  createArmor(dropOptions: ItemDropOptions) {
    const item = new ArmorItem();

    // (old, used to be): 0.1 ~ 0.2
    // (now): 1 ~ 15
    const goodness = this.getItemGoodness(dropOptions, ALL_ARMOR);
    item.type = goodness.type;

    let minArmor = Math.floor(MAX_ARMOR_ARMOR * goodness.ratio);
    let maxArmor = Math.ceil(MAX_ARMOR_ARMOR * goodness.ratio);

    item.addModifier({
      attr: "armor",
      modifier: Math.round(Math.max(0.1, this.realRand.floatBetween(minArmor, maxArmor)) * 10) / 10
    });

    if (dropOptions.isRare) {
      item.isRare = true;
      this.assignBetterItemModifiers(item, ['armor', 'evasion', 'attackSpeed'], goodness);
    }

    if (dropOptions.isMagical) {
      item.isMagical = true;
      this.assignBetterItemModifiers(item, ['strength', 'intelligence', 'agility'], goodness);
    }

    this.setItemProgressRequired(item);

    return item;
  }

  getItemGoodness(dropOptions: ItemDropOptions, allTiers: string[]): ItemGoodness {
    // ensure progress is defined.
    if (!dropOptions.progress) {
      dropOptions.progress = this.state.progress;
    }

    const totalTiers = allTiers.length;
    let ratio = dropOptions.progress / MAX_LEVELS;

    const ONE_LEVEL_RATIO = 1 / MAX_LEVELS;
    if (dropOptions.isRare) {
      ratio += this.realRand.floatBetween(ONE_LEVEL_RATIO, ONE_LEVEL_RATIO * 2);
    }

    if (dropOptions.isMagical) {
      ratio += this.realRand.floatBetween(ONE_LEVEL_RATIO, ONE_LEVEL_RATIO * 2);
    }

    // cap max tier
    let tier = Math.floor(ratio * totalTiers);
    if (tier > totalTiers - 1) { tier = totalTiers - 1; }

    return { ratio, tier, type: allTiers[tier] };
  }

  setItemProgressRequired(item: EquipableItem) {
    item.progressRequired = Math.max(2, this.state.progress - NUM_LEVELS_PER_CHECKPOINT);
  }

  // assignItemModifier(item: Item, options)

  assignBetterItemModifiers(item: EquipableItem, allowedModifiers: (keyof StatsModifiers)[], itemGoodness: ItemGoodness) {
    const modifiers: DBAttributeModifier[] = [];

    const shuffledModifiers = this.shuffleReal(allowedModifiers)

    for (let i=0; i<shuffledModifiers.length; i++) {
      if (this.realRand.intBetween(0, i) === 0) {
        let attr = shuffledModifiers[i];
        let modifier = this.realRand.intBetween(1, Math.ceil(itemGoodness.ratio));
        modifiers.push({ attr, modifier });
      };
    }

    modifiers.forEach(modifier => {
      const existingModifier = item.getModifier(modifier.attr)
      if (existingModifier) {
        existingModifier.modifier += modifier.modifier;

        if (modifier.attr === "armor") {
          existingModifier.modifier = Math.round(existingModifier.modifier * 10) / 10;
        }

      } else {
        item.addModifier(modifier);
      }
    });
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

  shuffleReal (array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * i);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  _sineOut(t) {
    return Math.sin(t * Math.PI / 2)
  }

  // not used anymore
  _quadOut(t) {
    return -t * (t - 2.0);
  }

}
