var helpers = {

    randElm: function(rand, array, start, end) {
        //ensure we have an array, and there are elements to check
        if(!array || !array.length)
            return null;

        //special case for 1 element
        if(array.length === 1)
            return array[0];

        //default for start
        if(!start || start < 0)
            start = start || 0;

        //default for end
        if(!end || end < 0)
            end = array.length - 1;

        return array[ rand.intBetween(start, end) ];
    },

    // useful constants
    TILE_TYPE: {
        EMPTY: 0,
        WALL: 1,
        FLOOR: 2
    },

    DIRECTION: {
        NONE: 1024,
        NORTH: 2048,
        SOUTH: 4096,
        EAST: 8192,
        WEST: 16384
    },

    CORNER: 65536,

    // game entities
    ENTITIES: {
      DOOR: '0',
      LIGHT: '1',
      CHEST: '3',
      PLAYER: '10',
      TEXT_EVENT: '11',

      JAIL: '12',

      NPC: '20',

      // gold / diamond
      GOLD: 'gold',
      GOLD_BAG: 'gold-bag',
      DIAMOND: 'diamond',

      // potions
      HP_POTION_1: 'hp-potion-1',
      HP_POTION_2: 'hp-potion-2',
      HP_POTION_3: 'hp-potion-3',
      HP_POTION_4: 'hp-potion-4',
      MP_POTION_1: 'mp-potion-1',
      MP_POTION_2: 'mp-potion-2',
      MP_POTION_3: 'mp-potion-3',
      MP_POTION_4: 'mp-potion-4',
      XP_POTION_1: 'xp-potion-1',
      XP_POTION_2: 'xp-potion-2',
      XP_POTION_3: 'xp-potion-3',
      XP_POTION_4: 'xp-potion-4',
      ELIXIR_POTION_1: 'elixir-1',
      ELIXIR_POTION_2: 'elixir-2',
      ELIXIR_POTION_3: 'elixir-3',
      ELIXIR_POTION_4: 'elixir-4',
      POINTS_POTION_1: 'points-1',
      POINTS_POTION_2: 'points-2',
      POINTS_POTION_3: 'points-3',
      POINTS_POTION_4: 'points-4',

      // scrolls / books
      SCROLL: 'scroll-regular',
      SCROLL_MAGIC: 'scroll-magic',
      SCROLL_GREEN: 'scroll-green',
      SCROLL_BLUE: 'scroll-blue',

      BOOK: 'book-regular',
      BOOK_RED: 'book-red',
      BOOK_GREEN: 'book-green',
      BOOK_BLUE: 'book-blue',
      BOOK_YELLOW: 'book-yellow',

      // KEYS
      KEY_CASTLE: 'key-castle',
      KEY_ROCK: 'key-rock',
      KEY_GRASS: 'key-grass',
      KEY_CAVE: 'key-cave',
      KEY_ICE: 'key-ice',
      KEY_INFERNO: 'key-inferno',

      // SKILLS
      PORTAL: 'portal',
      PORTAL_INFERNO: 'portal-inferno',

      // TRAPS
      STUN_TILE: 'stun-tile',
      TELEPORT_TILE: 'teleport-tile',

      // BOOTS
      BOOTS_1: 'boots-1',
      BOOTS_2: 'boots-2',
      BOOTS_3: 'boots-3',
      BOOTS_4: 'boots-4',
      BOOTS_5: 'boots-5',
      BOOTS_6: 'boots-6',

      // HELMETS
      HELMET_1: 'helmet-1',
      HELMET_2: 'helmet-2',
      HELMET_3: 'helmet-3',
      HELMET_4: 'helmet-4',
      HELMET_5: 'helmet-5',
      HELMET_6: 'helmet-6',
      HELMET_7: 'helmet-7',
      HELMET_8: 'helmet-8',
      HELMET_9: 'helmet-9',
      HELMET_10: 'helmet-10',
      HELMET_11: 'helmet-11',
      HELMET_12: 'helmet-12',
      HELMET_13: 'helmet-13',
      HELMET_14: 'helmet-14',
      HELMET_15: 'helmet-15',
      HELMET_16: 'helmet-16',
      HELMET_17: 'helmet-17',
      HELMET_18: 'helmet-18',
      HELMET_19: 'helmet-19',
      HELMET_20: 'helmet-20',
      HELMET_21: 'helmet-21',
      HELMET_22: 'helmet-22',
      HELMET_23: 'helmet-23',
      HELMET_24: 'helmet-24',
      HELMET_25: 'helmet-25',
      HELMET_26: 'helmet-26',
      HELMET_27: 'helmet-27',
      HELMET_28: 'helmet-28',
      HELMET_29: 'helmet-29',
      HELMET_30: 'helmet-30',
      HELMET_31: 'helmet-31',
      HELMET_32: 'helmet-32',
      HELMET_33: 'helmet-33',

      // HAT_SUPERIOR: 'hat-superior',
      // HAT: 'hat',
      // HELMET_METAL_GOLD: 'helmet-metal-gold',
      // HELMET_METAL: 'helmet-metal',
      // HELMET_CAP: 'helmet-cap',

      // SHIELDS
      SHIELD_1: 'shield-1',
      SHIELD_2: 'shield-2',
      SHIELD_3: 'shield-3',
      SHIELD_4: 'shield-4',
      SHIELD_5: 'shield-5',
      SHIELD_6: 'shield-6',
      SHIELD_7: 'shield-7',
      SHIELD_8: 'shield-8',
      SHIELD_9: 'shield-9',
      SHIELD_10: 'shield-10',
      SHIELD_11: 'shield-11',
      SHIELD_12: 'shield-12',
      SHIELD_13: 'shield-13',
      SHIELD_14: 'shield-14',
      SHIELD_15: 'shield-15',
      SHIELD_16: 'shield-16',
      SHIELD_17: 'shield-17',
      SHIELD_18: 'shield-18',
      SHIELD_19: 'shield-19',
      SHIELD_20: 'shield-20',
      SHIELD_21: 'shield-21',
      SHIELD_22: 'shield-22',

      // WEAPONS
      WEAPON_1: 'weapon-1',
      WEAPON_2: 'weapon-2',
      WEAPON_3: 'weapon-3',
      WEAPON_4: 'weapon-4',
      WEAPON_5: 'weapon-5',
      WEAPON_6: 'weapon-6',
      WEAPON_7: 'weapon-7',
      WEAPON_8: 'weapon-8',
      WEAPON_9: 'weapon-9',
      WEAPON_10: 'weapon-10',

      // BOWS
      BOW_1: 'bow-1',
      BOW_2: 'bow-2',
      BOW_3: 'bow-3',
      BOW_4: 'bow-4',

      // WANDS
      WAND_1: 'wand-1',
      WAND_2: 'wand-2',
      WAND_3: 'wand-3',
      WAND_4: 'wand-4',

      // ARMOR
      ARMOR_1: 'armor-1',
      ARMOR_2: 'armor-2',
      ARMOR_3: 'armor-3',
      ARMOR_4: 'armor-4',
      ARMOR_5: 'armor-5',
      ARMOR_6: 'armor-6',

      // SWORD: 'weapon-1',
      // LONG_SWORD_BLUE: 'long-sword-blue',
      // LONG_SWORD_GREEN: 'long-sword-green',
      // LONG_SWORD_RED: 'long-sword-red',
      // LONG_SWORD: 'long-sword',
      // SWORD_BLUE: 'sword-blue',
      // SWORD_GREEN: 'sword-green',
      // SWORD_RED: 'sword-red',

      STICK_SUPERIOR: 'stick-superior',
      STICK: 'stick',

      TORCH: 'torch',

      // Interactive
      ROCK: 'rock',
      FOUNTAIN: 'fountain',
      CHECK_POINT: 'check-point',
      LEADERBOARD: 'leaderboard',
      LEVER: 'lever',

      // PROJECTILES
      PROJECTILE_MAGIC: 'projectile-magic',
      PROJECTILE_ARROW_1: 'projectile-arrow-1',

      // non-interactive / aesthetics
      AESTHETICS: 'aesthetics',

      ENEMY: '1000',
    },

    // common classes
    Room: function() {
        this.position = { x: 0, y: 0 };
        this.size = { x: 0, y: 0 };
        this.tiles = [];
        this.walls = []; //indexes for wall tiles
        this.branches = [];
    }
};

module.exports = helpers
