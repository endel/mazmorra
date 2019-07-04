import { DBHero } from "../db/Hero";
import { StatsModifiers } from "../entities/Unit";
import { UnitSpawner } from "../entities/Boss";

export enum MapKind {
  ROCK = 'rock',
  ROCK_2 = 'rock-2',
  ICE = 'ice',
  GRASS = 'grass',
  INFERNO = 'inferno',
  CASTLE = 'castle',
};

// const enemyList = [
//   'bat',
//   'rat',
//   'spider',
//   'spider-medium',
//   'spider-giant',
//   'slime',
//   'slime-cube',
//   'slime-2',
//   'slime-big',
//   'eye',
//   'fairy',
//   'fat-zombie',
//   'flying-eye',
//   'frog',
//   'spider-giant',
//   'glass-eye',
//   'goblin-2',
//   'goblin-3',
//   'goblin-boss',
//   'goblin',
//   'golem',
//   'lava-ogre',
//   'lava-totem',
//   'minion',
//   'monkey',
//   'octopus-boss',
//   'owl',
//   'rabbit',
//   'scorpio-boss',
//   'skeleton-2',
//   'skeleton',
//   'snow-goblin-boss',
//   'snow-minion-2',
//   'snow-minion',
//   'witch',
//   'zombie'
// ];

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
export const NUM_LEVELS_PER_CHECKPOINT = 8;
export const NUM_LEVELS_PER_LOOT_ROOM = 12;

export function getMapKind(progress: number, multiplier: number = 0) {
  return getMapConfig(progress + (NUM_LEVELS_PER_MAP * multiplier)).mapkind;
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

  } else if (progress === 1) {
    // castle / lobby!
    const size = 24;
    return {
      daylight: true,
      mapkind: MapKind.CASTLE,
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
    mapkind: MapKind.ROCK,
    getMapWidth: (progress: number) => 17 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 17 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'slime': 0.33, 'slime-2': 0.33, 'skeleton-1': 0.33, 'slime-cube': 0.01, },
    boss: ['slime-big']
  },

  {
    daylight: true,
    mapkind: MapKind.GRASS,
    getMapWidth: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 18 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'skeleton-1': 0.33, 'skeleton-2': 0.33, 'skeleton-3': 0.33, 'spider-medium': 0.01 },
    boss: ['necromancer']
  },

  {
    daylight: false,
    mapkind: MapKind.GRASS,
    getMapWidth: (progress: number) => 19 + progress % NUM_LEVELS_PER_MAP,
    getMapHeight: (progress: number) => 19 + progress % NUM_LEVELS_PER_MAP,
    minRoomSize: { x: 6, y: 6 },
    maxRoomSize: { x: 9, y: 9 },
    enemies: { 'goblin': 0.33, 'goblin-2': 0.33, 'goblin-3': 0.33, 'skeleton-2': 0.01 },
    boss: ['goblin-boss']
  },

];

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
  }
  //////////
}
