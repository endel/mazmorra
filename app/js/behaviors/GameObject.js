import { Behaviour } from 'behaviour.js'

import BattleBehaviour from './BattleBehaviour'
import lerp from 'lerp'

export default class GameObject extends Behaviour {

  onAttach (generator) {
    this.nextPoint = null
    this.generator = generator

    this.battleBehaviour = new BattleBehaviour
    this.object.addBehaviour(this.battleBehaviour)

    this.on('patch', this.onPatch.bind(this))
  }

  update () {
    if (this.nextPoint) {
      let destX = this.nextPoint.x
        , destZ = this.nextPoint.z;

      if (this.battleBehaviour.togglePosition) {
        destX += (this.battleBehaviour.attackingPoint.x - this.nextPoint.x) / 2
        destZ += (this.battleBehaviour.attackingPoint.z - this.nextPoint.z) / 2
      }

      this.object.position.x = lerp(this.object.position.x, destX, 0.09)
      this.object.position.z = lerp(this.object.position.z, destZ, 0.09)
    }
  }

  onPatch (state, patch) { // , patchId
    if (patch.path.indexOf('position') !== -1) {
      // TODO: possible leak here
      this.nextPoint = this.generator.fixTilePosition(this.object.position.clone(), state.position.y, state.position.x)

      this.object.userData.x = state.position.x
      this.object.userData.y = state.position.y
      console.log("position!")

    } else if (patch.path.indexOf('direction') !== -1) {
      this.object.direction = patch.value

    } else if (patch.path.indexOf('action') !== -1) {
      if (!this.battleBehaviour.isAttacking && state.action.type == "attack") {
        console.log("action!", state.action)

        this.attackingPoint = this.generator.fixTilePosition(this.object.position.clone(), state.action.position.y, state.action.position.x)
        this.entity.emit('attack', this.attackingPoint)

        state.action.type
        state.action.missed
        state.action.lastHitTime
        state.action.damage
        state.action.critical
      }
    }
  }

  onDestroy () {
    if (this.attackingInterval) { this.attackingInterval.clear() }
  }

}
