"use strict";

var Room = require('colyseus').Room
  , ClockTimer = require('clock-timer.js')

  , DungeonState = require('./states/DungeonState')

const TICK_RATE = 30

class DungeonRoom extends Room {

  constructor (options) {
    super(options)

    var mapkind = ['grass', 'rock', 'ice', 'inferno', 'castle']
    // var mapkind = ['rock', 'inferno']
      , i = Math.floor(Math.random() * mapkind.length)

    this.mapkind = options.mapkind || mapkind[i]
    console.log("Construct:", this.mapkind)
    // this.mapkind = 'rock'

    // this.mapkind = options.mapkind || "grass"
    this.level = options.level || 1

    this.players = new WeakMap()
    this.clientMap = new WeakMap()

    this.setState(new DungeonState(
      this.mapkind,
      this.level,
      (['grass', 'ice', 'castle'].indexOf(this.mapkind) !== -1) // is daylight? // Math.random() > 0.5
    ))

    this.state.on('goto', this.onGoTo.bind(this))

    this.clock = new ClockTimer()
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / TICK_RATE)
  }

  requestJoin (options) {
    console.log("requestJoin", options)
    return (
      // (options.mapkind && options.mapkind === this.mapkind) &&
      this.clients.length < 10
    )
  }

  onJoin (client, options) {
    console.log(client.id, 'joined')
    this.sendState(client)

    let player = this.state.createPlayer(client)
    this.players.set(client, player)
    this.clientMap.set(player, client)
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]

    if (key == 'pos') {
      this.state.move(this.players.get(client), value, true)
    } else if (key == 'msg') {
      // remove message after 3 seconds
      let entity = this.state.addMessage(this.players.get(client), value)
      this.clock.setTimeout(this.removeEntity.bind(this, entity), 3000)
    }
  }

  onGoTo (player, data) {
    this.send(this.clientMap.get(player), ['goto', data])
  }

  removeEntity (entity) {
    this.state.removeEntity(entity)
  }

  onLeave (client) {
    console.log(client.id, "leaved")
    this.state.removePlayer(this.players.get(client))
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
