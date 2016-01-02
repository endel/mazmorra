import { Behaviour } from 'behaviour.js'

import Lifebar from '../entities/Lifebar'

export default class HasLifebar extends Behaviour {

  onAttach () {
    // lifebar
    this.lifebar = new Lifebar()
    this.lifebar.position.x = 0.5
    this.lifebar.position.y = 2.5
    this.lifebar.position.z = 1
    this.lifebar.visible = false
    this.object.add(this.lifebar)

    this.on('mouseover', this.onMouseOver.bind(this))
    this.on('mouseout', this.onMouseOut.bind(this))
  }

  onMouseOver (tileSelection) {
    this.lifebar.visible = true
    tileSelection.setColor(COLOR_RED)
  }

  onMouseOut (tileSelection) {
    this.lifebar.visible = false
    tileSelection.setColor()
  }

  onDestroy () {
    this.lifebar.parent.remove(this.lifebar)
  }

}


