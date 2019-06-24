export function playRandom(soundOptions) {
  soundOptions[Math.floor(Math.random() * soundOptions.length)].play();
}

export const doorSound = require('../resource/sounds/door.wav');

export const wooshSound = [
  require('../resource/sounds/woosh1.wav'),
  require('../resource/sounds/woosh2.wav'),
  require('../resource/sounds/woosh3.wav'),
];

export const hitSound = [
  require('../resource/sounds/hit1.mp3'),
  require('../resource/sounds/hit2.mp3'),
  require('../resource/sounds/hit3.mp3'),
  require('../resource/sounds/hit4.mp3'),
];

export const deathSound = [
  require('../resource/sounds/death1.mp3'),
  require('../resource/sounds/death2.mp3'),
  require('../resource/sounds/death3.mp3'),
];

export const battleStartSound = {
  default: require('../resource/sounds/enemies/default.mp3'),
  snake: require('../resource/sounds/enemies/snake.mp3'),
};

export const activatableSound = {
  fountain: require('../resource/sounds/fountain.wav'),
};

export const stepSounds = [
  require('../resource/sounds/step1.mp3'),
  require('../resource/sounds/step2.mp3'),
  require('../resource/sounds/step3.mp3'),
  require('../resource/sounds/step4.mp3'),
];

export const chestSound = require('../resource/sounds/chest.wav');
export const coinSound = require('../resource/sounds/coin.mp3');
export const potionSound = require('../resource/sounds/potion.wav');
export const levelUpSound = require('../resource/sounds/levelup.aif');

/**
 * Inventory
 */

export const inventorySound = {
  open: require('../resource/sounds/inventory/open.ogg'),
  close: require('../resource/sounds/inventory/close.ogg'),

  sell: require('../resource/sounds/inventory/sell.wav'),
  buy: require('../resource/sounds/inventory/buy.wav'),
}

export const pickItemSound = inventorySound.open;

/**
 * Stingers
 */
export const deathStingerSound = require('../resource/sounds/stingers/death.mp3');
