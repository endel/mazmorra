'use strict';

var Unit = require('./Unit')

class Enemy extends Unit {

  constructor (type) {
    super()

    this.type = type
    this.lvl = 1

    this.setHP(8)

    // this.armor = 0
    // this.damage = 1

    // this.walkSpeed = 1000
    // this.attackSpeed = 1000
  }

}
module.exports = Enemy
