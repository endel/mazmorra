import DangerousThing from '../behaviors/DangerousThing'

export default class LevelUpButton extends THREE.Object3D {

  constructor () {
    super()

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("hud-level-up") }))
    this.add(this.sprite)

    this.width = (this.sprite.material.map.frame.w *  config.HUD_SCALE) / 2
    this.height = (this.sprite.material.map.frame.h *  config.HUD_SCALE) / 2

    // this.sprite.addBehaviour(new DangerousThing(), 0.025, 1000)

    this.scale.set(this.sprite.material.map.frame.w *  config.HUD_SCALE, this.sprite.material.map.frame.h *  config.HUD_SCALE, 1)
  }

}


