"use strict";

var Room = require('colyseus').Room

  , DungeonState = require('./states/DungeonState')

  , User = require('../db/models').User
  , Hero = require('../db/models').Hero

  , utils = require('colyseus').utils
  , protocol = require('colyseus').protocol

const TICK_RATE = 30

class DungeonRoom extends Room {

  onInit (options) {
    var mapkind = ['grass', 'rock', 'ice', 'inferno', 'castle']
    // var mapkind = ['rock', 'inferno']
      , i = Math.floor(Math.random() * mapkind.length)

    this.mapkind = options.mapkind || mapkind[i]
    // this.mapkind = 'rock'

    this.autoDispose = false;

    // this.mapkind = options.mapkind || "grass"
    this.progress = options.progress || 1
    this.difficulty = options.difficulty || 1

    this.players = new WeakMap()
    this.heroes = new WeakMap()
    this.clientMap = new WeakMap()

    this.setState(new DungeonState(
      this.mapkind,
      this.progress,
      this.difficulty,
      (['grass', 'ice', 'castle'].indexOf(this.mapkind) !== -1) // is daylight? // Math.random() > 0.5
      // false
    ))

    this.state.on('goto', this.onGoTo.bind(this))

    setInterval( this.tick.bind(this), 1000 / TICK_RATE );

    // this.setSimulationInterval( this.tick.bind(this), 1000 / TICK_RATE )
  }

  requestJoin (options) {
    var success = true;

    if (options.mapkind) success = (success && options.mapkind === this.mapkind)
    if (options.progress) success = (success && options.progress === this.progress)
    if (options.difficulty) success = (success && options.difficulty === this.difficulty)

    return ( success && this.clients.length < 10 )
  }

  onJoin (client, options) {
    User.findOne({ token: options.token }).populate('heros').then(user => {
      if (!user) {
        console.log("WARNING: invalid token '"+ options.token +"'")
        return
      }
      let player = this.state.createPlayer(client, user.heros[0])
      this.heroes.set(client, user.heros[0]._id)
      this.players.set(client, player)
      this.clientMap.set(player, client)
    })
  }

  onMessage (client, data) {
    let key = data[0]
      , value = data[1]
      , player = this.players.get(client)

    if (!player) {
      console.log("ERROR: message comming from invalid player.")
      return
    }

    if (key == 'pos') {
      this.state.move(player, value, true)
    } else if (key == 'msg') {
      // remove message after 3 seconds
      let entity = this.state.addMessage(player, value)
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
    var heroId = this.heroes.get(client)
      , player = this.players.get(client)

    if (!heroId) return;

    // sync
    Hero.update({ _id: heroId }, {
      $set: {
        lvl: player.lvl,
        gold: player.gold,
        diamond: player.diamond,
        hp: player.hp.current,
        mp: player.mp.current,
        xp: player.xp.current
      }
    }).then(() => {
      this.players.delete(client)
      this.clientMap.delete(player)
      this.heroes.delete(client)
      this.state.removePlayer(player)
    })
  }

  tick () {
    // update game logic
    this.clock.tick()
    this.state.update(this.clock.currentTime)
  }

  // dispose () {
  //   console.log("dispose MatchRoom", this.roomId)
  // }

}

module.exports = DungeonRoom
