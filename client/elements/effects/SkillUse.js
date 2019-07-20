'use strict';

import Highlight from './Highlight'
import { skillAttackSpeedSound, skillMovementSpeedSound, playRandom } from '../../core/sound';

export default class SkillUse extends Highlight {

  constructor (skillName, skillDuration) {
    super('skill')

    if (skillName === "attack-speed") {
      playRandom(skillAttackSpeedSound);

    } else if (skillName === "movement-speed")  {
      playRandom(skillMovementSpeedSound);
    }

    this.position.y = 1

    App.tweens.
      add(this.scale).
      to({ x: this.scale.x + 1, y: this.scale.y + 1 }, 900, Tweener.ease.cubicOut);

    App.tweens.
      add(this.material).
      wait(skillDuration).
      to({ opacity: 0 }, 150, Tweener.ease.cubicOut).
      then(this.removeFromParent.bind(this))
  }

  removeFromParent () {
    this.getEntity().destroy();

    if (this.parent) {
      this.parent.remove(this);
    }
  }

}

