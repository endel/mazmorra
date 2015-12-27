import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

import Chat from './Chat'

export default class CharacterController extends Behaviour {

  onAttach (camera) {
    this.camera = camera
    this.originalY = this.object.position.y

    this.object.behave(new Chat)

    this.light = new THREE.PointLight(0xffffff, 1, 300, 10);
    // this.light = new THREE.PointLight(0xffffff, 1, 50, 1 );

    // light.castShadow = true;
    // light.shadowCameraNear = 1;
    // light.shadowCameraFar = 30;
    // light.shadowCameraVisible = true;
    // light.shadowMapWidth = 64;
    // light.shadowMapHeight = 64;
    // light.shadowMapWidth = 2048;
    // light.shadowMapHeight = 1024;
    // light.shadowBias = 0.01;
    // light.shadowDarkness = 0.5;
    this.light.position.set(0, 0.25, 0)
    this.object.add(this.light)

    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    }

    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown (e) {
    if (e.which == Keycode.UP || e.which == Keycode.W) {
      this.keys.up = true

    } else if (e.which == Keycode.DOWN || e.which == Keycode.S) {
      this.keys.down = true

    } else if (e.which == Keycode.LEFT || e.which == Keycode.A) {
      this.keys.left = true

    } else if (e.which == Keycode.RIGHT || e.which == Keycode.D) {
      this.keys.right = true
    }
  }

  onKeyUp (e) {
    if (e.which == Keycode.UP || e.which == Keycode.W) {
      this.keys.up = false

    } else if (e.which == Keycode.DOWN || e.which == Keycode.S) {
      this.keys.down = false

    } else if (e.which == Keycode.LEFT || e.which == Keycode.A) {
      this.keys.left = false

    } else if (e.which == Keycode.RIGHT || e.which == Keycode.D) {
      this.keys.right = false
    }
  }

  update () {
    if (this.keys.up) {
      this.object.position.z -= 0.1
      this.object.direction = 'top'
    }

    if (this.keys.down) {
      this.object.position.z += 0.1
      this.object.direction = 'bottom'
    }

    if (this.keys.left) {
      this.object.position.x -= 0.1
      this.object.direction = 'left'
    }

    if (this.keys.right) {
      this.object.position.x += 0.1
      this.object.direction = 'right'
    }

    if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
      this.object.position.y = this.originalY + (Math.sin(clock.elapsedTime / 100) / 10)
    }

    // var characterPosition = this.object.localToWorld(this.object.position)
    this.camera.position.x = this.object.position.x // + (window.innerWidth / window.innerHeight)
    this.camera.position.y = this.originalY + 12
    this.camera.position.z = this.object.position.z + 20
  }

  onDestroy () {
    // if (this.tween) this.tween.dispose()
  }

}
