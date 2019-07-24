import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'

const DEFAULT_LOOK_AT_TARGET_SPEED = 0.04;

export default class CharacterController extends Behaviour {

  onAttach (camera, room) {
    this.camera = camera
    this.room = room
    this.zoom = config.ZOOM;

    this.target = this.object;
    this.rotation = false;
    this.isRotating = false;

    this.originalY = this.object.position.y
    this.lookAtTarget = this.target.position.clone()
    this.lookAtTargetSpeed = DEFAULT_LOOK_AT_TARGET_SPEED;

    this.lightDistance = 8;

    // this.light = new THREE.SpotLight(0xffffff, 1, 300, 10);
    if (!global.IS_DAY) {
      this.light = new THREE.SpotLight(0xffffff);
      this.light.penumbra = 1;
      this.light.target = this.object;
      this.light.position.set(0, this.lightDistance, 0);
      this.object.add(this.light);
    }

    this.on('target', (newTarget) => this.target = newTarget);
    this.on('rotate', (isRotating) => {
      this.isRotating = isRotating;
      this.lookAtTargetSpeed = (isRotating) ? 0.05 : DEFAULT_LOOK_AT_TARGET_SPEED;
    });
    this.on('zoom', (ratio) => this.zoom = config.ZOOM * ratio);
  }

  update () {
    if (!this.isRotating) {
      this.camera.position.x = lerp(this.camera.position.x, this.target.position.x + 90 * Math.cos(1), 0.05) // + (window.innerWidth / window.innerHeight)
      this.camera.position.z = lerp(this.camera.position.z, this.target.position.z + 40, 0.05)
      this.camera.position.y = lerp(this.camera.position.y, this.originalY + 50, 0.05)

      // this.lookAtTarget.x = this.target.position.x;
      // this.lookAtTarget.y = this.target.position.y;
      // this.lookAtTarget.z = this.target.position.z;
      const zoom = this.zoom / window.devicePixelRatio;

      if (Math.abs(this.camera.zoom - zoom) > 0.1) {
        this.camera.zoom = lerp(this.camera.zoom, zoom, 0.03);
        this.camera.updateProjectionMatrix();
      }

    } else {

      // // Rotation!
      var x = this.camera.position.x;
      var z = this.camera.position.z;
      const rotSpeed = 0.005;
      this.camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      this.camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
      this.camera.position.y = lerp(this.camera.position.y, this.originalY + 25, 0.05)

      this.camera.zoom = lerp(this.camera.zoom, (config.ZOOM + 30) / window.devicePixelRatio, 0.05);
      this.camera.updateProjectionMatrix();
    }

    //  + 30 * Math.cos( 1 )
    this.lookAtTarget.x = lerp(this.lookAtTarget.x, this.target.position.x, this.lookAtTargetSpeed);
    this.lookAtTarget.y = lerp(this.lookAtTarget.y, this.target.position.y, this.lookAtTargetSpeed);
    this.lookAtTarget.z = lerp(this.lookAtTarget.z, this.target.position.z, this.lookAtTargetSpeed);

    this.camera.lookAt(this.lookAtTarget);

    if (this.isRotating && this.rotation > 0) {
      this.rotation -= 0.01;

    } else {
      this.rotation = 0;
    }
  }

  onDetach () {
    delete this.room;
    delete this.target;
  }

}
