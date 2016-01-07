import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'

export default class HUDController extends Behaviour {

  onAttach (player) {
    this.player = player
  }

  update () {
    this.object.resources.goldAmount.text = this.player.userData.gold
    this.object.resources.diamondAmount.text = this.player.userData.diamond

    this.setPercentage( this.object.lifebar, this.player.userData.hp.current / this.player.userData.hp.max, 'y'  )
    this.setPercentage( this.object.manabar, this.player.userData.mp.current / this.player.userData.mp.max, 'y'  )
    this.setPercentage( this.object.expbar, this.player.userData.xp.current / this.player.userData.xp.max, 'x' )
    this.object.character.levelText.text = this.player.userData.lvl
  }

  setPercentage (object, percentage, attr) {
    var totalHeight = object.bg.material.map.image.height
      , unusableHeight = object.blankPixelArea
      , usableHeight = totalHeight - unusableHeight
      , usableRatio = ((totalHeight - unusableHeight * 2)/totalHeight)

    // (1 - %)
    var finalPercentage = (unusableHeight/totalHeight) + (usableRatio - (percentage * usableRatio)) // (unusableHeight/totalHeight) // - (0.6*usableRatio)

    object.fg.material.map.offset[attr] = lerp(object.fg.material.map.offset[attr], -finalPercentage, 0.1)
    object.fg.position[attr] = lerp(object.fg.material.map.offset[attr], -finalPercentage, 0.1)
  }

  onDetach () {
  }

}

