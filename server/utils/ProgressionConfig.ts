import { DBHero } from "../db/Hero";
import { StatsModifiers } from "../entities/Unit";
import { UnitSpawner } from "../entities/Boss";

export enum MapKind {
  ROCK = 'rock',
  CAVE = 'cave',
  ICE = 'ice',
  GRASS = 'grass',
  INFERNO = 'inferno',
  CASTLE = 'castle',
};

export type MapMonsterList = {
  day: {regular: string[], boss?: string[]},
  night: { regular: string[], boss ?: string[] },
};

export type MapConfig = {
  daylight: boolean,
  mapkind: MapKind,

  getMapWidth: (progress: number) => number,
  getMapHeight: (progress: number) => number,
  minRoomSize: {x: number, y: number},
  maxRoomSize: {x: number, y: number},

  enemies: {[id: string]: number},
  boss?: string[]
};

export const NUM_LEVELS_PER_MAP = 18;
// export const NUM_LEVELS_PER_MAP = 4;
export const NUM_LEVELS_PER_CHECKPOINT = 8;
export const NUM_LEVELS_PER_LOOT_ROOM = 12;

/**
 * Maximum attribute modifiers
 */
export const MAX_HELMET_ARMOR = 15;
export const MAX_SHIELD_ARMOR = 20;
export const MAX_ARMOR_ARMOR = 75;

export const MAX_BOOTS_ARMOR = 10;
export const MAX_BOOTS_MOVEMENT_SPEED = 12;

export const MAX_WEAPON_DAMAGE = 30;

export const MAX_BOW_DAMAGE = 20;
export const MAX_BOW_ATTACK_DISTANCE = 6;

export const MAX_STAFF_DAMAGE = 14;
export const MAX_STAFF_ATTACK_DISTANCE = 7;

export function getMapKind(progress: number, multiplier: number = 0) {
  const config = getMapConfig(progress + (NUM_LEVELS_PER_MAP * multiplier));
  return (config && config.mapkind) || MapKind.INFERNO;
}

export function getMapConfig(progress: number, roomType?: string) {
  if (roomType === "loot") {
    return {
      daylight: Math.random() > 0.5,
      mapkind: getMapKind(progress, 2),
      getMapWidth: (progress: number) => 20,
      getMapHeight: (progress: number) => 20,
      minRoomSize: { x: 6, y: 6 },
      maxRoomSize: { x: 6, y: 6 },
      enemies: {}
    }

  } else if (progress === 1 || progress === MAX_LEVELS) {
    // castle / lobby!
    const size = 24;
    return {
      daylight: true,
      mapkind: (progress === MAX_LEVELS)
        ? MapKind.INFERNO
        : MapKind.CASTLE,
      getMapWidth: (progress: number) => size,
      getMapHeight: (progress: number) => size,
      minRoomSize: { x: 8, y: 8 },
      maxRoomSize: { x: 8, y: 8 },
      enemies: {}
    }
  } else {
    const index = Math.floor(progress / NUM_LEVELS_PER_MAP);
    return MAP_CONFIGS[index];
  }
}

export function isBossMap(progress: number) {
  // is the last level for this map config?
  return ((progress + 1) % NUM_LEVELS_PER_MAP) === 0;
}

export function isCheckPointMap(progress: number) {
  return ((progress + 1) % NUM_LEVELS_PER_CHECKPOINT) === 0;
}

export const MAP_CONFIGS: MapConfig[] = [
  {
    daylight: true,
    mapkind: MapKind.ROCK,
    getMapWidth: (progress: number) => 15 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 15 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 7, y: 7 },
    enemies: { 'bat': 0.33, 'rat': 0.33, 'spider': 0.33, 'spider-medium': 0.01 },
    boss: ['spider-giant']
  },

  {
    daylight: false,
    mapkind: MapKind.CAVE,
    getMapWidth: (progress: number) => 16 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 16 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'slime': 0.33, 'slime-2': 0.33, 'skeleton-1': 0.33, 'slime-cube': 0.01, },
    boss: ['slime-big']
  },

  {
    daylight: true,
    mapkind: MapKind.GRASS,
    getMapWidth: (progress: number) => 17 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 17 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'skeleton-1': 0.33, 'skeleton-2': 0.33, 'skeleton-3': 0.33, 'spider-medium': 0.01 },
    boss: ['necromancer']
  },

  {
    daylight: false,
    mapkind: MapKind.GRASS,
    getMapWidth: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'goblin': 0.33, 'goblin-2': 0.33, 'goblin-3': 0.33, 'skeleton-2': 0.01 },
    boss: ['goblin-boss']
  },

  {
    daylight: true,
    mapkind: MapKind.INFERNO,
    getMapWidth: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'lava-ogre': 0.33, 'lava-totem': 0.33, 'beholder': 0.33, 'golem': 0.01 },
    boss: ['scorpion-boss']
    // boss: ['evil-majesty']
  },

  {
    daylight: false,
    mapkind: MapKind.INFERNO,
    getMapWidth: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'demon': 0.33, 'lava-totem': 0.33, 'beholder': 0.33, 'winged-demon': 0.01 },
    boss: ['monkey-king', 'scorpion-boss', 'goblin-boss', 'necromancer', 'slime-big', 'spider-giant']
  },

];

export const MAX_LEVELS = MAP_CONFIGS.length * NUM_LEVELS_PER_MAP;;

