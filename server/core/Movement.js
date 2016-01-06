'use strict';

var EventEmitter = require('events').EventEmitter

class Movement extends EventEmitter {

  constructor (unit) {
    super()
    this.position = { x: null, y: null }

    this.pending = []
    this.lastMove = 0

    this.unit = unit
    this.active = false
  }

  get destiny () {
    var lastIndex = this.pending.length - 1
    return (lastIndex !== -1) ? { x: this.pending[ lastIndex ][ 0 ], y: this.pending[ lastIndex ][ 1 ] } : null
  }

  get x () { return this.position.x }
  set x (x) { this.position.x = x }
  get y () { return this.position.y }
  set y (y) { this.position.y = y }

  set (x, y) {
    var event = new MoveEvent(this.unit)
    this.emit('move', event, this.position.x, this.position.y, x, y)

    // change direction
    if (this.position.x < x) {
      this.unit.direction = 'bottom'

    } else if (this.position.x > x) {
      this.unit.direction = 'top'

    } else if (this.position.y > y) {
      this.unit.direction = 'left'

    } else if (this.position.y < y) {
      this.unit.direction = 'right'
    }

    if ( event.valid() ) {
      this.position.x = x
      this.position.y = y
    }
  }

  moveTo (pending) {
    var now = Date.now()
    // force to move instantly if last move
    if (now - this.lastMove > this.unit.walkSpeed) {
      this.lastMove = now - this.unit.walkSpeed
    }
    this.pending = pending
  }

  update (currentTime) {
    var timeDiff = currentTime - this.lastMove
      , moves = 0
      , pos = null

    if (timeDiff > this.unit.walkSpeed) {
      moves = Math.floor(timeDiff / this.unit.walkSpeed)

      if (this.pending.length > 0) {
        pos = this.pending.shift()
        this.set(pos[0], pos[1])
        // for (var i=0; i<moves; i++) {
        //   pos = this.pending.shift()
        //   this.set(pos[0], pos[1])
        // }

        this.lastMove = currentTime
        // if (this.unit.action) this.unit.action.lastUpdateTime = currentTime + this.unit.walkSpeed
      }
    }
  }

  toJSON () {
    return this.position
  }

}

class MoveEvent {
  constructor (target) {
    this.isCancelled = false
    this.target = target
  }
  cancel () { this.isCancelled = true }
  valid () { return !this.isCancelled }
}
module.exports = Movement
