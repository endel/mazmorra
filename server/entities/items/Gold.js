'use strict';

var Item = require('../Item')

  , helpers  = require('../../../shared/helpers')

class Gold extends Item {

  constructor (position) {
    super(helpers.ENTITIES.GOLD, position)
  }

  pick (player, state) {
    let gold = Math.floor(Math.random() * 5)+1
    player.gold += gold
    state.createTextEvent("+" + gold, player.position, 'yellow', 100)

    return true;
  }

}

module.exports = Gold
