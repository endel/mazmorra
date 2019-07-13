import { Howler, Howl } from "howler";

/**
 * Music (The Adventurer's Collection Tabletop Soundtrack)
 * By Alec Shea (https://slaleky.itch.io/fantasy-dungeons-and-dark-places-music-vol-1)
 */
const soundtracks = new Howl(require('../../public/soundtracks.json'));

export function playRandom(soundOptions) {
  soundOptions[Math.floor(Math.random() * soundOptions.length)].play();
}

export let soundtrackVolume = 0.45;
let curentSoundTrack;
let curentSoundTrackName;

export function fadeOut(soundId) {
  if (!soundId) { soundId = curentSoundTrack; }
  const previousVolume = soundtracks.volume(soundId);
  soundtracks.fade(previousVolume, 0, 1000, soundId);
}

export function fadeIn(soundId, toVolume) {
  soundtracks.fade(0, toVolume, 1000, soundId);
}


export function switchSoundtrack(trackName) {
  if (curentSoundTrackName === trackName) {
    return;
  }

  const previousVolume = soundtracks.volume(curentSoundTrack);

  if (curentSoundTrack && previousVolume > 0) {
    const soundTrackToFade = curentSoundTrack;
    soundtracks.on('fade', function (soundId) {
      if (soundId === soundTrackToFade) {
        soundtracks.stop(soundId);
      }
    });
    fadeOut(curentSoundTrack);
    // window.$_audiosprite.fade(soundtrackVolume, 0, 1000, curentSoundTrack);
  }

  curentSoundTrackName = trackName;
  curentSoundTrack = soundtracks.play(trackName);
  soundtracks.loop(true, curentSoundTrack);
  fadeIn(curentSoundTrack, soundtrackVolume);

  // window.$_audiosprite.fade(0, soundtrackVolume, 1000, curentSoundTrack);

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
