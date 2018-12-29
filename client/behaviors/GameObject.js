import { Behaviour } from 'behaviour.js'

import BattleBehaviour from './BattleBehaviour'
import LevelUp from '../elements/effects/LevelUp'

import lerp from 'lerp'
import helpers from '../../shared/helpers'

export default class GameObject extends Behaviour {

  onAttach (factory) {
    this.nextPoint = null
    this.factory = factory

    if (typeof(this.object.userData.hp) !== "undefined") {
      this.actAsUnit()
    }

    this.on('nextPoint', (point) => {
      this.nextPoint = point;
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
        destX += (this.battleBehaviour.attackingPoint.x - this.nextPoint.x) / 3
        destZ += (this.battleBehaviour.attackingPoint.z - this.nextPoint.z) / 3
        lerpTime = 0.2
      }

      this.object.position.x = lerp(this.object.position.x, destX, lerpTime)
      this.object.position.z = lerp(this.object.position.z, destZ, lerpTime)
    }
  }

  onDetach () {}

}
