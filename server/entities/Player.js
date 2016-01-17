'use strict';

var Unit = require('./Unit')
  , helpers  = require('../../shared/helpers')

class Player extends Unit {

  constructor (id) {
    super(id)
    this.type = helpers.ENTITIES.PLAYER

    var genders = ['man', 'man-2', 'woman']

    this.gender = genders[ Math.floor(Math.random()*genders.length) ]
    this.name = this.gender
    this.lvl = 1

    // hit | mana | experience points
    this.hp.set(100, 100)
    this.mp.set(100, 100)
    this.xp.set(0, 10)

    this.gold = 0
    this.diamond = 0

    this.attributes = {
      strenght: 5,
      dexterity: 5,
      intelligence: 5,
      vitality: 5
    }

    this.armor = 0
    this.damage = 1

    this.attackDistance = 1

    // this.walkSpeed = 600
    this.walkSpeed = 300
    this.attackSpeed = 1000
  }

  onMove (moveEvent, prevX, prevY, currentX, currentY) {
    super.onMove(moveEvent, prevX, prevY, currentX, currentY)

    if (this.position.target) {
      this.state.checkOverlapingEntities(moveEvent, currentX, currentY)
    }
  }
}

module.exports = Player
