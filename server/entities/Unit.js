'use strict';

var Entity = require('./Entity')
var Movement = require('../core/Movement')

// Actions
var BattleAction = require('../actions/BattleAction')

class Unit extends Entity {

  constructor (id) {
    super(id)

    this.position = new Movement(this)
    this.direction = 'bottom'

    this.action = null

    this.hpCurrent = 50; this.hpMax = 50;
    this.mpCurrent = 0; this.mpMax = 0;
    this.xpCurrent = 0; this.xpMax = 10;

    this.attributes = {
      strenght: 1,
      dexterity: 1,
      intelligence: 1,
      vitality: 1
    }

    this.armor = 1
    this.damage = 1
    this.damageAttribute = 'strenght'
    this.criticalBonus = 1.5 // damage * criticalBonus (on critical)

    // walking attributes
    this.walkSpeed = 1000

    // attack attributes
    this.attackDistance = 1
    this.attackSpeed = 2000
  }

  get hp () { return this.hpCurrent; }
  set hp (hp) { this.hpCurrent = Math.max(0, Math.min(hp, this.hpMax)) }

  get mp () { return this.mpCurrent; }
  set mp (mp) { this.mpCurrent = Math.max(0, Math.min(mp, this.mpMax)) }

  get xp () { return this.xpCurrent; }
  set xp (xp) { this.xpCurrent = Math.max(0, Math.min(xp, this.xpMax)) }

  update (deltaTime) {
    if (this.action) this.action.update(deltaTime)
    this.position.update(deltaTime)
  }

  attack (defender) {
    if (defender === null) {
      this.action = null

    } else if (!this.action || (this.action instanceof BattleAction && this.action.defender !== defender)) {
      this.action = new BattleAction(this, defender)
    }
  }

}

module.exports = Unit
