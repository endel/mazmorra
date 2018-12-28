import { Behaviour } from 'behaviour.js'

import BattleBehaviour from './BattleBehaviour'
import LevelUp from '../elements/effects/LevelUp'

import lerp from 'lerp'
import helpers from '../../shared/helpers'

export default class GameObject extends Behaviour {

  onAttach (factory) {
    this.lastPatchId = 0

    this.nextPoint = null
    this.factory = factory

    if (typeof(this.object.userData.hp) !== "undefined") {
      this.actAsUnit()
    }

    this.on('patch', this.onPatch.bind(this))
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

  onPatch (state, patch, patchId) {
    if (patch.property === 'position') {
      // TODO: possible leak here
      this.nextPoint = this.factory.fixTilePosition(this.object.position.clone(), state.position.y, state.position.x)

      this.object.userData.x = state.position.x
      this.object.userData.y = state.position.y

    } else if (patch.property === 'hp') {
      if (patch.value <= 0) {
        this.entity.emit('died')
      }

    } else if (patch.op === "replace" && patch.property === 'lvl') {
      this.object.add( new LevelUp() )
      // LEVEL UP text event
      this.factory.createEntity({
        type: helpers.ENTITIES.TEXT_EVENT,
        text: 'UP',
        kind: 'warn',
        ttl: 500,
        special: true,
        position: this.object.userData.position
      })

    } else if (patch.property === 'direction') {
      this.object.direction = patch.value

    } else if (patch.property === 'action') {
      // console.log(patchId > this.lastPatchId, state.action)
      // if (patchId > this.lastPatchId) {
        // attack

      // TODO: ITS CALLING MANY TIMES HERE
        let actionType = (state.action && state.action.type) || this.lastActionType
        if (actionType) {
          this.entity.emit(actionType, state.action)
          this.lastActionType = actionType;
        }
      // }

    } else if (patch.property === 'inventory') {
      // TODO: do something with inventory
      // this.entity.emit('')
    }
  }

  onDetach () {
    if (this.attackingInterval) { this.attackingInterval.clear() }
  }

}
