'use strict';

import Highlight from './Highlight'
import TextEvent from '../entities/TextEvent'

export default class LevelUp extends Highlight {

  constructor () {
    super()

    this.position.y = 1

    tweener.
      add(this.scale).
      to({ x: this.scale.x + 3, y: this.scale.y + 1.15 }, 1100, Tweener.ease.cubicOut);

    tweener.
      add(this.material).
      wait(900).
      to({ opacity: 0 }, 150, Tweener.ease.cubicOut).
      then(this.removeFromParent.bind(this))
  }

  removeFromParent () {
    this.getEntity().destroy()
    this.parent.remove(this)
  }

}

