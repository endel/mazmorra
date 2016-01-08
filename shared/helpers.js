var gen = require('random-seed')

// create predicatble random generator
var rand = gen.create()

var helpers = {
    // useful utils
    randInt: function(low, high) {
        return rand.intBetween(low, high)
    },

    randElm: function(array, start, end) {
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

        return array[ this.randInt(start, end) ];
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
      DOOR: 0,
      LIGHT: 1,
      CHEST: 3,
      PLAYER: 10,
      TEXT_EVENT: 11,

      // items 100~400
      GOLD: 'gold',
      BOOK_BLUE: 'book-blue',
      BOOK_GREEN: 'book-green',
      BOOK_RED: 'book-red',
      BOOK_REGULAR: 'book-regular',
      BOOK_YELLOW: 'book-yellow',
      BOOK: 'book',
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
      BOOTS: 'boots',
      DIAMOND: 'diamond',
      ELIXIR_HEAL: 'elixir-heal',
      ELIXIR_POTION: 'elixir-potion',
      GOLD_BAG: 'gold-bag',
      GOLD: 'gold',
      HAT_SUPERIOR: 'hat-superior',
      HAT: 'hat',
      HELMET_METAL_GOLD: 'helmet-metal-gold',
      HELMET_METAL: 'helmet-metal',
      KNIFE_SUPERIOR: 'knife-superior',
      KNIFE: 'knife',
      LIFE_HEAL: 'life-heal',
      LIFE_POTION: 'life-potion',
      LITTLE_MACE_SUPERIOR: 'little-mace-superior',
      LITTLE_MACE: 'little-mace',
      LONG_SWORD_BLUE: 'long-sword-blue',
      LONG_SWORD_GREEN: 'long-sword-green',
      LONG_SWORD_RED: 'long-sword-red',
      LONG_SWORD: 'long-sword',
      MANA_HEAL: 'mana-heal',
      MANA_POTION: 'mana-potion',
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

      ENEMY: 1000,
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
