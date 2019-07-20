'use strict';

import { SpriteText2D, textAlign } from 'three-text2d'

const TEXT_MAX_LENGTH = 20;

export default class TextEvent extends THREE.Object3D {

  constructor (data) {
    super()

    let offsetY = 3.5

    let color = config.COLOR_WHITE

    if (data.kind === 'warn' || data.kind === 'yellow') {
      color = config.COLOR_YELLOW

    } else if (data.kind === 'attention' || data.kind === 'red') {
      color = config.COLOR_RED

    } else if (data.kind === 'blue') {
      color = config.COLOR_BLUE
    }

    // differentiate drinking potions from damage in battle.
    if ((color === config.COLOR_RED || color === config.COLOR_BLUE) && data.text[0] === "+") {
      offsetY += 1.5;
    }

    this.movingTime = 500
    this.waitTime = (typeof(data.ttl)==="undefined") ? 1500 : data.ttl
    this.fadeTime = 300

    this.userData = data

    const text = (data.text.length > TEXT_MAX_LENGTH) ? `${data.text.substr(0, TEXT_MAX_LENGTH) }...` : data.text;
    this.text = new SpriteText2D(text, {
      font: "40px primary",
      fillStyle: `#${color.getHexString()}`,
      antialias: false,
      align: textAlign.center,
      shadowColor: "#000000",
      shadowOffsetY: 2,
      shadowBlur: 0
    })
    // this.text.material.alphaTest = 0.5
    this.text.material.opacity = 0
    this.add(this.text)

    // this.position.y = data.z || 0;

    if (!data.small) {
      this.text.scale.set(0.03, 0.03, 0.03)
    } else {
      offsetY += 1
      this.text.scale.set(0.02, 0.02, 0.02)
    }

    window.text = this.text;

    App.tweens.
      add(this.text.material).
      to({ opacity: 1 }, this.fadeTime).
      wait(this.movingTime + this.waitTime).
      to({ opacity: 0 }, this.fadeTime).
      then(this.removeFromParent.bind(this))

    if (data.special) {
      offsetY += 1.5
      App.tweens.add(this.scale).
        to({ x: 1.5, y: 1.5 }, this.movingTime, Tweener.ease.cubicOut)
    }

    App.tweens.
      add(this.position).
      to({ y: this.position.y + offsetY }, this.movingTime, Tweener.ease.cubicOut)
  }

  removeFromParent () {
    if (this.parent) {
      this.parent.remove(this)
    }
  }

}
