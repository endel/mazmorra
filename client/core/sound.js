import { Howler, Howl } from "howler";
import { distanceFromPlayer, distance } from "./utils.js";

/**
 * Music (The Adventurer's Collection Tabletop Soundtrack)
 * By Alec Shea (https://slaleky.itch.io/fantasy-dungeons-and-dark-places-music-vol-1)
 */
const soundtracks = new Howl(require('../../public/soundtracks.json'));

const MAX_SOUNDTRACK_VOLUME = 0.45;

export let soundtrackVolume = MAX_SOUNDTRACK_VOLUME;
let curentSoundTrack;
let curentSoundTrackName;

export function setMusicVolume(volume) {
  const newVolume = Math.min(volume, MAX_SOUNDTRACK_VOLUME);
  soundtracks.volume(newVolume);
  soundtrackVolume = newVolume;
}

let sfxVolume = 1;
export function setSFXVolume(volume) {
  sfxVolume = volume;
  $_audiosprite.volume(volume);
}

const globalListener = {x: 0, y: 0};
export function setAudioPosition(object) {
  // globalListener.x = object.position.x;
  // globalListener.y = object.position.z;
  // $_audiosprite.pos(globalListener.x, globalListener.y, 0);

  // $_audiosprite.pos(0, 0, 0);
}

export function playSound3D(sound, source) {
  // const volume3d = distanceFromPlayer(source);
  const soundId = sound.play();

  /*
  $_audiosprite.once('play', () => {
    if (source === global.player) {
      $_audiosprite.pos(0, 0, 0, soundId);

    } else {
      // const z = Math.max(distance(source.position, global.player.position) / 15, 4);
      const z = distance(source.position, global.player.position) / 15;
      const x = Math.max(-5, Math.min(5, (source.position.x - global.player.position.x) / 6));
      const y = Math.max(-5, Math.min(5, (source.position.z - global.player.position.z) / 6));
      $_audiosprite.pos(x, y, 0, soundId);
    }
    $_audiosprite.volume(sfxVolume, soundId);
  })
  */
}

export function playRandom3D(soundOptions, source) {
  playSound3D(soundOptions[Math.floor(Math.random() * soundOptions.length)], source);
}

export function playRandom(soundOptions, volume) {
  soundOptions[Math.floor(Math.random() * soundOptions.length)].play();
}

export function fadeOut(soundId) {
  if (!soundId) { soundId = curentSoundTrack; }
  const previousVolume = soundtracks.volume(soundId);
  soundtracks.fade(previousVolume, 0, 1000, soundId);
  soundtracks.once('fade', () => soundtracks.stop(soundId), soundId);
}

export function fadeIn(soundId, toVolume) {
  soundtracks.fade(0, toVolume, 1000, soundId);
}


export function switchSoundtrack(trackName) {
  if (curentSoundTrackName === trackName) {
    return;
  }

  if (curentSoundTrack) {
    fadeOut(curentSoundTrack);
  }

  curentSoundTrackName = trackName;
  curentSoundTrack = soundtracks.play(trackName);
  soundtracks.loop(true, curentSoundTrack);
  fadeIn(curentSoundTrack, soundtrackVolume);

  return curentSoundTrack;
}

export const doorSound = require('../resource/sounds/door.mp3');

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

export const mimicSound = require('../resource/sounds/enemies/mimic.mp3');

export const activatableSound = {
  fountain: require('../resource/sounds/fountain.wav'),
  lever: require('../resource/sounds/effects/lever.mp3')
};

export const stepSounds = [
  require('../resource/sounds/step1.mp3'),
  require('../resource/sounds/step2.mp3'),
  require('../resource/sounds/step3.mp3'),
  require('../resource/sounds/step4.mp3'),
];

export const approveSound = [
  require('../resource/sounds/voices/approve-1.mp3'),
  require('../resource/sounds/voices/approve-2.mp3'),
  require('../resource/sounds/voices/approve-3.mp3'),
  require('../resource/sounds/voices/approve-4.mp3'),
  require('../resource/sounds/voices/approve-5.mp3'),
];

// export const potionSellerSound = [
//   require('../resource/sounds/voices/potion-seller-1.wav'),
//   require('../resource/sounds/voices/potion-seller-2.wav'),
//   require('../resource/sounds/voices/potion-seller-3.wav'),
// ];

export const chestSound = require('../resource/sounds/chest.wav');
export const coinSound = require('../resource/sounds/coin.mp3');
export const potionSound = require('../resource/sounds/potion.wav');
export const levelUpSound = require('../resource/sounds/levelup.aif');

export const bossSound = require('../resource/sounds/boss/boss.mp3');
export const killBossSound = require('../resource/sounds/boss/kill-boss.mp3');

export const spellSound = require('../resource/sounds/spells/generic.mp3');

export const portal = require('../resource/sounds/effects/portal.mp3');
export const checkpoint = require('../resource/sounds/effects/checkpoint.mp3');

export const pendingSound = require('../resource/sounds/effects/pending.mp3');

/**
 * Weapons
 */

export const wooshSound = [
  require('../resource/sounds/woosh1.wav'),
  require('../resource/sounds/woosh2.wav'),
  require('../resource/sounds/woosh3.wav'),
];

export const bowSound = [
  require('../resource/sounds/weapons/bow-1.mp3'),
  require('../resource/sounds/weapons/bow-2.mp3'),
];

export const staffSound = [
  require('../resource/sounds/weapons/staff-1.mp3'),
  require('../resource/sounds/weapons/staff-2.mp3'),
];


/**
 * Skills
 */

export const skillAttackSpeedSound = [
  require('../resource/sounds/skills/attack-speed-1.mp3'),
  require('../resource/sounds/skills/attack-speed-2.mp3'),
  require('../resource/sounds/skills/attack-speed-3.mp3')
];

export const skillMovementSpeedSound = [
  require('../resource/sounds/skills/movement-speed-1.mp3'),
  require('../resource/sounds/skills/movement-speed-2.mp3'),
  require('../resource/sounds/skills/movement-speed-3.mp3'),
];

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
export const checkpointStingerSound = require('../resource/sounds/stingers/checkpointStinger.mp3');
