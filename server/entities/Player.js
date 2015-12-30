'use strict';

var Unit = require('./Unit')

class Player extends Unit {

  constructor (id) {
    super()

    this.id = id
    this.lvl = 1

    // hit | mana | experience points
    this.setHP(100)
    this.setMP(100)
    this.setXP(0, 100)

    this.attributes = {
      strenght: 5,
      dexterity: 5,
      intelligence: 5,
      vitality: 5
    }

    this.armor = 0
    this.damage = 1

    this.walkSpeed = 600
    this.attackSpeed = 600
  }

}

module.exports = Player
