'use strict';

var Movement = require('../core/Movement')

class Unit {

  constructor () {
    this.position = new Movement(this)
    this.direction = 'bottom'

    this.hp = { current: 1, max: 1 }
    this.mp = { current: 0, max: 0 }
    this.xp = { current: 0, max: 0 }

    this.attributes = {
      strenght: 1,
      dexterity: 1,
      intelligence: 1,
      vitality: 1
    }

    this.armor = 0
    this.damage = 1

    this.walkSpeed = 1000
    this.attackSpeed = 1000
  }

  update (deltaTime) {
    this.position.update(deltaTime)
  }

  setHP (hp, max) {
    this.hp.current = hp
    if (max) this.hp.max = max
  }

  setMP (mp, max) {
    this.mp.current = mp
    if (max) this.mp.max = max
  }

  setXP (xp, max) {
    this.xp.current = xp
    if (max) this.xp.max = max
  }

}

module.exports = Unit
