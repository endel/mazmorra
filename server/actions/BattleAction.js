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

    this.lastUpdateTime = 0

    this.active = false;
  }

  get isEligible () {
    return this.defender.isAlive && (distance(this.attacker.position, this.defender.position) <= this.attacker.attackDistance)
  }

  attack () {
    if(!this.isEligible) {
      // clear BattleAction
      this.attacker.action = null;
      this.removeAllListeners();
    }

    let d20 = Math.ceil(Math.random() * 20)

    this.missed = (d20 <= this.defender.armor)
    this.critical = (d20 == 20)

    if (!this.missed) {
      this.damage = d20 + this.attacker.damage + this.attacker.attributes[ this.attacker.damageAttribute ]
      if (this.critical) {
        this.damage *= Math.floor(this.attacker.criticalBonus)
      }

      let damageTaken = this.defender.takeDamage(this)

      if (!this.defender.isAlive) {
        this.defender.onDie()
        this.attacker.onKill(this.defender)

      }
      //
      // TODO: use damageTaken for lifestealing or other modifiers
      //
    }
  }

  update (currentTime) {
    this.active = this.isEligible

    if (this.active) {
      let timeDiff = currentTime - this.lastUpdateTime
        , attacks = 0
        , pos = null

      if (timeDiff > this.attacker.attackSpeed) {
        // attacks = Math.floor(timeDiff / this.attacker.attackSpeed)
        // while (attacks--) {
          // this.attack()
        // }

        this.attack()
        this.lastUpdateTime = currentTime
      }
    }
  }

  toJSON () {
    return (this.active) ? {
      type: this.type,
      missed: this.missed,
      damage: this.damage,
      critical: this.critical,
      position: this.position,
      lastUpdateTime: this.lastUpdateTime
    } : null
  }

}

module.exports = BattleAction
