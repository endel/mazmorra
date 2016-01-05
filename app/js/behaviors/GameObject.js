import { Behaviour } from 'behaviour.js'

import BattleBehaviour from './BattleBehaviour'
import lerp from 'lerp'

import helpers from '../../../shared/helpers'

export default class GameObject extends Behaviour {

  onAttach (generator) {
    this.lastPatchId = 0

    this.nextPoint = null
    this.generator = generator

    this.battleBehaviour = new BattleBehaviour
    this.object.addBehaviour(this.battleBehaviour)

    this.on('patch', this.onPatch.bind(this))
  }

  update () {
    if (this.nextPoint) {
      let destX = this.nextPoint.x
        , destZ = this.nextPoint.z
        , lerpTime = 0.09

      if (this.battleBehaviour.togglePosition) {
        destX += (this.battleBehaviour.attackingPoint.x - this.nextPoint.x) / 3
        destZ += (this.battleBehaviour.attackingPoint.z - this.nextPoint.z) / 3
        lerpTime = 0.2
      }

      this.object.position.x = lerp(this.object.position.x, destX, lerpTime)
      this.object.position.z = lerp(this.object.position.z, destZ, lerpTime)
    }
  }

  onPatch (state, patch, patchId) {
    if (patch.path.indexOf('position') !== -1) {
      // TODO: possible leak here
      this.nextPoint = this.generator.fixTilePosition(this.object.position.clone(), state.position.y, state.position.x)

      this.object.userData.x = state.position.x
      this.object.userData.y = state.position.y

    } else if (patch.path.indexOf('hp') !== -1) {
      console.log(patch.value)

    } else if (patch.path.indexOf('direction') !== -1) {
      this.object.direction = patch.value

    } else if (patch.path.indexOf('action') !== -1) {
      if (patchId > this.lastPatchId) {
        if (!this.battleBehaviour.isAttacking && state.action.type == "attack") {
          this.attackingPoint = this.generator.fixTilePosition(this.object.position.clone(), state.action.position.y, state.action.position.x)
          this.entity.emit('attack-start', this.attackingPoint)
        }

        let text = `-${ state.action.damage }`
          , kind = 'attention'

        if (state.action.missed) {
          kind = 'warn'
          text = 'miss'
        }

        // create label entity
        this.generator.createEntity({
          type: helpers.ENTITIES.TEXT_EVENT,
          text: text,
          kind: kind,
          special: state.action.critical,
          position: state.action.position
        })
        this.entity.emit('attack', state.action)
      }
    }

    this.lastPatchId = patchId
  }

  onDestroy () {
    if (this.attackingInterval) { this.attackingInterval.clear() }
  }

}
