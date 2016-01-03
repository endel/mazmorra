'use strict';

var EventEmitter = require('events').EventEmitter
var distance = require('../helpers/Math').distance

class BattleAction extends EventEmitter {

  constructor (attacker, defender) {
    super()

    this.type = 'attack'
    this.attacker = attacker
    this.defender = defender

    this.position = this.defender.position
    this.missed = null
    this.damage = null
    this.critical = null

    this.lastHitTime = null
    this.lastUpdateTime = Date.now()

    this.active = false;
  }

  attack () {
    console.log("attack!")
    let d20 = Math.floor(Math.random() * 20)

    this.missed = (d20 == 1)
    this.critical = (d20 == 20)

    if (!this.missed) {
      this.damage = d20 + this.attacker.damage + this.attacker.attributes[ this.attacker.damageAttribute ]
      if (this.critical) {
        this.damage *= this.attacker.criticalBonus
      }
    }
  }

  update (currentTime) {
    this.active = (distance(this.attacker.position, this.defender.position) <= this.attacker.attackDistance)

    if (this.active) {
      let timeDiff = currentTime - this.lastHitTime
        , attacks = 0
        , pos = null

      if (timeDiff > this.attacker.attackSpeed) {
        // attacks = Math.floor(timeDiff / this.attacker.attackSpeed)
        // while (attacks--) {
          // this.attack()
        // }

        this.attack()
        this.lastHitTime = currentTime
      }
    }

    this.lastUpdateTime = currentTime
  }

  toJSON () {
    return (this.active) ? {
      type: this.type,
      missed: this.missed,
      damage: this.damage,
      critical: this.critical,
      position: this.position,
      lastHitTime: this.lastHitTime
    } : null
  }

}

module.exports = BattleAction
