'use strict';

var Entity = require('./Entity')

class Interactive extends Entity {

  constructor (type, position) {
    super()

    this.type = type
    this.position = position || { x: null, y: null }
  }

  interact (moveEvent, player, state) {
    throw new Error(`${this.constructor.name} should implement interact(moveEvent, player, state) method`)
  }

}

module.exports = Interactive
