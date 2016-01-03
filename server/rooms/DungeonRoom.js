"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

  , DungeonState = require('./DungeonState')

const TICK_RATE = 30

class DungeonRoom extends Room {

  constructor (options) {
    super(options)

    var mapkind = ['grass', 'rock', 'ice', 'inferno']
      , i = Math.floor(Math.random() * mapkind.length)

    this.mapkind = mapkind[i]

    // this.mapkind = options.mapkind || "grass"
    this.level = options.level || 1

    this.setState(new DungeonState(
      this.mapkind,
      this.level,
      (['grass', 'ice'].indexOf(this.mapkind) !== -1) // is daylight? // Math.random() > 0.5
    ))

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    // this.level === options.level &&
    return ( this.clients.length < 10)
  }

  onJoin (client, options) {
    console.log(client.id, 'joined')
    this.sendState(client)

    this.state.createPlayer(client)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]

    if (key == 'pos') {
      this.state.move(client.player, value, true)
    }
  }

  onLeave (client) {
    console.log(client.id, "leaved")
    this.state.removePlayer(client.player)
  }

  tick () {
    // update game logic
    this.clock.tick()
    this.state.update(this.clock.currentTime)
  }

  dispose () {
    clearInterval(this.tickInterval)
    console.log("dispose MatchRoom", this.roomId)
  }

}

module.exports = DungeonRoom
