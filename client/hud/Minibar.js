export default class Minibar extends THREE.Object3D {

  constructor (color = 'red') {
    super()

    this.colors = {
      red:    { bg: 0x740000, fg: 0xd00000 },
      blue:  { bg: 0x000c4c, fg: 0x1c80e4 },
      gray:  { bg: 0x282828, fg: 0xe0e0e0 },
      // yellow: { bg: 0x886408, fg: 0xfcf458 },
      // green:  { bg: 0x183400, fg: 0x7cac20 },
    }

    this.bar = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffffff }))
    this.add(this.bar)

    this.background = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffffff }))
    this.add(this.background)

    this.color = color

    this.height = 1 *  config.HUD_SCALE
    this.width = 10 *  config.HUD_SCALE
    this.scale.set(this.width, this.height, 1)
  }

  set color (color) {
    this.bar.material.color = new THREE.Color(this.colors[ color ].fg)
    this.background.material.color = new THREE.Color(this.colors[ color ].bg)
  }

  set progress (value) {
    this.bar.scale.x = value
    this.bar.position.x = value/2 - 0.5

    this.background.scale.x = 1 - value
    this.background.position.x = 0.5 + (value/2 - 0.5)
  }

  get progress () {
    return this.bar.scale.x
  }

}



