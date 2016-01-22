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

    this.options = {
      classes: ['warrior', 'archer', 'mage'],
      bodies: [{
        text: 'brown',
        value: 0
      }, {
        text: 'white',
        value: 1
      }, {
        text: 'black',
        value: 2
      }],
      hairs: ['0', '1', '2', '3', '4', '5', '6', '7'],
      eyes: [{
        text: 'blue',
        value: 0
      }, {
        text: 'brown',
        value: 1
      }, {
        text: 'green',
        value: 2
      }, {
        text: 'black',
        value: 3
      }]
    }

    this.character = new Composition()
    this.character.position.set(0, -HUD_MARGIN*2, 0)
    this.character.scale.set(2, 2, 2)

    this.scene.add(this.character)
    this.camera.lookAt(this.character.position)

    this.goUp(1500)
    this.turnInterval = this.infiniteTurnInterval(4000)

    this.buildHUDControls()
  }

  buildHUDControls () {
    this.bodySelection = new SelectBox(this.options.bodies, "BODY")
    this.bodySelection.position.set(0, - window.innerHeight / 2 + this.bodySelection.height + HUD_MARGIN, 0)
    this.bodySelection.addEventListener('change', this.onChangeProperty.bind(this, 'body'))
    this.hud.addInteractiveControl(this.bodySelection)

    this.hairSelection = new SelectBox(this.options.hairs, "HAIR")
    this.hairSelection.position.set(0, this.bodySelection.position.y + this.hairSelection.height + HUD_MARGIN, 0)
    this.hairSelection.addEventListener('change', this.onChangeProperty.bind(this, 'hair'))
    this.hud.addInteractiveControl(this.hairSelection)

    this.eyeSelection = new SelectBox(this.options.eyes, "EYES")
    this.eyeSelection.position.set(0, this.hairSelection.position.y + this.eyeSelection.height + HUD_MARGIN, 0)
    this.eyeSelection.addEventListener('change', this.onChangeProperty.bind(this, 'eye'))
    this.hud.addInteractiveControl(this.eyeSelection)

    this.classSelection = new SelectBox(this.options.classes, "CLASS")
    this.classSelection.position.set(0, this.eyeSelection.position.y + this.classSelection.height + HUD_MARGIN, 0)
    this.classSelection.addEventListener('change', this.onChangeProperty.bind(this, 'klass'))
    this.hud.addInteractiveControl(this.classSelection)
  }

  onChangeProperty (property, e) {
    this.character.setProperty(property, e.value)
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

