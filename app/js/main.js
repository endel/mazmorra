/* jshint devel:true */

import ResourceManager from './resource/Manager'
import Tweener from 'tweener'
import Game from './game/Game'

window.BACKEND_ENDPOINT = `http://${window.location.hostname}:3553`
import credentials from './web/credentials'

window.ResourceManager = ResourceManager
window.Tweener = Tweener
window.tweener = new Tweener()

ResourceManager.load(() => {
  let game = new Game(document.getElementById('game'))
  game.render()

  credentials.on('login', (data) => {
    game.characterBuilder.setHero(data.heros[0])
  })

  credentials.init()
})

//
// TODO patch three.js
//
THREE.Object3D.prototype.dispatchEvent = function (event) {
  THREE.EventDispatcher.prototype.dispatchEvent.call(this, event);
  if (event.bubbles && this.parent) {
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

