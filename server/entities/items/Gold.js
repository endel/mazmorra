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
    state.addTextEvent("+" + gold, player.position, 'yellow', 100)
    state.removeEntity( this )
  }

}

module.exports = Gold
