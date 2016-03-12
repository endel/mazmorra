'use strict';

export default class Lifebar extends THREE.Object3D {

  constructor () {
    super()

    this.colors = {
      red:    { bg: 0x740000, fg: 0xfc6018 },
      yellow: { bg: 0x886408, fg: 0xfcf458 },
      green:  { bg: 0x183400, fg: 0x7cac20 }
    }

    this.bar = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffffff }))
    // depthWrite: false, depthTest: false
    // this.bar.renderOrder = 0
    this.add(this.bar)

    this.background = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffffff }))
    this.add(this.background)

    this.color = 'green'

    this.scale.set(2, 0.2, 1)
  }

  set color (color) {
    this.bar.material.color = new THREE.Color(this.colors[ color ].fg)
    this.background.material.color = new THREE.Color(this.colors[ color ].bg)
  }

  set progress (value) {
    if (value > 0.6) {
      this.color = 'green'
    } else if (value > 0.3) {
      this.color = 'yellow'
    } else {
      this.color = 'red'
    }

    this.bar.scale.x = value
    this.bar.position.x = value/2 - 0.5

    this.background.scale.x = 1 - value
    this.background.position.x = 0.5 + (value/2 - 0.5)
  }

  get progress () {
    return this.bar.scale.x
  }

}


