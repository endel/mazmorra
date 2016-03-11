import { Text2D, textAlign } from 'three-text2d'

import { MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT, Resources } from '../entities/character/Resources'

import Minibar from './Minibar'

export default class Character extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = ResourceManager.getHUDElement("character-body-0-hud-face")
    this.sprite.material.opacity = 0.85
    this.add(this.sprite)

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

    // life / mana / exp bar
    this.lifebar = new Minibar('red')
    this.lifebar.position.x = HUD_SCALE
    this.lifebar.position.y = - this.sprite.height
    this.add(this.lifebar)

    this.manabar = new Minibar('blue')
    this.manabar.position.x = HUD_SCALE
    this.manabar.position.y = this.lifebar.position.y - (2 * HUD_SCALE)
    this.add(this.manabar)

    this.expbar = new Minibar('gray')
    this.expbar.position.x = HUD_SCALE
    this.expbar.position.y = this.manabar.position.y - (2 * HUD_SCALE)
    this.add(this.expbar)
  }

  set composition (instance) {
    this.sprite.material.map = Resources.get(instance, 'hud-face')
    this.sprite.scale.normalizeWithHUDTexture(this.sprite.material.map)
  }

}


