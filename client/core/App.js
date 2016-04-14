import Tweener from 'tweener'
import Clock from 'clock-timer.js'
import { createComponentSystem } from 'behaviour.js'

class App {

  constructor () {

    this.tweens = new Tweener()

    this.clock = new Clock()

    this.componentSystem = createComponentSystem(THREE.Object3D)

    this.mouse = new THREE.Vector2();

    window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false )

  }

  update () {

    this.clock.tick()

    this.tweens.update(this.clock.deltaTime)

    this.componentSystem.update()

  }


  onMouseMove (e) {

    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
    this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1

  }

}

module.exports = new App()
