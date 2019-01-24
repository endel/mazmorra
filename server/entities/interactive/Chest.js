'use strict';

var Interactive = require('../Interactive')

  , helpers  = require('../../../shared/helpers')

class Chest extends Interactive {

  constructor (position) {
    super(helpers.ENTITIES.CHEST, position)
    this.kind = 'chest2'
  }

  interact (moveEvent, player, state) {
    if (!this.action) {
      this.action = {
        type: 'open',
        lastUpdateTime: Date.now()
      };
      state.dropItemFrom (this)
      moveEvent.cancel()
    }
  }

}

module.exports = Chest

