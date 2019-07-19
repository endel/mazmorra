// > Polyfills
// import "core-js/stable";
import "core-js/stable/object/assign";
import "core-js/stable/array/from";
import "regenerator-runtime/runtime";
// < end of Polyfills!

require('./css/main.styl');

import ResourceManager from './resource/manager'
import Game from './game/Game'

import login from './web/login'
import { switchSoundtrack } from './core/sound';
import { applySettings } from "./elements/hud/SettingsOverlay";

window.app = App;

ResourceManager.load(() => {
  // remove "loading" class
  const body = document.querySelector("body");
  body.classList.remove("loading");
  body.classList.add("loaded");

  const game = new Game(document.getElementById('game'))

  applySettings();
  switchSoundtrack("higure-forest");

  game.render();

  login.on('register', (data) => {
    console.log("LOGIN, ON REGISTER!", data);
    game.buildCharacter(data);
  });
  login.on('login', () => {
    game.init();
  });

  login.init();
})

// window.THREE = THREE;

//
// TODO patch three.js
//
THREE.Object3D.prototype.dispatchEvent = function (event) {
  THREE.EventDispatcher.prototype.dispatchEvent.call(this, event);
  if (event.bubbles && !event.stopPropagation && this.parent) {
    this.parent.dispatchEvent(event)
  }
}

THREE.EventDispatcher.prototype.dispatchEvent = function (event) {
  // TODO: patch this!
  if (!event.target) { event.target = this; }
  if (this._listeners === undefined) return;

  var listeners = this._listeners;
  var listenerArray = listeners[event.type];

  if (listenerArray !== undefined) {
    event.currentTarget = this

    var array = [];
    var length = listenerArray.length;

    for (var i = 0; i < length; i++) {
      array[i] = listenerArray[i];
    }

    for (var i = 0; i < length; i++) {
      array[i].call(this, event);
    }
  }
}
