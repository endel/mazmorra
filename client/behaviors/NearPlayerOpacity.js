import { Behaviour } from 'behaviour.js'
import Activatable from './Activatable';

export default class NearPlayerOpacity extends Behaviour {

  onAttach () {
    if (
      IS_DAY ||
      typeof(this.object.userData.hp) !== "undefined" && // if unit is already dead, dettach imediatelly.
      this.object.userData.hp.current <= 0
    ) {
      this.detach();
      return;
    }

    this.on('died', this.detach.bind(this))
  }

  update () {
    // no need to apply opacity on daylight
    if (global.player) {
      var v1 = this.object.position
        , v2 = global.player.position

        , dx = v1.x - v2.x
        , dy = v1.y - v2.y
        , dz = v1.z - v2.z
        , distance = Math.sqrt(dx*dx+dy*dy+dz*dz)

        // TODO: improve me
        // make it dynamic accouding to player illumination
        , opacity = 5 / distance;

      if (this.entity.getBehaviour("Activatable")) {
        this.object.activeSprite.material.opacity = opacity;
        this.object.inactiveSprite.material.opacity = opacity;

      // } else if (this.entity.getBehaviour("Openable")) {
      //   this.object.body.material.opacity = opacity;
      //   this.object.head.material.opacity = opacity;

      } else {
        (this.object.material || this.object.children[0].material).opacity = opacity;
      }
    }
  }

  onDetach () { }

}

