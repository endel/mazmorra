import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class GameObject extends Behaviour {

  onAttach (generator) {
    this.nextPoint = null
    this.generator = generator

    this.on('patch', this.onPatch.bind(this))
  }

  update () {
    if (this.nextPoint) {
      this.object.position.x = lerp(this.object.position.x, this.nextPoint.x, 0.09)
      this.object.position.z = lerp(this.object.position.z, this.nextPoint.z, 0.09)
    }
  }

  onPatch (state, patch) {
    if (patch.path.indexOf('position') !== -1) {
      // TODO: possible leak here
      this.nextPoint = this.generator.fixTilePosition(this.object.position.clone(), state.position.y, state.position.x)

      this.object.userData.x = state.position.x
      this.object.userData.y = state.position.y

    } else if (patch.path.indexOf('direction') !== -1) {
      this.object.direction = patch.value
    }


  }

  onDestroy () { }

}


