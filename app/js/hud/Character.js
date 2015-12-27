import Text2D from '../utils/Text2D'

export default class Character extends THREE.Object3D {

  constructor (gender = 'man') {
    super()

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("character-" + gender + "-hud-face") }))
    this.sprite.material.opacity = 0.85
    this.add(this.sprite)

    this.sprite.scale.set(this.sprite.material.map.image.width * HUD_SCALE, this.sprite.material.map.image.height * HUD_SCALE, 1)

    this.width = (this.sprite.material.map.image.width * HUD_SCALE) / 2
    this.height = (this.sprite.material.map.image.height * HUD_SCALE) / 2

    this.levelText = new Text2D("1", {
      font: "50px primary",
      fillStyle: '#d0c01c',
      antialias: false
    })
    this.levelText.position.x = this.levelText._canvas.width * 3 // FIXME!
    this.add(this.levelText)

    window.text = this.levelText

    // if (type == 'life') {
    //   window.lifebar = this
    //   setInterval(() => { }, 1000)
    // }
  }

}


