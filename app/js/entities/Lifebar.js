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
    this.add(this.bar)

    this.background = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffffff }))
    this.add(this.background)

    this.color = 'green'
    this.position.y = 1

    this.scale.set(1, 0.195, 1)
    setInterval(() => { if (this.progress > 0) this.progress -= 0.01 }, 500)
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
  }

  get progress () {
    return this.bar.scale.x
  }

}


