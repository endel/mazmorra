import { Behaviour } from 'behaviour.js'

export default class NearPlayerOpacity extends Behaviour {

  onAttach () { }

  update () {
    // no need to apply opacity on daylight
    if (!IS_DAY && this.player) {
      var v1 = this.object.position
        , v2 = this.player.position

        , dx = v1.x - v2.x
        , dy = v1.y - v2.y
        , dz = v1.z - v2.z
        , distance = Math.sqrt(dx*dx+dy*dy+dz*dz);

      // TODO: improve me
      // make it dynamic accouding to player illumination
      (this.object.material || this.object.children[0].material).opacity = 5 / distance
    }
  }

  onDetach () { }

}

