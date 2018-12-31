import { Behaviour } from 'behaviour.js'
import Activatable from './Activatable';

export default class NearPlayerOpacity extends Behaviour {

  onAttach () {
    if (IS_DAY) {
      this.detach();
      return;
    }

  }

  update () {
    // no need to apply opacity on daylight
    if (window.player) {
      var v1 = this.object.position
        , v2 = window.player.position

        , dx = v1.x - v2.x
        , dy = v1.y - v2.y
        , dz = v1.z - v2.z
        , distance = Math.sqrt(dx*dx+dy*dy+dz*dz)

        // TODO: improve me
        // make it dynamic accouding to player illumination
        , opacity = 5 / distance;

      if (this.entity.getBehaviour("Activatable")) {
        console.log("IS ACTIVATABLE")
        this.object.activeSprite.material.opacity = opacity;
        this.object.inactiveSprite.material.opacity = opacity;

      } else {
        (this.object.material || this.object.children[0].material).opacity = opacity;
      }
    }
  }

  onDetach () { }

}

