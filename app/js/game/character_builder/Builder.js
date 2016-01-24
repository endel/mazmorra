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
      classes: [{
        text: 'warrior',
        value: 0
      }, {
        text: 'archer',
        value: 2
      }, {
        text: 'mage',
        value: 1
      }],

      bodies: [{
        text: 'pale',
        value: 0
      }, {
        text: 'white',
        value: 1
      }, {
        text: 'brownish',
        value: 2
      }, {
        text: 'brown',
        value: 3
      }],

      hairs: [{
        text: "None",
        value: 0
      }, {
        text: "Barbudao",
        value: 1
      }, {
        text: "Coque",
        value: 2
      }, {
        text: "Curto",
        value: 3
      }, {
        text: "Ancient",
        value: 4
      }, {
        text: "Barbudo",
        value: 5
      }, {
        text: "Longo",
        value: 6
      }, {
        text: "Longo 2",
        value: 7
      }, {
        text: "Longuinho",
        value: 8
      }, {
        text: "Longo duplo",
        value: 9
      }, {
        text: "Badboy",
        value: 10
      }, {
        text: "Punk",
        value: 11
      }],

      hairColors: [{
        text: "Yellow",
        value: 0
      }, {
        text: "Brown 1",
        value: 1
      }, {
        text: "Brown 2",
        value: 2
      }, {
        text: "Gray",
        value: 3
      }, {
        text: "Redhead",
        value: 4
      }],

      eyeColors: [{
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
    this.character.position.set(0, -HUD_MARGIN*3, 0)
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
    this.bodySelection.addEventListener('change', this.onChangeColor.bind(this, 'body'))
    this.hud.addInteractiveControl(this.bodySelection)

    this.hairColorSelection = new SelectBox(this.options.hairColors, "HAIR COLOR")
    this.hairColorSelection.position.set(0, this.bodySelection.position.y + this.hairColorSelection.height + HUD_MARGIN, 0)
    this.hairColorSelection.addEventListener('change', this.onChangeColor.bind(this, 'hair'))
    this.hud.addInteractiveControl(this.hairColorSelection)

    this.hairSelection = new SelectBox(this.options.hairs, "HAIR")
    this.hairSelection.position.set(0, this.hairColorSelection.position.y + this.hairSelection.height + HUD_MARGIN, 0)
    this.hairSelection.addEventListener('change', this.onChangeProperty.bind(this, 'hair'))
    this.hud.addInteractiveControl(this.hairSelection)

    this.eyeSelection = new SelectBox(this.options.eyeColors, "EYES")
    this.eyeSelection.position.set(0, this.hairSelection.position.y + this.eyeSelection.height + HUD_MARGIN, 0)
    this.eyeSelection.addEventListener('change', this.onChangeColor.bind(this, 'eye'))
    this.hud.addInteractiveControl(this.eyeSelection)

    this.classSelection = new SelectBox(this.options.classes, "CLASS")
    this.classSelection.position.set(0, this.eyeSelection.position.y + this.classSelection.height + HUD_MARGIN, 0)
    this.classSelection.addEventListener('change', this.onChangeClass.bind(this))
    this.hud.addInteractiveControl(this.classSelection)
  }

  onChangeProperty (property, e) {
    this.character.updateProperty(property, e.value)
  }

  onChangeColor (property, e) {
    this.character.updateColor(property, e.value)
  }

  onChangeClass (e) {
    this.character.updateClass(e.value)
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
        }, 500)
  }

}

