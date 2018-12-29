var Inventory = require('./Inventory')

class EquipedItems extends Inventory {

  constructor () {
    super({ capacity: 5 })
  }

  add (item) {
    return super.add(item)
  }

}

module.exports = EquipedItems