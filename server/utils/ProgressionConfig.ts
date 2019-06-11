import { DBHero } from "../db/Hero";
import { StatsModifiers } from "../entities/Unit";

export enum MapType {
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

export type MapMonsterList = { day: string[], night: string[], boss?: string[] };

export const MONSTERS_BY_MAP: { [key in MapType]: MapMonsterList } = {
  [MapType.ROCK]: {
    day: ['bat', 'rat', 'spider'],
    night: ['spider-medium', 'slime-cube'],
    boss: ['spider-giant']
  },

  [MapType.ROCK_2]: {
    day: [],
    night: [],
  },

  [MapType.ICE]: {
    day: [],
    night: [],
  },

  [MapType.GRASS]: {
    day: [],
    night: [],
  },

  [MapType.INFERNO]: {
    day: [],
    night: [],
  },

  [MapType.CASTLE]: {
    day: [],
    night: [],
  },
}

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

  'spider-giant': {
    base: {
      primaryAttribute: "strength",
      strength: 6,
      agility: 3,
      intelligence: 1,
    },
    modifiers: {
      damage: 3
    }
  },

  // MapType.ROCK_2
}
