import { Behaviour } from 'behaviour.js'

import Shadow from './Shadow'

export default class PlayerBehaviour extends Behaviour {

  onAttach () {
    this.object.behave(new Shadow)
  }

  update () {
  }

  onDestroy () {
    // if (this.tween) this.tween.dispose()
  }

}

