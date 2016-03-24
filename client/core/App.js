import Tweener from 'tweener'
import Clock from 'clock-timer.js'
import { createComponentSystem } from 'behaviour.js'

class App {

  constructor () {

    this.tweens = new Tweener()
    this.clock = new Clock()
    this.componentSystem = createComponentSystem(THREE.Object3D)

  }

  update () {

    this.clock.tick()
    this.tweens.update(this.clock.deltaTime)
    this.componentSystem.update()

  }

}

module.exports = new App()
