'use strict';

var helpers  = require('../../shared/helpers')

  // Entities
  , Unit = require('./Unit')
  , Player = require('./Player')

  // Actions
  , BattleAction = require('../actions/BattleAction')

class Enemy extends Unit {

  constructor (kind) {
    super()
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind
    this.lvl = 1

    // this.armor = 0
    // this.damage = 1

    // this.walkSpeed = 1000
    // this.attackSpeed = 1000
  }

  update (currentTime) {
    super.update(currentTime)

    if (!this.action) {
      var closePlayer = this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x, Player)
           || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x, Player)
           || this.state.gridUtils.getEntityAt(this.position.y, this.position.x + 1, Player)
           || this.state.gridUtils.getEntityAt(this.position.y, this.position.x - 1, Player)

      if (closePlayer) {
        this.state.move(this, { x: closePlayer.position.y, y: closePlayer.position.x })
      }
    }
  }

  onDie () {
    // this.state.pathgrid.setWalkableAt(this.position.x, this.position.y, true)
  }

  takeDamage (battleAction ) {
    this.state.move(this, { x: battleAction.attacker.position.y, y: battleAction.attacker.position.x }) // , false
    return super.takeDamage(battleAction)
  }



}

module.exports = Enemy
