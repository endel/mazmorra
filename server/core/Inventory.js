// var Entity = require('../entities/Entity')
var Item = require('../entities/Item')

class Inventory {

  constructor (options, items) {
    if (!options) options = {}

    this.slots = {}
    this.capacity = options.capacity || 4

    if (items) { this.set(items) }
  }

  set (items) {
    let item, i
    for (i=0; i<items.length; i++) {
      // TODO: fix position
      this.add(new Item(items[i].type, { x: i, y: 0 }))
    }
  }

  add (item) {
    let success = this.hasAvailability()

    if (this.hasAvailability()) {
      this.slots[ item.id ] = item
    }

    return success
  }

  hasAvailability () {
    return Object.keys( this.slots ).length < this.capacity
  }

  toJSON () {
    return this.slots
  }

}

module.exports = Inventory

