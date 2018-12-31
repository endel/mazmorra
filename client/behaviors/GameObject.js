import { Behaviour } from 'behaviour.js'

import BattleBehaviour from './BattleBehaviour'
import lerp from 'lerp'
import { stepSounds } from '../core/sound';

export default class GameObject extends Behaviour {

  onAttach (factory) {
    this.nextPoint = null
    this.factory = factory

    if (typeof(this.object.userData.hp) !== "undefined") {
      this.actAsUnit()
    }

    this.on('nextPoint', (point) => {
      this.nextPoint = point;

      // play "step" sound for current player
      if (this.object === window.player) {
        stepSounds[Math.floor(Math.random() * stepSounds.length)].play();
      }
    });
  }

  actAsUnit () {

    if (this.object.userData.hp.current > 0) {

      this.battleBehaviour = new BattleBehaviour
      this.object.addBehaviour( this.battleBehaviour, this.factory )

    } else {
      // TODO: refactor me
      this.object.sprite.material.rotation = Math.PI
    }

  }

  update () {
    if (this.nextPoint) {
      let destX = this.nextPoint.x
        , destZ = this.nextPoint.z
        , lerpTime = 0.09

      if (this.battleBehaviour && this.battleBehaviour.togglePosition) {
        // destX += (this.battleBehaviour.attackingPoint.x - this.nextPoint.x) / 3
        // destZ += (this.battleBehaviour.attackingPoint.z - this.nextPoint.z) / 3

        destX = this.battleBehaviour.attackingPoint.x;
        destZ = this.battleBehaviour.attackingPoint.z;

        lerpTime = 0.2
      }

      this.object.position.x = lerp(this.object.position.x, destX, lerpTime)
      this.object.position.z = lerp(this.object.position.z, destZ, lerpTime)
    }
  }

  onDetach () {}

}
