/* jshint devel:true */
require('./css/main.styl');

import ResourceManager from './resource/manager'
import Game from './game/Game'

import login from './web/login'

ResourceManager.load(() => {
  const game = new Game(document.getElementById('game'))
  game.render();

  login.on('register', (data) => {
    // game.characterBuilder.setHero(data.heros[0])
    game.buildCharacter(data);
    // game.characterBuilder.setHero({});
  })

  login.on('login', (data) => {
    // game.characterBuilder.setHero(data.heros[0])
    // game.characterBuilder.setHero(data);
    game.init();
  })

  login.init();
})

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

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

      event.currentTarget = this

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}


}
