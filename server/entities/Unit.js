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

    this.currentAction = null

    this.hpCurrent = 1; this.hpMax = 1;
    this.mpCurrent = 0; this.mpMax = 0;
    this.xpCurrent = 0; this.xpMax = 10;

    this.attributes = {
      strenght: 1,
      dexterity: 1,
      intelligence: 1,
      vitality: 1
    }

    this.armor = 0
    this.damage = 1

    // walking attributes
    this.walkSpeed = 1000

    // attack attributes
    this.attackDistance = 1
    this.attackSpeed = 1000
  }

  get hp () { return this.hpCurrent; }
  set hp (hp) { this.hpCurrent = (hp > this.hpMax) ? this.hpMax : hp }

  get mp () { return this.mpCurrent; }
  set mp (mp) { this.mpCurrent = (mp > this.mpMax) ? this.mpMax : mp }

  get xp () { return this.xpCurrent; }
  set xp (xp) { this.xpCurrent = (xp > this.xpMax) ? this.xpMax : xp }

  update (deltaTime) {
    this.position.update(deltaTime)
    if (this.currentAction) this.currentAction.update()
  }

  attack (defender) {
    if (!this.currentAction || (this.currentAction instanceof BattleAction && this.currentAction.defender !== defender)) {
      this.currentAction = new BattleAction(this, defender)
    }
  }

}

module.exports = Unit
