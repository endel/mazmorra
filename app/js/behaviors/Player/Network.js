import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class Network extends Behaviour {

  onAttach (colyseus, room) {
    this.colyseus = colyseus
    this.room = room
    this.nextPoint = null

    this.on('action', this.onAction.bind(this))
  }

  onAction (position) {
    console.log("Action!", position)
    this.room.send(['pos', position])
  }

  update () {
    if (this.nextPoint) {
      this.object.position.x = lerp(this.object.position.x, this.nextPoint.x, 0.09)
      this.object.position.z = lerp(this.object.position.z, this.nextPoint.z, 0.09)
    }
  }

  move(point, tileX, tileY) {
    this.nextPoint = point

    var direction = null

    if (this.object.userData.x < tileX) {
      direction = 'bottom'
    } else if (this.object.userData.x > tileX) {
      direction = 'top'
    } else if (this.object.userData.y > tileY) {
      direction = 'left'
    } else if (this.object.userData.y < tileY) {
      direction = 'right'
    }

    if (direction) this.entity.emit('change-direction', direction)

    this.object.userData.x = tileX
    this.object.userData.y = tileY
  }

  onDestroy () {
    // if (this.tween) this.tween.dispose()
  }

}

