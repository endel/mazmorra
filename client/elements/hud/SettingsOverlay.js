import { SpriteText2D, textAlign, MeshText2D } from 'three-text2d'
import ToggleButton from '../controls/ToggleButton';
import { PlayerPrefs } from '../../core/PlayerPrefs';
import { setMusicVolume, setSFXVolume } from '../../core/sound';

const SETTINGS_SOUND_EFFECTS = "settings-sound-effects";
const SETTINGS_MUSIC = "settings-music";
const SETTINGS_RESOLUTION = "settings-resolution";

export function applySettings () {
  const noMusic = PlayerPrefs.getNumber(SETTINGS_MUSIC, 0) === 1;
  setMusicVolume(noMusic ? 0 : 1);

  const noSFX = PlayerPrefs.getNumber(SETTINGS_SOUND_EFFECTS, 0) === 1;
  setSFXVolume(noSFX ? 0 : 1);

  global.renderer.setPixelRatio(window.devicePixelRatio * PlayerPrefs.getNumber(SETTINGS_RESOLUTION, 1));
}

export default class SettingsOverlay extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false

    this.title = ResourceManager.getHUDElement('hud-big-title-red');
    this.title.position.y = this.title.height * 2;
    this.add(this.title);

    this.titleText = new MeshText2D("Settings", {
      align: textAlign.center ,
      font: config.FONT_TITLE,
      fillStyle: "#ffffff",
      shadowColor: "#000000",
      shadowOffsetY: 3,
      shadowBlur: 0
    });
    this.titleText.position.y = this.title.position.y + this.title.height - this.titleText.height - 6;
    this.add(this.titleText);

    this.options = new THREE.Object3D();
    this.add(this.options);

    // Sound effects
    const soundToggle = new ToggleButton(PlayerPrefs.getNumber(SETTINGS_SOUND_EFFECTS, 0) === 1);
    soundToggle.addEventListener("change", (e) => {
      PlayerPrefs.set(SETTINGS_SOUND_EFFECTS, Number(e.value));
      applySettings();
    });
    soundToggle.position.x -= (config.HUD_MARGIN * config.HUD_SCALE * 5);

    const soundTxt = new MeshText2D("No sound effects", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: "#ffffff"
    })
    soundTxt.position.x = soundToggle.position.x + config.HUD_SCALE * (config.HUD_MARGIN * 1.8);
    soundTxt.position.y = soundToggle.position.y + soundTxt.height / 2.1;

    this.options.add(soundToggle);
    this.options.add(soundTxt);

    // Music
    const musicToggle = new ToggleButton(PlayerPrefs.getNumber(SETTINGS_MUSIC, 0) === 1);
    musicToggle.addEventListener("change", (e) => {
      PlayerPrefs.set(SETTINGS_MUSIC, Number(e.value));
      applySettings();
    });
    musicToggle.position.x -= (config.HUD_MARGIN * config.HUD_SCALE * 5);
    musicToggle.position.y = soundToggle.position.y + soundToggle.height + (config.HUD_MARGIN * config.HUD_SCALE * 2)

    const musicTxt = new MeshText2D("No music", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: "#ffffff"
    })
    musicTxt.position.x = soundTxt.position.x;
    musicTxt.position.y = musicToggle.position.y + musicTxt.height / 2.1;

    this.options.add(musicToggle);
    this.options.add(musicTxt);


    // High resolution
    const highresToggle = new ToggleButton(PlayerPrefs.getNumber(SETTINGS_RESOLUTION, 1) !== 1);
    highresToggle.addEventListener("change", (e) => {
      PlayerPrefs.set(SETTINGS_RESOLUTION, (e.value) ? 0.5 : 1);
      applySettings();
    });
    highresToggle.position.x -= (config.HUD_MARGIN * config.HUD_SCALE * 5);
    highresToggle.position.y = musicToggle.position.y + highresToggle.height + (config.HUD_MARGIN * config.HUD_SCALE * 2)

    const highresTxt = new MeshText2D("Low resolution", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: "#ffffff"
    })
    highresTxt.position.x = musicTxt.position.x;
    highresTxt.position.y = highresToggle.position.y + highresTxt.height / 2.1;

    this.options.add(highresToggle);
    this.options.add(highresTxt);

    this.width = this.title.width;
    this.height = this.title.height;
  }

  toggleOpen (cb) {
    this.isOpen = !this.isOpen
    this.visible = true;

    this.options.visible = this.isOpen;

    const scaleFrom = ((this.isOpen) ? 0.5 : 1);
    const scaleTo = ((this.isOpen) ? 1 : 0.85);

    this.scale.set(scaleFrom, scaleFrom, scaleFrom);

    if (this.isOpen) {
      this.title.materialopacity = 0;
      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

    } else {
      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);
    }

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false;
      if (cb) cb();
    });
  }

}
