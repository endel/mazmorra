var helpers  = require('../../shared/helpers')

  // Entities
  , Player = require('./Player')


class NPC extends Player {

  constructor (kind, npcHero = {}) {
    super(undefined, npcHero)

    // only used for Player
    delete this['properties'];

    this.type = helpers.ENTITIES.NPC;
    this.kind = kind;

    this.attackSpeed = 1500
  }

  updateWalkSpeed () {
    this.walkSpeed = 1500 + Math.floor((Math.random() * 4000))
  }

  update (currentTime) {
    super.update(currentTime);

    if (this.position.pending.length === 0) {
      this.updateWalkSpeed();
      this.state.move(this, this.state.roomUtils.getRandomPosition());
    }
  }

}

module.exports = NPC
