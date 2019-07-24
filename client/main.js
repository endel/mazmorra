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
import { client, getHeroId, getRoomId } from "./core/network";

window.app = App;

/**
 * Report errors remotely!
 */
global.report = async function(data) {
  return fetch(`${client.auth.endpoint}/report`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
}

let errorCount = 0;
const MAX_ERROR_COUNT = 10;
window.onerror = function(msg, url, lineNo, columnNo, error) {
  if (errorCount++ < MAX_ERROR_COUNT) {
    global.report({
      message: `${msg} (${lineNo}:${columnNo})`,
      stack: error.stack,
      userId: client.auth._id,
      heroId: getHeroId(),
      roomId: getRoomId()
    });
  }
}

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

/**
 * Augment Object3D / EventDispatcher
 * object.destroy() must be called to prevent memory leaks.
 */
THREE.EventDispatcher.prototype.removeAllListeners = function() {
  if (this._listeners) {
    for (let type in this._listeners) {
      for (let i = 0; i < this._listeners[type].length; i++) {
        const listener = this._listeners[type][i];
        this.removeEventListener(type, listener);
      }
    }
  }
}

THREE.Object3D.prototype.destroy = function () {
  if (this.geometry) { this.geometry.dispose(); }

  if (this.material) {
    if (this.material.map) {
      if (this.material.map) { this.material.map.dispose(); }
    }
    this.material.dispose();
  }

  for (let i = this.children.length - 1; i >= 0; i--) {
    if (this.children[i].destroy) { this.children[i].destroy(); }
    this.remove(this.children[i]);
  }

  this.removeAllListeners();
}


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
