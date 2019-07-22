'use strict';

import Openable from '../behaviors/Openable'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

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
    return `${(this.openableBehaviour.isOpen) ?  "Opened " : ""}Chest`
  }

}
