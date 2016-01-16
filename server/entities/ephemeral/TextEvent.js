'use strict';

var Entity = require('../Entity')
  , helpers  = require('../../../shared/helpers')

  , creationTime = new WeakMap()

class TextEvent extends Entity {

  constructor (text, position, kind, ttl, small) {
    super()
    if (!ttl) { ttl = 3000 }

    this.type = helpers.ENTITIES.TEXT_EVENT
    this.text = text
    this.position = position
    this.ttl = ttl // ttl on interface

    creationTime.set(this, Date.now())

    if (kind)  { this.kind = kind }
    if (small) { this.small = true }
  }

  update (currentTime) {
    if (currentTime > creationTime.get(this) + 3000) {
      this.state.removeEntity(this)
    }
  }

}

module.exports = TextEvent
