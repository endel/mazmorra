'use strict';

var Interactive = require('../Interactive')
  , helpers  = require('../../../shared/helpers')

class Door extends Interactive {

  constructor (position, destiny) {
    super(helpers.ENTITIES.DOOR, position)
    this.destiny = destiny
  }

  interact (moveEvent, player, state) {
    state.emit('goto', player, this.destiny)
  }

}

module.exports = Door
