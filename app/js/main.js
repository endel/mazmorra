/* jshint devel:true */
import ResourceManager from './resource/Manager'
import Tweener from 'tweener'
import Game from './game/Game'

window.ResourceManager = ResourceManager
window.Tweener = Tweener

window.tweener = new Tweener()

ResourceManager.load(() => {
  let game = new Game(document.getElementById('game'))
  game.render()
})
