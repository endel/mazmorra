import EventEmitter from 'tiny-emitter'
import Keycode from 'keycode.js'

// import Character from '../../entities/Character'
import Composition from '../../entities/character/Composition'

import SelectBox from '../../hud/controls/SelectBox'

export default class Builder extends EventEmitter {

  constructor (scene, hud, camera) {
    super()

    this.scene = scene
    this.hud = hud
    this.camera = camera

    this.currentGenderIndex = 0

    this.character = new Composition()
    this.character.position.set(0, -HUD_MARGIN*2, 0)
    this.character.scale.set(2, 2, 2)

    this.scene.add(this.character)
    this.camera.lookAt(this.character.position)

    this.goUp(1500)
    this.turnInterval = this.infiniteTurnInterval(4000)

    this.buildHUD()

    window.addEventListener('click', this.onClick.bind(this))
    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  buildHUD () {
    this.bodySelection = new SelectBox([], "BODY")
    this.bodySelection.position.set(0, - window.innerHeight / 2 + this.bodySelection.height + HUD_MARGIN, 0)
    this.hud.addInteractiveControl(this.bodySelection)

    this.hairSelection = new SelectBox([], "HAIR")
    this.hairSelection.position.set(0, this.bodySelection.position.y + this.hairSelection.height + HUD_MARGIN, 0)
    this.hud.addInteractiveControl(this.hairSelection)

    this.eyeSelection = new SelectBox([], "EYES")
    this.eyeSelection.position.set(0, this.hairSelection.position.y + this.eyeSelection.height + HUD_MARGIN, 0)
    this.hud.addInteractiveControl(this.eyeSelection)

    this.classSelection = new SelectBox([], "CLASS")
    this.classSelection.position.set(0, this.eyeSelection.position.y + this.classSelection.height + HUD_MARGIN, 0)
    this.hud.addInteractiveControl(this.classSelection)
  }

  changeGender (direction) {
    // this.currentGenderIndex =  (this.currentGenderIndex + direction) % this.availableGenders.length
    // // this.character.gender = this.availableGenders[ this.currentGenderIndex ]
    // // this.character.direction = this.character._direction
    //
    // // this.hud.character.gender = this.availableGenders[ this.currentGenderIndex ]
    // this.hud.selectionText.text = this.availableGenders[ this.currentGenderIndex ]
  }

  onClick (e) {
    var isForward = e.clientX > window.innerWidth / 2
    this.changeGender((isForward) ? 1 : -1)
  }

  onKeyDown (e) {
    if (e.which == Keycode.ENTER) {
      console.log("SELECT!")

    } else if (e.which == Keycode.RIGHT) {
      this.changeGender(1)

    } else if (e.which == Keycode.LEFT) {
      this.changeGender(-1)
    }
  }

  goUp (duration) {
    this.tween = tweener.
      add(this.character.position).
      to({ y: 0.5 }, duration, Tweener.ease.cubicInOut).
      then(this.goDown.bind(this, duration))
  }

  goDown (duration) {
    this.tween = tweener.
      add(this.character.position).
      to({ y: -0.5 }, duration, Tweener.ease.cubicInOut).
      then(this.goUp.bind(this, duration))
  }

  infiniteTurnInterval (interval) {
    return clock.setInterval(() => this.turnCharacter(), interval)
  }

  turnCharacter () {
    var directions = ['left', 'top', 'right', 'bottom']
      , i = 0
      , timeout = clock.setInterval(() => {
          this.character.direction = directions[i]
          i++;
          if (i === 4) {
            timeout.clear()
          }
        }, 180)
  }

}

