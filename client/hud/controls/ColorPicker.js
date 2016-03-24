import Checkbox from './Checkbox'
import { SpriteText2D, textAlign } from 'three-text2d'

export default class ColorPicker extends THREE.Object3D {

  constructor (options, title = false) {
    super()
    var container = new THREE.Object3D()

    this.options = options
    this._selectedIndex = -1

    this.buttons = []

    for (let i=0; i<options.length; i++) {
      let button = new Checkbox('color-picker')
        , width = button.standby.material.map.frame.w *  config.HUD_SCALE

      button.colorize(options[i])
      button.position.x = i * (width +  config.HUD_MARGIN)
      button.addEventListener('click', this.onPick.bind(this, i))
      container.add(button)
      this.buttons.push(button)
    }

    if (title) {
      this.label = new SpriteText2D(title, { align: textAlign.center, font: config.DEFAULT_FONT, fillStyle: '#fff', antialias: false })
      this.label.position.y += this.label.height / 4
      this.label.sprite.renderOrder = 1
      this.add(this.label)
      container.position.y -= this.label.height
    }

    container.position.x = -this.width / 2
    this.add(container)

    this.interactive = this.buttons
  }

  set selectedIndex (index) {
    this.onPick(index)
  }
  get selectedIndex () { return this._selectedIndex }

  get height () {
    let height = this.buttons[0].standby.material.map.frame.h *  config.HUD_SCALE * 1.8
    if (this.label) {
      height += this.label.height
    }
    return height
  }

  get width () {
    let itemWidth = this.buttons[0].standby.material.map.frame.w *  config.HUD_SCALE
    return (this.options.length-1) * (itemWidth +  config.HUD_MARGIN)
  }

  onPick (pickedIndex) {
    this._selectedIndex = pickedIndex

    for (let i=0, l=this.buttons.length; i<l; i++) {
      if (i!==pickedIndex) {
        this.buttons[i].checked = false
        this.buttons[i].renderOrder = 0
        this.buttons[i].onMouseOut()
      } else {
        this.buttons[i].renderOrder = 1
        this.buttons[i].onClick()
      }
    }

    this.dispatchEvent({type: 'change', value: this.options[pickedIndex] })
  }

}
