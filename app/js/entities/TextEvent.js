'use strict';

import { Text2D, textAlign } from 'three-text2d'

export default class TextEvent extends THREE.Object3D {

  constructor (data) {
    super()

    var color = COLOR_GREEN
    if (data.kind === 'warn') {
      color = COLOR_YELLOW
    } else if (data.kind === 'attention') {
      color = COLOR_RED
    }

    this.movingTime = 500
    this.waitTime = 100
    this.fadeTime = 200

    this.userData = data

    this.text = new Text2D(data.text, { font: "50px primary", fillStyle: `#${ color.getHexString() }`, antialias: false })
    this.text.scale.set(0.03, 0.03, 0.03)
    this.text.material.opacity = 0
    this.text.material.alphaTest = 0.5
    this.add(this.text)

    var offsetY = 2

    if (data.special) {
      offsetY += 1.5
      tweener.add(this.scale).
        to({ x: 1.5, y: 1.5 }, this.movingTime, Tweener.ease.cubicOut)
    }

    tweener.
      add(this.text.material).
      to({ opacity: 1 }, this.fadeTime, Tweener.ease.cubicOut)

    tweener.
      add(this.position).
      to({ y: this.position.y + offsetY }, this.movingTime, Tweener.ease.cubicOut).
      wait(this.waitTime).
      add(this.text.material).
      to({ opacity: 0 }, this.fadeTime, Tweener.ease.cubicOut).
      then(this.removeFromParent.bind(this))
  }

  removeFromParent () {
    this.parent.remove(this)
  }

}