export const MONSTER_BASE_ATTRIBUTES: {
  [id: string]: {
    base: Partial<DBHero>,
    modifiers: Partial<StatsModifiers>,
    spawner?: UnitSpawner
  }
} = {
  // MapType.ROCK
  'bat': {
    base: {
      primaryAttribute: "strength",
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    modifiers: {
      damage: 1
    }
  },

  'rat': {
    base: {
      primaryAttribute: "strength",
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    modifiers: {
      damage: 2
    }
  },

  'spider': {
    base: {
      primaryAttribute: "strength",
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    modifiers: {
      damage: 1
    }
  },

  'scorpion': {
    base: {
      primaryAttribute: "strength",
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    modifiers: {
      damage: 10
    }
  },


  'spider-medium': {
    base: {
      primaryAttribute: "strength",
      strength: 3,
      agility: 2,
      intelligence: 1,
    },
    modifiers: {
      damage: 3
    }
  },

  'spider-giant': {
    base: {
      primaryAttribute: "strength",
      strength: 15,
      agility: 4,
      intelligence: 1,
    },
    modifiers: {
      damage: 5,
      hp: 70
    },
    spawner: {
      type: ['spider'],
      lvl: 2
    }
  },

  'slime': {
    base: {
      primaryAttribute: "strength",
      strength: 3,
      agility: 2,
      intelligence: 1,
    },
    modifiers: {
      damage: 2
    }
  },

  'slime-2': {
    base: {
      primaryAttribute: "strength",
      strength: 3,
      agility: 2,
      intelligence: 1,
    },
    modifiers: {
      damage: 2
    }
  },

  'slime-cube': {
    base: {
      primaryAttribute: "strength",
      strength: 4,
      agility: 1,
      intelligence: 1,
    },
    modifiers: {
      damage: 2
    }
  },

  'slime-big': {
    base: {
      primaryAttribute: "strength",
      strength: 8,
      agility: 2,
      intelligence: 1,
    },
    modifiers: {
      damage: 8,
      hp: 200
    }
  },
  //////////


  'skeleton-1': {
    base: {
      primaryAttribute: "strength",
      strength: 5,
      agility: 2,
      intelligence: 1
    },
    modifiers: {}
  },
  'skeleton-2': {
    base: {
      primaryAttribute: "agility",
      strength: 5,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      attackDistance: 2
    }
  },
  'skeleton-3': {
    base: {
      primaryAttribute: "strength",
      strength: 6,
      agility: 3,
      intelligence: 2
    },
    modifiers: {
      damage: 3
    }
  },
  'necromancer': {
    base: {
      primaryAttribute: "intelligence",
      strength: 2,
      agility: 3,
      intelligence: 5
    },
    modifiers: {
      damage: 10,
      hp: 250
    },
    spawner: {
      type: ['skeleton-1', 'skeleton-2'],
      lvl: 5
    }
  },
  //////////

  'goblin': {
    base: {
      primaryAttribute: "strength",
      strength: 6,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 4
    }
  },
  'goblin-2': {
    base: {
      primaryAttribute: "strength",
      strength: 5,
      agility: 2,
      intelligence: 1
    },
    modifiers: {}
  },
  'goblin-3': {
    base: {
      primaryAttribute: "agility",
      strength: 4,
      agility: 6,
      intelligence: 2
    },
    modifiers: {
      movementSpeed: 5,
      attackSpeed: 5
    }
  },
  'goblin-boss': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 5,
      intelligence: 3
    },
    modifiers: {
      damage: 12,
      hp: 300,
      movementSpeed: 2,
      attackSpeed: 3
    }
  },
  //////////

  'lava-ogre': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 50,
    }
  },

  'lava-totem': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 50,
    }
  },

  'beholder': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 50,
    }
  },

  'golem': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 100,
    }
  },

  'scorpion-boss': {
    base: {
      primaryAttribute: "strength",
      strength: 10,
      agility: 5,
      intelligence: 5
    },
    modifiers: {
      damage: 10,
      hp: 500,
      movementSpeed: 2,
      attackSpeed: 3
    },
    spawner: {
      type: ['scorpion'],
      lvl: 2
    }
  },

  // 'evil-majesty': {
  //   base: {
  //     primaryAttribute: "intelligence",
  //     strength: 5,
  //     agility: 5,
  //     intelligence: 10
  //   },
  //   modifiers: {
  //     damage: 10,
  //     hp: 500,
  //     movementSpeed: 2,
  //     attackSpeed: 3
  //   }
  // },

  //////////////

  'demon': {
    base: {
      primaryAttribute: "strength",
      strength: 15,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 50,
    }
  },

  'winged-demon': {
    base: {
      primaryAttribute: "strength",
      strength: 20,
      agility: 2,
      intelligence: 1
    },
    modifiers: {
      damage: 5,
      hp: 50,
    }
  },

  'monkey-king': {
    base: {
      primaryAttribute: "agility",
      strength: 10,
      agility: 20,
      intelligence: 10
    },
    modifiers: {
      damage: 20,
      hp: 5000,
      movementSpeed: 10,
      attackSpeed: 10
    },
    spawner: {
      type: ['monkey'],
      lvl: 20,
    }
  },

  'monkey': {
    base: {
      primaryAttribute: "agility",
      strength: 5,
      agility: 10,
      intelligence: 5
    },
    modifiers: {
      damage: 10,
      movementSpeed: 5,
      attackSpeed: 5
    }
  },

  // 'demon-majesty': {
  //   base: {
  //     primaryAttribute: "intelligence",
  //     strength: 5,
  //     agility: 5,
  //     intelligence: 20
  //   },
  //   modifiers: {
  //     damage: 20,
  //     hp: 1000,
  //     movementSpeed: 3,
  //     attackSpeed: 3
  //   }
  // },

  //////////////

};
