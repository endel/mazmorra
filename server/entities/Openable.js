'use strict';

var Entity = require('./Entity')

class Openable extends Entity {

  constructor (type) {
    super()

    this.type = type
    this.position = { x: null, y: null }
  }

}

module.exports = Openable
