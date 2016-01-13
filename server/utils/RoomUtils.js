class RoomUtils {

  constructor (rand, gridUtils) {
    this.rand = rand
    this.gridUtils = gridUtils
    this.rooms = new WeakMap()
  }

  cacheRoomData (room) {
    // store list of positions available on this room to place elements
    rooms.set(room, this.getMaxEntities(room))
  }

  getMaxEntities (room) {
    return (room.size.y-4) + (room.size.x-3)
  }

  getNextAvailablePosition (room) {
    let remainingElements = rooms.get(room)
    if (remainingElements == 0) { return false }

    let remainingTries = this.getMaxEntities(room)
      , x, y;

    do {
      x = room.position.y + 1 + this.rand.intBetween(0, room.size.y - 4)
      y = room.position.x + 1 + this.rand.intBetween(0, room.size.x - 3)
      remainingTries--
    } while (this.gridUtils.getEntityAt(x, y) !== null && remainingTries > 0)

    return {x: x, y: y}
  }

}

module.exports = RoomUtils

