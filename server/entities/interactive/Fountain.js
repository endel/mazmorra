'use strict';

var Interactive = require('../Interactive')
  , helpers  = require('../../../shared/helpers')

class Fountain extends Interactive {

  constructor (position) {
    super(helpers.ENTITIES.FOUNTAIN, position)
    this.active = (Math.random() > 0.5 )
  }

  interact (moveEvent, player, state) {
    moveEvent.cancel()

    // activate if player needs hp or mana
    if (
      this.active && (
        player.hp.current < player.hp.max ||
        player.mp.current < player.mp.max
      )
    ) {
      player.hp.current = player.hp.max
      player.mp.current = player.mp.max
      console.log("activate!")
      this.active = false
    }
  }

}

module.exports = Fountain
