var shortid = require('shortid')
  , state = new WeakMap()

class Entity {

  constructor (id) {
    this.id = id || shortid.generate()
  }

  update() {
    /* does nothing */
  }

  set state (value) { state.set(this, value) }
  get state () { return state.get(this) }

}

module.exports = Entity
