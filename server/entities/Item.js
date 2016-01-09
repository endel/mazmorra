'use strict';

var Entity = require('./Entity')

class ItemEntity extends Entity {

  constructor (type, position) {
    super()

    this.type = type
    this.position = { x: position.x, y: position.y }
  }

  pick (player, state) {
    throw new Error(`${this.constructor.name} should implement pick(player, state) method`)
  }

}

module.exports = ItemEntity
