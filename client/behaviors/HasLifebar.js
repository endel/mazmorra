import { Behaviour } from 'behaviour.js'

import Lifebar from '../elements/Lifebar'

export default class HasLifebar extends Behaviour {

  onAttach (factory) {
    // lifebar
    this.lifebar = new Lifebar()
    this.lifebar.position.x = 0

    this.isPVPAllowed = factory && factory.level.isPVPAllowed;

    // position lifebar on top of enemy's variable height
    this.lifebar.position.y = this.object.sprite.scale.y + 0.2;

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

    if (this.object.userData.kind || this.isPVPAllowed) {
      // update cursor to 'attack'
      App.cursor.dispatchEvent({ type: 'cursor', kind: 'attack' })
    }
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
