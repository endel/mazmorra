import { Behaviour } from 'behaviour.js'

export default class Activatable extends Behaviour {

  onAttach () {
  }

  update () {
    this.object.activeSprite.visible = this.isActive
    this.object.inactiveSprite.visible = !this.isActive
  }

  get isActive () {
    return this.object.userData.active
  }

}


