import credentials from '../../web/login'

import { HeroSkinBuilder } from '../../elements/character/HeroSkinBuilder'
import Composition from '../../elements/character/Composition'

import Button from '../../elements/controls/Button'
import SelectBox from '../../elements/controls/SelectBox'
import ColorPicker from '../../elements/controls/ColorPicker'

import { i18n } from "../../lang";

export default class CharacterBuilder extends THREE.Object3D {

  constructor (hud, camera) {
    super()

    this.hud = hud
    this.camera = camera

    this.options = {
      classes: config.classes.map(id => i18n(id)),
      hairs: config.hairs.map(id => i18n(id))
    }

    this.character = new Composition()
    this.character.position.set(0, - config.HUD_MARGIN * 1.4, 0)
    // this.character.position.set(0, - config.HUD_MARGIN*3, 0)
    this.character.scale.set(1.8, 1.8, 1.8)

    this.add(this.character)
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
    this.hairColorPicker = new ColorPicker(HeroSkinBuilder.colors.hair)
    this.hairColorPicker.position.set(0, - window.innerHeight / 2 + this.hairColorPicker.height +  config.HUD_MARGIN, 0)
    this.hairColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'hair'))
    this.hud.add(this.hairColorPicker)

    this.hairSelection = new SelectBox(this.options.hairs, "STYLE")
    this.hairSelection.position.set(0, this.hairColorPicker.position.y + this.hairSelection.height +  config.HUD_MARGIN, 0)
    this.hairSelection.addEventListener('change', this.onChangeProperty.bind(this, 'hair'))
    this.hud.add(this.hairSelection)

    this.eyeColorPicker = new ColorPicker(HeroSkinBuilder.colors.eye, i18n('eyes'))
    this.eyeColorPicker.position.set(-this.eyeColorPicker.width, this.hairSelection.position.y + this.eyeColorPicker.height +  config.HUD_MARGIN, 0)
    this.eyeColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'eye'))
    this.hud.add(this.eyeColorPicker)

    this.bodyColorPicker = new ColorPicker(HeroSkinBuilder.colors.body, i18n('body'))
    this.bodyColorPicker.position.set(this.eyeColorPicker.width, this.hairSelection.position.y + this.bodyColorPicker.height +  config.HUD_MARGIN, 0)
    this.bodyColorPicker.addEventListener('change', this.onChangeColor.bind(this, 'body'))
    this.hud.add(this.bodyColorPicker)

    this.classSelection = new SelectBox(this.options.classes, "Class")
    this.classSelection.position.set(0, this.bodyColorPicker.position.y + this.classSelection.height +  config.HUD_MARGIN, 0)
    this.classSelection.addEventListener('change', this.onChangeClass.bind(this))
    this.hud.add(this.classSelection)

    // complete button
    this.completeButton = new Button('button-right')
    this.completeButton.position.set(window.innerWidth / 3, this.completeButton.height/2, 0)
    this.completeButton.addEventListener('click', this.onComplete.bind(this))
    this.hud.add(this.completeButton)
  }

  onComplete () {
    // loading!
    credentials.update(this.getHero()).then(() => {
      this.dispatchEvent( { type: "complete" } )
    })
  }

  onChangeProperty (property, e) {
    this.character.updateProperty(property, e.value)
    this.character.updateTexture()
    this.character.updateDirection()
  }

  onChangeColor (property, e) {
    this.character.updateColor(property, e.value)
    this.character.updateTexture()
  }

  onChangeClass (e) {
    this.character.updateClass(e.value)
    this.character.updateTexture()
  }

  goUp (duration) {
    this.tween = App.tweens.
      add(this.character.position).
      to({ y: 0.5 }, duration, Tweener.ease.cubicInOut).
      then(this.goDown.bind(this, duration))
  }

  goDown (duration) {
    this.tween = App.tweens.
      add(this.character.position).
      to({ y: -0.5 }, duration, Tweener.ease.cubicInOut).
      then(this.goUp.bind(this, duration))
  }

  infiniteTurnInterval (interval) {
    return App.clock.setInterval(() => this.turnCharacter(), interval)
  }

  turnCharacter () {
    var directions = ['left', 'top', 'right', 'bottom']
      , i = 0
      , timeout = App.clock.setInterval(() => {
          this.character.direction = directions[i]
          i++;
          if (i === 4) {
            timeout.clear()
          }
        }, 180)
  }

  destroy () {
    this.tween.then(null);
    this.tween = null;

    this.remove(this.character)
    this.character.destroy()

    this.hud.remove(this.hairColorPicker)
    this.hairColorPicker.destroy();

    this.hud.remove(this.hairSelection)
    this.hairSelection.destroy();

    this.hud.remove(this.eyeColorPicker)
    this.eyeColorPicker.destroy();

    this.hud.remove(this.bodyColorPicker)
    this.bodyColorPicker.destroy();

    this.hud.remove(this.classSelection)
    this.classSelection.destroy();

    this.hud.remove(this.completeButton)
    this.completeButton.destroy();

    this.turnInterval.clear()
    super.destroy();
  }

}
