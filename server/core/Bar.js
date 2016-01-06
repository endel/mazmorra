'use strict';

var EventEmitter = require('events').EventEmitter

class Bar extends EventEmitter {

  constructor (current, max) {
    super()
    this.current = current
    this.max = max || current
  }

  set (value, max) {
    if (max) this.max = max
    this.current = Math.max(0, Math.min(value, this.max))
  }

  toJSON () {
    return {
      current: this.current,
      max: this.max
    }
  }

}

module.exports = Bar
