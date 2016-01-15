'use strict';

var Unit = require('./Unit')

// Actions
var BattleAction = require('../actions/BattleAction')

var helpers  = require('../../shared/helpers')

class Enemy extends Unit {

  constructor (kind) {
    super()
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind
    this.lvl = 1

    // this.armor = 0
    // this.damage = 1

    // this.walkSpeed = 1000
    // this.attackSpeed = 1000
  }

  takeDamage (battleAction ) {
    if (!this.isBattlingAgainst(battleAction.attacker)) {
      // enemies attack back and follow whoever attacked him
      this.action = new BattleAction(this, battleAction.attacker)
    }

    this.state.move(this, { x: battleAction.attacker.position.y, y: battleAction.attacker.position.x }) // , false
    return super.takeDamage(battleAction)
  }



}
module.exports = Enemy
