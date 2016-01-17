'use strict';

var Interactive = require('../Interactive')
  , helpers  = require('../../../shared/helpers')

class Fountain extends Interactive {

  constructor (position) {
    super(helpers.ENTITIES.FOUNTAIN, position)
    this.active = (Math.random() > 0.5 )

    this.activationTime = Date.now()
    this.fillTimeout = 60000 // 60 seconds to fill
  }

  update (currentTime) {
    if (currentTime > this.activationTime + this.fillTimeout) {
      this.active = true
    }
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

      this.active = false
      this.activationTime = Date.now()
    }
  }

}

module.exports = Fountain
