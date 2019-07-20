'use strict';

import Highlight from './Highlight'
import { levelUpSound, playSound3D } from '../../core/sound';

export default class LevelUp extends Highlight {

  constructor () {
    super()

    playSound3D(levelUpSound, this);

    this.position.y = 1

    App.tweens.
      add(this.scale).
      to({ x: this.scale.x + 3, y: this.scale.y + 1.1 }, 1100, Tweener.ease.cubicOut);

    App.tweens.
      add(this.material).
      wait(900).
      to({ opacity: 0 }, 150, Tweener.ease.cubicOut).
      then(this.removeFromParent.bind(this))
  }

  removeFromParent () {
    this.getEntity().destroy()

    if (this.parent) {
      this.parent.remove(this)
    }
  }

}

