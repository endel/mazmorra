import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class Network extends Behaviour {

  onAttach () {
    this.nextPoint = null
  }

  update () {
    if (this.nextPoint) {
      this.object.position.x = lerp(this.object.position.x, this.nextPoint.x, 0.04)
      this.object.position.z = lerp(this.object.position.z, this.nextPoint.z, 0.04)
    }
  }

  move(point, tileX, tileY) {
    this.nextPoint = point
    this.object.userData.x = tileX
    this.object.userData.y = tileY
  }

  onDestroy () {
    // if (this.tween) this.tween.dispose()
  }

}

