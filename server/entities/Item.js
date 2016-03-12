'use strict';

var Entity = require('./Entity')

  , helpers  = require('../../shared/helpers')

class ItemEntity extends Entity {

  constructor (type, position) {
    super()

    this.type = type
    this.position = { x: position.x, y: position.y }
  }

  pick (player, state) {
    return player.inventory.add(this)
  }

}

module.exports = ItemEntity
