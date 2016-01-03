'use strict';

var Unit = require('./Unit')

class Player extends Unit {

  constructor (id) {
    super(id)

    var genders = ['man', 'man-2', 'woman']

    this.gender = genders[ Math.floor(Math.random()*genders.length) ]
    this.name = this.gender
    this.lvl = 1

    // hit | mana | experience points
    this.hp = this.hpMax = 100
    this.mp = this.mpMax = 100
    this.xpMax = 100

    this.attributes = {
      strenght: 5,
      dexterity: 5,
      intelligence: 5,
      vitality: 5
    }

    this.armor = 0
    this.damage = 1

    this.walkSpeed = 600
    this.attackSpeed = 1000
  }

}

module.exports = Player
