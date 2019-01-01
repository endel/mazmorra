'use strict';

var Item = require('../Item')

  , helpers  = require('../../../shared/helpers')

class LifeHeal extends Item {

  constructor (position) {
    super(helpers.ENTITIES.LIFE_HEAL, position)
  }

  pick (player, state) {
    let heal = Math.floor(Math.random() * 10) + 10
    player.hp.current += heal
    state.createTextEvent("+" + heal, player.position, 'red', 100)

    return true;
  }

}

module.exports = LifeHeal

