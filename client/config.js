const isMobile = require('./utils/device').isMobile;
const devicePixelRatio = Math.min(2, window.devicePixelRatio);

module.exports = {
  TILE_SIZE: 3,
  WALL_THICKNESS: 0.7,

  COLOR_RED: new THREE.Color(0xd00000),
  COLOR_GREEN: new THREE.Color(0x7cac20),
  COLOR_YELLOW: new THREE.Color(0xfcf458),
  COLOR_WHITE: new THREE.Color(0xffffff),
  COLOR_BLUE: new THREE.Color(0x1c80e4),

  colors: {
    dark: 0x000000,    // black
    grass: 0x002a0d,   // green
    rock: 0x1e2129,    // gray
    ice: 0x000c4c,     // blue
    inferno: 0x440000, // red
    castle: 0x443434   // brown
  },

  // ZOOM: 23
  // ZOOM: 32 / window.devicePixelRatio,
  // ZOOM: 42 / window.devicePixelRatio,
  ZOOM: 42,
  // ZOOM: 45 / window.devicePixelRatio,
  IS_DAY: true,

  devicePixelRatio,

  HUD_MARGIN: 2.5,
  HUD_SCALE: (isMobile)
    ? (7 / devicePixelRatio)
    : (6 / devicePixelRatio),

  DEFAULT_FONT: (Math.floor((7.5 / devicePixelRatio) * 5)) + "px primary",
  FONT_TITLE: (Math.floor((9 / devicePixelRatio) * 5)) + "px primary",
  SMALL_FONT: (Math.floor((5.5 / devicePixelRatio) * 5)) + "px primary",

  // player preferences
  classes: [
    'strength',
    'intelligence',
    'agility',
  ],
  hairs: [
    "boy",
    "young",
    "ancient",
    "lumberman",
    "viking",
    "girl",
    "woman",
    "lady",
    "queen",
    "cowlick",
    "punk",
    "bald"
  ]

}
