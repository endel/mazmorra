import { Text2D, textAlign } from 'three-text2d'

export default class Character extends THREE.Object3D {

  constructor (gender = 'man') {
    super()

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("character-body-0-hud-face") }))
    this.sprite.material.opacity = 0.85
    this.add(this.sprite)

    this.sprite.scale.set(this.sprite.material.map.frame.w * HUD_SCALE, this.sprite.material.map.frame.h * HUD_SCALE, 1)

    this.width = (this.sprite.material.map.frame.w * HUD_SCALE)
    this.height = (this.sprite.material.map.frame.h * HUD_SCALE)

    this.levelText = new Text2D("1", {
      align: textAlign.left,
      font: DEFAULT_FONT,
      fillStyle: '#d0c01c',
      antialias: false
    })
    this.levelText.position.x = (HUD_MARGIN * 2) * HUD_SCALE
    this.levelText.position.y = HUD_MARGIN * HUD_SCALE
    this.add(this.levelText)
  }

  set gender (gender) {
    this.sprite.material.map = ResourceManager.get( 'character-'+gender+'-hud-face' )
  }

}


