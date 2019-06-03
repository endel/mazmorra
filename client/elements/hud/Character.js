import { MeshText2D, textAlign } from 'three-text2d'

import { MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT, Resources } from '../character/Resources'

import Minibar from './Minibar'

export default class Character extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = ResourceManager.getHUDElement("character-body-0-hud-face")
    this.sprite.material.opacity = 0.85
    this.add(this.sprite)

    this.width = (MAX_CHAR_WIDTH *  config.HUD_SCALE)
    this.height = (MAX_CHAR_HEIGHT *  config.HUD_SCALE)

    this.levelText = new MeshText2D(" ", {
      align: textAlign.left,
      font: config.DEFAULT_FONT,
      fillStyle: '#d0c01c',
      antialias: false
    })
    this.levelText.position.x = ( config.HUD_MARGIN * 2) *  config.HUD_SCALE
    this.levelText.position.y = this.levelText.height
    this.add(this.levelText)

    // // life / mana / exp bar
    // this.lifebar = new Minibar('red')
    // this.lifebar.position.x =  config.HUD_SCALE
    // this.lifebar.position.y = - this.sprite.height
    // this.add(this.lifebar)
    //
    // this.manabar = new Minibar('blue')
    // this.manabar.position.x =  config.HUD_SCALE
    // this.manabar.position.y = this.lifebar.position.y - (2 *  config.HUD_SCALE)
    // this.add(this.manabar)
    //
    // this.expbar = new Minibar('gray')
    // this.expbar.position.x =  config.HUD_SCALE
    // this.expbar.position.y = this.manabar.position.y - (2 *  config.HUD_SCALE)
    // this.add(this.expbar)
  }

  set composition (instance) {
    this.sprite.material.map = Resources.get(instance, 'hud-face')
    this.sprite.scale.normalizeWithHUDTexture(this.sprite.material.map)
  }

}
