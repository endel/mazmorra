import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'

export default class HUDController extends Behaviour {

  onAttach (player) {
    this.player = player
  }

  update () {
    this.object.resources.goldAmount.text = this.player.userData.gold
    this.object.resources.diamondAmount.text = this.player.userData.diamond
    this.object.character.levelText.text = this.player.userData.lvl

    this.setPercentage( this.object.lifebar, this.player.userData.hp.current / this.player.userData.hp.max, 'y'  )
    this.setPercentage( this.object.manabar, this.player.userData.mp.current / this.player.userData.mp.max, 'y'  )
    this.setPercentage( this.object.expbar, this.player.userData.xp.current / this.player.userData.xp.max, 'x' )
    this.object.character.levelText.text = this.player.userData.lvl
  }

  setPercentage (object, percentage, attr) {
    var frameAttr = (attr === 'y') ? 'h' : 'w'
      , totalArea = object.bg.material.map.frame[frameAttr]
      , imgHeight = object.bg.material.map.image.height

    // (1 - %)
    var finalPercentage = 1 - percentage

    object.fg.material.map.offset[attr] = lerp(object.fg.material.map.offset[attr], object.initialOffset-((totalArea/imgHeight)*finalPercentage), 0.1)
    object.fg.position[attr] = lerp(
      object.fg.position[attr],
      - finalPercentage - ((object.bg.material.map.frame[frameAttr]/object.fg.material.map.frame[frameAttr]) * object.offsetMultiplier),
      0.1
    )
  }

  onDetach () {
  }

}

