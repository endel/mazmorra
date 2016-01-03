'use strict';

var Entity = require('./Entity')

class Pickable extends Entity {

  constructor (type) {
    super()

    this.type = type
    this.position = { x: null, y: null }
  }

}

module.exports = Pickable
