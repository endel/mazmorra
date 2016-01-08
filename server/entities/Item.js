'use strict';

var Entity = require('./Entity')

class ItemEntity extends Entity {

  constructor (type, position) {
    super()

    this.type = type
    this.position = position || {x: null, y: null}
  }

}

module.exports = ItemEntity
