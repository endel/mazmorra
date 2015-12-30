'use strict';

class Movement {

  constructor (unit) {
    this.position = { x: null, y: null }

    this.pending = []
    this.lastMove = 0

    this.unit = unit
  }

  get x () { return this.position.x }
  get y () { return this.position.y }

  set (x, y) {
    this.position.x = x
    this.position.y = y
  }

  moveTo (pending) {
    // TODO: keep last move request to avoid walking faster by clicking faster
    this.lastMove = Date.now() - this.unit.walkSpeed
    this.pending = pending
  }

  update (currentTime) {
    var timeDiff = currentTime - this.lastMove
      , moves = 0
      , pos = null

    if (timeDiff > this.unit.walkSpeed) {
      moves = Math.floor(timeDiff / this.unit.walkSpeed)

      if (this.pending.length > 0) {
        for (var i=0; i<moves; i++) {
          pos = this.pending.shift()
          this.position.x = pos[0]
          this.position.y = pos[1]
        }
      }

      this.lastMove = currentTime
    }
  }

  toJSON () {
    return this.position
  }

}
module.exports = Movement
