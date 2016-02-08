import EventEmitter from 'tiny-emitter'
import Keycode from 'keycode.js'

import credentials from '../../web/credentials'

// import Character from '../../entities/Character'
import { Resources } from '../../entities/character/Resources'
import Composition from '../../entities/character/Composition'

import Button from '../../hud/controls/Button'
import SelectBox from '../../hud/controls/SelectBox'
import ColorPicker from '../../hud/controls/ColorPicker'

export default class Builder extends EventEmitter {

  constructor (scene, hud, camera) {
    super()

    this.scene = scene
    this.hud = hud
    this.camera = camera

    this.options = {
      classes: ['warrior', 'mage', 'archer'],
      hairs: ["Barbudao", "Coque", "Curto", "Ancient", "Barbudo", "Longo", "Longo 2", "Longuinho", "Longo duplo", "Badboy", "Punk", "None"]
    }

    this.character = new Composition()
    this.character.position.set(0, -HUD_MARGIN*3, 0)
    this.character.scale.set(2, 2, 2)

    this.scene.add(this.character)
    this.camera.lookAt(this.character.position)

    this.goUp(1500)
    this.turnInterval = this.infiniteTurnInterval(3100)

    this.buildHUDControls()
  }

  setHero (hero) {
    this.hairColorPicker.selectedIndex = hero.hairColor || 0
    this.eyeColorPicker.selectedIndex = hero.eye || 0
    this.bodyColorPicker.selectedIndex = hero.body || 0
    this.hairSelection.selectedIndex = hero.hair || 0
    this.classSelection.selectedIndex = hero.klass || 0
  }

  getHero () {
    return {
      klass: this.classSelection.selectedIndex,
      hair: this.hairSelection.selectedIndex,
      hairColor: this.hairColorPicker.selectedIndex,
      eye: this.eyeColorPicker.selectedIndex,
      body: this.bodyColorPicker.selectedIndex
    }
  }

  buildHUDControls () {
    this.hairColorPicker = new ColorPicker(Resources.colors.hair)
    this.hairColorPicker.position.set(0, - window.innerHeight / 2 + this.hairColorPicker.height + HUD_MARGIN, 0)
    this.hairColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'hair'))
    this.hud.addInteractiveControl(this.hairColorPicker)

    this.hairSelection = new SelectBox(this.options.hairs, "HAIR")
    this.hairSelection.position.set(0, this.hairColorPicker.position.y + this.hairSelection.height + HUD_MARGIN, 0)
    this.hairSelection.addEventListener('change', this.onChangeProperty.bind(this, 'hair'))
    this.hud.addInteractiveControl(this.hairSelection)

    this.eyeColorPicker = new ColorPicker(Resources.colors.eye, "Eyes")
    this.eyeColorPicker.position.set(-this.eyeColorPicker.width, this.hairSelection.position.y + this.eyeColorPicker.height + HUD_MARGIN, 0)
    this.eyeColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'eye'))
    this.hud.addInteractiveControl(this.eyeColorPicker)

    this.bodyColorPicker = new ColorPicker(Resources.colors.body, "Body")
    this.bodyColorPicker.position.set(this.eyeColorPicker.width, this.hairSelection.position.y + this.bodyColorPicker.height + HUD_MARGIN, 0)
    this.bodyColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'body'))
    this.hud.addInteractiveControl(this.bodyColorPicker)

    this.classSelection = new SelectBox(this.options.classes, "CLASS")
    this.classSelection.position.set(0, this.bodyColorPicker.position.y + this.classSelection.height + HUD_MARGIN, 0)
    this.classSelection.addEventListener('change', this.onChangeClass.bind(this))
    this.hud.addInteractiveControl(this.classSelection)

    // complete button
    this.completeButton = new Button('button-right')
    this.completeButton.position.set(window.innerWidth / 3, window.innerHeight / 3, 0)
    this.completeButton.addEventListener('click', this.onComplete.bind(this))
    this.hud.addInteractiveControl(this.completeButton)
  }

  onComplete () {
    // loading!
    credentials.update(this.getHero()).then(() => {
      this.destroy()
      this.emit('complete')
    })
  }

  onChangeProperty (property, e) {
    console.log("onchange:", property, e)
    this.character.updateProperty(property, e.value)
    this.character.updateTexture()
    this.character.updateDirection()
  }

  onChangeColor (property, e) {
    this.character.updateColor(property, e.value)
    this.character.updateTexture()
  }

  onChangeClass (e) {
    console.log("onchange:", 'class', e)
    this.character.updateClass(e.value)
    this.character.updateTexture()
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

  destroy () {
    this.scene.remove(this.character)
    this.character.destroy()

    this.hud.remove(this.hairColorPicker)
    this.hud.remove(this.hairSelection)
    this.hud.remove(this.eyeColorPicker)
    this.hud.remove(this.bodyColorPicker)
    this.hud.remove(this.classSelection)
    this.hud.remove(this.completeButton)

    this.hud.clearInteractiveControls()
    this.turnInterval.clear()
  }

}

