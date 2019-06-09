module.exports = {
  TILE_SIZE: 3,
  WALL_THICKNESS: 0.7,

  COLOR_RED: new THREE.Color(0xd00000),
  COLOR_GREEN: new THREE.Color(0x6ca018),
  COLOR_YELLOW: new THREE.Color(0xfcf458),
  COLOR_WHITE: new THREE.Color(0xffffff),
  COLOR_BLUE: new THREE.Color(0x185090),

  colors: {
    dark: 0x000000,    // black
    grass: 0x002a0d,   // green
    rock: 0x343434,    // gray
    ice: 0x000c4c,     // blue
    inferno: 0x440000, // red
    castle: 0x443434   // brown
  },

  // ZOOM: 23
  // ZOOM: 32 / window.devicePixelRatio,
  // ZOOM: 40 / window.devicePixelRatio,
  ZOOM: 45 / window.devicePixelRatio,
  IS_DAY: true,

  HUD_MARGIN: 2.5,
  HUD_SCALE: 6 / window.devicePixelRatio,

  DEFAULT_FONT: (Math.floor((7.5 / window.devicePixelRatio) * 5)) + "px primary",
  SMALL_FONT: (Math.floor((5 / window.devicePixelRatio) * 5)) + "px primary",

  // player preferences
  classes: [
    'strength',
    'intelligence',
    'agility',
  ],
  hairs: [
    "Boy",
    "Young",
    "Ancient",
    "Lumberman",
    "Viking",
    "Girl",
    "Woman",
    "Lady",
    "Queen",
    "Cowlick",
    "Punk",
    "Bald"
  ]

}
