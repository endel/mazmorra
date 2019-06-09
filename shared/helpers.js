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

      NPC: '20',

      GOLD: 'gold',
      GOLD_BAG: 'gold-bag',
      DIAMOND: 'diamond',

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

      ELIXIR_POTION_1: 'elixir-potion-1',
      ELIXIR_POTION_2: 'elixir-potion-2',
      ELIXIR_POTION_3: 'elixir-potion-3',
      ELIXIR_POTION_4: 'elixir-potion-4',

      // items 100~400
      BOOK_BLUE: 'book-blue',
      BOOK_GREEN: 'book-green',
      BOOK_RED: 'book-red',
      BOOK_REGULAR: 'book-regular',
      BOOK_YELLOW: 'book-yellow',
      BOOTS_BLUE: 'boots-blue',
      BOOTS_GOLD_BLUE: 'boots-gold-blue',
      BOOTS_GOLD_GREEN: 'boots-gold-green',
      BOOTS_GOLD_RED: 'boots-gold-red',
      BOOTS_GOLD: 'boots-gold',
      BOOTS_GREEN: 'boots-green',
      BOOTS_METAL_BLUE: 'boots-metal-blue',
      BOOTS_METAL_GOLD: 'boots-metal-gold',
      BOOTS_METAL_GREEN: 'boots-metal-green',
      BOOTS_METAL_RED: 'boots-metal-red',
      BTORCHOOTS_METAL: 'boots-metal',
      BOOTS_RED: 'boots-red',
      BOOTS_REGULAR: 'boots-regular',
      BOOTS_SUPERIOR: 'boots-superior',

      HAT_SUPERIOR: 'hat-superior',
      HAT: 'hat',
      HELMET_METAL_GOLD: 'helmet-metal-gold',
      HELMET_METAL: 'helmet-metal',
      HELMET_CAP: 'helmet-cap',
      KNIFE_SUPERIOR: 'knife-superior',
      KNIFE: 'knife',
      LITTLE_MACE_SUPERIOR: 'little-mace-superior',
      LITTLE_MACE: 'little-mace',
      LONG_SWORD_BLUE: 'long-sword-blue',
      LONG_SWORD_GREEN: 'long-sword-green',
      LONG_SWORD_RED: 'long-sword-red',
      LONG_SWORD: 'long-sword',
      SHIELD_METAL_GOLD: 'shield-metal-gold',
      SHIELD_METAL: 'shield-metal',
      SHIELD_WOOD_METAL: 'shield-wood-metal',
      SHIELD_WOOD_SUPERIOR: 'shield-wood-superior',
      SHIELD_WOOD: 'shield-wood',
      STICK_SUPERIOR: 'stick-superior',
      STICK: 'stick',
      SWORD_BLUE: 'sword-blue',
      SWORD_GREEN: 'sword-green',
      SWORD_RED: 'sword-red',
      SWORD: 'sword',
      TORCH: 'torch',

      // Interactive
      ROCK: 'rock',
      FOUNTAIN: 'fountain',

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
    }
};

module.exports = helpers
