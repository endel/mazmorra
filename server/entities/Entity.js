var shortid = require('shortid')

class Entity {

  constructor (id) {
    this.id = id || shortid.generate()
  }

  update () { /* does nothing */ }

}

module.exports = Entity
