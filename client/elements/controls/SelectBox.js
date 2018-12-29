import Button from './Button'
import { SpriteText2D, textAlign } from 'three-text2d'

export default class SelectBox extends THREE.Object3D {

  constructor (options, placeholder = "[none]") {
    super()

    this.placeholder = placeholder
    this.options = options
    this._selectedIndex = -1

    this.labelBackground = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get('gui-label-background'),
      transparent: true
    }))
    this.labelBackground.renderOrder = 0
    this.labelBackground.width = this.labelBackground.material.map.frame.w *  config.HUD_SCALE
    this.labelBackground.scale.normalizeWithHUDTexture(this.labelBackground.material.map)

    this.leftButton = new Button('button-left')
    this.leftButton.position.x -= this.labelBackground.width / 2 + this.leftButton.width / 2
    this.leftButton.addEventListener('click', this.onLeft.bind(this))

    this.rightButton = new Button('button-right')
    this.rightButton.position.x += this.labelBackground.width / 2 + this.leftButton.width / 2
    this.rightButton.addEventListener('click', this.onRight.bind(this))

    this.label = new SpriteText2D(this.placeholder, { align: textAlign.center, font: config.DEFAULT_FONT, fillStyle: '#fff', antialias: false })
    this.label.position.y += this.label.height / 1.7
    this.label.sprite.renderOrder = 1

    this.add(this.leftButton)
    this.add(this.labelBackground)
    this.add(this.rightButton)
    this.add(this.label)

    this.interactive = [ this.leftButton, this.rightButton ]
  }

  set selectedIndex (index) {
    this._selectedIndex = index
    this.onChange()
  }
  get selectedIndex () { return this._selectedIndex }

  get height () {
    return this.labelBackground.material.map.frame.h *  config.HUD_SCALE
  }

  onLeft () {
    if (this._selectedIndex - 1 < 0) this._selectedIndex = this.options.length;
    this._selectedIndex = (this._selectedIndex-1) % this.options.length
    this.onChange()
  }

  onRight () {
    this._selectedIndex = (this._selectedIndex+1) % this.options.length
    this.onChange()
  }

  onChange () {
    let text, value;

    if (typeof(this.options[this._selectedIndex]) === "string") {
      text = this.options[this._selectedIndex]
      value = this._selectedIndex

    } else {
      text = this.options[this._selectedIndex].text
      value = this.options[this._selectedIndex].value
    }

    this.label.text = text;
    this.dispatchEvent({type: 'change', value: value })
  }

}
