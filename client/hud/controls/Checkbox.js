import Button from './Button'

export default class Checkbox extends Button {

  constructor (asset = 'color-picker') {
    super(asset)

    this.checked = false
    this.hoverScale = 1.05
    this.checkedScale = 1.25
  }

  onMouseOut () {
    this.mouseOutScale = (this.checked) ? this.checkedScale : 1
    super.onMouseOut()
  }

  onClick () {
    this.checked = true

    App.tweens.remove(this.scale)
    this.scale.set(1.5, 1.5, 1.5)

    App.tweens.add(this.scale).
      to({ x: this.checkedScale, y: this.checkedScale, z: this.checkedScale }, 200, Tweener.ease.cubicOut)
  }


}
