
export function playRandom(soundOptions) {
  soundOptions[Math.floor(Math.random() * soundOptions.length)].play();
}

/**
 * Music (The Adventurer's Collection Tabletop Soundtrack)
 * By Alec Shea (https://slaleky.itch.io/fantasy-dungeons-and-dark-places-music-vol-1)
 */
export const soundtrack = {
  higureForest: require('../resource/sounds/music/higure-forest.mp3'),
  moonlightForest: require('../resource/sounds/music/moonlight-forest.mp3'),
  plagueOfNighterrors: require('../resource/sounds/music/plague-of-nighterrors.mp3'),
};
//

let curentSoundTrack;
export function switchSoundtrack(trackId) {
  const currentVolume = window.$_audiosprite.volume(curentSoundTrack)

  if (curentSoundTrack) {
    console.log("need fade out", curentSoundTrack);
    const soundTrackToFade = curentSoundTrack;
    window.$_audiosprite.on('fade', function (soundId) {
      console.log("FADE COMPLETE", soundId, soundTrackToFade, soundId === soundTrackToFade);
      if (soundId === soundTrackToFade) {
        window.$_audiosprite.stop(soundId);
      }
    });

    window.$_audiosprite.fade(1, 0, 1000, curentSoundTrack);
  }

  curentSoundTrack = soundtrack[trackId].play();
  window.$_audiosprite.fade(0, 1, 1000, curentSoundTrack);
}

window.soundtrack = soundtrack;

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

export const chestSound = require('../resource/sounds/chest.wav');
export const coinSound = require('../resource/sounds/coin.mp3');
export const potionSound = require('../resource/sounds/potion.wav');
export const levelUpSound = require('../resource/sounds/levelup.aif');

export const bossSound = require('../resource/sounds/boss/boss.mp3');
export const killBossSound = require('../resource/sounds/boss/kill-boss.mp3');

export const spellSound = require('../resource/sounds/spells/generic.mp3');
export const enterPortal = require('../resource/sounds/spells/portal-enter.mp3');

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
