import { Behaviour } from 'behaviour.js'

import Lifebar from '../elements/Lifebar'

export default class HasLifebar extends Behaviour {

  onAttach () {
    // lifebar
    this.lifebar = new Lifebar()
    this.lifebar.position.x = 0
    this.lifebar.position.y = 1.5
    this.lifebar.position.z = 0
    this.lifebar.visible = false
    this.object.add(this.lifebar)

    this.on('mouseover', this.onMouseOver.bind(this))
    this.on('mouseout', this.onMouseOut.bind(this))

    this.on('died', this.detach.bind(this))
  }

  update () {
    this.lifebar.progress = (this.object.userData.hp.current / this.object.userData.hp.max)
  }

  onMouseOver (tileSelection) {

    this.lifebar.visible = true

    tileSelection.setColor(config.COLOR_RED)

    // update cursor to 'attack'
    App.cursor.dispatchEvent({ type: 'cursor', kind: 'attack' })

  }

  onMouseOut (tileSelection) {

    // only hide on mouseout if enemy didn't took any damage
    if (this.lifebar.progress == 1) {
      this.lifebar.visible = false
    }

    tileSelection.setColor()

  }

  onDetach () {
    this.lifebar.parent.remove(this.lifebar)
  }

}
