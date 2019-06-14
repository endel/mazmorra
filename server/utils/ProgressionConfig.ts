import { DBHero } from "../db/Hero";
import { StatsModifiers } from "../entities/Unit";

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
  enemies: {[id: string]: number},
  boss?: string[]
};

export function getMapConfig(progress: number) {
  if (progress === 1) {
    // village / lobby!
    return {
      daylight: true,
      mapkind: MapKind.CASTLE,
      enemies: {}
    }
  } else {
    const index = Math.floor(progress / 10);
    return MAP_CONFIGS[index];
  }
}

export const MAP_CONFIGS: MapConfig[] = [
  {
    daylight: true,
    mapkind: MapKind.ROCK,
    enemies: { 'bat': 0.33, 'rat': 0.33, 'spider': 0.33, 'spider-medium': 0.01 },
    boss: ['spider-giant']
  },

  {
    daylight: false,
    mapkind: MapKind.ROCK,
    enemies: { 'slime': 0.33, 'slime-2': 0.33, 'skeleton': 0.33, 'slime-cube': 0.01, },
    boss: ['slime-big']
  },

];

export const MONSTER_BASE_ATTRIBUTES: {
  [id: string]: {
    base: Partial<DBHero>,
    modifiers: Partial<StatsModifiers>
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
      hp: 50
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
      damage: 5
    }
  },

  'skeleton': {
    base: {
      primaryAttribute: "strength",
      strength: 2,
      agility: 3,
      intelligence: 1,
    },
    modifiers: {
      damage: 2
    }
  },

  // MapType.ROCK_2
}
