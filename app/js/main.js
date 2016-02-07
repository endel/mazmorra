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
