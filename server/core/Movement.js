'use strict';

var EventEmitter = require('events').EventEmitter

class Movement extends EventEmitter {

  constructor (unit) {
    super()
    this.position = { x: null, y: null }

    this.pending = []
    this.lastMove = 0

    this.unit = unit
  }

  get x () { return this.position.x }
  get y () { return this.position.y }

  set (x, y) {
    this.emit('move', this.position.x, this.position.y, x, y)

    var direction = null

    if (this.position.x < x) {
      this.unit.direction = 'bottom'

    } else if (this.position.x > x) {
      this.unit.direction = 'top'

    } else if (this.position.y > y) {
      this.unit.direction = 'left'

    } else if (this.position.y < y) {
      this.unit.direction = 'right'
    }

    this.position.x = x
    this.position.y = y
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
        for (var i=0; i<moves; i++) {
          pos = this.pending.shift()
          this.set(pos[0], pos[1])
        }

        this.lastMove = currentTime
      }
    }
  }

  toJSON () {
    return this.position
  }

}
module.exports = Movement
