class Inventory {

  constructor () {
    this.slots = {}
    this.capacity = 4
  }

  set (data) {
    console.log("Inventory#set: ", data)
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

}

module.exports = Inventory
