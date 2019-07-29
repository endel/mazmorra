'use strict';

import Activatable from '../behaviors/Activatable'
import { i18n } from '../lang';

export default class Fountain extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.activeSprite = ResourceManager.getSprite( `interactive-fountain` )
    this.add(this.activeSprite)

    this.inactiveSprite = ResourceManager.getSprite( `interactive-fountain-dry` )
    this.add(this.inactiveSprite)

    this.activeSprite.position.y += 0.1
    this.inactiveSprite.position.y += 0.1

    this.activateable = new Activatable()
    this.addBehaviour(this.activateable)
  }

  get label () {
    return ((this.activateable.isActive) ? i18n('fountain') : i18n('dryFountain'))
  }

}

