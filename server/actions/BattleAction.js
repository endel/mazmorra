'use strict';

var EventEmitter = require('events').EventEmitter
var distance = require('../helpers/Math').distance

class BattleAction extends EventEmitter {

  constructor (attacker, defender) {
    super()

    this.attacker = attacker
    this.defender = defender

    this.missed = null
    this.damage = null
    this.critical = null
  }

  update () {
    console.log("Battle action!", distance(this.attacker.position, this.defender.position))

    // if (Math.abs(this.attacker.position.x) - )
    // console.log()
  }

  toJSON () {
    return {
      missed: this.missed,
      damage: this.damage,
      critical: this.critical
    }
  }

}

module.exports = BattleAction
