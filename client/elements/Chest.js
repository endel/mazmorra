'use strict';

import Openable from '../behaviors/Openable'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'
import { i18n } from '../lang';

export default class Chest extends THREE.Object3D {

  constructor (data) {
    super()
    this.userData = data

    this.body = ResourceManager.getSprite(`interactive-${data.kind}-body`);
    this.add(this.body)

    this.head = ResourceManager.getSprite(`interactive-${data.kind}-head`);
    this.add(this.head)

    this.openableBehaviour = new Openable
    this.addBehaviour(this.openableBehaviour);

    // this.addBehaviour(new NearPlayerOpacity);
  }

  get label () {
    return (this.openableBehaviour.isOpen)
      ? i18n('openedChest')
      : i18n('chest')
  }

  destroy () {
    delete this.openableBehaviour;
  }

}
