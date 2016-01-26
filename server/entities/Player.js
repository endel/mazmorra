'use strict';

var Unit = require('./Unit')
  , helpers  = require('../../shared/helpers')

class Player extends Unit {

  constructor (id, hero) {
    super(id)
    this.type = helpers.ENTITIES.PLAYER

    var genders = ['man', 'man-2', 'woman']

    this.name = `Hero ${ hero.id }`
    this.lvl = 1

    this.properties = {
      klass: hero.klass,
      hair: hero.hair,
      hairColor: hero.hairColor,
      eye: hero.eye,
      body: hero.body
    }

    // hit | mana | experience points
    this.hp.set(hero.hp || 100, 100)
    this.mp.set(hero.mp || 100, 100)
    this.xp.set(hero.xp || 0, 10)

    this.gold = hero.gold
    this.diamond = hero.diamond

    this.attributes = {
      strenght: hero.strenght,
      dexterity: hero.dexterity,
      intelligence: hero.intelligence,
      vitality: hero.vitality
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
