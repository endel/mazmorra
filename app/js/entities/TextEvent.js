'use strict';

import { Text2D, textAlign } from 'three-text2d'

export default class TextEvent extends THREE.Object3D {

  constructor (data) {
    super()

    var offsetY = 2.5

    var color = COLOR_WHITE
    if (data.kind === 'warn' || data.kind === 'yellow') {
      color = COLOR_YELLOW
    } else if (data.kind === 'attention' || data.kind === 'red') {
      color = COLOR_RED
    } else if (data.kind === 'blue') {
      color = COLOR_BLUE
    }

    this.movingTime = 500
    this.waitTime = (typeof(data.ttl)==="undefined") ? 2000 : data.ttl
    this.fadeTime = 200

    this.userData = data

    this.text = new Text2D(data.text, { font: "50px primary", fillStyle: `#${ color.getHexString() }`, antialias: false })
    this.text.material.alphaTest = 0.5
    this.text.material.opacity = 0
    this.add(this.text)

    if (!data.small) {
      this.text.scale.set(0.03, 0.03, 0.03)
    } else {
      offsetY += 1
      this.text.scale.set(0.02, 0.02, 0.02)
    }

    tweener.
      add(this.text.material).
      to({ opacity: 1 }, this.fadeTime, Tweener.ease.cubicOut).
      wait(this.movingTime + this.waitTime).
      to({ opacity: 0 }, this.fadeTime, Tweener.ease.cubicOut).
      then(this.removeFromParent.bind(this))

    if (data.special) {
      offsetY += 1.5
      tweener.add(this.scale).
        to({ x: 1.5, y: 1.5 }, this.movingTime, Tweener.ease.cubicOut)
    }

    tweener.
      add(this.position).
      to({ y: this.position.y + offsetY }, this.movingTime, Tweener.ease.cubicOut)
  }

  removeFromParent () {
    if (this.parent)
      this.parent.remove(this)
  }

}


