import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

import Chat from './Chat'

export default class CharacterController extends Behaviour {

  onAttach (camera) {
    this.camera = camera
    this.camera.lookAt(this.object.position)

    this.originalY = this.object.position.y

    this.object.addBehaviour(new Chat)

    this.light = new THREE.SpotLight(0xffffff, 1, 300, 10);
    this.light.target = this.object
    // this.light.position.set(0, 5, 0)
    this.light.position.set(0, 30, 0)
    this.object.add(this.light)

    window.player = this.object
  }

  update () {
    // player moving
    // if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
    //   this.object.position.y = this.originalY + (Math.sin(clock.elapsedTime / 100) / 10)
    // }

    // var vector = new THREE.Vector3();
    //
    // var widthHalf = 0.5 * window.innerWidth
    // var heightHalf = 0.5 * window.innerHeight
    //
    // this.object.updateMatrixWorld();
    // vector.setFromMatrixPosition(this.object.matrixWorld);
    // vector.project(this.camera);
    //
    // vector.x = ( vector.x * widthHalf ) + widthHalf;
    // vector.y = - ( vector.y * heightHalf ) + heightHalf;
    //
    // this.camera.position.x = vector.x // + (window.innerWidth / window.innerHeight)
    // this.camera.position.z = vector.z
    // this.camera.position.y = this.originalY + 12

    // Update camera position
    // var characterPosition = this.object.localToWorld(this.object.position)
    this.camera.position.x = this.object.position.x // + (window.innerWidth / window.innerHeight)
    this.camera.position.z = this.object.position.z + 20
    this.camera.position.y = this.originalY + 12
  }

  onDestroy () { }

}
