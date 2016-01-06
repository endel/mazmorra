import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'

export default class PlayerBehaviour extends Behaviour {

  onAttach () {
    this.object.addBehaviour(new Shadow)
  }

  update () {
  }

  onDetach () {
    // if (this.tween) this.tween.dispose()
  }

}

