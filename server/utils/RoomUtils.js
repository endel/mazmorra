class RoomUtils {

  constructor (rand, state, rooms) {
    this.rand = rand
    this.state = state

    this.rooms = rooms
    this.data = new WeakMap()

    this.cacheRoomData()
  }

  cacheRoomData () {
    for (var i=0; i<this.rooms.length; i++) {
      let room = this.rooms[i]
        , positions = []

      // for (var x = 1; x < room.size.x - 3; x++) {
      //   for (var y = 1; y < room.size.y - 4; y++) {
      for (var x = 1; x < room.size.x - 1; x++) {
        for (var y = 1; y < room.size.y - 1; y++) {
          let posX = room.position.y + y
            , posY = room.position.x + x

          if (this.state.startPosition.x !== posX || this.state.startPosition.y !== posY) {
            positions.push({ x: posX , y: posY })
          }
        }
      }

      this.data.set(room, this.shuffle(positions))
    }
  }

  getNumPositionsRemaining (room) {
    return this.data.get(room).length
  }

  hasPositionsRemaining (room) {
    return this.getNumPositionsRemaining(room) > 0
  }

  getNextAvailablePosition (room) {
    let positions = this.data.get(room)
    return positions.shift()
  }

  shuffle (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = this.rand.intBetween(0, i)
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

}

module.exports = RoomUtils
