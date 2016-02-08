import { Text2D, textAlign } from 'three-text2d'

import { MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT, Resources } from '../entities/character/Resources'

export default class Character extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("character-body-0-hud-face") }))
    this.sprite.material.opacity = 0.85
    this.add(this.sprite)

    this.sprite.scale.set(this.sprite.material.map.frame.w * HUD_SCALE, this.sprite.material.map.frame.h * HUD_SCALE, 1)

    this.width = (MAX_CHAR_WIDTH * HUD_SCALE)
    this.height = (MAX_CHAR_HEIGHT * HUD_SCALE)

    this.levelText = new Text2D("1", {
      align: textAlign.left,
      font: DEFAULT_FONT,
      fillStyle: '#d0c01c',
      antialias: false
    })
    this.levelText.position.x = (HUD_MARGIN * 2) * HUD_SCALE
    this.levelText.position.y = this.levelText.height / 2
    this.add(this.levelText)
  }

  set composition (instance) {
    this.sprite.material.map = Resources.get(instance, 'hud-face')
    this.sprite.scale.normalizeWithHUDTexture(this.sprite.material.map)
  }

}


