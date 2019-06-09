import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

import Chat from './Chat'

import lerp from 'lerp'

export default class CharacterController extends Behaviour {

  onAttach (camera, room) {
    this.camera = camera
    this.room = room

    this.originalY = this.object.position.y
    this.lookAtTarget = this.object.position.clone()

    this.lightDistance = 8;

    this.object.addBehaviour(new Chat, room)

    // this.light = new THREE.SpotLight(0xffffff, 1, 300, 10);
    if (!window.IS_DAY) {
      this.light = new THREE.SpotLight(0xffffff);
      this.light.penumbra = 1
      this.light.target = this.object
      this.light.position.set(0, this.lightDistance, 0)
      this.object.add(this.light)
    }
  }

  update () {
    // // 3rd person (Perspective)
    // this.camera.position.x = lerp(this.camera.position.x, this.object.position.x, 0.1) // + (window.innerWidth / window.innerHeight)
    // this.camera.position.y = lerp(this.camera.position.y, this.originalY + 30, 0.1) // this.camera.position.y = lerp(this.camera.position.y, this.originalY + 15, 0.1)
    // this.camera.position.z = lerp(this.camera.position.z, this.object.position.z + 50, 0.1)

    // 3rd person (Orthographic) (OLD ORTOGRAPHIC, W/ HIDDEN OBJECTS BEHIND WALLS)
    // this.camera.position.x = lerp(this.camera.position.x, this.object.position.x + 90 * Math.cos( 1 ), 0.1) // + (window.innerWidth / window.innerHeight)
    // this.camera.position.z = lerp(this.camera.position.z, this.object.position.z + 50, 0.1)
    // this.camera.position.y = lerp(this.camera.position.y, this.originalY + 40, 0.1)

    this.camera.position.x = lerp(this.camera.position.x, this.object.position.x + 90 * Math.cos( 1 ), 0.05) // + (window.innerWidth / window.innerHeight)
    this.camera.position.z = lerp(this.camera.position.z, this.object.position.z + 40, 0.1)
    this.camera.position.y = lerp(this.camera.position.y, this.originalY + 50, 0.05)

    // // Perspective
    // this.camera.position.x = lerp(this.camera.position.x, this.object.position.x + 20, 0.1)
    // this.camera.position.z = lerp(this.camera.position.z, this.object.position.z + 20, 0.1)
    // this.camera.position.y = lerp(this.camera.position.y, this.originalY + 20, 0.1)

    //  + 30 * Math.cos( 1 )
    this.lookAtTarget.x = lerp(this.lookAtTarget.x, this.object.position.x, 0.1)
    this.lookAtTarget.y = lerp(this.lookAtTarget.y, this.object.position.y, 0.1)
    this.lookAtTarget.z = lerp(this.lookAtTarget.z, this.object.position.z, 0.1)

    // this.lookAtTarget.x = this.object.position.x;
    // this.lookAtTarget.y = this.object.position.y;
    // this.lookAtTarget.z = this.object.position.z;

    this.camera.lookAt(this.lookAtTarget)
  }

  onDetach () { }

}
